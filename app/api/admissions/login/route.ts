import { NextResponse } from 'next/server';
import db from '@/lib/db';

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
      SELECT id, full_name, email, phone, degree_type, program_type, study_format, document_url, payment_status, admission_status, created_at
      FROM students
      WHERE email = ? AND password = ?
    `).get(email, password) as any;

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials. Please verify your email and password or register.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student,
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
