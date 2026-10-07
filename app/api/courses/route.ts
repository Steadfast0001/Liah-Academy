import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline, getCached, setCached } from '@/lib/db';

export async function GET() {
  try {
    const cached = getCached<any[]>('courses:all');
    if (cached) {
      return NextResponse.json(
        {
          success: true,
          data: cached,
          total: cached.length,
          cached: true
        },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
            'X-Cache-Status': 'HIT'
          }
        }
      );
    }

    let courses: any[] = [];
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute('SELECT * FROM courses ORDER BY id');
        courses = rows as any[];
      } catch (dbErr) {
        console.warn('MySQL courses fetch failed, serving from local store:', dbErr);
        markMySQLOffline();
        courses = db.courses.all();
      }
    } else {
      courses = db.courses.all();
    }

    setCached('courses:all', courses, 30000);

    return NextResponse.json(
      {
        success: true,
        data: courses,
        total: courses.length
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
          'X-Cache-Status': 'MISS'
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Could not load courses.' }, { status: 500 });
  }
}
