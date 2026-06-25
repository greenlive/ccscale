import Link from 'next/link';

/**
 * Offline fallback page — shown when network fails and no cache is available.
 */
export default function OfflinePage() {
  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '2rem',
          textAlign: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f4ed',
          color: '#141413',
          margin: 0,
        }}
      >
        <div style={{ maxWidth: 480 }}>
          <div style={{ fontSize: 64, marginBottom: 16 }}>📡</div>
          <h1 style={{ fontSize: 28, fontWeight: 600, margin: '0 0 12px' }}>
            You are offline
          </h1>
          <p style={{ fontSize: 16, color: '#6b6a64', lineHeight: 1.6, margin: '0 0 24px' }}>
            We could not reach the server. Check your network connection and try again.
            Cached pages should still work.
          </p>
          <a
            href="/en"
            style={{
              display: 'inline-block',
              padding: '12px 24px',
              backgroundColor: '#c97a5a',
              color: '#f5f4ed',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 500,
            }}
          >
            Try Again
          </a>
        </div>
      </body>
    </html>
  );
}