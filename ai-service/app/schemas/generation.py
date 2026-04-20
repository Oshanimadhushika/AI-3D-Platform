from pydantic import BaseModel, HttpUrl
from typing import Optional
from datetime import datetime

class TextTo3DRequest(BaseModel):
    prompt: str
    category: Optional[str] = "Uncategorized"

class ImageTo3DRequest(BaseModel):
    image_url: Optional[HttpUrl] = None
    image_base64: Optional[str] = None
    category: Optional[str] = "ImageDriven"

class GenerationResult(BaseModel):
    task_id: str
    status: str
    glb_url: str
    obj_url: str
    stl_url: str
    created_at: datetime
