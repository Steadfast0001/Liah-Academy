const mysql = require('mysql2/promise');

async function updateDatabaseTables() {
  console.log('====================================================');
  console.log('  LIAH ACADEMY - DATABASE SCHEMA UPDATE & UPGRADE   ');
  console.log('====================================================\n');

  try {
    const conn = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || '',
      database: process.env.MYSQL_DATABASE || 'liah_db'
    });

    console.log('✅ Connected to MySQL database [liah_db] successfully.\n');

    // 1. Create / Update students table
    console.log('1. Upgrading [students] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        degree_type VARCHAR(50) NOT NULL,
        program_type VARCHAR(150) NOT NULL,
        study_format VARCHAR(50) DEFAULT 'oncampus',
        cohort VARCHAR(100) DEFAULT 'Fall 2024 / Spring 2025',
        qualification VARCHAR(100) DEFAULT 'GCE Advanced Level',
        statement TEXT,
        document_url TEXT,
        documents JSON,
        payment_status VARCHAR(50) DEFAULT 'Pending',
        admission_status VARCHAR(50) DEFAULT 'Pending Review',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_students_email (email),
        INDEX idx_students_phone (phone),
        INDEX idx_students_status (admission_status, payment_status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);

    // Add any missing columns to students if table existed before
    const studentColumns = [
      { name: 'cohort', type: "VARCHAR(100) DEFAULT 'Fall 2024 / Spring 2025'" },
      { name: 'qualification', type: "VARCHAR(100) DEFAULT 'GCE Advanced Level'" },
      { name: 'statement', type: 'TEXT' },
      { name: 'payment_status', type: "VARCHAR(50) DEFAULT 'Pending'" },
      { name: 'admission_status', type: "VARCHAR(50) DEFAULT 'Pending Review'" }
    ];

    for (const col of studentColumns) {
      try {
        await conn.query(`ALTER TABLE students ADD COLUMN IF NOT EXISTS ${col.name} ${col.type}`);
      } catch (e) {
        // Fallback for MySQL versions without IF NOT EXISTS on ADD COLUMN
        try {
          await conn.query(`ALTER TABLE students ADD COLUMN ${col.name} ${col.type}`);
        } catch {}
      }
    }
    console.log('   ✓ students table upgraded with modern admission and payment fields.');

    // 2. Create / Update courses table
    console.log('2. Upgrading [courses] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        degree_type VARCHAR(50) NOT NULL,
        program_type VARCHAR(150) NOT NULL,
        study_format VARCHAR(50) DEFAULT 'fulltime',
        duration VARCHAR(50) DEFAULT '2 Years',
        tuition_fee INT NOT NULL DEFAULT 250000,
        description TEXT,
        modules TEXT,
        badge VARCHAR(100) DEFAULT 'Popular',
        school VARCHAR(150) DEFAULT 'School of Engineering',
        tags JSON,
        featured TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_courses_degree (degree_type),
        INDEX idx_courses_school (school)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try { await conn.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS tags JSON'); } catch {}
    try { await conn.query('ALTER TABLE courses ADD COLUMN IF NOT EXISTS featured TINYINT(1) DEFAULT 0'); } catch {}
    console.log('   ✓ courses table verified with tags and featured flags.');

    // 3. Create / Update payments table
    console.log('3. Upgrading [payments] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reference VARCHAR(255) NOT NULL UNIQUE,
        student_id INT,
        amount INT NOT NULL,
        currency VARCHAR(10) DEFAULT 'XAF',
        operator VARCHAR(50),
        phone VARCHAR(50),
        status VARCHAR(50) DEFAULT 'PENDING',
        description VARCHAR(255),
        external_reference VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_payments_ref (reference),
        INDEX idx_payments_student (student_id),
        INDEX idx_payments_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try { await conn.query('ALTER TABLE payments ADD COLUMN IF NOT EXISTS description VARCHAR(255)'); } catch {}
    console.log('   ✓ payments table upgraded for Campay USSD reconciliation.');

    // 4. Create / Update inquiries table
    console.log('4. Upgrading [inquiries] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        subject VARCHAR(255) NOT NULL,
        program_interest VARCHAR(255),
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_inquiries_email (email),
        INDEX idx_inquiries_status (status)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try { await conn.query('ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS phone VARCHAR(50)'); } catch {}
    try { await conn.query('ALTER TABLE inquiries ADD COLUMN IF NOT EXISTS program_interest VARCHAR(255)'); } catch {}
    console.log('   ✓ inquiries table updated with lead phone & program interest fields.');

    // 5. Create / Update reviews table
    console.log('5. Upgrading [reviews] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        comment TEXT NOT NULL,
        avatar VARCHAR(255) DEFAULT '/assets/images/logo.png',
        approved TINYINT(1) DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_reviews_approved (approved)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try { await conn.query("ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar VARCHAR(255) DEFAULT '/assets/images/logo.png'"); } catch {}
    try { await conn.query('ALTER TABLE reviews ADD COLUMN IF NOT EXISTS approved TINYINT(1) DEFAULT 1'); } catch {}
    console.log('   ✓ reviews table updated with avatar & moderation approvals.');

    // 6. Create / Update news table
    console.log('6. Upgrading [news] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('   ✓ news table verified.');

    // 7. Create / Update media table
    console.log('7. Upgrading [media] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        src VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        size VARCHAR(50) DEFAULT 'Unknown',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('   ✓ media table verified.');

    // 8. Create / Update settings table
    console.log('8. Upgrading [settings] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id INT PRIMARY KEY DEFAULT 1,
        admin_email VARCHAR(255) DEFAULT 'info@liahacademy.com',
        site_title VARCHAR(255) DEFAULT 'Liah Academy - Institute of Higher Technology & Innovation',
        contact_phone VARCHAR(100) DEFAULT '+237 652 154 095 / +237 699 526 607',
        address VARCHAR(255) DEFAULT 'Backweri Town, Buea, Southwest Region, Cameroon',
        admissions_open TINYINT(1) DEFAULT 1,
        tiktok_url VARCHAR(255) DEFAULT 'https://www.tiktok.com/@liahacademy0',
        maps_url VARCHAR(255) DEFAULT 'https://maps.app.goo.gl/eHgx8Triv6TKKcRf6',
        facebook_url VARCHAR(255),
        instagram_url VARCHAR(255),
        whatsapp_number VARCHAR(100) DEFAULT '+237652154095',
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    try { await conn.query("ALTER TABLE settings ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(100) DEFAULT '+237652154095'"); } catch {}
    console.log('   ✓ settings table updated with institutional social & WhatsApp channels.');

    // 9. Create / Update email_logs table
    console.log('9. Upgrading [email_logs] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS email_logs (
        id VARCHAR(100) PRIMARY KEY,
        recipient VARCHAR(255) NOT NULL,
        recipient_type VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'logged',
        preview TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_email_logs_recipient (recipient),
        INDEX idx_email_logs_type (type)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('   ✓ email_logs table upgraded with recipient & type indexes.');

    // 10. Create admin_users table
    console.log('10. Upgrading [admin_users] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        email VARCHAR(255) NOT NULL UNIQUE,
        role VARCHAR(50) DEFAULT 'SuperAdmin',
        last_login DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    // Seed default admin account if table is empty
    await conn.query(`
      INSERT IGNORE INTO admin_users (id, username, email, role, created_at)
      VALUES (1, 'admin', 'info@liahacademy.com', 'SuperAdmin', NOW());
    `);
    console.log('   ✓ admin_users table initialized.');

    // 11. Create audit_logs table
    console.log('11. Upgrading [audit_logs] table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        action VARCHAR(100) NOT NULL,
        entity VARCHAR(50) NOT NULL,
        entity_id VARCHAR(100),
        details TEXT,
        ip_address VARCHAR(50),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_audit_action (action),
        INDEX idx_audit_entity (entity)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('   ✓ audit_logs table initialized.');

    console.log('\n====================================================');
    console.log('  ALL 11 DATABASE TABLES SUCCESSFULLY UPGRADED!     ');
    console.log('====================================================');

    const [tables] = await conn.query('SHOW TABLES');
    console.log('\nActive Tables in liah_db:');
    tables.forEach((t, i) => console.log(`  ${i + 1}. ${Object.values(t)[0]}`));

    await conn.end();
  } catch (err) {
    console.error('\n❌ Database Update Error:', err.message);
    process.exit(1);
  }
}

updateDatabaseTables();
