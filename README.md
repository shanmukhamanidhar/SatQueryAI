# SatQueryAI — AUTONOMOUS EARTH INTELLIGENCE
> **"ASK A PLACE. SEE WHAT CHANGED. UNDERSTAND WHY."**

SatQueryAI is an AI-powered autonomous Earth-observation analyst. It allows anyone to ask natural language questions about environmental, urban, and climate dynamics anywhere on Earth—such as:
> *"What changed in Visakhapatnam between 2021 and 2026?"*
> *"Has urbanization increased near Hyderabad?"*
> *"Compare central Tokyo from 2020 to 2025."*

Without requiring any knowledge of GIS coordinates, remote sensing indices, satellite archives, cloud masking, or raster preprocessing, SatQueryAI automatically discovers real satellite observations, computes scientific indicators, detects land-cover transitions, and provides an authoritative, explainable AI interpretation.

---

## Key Features

- **Global Natural Language Exploration:** Resolves cities, districts, landmarks, addresses, and user-drawn AOIs worldwide.
- **Real Copernicus Sentinel-2 Satellite Imagery:** Automatically discovers open multispectral Level-2A data via public open STAC APIs (AWS Element84 / Microsoft Planetary Computer). No mock data, no fake satellite imagery.
- **Scientific Remote Sensing Engine:** Calculates true multispectral indices:
  - **NDVI** (Normalized Difference Vegetation Index) for vegetation canopy health.
  - **NDBI** (Normalized Difference Built-up Index) for urban and impervious surface development.
  - **NDWI** (Normalized Difference Water Index) for surface water presence and moisture.
- **Vector Change Polygon Extraction:** Morphological filtering and connected-component vectorization converts millions of pixels into clickable, inspectable geographic polygons with exact hectare metrics.
- **Interactive "Earth Observation Control Room" UI:** Unique mission-control visual identity featuring:
  - MapLibre GL interactive map with split-screen swipe slider comparison.
  - Continuous multi-index change heatmap overlay.
  - Click-to-inspect change polygons with simple explanations and technical evidence.
  - Human-friendly legend (Green: Vegetation, Blue: Water, Orange: Built-up, Red: Major Change).
  - Prominent **"EXPLAIN THIS MAP"** button powered by AI.
- **Conversational Follow-Up:** Chat panel maintaining context—ask "Where?", "When did it happen?", or "Show only vegetation loss" to dynamically filter map layers.
- **Multi-Year Time Machine:** Temporal slider and index trajectory charts spanning multi-year observations.
- **Transparent Confidence Framework:** Multi-factor explainable confidence rating based on cloud cover, spectral separation, and temporal alignment.
- **Professional Reporting & Exports:** Download comprehensive executive PDF reports, GeoJSON change vectors, and CSV statistical transition tables.

---

## Architecture & Data Flow

```
[User Natural Language Query]
           ↓
[NLP Intent & Entity Parser (Gemini 1.5 Flash / Heuristic Engine)]
           ↓
[Global Geocoding (Nominatim OpenStreetMap / Photon)]
           ↓
[AOI Determination & Ellipsoidal Area Calculation]
           ↓
[Copernicus Sentinel-2 STAC Discovery (AWS Earth Search / Planetary Computer)]
           ↓
[Atmospheric Quality Filtering & Seasonal Matching]
           ↓
[Multispectral Band Streaming (Red B04, Green B03, Blue B02, NIR B08, SWIR B11)]
           ↓
[Remote Sensing Computations (NDVI, NDWI, NDBI, Land-Cover Classification)]
           ↓
[Morphological Change Detection & Vector Polygon Clustering (scipy.ndimage)]
           ↓
[Explainable Multi-Factor Confidence Scoring]
           ↓
[Gemini AI Geospatial Interpretation (Observed vs Evidence vs Interpretation vs Limitations)]
           ↓
[Interactive Mission Control UI (MapLibre GL, Split Swipe, Time Machine, PDF Export)]
```

---

## Google Technologies Integration

1. **Google Gemini API (`gemini-1.5-flash`):**
   - Natural language intent and temporal boundary extraction.
   - AI Geospatial Analyst: synthesizes structured remote sensing evidence into plain language while preserving scientific honesty.
   - Context-aware conversational follow-up and interactive map filtering.
   - Dynamic map view explanation ("EXPLAIN THIS MAP").
2. **Google Cloud / Deployment Ready:**
   - Stateless containerized FastAPI backend ready for Cloud Run.
   - Cloud Storage compatible artifact caching.

---

## Installation & Setup

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** and **npm**

### 1. Clone & Configure Environment
```bash
cd earthscope
cp .env.example .env
```
Edit `.env` to optionally provide your `GEMINI_API_KEY`:
```ini
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Note: If `GEMINI_API_KEY` is omitted, EarthScope automatically runs with its built-in deterministic heuristic geospatial analyst, ensuring 100% functionality even offline!)*

### 2. Install Dependencies

**Backend:**
```bash
python -m pip install -r backend/requirements.txt
```
*(Or install core dependencies directly: `pip install fastapi uvicorn pydantic requests httpx numpy scipy pillow shapely reportlab python-dotenv google-generativeai`)*

**Frontend:**
```bash
cd frontend
npm install
```

---

## Running Locally

### Start Backend API (FastAPI)
```bash
cd earthscope
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```
The backend will start at `http://127.0.0.1:8000`. API documentation is available at `http://127.0.0.1:8000/docs`.

### Start Frontend UI (Vite + React)
In a second terminal:
```bash
cd earthscope/frontend
npm run dev
```
Open your browser at `http://localhost:3000`.

---

## Running Automated Tests

EarthScope includes automated verification suites covering all remote-sensing mathematics and global geocoding:

```bash
cd earthscope
# Run unit test suite (NLP, Geocoding across 7 continents, NDVI/NDBI formulas, confidence engine):
python backend/tests/test_components.py

# Run end-to-end satellite pipeline test:
python backend/tests/test_e2e_analyze.py
```

---

## Hackathon Demo Walkthrough (3–5 Minutes)

1. **Launch EarthScope** at `http://localhost:3000`. Notice the *Earth Observation Control Room* interface.
2. In the global search bar, type:
   `Analyze Visakhapatnam between 2021 and 2026`
3. Watch the autonomous progress experience as EarthScope:
   - Resolves Visakhapatnam coordinates and creates an analytical AOI.
   - Discovers real Sentinel-2 satellite passes from 2021 and 2026.
   - Streams multispectral bands and computes NDVI, NDWI, and NDBI.
   - Detects 16 discrete change clusters across 1,486 hectares.
4. **Interact with the Map:**
   - Drag the center **Swipe Divider** left and right to inspect before and after imagery.
   - Click the **"EXPLAIN THIS MAP"** button to hear the AI explanation.
   - Click any highlighted change polygon to view its exact area, index deltas, and technical remote-sensing evidence.
5. **Conversational Follow-Up:**
   - In the left AI Analyst panel, ask: *"Where did the biggest changes happen?"* (Observe the polygons highlighted on the map).
   - Ask: *"Show only vegetation loss"* (Observe the map filtering dynamically).
6. **Time Machine:**
   - Inspect the bottom Time Machine trajectory to view multi-year index shifts and land-cover area trends.
7. **Switch to Expert Mode:**
   - Click **EXPERT MODE** in the top header to inspect raw NDVI/NDWI/NDBI values, sensor GSD, and land-cover transition matrices.
8. **Export:**
   - Click **PDF REPORT** to generate and download an executive intelligence document.
   - Click **DATA PROVENANCE** to inspect the full audit trail or export raw GeoJSON and CSV files.
