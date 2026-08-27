import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { verifyPassword, hashPassword, needsRehash } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide both email and password.' },
        { status: 400 }
      );
    }

    const student = db.prepare(`
      SELECT id, full_name, email, password, phone, degree_type, program_type, study_format, document_url, payment_status, admission_status, created_at
      FROM students
      WHERE email = ?
    `).get(email) as any;

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your email and password or register.' },
        { status: 401 }
      );
    }

    // Verify password against stored PBKDF2 encrypted hash
    const isPasswordValid = verifyPassword(password, student.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your email and password or register.' },
        { status: 401 }
      );
    }

    // Automatic seamless rehash upgrade if account had legacy unencrypted password
    if (needsRehash(student.password)) {
      try {
        const encrypted = hashPassword(password);
        db.prepare('UPDATE students SET password = ? WHERE id = ?').run(encrypted, student.id);
      } catch (rehashErr) {
        console.warn('Password rehash upgrade notice:', rehashErr);
      }
    }

    // Exclude password hash from client response
    const { password: _, ...safeStudent } = student;

    return NextResponse.json({
      success: true,
      data: safeStudent,
      message: 'Login successful. Welcome to your Student Portal dashboard!'
    });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing portal login.' },
      { status: 500 }
    );
  }
}
