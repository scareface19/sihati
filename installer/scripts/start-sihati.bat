@echo off
title SIHATI - Plateforme Sante & Telemedecine
color 0B
setlocal enabledelayedexpansion

set "APP_DIR=%~dp0.."
cd /d "%APP_DIR%"

echo =======================================================================
echo    SIHATI -- PLATEFORME SANTE & TELEMEDECINE D'ALGERIE
echo =======================================================================
echo.

:: 1. Verification du binaire Node.js embarque ou systeme
set "NODE_EXE=%APP_DIR%\bin\node.exe"
if not exist "%NODE_EXE%" (
    where node >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "NODE_EXE=node"
    ) else (
        echo [ERREUR] Node.js introuvable dans bin\node.exe ou PATH systeme.
        pause
        exit /b 1
    )
)

:: 2. Demarrage automatique de MySQL local si disponible
echo [1/4] Verification du service MySQL (Port 3306)...
tasklist /fi "imagename eq mysqld.exe" | find /i "mysqld.exe" >nul
if %ERRORLEVEL% neq 0 (
    if exist "%APP_DIR%\mysql\bin\mysqld.exe" (
        echo [...] Demarrage de MySQL portable embarque...
        start "SIHATI-MySQL" /b "%APP_DIR%\mysql\bin\mysqld.exe" "--defaults-file=%APP_DIR%\mysql\my.ini" "--basedir=%APP_DIR%\mysql" "--datadir=%APP_DIR%\mysql\data" --standalone
        timeout /t 3 /nobreak >nul
    ) else if exist "C:\xampp\mysql\bin\mysqld.exe" (
        echo [...] Demarrage de MySQL via XAMPP local...
        start "XAMPP-MySQL" /b "C:\xampp\mysql\bin\mysqld.exe" --defaults-file="C:\xampp\mysql\bin\my.ini" --standalone
        timeout /t 3 /nobreak >nul
    ) else (
        echo [INFO] mysqld.exe non detecte en local. Assurez-vous que MySQL est actif sur le port 3306.
    )
) else (
    echo [OK] Serveur MySQL actif sur le port 3306.
)

:: 3. Initialisation et synchronisation de la base sihati_db
echo.
echo [2/4] Verification et initialisation de la base de donnees (sihati_db)...
"%NODE_EXE%" "%APP_DIR%\scripts\setup-sihati-db.js"

:: 4. Lancement du Serveur Backend NestJS (Port 3005)
echo.
echo [3/4] Lancement du Serveur Backend NestJS (Port 3005)...
cd /d "%APP_DIR%\backend"
start "SIHATI-Backend" /min "%NODE_EXE%" "dist\main.js"

echo [...] En attente de l'activation du Backend API (Port 3005)...
set /a backend_attempts=0
:wait_backend
set /a backend_attempts+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3005/license/status' -UseBasicParsing -TimeoutSec 1; exit 0 } catch { exit 1 }" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if !backend_attempts! geq 25 (
        echo [AVERTISSEMENT] Le Backend met du temps a demarrer, continuation...
        goto launch_web
    )
    timeout /t 1 /nobreak >nul
    goto wait_backend
)
echo [OK] Backend API operationnel sur http://localhost:3005.

:launch_web
:: 5. Lancement du Serveur Web Frontend Next.js (Port 3000)
echo.
echo [4/4] Lancement du Serveur Web Next.js (Port 3000)...
cd /d "%APP_DIR%\web"
if exist "node_modules\next\dist\bin\next" (
    start "SIHATI-Web" /min "%NODE_EXE%" "node_modules\next\dist\bin\next" start -p 3000 -H 0.0.0.0
) else (
    start "SIHATI-Web" /min "%NODE_EXE%" node_modules/next/dist/bin/next start -p 3000 -H 0.0.0.0
)

echo [...] En attente de l'activation du Portail Web (Port 3000)...
set /a web_attempts=0
:wait_web
set /a web_attempts+=1
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://localhost:3000' -UseBasicParsing -TimeoutSec 1; exit 0 } catch { exit 1 }" >nul 2>nul
if %ERRORLEVEL% neq 0 (
    if !web_attempts! geq 30 (
        echo [AVERTISSEMENT] Le Portail Web met du temps a demarrer, ouverture...
        goto open_browser
    )
    timeout /t 1 /nobreak >nul
    goto wait_web
)
echo [OK] Portail Web operationnel sur http://localhost:3000.

:open_browser
start http://localhost:3000

echo.
echo =======================================================================
echo    SIHATI EST EN COURS D'EXECUTION !
echo    - Portail Web Sante     : http://localhost:3000
echo    - API REST Backend      : http://localhost:3005/api
echo    - Documentation Swagger : http://localhost:3005/api/docs
echo =======================================================================
echo.
echo Comptes de test (Mot de passe: password123) :
echo   - Admin    : admin@sihati.dz
echo   - Medecin  : doctor@sihati.dz ou dr.ali@sihati.dz
echo   - Pharmacie: pharmacy@sihati.dz ou pharmacie@sihati.dz
echo   - Patient  : patient@sihati.dz
echo =======================================================================
echo Gardez cette fenetre ouverte pendant l'utilisation.
echo Pour arreter l'ensemble des services, lancez stop-sihati.bat.
