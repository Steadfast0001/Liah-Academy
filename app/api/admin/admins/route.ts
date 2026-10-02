import { NextResponse } from 'next/server';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth, getAdminFromRequest } from '@/lib/auth';
import { hashPassword, validateRequestOrigin } from '@/lib/security';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    let admins: any[];
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute(
        'SELECT id, full_name, email, role, created_at, last_login FROM admins ORDER BY id'
      );
      admins = rows as any[];
    } else {
      admins = adminStore.getAdmins();
    }

    const safeAdmins = admins.map(a => ({
      id: a.id,
      full_name: a.full_name,
      email: a.email,
      password: '••••••••',
      role: a.role,
      created_at: a.created_at,
      last_login: a.last_login
    }));

    return NextResponse.json({ success: true, data: safeAdmins });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to load administrators.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ success: false, message: originCheck.reason || 'Cross-origin request rejected.' }, { status: 403 });
    }

    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    // Only SuperAdmin can add admins
    const caller = getAdminFromRequest(request);
    if (!caller || caller.role !== 'SuperAdmin') {
      return NextResponse.json(
        { success: false, message: 'Only SuperAdmin can manage administrator accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { full_name, email, password, role } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Full name, email, and password are required.' },
        { status: 400 }
      );
    }

    // Check if email already exists
    let existing;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute('SELECT id FROM admins WHERE LOWER(email) = ? LIMIT 1', [String(email).toLowerCase().trim()]);
      existing = (rows as any[])[0];
    } else {
      existing = adminStore.getAdminByEmail(email);
    }
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An administrator with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    let newAdmin;
    if (getDatabaseSourceMode() === 'mysql') {
      const [result] = await getMySQLPool().execute(
        'INSERT INTO admins (full_name, email, password, role) VALUES (?, ?, ?, ?)',
        [full_name, email.toLowerCase().trim(), hashedPassword, role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin']
      );
      const [rows] = await getMySQLPool().execute(
        'SELECT id, full_name, email, role, created_at, last_login FROM admins WHERE id = ?',
        [(result as { insertId: number }).insertId]
      );
      newAdmin = (rows as any[])[0];
    } else {
      newAdmin = adminStore.addAdmin({
        full_name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        role: role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin'
      });
    }

    return NextResponse.json({
      success: true,
      message: `Administrator ${newAdmin.full_name} added successfully.`,
      data: { ...newAdmin, password: '••••••••' }
    });
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, message: 'An administrator with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Unable to create administrator.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ success: false, message: originCheck.reason || 'Cross-origin request rejected.' }, { status: 403 });
    }

    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const caller = getAdminFromRequest(request);
    if (!caller || caller.role !== 'SuperAdmin') {
      return NextResponse.json(
        { success: false, message: 'Only SuperAdmin can manage administrator accounts.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, full_name, email, password, role } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Admin ID is required.' }, { status: 400 });
    }

    const numericId = Number(id);
    if (!Number.isSafeInteger(numericId) || numericId <= 0) {
      return NextResponse.json({ success: false, message: 'Invalid administrator ID.' }, { status: 400 });
    }

    const updates: any = {};
    if (full_name) updates.full_name = full_name;
    if (email) updates.email = email.toLowerCase().trim();
    if (password) updates.password = hashPassword(password);
    if (role) updates.role = role;

    let updated;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [existingRows] = await getMySQLPool().execute('SELECT id FROM admins WHERE id = ?', [numericId]);
      if (!(existingRows as any[]).length) return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
      await getMySQLPool().execute(
        `UPDATE admins SET full_name = COALESCE(?, full_name), email = COALESCE(?, email),
         password = COALESCE(?, password), role = COALESCE(?, role) WHERE id = ?`,
        [updates.full_name || null, updates.email || null, updates.password || null, updates.role || null, numericId]
      );
      const [rows] = await getMySQLPool().execute(
        'SELECT id, full_name, email, role, created_at, last_login FROM admins WHERE id = ?',
        [numericId]
      );
      updated = (rows as any[])[0];
    } else {
      updated = adminStore.updateAdmin(numericId, updates);
    }
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Administrator ${updated.full_name} updated successfully.`,
      data: { ...updated, password: '••••••••' }
    });
  } catch (error: any) {
    if (error?.code === 'ER_DUP_ENTRY') {
      return NextResponse.json({ success: false, message: 'An administrator with this email already exists.' }, { status: 409 });
    }
    return NextResponse.json({ success: false, message: 'Unable to update administrator.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const originCheck = validateRequestOrigin(request);
    if (!originCheck.valid) {
      return NextResponse.json({ success: false, message: originCheck.reason || 'Cross-origin request rejected.' }, { status: 403 });
    }

    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const caller = getAdminFromRequest(request);
    if (!caller || caller.role !== 'SuperAdmin') {
      return NextResponse.json(
        { success: false, message: 'Only SuperAdmin can remove administrator accounts.' },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    const numericId = Number(id);

    if (!id || !Number.isSafeInteger(numericId) || numericId <= 0) {
      return NextResponse.json(
        { success: false, message: 'Invalid administrator ID.' },
        { status: 400 }
      );
    }

    let targetAdmin;
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute('SELECT id, full_name, email, role FROM admins WHERE id = ?', [numericId]);
      targetAdmin = (rows as any[])[0];
    } else {
      targetAdmin = adminStore.getAdmins().find(a => a.id === numericId);
    }
    if (!targetAdmin) return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });

    // Prevent deleting your own active account
    if (targetAdmin && caller.email && targetAdmin.email.toLowerCase() === caller.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: 'You cannot delete your own active administrator account.' },
        { status: 400 }
      );
    }

    // Ensure at least one SuperAdmin remains in the database
    if (targetAdmin.role === 'SuperAdmin') {
      let superAdminCount = 0;
      if (getDatabaseSourceMode() === 'mysql') {
        const [countRows] = await getMySQLPool().execute('SELECT COUNT(*) as count FROM admins WHERE role = "SuperAdmin"');
        superAdminCount = Number((countRows as any[])[0]?.count || 0);
      } else {
        superAdminCount = adminStore.getAdmins().filter(a => a.role === 'SuperAdmin').length;
      }
      if (superAdminCount <= 1) {
        return NextResponse.json(
          { success: false, message: 'Cannot delete the only remaining SuperAdmin account. The system requires at least one SuperAdmin.' },
          { status: 403 }
        );
      }
    }

    let deleted: boolean;
    if (getDatabaseSourceMode() === 'mysql') {
      const [result] = await getMySQLPool().execute('DELETE FROM admins WHERE id = ?', [numericId]);
      deleted = Number((result as { affectedRows: number }).affectedRows) > 0;
    } else {
      deleted = adminStore.deleteAdmin(numericId);
    }
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Administrator removed successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Unable to delete administrator.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}
