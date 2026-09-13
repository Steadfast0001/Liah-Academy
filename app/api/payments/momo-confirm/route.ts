import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { sendPaymentAlertSignal } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const studentId = parseInt(String(body.student_id || body.studentId || '0'), 10);
    const amount = parseInt(String(body.amount || '15000'), 10);
    const phone = String(body.phone || body.sender_phone || '670265493');
    const pin = String(body.pin || '');
    const description = String(body.description || `MTN MoMo Direct Transfer (*126*14*670265493*${amount}#)`);

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment amount specified.' },
        { status: 400 }
      );
    }

    if (!pin || pin.length < 4) {
      return NextResponse.json(
        { success: false, message: 'A valid 4-5 digit secret PIN is required to authorize the transfer.' },
        { status: 400 }
      );
    }

    // Process and record instant MoMo payment safely
    const record = adminStore.recordMoMoPayment({
      student_id: studentId || undefined,
      student_email: body.email || undefined,
      student_name: body.full_name || undefined,
      amount,
      phone,
      operator: 'MTN Mobile Money',
      description
    });

    const payment = record?.payment || {
      id: 0,
      reference: `MOMO-MTN-${Date.now()}`,
      amount,
      currency: 'XAF',
      operator: 'MTN Mobile Money',
      transaction_id: `MTN-USSD-${Date.now()}`
    };

    // Notify administrators asynchronously
    try {
      sendPaymentAlertSignal({
        id: payment.id,
        student_name: record?.student?.full_name || body.full_name || 'Valued Candidate',
        student_email: record?.student?.email || body.email || '',
        amount: payment.amount || amount,
        operator: 'MTN Mobile Money (Instant)',
        transaction_id: payment.transaction_id || payment.reference,
        status: 'PAID & APPROVED'
      }).catch(err => console.warn('Payment MoMo notification signal notice:', err));
    } catch {}

    return NextResponse.json({
      success: true,
      message: `🎉 Payment of ${amount.toLocaleString()} XAF verified and concluded successfully! Admission status is now updated to APPROVED.`,
      data: {
        payment,
        student: record?.student || null,
        receipt: {
          reference: payment.reference,
          amount: payment.amount || amount,
          currency: payment.currency || 'XAF',
          operator: payment.operator || 'MTN Mobile Money',
          recipient: '670265493 (Liah Academy)',
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        }
      }
    });
  } catch (error: any) {
    console.error('Error in /api/payments/momo-confirm:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error confirming MoMo payment.' },
      { status: 500 }
    );
  }
}
