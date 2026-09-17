const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 Packaging Liah Academy for cPanel deployment (Database-Safe Production Bundle)...');

const rootDir = process.cwd();
const zipPath = path.join(rootDir, 'liah-academy-cpanel.zip');
const distDir = path.join(rootDir, '.cpanel_dist_staging');

// Clean previous dist & zip
if (fs.existsSync(zipPath)) {
  try { fs.unlinkSync(zipPath); } catch {}
}
if (fs.existsSync(distDir)) {
  try { fs.rmSync(distDir, { recursive: true, force: true }); } catch {}
}

fs.mkdirSync(distDir, { recursive: true });

// 1. Prune .next/cache to reduce package size
const cacheDir = path.join(rootDir, '.next', 'cache');
if (fs.existsSync(cacheDir)) {
  console.log('🧹 Pruning intermediate build cache (.next/cache)...');
  try {
    fs.rmSync(cacheDir, { recursive: true, force: true });
  } catch (e) {
    console.log('Note: could not remove cache directory:', e.message);
  }
}

// 2. Helper to copy directory recursively with ignore filters
function copyDirRecursive(src, dest, filterFn) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (filterFn && !filterFn(srcPath, entry.name, entry.isDirectory())) {
      continue;
    }

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath, filterFn);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('📋 Staging database-safe application files...');

// Copy .next
copyDirRecursive(
  path.join(rootDir, '.next'),
  path.join(distDir, '.next'),
  (srcPath, name) => name !== 'cache'
);

// Copy public (assets, flyers, icons; excluding user dynamic uploads so live uploads are safe)
copyDirRecursive(
  path.join(rootDir, 'public'),
  path.join(distDir, 'public'),
  (srcPath, name) => name !== 'uploads'
);
// Ensure empty uploads folder placeholder exists without overwriting live files
fs.mkdirSync(path.join(distDir, 'public', 'uploads'), { recursive: true });

// Copy app, components, lib, scripts
copyDirRecursive(path.join(rootDir, 'app'), path.join(distDir, 'app'));
copyDirRecursive(path.join(rootDir, 'components'), path.join(distDir, 'components'));
copyDirRecursive(path.join(rootDir, 'lib'), path.join(distDir, 'lib'));
copyDirRecursive(path.join(rootDir, 'scripts'), path.join(distDir, 'scripts'));

// Copy data directory SAFELY:
// EXCLUDE live database file (liah_academy_store.json), backups, and logs
// Only include schema.sql and initial_seed.json
copyDirRecursive(
  path.join(rootDir, 'data'),
  path.join(distDir, 'data'),
  (srcPath, name) => {
    if (name === 'liah_academy_store.json') return false;
    if (name.startsWith('liah_academy_store.json.tmp')) return false;
    if (name === 'backups') return false;
    if (name.endsWith('.log')) return false;
    return true;
  }
);

// Copy root configuration files (Never copy .env or .env.local to avoid overwriting production credentials)
const rootFiles = [
  'package.json',
  'package-lock.json',
  'server.js',
  'ecosystem.config.js',
  'next.config.mjs',
  'tsconfig.json',
  '.env.example'
];

for (const file of rootFiles) {
  const src = path.join(rootDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(distDir, file));
  }
}

// 3. Compress staging directory to liah-academy-cpanel.zip
console.log('🗜️  Compressing production zip package...');
const powershellCmd = `Compress-Archive -Path '${distDir}\\*' -DestinationPath '${zipPath}' -Force`;

try {
  execSync(`powershell -Command "${powershellCmd}"`, { cwd: rootDir, stdio: 'inherit' });
  const stats = fs.statSync(zipPath);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ Database-Safe cPanel Package created successfully: liah-academy-cpanel.zip (${sizeMB} MB)`);
} catch (err) {
  console.error('Packaging error:', err.message);
} finally {
  // Clean up staging folder
  try {
    fs.rmSync(distDir, { recursive: true, force: true });
  } catch {}
}

