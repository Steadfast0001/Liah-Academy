import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    let inquiries;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute('SELECT * FROM inquiries ORDER BY created_at DESC');
      inquiries = rows;
    } else {
      inquiries = adminStore.getInquiries();
    }
    return NextResponse.json({ success: true, data: inquiries });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load inquiries.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get('id');
    if (!idStr) {
      return NextResponse.json({ success: false, message: 'Inquiry ID is required' }, { status: 400 });
    }

    const id = Number(idStr);
    if (!Number.isSafeInteger(id) || id <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid inquiry ID.' }, { status: 400 });
    }

    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      await getMySQLPool().execute('DELETE FROM inquiries WHERE id = ?', [id]);
    } else {
      adminStore.deleteInquiry(id);
    }
    return NextResponse.json({ success: true, message: `Inquiry #${idStr} removed.` });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to remove inquiry.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
