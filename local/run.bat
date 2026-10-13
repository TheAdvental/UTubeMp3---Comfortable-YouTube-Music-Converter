@echo off
:: ===============================================
:: UTubeMp3 - Local run (Windows)
:: Double-click to start; works from any folder.
:: ===============================================
setlocal EnableDelayedExpansion

:: Go to project root (parent of local\)
cd /d "%~dp0.."

title UTubeMp3
echo Starting UTubeMp3 (local)...
echo Project root: %CD%
echo.

:: Recreate the venv if it is missing or Python was moved/updated
if not exist venv\Scripts\python.exe goto SETUP
venv\Scripts\python.exe -c "import fastapi, uvicorn, yt_dlp, ytmusicapi" >nul 2>&1
if %errorlevel% neq 0 goto SETUP
goto RUN_APP

:SETUP
echo [INFO] Virtual environment is missing or broken - setting it up...

:: -- Find a working Python 3.10+ ---------------------------------------------
set "PYTHON_CMD="
py -3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)" >nul 2>&1
if %errorlevel% equ 0 set "PYTHON_CMD=py -3"
if not defined PYTHON_CMD (
    python -c "import sys; sys.exit(0 if sys.version_info >= (3, 10) else 1)" >nul 2>&1
    if !errorlevel! equ 0 set "PYTHON_CMD=python"
)
if not defined PYTHON_CMD (
    echo [ERROR] Python 3.10+ was not found.
    echo         Install it from https://www.python.org/downloads/ ^(tick "Add python.exe to PATH"^)
    echo         or run:  winget install Python.Python.3.12
    pause
    exit /b 1
)

if exist venv rd /s /q venv
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment.
    pause
    exit /b 1
)
venv\Scripts\python.exe -m pip install --upgrade pip -q
venv\Scripts\python.exe -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

:RUN_APP
:: YouTube changes often; an outdated yt-dlp is the #1 reason downloads break.
echo Checking for yt-dlp updates...
venv\Scripts\python.exe -m pip install -q --disable-pip-version-check --upgrade "yt-dlp[default]" >nul 2>&1
if %errorlevel% neq 0 echo [WARNING] Could not update yt-dlp ^(offline?^) - continuing with the installed version.

:: -- Check external tools ----------------------------------------------------
where ffmpeg >nul 2>&1
if %errorlevel% neq 0 if not exist "ffmpeg.exe" (
    echo [WARNING] FFmpeg not found - MP3 conversion will fail.
    echo           Install it:  winget install Gyan.FFmpeg   ^(then reopen this window^)
    echo.
)
set "JS_OK="
where deno >nul 2>&1 && set "JS_OK=1"
where node >nul 2>&1 && set "JS_OK=1"
where bun  >nul 2>&1 && set "JS_OK=1"
if not defined JS_OK (
    echo [WARNING] No JavaScript runtime ^(Deno / Node.js^) found.
    echo           YouTube will refuse downloads with "HTTP Error 403" without it.
    echo           Install one:  winget install DenoLand.Deno   ^(then reopen this window^)
    echo.
)

set APP_ENV=local
echo Open http://127.0.0.1:8000 in your browser. Press Ctrl+C to stop.
echo.
:: Open the browser once the server had a moment to start
start "" /b cmd /c "ping -n 4 127.0.0.1 >nul & start http://127.0.0.1:8000"
cd backend
..\venv\Scripts\python.exe -m uvicorn app:app --host 127.0.0.1 --port 8000
pause
