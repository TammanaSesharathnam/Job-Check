@echo off
echo Cleaning up old processes...
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue"
powershell -Command "Stop-Process -Id (Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue).OwningProcess -Force -ErrorAction SilentlyContinue"

echo Starting JobCheck Full Stack...
start "JobCheck Backend" cmd /c run_backend.bat
start "JobCheck Frontend" cmd /c run_frontend.bat

echo Both servers are starting in separate windows.
echo Please wait a few seconds for them to initialize.
