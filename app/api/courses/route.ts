import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const courses = db.courses.all();
    return NextResponse.json({
      success: true,
      data: courses,
      total: courses.length
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
