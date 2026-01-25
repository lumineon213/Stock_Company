@echo off
echo 🚀 Starting Stock Game Platform...
echo.

echo 📡 Starting Stock Data API Server (Python)...
start "Stock Data API" cmd /k "cd /d c:\Users\cht31\Documents\GitHub\Stock_Company && python stock_api_server.py"

timeout /t 3 /nobreak >nul

echo 🗄️ Starting Backend Server (Node.js)...
cd /d "c:\Users\cht31\Documents\GitHub\Stock_Company\stock-game-website\backend"
start "Backend Server" cmd /k "npm run dev"

timeout /t 3 /nobreak >nul

echo ✅ All servers started!
echo 📊 Stock Data API: http://localhost:5000
echo 🖥️ Backend API: http://localhost:3000
echo 🌐 Frontend: http://localhost:3001
echo.
echo Press any key to open API test page...
pause >nul

start http://localhost:5000/health
