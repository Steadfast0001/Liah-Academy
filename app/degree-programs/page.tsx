'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Settings, Clock, Search, X,
  Code, Shield, Calendar, MapPin, Globe, ArrowRight, Mail,
  BookOpen, Award, CheckCircle2
} from 'lucide-react';

const programsData = [
  // School of Engineering & Technology (HND & ND)
  {
    id: 1,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Software Engineering HND',
    desc: 'Learn full-stack programming, backend frameworks, software design patterns, and enterprise database operations.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Web Dev', 'Python', 'JavaScript', 'Algorithms', 'SQL', 'React'],
    featured: true
  },
  {
    id: 2,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Cybersecurity & Cloud Defense HND',
    desc: 'Network defense architectures, ethical penetration testing, vulnerability assessment, Linux server hardening, and cloud security.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Ethical Hacking', 'Linux', 'Firewalls', 'Cloud Security', 'SIEM'],
    featured: true
  },
  {
    id: 3,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Network and Maintenance HND',
    desc: 'Audit network topologies, manage systems security, configure routing protocols, and handle hardware diagnostics.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Linux Admin', 'Cisco Networking', 'PC Maintenance', 'Security'],
    featured: false
  },
  {
    id: 4,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Web and Graphics Design HND',
    desc: 'Acquire skills in creating user interfaces, design tools, modern UI/UX layouts, branding assets, and frontend programming.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['UI/UX', 'Figma', 'Photoshop', 'HTML/CSS', 'Next.js'],
    featured: false
  },
  {
    id: 5,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Digital Marketing and E-Commerce HND',
    desc: 'Build online shops, optimize payment methods, run digital campaigns, and scale automated conversion funnels.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['SEO', 'Social Media', 'Google Ads', 'WooCommerce'],
    featured: false
  },
  {
    id: 6,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computer Engineering ND',
    desc: 'Hardware architectures, computer electronics, circuit diagnostics, component repair, and microprocessor programming.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Hardware Architecture', 'Electronics', 'Microprocessors', 'Repair'],
    featured: false
  },
  {
    id: 7,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Information & Communication Tech ND',
    desc: 'Database systems, basic web technologies, local networking infrastructure, and IT technical user support.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Database Systems', 'Web Tech', 'Networking', 'IT Support'],
    featured: false
  },
  {
    id: 8,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Web Design ND',
    desc: 'Foundational website markup, styling, scripting, and mobile-friendly responsive user interfaces.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['HTML', 'CSS', 'JavaScript', 'Responsive Layouts'],
    featured: false
  },
  {
    id: 9,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computerized Accounting ND',
    desc: 'Apply financial computing theories using digital bookkeeping platforms, spreadsheets, and reporting systems.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['QuickBooks', 'Excel', 'Financial Records', 'Accounting'],
    featured: false
  },
  {
    id: 10,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Graphics Design and Printing ND',
    desc: 'Visual communication, Adobe design suite, typography, prepress output, digital printing, and brand collateral creation.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Photoshop', 'Illustrator', 'Printing', 'Typography'],
    featured: false
  },
  {
    id: 11,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Basic Computer ND',
    desc: 'Office productivity software, operating systems navigation, internet protocols, typing speed, and foundational digital literacy.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Office 365', 'Windows', 'Internet', 'Typing'],
    featured: false
  },

  // Professional Certifications
  {
    id: 12,
    school: 'CERTIFICATION',
    title: 'Digital Marketing and SEO',
    desc: 'Drive traffic, run ads, perform keyword audits, and manage campaigns across social media channels.',
    degree: 'CERTIFICATION',
    duration: '6 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['SEO', 'Content Marketing', 'Google Analytics', 'Ads'],
    featured: false
  },
  {
    id: 13,
    school: 'CERTIFICATION',
    title: 'Industrial Web Design',
    desc: 'Build fully responsive corporate websites, frontend layouts, animations, and modern CMS architectures.',
    degree: 'CERTIFICATION',
    duration: '6 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '300,000 FRS',
    tags: ['Responsive Design', 'HTML5', 'CSS3', 'JavaScript', 'Git'],
    featured: false
  },
  {
    id: 14,
    school: 'CERTIFICATION',
    title: 'DevOps Certification',
    desc: 'Acquire skills in containerization, pipeline automation, cloud setups, and Infrastructure as Code.',
    degree: 'CERTIFICATION',
    duration: '9 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'Terraform', 'AWS'],
    featured: false
  },
  {
    id: 15,
    school: 'CERTIFICATION',
    title: 'Data Science Certification',
    desc: 'Master Python, machine learning models, database queries, and data visualization tools to analyze data.',
    degree: 'CERTIFICATION',
    duration: '9 Months',
    format: 'fulltime',
    studyFormat: 'Fulltime',
    tuition: '350,000 FRS',
    tags: ['Python', 'Machine Learning', 'SQL', 'Data Visualization'],
    featured: true
  }
];

export default function DegreeProgramsPage() {
  const [selectedSchool, setSelectedSchool] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = programsData.filter((prog) => {
    const matchesSchool = 
      selectedSchool === 'all' || 
      (selectedSchool === 'ENGINEERING' && prog.school === 'SCHOOL OF ENGINEERING') ||
      (selectedSchool === 'CERTIFICATION' && prog.school === 'CERTIFICATION');

    const matchesSearch =
      searchQuery.trim() === '' ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSchool && matchesSearch;
  });

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header with Direct Inquiry on the Left */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '24px', 
            marginBottom: '50px' 
          }}
        >
          {/* Direct Inquiry Button (Left) */}
          <div style={{ flexShrink: 0 }}>
            <Link 
              href="/contact#inquiry" 
              className="btn btn-secondary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 22px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.92rem',
                background: '#FFFFFF',
                border: '2px solid #F5A623',
                color: '#081F3E',
                boxShadow: '0 4px 16px rgba(245, 166, 35, 0.2)',
                transition: 'all 0.2s ease'
              }}
            >
              <Mail size={18} color="#F5A623" /> Direct Inquiry
            </Link>
          </div>

          {/* Center Curriculum Header */}
          <div style={{ textAlign: 'center', flexGrow: 1, maxWidth: '720px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '5px 14px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              CURRICULUM
            </span>
            <p className="page-header-subtitle">
              Degrees &amp; Programs
            </p>
            <h1 className="page-header-title">Curriculum Explorer</h1>
            <p className="page-header-desc">
              Review academic programs, modules, and formatting details. Select a curriculum program below to verify duration, tuition, and tech stacks.
            </p>
          </div>

          {/* Right Spacer on Desktop to preserve symmetric centering */}
          <div style={{ width: '160px', display: 'block', visibility: 'hidden' }} className="header-spacer-desktop" />
        </div>

        {/* 1. TOP 3 INFO CARDS */}
        <section className="grid-3" style={{ marginBottom: '80px', alignItems: 'stretch' }}>
          {/* Card 1: Higher National Diploma */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              ACADEMIC CORE
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Higher National Diploma</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Two-year national technical diploma accredited by the Ministry of Higher Education:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>Duration:</strong> 2 Academic Years</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={18} color="#F5A623" />
                <span>Software Engineering &amp; Networks</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>National Examination Clearance</span>
              </li>
            </ul>
          </div>

          {/* Card 2: National Diploma */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              TECHNICAL FOUNDATION
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>National Diploma (ND)</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              One-year foundational diploma focused on core engineering, hardware, and bookkeeping:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>Duration:</strong> 1 Academic Year</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={18} color="#F5A623" />
                <span>Computer Engineering &amp; ICT</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Direct HND Pathway Entry</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Professional Certifications */}
          <div 
            className="premium-card"
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '36px 30px',
              border: '1px solid rgba(15, 23, 42, 0.08)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
            }}
          >
            <span style={{ 
              display: 'inline-block', 
              background: '#DCFCE7', 
              color: '#15803D', 
              padding: '4px 10px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.06em', 
              marginBottom: '16px' 
            }}>
              CAREER ACCELERATION
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Professional Certifications</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Intensive, hands-on industry bootcamps built for direct job placement in technology:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="#10B981" />
                <span><strong>Duration:</strong> 6 to 9 Months</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="#10B981" />
                <span>DevOps, Cloud Pipelines &amp; Data Science</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span>Corporate Incubator Placement</span>
              </li>
            </ul>
          </div>
        </section>

        {/* 2. CURRICULUM EXPLORER & CATALOG */}
        <section style={{ marginBottom: '60px' }}>
          <h2 style={{ color: '#081F3E', fontSize: '2rem', fontWeight: 800, marginBottom: '28px', textAlign: 'center' }}>
            Curriculum Explorer
          </h2>

          {/* Filter & Search Bar */}
          <div 
            style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              gap: '16px', 
              background: '#FFFFFF', 
              padding: '16px 20px', 
              borderRadius: '16px', 
              border: '1px solid rgba(15,23,42,0.08)', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              marginBottom: '36px' 
            }}
          >
            {/* Filter Buttons Swipable Pill Bar */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#081F3E', marginRight: '4px', whiteSpace: 'nowrap' }}>Department:</span>
              
              <button 
                onClick={() => setSelectedSchool('all')}
                style={{
                  background: selectedSchool === 'all' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedSchool === 'all' ? '#FFFFFF' : '#081F3E',
                  border: selectedSchool === 'all' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                All Programs
              </button>

              <button 
                onClick={() => setSelectedSchool('ENGINEERING')}
                style={{
                  background: selectedSchool === 'ENGINEERING' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedSchool === 'ENGINEERING' ? '#FFFFFF' : '#081F3E',
                  border: selectedSchool === 'ENGINEERING' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                School of Engineering &amp; Technology
              </button>

              <button 
                onClick={() => setSelectedSchool('CERTIFICATION')}
                style={{
                  background: selectedSchool === 'CERTIFICATION' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedSchool === 'CERTIFICATION' ? '#FFFFFF' : '#081F3E',
                  border: selectedSchool === 'CERTIFICATION' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Professional Certifications
              </button>
            </div>

            {/* Quick Course Search with Clear Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '220px', flexGrow: 1, maxWidth: '340px', position: 'relative' }}>
              <label htmlFor="degree_course_search_input" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <Search size={16} color="#94A3B8" />
              </label>
              <input
                id="degree_course_search_input"
                name="degree_course_search_input"
                aria-label="Quick course search"
                type="text"
                placeholder="Search software, fees, programs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  borderBottom: '1px solid rgba(15,23,42,0.15)',
                  padding: '6px 24px 6px 8px',
                  fontSize: '14px',
                  outline: 'none',
                  background: 'transparent',
                  width: '100%',
                  color: '#081F3E'
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  style={{
                    position: 'absolute',
                    right: 0,
                    background: 'none',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Courses Catalog Grid */}
          <div className="grid-3" style={{ alignItems: 'stretch', gap: '28px' }}>
            {filteredPrograms.length > 0 ? (
              filteredPrograms.map((prog) => (
                <div 
                  key={prog.id} 
                  className="premium-card" 
                  style={{ 
                    borderRadius: '16px', 
                    padding: '30px 26px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    background: '#FFFFFF',
                    border: '1px solid rgba(15, 23, 42, 0.08)',
                    borderTop: prog.featured ? '4px solid #F5A623' : '1px solid rgba(15, 23, 42, 0.08)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
                  }}
                >
                  <div>
                    {/* School / Category Badge */}
                    <span style={{ 
                      display: 'inline-block', 
                      background: '#FEF3C7', 
                      color: '#B45309', 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontFamily: 'var(--font-mono)', 
                      fontSize: '0.7rem', 
                      fontWeight: 800, 
                      textTransform: 'uppercase', 
                      letterSpacing: '0.06em', 
                      marginBottom: '16px' 
                    }}>
                      {prog.school}
                    </span>

                    {/* Program Title */}
                    <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, lineHeight: '1.35', marginBottom: '12px' }}>
                      {prog.title}
                    </h3>

                    {/* Program Description */}
                    <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.65', marginBottom: '22px' }}>
                      {prog.desc}
                    </p>

                    {/* Metadata Grid */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: '1fr 1fr 1fr', 
                      gap: '8px 12px', 
                      fontSize: '0.85rem', 
                      color: '#475569',
                      borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                      paddingTop: '16px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <span>Level: <strong>{prog.degree}</strong></span>
                      </div>
                      <div>
                        <span>Duration: <strong>{prog.duration}</strong></span>
                      </div>
                      <div>
                        <span>Tuition: <strong style={{ color: '#081F3E' }}>{prog.tuition}</strong></span>
                      </div>
                    </div>

                    {/* Tech & Skill Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {prog.tags.map((tag, tIdx) => (
                        <span 
                          key={tIdx} 
                          style={{
                            display: 'inline-block',
                            background: '#081F3E',
                            color: '#F8FAFC',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.02em'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Enroll Action Button */}
                  <Link 
                    href={`/admissions?degree=${encodeURIComponent(prog.degree)}&program=${encodeURIComponent(prog.title)}#apply`}
                    className="btn" 
                    style={{ 
                      background: '#F5A623', 
                      color: '#081F3E', 
                      width: '100%', 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      fontWeight: 800, 
                      fontSize: '0.92rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      gap: '8px', 
                      textDecoration: 'none', 
                      boxShadow: '0 4px 14px rgba(245, 166, 35, 0.35)', 
                      transition: 'all 0.2s ease' 
                    }}
                  >
                    Enroll <ArrowRight size={16} />
                  </Link>
                </div>
              ))
            ) : (
              <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '60px 0', color: '#64748B' }}>
                <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>No programs match your search criteria.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </main>
  );
}
