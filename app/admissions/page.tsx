'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  FileText, CreditCard, ArrowRight, CheckCircle, 
  ShieldCheck, Award, BookOpen, UserPlus, Lock, 
  Sparkles, Check, ChevronRight, HelpCircle, MapPin
} from 'lucide-react';

const allPrograms = [
  {
    category: 'Higher National Diploma (HND)',
    degree: 'HND',
    badge: '2 Academic Years • National Accreditation',
    fee: '250,000 XAF / Year',
    appFee: '15,000 XAF',
    programs: [
      { name: 'Software Engineering HND', desc: 'Full-stack web & mobile development, cloud architecture, system design.' },
      { name: 'Cybersecurity & Cloud Defense HND', desc: 'Ethical hacking, threat detection, penetration testing, SOC operations.' },
      { name: 'Network and Maintenance HND', desc: 'Enterprise network engineering, routing protocols, hardware maintenance.' },
      { name: 'Web and Graphics Design HND', desc: 'UI/UX design, visual branding, modern interactive frontend engineering.' },
      { name: 'Digital Marketing and E-Commerce HND', desc: 'Performance marketing, analytics, conversion optimization, SEO.' }
    ]
  },
  {
    category: 'National Diploma (ND)',
    degree: 'ND',
    badge: '1 Academic Year • Foundation',
    fee: '150,000 XAF / Year',
    appFee: '15,000 XAF',
    programs: [
      { name: 'Computerized Accounting ND', desc: 'Financial software, accounting management, automated bookkeeping systems.' },
      { name: 'Web Design ND', desc: 'HTML/CSS/JS fundamentals, responsive layout engineering, CMS integration.' },
      { name: 'Information & Communication Tech ND', desc: 'IT infrastructure, computer networks, technical support foundations.' },
      { name: 'Computer Engineering ND', desc: 'Microcontrollers, electronics, hardware diagnosis, system assembly.' },
      { name: 'Graphics Design and Printing ND', desc: 'Adobe Creative Suite, typography, prepress workflow, digital printing.' },
      { name: 'Basic Computer ND', desc: 'Office productivity suites, digital literacy, operating system basics.' }
    ]
  },
  {
    category: 'Professional Certifications',
    degree: 'Certification',
    badge: '6 to 9 Months • Fast-Track',
    fee: '350,000 XAF',
    appFee: '25,000 XAF',
    programs: [
      { name: 'DevOps Certification', desc: 'Docker, Kubernetes, CI/CD pipelines, AWS/GCP cloud automation.' },
      { name: 'Data Science Certification', desc: 'Python, statistical analysis, machine learning algorithms, data pipelines.' },
      { name: 'Digital Marketing and SEO', desc: 'Growth hacking, brand positioning, search engine optimization, ad campaigns.' },
      { name: 'Industrial Web Design', desc: 'Production React/Next.js frameworks, responsive design systems, headless CMS.' }
    ]
  }
];

function AdmissionsOverview() {
  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="course-badge">Admissions &amp; Tuition Portal</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#081F3E', margin: '10px 0' }}>
            Admissions &amp; Tuition Schedule
          </h1>
          <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1rem', color: '#64748B' }}>
            Review institutional entry requirements, transparent fixed tuition schedules, and submit your official enrolment dossier.
          </p>
        </div>

        {/* 1. ADMISSION REQUIREMENTS & TUITION SCHEDULE (SIDE-BY-SIDE CARDS) */}
        <section id="requirements" style={{ marginBottom: '50px', scrollMarginTop: '120px' }}>
          <div className="grid-2" style={{ alignItems: 'stretch', gap: '30px' }}>
            
            {/* LEFT CARD: ADMISSION REQUIREMENTS */}
            <div 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={18} color="#B45309" />
                  </div>
                  <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                    Admission Requirements
                  </h3>
                </div>
                
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '22px' }}>
                  Prospective candidates must provide the following documentation during enrolment to qualify for academic dossier approval:
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>GCE Advanced Level</strong> (Minimum 2 passes) for HND or <strong>GCE Ordinary Level</strong> (Minimum 3 passes) for ND.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Certified Birth Certificate:</strong> Clear official copy with administrative stamp.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>National Identity Card / Valid Passport:</strong> High-resolution front &amp; back scan or photo.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>High School Transcripts / Slip:</strong> Term reports or O-Level / A-Level results slip.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Tuition / Application Clearance:</strong> Enrolments and workstation allocations are confirmed after payment.</span>
                  </li>
                </ul>
              </div>

              {/* Policy Banner at bottom of Left Card */}
              <div style={{ 
                marginTop: '28px', 
                background: '#FEF3C7', 
                border: '1px solid #FCD34D', 
                borderRadius: '8px', 
                padding: '14px 18px',
                fontSize: '0.84rem',
                color: '#92400E',
                lineHeight: '1.5'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <span>⚠️</span>
                  <span>ENROLLMENT COMPLETION POLICY:</span>
                </div>
                <div>
                  All registrations and lab workstation reservations are complete only after the applicant has completed payment and submitted valid academic credentials.
                </div>
              </div>
            </div>

            {/* RIGHT CARD: INSTITUTIONAL TUITION SCHEDULE */}
            <div 
              id="payment" 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                scrollMarginTop: '120px'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={18} color="#B45309" />
                  </div>
                  <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                    Institutional Tuition Schedule
                  </h3>
                </div>
                
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '18px' }}>
                  Official fixed tuition fees across all academic departments. Direct, transparent pricing:
                </p>

                {/* 5 Card Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
                  
                  {/* Row 1: HND */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Higher National Diploma (HND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        2 Academic Years &bull; National Level
                      </span>
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                      250,000 XAF / yr
                    </span>
                  </div>

                  {/* Row 2: ND */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        National Diploma (ND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        1 Academic Year &bull; Foundation
                      </span>
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                      150,000 XAF / yr
                    </span>
                  </div>

                  {/* Row 3: Professional Certifications */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Professional Certifications
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        6 to 9 Months &bull; DevOps &amp; Data
                      </span>
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                      350,000 XAF
                    </span>
                  </div>

                  {/* Row 4: App Fee (HND & ND) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Application Fee (HND &amp; ND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        One-time application processing fee
                      </span>
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                      15,000 XAF
                    </span>
                  </div>

                  {/* Row 5: App Fee (Certifications) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '12px 16px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Application Fee (Certifications)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        One-time application processing fee
                      </span>
                    </div>
                    <span style={{ fontSize: '0.92rem', fontWeight: 800, color: '#059669' }}>
                      25,000 XAF
                    </span>
                  </div>

                </div>
              </div>

              {/* Dark Navy CTA Card at bottom of Right Card */}
              <div 
                style={{ 
                  background: '#081F3E', 
                  borderRadius: '12px', 
                  padding: '18px 22px', 
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <span style={{ fontSize: '0.72rem', color: '#F5A623', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block' }}>
                    DIRECT ENROLMENT
                  </span>
                  <h4 style={{ color: '#FFFFFF', margin: '2px 0', fontSize: '1.15rem', fontWeight: 800 }}>
                    Ready to Begin?
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Submit your documents online to reserve your cohort lab station.
                  </span>
                </div>

                <Link 
                  href="/portal?tab=enrol" 
                  style={{ 
                    background: '#F5A623', 
                    color: '#081F3E', 
                    padding: '10px 20px', 
                    borderRadius: '6px', 
                    fontWeight: 800, 
                    fontSize: '0.85rem', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Start Enrolment &rarr;
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* 2. PROGRAM EXPLORER & DIRECT ENROLMENT SELECTOR */}
        <section id="programs-selector" style={{ marginBottom: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              ACADEMIC OFFERINGS
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#081F3E', margin: '6px 0' }}>
              Select a Program to Enrol
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem', maxWidth: '600px', margin: '0 auto' }}>
              Choose your academic division and program below. You will be routed directly to the Student Portal to finalize your dossier.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {allPrograms.map((cat) => (
              <div 
                key={cat.category}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '28px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #F1F5F9' }}>
                  <div>
                    <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                      {cat.category}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>{cat.badge}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                    <span style={{ background: '#ECFDF5', color: '#059669', padding: '4px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 800 }}>
                      Tuition: {cat.fee}
                    </span>
                    <span style={{ background: '#EFF6FF', color: '#1E40AF', padding: '4px 12px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700 }}>
                      App Fee: {cat.appFee}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {cat.programs.map((prog) => (
                    <div 
                      key={prog.name}
                      style={{
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px',
                        padding: '18px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        gap: '12px',
                        transition: 'transform 0.2s, box-shadow 0.2s'
                      }}
                    >
                      <div>
                        <h4 style={{ color: '#081F3E', fontSize: '0.98rem', fontWeight: 800, margin: '0 0 6px 0' }}>
                          {prog.name}
                        </h4>
                        <p style={{ color: '#64748B', fontSize: '0.82rem', lineHeight: '1.45', margin: 0 }}>
                          {prog.desc}
                        </p>
                      </div>

                      <Link
                        href={`/portal?tab=enrol&degree=${encodeURIComponent(cat.degree)}&program=${encodeURIComponent(prog.name)}`}
                        style={{
                          background: '#081F3E',
                          color: '#FFFFFF',
                          padding: '8px 14px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        Enrol in Program <ArrowRight size={14} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. RETURNING APPLICANTS & STUDENT PORTAL ACCESS BANNER */}
        <section style={{
          background: 'linear-gradient(135deg, #081F3E 0%, #0F2F57 100%)',
          borderRadius: '16px',
          padding: '36px 40px',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px',
          boxShadow: '0 10px 30px rgba(8, 31, 62, 0.15)'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', background: 'rgba(245, 166, 35, 0.2)', color: '#F5A623', padding: '4px 10px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              STUDENT SERVICES
            </span>
            <h3 style={{ color: '#FFFFFF', fontSize: '1.5rem', fontWeight: 800, margin: '8px 0 6px 0' }}>
              Already Submitted Your Enrolment Dossier?
            </h3>
            <p style={{ color: '#CBD5E1', fontSize: '0.9rem', margin: 0, maxWidth: '560px' }}>
              Log into the dedicated Student Portal to review your admission status, download official acceptance letters, or complete tuition payments.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link
              href="/portal?tab=login"
              style={{
                background: '#F5A623',
                color: '#081F3E',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Lock size={16} /> Access Student Portal
            </Link>
            <Link
              href="/portal?tab=enrol"
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                color: '#FFFFFF',
                padding: '12px 24px',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <UserPlus size={16} /> New Application
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 0', textAlign: 'center', color: '#081F3E', fontWeight: 700 }}>
        Loading Admissions Overview...
      </div>
    }>
      <AdmissionsOverview />
    </Suspense>
  );
}
