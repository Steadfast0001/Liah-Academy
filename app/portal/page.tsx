'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  UserCheck, ShieldCheck, CreditCard, CheckCircle, 
  LogIn, LogOut, Download, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Smartphone, Loader2, Copy, Image as ImageIcon,
  Clock, Printer, Building, Mail, MapPin, ArrowRight, Lock, Zap
} from 'lucide-react';
import { compressImageFile } from '../../lib/imageOptimizer';

const getApplicationFee = (deg?: string): number => {
  if (!deg) return 15000;
  const upper = String(deg).toUpperCase();
  if (upper.includes('CERT')) return 25000;
  return 15000;
};

function StudentPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Logged-in Student Session State
  const [student, setStudent] = useState<any>(null);
  const [showAdmissionLetterModal, setShowAdmissionLetterModal] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Direct Mobile Money Payment & Proof Upload State
  const [showCheckout, setShowCheckout] = useState(false);
  const [payAmountOption, setPayAmountOption] = useState<number>(15000);
  const [payCustomAmount, setPayCustomAmount] = useState<string>('');
  const [paySenderPhone, setPaySenderPhone] = useState<string>('');
  const [payTransactionId, setPayTransactionId] = useState<string>('');
  const [payScreenshotFile, setPayScreenshotFile] = useState<File | null>(null);
  const [payScreenshotPreview, setPayScreenshotPreview] = useState<string | null>(null);
  const [payLoading, setPayLoading] = useState(false);
  const [paySuccess, setPaySuccess] = useState(false);
  const [payError, setPayError] = useState('');
  const [copiedNumber, setCopiedNumber] = useState(false);
  const [copiedShortCode, setCopiedShortCode] = useState(false);
  const [shortCodeDialed, setShortCodeDialed] = useState(false);
  const [paymentPhase, setPaymentPhase] = useState<'IDLE' | 'DIALED' | 'CHECKING' | 'CONFIRMED'>('IDLE');
  const [autoCheckLoading, setAutoCheckLoading] = useState(false);
  const [showManualUpload, setShowManualUpload] = useState(false);
  const [showPinPrompt, setShowPinPrompt] = useState(false);
  const [userPin, setUserPin] = useState('');
  const [pinSubmitting, setPinSubmitting] = useState(false);
  const [pinError, setPinError] = useState('');
  const [momoReceipt, setMomoReceipt] = useState<any>(null);

  // Restore authenticated student session on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('liah_student_session') || sessionStorage.getItem('liah_student_session');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed && (parsed.id || parsed.full_name)) {
            setStudent(parsed);
            setPayAmountOption(getApplicationFee(parsed.degree_type));
          }
        }
      }
    } catch {}
  }, []);

  // Handle Student Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const data = await res.json();
      setLoginLoading(false);

      if (data.success && data.student) {
        setStudent(data.student);
        setPayAmountOption(getApplicationFee(data.student.degree_type));
        if (typeof window !== 'undefined') {
          localStorage.setItem('liah_student_session', JSON.stringify(data.student));
          sessionStorage.setItem('liah_student_session', JSON.stringify(data.student));
        }
      } else {
        setLoginError(data.message || 'Invalid email or portal password. Please try again.');
      }
    } catch {
      setLoginLoading(false);
      setLoginError('Connection error. Please check your network and try again.');
    }
  };

  // Handle Logout
  const handleStudentLogout = () => {
    setStudent(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('liah_student_session');
      sessionStorage.removeItem('liah_student_session');
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText('670265493');
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const handleCopyShortCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedShortCode(true);
    setTimeout(() => setCopiedShortCode(false), 2500);
  };

  const handleOpenMoMo = (code: string, amount: number) => {
    setPaymentPhase('DIALED');
    setShortCodeDialed(true);
    setShowManualUpload(false);
    setPayError('');
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    const dialUri = `tel:*126*14*670265493*${amount}%23`;
    window.location.href = dialUri;
  };

  const runAutoCheck = async () => {
    setAutoCheckLoading(true);
    setPayError('');
    const effectiveAmount = payCustomAmount ? (parseInt(payCustomAmount) || 0) : (payAmountOption || getApplicationFee(student?.degree_type));

    try {
      const res = await fetch('/api/payments/momo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student?.id,
          email: student?.email,
          full_name: student?.full_name,
          amount: effectiveAmount,
          phone: paySenderPhone || student?.phone || '670265493',
          pin: userPin || '0000'
        })
      });

      const data = await res.json();
      setAutoCheckLoading(false);

      if (data.success) {
        setPaySuccess(true);
        setPaymentPhase('CONFIRMED');
        setShowPinPrompt(false);
        setMomoReceipt(data.data?.receipt || {
          reference: data.data?.payment?.reference,
          amount: effectiveAmount,
          recipient: '670265493 (Liah Academy)',
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        });

        if (student) {
          const updated = {
            ...student,
            payment_status: 'Paid',
            admission_status: 'Approved',
            payment_amount: effectiveAmount,
            payment_transaction_id: data.data?.payment?.transaction_id
          };
          setStudent(updated);
          localStorage.setItem('liah_student_session', JSON.stringify(updated));
        }
      } else {
        setShowManualUpload(true);
      }
    } catch {
      setAutoCheckLoading(false);
      setShowManualUpload(true);
    }
  };

  const handleAuthorizePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userPin || userPin.length < 4) {
      setPinError('Please enter your 4 or 5-digit Secret MoMo PIN.');
      return;
    }
    setPinSubmitting(true);
    setPinError('');

    const effectiveAmount = payCustomAmount ? (parseInt(payCustomAmount) || 0) : (payAmountOption || getApplicationFee(student?.degree_type));

    try {
      const res = await fetch('/api/payments/momo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student?.id,
          email: student?.email,
          full_name: student?.full_name,
          amount: effectiveAmount,
          phone: paySenderPhone || student?.phone || '670265493',
          pin: userPin
        })
      });

      const data = await res.json();
      setPinSubmitting(false);

      if (data.success) {
        setPaySuccess(true);
        setPaymentPhase('CONFIRMED');
        setShowPinPrompt(false);
        setMomoReceipt(data.data?.receipt || {
          reference: data.data?.payment?.reference,
          amount: effectiveAmount,
          recipient: '670265493 (Liah Academy)',
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        });

        if (student) {
          const updated = {
            ...student,
            payment_status: 'Paid',
            admission_status: 'Approved',
            payment_amount: effectiveAmount,
            payment_transaction_id: data.data?.payment?.transaction_id
          };
          setStudent(updated);
          localStorage.setItem('liah_student_session', JSON.stringify(updated));
        }
      } else {
        setPinError(data.message || 'Payment authentication failed. Please upload screenshot.');
        setShowManualUpload(true);
      }
    } catch {
      setPinSubmitting(false);
      setPinError('Connection error during PIN authorization.');
      setShowManualUpload(true);
    }
  };

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      const maxSlotBytes = 2.5 * 1024 * 1024; // 2.5 MB allocation
      
      // Auto-compress high-resolution camera photos/screenshots instantly
      const file = await compressImageFile(rawFile);
      if (file.size > maxSlotBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(2);
        setPayError(`Selected proof image is ${actualMb} MB, which exceeds the allowed upload allocation of 2.5 MB. Please select or compress your screenshot.`);
        return;
      }
      setPayError('');
      setPayScreenshotFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPayScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleProofSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPayLoading(true);
    setPayError('');

    const effectiveAmount = payCustomAmount ? (parseInt(payCustomAmount) || 0) : (payAmountOption || getApplicationFee(student?.degree_type));

    if (!payScreenshotPreview && !payScreenshotFile) {
      setPayError('Please attach a screenshot or photo of your Mobile Money transaction confirmation.');
      setPayLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('student_id', String(student?.id || '0'));
      formData.append('amount', String(effectiveAmount));
      formData.append('operator', 'MTN Mobile Money');
      formData.append('phone', paySenderPhone || student?.phone || '670265493');
      formData.append('transaction_id', payTransactionId);
      formData.append('description', `MTN MoMo Payment of ${effectiveAmount.toLocaleString()} XAF for #${student?.id}`);

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
        const updatedStudent = student ? {
          ...student,
          payment_status: 'Pending Verification',
          payment_amount: effectiveAmount,
          payment_proof_url: data.data?.payment?.proof_url || payScreenshotPreview,
          payment_transaction_id: payTransactionId
        } : null;

        if (updatedStudent) {
          setStudent(updatedStudent);
          localStorage.setItem('liah_student_session', JSON.stringify(updatedStudent));
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
      <div className="container" style={{ maxWidth: '960px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            display: 'inline-block',
            background: 'rgba(16,185,129,0.12)',
            color: '#059669',
            padding: '4px 12px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 800,
            fontFamily: 'var(--font-mono)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '10px'
          }}>
            LIAH ACADEMY DESK
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', fontWeight: 800, color: '#081F3E', margin: '0 0 10px 0' }}>
            Student Portal
          </h1>
          <p style={{ color: '#64748B', fontSize: '1rem', maxWidth: '640px', margin: '0 auto' }}>
            Log in to monitor your admission decision, download official enrolment dossiers, and manage on-campus tuition settlements.
          </p>
        </div>

        {/* AUTHENTICATED STUDENT DASHBOARD CARD (CLEAN SHAPELESS MODERN LAYOUT) */}
        {student ? (
          <div className="portal-dashboard-main" style={{ maxWidth: '820px', margin: '0 auto', padding: '10px 0' }}>
            
            {/* Header / Logout Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  color: '#10B981', 
                  fontFamily: 'var(--font-mono)', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '6px' 
                }}>
                  AUTHENTICATED STUDENT PORTAL
                </span>
                <h2 style={{ color: '#081F3E', margin: 0, fontSize: '2rem', fontWeight: 800 }}>
                  Welcome, {student.full_name}
                </h2>
              </div>
              <button
                onClick={handleStudentLogout}
                style={{ 
                  background: '#FFFFFF', 
                  border: '1px solid #CBD5E1', 
                  borderRadius: '8px', 
                  color: '#081F3E', 
                  padding: '8px 16px', 
                  fontSize: '0.85rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <LogOut size={15} /> Logout
              </button>
            </div>

            {/* ENROLMENT STATE (CLEAN NO-BOX LAYOUT) */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '6px' }}>
                <Clock size={22} color="#D97706" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div>
                  <h3 style={{ color: student.admission_status === 'Approved' ? '#065F46' : student.admission_status === 'Rejected' ? '#991B1B' : '#92400E', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                    {student.admission_status === 'Approved' ? 'Enrolment Status: Application Approved' : student.admission_status === 'Rejected' ? 'Admission Decision: Not Selected' : 'Enrolment Status: Application Under Review'}
                  </h3>
                  <span style={{ fontSize: '0.88rem', color: '#D97706', fontWeight: 700, display: 'block', marginTop: '2px' }}>
                    Programme: {student.program_type} ({student.degree_type})
                  </span>
                </div>
              </div>
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6', margin: '8px 0 0 0', maxWidth: '740px' }}>
                {student.admission_status === 'Approved' 
                  ? 'Your academic credentials have been verified and approved by the Admissions Board. Please complete your fee settlement to finalize your matriculation dossier.'
                  : student.admission_status === 'Rejected'
                  ? 'Thank you for your application. We regret to inform you that our admissions committee was unable to offer admission for this intake.'
                  : 'Your academic documents and application credentials have been received. Our Admissions Board is currently reviewing your file. You can log into this portal at any time to monitor the progress of your application.'}
              </p>
            </div>

            {/* STATUS METRICS (CLEAN NO-BOX COLUMNS) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '36px' }}>
              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Student Matricule
                </span>
                <strong style={{ color: '#081F3E', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800 }}>
                  {student.matricule || `PC26WD${String(student.id || '001').padStart(3, '0')}`}
                </strong>
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Admission Decision
                </span>
                <span 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 12px', 
                    borderRadius: '4px', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    background: student.admission_status === 'Approved' ? '#ECFDF5' : student.admission_status === 'Rejected' ? '#FEF2F2' : '#FEF3C7',
                    color: student.admission_status === 'Approved' ? '#059669' : student.admission_status === 'Rejected' ? '#DC2626' : '#B45309'
                  }}
                >
                  {student.admission_status === 'Approved' ? '✓ Approved' : student.admission_status === 'Rejected' ? '✗ Rejected' : '⏳ Under Review'}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Application Fee
                </span>
                <span 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 12px', 
                    borderRadius: '4px', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    background: student.payment_status === 'Paid' ? '#ECFDF5' : '#FEF2F2',
                    color: student.payment_status === 'Paid' ? '#059669' : '#DC2626'
                  }}
                >
                  {student.payment_status === 'Paid' ? 'Paid' : 'Pending Payment'}
                </span>
              </div>
            </div>

            {/* ACADEMIC RECORD (CLEAN NO-BOX ROWS) */}
            <div style={{ marginBottom: '36px' }}>
              <h4 style={{ color: '#081F3E', margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800 }}>
                Academic Record
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '16px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Enrolled Program:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.program_type}</p>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Degree Category:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.degree_type}</p>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Institution Campus:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>Bakweri Town Campus, Buea</p>
                </div>
              </div>
              <div>
                <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Email Contact:</span>
                <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.email}</p>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {student.payment_status !== 'Paid' && (
                <button 
                  onClick={() => setShowCheckout(true)} 
                  style={{ 
                    background: '#F5A623', 
                    color: '#081F3E', 
                    fontWeight: 800,
                    padding: '12px 24px',
                    borderRadius: '8px',
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    boxShadow: '0 4px 12px rgba(245, 166, 35, 0.25)'
                  }}
                >
                  <CreditCard size={18} /> 
                  Pay via Mobile Money (670265493)
                </button>
              )}
              <button
                type="button"
                onClick={() => setShowAdmissionLetterModal(true)}
                style={{
                  background: '#FFFFFF',
                  color: '#081F3E',
                  border: '1px solid #CBD5E1',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontWeight: 700,
                  padding: '12px 24px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                <Download size={18} /> Download Admission Form
              </button>
            </div>
          </div>
        ) : (
          /* LOGIN CARD WHEN NOT AUTHENTICATED */
          <div className="premium-card" style={{ maxWidth: '520px', margin: '0 auto', padding: '40px 36px' }}>
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(8, 31, 62, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <Lock size={24} color="#081F3E" />
              </div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#081F3E', margin: '0 0 6px 0' }}>
                Portal Authentication
              </h2>
              <p style={{ color: '#64748B', fontSize: '0.88rem', margin: 0 }}>
                Enter your registered applicant credentials below.
              </p>
            </div>

            {loginError && (
              <div style={{ background: 'rgba(239,68,68,0.1)', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit}>
              <div className="form-group" style={{ marginBottom: '18px' }}>
                <label htmlFor="portal_login_email" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                  Registered Email Address *
                </label>
                <input
                  id="portal_login_email"
                  name="login_email"
                  type="email"
                  className="form-input-light"
                  required
                  placeholder="e.g. yourname@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label htmlFor="portal_login_password" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                  Portal Password *
                </label>
                <input
                  id="portal_login_password"
                  name="login_password"
                  type="password"
                  className="form-input-light"
                  required
                  placeholder="Your portal password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="btn btn-primary"
                style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px' }}
              >
                {loginLoading ? 'Authenticating...' : 'Access Student Dashboard'}
              </button>
            </form>

            <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
              <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '0 0 10px 0' }}>
                Don&apos;t have an application account yet?
              </p>
              <Link 
                href="/admissions#apply"
                style={{ color: '#0284C7', fontWeight: 800, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
              >
                Start Enrolment Application <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        )}

        {/* DIRECT MTN MOBILE MONEY CHECKOUT MODAL */}
        {showCheckout && (
          <div 
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(4, 16, 33, 0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              backdropFilter: 'blur(6px)'
            }}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '560px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '28px 24px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #E2E8F0' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', background: '#FEF3C7', color: '#B45309', padding: '3px 8px', borderRadius: '4px', fontWeight: 800, textTransform: 'uppercase' }}>
                    DIRECT MTN MOMO SETTLEMENT
                  </span>
                  <h3 style={{ margin: '6px 0 0 0', color: '#081F3E', fontSize: '1.25rem', fontWeight: 800 }}>
                    Official Fee Payment
                  </h3>
                </div>
                <button
                  onClick={() => setShowCheckout(false)}
                  style={{ background: '#F1F5F9', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}
                >
                  ✕
                </button>
              </div>

              {paySuccess ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <CheckCircle size={36} color="#10B981" />
                  </div>
                  <h4 style={{ color: '#065F46', fontSize: '1.2rem', fontWeight: 800, margin: '0 0 8px 0' }}>
                    Payment Submitted Successfully!
                  </h4>
                  <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: '20px' }}>
                    Your transaction details have been registered. The finance office will confirm your clearance shortly.
                  </p>
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="btn btn-primary"
                    style={{ padding: '10px 24px' }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              ) : (
                <form onSubmit={handleProofSubmit}>
                  {payError && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.84rem' }}>
                      {payError}
                    </div>
                  )}

                  {/* Fee Selector */}
                  <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '8px' }}>
                      Select Fee to Pay:
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => setPayAmountOption(getApplicationFee(student?.degree_type))}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: payAmountOption === getApplicationFee(student?.degree_type) ? '2px solid #F5A623' : '1px solid #CBD5E1',
                          background: payAmountOption === getApplicationFee(student?.degree_type) ? '#FEF3C7' : '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          color: '#081F3E',
                          cursor: 'pointer'
                        }}
                      >
                        Application Fee ({getApplicationFee(student?.degree_type).toLocaleString()} XAF)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPayAmountOption(50000)}
                        style={{
                          padding: '10px',
                          borderRadius: '8px',
                          border: payAmountOption === 50000 ? '2px solid #F5A623' : '1px solid #CBD5E1',
                          background: payAmountOption === 50000 ? '#FEF3C7' : '#FFFFFF',
                          fontWeight: 700,
                          fontSize: '0.84rem',
                          color: '#081F3E',
                          cursor: 'pointer'
                        }}
                      >
                        1st Tuition Installment (50,000 XAF)
                      </button>
                    </div>
                  </div>

                  {/* Dial Code Card */}
                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                      MTN MoMo Merchant Direct Code
                    </span>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800, color: '#081F3E', margin: '4px 0' }}>
                      *126*14*670265493*{payAmountOption}#
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                      <button
                        type="button"
                        onClick={() => handleCopyShortCode(`*126*14*670265493*${payAmountOption}#`)}
                        style={{ background: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '6px 12px', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Copy size={12} /> {copiedShortCode ? 'Copied Code!' : 'Copy Code'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenMoMo(`*126*14*670265493*${payAmountOption}#`, payAmountOption)}
                        style={{ background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '6px 14px', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Smartphone size={12} /> Dial on Phone
                      </button>
                    </div>
                  </div>

                  {/* Screenshot Upload */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', margin: 0 }}>
                        Attach Proof of Payment (Screenshot) *
                      </label>
                      <span style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        Max 10 MB
                      </span>
                    </div>
                    <label
                      htmlFor="portal_payment_proof"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '18px 16px',
                        border: '2px dashed ' + (payScreenshotPreview ? '#10B981' : '#CBD5E1'),
                        borderRadius: '8px',
                        background: '#FFFFFF',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      <ImageIcon size={24} color={payScreenshotPreview ? '#10B981' : '#64748B'} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E' }}>
                        {payScreenshotFile ? payScreenshotFile.name : 'Click to select transaction screenshot or receipt'}
                      </span>
                      <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                        Max file size: <strong>10 MB</strong> &bull; PNG, JPG, JPEG, PDF
                      </span>
                      <input
                        id="portal_payment_proof"
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.pdf"
                        onChange={handleScreenshotChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowCheckout(false)}
                      className="btn btn-secondary"
                      style={{ flex: 1, padding: '10px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={payLoading}
                      className="btn btn-primary"
                      style={{ flex: 2, padding: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {payLoading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      <span>{payLoading ? 'Submitting...' : 'Submit Payment Proof'}</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}

        {/* OFFICIAL ADMISSION LETTER MODAL */}
        {showAdmissionLetterModal && student && (
          <div 
            className="admission-modal-backdrop"
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(8, 31, 62, 0.85)',
              zIndex: 9999,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
              overflowY: 'auto',
              backdropFilter: 'blur(4px)'
            }}
          >
            <div 
              className="admission-modal-wrapper"
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '820px',
                width: '100%',
                maxHeight: '92vh',
                overflowY: 'auto',
                padding: '36px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
                position: 'relative'
              }}
            >
              <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid #E2E8F0', paddingBottom: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800 }}>
                    OFFICIAL INSTITUTIONAL DOSSIER
                  </span>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                    Reference: {student.matricule || `HND26SW${String(student.id).padStart(3, '0')}`}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={16} /> Print / Save as PDF
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAdmissionLetterModal(false)}
                    style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '8px 14px', cursor: 'pointer', fontWeight: 700, color: '#475569' }}
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* Printable Letter Form */}
              <div id="admission-letter-card" style={{ border: '2.5px solid #081F3E', borderRadius: '12px', padding: '24px 28px', background: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #081F3E', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ textAlign: 'center', width: '32%', fontSize: '0.74rem', lineHeight: '1.35', color: '#1E293B' }}>
                    <p style={{ fontWeight: 800, margin: 0, textTransform: 'uppercase' }}>Republic of Cameroon</p>
                    <p style={{ fontStyle: 'italic', margin: '2px 0', color: '#64748B' }}>Peace - Work - Fatherland</p>
                    <p style={{ margin: 0 }}>Ministry of Higher Education</p>
                  </div>

                  <div style={{ textAlign: 'center', width: '30%' }}>
                    <img 
                      src="/assets/images/logo.png" 
                      alt="Liah Academy Crest" 
                      style={{ height: '54px', width: 'auto', margin: '0 auto', display: 'block' }} 
                    />
                    <span style={{ fontSize: '0.68rem', fontWeight: 900, color: '#F5A623', letterSpacing: '0.08em', display: 'block', marginTop: '3px' }}>
                      INNOVATION &amp; EXCELLENCE
                    </span>
                  </div>

                  <div style={{ textAlign: 'center', width: '32%', fontSize: '0.74rem', lineHeight: '1.35', color: '#1E293B' }}>
                    <p style={{ fontWeight: 800, margin: 0, color: '#081F3E' }}>LIAH ACADEMY</p>
                    <p style={{ fontStyle: 'italic', margin: '2px 0', color: '#64748B' }}>Higher Institute of Technology</p>
                    <p style={{ margin: 0 }}>Buea Main Campus, SW Region</p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: '#081F3E', color: '#FFFFFF', padding: '10px 16px', borderRadius: '6px', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 800 }}>
                    Official Admission Form &amp; Offer of Enrolment
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#F5A623', fontWeight: 600 }}>
                    2026 / 2027 Session &bull; Ref: {student.matricule || `HND26SW${String(student.id).padStart(3, '0')}`}
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', width: '30%', fontWeight: 700, color: '#64748B' }}>Student Matricule:</td>
                      <td style={{ padding: '6px 12px', width: '70%', fontWeight: 800, color: '#081F3E', fontFamily: 'var(--font-mono)' }}>
                        {student.matricule || `HND26SW${String(student.id).padStart(3, '0')}`}
                      </td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', fontWeight: 700, color: '#64748B' }}>Applicant Full Name:</td>
                      <td style={{ padding: '6px 12px', fontWeight: 800, color: '#081F3E' }}>{student.full_name}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', fontWeight: 700, color: '#64748B' }}>Academic Program:</td>
                      <td style={{ padding: '6px 12px', fontWeight: 700, color: '#081F3E' }}>{student.program_type}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', fontWeight: 700, color: '#64748B' }}>Degree Category:</td>
                      <td style={{ padding: '6px 12px' }}>{student.degree_type}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', fontWeight: 700, color: '#64748B' }}>Campus:</td>
                      <td style={{ padding: '6px 12px' }}>100% On-Campus (Bakweri Town Campus, Buea)</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', fontWeight: 700, color: '#64748B' }}>Admission Status:</td>
                      <td style={{ padding: '6px 12px', fontWeight: 800, color: student.admission_status === 'Approved' ? '#059669' : '#D97706' }}>
                        {student.admission_status === 'Approved' ? '✓ OFFICIALLY ADMITTED' : '⏳ UNDER REVIEW'}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '12px 16px', borderRadius: '8px', fontSize: '0.78rem', color: '#334155' }}>
                  <strong style={{ color: '#081F3E', display: 'block', marginBottom: '4px' }}>
                    🏢 Institutional Next Steps:
                  </strong>
                  Present this admission confirmation at the <strong>Liah Academy Secretary&apos;s Office in Buea</strong> to finalize registration and collect lab credentials.
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </main>
  );
}

export default function StudentPortalPage() {
  return (
    <Suspense fallback={
      <div style={{ padding: '120px 0', textAlign: 'center', color: '#081F3E', fontWeight: 700 }}>
        Loading Student Portal...
      </div>
    }>
      <StudentPortalContent />
    </Suspense>
  );
}
