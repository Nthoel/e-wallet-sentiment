# Documentation

## API Documentation (Swagger)

Dokumentasi API menggunakan OpenAPI 3.0 / Swagger UI.

### Cara Akses

#### 1. Via Backend (embedded)

Jalankan backend server, lalu buka:

- **Swagger UI**: http://localhost:3001/api/docs
- **JSON Spec**: http://localhost:3001/api/docs.json

#### 2. Via Standalone Docs Server

```bash
cd docs
pnpm install
pnpm dev
```

Buka http://localhost:3002

### Struktur

```
docs/
├── package.json          # Dependencies untuk standalone server
├── server.js             # Standalone docs server (port 3002)
├── schemas/
│   ├── common.yaml       # Schema umum (error response, health)
│   ├── auth.yaml         # Schema auth (login, register, forget-password)
│   └── review.yaml       # Schema review (CRUD review)
└── README.md
```

### Menambah Endpoint Baru

1. Tambahkan `@openapi` JSDoc annotation di file route (`*.routes.js` / `*.router.js`)
2. Jika ada schema baru, tambahkan file YAML di `docs/schemas/`
3. Swagger akan otomatis membaca dari kedua sumber tersebut

### Environment Variables

| Variable       | Default                 | Keterangan                  |
| -------------- | ----------------------- | --------------------------- |
| `API_BASE_URL` | `http://localhost:3001` | URL backend server          |
| `DOCS_PORT`    | `3002`                  | Port standalone docs server |

## Architecture

See root README for architecture overview.

## Branching Guide

See root README for branching strategy.
