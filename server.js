// ============================================================================
// LIAH ACADEMY - PRODUCTION CPANEL SERVER (Phusion Passenger / Linux)
// ============================================================================
const { createServer } = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');
const next = require('next');

const dev = false;
const appDir = __dirname;
const logFile = path.join(appDir, 'error_log.txt');

function logError(msg, err) {
  const line = `[${new Date().toISOString()}] ${msg}: ${err ? (err.stack || err.message || err) : ''}\n`;
  try {
    fs.appendFileSync(logFile, line);
  } catch {}
  console.error(line);
}

// Log process start
logError('Starting Liah Academy application in ' + appDir);

// Verify .next directory exists
const nextDir = path.join(appDir, '.next');
if (!fs.existsSync(nextDir)) {
  logError('CRITICAL: .next folder not found in ' + appDir + '. Please ensure .next build folder is uploaded/extracted.');
}

const app = next({ 
  dev: false, 
  dir: appDir,
  conf: {
    distDir: '.next'
  }
});

const handle = app.getRequestHandler();
const port = process.env.PORT || 3000;

app.prepare()
  .then(() => {
    logError('Next.js app.prepare() succeeded');
    createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        logError('Request handler error on ' + req.url, err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(`
          <div style="font-family:sans-serif;padding:40px;max-width:700px;margin:auto;border:1px solid #ddd;border-radius:12px;margin-top:50px;">
            <h2 style="color:#b91c1c;">Liah Academy — Server Startup Notice</h2>
            <p>An internal error occurred while rendering the page. Check <code>error_log.txt</code> in your cPanel File Manager.</p>
            <pre style="background:#f1f5f9;padding:15px;border-radius:8px;overflow:auto;font-size:13px;">${err.stack || err.message}</pre>
          </div>
        `);
      }
    }).listen(port, (err) => {
      if (err) {
        logError('Listen error', err);
        throw err;
      }
      logError('Server listening on ' + port);
    });
  })
  .catch((err) => {
    logError('Next.js prepare() fatal error', err);
    // Create fallback server to show error to admin instead of generic blank 500
    createServer((req, res) => {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.end(`
        <div style="font-family:sans-serif;padding:40px;max-width:750px;margin:auto;border:1px solid #ef4444;border-radius:12px;margin-top:50px;background:#fff5f5;">
          <h2 style="color:#991b1b;">⚠️ Liah Academy — Setup Diagnostics</h2>
          <p><strong>Next.js could not load the production build:</strong></p>
          <pre style="background:#fff;border:1px solid #fca5a5;padding:15px;border-radius:8px;overflow:auto;font-size:13px;color:#7f1d1d;">${err.stack || err.message}</pre>
          <hr style="border:none;border-top:1px solid #fecaca;margin:20px 0;"/>
          <p><strong>How to fix in cPanel:</strong></p>
          <ol style="line-height:1.8;">
            <li>In cPanel File Manager, click <strong>Settings</strong> (top right) and check <strong>"Show Hidden Files (dotfiles)"</strong>.</li>
            <li>Ensure the <strong><code>.next</code></strong> folder is inside your application directory.</li>
            <li>In <strong>Setup Node.js App</strong>, ensure Node.js version is set to <strong>18.x</strong> or <strong>20.x</strong> and click <strong>Restart</strong>.</li>
          </ol>
        </div>
      `);
    }).listen(port);
  });
