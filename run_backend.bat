@echo off
setlocal enabledelayedexpansion

echo Starting JobCheck Backend...
cd /d "%~dp0backend"

if %errorlevel% neq 0 (
    echo Error: Could not find the backend directory.
    pause
    exit /b
)

:: Check if port 5000 is already in use
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000 ^| findstr LISTENING') do (
    set "PID=%%a"
    if defined PID (
        echo Warning: Port 5000 is already being used by process !PID!.
        echo Attempting to continue, but the server may fail to start.
    )
)

echo Installing dependencies (if needed)...
pip install -r ..\requirements.txt
if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies.
    pause
    exit /b
)

echo Starting Flask Server...
python app.py
pause
