@echo off
echo Starting JobCheck Frontend...
cd /d "%~dp0client"
if %errorlevel% neq 0 (
    echo Error: Could not find the client directory.
    pause
    exit /b
)

echo Installing dependencies (if needed)...
call npm install
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b
)

echo Starting Development Server...
call npm run dev
pause
