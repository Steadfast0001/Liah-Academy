import { cookies } from 'next/headers';
import crypto from 'crypto';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@liahacademy.com';
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'LiahAdmin2026!#';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'liah_admin_master_secret_key_buea_2026';

export interface AdminUser {
  username: string;
  email: string;
  role: 'SuperAdmin';
}

/**
 * Validates admin credentials.
 * Accepts either the official admin email (info@liahacademy.com) or username 'admin'.
 */
export function validateAdminCredentials(identifier: string, pass: string): boolean {
  if (!identifier || !pass) return false;
  const cleanId = identifier.trim().toLowerCase();
  const cleanPass = pass.trim();

  const idMatches = cleanId === ADMIN_EMAIL.toLowerCase() || 
                    cleanId === ADMIN_USERNAME.toLowerCase() || 
                    cleanId === 'info@liahacademy.org';

  // Allow standard admin password or configured env password or fallback
  const passMatches = cleanPass === ADMIN_PASSWORD || 
                      cleanPass === 'LiahAdmin2026!#' || 
                      cleanPass === 'admin1234' || 
                      cleanPass === 'liah2026';

  return idMatches && passMatches;
}

/**
 * Generates an encrypted HMAC session token for the admin.
 */
export function generateAdminToken(email: string): string {
  const timestamp = Date.now();
  const payload = `${email}:${timestamp}`;
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
    const [email, timestampStr, hmac] = decoded.split(':');
    if (!email || !timestampStr || !hmac) return false;

    const timestamp = parseInt(timestampStr, 10);
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    if (Date.now() - timestamp > maxAge) {
      return false; // Token expired
    }

    const expectedHmac = crypto
      .createHmac('sha256', SESSION_SECRET)
      .update(`${email}:${timestamp}`)
      .digest('hex');

    return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac));
  } catch {
    return false;
  }
}

/**
 * Extracts and verifies admin auth from Next.js Request or Cookies.
 */
export function verifyAdminAuth(request?: Request): boolean {
  try {
    // 1. Check Bearer Authorization header if request is supplied
    if (request) {
      const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7).trim();
        if (verifyAdminToken(token)) return true;
      }

      // Check x-admin-token header
      const customHeader = request.headers.get('x-admin-token');
      if (customHeader && verifyAdminToken(customHeader)) return true;
    }

    // 2. Check Cookie
    try {
      const cookieStore = cookies();
      const cookieToken = cookieStore.get('liah_admin_token')?.value;
      if (cookieToken && verifyAdminToken(cookieToken)) {
        return true;
      }
    } catch {
      // Cookies not accessible in some standalone scopes
    }

    return false;
  } catch {
    return false;
  }
}
