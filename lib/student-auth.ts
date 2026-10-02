import crypto from 'crypto';
import { NextResponse } from 'next/server';

const COOKIE_NAME = 'liah_student_session';
const SESSION_VERSION = 1;
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 12;

export interface StudentSession {
  studentId: number;
  email: string;
  issuedAt: number;
}

function getSessionSecret(): string {
  const secret = process.env.STUDENT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (secret && Buffer.byteLength(secret, 'utf8') >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production') {
    throw new Error('STUDENT_SESSION_SECRET must be configured with at least 32 bytes in production.');
  }
  return 'liah-academy-dev-student-session-secret-key-32bytes';
}

export function isStudentAuthConfigured(): boolean {
  try {
    getSessionSecret();
    return true;
  } catch {
    return false;
  }
}

function sign(payload: string): string {
  return crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('base64url');
}

export function setStudentSession(response: NextResponse, student: { id: number; email: string }): void {
  const payload = Buffer.from(JSON.stringify({
    version: SESSION_VERSION,
    studentId: Number(student.id),
    email: student.email.trim().toLowerCase(),
    issuedAt: Date.now()
  })).toString('base64url');
  const token = `${payload}.${sign(payload)}`;

  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS
  });
}

export function clearStudentSession(response: NextResponse): void {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    path: '/',
    maxAge: 0
  });
}

export function getStudentSession(request: Request): StudentSession | null {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const cookieValue = cookieHeader
      .split(';')
      .map(part => part.trim())
      .find(part => part.startsWith(`${COOKIE_NAME}=`))
      ?.slice(COOKIE_NAME.length + 1);
    if (!cookieValue) return null;

    const [payload, receivedSignature] = decodeURIComponent(cookieValue).split('.');
    if (!payload || !receivedSignature) return null;

    const expectedSignature = Buffer.from(sign(payload));
    const actualSignature = Buffer.from(receivedSignature);
    if (actualSignature.length !== expectedSignature.length || !crypto.timingSafeEqual(actualSignature, expectedSignature)) {
      return null;
    }

    const decoded = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    const issuedAt = Number(decoded.issuedAt);
    if (
      decoded.version !== SESSION_VERSION ||
      !Number.isSafeInteger(decoded.studentId) || decoded.studentId <= 0 ||
      typeof decoded.email !== 'string' || !decoded.email.includes('@') ||
      !Number.isSafeInteger(issuedAt) || issuedAt > Date.now() + 60_000 ||
      Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000
    ) {
      return null;
    }

    return { studentId: decoded.studentId, email: decoded.email, issuedAt };
  } catch {
    return null;
  }
}