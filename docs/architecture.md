# Architecture Specification

## Monorepo Layout

```
Hacktoberfest/
├── frontend/                     # Next.js App Router, TypeScript, Tailwind CSS
├── backend/                      # Python FastAPI, SQLAlchemy, Pydantic
├── ai/                           # AI analysis & detection module
├── database/                     # Database migrations & schemas
└── docs/                         # Architecture and API documentation
```

## Data Flow

1. **Citizen Flow**:
   - Citizen loads `/` and views the interactive map.
   - Citizen captures a broken infrastructure item (photo + GPS + description).
   - Next.js sends `POST /api/v1/reports` with multipart payload.
   - FastAPI stores report in PostgreSQL and photo in storage, returning confirmation immediately.
   - Async background worker passes image to `ai/` module to classify damage, verify category, and detect duplicates.

2. **Authority / Admin Flow**:
   - Authority logs in at `/admin/login`.
   - Accesses dashboard `/admin/dashboard` to inspect reported issues, view severity and AI confidence.
   - Updates status (e.g., `verified`, `in_progress`, `resolved`), maintaining complete audit log.
