import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';
import { verifyPassword, hashPassword, verifyPasswordAsync, hashPasswordAsync, needsRehash, checkRateLimitAsync, recordFailedAttemptAsync, clearRateLimitAsync, validateRequestOrigin } from '@/lib/security';
import { isStudentAuthConfigured, setStudentSession } from '@/lib/student-auth';
import { createStudentView } from '@/lib/student-view';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Cross-Origin verification
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin login request rejected.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const cleanEmail = String(body.email || body.identifier || '').trim().toLowerCase();
    const cleanPassword = String(body.password || body.pass || '');

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip')?.trim() || '127.0.0.1';
    const rateLimitKey = `student-login:${clientIp}:${cleanEmail}`;

    const limitCheck = await checkRateLimitAsync(rateLimitKey, 5, 15 * 60 * 1000);
    if (limitCheck.isLimited) {
      const resetMin = Math.ceil(limitCheck.resetInSeconds / 60);
      return NextResponse.json(
        { success: false, message: `Too many failed login attempts. Access is temporarily locked for ${resetMin} minute(s) to protect your account. Please try again later.` },
        { status: 429 }
      );
    }

    if (!isStudentAuthConfigured()) {
      return NextResponse.json(
        { success: false, message: 'Student authentication is not configured on this server.' },
        { status: 503 }
      );
    }

    const studentQuery = `
      SELECT id, matricule, full_name, email, password, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at
      FROM students
      WHERE email = ?
        AND password IS NOT NULL
        AND TRIM(password) <> ''
    `;
    let student: any;
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute(studentQuery, [cleanEmail]);
        student = (rows as any[])[0];
      } catch (mysqlErr: any) {
        console.warn('MySQL login query failed, falling back to local database store:', mysqlErr?.message || mysqlErr);
        markMySQLOffline();
        student = db.prepare(studentQuery).get(cleanEmail) as any;
      }
    } else {
      student = db.prepare(studentQuery).get(cleanEmail) as any;
    }

    if (!student) {
      const failed = await recordFailedAttemptAsync(rateLimitKey, 5, 15 * 60 * 1000);
      return NextResponse.json(
        { success: false, message: `No application found with this email address. Please check your credentials or complete enrolment. (${failed.remainingAttempts} attempt(s) remaining)` },
        { status: 401 }
      );
    }

    // Verify password against stored PBKDF2 encrypted hash
    const isPasswordValid = await verifyPasswordAsync(cleanPassword, student.password);

    if (!isPasswordValid) {
      const failed = await recordFailedAttemptAsync(rateLimitKey, 5, 15 * 60 * 1000);
      return NextResponse.json(
        { success: false, message: `Incorrect password. Please verify your credentials. (${failed.remainingAttempts} attempt(s) remaining)` },
        { status: 401 }
      );
    }

    await clearRateLimitAsync(rateLimitKey);

    // Automatic seamless rehash upgrade if account had legacy unencrypted password
    if (needsRehash(student.password)) {
      try {
        const encrypted = await hashPasswordAsync(cleanPassword);
        if (getDatabaseSourceMode() === 'mysql') {
          await getMySQLPool().execute('UPDATE students SET password = ? WHERE id = ?', [encrypted, student.id]);
        } else {
          db.prepare('UPDATE students SET password = ? WHERE id = ?').run(encrypted, student.id);
        }
      } catch (rehashErr) {
        console.warn('Password rehash upgrade notice:', rehashErr);
      }
    }

    const safeStudent = createStudentView(student);

    const response = NextResponse.json({
      success: true,
      data: safeStudent,
      student: safeStudent,
      message: 'Authentication successful. Welcome to your Student Portal!'
    });
    setStudentSession(response, { id: student.id, email: student.email });
    return response;
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing portal login.' },
      { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 }
    );
  }
}
