import crypto from 'crypto';

/**
 * Hashes a plaintext password with a unique cryptographic salt using PBKDF2 (SHA-512).
 * Output format: pbkdf2$iterations$salt$hash
 */
export function hashPassword(password: string): string {
  if (!password) throw new Error('Password cannot be empty.');
  const salt = crypto.randomBytes(16).toString('hex');
  const iterations = 100000;
  const hash = crypto.pbkdf2Sync(password, salt, iterations, 64, 'sha512').toString('hex');
  return `pbkdf2$${iterations}$${salt}$${hash}`;
}

/**
 * Securely verifies a plaintext password against a stored hash using timing-safe comparison.
 * Supports backward-compatible verification for legacy unencrypted accounts during migration.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) return false;

  // 1. PBKDF2 SHA-512 Encrypted Hash
  if (storedHash.startsWith('pbkdf2$')) {
    const parts = storedHash.split('$');
    if (parts.length !== 4) return false;

    const iterations = parseInt(parts[1], 10);
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
 * Checks if a stored password needs to be upgraded/rehashed to modern PBKDF2.
 */
export function needsRehash(storedHash: string): boolean {
  return !storedHash || !storedHash.startsWith('pbkdf2$');
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

