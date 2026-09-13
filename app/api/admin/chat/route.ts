import { NextResponse } from 'next/server';
import { adminStore } from '@/lib/db';
import { verifyAdminAuth, getAdminFromRequest } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = adminStore.getChatSession(sessionId);
      if (!session) {
        return NextResponse.json({ success: false, message: 'Chat session not found' }, { status: 404 });
      }
      // Mark as read by admin
      adminStore.markChatSessionRead(sessionId, 'admin');
      return NextResponse.json({ success: true, session });
    }

    const sessions = adminStore.getChatSessions();
    const unreadCount = sessions.filter(s => s.unread_admin).length;

    return NextResponse.json({ 
      success: true, 
      sessions,
      unreadCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const adminIdentity = getAdminFromRequest(request);
    const adminName = adminIdentity?.email ? `Admin (${adminIdentity.email.split('@')[0]})` : 'Liah Admissions Officer';

    const body = await request.json();
    const { sessionId, text, action } = body;

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required.' }, { status: 400 });
    }

    if (action === 'close') {
      adminStore.closeChatSession(sessionId);
      return NextResponse.json({ success: true, message: 'Session marked as closed.' });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, message: 'Message text is required.' }, { status: 400 });
    }

    const result = adminStore.sendAdminChatReply(sessionId, text.trim(), adminName);
    if (!result.session) {
      return NextResponse.json({ success: false, message: 'Chat session not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent to visitor.',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!verifyAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required.' }, { status: 400 });
    }

    adminStore.deleteChatSession(sessionId);
    return NextResponse.json({ success: true, message: 'Chat session deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}