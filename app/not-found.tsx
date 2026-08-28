import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '4rem', fontWeight: 900, color: '#081F3E', margin: '0 0 10px 0' }}>404</h1>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: '0 0 16px 0' }}>Page Not Found</h2>
      <p style={{ color: '#64748B', maxWidth: '450px', marginBottom: '24px', lineHeight: 1.6 }}>
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/" className="btn btn-primary" style={{ padding: '12px 24px', fontWeight: 700 }}>
        Return to Home
      </Link>
    </div>
  );
}
