
def enrich_prompt(prompt: str) -> str:
    """
    Automatically detects the category (jewelry, clothing, furniture)
    and enriches the prompt with high-quality keywords for the AI generator.
    """
    lower_prompt = prompt.lower()
    
    # Jewelry Detection & Enrichment
    jewelry_keywords = ["ring", "necklace", "bracelet", "earring", "jewelry", "pendant", "diamond", "gold", "silver"]
    if any(keyword in lower_prompt for keyword in jewelry_keywords):
        return f"High quality 3D model of {prompt}, realistic materials, studio lighting, product render, clean background, 8k textures, high polish"
    
    # Clothing Detection & Enrichment
    clothing_keywords = ["shirt", "t-shirt", "pants", "dress", "jacket", "clothing", "apparel", "fabric", "wear"]
    if any(keyword in lower_prompt for keyword in clothing_keywords):
        return f"3D model of {prompt}, realistic fabric, folds, high detail, fashion product render, soft studio lighting"
    
    # Default Enrichment
    return f"Professional 3D model of {prompt}, realistic, high detail, studio lighting, clean background"
