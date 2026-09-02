@echo off
title Homie Cozie - Full System Launcher
color 0B
echo ========================================================
echo   HOMIE COZIE COFFEE & KITCHEN - ONE-CLICK SYSTEM BOOT
echo ========================================================
echo.
echo [1/4] Memeriksa status dependensi backend & frontend...
cd /d "%~dp0"

echo [2/4] Menjalankan WebSocket Server (Laravel Reverb:8080)...
start "Homie Cozie - WebSocket Reverb" /min cmd /c "cd backend && php artisan reverb:start"

echo [3/4] Menjalankan API Backend Server (Laravel:8000)...
start "Homie Cozie - API Backend" /min cmd /c "cd backend && php artisan serve --port=8000"

echo [4/4] Menjalankan Frontend React Application (Vite:5173)...
start "Homie Cozie - Frontend React" /min cmd /c "npm run dev"

timeout /t 3 /nobreak >nul

echo.
echo ========================================================
echo   SELURUH SISTEM HOMIE COZIE TELAH AKTIF!
echo   - Frontend:  http://localhost:5173
echo   - Backend:   http://localhost:8000/api/v1
echo   - WebSocket: ws://127.0.0.1:8080
echo ========================================================
echo.
echo Membuka aplikasi di peramban utama...
start http://localhost:5173
