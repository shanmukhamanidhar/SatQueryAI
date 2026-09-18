import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from .env file and .env.local
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(BASE_DIR / ".env.local")
load_dotenv(BASE_DIR / "frontend" / ".env.local")

class Settings:
    PROJECT_NAME: str = "SatQueryAI — Autonomous Earth Intelligence"
    VERSION: str = "1.0.0"
    
    # API Keys (Google Gemini)
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY") or os.getenv("GOOGLE_GEMINI_API_KEY") or ""
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_GEMINI_API_KEY") or ""

    def update_gemini_api_key(self, key: str):
        cleaned = key.strip()
        self.GEMINI_API_KEY = cleaned
        self.GOOGLE_API_KEY = cleaned
        os.environ["GEMINI_API_KEY"] = cleaned
        os.environ["GOOGLE_API_KEY"] = cleaned
        # Persist to .env
        env_path = BASE_DIR / ".env"
        try:
            content = ""
            if env_path.exists():
                content = env_path.read_text(encoding="utf-8")
            if "GEMINI_API_KEY=" in content:
                import re
                content = re.sub(r"GEMINI_API_KEY=.*", f"GEMINI_API_KEY={cleaned}", content)
            else:
                content += f"\nGEMINI_API_KEY={cleaned}\n"
            if "GOOGLE_API_KEY=" in content:
                import re
                content = re.sub(r"GOOGLE_API_KEY=.*", f"GOOGLE_API_KEY={cleaned}", content)
            else:
                content += f"GOOGLE_API_KEY={cleaned}\n"
            env_path.write_text(content, encoding="utf-8")
        except Exception as e:
            pass

    
    # STAC Endpoints for Real Earth Observation Imagery
    # Element84 Earth Search AWS Sentinel-2 L2A (Open access, high reliability)
    EARTH_SEARCH_STAC_URL: str = os.getenv(
        "EARTH_SEARCH_STAC_URL", 
        "https://earth-search.aws.element84.com/v1"
    )
    # Microsoft Planetary Computer STAC
    PLANETARY_COMPUTER_STAC_URL: str = os.getenv(
        "PLANETARY_COMPUTER_STAC_URL",
        "https://planetarycomputer.microsoft.com/api/stac/v1"
    )
    
    # Nominatim Geocoding
    NOMINATIM_URL: str = os.getenv(
        "NOMINATIM_URL",
        "https://nominatim.openstreetmap.org/search"
    )
    USER_AGENT: str = "SatQueryAI-Autonomous-Earth-Intelligence/1.0 (contact: research@satquery.ai)"
    
    # Storage & Cache Directories
    CACHE_DIR: Path = BASE_DIR / "backend" / "cache"
    REPORTS_DIR: Path = BASE_DIR / "backend" / "reports"
    
    # Max image dimensions for raster processing (balanced for fast, accurate response)
    DEFAULT_RASTER_RESOLUTION: int = 256  # 256x256 pixel grid for AOI analysis

settings = Settings()

# Ensure directories exist
settings.CACHE_DIR.mkdir(parents=True, exist_ok=True)
settings.REPORTS_DIR.mkdir(parents=True, exist_ok=True)
