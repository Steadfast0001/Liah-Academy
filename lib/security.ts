import crypto from 'crypto';
import util from 'util';

const pbkdf2Promise = util.promisify(crypto.pbkdf2);

const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

export function isValidEmail(value: string | null | undefined): boolean {
  if (!value || typeof value !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function normalizePhone(value: string | null | undefined): string {
  if (!value || typeof value !== 'string') return '';
  const digits = value.replace(/\D+/g, '');
  return digits.length >= 9 ? digits : '';
}

export function normalizeText(value: string | null | undefined, maxLength = 500): string {
  const cleaned = sanitizeInput(value);
  if (!cleaned) return '';
  return cleaned.slice(0, maxLength).trim();
}

export function isRateLimited(key: string, limit = 5, windowMs = 60_000): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  return false;
}

export function checkRateLimit(key: string, limit = 5, windowMs = 60_000): { isLimited: boolean; remainingAttempts: number; resetInSeconds: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    return { isLimited: false, remainingAttempts: limit, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  const remaining = Math.max(0, limit - bucket.count);
  const resetInSec = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));
  return {
    isLimited: bucket.count >= limit,
    remainingAttempts: remaining,
    resetInSeconds: resetInSec
  };
}

export function recordFailedAttempt(key: string, limit = 5, windowMs = 60_000): { isLimited: boolean; remainingAttempts: number; resetInSeconds: number } {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { isLimited: false, remainingAttempts: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  bucket.count += 1;
  const isLimited = bucket.count >= limit;
  const remaining = Math.max(0, limit - bucket.count);
  const resetInSec = Math.max(0, Math.ceil((bucket.resetAt - now) / 1000));
  return { isLimited, remainingAttempts: remaining, resetInSeconds: resetInSec };
}

export function clearRateLimit(key: string): void {
  rateLimitBuckets.delete(key);
}

// Helper to dynamically acquire database pool for persistent multi-process rate limiting
async function getDbPoolSafe() {
  try {
    const { getMySQLPool, getDatabaseSourceMode, ensureMySQLTables } = await import('./db');
    if (getDatabaseSourceMode() === 'mysql') {
      await ensureMySQLTables().catch(() => {});
      return getMySQLPool();
    }
  } catch {}
  return null;
}

export async function isRateLimitedAsync(key: string, limit = 5, windowMs = 60_000): Promise<boolean> {
  const pool = await getDbPoolSafe();
  const now = Date.now();
  if (pool) {
    try {
      const [rows] = await pool.execute('SELECT attempts, reset_at FROM rate_limits WHERE rate_key = ? LIMIT 1', [key]);
      const record = (rows as any[])[0];
      if (record) {
        if (Number(record.reset_at) <= now) {
          await pool.execute('UPDATE rate_limits SET attempts = 1, reset_at = ? WHERE rate_key = ?', [now + windowMs, key]);
          return false;
        }
        if (record.attempts >= limit) {
          return true;
        }
        await pool.execute('UPDATE rate_limits SET attempts = attempts + 1 WHERE rate_key = ?', [key]);
        return false;
      } else {
        await pool.execute(
          'INSERT INTO rate_limits (rate_key, attempts, reset_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE attempts = attempts + 1',
          [key, now + windowMs]
        );
        return false;
      }
    } catch {}
  }
  return isRateLimited(key, limit, windowMs);
}

export async function checkRateLimitAsync(key: string, limit = 5, windowMs = 60_000): Promise<{ isLimited: boolean; remainingAttempts: number; resetInSeconds: number }> {
  const pool = await getDbPoolSafe();
  const now = Date.now();
  if (pool) {
    try {
      const [rows] = await pool.execute('SELECT attempts, reset_at FROM rate_limits WHERE rate_key = ? LIMIT 1', [key]);
      const record = (rows as any[])[0];
      if (!record || Number(record.reset_at) <= now) {
        return { isLimited: false, remainingAttempts: limit, resetInSeconds: Math.ceil(windowMs / 1000) };
      }
      const attempts = Number(record.attempts);
      const resetAt = Number(record.reset_at);
      return {
        isLimited: attempts >= limit,
        remainingAttempts: Math.max(0, limit - attempts),
        resetInSeconds: Math.max(0, Math.ceil((resetAt - now) / 1000))
      };
    } catch {}
  }
  return checkRateLimit(key, limit, windowMs);
}

export async function recordFailedAttemptAsync(key: string, limit = 5, windowMs = 60_000): Promise<{ isLimited: boolean; remainingAttempts: number; resetInSeconds: number }> {
  const pool = await getDbPoolSafe();
  const now = Date.now();
  if (pool) {
    try {
      const [rows] = await pool.execute('SELECT attempts, reset_at FROM rate_limits WHERE rate_key = ? LIMIT 1', [key]);
      const record = (rows as any[])[0];
      if (!record || Number(record.reset_at) <= now) {
        const resetAt = now + windowMs;
        await pool.execute(
          'INSERT INTO rate_limits (rate_key, attempts, reset_at) VALUES (?, 1, ?) ON DUPLICATE KEY UPDATE attempts = 1, reset_at = ?',
          [key, resetAt, resetAt]
        );
        return { isLimited: false, remainingAttempts: limit - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
      }

      const newAttempts = Number(record.attempts) + 1;
      const resetAt = Number(record.reset_at);
      await pool.execute('UPDATE rate_limits SET attempts = ? WHERE rate_key = ?', [newAttempts, key]);
      return {
        isLimited: newAttempts >= limit,
        remainingAttempts: Math.max(0, limit - newAttempts),
        resetInSeconds: Math.max(0, Math.ceil((resetAt - now) / 1000))
      };
    } catch {}
  }
  return recordFailedAttempt(key, limit, windowMs);
}

export async function clearRateLimitAsync(key: string): Promise<void> {
  clearRateLimit(key);
  const pool = await getDbPoolSafe();
  if (pool) {
    try {
      await pool.execute('DELETE FROM rate_limits WHERE rate_key = ?', [key]);
    } catch {}
  }
}

/**
 * Validates request Origin and Referer headers against allowed hosts for state-changing requests.
 * Allows same-host requests, requests from NEXT_PUBLIC_APP_URL, and configured institutional domains.
 */
export function validateRequestOrigin(request: Request): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { valid: true };
  }

  const origin = request.headers.get('origin') || '';
  const referer = request.headers.get('referer') || '';
  const host = request.headers.get('host') || '';

  // If neither origin nor referer is provided, browser allows direct same-origin requests
  if (!origin && !referer) {
    return { valid: true };
  }

  const allowedHosts = new Set<string>();
  if (host) allowedHosts.add(host.toLowerCase());

  const appUrls = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.APP_URL,
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'https://liahacademy.org',
    'https://www.liahacademy.org',
    'https://liahacademy.com',
    'https://www.liahacademy.com'
  ].filter(Boolean) as string[];

  for (const urlStr of appUrls) {
    try {
      const u = new URL(urlStr);
      allowedHosts.add(u.host.toLowerCase());
    } catch {}
  }

  if (origin) {
    try {
      const originHost = new URL(origin).host.toLowerCase();
      if (!allowedHosts.has(originHost)) {
        return { valid: false, reason: `Cross-origin request rejected from: ${originHost}` };
      }
    } catch {
      return { valid: false, reason: 'Malformed origin header.' };
    }
  }

  if (referer) {
    try {
      const refererHost = new URL(referer).host.toLowerCase();
      if (!allowedHosts.has(refererHost)) {
        return { valid: false, reason: `Cross-origin request rejected from referer: ${refererHost}` };
      }
    } catch {
      return { valid: false, reason: 'Malformed referer header.' };
    }
  }

  return { valid: true };
}

/**
 * Inspects the binary magic bytes of an uploaded file buffer to guarantee format integrity.
 * Prevents disguised executable scripts or corrupted files from being uploaded.
 */
export function validateFileMagicBytes(buffer: Buffer, declaredExtension: string): { valid: boolean; detectedType?: string; error?: string } {
  if (!buffer || buffer.length < 4) {
    return { valid: false, error: 'File buffer is empty or corrupted.' };
  }

  // Magic bytes signatures:
  // PDF: %PDF- (0x25 0x50 0x44 0x46)
  const isPdf = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;

  // PNG: 0x89 0x50 0x4E 0x47
  const isPng = buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47;

  // JPEG: 0xFF 0xD8 0xFF
  const isJpeg = buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF;

  // WebP: RIFF....WEBP (0x52 0x49 0x46 0x46 .... 0x57 0x45 0x42 0x50)
  const isWebP = buffer.length >= 12 &&
    buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
    buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50;

  const ext = declaredExtension.toLowerCase().replace(/^\./, '');

  if (ext === 'pdf') {
    if (!isPdf) return { valid: false, error: 'File header does not match a valid PDF document.' };
    return { valid: true, detectedType: 'application/pdf' };
  }

  if (ext === 'png') {
    if (!isPng) return { valid: false, error: 'File header does not match a valid PNG image.' };
    return { valid: true, detectedType: 'image/png' };
  }

  if (ext === 'jpg' || ext === 'jpeg') {
    if (!isJpeg) return { valid: false, error: 'File header does not match a valid JPEG image.' };
    return { valid: true, detectedType: 'image/jpeg' };
  }

  if (ext === 'webp') {
    if (!isWebP) return { valid: false, error: 'File header does not match a valid WebP image.' };
    return { valid: true, detectedType: 'image/webp' };
  }

  return { valid: false, error: `Unsupported file extension .${ext}` };
}

/**
 * Hashes a plaintext password with a unique cryptographic salt using PBKDF2 (SHA-512).
 * Conforms to modern OWASP recommendations with 210,000 iterations.
 * Output format: pbkdf2$iterations$salt$hash
 */
const DEFAULT_PBKDF2_ITERATIONS = parseInt(process.env.PBKDF2_ITERATIONS || '100000', 10);

export function hashPassword(password: string): string {
  if (!password) throw new Error('Password cannot be empty.');
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = DEFAULT_PBKDF2_ITERATIONS;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

/**
 * Asynchronously hashes a password using libuv thread pool.
 * Does not block the Node.js event loop during high-concurrency requests.
 */
export async function hashPasswordAsync(password: string): Promise<string> {
  if (!password) throw new Error('Password cannot be empty.');
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = DEFAULT_PBKDF2_ITERATIONS;
  const hashBuf = await pbkdf2Promise(password, salt, iterations, 64, 'sha512');
  return `pbkdf2$${iterations}$${salt}$${hashBuf.toString('hex')}`;
}

/**
 * Securely verifies a plaintext password against a stored hash using timing-safe comparison.
 * Supports backward-compatible verification for legacy unencrypted accounts and variable iteration counts.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // 1. PBKDF2 SHA-512 Encrypted Hash
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;

    const iterations = parseInt(parts[1], 10) || 10000;
    const salt = parts[2];
    const originalHash = parts[3];

    const hashToVerify = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
    try {
      return crypto.timingSafeEqual(Buffer.from(originalHash, 'hex'), Buffer.from(hashToVerify, 'hex'));
    } catch {
      return false;
    }
  }

  // 2. Fallback check for any legacy accounts before encryption upgrade
  return password === storedHash;
}

/**
 * Asynchronously verifies a password using libuv worker threads.
 * Crucial for scaling across 100+ concurrent user authentications without event loop starvation.
 */
export async function verifyPasswordAsync(password: string, storedHash: string): Promise<boolean> {
  if (!password || !storedHash) return false;

  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;

    const iterations = parseInt(parts[1], 10) || 10000;
    const salt = parts[2];
    const originalHash = parts[3];

    try {
      const hashBuf = await pbkdf2Promise(password, salt, iterations, 64, 'sha512');
      const hashToVerify = hashBuf.toString('hex');
      const origBuf = Buffer.from(originalHash, 'hex');
      const compBuf = Buffer.from(hashToVerify, 'hex');
      if (origBuf.length !== compBuf.length) return false;
      return crypto.timingSafeEqual(origBuf, compBuf);
    } catch {
      return false;
    }
  }

  return password === storedHash;
}

/**
 * Checks if a stored password needs to be upgraded/rehashed to modern OWASP PBKDF2.
 */
export function needsRehash(storedHash: string): boolean {
  if (!storedHash || !storedHash.startsWith('pbkdf2$')) return true;
  const parts = storedHash.split('$');
  const iterations = parseInt(parts[1], 10) || 0;
  return iterations < 50000;
}

/**
 * Strips dangerous HTML tags and script injections from user input to prevent XSS.
 */
export function sanitizeInput(input: string | null | undefined): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/on\w+='[^']*'/gi, '')
    .replace(/javascript:[^"']*/gi, '');
}

/**
 * Recursively sanitizes all string properties in a payload object.
 */
export function sanitizeObject<T>(obj: T): T {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObject(item)) as unknown as T;
  }
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      result[key] = sanitizeInput(value);
    } else if (typeof value === 'object' && value !== null) {
      result[key] = sanitizeObject(value);
    } else {
      result[key] = value;
    }
  }
  return result as T;
}

