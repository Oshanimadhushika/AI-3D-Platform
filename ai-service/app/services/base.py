from abc import ABC, abstractmethod
from app.schemas.generation import GenerationResult, TextTo3DRequest, ImageTo3DRequest

class Base3DGenerator(ABC):
    @abstractmethod
    async def generate_from_text(self, request: TextTo3DRequest) -> GenerationResult:
        pass

    @abstractmethod
    async def generate_from_image(self, request: ImageTo3DRequest) -> GenerationResult:
        pass
