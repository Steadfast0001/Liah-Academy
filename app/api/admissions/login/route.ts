import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, hashPassword, needsRehash } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const cleanEmail = String(body.email || body.identifier || '').trim().toLowerCase();
    const cleanPassword = String(body.password || body.pass || '').trim();

    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const student = db.prepare(`
      SELECT id, full_name, email, password, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at
      FROM students
      WHERE LOWER(email) = ?
    `).get(cleanEmail) as any;

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'No application found with this email address. Please check your credentials or complete enrolment.' },
        { status: 401 }
      );
    }

    // Verify password against stored PBKDF2 encrypted hash
    const isPasswordValid = verifyPassword(cleanPassword, student.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Incorrect password. Please verify your credentials.' },
        { status: 401 }
      );
    }

    // Automatic seamless rehash upgrade if account had legacy unencrypted password
    if (needsRehash(student.password)) {
      try {
        const encrypted = hashPassword(cleanPassword);
        db.prepare('UPDATE students SET password = ? WHERE id = ?').run(encrypted, student.id);
      } catch (rehashErr) {
        console.warn('Password rehash upgrade notice:', rehashErr);
      }
    }

    // Parse documents if stored as JSON string
    if (student.documents && typeof student.documents === 'string') {
      try {
        student.documents = JSON.parse(student.documents);
      } catch {}
    }

    // Exclude password hash from client response
    const { password: _, ...safeStudent } = student;

    return NextResponse.json({
      success: true,
      data: safeStudent,
      message: 'Authentication successful. Welcome to your Student Portal!'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing portal login.' },
      { status: 500 }
    );
  }
}
