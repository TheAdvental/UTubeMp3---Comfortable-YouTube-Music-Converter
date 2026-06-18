@echo off
echo Starting YouTube Music Downloader...

if not exist venv\Scripts\activate.bat goto RECREATE_VENV

:: Check if venv python is working
venv\Scripts\python.exe --version >nul 2>&1
if %errorlevel% neq 0 goto RECREATE_VENV

:RUN_APP
call venv\Scripts\activate.bat
cd backend
start http://localhost:8000
python -m uvicorn app:app --host 127.0.0.1 --port 8000
goto END

:RECREATE_VENV
echo [WARNING] Virtual environment not found or Python has been moved/uninstalled.
echo Finding Python to recreate virtual environment...

set PYTHON_CMD=python
where python >nul 2>nul
if %errorlevel% equ 0 goto DO_RECREATE

if exist "C:\Users\minec\AppData\Local\Programs\Python\Python313\python.exe" (
    set PYTHON_CMD="C:\Users\minec\AppData\Local\Programs\Python\Python313\python.exe"
    goto DO_RECREATE
)

if exist "C:\Users\minec\AppData\Local\Programs\Python\Python312\python.exe" (
    set PYTHON_CMD="C:\Users\minec\AppData\Local\Programs\Python\Python312\python.exe"
    goto DO_RECREATE
)

if exist "C:\Python312\python.exe" (
    set PYTHON_CMD="C:\Python312\python.exe"
    goto DO_RECREATE
)

echo Python was not found in PATH or standard folders.
echo Please ensure Python is installed and try again.
pause
exit /b 1

:DO_RECREATE
echo Found Python at: %PYTHON_CMD%
echo Rebuilding virtual environment...
if exist venv rd /s /q venv
%PYTHON_CMD% -m venv venv
if %errorlevel% neq 0 (
    echo Failed to create virtual environment.
    pause
    exit /b 1
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
goto RUN_APP

:END
pause
