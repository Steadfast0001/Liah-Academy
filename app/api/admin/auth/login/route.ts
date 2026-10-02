import { NextResponse } from 'next/server';
import { validateAdminCredentialsAsync, generateAdminToken } from '@/lib/auth';
import { getDatabaseSourceMode } from '@/lib/db';
import { checkRateLimitAsync, recordFailedAttemptAsync, clearRateLimitAsync, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

function getClientIp(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  return '127.0.0.1';
}

export async function POST(request: Request) {
  try {
    // 1. Cross-Origin verification
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json(
        { success: false, message: originCheck.reason || 'Cross-origin login request rejected.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const identifier = body.identifier || body.email || body.username;
    const password = body.password || body.pin || body.pass;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Please provide administrator email/username and password.' },
        { status: 400 }
      );
    }

    const cleanId = String(identifier).trim().toLowerCase();
    const clientIp = getClientIp(request);
    const rateLimitKey = `admin-login:${clientIp}:${cleanId}`;

    // 2. Check brute force protection threshold (5 attempts per 15 minutes, persistent across workers)
    const limitCheck = await checkRateLimitAsync(rateLimitKey, 5, 15 * 60 * 1000);
    if (limitCheck.isLimited) {
      const resetMin = Math.ceil(limitCheck.resetInSeconds / 60);
      return NextResponse.json(
        {
          success: false,
          message: `Too many failed login attempts. To prevent brute-force attacks, access is temporarily locked for ${resetMin} minute(s). Please try again later.`
        },
        { status: 429 }
      );
    }

    // 3. Perform authoritative database authentication check
    const admin = await validateAdminCredentialsAsync(cleanId, String(password));
    if (!admin) {
      const failed = await recordFailedAttemptAsync(rateLimitKey, 5, 15 * 60 * 1000);
      if (failed.isLimited) {
        const resetMin = Math.ceil(failed.resetInSeconds / 60);
        return NextResponse.json(
          {
            success: false,
            message: `Too many failed login attempts. To prevent brute-force attacks, access is temporarily locked for ${resetMin} minute(s). Please try again later.`
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: `Invalid administrator credentials. ${failed.remainingAttempts} attempt(s) remaining before security lockout.`
        },
        { status: 401 }
      );
    }

    // 4. Clear rate limit on successful authentication
    await clearRateLimitAsync(rateLimitKey);
    await clearRateLimitAsync(`admin-login:${clientIp}`);

    let token: string;
    try {
      token = generateAdminToken(admin.email, admin.role);
    } catch {
      return NextResponse.json(
        { success: false, message: 'Administrator authentication session could not be established.' },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Administrator authentication verified.',
      admin: {
        email: admin.email,
        full_name: admin.full_name,
        role: admin.role,
        source: admin.source,
        authenticated_at: new Date().toISOString()
      }
    });

    try {
      response.cookies.set('liah_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60
      });
    } catch (cookieErr) {
      console.warn('Cookie set warning:', cookieErr);
    }

    return response;
  } catch (error: any) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Authentication service error.' },
      { status: 500 }
    );
  }
}
