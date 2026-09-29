const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

// 1. Directory Setup
const uploadDir = path.join(__dirname, '..', 'public', 'uploads', 'credentials');
const proofsDir = path.join(__dirname, '..', 'public', 'assets', 'proofs');

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
if (!fs.existsSync(proofsDir)) fs.mkdirSync(proofsDir, { recursive: true });

function extractBase64ToFile(dataUri, targetDir, prefix = 'file') {
  if (!dataUri || typeof dataUri !== 'string' || !dataUri.startsWith('data:')) {
    return dataUri;
  }

  try {
    const matches = dataUri.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return dataUri;

    const mimeType = matches[1];
    const base64Data = matches[2];
    const buffer = Buffer.from(base64Data, 'base64');

    let ext = '.bin';
    if (mimeType.includes('pdf')) ext = '.pdf';
    else if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) ext = '.jpg';
    else if (mimeType.includes('webp')) ext = '.webp';

    const fileName = `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 6)}${ext}`;
    const filePath = path.join(targetDir, fileName);
    fs.writeFileSync(filePath, buffer);

    if (targetDir.includes('proofs')) {
      return `/assets/proofs/${fileName}`;
    }
    return `/uploads/credentials/${fileName}`;
  } catch (err) {
    console.warn('Extraction error:', err.message);
    return dataUri;
  }
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
          s.document_url = extractBase64ToFile(s.document_url, uploadDir, `student_${s.id}_doc`);
          jsonChanges++;
        }
        // Payment Proof URL
        if (s.payment_proof_url && s.payment_proof_url.startsWith('data:')) {
          s.payment_proof_url = extractBase64ToFile(s.payment_proof_url, proofsDir, `student_${s.id}_proof`);
          jsonChanges++;
        }
        // Documents array
        if (Array.isArray(s.documents)) {
          for (const doc of s.documents) {
            if (doc.url && doc.url.startsWith('data:')) {
              doc.url = extractBase64ToFile(doc.url, uploadDir, `student_${s.id}_${doc.slotId || 'doc'}`);
              jsonChanges++;
            }
          }
        }
      }
    }

    if (Array.isArray(store.payments)) {
      for (const p of store.payments) {
        if (p.proof_url && p.proof_url.startsWith('data:')) {
          p.proof_url = extractBase64ToFile(p.proof_url, proofsDir, `payment_${p.reference || p.id}_proof`);
          jsonChanges++;
        }
      }
    }

    if (jsonChanges > 0) {
      fs.writeFileSync(jsonDbPath, JSON.stringify(store, null, 2), 'utf-8');
      console.log(`[JSON Store] Successfully extracted ${jsonChanges} embedded Base64 files to disk.`);
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
            updatedDocUrl = extractBase64ToFile(s.document_url, uploadDir, `mysql_student_${s.id}_doc`);
            modified = true;
          }

          if (s.payment_proof_url && s.payment_proof_url.startsWith('data:')) {
            updatedProofUrl = extractBase64ToFile(s.payment_proof_url, proofsDir, `mysql_student_${s.id}_proof`);
            modified = true;
          }

          if (s.documents) {
            try {
              const parsed = typeof s.documents === 'string' ? JSON.parse(s.documents) : s.documents;
              if (Array.isArray(parsed)) {
                for (const d of parsed) {
                  if (d.url && d.url.startsWith('data:')) {
                    d.url = extractBase64ToFile(d.url, uploadDir, `mysql_student_${s.id}_${d.slotId || 'doc'}`);
                    modified = true;
                  }
                }
                updatedDocs = JSON.stringify(parsed);
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
            const cleanProof = extractBase64ToFile(p.proof_url, proofsDir, `mysql_pay_${p.reference}`);
            await pool.query('UPDATE payments SET proof_url = ? WHERE reference = ?', [cleanProof, p.reference]);
            mysqlPaymentChanges++;
          }
        }
      }
      console.log(`[MySQL Payments Table] Sanitized ${mysqlPaymentChanges} rows with embedded files.`);
    } catch (tblErr) {
      console.log(`[MySQL Payments Table] Note: ${tblErr.message}`);
    }

    await pool.end();
  } catch (err) {
    console.log(`[MySQL Notice] Skipped MySQL remote extraction (offline or not running locally): ${err.message}`);
  }

  console.log('--- Sanitization Complete ---');
}

sanitizeDatabase().catch(console.error);
