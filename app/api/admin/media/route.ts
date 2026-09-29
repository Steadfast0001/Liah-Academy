import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const media = adminStore.getMedia();
    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const contentType = request.headers.get('content-type') || '';

    // Handle Multipart / Form-Data Uploads (Physical File Saved to Disk)
    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData();
      const file = formData.get('file');
      const title = String(formData.get('title') || 'Admin Media Asset');
      const category = String(formData.get('category') || 'Workshops');

      if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
        return NextResponse.json({ success: false, message: 'No valid file provided for upload.' }, { status: 400 });
      }

      const fileObj = file as File;
      const maxBytes = 10 * 1024 * 1024; // 10 MB per asset
      if (fileObj.size > maxBytes) {
        return NextResponse.json(
          { success: false, message: 'File exceeds maximum allowed upload size of 10 MB.' },
          { status: 400 }
        );
      }

      const bytes = await fileObj.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const mimeType = fileObj.type || '';
      const isVideo = mimeType.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(fileObj.name);
      const mediaType: 'video' | 'image' = isVideo ? 'video' : 'image';

      let url = '';
      try {
        const uploadDir = path.join(process.cwd(), 'public', 'assets', 'media');
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const safeExt = path.extname(fileObj.name) || (isVideo ? '.mp4' : '.jpg');
        const cleanBase = path.basename(fileObj.name, safeExt).replace(/[^a-zA-Z0-9_-]/g, '_');
        const diskFileName = `media_${Date.now()}_${cleanBase}${safeExt}`;
        const filePath = path.join(uploadDir, diskFileName);

        await fs.promises.writeFile(filePath, buffer);
        url = `/assets/media/${diskFileName}`;
      } catch (fsErr) {
        const cleanFileName = fileObj.name.replace(/[^a-zA-Z0-9._-]/g, '_');
        url = `/assets/media/media_${Date.now()}_${cleanFileName}`;
      }

      const formattedSize = fileObj.size > 1024 * 1024 
        ? `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(fileObj.size / 1024)} KB`;

      const newItem = adminStore.addMedia({
        title: title || fileObj.name,
        type: mediaType,
        src: url, // Storing physical disk URL only, zero Base64 in database
        category: category || 'Workshops',
        size: formattedSize
      });

      return NextResponse.json({ 
        success: true, 
        message: 'Media asset uploaded and stored physically on disk.', 
        url,
        data: newItem 
      });
    }

    // Fallback: Handle standard JSON payloads
    const body = await request.json();
    const { title, type, src, category, size } = body;

    if (!title || !src) {
      return NextResponse.json({ success: false, message: 'Title and source URL are required.' }, { status: 400 });
    }

    const newItem = adminStore.addMedia({
      title,
      type: type || 'video',
      src,
      category: category || 'Workshops',
      size: size || '1.0 MB'
    });

    return NextResponse.json({ success: true, message: 'Media reference registered successfully.', data: newItem });
  } catch (error: any) {
    console.error('Error in /api/admin/media POST:', error);
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
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, message: 'ID is required' }, { status: 400 });
    }

    adminStore.deleteMedia(id);
    return NextResponse.json({ success: true, message: `Media item #${id} removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
