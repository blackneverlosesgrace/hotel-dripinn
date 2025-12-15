# Hotel App — Google Places Integration

## Setup

1. Create a server env file at `server/.env`:

```
GOOGLE_MAPS_API_KEY=REPLACE_WITH_YOUR_KEY
PORT=3001
# optional: cache TTL in ms (default 300000 = 5 minutes)
CACHE_TTL_MS=300000
```

2. Install server deps and run the proxy:

```
cd server
npm init -y
npm install express node-fetch cors dotenv
node index.js
```

3. Run the frontend:

```
cd ..
npm run dev -- --host
```

## How it works

- The server exposes `/api/search?q=...` and `/api/place/:placeId`.
- Responses are cached in-memory for `CACHE_TTL_MS`.
- Add `?nocache=1` to bypass cache for debugging: `/api/search?q=...&nocache=1`.
- Cache persistence: the server saves cache entries to `server/cache.json` and reloads fresh entries on startup to warm the cache.
- The frontend Home page fetches Google photos for the first 6 rooms and displays ratings.
- The Rooms page and Room Details also hydrate photos/ratings via the proxy.
- Keep your API key in `server/.env` (never commit it to the client).

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
