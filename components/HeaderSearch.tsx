'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, ArrowRight } from 'lucide-react';

interface HeaderSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

const searchableItems = [
  { title: 'Software Engineering (B.Tech / HND)', category: 'Degree Track', link: '/degree-programs' },
  { title: 'Cybersecurity & Cloud Defense (B.Sc)', category: 'Degree Track', link: '/degree-programs' },
  { title: 'DevOps & Cloud Engineering Specialist', category: 'Certification', link: '/degree-programs' },
  { title: 'Data Science & Machine Learning', category: 'Certification', link: '/degree-programs' },
  { title: 'Computer Engineering (ND)', category: 'National Diploma', link: '/degree-programs' },
  { title: 'Web & Graphics Design (HND)', category: 'Degree Track', link: '/degree-programs' },
  { title: 'Admissions Application Form', category: 'Admissions', link: '/admissions#apply' },
  { title: 'Tuition Fee & Installments Calculator', category: 'Admissions', link: '/admissions#calculator' },
  { title: 'Student Portal & Status Check', category: 'Portal', link: '/admissions#portal' },
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
    <div 
      style={{
        position: 'fixed',
        top: '80px',
        left: 0,
        width: '100%',
        background: 'rgba(8, 31, 62, 0.98)',
        borderBottom: '1px solid rgba(245, 166, 35, 0.25)',
        padding: '24px 0',
        zIndex: 998,
        boxShadow: '0 15px 40px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)'
      }}
    >
      <div className="container" style={{ maxWidth: '800px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            <Search 
              size={20} 
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#F5A623' }} 
            />
            <input
              type="search"
              placeholder="Search degrees, courses, tuition fees, or requirements..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(245, 166, 35, 0.3)',
                color: '#F8FAFC',
                padding: '14px 18px 14px 48px',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#F8FAFC',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {query.trim() !== '' && (
          <div style={{ marginTop: '16px', maxHeight: '300px', overflowY: 'auto' }}>
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
                      background: 'rgba(255, 255, 255, 0.04)',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      color: '#F8FAFC'
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
              <p style={{ color: '#94A3B8', textAlign: 'center', padding: '20px 0', fontSize: '0.9rem' }}>
                No matches found for &quot;{query}&quot;. Try searching &quot;Software&quot;, &quot;Fees&quot;, or &quot;Admissions&quot;.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
