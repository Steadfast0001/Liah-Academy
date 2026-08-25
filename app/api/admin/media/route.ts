import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const media = adminStore.getMedia();
    return NextResponse.json({ success: true, data: media });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = formData.get('title') as string || 'Uploaded Media';
    const category = formData.get('category') as string || 'General';

    if (!file) {
      // If it's a URL-based asset
      const mediaUrl = formData.get('url') as string;
      const mediaType = formData.get('type') as string || 'image';
      if (!mediaUrl) {
        return NextResponse.json({ success: false, message: 'File or Media URL required' }, { status: 400 });
      }

      const newMedia = adminStore.addMedia({
        title,
        type: mediaType,
        src: mediaUrl,
        category,
        size: 'External Link'
      });

      return NextResponse.json({ success: true, message: 'Media link registered successfully.', data: newMedia });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const isVideo = file.type.startsWith('video') || file.name.endsWith('.mp4');
    const targetFolder = isVideo ? 'videos' : 'images';
    const uploadDir = path.join(process.cwd(), 'public', 'assets', targetFolder);

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Clean file name
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const finalFilename = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadDir, finalFilename);

    fs.writeFileSync(filePath, buffer);

    const publicPath = `/assets/${targetFolder}/${finalFilename}`;
    const sizeMb = (buffer.length / (1024 * 1024)).toFixed(2) + ' MB';

    const newMedia = adminStore.addMedia({
      title: title || file.name,
      type: isVideo ? 'video' : 'image',
      src: publicPath,
      category,
      size: sizeMb
    });

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully!',
      data: newMedia
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Media ID required.' }, { status: 400 });
    }

    adminStore.deleteMedia(id);
    return NextResponse.json({ success: true, message: 'Media asset deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
