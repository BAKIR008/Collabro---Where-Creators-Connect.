# Photographer Dashboard

Standalone React/Vite app for the CollaBro photographer dashboard.

## Run locally

```powershell
npm install
npm run dev
```

Vite serves the dashboard at `http://localhost:5174/`. The `/api` proxy forwards to the existing CollaBro API at `http://localhost:5000`; the dashboard itself also works with its sample content when the API is unavailable.

Create a production build with `npm run build`.
