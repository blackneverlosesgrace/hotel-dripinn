import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
// Use globalThis.process if available to appease non-Node linters
const env = (globalThis?.process?.env) || {};

const app = express();
app.use(cors());

const KEY = env.GOOGLE_MAPS_API_KEY;
if (!KEY) {
  console.warn('GOOGLE_MAPS_API_KEY is not set. Set it in .env in /server');
}

// Helper to build photo URL from photo_reference
function photoUrl(photo_reference, maxwidth = 1200) {
  return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=${maxwidth}&photo_reference=${photo_reference}&key=${KEY}`;
}

// ---------------- In-memory TTL Cache ----------------
// Simple cache: key -> { value, expiresAt }
const cache = new Map();
const DEFAULT_TTL = Number(env.CACHE_TTL_MS || 5 * 60 * 1000); // default 5 minutes
function setCache(key, value, ttlMs = DEFAULT_TTL) {
  cache.set(key, { value, expiresAt: Date.now() + ttlMs });
  scheduleSave();
}
function getCache(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) { cache.delete(key); return null; }
  return entry.value;
}
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of cache.entries()) {
    if (now > v.expiresAt) cache.delete(k);
  }
}, 60 * 1000);

// ---------------- Disk persistence for cache ----------------
import fs from 'fs';
import path from 'path';
const cwd = (globalThis?.process?.cwd?.() || '');
const CACHE_FILE = path.join(cwd, 'server', 'cache.json');
// Load on start
try {
  if (fs.existsSync(CACHE_FILE)) {
    const raw = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
    if (raw && typeof raw === 'object') {
      for (const [k, v] of Object.entries(raw)) {
        if (v && v.value && v.expiresAt && Date.now() < v.expiresAt) {
          cache.set(k, v);
        }
      }
    }
  }
} catch { /* ignore load errors */ }
// Save helper (debounced)
let saveTimer = null;
function saveCacheToDisk() {
  try {
    const obj = Object.fromEntries(cache.entries());
    fs.writeFileSync(CACHE_FILE, JSON.stringify(obj));
  } catch { /* ignore save errors */ }
}
function scheduleSave() {
  if (saveTimer) clearTimeout(saveTimer);
  saveTimer = setTimeout(saveCacheToDisk, 500);
}

// GET /api/search?q=...
app.get('/api/search', async (req, res) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.status(400).json({ error: 'MISSING_QUERY' });
    const noCache = String(req.query.nocache || '').trim() === '1';

    const cacheKey = `search:${q}`;
    const cached = noCache ? null : getCache(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const searchUrl = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(q)}&key=${KEY}`;
    const r = await fetch(searchUrl);
    const data = await r.json();
    if (data.status !== 'OK' || !data.results?.length) return res.status(404).json({ error: 'NOT_FOUND', details: data.status });
    const first = data.results[0];

    const placeId = first.place_id;
    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,rating,formatted_address,name&key=${KEY}`;
    const rd = await fetch(detailsUrl);
    const dd = await rd.json();
    if (dd.status !== 'OK') return res.status(400).json({ error: dd.status, details: dd.error_message });

    const photos = (dd.result.photos || []).slice(0, 6).map(p => photoUrl(p.photo_reference));
    const payload = {
      placeId,
      name: dd.result.name,
      rating: dd.result.rating || 0,
      address: dd.result.formatted_address || '',
      photos,
    };
    setCache(cacheKey, payload);
    return res.json(payload);
  } catch (e) {
    return res.status(500).json({ error: 'SERVER_ERROR', details: e.message });
  }
});

// GET /api/place/:placeId
app.get('/api/place/:placeId', async (req, res) => {
  try {
    const placeId = String(req.params.placeId || '').trim();
    if (!placeId) return res.status(400).json({ error: 'MISSING_PLACE_ID' });
    const noCache = String(req.query.nocache || '').trim() === '1';

    const cacheKey = `place:${placeId}`;
    const cached = noCache ? null : getCache(cacheKey);
    if (cached) return res.json({ ...cached, cached: true });

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=photos,rating,formatted_address,name&key=${KEY}`;
    const r = await fetch(url);
    const data = await r.json();
    if (data.status !== 'OK') return res.status(400).json({ error: data.status, details: data.error_message });
    const photos = (data.result.photos || []).slice(0, 10).map(p => photoUrl(p.photo_reference));
    const payload = {
      placeId,
      name: data.result.name,
      rating: data.result.rating || 0,
      address: data.result.formatted_address || '',
      photos,
    };
    setCache(cacheKey, payload);
    return res.json(payload);
  } catch (e) {
    return res.status(500).json({ error: 'SERVER_ERROR', details: e.message });
  }
});

// GET /api/instagram/recent — basic display API
app.get('/api/instagram/recent', async (req, res) => {
  try {
    const ACCESS_TOKEN = String(env.INSTAGRAM_ACCESS_TOKEN || '').trim();
    const USER_ID = String(env.INSTAGRAM_USER_ID || '').trim();
    if (!ACCESS_TOKEN || !USER_ID) {
      return res.json({
        items: [
          { media_url: 'https://images.unsplash.com/photo-1501117716987-c8e3a8b4c7a8?w=800&q=80', permalink: '' },
          { media_url: 'https://images.unsplash.com/photo-1505691723518-36a5b56f9f03?w=800&q=80', permalink: '' },
          { media_url: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&q=80', permalink: '' },
          { media_url: 'https://images.unsplash.com/photo-1519710884003-1b7d3f1b61f7?w=800&q=80', permalink: '' },
        ],
        note: 'Provide INSTAGRAM_ACCESS_TOKEN and INSTAGRAM_USER_ID in server/.env for live feed.'
      });
    }
    const url = `https://graph.instagram.com/${USER_ID}/media?fields=id,caption,media_url,permalink,timestamp&access_token=${ACCESS_TOKEN}`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.error) return res.status(400).json({ error: d.error.message || 'INSTAGRAM_ERROR' });
    const items = Array.isArray(d.data) ? d.data.map(p => ({ media_url: p.media_url, permalink: p.permalink, caption: p.caption, timestamp: p.timestamp })) : [];
    return res.json({ items });
  } catch (e) {
    return res.status(500).json({ error: 'SERVER_ERROR', details: e.message });
  }
});

// Simple health/status endpoint and root handler
app.get('/', (req, res) => {
  res.type('application/json').send({
    ok: true,
    service: 'DripInn Places Proxy',
    version: '1.0',
    hasKey: Boolean(KEY),
    endpoints: ['/api/search?q=...', '/api/place/:placeId']
  });
});

// Import API routes
import apiRoutes from './routes.js';

app.use(express.json());

app.use('/api', apiRoutes);

const port = env.PORT || 3001;
console.log(`[DEBUG] Starting server on port ${port}...`);
const server = app.listen(port, 'localhost', () => {
  console.log(`[SUCCESS] Hotel Dripinn API running on http://localhost:${port}`);
  console.log(`[INFO] Server is listening and accepting connections`);
});
server.on('error', (err) => {
  console.error(`[ERROR] Failed to start server on port ${port}:`, err.message);
  if (err.code === 'EADDRINUSE') console.error(`[ERROR] Port ${port} is already in use.`);
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  console.error(`[FATAL] Uncaught exception:`, err);
  process.exit(1);
});
