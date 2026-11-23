const mysql = require('mysql2/promise');
require('dotenv').config();

async function init() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT, 10) || 3306;
  const user = process.env.DB_USERNAME || 'root';
  const password = process.env.DB_PASSWORD || '';
  const dbName = process.env.DB_NAME || 'sihati_db';

  console.log(`Connexion à MySQL sur ${host}:${port} avec l'utilisateur '${user}'...`);

  try {
    const connection = await mysql.createConnection({
      host,
      port,
      user,
      password,
    });

    console.log(`Création de la base de données '${dbName}' si elle n'existe pas...`);
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );

    console.log(`Base de données '${dbName}' vérifiée / créée avec succès dans MySQL !`);
    await connection.end();
  } catch (error) {
    console.error('Erreur lors de la création de la base de données:', error.message);
    process.exit(1);
  }
}

init();
