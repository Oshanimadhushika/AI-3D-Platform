import os
import httpx
import asyncio
import json
from datetime import datetime
from typing import Optional
from app.services.base import Base3DGenerator
from app.schemas.generation import GenerationResult, TextTo3DRequest, ImageTo3DRequest
from app.utils.prompt_helper import build_prompt

class Tripo3DGenerator(Base3DGenerator):
    BASE_URL = "https://api.tripo3d.ai/v2/openapi/task"
    
    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }

    async def generate_from_text(self, request: TextTo3DRequest) -> GenerationResult:
        # 1. Build the optimized prompt
        final_prompt = build_prompt(
            category=request.category, 
            user_prompt=request.prompt, 
            options=request.options
        )
        
        print(f"\n[AI-SERVICE] Processing Text-to-3D Request")
        print(f"  > Input Category: {request.category}")
        print(f"  > Final Optimized Prompt: {final_prompt}")

        payload = {
            "type": "text_to_model",
            "prompt": final_prompt
        }
        return await self._create_and_poll_task(payload)

    async def generate_from_image(self, request: ImageTo3DRequest) -> GenerationResult:
        print(f"\n[AI-SERVICE] Processing Image-to-3D Request")
        print(f"  > Image URL: {request.image_url}")

        payload = {
            "type": "image_to_model",
            "file": {
                "type": str(request.image_url).split('.')[-1].split('?')[0] if '.' in str(request.image_url) else "png",
                "url": str(request.image_url)
            }
        }
        return await self._create_and_poll_task(payload)

    async def _create_and_poll_task(self, payload: dict) -> GenerationResult:
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                # 1. Create Task
                print(f"  > Sending request to Tripo API...")
                print(f"  > BASE_URL: {self.BASE_URL}")
                
                response = await client.post(self.BASE_URL, headers=self.headers, json=payload)
                
                if response.status_code != 200:
                    error_detail = response.text
                    print(f"  !! Tripo API Error: {response.status_code} - {error_detail}")
                    raise Exception(f"Tripo API Error ({response.status_code}): {error_detail}")

                task_data = response.json()
                print(f"  > Task Created Successfully")
            
            task_id = task_data.get("data", {}).get("task_id")
            if not task_id:
                raise Exception(f"Failed to get task_id from Tripo response: {task_data}")

            # 2. Poll Task (Max 5 minutes for higher complexity)
            start_time = datetime.now()
            poll_interval = 3
            timeout = 300
            total_waited = 0

            print(f"  > Starting polling for Task ID: {task_id}")

            while total_waited < timeout:
                await asyncio.sleep(poll_interval)
                total_waited += poll_interval
                
                status_response = await client.get(f"{self.BASE_URL}/{task_id}", headers=self.headers)
                if status_response.status_code != 200:
                    continue # Try again
                
                status_data = status_response.json()
                status = status_data.get("data", {}).get("status")
                
                print(f"  > [{total_waited}s] Status: {status}")
                
                if status == "success":
                    result = status_data["data"].get("result", {})
                    print(f"  > SUCCESS! Extracting URLs...")
                    
                    # Extract URLs from tripo response structure
                    # Tripo returns a primary model (usually GLB) and often obj/stl in textured_mesh or similar
                    model_url = result.get("model", "")
                    obj_url = ""
                    stl_url = ""
                    
                    # Search for other formats in nested results if available
                    if "textured_mesh" in result:
                        obj_url = result["textured_mesh"].get("obj", "")
                        stl_url = result["textured_mesh"].get("stl", "")

                    return GenerationResult(
                        task_id=task_id,
                        status="finished",
                        glb_url=model_url,
                        obj_url=obj_url,
                        stl_url=stl_url,
                        created_at=start_time
                    )
                elif status == "failed":
                    error_msg = status_data["data"].get("message", "Unknown error")
                    print(f"  !! Task Failed: {error_msg}")
                    raise Exception(f"Tripo AI generation failed: {error_msg}")
            
            print(f"  !! Timed out after {timeout} seconds")
            raise Exception("Tripo AI generation timed out.")
        except Exception as e:
            print(f"  [CRITICAL ERROR] {str(e)}")
            raise e
