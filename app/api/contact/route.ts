import { NextResponse } from 'next/server';
import db from '@/lib/db';
import { sendInquirySignals } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name, email, and message.' },
        { status: 400 }
      );
    }

    const result = db.prepare(`
      INSERT INTO inquiries (name, email, subject, message)
      VALUES (?, ?, ?, ?)
    `).run(name, email, subject || 'General Inquiry', message);

    const inquiryId = result.lastInsertRowid;

    // Dispatch email signals to sender and admin
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
