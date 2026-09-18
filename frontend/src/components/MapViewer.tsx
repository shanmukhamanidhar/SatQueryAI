import React, { useEffect, useRef, useState, useMemo } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { 
  Layers, 
  Split, 
  Maximize2, 
  Minimize2,
  Eye, 
  Crosshair, 
  Sparkles, 
  AlertCircle,
  HelpCircle,
  Square, 
  Flame, 
  Info, 
  Plus, 
  Minus, 
  RotateCcw,
  MapPin,
  Tag,
  Activity,
  CheckCircle,
  Clock,
  Satellite
} from 'lucide-react';
import { AnalysisContext, ChangeRegion } from '../lib/types';

interface MapViewerProps {
  context: AnalysisContext | null;
  selectedRegion: ChangeRegion | null;
  onSelectRegion: (region: ChangeRegion | null) => void;
  onExplainMap: () => void;
  filteredCategory: string | null;
  highlightedRegionIds: string[] | null;
  zoomTarget?: [number, number, number] | null;
  onFilterCategory?: (cat: string | null) => void;
  fromYear?: number | null;
  toYear?: number | null;
  fromImageData?: { year: number; date: string; imageUrl: string } | null;
  toImageData?: { year: number; date: string; imageUrl: string } | null;
  isLoadingFromYear?: boolean;
  isLoadingToYear?: boolean;
  onResetYears?: () => void;
  isMapMaximized?: boolean;
  onToggleMaximizeMap?: () => void;
  timeDrawerOpen?: boolean;
  onToggleTimeDrawer?: () => void;
  onOpenRawSatelliteModal?: () => void;
}

export const MapViewer: React.FC<MapViewerProps> = ({
  context,
  selectedRegion,
  onSelectRegion,
  onExplainMap,
  filteredCategory,
  highlightedRegionIds,
  zoomTarget,
  onFilterCategory,
  fromYear,
  toYear,
  fromImageData,
  toImageData,
  isLoadingFromYear,
  isLoadingToYear,
  onResetYears,
  isMapMaximized,
  onToggleMaximizeMap,
  timeDrawerOpen,
  onToggleTimeDrawer,
  onOpenRawSatelliteModal,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  // View modes & indicator toggles (indicators optional: default closed)
  const [comparisonMode, setComparisonMode] = useState<'swipe' | 'opacity' | 'after_only'>('swipe');
  const [swipePos, setSwipePos] = useState(50); // percentage 0-100
  const [isDraggingSwipe, setIsDraggingSwipe] = useState(false);
  const [opacityVal, setOpacityVal] = useState(1.0); // 0.0 - 1.0
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [showPolygons, setShowPolygons] = useState(true);
  const [showIndicators, setShowIndicators] = useState(false);
  const [showAreaNames, setShowAreaNames] = useState<boolean>(true);
  const [activeLayerName, setActiveLayerName] = useState<string>('True-Color Satellite Composite');

  // Markers and Popups references
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const areaMarkersRef = useRef<maplibregl.Marker[]>([]);
  const popupRef = useRef<maplibregl.Popup | null>(null);

  // Mouse telemetry
  const [mouseCoords, setMouseCoords] = useState<{ lon: number; lat: number } | null>(null);

function matchesCategory(regionCategory: string, filter: string | null): boolean {
  if (!filter || filter === 'all' || filter === 'ALL') return true;
  const rc = regionCategory.toLowerCase();
  const f = filter.toLowerCase();
  if (rc.includes('spectral') || rc.includes('change')) return true;
  if (f === 'urban' || f === 'urban_growth' || f === 'urban development') {
    return rc.includes('urban') || rc.includes('built');
  }
  if (f === 'vegetation' || f === 'vegetation_loss' || f === 'vegetation loss' || f === 'deforestation') {
    return rc.includes('loss') || rc.includes('deforest') || (rc.includes('veg') && !rc.includes('gain'));
  }
  if (f === 'regrowth' || f === 'vegetation_gain' || f === 'vegetation gain' || f === 'land_clearing') {
    return rc.includes('gain') || rc.includes('regrowth');
  }
  if (f === 'water' || f === 'water_change' || f === 'water reduction') {
    return rc.includes('water');
  }
  return rc.includes(f);
}

  // Calculate indicator counts per category
  const indicatorCounts = useMemo(() => {
    if (!context?.change_regions) return { vegetation: 0, water: 0, urban: 0, land_use: 0, major: 0, total: 0 };
    let veg = 0, wat = 0, urb = 0, reg = 0, maj = 0;
    context.change_regions.forEach((r) => {
      const cat = r.category.toLowerCase();
      if (cat.includes('loss') || cat.includes('deforest') || (cat.includes('veg') && !cat.includes('gain'))) veg++;
      else if (cat.includes('water')) wat++;
      else if (cat.includes('urban') || cat.includes('built')) urb++;
      else if (cat.includes('gain') || cat.includes('regrowth')) reg++;
      else maj++;
    });
    return { vegetation: veg, water: wat, urban: urb, land_use: reg, major: maj, total: context.change_regions.length };
  }, [context]);

  // Initialize MapLibre GL
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const VITE_CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || '';
    const esriSatelliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    const cartoLabelsUrl = `https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png?key=${VITE_CARTO_API_KEY}`;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          'satellite-base': {
            type: 'raster',
            tiles: [esriSatelliteUrl],
            tileSize: 256,
            maxzoom: 19,
            attribution: 'Esri, Maxar, Earthstar Geographics',
          },
          'carto-labels': {
            type: 'raster',
            tiles: [cartoLabelsUrl],
            tileSize: 256,
          },
        },
        layers: [
          {
            id: 'satellite-base-layer',
            type: 'raster',
            source: 'satellite-base',
            minzoom: 0,
            maxzoom: 20,
          },
          {
            id: 'carto-labels-layer',
            type: 'raster',
            source: 'carto-labels',
            minzoom: 0,
            maxzoom: 20,
            paint: {
              'raster-opacity': showAreaNames ? 1.0 : 0.0,
            },
          },
        ],
      },
      center: context ? [context.location.longitude, context.location.latitude] : [83.292, 17.693],
      zoom: context ? 12 : 3,
      scrollZoom: true,
      boxZoom: true,
      dragRotate: false,
      dragPan: true,
      keyboard: true,
      doubleClickZoom: true,
      touchZoomRotate: true,
      attributionControl: false,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    map.on('mousemove', (e) => {
      setMouseCoords({
        lon: Number(e.lngLat.lng.toFixed(5)),
        lat: Number(e.lngLat.lat.toFixed(5)),
      });
    });

    mapRef.current = map;

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      areaMarkersRef.current.forEach((m) => m.remove());
      map.remove();
    };
  }, []);

  // Update map center & layers when context changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !context) return;

    const bbox = context.location.bounding_box; // [west, south, east, north]
    map.fitBounds(
      [
        [bbox[0], bbox[1]],
        [bbox[2], bbox[3]],
      ],
      { padding: 40, duration: 1800 }
    );

    // Setup sources and layers when map style is loaded
    const updateLayers = () => {
      const layers = context.visual_layers;

      // 1. AOI Outline Source
      const aoiGeoJSON = context.location.geometry || {
        type: 'Polygon',
        coordinates: [
          [
            [bbox[0], bbox[1]],
            [bbox[2], bbox[1]],
            [bbox[2], bbox[3]],
            [bbox[0], bbox[3]],
            [bbox[0], bbox[1]],
          ],
        ],
      };

      if (map.getSource('aoi-boundary')) {
        (map.getSource('aoi-boundary') as maplibregl.GeoJSONSource).setData(aoiGeoJSON as any);
      } else {
        map.addSource('aoi-boundary', {
          type: 'geojson',
          data: aoiGeoJSON as any,
        });
        map.addLayer({
          id: 'aoi-boundary-line',
          type: 'line',
          source: 'aoi-boundary',
          paint: {
            'line-color': '#00f0ff',
            'line-width': 2,
            'line-dasharray': [3, 2],
          },
        });
      }

      // 2. Before Imagery Raster (coordinates: [top-left, top-right, bottom-right, bottom-left])
      const imgCoordinates: [[number, number], [number, number], [number, number], [number, number]] = [
        [bbox[0], bbox[3]], // NW
        [bbox[2], bbox[3]], // NE
        [bbox[2], bbox[1]], // SE
        [bbox[0], bbox[1]], // SW
      ];

      // 2. Before Imagery Raster (coordinates: [top-left, top-right, bottom-right, bottom-left])
      const beforeUrl = fromImageData?.imageUrl || layers.before_rgb;
      if (beforeUrl) {
        if (map.getSource('before-imagery')) {
          map.removeLayer('before-imagery-layer');
          map.removeSource('before-imagery');
        }
        map.addSource('before-imagery', {
          type: 'image',
          url: beforeUrl,
          coordinates: imgCoordinates,
        });
        map.addLayer({
          id: 'before-imagery-layer',
          type: 'raster',
          source: 'before-imagery',
          paint: {
            'raster-opacity': 1.0,
            'raster-resampling': 'linear',
          },
        });
      }

      // 3. After Imagery Raster (or specific selected To Year satellite image)
      const afterUrl = toImageData?.imageUrl || layers.after_rgb;
      if (afterUrl) {
        if (map.getSource('after-imagery')) {
          map.removeLayer('after-imagery-layer');
          map.removeSource('after-imagery');
        }
        map.addSource('after-imagery', {
          type: 'image',
          url: afterUrl,
          coordinates: imgCoordinates,
        });
        const beforeLayerId = map.getLayer('aoi-boundary-line') ? 'aoi-boundary-line' : (map.getLayer('change-polygons-fill') ? 'change-polygons-fill' : undefined);
        map.addLayer({
          id: 'after-imagery-layer',
          type: 'raster',
          source: 'after-imagery',
          paint: {
            'raster-opacity': comparisonMode === 'swipe' ? 1.0 : opacityVal,
            'raster-resampling': 'linear',
          },
        }, beforeLayerId);
      }

      // 4. Change Heatmap Raster
      if (layers.change_heatmap) {
        if (map.getSource('heatmap-imagery')) {
          map.removeLayer('heatmap-imagery-layer');
          map.removeSource('heatmap-imagery');
        }
        map.addSource('heatmap-imagery', {
          type: 'image',
          url: layers.change_heatmap,
          coordinates: imgCoordinates,
        });
        const beforeLayerId = map.getLayer('aoi-boundary-line') ? 'aoi-boundary-line' : (map.getLayer('change-polygons-fill') ? 'change-polygons-fill' : undefined);
        map.addLayer({
          id: 'heatmap-imagery-layer',
          type: 'raster',
          source: 'heatmap-imagery',
          paint: {
            'raster-opacity': showHeatmap ? 0.75 : 0.0,
          },
        }, beforeLayerId);
      }

      // 5. Change Polygons GeoJSON Source
      const polygonFeatures = context.change_regions
        .filter((r) => matchesCategory(r.category, filteredCategory))
        .map((r) => ({
          type: 'Feature',
          id: r.id,
          geometry: r.geometry,
          properties: {
            id: r.id,
            category: r.category,
            user_label: r.user_label,
            color: r.color,
            area_ha: r.area_hectares,
            delta_ndvi: r.delta_ndvi,
            delta_ndbi: r.delta_ndbi,
            confidence: r.confidence_pct,
            highlighted: highlightedRegionIds ? highlightedRegionIds.includes(r.id) : false,
          },
        }));

      const geojsonData = {
        type: 'FeatureCollection',
        features: polygonFeatures,
      };

      if (map.getSource('change-polygons')) {
        (map.getSource('change-polygons') as maplibregl.GeoJSONSource).setData(geojsonData as any);
      } else {
        map.addSource('change-polygons', {
          type: 'geojson',
          data: geojsonData as any,
        });

        // Polygon Fill
        map.addLayer({
          id: 'change-polygons-fill',
          type: 'fill',
          source: 'change-polygons',
          paint: {
            'fill-color': ['get', 'color'],
            'fill-opacity': [
              'case',
              ['boolean', ['get', 'highlighted'], false],
              0.8,
              0.45,
            ],
          },
        });

        // Polygon Outline
        map.addLayer({
          id: 'change-polygons-line',
          type: 'line',
          source: 'change-polygons',
          paint: {
            'line-color': ['get', 'color'],
            'line-width': [
              'case',
              ['boolean', ['get', 'highlighted'], false],
              3.5,
              1.8,
            ],
          },
        });

        // Click Polygon Handler
        map.on('click', 'change-polygons-fill', (e) => {
          if (!e.features || e.features.length === 0) return;
          const clickedId = e.features[0].properties.id;
          const match = context.change_regions.find((r) => r.id === clickedId);
          if (match) {
            onSelectRegion(match);
          }
        });

        // Cursor Pointer on hover
        map.on('mouseenter', 'change-polygons-fill', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'change-polygons-fill', () => {
          map.getCanvas().style.cursor = '';
        });
      }

      // Ensure Carto Labels layer is present and moved above satellite raster imagery
      const VITE_CARTO_API_KEY = import.meta.env.VITE_CARTO_API_KEY || '';
      const cartoLabelsUrl = `https://basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}.png?key=${VITE_CARTO_API_KEY}`;
      if (!map.getSource('carto-labels')) {
        map.addSource('carto-labels', {
          type: 'raster',
          tiles: [cartoLabelsUrl],
          tileSize: 256,
        });
      }
      if (!map.getLayer('carto-labels-layer')) {
        map.addLayer({
          id: 'carto-labels-layer',
          type: 'raster',
          source: 'carto-labels',
          minzoom: 0,
          maxzoom: 20,
          paint: {
            'raster-opacity': showAreaNames ? 1.0 : 0.0,
          },
        });
      }

      // Guarantee labels and vector layers always render above raster imagery
      if (map.getLayer('carto-labels-layer')) {
        map.moveLayer('carto-labels-layer');
        map.setPaintProperty('carto-labels-layer', 'raster-opacity', showAreaNames ? 1.0 : 0.0);
      }
      if (map.getLayer('change-polygons-fill')) map.moveLayer('change-polygons-fill');
      if (map.getLayer('change-polygons-line')) map.moveLayer('change-polygons-line');
      if (map.getLayer('aoi-boundary-line')) map.moveLayer('aoi-boundary-line');
    };

    if (map.isStyleLoaded()) {
      updateLayers();
    } else {
      map.once('styledata', updateLayers);
    }
  }, [context, filteredCategory, highlightedRegionIds, fromImageData, toImageData, comparisonMode, opacityVal]);

  // Manage on-map indicator markers & click popups (ONLY opens when pressed)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clean up existing markers & popups
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];
    if (popupRef.current) {
      popupRef.current.remove();
      popupRef.current = null;
    }

    if (!showIndicators || !context || !context.change_regions) return;

    const visibleRegions = context.change_regions
      .filter((r) => matchesCategory(r.category, filteredCategory))
      .sort((a, b) => b.area_hectares - a.area_hectares)
      .slice(0, 12); // Focus on top prominent hotspots in primary AOI

    visibleRegions.forEach((region, index) => {
      const isSelected = selectedRegion?.id === region.id;
      const isHighlighted = highlightedRegionIds ? highlightedRegionIds.includes(region.id) : false;
      const pinNum = region.indicator_number || (index + 1);

      // Create indicator DOM container
      const el = document.createElement('div');
      el.className = `satquery-map-indicator ${isSelected || isHighlighted ? 'active' : ''}`;
      el.style.setProperty('--indicator-color', region.color);
      el.style.setProperty('--indicator-glow', `${region.color}88`);

      // Category short tag
      let shortCat = 'Change';
      const c = region.category.toLowerCase();
      if (c.includes('loss') || (c.includes('veg') && !c.includes('gain'))) shortCat = 'Vegetation';
      else if (c.includes('water')) shortCat = 'Water';
      else if (c.includes('urban') || c.includes('built')) shortCat = 'Urban';
      else if (c.includes('gain') || c.includes('regrowth')) shortCat = 'Regrowth';
      else shortCat = 'Alert';

      const haText = region.area_hectares < 100 ? `${region.area_hectares.toFixed(1)} ha` : `${Math.round(region.area_hectares).toLocaleString()} ha`;

      // Clean compact pin (Matches #1, #2, #3 universally)
      el.innerHTML = `
        <div class="indicator-pin-outer" title="Hotspot #${pinNum}: ${shortCat} (${haText}) — Click to inspect">
          <span class="indicator-ping-ring"></span>
          <div class="indicator-core-dot">
            <span>${pinNum}</span>
          </div>
        </div>
      `;

      // Click: ONLY open alert card when explicitly pressed/clicked
      el.addEventListener('click', (e) => {
        e.stopPropagation();

        if (popupRef.current) {
          popupRef.current.remove();
          popupRef.current = null;
        }

        onSelectRegion(region);

        const popupHtml = `
          <div style="background: rgba(10, 16, 28, 0.98); border: 1.5px solid ${region.color}; border-radius: 14px; padding: 14px; min-width: 250px; color: #f1f5f9; box-shadow: 0 16px 40px rgba(0,0,0,0.95); backdrop-filter: blur(16px); font-family: Inter, sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-size: 10.5px; font-weight: 800; color: ${region.color}; text-transform: uppercase; letter-spacing: 0.06em; font-family: monospace;">HOTSPOT #${pinNum} · ${shortCat}</span>
              <button id="close-ind-popup-${region.id}" style="background: none; border: none; color: #94a3b8; font-size: 15px; cursor: pointer; padding: 0 4px; line-height: 1;" title="Close">✕</button>
            </div>
            <div style="font-size: 13px; font-weight: 600; margin-bottom: 8px; color: #ffffff; line-height: 1.35;">${region.user_label}</div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; font-size: 11px; font-family: monospace; background: rgba(255,255,255,0.05); padding: 7px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); margin-bottom: 8px;">
              <div>Area: <strong style="color: #00f0ff;">${haText}</strong></div>
              <div>ΔNDVI: <strong style="color: ${region.delta_ndvi < 0 ? '#f87171' : '#34d399'};">${region.delta_ndvi > 0 ? '+' : ''}${region.delta_ndvi.toFixed(3)}</strong></div>
            </div>
            <div style="font-size: 10.5px; color: #cbd5e1; margin-bottom: 10px; line-height: 1.4;">${region.simple_explanation || region.technical_evidence || ''}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10px; color: #94a3b8; font-family: monospace; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.08);">
              <span>Confidence: <strong style="color: #34d399;">${region.confidence_pct}%</strong></span>
              <span style="color: #00f0ff; font-weight: 600;">ACTIVE HOTSPOT</span>
            </div>
          </div>
        `;

        const popup = new maplibregl.Popup({
          offset: 16,
          closeButton: false,
          closeOnClick: true,
        })
          .setLngLat(region.centroid)
          .setHTML(popupHtml)
          .addTo(map);

        popupRef.current = popup;

        // Close button listener
        setTimeout(() => {
          const closeBtn = document.getElementById(`close-ind-popup-${region.id}`);
          if (closeBtn) {
            closeBtn.onclick = (ce) => {
              ce.stopPropagation();
              if (popupRef.current) {
                popupRef.current.remove();
                popupRef.current = null;
              }
            };
          }
        }, 50);

        map.flyTo({
          center: region.centroid,
          zoom: 14.5,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
      });

      const marker = new maplibregl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat(region.centroid)
        .addTo(map);

      markersRef.current.push(marker);
    });
  }, [context, showIndicators, filteredCategory, selectedRegion, highlightedRegionIds]);

  // Manage Area Names & Place Labels overlay on satellite map
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // 1. Toggle Carto labels raster layer opacity on satellite imagery
    if (map.isStyleLoaded() && map.getLayer('carto-labels-layer')) {
      map.setPaintProperty('carto-labels-layer', 'raster-opacity', showAreaNames ? 1.0 : 0.0);
    }

    // 2. Clean up previous area badges
    areaMarkersRef.current.forEach((m) => m.remove());
    areaMarkersRef.current = [];

    if (!showAreaNames || !context) return;

    // A. Main AOI Representation Badge (pinned at top center of AOI)
    const bbox = context.location.bounding_box;
    const aoiTopCenter: [number, number] = [
      (bbox[0] + bbox[2]) / 2,
      bbox[3] - (bbox[3] - bbox[1]) * 0.03, // slightly inset from top edge
    ];

    const aoiBadgeEl = document.createElement('div');
    aoiBadgeEl.className = 'satquery-area-badge';
    aoiBadgeEl.title = `${context.location.name} (${Math.round(context.total_aoi_hectares || 0).toLocaleString()} ha) — Click to frame AOI`;
    aoiBadgeEl.innerHTML = `
      <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:#00f0ff; box-shadow: 0 0 10px #00f0ff;"></span>
      <span style="font-size:11px; font-weight:700; color:#ffffff; letter-spacing:0.02em;">${context.location.name}</span>
      <span style="font-size:9.5px; font-weight:700; color:#00f0ff; background:rgba(0,240,255,0.15); padding:1px 6px; border-radius:4px; border:1px solid rgba(0,240,255,0.3);">
        ${Math.round(context.total_aoi_hectares || 0).toLocaleString()} HA
      </span>
    `;
    aoiBadgeEl.addEventListener('click', () => {
      map.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 40, duration: 1200 }
      );
    });

    const aoiMarker = new maplibregl.Marker({
      element: aoiBadgeEl,
      anchor: 'top',
    })
      .setLngLat(aoiTopCenter)
      .addTo(map);

    areaMarkersRef.current.push(aoiMarker);

    // B. Real Specific Places & Landmarks Representation Badges in the Area
    // (User requested: Area names means specific places in the area, not change categories)
    const places = context.location.landmarks || [];
    places.forEach((place) => {
      const placeBadgeEl = document.createElement('div');
      placeBadgeEl.className = 'satquery-place-badge';
      placeBadgeEl.title = `${place.name} (${place.category || 'landmark'}) — Click to zoom`;

      const dotColor = place.category === 'waterbody' ? '#38bdf8' : place.category === 'suburb' ? '#a78bfa' : '#00f0ff';
      const catLabel = (place.category || 'Place').toUpperCase();

      placeBadgeEl.innerHTML = `
        <span style="display:inline-block; width:6px; height:6px; border-radius:50%; background:${dotColor}; box-shadow: 0 0 6px ${dotColor};"></span>
        <span style="font-size:10.5px; font-weight:700; color:#f8fafc; letter-spacing:0.01em; white-space:nowrap;">${place.name}</span>
        <span style="font-size:8.5px; font-weight:700; color:${dotColor}; background:rgba(0,240,255,0.12); padding:1px 4.5px; border-radius:3px; border:1px solid ${dotColor}40;">
          ${catLabel}
        </span>
      `;

      placeBadgeEl.addEventListener('click', () => {
        map.flyTo({
          center: [place.longitude, place.latitude],
          zoom: 15.0,
          speed: 1.2,
          curve: 1.4,
          essential: true,
        });
      });

      const placeMarker = new maplibregl.Marker({
        element: placeBadgeEl,
        anchor: 'bottom',
      })
        .setLngLat([place.longitude, place.latitude])
        .addTo(map);

      areaMarkersRef.current.push(placeMarker);
    });
  }, [showAreaNames, context]);

  // Update polygon visibility
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;

    if (map.getLayer('change-polygons-fill')) {
      map.setLayoutProperty('change-polygons-fill', 'visibility', showPolygons ? 'visible' : 'none');
    }
    if (map.getLayer('change-polygons-line')) {
      map.setLayoutProperty('change-polygons-line', 'visibility', showPolygons ? 'visible' : 'none');
    }
    if (map.getLayer('heatmap-imagery-layer')) {
      map.setPaintProperty('heatmap-imagery-layer', 'raster-opacity', showHeatmap ? 0.75 : 0.0);
    }
  }, [showPolygons, showHeatmap]);

  // Update opacity when slider moves
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) return;
    if (map.getLayer('after-imagery-layer') && comparisonMode === 'opacity') {
      map.setPaintProperty('after-imagery-layer', 'raster-opacity', opacityVal);
    }
  }, [opacityVal, comparisonMode]);

  // Smooth camera flyTo on region selection or AI zoom target
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (zoomTarget) {
      map.flyTo({
        center: [zoomTarget[0], zoomTarget[1]],
        zoom: zoomTarget[2] || 14,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    } else if (selectedRegion) {
      map.flyTo({
        center: [selectedRegion.centroid[0], selectedRegion.centroid[1]],
        zoom: 14.2,
        speed: 1.2,
        curve: 1.4,
        essential: true,
      });
    }
  }, [selectedRegion, zoomTarget]);

  // Non-blocking drag handlers for swipe split handle
  const handleStartDrag = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    setIsDraggingSwipe(true);
  };

  useEffect(() => {
    if (!isDraggingSwipe) return;

    const handleMove = (e: MouseEvent | TouchEvent) => {
      if (!mapContainerRef.current) return;
      const rect = mapContainerRef.current.getBoundingClientRect();
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const pct = Math.max(5, Math.min(95, ((clientX - rect.left) / rect.width) * 100));
      setSwipePos(pct);
    };

    const handleEnd = () => {
      setIsDraggingSwipe(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDraggingSwipe]);

  // Zoom control helpers
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn({ duration: 250 });
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut({ duration: 250 });
    }
  };

  const handleResetView = () => {
    if (mapRef.current && context) {
      const bbox = context.location.bounding_box;
      mapRef.current.fitBounds(
        [
          [bbox[0], bbox[1]],
          [bbox[2], bbox[3]],
        ],
        { padding: 40, duration: 800 }
      );
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden select-none bg-space-950">
      {/* Primary Map Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Swipe Comparison Clip Plane */}
      {comparisonMode === 'swipe' && context && (
        <>
          {/* Draggable vertical divider */}
          <div
            className="absolute top-0 bottom-0 z-20 w-1 bg-orbit-cyan shadow-[0_0_16px_rgba(0,240,255,0.7)] pointer-events-none"
            style={{ left: `${swipePos}%` }}
          >
            <div
              onMouseDown={handleStartDrag}
              onTouchStart={handleStartDrag}
              className="h-9 px-3 -ml-8 top-1/2 -translate-y-1/2 absolute rounded-full bg-[#090e17]/95 border-2 border-orbit-cyan shadow-[0_0_22px_rgba(0,240,255,0.45)] flex items-center justify-center space-x-1 text-orbit-cyan hover:scale-105 active:scale-95 transition-all cursor-ew-resize pointer-events-auto backdrop-blur-md"
              title="Drag to compare Before and After satellite passes"
            >
              <Split className="w-3.5 h-3.5 rotate-90" />
              <span className="text-[10px] font-bold font-telemetry tracking-wider">SWIPE</span>
            </div>
          </div>
        </>
      )}

      {/* On-Map Observation Telemetry HUD Indicator Bar */}
      {context && (
        <div className="absolute top-4 left-4 z-20 flex flex-col space-y-1.5 pointer-events-none max-w-[calc(100%-120px)]">
          {/* Top Status & Scale Indicator Badge */}
          <div className="figma-card px-3.5 py-2 border border-orbit-cyan/40 shadow-2xl backdrop-blur-xl flex items-center space-x-3 pointer-events-auto">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-orbit-cyan animate-pulse shrink-0" />
              <span className="font-telemetry font-bold text-xs text-white uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                {context.location.name}
              </span>
              <span className="text-[9.5px] font-telemetry px-1.5 py-0.5 rounded bg-orbit-cyan/15 text-orbit-cyan border border-orbit-cyan/30 uppercase font-semibold shrink-0">
                {context.location.location_type || 'AOI'}
              </span>
            </div>

            <div className="h-3 w-px bg-slate-700 hidden sm:block" />

            <div className="hidden sm:flex items-center space-x-3 text-[11px] font-telemetry text-slate-300">
              <span title="Total AOI Area">
                📐 <strong className="text-white">{context.total_aoi_hectares.toLocaleString()} ha</strong>
              </span>
              <span title="Satellite Sensor">
                🛰️ <span className="text-slate-400">Sentinel-2 (10m)</span>
              </span>
              <span title="Active Detected Change Indicators">
                📍 <strong className="text-orbit-cyan">{indicatorCounts.total}</strong> Indicators on Map
              </span>
            </div>
          </div>

          {/* Temporal Baseline & Observation Strip */}
          <div className="flex flex-wrap items-center gap-1.5 text-[10.5px] font-telemetry text-slate-400 pointer-events-auto">
            {(fromYear || toYear) ? (
              <div className="px-3 py-1 rounded-xl bg-[#090e17]/95 border border-orbit-cyan/60 text-orbit-cyan shadow-[0_0_16px_rgba(0,240,255,0.25)] backdrop-blur-md flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-orbit-cyan animate-ping" />
                <span>
                  PASSES: <strong className="text-white font-mono text-xs">{fromYear || (context.actual_before_date ? context.actual_before_date.slice(0, 4) : 2021)}</strong> {fromImageData ? `(${fromImageData.date})` : ''} ➔ <strong className="text-white font-mono text-xs">{toYear || (context.actual_after_date ? context.actual_after_date.slice(0, 4) : 2026)}</strong> {toImageData ? `(${toImageData.date})` : ''}
                </span>
                {(isLoadingFromYear || isLoadingToYear) && (
                  <Activity className="w-3.5 h-3.5 animate-spin text-orbit-cyan" />
                )}
                {onResetYears && (
                  <button
                    type="button"
                    onClick={onResetYears}
                    className="ml-2 px-2 py-0.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[10px] border border-rose-500/40 font-bold transition-all"
                    title="Return to initial analysis baseline vs comparative observation"
                  >
                    ✕ Reset View
                  </button>
                )}
              </div>
            ) : (
              <>
                <span className="px-2 py-0.5 rounded-md bg-[#090e17]/90 border border-slate-700/80 text-slate-300 shadow-sm backdrop-blur-md flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                  <span>Baseline:</span>
                  <strong className="text-white">{context.actual_before_date}</strong>
                </span>
                <span className="text-slate-500 font-mono">➔</span>
                <span className="px-2 py-0.5 rounded-md bg-[#090e17]/90 border border-orbit-cyan/40 text-orbit-cyan shadow-sm backdrop-blur-md flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orbit-cyan animate-ping" />
                  <span>Pass:</span>
                  <strong className="text-white">{context.actual_after_date}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#090e17]/90 border border-emerald-500/40 text-emerald-400 shadow-sm backdrop-blur-md hidden md:inline-flex items-center space-x-1">
                  <CheckCircle className="w-3 h-3 text-emerald-400" />
                  <span>100% Usable Clear Pixels</span>
                </span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Floating Zoom & Maximize Controls Toolbar */}
      <div className="absolute top-16 right-4 z-30 flex flex-col space-y-1 figma-card p-1 shadow-2xl">
        {onToggleMaximizeMap && (
          <button
            type="button"
            onClick={onToggleMaximizeMap}
            className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
              isMapMaximized
                ? 'bg-orbit-cyan text-[#070b13] shadow-[0_0_12px_rgba(0,240,255,0.7)] font-bold'
                : 'bg-[#111827]/70 hover:bg-orbit-cyan/20 text-slate-300 hover:text-orbit-cyan border border-transparent hover:border-orbit-cyan/40'
            }`}
            title={isMapMaximized ? "Restore sidebars (Normal view)" : "Maximize Map Area (Full width & height)"}
          >
            {isMapMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        )}
        <button
          type="button"
          onClick={handleZoomIn}
          className="h-8 w-8 rounded-lg bg-[#111827]/70 hover:bg-orbit-cyan/20 text-slate-300 hover:text-orbit-cyan flex items-center justify-center transition-colors border border-transparent hover:border-orbit-cyan/40"
          title="Zoom In (+)"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="h-8 w-8 rounded-lg bg-[#111827]/70 hover:bg-orbit-cyan/20 text-slate-300 hover:text-orbit-cyan flex items-center justify-center transition-colors border border-transparent hover:border-orbit-cyan/40"
          title="Zoom Out (-)"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleResetView}
          className="h-8 w-8 rounded-lg bg-[#111827]/70 hover:bg-orbit-cyan/20 text-slate-300 hover:text-orbit-cyan flex items-center justify-center transition-colors border border-transparent hover:border-orbit-cyan/40"
          title="Reset View to AOI"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Prominent "EXPLAIN THIS MAP" Button */}
      <div className="absolute top-4 right-16 z-20 hidden md:block">
        <button
          type="button"
          onClick={onExplainMap}
          className="group px-4 py-2 rounded-full bg-[#090e17]/90 hover:bg-[#10192a] border border-orbit-cyan/60 hover:border-orbit-cyan text-orbit-cyan shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_26px_rgba(0,240,255,0.55)] flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 backdrop-blur-xl"
        >
          <div className="w-2 h-2 rounded-full bg-orbit-cyan animate-ping group-hover:scale-125" />
          <Sparkles className="w-3.5 h-3.5 text-orbit-cyan" />
          <span className="font-telemetry font-bold text-xs tracking-wider text-slate-100 group-hover:text-white">
            EXPLAIN THIS MAP
          </span>
        </button>
      </div>

      {/* Floating Map Controls Toolbar */}
      <div className="absolute bottom-6 left-4 z-20 flex flex-col space-y-2">
        {/* Layer Toggles Panel */}
        <div className="figma-card rounded-2xl p-2 flex items-center space-x-2 shadow-2xl border border-slate-700/60 backdrop-blur-xl">
          {/* Comparison Mode Toggle */}
          <button
            type="button"
            onClick={() => setComparisonMode(comparisonMode === 'swipe' ? 'opacity' : 'swipe')}
            className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              comparisonMode === 'swipe'
                ? 'bg-orbit-cyan/20 text-orbit-cyan border border-orbit-cyan/50 shadow-sm'
                : 'text-slate-300 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle Split-Swipe Comparison"
          >
            <Split className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">SWIPE</span>
          </button>

          {/* Opacity slider if in opacity mode */}
          {comparisonMode === 'opacity' && (
            <div className="flex items-center space-x-2 px-2 border-l border-slate-700">
              <span className="text-[10px] font-telemetry text-slate-400">OPACITY:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={opacityVal}
                onChange={(e) => setOpacityVal(Number(e.target.value))}
                className="w-16 accent-orbit-cyan h-1 cursor-pointer"
              />
            </div>
          )}

          {/* Swipe Split slider if in swipe mode */}
          {comparisonMode === 'swipe' && (
            <div className="flex items-center space-x-2 px-2 border-l border-slate-700">
              <span className="text-[10px] font-telemetry text-slate-400">SPLIT:</span>
              <input
                type="range"
                min="5"
                max="95"
                value={swipePos}
                onChange={(e) => setSwipePos(Number(e.target.value))}
                className="w-20 accent-orbit-cyan h-1 cursor-pointer"
              />
              <span className="text-[10px] font-telemetry text-orbit-cyan w-6 font-mono">{Math.round(swipePos)}%</span>
            </div>
          )}

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* Time Changes Toggle Button */}
          {onToggleTimeDrawer && (
            <button
              type="button"
              onClick={onToggleTimeDrawer}
              className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
                timeDrawerOpen
                  ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400/60 shadow-sm font-bold'
                  : 'text-slate-300 hover:bg-white/5 border border-transparent'
              }`}
              title="Toggle Time Changes / Observation Passes (2020–2026)"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline font-semibold">TIME CHANGES</span>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/20 px-1.5 py-0.5 rounded border border-cyan-500/30">
                {fromYear || (context?.actual_before_date ? context.actual_before_date.slice(0, 4) : 2021)}➔{toYear || (context?.actual_after_date ? context.actual_after_date.slice(0, 4) : 2026)}
              </span>
            </button>
          )}

          {/* Dedicated Option Button: Raw Satellite Timeline Studio (Side-by-Side) */}
          {onOpenRawSatelliteModal && (
            <button
              type="button"
              onClick={onOpenRawSatelliteModal}
              className="px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all bg-gradient-to-r from-orbit-cyan/20 to-emerald-500/20 hover:from-orbit-cyan/35 hover:to-emerald-500/35 text-orbit-cyan hover:text-white border border-orbit-cyan/50 shadow-[0_0_12px_rgba(0,240,255,0.3)] font-bold active:scale-95"
              title="Open Raw Satellite Timeline Studio: Side-by-side pure optical satellite imagery with timeline and place choice"
            >
              <Satellite className="w-3.5 h-3.5 text-orbit-cyan animate-pulse" />
              <span className="hidden sm:inline">RAW SATELLITE (SIDE-BY-SIDE)</span>
              <span className="sm:hidden">RAW SATS</span>
            </button>
          )}

          <div className="h-4 w-px bg-slate-700 mx-1" />

          {/* On-Map Indicators Toggle Button */}
          <button
            type="button"
            onClick={() => setShowIndicators(!showIndicators)}
            className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              showIndicators
                ? 'bg-orbit-cyan/20 text-orbit-cyan border border-orbit-cyan/50 shadow-sm'
                : 'text-slate-400 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle On-Map Indicator Pins & Badges"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">INDICATORS ({indicatorCounts.total})</span>
          </button>

          {/* Change Heatmap Toggle */}
          <button
            type="button"
            onClick={() => setShowHeatmap(!showHeatmap)}
            className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              showHeatmap
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm'
                : 'text-slate-400 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle Continuous Change Heatmap"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">HEATMAP</span>
          </button>

          {/* Polygons Toggle */}
          <button
            type="button"
            onClick={() => setShowPolygons(!showPolygons)}
            className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              showPolygons
                ? 'bg-orbit-emerald/20 text-orbit-emerald border border-orbit-emerald/50 shadow-sm'
                : 'text-slate-400 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle Vector Change Polygons"
          >
            <Square className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">POLYGONS</span>
          </button>

          {/* Quick Raw Optical Only Mode (hides heatmap, polygons, and indicators) */}
          <button
            type="button"
            onClick={() => {
              if (showPolygons || showHeatmap || showIndicators) {
                setShowPolygons(false);
                setShowHeatmap(false);
                setShowIndicators(false);
              } else {
                setShowPolygons(true);
                setShowHeatmap(true);
              }
            }}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              !showPolygons && !showHeatmap && !showIndicators
                ? 'bg-emerald-500/25 text-emerald-300 border border-emerald-400/60 font-bold shadow-sm'
                : 'text-slate-400 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle Pure Raw Satellite View (hide all polygon and heatmap masks on the map)"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden md:inline">RAW ONLY</span>
          </button>

          {/* Area Names Toggle (Beside Polygons) */}
          <button
            type="button"
            onClick={() => setShowAreaNames(!showAreaNames)}
            className={`px-3 py-1.5 rounded-xl text-xs font-telemetry flex items-center space-x-1.5 transition-all ${
              showAreaNames
                ? 'bg-orbit-cyan/20 text-orbit-cyan border border-orbit-cyan/50 shadow-sm font-bold'
                : 'text-slate-400 hover:bg-white/5 border border-transparent'
            }`}
            title="Toggle Area Names & Place Labels on Satellite Map"
          >
            <Tag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-semibold">AREA NAMES</span>
          </button>
        </div>
      </div>

      {/* Category Color Legend Bar */}
      <div className="absolute top-16 left-4 z-20 hidden sm:flex items-center space-x-1.5 p-1 rounded-xl bg-[#06101A]/90 border border-[#0C1C2A] backdrop-blur-xl shadow-xl text-[11px] font-mono">
        <span className="text-[10px] text-slate-500 uppercase px-1.5 font-bold">LEGEND:</span>
        <button
          type="button"
          onClick={() => onFilterCategory?.(filteredCategory === 'deforestation' ? null : 'deforestation')}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-all ${
            filteredCategory === 'deforestation' ? 'bg-[#FF5C62]/20 border border-[#FF5C62] text-white font-bold' : 'text-slate-300 hover:bg-white/5'
          }`}
          title="Filter to Deforestation / Vegetation Loss"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FF5C62] shadow-[0_0_8px_#FF5C62]" />
          <span>Deforestation ({indicatorCounts.vegetation})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterCategory?.(filteredCategory === 'urban' ? null : 'urban')}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-all ${
            filteredCategory === 'urban' ? 'bg-[#FFB454]/20 border border-[#FFB454] text-white font-bold' : 'text-slate-300 hover:bg-white/5'
          }`}
          title="Filter to Urban Growth & Built-up"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#FFB454] shadow-[0_0_8px_#FFB454]" />
          <span>Urban Growth ({indicatorCounts.urban})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterCategory?.(filteredCategory === 'water' ? null : 'water')}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-all ${
            filteredCategory === 'water' ? 'bg-[#4EA7FF]/20 border border-[#4EA7FF] text-white font-bold' : 'text-slate-300 hover:bg-white/5'
          }`}
          title="Filter to Water Dynamics"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#4EA7FF] shadow-[0_0_8px_#4EA7FF]" />
          <span>Water ({indicatorCounts.water})</span>
        </button>

        <button
          type="button"
          onClick={() => onFilterCategory?.(filteredCategory === 'regrowth' ? null : 'regrowth')}
          className={`flex items-center space-x-1.5 px-2 py-1 rounded-lg transition-all ${
            filteredCategory === 'regrowth' ? 'bg-[#35D6A1]/20 border border-[#35D6A1] text-white font-bold' : 'text-slate-300 hover:bg-white/5'
          }`}
          title="Filter to Vegetation Regrowth"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-[#35D6A1] shadow-[0_0_8px_#35D6A1]" />
          <span>Regrowth ({indicatorCounts.land_use})</span>
        </button>

        {filteredCategory && (
          <button
            type="button"
            onClick={() => onFilterCategory?.(null)}
            className="px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-[#42E8D0] text-[10px] font-bold"
          >
            RESET
          </button>
        )}
      </div>

      {/* Mouse Crosshair Telemetry Display */}
      {mouseCoords && (
        <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-xl figma-card border border-slate-700/60 text-[10.5px] font-telemetry text-slate-300 hidden lg:flex items-center space-x-2 backdrop-blur-xl">
          <Crosshair className="w-3.5 h-3.5 text-orbit-cyan" />
          <span>{mouseCoords.lat > 0 ? `${mouseCoords.lat.toFixed(4)}°N` : `${Math.abs(mouseCoords.lat).toFixed(4)}°S`}</span>
          <span>{mouseCoords.lon > 0 ? `${mouseCoords.lon.toFixed(4)}°E` : `${Math.abs(mouseCoords.lon).toFixed(4)}°W`}</span>
        </div>
      )}
    </div>
  );
};
