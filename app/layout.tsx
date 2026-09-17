import type { Metadata, Viewport } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';
import WhatsAppButton from '@/components/WhatsAppButton';
import BackToTop from '@/components/BackToTop';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: '#081F3E',
  colorScheme: 'light dark'
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://liahacademy.org'),
  title: 'Liah Academy | Forge Your Future in Technology',
  description: "Liah Academy in Buea, Cameroon is a premier practical tech academy and software engineering company offering HND, National Diploma (ND), and professional certifications in Software Engineering, DevOps, Data Science, and Cybersecurity.",
  keywords: ['Liah Academy', 'Buea tech academy', 'software engineering Cameroon', 'HND software engineering Buea', 'DevOps training Buea', 'cybersecurity training Cameroon', 'IT certifications Buea', 'Bakweri Town Buea'],
  openGraph: {
    title: 'Liah Academy | Forge Your Future in Technology',
    description: "Buea's premier tech academy & software development company. Study practical HND, ND, and Certification tracks in Software Engineering, DevOps, and Cybersecurity.",
    images: ['/assets/images/logo.png'],
    type: 'website',
  },
  icons: {
    icon: '/assets/images/logo.png',
    apple: '/assets/images/logo.png',
  }
};

import ErrorBoundary from '@/components/ErrorBoundary';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary fallback={<div style={{ height: '70px', background: '#081F3E' }} />}>
          <Header />
        </ErrorBoundary>

        <ErrorBoundary>
          {children}
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <Footer />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <WhatsAppButton />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <ChatWidget />
        </ErrorBoundary>

        <ErrorBoundary fallback={null}>
          <BackToTop />
        </ErrorBoundary>
      </body>
    </html>
  );
}
