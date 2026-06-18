@echo off
echo ==============================================
echo Setup YouTube Music Downloader
echo ==============================================
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

echo Python was not found in PATH or standard folders.
echo Please ensure Python is installed and try again.
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
echo You can now use run.bat to start the server.
echo IMPORTANT: To convert songs to MP3, ensure 'ffmpeg' is installed on your Windows system or 'ffmpeg.exe' is placed in this directory.
echo ==============================================
pause
