@echo off
chcp 65001 >nul
title Installation de la Plateforme SIHATI (صحّتي)

echo ===============================================================================
echo     🇩🇿  المنظومة الوطنية للرعاية الصحية الرقمية  « صحّتي » (SIHATI)
echo                   INSTALLATEUR AUTOMATIQUE CLEF EN MAIN
echo ===============================================================================
echo.
echo Vérification des privilèges Administrateur...

net session >nul 2>&1
if %errorLevel% == 0 (
    echo [OK] Privilèges Administrateur confirmés.
    powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0installer\sihati-setup.ps1"
) else (
    echo [INFO] Élévation vers le mode Administrateur en cours...
    powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process powershell.exe -ArgumentList '-NoProfile -ExecutionPolicy Bypass -File \"\"%~dp0installer\sihati-setup.ps1\"\"' -Verb RunAs"
)

exit /b
