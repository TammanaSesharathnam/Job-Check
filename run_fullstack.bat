@echo off
echo Starting JobCheck Full Stack...
start "JobCheck Backend" cmd /c run_backend.bat
start "JobCheck Frontend" cmd /c run_frontend.bat
echo Both servers are starting in separate windows.
