import { NextResponse } from 'next/server';
import { checkCampayTransaction } from '@/lib/campay';
import { adminStore } from '@/lib/db';
import { sendDecisionSignal } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const reference = searchParams.get('reference');
    const studentId = searchParams.get('studentId');

    if (!reference) {
      return NextResponse.json({ success: false, message: 'Reference parameter is required.' }, { status: 400 });
    }

    const txStatus = await checkCampayTransaction(reference);

    if (txStatus.status === 'SUCCESSFUL') {
      let student = null;
      if (studentId) {
        student = adminStore.updateStudentStatus(studentId, 'Approved', 'Paid');
        if (student) {
          // Send instant admission clearance email
          sendDecisionSignal(student, 'Approved').catch(err => {
            console.warn('Post-payment email signal notice:', err);
          });
        }
      }

      return NextResponse.json({
        success: true,
        status: 'SUCCESSFUL',
        amount: txStatus.amount,
        currency: txStatus.currency,
        operator: txStatus.operator,
        student,
        message: 'Payment verified and confirmed!'
      });
    }

    if (txStatus.status === 'FAILED') {
      return NextResponse.json({
        success: false,
        status: 'FAILED',
        operator: txStatus.operator,
        message: 'Payment request was declined, cancelled, or timed out.'
      });
    }

    // Still pending
    return NextResponse.json({
      success: true,
      status: 'PENDING',
      operator: txStatus.operator,
      message: 'Payment is pending mobile authorization PIN from applicant.'
    });
  } catch (error: any) {
    console.error('Campay status query error:', error);
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to query Campay transaction status.'
    }, { status: 500 });
  }
}
