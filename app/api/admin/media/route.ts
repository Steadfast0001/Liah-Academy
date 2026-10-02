import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

async function saveMediaItem(item: { title: string; type: string; src: string; category: string; size: string }) {
  if (getDatabaseSourceMode() !== 'mysql') return adminStore.addMedia(item);

  await ensureMySQLTables();
  const id = `m_${crypto.randomUUID()}`;
  await getMySQLPool().execute(
    'INSERT INTO media (id, title, type, src, category, size) VALUES (?, ?, ?, ?, ?, ?)',
    [id, item.title, item.type, item.src, item.category, item.size]
  );
  const [rows] = await getMySQLPool().execute('SELECT * FROM media WHERE id = ?', [id]);
  return (rows as any[])[0];
}

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    let media;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute('SELECT * FROM media ORDER BY created_at DESC');
      media = rows;
    } else {
      media = adminStore.getMedia();
    }
    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load media.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
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
        const actualMb = (fileObj.size / (1024 * 1024)).toFixed(2);
        return NextResponse.json(
          { success: false, message: `Upload Rejected: File is too large! Selected media asset is ${actualMb} MB. Maximum allowed size is 10 MB.` },
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
        console.error('Admin media storage failed:', fsErr);
        return NextResponse.json(
          { success: false, message: 'Media storage is unavailable. Please try again later.' },
          { status: 500 }
        );
      }

      const formattedSize = fileObj.size > 1024 * 1024 
        ? `${(fileObj.size / (1024 * 1024)).toFixed(2)} MB`
        : `${Math.round(fileObj.size / 1024)} KB`;

      const newItem = await saveMediaItem({
        title: title || fileObj.name,
        type: mediaType,
        src: url,
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

    if (typeof src !== 'string' || !(/^https?:\/\//i.test(src) || /^\/(?!\/)/.test(src))) {
      return NextResponse.json(
        { success: false, message: 'Use a stored file path or HTTP URL; embedded file data is not accepted.' },
        { status: 400 }
      );
    }

    const newItem = await saveMediaItem({
      title,
      type: type || 'video',
      src,
      category: category || 'Workshops',
      size: size || '1.0 MB'
    });

    return NextResponse.json({ success: true, message: 'Media reference registered successfully.', data: newItem });
  } catch (error: any) {
    console.error('Error in /api/admin/media POST:', error);
    return NextResponse.json({ success: false, message: 'Unable to save media.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
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

    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      await getMySQLPool().execute('DELETE FROM media WHERE id = ?', [id]);
    } else {
      adminStore.deleteMedia(id);
    }
    return NextResponse.json({ success: true, message: `Media item #${id} removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to delete media.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
