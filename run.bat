@echo off
echo Starting WageWizard Project...
echo ===============================

REM Start backend
cd backend
echo Launching FastAPI backend on http://localhost:8000
start cmd /k "uvicorn main:app --reload"

REM Start frontend
cd ../frontend
echo Launching React frontend on http://localhost:3000
start cmd /k "npm start"

echo All systems go! 🚀
