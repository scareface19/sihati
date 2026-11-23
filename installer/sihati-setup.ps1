# =========================================================================================
# PROJET SANTÉ NUMÉRIQUE ALGÉRIEN « صحّتي » (SIHATI)
# INSTALLATEUR MAÎTRE CLEF EN MAIN (TURNKEY MASTER INSTALLER)
# =========================================================================================
# Ce script réalise l'installation intégrale de la plateforme SIHATI :
#  1. Élévation automatique des privilèges Administrateur Windows
#  2. Détection et installation automatique de Node.js et MySQL si absents
#  3. Démarrage du service MySQL et injection automatique des fichiers SQL (schema + seed 560 médocs)
#  4. Génération de la licence d'évaluation sécurisée de 15 jours (signature HMAC-SHA256)
#  5. Création des raccourcis de bureau et menu Démarrer (صحّتي - SIHATI.lnk)
#  6. Démarrage facultatif immédiat de l'application
# =========================================================================================

# Vérification des privilèges Administrateur
$isAdmin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "🔐 Élévation des privilèges Administrateur requise pour l'installation..." -ForegroundColor Cyan
    Start-Process powershell.exe -ArgumentList "-NoProfile -ExecutionPolicy Bypass -File `"$PSCommandPath`"" -Verb RunAs
    exit
}

$RootDir = Split-Path -Parent $PSScriptRoot
if (-not $RootDir) { $RootDir = "D:\Sihati" }
Set-Location $RootDir

Clear-Host
Write-Host "╔════════════════════════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║                                                                                ║" -ForegroundColor Green
Write-Host "║            🇩🇿  المنظومة الوطنية للرعاية الصحية الرقمية  « صحّتي »             ║" -ForegroundColor Green
Write-Host "║                PLATEFORME DE SANTÉ NUMÉRIQUE ALGÉRIENNE - SIHATI               ║" -ForegroundColor Green
Write-Host "║                     INSTALLATEUR AUTOMATIQUE CLEF EN MAIN                      ║" -ForegroundColor Green
Write-Host "║                                                                                ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host "📁 Répertoire d'installation : $RootDir`n" -ForegroundColor DarkCyan

# -----------------------------------------------------------------------------------------
# ÉTAPE 1 : CONTRÔLE ET INSTALLATION DES DÉPENDANCES LOGICIELLES (NODE.JS & MYSQL)
# -----------------------------------------------------------------------------------------
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "🔹 [ÉTAPE 1/5] Vérification et Déploiement des Dépendances (Node.js & MySQL)..." -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

& "$RootDir\installer\check-prerequisites.ps1" -AutoInstall

# -----------------------------------------------------------------------------------------
# ÉTAPE 2 : DÉMARRAGE MYSQL ET INJECTION DU SCHÉMA ET DES DONNÉES SQL (SCHEMA + SEED)
# -----------------------------------------------------------------------------------------
Write-Host "`n══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "🔹 [ÉTAPE 2/5] Initialisation MySQL et Injection des Fichiers SQL..." -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

$nodeExe = "node.exe"
if (-not (Get-Command $nodeExe -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:ProgramFiles\nodejs\node.exe") {
        $nodeExe = "$env:ProgramFiles\nodejs\node.exe"
    }
}

Write-Host "   ⚙️ Exécution du script d'injection SQL automatique..." -ForegroundColor Cyan
& $nodeExe "$RootDir\installer\db-inject.js"

# -----------------------------------------------------------------------------------------
# ÉTAPE 3 : INITIALISATION DE LA LICENCE SÉCURISÉE DE 15 JOURS ("MARCHE 15 JOURS ET S'ARRÊTE")
# -----------------------------------------------------------------------------------------
Write-Host "`n══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "🔹 [ÉTAPE 3/5] Activation de la Période d'Évaluation de 15 Jours..." -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

$licenseFile = "$RootDir\backend\.sihati_license"
$now = [DateTime]::UtcNow
$expiry = $now.AddDays(15)

$installDateIso = $now.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
$expiryDateIso = $expiry.ToString("yyyy-MM-ddTHH:mm:ss.fffZ")

# Calcul de l'empreinte matérielle de l'ordinateur
$machineRaw = "$env:COMPUTERNAME`_$env:PROCESSOR_ARCHITECTURE`_SIHATI_CORE"
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$fingerprintBytes = $sha256.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($machineRaw))
$machineFingerprint = -join ($fingerprintBytes | ForEach-Object { "{0:x2}" -f $_ })

# Calcul de la signature HMAC-SHA256 pour interdire toute modification manuelle
$secretKey = [System.Text.Encoding]::UTF8.GetBytes("SIHATI_ALGERIA_SECURITY_SALT_2026_TRIAL_PROTECTION_KEY_ANPP_DSP")
$payloadStr = "SIHATI-ALGERIA-HEALTHCARE-SYSTEM|$installDateIso|$expiryDateIso|15|$machineFingerprint|False"
$hmac = New-Object System.Security.Cryptography.HMACSHA256
$hmac.Key = $secretKey
$sigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($payloadStr))
$signature = -join ($sigBytes | ForEach-Object { "{0:x2}" -f $_ })

# Écriture du fichier de licence chiffré / signé
$licenseObj = [PSCustomObject]@{
    appName               = "SIHATI-ALGERIA-HEALTHCARE-SYSTEM"
    installationDate      = $installDateIso
    expirationDate        = $expiryDateIso
    trialDays             = 15
    machineFingerprint    = $machineFingerprint
    lastRecordedTimestamp = [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds()
    isPermanent           = $false
    signature             = $signature
}

$licenseObj | ConvertTo-Json -Depth 4 | Set-Content -Path $licenseFile -Encoding UTF8

Write-Host "   ✅ Licence d'évaluation initialisée avec succès !" -ForegroundColor Green
Write-Host "   📅 Date d'installation  : $installDateIso" -ForegroundColor Gray
Write-Host "   ⏳ Date d'expiration    : $expiryDateIso (Dans exactement 15 jours)" -ForegroundColor Gray
Write-Host "   🔒 Protection anti-fraude: Signature HMAC-SHA256 et verrouillage d'horloge actifs." -ForegroundColor Gray

# -----------------------------------------------------------------------------------------
# ÉTAPE 4 : CRÉATION DU RACCOURCI BUREAU (DESKTOP SHORTCUT)
# -----------------------------------------------------------------------------------------
Write-Host "`n══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "🔹 [ÉTAPE 4/5] Création du Raccourci sur le Bureau..." -ForegroundColor Yellow
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

$desktopPath = [Environment]::GetFolderPath("Desktop")
$shortcutFile = "$desktopPath\صحّتي - SIHATI.lnk"
$targetBatch = "$RootDir\start-sihati.bat"

$wshShell = New-Object -ComObject WScript.Shell
$shortcut = $wshShell.CreateShortcut($shortcutFile)
$shortcut.TargetPath = $targetBatch
$shortcut.WorkingDirectory = $RootDir
$shortcut.Description = "Lancer la Plateforme Nationale de Santé SIHATI"
$shortcut.Save()

Write-Host "   ✅ Raccourci créé sur votre bureau : 'صحّتي - SIHATI.lnk'" -ForegroundColor Green

# -----------------------------------------------------------------------------------------
# ÉTAPE 5 : FINALISATION ET PROPOSITION DE LANCEMENT IMMÉDIAT
# -----------------------------------------------------------------------------------------
Write-Host "`n══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray
Write-Host "🎉 [ÉTAPE 5/5] INSTALLATION TERMINÉE AVEC SUCCÈS !" -ForegroundColor Green
Write-Host "══════════════════════════════════════════════════════════════════════════════════" -ForegroundColor DarkGray

Write-Host "`nRésultats de l'installation :" -ForegroundColor Cyan
Write-Host "   • Base de données MySQL : 'sihati_db' (560 Médicaments, Urgences, 4 Rôles, Traçabilité)"
Write-Host "   • Période d'évaluation  : 15 Jours gratuits (Arrivant à échéance le $($expiry.ToShortDateString()))"
Write-Host "   • Portail Web           : http://localhost:3000"
Write-Host "   • API Backend Swagger   : http://localhost:3001/api/docs`n"

$reponse = Read-Host "Voulez-vous démarrer la plateforme صحّتي maintenant ? (O/N) [Défaut: O]"
if ($reponse -ne 'N' -and $reponse -ne 'n') {
    Write-Host "`n🚀 Lancement de SIHATI en cours..." -ForegroundColor Cyan
    Start-Process -FilePath "$RootDir\start-sihati.bat"
} else {
    Write-Host "`nVous pourrez démarrer l'application à tout moment via le raccourci sur le Bureau ou 'start-sihati.bat'." -ForegroundColor Yellow
}

Start-Sleep -Seconds 2
