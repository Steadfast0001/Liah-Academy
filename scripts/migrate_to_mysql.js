const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function initMySQL() {
  try {
    const conn = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'liah_db'
    });

    console.log('Connected to MySQL database: liah_db!');

    // 1. Create tables
    const tableQueries = [
      `CREATE TABLE IF NOT EXISTS students (
        id INT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(100),
        degree_type VARCHAR(50) NOT NULL,
        program_type VARCHAR(150) NOT NULL,
        study_format VARCHAR(50) DEFAULT 'oncampus',
        document_url TEXT,
        documents JSON,
        payment_status ENUM('Pending', 'Paid') DEFAULT 'Pending',
        admission_status ENUM('Under Review', 'Approved', 'Rejected') DEFAULT 'Under Review',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS courses (
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
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS news (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        date VARCHAR(100) NOT NULL,
        image VARCHAR(255) NOT NULL,
        excerpt TEXT,
        content TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS media (
        id VARCHAR(100) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        src VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'General',
        size VARCHAR(50) DEFAULT 'Unknown',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS inquiries (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'new',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(255) NOT NULL,
        rating INT DEFAULT 5,
        comment TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS settings (
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
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS email_logs (
        id VARCHAR(100) PRIMARY KEY,
        recipient VARCHAR(255) NOT NULL,
        recipient_type VARCHAR(50) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        type VARCHAR(100) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'logged',
        preview TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

      `CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        reference VARCHAR(255) NOT NULL UNIQUE,
        student_id INT,
        amount INT NOT NULL,
        currency VARCHAR(10) DEFAULT 'XAF',
        operator VARCHAR(50),
        phone VARCHAR(50),
        status ENUM('PENDING', 'SUCCESSFUL', 'FAILED') DEFAULT 'PENDING',
        external_reference VARCHAR(255),
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`
    ];

    for (const query of tableQueries) {
      await conn.query(query);
    }
    console.log('All 9 tables created in MySQL liah_db!');

    // 2. Populate from current JSON store
    const storePath = path.join(process.cwd(), 'data', 'liah_academy_store.json');
    if (fs.existsSync(storePath)) {
      const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));

      if (store.students && store.students.length > 0) {
        for (const s of store.students) {
          await conn.query(
            `INSERT INTO students (id, full_name, email, password, phone, degree_type, program_type, study_format, document_url, documents, payment_status, admission_status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE full_name=VALUES(full_name), payment_status=VALUES(payment_status), admission_status=VALUES(admission_status)`,
            [
              s.id, s.full_name, s.email, s.password, s.phone || '', s.degree_type || 'HND',
              s.program_type || '', s.study_format || 'oncampus', s.document_url || '',
              JSON.stringify(s.documents || []), s.payment_status || 'Pending',
              s.admission_status || 'Under Review',
              s.created_at ? new Date(s.created_at) : new Date()
            ]
          );
        }
        console.log(`Synced ${store.students.length} students into MySQL`);
      }

      if (store.courses && store.courses.length > 0) {
        for (const c of store.courses) {
          await conn.query(
            `INSERT INTO courses (id, title, degree_type, program_type, study_format, duration, tuition_fee, description, modules, badge, school)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title), tuition_fee=VALUES(tuition_fee)`,
            [
              c.id, c.title, c.degree_type, c.program_type, c.study_format || 'fulltime',
              c.duration || '2 Years', c.tuition_fee || 250000, c.description || '',
              c.modules || '', c.badge || 'Popular', c.school || 'School of Engineering'
            ]
          );
        }
        console.log(`Synced ${store.courses.length} courses into MySQL`);
      }

      if (store.news && store.news.length > 0) {
        for (const n of store.news) {
          await conn.query(
            `INSERT INTO news (id, title, category, date, image, excerpt, content, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title)`,
            [
              n.id, n.title || 'Academy Announcement', n.category || 'News', n.date || 'August 2026', n.image || '/assets/images/flyer_engineering.png', n.excerpt || '',
              n.content || '', n.created_at ? new Date(n.created_at) : new Date()
            ]
          );
        }
        console.log(`Synced ${store.news.length} news items into MySQL`);
      }

      if (store.media && store.media.length > 0) {
        for (const m of store.media) {
          await conn.query(
            `INSERT INTO media (id, title, type, src, category, size, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE title=VALUES(title)`,
            [
              m.id, m.title, m.type, m.src, m.category || 'General', m.size || 'Unknown',
              m.created_at ? new Date(m.created_at) : new Date()
            ]
          );
        }
        console.log(`Synced ${store.media.length} media records into MySQL`);
      }

      if (store.inquiries && store.inquiries.length > 0) {
        for (const i of store.inquiries) {
          await conn.query(
            `INSERT INTO inquiries (id, name, email, subject, message, status, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status)`,
            [
              i.id, i.name, i.email, i.subject, i.message, i.status || 'new',
              i.created_at ? new Date(i.created_at) : new Date()
            ]
          );
        }
        console.log(`Synced ${store.inquiries.length} inquiries into MySQL`);
      }

      if (store.reviews && store.reviews.length > 0) {
        for (const r of store.reviews) {
          await conn.query(
            `INSERT INTO reviews (id, name, role, rating, comment, created_at)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE name=VALUES(name)`,
            [
              r.id, r.name, r.role, r.rating || 5, r.comment,
              r.created_at ? new Date(r.created_at) : new Date()
            ]
          );
        }
        console.log(`Synced ${store.reviews.length} reviews into MySQL`);
      }

      if (store.settings) {
        const st = store.settings;
        await conn.query(
          `INSERT INTO settings (id, admin_email, site_title, contact_phone, address, admissions_open, tiktok_url, maps_url, facebook_url, instagram_url)
           VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE admin_email=VALUES(admin_email), site_title=VALUES(site_title), contact_phone=VALUES(contact_phone), address=VALUES(address), tiktok_url=VALUES(tiktok_url), maps_url=VALUES(maps_url)`,
          [
            st.admin_email || 'info@liahacademy.com', st.site_title, st.contact_phone, st.address,
            st.admissions_open ? 1 : 0, st.tiktok_url || '', st.maps_url || '',
            st.facebook_url || '', st.instagram_url || ''
          ]
        );
        console.log('Synced site settings into MySQL');
      }

      if (store.email_logs && store.email_logs.length > 0) {
        for (const em of store.email_logs.slice(0, 50)) {
          await conn.query(
            `INSERT INTO email_logs (id, recipient, recipient_type, subject, type, status, preview, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE status=VALUES(status)`,
            [
              em.id, em.recipient, em.recipient_type || 'applicant', em.subject,
              em.type || 'custom', em.status || 'logged', em.preview || '',
              em.created_at ? new Date(em.created_at) : new Date()
            ]
          );
        }
        console.log('Synced email logs into MySQL');
      }
    }

    const [tables] = await conn.query('SHOW TABLES');
    console.log('Final tables in liah_db:', tables.map(t => Object.values(t)[0]));

    await conn.end();
    console.log('MIGRATION COMPLETE! MySQL database liah_db is now live and fully populated.');
  } catch (err) {
    console.error('MySQL initialization error:', err);
  }
}

initMySQL();
