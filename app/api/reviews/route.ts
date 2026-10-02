import { NextResponse } from 'next/server';
import db, { ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let reviews: any[] = [];
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [rows] = await getMySQLPool().execute('SELECT * FROM reviews ORDER BY created_at DESC');
        reviews = rows as any[];
      } catch (dbErr) {
        console.warn('MySQL reviews fetch failed, serving from local store:', dbErr);
        markMySQLOffline();
        reviews = db.reviews.all();
      }
    } else {
      reviews = db.reviews.all();
    }
    return NextResponse.json({
      success: true,
      data: reviews
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Could not load reviews.' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, role, rating, comment } = body;

    if (!name || !role || !comment) {
      return NextResponse.json(
        { success: false, message: 'Please provide all review fields.' },
        { status: 400 }
      );
    }

    let newReview: any;
    if (getDatabaseSourceMode() === 'mysql') {
      try {
        await ensureMySQLTables();
        const [result] = await getMySQLPool().execute(
          'INSERT INTO reviews (name, role, rating, comment) VALUES (?, ?, ?, ?)',
          [name, role, rating || 5, comment]
        );
        const insertId = Number((result as { insertId: number }).insertId);
        const [rows] = await getMySQLPool().execute('SELECT * FROM reviews WHERE id = ?', [insertId]);
        newReview = (rows as any[])[0];
      } catch (dbErr) {
        console.warn('MySQL review insert failed, saving to local store:', dbErr);
        markMySQLOffline();
        const insert = db.prepare(`
          INSERT INTO reviews (name, role, rating, comment)
          VALUES (?, ?, ?, ?)
        `);
        const result = insert.run(name, role, rating || 5, comment);
        newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
      }
    } else {
      const insert = db.prepare(`
        INSERT INTO reviews (name, role, rating, comment)
        VALUES (?, ?, ?, ?)
      `);
      const result = insert.run(name, role, rating || 5, comment);
      newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);
    }

    return NextResponse.json({
      success: true,
      data: newReview,
      message: 'Review submitted successfully!'
    });
  } catch (error: any) {
    console.error('Review submission error:', error);
    return NextResponse.json(
      { success: false, message: 'Server error saving review.' },
      { status: 500 }
    );
  }
}
