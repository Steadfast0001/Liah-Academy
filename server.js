// ============================================================================
// LIAH ACADEMY - PRODUCTION CPANEL SERVER (Phusion Passenger / Linux / Namecheap)
// ============================================================================
// 0. HIGH-CONCURRENCY LIBUV THREADPOOL CONFIGURATION (Handles 100+ concurrent users)
if (!process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = '32';
}

const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const port = process.env.PORT || 3000;
const appDir = __dirname;
const logFile = path.join(appDir, 'error_log.txt');

function log(msg, err) {
  const line = `[${new Date().toISOString()}] ${msg}${err ? ': ' + (err.stack || err.message || err) : ''}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch {}
  console.log(line);
}

// 1. AUTO-LOAD .env AND .env.local (Ensures cPanel File Manager edits are detected)
function loadEnvFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) continue;
        const eqIdx = trimmed.indexOf('=');
        if (eqIdx > 0) {
          const key = trimmed.slice(0, eqIdx).trim();
          let val = trimmed.slice(eqIdx + 1).trim();
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1);
          }
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      }
    }
  } catch (err) {
    log('Notice: Failed reading env file ' + filePath, err);
  }
}

loadEnvFile(path.join(appDir, '.env'));
loadEnvFile(path.join(appDir, '.env.local'));

// 2. AUTO-FIX LINUX PERMISSIONS (Ensures .next, app, lib, components are readable on Namecheap)
function fixPermissionsRecursive(dirPath) {
  try {
    fs.chmodSync(dirPath, 0o755);
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      try {
        if (item.isDirectory()) {
          fs.chmodSync(fullPath, 0o755);
          fixPermissionsRecursive(fullPath);
        } else {
          fs.chmodSync(fullPath, 0o644);
        }
      } catch (e) {}
    }
  } catch (e) {}
}

const keyDirs = ['.next', 'app', 'components', 'lib', 'public', 'data', 'scripts'];
for (const dir of keyDirs) {
  const target = path.join(appDir, dir);
  if (fs.existsSync(target)) {
    fixPermissionsRecursive(target);
  }
}
log('Permissions self-healing completed for core directories');

// 3. PRODUCTION CRYPTOGRAPHIC SECRETS (Self-Healing & Persistent across restarts)
const requiredSecrets = [
  'ADMIN_SESSION_SECRET',
  'STUDENT_SESSION_SECRET',
  'FILE_URL_SIGNING_SECRET'
];

const secretsFilePath = path.join(appDir, 'data', '.secret_keys.json');
let persistedSecrets = {};
try {
  if (fs.existsSync(secretsFilePath)) {
    persistedSecrets = JSON.parse(fs.readFileSync(secretsFilePath, 'utf8'));
  }
} catch {}

let secretsUpdated = false;
for (const key of requiredSecrets) {
  const currentVal = process.env[key];
  if (!currentVal || Buffer.byteLength(currentVal, 'utf8') < 32) {
    if (persistedSecrets[key] && Buffer.byteLength(persistedSecrets[key], 'utf8') >= 32) {
      process.env[key] = persistedSecrets[key];
    } else {
      const generated = crypto.randomBytes(32).toString('hex');
      persistedSecrets[key] = generated;
      process.env[key] = generated;
      secretsUpdated = true;
    }
  }
}

if (secretsUpdated) {
  try {
    const dataDir = path.join(appDir, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(secretsFilePath, JSON.stringify(persistedSecrets, null, 2), 'utf8');
    log('Generated and persisted strong production cryptographic secrets in data/.secret_keys.json');
  } catch (err) {
    log('Warning: could not write .secret_keys.json', err);
  }
}

// 4. CHECK NEXT.JS RUNTIME
let next;
try {
  next = require('next');
} catch (err) {
  log('FATAL: Cannot find next module. Please run npm install in cPanel.', err);
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Please click "Run NPM Install" in cPanel Setup Node.js App</h1>');
  }).listen(port);
  return;
}

// 5. INITIALIZE NEXT.JS APP
const app = next({ 
  dev: false, 
  dir: appDir
});
const handle = app.getRequestHandler();

// Block sensitive internal file requests directly
const blockedPatterns = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/error_log\.txt/i,
  /^\/stderr\.log/i,
  /^\/ecosystem\.config\.js/i,
  /^\/data\/.*\.sql$/i,
  /^\/data\/\.secret_keys\.json$/i,
  /^\/scripts\//i,
];

app.prepare()
  .then(() => {
    log('Next.js app.prepare() ready. Starting HTTP listener on port ' + port);
    http.createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        const pathname = parsedUrl.pathname || '';

        // Security check: block direct requests to sensitive internal files
        if (blockedPatterns.some((pattern) => pattern.test(pathname))) {
          res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('Access Denied');
          return;
        }

        handle(req, res, parsedUrl);
      } catch (err) {
        log('Request execution error on ' + req.url, err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, (err) => {
      if (err) {
        log('Server listen error', err);
        throw err;
      }
      log('Liah Academy successfully online on port ' + port);
    });
  })
  .catch((err) => {
    log('Fatal error during app.prepare()', err);
    http.createServer((req, res) => {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:sans-serif;padding:30px;max-width:700px;margin:50px auto;border:1px solid #ef4444;border-radius:10px;background:#fff5f5;">
          <h2 style="color:#b91c1c;">Liah Academy — Startup Diagnostic</h2>
          <pre style="background:#fff;padding:12px;border:1px solid #fecaca;border-radius:6px;overflow:auto;font-size:13px;color:#991b1b;">${err.stack || err.message}</pre>
        </div>
      `);
    }).listen(port);
  });
