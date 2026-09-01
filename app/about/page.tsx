'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Building, Lightbulb, Award, Handshake, 
  CheckCircle, ArrowRight, Calendar, Sparkles, Mail
} from 'lucide-react';
import { PARTNERSHIP_MAILTO_LINK } from '@/lib/constants';

const newsArticles = [
  {
    id: 1,
    title: 'Engineering & Technology Programs Catalog (HND & ND Tracks)',
    date: 'August 19, 2026',
    category: 'Engineering & Tech',
    image: '/assets/images/flyer_engineering.png',
    desc: 'Official prospectus for Software Engineering, Computer Hardware, Network Security, and Web Graphic Design.',
    link: '/degree-programs'
  },
  {
    id: 2,
    title: 'Advanced Cybersecurity & Cloud Defense HND Cohort Launched',
    date: 'August 19, 2026',
    category: 'Engineering & Tech',
    image: '/assets/images/flyer_engineering.png',
    desc: 'Specialized diploma training in Ethical Hacking, Linux Server Hardening, and Cloud Defense now accepting applicants.',
    link: '/degree-programs'
  },
  {
    id: 3,
    title: 'Liah Academy Certification Programs Admissions Now Open',
    date: 'August 19, 2026',
    category: 'Certifications',
    image: '/assets/images/flyer_certification.png',
    desc: 'Fast-track corporate bootcamps: Data Science, DevOps Cloud Pipelines, and Industrial Web Engineering.',
    link: '/degree-programs'
  }
];

export default function AboutPage() {
  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 50px)', marginBottom: '0' }}>
      
      {/* 1. TOP ADMINISTRATION SECTION */}
      <section id="top-admin" style={{ marginBottom: '90px', scrollMarginTop: '120px' }}>
        <div className="container">
          
          {/* Header */}
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#081F3E', marginBottom: '14px' }}>
              Top administration
            </h1>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Meet the executive team guiding Liah Academy&apos;s academic vision and cooperative initiatives.
            </p>
          </div>

          {/* Descriptive 2 Columns */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
              gap: '40px', 
              marginBottom: '60px' 
            }}
          >
            {/* University Executive Board */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Building size={22} color="#F5A623" />
                <h2 style={{ color: '#081F3E', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  University Executive Board
                </h2>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '14px' }}>
                The Executive Board oversees academic compliance, operational development, and admissions regulations at Liah Academy. Composed of senior academicians and technology specialists, the board ensures the academy adheres to national standards while deploying state-of-the-art tech programs.
              </p>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                Our mission is to establish Buea as a global hub of modern technical expertise, starting from our base in Bakweri Town.
              </p>
            </div>

            {/* Office of Cooperation & Innovation */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Lightbulb size={22} color="#F5A623" />
                <h2 style={{ color: '#081F3E', fontSize: '1.35rem', fontWeight: 800, margin: 0 }}>
                  Office of Cooperation &amp; Innovation
                </h2>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '14px' }}>
                This office bridges academic research and industrial software applications. It manages relationships with tech companies, creates research labs, and promotes entrepreneurship among students.
              </p>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.7', margin: 0 }}>
                It facilitates student incubator tracks, giving learners access to real-world corporate development cycles at Liah&apos;s software company branch.
              </p>
            </div>
          </div>

          {/* Executive Team 3-Card Grid */}
          <div className="grid-3" style={{ gap: '28px', alignItems: 'stretch' }}>
            {/* Card 1: Mr. NSAH ESLI */}
            <div 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '40px 30px', 
                textAlign: 'center',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: '#081F3E', 
                  color: '#F5A623', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.4rem', 
                  fontWeight: 900, 
                  marginBottom: '20px',
                  boxShadow: '0 4px 14px rgba(8,31,62,0.2)' 
                }}
              >
                NE
              </div>
              <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Mr. NSAH ESLI
              </h3>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                color: '#B45309', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '16px',
                display: 'block'
              }}>
                Owner &amp; Managing Director
              </span>
              <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.65', margin: 0 }}>
                Visionary leader, founder and managing director steering Liah Academy&apos;s mission in technical excellence, practical vocational education, and digital innovation in Cameroon.
              </p>
            </div>

            {/* Card 2: Brenda E. Lyonga */}
            <div 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '40px 30px', 
                textAlign: 'center',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: '#081F3E', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  marginBottom: '20px',
                  boxShadow: '0 4px 14px rgba(8,31,62,0.2)' 
                }}
              >
                BE
              </div>
              <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Brenda E. Lyonga
              </h3>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                color: '#B45309', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '16px',
                display: 'block'
              }}>
                Director of Innovation
              </span>
              <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.65', margin: 0 }}>
                Former DevOps advisor, managing technology incubators and corporate networks.
              </p>
            </div>

            {/* Card 3: Teke A. Mbah */}
            <div 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF', 
                borderRadius: '16px', 
                padding: '40px 30px', 
                textAlign: 'center',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <div 
                style={{ 
                  width: '80px', 
                  height: '80px', 
                  borderRadius: '50%', 
                  background: '#081F3E', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '1.4rem', 
                  fontWeight: 800, 
                  marginBottom: '20px',
                  boxShadow: '0 4px 14px rgba(8,31,62,0.2)' 
                }}
              >
                TA
              </div>
              <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, marginBottom: '6px' }}>
                Teke A. Mbah
              </h3>
              <span style={{ 
                fontFamily: 'var(--font-mono)', 
                color: '#B45309', 
                fontSize: '0.78rem', 
                fontWeight: 700, 
                textTransform: 'uppercase', 
                letterSpacing: '0.04em',
                marginBottom: '16px',
                display: 'block'
              }}>
                Dean of Academics
              </span>
              <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.65', margin: 0 }}>
                Supervises curriculum alignment across Web engineering, Data Science, and HNDs.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 2. BUSINESS & PARTNERSHIPS SECTION (DARK MIDNIGHT NAVY) */}
      <section 
        id="partnerships"
        style={{ 
          background: '#041021', 
          color: '#FFFFFF', 
          padding: '90px 0 100px 0',
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          scrollMarginTop: '120px'
        }}
      >
        <div className="container">
          
          {/* Header */}
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#B45309', 
              color: '#FEF3C7', 
              padding: '4px 12px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              COLLABORATION
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#FFFFFF', marginBottom: '14px' }}>
              Business &amp; partnerships
            </h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#94A3B8', fontSize: '1rem', lineHeight: '1.6' }}>
              Connecting academic training directly to industry demands, local business incubators, and global certifications.
            </p>
          </div>

          {/* 2 Column Cards in Dark Section */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', 
              gap: '40px', 
              marginBottom: '60px',
              alignItems: 'stretch'
            }}
          >
            {/* Recognition & Awards */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Award size={24} color="#F5A623" />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  Recognition &amp; Awards
                </h3>
              </div>
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.65', marginBottom: '20px' }}>
                Liah Academy is recognized nationally for its practical methodology. We have won multiple awards including:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#E2E8F0' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#F5A623" />
                  <span>Cameroon Silicon Mountain Innovation Award (2025)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#F5A623" />
                  <span>Best Academic Incubator in Southwest Region (2025)</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <CheckCircle size={18} color="#F5A623" />
                  <span>Certified Partner for Linux Academy Frameworks</span>
                </li>
              </ul>
            </div>

            {/* Partnerships Container Card */}
            <div 
              style={{ 
                background: 'rgba(8, 31, 62, 0.75)', 
                borderRadius: '16px', 
                padding: '36px 30px', 
                border: '1px solid rgba(255, 255, 255, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <Handshake size={24} color="#F5A623" />
                <h3 style={{ color: '#FFFFFF', fontSize: '1.4rem', fontWeight: 800, margin: 0 }}>
                  Partnerships
                </h3>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.92rem', lineHeight: '1.7', marginBottom: '18px' }}>
                Our corporate division recruits directly from top-performing graduates, guaranteeing immediate careers in software projects.
              </p>
              <a 
                href={PARTNERSHIP_MAILTO_LINK}
                className="btn"
                style={{ 
                  background: '#F5A623', 
                  color: '#081F3E', 
                  padding: '10px 20px', 
                  borderRadius: '8px', 
                  fontWeight: 800, 
                  fontSize: '0.88rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(245, 166, 35, 0.35)'
                }}
              >
                <Mail size={15} /> Partner With Us
              </a>
            </div>
          </div>

          {/* 4 Partner White Rounded Pills */}
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px', 
              textAlign: 'center' 
            }}
          >
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '22px 16px', 
                borderRadius: '12px', 
                color: '#081F3E', 
                fontWeight: 800, 
                fontSize: '0.88rem', 
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)' 
              }}
            >
              SILICON MOUNTAIN
            </div>
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '22px 16px', 
                borderRadius: '12px', 
                color: '#081F3E', 
                fontWeight: 800, 
                fontSize: '0.88rem', 
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)' 
              }}
            >
              MINESEC CERTIFIED
            </div>
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '22px 16px', 
                borderRadius: '12px', 
                color: '#081F3E', 
                fontWeight: 800, 
                fontSize: '0.88rem', 
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)' 
              }}
            >
              LINUX LABS
            </div>
            <div 
              style={{ 
                background: '#FFFFFF', 
                padding: '22px 16px', 
                borderRadius: '12px', 
                color: '#081F3E', 
                fontWeight: 800, 
                fontSize: '0.88rem', 
                letterSpacing: '0.04em',
                boxShadow: '0 4px 14px rgba(0,0,0,0.1)' 
              }}
            >
              AWS ACADEMY
            </div>
          </div>

        </div>
      </section>

      {/* 3. NEWS, EVENTS & ANNOUNCEMENTS (HIGHLIGHTS SECTION) */}
      <section id="highlights" style={{ padding: '90px 0 100px 0', background: '#FFFFFF', scrollMarginTop: '120px' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              HIGHLIGHTS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#081F3E', marginBottom: '14px' }}>
              News, events &amp; announcements
            </h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Stay up-to-date with current events at Liah Academy, workshop schedules, and student competitions in Buea.
            </p>
          </div>

          <div className="grid-3" style={{ alignItems: 'stretch', gap: '30px' }}>
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="premium-card" 
                style={{ 
                  borderRadius: '16px', 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  background: '#FFFFFF'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '240px', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      fontFamily: 'var(--font-mono)', 
                      background: '#FEF3C7', 
                      color: '#B45309', 
                      padding: '3px 8px', 
                      borderRadius: '4px',
                      fontWeight: 700 
                    }}>
                      {article.category}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {article.date}
                    </span>
                  </div>

                  <h3 style={{ color: '#081F3E', fontSize: '1.15rem', fontWeight: 800, lineHeight: '1.4', marginBottom: '10px' }}>
                    {article.title}
                  </h3>

                  <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {article.desc}
                  </p>
                </div>

                <Link 
                  href={article.link} 
                  style={{ 
                    color: '#081F3E', 
                    fontWeight: 800, 
                    fontSize: '0.9rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    textDecoration: 'none',
                    borderTop: '1px solid rgba(15,23,42,0.06)',
                    paddingTop: '14px',
                    transition: 'color 0.2s ease'
                  }}
                >
                  Read Full Story <ArrowRight size={16} color="#F5A623" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
