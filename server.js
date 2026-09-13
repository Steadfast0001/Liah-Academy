// ============================================================================
// LIAH ACADEMY - PRODUCTION SERVER (Phusion Passenger / cPanel / PM2 / Linux)
// ============================================================================
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// In cPanel Passenger, PORT can be a port number, socket path, or pipe
const port = process.env.PORT || 3000;

app.prepare().then(() => {
  createServer((req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Request handler error:', err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  }).listen(port, (err) => {
    if (err) {
      console.error('Server listen error:', err);
      throw err;
    }
    console.log(`> Liah Academy online and listening on ${port}`);
  });
}).catch((err) => {
  console.error('Next.js startup error:', err);
  process.exit(1);
});
