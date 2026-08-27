import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendApplicationSignals } from '@/lib/email';
import { hashPassword } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const fullname = body.fullname || body.full_name;
    const { email, password, phone, degree_type, program_type, study_format, document_url, documents } = body;

    if (!fullname || !email || !password || !phone) {
      return NextResponse.json(
        { success: false, message: 'Please provide all required fields.' },
        { status: 400 }
      );
    }

    // Check if email already registered
    const existing = db.prepare('SELECT id FROM students WHERE email = ?').get(email) as { id: number } | undefined;
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'This email is already registered. Please log in to your portal.' },
        { status: 409 }
      );
    }

    // Hash password with cryptographic PBKDF2 SHA-512 before database storage
    const hashedPassword = hashPassword(password);
    const docPayload = documents ? (typeof documents === 'string' ? documents : JSON.stringify(documents)) : (document_url || '');

    const insert = db.prepare(`
      INSERT INTO students (full_name, email, password, phone, degree_type, program_type, study_format, document_url, payment_status, admission_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Pending', 'Under Review')
    `);

    const result = insert.run(
      fullname,
      email,
      hashedPassword,
      phone,
      degree_type || 'HND',
      program_type || 'Software Engineering HND',
      study_format || 'oncampus',
      docPayload
    );

    const studentId = result.lastInsertRowid;

    // Dispatch email signals to both the applicant and the admin
    try {
      await sendApplicationSignals({
        id: studentId,
        full_name: fullname,
        email,
        phone,
        degree_type: degree_type || 'HND',
        program_type: program_type || 'Software Engineering HND',
        study_format: study_format || 'oncampus'
      });
    } catch (mailErr) {
      console.warn('Notification email dispatch notice:', mailErr);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: studentId,
        full_name: fullname,
        email,
        degree_type,
        program_type,
        study_format,
        admission_status: 'Under Review',
        payment_status: 'Pending',
        message: 'Application registered successfully! Confirmation email has been sent to your inbox.'
      }
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error processing registration: ' + (error.message || '') },
      { status: 500 }
    );
  }
}
