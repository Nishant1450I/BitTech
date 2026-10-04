# Development & Setup Guide

This guide details the step-by-step instructions for all three team members to set up their local environments.

---

## 1. Prerequisites Check

Before starting, verify you have the required runtimes installed:

```bash
node -v      # v18.0.0 or higher
npm -v       # v9.0.0 or higher
python --version  # Python 3.10 or higher
```

---

## 2. Setting up the Backend (`backend/`)

1. Open your terminal in the workspace root and navigate to `backend`:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your local environment configuration:
   ```bash
   cp .env.example .env
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```

6. Verify that `http://localhost:8000/health` returns `{"status": "healthy", "service": "dead-infrastructure-mapper-api"}`.

---

## 3. Setting up the Frontend (`frontend/`)

1. Open a new terminal in the workspace root and navigate to `frontend`:
   ```bash
   cd frontend
   ```

2. Install npm dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Run the Next.js development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`.

---

## 4. Git Collaboration Guidelines

- **Branch Naming**:
  - `feat/feature-name` (e.g. `feat/citizen-report-form`, `feat/admin-triage-table`)
  - `fix/bug-description` (e.g. `fix/cors-origin-issue`)
- **Do not commit:** `.env`, `.env.local`, `venv/`, `node_modules/`, `.next/`, `uploads/`.
- **Merge Process:** Push your feature branch, open a PR against `dev` (or `main`), have one teammate review, and merge.
