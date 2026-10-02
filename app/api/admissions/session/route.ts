import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';
import { getStudentSession } from '@/lib/student-auth';
import { createStudentView } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  const session = getStudentSession(request);
  if (!session) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 });
  }

  const studentQuery = `
    SELECT id, matricule, full_name, email, phone, degree_type, program_type, study_format,
      document_url, documents, payment_status, payment_amount, payment_proof_url,
      payment_transaction_id, admission_status, created_at
    FROM students
    WHERE id = ?
  `;
  let student: any;
  try {
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute(studentQuery, [session.studentId]);
        student = (rows as any[])[0];
      } catch (mysqlErr: any) {
        console.warn('MySQL session query failed, falling back to local database store:', mysqlErr?.message || mysqlErr);
        markMySQLOffline();
        student = db.prepare(studentQuery).get(session.studentId) as any;
      }
    } else {
      student = db.prepare(studentQuery).get(session.studentId) as any;
    }
  } catch {
    return NextResponse.json({ success: false, authenticated: false }, { status: 503 });
  }

  if (!student || student.email.toLowerCase() !== session.email) {
    const response = NextResponse.json({ success: false, authenticated: false }, { status: 401 });
    response.cookies.set('liah_student_session', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      path: '/',
      maxAge: 0
    });
    return response;
  }

  return NextResponse.json({ success: true, authenticated: true, data: createStudentView(student) });
}