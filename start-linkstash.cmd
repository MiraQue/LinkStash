@echo off
chcp 65001 >nul 2>&1
cd /d "%~dp0"

echo Starting LinkStash...
set LINKSTASH_OPEN_BROWSER=1
python app.py
pause
