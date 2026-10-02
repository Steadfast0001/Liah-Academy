import { NextResponse } from 'next/server';
import { storePrivateFile } from '@/lib/private-files';
import { isRateLimitedAsync, validateFileMagicBytes, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    // 1. Cross-Origin validation
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin upload request rejected.' },
        { status: 403 }
      );
    }

    // 2. Persistent multi-process rate limiting
    const forwardedFor = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const clientIp = forwardedFor.split(',')[0].trim();
    if (await isRateLimitedAsync(`document-upload:${clientIp}`, 12, 10 * 60_000)) {
      return NextResponse.json(
        { success: false, message: 'Too many document uploads. Please wait before trying again.' },
        { status: 429 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') || formData.get('document');
    const slotId = String(formData.get('slotId') || 'doc');

    if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
      return NextResponse.json(
        { success: false, message: 'No valid file provided for upload.' },
        { status: 400 }
      );
    }

    const fileObj = file as File;
    const allowedTypes = new Set(['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);
    const allowedExtensions = new Set(['.pdf', '.jpg', '.jpeg', '.png', '.webp']);
    const extension = fileObj.name.slice(fileObj.name.lastIndexOf('.')).toLowerCase();
    if (!allowedTypes.has(fileObj.type) || !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { success: false, message: 'Upload a PDF, JPEG, PNG, or WebP document.' },
        { status: 400 }
      );
    }

    const maxBytes = 2.5 * 1024 * 1024; // 2.5 MB slot allocation
    if (fileObj.size > maxBytes) {
      const actualMb = (fileObj.size / (1024 * 1024)).toFixed(2);
      return NextResponse.json(
        { success: false, message: `Upload Rejected: File is too large! Selected file is ${actualMb} MB. The maximum allowed limit per document is 2.5 MB (Total Budget: 10 MB). Please compress or choose a smaller file.` },
        { status: 400 }
      );
    }

    const bytes = await fileObj.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 3. Binary Magic Byte Inspection
    const magicCheck = validateFileMagicBytes(buffer, extension);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { success: false, message: `Upload Rejected: ${magicCheck.error || 'Binary header does not match declared file format.'}` },
        { status: 400 }
      );
    }

    let url = '';
    const category = slotId === 'payment_proof' || formData.get('category') === 'payment-proofs'
      ? 'payment-proofs'
      : 'student-documents';

    try {
      url = await storePrivateFile(category, fileObj.name, buffer);
    } catch (fsErr) {
      console.error('File storage failed:', fsErr);
      return NextResponse.json(
        { success: false, message: 'File storage is unavailable. Please try again later.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Document uploaded successfully.',
      url,
      fileName: fileObj.name,
      size: fileObj.size > 1024 * 1024 
        ? (fileObj.size / (1024 * 1024)).toFixed(2) + ' MB'
        : Math.round(fileObj.size / 1024) + ' KB'
    });
  } catch (error: any) {
    console.error('Error in /api/admissions/upload-doc:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Error processing document upload.' },
      { status: 500 }
    );
  }
}
