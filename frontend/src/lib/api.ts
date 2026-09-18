import { AnalysisContext, LocationInfo } from './types';
const API_BASE = (import.meta.env.VITE_API_URL as string | undefined) || '/api';

export async function checkHealth(): Promise<{ status: string; gemini_configured: boolean }> {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Backend offline');
  return res.json();
}

export async function resolveLocation(query: string): Promise<LocationInfo> {
  const res = await fetch(`${API_BASE}/location/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to resolve location');
  }
  return res.json();
}

export async function runAnalysis(payload: {
  query: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  aoi_geojson?: any;
}): Promise<AnalysisContext> {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Analysis request failed');
  }
  return res.json();
}

export async function sendChatMessage(payload: {
  analysis_id: string;
  message: string;
  history?: Array<{ role: string; content: string }>;
}) {
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Chat query failed');
  }
  return res.json();
}

export async function explainMap(payload: {
  analysis_id: string;
  active_layer: string;
}) {
  const res = await fetch(`${API_BASE}/explain-map`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Explain map failed');
  }
  return res.json();
}

export function getGeoJsonUrl(analysisId: string): string {
  return `${API_BASE}/analysis/${analysisId}/geojson`;
}

export function getCsvUrl(analysisId: string): string {
  return `${API_BASE}/analysis/${analysisId}/csv`;
}

export async function downloadPdfReport(analysisId: string, locationName: string): Promise<void> {
  const res = await fetch(`${API_BASE}/report/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ analysis_id: analysisId }),
  });
  if (!res.ok) throw new Error('Failed to generate PDF report');
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SatQueryAI_Report_${locationName.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function getYearSatelliteImage(payload: {
  analysis_id?: string;
  bbox: number[];
  year: number;
}): Promise<{
  year: number;
  date: string;
  image_url: string;
  cloud_cover_pct: number;
  satellite: string;
  scene_id?: string;
}> {
  const res = await fetch(`${API_BASE}/analysis/year-image`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Failed to fetch satellite imagery for year ${payload.year}`);
  }
  return res.json();
}

export async function configureGeminiKey(apiKey: string): Promise<{ status: string; message: string; gemini_configured: boolean }> {
  const res = await fetch(`${API_BASE}/config/gemini-key`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || 'Failed to configure Google Gemini API key');
  }
  return res.json();
}

