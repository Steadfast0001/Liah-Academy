// ============================================================================
// LIAH ACADEMY - PRODUCTION CPANEL SERVER (Phusion Passenger / Linux)
// ============================================================================
// 0. HIGH-CONCURRENCY LIBUV THREADPOOL CONFIGURATION (Handles 100+ concurrent users)
if (!process.env.UV_THREADPOOL_SIZE) {
  process.env.UV_THREADPOOL_SIZE = '32';
}

const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

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

// 1. AUTO-FIX LINUX PERMISSIONS (Ensures .next, app, lib, components are readable)
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

// 2. ASSERT PRODUCTION SECURITY ENVIRONMENT
if (process.env.NODE_ENV === 'production') {
  const requiredSecrets = [
    'ADMIN_SESSION_SECRET',
    'STUDENT_SESSION_SECRET',
    'FILE_URL_SIGNING_SECRET'
  ];
  const missingOrShort = [];
  for (const key of requiredSecrets) {
    const val = process.env[key];
    if (!val || val.length < 32) {
      missingOrShort.push(key);
    }
  }
  if (missingOrShort.length > 0) {
    const errText = `CRITICAL SECURITY CONFIGURATION: The following environment secret(s) must be defined with at least 32 characters in production: ${missingOrShort.join(', ')}. Please configure them in your cPanel Setup Node.js App Environment Variables.`;
    log('FATAL: Security assertion failed', new Error(errText));
    http.createServer((req, res) => {
      res.writeHead(500, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <div style="font-family:sans-serif;padding:30px;max-width:700px;margin:50px auto;border:1px solid #ef4444;border-radius:10px;background:#fff5f5;">
          <h2 style="color:#b91c1c;">Liah Academy — Production Security Configuration Required</h2>
          <p style="color:#7f1d1d;line-height:1.6;">Before launching in production, the following cryptographic secrets must be configured with at least 32 characters in cPanel Environment Variables:</p>
          <ul>${missingOrShort.map(k => `<li style="font-family:monospace;font-weight:bold;color:#991b1b;">${k}</li>`).join('')}</ul>
          <p style="font-size:13px;color:#6b7280;">Log in to cPanel &rarr; Setup Node.js App &rarr; Edit Application &rarr; Add Environment Variables &rarr; Restart App.</p>
        </div>
      `);
    }).listen(port);
    return;
  }
}

// 3. CHECK NEXT.JS RUNTIME
let next;
try {
  next = require('next');
} catch (err) {
  log('FATAL: Cannot find next module', err);
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1>Please click "Run NPM Install" in cPanel Setup Node.js App</h1>');
  }).listen(port);
  return;
}

// 3. INITIALIZE NEXT.JS APP
const app = next({ 
  dev: false, 
  dir: appDir
});
const handle = app.getRequestHandler();

// Block sensitive file requests directly
const blockedPatterns = [
  /^\/\.env/i,
  /^\/\.git/i,
  /^\/error_log\.txt/i,
  /^\/stderr\.log/i,
  /^\/ecosystem\.config\.js/i,
  /^\/data\/.*\.sql$/i,
  /^\/scripts\//i,
];

app.prepare()
  .then(() => {
    log('Next.js app.prepare() ready. Starting HTTP listener.');
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

