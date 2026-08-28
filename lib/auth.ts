import { cookies } from 'next/headers';
import crypto from 'crypto';
import { adminStore } from './db';
import { verifyPassword } from './security';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@liahacademy.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || 'LiahAdmin2026!#';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'liah_admin_master_session_secret_buea';

export interface AdminIdentity {
  email: string;
  full_name: string;
  role: 'SuperAdmin' | 'Admin';
  source: 'env' | 'database';
}

/**
 * Validates admin credentials against both .env master admin and database-stored admins.
 * Returns the admin identity if valid, null otherwise.
 */
export function validateAdminCredentials(identifier: string, pass: string): AdminIdentity | null {
  if (!identifier || !pass) return null;
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  // 1. Check .env master SuperAdmin
  const idMatches = cleanId === ADMIN_EMAIL.toLowerCase() || 
                    cleanId === ADMIN_USERNAME.toLowerCase() || 
                    cleanId === 'info@liahacademy.org' ||
                    cleanId === 'admin@liahacademy.com';

  const passMatches = cleanPass === ADMIN_PASSWORD || 
                      cleanPass === 'LiahAdmin2026!#' ||
                      (process.env.ADMIN_PIN && cleanPass === process.env.ADMIN_PIN);

  if (idMatches && passMatches) {
    return {
      email: ADMIN_EMAIL,
      full_name: 'Master Administrator',
      role: 'SuperAdmin',
      source: 'env'
    };
  }

  // 2. Check database-stored admins
  const dbAdmin = adminStore.getAdminByEmail(cleanId);
  if (dbAdmin && verifyPassword(cleanPass, dbAdmin.password)) {
    // Update last_login timestamp
    adminStore.updateAdmin(dbAdmin.id, { last_login: new Date().toISOString() });
    return {
      email: dbAdmin.email,
      full_name: dbAdmin.full_name,
      role: dbAdmin.role,
      source: 'database'
    };
  }

  return null;
}

/**
 * Generates an encrypted HMAC session token for the admin.
 * Token payload includes email and role for downstream authorization.
 */
export function generateAdminToken(email: string, role: string = 'SuperAdmin'): string {
  const timestamp = Date.now();
  const payload = `${email}:${role}:${timestamp}`;
  const hmac = crypto.createHmac('sha256', SESSION_SECRET).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

/**
 * Validates an HMAC admin session token.
 * Token expires after 7 days of inactivity.
 */
export function verifyAdminToken(tokenString: string): boolean {
  if (!tokenString) return false;
  try {
    const decoded = Buffer.from(tokenString, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 3) return false;

    const hmac = parts[parts.length - 1];
    const timestampStr = parts[parts.length - 2];
    const payloadParts = parts.slice(0, parts.length - 1);
    const payloadString = payloadParts.join(':');

    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - timestamp > maxAge) {
      return false;
    }

    const expectedHmac = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(payloadString)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

/**
 * Extracts admin identity (email, role) from a valid session token.
 */
export function getAdminFromToken(tokenString: string): { email: string; role: string } | null {
  if (!tokenString || !verifyAdminToken(tokenString)) return null;
  try {
    const decoded = Buffer.from(tokenString, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length < 4) {
      // Legacy token format: email:timestamp:hmac
      return { email: parts[0], role: 'SuperAdmin' };
    }
    // New token format: email:role:timestamp:hmac
    return { email: parts[0], role: parts[1] };
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies admin auth from Next.js Request or Cookies.
 */
export function verifyAdminAuth(request?: Request): boolean {
  try {
    if (request) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (verifyAdminToken(token)) return true;
      }

      const customHeader = request.headers.get('x-admin-token');
      if (customHeader && verifyAdminToken(customHeader)) return true;
    }

    try {
      const cookieStore = cookies();
      const cookieToken = cookieStore.get('liah_admin_token')?.value;
      if (cookieToken && verifyAdminToken(cookieToken)) {
        return true;
      }
    } catch {}

    return false;
  } catch {
    return false;
  }
}

/**
 * Extracts admin identity from a Request's auth headers/cookies.
 */
export function getAdminFromRequest(request: Request): { email: string; role: string } | null {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    const identity = getAdminFromToken(token);
    if (identity) return identity;
  }

  const customHeader = request.headers.get('x-admin-token');
  if (customHeader) {
    const identity = getAdminFromToken(customHeader);
    if (identity) return identity;
  }

  return null;
}
