/**
 * =========================================================================================
 * PROJET SANTÉ NUMÉRIQUE ALGÉRIEN « صحّتي » (SIHATI)
 * SCRIPT D'INJECTION AUTOMATIQUE DE LA BASE DE DONNÉES MYSQL
 * =========================================================================================
 * Ce script est exécuté par l'installateur et au premier démarrage pour :
 *  1. Vérifier la connexion au serveur MySQL local (port 3306).
 *  2. Créer la base de données `sihati_db` avec l'encodage `utf8mb4_unicode_ci` si absente.
 *  3. Injecter le schéma relationnel complet (`data/schema.sql`).
 *  4. Injecter les données d'initialisation et nomenclature 2025 (`data/seed_data.sql`).
 *  5. Afficher un rapport détaillé de l'état des tables créées.
 * =========================================================================================
 */

const fs = require('fs');
const path = require('path');

// Recherche du module mysql2 dans backend/node_modules
let mysql;
try {
  mysql = require(path.resolve(__dirname, '../backend/node_modules/mysql2/promise'));
} catch (e) {
  try {
    mysql = require('mysql2/promise');
  } catch (err) {
    console.error('❌ Module mysql2 introuvable. Veuillez exécuter "npm install" dans le dossier backend.');
    process.exit(1);
  }
}

// Chargement des variables d'environnement si présentes dans backend/.env
const envPath = path.resolve(__dirname, '../backend/.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...vals] = trimmed.split('=');
      const val = vals.join('=').trim();
      if (key && !process.env[key.trim()]) {
        process.env[key.trim()] = val;
      }
    }
  });
}

// Paramètres de connexion MySQL
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = parseInt(process.env.DB_PORT, 10) || 3306;
const DB_USER = process.env.DB_USERNAME || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'sihati_db';

const SCHEMA_FILE = path.resolve(__dirname, '../data/schema.sql');
const SEED_FILE = path.resolve(__dirname, '../data/seed_data.sql');

async function main() {
  console.log('╔════════════════════════════════════════════════════════════════════════╗');
  console.log('║        صحّتي (SIHATI) - INITIALISATION AUTOMATIQUE MYSQL               ║');
  console.log('╚════════════════════════════════════════════════════════════════════════╝');
  console.log(`📡 Connexion au serveur MySQL [${DB_HOST}:${DB_PORT}] (Utilisateur: ${DB_USER})...`);

  let connection;
  try {
    // Étape 1 : Connexion au serveur MySQL sans spécifier de base
    connection = await mysql.createConnection({
      host: DB_HOST,
      port: DB_PORT,
      user: DB_USER,
      password: DB_PASSWORD,
      multipleStatements: true,
    });
    console.log('✅ Connexion MySQL établie avec succès !');

    // Étape 2 : Création de la base de données si inexistante
    console.log(`📦 Vérification / Création de la base '${DB_NAME}' (utf8mb4)...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    await connection.query(`USE \`${DB_NAME}\`;`);
    console.log(`✅ Base de données '${DB_NAME}' sélectionnée.`);

    // Étape 3 : Injection du schéma SQL
    if (fs.existsSync(SCHEMA_FILE)) {
      console.log(`📝 Injection du schéma SQL depuis '${SCHEMA_FILE}'...`);
      const schemaSql = fs.readFileSync(SCHEMA_FILE, 'utf8');
      await connection.query(schemaSql);
      console.log('✅ Schéma des tables créé avec succès !');
    } else {
      console.warn(`⚠️ Fichier de schéma non trouvé : ${SCHEMA_FILE}`);
    }

    // Étape 4 : Injection des données de test et nomenclature
    if (fs.existsSync(SEED_FILE)) {
      console.log(`🌱 Injection des données de référence depuis '${SEED_FILE}'...`);
      const seedSql = fs.readFileSync(SEED_FILE, 'utf8');
      try {
        await connection.query(seedSql);
        console.log('✅ Données de référence et nomenclature injectées avec succès !');
      } catch (seedErr) {
        // En cas d'entrées dupliquées lors d'une ré-exécution, ignorer pacifiquement
        if (seedErr.code === 'ER_DUP_ENTRY') {
          console.log('ℹ️ Données de référence déjà présentes (clés uniques conservées).');
        } else {
          console.warn(`⚠️ Avertissement lors du seed SQL : ${seedErr.message}`);
        }
      }
    }

    // Étape 5 : Rapport de validation des tables
    const [tables] = await connection.query(`SHOW TABLES;`);
    console.log('\n📊 Résumé des tables actives dans ' + DB_NAME + ' :');
    for (const t of tables) {
      const tableName = Object.values(t)[0];
      const [[{ count }]] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\`;`);
      console.log(`   - 📋 ${tableName.padEnd(25)} : ${count} enregistrements`);
    }

    console.log('\n🎉 Base de données SIHATI prête pour la production et l’évaluation !');
  } catch (error) {
    console.error('\n❌ ERREUR LORS DE L’INJECTION MYSQL :');
    console.error(`   Message : ${error.message}`);
    console.error(`   Code    : ${error.code}`);
    console.error('\nConseil : Vérifiez que le service MySQL est démarré sur le port 3306.');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

main();
