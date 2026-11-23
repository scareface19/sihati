@echo off
setlocal enabledelayedexpansion
title Compilation de l'Installeur Windows -- SIHATI
color 0B
echo =======================================================================
echo    SIHATI -- COMPILATION DE L'INSTALLEUR WINDOWS (.EXE)
echo =======================================================================
echo.

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%.."
cd /d "%ROOT_DIR%"

:: 1. Verification de l'utilitaire Inno Setup 6
set "ISCC=C:\Program Files (x86)\Inno Setup 6\ISCC.exe"
if not exist "!ISCC!" (
    set "ISCC=C:\Program Files\Inno Setup 6\ISCC.exe"
)

if not exist "!ISCC!" (
    where ISCC.exe >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        set "ISCC=ISCC.exe"
    ) else (
        echo [ERREUR] Inno Setup 6 n'est pas installe ou ISCC.exe introuvable.
        echo Veuillez installer Inno Setup 6 : https://jrsoftware.org/isdl.php
        pause
        exit /b 1
    )
)
echo [OK] Compilateur Inno Setup detecte : "!ISCC!"
echo.

:: 2. Verification de Node.js
set "NODE_EXE=C:\Program Files\nodejs\node.exe"
if not exist "!NODE_EXE!" (
    where node.exe >nul 2>nul
    if %ERRORLEVEL% equ 0 (
        for /f "delims=" %%I in ('where node.exe') do set "NODE_EXE=%%I"
    )
)
echo [OK] Runtime Node.js detecte : "!NODE_EXE!"
echo.

:: 3. Creation du package d'installation Windows (.exe)
echo [1/1] Creation du package autonome d'installation Windows (.exe)...
cd /d "%SCRIPT_DIR%"
"!ISCC!" Sihati.iss
if %ERRORLEVEL% neq 0 (
    echo [ERREUR] Echec de la compilation Inno Setup.
    pause
    exit /b 1
)

:: Copier une copie a la racine pour acces direct
if exist "%ROOT_DIR%\dist\Sihati-Setup-v1.0.0.exe" (
    copy /y "%ROOT_DIR%\dist\Sihati-Setup-v1.0.0.exe" "%ROOT_DIR%\Sihati-Setup-v1.0.0.exe" >nul
)

echo.
echo =======================================================================
echo    INSTALLEUR SIHATI CREE AVEC SUCCES !
echo =======================================================================
echo Fichier genere : %ROOT_DIR%\Sihati-Setup-v1.0.0.exe
echo.
echo Cet installeur contient :
echo   - Le Backend NestJS compile
echo   - Le Frontend Next.js optimise
echo   - Le Serveur MySQL Portable embarque
echo   - Le Runtime Node.js embarque
echo   - L'initialisation automatique de la base sihati_db
echo =======================================================================
pause
