# API Specification

Base URL: `http://localhost:8000/api/v1`

## Health Check
- **`GET /health`**
  - **Response (200 OK):**
    ```json
    {
      "status": "healthy",
      "service": "dead-infrastructure-mapper-api",
      "version": "0.1.0"
    }
    ```

## Planned Public Endpoints (Phase 2)
- `GET /api/v1/infrastructure` - Get items within map bounds
- `GET /api/v1/infrastructure/{id}` - Get item details
- `POST /api/v1/reports` - Submit new citizen report (multipart form)
- `GET /api/v1/reports/{id}` - Get status of report

## Planned Admin Endpoints (Phase 2)
- `POST /api/v1/auth/login` - Admin authentication
- `GET /api/v1/admin/reports` - Query filtered reports
- `GET /api/v1/admin/reports/{id}` - Inspect report details + AI analysis
- `PATCH /api/v1/admin/reports/{id}/status` - Update report status
