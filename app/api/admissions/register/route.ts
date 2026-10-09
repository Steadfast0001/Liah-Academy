import { NextResponse } from 'next/server';
import db, { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, getDegreePrefix, getProgramCode, markMySQLOffline } from '@/lib/db';
import { sendApplicationSignals } from '@/lib/email';
import { hashPassword, hashPasswordAsync, sanitizeInput, validateRequestOrigin } from '@/lib/security';
import { isStudentAuthConfigured, setStudentSession } from '@/lib/student-auth';
import { isPrivateFileReference } from '@/lib/private-files';
import { createStudentView } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Cross-Origin verification
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin registration request rejected.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const rawFullname = body.fullname || body.full_name;
    const fullname = sanitizeInput(rawFullname);
    const email = sanitizeInput(body.email)?.toLowerCase();
    const password = body.password;
    const phone = sanitizeInput(body.phone);
    const degree_type = sanitizeInput(body.degree_type) || 'HND';
    const program_type = sanitizeInput(body.program_type) || 'Software Engineering HND';
    const study_format = sanitizeInput(body.study_format) || 'oncampus';
    const { document_url, documents, payment_proof_url, payment_amount, payment_transaction_id, ref, referral_code } = body;
    const refCode = (ref || referral_code) ? sanitizeInput(String(ref || referral_code)).toUpperCase().trim() : '';

    const containsEmbeddedFile = (value: unknown, fieldName = ''): boolean => {
      if (typeof value === 'string') {
        if (/^data:/i.test(value)) return true;
        if (['document_url', 'payment_proof_url', 'proof_url', 'src', 'url'].includes(fieldName)) {
          return Boolean(value) && !(isPrivateFileReference(value) || /^https?:\/\//i.test(value) || /^\/(?!\/)/.test(value));
        }
        try {
          return containsEmbeddedFile(JSON.parse(value), fieldName);
        } catch {
          return false;
        }
      }
      if (Array.isArray(value)) return value.some(item => containsEmbeddedFile(item));
      if (value && typeof value === 'object') {
        return Object.entries(value).some(([key, nestedValue]) => containsEmbeddedFile(nestedValue, key));
      }
      return false;
    };

    if (containsEmbeddedFile(document_url, 'document_url') || containsEmbeddedFile(documents, 'documents') || containsEmbeddedFile(payment_proof_url, 'payment_proof_url')) {
      return NextResponse.json(
        { success: false, message: 'Embedded document data is not accepted. Upload documents before submitting enrolment.' },
        { status: 400 }
      );
    }

    if (!fullname || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    if (typeof password !== 'string' || password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { success: false, message: 'Choose a portal password between 6 and 128 characters.' },
        { status: 400 }
      );
    }

    if (!isStudentAuthConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Student authentication is not configured on this server.' },
        { status: 503 }
      );
    }

    // Determine optional payment proof state
    const defaultFee = String(degree_type).toUpperCase().includes('CERT') ? 25000 : 15000;
    const effectiveFee = payment_amount ? Number(payment_amount) : defaultFee;
    const cleanProofUrl = payment_proof_url && isPrivateFileReference(payment_proof_url) ? payment_proof_url : '';
    const cleanTxId = sanitizeInput(payment_transaction_id) || '';
    const initialPaymentStatus = cleanProofUrl ? 'Pending Verification' : 'Pending';

    // Hash password with cryptographic PBKDF2 SHA-512 before database storage
    const hashedPassword = await hashPasswordAsync(password);
    const documentsPayload = documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : null;
    let parsedDocuments: unknown[] = [];
    if (documentsPayload) {
      try {
        const parsed = JSON.parse(documentsPayload);
        if (!Array.isArray(parsed)) throw new Error('Documents must be an array.');
        parsedDocuments = parsed;
      } catch {
        return NextResponse.json({ success: false, message: 'Document metadata must be a valid list.' }, { status: 400 });
      }
    }
    const docPayload = documentsPayload || document_url || '';
    let studentId: number = 0;
    let mysqlMatricule = '';
    let insertedViaMySQL = false;

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const pool = getMySQLPool();
        const [result] = await pool.execute(
          `INSERT INTO students (full_name, email, password, phone, degree_type, program_type, study_format, document_url, documents, payment_status, admission_status, payment_proof_url, payment_amount, payment_transaction_id, referred_by)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review', ?, ?, ?, ?)`,
          [
            fullname, email, hashedPassword, phone, degree_type, program_type, study_format, docPayload, documentsPayload,
            initialPaymentStatus, cleanProofUrl || null, cleanProofUrl ? effectiveFee : 0, cleanTxId, refCode || null
          ]
        );
        studentId = Number((result as { insertId: number }).insertId);
        const year = String(new Date().getFullYear()).slice(-2);
        mysqlMatricule = `${getDegreePrefix(degree_type)}${year}${getProgramCode(program_type)}${String(studentId).padStart(3, '0')}`;
        await pool.execute('UPDATE students SET matricule = ? WHERE id = ?', [mysqlMatricule, studentId]);

        if (cleanProofUrl) {
          const payRef = `PAY-PROOF-${studentId}-${Date.now().toString().slice(-4)}`;
          await pool.execute(
            `INSERT INTO payments (reference, student_id, amount, currency, operator, phone, status, description, proof_url, transaction_id, created_at)
             VALUES (?, ?, ?, 'XAF', 'MTN Mobile Money', ?, 'PENDING_VERIFICATION', ?, ?, ?, NOW())`,
            [payRef, studentId, effectiveFee, phone, `Enrolment Application Fee for #${studentId}`, cleanProofUrl, cleanTxId]
          ).catch(payErr => console.warn('Payment record insert notice:', payErr));
        }

        // Link to referral agent's downline immediately upon registration
        if (refCode) {
          try {
            const [agentRows] = await pool.execute(
              'SELECT id, code, commission_per_student FROM referral_agents WHERE UPPER(code) = ? LIMIT 1',
              [refCode.toUpperCase()]
            );
            const agentList = agentRows as any[];
            if (agentList.length > 0) {
              const matchedAgent = agentList[0];
              const commAmount = Number(matchedAgent.commission_per_student || 15000);

              // 1. Insert into referrals table immediately (downline item with pending commission)
              await pool.execute(
                `INSERT INTO referrals (agent_id, agent_code, student_id, student_name, student_matricule, student_email, student_phone, program_type, payment_status, admission_status, commission_amount, commission_status, created_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'Under Review', ?, 'pending', NOW())`,
                [
                  matchedAgent.id,
                  matchedAgent.code,
                  studentId,
                  fullname,
                  mysqlMatricule,
                  email,
                  phone,
                  program_type,
                  initialPaymentStatus,
                  commAmount
                ]
              );

              // 2. Increment total referrals count on the agent
              await pool.execute(
                'UPDATE referral_agents SET total_referrals = total_referrals + 1 WHERE id = ?',
                [matchedAgent.id]
              );

              // 3. Mirror into local store
              try {
                adminStore.recordReferral({
                  agent_code: matchedAgent.code,
                  student_id: studentId,
                  student_name: fullname,
                  student_matricule: mysqlMatricule,
                  student_email: email,
                  student_phone: phone,
                  program_type: program_type,
                  payment_status: initialPaymentStatus,
                  admission_status: 'Under Review'
                });
              } catch {}

              console.log(`[Referral Downline Linked] Student #${studentId} (${fullname}) placed in downline of agent ${matchedAgent.code}.`);
            } else {
              console.warn(`[Referral Notice] Referral code "${refCode}" not found in referral_agents.`);
            }
          } catch (refErr) {
            console.error('Failed to link student to referral agent downline in MySQL:', refErr);
          }
        }

        insertedViaMySQL = true;
      } catch (error: any) {
        if (error?.code === 'ER_DUP_ENTRY') {
          return NextResponse.json(
            { success: false, message: 'This email is already registered. Please log in to your portal.' },
            { status: 409 }
          );
        }
        console.warn('MySQL registration failed, falling back to local database store:', error?.message || error);
        markMySQLOffline();
        if (process.env.NODE_ENV === 'production') {
          return NextResponse.json(
            { success: false, message: 'Database service is temporarily unavailable. Please retry in a few moments.' },
            { status: 503, headers: { 'Retry-After': '30' } }
          );
        }
      }
    }

    if (!insertedViaMySQL) {
      const existing = db.prepare('SELECT id FROM students WHERE email = ?').get(email) as { id: number } | undefined;
      if (existing) {
        return NextResponse.json(
          { success: false, message: 'This email is already registered. Please log in to your portal.' },
          { status: 409 }
        );
      }

      const insert = db.prepare(`
        INSERT INTO students (full_name, email, password, phone, degree_type, program_type, study_format, document_url, documents, payment_status, admission_status, payment_proof_url, payment_amount, payment_transaction_id, referred_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = insert.run(
        fullname, email, hashedPassword, phone, degree_type, program_type, study_format, docPayload, documentsPayload,
        initialPaymentStatus, 'Under Review', cleanProofUrl, cleanProofUrl ? effectiveFee : 0, cleanTxId, refCode || null
      );
      studentId = Number((result as any)?.lastInsertRowid || Date.now());

      if (cleanProofUrl) {
        try {
          adminStore.recordPaymentProof({
            student_id: studentId,
            amount: effectiveFee,
            operator: 'MTN Mobile Money',
            phone,
            transaction_id: cleanTxId,
            proof_url: cleanProofUrl,
            description: `Enrolment Application Fee for #${studentId}`
          });
        } catch (payErr) {
          console.warn('Local payment proof record notice:', payErr);
        }
      }

      if (refCode) {
        try {
          const studentRecord = db.students.findById(studentId);
          const localMatricule = studentRecord?.matricule || `LA26-${String(studentId).padStart(4, '0')}`;
          adminStore.recordReferral({
            agent_code: refCode,
            student_id: studentId,
            student_name: fullname,
            student_matricule: localMatricule,
            student_email: email,
            student_phone: phone,
            program_type: program_type,
            payment_status: initialPaymentStatus,
            admission_status: 'Under Review'
          });
          console.log(`[Referral Downline Linked (Local)] Student #${studentId} placed in downline of agent ${refCode}.`);
        } catch (refErr) {
          console.error('Failed to link student to referral agent downline in local store:', refErr);
        }
      }
    }

    const createdStudent = (insertedViaMySQL ? null : db.students.findById(studentId)) || {
      id: studentId,
      matricule: mysqlMatricule || undefined,
      full_name: fullname,
      email: (email || '').toLowerCase().trim(),
      phone: phone || '',
      degree_type: degree_type || 'HND',
      program_type: program_type || 'Software Engineering HND',
      study_format: study_format || 'oncampus',
      document_url: docPayload,
      documents: parsedDocuments,
      admission_status: 'Under Review',
      payment_status: initialPaymentStatus,
      payment_proof_url: cleanProofUrl || undefined,
      payment_amount: cleanProofUrl ? effectiveFee : 0,
      payment_transaction_id: cleanTxId,
      referred_by: refCode || undefined,
      created_at: new Date().toISOString()
    };

    if (cleanProofUrl) {
      setImmediate(() => {
        try {
          import('@/lib/email').then(({ sendPaymentAlertSignal }) => {
            sendPaymentAlertSignal({
              id: studentId,
              student_name: fullname,
              student_email: email,
              amount: effectiveFee,
              operator: 'MTN Mobile Money',
              transaction_id: cleanTxId || 'Enrolment Upload',
              status: 'Pending Verification (Registration Proof Uploaded)'
            }).catch(() => {});
          }).catch(() => {});
        } catch {}
      });
    }

    // Dispatch email signals in background (completely non-blocking)
    setImmediate(() => {
      try {
        sendApplicationSignals({
          id: studentId,
          full_name: fullname,
          email,
          phone,
          degree_type: degree_type || 'HND',
          program_type: program_type || 'Software Engineering HND',
          study_format: study_format || 'oncampus'
        }).catch(mailErr => {
          console.warn('Notification email dispatch notice:', mailErr);
        });
      } catch {}
    });

    const safeStudent = createStudentView(createdStudent as any);

    const response = NextResponse.json({
      success: true,
      data: safeStudent
    });
    setStudentSession(response, { id: studentId, email });
    return response;
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing registration. Please try again.' },
      { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 }
    );
  }
}
