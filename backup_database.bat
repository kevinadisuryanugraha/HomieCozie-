@echo off
title Homie Cozie - MySQL Database Backup Automation
color 0A
echo ========================================================
echo   HOMIE COZIE COFFEE & KITCHEN - DATABASE BACKUP
echo   Date: %DATE% %TIME%
echo ========================================================
echo.

cd /d "%~dp0backend"
php artisan db:backup

if %ERRORLEVEL% EQU 0 (
    echo.
    echo [SUCCESS] Backup database selesai dengan sukses!
) else (
    echo.
    echo [ERROR] Terjadi kendala saat melakukan backup database.
)

timeout /t 5
