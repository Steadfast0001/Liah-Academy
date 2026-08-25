import { NextResponse } from 'next/server';
import db, { adminStore } from '@/lib/db';

export async function GET() {
  try {
    const courses = adminStore.getCourses();
    const news = adminStore.getNews();
    const reviews = adminStore.getMedia(); // or reviews
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

    if (type === 'settings') {
      const updatedSettings = adminStore.updateSettings(data);
      return NextResponse.json({ success: true, message: 'Site settings updated.', data: updatedSettings });
    }

    return NextResponse.json({ success: false, message: 'Invalid content type.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { type, id, data } = body;

    if (type === 'course') {
      const updated = adminStore.updateCourse(id, data);
      return NextResponse.json({ success: true, message: 'Course updated.', data: updated });
    }

    if (type === 'news') {
      const updated = adminStore.updateNews(id, data);
      return NextResponse.json({ success: true, message: 'Announcement updated.', data: updated });
    }

    if (type === 'settings') {
      const updated = adminStore.updateSettings(data);
      return NextResponse.json({ success: true, message: 'Settings saved.', data: updated });
    }

    return NextResponse.json({ success: false, message: 'Invalid type.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = parseInt(searchParams.get('id') || '0');

    if (!type || !id) {
      return NextResponse.json({ success: false, message: 'Type and ID required.' }, { status: 400 });
    }

    if (type === 'course') {
      adminStore.deleteCourse(id);
      return NextResponse.json({ success: true, message: `Course #${id} deleted.` });
    }

    if (type === 'news') {
      adminStore.deleteNews(id);
      return NextResponse.json({ success: true, message: `News #${id} deleted.` });
    }

    return NextResponse.json({ success: false, message: 'Invalid type.' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
