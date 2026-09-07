// ============================================================================
// LIAH ACADEMY - CPANEL & PRODUCTION NODE.JS ENTRY POINT
// Compatible with cPanel Phusion Passenger / Node.js Application Manager
// ============================================================================

// Change working directory to current app directory for cPanel Phusion Passenger
try {
  process.chdir(__dirname);
} catch (err) {
  console.warn('Could not change working directory:', err);
}

const fs = require('fs');
const path = require('path');
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

// Auto-unlock all extracted build files and directories on startup
function autoFixPermissions(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) return;
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const item of items) {
      const full = path.join(dirPath, item.name);
      try {
        fs.chmodSync(full, item.isDirectory() ? 0o777 : 0o666);
      } catch {}
      if (item.isDirectory()) {
        autoFixPermissions(full);
      }
    }
    try { fs.chmodSync(dirPath, 0o777); } catch {}
  } catch (e) {}
}

// Unlock .next and data directories immediately
autoFixPermissions(path.join(__dirname, '.next'));
autoFixPermissions(path.join(__dirname, 'data'));

const dev = process.env.NODE_ENV === 'development';
const port = process.env.PORT || 3000;
const app = next({ dev, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  server.once('error', (err) => {
    console.error('Server boot error:', err);
    process.exit(1);
  });

  server.listen(port, () => {
    console.log(`> 🎓 Liah Academy server listening on ${port}`);
  });
}).catch((err) => {
  console.error('Next.js prepare error:', err);
  process.exit(1);
});
