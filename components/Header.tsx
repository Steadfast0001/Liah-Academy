'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Search, Menu, X, ChevronDown, Phone, ShieldCheck, UserCheck, DollarSign } from 'lucide-react';
import HeaderSearch from './HeaderSearch';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [programsDropdownOpen, setProgramsDropdownOpen] = useState(false);
  const [admissionsDropdownOpen, setAdmissionsDropdownOpen] = useState(false);
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
    setProgramsDropdownOpen(false);
    setAdmissionsDropdownOpen(false);
  };

  // Do not render public site header inside the Admin portal
  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      {/* Top Utility Bar */}
      <div className="top-utility-bar">
        <div className="container top-utility-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#F5A623', fontWeight: 700, letterSpacing: '0.04em' }}>
              ✦ ADMISSIONS OPEN: FALL 2026 / SPRING 2027
            </span>
            <span style={{ color: '#64748B' }}>|</span>
            <span style={{ color: '#94A3B8' }}>Bakweri Town Campus, Buea</span>
          </div>
          <div className="top-utility-links">
            <Link href="/portal" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <UserCheck size={13} color="#F5A623" /> Student Portal
            </Link>
            <Link href="/refer" style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#F5A623', fontWeight: 700 }}>
              <DollarSign size={13} color="#F5A623" /> Refer &amp; Earn
            </Link>
            <Link href="/contact#inquiry">Request Info</Link>
            <a href="tel:+237699526607" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={13} color="#10B981" /> +237 699 526 607
            </a>
          </div>
        </div>
      </div>

      <header className="site-header">
        <div className="header-container">
          {/* Logo */}
          <Link href="/" className="logo-link" onClick={closeAll}>
            <div className="site-logo-wrap" style={{ position: 'relative', width: '64px', height: '64px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Image
                src="/assets/images/logo.png"
                alt="Liah Academy Logo"
                width={64}
                height={64}
                style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '64px', maxWidth: '64px' }}
                priority
              />
            </div>
            <span className="logo-text" style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
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

              {/* Programs dropdown */}
              <li 
                className={`menu-item has-dropdown ${isActive('/programs') ? 'active' : ''} ${programsDropdownOpen ? 'dropdown-open' : ''}`}
                onMouseEnter={() => setProgramsDropdownOpen(true)}
                onMouseLeave={() => setProgramsDropdownOpen(false)}
              >
                <div 
                  className="menu-link" 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setProgramsDropdownOpen(!programsDropdownOpen)}
                  role="button"
                  tabIndex={0}
                >
                  Programs <ChevronDown size={14} style={{ transform: programsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link href="/programs/hnd" onClick={closeAll}>
                      HND Programs
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/programs/certifications" onClick={closeAll}>
                      Certification Programs
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/programs/nd" onClick={closeAll}>
                      ND Programs
                    </Link>
                  </li>
                </ul>
              </li>

              {/* Admissions & Portal dropdown */}
              <li 
                className={`menu-item has-dropdown ${isActive('/admissions') ? 'active' : ''} ${admissionsDropdownOpen ? 'dropdown-open' : ''}`}
                onMouseEnter={() => setAdmissionsDropdownOpen(true)}
                onMouseLeave={() => setAdmissionsDropdownOpen(false)}
              >
                <div 
                  className="menu-link" 
                  style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  onClick={() => setAdmissionsDropdownOpen(!admissionsDropdownOpen)}
                  role="button"
                  tabIndex={0}
                >
                  Admissions &amp; Portal <ChevronDown size={14} style={{ transform: admissionsDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
                </div>
                <ul className="dropdown-menu">
                  <li className="dropdown-item">
                    <Link href="/admissions#requirements" onClick={closeAll}>
                      Admission Requirement
                    </Link>
                  </li>
                  <li className="dropdown-item">
                    <Link href="/portal" onClick={closeAll}>
                      Student Portal
                    </Link>
                  </li>
                </ul>
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

              <li className={`menu-item ${isActive('/refer') ? 'active' : ''}`}>
                <Link 
                  href="/refer" 
                  className="menu-link" 
                  onClick={closeAll}
                  style={{ 
                    color: '#F5A623', 
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>Refer &amp; Earn</span>
                  <span style={{ 
                    fontSize: '0.68rem', 
                    background: '#10B981', 
                    color: '#FFFFFF', 
                    padding: '1px 6px', 
                    borderRadius: '10px', 
                    fontWeight: 800,
                    letterSpacing: '0.02em'
                  }}>
                    5K XAF
                  </span>
                </Link>
              </li>
            </ul>

            {/* Mobile Drawer Bottom Quick Contacts */}
            <div style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }} className="mobile-drawer-bottom">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href="/refer"
                  onClick={closeAll}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: 'rgba(245, 166, 35, 0.15)',
                    border: '1px solid rgba(245, 166, 35, 0.3)',
                    borderRadius: '8px',
                    color: '#F5A623',
                    fontSize: '0.85rem',
                    fontWeight: 800,
                    textDecoration: 'none'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <DollarSign size={16} color="#F5A623" /> Refer &amp; Earn
                  </span>
                  <span style={{ fontSize: '0.72rem', background: '#10B981', color: '#fff', padding: '2px 6px', borderRadius: '4px' }}>
                    5,000 XAF
                  </span>
                </Link>
                <Link
                  href="/portal"
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
                  href="https://wa.me/237699526607?text=Hello%20Liah%20Academy%20Admissions"
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
