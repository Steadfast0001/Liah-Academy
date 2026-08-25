import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const reviews = db.reviews.all();
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

    const insert = db.prepare(`
      INSERT INTO reviews (name, role, rating, comment)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(name, role, rating || 5, comment);

    const newReview = db.prepare('SELECT * FROM reviews WHERE id = ?').get(result.lastInsertRowid);

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
