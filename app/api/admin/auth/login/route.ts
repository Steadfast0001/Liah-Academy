import { NextResponse } from 'next/server';
import { validateAdminCredentials, generateAdminToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = body.identifier || body.email || body.username;
    const password = body.password || body.pin || body.pass;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide administrator email/username and password.' },
        { status: 400 }
      );
    }

    const admin = validateAdminCredentials(String(identifier), String(password));
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid administrator credentials. Access denied.' },
        { status: 401 }
      );
    }

    const token = generateAdminToken(admin.email, admin.role);

    const response = NextResponse.json({
      success: true,
      message: 'Administrator authentication verified.',
      token,
      admin: {
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        source: admin.source,
        authenticated_at: new Date().toISOString()
      }
    });

    response.cookies.set('liah_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60
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
