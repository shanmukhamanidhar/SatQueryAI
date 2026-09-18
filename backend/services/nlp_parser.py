import re
import json
import logging
from typing import Dict, Any
from ..config import settings

logger = logging.getLogger(__name__)

DEFAULT_START_YEAR = 2021
DEFAULT_END_YEAR = 2026

def normalize_known_aliases(text: str) -> str:
    """
    Normalizes common spelling mistakes, colloquial aliases, and abbreviations.
    Works generally alongside worldwide geocoding.
    """
    normalized = text
    # Common variants & abbreviations
    alias_map = [
        (r"\bvisakahaphatnam\b", "Visakhapatnam"),
        (r"\bvisakhapatnam\b", "Visakhapatnam"),
        (r"\bvizag\b", "Visakhapatnam"),
        (r"\bwaltair\b", "Visakhapatnam"),
        (r"\bvijaywada\b", "Vijayawada"),
        (r"\bbezawada\b", "Vijayawada"),
        (r"\bkrishna\s+river\s+(in|around|near|along|in/around)?\s*vijayawada\b", "Krishna River in Vijayawada"),
        (r"\bkrishna\s+river\s+vijayawada\b", "Krishna River in Vijayawada"),
        (r"\bkrishna\s+in\s+vijayawada\b", "Krishna River in Vijayawada"),
    ]
    for pattern, replacement in alias_map:
        normalized = re.sub(pattern, replacement, normalized, flags=re.IGNORECASE)
    return normalized

def heuristic_parse_intent(query: str) -> Dict[str, Any]:
    """
    Robust regex/rule-based parser for queries like:
    'Analyze Visakhapatnam between 2021 and 2026'
    'Compare Tokyo from 2020 to 2025'
    'Did vegetation decrease in Hyderabad?'
    'Show urban growth in Dubai'
    'Show vegetation changes in Kerala between 2021 and 2026'
    'Show changes near the Krishna River in Vijayawada'
    """
    clean = normalize_known_aliases(query.strip())
    
    # 1. Extract years
    years = [int(y) for y in re.findall(r"\b(201[5-9]|202[0-7])\b", clean)]
    defaulted_dates = False
    if len(years) >= 2:
        start_year = min(years[0], years[1])
        end_year = max(years[0], years[1])
    elif len(years) == 1:
        if years[0] <= 2022:
            start_year = years[0]
            end_year = DEFAULT_END_YEAR
        else:
            start_year = DEFAULT_START_YEAR
            end_year = years[0]
    else:
        start_year = DEFAULT_START_YEAR
        end_year = DEFAULT_END_YEAR
        defaulted_dates = True

    # 2. Extract focus / analysis type
    q_lower = clean.lower()
    focus_indicator = "all"
    analysis_type = "general_change"
    
    if any(k in q_lower for k in ["urban", "city", "built", "development", "construction", "expansion"]):
        focus_indicator = "urbanization"
        analysis_type = "urban_expansion"
    elif any(k in q_lower for k in ["vegetation", "forest", "tree", "greenery", "deforestation", "green cover"]):
        focus_indicator = "vegetation"
        analysis_type = "vegetation_loss" if any(w in q_lower for w in ["loss", "decrease", "disappear", "drop"]) else "vegetation_change"
    elif any(k in q_lower for k in ["river", "water", "lake", "reservoir", "dam", "barrage", "canal", "estuary"]):
        focus_indicator = "water"
        analysis_type = "water_change"
    elif any(k in q_lower for k in ["flood", "flooding", "submerged"]):
        focus_indicator = "flood"
        analysis_type = "flood_impact"
    elif any(k in q_lower for k in ["drought", "dry", "drying"]):
        focus_indicator = "drought"
        analysis_type = "drought_impact"
    elif any(k in q_lower for k in ["fire", "wildfire", "burn", "burned"]):
        focus_indicator = "fire"
        analysis_type = "burned_area"

    # 3. Extract location name
    loc_candidate = clean
    prefixes = [
        r"^show\s+me\s+what\s+changed\s+(around|in|near|along\s+the|along|of)?",
        r"^show\s+me\s+changes\s+(around|in|near|along\s+the|along|of)?",
        r"^show\s+(what\s+changed|changes|vegetation\s+changes|vegetation\s+change|vegetation\s+loss|vegetation|urban\s+growth|urban\s+expansion|urbanization|water\s+changes|water\s+levels)\s+(around|in|near|along\s+the|along|of)?",
        r"^analyze\s+(the\s+area\s+around|changes\s+around|changes\s+in|the\s+region\s+around|area\s+around|the\s+corridor\s+along|in|around|near|along\s+the|along|of)?",
        r"^compare\s+(central\s+|the\s+area\s+around|the\s+)?",
        r"^what\s+changed\s+(in|around|near|along\s+the|along|of)?",
        r"^has\s+urbanization\s+increased\s+(near|in|around|along)?",
        r"^has\s+vegetation\s+changed\s+(around|near|in|along\s+the|along)?",
        r"^did\s+vegetation\s+decrease\s+(in|around|near|along)?",
        r"^show\s+urban\s+growth\s+(in|near|around|along)?"
    ]
    for p in prefixes:
        loc_candidate = re.sub(p, "", loc_candidate, flags=re.IGNORECASE).strip()

    # Also strip leftover fillers
    loc_candidate = re.sub(
        r"^(changes\s+(around|near|in)|the\s+area\s+around|area\s+around|around|near|central|along\s+the|along|in)\s+",
        "",
        loc_candidate,
        flags=re.IGNORECASE
    ).strip()
    
    # Remove temporal clauses
    loc_candidate = re.sub(
        r"\s+(between\s+\d{4}\s+and\s+\d{4}|from\s+\d{4}\s+to\s+\d{4}|in\s+\d{4}|\d{4}\s*-\s*\d{4}|over\s+the\s+last\s+\d+\s+years?).*$",
        "",
        loc_candidate,
        flags=re.IGNORECASE
    ).strip(" ?.,;")
    
    # Strip residual "area" suffix e.g. "Krishna River area near Vijayawada"
    loc_candidate = re.sub(r"\s+area\s+near\s+", " in ", loc_candidate, flags=re.IGNORECASE).strip()
    loc_candidate = re.sub(r"\s+area\s+around\s+", " in ", loc_candidate, flags=re.IGNORECASE).strip()
    loc_candidate = re.sub(r"\s+area\s+in\s+", " in ", loc_candidate, flags=re.IGNORECASE).strip()
    loc_candidate = re.sub(r"\s+area$", "", loc_candidate, flags=re.IGNORECASE).strip(" ?.,;")
    loc_candidate = re.sub(r"^(the|along\s+the|along)\s+", "", loc_candidate, flags=re.IGNORECASE).strip(" ?.,;")

    if not loc_candidate:
        loc_candidate = clean

    return {
        "location": loc_candidate,
        "start_year": start_year,
        "end_year": end_year,
        "start_date": f"{start_year}-01-01",
        "end_date": f"{end_year}-12-31",
        "focus_indicator": focus_indicator,
        "analysis_type": analysis_type,
        "defaulted_dates": defaulted_dates
    }

async def parse_nlp_intent(query: str) -> Dict[str, Any]:
    """
    Parses natural language query using Gemini when API key is available,
    with instant robust heuristic fallback.
    """
    heuristic_res = heuristic_parse_intent(query)
    
    # If heuristic parsing clearly extracted the location and years, return it immediately to preserve Gemini rate limits
    if heuristic_res.get("location") and heuristic_res["location"] not in ["", "the area"]:
        return heuristic_res

    if not settings.GEMINI_API_KEY and not settings.GOOGLE_API_KEY:
        return heuristic_res

    # Use Gemini if available
    try:
        import asyncio
        import google.generativeai as genai
        api_key = settings.GEMINI_API_KEY or settings.GOOGLE_API_KEY
        genai.configure(api_key=api_key, transport="rest")

        prompt = f"""
You are an Earth Observation Analyst NLP engine.
Extract the target location name, requested start year, requested end year, and focus indicator from this query:
"{query}"

Respond strictly with valid JSON conforming to this schema:
{{
  "location": "Name of city/region/landmark",
  "start_year": 2021,
  "end_year": 2026,
  "focus_indicator": "all" | "vegetation" | "urbanization" | "water" | "flood" | "drought",
  "analysis_type": "general_change" | "urban_expansion" | "vegetation_loss" | "water_change" | "flood_impact"
}}
If no years are mentioned, default start_year to 2021 and end_year to 2026.
JSON only, no markdown formatting.
"""

        parsed = None
        for m_name in ["gemini-3.6-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"]:
            try:
                model = genai.GenerativeModel(m_name)
                response = await asyncio.wait_for(asyncio.to_thread(model.generate_content, prompt), timeout=8.0)
                text = response.text.strip().replace("```json", "").replace("```", "").strip()
                parsed = json.loads(text)
                break
            except Exception as me:
                logger.info(f"NLP model {m_name} note: {me}")
                continue

        if not parsed:
            return heuristic_res
        
        start_y = int(parsed.get("start_year", heuristic_res["start_year"]))
        end_y = int(parsed.get("end_year", heuristic_res["end_year"]))
        
        return {
            "location": parsed.get("location") or heuristic_res["location"],
            "start_year": start_y,
            "end_year": end_y,
            "start_date": f"{start_y}-01-01",
            "end_date": f"{end_y}-12-31",
            "focus_indicator": parsed.get("focus_indicator", heuristic_res["focus_indicator"]),
            "analysis_type": parsed.get("analysis_type", heuristic_res["analysis_type"]),
            "defaulted_dates": heuristic_res["defaulted_dates"]
        }
    except Exception as e:
        logger.warning(f"Gemini NLP intent parsing exception: {e}. Using heuristic parsing.")
        return heuristic_res
