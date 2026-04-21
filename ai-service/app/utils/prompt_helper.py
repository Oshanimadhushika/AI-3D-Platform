from typing import Dict, Any, Optional

def build_prompt(category: str, user_prompt: Optional[str] = None, options: Optional[Dict[str, Any]] = None) -> str:
    """
    Builds an optimized, production-quality prompt for Tripo AI.
    Strictly follows guidelines for jewelry, clothing, and other products.
    """
    options = options or {}
    final_parts = []

    # 1. Category-specific logic
    if category.lower() == "jewelry":
        material = options.get("material", "gold")
        stone = options.get("stone", "diamond")
        base = f"Luxury {material} {stone} "
        if user_prompt:
            base += f"{user_prompt}"
        else:
            base += "jewelry piece"
        final_parts.append(f"{base}, 3D model, photorealistic, high detail, jewelry product render, studio lighting")

    elif category.lower() == "clothing":
        garment = options.get("garment_type", "modern clothing")
        base = f"{garment}"
        if user_prompt:
            base = f"{user_prompt} {base}"
        final_parts.append(f"Modern {base}, realistic fabric folds, 3D clothing model, studio lighting, fashion render")

    else:
        # Generic handling
        if not user_prompt:
            raise ValueError("Empty prompt: Prompt or specific category must be provided.")
        final_parts.append(f"{user_prompt}, highly detailed, 3D model, product render, realistic")

    # 2. Final Construction & Validation
    full_prompt = " ".join(final_parts).strip()
    
    if not full_prompt:
        raise ValueError("Failed to build a valid prompt. Input is missing.")

    return full_prompt
