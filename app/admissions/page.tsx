'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Calculator, UserCheck, ShieldCheck, CreditCard, 
  CheckCircle, FileText, Lock, ArrowRight, ArrowLeft, 
  LogIn, UserPlus, LogOut, Download, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Trash2, Paperclip, Smartphone, Loader2
} from 'lucide-react';

interface DocRequirement {
  id: string;
  label: string;
  required: boolean;
  hint: string;
  accept: string;
}

const docRequirementsByDegree: Record<string, DocRequirement[]> = {
  HND: [
    {
      id: 'gce_al',
      label: 'GCE Advanced Level Certificate / Results Slip',
      required: true,
      hint: 'Minimum 2 A-Level passes in relevant subjects (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level / High School Transcripts',
      required: true,
      hint: 'Certified copy of O-Level results slip (minimum 4 papers including English/Maths)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'national_id',
      label: 'National ID Card / Passport / Birth Certificate',
      required: true,
      hint: 'Clear front & back scan of identity document (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'motivation_letter',
      label: 'Statement of Purpose / Motivation Letter',
      required: false,
      hint: 'Brief 1-page letter outlining your career goals in tech/business (PDF, DOCX)',
      accept: '.pdf,.doc,.docx'
    }
  ],
  ND: [
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level / BEPC / Probatoire Certificate',
      required: true,
      hint: 'Official pass slip or secondary school diploma (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'national_id',
      label: 'National ID Card / Birth Certificate',
      required: true,
      hint: 'Valid government ID or birth certificate (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'school_records',
      label: 'Previous Secondary School Report Cards',
      required: false,
      hint: 'Academic report transcripts (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ],
  Certification: [
    {
      id: 'resume',
      label: 'Curriculum Vitae (CV) / Professional Resume',
      required: true,
      hint: 'Summary of background, technical skills, or employment history (PDF, DOCX)',
      accept: '.pdf,.doc,.docx'
    },
    {
      id: 'national_id',
      label: 'National ID Card / Passport',
      required: true,
      hint: 'Government identification document (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'prior_certs',
      label: 'Prior Diplomas or Relevant Certifications',
      required: false,
      hint: 'Higher education diplomas or technical certifications (PDF, PNG, JPG)',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ]
};

function AdmissionsContent() {
  const searchParams = useSearchParams();
  const degreeParam = searchParams.get('degree');
  const programParam = searchParams.get('program');

  // Form Mode: 'register' | 'login' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Registration Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [degreeType, setDegreeType] = useState('HND');
  const [programType, setProgramType] = useState('Software Engineering HND');
  const [studyFormat, setStudyFormat] = useState('oncampus');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; size: string; label: string }>>({});
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Logged in Student Session State
  const [student, setStudent] = useState<any>(null);

  // Campay Checkout Modal
  const [showCheckout, setShowCheckout] = useState(false);
  const [payPhone, setPayPhone] = useState('');
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payReference, setPayReference] = useState<string | null>(null);
  const [payStatusMessage, setPayStatusMessage] = useState<string>('');
  const [payOperator, setPayOperator] = useState<string>('');
  const [payError, setPayError] = useState<string>('');
  const [payPollActive, setPayPollActive] = useState<boolean>(false);

  // Complete programs mapping
  const programOptions: Record<string, string[]> = {
    HND: [
      'Human Resource Management HND',
      'Digital Marketing HND',
      'Marketing HND',
      'Management HND',
      'Accounting HND',
      'Network and Maintenance HND',
      'Digital Marketing and E-Commerce HND',
      'Web and Graphics Design HND',
      'Software Engineering HND',
      'Cybersecurity & Cloud Defense HND'
    ],
    ND: [
      'Computerized Accounting ND',
      'Web Design ND',
      'Information & Communication Tech ND',
      'Computer Engineering ND',
      'Graphics Design and Printing ND',
      'Basic Computer ND'
    ],
    Certification: [
      'Digital Marketing and SEO',
      'Industrial Web Design',
      'DevOps Certification',
      'Data Science Certification'
    ]
  };

  // Pre-fill from URL parameters (e.g. from "Enroll ->")
  useEffect(() => {
    if (degreeParam) {
      const upper = degreeParam.toUpperCase();
      let normalizedDegree: 'HND' | 'ND' | 'Certification' = 'HND';
      if (upper.includes('CERT')) {
        normalizedDegree = 'Certification';
      } else if (upper.includes('ND') && !upper.includes('HND')) {
        normalizedDegree = 'ND';
      } else {
        normalizedDegree = 'HND';
      }

      setDegreeType(normalizedDegree);
    }

    if (programParam) {
      setProgramType(programParam);
      setPrefilledMessage(`Enrolling in: ${programParam}`);
    }

    if (degreeParam || programParam) {
      setActiveTab('register');
      setCurrentStep(1);
    }
  }, [degreeParam, programParam]);

  const handleFileUploadForSlot = (slotId: string, label: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const sizeStr = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(2) + ' MB'
        : Math.round(file.size / 1024) + ' KB';
      
      setUploadedDocs(prev => ({
        ...prev,
        [slotId]: {
          fileName: file.name,
          size: sizeStr,
          label
        }
      }));
      setRegError('');
    }
  };

  const handleRemoveDoc = (slotId: string) => {
    setUploadedDocs(prev => {
      const updated = { ...prev };
      delete updated[slotId];
      return updated;
    });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    // Verify required documents for this degree track
    const currentRequirements = docRequirementsByDegree[degreeType] || docRequirementsByDegree['HND'];
    const missingDocs = currentRequirements.filter(req => req.required && !uploadedDocs[req.id]);

    if (missingDocs.length > 0) {
      setRegError(`Please upload the mandatory document: "${missingDocs[0].label}"`);
      setRegLoading(false);
      return;
    }

    const docsList = Object.entries(uploadedDocs).map(([slotId, info]) => ({
      slotId,
      label: info.label,
      fileName: info.fileName,
      size: info.size,
      url: `/uploads/${info.fileName}`
    }));

    try {
      const res = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullname: fullName,
          email,
          password,
          phone,
          degree_type: degreeType,
          program_type: programType,
          study_format: studyFormat,
          document_url: docsList.length > 0 ? docsList[0].url : '',
          documents: docsList
        })
      });

      const data = await res.json();
      setRegLoading(false);

      if (data.success && data.data) {
        setStudent(data.data);
        setShowCheckout(true);
      } else {
        setRegError(data.message || 'Registration failed.');
      }
    } catch {
      setRegLoading(false);
      setRegError('Connection error. Please try again.');
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admissions/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();
      setLoginLoading(false);

      if (data.success && data.data) {
        setStudent(data.data);
      } else {
        setLoginError(data.message || 'Invalid email or password.');
      }
    } catch {
      setLoginLoading(false);
      setLoginError('Connection error. Please try again.');
    }
  };

  const handleCampayPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayLoading(true);
    setPayError('');
    setPayStatusMessage('');
    setPayReference(null);

    const phoneNumber = payPhone || student?.phone;
    if (!phoneNumber) {
      setPayError('Please enter your Mobile Money phone number.');
      setPayLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/payments/campay/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: phoneNumber,
          amount: 50000,
          studentId: student?.id,
          description: `Liah Academy Deposit #${student?.id || ''}`
        })
      });

      const data = await res.json();
      setPayLoading(false);

      if (data.success && data.reference) {
        setPayReference(data.reference);
        setPayOperator(data.operator || 'MTN / Orange');
        setPayStatusMessage(data.message || `USSD payment prompt dispatched to ${phoneNumber}. Please check your phone and enter your PIN.`);
        setPayPollActive(true);

        // Start polling Campay transaction status every 3 seconds
        const pollInterval = setInterval(async () => {
          try {
            const statusRes = await fetch(`/api/payments/campay/status?reference=${data.reference}&studentId=${student?.id || ''}`);
            const statusData = await statusRes.json();

            if (statusData.status === 'SUCCESSFUL') {
              clearInterval(pollInterval);
              setPayPollActive(false);
              setPaySuccess(true);
              if (student) {
                setStudent({ ...student, payment_status: 'Paid', admission_status: 'Approved' });
              }
              setTimeout(() => {
                setShowCheckout(false);
                setPaySuccess(false);
                setPayReference(null);
                setPayStatusMessage('');
              }, 3500);
            } else if (statusData.status === 'FAILED') {
              clearInterval(pollInterval);
              setPayPollActive(false);
              setPayError(statusData.message || 'Payment request failed or was cancelled.');
            }
          } catch {
            // Ignore temporary network glitch during single poll
          }
        }, 3000);

        // Auto-timeout polling after 2.5 minutes
        setTimeout(() => {
          clearInterval(pollInterval);
          setPayPollActive(false);
        }, 150000);

      } else {
        setPayError(data.message || 'Failed to initiate Campay Mobile Money payment.');
      }
    } catch {
      setPayLoading(false);
      setPayError('Connection error contacting Campay gateway. Please try again.');
    }
  };

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="course-badge">Admissions &amp; Portal</span>
          <h1>Admissions &amp; Tuition Portal</h1>
          <p className="sub-header">
            Review admission requirements, check transparent institutional tuition schedules, and register for upcoming cohorts.
          </p>
        </div>

        {/* 1. ADMISSION REQUIREMENTS & TUITION SCHEDULE (SIDE-BY-SIDE) */}
        <section 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', 
            gap: '30px', 
            marginBottom: '60px',
            alignItems: 'stretch'
          }}
        >
          {/* Card 1: Admission Requirements */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ color: '#F5A623', display: 'flex', alignItems: 'center' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#F5A623" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="10" y1="6" x2="21" y2="6"></line>
                    <line x1="10" y1="12" x2="21" y2="12"></line>
                    <line x1="10" y1="18" x2="21" y2="18"></line>
                    <polyline points="3 6 4 7 7 4"></polyline>
                    <polyline points="3 12 4 13 7 10"></polyline>
                    <polyline points="3 18 4 19 7 16"></polyline>
                  </svg>
                </div>
                <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>Admission Requirements</h3>
              </div>

              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '24px' }}>
                Prospective students must provide the following documentation during registration to qualify for academic reviews:
              </p>

              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.92rem', color: '#334155' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Check size={18} color="#F5A623" strokeWidth={2.8} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>GCE Advanced Level</strong> (minimum 2 papers) or equivalent.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Check size={18} color="#F5A623" strokeWidth={2.8} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>Clear scanned copy of National ID card or Passport.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Check size={18} color="#F5A623" strokeWidth={2.8} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>Copy of High School transcripts / GCE Ordinary Level.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Check size={18} color="#F5A623" strokeWidth={2.8} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span>Statement of purpose / letter of interest for software engineering/cybersecurity.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <Check size={18} color="#F5A623" strokeWidth={2.8} style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span><strong>Tuition / Registration Payment Clearance:</strong> All registrations are complete only after the applicant has completed payment.</span>
                </li>
              </ul>

              <div style={{ background: '#FEF3C7', borderLeft: '4px solid #D97706', padding: '14px 16px', borderRadius: '6px', marginTop: '20px', color: '#92400E', fontSize: '0.86rem', lineHeight: '1.5' }}>
                <strong>⚠️ ENROLLMENT COMPLETION POLICY:</strong><br/>
                All registrations and lab workstation reservations are complete only after the applicant has completed payment.
              </div>
            </div>
          </div>

          {/* Card 2: Transparent Tuition & Institutional Fee Schedule */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <CreditCard size={24} color="#F5A623" />
                <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.45rem', fontWeight: 800 }}>Institutional Tuition Schedule</h3>
              </div>

              <p style={{ color: '#64748B', fontSize: '0.94rem', lineHeight: '1.65', marginBottom: '20px' }}>
                Official fixed tuition fees across all academic departments. Direct, transparent pricing:
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <div>
                    <strong style={{ color: '#081F3E', fontSize: '0.92rem', display: 'block' }}>Higher National Diploma (HND)</strong>
                    <span style={{ color: '#64748B', fontSize: '0.82rem' }}>2 Academic Years • National Exam</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '1.05rem' }}>250,000 XAF <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/yr</span></span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <div>
                    <strong style={{ color: '#081F3E', fontSize: '0.92rem', display: 'block' }}>National Diploma (ND)</strong>
                    <span style={{ color: '#64748B', fontSize: '0.82rem' }}>1 Academic Year • Foundation</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '1.05rem' }}>150,000 XAF <span style={{ fontSize: '0.75rem', fontWeight: 500, color: '#64748B' }}>/yr</span></span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <div>
                    <strong style={{ color: '#081F3E', fontSize: '0.92rem', display: 'block' }}>Professional Certifications</strong>
                    <span style={{ color: '#64748B', fontSize: '0.82rem' }}>6 to 9 Months • DevOps &amp; Data</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#081F3E', fontSize: '1.05rem' }}>350,000 XAF</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <div>
                    <strong style={{ color: '#081F3E', fontSize: '0.92rem', display: 'block' }}>Application &amp; Registration Fee</strong>
                    <span style={{ color: '#64748B', fontSize: '0.82rem' }}>One-time processing fee</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#10B981', fontSize: '1.05rem' }}>10,000 XAF</span>
                </div>
              </div>
            </div>

            {/* Direct Admissions Call to Action Banner */}
            <div 
              style={{
                background: '#081F3E',
                borderRadius: '12px',
                padding: '20px 24px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.78rem', color: '#F5A623', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                  Direct Admissions
                </span>
                <h4 style={{ color: '#FFFFFF', margin: '2px 0', fontSize: '1.25rem', fontWeight: 800 }}>
                  Ready to Begin?
                </h4>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Complete registration below to reserve your cohort lab station.
                </span>
              </div>

              <a href="#apply" className="btn btn-primary" style={{ padding: '10px 18px', fontSize: '0.88rem' }}>
                Apply Now <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* 2. ADMISSIONS / PORTAL SECTION */}
        <section id="apply">
          {/* If Student is Logged in -> Render Student Dashboard */}
          {student ? (
            <div className="premium-card" style={{ maxWidth: '800px', margin: '0 auto', borderTop: '6px solid #10B981' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid rgba(15,23,42,0.08)' }}>
                <div>
                  <span className="course-badge" style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}>
                    Authenticated Student Portal
                  </span>
                  <h2 style={{ color: '#081F3E', marginTop: '6px', fontSize: '1.8rem' }}>
                    Welcome, {student.full_name}
                  </h2>
                </div>
                <button
                  onClick={() => setStudent(null)}
                  className="btn btn-secondary"
                  style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)', padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <LogOut size={16} /> Logout
                </button>
              </div>

              {/* Status Row */}
              <div className="grid-3" style={{ marginBottom: '30px' }}>
                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Application ID</span>
                  <strong style={{ color: '#081F3E', fontFamily: 'var(--font-mono)', fontSize: '1.1rem' }}>
                    #LIAH-{student.id}
                  </strong>
                </div>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Admission Status</span>
                  <span 
                    style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      background: student.admission_status === 'Approved' ? 'rgba(16,185,129,0.15)' : 'rgba(245,166,35,0.15)',
                      color: student.admission_status === 'Approved' ? '#10B981' : '#B45309'
                    }}
                  >
                    {student.admission_status}
                  </span>
                </div>

                <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.06)' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '4px' }}>Payment Status</span>
                  <span 
                    style={{ 
                      padding: '4px 10px', 
                      borderRadius: '4px', 
                      fontSize: '0.85rem', 
                      fontWeight: 700,
                      background: student.payment_status === 'Paid' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)',
                      color: student.payment_status === 'Paid' ? '#10B981' : '#DC2626'
                    }}
                  >
                    {student.payment_status}
                  </span>
                </div>
              </div>

              {/* Student Details Card */}
              <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '10px', marginBottom: '30px' }}>
                <h4 style={{ color: '#081F3E', marginBottom: '16px', fontSize: '1.1rem' }}>Academic Record</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.9rem' }}>
                  <div>
                    <span style={{ color: '#64748B' }}>Enrolled Program:</span>
                    <p style={{ fontWeight: 700, color: '#081F3E', margin: '2px 0 0 0' }}>{student.program_type}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Degree Category:</span>
                    <p style={{ fontWeight: 700, color: '#081F3E', margin: '2px 0 0 0' }}>{student.degree_type}</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Institution Campus:</span>
                    <p style={{ fontWeight: 700, color: '#081F3E', margin: '2px 0 0 0' }}>Buea Main Campus</p>
                  </div>
                  <div>
                    <span style={{ color: '#64748B' }}>Email Contact:</span>
                    <p style={{ fontWeight: 700, color: '#081F3E', margin: '2px 0 0 0' }}>{student.email}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                {student.payment_status !== 'Paid' && (
                  <button onClick={() => setShowCheckout(true)} className="btn btn-primary">
                    <CreditCard size={18} /> Pay Semester Deposit (MoMo)
                  </button>
                )}
                <a href="/assets/images/flyer_engineering.png" download="Liah_Prospectus.png" className="btn btn-secondary" style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}>
                  <Download size={18} /> Download Program Syllabus
                </a>
              </div>
            </div>
          ) : (
            /* TAB SWITCHER: Register vs Login */
            <div className="premium-card" style={{ maxWidth: '720px', margin: '0 auto', padding: '36px' }}>
              
              {/* Tab selector buttons */}
              <div style={{ display: 'flex', borderBottom: '1px solid rgba(15,23,42,0.1)', marginBottom: '28px' }}>
                <button
                  onClick={() => setActiveTab('register')}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: 'none',
                    background: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: activeTab === 'register' ? '#081F3E' : '#64748B',
                    borderBottom: activeTab === 'register' ? '3px solid #F5A623' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <UserPlus size={18} /> Register / Sign Up
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  style={{
                    flex: 1,
                    padding: '14px',
                    border: 'none',
                    background: 'none',
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: activeTab === 'login' ? '#081F3E' : '#64748B',
                    borderBottom: activeTab === 'login' ? '3px solid #F5A623' : '3px solid transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <LogIn size={18} /> Student Portal Login
                </button>
              </div>

              {/* REGISTER TAB (Multi-Step Form) */}
              {activeTab === 'register' ? (
                <div>
                  {/* Pre-fill Notification Banner */}
                  {prefilledMessage && (
                    <div style={{ 
                      background: '#FEF3C7', 
                      border: '1px solid rgba(245, 166, 35, 0.4)', 
                      padding: '12px 16px', 
                      borderRadius: '8px', 
                      marginBottom: '20px', 
                      color: '#B45309', 
                      fontWeight: 700, 
                      fontSize: '0.88rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px' 
                    }}>
                      <Sparkles size={18} color="#B45309" />
                      <span>{prefilledMessage} (Form pre-filled)</span>
                    </div>
                  )}

                  {/* Registration Completion Notice */}
                  <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', padding: '10px 14px', borderRadius: '8px', marginBottom: '20px', color: '#92400E', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>⚠️ Notice: All registrations are complete only after the applicant has completed payment.</span>
                  </div>

                  {/* Step indicators */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 1 ? '#081F3E' : '#E2E8F0', color: currentStep >= 1 ? '#F5A623' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>1</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: currentStep === 1 ? '#081F3E' : '#64748B' }}>Personal Details</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 2 ? '#081F3E' : '#E2E8F0', color: currentStep >= 2 ? '#F5A623' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>2</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: currentStep === 2 ? '#081F3E' : '#64748B' }}>Program Selection</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 3 ? '#081F3E' : '#E2E8F0', color: currentStep >= 3 ? '#F5A623' : '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>3</span>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: currentStep === 3 ? '#081F3E' : '#64748B' }}>Submit &amp; Review</span>
                    </div>
                  </div>

                  {regError && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} /> {regError}
                    </div>
                  )}

                  <form onSubmit={handleRegisterSubmit}>
                    {/* Step 1: Personal Details */}
                    {currentStep === 1 && (
                      <div>
                        <div className="form-group">
                          <label htmlFor="reg_applicant_fullname">Full Legal Name *</label>
                          <input
                            id="reg_applicant_fullname"
                            name="full_name"
                            type="text"
                            className="form-input-light"
                            required
                            placeholder="e.g. John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label htmlFor="reg_applicant_email">Email Address *</label>
                            <input
                              id="reg_applicant_email"
                              name="email"
                              type="email"
                              className="form-input-light"
                              required
                              placeholder="e.g. john@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>

                          <div className="form-group">
                            <label htmlFor="reg_applicant_phone">WhatsApp / Phone *</label>
                            <input
                              id="reg_applicant_phone"
                              name="phone"
                              type="tel"
                              className="form-input-light"
                              required
                              placeholder="e.g. +237 670 000 000"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label htmlFor="reg_applicant_password">Create Portal Password *</label>
                          <input
                            id="reg_applicant_password"
                            name="password"
                            type="password"
                            className="form-input-light"
                            required
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!fullName || !email || !phone || !password) {
                                setRegError('Please complete all fields in Step 1.');
                                return;
                              }
                              setRegError('');
                              setCurrentStep(2);
                            }}
                            className="btn btn-primary"
                          >
                            Next Step <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 2: Program & Format */}
                    {currentStep === 2 && (
                      <div>
                        <div className="form-group">
                          <label>Degree Level *</label>
                          <select
                            className="form-input-light"
                            value={degreeType}
                            onChange={(e) => {
                              const deg = e.target.value;
                              setDegreeType(deg);
                              setProgramType(programOptions[deg]?.[0] || '');
                            }}
                          >
                            <option value="HND">Higher National Diploma (HND)</option>
                            <option value="ND">National Diploma (ND)</option>
                            <option value="Certification">Professional Certification</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Program *</label>
                          <select
                            className="form-input-light"
                            value={programType}
                            onChange={(e) => setProgramType(e.target.value)}
                          >
                            {(programOptions[degreeType] || []).map((opt, idx) => (
                              <option key={idx} value={opt}>{opt}</option>
                            ))}
                          </select>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(1)}
                            className="btn btn-secondary"
                            style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(3)}
                            className="btn btn-primary"
                          >
                            Next: Review &amp; Submit <ArrowRight size={16} />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Step 3: Document Uploads & Terms */}
                    {currentStep === 3 && (
                      <div>
                        <div style={{ marginBottom: '20px' }}>
                          <h4 style={{ color: '#081F3E', margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 800 }}>
                            Required Academic Documents ({degreeType})
                          </h4>
                          <p style={{ margin: 0, color: '#64748B', fontSize: '0.86rem' }}>
                            Upload each required file separately below. Accepted formats: PDF, PNG, JPG, DOCX (Max 10MB per file).
                          </p>
                        </div>

                        {/* Multi-Document Slot List */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                          {(docRequirementsByDegree[degreeType] || docRequirementsByDegree['HND']).map((slot) => {
                            const isUploaded = !!uploadedDocs[slot.id];
                            const uploadedInfo = uploadedDocs[slot.id];

                            return (
                              <div
                                key={slot.id}
                                style={{
                                  border: isUploaded ? '1.5px solid #10B981' : '1px solid #E2E8F0',
                                  borderRadius: '10px',
                                  padding: '16px',
                                  background: isUploaded ? 'rgba(16, 185, 129, 0.03)' : '#FFFFFF',
                                  transition: 'all 0.2s ease'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                  <span style={{ fontWeight: 700, color: '#081F3E', fontSize: '0.92rem' }}>
                                    {slot.label}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.72rem',
                                      fontWeight: 800,
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      background: slot.required ? 'rgba(239, 68, 68, 0.1)' : '#F1F5F9',
                                      color: slot.required ? '#DC2626' : '#64748B',
                                      textTransform: 'uppercase'
                                    }}
                                  >
                                    {slot.required ? '* Mandatory' : 'Optional'}
                                  </span>
                                </div>

                                <p style={{ margin: '0 0 12px 0', color: '#64748B', fontSize: '0.82rem', lineHeight: '1.4' }}>
                                  {slot.hint}
                                </p>

                                {isUploaded ? (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '10px 14px', borderRadius: '6px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                      <FileCheck size={18} color="#059669" />
                                      <div>
                                        <p style={{ margin: 0, fontWeight: 700, color: '#065F46', fontSize: '0.85rem' }}>
                                          {uploadedInfo.fileName}
                                        </p>
                                        <span style={{ color: '#047857', fontSize: '0.75rem' }}>
                                          File attached &bull; {uploadedInfo.size}
                                        </span>
                                      </div>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveDoc(slot.id)}
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#DC2626',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                      }}
                                    >
                                      <Trash2 size={14} /> Remove
                                    </button>
                                  </div>
                                ) : (
                                  <div>
                                    <label
                                      htmlFor={`file-${slot.id}`}
                                      className="btn btn-secondary"
                                      style={{
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        cursor: 'pointer',
                                        fontSize: '0.84rem',
                                        padding: '8px 16px',
                                        color: '#081F3E',
                                        borderColor: 'rgba(15,23,42,0.2)'
                                      }}
                                    >
                                      <UploadCloud size={16} /> Choose &amp; Attach File
                                    </label>
                                    <input
                                      id={`file-${slot.id}`}
                                      type="file"
                                      accept={slot.accept}
                                      style={{ display: 'none' }}
                                      onChange={(e) => handleFileUploadForSlot(slot.id, slot.label, e)}
                                    />
                                    <span style={{ marginLeft: '12px', fontSize: '0.82rem', color: '#94A3B8' }}>
                                      No document selected
                                    </span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Summary & Mandatory Policy Banner */}
                        <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid rgba(15,23,42,0.08)', marginBottom: '16px', fontSize: '0.88rem' }}>
                          <h5 style={{ color: '#081F3E', marginBottom: '8px' }}>Application Summary:</h5>
                          <p style={{ margin: '4px 0', color: '#475569' }}>Applicant: <strong>{fullName}</strong></p>
                          <p style={{ margin: '4px 0', color: '#475569' }}>Selected Program: <strong>{programType}</strong> ({degreeType})</p>
                          <p style={{ margin: '4px 0', color: '#475569' }}>
                            Attached Files: <strong>{Object.keys(uploadedDocs).length} uploaded</strong>
                          </p>
                        </div>

                        <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', padding: '10px 14px', borderRadius: '6px', marginBottom: '20px', color: '#92400E', fontSize: '0.82rem', lineHeight: '1.4' }}>
                          <strong>⚠️ Notice:</strong> All registrations are complete only after the applicant has completed payment.
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                          <button
                            type="button"
                            onClick={() => setCurrentStep(2)}
                            className="btn btn-secondary"
                            style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}
                          >
                            <ArrowLeft size={16} /> Back
                          </button>
                          <button
                            type="submit"
                            disabled={regLoading}
                            className="btn btn-primary"
                          >
                            {regLoading ? 'Submitting Application & Files...' : 'Submit Application & Continue to Payment'}
                          </button>
                        </div>
                      </div>
                    )}
                  </form>
                </div>
              ) : (
                /* LOGIN TAB */
                <div>
                  {loginError && (
                    <div style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertCircle size={18} /> {loginError}
                    </div>
                  )}

                  <form onSubmit={handleLoginSubmit}>
                    <div className="form-group">
                      <label htmlFor="admissions_login_email">Registered Email Address *</label>
                      <input
                        id="admissions_login_email"
                        name="login_email"
                        type="email"
                        className="form-input-light"
                        required
                        placeholder="e.g. yourname@example.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="admissions_login_password">Portal Password *</label>
                      <input
                        id="admissions_login_password"
                        name="login_password"
                        type="password"
                        className="form-input-light"
                        required
                        placeholder="Your password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loginLoading}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '14px', marginTop: '10px' }}
                    >
                      {loginLoading ? 'Authenticating...' : 'Access Student Dashboard'}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </section>

        {/* 3. CAMPAY / MOMO CHECKOUT MODAL */}
        {showCheckout && student && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              background: 'rgba(4, 16, 33, 0.85)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
          >
            <div className="premium-card" style={{ maxWidth: '480px', width: '100%', padding: '32px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span className="course-badge" style={{ background: 'rgba(245,166,35,0.15)', color: '#F5A623' }}>
                  Campay Payment Gateway
                </span>
                <h3 style={{ color: '#081F3E', marginTop: '8px', fontSize: '1.4rem' }}>
                  Complete Admission Deposit
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Enter your MTN or Orange Mobile Money phone number to confirm your student enrollment seat.
                </p>
              </div>

              {payError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} />
                  <span>{payError}</span>
                </div>
              )}

              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <CheckCircle size={54} color="#10B981" style={{ margin: '0 auto 12px auto' }} />
                  <h4 style={{ color: '#081F3E', fontSize: '1.3rem', fontWeight: 800 }}>Payment Confirmed &amp; Verified!</h4>
                  <p style={{ color: '#059669', fontSize: '0.92rem', fontWeight: 600, marginTop: '4px' }}>
                    Welcome to Liah Academy! Your enrollment and lab seat are now fully secured.
                  </p>
                </div>
              ) : payPollActive ? (
                <div style={{ textAlign: 'center', padding: '16px 0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                    <Smartphone size={32} color="#F5A623" />
                  </div>
                  <h4 style={{ color: '#081F3E', fontSize: '1.2rem', marginBottom: '8px' }}>
                    USSD Prompt Dispatched!
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', lineHeight: '1.5', marginBottom: '18px' }}>
                    Please check your phone (<strong>{payPhone || student?.phone}</strong>) and authorize the prompt by entering your <strong>Mobile Money PIN</strong>.
                  </p>
                  
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', padding: '10px 18px', borderRadius: '20px', border: '1px solid #E2E8F0', fontSize: '0.85rem', color: '#64748B' }}>
                    <Loader2 size={16} className="animate-spin" color="#081F3E" />
                    <span>Awaiting PIN clearance from network operator...</span>
                  </div>

                  <div style={{ marginTop: '24px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setPayPollActive(false);
                        setPayReference(null);
                      }}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', color: '#64748B' }}
                    >
                      Cancel / Change Phone Number
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleCampayPayment}>
                  <div className="form-group">
                    <label htmlFor="campay_checkout_phone">Mobile Money Phone Number (MTN / Orange) *</label>
                    <input
                      id="campay_checkout_phone"
                      name="campay_phone"
                      type="tel"
                      className="form-input-light"
                      required
                      placeholder="e.g. 670 123 456"
                      value={payPhone || student?.phone || ''}
                      onChange={(e) => setPayPhone(e.target.value)}
                    />
                  </div>

                  <div style={{ background: '#F8FAFC', padding: '14px', borderRadius: '8px', fontSize: '0.86rem', color: '#475569', marginBottom: '20px', border: '1px solid #E2E8F0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span>Fee Item:</span>
                      <strong style={{ color: '#081F3E' }}>Seat Reservation Deposit</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Amount Due:</span>
                      <strong style={{ color: '#081F3E', fontSize: '1.05rem' }}>50,000 XAF</strong>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="btn btn-secondary"
                      style={{ flex: 1, color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}
                    >
                      Pay Later
                    </button>
                    <button
                      type="submit"
                      disabled={payLoading}
                      className="btn btn-primary"
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {payLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Contacting Campay...</span>
                        </>
                      ) : (
                        <>
                          <CreditCard size={16} />
                          <span>Pay with Mobile Money</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function AdmissionsPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 0', textAlign: 'center', color: '#081F3E', fontWeight: 700 }}>
        Loading Admissions Portal...
      </div>
    }>
      <AdmissionsContent />
    </Suspense>
  );
}
