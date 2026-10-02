'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { PROGRAM_CATEGORIES, getCategoryBySlug } from '@/lib/programsData';
import { ArrowRight, ChevronRight, BookOpen, Layers, CheckCircle2, ChevronDown, Clock, Tag } from 'lucide-react';

export default function ProgramCategoryPage() {
  const params = useParams();
  const categorySlug = params?.category as string;

  const category = getCategoryBySlug(categorySlug);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* ===================================================
          1. CATEGORY HERO BANNER (Image 5 style)
          =================================================== */}
      <section 
        style={{
          position: 'relative',
          minHeight: '340px',
          background: '#041021',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '60px 20px'
        }}
      >
        <div style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
          <Image
            src={category.bannerImage}
            alt={category.name}
            fill
            style={{ objectFit: 'cover', opacity: 0.35 }}
            priority
          />
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(4, 16, 33, 0.85) 0%, rgba(4, 16, 33, 0.95) 100%)'
            }}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '840px' }}>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.4rem)', color: '#FFFFFF', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            {category.name}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 1.8vw, 1.2rem)', color: '#CBD5E1', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
            {category.tagline}
          </p>
          <div style={{ marginTop: '24px' }}>
            <ChevronDown size={28} color="#F5A623" style={{ animation: 'bounce 2s infinite' }} />
          </div>
        </div>
      </section>

      {/* ===================================================
          2. CATEGORY OVERVIEW & INTRO
          =================================================== */}
      <section style={{ padding: '50px 0 20px', background: '#FFFFFF', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '880px' }}>
          <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#475569' }}>
            {category.overviewText}
          </p>
          <div style={{ height: '3px', width: '60px', background: '#F5A623', margin: '30px auto 0', borderRadius: '2px' }} />
        </div>
      </section>

      {/* ===================================================
          3. PROGRAMS GRID (Image 5 - Cards)
          =================================================== */}
      <section style={{ padding: '40px 0 80px', background: '#FFFFFF' }}>
        <div className="container">
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
              gap: '28px'
            }}
          >
            {category.programs.map((program) => (
              <div
                key={program.slug}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '32px 28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)',
                  transition: 'all 0.25s ease',
                  position: 'relative'
                }}
                className="category-program-card"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {category.name.replace(' Programs', '')}
                    </span>
                    <span style={{ fontSize: '0.78rem', fontWeight: 800, background: 'rgba(16, 185, 129, 0.12)', color: '#10B981', padding: '3px 10px', borderRadius: '4px' }}>
                      {program.tuition}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#081F3E', lineHeight: 1.35, marginBottom: '12px' }}>
                    {program.title}
                  </h3>

                  <p style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#64748B', marginBottom: '20px' }}>
                    {program.summary}
                  </p>

                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center', fontSize: '0.82rem', color: '#64748B', marginBottom: '16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={14} color="#F5A623" /> {program.duration}
                    </span>
                    <span>&bull;</span>
                    <span style={{ color: '#10B981', fontWeight: 600 }}>
                      Bakweri Town Labs
                    </span>
                  </div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <Link
                    href={`/programs/${category.slug}/${program.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      color: '#081F3E',
                      fontWeight: 800,
                      fontSize: '0.92rem',
                      textDecoration: 'none'
                    }}
                    className="explore-program-link"
                  >
                    <span>Explore Program</span>
                    <ArrowRight size={16} color="#F5A623" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          4. FULL-WIDTH APPLICATION CTA
          =================================================== */}
      <section className="york-full-cta-banner">
        <div className="container">
          <h2 className="york-full-cta-title">
            Ready to Begin Your Tech Training at Liah Academy?
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/portal?tab=enrol" className="york-hero-btn" style={{ background: '#F5A623', color: '#081F3E' }}>
              Start Your Application <ArrowRight size={18} />
            </Link>
            <Link href="/contact#inquiry" className="york-full-cta-btn">
              Direct Inquiries
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
