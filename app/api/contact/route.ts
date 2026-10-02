import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';
import { sendInquirySignals } from '@/lib/email';
import { isRateLimited, isValidEmail, normalizeText } from '@/lib/security';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const clientIp = forwardedFor.split(',')[0].trim();
    if (isRateLimited(`contact:${clientIp}`, 5, 60_000)) {
      return NextResponse.json(
        { success: false, message: 'Too many contact requests. Please wait a minute and try again.' },
        { status: 429 }
      );
    }

    const name = normalizeText(body.name, 120);
    const email = normalizeText(body.email, 120).toLowerCase();
    const subject = normalizeText(body.subject, 191) || 'General Inquiry';
    const message = normalizeText(body.message, 2000);

    if (!name || !email || !isValidEmail(email) || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid name, email, and message.' },
        { status: 400 }
      );
    }

    let inquiryId: number;
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [result] = await getMySQLPool().execute(
          'INSERT INTO inquiries (name, email, subject, message) VALUES (?, ?, ?, ?)',
          [name, email, subject, message]
        );
        inquiryId = Number((result as { insertId: number }).insertId);
      } catch (dbErr) {
        console.warn('MySQL contact insert failed, saving to local store:', dbErr);
        markMySQLOffline();
        const result = db.prepare(`
          INSERT INTO inquiries (name, email, subject, message)
          VALUES (?, ?, ?, ?)
        `).run(name, email, subject, message);
        inquiryId = Number(result.lastInsertRowid);
      }
    } else {
      const result = db.prepare(`
        INSERT INTO inquiries (name, email, subject, message)
        VALUES (?, ?, ?, ?)
      `).run(name, email, subject, message);
      inquiryId = Number(result.lastInsertRowid);
    }

    try {
      await sendInquirySignals({
        id: inquiryId,
        name,
        email,
        subject: subject || 'General Inquiry',
        message
      });
    } catch (mailErr) {
      console.warn('Inquiry email dispatch notice:', mailErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Thank you for reaching out! Our admissions & corporate team will contact you shortly.'
    });
  } catch (error: any) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error sending message. Please try again later.' },
      { status: 500 }
    );
  }
}
