const fs = require('fs');
const path = require('path');
const mysql = require(path.join(__dirname, '../backend/node_modules/mysql2/promise'));

async function load() {
  const sqlFile = path.join(__dirname, 'seed_data.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  console.log('Connexion à MySQL pour exécuter seed_data.sql...');
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    multipleStatements: true,
  });

  console.log('Exécution du script seed_data.sql (560 médicaments + démo)...');
  await connection.query(sql);

  const [medCount] = await connection.query('SELECT COUNT(*) as cnt FROM sihati_db.medications');
  const [userCount] = await connection.query('SELECT COUNT(*) as cnt FROM sihati_db.users');

  console.log(`Terminé avec succès ! Médicaments insérés: ${medCount[0].cnt}, Utilisateurs: ${userCount[0].cnt}`);
  await connection.end();
}

load().catch(console.error);
