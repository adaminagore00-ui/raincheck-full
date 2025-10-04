\
@echo off
REM Start backend in new window
start cmd /k "cd backend && python -m venv .venv && .venv\Scripts\activate && pip install -r requirements.txt && uvicorn app.main:app --reload --port 8000"
REM Start frontend dev server
start cmd /k "cd frontend && npm install && npm run dev"
REM Start electron (dev)
cd electron
npm install
npm run start
