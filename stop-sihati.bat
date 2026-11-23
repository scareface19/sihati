@echo off
chcp 65001 >nul
title Arrêt de la Plateforme SIHATI (صحّتي)

echo ===============================================================================
echo     🇩🇿  المنظومة الوطنية للرعاية الصحية الرقمية  « صحّتي » (SIHATI)
echo                          ARRÊT DES SERVICES
echo ===============================================================================
echo.

echo Fermeture des processus Backend et Frontend...

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
    "Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.Path -like '*node*' } | Stop-Process -Force -ErrorAction SilentlyContinue"

echo.
echo [OK] Tous les services SIHATI ont été arrêtés proprement.
timeout /t 2 /nobreak >nul
exit /b
