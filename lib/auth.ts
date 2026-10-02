import { cookies } from 'next/headers';
import crypto from 'crypto';
import { adminStore, ensureMySQLTables, getDatabaseSourceMode, getMySQLPool, markMySQLOffline } from './db';
import { verifyPassword, hashPassword, verifyPasswordAsync, hashPasswordAsync, needsRehash } from './security';

const SESSION_VERSION = 'v2';
const SESSION_MAX_AGE_MS = 60 * 60 * 1000;

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.STUDENT_SESSION_SECRET || process.env.FILE_URL_SIGNING_SECRET;
  if (secret && Buffer.byteLength(secret, 'utf8') >= 32) {
    return secret;
  }
  if (process.env.NODE_ENV === 'production' && process.env.ADMIN_SESSION_SECRET) {
    return process.env.ADMIN_SESSION_SECRET;
  }
  return 'liah-admin-master-session-secret-key-32bytes-min-buea-2026';
}

export interface AdminIdentity {
  email: string;
  full_name: string;
  role: 'SuperAdmin' | 'Admin';
  source: 'database';
}

/**
 * Validates admin credentials strictly against database-stored administrators.
 * Passwords are verified against cryptographic PBKDF2 hashes stored in the database.
 * No hardcoded passwords exist; the database is the sole authoritative source.
 */
export function validateAdminCredentials(identifier: string, pass: string): AdminIdentity | null {
  if (!identifier || !pass) return null;
  const cleanId = identifier.trim().toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || 'info@liahacademy.com').trim().toLowerCase();

  try {
    let dbAdmin = adminStore.getAdminByEmail(cleanId);
    if (!dbAdmin && (cleanId === 'admin' || cleanId === 'master' || cleanId === configuredEmail)) {
      dbAdmin = adminStore.getAdminByEmail(configuredEmail);
    }

    if (dbAdmin && dbAdmin.password) {
      if (verifyPassword(pass, dbAdmin.password)) {
        // Upgrade legacy hash if necessary
        if (needsRehash(dbAdmin.password)) {
          try {
            adminStore.updateAdmin(dbAdmin.id, { password: hashPassword(pass) });
          } catch (rehashErr) {
            console.warn('Admin password rehash upgrade warning:', rehashErr);
          }
        }

        adminStore.updateAdmin(dbAdmin.id, { last_login: new Date().toISOString() });
        return {
          email: dbAdmin.email,
          full_name: dbAdmin.full_name,
          role: dbAdmin.role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin',
          source: 'database'
        };
      }
    }
  } catch (dbErr) {
    console.warn('Database admin credential validation error:', dbErr);
  }

  return null;
}

export async function validateAdminCredentialsAsync(identifier: string, pass: string): Promise<AdminIdentity | null> {
  if (!identifier || !pass) return null;
  const cleanId = identifier.trim().toLowerCase();
  const configuredEmail = (process.env.ADMIN_EMAIL || 'info@liahacademy.com').trim().toLowerCase();

  // 1. MySQL database lookup first if MySQL mode is active
  try {
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const pool = getMySQLPool();
      const lookupEmail = (cleanId === 'admin' || cleanId === 'master') ? configuredEmail : cleanId;

      const [rows] = await pool.execute(
        'SELECT id, full_name, email, password, role FROM admins WHERE LOWER(email) = ? OR LOWER(email) = ? LIMIT 1',
        [cleanId, lookupEmail]
      );
      const dbAdmin = (rows as any[])[0];

      if (dbAdmin && dbAdmin.password) {
        if (await verifyPasswordAsync(pass, dbAdmin.password)) {
          // Automatic PBKDF2 hash upgrade if needed
          if (needsRehash(dbAdmin.password)) {
            try {
              const newHash = await hashPasswordAsync(pass);
              await pool.execute('UPDATE admins SET password = ? WHERE id = ?', [newHash, dbAdmin.id]);
            } catch (rehashErr) {
              console.warn('Admin password rehash notice:', rehashErr);
            }
          }

          await pool.execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [dbAdmin.id]).catch(() => {});
          return {
            email: dbAdmin.email,
            full_name: dbAdmin.full_name,
            role: dbAdmin.role === 'SuperAdmin' ? 'SuperAdmin' : 'Admin',
            source: 'database'
          };
        }
        return null;
      }
    }
  } catch (mysqlErr: any) {
    console.warn('MySQL admin validation query failed, falling back to local database store:', mysqlErr?.message || mysqlErr);
    markMySQLOffline();
  }

  // 2. Fall back to local JSON database store
  return validateAdminCredentials(identifier, pass);
}

/**
 * Generates a versioned HMAC session token for the admin.
 */
export function generateAdminToken(email: string, role: string = 'SuperAdmin'): string {
  const timestamp = Date.now();
  const nonce = crypto.randomBytes(16).toString('hex');
  const payload = `${SESSION_VERSION}:${email}:${role}:${timestamp}:${nonce}`;
  const hmac = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest('hex');
  return Buffer.from(`${payload}:${hmac}`).toString('base64');
}

/**
 * Validates an HMAC admin session token.
 * Legacy token versions are rejected and sessions expire after one hour.
 */
export function verifyAdminToken(tokenString: string): boolean {
  if (!tokenString) return false;
  try {
    const decoded = Buffer.from(tokenString, 'base64').toString('utf-8');
    const parts = decoded.split(':');
    if (parts.length !== 6 || parts[0] !== SESSION_VERSION) return false;

    const [version, email, role, timestampString, nonce, hmac] = parts;
    if (!email || !['SuperAdmin', 'Admin'].includes(role) || !/^[a-f0-9]{32}$/.test(nonce)) return false;

    const timestamp = Number(timestampString);
    if (!Number.isSafeInteger(timestamp) || timestamp > Date.now() + 60_000 || Date.now() - timestamp > SESSION_MAX_AGE_MS) {
      return false;
    }

    const payload = [version, email, role, timestampString, nonce].join(':');
    const expectedHmac = crypto.createHmac('sha256', getSessionSecret()).update(payload).digest();
    const receivedHmac = Buffer.from(hmac, 'hex');
    return receivedHmac.length === expectedHmac.length && crypto.timingSafeEqual(receivedHmac, expectedHmac);
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
    return { email: parts[1], role: parts[2] };
  } catch {
    return null;
  }
}

function getAdminCookieToken(request?: Request): string {
  const cookieHeader = request?.headers.get('cookie') || '';
  const requestToken = cookieHeader
    .split(';')
    .map(part => part.trim())
    .find(part => part.startsWith('liah_admin_token='))
    ?.slice('liah_admin_token='.length);
  if (requestToken) return decodeURIComponent(requestToken);

  try {
    return cookies().get('liah_admin_token')?.value || '';
  } catch {
    return '';
  }
}

/**
 * Extracts and verifies admin auth from Next.js Request or Cookies.
 */
export function verifyAdminAuth(request?: Request): boolean {
  try {
    return verifyAdminToken(getAdminCookieToken(request));
  } catch {
    return false;
  }
}

/**
 * Extracts admin identity from a Request's auth headers/cookies.
 */
export function getAdminFromRequest(request: Request): { email: string; role: string } | null {
  return getAdminFromToken(getAdminCookieToken(request));
}

export async function verifyAdminAuthAsync(request: Request): Promise<boolean> {
  const admin = getAdminFromRequest(request);
  if (!admin) return false;

  try {
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables();
      const [rows] = await getMySQLPool().execute(
        'SELECT id, role FROM admins WHERE LOWER(email) = ? LIMIT 1',
        [admin.email.toLowerCase()]
      );
      const record = (rows as any[])[0];
      if (record && record.role === admin.role) return true;
      return false;
    }
  } catch (mysqlErr) {
    console.warn('MySQL verifyAdminAuthAsync fallback to local store:', mysqlErr);
    markMySQLOffline();
  }

  try {
    const record = adminStore.getAdminByEmail(admin.email);
    return Boolean(record && record.role === admin.role);
  } catch {
    return false;
  }
}
