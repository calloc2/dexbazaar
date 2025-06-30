#!/usr/bin/env pwsh
# Development server startup script for DexBazaar
# This script starts both frontend and backend services on 0.0.0.0

Write-Host "Starting DexBazaar Development Servers..." -ForegroundColor Green

# Function to run backend
function Start-Backend {
    Write-Host "Starting Django backend on 0.0.0.0:8000..." -ForegroundColor Yellow
    Set-Location -Path "."
    Write-Host "Running migrations..." -ForegroundColor Cyan
    python manage.py migrate
    Write-Host "Populating categories..." -ForegroundColor Cyan
    python manage.py populate_categories
    Write-Host "Starting server..." -ForegroundColor Cyan
    python manage.py runserver 0.0.0.0:8000
}

# Function to run frontend
function Start-Frontend {
    Write-Host "Starting Ionic frontend on 0.0.0.0:4200..." -ForegroundColor Yellow
    Set-Location -Path "frontend"
    npm start
}

# Check if running with -Backend or -Frontend flags
param(
    [switch]$Backend,
    [switch]$Frontend,
    [switch]$Both
)

if ($Backend) {
    Start-Backend
} elseif ($Frontend) {
    Start-Frontend
} else {
    # Default: show instructions
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\run-dev.ps1 -Backend    # Start only Django backend" -ForegroundColor White
    Write-Host "  .\run-dev.ps1 -Frontend   # Start only Ionic frontend" -ForegroundColor White
    Write-Host "  docker-compose up         # Start with Docker (recommended)" -ForegroundColor White
    Write-Host ""
    Write-Host "Both services will be available on 0.0.0.0:" -ForegroundColor Green
    Write-Host "  Backend:  http://0.0.0.0:8000" -ForegroundColor White
    Write-Host "  Frontend: http://0.0.0.0:4200" -ForegroundColor White
    Write-Host ""
    Write-Host "For simultaneous startup, use Docker Compose or run in separate terminals." -ForegroundColor Yellow
}
