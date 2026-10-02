import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';

export async function GET() {
  try {
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
    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Could not load courses.' }, { status: 500 });
  }
}
