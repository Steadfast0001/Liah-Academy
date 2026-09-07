const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Liah Academy for cPanel deployment...');

const rootDir = process.cwd();
const zipPath = path.join(rootDir, 'liah-academy-cpanel.zip');

if (fs.existsSync(zipPath)) {
  try { fs.unlinkSync(zipPath); } catch {}
}

// Files and folders to include
const includeItems = [
  '.next',
  'public',
  'app',
  'components',
  'lib',
  'data',
  'scripts',
  'package.json',
  'package-lock.json',
  'server.js',
  'next.config.mjs',
  'tsconfig.json'
];

const powershellCmd = `Compress-Archive -Path ${includeItems.join(', ')} -DestinationPath liah-academy-cpanel.zip -Force`;

try {
  execSync(`powershell -Command "${powershellCmd}"`, { cwd: rootDir, stdio: 'inherit' });
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Package created successfully: liah-academy-cpanel.zip (${sizeMB} MB)`);
} catch (err) {
  console.error('Packaging error:', err.message);
}
