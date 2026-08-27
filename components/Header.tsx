'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Phone, ShieldCheck, UserCheck } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Global Ctrl+K / Cmd+K Search Hotkey
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const closeAll = () => {
    setMobileMenuOpen(false);
    setAboutDropdownOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="logo-link" onClick={closeAll}>
            <div style={{ position: 'relative', width: '48px', height: '48px', flexShrink: 0 }}>
              <Image
                src="/assets/images/logo.png"
                alt="Liah Academy Logo"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <span className="logo-text" style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
              Liah <span style={{ color: '#F5A623', marginLeft: '4px' }}>Academy</span>
            </span>
          </Link>

          {/* Right Header Controls (Search + Mobile Toggle) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Quick Search Button (Visible on all viewports) */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search Academy Courses & Admissions"
              className="menu-toggle"
              style={{ display: 'flex', width: '38px', height: '38px' }}
              title="Search (Ctrl + K)"
            >
              <Search size={18} />
            </button>

            {/* Mobile Menu Toggle Button */}
            <button
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
              style={{ width: '38px', height: '38px' }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Mobile Backdrop Overlay */}
          <div 
            className={`mobile-nav-backdrop ${mobileMenuOpen ? 'open' : ''}`}
            onClick={closeAll}
            aria-hidden="true"
          />

          {/* Navigation Links & Drawer */}
          <nav className={`nav-wrapper ${mobileMenuOpen ? 'open' : ''}`}>
            {/* Mobile Drawer Header */}
            <div style={{ display: 'none', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', marginBottom: '16px' }} className="mobile-drawer-top">
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Navigation Menu
              </span>
              <button 
                onClick={closeAll}
                style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
                aria-label="Close Menu"
              >
                <X size={20} />
              </button>
            </div>

            <ul className="nav-menu">
              <li className={`menu-item ${isActive('/') ? 'active' : ''}`}>
                <Link href="/" className="menu-link" onClick={closeAll}>
                  Home
                </Link>
              </li>

              <li className={`menu-item ${isActive('/degree-programs') ? 'active' : ''}`}>
                <Link href="/degree-programs" className="menu-link" onClick={closeAll}>
                  Degree &amp; Programs
                </Link>
              </li>

              <li className={`menu-item ${isActive('/admissions') ? 'active' : ''}`}>
                <Link href="/admissions" className="menu-link" onClick={closeAll}>
                  Admissions &amp; Portal
                </Link>
              </li>

              <li className={`menu-item ${isActive('/student-experience') ? 'active' : ''}`}>
                <Link href="/student-experience" className="menu-link" onClick={closeAll}>
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
                  role="button"
                  tabIndex={0}
                >
                  About <ChevronDown size={14} style={{ transform: aboutDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link href="/about#top-admin" onClick={closeAll}>
                      Top Administration
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/about#partnerships" onClick={closeAll}>
                      Business &amp; Partnerships
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/about#highlights" onClick={closeAll}>
                      News &amp; Highlights
                    </Link>
                  </li>
                </ul>
              </li>

              <li className={`menu-item ${isActive('/contact') ? 'active' : ''}`}>
                <Link href="/contact" className="menu-link" onClick={closeAll}>
                  Contact
                </Link>
              </li>

              {/* Desktop Search Button */}
              <li className="menu-item desktop-search-item">
                <button
                  className="menu-link"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Search courses, tuition fees, degrees"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px'
                  }}
                  title="Search (Ctrl + K)"
                >
                  <Search size={16} color="#F5A623" />
                  <span className="kbd-shortcut">⌘K</span>
                </button>
              </li>

              {/* Primary Apply CTA */}
              <li className="menu-item">
                <Link 
                  href="/admissions#apply" 
                  className="menu-link nav-cta" 
                  onClick={closeAll}
                >
                  Apply Now
                </Link>
              </li>
            </ul>

            {/* Mobile Drawer Bottom Quick Contacts */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} className="mobile-drawer-bottom">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/admissions#portal"
                  onClick={closeAll}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <UserCheck size={16} color="#F5A623" /> Student Portal Login
                </Link>
                <a
                  href="https://wa.me/237652154095?text=Hello%20Liah%20Academy%20Admissions"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 14px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    color: '#10B981',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none'
                  }}
                >
                  <Phone size={16} /> WhatsApp Admissions
                </a>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* Header Search Modal */}
      <HeaderSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
