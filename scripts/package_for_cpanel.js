const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Liah Academy for cPanel deployment (Lightweight Production Bundle)...');

const rootDir = process.cwd();
const zipPath = path.join(rootDir, 'liah-academy-cpanel.zip');

if (fs.existsSync(zipPath)) {
  try { fs.unlinkSync(zipPath); } catch {}
}

// 1. Prune .next/cache to reduce package size from 100MB+ to ~15MB
const cacheDir = path.join(rootDir, '.next', 'cache');
if (fs.existsSync(cacheDir)) {
  console.log('🧹 Pruning intermediate build cache (.next/cache) to keep zip lightweight...');
  try {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  } catch (e) {
    console.log('Note: could not remove cache directory:', e.message);
  }
}

// 2. Core files and folders to include
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
  'ecosystem.config.js',
  'next.config.mjs',
  'tsconfig.json',
  '.env.example'
];

const powershellCmd = `Compress-Archive -Path ${includeItems.join(', ')} -DestinationPath liah-academy-cpanel.zip -Force`;

try {
  execSync(`powershell -Command "${powershellCmd}"`, { cwd: rootDir, stdio: 'inherit' });
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Lightweight cPanel Package created successfully: liah-academy-cpanel.zip (${sizeMB} MB)`);
} catch (err) {
  console.error('Packaging error:', err.message);
}

