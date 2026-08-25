import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChatWidget from '@/components/ChatWidget';

export const metadata: Metadata = {
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
