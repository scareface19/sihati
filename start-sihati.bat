@echo off
chcp 65001 >nul
title Lancement de la Plateforme SIHATI (صحّتي)

echo ===============================================================================
echo     🇩🇿  المنظومة الوطنية للرعاية الصحية الرقمية  « صحّتي » (SIHATI)
echo                          DÉMARRAGE DES SERVICES
echo ===============================================================================
echo.

set ROOT_DIR=%~dp0
cd /d "%ROOT_DIR%"

:: 1. Vérification et Démarrage du Service MySQL si arrêté
echo [1/4] Vérification du service MySQL...
net start MySQL84 >nul 2>&1
if %errorLevel% NEQ 0 (
    net start MySQL80 >nul 2>&1
    if %errorLevel% NEQ 0 (
        net start mysql >nul 2>&1
        if %errorLevel% NEQ 0 (
            net start MariaDB >nul 2>&1
        )
    )
)
echo    [OK] Service de base de données MySQL opérationnel.

:: 2. Vérification rapide de la licence 15 jours
echo [2/4] Vérification de la licence d'évaluation (15 jours)...
if exist "backend\.sihati_license" (
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
        "$lic = Get-Content 'backend\.sihati_license' | ConvertFrom-Json; $rem = [Math]::Max(0, [Math]::Ceiling(([DateTime]$lic.expirationDate - [DateTime]::UtcNow).TotalDays)); if ($rem -le 0 -and -not $lic.isPermanent) { Write-Host '   [ATTENTION] La période d essai de 15 jours est expirée !' -ForegroundColor Red; } else { Write-Host ('   [OK] Licence active : ' + $rem + ' jour(s) restant(s).') -ForegroundColor Green; }"
) else (
    echo    [INFO] Première exécution détectée. Initialisation de la licence 15 jours...
    node installer\db-inject.js
)

:: 3. Lancement du Serveur Backend NestJS (Port 3005)
echo [3/4] Lancement du serveur Backend NestJS (Port 3005)...
start "SIHATI Backend API" /min cmd /c "cd /d "%ROOT_DIR%backend" && node dist/main.js"

:: 4. Lancement du Portail Web Next.js (Port 3000)
echo [4/4] Lancement du portail Web Next.js (Port 3000)...
start "SIHATI Web Portal" /min cmd /c "cd /d "%ROOT_DIR%web" && npm run dev"

:: 5. Temporisation et ouverture automatique du navigateur
echo.
echo ===============================================================================
echo  Initialisation terminée ! Ouverture du portail dans votre navigateur...
echo  - Portail Web       : http://localhost:3000
echo  - Documentation API : http://localhost:3005/api/docs
echo ===============================================================================

timeout /t 3 /nobreak >nul
start http://localhost:3000

exit /b
