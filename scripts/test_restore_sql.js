const mysql = require('mysql2/promise');
const fs = require('fs');

async function testRestore() {
  console.log('🧪 Verifying cpanel_full_data_backup.sql on test database...');
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    multipleStatements: true
  });

  try {
    await conn.query('CREATE DATABASE IF NOT EXISTS liah_restore_test CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
    await conn.query('USE liah_restore_test;');

    const sql = fs.readFileSync('data/cpanel_full_data_backup.sql', 'utf8');
    console.log('Executing SQL statements in liah_restore_test...');
    await conn.query(sql);

    console.log('✅ SQL executed with zero syntax errors!');

    // Check counts in restored DB
    const [students] = await conn.query('SELECT COUNT(*) as count FROM students');
    const [payments] = await conn.query('SELECT COUNT(*) as count FROM payments');
    const [courses] = await conn.query('SELECT COUNT(*) as count FROM courses');
    const [reviews] = await conn.query('SELECT COUNT(*) as count FROM reviews');
    const [inquiries] = await conn.query('SELECT COUNT(*) as count FROM inquiries');
    const [media] = await conn.query('SELECT COUNT(*) as count FROM media');
    const [chat] = await conn.query('SELECT COUNT(*) as count FROM chat_sessions');
    const [emails] = await conn.query('SELECT COUNT(*) as count FROM email_logs');
    const [admins] = await conn.query('SELECT COUNT(*) as count FROM admins');
    const [settings] = await conn.query('SELECT * FROM settings WHERE id = 1');

    console.log('\n📊 Restored Data Verification:');
    console.log(`- Students: ${students[0].count} / 125`);
    console.log(`- Payments: ${payments[0].count} / 17`);
    console.log(`- Courses: ${courses[0].count} / 6`);
    console.log(`- Reviews: ${reviews[0].count} / 4`);
    console.log(`- Inquiries: ${inquiries[0].count} / 3`);
    console.log(`- Media: ${media[0].count} / 8`);
    console.log(`- Chat Sessions: ${chat[0].count} / 3`);
    console.log(`- Email Logs: ${emails[0].count} / 100`);
    console.log(`- Admins: ${admins[0].count} / 1`);
    console.log(`- Settings: Site title = "${settings[0].site_title}", MoMo = "${settings[0].momo_number}"`);

    // Clean up test DB
    await conn.query('DROP DATABASE liah_restore_test;');
    console.log('\n🧹 Test database cleaned up successfully.');
  } catch (err) {
    console.error('❌ Restore verification failed:', err);
    try { await conn.query('DROP DATABASE IF EXISTS liah_restore_test;'); } catch {}
    process.exit(1);
  } finally {
    await conn.end();
  }
}

testRestore();
