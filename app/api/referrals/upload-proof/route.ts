import { NextResponse } from 'next/server';
import { storePrivateFile } from '@/lib/private-files';
import { validateFileMagicBytes, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin upload request rejected.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') || formData.get('screenshot') || formData.get('proof');

    if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
      return NextResponse.json(
        { success: false, message: 'Please provide a valid image file.' },
        { status: 400 }
      );
    }

    const fileObj = file as File;
    const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'application/pdf']);
    const allowedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.pdf']);
    const extension = fileObj.name.slice(fileObj.name.lastIndexOf('.')).toLowerCase();

    if (!allowedTypes.has(fileObj.type) || !allowedExtensions.has(extension)) {
      return NextResponse.json(
        { success: false, message: 'Please upload a PNG, JPEG, or WebP screenshot.' },
        { status: 400 }
      );
    }

    const maxBytes = 5 * 1024 * 1024; // 5 MB max
    if (fileObj.size > maxBytes) {
      return NextResponse.json(
        { success: false, message: 'Screenshot size cannot exceed 5 MB.' },
        { status: 400 }
      );
    }

    const bytes = await fileObj.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Magic Byte validation
    const magicCheck = validateFileMagicBytes(buffer, extension);
    if (!magicCheck.valid) {
      return NextResponse.json(
        { success: false, message: `Upload Rejected: ${magicCheck.error || 'Invalid file format header.'}` },
        { status: 400 }
      );
    }

    const url = await storePrivateFile('payout-proofs', fileObj.name, buffer);

    return NextResponse.json({
      success: true,
      message: 'Deposit proof uploaded successfully.',
      url,
      fileName: fileObj.name
    });

  } catch (err: any) {
    console.error('Proof upload error:', err);
    return NextResponse.json(
      { success: false, message: 'Failed to upload deposit proof.' },
      { status: 500 }
    );
  }
}
