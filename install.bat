@echo off
echo ==============================================
echo Setup YouTube Music Downloader
echo ==============================================
echo.
echo Creating virtual environment...
python -m venv venv

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
