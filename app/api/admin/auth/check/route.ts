import { NextResponse } from 'next/server';
import { getAdminFromRequest, verifyAdminAuthAsync } from '@/lib/auth';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const admin = getAdminFromRequest(request);
    if (!admin || !(await verifyAdminAuthAsync(request))) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Not authenticated as administrator.' },
        { status: 401 }
      );
    }

    let record;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute(
        'SELECT full_name FROM admins WHERE LOWER(email) = ? LIMIT 1',
        [admin.email.toLowerCase()]
      );
      record = (rows as any[])[0];
    } else {
      record = adminStore.getAdminByEmail(admin.email);
    }

    if (!record) {
      return NextResponse.json(
        { success: false, authenticated: false, message: 'Administrator account is no longer active.' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      admin: {
        email: admin.email,
        full_name: record.full_name || 'Administrator',
        role: admin.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, authenticated: false, message: 'Auth check error.' },
      { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 }
    );
  }
}
