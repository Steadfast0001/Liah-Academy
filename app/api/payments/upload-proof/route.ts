import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { sendPaymentAlertSignal } from '@/lib/email';
import { getStudentSession } from '@/lib/student-auth';
import { createSignedFileUrl, isPrivateFileReference, storePrivateFile } from '@/lib/private-files';
import { createStudentView } from '@/lib/student-view';
import { isRateLimitedAsync, validateFileMagicBytes, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Cross-Origin validation
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin upload request rejected.' },
        { status: 403 }
      );
    }

    const studentSession = getStudentSession(request);
    if (!studentSession) {
      return NextResponse.json({ success: false, message: 'Please sign in before submitting payment proof.' }, { status: 401 });
    }
    if (await isRateLimitedAsync(`payment-proof:${studentSession.studentId}`, 5, 60 * 60_000)) {
      return NextResponse.json(
        { success: false, message: 'Too many payment proof uploads. Please wait before trying again.' },
        { status: 429 }
      );
    }

    let studentId = 0;
    let amount = 0;
    let operator = 'MTN Mobile Money';
    let phone = '670265493';
    let transactionId = '';
    let proofUrl = '';
    let description = '';
    let uploadedProof = false;
    let ownedStudent: any = null;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      studentId = parseInt(String(formData.get('student_id') || formData.get('studentId') || '0'), 10);
      amount = parseInt(String(formData.get('amount') || '15000'), 10);
      operator = String(formData.get('operator') || formData.get('payment_method') || 'MTN Mobile Money');
      phone = String(formData.get('phone') || formData.get('sender_phone') || '670265493');
      transactionId = String(formData.get('transaction_id') || formData.get('transactionId') || '');
      description = String(formData.get('description') || `Application Fee Proof for #${studentId}`);

      if (!Number.isSafeInteger(studentId) || studentId <= 0 || studentId !== studentSession.studentId) {
        return NextResponse.json({ success: false, message: 'Student account could not be verified.' }, { status: 401 });
      }

      if (getDatabaseSourceMode() === 'mysql') {
        try {
          await ensureMySQLTables();
          const [rows] = await getMySQLPool().execute(
            'SELECT id, full_name, email, phone, degree_type, program_type, study_format, admission_status, payment_status, payment_amount, created_at FROM students WHERE id = ?',
            [studentId]
          );
          ownedStudent = (rows as any[])[0];
        } catch (dbErr) {
          console.warn('MySQL student verification query failed, falling back to local database store:', dbErr);
          ownedStudent = adminStore.getStudentById(studentId);
        }
      } else {
        ownedStudent = adminStore.getStudentById(studentId);
      }
      if (!ownedStudent || ownedStudent.email.toLowerCase() !== studentSession.email) {
        return NextResponse.json({ success: false, message: 'Student account could not be verified.' }, { status: 401 });
      }

      if (!Number.isSafeInteger(amount) || amount <= 0 || amount > 10_000_000) {
        return NextResponse.json({ success: false, message: 'Enter a valid payment amount.' }, { status: 400 });
      }

      const file = formData.get('screenshot') || formData.get('proof') || formData.get('file');
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const fileObj = file as File;
        const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
        const extension = fileObj.name.slice(fileObj.name.lastIndexOf('.')).toLowerCase();
        if (!allowedTypes.has(fileObj.type) || !['.pdf', '.jpg', '.jpeg', '.png', '.webp'].includes(extension)) {
          return NextResponse.json({ success: false, message: 'Upload a valid PDF, JPEG, PNG, or WebP payment receipt.' }, { status: 400 });
        }

        const maxBytes = 5 * 1024 * 1024; // 5 MB maximum for proof uploads
        if (fileObj.size > maxBytes) {
          const actualMb = (fileObj.size / (1024 * 1024)).toFixed(2);
          return NextResponse.json(
            { success: false, message: `Upload Rejected: File is too large! Selected proof file is ${actualMb} MB. Maximum allowed limit is 5 MB. Please select or compress your screenshot.` },
            { status: 400 }
          );
        }

        const bytes = await fileObj.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Binary Magic Byte Inspection
        const magicCheck = validateFileMagicBytes(buffer, extension);
        if (!magicCheck.valid) {
          return NextResponse.json(
            { success: false, message: `Upload Rejected: ${magicCheck.error || 'Binary header does not match declared receipt format.'}` },
            { status: 400 }
          );
        }

        try {
          proofUrl = await storePrivateFile('payment-proofs', fileObj.name, buffer);
          uploadedProof = true;
        } catch (fsErr) {
          console.error('Payment proof storage failed:', fsErr);
          return NextResponse.json(
            { success: false, message: 'Payment proof storage is unavailable. Please try again later.' },
            { status: 500 }
          );
        }
      } else {
        return NextResponse.json({ success: false, message: 'Attach the payment proof as an uploaded receipt or screenshot.' }, { status: 400 });
      }
    } else {
      return NextResponse.json({ success: false, message: 'Use a multipart form for payment proof.' }, { status: 415 });
    }

    if (!uploadedProof || !isPrivateFileReference(proofUrl)) {
      return NextResponse.json({ success: false, message: 'A privately stored payment proof is required.' }, { status: 400 });
    }

    if (!proofUrl) {
      return NextResponse.json(
        { success: false, message: 'Payment screenshot or proof image is required.' },
        { status: 400 }
      );
    }

    let payment: any;
    let student: any;
    let recordedViaMySQL = false;

    if (getDatabaseSourceMode() === 'mysql') {
      const reference = `PAY-PROOF-${crypto.randomUUID()}`;
      try {
        const pool = getMySQLPool();
        const [studentRows] = await pool.execute(
          'SELECT id, full_name, email, phone, degree_type, program_type, study_format, admission_status, payment_status, payment_amount, created_at FROM students WHERE id = ?',
          [studentId]
        );
        student = (studentRows as any[])[0];
        if (!student || student.email.toLowerCase() !== studentSession.email) {
          return NextResponse.json({ success: false, message: 'Student account could not be verified.' }, { status: 401 });
        }

        const createdAt = new Date();
        await pool.execute(
          `INSERT INTO payments (reference, student_id, amount, currency, operator, phone, status, description, proof_url, transaction_id, created_at)
           VALUES (?, ?, ?, 'XAF', ?, ?, 'PENDING_VERIFICATION', ?, ?, ?, ?)`,
          [reference, studentId, amount, operator, phone, description, proofUrl, transactionId, createdAt]
        );
        await pool.execute(
          `UPDATE students SET payment_status = 'Pending Verification', payment_proof_url = ?,
           payment_transaction_id = ?, payment_amount = ? WHERE id = ?`,
          [proofUrl, transactionId, amount, studentId]
        );
        const [updatedStudents] = await pool.execute(
          'SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at FROM students WHERE id = ?',
          [studentId]
        );
        student = (updatedStudents as any[])[0];
        payment = {
          reference,
          student_id: studentId,
          student_name: student.full_name,
          student_email: student.email,
          amount,
          currency: 'XAF',
          operator,
          phone,
          status: 'PENDING_VERIFICATION',
          description,
          proof_url: proofUrl,
          transaction_id: transactionId,
          created_at: createdAt.toISOString()
        };
        recordedViaMySQL = true;
      } catch (poolErr: any) {
        if (poolErr?.message && poolErr.message.includes('Student account')) throw poolErr;
        console.warn('MySQL upload proof pooled query failed, falling back to local database store:', poolErr?.message || poolErr);
      }
    }

    if (!recordedViaMySQL) {
      const recorded = adminStore.recordPaymentProof({
        student_id: studentId,
        amount,
        operator,
        phone,
        transaction_id: transactionId,
        proof_url: proofUrl,
        description
      });
      payment = recorded.payment;
      student = recorded.student;
    }
    const safeStudent = student ? createStudentView(student) : null;
    const safePayment = {
      ...payment,
      proof_url: isPrivateFileReference(payment.proof_url) ? createSignedFileUrl(payment.proof_url) : ''
    };

    // Notify administrators asynchronously
    try {
      sendPaymentAlertSignal({
        id: payment.id,
        student_name: student?.full_name || 'Prospective Candidate',
        student_email: student?.email || '',
        amount: payment.amount,
        operator: payment.operator,
        transaction_id: payment.transaction_id || payment.reference,
        status: 'Pending Verification (Proof Uploaded)'
      }).catch(err => console.warn('Payment notification signal notice:', err));
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Proof of payment submitted successfully! Our administrative team will verify your transaction shortly.',
      data: {
        payment: safePayment,
        student: safeStudent
      }
    });
  } catch (error: any) {
    console.error('Error in /api/payments/upload-proof:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error while processing proof of payment.' },
      { status: 500 }
    );
  }
}
