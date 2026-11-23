# 🚀 Guide de Déploiement Cloud sur Render (SIHATI)

Ce guide détaille pas à pas la mise en ligne de la plateforme **SIHATI** sur **[Render.com](https://render.com)**.

---

## 🏗️ Architecture Cloud

La plateforme est composée de 3 briques :
1. **Frontend Web (Next.js)** : hébergé sur Render (Plan Gratuit).
2. **Backend API (NestJS)** : hébergé sur Render (Plan Gratuit).
3. **Base de données MySQL** : hébergée gratuitement sur **Aiven for MySQL** ou **Clever Cloud** ou **TiDB Cloud**.

---

## ⚡ Méthode 1 : Déploiement automatique en 1 Clic (Render Blueprint)

Un fichier `render.yaml` est déjà présent à la racine du dépôt.

1. Connectez-vous sur **[dashboard.render.com](https://dashboard.render.com)**.
2. Cliquez sur le bouton bleu **"New +"** en haut à droite, puis sélectionnez **"Blueprint"**.
3. Associez votre compte GitHub et sélectionnez votre dépôt :  
   `scareface19/sihati`
4. Render lira automatiquement `render.yaml` et créera :
   - Le service Web **`sihati-backend`**
   - Le service Web **`sihati-web`**
5. Renseignez les variables de connexion MySQL (voir Étape Base de Données ci-dessous).
6. Cliquez sur **"Apply"** : Render compile et déploie automatiquement les deux applications !

---

## 🗄️ Étape indispensable : Créer une Base MySQL Gratuite en 2 minutes

Render proposant PostgreSQL en interne, voici les 2 meilleures options 100% gratuites pour MySQL :

### Option A (Recommandée) : [Aiven.io](https://aiven.io) (Gratuit à vie)
1. Créez un compte gratuit sur [aiven.io](https://aiven.io).
2. Cliquez sur **"Create Service"** -> Choisissez **MySQL** -> Plan **Free**.
3. Choisissez la région la plus proche (ex: Frankfurt / Europe).
4. Une fois créé, Aiven vous affiche :
   - **Host** : `mysql-xxxx.aivencloud.com`
   - **Port** : `ex: 12345`
   - **User** : `avnadmin`
   - **Password** : `votre_mot_de_passe`
   - **Database** : `defaultdb` ou `sihati_db`
   - **SSL** : Activé par défaut.

### Option B : [Clever Cloud](https://www.clever-cloud.com)
1. Créez un compte sur Clever Cloud.
2. Créez un add-on **MySQL** (Plan Gratuit ou Starter).
3. Récupérez les identifiants de connexion.

---

## ⚙️ Variables d'environnement pour Render (`sihati-backend`)

Sur le dashboard Render, dans les paramètres de votre service **sihati-backend** -> onglet **Environment** :

| Variable | Valeur exemple | Description |
|---|---|---|
| `NODE_ENV` | `production` | Mode production |
| `PORT` | `10000` | Port d'écoute Render |
| `JWT_SECRET` | *(Généré automatiquement)* | Clé de signature JWT |
| `DB_HOST` | `mysql-xxxx.aivencloud.com` | Hôte MySQL cloud |
| `DB_PORT` | `3306` (ou port Aiven) | Port MySQL |
| `DB_USERNAME` | `avnadmin` | Utilisateur base |
| `DB_PASSWORD` | `********` | Mot de passe base |
| `DB_NAME` | `defaultdb` (ou `sihati_db`) | Nom de la base |
| `DB_SSL` | `true` | Active la connexion sécurisée SSL |

> **Astuce :** Vous pouvez aussi simplement définir `DATABASE_URL` :  
> `mysql://avnadmin:mot_de_passe@mysql-xxxx.aivencloud.com:port/sihati_db`

---

## 🌐 Liaison du Frontend (`sihati-web`)

Dans le service **sihati-web** sur Render :
- La variable `NEXT_PUBLIC_API_URL` pointera vers l'URL HTTPS de votre backend, par exemple :  
  `https://sihati-backend.onrender.com`

---

## 🔄 Initialisation automatique des données

Dès le premier démarrage de `sihati-backend` connecté à votre base cloud MySQL :
- TypeORM crée automatiquement l'ensemble des tables (`users`, `patients`, `doctors`, `medications`, `prescriptions`, etc.).
- Le service `SeedService` injecte automatiquement les **560 médicaments officiels algériens** et les comptes de test (`admin@sihati.dz`, `dr.ali@sihati.dz`, `pharmacie@sihati.dz`, `patient@sihati.dz`).
