# RainCheck - Full Project (Frontend + Backend + Electron + CI)

This repository contains a full-stack RainCheck application scaffold:
- Frontend: React + Vite + Tailwind (UI)
- Backend: FastAPI (weather API wrapper)
- Electron: Desktop wrapper that runs the backend and loads the frontend
- CI: GitHub Actions workflow to build frontend, package backend with PyInstaller and build an Electron installer

IMPORTANT: You must provide your own OpenWeatherMap API key in `backend/.env` before running locally or in production.
See `backend/.env.example` for the variable name.

Quick local run (development):
1) Backend (in one terminal)
   cd backend
   python -m venv .venv
   .venv\Scripts\activate   (Windows) OR source .venv/bin/activate (mac/linux)
   pip install -r requirements.txt
   set OPENWEATHER_API_KEY=your_key_here    (Windows)
   export OPENWEATHER_API_KEY=your_key_here (mac/linux)
   uvicorn app.main:app --reload --port 8000

2) Frontend (in another terminal)
   cd frontend
   npm install
   npm run dev

3) Electron (in a third terminal, optional for dev)
   cd electron
   npm install
   npm run start

Building Windows installer (on Windows machine or CI):
- Frontend: npm run build -> frontend/dist
- Backend: pyinstaller --onefile app\main.py -> backend/dist/backend.exe
- Electron: electron-builder (configured in electron/package.json) will package everything into an installer.

