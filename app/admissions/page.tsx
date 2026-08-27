'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Calculator, UserCheck, ShieldCheck, CreditCard, 
  CheckCircle, FileText, Lock, ArrowRight, ArrowLeft, 
  LogIn, UserPlus, LogOut, Download, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Trash2, Paperclip, Smartphone, Loader2, Copy, Image as ImageIcon
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
      hint: 'Scanned original GCE A-Level slip showing minimum of 2 papers passed.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level Certificate',
      required: true,
      hint: 'Scanned GCE O-Level slip with at least 4 passes including English & Mathematics.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'birth_cert',
      label: 'Birth Certificate Copy',
      required: true,
      hint: 'Clear photocopy or scan of official municipal birth certificate.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'id_card',
      label: 'National Identity Card (CNI) or Passport',
      required: false,
      hint: 'Valid national ID card or passport data page.',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ],
  ND: [
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level / CAP / Probatoire Certificate',
      required: true,
      hint: 'Scanned GCE O-Level or technical equivalent certificate.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'birth_cert',
      label: 'Birth Certificate Copy',
      required: true,
      hint: 'Clear photocopy or scan of official municipal birth certificate.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'id_card',
      label: 'National Identity Card (CNI) or School ID',
      required: false,
      hint: 'Valid ID card or academic badge.',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ],
  Certification: [
    {
      id: 'highest_cert',
      label: 'Highest Academic / Professional Credential',
      required: true,
      hint: 'GCE A/L, HND, BSc, or relevant work certificate.',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'id_card',
      label: 'National ID Card or Passport',
      required: true,
      hint: 'Valid identification document.',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ]
};

function AdmissionsContent() {
  const searchParams = useSearchParams();
  const degreeParam = searchParams.get('degree');
  const programParam = searchParams.get('program');

  // Application Form State
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register');
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [degreeType, setDegreeType] = useState<'HND' | 'ND' | 'Certification'>('HND');
  const [programType, setProgramType] = useState('Software Engineering HND');
  const [studyFormat, setStudyFormat] = useState('oncampus');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; size: string; label: string; url?: string }>>({});
  const [agreeTerms, setAgreeTerms] = useState(false);
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

  // Direct Mobile Money Payment & Proof Upload State
  const [showCheckout, setShowCheckout] = useState(false);
  const [payMethod, setPayMethod] = useState<'MTN' | 'ORANGE'>('MTN');
  const [payAmountOption, setPayAmountOption] = useState<number | 'custom'>(50000);
  const [payCustomAmount, setPayCustomAmount] = useState<string>('');
  const [paySenderPhone, setPaySenderPhone] = useState<string>('');
  const [payTransactionId, setPayTransactionId] = useState<string>('');
  const [payScreenshotFile, setPayScreenshotFile] = useState<File | null>(null);
  const [payScreenshotPreview, setPayScreenshotPreview] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState<string>('');
  const [copiedNumber, setCopiedNumber] = useState(false);

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

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('670265493');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPayScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setPayScreenshotPreview(uploadEvent.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayLoading(true);
    setPayError('');

    const effectiveAmount = payAmountOption === 'custom' 
      ? parseInt(payCustomAmount, 10) 
      : payAmountOption;

    if (!effectiveAmount || isNaN(effectiveAmount) || effectiveAmount <= 0) {
      setPayError('Please enter or select a valid payment amount.');
      setPayLoading(false);
      return;
    }

    if (!payScreenshotPreview && !payScreenshotFile) {
      setPayError('Please attach a screenshot or photo of your Mobile Money transaction confirmation.');
      setPayLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('student_id', String(student?.id || '0'));
      formData.append('amount', String(effectiveAmount));
      formData.append('operator', payMethod === 'MTN' ? 'MTN Mobile Money' : 'Orange Money');
      formData.append('phone', paySenderPhone || student?.phone || '670265493');
      formData.append('transaction_id', payTransactionId);
      formData.append('description', `${payMethod} Payment of ${effectiveAmount.toLocaleString()} XAF for #${student?.id}`);

      if (payScreenshotFile) {
        formData.append('screenshot', payScreenshotFile);
      } else if (payScreenshotPreview) {
        formData.append('proof_url', payScreenshotPreview);
      }

      const res = await fetch('/api/payments/upload-proof', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      setPayLoading(false);

      if (data.success) {
        setPaySuccess(true);
        if (student) {
          setStudent({
            ...student,
            payment_status: 'Pending Verification',
            payment_amount: effectiveAmount,
            payment_proof_url: data.data?.payment?.proof_url || payScreenshotPreview,
            payment_transaction_id: payTransactionId
          });
        }
        setTimeout(() => {
          setShowCheckout(false);
          setPaySuccess(false);
          setPayScreenshotFile(null);
          setPayScreenshotPreview(null);
        }, 4000);
      } else {
        setPayError(data.message || 'Failed to submit proof of payment.');
      }
    } catch {
      setPayLoading(false);
      setPayError('Connection error uploading payment proof. Please try again.');
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
                      background: student.admission_status === 'Approved' ? 'rgba(16,185,129,0.15)' : student.admission_status === 'Rejected' ? 'rgba(239,68,68,0.15)' : 'rgba(245,166,35,0.15)',
                      color: student.admission_status === 'Approved' ? '#10B981' : student.admission_status === 'Rejected' ? '#DC2626' : '#B45309'
                    }}
                  >
                    {student.admission_status || 'Pending Review'}
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
                      background: student.payment_status === 'Paid' 
                        ? 'rgba(16,185,129,0.15)' 
                        : student.payment_status === 'Pending Verification'
                        ? 'rgba(37,99,235,0.15)'
                        : 'rgba(239,68,68,0.15)',
                      color: student.payment_status === 'Paid' 
                        ? '#10B981' 
                        : student.payment_status === 'Pending Verification'
                        ? '#2563EB'
                        : '#DC2626'
                    }}
                  >
                    {student.payment_status === 'Pending Verification' ? '⏳ Verification Pending' : student.payment_status || 'Pending'}
                  </span>
                </div>
              </div>

              {/* Payment Proof Notification if Pending Verification */}
              {student.payment_status === 'Pending Verification' && (
                <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '16px', borderRadius: '10px', marginBottom: '24px', color: '#1E40AF', fontSize: '0.9rem', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <ShieldCheck size={22} color="#2563EB" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', marginBottom: '4px', fontSize: '0.95rem' }}>Payment Proof Under Review</strong>
                    <p style={{ margin: 0, lineHeight: '1.5', color: '#1E3A8A' }}>
                      Your payment proof of <strong>{(student.payment_amount || 50000).toLocaleString()} XAF</strong> has been successfully uploaded and is undergoing verification by the Liah Academy Finance Office. Your enrollment status will automatically update to <strong>Approved</strong> upon approval.
                    </p>
                  </div>
                </div>
              )}

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
                  <button onClick={() => setShowCheckout(true)} className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <CreditCard size={18} /> 
                    {student.payment_status === 'Pending Verification' ? 'Upload Updated Payment Proof' : 'Pay via Mobile Money (670265493)'}
                  </button>
                )}
                <a href="/assets/images/flyer_engineering.png" download="Liah_Prospectus.png" className="btn btn-secondary" style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
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
                              const deg = e.target.value as 'HND' | 'ND' | 'Certification';
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

        {/* 3. DIRECT MOBILE MONEY PAYMENT & PROOF UPLOAD MODAL */}
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
              padding: '16px'
            }}
          >
            <div 
              className="premium-card" 
              style={{ 
                maxWidth: '560px', 
                width: '100%', 
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '30px 26px',
                position: 'relative'
              }}
            >
              {/* Dismiss Button */}
              <button 
                onClick={() => setShowCheckout(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'rgba(15,23,42,0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#64748B'
                }}
              >
                <Trash2 size={16} style={{ display: 'none' }} />
                ✕
              </button>

              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <span className="course-badge" style={{ background: 'rgba(245,166,35,0.15)', color: '#B45309' }}>
                  Mobile Money Direct Transfer
                </span>
                <h3 style={{ color: '#081F3E', marginTop: '8px', fontSize: '1.35rem', fontWeight: 800 }}>
                  Tuition &amp; Fee Payment Directives
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '4px 0 0 0' }}>
                  Follow the dialing directives to transfer payment to our official account, then upload your transaction screenshot for instant verification.
                </p>
              </div>

              {payError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{payError}</span>
                </div>
              )}

              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <CheckCircle size={56} color="#10B981" style={{ margin: '0 auto 14px auto' }} />
                  <h4 style={{ color: '#081F3E', fontSize: '1.35rem', fontWeight: 800 }}>Proof of Payment Submitted!</h4>
                  <p style={{ color: '#059669', fontSize: '0.92rem', fontWeight: 600, marginTop: '6px', lineHeight: '1.5' }}>
                    Thank you! Your payment proof for Application <strong>#LIAH-{student.id}</strong> has been logged. Our administration is verifying your transaction.
                  </p>
                  <div style={{ marginTop: '16px', background: '#F8FAFC', padding: '12px', borderRadius: '8px', fontSize: '0.82rem', color: '#64748B' }}>
                    Redirecting to your student dashboard...
                  </div>
                </div>
              ) : (
                <form onSubmit={handleProofSubmit}>
                  
                  {/* Official Account Banner */}
                  <div style={{ 
                    background: 'linear-gradient(135deg, #081F3E 0%, #0F3A75 100%)', 
                    borderRadius: '12px', 
                    padding: '16px 20px', 
                    color: '#FFFFFF',
                    marginBottom: '20px',
                    boxShadow: '0 4px 15px rgba(8,31,62,0.15)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#F5A623', fontWeight: 700 }}>
                          Official Recipient Account
                        </span>
                        <div style={{ fontSize: '1.45rem', fontWeight: 900, letterSpacing: '0.04em', margin: '2px 0', fontFamily: 'var(--font-mono)' }}>
                          670 265 493
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#CBD5E1' }}>
                          Account Name: <strong>Liah Academy / Tech Division</strong>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleCopyNumber}
                        style={{
                          background: copiedNumber ? '#10B981' : 'rgba(255,255,255,0.15)',
                          border: '1px solid rgba(255,255,255,0.3)',
                          color: '#FFFFFF',
                          padding: '8px 14px',
                          borderRadius: '8px',
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {copiedNumber ? <Check size={14} /> : <Copy size={14} />}
                        <span>{copiedNumber ? 'Copied!' : 'Copy Number'}</span>
                      </button>
                    </div>
                  </div>

                  {/* 1. Payment Amount Preset Selection */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '8px' }}>
                      Select Payment Item / Amount:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPayAmountOption(10000)}
                        style={{
                          background: payAmountOption === 10000 ? '#081F3E' : '#F8FAFC',
                          color: payAmountOption === 10000 ? '#FFFFFF' : '#081F3E',
                          border: payAmountOption === 10000 ? '2px solid #081F3E' : '1px solid #E2E8F0',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        10,000 XAF <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>Application Fee</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayAmountOption(50000)}
                        style={{
                          background: payAmountOption === 50000 ? '#081F3E' : '#F8FAFC',
                          color: payAmountOption === 50000 ? '#FFFFFF' : '#081F3E',
                          border: payAmountOption === 50000 ? '2px solid #081F3E' : '1px solid #E2E8F0',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        50,000 XAF <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>Seat Deposit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayAmountOption(125000)}
                        style={{
                          background: payAmountOption === 125000 ? '#081F3E' : '#F8FAFC',
                          color: payAmountOption === 125000 ? '#FFFFFF' : '#081F3E',
                          border: payAmountOption === 125000 ? '2px solid #081F3E' : '1px solid #E2E8F0',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        125,000 XAF <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>HND Semester 1</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayAmountOption('custom')}
                        style={{
                          background: payAmountOption === 'custom' ? '#081F3E' : '#F8FAFC',
                          color: payAmountOption === 'custom' ? '#FFFFFF' : '#081F3E',
                          border: payAmountOption === 'custom' ? '2px solid #081F3E' : '1px solid #E2E8F0',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          textAlign: 'left'
                        }}
                      >
                        Custom Amount <span style={{ display: 'block', fontSize: '0.7rem', opacity: 0.8, fontWeight: 500 }}>Enter other amount</span>
                      </button>
                    </div>

                    {payAmountOption === 'custom' && (
                      <div style={{ marginTop: '10px' }}>
                        <input
                          type="number"
                          placeholder="e.g. 75000"
                          value={payCustomAmount}
                          onChange={(e) => setPayCustomAmount(e.target.value)}
                          className="form-input-light"
                          style={{ width: '100%', padding: '10px 14px' }}
                          required
                        />
                      </div>
                    )}
                  </div>

                  {/* 2. Directives Tab Switcher (MTN vs Orange) */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setPayMethod('MTN')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: payMethod === 'MTN' ? '2px solid #F59E0B' : '1px solid #E2E8F0',
                          background: payMethod === 'MTN' ? '#FEF3C7' : '#FFFFFF',
                          color: payMethod === 'MTN' ? '#92400E' : '#64748B',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Smartphone size={16} /> MTN Mobile Money (*126#)
                      </button>

                      <button
                        type="button"
                        onClick={() => setPayMethod('ORANGE')}
                        style={{
                          flex: 1,
                          padding: '10px',
                          borderRadius: '8px',
                          border: payMethod === 'ORANGE' ? '2px solid #EA580C' : '1px solid #E2E8F0',
                          background: payMethod === 'ORANGE' ? '#FFEDD5' : '#FFFFFF',
                          color: payMethod === 'ORANGE' ? '#9A3412' : '#64748B',
                          fontWeight: 800,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Smartphone size={16} /> Orange Money (#150#)
                      </button>
                    </div>

                    {/* Step-by-Step Instructions Box */}
                    <div style={{ 
                      background: payMethod === 'MTN' ? '#FFFBEB' : '#FFF7ED', 
                      border: payMethod === 'MTN' ? '1px solid #FDE68A' : '1px solid #FED7AA', 
                      borderRadius: '10px', 
                      padding: '14px 16px',
                      fontSize: '0.84rem',
                      lineHeight: '1.6',
                      color: '#081F3E'
                    }}>
                      <div style={{ fontWeight: 800, marginBottom: '6px', color: payMethod === 'MTN' ? '#B45309' : '#C2410C', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span>Dial Directives for {payMethod === 'MTN' ? 'MTN MoMo' : 'Orange Money'}:</span>
                      </div>

                      {payMethod === 'MTN' ? (
                        <ol style={{ paddingLeft: '18px', margin: 0 }}>
                          <li>Dial <strong>*126#</strong> on your mobile phone.</li>
                          <li>Select <strong>1 (Transfer money)</strong> ➔ <strong>1 (To MTN number)</strong>.</li>
                          <li>Enter recipient number: <strong>670265493</strong>.</li>
                          <li>Enter amount: <strong>{(payAmountOption === 'custom' ? payCustomAmount : payAmountOption) || 50000} XAF</strong>.</li>
                          <li>Enter reason / reference: <strong>LIAH-{student?.id || 'ID'}</strong>.</li>
                          <li>Enter your <strong>MoMo PIN</strong> to authorize the transfer.</li>
                        </ol>
                      ) : (
                        <ol style={{ paddingLeft: '18px', margin: 0 }}>
                          <li>Dial <strong>#150#</strong> on your mobile phone.</li>
                          <li>Select <strong>1 (Transfer money)</strong> ➔ <strong>1 (To Orange number)</strong>.</li>
                          <li>Enter recipient number: <strong>670265493</strong>.</li>
                          <li>Enter amount: <strong>{(payAmountOption === 'custom' ? payCustomAmount : payAmountOption) || 50000} XAF</strong>.</li>
                          <li>Enter your <strong>Orange Money PIN</strong> to authorize the transfer.</li>
                        </ol>
                      )}
                    </div>
                  </div>

                  {/* 3. Upload Screenshot & Details */}
                  <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0', marginBottom: '20px' }}>
                    <h5 style={{ color: '#081F3E', margin: '0 0 10px 0', fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <UploadCloud size={16} color="#081F3E" /> Upload Payment Screenshot / Receipt *
                    </h5>

                    {/* Screenshot File Input Area */}
                    <div style={{ marginBottom: '12px' }}>
                      <label 
                        htmlFor="payment_proof_upload"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          padding: '16px',
                          border: '2px dashed rgba(15,23,42,0.2)',
                          borderRadius: '8px',
                          background: '#FFFFFF',
                          cursor: 'pointer',
                          textAlign: 'center'
                        }}
                      >
                        <ImageIcon size={24} color="#64748B" />
                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E' }}>
                          {payScreenshotFile ? payScreenshotFile.name : 'Click to select transaction screenshot (PNG, JPG, PDF)'}
                        </span>
                        <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                          Take a screenshot of the confirmation SMS or MoMo receipt app screen
                        </span>
                        <input
                          id="payment_proof_upload"
                          type="file"
                          accept=".png,.jpg,.jpeg,.webp,.pdf"
                          onChange={handleScreenshotChange}
                          style={{ display: 'none' }}
                        />
                      </label>
                    </div>

                    {/* Live Preview Thumbnail if attached */}
                    {payScreenshotPreview && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #CBD5E1', marginBottom: '12px' }}>
                        {payScreenshotPreview.startsWith('data:image') ? (
                          <img src={payScreenshotPreview} alt="Proof preview" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <FileCheck size={28} color="#10B981" />
                        )}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#081F3E', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {payScreenshotFile?.name || 'Payment_Proof_Screenshot'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>Ready to verify</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setPayScreenshotFile(null);
                            setPayScreenshotPreview(null);
                          }}
                          style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Optional Transaction ID & Phone */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                          Transaction ID / Ref (Optional)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. MP260827.1234"
                          value={payTransactionId}
                          onChange={(e) => setPayTransactionId(e.target.value)}
                          className="form-input-light"
                          style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem' }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748B', marginBottom: '4px' }}>
                          Sender Phone Number
                        </label>
                        <input
                          type="tel"
                          placeholder="e.g. 670 123 456"
                          value={paySenderPhone || student?.phone || ''}
                          onChange={(e) => setPaySenderPhone(e.target.value)}
                          className="form-input-light"
                          style={{ width: '100%', padding: '8px 10px', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Submission Action Buttons */}
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="btn btn-secondary"
                      style={{ flex: 1, color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)', padding: '12px' }}
                    >
                      Pay Later
                    </button>
                    
                    <button
                      type="submit"
                      disabled={payLoading}
                      className="btn btn-primary"
                      style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px' }}
                    >
                      {payLoading ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Uploading Proof...</span>
                        </>
                      ) : (
                        <>
                          <UploadCloud size={16} />
                          <span>Submit Proof for Verification</span>
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
