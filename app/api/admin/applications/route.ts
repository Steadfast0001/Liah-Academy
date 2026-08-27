import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { sendDecisionSignal } from '@/lib/email';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const applications = adminStore.getStudents();
    return NextResponse.json({ success: true, data: applications });
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
    const { id, admission_status, payment_status, notify_applicant } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Application ID is required.' }, { status: 400 });
    }

    const previous = adminStore.getStudentById(id);
    if (!previous) {
      return NextResponse.json({ success: false, message: 'Application not found.' }, { status: 404 });
    }

    const nextAdmission = (payment_status === 'Paid' && !admission_status && previous.admission_status !== 'Rejected') 
      ? 'Approved' 
      : admission_status;

    const updated = adminStore.updateStudentStatus(id, nextAdmission, payment_status);

    // If marked Paid or Rejected, also update corresponding payment proof record
    if (payment_status) {
      const payments = adminStore.getPayments().filter(p => p.student_id === Number(id));
      if (payments.length > 0) {
        const latestPayment = payments[0];
        if (payment_status === 'Paid' && latestPayment.status !== 'APPROVED') {
          adminStore.verifyPayment(latestPayment.reference, 'APPROVED', 'Admin Office');
        } else if (payment_status === 'Rejected' && latestPayment.status !== 'REJECTED') {
          adminStore.verifyPayment(latestPayment.reference, 'REJECTED', 'Admin Office');
        }
      }
    }

    // If status changed to Approved or Rejected, trigger decision email notification
    if (
      notify_applicant !== false && 
      ((nextAdmission && nextAdmission !== previous.admission_status && (nextAdmission === 'Approved' || nextAdmission === 'Rejected')) ||
       (payment_status === 'Paid' && previous.payment_status !== 'Paid'))
    ) {
      try {
        if (updated) {
          await sendDecisionSignal({
            id: updated.id,
            full_name: updated.full_name,
            email: updated.email,
            program_type: updated.program_type,
            degree_type: updated.degree_type
          }, 'Approved');
        }
      } catch (mailErr) {
        console.warn('Decision email signal notice:', mailErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Application #${id} updated successfully. Status: ${updated.admission_status}`,
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    adminStore.deleteStudent(parseInt(idStr));
    return NextResponse.json({ success: true, message: `Application #${idStr} removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
