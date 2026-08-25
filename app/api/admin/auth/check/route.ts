import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const isAuthenticated = verifyAdminAuth(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Not authenticated as administrator.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      role: 'SuperAdmin'
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false, message: 'Auth check error.' },
      { status: 500 }
    );
  }
}
