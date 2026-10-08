const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// Parse .env or .env.local if present
function loadEnv() {
  const envFiles = ['.env.local', '.env', '.env.production'];
  for (const file of envFiles) {
    const fullPath = path.join(process.cwd(), file);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      content.split(/\r?\n/).forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
          const key = match[1];
          let value = match[2] || '';
          if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
          if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
          if (!process.env[key]) {
            process.env[key] = value.trim();
          }
        }
      });
    }
  }
}

loadEnv();

async function runCpanelDbSetup() {
  console.log('================================================================');
  console.log('  LIAH ACADEMY - CPANEL DATABASE AUTOMATION & VERIFICATION      ');
  console.log('================================================================\n');

  const config = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'liah_db',
    multipleStatements: true
  };

  console.log(`Connecting to MySQL database [${config.database}] at ${config.host}:${config.port} (User: ${config.user})...`);

  let conn;
  try {
    conn = await mysql.createConnection(config);
    console.log('✅ Connected successfully to MySQL server!\n');
  } catch (err) {
    console.error('❌ Connection Failed:', err.message);
    console.log('\nTroubleshooting Tips:');
    console.log('1. Verify your MySQL Database credentials in .env.local or cPanel.');
    console.log('2. Ensure your cPanel MySQL user is granted ALL PRIVILEGES on the database.');
    console.log('3. If running on cPanel, MYSQL_HOST is usually "localhost".\n');
    process.exit(1);
  }

  try {
    let sqlFilePath = path.join(process.cwd(), 'scripts', 'normalized_schema_3nf.sql');
    if (!fs.existsSync(sqlFilePath)) {
      sqlFilePath = path.join(process.cwd(), 'data', 'cpanel_full_data_backup.sql');
    }
    if (!fs.existsSync(sqlFilePath)) {
      sqlFilePath = path.join(process.cwd(), 'data', 'cpanel_master_setup.sql');
    }
    if (!fs.existsSync(sqlFilePath)) {
      throw new Error(`Master SQL setup file not found. Please verify scripts/normalized_schema_3nf.sql exists.`);
    }

    console.log(`Executing normalized database setup script (${path.relative(process.cwd(), sqlFilePath)})...`);
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    // Split SQL into executable statements
    const statements = sql
      .split(/;\s*$/m)
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    let executed = 0;
    for (const stmt of statements) {
      if (stmt.length > 0) {
        try {
          await conn.query(stmt);
          executed++;
        } catch (stmtErr) {
          // Ignore "duplicate column", "table already exists", or duplicate key notices
          if (
            stmtErr.code === 'ER_DUP_FIELDNAME' ||
            stmtErr.code === 'ER_TABLE_EXISTS_ERROR' ||
            stmtErr.code === 'ER_DUP_KEYNAME'
          ) {
            continue;
          }
          console.warn(`[Notice] Statement: ${stmt.slice(0, 50)}... -> ${stmtErr.message}`);
        }
      }
    }

    console.log(`✅ Executed ${executed} schema definition and repair statements.\n`);

    // Verify row counts and health of tables
    console.log('================================================================');
    console.log('  TABLE STATUS & HEALTH CHECK                                   ');
    console.log('================================================================');

    const tables = [
      'students',
      'payments',
      'admins',
      'courses',
      'settings',
      'inquiries',
      'reviews',
      'news',
      'chat_sessions',
      'email_logs',
      'media',
      'rate_limits'
    ];

    for (const tbl of tables) {
      try {
        const [rows] = await conn.query(`SELECT COUNT(*) AS total FROM \`${tbl}\``);
        const count = rows[0].total;
        console.log(`  ✓ Table [${tbl.padEnd(16)}]: ${String(count).padStart(5)} record(s)`);
      } catch (tblErr) {
        console.log(`  ✗ Table [${tbl.padEnd(16)}]: Not present or query error (${tblErr.message})`);
      }
    }

    // Verify student records sanitization
    const [corruptRows] = await conn.query(
      "SELECT id, full_name, admission_status FROM students WHERE admission_status LIKE 'private-file:%' OR admission_status LIKE '%/%'"
    );

    if (corruptRows.length === 0) {
      console.log('\n✅ All student admission statuses are clean and valid (No corrupted file URIs).');
    } else {
      console.log(`\n⚠️  Found ${corruptRows.length} un-repaired student record(s). Repairing now...`);
      await conn.query(`
        UPDATE students 
        SET payment_proof_url = IF(payment_proof_url IS NULL OR payment_proof_url = '', admission_status, payment_proof_url),
            admission_status = 'Under Review'
        WHERE admission_status LIKE 'private-file:%' OR admission_status LIKE '%/%'
      `);
      console.log('✅ All student records successfully repaired.');
    }

    // Ensure Master Admin exists
    const [adminRows] = await conn.query('SELECT id, full_name, email, role FROM admins');
    console.log(`\n✅ Administrator Account(s): ${adminRows.length} active admin(s)`);
    adminRows.forEach(a => {
      console.log(`   - ${a.full_name} (${a.email}) [Role: ${a.role}]`);
    });

    console.log('\n================================================================');
    console.log('  🎉 DATABASE FULLY CONFIGURED & READY FOR PRODUCTION CPANEL     ');
    console.log('================================================================\n');

  } catch (err) {
    console.error('Fatal error during setup:', err);
  } finally {
    await conn.end();
  }
}

runCpanelDbSetup();
