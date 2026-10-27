# CollaBro Photography Dashboard

A role-specific creative workspace for photographers within the CollaBro platform — where creators connect.

---

## Purpose

The Photography Dashboard lets authenticated CollaBro photographers:

- View and manage their photography projects
- Create new projects with title, description, category, status, and a cover image
- Edit project details, collaborators, tasks, and reference images from the Project Workspace
- Track task progress with a live progress bar
- Use the Photo Studio panel for moodboards, shot lists, and creative notes
- Discover other creators and save favourites
- Edit their CollaBro profile (name, username, bio, skills, profile picture URL)
- Sign in and sign out through the main CollaBro application

---

## Project Structure

```
photography-dashbaord/          ← project root (this folder)
├── src/
│   ├── main.jsx                ← Vite entry point
│   ├── App.jsx                 ← route definitions
│   ├── PhotographerDashboard.jsx   ← main dashboard view
│   ├── ProjectDetailsPage.jsx  ← per-project workspace
│   ├── ProjectForm.jsx         ← create / edit project modal
│   ├── DashboardDialogs.jsx    ← profile, settings, messages, creator dialogs
│   ├── dashboardApi.js         ← centralised API client (proxied to Auth server)
│   ├── dashboardData.js        ← seed/static data for featured projects & creators
│   ├── dashboardStorage.js     ← localStorage fallback for preview (offline) mode
│   ├── PhotographerDashboard.css
│   ├── index.css
│   └── components/
│       ├── CustomCursor.jsx
│       └── ToastSystem.jsx
├── index.html
├── vite.config.js              ← Vite proxy → Auth server (port 5000)
├── package.json
├── .env.example                ← template — all values blank
├── .gitignore
└── README.md                   ← this file
```

---

## How Authentication Works

The Photography Dashboard does **not** have its own backend or database. It relies entirely on the **CollaBro Auth server** (`CollaBro Login Page/server/`).

Authentication flow:

1. The user signs in on the main CollaBro app (port 5111).
2. The auth server sets an **HttpOnly JWT cookie** (`collabro_token`) that is valid across the same domain / localhost.
3. The photography dashboard's Vite dev server **proxies** all `/api` requests to the auth server on port 5000.
4. The auth server's `protect` middleware reads the cookie and identifies the user.
5. The dashboard calls `GET /api/auth/me` on mount to retrieve the authenticated user's profile.
6. Projects are fetched from `GET /api/projects` and saved to `POST /api/projects`.

If the auth server is unavailable or the user is not signed in, the dashboard falls back to **preview mode** using `localStorage`. Projects in preview mode are clearly labelled as device-only.

---

## API Endpoints Used

All endpoints are served by the **CollaBro Auth server** (default: `http://localhost:5000`), proxied through Vite.

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/auth/me` | Get the current authenticated user and profile |
| `PATCH` | `/api/auth/profile` | Update name, username, bio, skills, profile picture URL |
| `POST` | `/api/auth/logout` | Sign out (clears the JWT cookie) |
| `GET` | `/api/projects` | List the authenticated user's projects |
| `POST` | `/api/projects` | Create a new project |
| `GET` | `/api/projects/:id` | Get a single owned project |
| `PUT` | `/api/projects/:id` | Update a project (title, tasks, notes, collaborators, etc.) |
| `DELETE` | `/api/projects/:id` | Delete a project |

---

## MongoDB

The photography dashboard does not connect to MongoDB directly. All data persistence is handled by the CollaBro Auth server.

To set up MongoDB for the Auth server:

1. Install [MongoDB Community Edition](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Set the `MONGODB_URI` environment variable in `CollaBro Login Page/.env`.
3. Start the Auth server — Mongoose will create collections automatically.

---

## Configuration

### Photography Dashboard Frontend

Copy `.env.example` to `.env` inside this folder and fill in:

```env
VITE_AUTH_APP_URL=http://localhost:5111
```

`VITE_AUTH_APP_URL` is the URL of the main CollaBro application. Unauthenticated users are redirected there to sign in. If left blank, the default `http://localhost:5111` is used.

### Auth Server

Configure the Auth server using `CollaBro Login Page/.env`. Required variables:

```
PORT=5000
MONGODB_URI=<your-mongodb-connection-string>
JWT_SECRET=<a-long-random-secret>
JWT_EXPIRES_IN=7d
COOKIE_SECRET=<another-long-random-secret>
NODE_ENV=development
CLIENT_URL=http://localhost:5111
```

---

## Running the Application

### Prerequisites

- Node.js 18 or newer
- npm 9 or newer
- The **CollaBro Auth server** must be running before using the dashboard

### 1 — Install dependencies (first time)

```bash
# Inside this folder:
npm install

# Also install Auth server dependencies (if not already done):
cd "../CollaBro Login Page"
npm install
```

### 2 — Start the Auth server

```bash
cd "../CollaBro Login Page"
npm run server
# → Backend running at http://localhost:5000
```

### 3 — Start the Photography Dashboard

```bash
# Inside photography-dashbaord/:
npm run dev
# → Dashboard running at http://localhost:5175
```

### 4 — Open the dashboard

Navigate to **http://localhost:5175** in your browser.

Sign in first at **http://localhost:5111** (the main CollaBro app) so the auth cookie is set.

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 5175) |
| `npm run build` | Build for production to `dist/` |
| `npm run preview` | Preview the production build locally |

---

## Image Uploads

The photography dashboard uses **canvas-based client-side compression** for project cover images. Images are resized to at most 1200 × 900 px and compressed to JPEG before being stored in the project's `coverImage` field in MongoDB (via the Auth server).

Profile pictures are stored as a URL string in the user record. You can enter any valid `https://` URL in the profile editor.

For avatar file uploads, use the `POST /api/auth/profile/picture` endpoint on the Auth server (multipart form, max 5 MB).

---

## Feature Behaviour Summary

| Feature | Works Without Auth | Persists to Database |
|---------|:-----------------:|:--------------------:|
| Browse featured projects | ✓ | — |
| Discover creators | ✓ | — |
| Create / edit projects | ✓ (local preview) | ✓ (when signed in) |
| Project tasks & progress | ✓ (local preview) | ✓ (when signed in) |
| Profile edit | ✓ (local preview) | ✓ (when signed in) |
| Favourites | ✓ (localStorage) | — |
| Shot list & notes | ✓ (localStorage) | — |
| Message drafts | ✓ (localStorage) | — |
| Sign out | Redirects to sign-in | ✓ |

---

## Deployment Notes

- The Vite proxy (`/api → localhost:5000`) is a **development-only** feature.
- In production, configure your hosting provider (e.g. Nginx, Vercel) to route `/api` requests to the Auth server.
- The `VITE_AUTH_APP_URL` environment variable must point to the deployed Auth frontend URL.
- Set `NODE_ENV=production` on the Auth server and use HTTPS to ensure cookies are secure.
- MongoDB Atlas or another managed database is recommended for production deployments.
