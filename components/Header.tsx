'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Mail } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="logo-link" onClick={() => setMobileMenuOpen(false)}>
            <div style={{ position: 'relative', width: '50px', height: '50px', flexShrink: 0 }}>
              <Image
                src="/assets/images/logo.png"
                alt="Liah Academy Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span className="logo-text" style={{ fontSize: '1.5rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Liah <span style={{ color: '#F5A623', marginLeft: '6px' }}>Academy</span>
            </span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            className="menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>

          {/* Navigation Links */}
          <nav className={`nav-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
            <ul className="nav-menu">
              <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                <Link href="/" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </Link>
              </li>

              <li className={`menu-item ${isActive('/degree-programs') ? 'active' : ''}`}>
                <Link href="/degree-programs" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                  Degree & Program
                </Link>
              </li>

              <li className={`menu-item ${isActive('/admissions') ? 'active' : ''}`}>
                <Link href="/admissions" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                  Admission
                </Link>
              </li>

              <li className={`menu-item ${isActive('/student-experience') ? 'active' : ''}`}>
                <Link href="/student-experience" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                  Student Experience
                </Link>
              </li>

              {/* About dropdown */}
              <li 
                className={`menu-item has-dropdown ${isActive('/about') ? 'active' : ''} ${aboutDropdownOpen ? 'dropdown-open' : ''}`}
                onMouseEnter={() => setAboutDropdownOpen(true)}
                onMouseLeave={() => setAboutDropdownOpen(false)}
              >
                <div 
                  className="menu-link" 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                >
                  About <ChevronDown size={14} />
                </div>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link href="/about#top-admin" onClick={() => setMobileMenuOpen(false)}>
                      Top Admin
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/about#partnerships" onClick={() => setMobileMenuOpen(false)}>
                      Business & Partnerships
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/about#highlights" onClick={() => setMobileMenuOpen(false)}>
                      News & Highlights
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={`menu-item ${isActive('/contact') ? 'active' : ''}`}>
                <Link href="/contact" className="menu-link" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </Link>
              </li>

              {/* Search Icon Trigger */}
              <li className="menu-item">
                <button
                  className="menu-link"
                  onClick={() => setSearchOpen(!searchOpen)}
                  aria-label="Toggle Search"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 12px'
                  }}
                >
                  <Search size={18} />
                </button>
              </li>

              {/* Primary CTA */}
              <li className="menu-item">
                <Link 
                  href="/admissions#apply" 
                  className="menu-link nav-cta" 
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Apply Now
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Header Search Modal */}
      <HeaderSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
