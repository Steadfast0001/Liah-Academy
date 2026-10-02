import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';
import { sanitizeInput, isValidEmail } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const rawEmail = searchParams.get('email');
    const email = sanitizeInput(rawEmail)?.toLowerCase().trim();

    if (!email || !isValidEmail(email)) {
      return NextResponse.json(
        { exists: false, message: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    let existing: any = null;

    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute(
          'SELECT id, email, full_name, admission_status FROM students WHERE LOWER(email) = ? LIMIT 1',
          [email]
        );
        existing = (rows as any[])[0];
      } catch (mysqlErr: any) {
        console.warn('MySQL email check failed, checking local store:', mysqlErr?.message || mysqlErr);
        markMySQLOffline();
        existing = db.prepare('SELECT id, email, full_name, admission_status FROM students WHERE LOWER(email) = ?').get(email);
      }
    } else {
      existing = db.prepare('SELECT id, email, full_name, admission_status FROM students WHERE LOWER(email) = ?').get(email);
    }

    if (existing) {
      return NextResponse.json({
        exists: true,
        message: 'This email is already registered. Please log in to your Student Portal.'
      });
    }

    return NextResponse.json({
      exists: false,
      message: 'Email is available for registration.'
    });
  } catch (error: any) {
    console.error('Email check error:', error);
    return NextResponse.json({ exists: false, message: 'Unable to check email at this time.' }, { status: 200 });
  }
}
