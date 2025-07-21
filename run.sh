#!/bin/bash

echo "🚀 Starting WageWizard Project..."
echo "================================="

# Launch backend
echo "📡 Starting FastAPI backend at http://localhost:8000"
cd backend || exit
uvicorn main:app --reload &
BACKEND_PID=$!
cd ..

# Launch frontend
echo "🌐 Starting React frontend at http://localhost:3000"
cd frontend || exit
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID
wait $FRONTEND_PID
