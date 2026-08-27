import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    let studentId = 0;
    let amount = 0;
    let operator = 'MTN Mobile Money';
    let phone = '670265493';
    let transactionId = '';
    let proofUrl = '';
    let description = '';

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      studentId = parseInt(String(formData.get('student_id') || formData.get('studentId') || '0'), 10);
      amount = parseInt(String(formData.get('amount') || '50000'), 10);
      operator = String(formData.get('operator') || formData.get('payment_method') || 'MTN Mobile Money');
      phone = String(formData.get('phone') || formData.get('sender_phone') || '670265493');
      transactionId = String(formData.get('transaction_id') || formData.get('transactionId') || '');
      description = String(formData.get('description') || `Mobile Money Payment Proof for #${studentId}`);

      const file = formData.get('screenshot') || formData.get('proof') || formData.get('file');
      if (file && typeof file === 'object' && 'arrayBuffer' in file) {
        const fileObj = file as File;
        const bytes = await fileObj.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = path.join(process.cwd(), 'public', 'assets', 'proofs');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeExt = path.extname(fileObj.name) || '.png';
        const fileName = `proof_${studentId || 'anon'}_${Date.now()}${safeExt}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);
        proofUrl = `/assets/proofs/${fileName}`;
      } else {
        proofUrl = String(formData.get('proof_url') || '');
      }
    } else {
      const body = await request.json();
      studentId = parseInt(String(body.student_id || body.studentId || '0'), 10);
      amount = parseInt(String(body.amount || '50000'), 10);
      operator = String(body.operator || body.payment_method || 'MTN Mobile Money');
      phone = String(body.phone || body.sender_phone || '670265493');
      transactionId = String(body.transaction_id || body.transactionId || '');
      description = String(body.description || `Mobile Money Payment Proof for #${studentId}`);
      proofUrl = String(body.proof_url || body.screenshot || '');
    }

    if (!studentId || isNaN(studentId)) {
      return NextResponse.json(
        { success: false, message: 'Valid Student ID is required to associate proof of payment.' },
        { status: 400 }
      );
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      amount = 50000;
    }

    if (!proofUrl) {
      return NextResponse.json(
        { success: false, message: 'Payment screenshot or proof image is required.' },
        { status: 400 }
      );
    }

    const { payment, student } = adminStore.recordPaymentProof({
      student_id: studentId,
      amount,
      operator,
      phone,
      transaction_id: transactionId,
      proof_url: proofUrl,
      description
    });

    return NextResponse.json({
      success: true,
      message: 'Proof of payment submitted successfully! Our administrative team will verify your transaction shortly.',
      data: {
        payment,
        student
      }
    });
  } catch (error: any) {
    console.error('Error in /api/payments/upload-proof:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Internal server error while processing proof of payment.' },
      { status: 500 }
    );
  }
}
