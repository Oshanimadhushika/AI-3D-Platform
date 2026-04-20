import uuid
from datetime import datetime
from app.services.base import Base3DGenerator
from app.schemas.generation import GenerationResult, TextTo3DRequest, ImageTo3DRequest

class Mock3DGenerator(Base3DGenerator):
    async def generate_from_text(self, request: TextTo3DRequest) -> GenerationResult:
        # Simulate async delay if needed
        return GenerationResult(
            task_id=str(uuid.uuid4()),
            status="finished",
            glb_url="https://example.com/mock-furniture.glb",
            obj_url="https://example.com/mock-furniture.obj",
            stl_url="https://example.com/mock-furniture.stl",
            created_at=datetime.now()
        )

    async def generate_from_image(self, request: ImageTo3DRequest) -> GenerationResult:
        return GenerationResult(
            task_id=str(uuid.uuid4()),
            status="finished",
            glb_url="https://example.com/mock-image-model.glb",
            obj_url="https://example.com/mock-image-model.obj",
            stl_url="https://example.com/mock-image-model.stl",
            created_at=datetime.now()
        )
