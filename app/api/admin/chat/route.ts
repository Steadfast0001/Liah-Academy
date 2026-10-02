import { NextResponse } from 'next/server';
import { getDatabaseSourceMode } from '@/lib/db';
import { verifyAdminAuthAsync as verifyAdminAuth, getAdminFromRequest } from '@/lib/auth';
import { closeChatSession, deleteChatSession, getChatSession, getChatSessions, markChatSessionRead, sendAdminChatReply } from '@/lib/chat-store';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Administrator credentials required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (sessionId) {
      const session = await getChatSession(sessionId);
      if (!session) {
        return NextResponse.json({ success: false, message: 'Chat session not found' }, { status: 404 });
      }
      // Mark as read by admin
      await markChatSessionRead(sessionId, 'admin');
      return NextResponse.json({ success: true, session: { ...session, unread_admin: false } });
    }

    const sessions = await getChatSessions();
    const unreadCount = sessions.filter(s => s.unread_admin).length;

    return NextResponse.json({ 
      success: true, 
      sessions,
      unreadCount
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Chat service is temporarily unavailable.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await verifyAdminAuth(request))) {
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
      const closed = await closeChatSession(sessionId);
      if (!closed) return NextResponse.json({ success: false, message: 'Chat session not found.' }, { status: 404 });
      return NextResponse.json({ success: true, message: 'Session marked as closed.' });
    }

    if (!text || !text.trim()) {
      return NextResponse.json({ success: false, message: 'Message text is required.' }, { status: 400 });
    }

    const result = await sendAdminChatReply(sessionId, text.trim(), adminName);
    if (!result.session) {
      return NextResponse.json({ success: false, message: 'Chat session not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Reply sent to visitor.',
      data: result
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Chat service is temporarily unavailable.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
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
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ success: false, message: 'Session ID is required.' }, { status: 400 });
    }

    const deleted = await deleteChatSession(sessionId);
    if (!deleted) return NextResponse.json({ success: false, message: 'Chat session not found.' }, { status: 404 });
    return NextResponse.json({ success: true, message: 'Chat session deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Chat service is temporarily unavailable.' }, { status: getDatabaseSourceMode() === 'mysql' ? 503 : 500 });
  }
}