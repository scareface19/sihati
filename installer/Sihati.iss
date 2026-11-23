; =====================================================================
; SIHATI - Script d'Installation Autonome Inno Setup 6
; Plateforme Santé & Télémédecine Intelligente d'Algérie
; =====================================================================

#define MyAppName "SIHATI"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "SIHATI Health Tech Algérie"
#define MyAppURL "http://localhost:3000"

[Setup]
AppId={{E72F9A38-5B12-421D-89EA-8D4C137F92B2}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName=C:\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=no
InfoBeforeFile=assets\infobefore.txt
InfoAfterFile=assets\infoafter.txt
OutputDir=..\dist
OutputBaseFilename=Sihati-Setup-v{#MyAppVersion}
SetupIconFile=assets\app.ico
Compression=lzma2/ultra64
SolidCompression=yes
WizardStyle=modern
ArchitecturesInstallIn64BitMode=x64compatible
PrivilegesRequired=admin
PrivilegesRequiredOverridesAllowed=dialog
CloseApplications=force
RestartApplications=no
UninstallDisplayIcon={app}\assets\app.ico

[Languages]
Name: "french"; MessagesFile: "compiler:Languages\French.isl"
Name: "english"; MessagesFile: "compiler:Default.isl"

[Tasks]
Name: "desktopicon"; Description: "{cm:CreateDesktopIcon}"; GroupDescription: "{cm:AdditionalIcons}"

[Files]
; 1. Icone principale, rapport & utilitaire service
Source: "assets\app.ico"; DestDir: "{app}\assets"; Flags: ignoreversion
Source: "assets\infoafter.txt"; DestDir: "{app}"; DestName: "RAPPORT_INSTALLATION.txt"; Flags: ignoreversion
Source: "assets\nssm.exe"; DestDir: "{app}\bin"; Flags: ignoreversion

; 2. Runtime Node.js autonome embarqué (Exécution 100% portable)
Source: "C:\Program Files\nodejs\node.exe"; DestDir: "{app}\bin"; Flags: ignoreversion
Source: "mysql\bin\vcruntime140.dll"; DestDir: "{app}\bin"; Flags: ignoreversion
Source: "mysql\bin\vcruntime140_1.dll"; DestDir: "{app}\bin"; Flags: ignoreversion
Source: "mysql\bin\msvcp140.dll"; DestDir: "{app}\bin"; Flags: ignoreversion

; 3. Scripts de gestion & initialisation
Source: "scripts\*"; DestDir: "{app}\scripts"; Flags: ignoreversion recursesubdirs createallsubdirs

; 4. Backend NestJS API & modules
Source: "..\backend\*"; DestDir: "{app}\backend"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "*.log,logs\*,node_modules\.cache\*"

; 5. Frontend Next.js & application Web
Source: "..\web\*"; DestDir: "{app}\web"; Flags: ignoreversion recursesubdirs createallsubdirs; Excludes: "*.log,logs\*,node_modules\.cache\*"

; 6. Données de référence et nomenclature pharmaceutique
Source: "..\data\*"; DestDir: "{app}\data"; Flags: ignoreversion recursesubdirs createallsubdirs

; 7. Serveur de Base de Données MySQL Portable Embarqué
Source: "mysql\*"; DestDir: "{app}\mysql"; Flags: ignoreversion recursesubdirs createallsubdirs

[Dirs]
Name: "{app}"; Permissions: users-full
Name: "{app}\bin"; Permissions: users-full
Name: "{app}\backend\data"; Permissions: users-full
Name: "{app}\mysql\data"; Permissions: users-full

[Icons]
; Menu Démarrer
Name: "{group}\SIHATI - Lancer la Plateforme"; Filename: "{app}\scripts\start-sihati.bat"; IconFilename: "{app}\assets\app.ico"; Comment: "Démarrer tous les services et ouvrir SIHATI"
Name: "{group}\SIHATI - Ouvrir dans le Navigateur"; Filename: "{app}\scripts\open-sihati.bat"; IconFilename: "{app}\assets\app.ico"; Comment: "Ouvrir la plateforme Santé Web"
Name: "{group}\SIHATI - Arrêter les Services"; Filename: "{app}\scripts\stop-sihati.bat"; IconFilename: "{app}\assets\app.ico"; Comment: "Arrêter les serveurs SIHATI"
Name: "{group}\SIHATI - Initialiser Base de Données"; Filename: "{app}\scripts\init-database.bat"; Comment: "Vérifier et injecter les données MySQL"
Name: "{group}\SIHATI - Rapport d'Installation"; Filename: "{app}\RAPPORT_INSTALLATION.txt"
Name: "{group}\{cm:UninstallProgram,{#MyAppName}}"; Filename: "{uninstallexe}"; IconFilename: "{app}\assets\app.ico"

; Raccourci Bureau
Name: "{autodesktop}\SIHATI - Portail Santé"; Filename: "{app}\scripts\start-sihati.bat"; IconFilename: "{app}\assets\app.ico"; Tasks: desktopicon; Comment: "Lancer SIHATI (Plateforme Santé & Télémédecine)"

[InstallDelete]
; Purge systématique des tables orphelines pouvant causer "doesn't exist in engine"
Type: filesandordirs; Name: "{app}\mysql\data\sihati_db"

[UninstallDelete]
Type: filesandordirs; Name: "{app}\mysql\data\sihati_db"

[Run]
; Initialisation silencieuse de la base de données au post-install
Filename: "{app}\bin\node.exe"; Parameters: """{app}\scripts\setup-sihati-db.js"""; Description: "Initialisation de la base locale MySQL"; Flags: runhidden
; Lancer SIHATI à la fin de l'installation
Filename: "{app}\scripts\start-sihati.bat"; Description: "Lancer SIHATI maintenant (http://localhost:3000)"; Flags: nowait postinstall skipifsilent shellexec

[UninstallRun]
Filename: "{app}\scripts\stop-sihati.bat"; RunOnceId: "StopSihatiProcesses"; Flags: runhidden
