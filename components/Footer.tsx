import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail } from 'lucide-react';
import SocialLinksList from './SocialIcons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Column */}
          <div>
            <Link href="/" className="logo-link" style={{ marginBottom: '20px' }}>
              <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
                <Image
                  src="/assets/images/logo.png"
                  alt="Liah Academy Logo"
                  fill
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span className="logo-text" style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Liah <span style={{ color: '#F5A623', marginLeft: '6px' }}>Academy</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', marginTop: '12px', color: '#CBD5E1' }}>
              Buea&apos;s premier practical tech academy and software engineering company, training industry-ready tech specialists and building corporate-level solutions.
            </p>
            <div style={{ marginTop: '20px' }}>
              <SocialLinksList iconSize={18} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="footer-col-title">Academy Links</h3>
            <ul className="footer-links">
              <li><Link href="/about">About Liah</Link></li>
              <li><Link href="/admissions">Admissions Portal</Link></li>
              <li><Link href="/degree-programs">Degrees &amp; Programs</Link></li>
              <li><Link href="/student-experience">Student Life</Link></li>
              <li><Link href="/contact#inquiry">Direct Inquiry</Link></li>
              <li><Link href="/contact">Campus Contact</Link></li>
            </ul>
          </div>

          {/* Academic Divisions */}
          <div>
            <h3 className="footer-col-title">Tech Tracks</h3>
            <ul className="footer-links">
              <li><Link href="/degree-programs">Software Engineering (B.Tech)</Link></li>
              <li><Link href="/degree-programs">Cybersecurity Tracks (B.Sc)</Link></li>
              <li><Link href="/degree-programs">DevOps & Cloud Pipelines</Link></li>
              <li><Link href="/degree-programs">Data Science & ML Labs</Link></li>
              <li><Link href="/about#partnerships">Corporate Innovations</Link></li>
            </ul>
          </div>

          {/* Campus Contact Information */}
          <div>
            <h3 className="footer-col-title">Campus Contact</h3>
            <ul className="footer-links" style={{ color: '#94A3B8', fontSize: '0.95rem' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <MapPin size={18} color="#F5A623" style={{ flexShrink: 0, marginTop: '4px' }} />
                <span>Backweri Town, Buea, Southwest Region, Cameroon</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={18} color="#F5A623" style={{ flexShrink: 0 }} />
                <span>+237 652 154 095 / 699 526 607</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={18} color="#F5A623" style={{ flexShrink: 0 }} />
                <span>info@liahacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ margin: 0 }}>&copy; {currentYear} Liah Academy. All Rights Reserved. Built for high-performance scale.</p>
          <Link href="/admin" style={{ color: '#F5A623', fontSize: '0.8rem', fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            🔒 Admin Console
          </Link>
        </div>
      </div>
    </footer>
  );
}
