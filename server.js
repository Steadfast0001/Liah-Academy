// ============================================================================
// LIAH ACADEMY - PRODUCTION CPANEL SERVER (Phusion Passenger / Linux)
// ============================================================================
const http = require('http');
const { parse } = require('url');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const appDir = __dirname;

let next;
try {
  next = require('next');
} catch (err) {
  // If node_modules is missing or next is not installed
  http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Liah Academy - Setup in Progress</title>
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;padding:30px;color:#1e293b;">
        <div style="max-width:650px;margin:40px auto;background:#fff;padding:36px;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
          <div style="font-size:32px;margin-bottom:12px;">🎓</div>
          <h2 style="color:#0f172a;margin:0 0 10px 0;font-size:24px;">Liah Academy — One-Click Setup</h2>
          <p style="color:#64748b;margin:0 0 20px 0;font-size:15px;">Node.js is running successfully. Dependencies just need to be installed in cPanel.</p>
          
          <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px;padding:18px;margin-bottom:24px;">
            <strong style="color:#1e40af;display:block;margin-bottom:6px;font-size:15px;">👉 2-Minute Solution:</strong>
            <ol style="margin:0;padding-left:20px;color:#1e3a8a;font-size:14px;line-height:1.8;">
              <li>Go to cPanel ➔ <strong>Setup Node.js App</strong></li>
              <li>Click the edit pencil next to your application (<strong>liahacademy</strong>)</li>
              <li>Scroll to <em>Detected configuration files</em> and click <strong>"Run NPM Install"</strong></li>
              <li>Click the <strong>Restart</strong> button at the top.</li>
            </ol>
          </div>
          
          <p style="font-size:12px;color:#94a3b8;margin:0;">Error Detail: ${err.message}</p>
        </div>
      </body>
      </html>
    `);
  }).listen(port);
  return;
}

// Next.js exists, initialize application
const dev = false;
const app = next({ 
  dev: false, 
  dir: appDir
});
const handle = app.getRequestHandler();

app.prepare()
  .then(() => {
    http.createServer((req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Request handler error:', err);
        res.statusCode = 500;
        res.end('Internal Server Error');
      }
    }).listen(port, (err) => {
      if (err) throw err;
      console.log('> Liah Academy is live on ' + port);
    });
  })
  .catch((err) => {
    http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Liah Academy - Build Setup</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
        </head>
        <body style="font-family:system-ui,-apple-system,sans-serif;background:#f8fafc;padding:30px;color:#1e293b;">
          <div style="max-width:650px;margin:40px auto;background:#fff;padding:36px;border-radius:16px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.08);border:1px solid #e2e8f0;">
            <div style="font-size:32px;margin-bottom:12px;">⚠️</div>
            <h2 style="color:#0f172a;margin:0 0 10px 0;font-size:24px;">Production Build Missing</h2>
            <p style="color:#64748b;margin:0 0 20px 0;font-size:15px;">Next.js could not find the <code>.next</code> build folder inside <code>${appDir}</code>.</p>
            
            <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:18px;margin-bottom:24px;">
              <strong style="color:#92400e;display:block;margin-bottom:6px;font-size:15px;">👉 Fix in cPanel File Manager:</strong>
              <ol style="margin:0;padding-left:20px;color:#78350f;font-size:14px;line-height:1.8;">
                <li>In cPanel File Manager, click <strong>Settings</strong> (top right gear) and check <strong>"Show Hidden Files (dotfiles)"</strong>.</li>
                <li>Make sure the <strong>.next</strong> folder is extracted inside your <strong>${path.basename(appDir)}</strong> directory.</li>
                <li>In <strong>Setup Node.js App</strong>, click <strong>Restart</strong>.</li>
              </ol>
            </div>
            
            <pre style="background:#f1f5f9;padding:12px;border-radius:8px;font-size:12px;overflow:auto;color:#475569;">${err.stack || err.message}</pre>
          </div>
        </body>
        </html>
      `);
    }).listen(port);
  });
