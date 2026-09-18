from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class PlaceLandmark(BaseModel):
    name: str
    latitude: float
    longitude: float
    category: Optional[str] = "landmark" # "landmark" | "suburb" | "district" | "waterbody"

class LocationInfo(BaseModel):
    name: str
    display_name: str
    latitude: float
    longitude: float
    bounding_box: List[float]  # [west, south, east, north]
    country: Optional[str] = None
    admin_region: Optional[str] = None
    geometry: Optional[Dict[str, Any]] = None  # GeoJSON Polygon/MultiPolygon if available
    location_type: Optional[str] = "city"      # "city" | "state" | "country" | "river" | "landmark"
    area_description: Optional[str] = None
    landmarks: Optional[List[PlaceLandmark]] = None

class ChangeRegion(BaseModel):
    id: str
    indicator_number: Optional[int] = None # 1-based rank (Hotspot #1, #2, etc.)
    category: str              # 'Urban development', 'Vegetation loss', 'Vegetation gain', 'Water reduction', etc.
    user_label: str            # 'Built-up / Development', 'Vegetation Loss', etc.
    color: str                 # Hex code (#f97316, #22c55e, #ef4444, #0ea5e9)
    area_hectares: float
    centroid: List[float]      # [longitude, latitude]
    delta_ndvi: float
    delta_ndbi: float
    delta_ndwi: float
    confidence_pct: int
    simple_explanation: str
    technical_evidence: str
    geometry: Dict[str, Any]   # GeoJSON polygon geometry

class LandCoverStats(BaseModel):
    category: str
    before_ha: float
    after_ha: float
    change_ha: float
    change_pct: float
    color: str

class TransitionRecord(BaseModel):
    from_class: str
    to_class: str
    area_ha: float
    description: str

class ConfidenceBreakdown(BaseModel):
    overall_score: int         # 0 - 100
    rating: str                # 'High', 'Moderate', 'Preliminary'
    factors: List[Dict[str, Any]]  # [{ 'name': 'Cloud Coverage', 'status': 'positive'|'neutral'|'warning', 'text': '...' }]
    limitations: List[str]

class AISummary(BaseModel):
    headline: str
    simple_markdown: str
    observed: str
    evidence: str
    interpretation: str
    limitations: str

class TimelinePoint(BaseModel):
    year: int
    date: str
    mean_ndvi: float
    mean_ndwi: float
    mean_ndbi: float
    vegetation_ha: float
    built_ha: float
    water_ha: float

class VisualLayers(BaseModel):
    before_rgb: str            # Data URL (image/png) or tile endpoint
    after_rgb: str
    ndvi_before: Optional[str] = None
    ndvi_after: Optional[str] = None
    ndvi_delta: Optional[str] = None
    change_heatmap: Optional[str] = None
    bounds: List[float]        # [west, south, east, north]

class AnalysisContext(BaseModel):
    analysis_id: str
    query: str
    created_at: str
    location: LocationInfo
    
    # Dates
    requested_start_date: str
    requested_end_date: str
    actual_before_date: str
    actual_after_date: str
    temporal_match_note: Optional[str] = None
    
    # Remote Sensing Provenance
    imagery_source: str
    sensor: str
    resolution: str
    cloud_percentage_before: float
    cloud_percentage_after: float
    usable_pixel_pct_before: float
    usable_pixel_pct_after: float
    before_scene_id: Optional[str] = None
    after_scene_id: Optional[str] = None
    data_availability: Optional[str] = "100% Optimal (Cloud-Free Pass)"
    
    # Raster Indicators Mean Values
    indices_summary: Dict[str, Any]
    
    # Statistical Outputs
    land_cover_stats: List[LandCoverStats]
    transitions: List[TransitionRecord]
    total_aoi_hectares: float
    total_changed_hectares: float
    percent_aoi_changed: float
    
    # Change Vectors & Heatmap
    change_regions: List[ChangeRegion]
    visual_layers: VisualLayers
    
    # Timeline
    timeline: List[TimelinePoint]
    
    # Confidence & AI
    confidence: ConfidenceBreakdown
    ai_summary: AISummary

# API Request Models
class AnalyzeRequest(BaseModel):
    query: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    aoi_geojson: Optional[Dict[str, Any]] = None
    focus_indicator: Optional[str] = None

class ChatRequest(BaseModel):
    analysis_id: str
    message: str
    history: Optional[List[Dict[str, str]]] = Field(default_factory=list)

class ChatResponse(BaseModel):
    reply: str
    analysis_id: str
    suggested_actions: Optional[List[str]] = None
    highlight_region_ids: Optional[List[str]] = None
    filter_category: Optional[str] = None
    zoom_to: Optional[List[float]] = None  # [longitude, latitude, zoom]
    selected_region_id: Optional[str] = None  # Auto-selects region for Change Inspector

class ExplainMapRequest(BaseModel):
    analysis_id: str
    active_layer: str
    viewport: Optional[Dict[str, Any]] = None

class GeocodeRequest(BaseModel):
    query: str

class YearImageRequest(BaseModel):
    analysis_id: Optional[str] = None
    bbox: List[float]  # [west, south, east, north]
    year: int          # e.g. 2020, 2021, 2022, 2023, 2024, 2025, 2026

class YearImageResponse(BaseModel):
    year: int
    date: str
    image_url: str
    cloud_cover_pct: float
    satellite: str = "Copernicus Sentinel-2 L2A"
    scene_id: Optional[str] = None
    message: Optional[str] = None
    is_fallback: Optional[bool] = False
