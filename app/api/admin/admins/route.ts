import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth, getAdminFromRequest } from '@/lib/auth';
import { hashPassword } from '@/lib/security';

export const dynamic = 'force-dynamic';

const MASTER_ADMIN_EMAIL = (process.env.ADMIN_EMAIL || 'info@liahacademy.com').toLowerCase();

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json({ success: false, message: 'Unauthorized.' }, { status: 401 });
    }

    const admins = adminStore.getAdmins();
    
    // Always include the master .env admin at the top
    const masterAdmin = {
      id: 0,
      full_name: 'Master Administrator',
      email: MASTER_ADMIN_EMAIL,
      password: '••••••••',
      role: 'SuperAdmin' as const,
      created_at: '2026-01-01T00:00:00.000Z',
      last_login: new Date().toISOString(),
      is_master: true
    };

    // Filter out any DB admin that duplicates the master email
    const dbAdmins = admins.filter(a => a.email.toLowerCase() !== MASTER_ADMIN_EMAIL);

    return NextResponse.json({ success: true, data: [masterAdmin, ...dbAdmins] });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
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
    const existing = adminStore.getAdminByEmail(email);
    if (existing || email.toLowerCase().trim() === MASTER_ADMIN_EMAIL) {
      return NextResponse.json(
        { success: false, message: 'An administrator with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = hashPassword(password);
    const newAdmin = adminStore.addAdmin({
      full_name,
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin'
    });

    return NextResponse.json({
      success: true,
      message: `Administrator ${newAdmin.full_name} added successfully.`,
      data: { ...newAdmin, password: '••••••••' }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
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

    const updates: any = {};
    if (full_name) updates.full_name = full_name;
    if (email) updates.email = email;
    if (password) updates.password = hashPassword(password);
    if (role) updates.role = role;

    const updated = adminStore.updateAdmin(Number(id), updates);
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Administrator ${updated.full_name} updated successfully.`,
      data: { ...updated, password: '••••••••' }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
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

    if (!id || Number(id) === 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete the master administrator account.' },
        { status: 403 }
      );
    }

    const deleted = adminStore.deleteAdmin(Number(id));
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Admin not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Administrator removed successfully.'
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
