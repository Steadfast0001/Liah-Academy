import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { success: false, message: 'Please provide student ID or email.' },
        { status: 400 }
      );
    }

    let student: any;
    if (id) {
      student = db.prepare(`
        SELECT id, full_name, email, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at
        FROM students
        WHERE id = ?
      `).get(parseInt(id));
    } else if (email) {
      const cleanEmail = email.toLowerCase().trim();
      student = db.prepare(`
        SELECT id, full_name, email, phone, degree_type, program_type, study_format, document_url, documents, payment_status, payment_amount, payment_proof_url, payment_transaction_id, admission_status, created_at
        FROM students
        WHERE LOWER(email) = ?
      `).get(cleanEmail);
    }

    if (!student) {
      return NextResponse.json(
        { success: false, message: 'Student record not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: student
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Server error retrieving admission status.' },
      { status: 500 }
    );
  }
}
