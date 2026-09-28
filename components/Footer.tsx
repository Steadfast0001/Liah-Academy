'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { MapPin, Phone, Mail } from 'lucide-react';
import SocialLinksList from './SocialIcons';

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  // Do not render public footer inside the Admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="york-footer">
      <div className="container">
        <div className="york-footer-grid">
          {/* Brand Column */}
          <div className="york-footer-brand-col">
            <Link href="/" className="logo-link" style={{ marginBottom: '16px', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <div className="site-logo-wrap" style={{ position: 'relative', width: '56px', height: '56px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                  src="/assets/images/logo.png"
                  alt="Liah Academy Logo"
                  width={56}
                  height={56}
                  style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '56px', maxWidth: '56px' }}
                />
              </div>
              <span className="logo-text" style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Liah <span style={{ color: '#F5A623', marginLeft: '4px' }}>Academy</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.65', marginTop: '12px', color: '#CBD5E1' }}>
              Cameroon&apos;s premier practical tech academy and engineering institute in Silicon Mountain, Buea. Delivering career-focused diplomas, industry-certified tracks, and production software labs.
            </p>
            <div style={{ marginTop: '18px' }}>
              <SocialLinksList iconSize={16} />
            </div>
          </div>

          {/* Academic Programs */}
          <div>
            <h3 className="york-footer-heading">Programs</h3>
            <ul className="york-footer-list">
              <li><Link href="/programs/certifications">Certifications Programs</Link></li>
              <li><Link href="/programs/hnd">HND Programs</Link></li>
              <li><Link href="/programs/nd">ND Programs</Link></li>
            </ul>
          </div>

          {/* Admissions */}
          <div>
            <h3 className="york-footer-heading">Admissions</h3>
            <ul className="york-footer-list">
              <li><Link href="/admissions#apply">Apply Now</Link></li>
              <li><Link href="/portal">Student Portal</Link></li>
              <li><Link href="/admissions">Tuition &amp; Fees</Link></li>
              <li><Link href="/admissions#requirements">Entry Requirements</Link></li>
              <li><Link href="/admissions#status">Application Status</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="york-footer-heading">About Us</h3>
            <ul className="york-footer-list">
              <li><Link href="/about">Who We Are</Link></li>
              <li><Link href="/about#top-admin">Faculty &amp; Leadership</Link></li>
              <li><Link href="/about#partnerships">Industry Partnerships</Link></li>
              <li><Link href="/student-experience">Campus Facilities</Link></li>
              <li><Link href="/about#highlights">News &amp; Media</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="york-footer-heading">Quick Links</h3>
            <ul className="york-footer-list">
              <li><Link href="/student-experience">Student Experience</Link></li>
              <li><Link href="/contact#inquiry">Request Information</Link></li>
              <li><Link href="/admissions#scholarships">Scholarships</Link></li>
              <li><Link href="/contact">Campus Directions</Link></li>
              <li><Link href="/contact#faq">Help &amp; FAQs</Link></li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div>
            <h3 className="york-footer-heading">Contact Us</h3>
            <ul className="york-footer-list" style={{ fontSize: '0.86rem', color: '#CBD5E1' }}>
              <li style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <MapPin size={16} color="#F5A623" style={{ flexShrink: 0, marginTop: '3px' }} />
                <span>Backweri Town, Buea, Southwest Region, Cameroon</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#10B981" style={{ flexShrink: 0 }} />
                <span>+237 652 154 095</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={16} color="#10B981" style={{ flexShrink: 0 }} />
                <span>+237 699 526 607</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={16} color="#F5A623" style={{ flexShrink: 0 }} />
                <span>info@liahacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="york-footer-bottom-bar" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div>
            &copy; {currentYear} Liah Academy - Institute of Higher Technology &amp; Innovation. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
