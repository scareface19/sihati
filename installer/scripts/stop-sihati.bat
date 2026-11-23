@echo off
title SIHATI - Arret des Services
color 0C
setlocal enabledelayedexpansion

echo =======================================================================
echo    SIHATI -- ARRET DE TOUS LES SERVICES
echo =======================================================================
echo.

echo Arrêt des processus Node.js associés à SIHATI...
wmic process where "name='node.exe' and (commandline like '%%dist\\main.js%%' or commandline like '%%next%%' or commandline like '%%Sihati%%')" call terminate >nul 2>nul
powershell -NoProfile -Command "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'node.exe' -and ($_.CommandLine -like '*dist\main.js*' -or $_.CommandLine -like '*next*' -or $_.CommandLine -like '*Sihati*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

echo Arrêt du serveur MySQL embarqué si actif...
taskkill /f /im mysqld.exe /fi "WINDOWTITLE eq SIHATI-MySQL*" >nul 2>nul
powershell -NoProfile -Command "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'mysqld.exe' -and ($_.CommandLine -like '*Sihati*' -or $_.CommandLine -like '*SIHATI*') } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }" >nul 2>nul

echo [OK] Tous les composants SIHATI ont été arrêtés proprement.
timeout /t 2 /nobreak >nul
