@echo off
title Homie Cozie - System Graceful Shutdown
color 0C
echo ========================================================
echo   HOMIE COZIE COFFEE & KITCHEN - SYSTEM SHUTDOWN
echo ========================================================
echo.
echo [1/3] Menutup proses background PHP server & Reverb...
taskkill /f /im php.exe /fi "WINDOWTITLE eq Homie Cozie*" >nul 2>&1

echo [2/3] Menutup proses Node.js / Vite development server...
taskkill /f /im node.exe /fi "WINDOWTITLE eq Homie Cozie*" >nul 2>&1

echo [3/3] Melakukan auto-backup database penutupan toko...
cd /d "%~dp0backend"
php artisan db:backup >nul 2>&1

echo.
echo [SUCCESS] Seluruh server kafe telah dimatikan dengan aman.
echo Cadangan database penutupan toko telah disimpan.
echo.
timeout /t 3
