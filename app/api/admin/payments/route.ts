import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import { sendDecisionSignal } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    let payments = adminStore.getPayments();
    if (status && status !== 'ALL') {
      payments = payments.filter(p => p.status.toUpperCase() === status.toUpperCase());
    }

    return NextResponse.json({
      success: true,
      data: payments
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { reference, id, status, verified_by, notify_applicant } = body;

    const targetRef = reference || id;
    if (!targetRef) {
      return NextResponse.json(
        { success: false, message: 'Payment reference or ID is required.' },
        { status: 400 }
      );
    }

    const normalizedStatus = (status || 'APPROVED').toUpperCase();
    if (!['APPROVED', 'PAID', 'REJECTED', 'FAILED'].includes(normalizedStatus)) {
      return NextResponse.json(
        { success: false, message: 'Invalid payment status. Must be APPROVED, PAID, REJECTED, or FAILED.' },
        { status: 400 }
      );
    }

    const { payment, student } = adminStore.verifyPayment(
      targetRef,
      normalizedStatus as any,
      verified_by || 'Admin Office'
    );

    if (!payment) {
      return NextResponse.json(
        { success: false, message: 'Payment record not found.' },
        { status: 404 }
      );
    }

    // Trigger confirmation email if payment was approved
    if (notify_applicant !== false && (normalizedStatus === 'APPROVED' || normalizedStatus === 'PAID') && student) {
      try {
        await sendDecisionSignal({
          id: student.id,
          full_name: student.full_name,
          email: student.email,
          program_type: student.program_type,
          degree_type: student.degree_type
        }, 'Approved');
      } catch (err) {
        console.warn('Payment decision email signal error:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Payment ${payment.reference} status updated to ${normalizedStatus}.`,
      data: {
        payment,
        student
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
