/**
 * Production Security Assertion
 * Enforces that critical cryptographic secrets are securely defined in production.
 */
export function assertProductionSecurityEnvironment(): void {
  if (process.env.NODE_ENV !== 'production') {
    return;
  }

  const requiredSecrets = [
    'ADMIN_SESSION_SECRET',
    'STUDENT_SESSION_SECRET',
    'FILE_URL_SIGNING_SECRET'
  ];

  const missingOrWeak: string[] = [];

  for (const key of requiredSecrets) {
    const value = process.env[key];
    if (!value || Buffer.byteLength(value, 'utf8') < 32) {
      missingOrWeak.push(key);
    }
  }

  if (missingOrWeak.length > 0) {
    const msg = `CRITICAL SECURITY CONFIG: The following required environment secret(s) are missing or shorter than 32 characters: ${missingOrWeak.join(', ')}. Please configure strong 32+ byte secrets in cPanel environment variables before running in production.`;
    console.error(`\n🚨 ${msg}\n`);
    throw new Error(msg);
  }
}
