@echo off
:: ===============================================
:: UTubeMp3 - Local install (Windows)
:: Creates the virtual environment and installs dependencies.
:: Safe to run again at any time (e.g. after updating Python).
:: ===============================================
setlocal EnableDelayedExpansion

:: Go to project root (parent of local\)
cd /d "%~dp0.."

echo ==============================================
echo  UTubeMp3 - Local setup
echo ==============================================
echo Project root: %CD%
echo.

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

echo Using Python: %PYTHON_CMD%
if exist venv (
    echo Removing old virtual environment...
    rd /s /q venv
)
echo Creating virtual environment...
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create virtual environment.
    pause
    exit /b 1
)

echo Installing dependencies...
venv\Scripts\python.exe -m pip install --upgrade pip -q
venv\Scripts\python.exe -m pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b 1
)

if not exist .env (
    copy /y .env.example .env >nul
    echo Created .env from .env.example ^(edit it to enable Spotify^).
)
echo.

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

echo ==============================================
echo  Setup complete! Start the app with local\run.bat
echo ==============================================
pause
