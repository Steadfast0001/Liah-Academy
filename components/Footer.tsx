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
            <Link href="/" className="logo-link york-footer-logo-link">
              <div className="site-logo-wrap york-footer-logo-wrap">
                <Image
                  src="/assets/images/logo.png"
                  alt="Liah Academy Logo"
                  width={56}
                  height={56}
                  className="york-footer-logo-img"
                />
              </div>
              <span className="logo-text york-footer-logo-text">
                Liah <span style={{ color: '#F5A623', marginLeft: '4px' }}>Academy</span>
              </span>
            </Link>
            <p className="york-footer-brand-desc">
              Cameroon&apos;s premier practical tech academy in Silicon Mountain, Buea. Delivering career-focused diplomas &amp; software labs.
            </p>
            <div className="york-footer-brand-socials">
              <SocialLinksList iconSize={16} />
            </div>
          </div>

          {/* Academic Programs */}
          <div className="york-footer-col">
            <h3 className="york-footer-heading">Programs</h3>
            <ul className="york-footer-list">
              <li><Link href="/programs/certifications">Certifications</Link></li>
              <li><Link href="/programs/hnd">HND Programs</Link></li>
              <li><Link href="/programs/nd">ND Programs</Link></li>
            </ul>
          </div>

          {/* Admissions */}
          <div className="york-footer-col">
            <h3 className="york-footer-heading">Admissions</h3>
            <ul className="york-footer-list">
              <li><Link href="/portal?tab=enrol">Apply Now</Link></li>
              <li><Link href="/portal">Student Portal</Link></li>
              <li><Link href="/admissions">Fees</Link></li>
              <li><Link href="/admissions#requirements">Requirements</Link></li>
              <li><Link href="/portal?tab=login">Status</Link></li>
            </ul>
          </div>

          {/* About Us */}
          <div className="york-footer-col">
            <h3 className="york-footer-heading">About Us</h3>
            <ul className="york-footer-list">
              <li><Link href="/about">Who We Are</Link></li>
              <li><Link href="/about#top-admin">Faculty</Link></li>
              <li><Link href="/about#partnerships">Partnerships</Link></li>
              <li><Link href="/student-experience">Facilities</Link></li>
              <li><Link href="/about#highlights">News</Link></li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="york-footer-col">
            <h3 className="york-footer-heading">Quick Links</h3>
            <ul className="york-footer-list">
              <li><Link href="/student-experience">Experience</Link></li>
              <li><Link href="/contact#inquiry">Inquiries</Link></li>
              <li><Link href="/admissions#scholarships">Scholarships</Link></li>
              <li><Link href="/contact">Directions</Link></li>
              <li><Link href="/contact#faq">FAQs</Link></li>
            </ul>
          </div>

          {/* Campus Contact */}
          <div className="york-footer-col york-footer-contact-col">
            <h3 className="york-footer-heading">Contact Us</h3>
            <ul className="york-footer-list york-footer-contact-list">
              <li className="york-footer-contact-item">
                <MapPin size={14} color="#F5A623" className="york-footer-contact-icon" />
                <span>Buea, Cameroon</span>
              </li>
              <li className="york-footer-contact-item">
                <Phone size={14} color="#10B981" className="york-footer-contact-icon" />
                <span>+237 652 154 095</span>
              </li>
              <li className="york-footer-contact-item">
                <Phone size={14} color="#10B981" className="york-footer-contact-icon" />
                <span>+237 699 526 607</span>
              </li>
              <li className="york-footer-contact-item">
                <Mail size={14} color="#F5A623" className="york-footer-contact-icon" />
                <span>info@liahacademy.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Sub-Footer Bar */}
        <div className="york-footer-bottom-bar" style={{ justifyContent: 'center', textAlign: 'center' }}>
          <div suppressHydrationWarning>
            &copy; {currentYear} Liah Academy - Institute of Higher Technology &amp; Innovation. All Rights Reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
