from fastapi import APIRouter, Depends
from app.schemas.generation import TextTo3DRequest, ImageTo3DRequest, GenerationResult
from app.services.mock_service import Mock3DGenerator

router = APIRouter()

# Dependency for the generator service
# This makes it easy to swap Mock3DGenerator for a real API (Meshy/Tripo) later
def get_generator():
    return Mock3DGenerator()

@router.post("/text-to-3d", response_model=GenerationResult)
async def create_text_to_3d(
    request: TextTo3DRequest, 
    generator: Mock3DGenerator = Depends(get_generator)
):
    """
    Generate a 3D model from a text prompt.
    """
    return await generator.generate_from_text(request)

@router.post("/image-to-3d", response_model=GenerationResult)
async def create_image_to_3d(
    request: ImageTo3DRequest, 
    generator: Mock3DGenerator = Depends(get_generator)
):
    """
    Generate a 3D model from an uploaded image (URL or Base64).
    """
    return await generator.generate_from_image(request)
