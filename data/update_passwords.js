const path = require('path');
const mysql = require(path.join(__dirname, '../backend/node_modules/mysql2/promise'));
const bcrypt = require(path.join(__dirname, '../backend/node_modules/bcryptjs'));

async function updatePasswords() {
  const hash = await bcrypt.hash('password123', 10);
  console.log('Generated hash for password123:', hash);

  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sihati_db',
  });

  const [res] = await connection.query('UPDATE users SET password_hash = ?', [hash]);
  console.log(`Updated ${res.affectedRows} users with valid bcrypt hash for "password123".`);

  const [users] = await connection.query('SELECT id, phone, email, role, first_name, last_name FROM users');
  console.log('\nAvailable demo users in MySQL:');
  console.table(users);

  await connection.end();
}

updatePasswords().catch(console.error);
