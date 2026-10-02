import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';
import { getStudentSession } from '@/lib/student-auth';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import { createStudentView } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');
    const studentSession = getStudentSession(request);
    const isAdmin = await verifyAdminAuth(request);

    if (!studentSession && !isAdmin) {
      return NextResponse.json(
        { success: false, message: 'Please sign in to view application status.' },
        { status: 401 }
      );
    }

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: 'Please provide student ID or email.' },
        { status: 400 }
      );
    }

    let student: any;
    let lookupQuery: string;
    let lookupValue: number | string;
    if (id) {
      const studentId = Number(id);
      if (!Number.isSafeInteger(studentId) || studentId <= 0) {
        return NextResponse.json({ success: false, message: 'Invalid student ID.' }, { status: 400 });
      }
      if (studentSession && !isAdmin && studentSession.studentId !== studentId) {
        return NextResponse.json({ success: false, message: 'You can only view your own application.' }, { status: 403 });
      }
      lookupQuery = 'SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at FROM students WHERE id = ?';
      lookupValue = studentId;
    } else if (email) {
      const cleanEmail = email.toLowerCase().trim();
      if (studentSession && !isAdmin && studentSession.email !== cleanEmail) {
        return NextResponse.json({ success: false, message: 'You can only view your own application.' }, { status: 403 });
      }
      lookupQuery = 'SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at FROM students WHERE LOWER(email) = ?';
      lookupValue = cleanEmail;
    }

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute(lookupQuery!, [lookupValue!]);
        student = (rows as any[])[0];
      } catch (mysqlErr: any) {
        console.warn('MySQL status query failed, falling back to local database store:', mysqlErr?.message || mysqlErr);
        markMySQLOffline();
        student = db.prepare(lookupQuery!).get(lookupValue!);
      }
    } else {
      student = db.prepare(lookupQuery!).get(lookupValue!);
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student record not found.' },
        { status: 404 }
      );
    }

    if (studentSession && !isAdmin && (
      student.id !== studentSession.studentId || student.email.toLowerCase() !== studentSession.email
    )) {
      return NextResponse.json({ success: false, message: 'You can only view your own application.' }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      data: createStudentView(student)
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Application status is temporarily unavailable.' },
      { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 }
    );
  }
}
