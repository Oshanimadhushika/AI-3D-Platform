from pydantic import BaseModel, HttpUrl
from typing import Optional, Dict, Any
from datetime import datetime

class TextTo3DRequest(BaseModel):
    prompt: Optional[str] = None
    category: Optional[str] = "Uncategorized"
    options: Optional[Dict[str, Any]] = {}

class ImageTo3DRequest(BaseModel):
    image_url: Optional[HttpUrl] = None
    image_base64: Optional[str] = None
    category: Optional[str] = "ImageDriven"
    options: Optional[Dict[str, Any]] = {}

class GenerationResult(BaseModel):
    task_id: str
    status: str
    glb_url: str
    obj_url: str
    stl_url: str
    created_at: datetime
