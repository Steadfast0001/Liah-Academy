import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const news = db.news.all();
    return NextResponse.json({
      success: true,
      data: news,
      total: news.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
