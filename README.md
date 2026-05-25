# SecureBank Frontend

This repository now contains the frontend only.

Backend repo: [c:\AppServ\www\Webproject2_DB](c:/AppServ/www/Webproject2_DB)

## What is here
- `index.php` serves the frontend shell.
- `public/index.html` is the main app UI.
- `assets/css/` and `assets/js/` contain the client assets.
- `public/crud_demo.html` is the CRUD demo UI.

## Runtime config
The root `index.html` selects the backend automatically:
- Local development: `/Webproject2_DB/index.php/api`
- GitHub Pages: set the backend host in `index.html` to your ngrok or Cloudflare Tunnel hostname

The same pattern applies to the CRUD demo handler.

## GitHub Pages
Use the repo root `index.html` as the published Pages entrypoint.
Do not publish `public/index.html` directly; it is a local-dev artifact.

## Local use
1. Place this repo at `C:\AppServ\www\Webproject2`.
2. Place the backend repo at `C:\AppServ\www\Webproject2_DB`.
3. Import the backend schema from the backend repo.
4. Open the frontend through the web server root URL for this folder.

## Notes
- The frontend still uses the existing browser state helpers and session-based login flow.
- The backend owns the PHP controllers, models, middleware, config, and database schema.