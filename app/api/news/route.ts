import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    let rawNews: any[] = [];
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute('SELECT * FROM news ORDER BY created_at DESC, id DESC');
        rawNews = rows as any[];
      } catch (dbErr) {
        console.warn('MySQL news fetch failed, serving from local store:', dbErr);
        markMySQLOffline();
        rawNews = db.news.all();
      }
    } else {
      rawNews = db.news.all();
    }

    // Normalize news items for consistent user-end display
    const news = (rawNews || []).map((item: any) => ({
      id: item.id,
      title: item.title || 'Announcement',
      category: item.category || item.badge || 'News & Updates',
      date: item.date || item.meta || (item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent'),
      image: item.image || '/assets/images/flyer_engineering.png',
      excerpt: item.excerpt || item.desc || (item.content ? item.content.slice(0, 160) + '...' : 'Institutional announcement from Liah Academy.'),
      content: item.content || item.excerpt || item.desc || '',
      created_at: item.created_at || new Date().toISOString()
    }));

    return NextResponse.json(
      {
        success: true,
        data: news,
        total: news.length
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Could not load announcements.' }, { status: 500 });
  }
}
