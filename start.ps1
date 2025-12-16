Write-Host "Starting AI Study Guide Maker"

# Start Postgres
Write-Host "Starting PostgreSQL database (Docker)..."

# Start DB container
docker compose up -d db

# Wait for DB to be ready
Write-Host "Waiting for database to be ready..."
Start-Sleep -Seconds 3

# Start Backend
Write-Host "Starting backend (FastAPI)..."

Start-Process powershell `
    -ArgumentList "cd server; .\venv\Scripts\Activate; uvicorn app.main:app --reload" `
    -WindowStyle Normal


# Start Frontend
Write-Host "Starting frontend (Vite)..."

Start-Process powershell `
    -ArgumentList "cd client; npm run dev" `
    -WindowStyle Normal


# Info logs
Write-Host "----------------------------------------------"
Write-Host "Backend running at:   http://localhost:8000"
Write-Host "Frontend running at:  http://localhost:5173"
Write-Host "Database running at:  localhost:5433"
Write-Host "----------------------------------------------"
