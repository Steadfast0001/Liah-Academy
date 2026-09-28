'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { PROGRAM_CATEGORIES, getProgramBySlug } from '@/lib/programsData';
import { 
  Check, ArrowRight, ChevronDown, ChevronUp, 
  Clock, MapPin, Award, BookOpen, ShieldCheck, 
  HelpCircle, ChevronRight, CheckCircle2, User, 
  DollarSign, Briefcase, GraduationCap, Sparkles, Monitor
} from 'lucide-react';

export default function ProgramDetailPage() {
  const params = useParams();
  const categorySlug = params?.category as string;
  const programSlug = params?.slug as string;

  const { category, program } = getProgramBySlug(categorySlug, programSlug);

  const [activeCurriculumTab, setActiveCurriculumTab] = useState(0);
  const [openAccordion, setOpenAccordion] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const heroQuote = program.heroQuote || {
    text: "The practical coding labs and real-world projects at Liah Academy gave me the exact skills and confidence to excel in the tech industry.",
    author: "Liah Academy Graduate",
    title: "Technology Practitioner"
  };
  const careerOutcomes = program.careerOutcomes || [];
  const admissionRequirements = program.admissionRequirements || { toApply: [], conditional: [] };
  const curriculum = program.curriculum || [];
  const skillsAndSupport = program.skillsAndSupport || [];
  const faqs = program.faqs || [];

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh', scrollBehavior: 'smooth' }}>

      {/* ===================================================
          1. SPLIT HERO SECTION (Image 1 style)
          =================================================== */}
      <section 
        style={{
          background: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ padding: '40px 24px 60px' }}>
          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
              gap: '48px',
              alignItems: 'center'
            }}
            className="program-hero-grid"
          >
            {/* Left Column: Title & Action CTAs */}
            <div>
              <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', color: '#081F3E', fontWeight: 800, lineHeight: 1.18, letterSpacing: '-0.02em', marginBottom: '20px' }}>
                {program.title}
              </h1>

              <p style={{ fontSize: '1.1rem', lineHeight: 1.65, color: '#475569', marginBottom: '32px' }}>
                {program.summary}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <Link
                  href="/contact#inquiry"
                  style={{
                    background: '#F5A623',
                    color: '#081F3E',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '14px 28px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 14px rgba(245, 166, 35, 0.3)'
                  }}
                >
                  Request Info <ChevronRight size={16} />
                </Link>

                <Link
                  href="/admissions#apply"
                  style={{
                    background: '#FFFFFF',
                    color: '#081F3E',
                    border: '2px solid #081F3E',
                    fontWeight: 800,
                    fontSize: '0.92rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    padding: '14px 28px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Apply Now <ArrowRight size={16} />
                </Link>
              </div>
            </div>

            {/* Right Column: Student Portrait with Quote Overlay (Image 1) */}
            <div style={{ position: 'relative' }}>
              <div 
                style={{
                  position: 'relative',
                  height: '420px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(8, 31, 62, 0.16)',
                  background: '#041021'
                }}
              >
                <Image
                  src={program.heroImage || '/assets/images/campus_students_liah_shirts.jpg'}
                  alt={program.title}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div 
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(4, 16, 33, 0.75) 0%, rgba(4, 16, 33, 0.2) 40%, rgba(4, 16, 33, 0.85) 100%)'
                  }}
                />

                {/* Quote Text Directly on Image */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '24px',
                    left: '24px',
                    right: '24px',
                    color: '#FFFFFF',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.7)'
                  }}
                >
                  <span style={{ fontSize: '2rem', color: '#F5A623', lineHeight: 1, display: 'block', marginBottom: '4px', fontWeight: 900 }}>&ldquo;</span>
                  <p style={{ fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.55, color: '#FFFFFF', marginBottom: '10px', fontWeight: 500 }}>
                    {heroQuote.text}
                  </p>
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'block' }}>
                      {heroQuote.author}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: '#E2E8F0', display: 'block', marginTop: '2px' }}>
                      {heroQuote.title}
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================
          2. STICKY SUB-NAVIGATION BAR (Image 1)
          =================================================== */}
      <nav 
        style={{
          background: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          position: 'sticky',
          top: 0,
          zIndex: 90
        }}
      >
        <div className="container" style={{ display: 'flex', gap: '28px', overflowX: 'auto', padding: '14px 24px' }}>
          <a href="#overview" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Overview
          </a>
          <a href="#metrics" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Quick Facts
          </a>
          <a href="#outcomes" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Career Outcomes
          </a>
          <a href="#requirements" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Admission Requirements
          </a>
          <a href="#courses" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Course Descriptions
          </a>
          <a href="#faq" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            FAQ
          </a>
        </div>
      </nav>

      {/* ===================================================
          3. OVERVIEW & 4 QUICK METRIC CARDS (Image 1)
          =================================================== */}
      <section id="overview" style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ maxWidth: '900px', marginBottom: '48px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', color: '#081F3E', fontWeight: 700, marginBottom: '18px' }}>
              {program.overviewTitle}
            </h2>
            <p style={{ fontSize: '1.05rem', lineHeight: 1.75, color: '#475569' }}>
              {program.overviewText}
            </p>
          </div>

          {/* 4 Metric Quick Info Cards (Accurate Fee & On-Campus Facts) */}
          <div 
            id="metrics"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px'
            }}
            className="program-metrics-grid"
          >
            {/* 1. Duration */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '24px 20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                DURATION
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#081F3E', margin: '8px 0' }}>
                {program.duration}
              </div>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                Full-Time &amp; Evening Tracks
              </span>
            </div>

            {/* 2. Tuition Fee */}
            <div style={{ background: '#F8FAFC', border: '1.5px solid #10B981', borderRadius: '10px', padding: '24px 20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                PROGRAM TUITION
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#081F3E', margin: '8px 0' }}>
                {program.tuition}
              </div>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                {program.tuitionInstallments}
              </span>
            </div>

            {/* 3. Application Fee */}
            <div style={{ background: '#F8FAFC', border: '1.5px solid #F5A623', borderRadius: '10px', padding: '24px 20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                APPLICATION FEE
              </span>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#081F3E', margin: '8px 0' }}>
                {program.applicationFee || (program.categorySlug === 'certifications' ? '25,000 FRS' : '15,000 FRS')}
              </div>
              <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                One-Time Non-Refundable
              </span>
            </div>

            {/* 4. Campus Location & Format */}
            <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '24px 20px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                CAMPUS &amp; FORMAT
              </span>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#081F3E', margin: '8px 0' }}>
                Bakweri Town
              </div>
              <span style={{ fontSize: '0.82rem', color: '#10B981', fontWeight: 700 }}>
                100% On-Campus • Buea
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. CAREER OUTCOMES SECTION (Image 2 style)
          =================================================== */}
      <section id="outcomes" style={{ padding: '70px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#081F3E', fontWeight: 700 }}>
              Career Outcomes
            </h2>
            <Link
              href="/admissions#apply"
              style={{
                background: '#081F3E',
                color: '#F5A623',
                padding: '10px 20px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase',
                letterSpacing: '0.04em'
              }}
            >
              Start Your Application
            </Link>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '24px'
            }}
          >
            {careerOutcomes.map((career, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '12px',
                  padding: '28px 24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 12px rgba(8, 31, 62, 0.04)'
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#081F3E', marginBottom: '10px' }}>
                    {career.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.55, color: '#64748B', marginBottom: '18px' }}>
                    {career.description}
                  </p>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '8px' }}>
                      KEY RESPONSIBILITIES
                    </span>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(career.responsibilities || []).map((resp, rIdx) => (
                        <li key={rIdx} style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                          <span style={{ color: '#F5A623', fontWeight: 800 }}>&bull;</span>
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ paddingTop: '16px', borderTop: '1px solid #F1F5F9' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', display: 'block' }}>
                    ESTIMATED INDUSTRY SALARY
                  </span>
                  <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#10B981' }}>
                    {career.averageSalary}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          6. ADMISSION REQUIREMENTS (Image 2 style - Green Box)
          =================================================== */}
      <section id="requirements" style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div 
            style={{
              background: '#FFFFFF',
              border: '2px solid #10B981',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.08)'
            }}
          >
            {/* Green Header */}
            <div style={{ background: '#10B981', padding: '16px 24px', textAlign: 'center', color: '#FFFFFF' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                Admission Requirements
              </h2>
            </div>

            {/* Inner Content 2 Columns */}
            <div 
              style={{
                padding: '36px 32px',
                display: 'grid',
                gridTemplateColumns: '1.2fr 1fr',
                gap: '36px'
              }}
              className="requirements-grid"
            >
              <div>
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  TO APPLY, YOU WILL NEED:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(admissionRequirements.toApply || []).map((item, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.92rem', color: '#475569' }}>
                      <CheckCircle2 size={18} color="#10B981" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ borderLeft: '1px solid #E2E8F0', paddingLeft: '32px' }} className="requirements-col-right">
                <h3 style={{ fontSize: '0.88rem', fontWeight: 800, color: '#081F3E', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
                  CONDITIONAL ADMISSION &amp; PATHWAYS:
                </h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {(admissionRequirements.conditional || []).map((cond, cIdx) => (
                    <li key={cIdx} style={{ fontSize: '0.92rem', lineHeight: 1.6, color: '#475569' }}>
                      &bull; {cond}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Button */}
            <div style={{ background: '#F8FAFC', padding: '18px 24px', textAlign: 'center', borderTop: '1px solid #E2E8F0' }}>
              <Link
                href="/admissions#apply"
                style={{
                  background: '#081F3E',
                  color: '#F5A623',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                View Full Admission Requirements <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. COURSE DESCRIPTIONS (Image 3 style)
          =================================================== */}
      <section id="courses" style={{ padding: '60px 0', background: '#F8FAFC' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: '#081F3E', fontWeight: 700 }}>
                Course Descriptions
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.95rem' }}>
                Curriculum syllabus designed with international technology standards and MINESUP accreditation.
              </p>
            </div>
            <Link
              href="/admissions#apply"
              style={{
                background: '#081F3E',
                color: '#F5A623',
                padding: '8px 18px',
                borderRadius: '4px',
                fontWeight: 800,
                fontSize: '0.82rem',
                textTransform: 'uppercase'
              }}
            >
              Start Your Application
            </Link>
          </div>

          {/* Level Tabs */}
          {curriculum.length > 0 && (
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {curriculum.map((level, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCurriculumTab(idx);
                    setOpenAccordion(0);
                  }}
                  style={{
                    background: activeCurriculumTab === idx ? '#081F3E' : '#FFFFFF',
                    color: activeCurriculumTab === idx ? '#F5A623' : '#081F3E',
                    border: '1.5px solid #081F3E',
                    borderRadius: '6px',
                    padding: '10px 20px',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {level.levelName}
                </button>
              ))}
            </div>
          )}

          {/* Course Module Accordions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {(curriculum[activeCurriculumTab]?.modules || []).map((mod, mIdx) => (
              <div
                key={mIdx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)'
                }}
              >
                <div
                  onClick={() => setOpenAccordion(openAccordion === mIdx ? null : mIdx)}
                  style={{
                    padding: '18px 24px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    background: openAccordion === mIdx ? '#F0F7FF' : '#FFFFFF',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, background: '#081F3E', color: '#F5A623', padding: '4px 10px', borderRadius: '4px' }}>
                      {mod.code}
                    </span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#081F3E' }}>
                      {mod.title}
                    </span>
                  </div>
                  {openAccordion === mIdx ? <ChevronUp size={20} color="#F5A623" /> : <ChevronDown size={20} color="#64748B" />}
                </div>

                {openAccordion === mIdx && (
                  <div style={{ padding: '20px 24px', borderTop: '1px solid #E2E8F0' }}>
                    <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#475569', marginBottom: '16px' }}>
                      {mod.description}
                    </p>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {(mod.topics || []).map((t, tIdx) => (
                        <span key={tIdx} style={{ fontSize: '0.78rem', background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '14px', fontWeight: 700 }}>
                          &check; {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          8. SKILLS AND SUPPORT FOR YOUR SUCCESS (Image 3 - 2 Cards)
          =================================================== */}
      <section style={{ padding: '60px 0', background: '#FFFFFF' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.4rem)', color: '#081F3E', fontWeight: 700 }}>
              Skills and Support for Your Success
            </h2>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '28px'
            }}
            className="support-cards-grid"
          >
            {skillsAndSupport.map((card, idx) => (
              <div
                key={idx}
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #10B981',
                  borderRadius: '12px',
                  padding: '36px 28px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.05)'
                }}
              >
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', marginBottom: '14px' }}>
                  {card.title}
                </h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.65, color: '#475569', marginBottom: '18px' }}>
                  {card.description}
                </p>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {(card.bullets || []).map((b, bIdx) => (
                    <li key={bIdx} style={{ fontSize: '0.88rem', color: '#475569', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                      <span style={{ color: '#10B981', fontWeight: 800 }}>&bull;</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          9. FREQUENTLY ASKED QUESTIONS & CTA
          =================================================== */}
      <section id="faq" style={{ padding: '60px 0 80px', background: '#F8FAFC' }}>
        <div className="container" style={{ maxWidth: '840px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#081F3E', fontWeight: 700 }}>
              Frequently Asked Questions
            </h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '48px' }}>
            {faqs.map((faq, fIdx) => (
              <div
                key={fIdx}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  overflow: 'hidden'
                }}
              >
                <div
                  onClick={() => setOpenFaq(openFaq === fIdx ? null : fIdx)}
                  style={{
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    fontWeight: 700,
                    color: '#081F3E'
                  }}
                >
                  <span>{faq.question}</span>
                  {openFaq === fIdx ? <ChevronUp size={18} color="#F5A623" /> : <ChevronDown size={18} color="#64748B" />}
                </div>
                {openFaq === fIdx && (
                  <div style={{ padding: '0 20px 18px', color: '#475569', fontSize: '0.92rem', lineHeight: 1.6 }}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Final Bottom Box */}
          <div 
            style={{
              background: '#081F3E',
              borderRadius: '16px',
              padding: '40px 32px',
              textAlign: 'center',
              color: '#FFFFFF'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '12px', color: '#FFFFFF' }}>
              Take the Next Step in Your Tech Career
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.95rem', marginBottom: '24px', maxWidth: '580px', margin: '0 auto 24px' }}>
              Admissions are actively open. Secure your seat in our Bakweri Town campus computer labs in Buea.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <Link
                href="/admissions#apply"
                style={{
                  background: '#F5A623',
                  color: '#081F3E',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.04em'
                }}
              >
                Apply Now
              </Link>
              <Link
                href="/contact#inquiry"
                style={{
                  background: 'transparent',
                  color: '#FFFFFF',
                  border: '1.5px solid #FFFFFF',
                  padding: '12px 28px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  textTransform: 'uppercase'
                }}
              >
                Request Information
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
