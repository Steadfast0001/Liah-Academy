const mysql = require('mysql2/promise');

async function runDatabaseOptimization() {
  console.log('===========================================================');
  console.log('  LIAH ACADEMY DATABASE & INDEX OPTIMIZATION ENGINE');
  console.log('===========================================================\n');

  // Optimize MySQL indexes and statistics without rewriting local application data.
  const host = process.env.MYSQL_HOST || 'localhost';
  const port = parseInt(process.env.MYSQL_PORT || '3306');
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'liah_db';

  try {
    const pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 2
    });

    console.log(`[MySQL Engine Optimizer]`);
    console.log(`- Connecting to '${database}' on ${host}:${port}...`);

    // Helper to safely add an index if it doesn't exist
    async function safeAddIndex(table, indexName, columns) {
      try {
        const [existing] = await pool.query(
          `SHOW INDEX FROM \`${table}\` WHERE Key_name = ?`,
          [indexName]
        );
        if (Array.isArray(existing) && existing.length > 0) {
          return `Index '${indexName}' already active.`;
        }
        await pool.query(`ALTER TABLE \`${table}\` ADD INDEX \`${indexName}\` (${columns})`);
        return `Created index '${indexName}' on (${columns}).`;
      } catch (err) {
        return `Skipped (${err.message})`;
      }
    }

    console.log(`\n- Applying query indexes:`);
    console.log('  * students.matricule:', await safeAddIndex('students', 'idx_students_matricule', '`matricule`'));
    console.log('  * students.admission_status + created_at:', await safeAddIndex('students', 'idx_students_admission_created', '`admission_status`, `created_at`'));
    console.log('  * students.payment_status + created_at:', await safeAddIndex('students', 'idx_students_payment_created', '`payment_status`, `created_at`'));
    console.log('  * students.degree_program:', await safeAddIndex('students', 'idx_students_degree_program', '`degree_type`, `program_type`'));

    console.log('  * payments.student_id + created_at:', await safeAddIndex('payments', 'idx_payments_student_created', '`student_id`, `created_at`'));
    console.log('  * payments.status + created_at:', await safeAddIndex('payments', 'idx_payments_status_created', '`status`, `created_at`'));
    console.log('  * payments.transaction_id:', await safeAddIndex('payments', 'idx_payments_transaction_id', '`transaction_id`'));

    console.log('  * chat_sessions.status + updated_at:', await safeAddIndex('chat_sessions', 'idx_chat_status_updated', '`status`, `updated_at`'));
    console.log('  * chat_sessions.unread_admin + updated_at:', await safeAddIndex('chat_sessions', 'idx_chat_unread_updated', '`unread_admin`, `updated_at`'));

    console.log('  * inquiries.status + created_at:', await safeAddIndex('inquiries', 'idx_inquiries_status_created', '`status`, `created_at`'));
    console.log('  * email_logs.recipient + created_at:', await safeAddIndex('email_logs', 'idx_email_logs_recipient_created', '`recipient`, `created_at`'));
    console.log('  * email_logs.status + created_at:', await safeAddIndex('email_logs', 'idx_email_logs_status_created', '`status`, `created_at`'));
    console.log('  * courses.degree_type + school:', await safeAddIndex('courses', 'idx_courses_degree_school', '`degree_type`, `school`'));
    console.log('  * news.category + created_at:', await safeAddIndex('news', 'idx_news_category_created', '`category`, `created_at`'));
    console.log('  * media.category:', await safeAddIndex('media', 'idx_media_category', '`category`'));
    console.log('  * reviews.created_at:', await safeAddIndex('reviews', 'idx_reviews_created', '`created_at`'));

    console.log(`\n- Refreshing query statistics...`);
    const tables = ['students', 'payments', 'chat_sessions', 'inquiries', 'email_logs', 'admins', 'courses', 'news', 'media', 'reviews'];
    for (const table of tables) {
      try {
        await pool.query(`ANALYZE TABLE \`${table}\``);
      } catch (err) {
        console.log(`  * ${table}: skipped (${err.message})`);
      }
    }

    console.log('  ✓ Query optimizer statistics refreshed.');
    await pool.end();
  } catch (err) {
    console.log(`\n[MySQL Notice] MySQL server is currently offline locally or credentials not configured. (${err.message})`);
    console.log(`Tip: When hosting on cPanel/remote, import 'scripts/optimize_indexes.sql' in phpMyAdmin or run 'node scripts/optimize-db-indexes.js' via cPanel Terminal.`);
  }

  console.log('\n===========================================================');
  console.log('  INDEX AND STATISTICS PASS COMPLETE');
  console.log('===========================================================');
}

runDatabaseOptimization().catch(console.error);
