# 🇩🇿 Guide d'Installation & Système de Licence 15 Jours « صحّتي - SIHATI »

Ce document détaille l'architecture complète de l'installeur clef en main, le mécanisme d'injection de la base de données MySQL et le fonctionnement du verrouillage de la période d'essai de 15 jours.

---

## 📑 Sommaire
1. [Vue d'ensemble de l'Installeur Clef en Main](#1-vue-densemble-de-linstalleur-clef-en-main)
2. [Détection & Installation Automatique (Node.js & MySQL)](#2-détection--installation-automatique-nodejs--mysql)
3. [Injection Automatique de la Base de Données SQL](#3-injection-automatique-de-la-base-de-données-sql)
4. [Sécurité & Fonctionnement de la Période d'Évaluation de 15 Jours](#4-sécurité--fonctionnement-de-la-période-dévaluation-de-15-jours)
5. [Scripts & Fichiers Fournis](#5-scripts--fichiers-fournis)
6. [Clé d'Activation Définitive (Licence Permanente)](#6-clé-dactivation-définitive-licence-permanente)

---

## 1. Vue d'ensemble de l'Installeur Clef en Main

L'installeur a été conçu pour permettre un déploiement en **1 clic** sur n'importe quel ordinateur Windows (Windows 10, Windows 11, Windows Server), sans exiger de compétences techniques préalables de la part de l'utilisateur ou du client final.

* **Fichier principal à double-cliquer :** `setup.bat` (à la racine du projet `D:\Sihati\setup.bat`).
* **Comportement :**
  1. Il demande ou élève automatiquement les droits **Administrateur Windows** nécessaires.
  2. Il exécute le script maître `installer/sihati-setup.ps1` avec la politique `-ExecutionPolicy Bypass`.
  3. Il crée automatiquement le raccourci sur le Bureau **« صحّتي - SIHATI.lnk »**.

---

## 2. Détection & Installation Automatique (Node.js & MySQL)

Le script `installer/check-prerequisites.ps1` effectue les contrôles suivants :

### A. Détection de Node.js
1. Vérifie si `node.exe` est présent dans le `PATH` ou dans les répertoires standards (`C:\Program Files\nodejs`).
2. **Si Node.js est absent :**
   * Tente d'abord l'installation silencieuse via **Windows Package Manager** :
     ```powershell
     winget install OpenJS.NodeJS.LTS --silent --accept-source-agreements --accept-package-agreements
     ```
   * En cas d'indisponibilité de winget, il télécharge directement le paquet officiel MSI LTS (`node-v20.x-x64.msi`) depuis `nodejs.org` et lance l'installation silencieuse :
     ```powershell
     Start-Process msiexec.exe -ArgumentList "/i nodejs_lts.msi /qn" -Wait
     ```

### B. Détection de MySQL Server
1. Vérifie l'état des services Windows : `MySQL84`, `MySQL80`, `MySQL57`, `mysql`, `MariaDB`, `wampmysqld`.
2. S'il est présent mais arrêté, il le démarre automatiquement via `Start-Service`.
3. Vérifie également la présence d'instances locales (ex: XAMPP `C:\xampp\mysql\bin\mysqld.exe`).
4. **Si aucun serveur MySQL n'existe :**
   * Il installe automatiquement MySQL Server via `winget install Oracle.MySQL --silent` ou configure MariaDB.
5. Il effectue un test d'écoute sur le port réseau local **3306** pour s'assurer de sa disponibilité.

---

## 3. Injection Automatique de la Base de Données SQL

Le script `installer/db-inject.js` se charge de l'initialisation complète de la base de données :

```
                        [ data/schema.sql ]
                                 │
                                 ▼
[ MySQL 3306 ] ──► CREATE DATABASE sihati_db (utf8mb4)
                                 │
                                 ▼
                     [ data/seed_data.sql ]
                                 │
                                 ▼
        Tables créées et vérifiées :
        • 560 Médicaments (Nomenclature 2025)
        • 57 Analyses biologiques de référence
        • 40 Examens d'imagerie médicale
        • 4 Lots de traçabilité unitaire
        • Profils de démonstration (Médecin, Pharmacie, Patient, Admin)
```

Le script est idempotent : s'il est exécuté plusieurs fois, il ne duplique pas les enregistrements et préserve l'intégrité des clés primaires.

---

## 4. Sécurité & Fonctionnement de la Période d'Évaluation de 15 Jours

Conformément à votre demande (**« je souhaite que l'application marche 15 jours et s'arrête »**), un système de protection cryptographique a été intégré :

### A. Empreinte Matérielle & Signature Cryptographique
À la première installation, un fichier scellé est généré dans `backend/.sihati_license` :
* **Date d'installation ($T_0$)** : Date et heure ISO exactes du premier lancement.
* **Date d'expiration ($T_{\text{fin}}$)** : Fixée à exactement $T_0 + 15\text{ jours}$ ($15 \times 24 \times 3600 \times 1000\text{ ms}$).
* **Empreinte Machine (Hardware Fingerprint)** : Hachage SHA-256 combinant le nom de l'ordinateur, l'architecture processeur et l'adresse MAC pour empêcher la copie du fichier sur un autre PC.
* **Signature HMAC-SHA256** : Signe l'ensemble des métadonnées avec une clé secrète serveur non modifiable. Si l'utilisateur tente de modifier manuellement la date dans le fichier avec un éditeur de texte, la signature devient invalide et la licence est bloquée.

### B. Protection Anti-Rollback (Contre le recul de l'horloge système)
* Chaque requête met à jour un horodatage `lastRecordedTimestamp`.
* Si un utilisateur recule l'horloge de son ordinateur dans le passé pour tenter de regagner des jours, le système détecte l'incohérence temporelle ($T_{\text{actuel}} < T_{\text{dernier}}$) et expire immédiatement la licence.

### C. Guard Backend Global (`TrialGuard`)
* Toutes les requêtes vers l'API backend sont interceptées par le `TrialGuard`.
* Dès que les 15 jours sont écoulés, toute tentative d'accès est rejetée avec un code **HTTP 403 Forbidden** :
  ```json
  {
    "statusCode": 403,
    "error": "TRIAL_EXPIRED",
    "messageAr": "انتهت الفترة التجريبية المحددة بـ 15 يوماً لمنصة صحّتي...",
    "messageFr": "La période d'essai de 15 jours de la plateforme SIHATI est arrivée à échéance...",
    "daysRemaining": 0
  }
  ```

### D. Interface Utilisateur (Bandeau & Écran de Verrouillage)
* **Pendant les 15 jours (Jours 1 à 15) :**
  Un bandeau supérieur discret indique le nombre de jours restants :
  > ⏳ *النسخة التجريبية : متبقي X يوماً على نهاية فترة الـ 15 يوماً • Version d'évaluation : X jour(s) restant(s)*
* **Après 15 jours (Expiration) :**
  Un écran plein de verrouillage s'affiche immédiatement et bloque toute navigation, invitant l'utilisateur à contacter l'administrateur ou à entrer une clé d'activation officielle.

---

## 5. Scripts & Fichiers Fournis

| Fichier | Emplacement | Fonction |
| :--- | :--- | :--- |
| **`setup.bat`** | `D:\Sihati\setup.bat` | Installeur principal 1-clic avec élévation Administrateur |
| **`start-sihati.bat`** | `D:\Sihati\start-sihati.bat` | Lanceur 1-clic (Démarrage MySQL, Backend, Frontend + Navigateur) |
| **`stop-sihati.bat`** | `D:\Sihati\stop-sihati.bat` | Arrêt propre et sécurisé de tous les processus |
| **`sihati-setup.ps1`** | `D:\Sihati\installer\sihati-setup.ps1` | Script PowerShell maître d'installation |
| **`check-prerequisites.ps1`** | `D:\Sihati\installer\check-prerequisites.ps1` | Contrôle et téléchargement automatique de Node.js & MySQL |
| **`db-inject.js`** | `D:\Sihati\installer\db-inject.js` | Script d'injection SQL du schéma et des 560 médicaments |
| **`TrialBanner.tsx`** | `D:\Sihati\web\components\TrialBanner.tsx` | Composant d'affichage du compte à rebours et écran de blocage |
| **`license.service.ts`** | `D:\Sihati\backend\src\modules\license\...` | Moteur cryptographique de gestion de la licence 15 jours |

---

## 6. Clé d'Activation Définitive (Licence Permanente)

Pour débloquer définitivement la plateforme après ou pendant la période d'essai de 15 jours, vous pouvez saisir l'une des clés officielles suivantes dans l'interface ou via l'API :

* **Clé Maître Officielle :**
  ```text
  SIHATI-PRO-2026-ALGERIA-SETIF-FULL-UNLIMITED
  ```
* **Clé Institutionnelle :**
  ```text
  ANPP-DSP-SETIF-OFFICIAL-LICENSE-KEY-2026
  ```

Une fois validée, la clé lève immédiatement la restriction des 15 jours, supprime le bandeau d'évaluation et confère une utilisation permanente illimitée.
