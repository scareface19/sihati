@echo off
title SIHATI - Initialisation BDD
set "APP_DIR=%~dp0.."
cd /d "%APP_DIR%"
set "NODE_EXE=%APP_DIR%\bin\node.exe"
if not exist "%NODE_EXE%" set "NODE_EXE=node"
"%NODE_EXE%" "%APP_DIR%\scripts\setup-sihati-db.js"
pause
