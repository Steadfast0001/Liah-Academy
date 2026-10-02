import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Automatic payment verification is unavailable. Submit payment proof for administrator review.' },
    { status: 410 }
  );
}
