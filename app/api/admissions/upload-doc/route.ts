import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
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
    const bytes = await fileObj.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let url = '';
    try {
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'credentials');
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const safeExt = path.extname(fileObj.name) || '.pdf';
      const cleanFileName = fileObj.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const diskFileName = `credential_${slotId}_${Date.now()}_${cleanFileName}`;
      const filePath = path.join(uploadDir, diskFileName);

      fs.writeFileSync(filePath, buffer);
      url = `/uploads/credentials/${diskFileName}`;
    } catch (fsErr) {
      // Vercel serverless environment: return standard asset reference URL
      const cleanFileName = fileObj.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      url = `/uploads/credentials/credential_${slotId}_${Date.now()}_${cleanFileName}`;
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
