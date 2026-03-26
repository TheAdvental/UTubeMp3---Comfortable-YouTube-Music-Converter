# UTubeMp3 - Comfortable YouTube Music Converter

***"Good morning, afternoon, or evening (right now it's 1:52 AM for me). This is a solution to my painful problem (downloading music) vibecoded in an hour. I needed to solve the problem of downloading large volumes of music as quickly as possible, so I added the ability to download entire albums at once. But that's not the point, I hope this site will be as useful to someone else as it was to me in its time. I might update this product in the future, although I'm satisfied with it in its current form (except for a few minor details). Alright, I'm going to sleep, I'm tired of writing this text. In the meantime, here is a tutorial from Gemini 3.1 Pro for running this site."***

---

## Tutorial by Gemini 3.1 Pro 🚀

Welcome to **UTubeMp3**! This application uses a sleek frontend interface and a fast Python backend to fetch, search, and seamlessly convert YouTube Music tracks directly into local MP3 files. 

Follow these simple steps to launch your music downloader locally on your Windows machine.

### Prerequisites
1. **Python**: Ensure you have Python installed on your computer.
2. **FFmpeg**: You must have `ffmpeg` installed to handle the audio conversion process. 
   - You can either install it globally and add it to your system's `PATH`.
   - Or, simply download `ffmpeg.exe` and place it directly inside this project's root folder.

### Installation
Double-click and run the `install.bat` script. This simple script will automatically:
- Set up an isolated Python virtual environment (`venv`).
- Activate the environment.
- Install all necessary backend packages listed in `requirements.txt`.

### Running the Application
Whenever you want to use the downloader, just double-click `run.bat`.
1. It will boot up the Python FastAPI backend server locally on port `8000`.
2. Once the backend is running, open the `frontend/index.html` file in your preferred web browser to access the website.
3. Start searching your favorite artists, browse their albums, and build your MP3 library!

*(Note: All your converted MP3s will magically appear inside the `downloads` folder for your convenience!)*