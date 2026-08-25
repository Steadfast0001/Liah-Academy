import { NextResponse } from 'next/server';
import db, { adminStore } from '@/lib/db';
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

    const courses = adminStore.getCourses();
    const news = adminStore.getNews();
    const settings = adminStore.getSettings();

    return NextResponse.json({
      success: true,
      courses,
      news,
      settings
    });
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

    const body = await request.json();
    const { type, data } = body;

    if (type === 'course') {
      const newCourse = adminStore.addCourse(data);
      return NextResponse.json({ success: true, message: 'Course track added successfully.', data: newCourse });
    }

    if (type === 'news') {
      const newNews = adminStore.addNews(data);
      return NextResponse.json({ success: true, message: 'Announcement created successfully.', data: newNews });
    }

    if (type === 'backup') {
      const result = db.createInstantBackup();
      return NextResponse.json({ success: true, message: 'Instant snapshot backup created successfully in data/backups/', data: result });
    }

    return NextResponse.json({ success: false, message: 'Unknown content type specified' }, { status: 400 });
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
    const { type, id, data } = body;

    if (type === 'course') {
      const updated = adminStore.updateCourse(id, data);
      return NextResponse.json({ success: true, message: 'Course track updated.', data: updated });
    }

    if (type === 'news') {
      const updated = adminStore.updateNews(id, data);
      return NextResponse.json({ success: true, message: 'Announcement updated.', data: updated });
    }

    if (type === 'settings') {
      const updated = adminStore.updateSettings(data);
      return NextResponse.json({ success: true, message: 'Institutional settings updated successfully.', data: updated });
    }

    return NextResponse.json({ success: false, message: 'Unknown type for update' }, { status: 400 });
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
    const type = searchParams.get('type');
    const idStr = searchParams.get('id');

    if (!idStr || !type) {
      return NextResponse.json({ success: false, message: 'Type and ID are required' }, { status: 400 });
    }

    const id = parseInt(idStr);

    if (type === 'course') {
      adminStore.deleteCourse(id);
      return NextResponse.json({ success: true, message: `Course #${id} removed.` });
    }

    if (type === 'news') {
      adminStore.deleteNews(id);
      return NextResponse.json({ success: true, message: `Announcement #${id} removed.` });
    }

    return NextResponse.json({ success: false, message: 'Invalid deletion type' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
