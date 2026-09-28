# Flow Sync — Adaptive Financial Sorter

Flow Sync is a fictional digital banking experience that demonstrates how a financial decision-support layer can help a person review their monthly money picture and consider a plan. This is a **Hackathon Prototype** with synthetic data only.

## What is included

- React, TypeScript and Vite banking frontend.
- FastAPI modular monolith with explicit API schemas and deterministic mock repository.
- Banking home, accounts, activity, goals, financial overview, Flow Sync review and demo settings.
- Flow Sync financial state, explainable sample allocation policy and simulated plan acceptance.
- Local API, frontend, domain/API/UI tests and one Playwright journey.

## Run locally

Prerequisites: Node.js 20+, Python 3.10+, and Microsoft Edge for the Playwright E2E check.

```powershell
Copy-Item .env.example .env
python -m venv apps/api/.venv
apps/api/.venv/Scripts/python.exe -m pip install -r apps/api/requirements.txt
apps/api/.venv/Scripts/python.exe -m uvicorn app.main:app --app-dir apps/api --reload --host 127.0.0.1 --port 8000
```

In a second terminal:

```powershell
npm.cmd install
npm.cmd run dev
```

Open `http://127.0.0.1:5173`. Vite proxies API requests to `127.0.0.1:8000`. Check `http://127.0.0.1:8000/health` for API health.

## Quality checks

```powershell
npm.cmd run lint
npm.cmd run test
npm.cmd run build
apps/api/.venv/Scripts/python.exe -m ruff check apps/api
apps/api/.venv/Scripts/python.exe -m pytest apps/api/tests
npm.cmd run test:e2e
```

The E2E flow uses installed Microsoft Edge and assumes both local servers from the run steps are still active. Dependency audit commands: `npm.cmd audit` and `apps/api/.venv/Scripts/python.exe -m pip_audit` (install `pip-audit` separately if available). No tracker, real banking API, or external financial data source is used.

## Demo configuration and data

Copy `.env.example` for local settings. All demo financial data is in `apps/api/app/mock_data.py` and stays deterministic. No authentication gate is enabled; there are no passwords or credentials. A demo password gate is intentionally not implemented because local-only synthetic data needs no access control.

The simulated confirm route means “record that the user reviewed this plan in the running demo.” It does not move funds. Acceptance is held in process memory and resets when the API restarts.

## Safety and design

The app uses original fictional branding, an original muted red accent, and local system font fallbacks. No real bank name, logo, account data, or connection is included. Read [Architecture](docs/ARCHITECTURE.md), [Flow Sync](docs/FLOW_SYNC.md), [Security](docs/SECURITY.md), and [Implementation status](docs/IMPLEMENTATION_STATUS.md).
