import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

/**
 * Production Security Assertion & Self-Healing Key Manager
 * Enforces strong cryptographic secrets in production.
 * If cPanel environment variables are not yet configured, it auto-generates
 * and persists strong 64-character random hex keys so the platform runs smoothly
 * on Namecheap and other shared cPanel hosting environments without crashing.
 */
export function assertProductionSecurityEnvironment(): void {
  const requiredSecrets = [
    'ADMIN_SESSION_SECRET',
    'STUDENT_SESSION_SECRET',
    'FILE_URL_SIGNING_SECRET'
  ];

  const secretsFilePath = path.join(process.cwd(), 'data', '.secret_keys.json');
  let persistedSecrets: Record<string, string> = {};

  try {
    if (fs.existsSync(secretsFilePath)) {
      persistedSecrets = JSON.parse(fs.readFileSync(secretsFilePath, 'utf8'));
    }
  } catch {}

  let modified = false;

  for (const key of requiredSecrets) {
    const value = process.env[key];
    if (!value || Buffer.byteLength(value, 'utf8') < 32) {
      if (persistedSecrets[key] && Buffer.byteLength(persistedSecrets[key], 'utf8') >= 32) {
        process.env[key] = persistedSecrets[key];
      } else {
        const generated = crypto.randomBytes(32).toString('hex');
        persistedSecrets[key] = generated;
        process.env[key] = generated;
        modified = true;
      }
    }
  }

  if (modified) {
    try {
      const dataDir = path.join(process.cwd(), 'data');
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(secretsFilePath, JSON.stringify(persistedSecrets, null, 2), 'utf8');
      console.log('🔒 [Security] Auto-generated persistent production cryptographic secrets in data/.secret_keys.json');
    } catch (e) {
      console.warn('⚠️ [Security Notice] Could not write .secret_keys.json file:', e);
    }
  }
}
