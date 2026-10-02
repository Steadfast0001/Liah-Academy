import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';

export async function GET() {
  try {
    let news: any[] = [];
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute('SELECT * FROM news ORDER BY created_at DESC, id DESC');
        news = rows as any[];
      } catch (dbErr) {
        console.warn('MySQL news fetch failed, serving from local store:', dbErr);
        markMySQLOffline();
        news = db.news.all();
      }
    } else {
      news = db.news.all();
    }
    return NextResponse.json({
      success: true,
      data: news,
      total: news.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Could not load announcements.' }, { status: 500 });
  }
}
