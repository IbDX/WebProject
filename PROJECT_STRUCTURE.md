# SecureBank Frontend Structure

This repository contains the UI layer only.

```text
Webproject2/
├── index.php                  # Frontend entry point
├── README.md                  # Frontend repo guide
├── SECURITY.md                # Frontend security notes
├── assets/
│   ├── css/
│   │   ├── components.css
│   │   ├── main.css
│   │   └── responsive.css
│   └── js/
│       ├── api.js
│       ├── app.js
│       ├── auth.js
│       ├── crud.js
│       ├── theme.js
│       ├── transactions.js
│       ├── utils.js
│       └── validation.js
└── public/
    ├── crud_demo.html
    └── index.html
```

## Backend repo
Backend files now live in:
- `C:\AppServ\www\Webproject2_DB`

That repo owns:
- `index.php`
- `.htaccess`
- `config/database.php`
- `database_schema.sql`
- `src/`
- `public/crud_handler.php`

## Frontend-backend boundary
- Frontend handles UI rendering and browser interactions.
- Backend handles routing, authentication, models, controllers, utilities, and database access.
- Browser code calls the backend through the fixed API base path.