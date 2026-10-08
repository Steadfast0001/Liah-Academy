const http = require('http');

const PORT = process.env.SMOKE_PORT || 3000;
const BASE = `http://localhost:${PORT}`;

const routes = [
  '/',
  '/api/courses',
  '/api/news',
  '/api/reviews',
  '/api/contact',
  '/api/admissions/status',
  '/api/admissions/login',
  '/api/admissions/register',
  '/api/payments/momo-confirm',
  '/api/payments/upload-proof',
  '/api/chat',
  '/api/admin/payments',
  '/api/admin/chat',
  '/api/admin/inquiries',
  '/api/admin/content',
  '/api/admin/stats',
  '/api/admin/media',
  '/api/admin/auth/login',
  '/api/admin/auth/check',
  '/api/files/download'
];

const expectedStatuses = {
  '/': [200],
  '/api/courses': [200, 503],
  '/api/news': [200, 503],
  '/api/reviews': [200, 503],
  '/api/contact': [405],
  '/api/admissions/status': [401],
  '/api/admissions/login': [401, 503],
  '/api/admissions/register': [400],
  '/api/payments/momo-confirm': [410],
  '/api/payments/upload-proof': [401],
  '/api/chat': [401],
  '/api/admin/payments': [401],
  '/api/admin/chat': [401],
  '/api/admin/inquiries': [401],
  '/api/admin/content': [401],
  '/api/admin/stats': [401],
  '/api/admin/media': [401],
  '/api/admin/auth/login': [401, 503],
  '/api/admin/auth/check': [401],
  '/api/files/download': [403]
};

function request(path, method = 'GET', body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const req = http.request(
      `${BASE}${path}`,
      {
        method,
        headers: payload ? {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        } : {}
      },
      (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const text = Buffer.concat(chunks).toString('utf8');
          resolve({ status: res.statusCode, body: text, headers: res.headers });
        });
      }
    );

    req.on('error', reject);
    req.setTimeout(15_000, () => req.destroy(new Error('Request timed out')));
    if (payload) req.write(payload);
    req.end();
  });
}

async function main() {
  const results = [];
  for (const route of routes) {
    try {
      const method = route === '/api/admissions/login' || route === '/api/admissions/register' || route === '/api/payments/momo-confirm' || route === '/api/payments/upload-proof' || route === '/api/admin/auth/login' ? 'POST' : 'GET';
      const body = route === '/api/admissions/login'
        ? { email: 'probe@example.invalid', password: 'wrong-password' }
        : route === '/api/admin/auth/login'
          ? { email: 'probe@example.invalid', password: 'wrong-password' }
        : route === '/api/admissions/register'
          ? { full_name: 'Smoke Test', email: 'smoke@example.invalid', phone: '670000000', password: 'short', degree_type: 'HND', program_type: 'Software Engineering HND' }
        : route === '/api/payments/momo-confirm'
          ? { amount: 15000, pin: 'smoke-test-only' }
          : null;

      const result = await request(route, method, body);
      results.push({ route, status: result.status, expected: expectedStatuses[route].includes(result.status) });
    } catch (error) {
      results.push({ route, status: 'ERR', expected: false, error: String(error) });
    }
  }

  const failures = results.filter(item => !item.expected);
  console.log(JSON.stringify({ ok: failures.length === 0, results }, null, 2));
  process.exit(failures.length === 0 ? 0 : 1);
}

main();
