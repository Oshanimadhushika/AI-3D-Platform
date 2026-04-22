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
        print(f"  > Prompt: {request.prompt}")

        payload = {
            "type": "image_to_model",
            "file": {
                "type": str(request.image_url).split('.')[-1].split('?')[0] if '.' in str(request.image_url) else "png",
                "url": str(request.image_url)
            }
        }
        
        if request.prompt:
            payload["prompt"] = request.prompt
            
        return await self._create_and_poll_task(payload)

    async def _create_and_poll_task(self, payload: dict) -> GenerationResult:
        try:
            # Use a single long-lived client for both task creation AND polling
            # Timeout=30s per request, but the client itself stays open for the full 5 min polling window
            async with httpx.AsyncClient(timeout=httpx.Timeout(30.0, connect=10.0)) as client:
                # 1. Create Task
                print(f"  > Sending request to Tripo API...")
                print(f"  > BASE_URL: {self.BASE_URL}")

                response = await client.post(self.BASE_URL, headers=self.headers, json=payload)

                if response.status_code != 200:
                    error_detail = response.text
                    print(f"  !! Tripo API Error: {response.status_code} - {error_detail}")
                    try:
                        error_body = response.json()
                        error_code = error_body.get("code", response.status_code)
                        error_msg = error_body.get("message", error_detail)
                        if error_code in (4011, 402) or "balance" in str(error_msg).lower() or "credit" in str(error_msg).lower():
                            raise Exception("Insufficient Tripo3D API credits. Please top up your API Wallet at https://platform.tripo3d.ai/billing")
                        raise Exception(f"Tripo API Error (code={error_code}): {error_msg}")
                    except Exception as parse_err:
                        if "Insufficient" in str(parse_err) or "Tripo API Error" in str(parse_err):
                            raise
                    raise Exception(f"Tripo API Error ({response.status_code}): {error_detail}")

                task_data = response.json()
                print(f"  > Task Created: {task_data}")

                task_id = task_data.get("data", {}).get("task_id")
                if not task_id:
                    raise Exception(f"Failed to get task_id from Tripo response: {task_data}")

                print(f"  > Task ID: {task_id}  — Starting polling...")

                # 2. Poll Task inside the SAME client context (client is NOT closed yet)
                start_time = datetime.now()
                poll_interval = 3
                timeout = 300
                total_waited = 0

                while total_waited < timeout:
                    await asyncio.sleep(poll_interval)
                    total_waited += poll_interval

                    try:
                        status_response = await client.get(
                            f"{self.BASE_URL}/{task_id}", headers=self.headers
                        )
                    except httpx.ReadTimeout:
                        print(f"  > [{total_waited}s] Poll timed out, retrying...")
                        continue

                    if status_response.status_code != 200:
                        print(f"  > [{total_waited}s] Poll returned {status_response.status_code}, retrying...")
                        continue

                    status_data = status_response.json()
                    status = status_data.get("data", {}).get("status")

                    print(f"  > [{total_waited}s] Status: {status}")

                    if status == "success":
                        result = status_data["data"].get("result", {})
                        print(f"  > SUCCESS! Result keys: {list(result.keys())}")
                        print(f"  > Full Result Object: {json.dumps(result, indent=2)}")

                        # Tripo returns model URL differently based on task type
                        # Usually it's in 'model' (string or dict)
                        model_url = ""
                        raw_model = result.get("model")
                        if isinstance(raw_model, str):
                            model_url = raw_model
                        elif isinstance(raw_model, dict):
                            model_url = raw_model.get("url", "")
                        
                        # Fallback: Search for any .glb URL in the result if 'model' failed
                        if not model_url:
                            print("  > 'model' field empty, searching for fallbacks...")
                            if "pbr_model" in result:
                                model_url = result["pbr_model"] if isinstance(result["pbr_model"], str) else result["pbr_model"].get("url", "")
                        
                        obj_url = ""
                        stl_url = ""
                        
                        # Extract other formats
                        if "textured_mesh" in result:
                            tm = result["textured_mesh"]
                            obj_url = tm.get("url", tm.get("obj", ""))
                        if "pbr_textured_mesh" in result:
                            ptm = result["pbr_textured_mesh"]
                            if not obj_url:
                                obj_url = ptm.get("url", ptm.get("obj", ""))

                        print(f"  > Final URLs - GLB: {model_url[:50]}..., OBJ: {obj_url[:50]}...")

                        return GenerationResult(
                            task_id=task_id,
                            status="finished",
                            glb_url=model_url or "",
                            obj_url=obj_url or "",
                            stl_url=stl_url or "",
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
