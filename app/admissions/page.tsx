'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { 
  FileText, CreditCard, Lock, UserPlus 
} from 'lucide-react';

function AdmissionsOverview() {
  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '45px' }}>
          <span className="course-badge">Admissions &amp; Application Portal</span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#081F3E', margin: '10px 0' }}>
            Admissions &amp; Fee Schedule
          </h1>
          <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1rem', color: '#64748B' }}>
            Review institutional entry requirements and transparent academic fee schedules. Online submission handles only your one-time application processing fee.
          </p>
        </div>

        {/* 1. ADMISSION REQUIREMENTS & TUITION SCHEDULE (SIDE-BY-SIDE CARDS: IMAGE 3 & IMAGE 4) */}
        <section id="requirements" style={{ marginBottom: '40px', scrollMarginTop: '120px' }}>
          <div className="grid-2" style={{ alignItems: 'stretch', gap: '30px' }}>
            
            {/* LEFT CARD: ADMISSION REQUIREMENTS (IMAGE 3) */}
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
                    <span><strong>Application Clearance:</strong> Enrolments and workstation allocations are confirmed after submitting application proof of payment and academic credentials.</span>
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
                  All registrations and lab workstation reservations are processed after the applicant has submitted application proof of payment and valid academic credentials. Program tuition is settled offline directly at the campus finance office upon admission.
                </div>
              </div>
            </div>

            {/* RIGHT CARD: INSTITUTIONAL TUITION SCHEDULE (IMAGE 4) */}
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
                justifyContent: 'flex-start',
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
                
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '22px' }}>
                  Official fixed tuition fees across all academic departments. Direct, transparent pricing:
                </p>

                {/* 5 Card Rows */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  
                  {/* Row 1: HND */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        Higher National Diploma (HND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        2 Academic Years &bull; National Level
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      250,000 XAF / yr
                    </span>
                  </div>

                  {/* Row 2: ND */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        National Diploma (ND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        1 Academic Year &bull; Foundation
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      150,000 XAF / yr
                    </span>
                  </div>

                  {/* Row 3: Professional Certifications */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        Professional Certifications
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        6 to 9 Months &bull; DevOps &amp; Data
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      350,000 XAF
                    </span>
                  </div>

                  {/* Row 4: App Fee (HND & ND) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        Application Fee (HND &amp; ND)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        One-time application processing fee
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      15,000 XAF
                    </span>
                  </div>

                  {/* Row 5: App Fee (Certifications) */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 18px' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        Application Fee (Certifications)
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        One-time application processing fee
                      </span>
                    </div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#059669' }}>
                      25,000 XAF
                    </span>
                  </div>

                </div>

                {/* Clarification Note on Tuition vs Application Fee */}
                <div style={{ marginTop: '20px', padding: '12px 16px', background: '#F1F5F9', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', color: '#475569', lineHeight: '1.5' }}>
                  ℹ️ <strong>Payment Policy Notice:</strong> Only the one-time application processing fee (15,000 XAF or 25,000 XAF) is submitted online with MTN MoMo payment proof. Program tuition is paid offline directly at the campus finance office in Buea upon admission confirmation.
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 2. RETURNING APPLICANTS & STUDENT SERVICES BANNER (IMAGE 5) */}
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
              Log into the dedicated Student Portal to review your admission status, download official acceptance letters, or upload application fee payment proof.
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
