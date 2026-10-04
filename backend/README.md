# 🗺️ Dead Infrastructure Mapper — Backend API

Production-quality, hackathon-ready REST backend service for the **Dead Infrastructure Mapper** platform. Built with **Node.js, TypeScript, Express, PostgreSQL, Prisma ORM, Zod**, and **Hugging Face Open Model Inference**.

---

## 🏗️ Backend Architecture

```
backend/
├── src/
│   ├── config/
│   │   ├── env.ts              # Strongly-typed environment variables
│   │   └── database.ts         # Prisma singleton client & connection health checker
│   ├── controllers/
│   │   ├── infrastructureController.ts  # CRUD & map markers controller
│   │   ├── reportController.ts          # Citizen reports & verification controller
│   │   ├── analyticsController.ts       # Aggregated dashboard metrics & Reality Score
│   │   └── aiController.ts              # Hugging Face inference & issue classifier
│   ├── routes/
│   │   ├── infrastructureRoutes.ts      # /api/infrastructure routes
│   │   ├── reportRoutes.ts              # /api/reports routes
│   │   ├── analyticsRoutes.ts           # /api/analytics routes
│   │   ├── realityScoreRoutes.ts        # /api/reality-score routes
│   │   ├── aiRoutes.ts                  # /api/ai routes
│   │   └── healthRoutes.ts              # /api/health & /health routes
│   ├── services/
│   │   ├── infrastructureService.ts     # Infrastructure query & status audit logic
│   │   ├── reportService.ts             # Atomic report submissions & verification
│   │   ├── analyticsService.ts          # Aggregations, timelines & area comparisons
│   │   └── aiService.ts                 # Isolated AI Provider interface with fallbacks
│   ├── middleware/
│   │   ├── errorHandler.ts              # Centralized JSON error handler
│   │   ├── validation.ts                # Zod request body & query validator
│   │   └── notFound.ts                  # 404 handler
│   ├── schemas/
│   │   ├── infrastructureSchema.ts      # Zod validation schemas for assets
│   │   ├── reportSchema.ts              # Zod validation schemas for reports
│   │   └── aiSchema.ts                  # Zod validation schemas for AI I/O
│   ├── types/
│   │   ├── infrastructure.ts            # DTOs and Enums
│   │   ├── report.ts                    # Report DTOs
│   │   └── analytics.ts                 # Overview, Timeline & Area DTOs
│   ├── utils/
│   │   ├── realityScore.ts              # Reality Score calculation engine (0-100)
│   │   └── logger.ts                    # Sanitized development/production logger
│   ├── app.ts                           # Express application & middleware setup
│   └── server.ts                        # Server entrypoint & graceful shutdown
├── prisma/
│   ├── schema.prisma                    # PostgreSQL database schema & indexes
│   └── seed.ts                          # 32 demo assets, 30 reports, 5 areas
├── docker-compose.yml                   # PostgreSQL container definition
├── .env.example                         # Environment variable template
├── package.json                         # Dependencies and npm scripts
├── tsconfig.json                        # TypeScript configuration
└── README.md
```

---

## ⚡ Quick Start & Installation

### 1. Prerequisites
- **Node.js**: v18+ (v20+ or v24+ recommended)
- **npm** or **pnpm**
- **PostgreSQL**: Local instance or Docker container

### 2. Install Dependencies
```bash
cd backend
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure `.env`:
```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/dead_infra_db?schema=public"
FRONTEND_URL="http://localhost:3000"
HF_TOKEN="your_hugging_face_user_access_token"
HF_MODEL="mistralai/Mistral-7B-Instruct-v0.3"
```

### 4. Database Setup (PostgreSQL + Prisma)

#### Option A: Using Docker (Recommended for quick start)
```bash
docker-compose up -d
```

#### Option B: Using local PostgreSQL
Create a database named `dead_infra_db`.

#### Generate Prisma Client & Push Schema:
```bash
npm run prisma:generate
npm run prisma:push
```

#### Populate Demo Data (32 Assets, 30 Reports, 5 Areas):
```bash
npm run prisma:seed
```

### 5. Run the Backend
```bash
# Development (with hot-reload)
npm run dev

# Production Build & Start
npm run build
npm run start
```

Backend will be active at:
- **Base URL**: `http://localhost:5000`
- **Health Check**: `http://localhost:5000/api/health`

---

## 📊 The Reality Score™ Algorithm

The **Reality Score (0 - 100)** measures the real-world operational usability of public infrastructure in an urban area.

$$\text{Reality Score} = \text{Base Usability Ratio} - \text{Weighted Defect Penalties} - \text{Severity Deductions} - \text{Unresolved Friction} + \text{Verification Confidence Bonus}$$

### Factor Breakdown:
1. **Base Usability**: Percentage of assets with `WORKING` status ($working / total \times 100$).
2. **Defect Deductions**: `BROKEN` (-10), `MISSING` (-12), `INACCESSIBLE` (-8), `WARNING` (-4).
3. **Severity Weighting**: `CRITICAL` (-8 scaled), `HIGH` (-4 scaled), `MEDIUM` (-2 scaled).
4. **Verification Confidence**:
   - `OFFICIALLY_VERIFIED`: Full 1.0 weight on penalty or +5% score bonus.
   - `COMMUNITY_VERIFIED`: 0.85 weight.
   - `UNVERIFIED`: 0.50 weight (unverified citizen reports have lesser negative impact until verified).
5. **Rating Bands**:
   - `80 - 100`: **EXCELLENT** (Green)
   - `60 - 79`: **GOOD** (Teal)
   - `40 - 59`: **DEGRADED** (Amber)
   - `20 - 39`: **POOR** (Orange-Red)
   - `0 - 19`: **CRITICAL** (Red)

---

## 📡 REST API Reference

### 1. Infrastructure (`/api/infrastructure`)

#### `GET /api/infrastructure`
Query parameters:
- `type`: `STREETLIGHT` | `FOOTPATH` | `WHEELCHAIR_RAMP` | `PUBLIC_TOILET` | `DRINKING_WATER` | `BUS_STOP` | `TRAFFIC_SIGNAL` | `OTHER`
- `status`: `WORKING` | `WARNING` | `BROKEN` | `MISSING` | `INACCESSIBLE` | `UNKNOWN`
- `severity`: `LOW` | `MEDIUM` | `HIGH` | `CRITICAL`
- `verificationStatus`: `UNVERIFIED` | `COMMUNITY_VERIFIED` | `OFFICIALLY_VERIFIED`
- `lat`, `lng`, `radiusKm`: Bounding radius filter
- `format`: `full` (default) or `markers` (optimized lightweight DTO for map rendering)
- `page`, `limit`: Pagination parameters

**Example Response (`format=markers`):**
```json
{
  "success": true,
  "data": [
    {
      "id": "c1f7a08b-...",
      "type": "STREETLIGHT",
      "name": "Solar Streetlight Pole #CR-102",
      "status": "BROKEN",
      "severity": "HIGH",
      "latitude": 19.9981,
      "longitude": 73.7905,
      "address": "Near RYK Science College Gate 2, College Road",
      "reportCount": 3,
      "verificationStatus": "OFFICIALLY_VERIFIED"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 32,
    "totalPages": 1
  }
}
```

#### `GET /api/infrastructure/:id`
Returns full asset profile including recent reports and status history audit timeline.

#### `POST /api/infrastructure`
Registers a new infrastructure asset.

#### `PATCH /api/infrastructure/:id`
Updates asset fields. Status transitions automatically record audit log entries in `InfrastructureStatusHistory`.

#### `DELETE /api/infrastructure/:id`
Deletes an infrastructure asset.

---

### 2. Citizen Reports (`/api/reports`)

#### `POST /api/reports`
Submits a new citizen problem report.
```json
{
  "infrastructureId": "c1f7a08b-...",
  "issueType": "BROKEN",
  "description": "Streetlight luminaire cracked and unlit during nighttime.",
  "severity": "HIGH",
  "latitude": 19.9981,
  "longitude": 73.7905,
  "imageUrl": "https://example.com/photo.jpg",
  "reporterName": "Aarav Sharma"
}
```

#### `POST /api/reports/:id/verify`
Adds official or community verification to a report:
```json
{
  "verificationType": "OFFICIAL",
  "verifiedBy": "Ward Sanitation Officer",
  "notes": "Verified physical blockage on site."
}
```

---

### 3. Analytics & Reality Score (`/api/analytics` & `/api/reality-score`)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/analytics/overview` | Executive metrics: total assets, working, broken, resolution rate |
| `GET` | `/api/analytics/status` | Breakdown counts & percentages by status |
| `GET` | `/api/analytics/types` | Breakdown by asset type (working vs broken) |
| `GET` | `/api/analytics/timeline?days=14` | Submissions & resolutions timeline series |
| `GET` | `/api/analytics/areas` | Area-wise Reality Scores & metrics |
| `GET` | `/api/reality-score/:areaId` | Deep Reality Score breakdown for specific area |
| `GET` | `/api/reality-score/compare` | Sorted comparison array of all urban areas |

**Example Area Reality Score Response (`GET /api/reality-score/:areaId`):**
```json
{
  "success": true,
  "data": {
    "areaId": "91a4b9c1-...",
    "areaName": "College Road Urban Sector",
    "totalAssets": 6,
    "workingAssets": 2,
    "brokenAssets": 2,
    "warningAssets": 1,
    "inaccessibleAssets": 1,
    "realityScore": 38,
    "rating": "POOR",
    "formulaExplanation": "Reality Score = Usability Ratio - Weighted Defect Penalty - Critical/High Severity Deduction - Unresolved Reports Friction + Verification Confidence Adjustment"
  }
}
```

---

### 4. AI Inference (`/api/ai`)

#### `POST /api/ai/analyze-report`
Analyzes report text and returns classified damage category, severity, and structured summary.
```json
{
  "description": "The streetlight fixture on 5th avenue was hit by a truck and has live wires dangling.",
  "infrastructureType": "STREETLIGHT"
}
```
**Response:**
```json
{
  "success": true,
  "data": {
    "issueCategory": "UNSAFE",
    "severity": "CRITICAL",
    "summary": "STREETLIGHT: Live wires dangling after collision.",
    "confidence": 0.95
  }
}
```

#### `POST /api/ai/classify-issue`
```json
{
  "description": "Water fountain tap has been stolen."
}
```

#### `POST /api/ai/summarize-report`
```json
{
  "description": "Citizen long narrative report..."
}
```

---

## 🤖 Hugging Face Integration & Resilience

1. **Provider Abstraction**: The backend interacts exclusively via `AIService` (`IAIProvider` interface). Hugging Face can be swapped with local Ollama, vLLM, or OpenAI without touching controllers.
2. **Never Fails the Core API**: If `HF_TOKEN` is unset, rate limited, or Hugging Face is unreachable, `AIService` automatically falls back to an intelligent heuristic NLP engine and logs a warning. The core civic reporting system **never crashes**.
3. **Zod Output Validation**: All AI responses pass through strict Zod parsers to guarantee well-typed outputs.

---

## 🛡️ Security & Quality Features
- **Helmet.js** security headers.
- **Configurable CORS** via `FRONTEND_URL`.
- **Express Rate Limiter** on `/api/*`.
- **Sanitized Logging**: API tokens (`hf_*`), passwords, and database credentials are automatically redacted from console logs.
- **Input Sanitization & Validation** with Zod on every route.

---

## 🧪 Running Tests

```bash
npm test
```
Runs Jest unit & integration test suites covering Reality Score calculation, AI resilience, Supertest API endpoints, and validation guards.
