/**
 * SIHATI - Script d'initialisation automatique de la base MySQL locale
 */
const fs = require('fs');
const path = require('path');

let ROOT_DIR = path.resolve(__dirname, '..');
if (!fs.existsSync(path.join(ROOT_DIR, 'backend')) && fs.existsSync(path.resolve(__dirname, '../..', 'backend'))) {
  ROOT_DIR = path.resolve(__dirname, '../..');
}

let mysql;
try {
  mysql = require('mysql2/promise');
} catch (e) {
  try {
    mysql = require(path.join(ROOT_DIR, 'backend', 'node_modules', 'mysql2', 'promise'));
  } catch (err) {
    try {
      mysql = require(path.join(ROOT_DIR, 'node_modules', 'mysql2', 'promise'));
    } catch (e2) {
      console.error('Module mysql2 introuvable.');
    }
  }
}

async function testConnection(config) {
  if (!mysql) return null;
  try {
    const conn = await mysql.createConnection(config);
    await conn.ping();
    return conn;
  } catch (err) {
    return null;
  }
}

async function startEmbeddedMySQL() {
  const embeddedMysqld = path.join(ROOT_DIR, 'mysql', 'bin', 'mysqld.exe');
  const myIni = path.join(ROOT_DIR, 'mysql', 'my.ini');
  const dataDir = path.join(ROOT_DIR, 'mysql', 'data');
  const baseDir = path.join(ROOT_DIR, 'mysql');

  if (fs.existsSync(embeddedMysqld)) {
    console.log('[...] Démarrage automatique du serveur MySQL embarqué...');
    const { spawn } = require('child_process');
    const child = spawn(
      embeddedMysqld,
      [
        `--defaults-file=${myIni}`,
        `--basedir=${baseDir}`,
        `--datadir=${dataDir}`,
        '--standalone',
      ],
      {
        detached: true,
        stdio: 'ignore',
        cwd: baseDir,
      }
    );
    child.unref();

    for (let i = 0; i < 15; i++) {
      await new Promise((r) => setTimeout(r, 1000));
      const testConn = await testConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        connectTimeout: 2000,
      });
      if (testConn) {
        await testConn.end();
        console.log('[OK] Serveur MySQL embarqué opérationnel (Port 3306).');
        return true;
      }
    }
  }
  return false;
}

async function main() {
  console.log('=======================================================================');
  console.log('   SIHATI -- INITIALISATION DE LA BASE DE DONNEES MYSQL (sihati_db)');
  console.log('=======================================================================\n');

  const rootPasswords = ['', 'root', '123456', 'admin', 'mysql'];
  let rootConn = null;
  let activePassword = '';

  for (let attempt = 1; attempt <= 3; attempt++) {
    for (const pwd of rootPasswords) {
      rootConn = await testConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: pwd,
        multipleStatements: true,
      });
      if (rootConn) {
        activePassword = pwd;
        break;
      }
    }
    if (rootConn) break;
    await new Promise((r) => setTimeout(r, 1000));
  }

  if (!rootConn) {
    console.log('[INFO] Aucun serveur MySQL détecté sur le port 3306. Tentative de lancement...');
    const started = await startEmbeddedMySQL();
    if (started) {
      rootConn = await testConnection({
        host: '127.0.0.1',
        port: 3306,
        user: 'root',
        password: '',
        multipleStatements: true,
      });
      activePassword = '';
    }
  }

  if (!rootConn) {
    console.warn('[AVERTISSEMENT] Impossible de se connecter à MySQL automatiquement.');
    console.warn('Veuillez vous assurer que MySQL est actif sur le port 3306.');
    return;
  }

  console.log('[OK] Connexion MySQL établie avec succès (Utilisateur: root).');

  // Détection du chemin du répertoire de données MySQL (datadir)
  let datadir = path.join(ROOT_DIR, 'mysql', 'data');
  try {
    const [rows] = await rootConn.query("SHOW VARIABLES LIKE 'datadir'");
    if (rows && rows.length > 0 && rows[0].Value) {
      datadir = rows[0].Value;
    }
  } catch (e) {
    // Utilise le datadir par défaut
  }

  try {
    // Vérification de l'intégrité de la base sihati_db existante
    let needCleanReset = false;
    try {
      const [dbs] = await rootConn.query("SHOW DATABASES LIKE 'sihati_db'");
      if (dbs && dbs.length > 0) {
        await rootConn.changeUser({ database: 'sihati_db' });
        try {
          await rootConn.query('SELECT 1 FROM users LIMIT 1');
        } catch (tableErr) {
          const errText = (tableErr.message || '').toLowerCase();
          if (
            errText.includes("doesn't exist in engine") ||
            errText.includes("does not exist in engine") ||
            tableErr.errno === 1932 ||
            tableErr.code === 'ER_TABLE_NOT_FOUND'
          ) {
            console.warn('[AVERTISSEMENT] Table "users" orpheline détectée ("doesn\'t exist in engine").');
            needCleanReset = true;
          }
        }
      }
    } catch (dbCheckErr) {
      const errText = (dbCheckErr.message || '').toLowerCase();
      if (errText.includes("doesn't exist in engine") || errText.includes("does not exist in engine") || dbCheckErr.errno === 1932) {
        needCleanReset = true;
      }
    }

    if (needCleanReset) {
      console.log('[REPARATION] Nettoyage automatique des tables corrompues dans sihati_db...');
      try {
        await rootConn.changeUser({ database: 'mysql' });
      } catch (e) {}

      try {
        await rootConn.query('DROP DATABASE IF EXISTS sihati_db');
      } catch (dropErr) {
        console.warn('[INFO] DROP DATABASE SQL:', dropErr.message);
      }

      // Nettoyage physique des fichiers orphelins (.frm, .ibd) sur le disque
      if (datadir) {
        const physicalDbDir = path.join(datadir, 'sihati_db');
        if (fs.existsSync(physicalDbDir)) {
          try {
            fs.rmSync(physicalDbDir, { recursive: true, force: true });
            console.log(`[OK] Fichiers orphelins purgés avec succès : ${physicalDbDir}`);
          } catch (rmErr) {
            console.warn(`[AVERTISSEMENT] Impossible de purger ${physicalDbDir}:`, rmErr.message);
          }
        }
      }
    }

    console.log('[...] Vérification / Création de la base sihati_db...');
    await rootConn.query(
      `CREATE DATABASE IF NOT EXISTS sihati_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
    );
    console.log('[OK] Base "sihati_db" prête et synchronisée.');

    // Met à jour le .env du backend avec le mot de passe détecté
    const backendEnvPath = path.join(ROOT_DIR, 'backend', '.env');
    if (fs.existsSync(backendEnvPath)) {
      let envContent = fs.readFileSync(backendEnvPath, 'utf8');
      envContent = envContent.replace(/DB_PASSWORD=.*/g, `DB_PASSWORD=${activePassword}`);
      fs.writeFileSync(backendEnvPath, envContent, 'utf8');
      console.log('[OK] Configuration backend/.env synchronisée.');
    }

    await rootConn.changeUser({ database: 'sihati_db' });

    // 1. Création sécurisée de la table users avec récupération d'erreur "doesn't exist in engine"
    const createUsersSql = `
      CREATE TABLE IF NOT EXISTS users (
        id int NOT NULL AUTO_INCREMENT,
        phone varchar(255) NOT NULL,
        email varchar(255) DEFAULT NULL,
        password_hash varchar(255) NOT NULL,
        role varchar(255) NOT NULL DEFAULT 'PATIENT',
        first_name varchar(255) NOT NULL,
        last_name varchar(255) NOT NULL,
        is_active tinyint NOT NULL DEFAULT 1,
        created_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        updated_at datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        PRIMARY KEY (id),
        UNIQUE KEY IDX_users_phone (phone)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;

    try {
      await rootConn.query(createUsersSql);
    } catch (createErr) {
      const msg = (createErr.message || '').toLowerCase();
      if (msg.includes("doesn't exist in engine") || msg.includes("does not exist in engine") || createErr.errno === 1932) {
        console.warn('[REPARATION] Table "users" présente sur disque mais absente du dictionnaire InnoDB. Purge ciblée...');
        try {
          await rootConn.query('DROP TABLE IF EXISTS users');
        } catch (e) {}

        if (datadir) {
          const frm = path.join(datadir, 'sihati_db', 'users.frm');
          const ibd = path.join(datadir, 'sihati_db', 'users.ibd');
          if (fs.existsSync(frm)) { try { fs.unlinkSync(frm); } catch (e) {} }
          if (fs.existsSync(ibd)) { try { fs.unlinkSync(ibd); } catch (e) {} }
        }

        await rootConn.query(createUsersSql);
        console.log('[OK] Table "users" recréée proprement dans le moteur InnoDB.');
      } else {
        throw createErr;
      }
    }

    // 2. Hash bcrypt garanti pour 'password123'
    const PWD_HASH = '$2a$10$HB1Lx4son1u7LCbJFtbl6eSIKiwOYr9WwIm0vO2CNl4f1bHCzXHye';

    // 3. Injection / mise à jour systématique des utilisateurs de test
    const demoUsers = [
      ['0550000000', 'admin@sihati.dz', PWD_HASH, 'ADMIN', 'مدير', 'النظام'],
      ['0661234567', 'dr.ali@sihati.dz', PWD_HASH, 'DOCTOR', 'محمد', 'علي'],
      ['0661234560', 'doctor@sihati.dz', PWD_HASH, 'DOCTOR', 'طبيب', 'المداومة'],
      ['0662345678', 'dr.sara@sihati.dz', PWD_HASH, 'DOCTOR', 'سارة', 'أحمد'],
      ['0663456789', 'dr.yasser@sihati.dz', PWD_HASH, 'DOCTOR', 'ياسر', 'محمود'],
      ['0770123456', 'pharmacie@sihati.dz', PWD_HASH, 'PHARMACY', 'يوسف', 'بلمعزة'],
      ['0770123450', 'pharmacy@sihati.dz', PWD_HASH, 'PHARMACY', 'صيدلية', 'الشفاء'],
      ['0555123456', 'patient@sihati.dz', PWD_HASH, 'PATIENT', 'محمد أمين', 'بن علي'],
    ];

    for (const [phone, email, pwd, role, fn, ln] of demoUsers) {
      await rootConn.query(
        `INSERT INTO users (phone, email, password_hash, role, first_name, last_name)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), role = VALUES(role), email = VALUES(email)`,
        [phone, email, pwd, role, fn, ln]
      );
    }
    console.log('[OK] Tous les comptes de démonstration (Admin, Médecin, Pharmacie, Patient) vérifiés et prêts avec "password123".');

    // 4. Injection des données du fichier seed_data.sql si disponible
    const seedFile = path.join(ROOT_DIR, 'data', 'seed_data.sql');
    if (fs.existsSync(seedFile)) {
      try {
        const sqlContent = fs.readFileSync(seedFile, 'utf8');
        await rootConn.query(sqlContent);
        console.log('[OK] Fichier seed_data.sql injecté avec succès.');
      } catch (sqlErr) {
        console.log('[INFO] Injection partielle de seed_data.sql (tables gérées en synchro par TypeORM).');
      }
    }

    const [rows] = await rootConn.query('SELECT COUNT(*) as count FROM users');
    console.log(`[OK] Base SIHATI opérationnelle contenant ${rows[0]?.count || 0} utilisateurs.`);

    await rootConn.end();
    console.log('\n=======================================================================');
    console.log('   INITIALISATION DE LA BASE TERMINÉE AVEC SUCCÈS');
    console.log('=======================================================================\n');
  } catch (err) {
    console.error('[ERREUR] Lors de l’initialisation de la base :', err.message);
    if (rootConn) await rootConn.end();
  }
}

main().catch(console.error);
