import { NextResponse } from 'next/server';
import { issueChatSession } from '@/lib/chat-session';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const response = NextResponse.json({ success: true });
    const sessionId = issueChatSession(request, response);
    return NextResponse.json({ success: true, sessionId }, {
      headers: response.headers
    });
  } catch {
    return NextResponse.json(
      { success: false, message: 'Live chat is not configured on this server.' },
      { status: 503 }
    );
  }
}