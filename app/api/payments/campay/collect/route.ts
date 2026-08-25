import { NextResponse } from 'next/server';
import { requestCampayPayment } from '@/lib/campay';
import { adminStore } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, amount, studentId, description } = body;

    if (!phone) {
      return NextResponse.json({ success: false, message: 'Phone number is required.' }, { status: 400 });
    }

    const isDemo = (process.env.CAMPAY_ENV || 'demo') === 'demo';
    // Campay Demo sandbox environment requires test amounts between 1 and 25 XAF
    const payAmount = isDemo ? 10 : (Number(amount) || 50000);
    const student = studentId ? adminStore.getStudentById(studentId) : null;
    const desc = description || `Liah Academy Enrollment Deposit #${studentId || ''}`;
    const extRef = `LIAH-${studentId || 'GEN'}-${Date.now()}`;

    const collectRes = await requestCampayPayment({
      from: phone,
      amount: payAmount,
      description: desc,
      externalReference: extRef
    });

    return NextResponse.json({
      success: true,
      reference: collectRes.reference,
      ussd_code: collectRes.ussd_code,
      operator: collectRes.operator,
      message: `USSD payment prompt dispatched to ${phone}. Please confirm the prompt on your phone with your Mobile Money PIN.`
    });
  } catch (error: any) {
    console.error('Campay collection error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to initiate Campay Mobile Money payment.'
    }, { status: 500 });
  }
}
