import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { sendEmail, getAdminEmail } from '@/lib/email';

export async function GET() {
  try {
    const logs = adminStore.getEmailLogs();
    const adminEmail = getAdminEmail();
    return NextResponse.json({
      success: true,
      admin_email: adminEmail,
      total_logs: logs.length,
      data: logs
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, message } = body;

    const recipient = to || getAdminEmail();
    const sub = subject || 'Liah Academy Admin Test Signal';
    const msg = message || 'This is a test notification signal from Liah Academy Admin Console.';

    const result = await sendEmail({
      to: recipient,
      subject: sub,
      text: msg,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; border-radius: 8px;">
          <h2 style="color: #081F3E; margin-top: 0;">Liah Academy Test Signal</h2>
          <p style="color: #334155;">${msg}</p>
          <p style="font-size: 12px; color: #94a3b8;">Dispatched at: ${new Date().toLocaleString()}</p>
        </div>
      `,
      type: 'custom',
      recipientType: 'admin'
    });

    return NextResponse.json({
      success: true,
      message: `Test email signal sent to ${recipient}`,
      result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
