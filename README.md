# SecureBank — Frontend

This repository contains the frontend for the SecureBank application. It provides the client UI, static assets, and a simple PHP shell (`index.php`) that routes requests to the backend API.

Backend repo (separate): [c:/AppServ/www/Webproject2_DB](c:/AppServ/www/Webproject2_DB)

**Quick summary**
- Frontend only — backend (API, DB, and server controllers) lives in the separate repo above.
- Optimized for local LAMP-style development and static hosting for the UI.

## Features
- Single-page app UI in `public/index.html`
- Server-side entry `index.php` to provide the frontend shell and environment-aware API URL
- CSS and JS assets under `assets/` (styles, app logic, auth, CRUD, validation, utilities)
- A small CRUD demo at `public/crud_demo.html`

## Prerequisites
- Web server that can serve PHP files (Apache, Nginx + PHP-FPM, etc.) for `index.php`.
- Backend repo available and running (see backend path above) when testing full features.

## Local setup (development)
1. Place this repo at `C:\AppServ\www\Webproject2` (or any webroot you control).
2. Place the backend repo at `C:\AppServ\www\Webproject2_DB` and configure the backend (DB, PHP) per the backend README.
3. Ensure your web server points to this folder as a site root or virtual host.
4. Open the site in your browser using the server URL (e.g. `http://localhost/Webproject2/`).

### Runtime configuration
- By default the frontend attempts to use the local backend path `/Webproject2_DB/index.php/api` for API calls.
- To use a remote backend (ngrok, tunnel, or deployed API), edit the API host setting in the root `index.html` to point to your backend host.

## GitHub Pages
- If publishing a static UI to GitHub Pages, use the root `index.html` as the Pages entrypoint and update the API host to a reachable backend URL. Do not publish `public/index.html` unless you intentionally want the local-dev artifact.

## File map (high level)
- `index.php` — frontend shell and environment helpers
- `index.html` — repo root UI entry (used for static hosting)
- `public/index.html` — SPA UI used for local development
- `public/crud_demo.html` — CRUD demo page
- `assets/css/` — `main.css`, `components.css`, `responsive.css`
- `assets/js/` — app code: `app.js`, `auth.js`, `crud.js`, `transactions.js`, `validation.js`, `utils.js`, `api.js`, `theme.js`

## Contributing
- For UI changes, edit files under `assets/` and `public/`.
- For API or DB changes, open a PR against the backend repo listed above.

## Notes
- The frontend relies on session-based login and browser state helpers; authentication and data persistence are handled by the backend.
- Keep frontend/backend config in sync by updating the API host in `index.html` when switching environments.

If you'd like, I can also add a short development checklist, npm tooling, or example environment files next.