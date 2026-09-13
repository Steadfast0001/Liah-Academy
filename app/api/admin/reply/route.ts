import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { sendEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

function getAppUrl(): string {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, '');
  }
  return 'https://liahacademy.com';
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { 
      recipient, 
      recipientName, 
      subject, 
      message, 
      inquiryId, 
      studentId 
    } = body;

    if (!recipient || !subject || !message) {
      return NextResponse.json(
        { success: false, message: 'Recipient email, subject, and message content are required.' },
        { status: 400 }
      );
    }

    const appUrl = getAppUrl();
    const nameToUse = recipientName || 'Valued Candidate';

    // Format HTML email response
    const formattedHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 0 auto; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="background: #081F3E; padding: 28px 24px; text-align: center; color: #ffffff;">
          <h1 style="color: #F5A623; margin: 0 0 6px 0; font-size: 24px; font-weight: bold; letter-spacing: 0.5px;">LIAH ACADEMY</h1>
          <p style="margin: 0; color: #cbd5e1; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Higher Technical Institute &bull; Buea, Cameroon</p>
        </div>
        
        <div style="padding: 32px 28px; color: #334155; line-height: 1.6;">
          <h2 style="color: #081F3E; margin-top: 0; font-size: 20px;">Dear ${nameToUse},</h2>
          
          <div style="background: #f8fafc; border-left: 4px solid #081F3E; padding: 18px 20px; margin: 20px 0; border-radius: 6px; font-size: 15px; color: #1e293b; white-space: pre-line;">
            ${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}
          </div>

          <p style="margin-top: 24px; font-size: 14px; color: #475569;">
            If you have any further questions or require additional assistance, please feel free to reply to this email or reach us directly via WhatsApp.
          </p>
          
          <div style="margin-top: 28px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 13px; color: #64748B;">
            <p style="margin: 0 0 4px 0; font-weight: bold; color: #081F3E;">Admissions &amp; Academic Administration</p>
            <p style="margin: 0 0 4px 0;">Liah Academy of Technology and Management</p>
            <p style="margin: 0 0 4px 0;">📍 Campus: Backweri Town, Buea, Southwest Region, Cameroon</p>
            <p style="margin: 0 0 4px 0;">📞 Telephone / WhatsApp: +237 699 526 607 / +237 670 265 493</p>
            <p style="margin: 0;">✉️ Email: info@liahacademy.com &bull; 🌐 <a href="${appUrl}" style="color: #081F3E;">${appUrl}</a></p>
          </div>
        </div>
        
        <div style="background: #f1f5f9; padding: 14px; text-align: center; font-size: 12px; color: #94a3b8;">
          &copy; ${new Date().getFullYear()} Liah Academy of Technology and Management. All rights reserved.
        </div>
      </div>
    `;

    // Send the email & log to outbox
    const result = await sendEmail({
      to: recipient.trim().toLowerCase(),
      subject: subject.trim(),
      html: formattedHtml,
      text: `Dear ${nameToUse},\n\n${message}\n\n---\nLiah Academy Admissions & Administration\nBuea, Cameroon\nTel/WhatsApp: +237 699 526 607`,
      type: 'custom',
      recipientType: inquiryId ? 'user' : 'applicant'
    });

    // If this was responding to an inquiry, mark the inquiry as replied
    if (inquiryId) {
      adminStore.updateInquiry(inquiryId, { status: 'replied' });
    }

    return NextResponse.json({
      success: true,
      message: `Reply sent successfully to ${recipient}.`,
      status: result.status
    });
  } catch (error: any) {
    console.error('Admin reply dispatch error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to dispatch reply.' },
      { status: 500 }
    );
  }
}