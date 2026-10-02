const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// 1. Directory Setup
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'credentials');
const proofsDir = path.join(__dirname, '..', 'public', 'assets', 'proofs');
const mediaDir = path.join(__dirname, '..', 'public', 'assets', 'media');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(proofsDir)) fs.mkdirSync(proofsDir, { recursive: true });
if (!fs.existsSync(mediaDir)) fs.mkdirSync(mediaDir, { recursive: true });

function extractBase64ToFile(dataUri, targetDir, prefix = 'file', publicPath = '/uploads/credentials') {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
    return dataUri;
  }

  const matches = dataUri.match(/^data:([^;,]+);base64,([\s\S]+)$/i);
  if (!matches) throw new Error(`Invalid Base64 data URI in ${prefix}.`);

  const mimeType = matches[1].toLowerCase();
  const base64Data = matches[2].replace(/\s/g, '');
  if (!base64Data || !/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
    throw new Error(`Invalid Base64 file payload in ${prefix}.`);
  }

  const buffer = Buffer.from(base64Data, 'base64');
  if (buffer.length === 0) throw new Error(`Empty Base64 file payload in ${prefix}.`);

  let ext = '.bin';
  if (mimeType.includes('pdf')) ext = '.pdf';
  else if (mimeType.includes('png')) ext = '.png';
  else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
  else if (mimeType.includes('webp')) ext = '.webp';
  else if (mimeType.includes('gif')) ext = '.gif';
  else if (mimeType.includes('svg')) ext = '.svg';

  fs.mkdirSync(targetDir, { recursive: true });
  const safePrefix = String(prefix).replace(/[^a-zA-Z0-9_-]/g, '_');
  const fileName = `${safePrefix}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
  const filePath = path.join(targetDir, fileName);
  fs.writeFileSync(filePath, buffer, { flag: 'wx' });
  return `${publicPath}/${fileName}`;
}

function extractEmbeddedFiles(value, prefix, targetDir = uploadDir, publicPath = '/uploads/credentials') {
  if (typeof value === 'string') {
    if (!value.startsWith('data:')) return { value, changes: 0 };
    return {
      value: extractBase64ToFile(value, targetDir, prefix, publicPath),
      changes: 1
    };
  }

  if (Array.isArray(value)) {
    let changes = 0;
    const extracted = value.map((item, index) => {
      const result = extractEmbeddedFiles(item, `${prefix}_${index}`, targetDir, publicPath);
      changes += result.changes;
      return result.value;
    });
    return { value: extracted, changes };
  }

  if (value && typeof value === 'object') {
    let changes = 0;
    const extracted = {};
    for (const [key, item] of Object.entries(value)) {
      const keyPrefix = `${prefix}_${key}`;
      const isProof = /proof|screenshot/i.test(key);
      const isMedia = /^(src|media)$/i.test(key);
      const result = extractEmbeddedFiles(
        item,
        keyPrefix,
        isProof ? proofsDir : isMedia ? mediaDir : targetDir,
        isProof ? '/assets/proofs' : isMedia ? '/assets/media' : publicPath
      );
      extracted[key] = result.value;
      changes += result.changes;
    }
    return { value: extracted, changes };
  }

  return { value, changes: 0 };
}

async function sanitizeDatabase() {
  console.log('--- Starting Database File Extraction & Sanitization ---');

  // A. Sanitize JSON File Store
  const jsonDbPath = path.join(__dirname, '..', 'data', 'liah_academy_store.json');
  if (fs.existsSync(jsonDbPath)) {
    const store = JSON.parse(fs.readFileSync(jsonDbPath, 'utf-8'));
    let jsonChanges = 0;

    if (Array.isArray(store.students)) {
      for (const s of store.students) {
        // Document URL
        if (s.document_url && s.document_url.startsWith('data:')) {
          s.document_url = extractBase64ToFile(s.document_url, uploadDir, `student_${s.id}_doc`, '/uploads/credentials');
          jsonChanges++;
        }
        // Payment Proof URL
        if (s.payment_proof_url && s.payment_proof_url.startsWith('data:')) {
          s.payment_proof_url = extractBase64ToFile(s.payment_proof_url, proofsDir, `student_${s.id}_proof`, '/assets/proofs');
          jsonChanges++;
        }
        // Documents array
        let studentDocuments = s.documents;
        const documentsWereString = typeof studentDocuments === 'string';
        if (documentsWereString) {
          try {
            studentDocuments = JSON.parse(studentDocuments);
          } catch {
            studentDocuments = null;
          }
        }
        if (studentDocuments) {
          const extracted = extractEmbeddedFiles(studentDocuments, `student_${s.id}_documents`);
          if (extracted.changes > 0) {
            s.documents = documentsWereString ? JSON.stringify(extracted.value) : extracted.value;
            jsonChanges += extracted.changes;
          }
        }
      }
    }

    if (Array.isArray(store.payments)) {
      for (const p of store.payments) {
        if (p.proof_url && p.proof_url.startsWith('data:')) {
          p.proof_url = extractBase64ToFile(p.proof_url, proofsDir, `payment_${p.reference || p.id}_proof`, '/assets/proofs');
          jsonChanges++;
        }
      }
    }

    if (Array.isArray(store.media)) {
      for (const item of store.media) {
        if (item.src && item.src.startsWith('data:')) {
          item.src = extractBase64ToFile(item.src, mediaDir, `admin_media_${item.id || 'asset'}`, '/assets/media');
          jsonChanges++;
        }
      }
    }

    if (jsonChanges > 0) {
      const backupsDir = path.join(__dirname, '..', 'data', 'backups');
      fs.mkdirSync(backupsDir, { recursive: true });
      const backupPath = path.join(backupsDir, `liah_academy_store.pre_file_migration_${Date.now()}.json`);
      fs.copyFileSync(jsonDbPath, backupPath);
      const tempPath = `${jsonDbPath}.${process.pid}.tmp`;
      fs.writeFileSync(tempPath, JSON.stringify(store, null, 2), 'utf-8');
      fs.renameSync(tempPath, jsonDbPath);
      console.log(`[JSON Store] Extracted ${jsonChanges} embedded files. Backup: ${path.relative(process.cwd(), backupPath)}`);
    } else {
      console.log(`[JSON Store] All records are already clean (using lightweight file URLs).`);
    }
  }

  // B. Sanitize MySQL Database (if configured)
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || '';
  const database = process.env.MYSQL_DATABASE || 'liah_db';

  try {
    const pool = mysql.createPool({
      host,
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 2
    });

    console.log(`[MySQL] Checking database '${database}' at ${host}...`);
    
    // Check students table
    try {
      const [students] = await pool.query('SELECT id, document_url, documents, payment_proof_url FROM students');
      let mysqlStudentChanges = 0;

      if (Array.isArray(students)) {
        for (const s of students) {
          let updatedDocUrl = s.document_url;
          let updatedProofUrl = s.payment_proof_url;
          let updatedDocs = s.documents;

          let modified = false;

          if (s.document_url && s.document_url.startsWith('data:')) {
            updatedDocUrl = extractBase64ToFile(s.document_url, uploadDir, `mysql_student_${s.id}_doc`, '/uploads/credentials');
            modified = true;
          }

          if (s.payment_proof_url && s.payment_proof_url.startsWith('data:')) {
            updatedProofUrl = extractBase64ToFile(s.payment_proof_url, proofsDir, `mysql_student_${s.id}_proof`, '/assets/proofs');
            modified = true;
          }

          if (s.documents) {
            try {
              const parsed = typeof s.documents === 'string' ? JSON.parse(s.documents) : s.documents;
              if (parsed) {
                const extracted = extractEmbeddedFiles(parsed, `mysql_student_${s.id}_documents`);
                if (extracted.changes > 0) {
                  updatedDocs = JSON.stringify(extracted.value);
                  modified = true;
                }
              }
            } catch {}
          }

          if (modified) {
            await pool.query(
              'UPDATE students SET document_url = ?, payment_proof_url = ?, documents = ? WHERE id = ?',
              [updatedDocUrl, updatedProofUrl, updatedDocs, s.id]
            );
            mysqlStudentChanges++;
          }
        }
      }
      console.log(`[MySQL Students Table] Sanitized ${mysqlStudentChanges} rows with embedded files.`);
    } catch (tblErr) {
      console.log(`[MySQL Students Table] Note: ${tblErr.message}`);
    }

    // Check payments table
    try {
      const [payments] = await pool.query('SELECT reference, proof_url FROM payments');
      let mysqlPaymentChanges = 0;

      if (Array.isArray(payments)) {
        for (const p of payments) {
          if (p.proof_url && p.proof_url.startsWith('data:')) {
            const cleanProof = extractBase64ToFile(p.proof_url, proofsDir, `mysql_pay_${p.reference}`, '/assets/proofs');
            await pool.query('UPDATE payments SET proof_url = ? WHERE reference = ?', [cleanProof, p.reference]);
            mysqlPaymentChanges++;
          }
        }
      }
      console.log(`[MySQL Payments Table] Sanitized ${mysqlPaymentChanges} rows with embedded files.`);
    } catch (tblErr) {
      console.log(`[MySQL Payments Table] Note: ${tblErr.message}`);
    }

    // Check admin media records
    try {
      const [mediaItems] = await pool.query('SELECT id, src FROM media');
      let mysqlMediaChanges = 0;

      if (Array.isArray(mediaItems)) {
        for (const item of mediaItems) {
          if (item.src && item.src.startsWith('data:')) {
            const cleanSrc = extractBase64ToFile(item.src, mediaDir, `mysql_admin_media_${item.id}`, '/assets/media');
            await pool.query('UPDATE media SET src = ? WHERE id = ?', [cleanSrc, item.id]);
            mysqlMediaChanges++;
          }
        }
      }
      console.log(`[MySQL Media Table] Extracted ${mysqlMediaChanges} embedded files.`);
    } catch (tblErr) {
      console.log(`[MySQL Media Table] Note: ${tblErr.message}`);
    }

    await pool.end();
  } catch (err) {
    console.log(`[MySQL Notice] Skipped MySQL remote extraction (offline or not running locally): ${err.message}`);
  }

  console.log('--- Sanitization Complete ---');
}

sanitizeDatabase().catch(console.error);
