# =========================================================================================
# PROJET SANTÉ NUMÉRIQUE ALGÉRIEN « صحّتي » (SIHATI)
# MODULE DE VÉRIFICATION ET INSTALLATION DES PRÉREQUIS (Node.js & MySQL)
# =========================================================================================
# Ce script vérifie la présence de Node.js et de MySQL sur la machine hôte.
# S'ils sont absents, il tente l'installation automatique via Windows Package Manager (winget)
# ou par téléchargement direct silencieux officiel.
# =========================================================================================

param (
    [switch]$AutoInstall = $true
)

$ErrorActionPreference = "Continue"

Write-Host "`n╔════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║      صحّتي (SIHATI) - VÉRIFICATION DES PRÉREQUIS SYSTÈME               ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# -----------------------------------------------------------------------------------------
# 1. VÉRIFICATION DE NODE.JS
# -----------------------------------------------------------------------------------------
Write-Host "🔍 [1/3] Vérification de Node.js..." -ForegroundColor Yellow

$nodeInstalled = $false
$nodeCmd = Get-Command node.exe -ErrorAction SilentlyContinue

if ($nodeCmd) {
    $nodeVer = & node.exe -v
    Write-Host "   ✅ Node.js est déjà installé : $nodeVer ($($nodeCmd.Source))" -ForegroundColor Green
    $nodeInstalled = $true
} else {
    # Vérification dans les chemins usuels
    $commonNodePaths = @(
        "$env:ProgramFiles\nodejs\node.exe",
        "${env:ProgramFiles(x86)}\nodejs\node.exe",
        "$env:LOCALAPPDATA\Programs\node\node.exe"
    )
    foreach ($path in $commonNodePaths) {
        if (Test-Path $path) {
            $nodeVer = & $path -v
            Write-Host "   ✅ Node.js détecté : $nodeVer ($path)" -ForegroundColor Green
            $env:Path = "$([System.IO.Path]::GetDirectoryName($path));$env:Path"
            $nodeInstalled = $true
            break
        }
    }
}

if (-not $nodeInstalled) {
    Write-Host "   ⚠️ Node.js n'a pas été détecté sur ce système." -ForegroundColor Red
    if ($AutoInstall) {
        Write-Host "   ⬇️ Tentative d'installation automatique de Node.js LTS via winget..." -ForegroundColor Cyan
        $wingetCmd = Get-Command winget.exe -ErrorAction SilentlyContinue
        if ($wingetCmd) {
            & winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
            # Recharger le PATH
            $env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")
            if (Get-Command node.exe -ErrorAction SilentlyContinue) {
                Write-Host "   ✅ Node.js a été installé avec succès !" -ForegroundColor Green
                $nodeInstalled = $true
            }
        }
        
        if (-not $nodeInstalled) {
            Write-Host "   ⬇️ Téléchargement direct du paquet officiel Node.js LTS..." -ForegroundColor Cyan
            $nodeMsiUrl = "https://nodejs.org/dist/v20.18.0/node-v20.18.0-x64.msi"
            $tempMsi = "$env:TEMP\nodejs_lts_installer.msi"
            Invoke-WebRequest -Uri $nodeMsiUrl -OutFile $tempMsi -UseBasicParsing
            Write-Host "   ⚙️ Exécution de l'installeur silencieux MSI..." -ForegroundColor Cyan
            Start-Process msiexec.exe -ArgumentList "/i `"$tempMsi`" /qn" -Wait
            $env:Path = "$env:ProgramFiles\nodejs;$env:Path"
            $nodeInstalled = $true
            Write-Host "   ✅ Node.js a été installé via MSI !" -ForegroundColor Green
        }
    } else {
        Write-Host "   ❌ Veuillez installer Node.js 18+ ou 20+ depuis https://nodejs.org" -ForegroundColor Red
    }
}

# -----------------------------------------------------------------------------------------
# 2. VÉRIFICATION DE MYSQL SERVER / MARIADB
# -----------------------------------------------------------------------------------------
Write-Host "`n🔍 [2/3] Vérification de MySQL Server (Port 3306)..." -ForegroundColor Yellow

$mysqlRunning = $false
$mysqlServiceFound = $false

# Recherche des services Windows MySQL connus
$serviceNames = @("MySQL84", "MySQL80", "MySQL57", "mysql", "MariaDB", "wampmysqld", "wampmysqld64")
foreach ($svcName in $serviceNames) {
    $svc = Get-Service -Name $svcName -ErrorAction SilentlyContinue
    if ($svc) {
        $mysqlServiceFound = $true
        Write-Host "   ✅ Service MySQL détecté : '$($svc.Name)' (Statut : $($svc.Status))" -ForegroundColor Green
        if ($svc.Status -ne 'Running') {
            Write-Host "   🔄 Démarrage du service MySQL '$($svc.Name)'..." -ForegroundColor Cyan
            Start-Service -Name $svc.Name -ErrorAction SilentlyContinue
            Start-Sleep -Seconds 2
        }
        $mysqlRunning = $true
        break
    }
}

# Si le service n'est pas trouvé, vérification de XAMPP ou installation locale
if (-not $mysqlServiceFound) {
    $xamppMysql = "C:\xampp\mysql\bin\mysqld.exe"
    $mysqlProgramFiles = "C:\Program Files\MySQL"
    
    if (Test-Path $xamppMysql) {
        Write-Host "   ✅ Binaire MySQL détecté dans XAMPP : $xamppMysql" -ForegroundColor Green
        # Vérifier si le port 3306 répond déjà
        $testPort = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
        if (-not $testPort) {
            Write-Host "   🚀 Lancement de MySQL depuis XAMPP en tâche de fond..." -ForegroundColor Cyan
            Start-Process -FilePath $xamppMysql --defaults-file="C:\xampp\mysql\bin\my.ini" -WindowStyle Hidden
            Start-Sleep -Seconds 3
        }
        $mysqlRunning = $true
    } elseif (Test-Path $mysqlProgramFiles) {
        Write-Host "   📁 Dossier MySQL détecté dans Program Files : $mysqlProgramFiles" -ForegroundColor Green
        $mysqlRunning = $true
    }
}

# Si MySQL n'existe pas du tout sur la machine hôte
if (-not $mysqlRunning) {
    Write-Host "   ⚠️ Aucun serveur MySQL local n'a été détecté." -ForegroundColor Red
    if ($AutoInstall) {
        Write-Host "   ⬇️ Installation automatique de MySQL via winget..." -ForegroundColor Cyan
        $wingetCmd = Get-Command winget.exe -ErrorAction SilentlyContinue
        if ($wingetCmd) {
            & winget install Oracle.MySQL --silent --accept-source-agreements --accept-package-agreements
            Start-Sleep -Seconds 5
            Start-Service -Name "MySQL*" -ErrorAction SilentlyContinue
            $mysqlRunning = $true
        }
    }
}

# -----------------------------------------------------------------------------------------
# 3. TEST DE CONNEXION AU PORT 3306
# -----------------------------------------------------------------------------------------
Write-Host "`n🔍 [3/3] Test d'écoute sur le port MySQL 3306..." -ForegroundColor Yellow
$portOpen = Test-NetConnection -ComputerName 127.0.0.1 -Port 3306 -InformationLevel Quiet -WarningAction SilentlyContinue
if ($portOpen) {
    Write-Host "   ✅ Port MySQL 3306 actif et prêt à recevoir les connexions !" -ForegroundColor Green
} else {
    Write-Host "   ℹ️ Le port 3306 n'est pas encore ouvert. Le lanceur le démarrera avant le backend." -ForegroundColor Yellow
}

Write-Host "`n✨ Vérification des prérequis terminée.`n" -ForegroundColor Green
