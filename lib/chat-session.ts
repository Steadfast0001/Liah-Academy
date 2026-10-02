import crypto from 'crypto';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'liah_chat_session';
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function getSecret(): string {
  const secret = process.env.CHAT_SESSION_SECRET;
  if (!secret || Buffer.byteLength(secret, 'utf8') < 32) {
    throw new Error('CHAT_SESSION_SECRET must be configured with at least 32 bytes.');
  }
  return secret;
}

function sign(sessionId: string, expiresAt: string): string {
  return crypto.createHmac('sha256', getSecret()).update(`v1:${sessionId}:${expiresAt}`).digest('base64url');
}

export function issueChatSession(request: Request, response: NextResponse): string {
  const existing = getChatSessionId(request);
  if (existing) return existing;

  const sessionId = `chat_${crypto.randomUUID()}`;
  const expiresAt = String(Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS);
  response.cookies.set(COOKIE_NAME, `${sessionId}.${expiresAt}.${sign(sessionId, expiresAt)}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS
  });
  return sessionId;
}

export function getChatSessionId(request: Request): string | null {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieValue = cookieHeader
      .split(';')
      .map(part => part.trim())
      .find(part => part.startsWith(`${COOKIE_NAME}=`))
      ?.slice(COOKIE_NAME.length + 1);
    if (!cookieValue) return null;

    const [sessionId, expiresAt, receivedSignature] = decodeURIComponent(cookieValue).split('.');
    if (!sessionId?.startsWith('chat_') || !expiresAt || !receivedSignature) return null;

    const expiresAtSeconds = Number(expiresAt);
    if (!Number.isSafeInteger(expiresAtSeconds) || expiresAtSeconds <= Math.floor(Date.now() / 1000)) return null;

    const expectedSignature = Buffer.from(sign(sessionId, expiresAt));
    const actualSignature = Buffer.from(receivedSignature);
    if (actualSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(actualSignature, expectedSignature)) {
      return null;
    }
    return sessionId;
  } catch {
    return null;
  }
}