from typing import Dict, Any, Optional

# ─── Jewellery Category Descriptor Map ────────────────────────────────────────
_JEWELRY_CATEGORY_DESCRIPTORS: Dict[str, str] = {
    "ring":     "3D ring, finger jewelry",
    "necklace": "3D necklace, pendant jewelry",
    "bracelet": "3D bracelet, wrist jewelry",
    "earring":  "3D earring, ear jewelry",
}

# ─── Material Descriptor Map ─────────────────────────────────────────────────
_MATERIAL_DESCRIPTORS: Dict[str, str] = {
    "gold":       "18k yellow gold",
    "white_gold": "18k white gold",
    "silver":     "925 sterling silver",
    "rose_gold":  "18k rose gold",
    "platinum":   "platinum 950",
}

# ─── Stone Descriptor Map ─────────────────────────────────────────────────────
_STONE_DESCRIPTORS: Dict[str, str] = {
    "diamond":  "round brilliant diamond",
    "emerald":  "green emerald gemstone",
    "ruby":     "red ruby gemstone",
    "sapphire": "blue sapphire gemstone",
    "no_stone": "",  # No stone — plain metal band
}

# ─── Garment Descriptor Map ───────────────────────────────────────────────────
_GARMENT_DESCRIPTORS: Dict[str, str] = {
    "t-shirt":  "t-shirt, crew neck, short sleeves",
    "hoodie":   "hoodie, drawstring hood, front pocket",
    "jacket":   "jacket, outerwear",
    "dress":    "dress, full-length garment",
    "pants":    "pants, trousers",
    "sneakers": "sneakers, athletic footwear",
    "boots":    "boots, ankle boots",
    "hat":      "hat, headwear",
    "backpack": "backpack, bag",
}


def build_prompt(
    category: str,
    user_prompt: Optional[str] = None,
    options: Optional[Dict[str, Any]] = None,
) -> str:
    """
    Builds a precise, Tripo-AI-optimised prompt for 3D model generation.

    Strategy:
    - The USER'S description is always THE ANCHOR — it is never overridden.
    - Structural keywords (material, garment type) are appended as *context*,
      only when they add information the user did NOT already mention.
    - Technical Tripo keywords are appended last to guide rendering quality.
    """
    options = options or {}
    cat = category.lower().strip()
    user_text = (user_prompt or "").strip()

    # ── Jewellery ─────────────────────────────────────────────────────────────
    if cat == "jewelry":
        # 1. Start with the user's own description (this is the most important part)
        parts: list[str] = []

        if user_text:
            parts.append(user_text)

        # 2. Append jewellery category type only if user didn't already say it
        jewelry_cat = options.get("category", "ring").lower()
        cat_descriptor = _JEWELRY_CATEGORY_DESCRIPTORS.get(jewelry_cat, jewelry_cat)
        if cat_descriptor and not _text_contains_any(user_text, [jewelry_cat, "ring", "necklace", "bracelet", "earring"]):
            parts.append(cat_descriptor)
        elif not user_text:
            parts.append(cat_descriptor or "jewelry piece")

        # 3. Material — only if not mentioned by user
        raw_material = options.get("material", "").lower().replace("_", " ")
        material_str = _MATERIAL_DESCRIPTORS.get(
            options.get("material", "").lower(), raw_material
        )
        if material_str and not _text_contains_any(user_text, [raw_material, material_str, "gold", "silver", "platinum", "metal"]):
            parts.append(f"{material_str} metal")

        # 4. Stone — only if not "no_stone" and not mentioned by user
        raw_stone = options.get("stone", "").lower()
        stone_str = _STONE_DESCRIPTORS.get(raw_stone, "")
        if stone_str and not _text_contains_any(user_text, [raw_stone, "diamond", "emerald", "ruby", "sapphire", "gem", "stone", "crystal"]):
            parts.append(f"set with {stone_str}")

        # 5. Dimension hints (optional, humanised)
        dim_hints = _build_dimension_hints(options, jewelry_cat)
        if dim_hints:
            parts.append(dim_hints)

        # 6. Tripo rendering quality anchors
        parts += [
            "isolated object on white background",
            "photorealistic 3D render",
            "ultra-high detail surface",
            "professional jewelry product photography",
            "studio lighting",
            "8K texture",
            "no background scene",
        ]

        return ", ".join(parts)

    # ── Clothing / Fashion ────────────────────────────────────────────────────
    elif cat == "clothing":
        parts = []

        # 1. User description is the anchor
        if user_text:
            parts.append(user_text)

        # 2. Garment type — only appended as clarification if not already in text
        garment_raw = options.get("garment_type", "").lower().replace("-", " ").replace("_", " ")
        garment_descriptor = _GARMENT_DESCRIPTORS.get(
            options.get("garment_type", "").lower(), garment_raw
        )
        if garment_descriptor and not _text_contains_any(
            user_text,
            [garment_raw] + garment_descriptor.split(", ")
        ):
            parts.append(garment_descriptor)
        elif not user_text:
            parts.append(garment_descriptor or "garment")

        # 3. Tripo rendering quality anchors for clothing
        parts += [
            "isolated clothing item displayed flat or on invisible mannequin",
            "no human body, no face",
            "photorealistic 3D render",
            "realistic fabric texture and folds",
            "studio lighting",
            "white background",
            "fashion product photography",
            "8K texture detail",
            "no background scene",
        ]

        return ", ".join(parts)

    # ── Generic Fallback ──────────────────────────────────────────────────────
    else:
        if not user_text:
            raise ValueError(
                "Prompt cannot be empty. Please describe what you want to generate."
            )
        return (
            f"{user_text}, "
            "isolated object on white background, "
            "photorealistic 3D model, "
            "ultra-high detail, "
            "professional product render, "
            "studio lighting, "
            "no background scene"
        )


# ─── Helpers ──────────────────────────────────────────────────────────────────

def _text_contains_any(text: str, keywords: list[str]) -> bool:
    """Return True if any keyword appears (case-insensitive) in text."""
    text_lower = text.lower()
    return any(kw and kw in text_lower for kw in keywords)


def _build_dimension_hints(options: Dict[str, Any], jewelry_cat: str) -> str:
    """Build a human-readable dimension string for jewellery prompts."""
    hints = []
    if jewelry_cat == "ring":
        if options.get("band_width"):
            hints.append(f"{options['band_width']}mm band width")
    elif jewelry_cat == "necklace":
        if options.get("chain_length"):
            hints.append(f"{options['chain_length']}cm chain")
        if options.get("pendant_size"):
            hints.append(f"{options['pendant_size']}mm pendant")
    elif jewelry_cat == "bracelet":
        if options.get("bracelet_width"):
            hints.append(f"{options['bracelet_width']}mm wide bracelet")
    elif jewelry_cat == "earring":
        if options.get("drop_height"):
            hints.append(f"{options['drop_height']}mm drop length")
    return ", ".join(hints)
