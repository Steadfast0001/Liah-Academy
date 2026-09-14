// ============================================================================
// LIAH ACADEMY - PRODUCTION CPANEL SERVER (Phusion Passenger / Linux)
// ============================================================================
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

// 1. AUTO-FIX LINUX PERMISSIONS (Fixes EACCES: permission denied in .next)
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

const nextDir = path.join(appDir, '.next');
if (fs.existsSync(nextDir)) {
  fixPermissionsRecursive(nextDir);
  log('Auto-repaired permissions on .next directory to 755/644');
}

// 2. CHECK NEXT.JS RUNTIME
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

app.prepare()
  .then(() => {
    log('Next.js app.prepare() ready. Starting HTTP listener.');
    http.createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
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
