import os
import httpx
import asyncio
import uuid
from datetime import datetime
from typing import Optional
from app.services.base import Base3DGenerator
from app.schemas.generation import GenerationResult, TextTo3DRequest, ImageTo3DRequest

class Tripo3DGenerator(Base3DGenerator):
    BASE_URL = "https://api.tripo3d.ai/v2/openapi/task"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    async def generate_from_text(self, request: TextTo3DRequest) -> GenerationResult:
        payload = {
            "type": "text_to_model",
            "prompt": request.prompt
        }
        return await self._create_and_poll_task(payload)

    async def generate_from_image(self, request: ImageTo3DRequest) -> GenerationResult:
        payload = {
            "type": "image_to_model",
            "file": {
                "type": "jpg", # Defaulting but should ideally detect
                "url": request.image_url
            }
        }
        return await self._create_and_poll_task(payload)

    async def _create_and_poll_task(self, payload: dict) -> GenerationResult:
        async with httpx.AsyncClient(timeout=30.0) as client:
            # 1. Create Task
            response = await client.post(self.BASE_URL, headers=self.headers, json=payload)
            response.raise_for_status()
            task_data = response.json()
            task_id = task_data["data"]["task_id"]

            # 2. Poll Task (Max 3 minutes)
            start_time = datetime.now()
            poll_interval = 2
            max_interval = 10
            total_waited = 0
            timeout = 180

            while total_waited < timeout:
                await asyncio.sleep(poll_interval)
                total_waited += poll_interval
                
                # Gradually increase polling interval up to max_interval
                if poll_interval < max_interval:
                    poll_interval = min(poll_interval + 1, max_interval)

                status_response = await client.get(f"{self.BASE_URL}/{task_id}", headers=self.headers)
                status_response.raise_for_status()
                status_data = status_response.json()
                
                status = status_data["data"]["status"]
                
                if status == "success":
                    result = status_data["data"]["result"]
                    # Tripo v2 usually returns model URLs in an array or specific fields
                    # We map them to our schema
                    return GenerationResult(
                        task_id=task_id,
                        status="finished",
                        glb_url=result.get("model", ""),
                        obj_url=result.get("obj", ""),
                        stl_url=result.get("stl", ""),
                        created_at=start_time
                    )
                elif status == "failed":
                    raise Exception(f"Tripo AI generation failed: {status_data['data'].get('message', 'Unknown error')}")
                
                attempts += 1

            raise Exception("Tripo AI generation timed out after 3 minutes.")
