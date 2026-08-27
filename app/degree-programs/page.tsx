'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, Settings, Clock, Search, X,
  Code, Shield, Calendar, MapPin, Globe, ArrowRight, Mail,
  BookOpen, Award, CheckCircle2
} from 'lucide-react';

const programsData = [
  // School of Business
  {
    id: 1,
    school: 'SCHOOL OF BUSINESS',
    title: 'Human Resource Management HND',
    desc: 'Organize staffing plans, manage staff files, employee relations, recruitment and Cameroonian labor code compliance.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Recruitment', 'Labor Law', 'Employee Relations'],
    featured: false
  },
  {
    id: 2,
    school: 'SCHOOL OF BUSINESS',
    title: 'Digital Marketing HND',
    desc: 'Promote projects using content optimization, digital network channels, SEO, and analytic funnels.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['SEO', 'Social Media Ads', 'Content Strategy'],
    featured: false
  },
  {
    id: 3,
    school: 'SCHOOL OF BUSINESS',
    title: 'Marketing HND',
    desc: 'Create promotion plans, conduct target audience surveys, direct sales pipelines, and position brands.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Sales Strategy', 'Brand Management', 'Market Research'],
    featured: false
  },
  {
    id: 4,
    school: 'SCHOOL OF BUSINESS',
    title: 'Management HND',
    desc: 'Formulate company strategies, manage administrative operations, lead workflows, and optimize teams.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Business Strategy', 'Operations', 'Leadership', 'HR'],
    featured: false
  },
  {
    id: 5,
    school: 'SCHOOL OF BUSINESS',
    title: 'Accounting HND',
    desc: 'Prepare financial ledger accounts, compute tax, conduct cost analysis, and learn corporate audit processes.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Financial Accounting', 'Cost Accounting', 'Auditing'],
    featured: true
  },

  // School of Engineering / Technology
  {
    id: 6,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computerized Accounting ND',
    desc: 'Apply accounting theories using digital bookkeeping platforms, spreadsheets, and reporting systems.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['QuickBooks', 'Excel', 'Financial Records', 'Accounting'],
    featured: false
  },
  {
    id: 7,
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
    id: 8,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Information & Communication Tech ND',
    desc: 'Database systems, basic web technologies, local networking infrastructure, and IT technical support.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Database Systems', 'Web Tech', 'Networking', 'IT Support'],
    featured: false
  },
  {
    id: 9,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Computer Engineering ND',
    desc: 'Hardware architectures, computer electronics, circuit diagnostics, and microprocessor programming.',
    degree: 'ND',
    duration: '1 Year',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '150,000 FRS',
    tags: ['Hardware Architecture', 'Electronics', 'Microprocessors'],
    featured: false
  },
  {
    id: 10,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Network and Maintenance HND',
    desc: 'Audit network topologies, manage systems security, configure routing, and handle hardware diagnostics.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Linux Admin', 'Cisco Networking', 'PC Maintenance', 'Security'],
    featured: true
  },
  {
    id: 11,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Digital Marketing and E-Commerce HND',
    desc: 'Build online shops, optimize payment methods, run digital campaigns, and scale conversion funnels.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['SEO', 'Social Media', 'Google Ads', 'WooCommerce'],
    featured: false
  },
  {
    id: 12,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Web and Graphics Design HND',
    desc: 'Acquire skills in creating user interfaces, design tools, graphics layouts, and frontend programming.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['UI/UX', 'Figma', 'Photoshop', 'HTML/CSS', 'Next.js'],
    featured: false
  },
  {
    id: 13,
    school: 'SCHOOL OF ENGINEERING',
    title: 'Software Engineering HND',
    desc: 'Learn programming, backend frameworks, software design patterns, and database operations.',
    degree: 'HND',
    duration: '2 Years',
    format: 'oncampus',
    studyFormat: 'Oncampus',
    tuition: '250,000 FRS',
    tags: ['Web Dev', 'Python', 'JavaScript', 'Algorithms', 'SQL'],
    featured: false
  },

  // Professional Certifications
  {
    id: 14,
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
    id: 15,
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
    id: 16,
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
    id: 17,
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
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPrograms = programsData.filter((prog) => {
    const matchesFormat = 
      selectedFormat === 'all' || 
      (selectedFormat === 'fulltime' && (prog.format === 'fulltime' || prog.studyFormat.toLowerCase().includes('fulltime'))) ||
      (selectedFormat === 'oncampus' && (prog.format === 'oncampus' || prog.studyFormat.toLowerCase().includes('oncampus'))) ||
      (selectedFormat === 'online' && prog.format === 'online');

    const matchesSearch =
      searchQuery.trim() === '' ||
      prog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.school.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prog.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFormat && matchesSearch;
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
          {/* Card 1: Degree Levels */}
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
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Degree Levels</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Liah Academy structures programs around three primary national certification levels:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>HND</strong> - Higher National Diploma</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>B.Sc</strong> - Bachelor of Science</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <GraduationCap size={20} color="#F5A623" />
                <span><strong>BA</strong> - Bachelor of Arts (Applied Tech)</span>
              </li>
            </ul>
          </div>

          {/* Card 2: Program Formats */}
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
              SPECIALIZATION
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Program Formats</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              We focus on technical engineering degrees configured for corporate integration:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Settings size={18} color="#F5A623" />
                <span><strong>B.Tech</strong> - Bachelor of Technology</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Code size={18} color="#F5A623" />
                <span><strong>B.Eng</strong> - Bachelor of Engineering</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Shield size={18} color="#F5A623" />
                <span>Cyber Operations &amp; Cloud Engineering</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Length & Format */}
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
              FORMAT &amp; LENGTH
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Length &amp; Format</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Programs are designed to fit your schedule. Choose from the following study formats:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={18} color="#F5A623" />
                <span><strong>Full-time:</strong> Daily intensive labs (3 Years)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#F5A623" />
                <span><strong>Part-time:</strong> Evenings &amp; weekends (3-4 Years)</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BookOpen size={18} color="#F5A623" />
                <span><strong>Work-Study:</strong> Industry apprenticeship</span>
              </li>
            </ul>
          </div>

          {/* Card 3: Financial Aid & Corporate Grants */}
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
              TUITION SUPPORT
            </span>
            <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>Tuition &amp; Aid</h3>
            <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '20px' }}>
              Education is an investment in your career. We provide flexible financing:
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem', color: '#081F3E' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={18} color="#10B981" />
                <span><strong>Merit Scholarships:</strong> Up to 50% tuition waiver</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span><strong>Corporate Sponsorships:</strong> Fully funded programs</span>
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <CheckCircle2 size={18} color="#10B981" />
                <span><strong>Installment Plans:</strong> Pay per semester</span>
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
            {/* Filter Buttons Horizontal Swipable Pill Bar */}
            <div 
              className="no-scrollbar"
              style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center', 
                overflowX: 'auto',
                maxWidth: '100%',
                paddingBottom: '4px'
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#081F3E', marginRight: '4px', whiteSpace: 'nowrap' }}>Format:</span>
              
              <button 
                onClick={() => setSelectedFormat('all')}
                style={{
                  background: selectedFormat === 'all' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedFormat === 'all' ? '#FFFFFF' : '#081F3E',
                  border: selectedFormat === 'all' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
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
                onClick={() => setSelectedFormat('fulltime')}
                style={{
                  background: selectedFormat === 'fulltime' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedFormat === 'fulltime' ? '#FFFFFF' : '#081F3E',
                  border: selectedFormat === 'fulltime' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Full-Time
              </button>

              <button 
                onClick={() => setSelectedFormat('online')}
                style={{
                  background: selectedFormat === 'online' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedFormat === 'online' ? '#FFFFFF' : '#081F3E',
                  border: selectedFormat === 'online' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                Online
              </button>

              <button 
                onClick={() => setSelectedFormat('oncampus')}
                style={{
                  background: selectedFormat === 'oncampus' ? '#081F3E' : 'rgba(245, 166, 35, 0.08)',
                  color: selectedFormat === 'oncampus' ? '#FFFFFF' : '#081F3E',
                  border: selectedFormat === 'oncampus' ? '1px solid #081F3E' : '1px solid rgba(245, 166, 35, 0.3)',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease'
                }}
              >
                On-Campus
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
                      gridTemplateColumns: '1fr 1fr', 
                      gap: '8px 16px', 
                      fontSize: '0.85rem', 
                      color: '#475569',
                      borderTop: '1px solid rgba(15, 23, 42, 0.06)',
                      paddingTop: '16px',
                      marginBottom: '20px'
                    }}>
                      <div>
                        <span>Degree: <strong>{prog.degree}</strong></span>
                      </div>
                      <div>
                        <span>Duration: <strong>{prog.duration}</strong></span>
                      </div>
                      <div>
                        <span>Study Format: <strong>{prog.studyFormat}</strong></span>
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
                    href={`/admissions?degree=${encodeURIComponent(prog.degree)}&program=${encodeURIComponent(prog.title)}&format=${encodeURIComponent(prog.format)}#apply`}
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
