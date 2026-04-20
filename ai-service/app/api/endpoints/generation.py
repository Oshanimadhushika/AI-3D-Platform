import os
from fastapi import APIRouter, Depends
from app.schemas.generation import TextTo3DRequest, ImageTo3DRequest, GenerationResult
from app.services.mock_service import Mock3DGenerator
from app.services.tripo_service import Tripo3DGenerator
from app.services.base import Base3DGenerator

router = APIRouter()

# Dependency for the generator service
def get_generator() -> Base3DGenerator:
    # If TRIPO_API_KEY is present, use the real service
    api_key = os.getenv("TRIPO_API_KEY")
    if api_key:
        return Tripo3DGenerator(api_key=api_key)
    return Mock3DGenerator()

@router.post("/text-to-3d", response_model=GenerationResult)
async def create_text_to_3d(
    request: TextTo3DRequest, 
    generator: Base3DGenerator = Depends(get_generator)
):
    """
    Generate a 3D model from a text prompt.
    """
    return await generator.generate_from_text(request)

@router.post("/image-to-3d", response_model=GenerationResult)
async def create_image_to_3d(
    request: ImageTo3DRequest, 
    generator: Base3DGenerator = Depends(get_generator)
):
    """
    Generate a 3D model from an uploaded image (URL or Base64).
    """
    return await generator.generate_from_image(request)
