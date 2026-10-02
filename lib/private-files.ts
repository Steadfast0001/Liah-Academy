import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export const PRIVATE_FILE_CATEGORIES = ['student-documents', 'payment-proofs'] as const;
export type PrivateFileCategory = typeof PRIVATE_FILE_CATEGORIES[number];

const MAX_SIGNED_URL_TTL_SECONDS = 15 * 60;
const FILE_NAME_PATTERN = /^[a-f0-9-]{36}\.[a-z0-9]{1,8}$/i;

function getStorageRoot(): string {
  if (process.env.PRIVATE_UPLOAD_DIR) {
    return path.resolve(process.env.PRIVATE_UPLOAD_DIR);
  }

  // Default to private uploads directory outside public web root (ideal for cPanel home directory)
  const homeFallback = path.resolve(process.cwd(), '..', 'liah-private-uploads');
  const publicRoot = path.resolve(process.cwd(), 'public');
  const relativeToPublic = path.relative(publicRoot, homeFallback);

  if (homeFallback !== publicRoot && (relativeToPublic.startsWith(`..${path.sep}`) || relativeToPublic === '..' || path.isAbsolute(relativeToPublic))) {
    return homeFallback;
  }

  return path.resolve(process.cwd(), 'data', 'private-uploads');
}

function getSigningSecret(): string {
  const secret = process.env.FILE_URL_SIGNING_SECRET || process.env.STUDENT_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (secret && Buffer.byteLength(secret, 'utf8') >= 32) {
    return secret;
  }
  const fallbackSource = process.env.ADMIN_PASSWORD || process.env.ADMIN_PIN || 'liah-academy-master-secure-signing-seed-2026';
  return crypto.createHash('sha256').update(`liah-file-signing:${fallbackSource}`).digest('hex');
}

function parseReference(reference: string): { category: PrivateFileCategory; fileName: string } | null {
  const match = /^private-file:\/\/(student-documents|payment-proofs)\/([a-f0-9-]{36}\.[a-z0-9]{1,8})$/i.exec(reference);
  if (!match || !FILE_NAME_PATTERN.test(match[2])) return null;
  return { category: match[1] as PrivateFileCategory, fileName: match[2] };
}

export function isPrivateFileReference(reference: unknown): reference is string {
  return typeof reference === 'string' && parseReference(reference) !== null;
}

export async function storePrivateFile(
  category: PrivateFileCategory,
  originalName: string,
  bytes: Buffer
): Promise<string> {
  const extension = path.extname(originalName).toLowerCase().replace(/[^.a-z0-9]/g, '');
  if (!/^[.][a-z0-9]{1,8}$/.test(extension)) throw new Error('File extension is not allowed.');

  const fileName = `${crypto.randomUUID()}${extension}`;
  const filePath = path.join(getStorageRoot(), category, fileName);
  await fs.mkdir(path.dirname(filePath), { recursive: true, mode: 0o700 });
  await fs.writeFile(filePath, bytes, { flag: 'wx', mode: 0o600 });
  return `private-file://${category}/${fileName}`;
}

function signature(reference: string, expires: string): string {
  return crypto.createHmac('sha256', getSigningSecret()).update(`v1:${reference}:${expires}`).digest('base64url');
}

export function createSignedFileUrl(reference: string): string {
  if (!isPrivateFileReference(reference)) throw new Error('Invalid private file reference.');
  const expires = String(Math.floor(Date.now() / 1000) + MAX_SIGNED_URL_TTL_SECONDS);
  const sig = signature(reference, expires);
  return `/api/files/download?ref=${encodeURIComponent(reference)}&expires=${expires}&sig=${sig}`;
}

export function verifySignedFileUrl(reference: string, expires: string, providedSignature: string): boolean {
  if (!isPrivateFileReference(reference) || !/^\d+$/.test(expires) || !providedSignature) return false;
  const expiresAt = Number(expires);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now || expiresAt > now + MAX_SIGNED_URL_TTL_SECONDS + 30) return false;

  try {
    const expected = Buffer.from(signature(reference, expires));
    const actual = Buffer.from(providedSignature);
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function readPrivateFile(reference: string): Promise<{ bytes: Buffer; fileName: string }> {
  const parsed = parseReference(reference);
  if (!parsed) throw new Error('Invalid private file reference.');
  const filePath = path.join(getStorageRoot(), parsed.category, parsed.fileName);
  return { bytes: await fs.readFile(filePath), fileName: parsed.fileName };
}