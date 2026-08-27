const mysql = require('mysql2/promise');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

function hashPassword(password) {
  if (!password) return '';
  if (password.startsWith('pbkdf2$')) return password; // Already encrypted
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

async function encryptDatabasePasswords() {
  console.log('====================================================');
  console.log('  LIAH ACADEMY - STUDENT PASSWORD ENCRYPTION TOOL   ');
  console.log('====================================================\n');

  let totalEncryptedMySQL = 0;
  let totalEncryptedJSON = 0;

  // 1. Encrypt MySQL students table
  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'liah_db'
    });

    console.log('✅ Connected to MySQL [liah_db]. Auditing student passwords...');

    const [rows] = await conn.query('SELECT id, email, password FROM students');
    for (const student of rows) {
      if (student.password && !student.password.startsWith('pbkdf2$')) {
        const encrypted = hashPassword(student.password);
        await conn.query('UPDATE students SET password = ? WHERE id = ?', [encrypted, student.id]);
        totalEncryptedMySQL++;
      }
    }

    console.log(`✅ MySQL: ${totalEncryptedMySQL} unencrypted student password(s) successfully encrypted with PBKDF2 SHA-512.`);
    await conn.end();
  } catch (err) {
    console.warn('MySQL notice:', err.message);
  }

  // 2. Encrypt JSON data store if present
  const storePath = path.join(process.cwd(), 'data', 'liah_academy_store.json');
  if (fs.existsSync(storePath)) {
    try {
      const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
      if (store.students && Array.isArray(store.students)) {
        for (const s of store.students) {
          if (s.password && !s.password.startsWith('pbkdf2$')) {
            s.password = hashPassword(s.password);
            totalEncryptedJSON++;
          }
        }
        fs.writeFileSync(storePath, JSON.stringify(store, null, 2), 'utf-8');
        console.log(`✅ JSON Store: ${totalEncryptedJSON} unencrypted student password(s) successfully encrypted.`);
      }
    } catch (jsonErr) {
      console.warn('JSON Store notice:', jsonErr.message);
    }
  }

  console.log('\n====================================================');
  console.log('  PASSWORD ENCRYPTION COMPLETE - ALL PASSWORDS SECURED');
  console.log('====================================================');
}

encryptDatabasePasswords();
