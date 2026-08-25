import { NextResponse } from 'next/server';
import { validateAdminCredentials, generateAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password } = body;
    const identifier = email || username;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide administrator email/username and password.' },
        { status: 400 }
      );
    }

    const isValid = validateAdminCredentials(identifier, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, message: 'Invalid administrator credentials. Access denied.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken(identifier);

    const response = NextResponse.json({
      success: true,
      message: 'Administrator authentication verified.',
      token,
      admin: {
        email: identifier,
        role: 'SuperAdmin',
        authenticated_at: new Date().toISOString()
      }
    });

    // Set secure HTTP-only cookie
    response.cookies.set('liah_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: 'Authentication processing failed.' },
      { status: 500 }
    );
  }
}
