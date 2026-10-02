'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchableItems = [
  { title: 'HND in Software Engineering', category: 'HND Program', link: '/programs/hnd/software-engineering' },
  { title: 'HND in Web & Graphic Design', category: 'HND Program', link: '/programs/hnd/web-graphic-design' },
  { title: 'HND in Digital Marketing & E-Commerce', category: 'HND Program', link: '/programs/hnd/digital-marketing' },
  { title: 'HND in Network & Maintenance', category: 'HND Program', link: '/programs/hnd/network-maintenance' },
  { title: 'Data Science & Machine Learning', category: 'Certification', link: '/programs/certifications/data-science' },
  { title: 'DevOps & Cloud Infrastructure', category: 'Certification', link: '/programs/certifications/devops' },
  { title: 'Industrial Web Design', category: 'Certification', link: '/programs/certifications/industrial-web-design' },
  { title: 'Digital Marketing & SEO', category: 'Certification', link: '/programs/certifications/digital-marketing-seo' },
  { title: 'ND in Computer Engineering', category: 'National Diploma', link: '/programs/nd/computer-engineering' },
  { title: 'ND in Information & Communication Tech', category: 'National Diploma', link: '/programs/nd/ict' },
  { title: 'ND in Web Design', category: 'National Diploma', link: '/programs/nd/web-design' },
  { title: 'ND in Graphic Design & Printing', category: 'National Diploma', link: '/programs/nd/graphic-design-printing' },
  { title: 'ND in Basic Computer Operations', category: 'National Diploma', link: '/programs/nd/basic-computer' },
  { title: 'ND in Office Automation Secretaryship', category: 'National Diploma', link: '/programs/nd/office-automation' },
  { title: 'ND in Computerized Accounting', category: 'National Diploma', link: '/programs/nd/computerized-accounting' },
  { title: 'Admissions Application Form', category: 'Admissions', link: '/portal?tab=enrol' },
  { title: 'Admissions & Application Fee Schedule', category: 'Admissions', link: '/admissions' },
  { title: 'Student Portal & Status Check', category: 'Portal', link: '/portal?tab=login' },
  { title: 'Top Administration & Leadership', category: 'About', link: '/about#top-admin' },
  { title: 'Corporate Software Partnerships', category: 'About', link: '/about#partnerships' },
  { title: 'Campus Wi-Fi & 24/7 Security', category: 'Student Life', link: '/student-experience' },
  { title: 'Buea Campus Location & Map', category: 'Contact', link: '/contact' }
];

export default function HeaderSearch({ isOpen, onClose }: HeaderSearchProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const filtered = query.trim() === '' 
    ? [] 
    : searchableItems.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.category.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <>
      {/* Invisible backdrop overlay to dismiss on outside click */}
      <div 
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0, 0, 0, 0.25)',
          zIndex: 997
        }}
      />

      {/* Transparent Floating Search Capsule */}
      <div 
        style={{
          position: 'fixed',
          top: '90px',
          left: 0,
          width: '100%',
          background: 'transparent',
          padding: '0 20px',
          zIndex: 998,
          display: 'flex',
          justifyContent: 'center',
          pointerEvents: 'none'
        }}
      >
        <div 
          style={{ 
            maxWidth: '780px', 
            width: '100%', 
            background: 'rgba(8, 31, 62, 0.92)', 
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(245, 166, 35, 0.45)', 
            borderRadius: '16px', 
            padding: '14px 18px', 
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.08)',
            pointerEvents: 'auto'
          }}
        >
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ position: 'relative', flexGrow: 1 }}>
              <Search 
                size={20} 
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#F5A623' }} 
              />
              <input
                id="global_header_search_input"
                name="global_header_search_input"
                aria-label="Search degrees, courses, tuition fees, or requirements"
                type="search"
                placeholder="Search degrees, courses, tuition fees, or requirements..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                autoFocus
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid rgba(245, 166, 35, 0.25)',
                  color: '#F8FAFC',
                  padding: '14px 18px 14px 48px',
                  borderRadius: '10px',
                  fontSize: '16px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
            <button
              onClick={onClose}
              aria-label="Close Search"
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#F8FAFC',
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease'
              }}
            >
              <X size={20} />
            </button>
          </div>

          {query.trim() !== '' && (
            <div style={{ marginTop: '16px', maxHeight: '320px', overflowY: 'auto' }}>
              {filtered.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {filtered.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.link}
                      onClick={onClose}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 16px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#F8FAFC',
                        textDecoration: 'none',
                        transition: 'background 0.2s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <BookOpen size={16} color="#F5A623" />
                        <span style={{ fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</span>
                        <span 
                          style={{ 
                            fontSize: '0.75rem', 
                            background: 'rgba(245, 166, 35, 0.15)', 
                            color: '#F5A623', 
                            padding: '2px 8px', 
                            borderRadius: '4px',
                            fontFamily: 'var(--font-mono)'
                          }}
                        >
                          {item.category}
                        </span>
                      </div>
                      <ArrowRight size={16} color="#94A3B8" />
                    </Link>
                  ))}
                </div>
              ) : (
                <p style={{ color: '#94A3B8', textAlign: 'center', padding: '20px 0', fontSize: '0.9rem', margin: 0 }}>
                  No matches found for &quot;{query}&quot;. Try searching &quot;Software&quot;, &quot;Fees&quot;, or &quot;Admissions&quot;.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
