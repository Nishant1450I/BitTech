# Dead Infrastructure Mapper 🗺️

A reality-map platform for discovering, verifying, and reporting broken, damaged, or unusable public infrastructure (streetlights, wheelchair ramps, sidewalks, water points, bus stops, traffic signals) to urban authorities.

---

## 🏗️ Project Architecture (Monorepo)

```
Hacktoberfest/
├── frontend/        # Next.js 14/15, TypeScript, Tailwind CSS
├── backend/         # FastAPI, Python, SQLAlchemy, Pydantic
├── ai/              # AI Vision analysis, damage classification, duplicate detection
├── database/        # PostgreSQL schema definitions and seeds
└── docs/            # Architecture specs, API guides, and team workflows
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (v20+ recommended)
- **Python**: 3.10+
- **PostgreSQL**: 14+ (or Docker)

---

### 1. Backend Setup (FastAPI)

```bash
cd backend
python -m venv venv

# Windows (PowerShell / Command Prompt)
.\venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload --port 8000
```

Backend will be live at:
- **API Base**: `http://localhost:8000`
- **Health Check**: `http://localhost:8000/health`
- **Interactive Swagger Docs**: `http://localhost:8000/docs`

---

### 2. Frontend Setup (Next.js)

```bash
cd frontend

# Install packages
npm install

# Run development server
npm run dev
```

Frontend will be live at:
- **Web App**: `http://localhost:3000`

---

## 👥 Team Responsibilities (3-Developer Sprint)

| Member | Focus Area | Directory |
|---|---|---|
| **Dev 1** | Frontend UI & Interactive Map | `frontend/` |
| **Dev 2** | Backend REST APIs, DB & Storage | `backend/`, `database/` |
| **Dev 3** | AI Model Pipelines & Detection Bridge | `ai/` |

---

## 📚 Documentation
- [Setup Guide](docs/setup_guide.md)
- [Architecture & Data Flow](docs/architecture.md)
- [API Specification](docs/api_spec.md)
