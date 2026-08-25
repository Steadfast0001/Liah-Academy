import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { sendDecisionSignal } from '@/lib/email';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, status, amount, external_reference, operator } = body;

    console.log(`[Campay Webhook] Ref: ${reference} | Status: ${status} | ExtRef: ${external_reference} | Op: ${operator}`);

    if (status === 'SUCCESSFUL' && external_reference) {
      // Parse student ID from external reference (format: LIAH-<studentId>-<timestamp>)
      const parts = external_reference.split('-');
      if (parts.length >= 2 && parts[1] && parts[1] !== 'GEN') {
        const studentId = parseInt(parts[1]);
        const student = adminStore.updateStudentStatus(studentId, 'Approved', 'Paid');
        if (student) {
          sendDecisionSignal(student, 'Approved').catch(console.error);
        }
      }
    }

    return NextResponse.json({ success: true, received: true });
  } catch (error: any) {
    console.error('Campay Webhook error:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
