@echo off
:: ===============================================
:: UTubeMp3 - Local Install Script
:: Run once to set up the virtual environment
:: ===============================================
setlocal

:: Go to project root (parent of local\)
cd /d "%~dp0.."

echo ==============================================
echo Setup UTubeMp3 (Local)
echo ==============================================
echo Project root: %CD%
echo.

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% equ 0 goto DO_CREATE

if exist "C:\Users\minec\AppData\Local\Programs\Python\Python313\python.exe" (
    set PYTHON_CMD="C:\Users\minec\AppData\Local\Programs\Python\Python313\python.exe"
    goto DO_CREATE
)
if exist "C:\Users\minec\AppData\Local\Programs\Python\Python312\python.exe" (
    set PYTHON_CMD="C:\Users\minec\AppData\Local\Programs\Python\Python312\python.exe"
    goto DO_CREATE
)
if exist "C:\Python312\python.exe" (
    set PYTHON_CMD="C:\Python312\python.exe"
    goto DO_CREATE
)

echo Python was not found. Please install Python and try again.
pause
exit /b 1

:DO_CREATE
echo Creating virtual environment using: %PYTHON_CMD%
if exist venv rd /s /q venv
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo Failed to create virtual environment.
    pause
    exit /b 1
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo ==============================================
echo Setup Complete!
echo Run local\run.bat to start the server.
echo IMPORTANT: Make sure 'ffmpeg' is installed on
echo your Windows system (e.g. via winget or chocolatey)
echo ==============================================
pause
