import { NextResponse } from 'next/server';
import { adminStore, confirmStudentReferralOnPaymentApproval, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import { sendDecisionSignal } from '@/lib/email';
import { createSignedFileUrl, isPrivateFileReference } from '@/lib/private-files';
import { stripStudentPassword } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let payments;
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const sql = `SELECT p.*, s.full_name AS student_name, s.email AS student_email
          FROM payments p LEFT JOIN students s ON s.id = p.student_id
          ${status && status !== 'ALL' ? 'WHERE UPPER(p.status) = UPPER(?)' : ''}
          ORDER BY p.created_at DESC`;
        const [rows] = await getMySQLPool().execute(sql, status && status !== 'ALL' ? [status] : []);
        payments = rows;
      } catch (mysqlErr) {
        console.warn('MySQL payments query failed, falling back to local database store:', mysqlErr);
        payments = adminStore.getPayments();
        if (status && status !== 'ALL') {
          payments = payments.filter(p => p.status.toUpperCase() === status.toUpperCase());
        }
      }
    } else {
      payments = adminStore.getPayments();
      if (status && status !== 'ALL') {
        payments = payments.filter(p => p.status.toUpperCase() === status.toUpperCase());
      }
    }

    const safePayments = (payments as any[]).map(p => ({
      ...p,
      proof_url: isPrivateFileReference(p.proof_url) ? createSignedFileUrl(p.proof_url) : p.proof_url
    }));

    return NextResponse.json({
      success: true,
      data: safePayments
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load payments.' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reference, id, status, verified_by, notify_applicant } = body;

    const targetRef = reference || id;
    if (!targetRef) {
      return NextResponse.json(
        { success: false, message: 'Payment reference or ID is required.' },
        { status: 400 }
      );
    }

    const normalizedStatus = (status || 'APPROVED').toUpperCase();
    if (!['APPROVED', 'PAID', 'REJECTED', 'FAILED'].includes(normalizedStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment status. Must be APPROVED, PAID, REJECTED, or FAILED.' },
        { status: 400 }
      );
    }

    let payment: any;
    let student: any;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const pool = getMySQLPool();
      const [rows] = await pool.execute(
        `SELECT p.*, s.id AS student_record_id, s.full_name AS student_name, s.email AS student_email,
         s.program_type, s.degree_type, s.admission_status AS student_admission_status
         FROM payments p LEFT JOIN students s ON s.id = p.student_id
         WHERE p.reference = ?`,
        [String(targetRef)]
      );
      const record = (rows as any[])[0];
      if (!record) {
        return NextResponse.json({ success: false, message: 'Payment record not found.' }, { status: 404 });
      }

      await pool.execute(
        'UPDATE payments SET status = ?, verified_by = ?, verified_at = NOW() WHERE reference = ?',
        [normalizedStatus, verified_by || 'Admin Office', record.reference]
      );
      if (record.student_record_id) {
        if (normalizedStatus === 'APPROVED' || normalizedStatus === 'PAID') {
          await pool.execute(
            `UPDATE students SET payment_status = 'Paid',
             admission_status = IF(admission_status = 'Rejected', admission_status, 'Approved') WHERE id = ?`,
            [record.student_record_id]
          );
          await confirmStudentReferralOnPaymentApproval(Number(record.student_record_id));
        } else if (normalizedStatus === 'REJECTED' || normalizedStatus === 'FAILED') {
          await pool.execute("UPDATE students SET payment_status = 'Rejected' WHERE id = ?", [record.student_record_id]);
        }
        const [studentRows] = await pool.execute(
          'SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format, admission_status, payment_status, payment_amount, created_at FROM students WHERE id = ?',
          [record.student_record_id]
        );
        student = (studentRows as any[])[0] || null;
      }
      payment = {
        ...record,
        status: normalizedStatus,
        verified_by: verified_by || 'Admin Office',
        verified_at: new Date().toISOString()
      };
    } else {
      const result = adminStore.verifyPayment(
        targetRef,
        normalizedStatus as any,
        verified_by || 'Admin Office'
      );
      payment = result.payment;
      student = result.student;
    }

    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment record not found.' },
        { status: 404 }
      );
    }

    // Trigger confirmation email if payment was approved
    if (notify_applicant !== false && (normalizedStatus === 'APPROVED' || normalizedStatus === 'PAID') && student) {
      try {
        await sendDecisionSignal({
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          program_type: student.program_type,
          degree_type: student.degree_type
        }, 'Approved');
      } catch (err) {
        console.warn('Payment decision email signal error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${payment.reference} status updated to ${normalizedStatus}.`,
      data: {
        payment,
        student: student ? stripStudentPassword(student) : null
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to update payment status.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
