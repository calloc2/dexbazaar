@echo off
echo Starting DexBazaar Development Servers...
echo.

if "%1"=="backend" (
    echo Starting Django backend on 0.0.0.0:8000...
    echo Running migrations...
    python manage.py migrate
    echo Populating categories...
    python manage.py populate_categories
    echo Starting server...
    python manage.py runserver 0.0.0.0:8000
) else if "%1"=="frontend" (
    echo Starting Ionic frontend on 0.0.0.0:4200...
    cd frontend
    npm start
) else (
    echo Usage:
    echo   run-dev.bat backend    # Start only Django backend
    echo   run-dev.bat frontend   # Start only Ionic frontend
    echo   docker-compose up      # Start with Docker ^(recommended^)
    echo.
    echo Both services will be available on 0.0.0.0:
    echo   Backend:  http://0.0.0.0:8000
    echo   Frontend: http://0.0.0.0:4200
    echo.
    echo For simultaneous startup, use Docker Compose or run in separate terminals.
)
