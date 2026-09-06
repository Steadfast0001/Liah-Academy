// ============================================================================
// LIAH ACADEMY - CPANEL & PRODUCTION NODE.JS ENTRY POINT
// Compatible with cPanel Phusion Passenger / Node.js Application Manager
// ============================================================================

const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV === 'development';
const port = parseInt(process.env.PORT, 10) || 3000;
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  })
  .once('error', (err) => {
    console.error('Server boot error:', err);
    process.exit(1);
  })
  .listen(port, () => {
    console.log(`> 🎓 Liah Academy production server running on port ${port}`);
  });
});
