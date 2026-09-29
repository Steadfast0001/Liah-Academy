'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  UserCheck, ShieldCheck, CreditCard, CheckCircle, 
  LogIn, LogOut, Download, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Smartphone, Loader2, Copy, Image as ImageIcon,
  Clock, Printer, Building, Mail, MapPin, ArrowRight, ArrowLeft, Lock, Zap,
  UserPlus, FileText, Trash2, Paperclip, Eye, EyeOff
} from 'lucide-react';
import { compressImageFile } from '../../lib/imageOptimizer';

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
      hint: 'At least 2 A-Level passes (excluding Religious Knowledge)',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level Certificate / Slip',
      required: true,
      hint: 'At least 4 O-Level passes including English & Mathematics',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'birth_cert',
      label: 'Certified Birth Certificate',
      required: true,
      hint: 'Clear official copy with administrative stamp',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'id_card',
      label: 'National Identity Card or Valid Passport',
      required: true,
      hint: 'Front and back scan / photo',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'academic_transcript',
      label: 'High School Transcript / Term Reports',
      required: false,
      hint: 'Optional but recommended for scholarship consideration',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ],
  ND: [
    {
      id: 'gce_ol',
      label: 'GCE Ordinary Level Certificate / Results Slip',
      required: true,
      hint: 'At least 3 O-Level passes or equivalent Technical CAP certificate',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'birth_cert',
      label: 'Certified Birth Certificate',
      required: true,
      hint: 'Clear copy with administrative stamp',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'id_card',
      label: 'National ID Card or Student ID',
      required: true,
      hint: 'Front & back scan',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ],
  Certification: [
    {
      id: 'id_card',
      label: 'National ID Card or Passport',
      required: true,
      hint: 'Valid government-issued photo identification',
      accept: '.pdf,.png,.jpg,.jpeg'
    },
    {
      id: 'highest_diploma',
      label: 'Highest Academic Certificate or CV',
      required: false,
      hint: 'O-Level, A-Level, Degree, or professional portfolio',
      accept: '.pdf,.png,.jpg,.jpeg'
    }
  ]
};

const getApplicationFee = (deg?: string): number => {
  if (!deg) return 15000;
  const upper = String(deg).toUpperCase();
  if (upper.includes('CERT')) return 25000;
  return 15000;
};

// Complete programs mapping
const programOptions: Record<string, string[]> = {
  HND: [
    'Software Engineering HND',
    'Cybersecurity & Cloud Defense HND',
    'Network and Maintenance HND',
    'Web and Graphics Design HND',
    'Digital Marketing and E-Commerce HND'
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

function StudentPortalContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const degreeParam = searchParams.get('degree');
  const programParam = searchParams.get('program');

  // Active Gateway View: 'enrol' (New Applicant) or 'login' (Registered Student)
  const [gatewayTab, setGatewayTab] = useState<'enrol' | 'login'>('enrol');

  // Logged-in Student Session State
  const [student, setStudent] = useState<any>(null);
  const [showAdmissionLetterModal, setShowAdmissionLetterModal] = useState(false);

  // Login Form State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Enrolment Multi-Step Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showEnrolPassword, setShowEnrolPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [degreeType, setDegreeType] = useState<'HND' | 'ND' | 'Certification'>('HND');
  const [programType, setProgramType] = useState('Software Engineering HND');
  const [studyFormat, setStudyFormat] = useState('oncampus');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; size: string; label: string; url?: string; bytes?: number }>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

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

  // Restore authenticated student session & process URL parameters
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

    // Handle tab switching from URL
    if (tabParam === 'login') {
      setGatewayTab('login');
    } else if (tabParam === 'enrol' || tabParam === 'register') {
      setGatewayTab('enrol');
    }

    // Pre-fill degree & program if passed in URL
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
      setGatewayTab('enrol');
    }

    if (programParam) {
      setProgramType(programParam);
      setGatewayTab('enrol');
    }

    // Restore auto-saved draft if student has incomplete enrolment application
    try {
      if (typeof window !== 'undefined') {
        const draftStr = localStorage.getItem('liah_admission_draft');
        if (draftStr) {
          const draft = JSON.parse(draftStr);
          if (draft && (draft.fullName || draft.email || draft.phone || draft.currentStep > 1)) {
            if (draft.fullName && !fullName) setFullName(draft.fullName);
            if (draft.email && !email) setEmail(draft.email);
            if (draft.phone && !phone) setPhone(draft.phone);
            if (draft.degreeType && !degreeParam) setDegreeType(draft.degreeType);
            if (draft.programType && !programParam) setProgramType(draft.programType);
            if (draft.studyFormat) setStudyFormat(draft.studyFormat);
            if (draft.uploadedDocs && Object.keys(draft.uploadedDocs).length > 0) setUploadedDocs(draft.uploadedDocs);
            if (draft.currentStep) setCurrentStep(draft.currentStep);
            setHasSavedDraft(true);
          }
        }
      }
    } catch {}
  }, [tabParam, degreeParam, programParam]);

  // Keep Program synced when Degree Category changes
  const handleDegreeChange = (newDeg: 'HND' | 'ND' | 'Certification') => {
    setDegreeType(newDeg);
    const available = programOptions[newDeg];
    if (available && available.length > 0) {
      setProgramType(available[0]);
    }
  };

  // Auto-Save Incomplete Form Draft to localStorage
  const saveDraft = (overrides?: any) => {
    try {
      if (typeof window !== 'undefined') {
        const payload = {
          fullName,
          email,
          phone,
          degreeType,
          programType,
          studyFormat,
          uploadedDocs,
          currentStep,
          updatedAt: new Date().toISOString(),
          ...overrides
        };
        localStorage.setItem('liah_admission_draft', JSON.stringify(payload));
        setHasSavedDraft(true);
      }
    } catch {}
  };

  const handleClearDraft = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('liah_admission_draft');
      }
    } catch {}
    setFullName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setUploadedDocs({});
    setCurrentStep(1);
    setHasSavedDraft(false);
  };

  // Enrolment Step 1 Validation
  const handleStep1Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!fullName.trim() || !email.trim() || !phone.trim()) {
      setRegError('Please fill in your full name, email address, and mobile phone number.');
      return;
    }
    saveDraft({ currentStep: 2 });
    setCurrentStep(2);
  };

  // Enrolment Step 2 Validation
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!password || password.length < 6) {
      setRegError('Please create a portal password with at least 6 characters.');
      return;
    }
    if (!agreeTerms) {
      setRegError('You must agree to the academic honesty & institutional attendance policy.');
      return;
    }
    saveDraft({ currentStep: 3 });
    setCurrentStep(3);
  };

  // Document Upload Handler for Step 3 (Client compression + 2.5 MB slot limit / 10 MB total)
  const handleFileUploadForSlot = async (slotId: string, slotLabel: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    const maxSlotBytes = 2.5 * 1024 * 1024; // 2.5 MB per slot
    const maxTotalBytes = 10 * 1024 * 1024; // 10 MB total budget

    setUploadingSlot(slotId);
    setRegError('');

    try {
      // 1. Instant client-side compression for camera images
      const file = await compressImageFile(rawFile);

      if (file.size > maxSlotBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(2);
        e.target.value = '';
        setRegError(`⚠️ Upload Rejected: File is too large! Selected file "${file.name}" is ${actualMb} MB. Maximum allowed limit per document is 2.5 MB (Total Budget: 10 MB). Please choose a smaller file.`);
        setUploadingSlot(null);
        return;
      }

      const currentTotalBytes = Object.values(uploadedDocs).reduce((acc, doc: any) => {
        const docSizeBytes = doc.bytes || 350 * 1024;
        return acc + docSizeBytes;
      }, 0);

      if (currentTotalBytes + file.size > maxTotalBytes) {
        e.target.value = '';
        setRegError(`⚠️ Upload Rejected: Total application upload budget (10 MB) exceeded. Please replace or compress existing documents.`);
        setUploadingSlot(null);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotId', slotId);

      const res = await fetch('/api/admissions/upload-doc', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        e.target.value = '';
        setRegError(data.message || '⚠️ Upload failed: File was rejected by server.');
        setUploadingSlot(null);
        return;
      }

      if (res.ok && data.success && data.url) {
        setUploadedDocs(prev => {
          const updated = {
            ...prev,
            [slotId]: {
              fileName: file.name,
              size: data.size || `${(file.size / 1024).toFixed(0)} KB`,
              bytes: file.size,
              label: slotLabel,
              url: data.url
            }
          };
          saveDraft({ uploadedDocs: updated });
          return updated;
        });
      } else {
        setRegError(data.message || `Failed to upload "${file.name}". Please try again.`);
      }
    } catch {
      setRegError(`Network error uploading "${rawFile.name}". Please ensure your internet connection is active.`);
    } finally {
      setUploadingSlot(null);
    }
  };

  const handleRemoveDoc = (slotId: string) => {
    setUploadedDocs(prev => {
      const next = { ...prev };
      delete next[slotId];
      saveDraft({ uploadedDocs: next });
      return next;
    });
  };

  // Final Registration Submission -> Logs student into portal directly
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    const requiredList = (docRequirementsByDegree[degreeType] || []).filter(d => d.required);
    const missing = requiredList.filter(d => !uploadedDocs[d.id]);
    if (missing.length > 0) {
      setRegLoading(false);
      setRegError(`Please upload all mandatory documents (${missing.map(m => m.label).join(', ')}) to complete your file.`);
      return;
    }

    try {
      const docsList = Object.keys(uploadedDocs).map(k => ({
        id: k,
        label: uploadedDocs[k].label,
        fileName: uploadedDocs[k].fileName,
        size: uploadedDocs[k].size,
        url: uploadedDocs[k].url
      }));

      const res = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
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

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        data = { success: false, message: `Server error (${res.status} ${res.statusText})` };
      }

      setRegLoading(false);

      if (res.ok && data.success && data.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem('liah_student_session', JSON.stringify(data.data));
          sessionStorage.setItem('liah_student_session', JSON.stringify(data.data));
          localStorage.removeItem('liah_admission_draft');
        }
        setStudent(data.data);
        setPayAmountOption(getApplicationFee(data.data.degree_type));
      } else {
        setRegError(data.message || 'Registration failed. Please check your details and try again.');
      }
    } catch (netErr: any) {
      console.error('Registration error:', netErr);
      setRegLoading(false);
      setRegError(netErr?.message && netErr.message !== 'Failed to fetch' ? netErr.message : 'Connection error. Please ensure your network is connected and try again.');
    }
  };

  // Handle Student Login Submit
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

      if (data.success && (data.student || data.data)) {
        const studentObj = data.student || data.data;
        setStudent(studentObj);
        setPayAmountOption(getApplicationFee(studentObj.degree_type));
        if (typeof window !== 'undefined') {
          localStorage.setItem('liah_student_session', JSON.stringify(studentObj));
          sessionStorage.setItem('liah_student_session', JSON.stringify(studentObj));
        }
      } else {
        setLoginError(data.message || 'Invalid email or password. If you do not have an account, please enrol.');
      }
    } catch {
      setLoginLoading(false);
      setLoginError('Connection error. Please check your network and try again.');
    }
  };

  // Handle Student Logout
  const handleStudentLogout = () => {
    setStudent(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('liah_student_session');
      sessionStorage.removeItem('liah_student_session');
    }
    setGatewayTab('login');
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

  const handleScreenshotChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (rawFile) {
      const maxSlotBytes = 2.5 * 1024 * 1024; // 2.5 MB allocation
      
      const file = await compressImageFile(rawFile);
      if (file.size > maxSlotBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(2);
        e.target.value = '';
        setPayScreenshotFile(null);
        setPayScreenshotPreview(null);
        setPayError(`⚠️ Upload Rejected: File is too large! Selected proof screenshot is ${actualMb} MB. Maximum allowed allocation is 2.5 MB.`);
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
        }, 3500);
      } else {
        setPayError(data.message || 'Failed to submit proof of payment.');
      }
    } catch {
      setPayLoading(false);
      setPayError('Connection error uploading payment proof. Please try again.');
    }
  };

  // Compute Total Size of Attached Documents in Step 3
  const totalUploadedBytes = Object.values(uploadedDocs).reduce((acc, doc: any) => {
    return acc + (doc.bytes || 350 * 1024);
  }, 0);
  const totalUploadedMB = (totalUploadedBytes / (1024 * 1024)).toFixed(2);
  const budgetPercentage = Math.min(100, Math.round((totalUploadedBytes / (10 * 1024 * 1024)) * 100));

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '880px' }}>
        
        {/* =========================================================
            A. AUTHENTICATED STUDENT DASHBOARD
            ========================================================= */}
        {student ? (
          <div className="portal-dashboard-main" style={{ maxWidth: '820px', margin: '0 auto', padding: '10px 0' }}>
            
            {/* Top Bar / Logout */}
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
                  ✦ AUTHENTICATED STUDENT PORTAL
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

            {/* Enrolment Decision Status */}
            <div style={{ marginBottom: '32px', background: '#F8FAFC', padding: '20px 24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
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
              <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.6', margin: '8px 0 0 0' }}>
                {student.admission_status === 'Approved' 
                  ? 'Your academic credentials have been verified and approved by the Admissions Board. Please complete your fee settlement to finalize your matriculation dossier.'
                  : student.admission_status === 'Rejected'
                  ? 'Thank you for your application. We regret to inform you that our admissions committee was unable to offer admission for this intake.'
                  : 'Your academic documents and application credentials have been received. Our Admissions Board is currently reviewing your file. You can log into this portal at any time to monitor the progress of your application.'}
              </p>
            </div>

            {/* Status Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '36px' }}>
              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'block', marginBottom: '6px' }}>
                  Student Matricule
                </span>
                <strong style={{ color: '#081F3E', fontFamily: 'var(--font-mono)', fontSize: '1.25rem', fontWeight: 800 }}>
                  {student.matricule || `LA26-${String(student.id || '001').padStart(4, '0')}`}
                </strong>
              </div>

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
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

              <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
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

            {/* Academic Record Summary */}
            <div style={{ marginBottom: '36px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <h4 style={{ color: '#081F3E', margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800 }}>
                Academic Record Summary
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Enrolled Program:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.program_type}</p>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Degree Category:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.degree_type}</p>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Campus Location:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>Bakweri Town Campus, Buea</p>
                </div>
                <div>
                  <span style={{ color: '#64748B', display: 'block', fontSize: '0.82rem', marginBottom: '3px' }}>Email Contact:</span>
                  <p style={{ fontWeight: 700, color: '#081F3E', margin: 0, fontSize: '0.92rem' }}>{student.email}</p>
                </div>
              </div>
            </div>

            {/* Uploaded Documents List */}
            {student.documents && Array.isArray(student.documents) && student.documents.length > 0 && (
              <div style={{ marginBottom: '36px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <h4 style={{ color: '#081F3E', margin: '0 0 16px 0', fontSize: '1.15rem', fontWeight: 800 }}>
                  Submitted Academic Dossier Files
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {student.documents.map((doc: any, idx: number) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={18} color="#0284C7" />
                        <div>
                          <p style={{ margin: 0, fontWeight: 700, fontSize: '0.88rem', color: '#081F3E' }}>
                            {doc.label || doc.fileName || `Document ${idx + 1}`}
                          </p>
                          <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                            {doc.fileName} {doc.size ? `(${doc.size})` : ''}
                          </span>
                        </div>
                      </div>
                      {doc.url && (
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={doc.fileName || 'document'}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 700,
                            color: '#081F3E',
                            textDecoration: 'none'
                          }}
                        >
                          <Download size={14} /> Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              {student.payment_status !== 'Paid' && (
                <button 
                  onClick={() => setShowCheckout(true)} 
                  style={{ 
                    background: '#F5A623', 
                    color: '#081F3E', 
                    fontWeight: 800, 
                    padding: '14px 28px', 
                    borderRadius: '8px', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontSize: '0.92rem', 
                    boxShadow: '0 4px 14px rgba(245, 166, 35, 0.3)' 
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
                  padding: '14px 28px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.92rem'
                }}
              >
                <Download size={18} /> Download Admission Letter &amp; Form
              </button>
            </div>
          </div>
        ) : (

          /* =========================================================
              B. UNAUTHENTICATED GATEWAY: ENROLMENT & LOGIN INTERFACE
              ========================================================= */
          <div style={{ maxWidth: '680px', margin: '0 auto' }}>
            
            {/* Top Gateway Header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <span style={{
                display: 'inline-block',
                background: 'rgba(245, 166, 35, 0.12)',
                color: '#D97706',
                padding: '4px 14px',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 800,
                fontFamily: 'var(--font-mono)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '10px'
              }}>
                LIAH ACADEMY STUDENT PORTAL
              </span>
              <h1 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 800, color: '#081F3E', margin: '0 0 10px 0' }}>
                Online Enrolment &amp; Student Portal
              </h1>
              <p style={{ color: '#64748B', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto' }}>
                New applicants can submit their enrolment dossier below. Registered students can log in to access their academic status and tuition clearances.
              </p>
            </div>

            {/* Segmented Tab Switcher */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: '1fr 1fr', 
              background: '#F1F5F9', 
              padding: '6px', 
              borderRadius: '12px', 
              marginBottom: '24px',
              border: '1px solid #E2E8F0'
            }}>
              <button
                type="button"
                onClick={() => setGatewayTab('enrol')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: gatewayTab === 'enrol' ? '#081F3E' : 'transparent',
                  color: gatewayTab === 'enrol' ? '#FFFFFF' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: gatewayTab === 'enrol' ? '0 4px 12px rgba(8, 31, 62, 0.15)' : 'none'
                }}
              >
                <UserPlus size={18} color={gatewayTab === 'enrol' ? '#F5A623' : '#64748B'} />
                <span>Enrol as New Student</span>
              </button>

              <button
                type="button"
                onClick={() => setGatewayTab('login')}
                style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: gatewayTab === 'login' ? '#081F3E' : 'transparent',
                  color: gatewayTab === 'login' ? '#FFFFFF' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: 'all 0.2s ease',
                  boxShadow: gatewayTab === 'login' ? '0 4px 12px rgba(8, 31, 62, 0.15)' : 'none'
                }}
              >
                <Lock size={18} color={gatewayTab === 'login' ? '#F5A623' : '#64748B'} />
                <span>Existing Student Login</span>
              </button>
            </div>

            {/* ----------------------------------------------------
                TAB 1: ONLINE ENROLMENT APPLICATION (3-STEP WIZARD)
                ---------------------------------------------------- */}
            {gatewayTab === 'enrol' && (
              <div 
                className="premium-card" 
                style={{ 
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '36px 32px',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ color: '#F5A623', fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '4px' }}>
                    ENROLMENT DOSSIER
                  </span>
                  <h2 style={{ color: '#081F3E', margin: 0, fontSize: '1.6rem', fontWeight: 800 }}>
                    Online Enrolment Application
                  </h2>
                </div>

                {/* Auto-saved draft restore notification */}
                {hasSavedDraft && (
                  <div style={{ background: '#081F3E', color: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>💾</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem', color: '#FFFFFF' }}>
                          Welcome back{fullName ? `, ${fullName}` : ''}! Your progress at Step {currentStep} of 3 has been saved.
                        </strong>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearDraft}
                      style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Start Fresh
                    </button>
                  </div>
                )}

                {/* 3-Step Breadcrumb Tracker */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px', position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 1 ? 1 : 0.4 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 1 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E' }}>Bio &amp; Program</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', background: currentStep >= 2 ? '#081F3E' : '#E2E8F0', margin: '0 12px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 2 ? 1 : 0.4 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 2 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {currentStep > 2 ? '✓' : '2'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E' }}>Security &amp; Terms</span>
                  </div>
                  <div style={{ flex: 1, height: '2px', background: currentStep >= 3 ? '#081F3E' : '#E2E8F0', margin: '0 12px' }} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 3 ? 1 : 0.4 }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 3 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      3
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E' }}>Documents</span>
                  </div>
                </div>

                {regError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.86rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertCircle size={18} style={{ flexShrink: 0 }} /> <span>{regError}</span>
                  </div>
                )}

                {/* STEP 1: BIO & PROGRAM SELECTION */}
                {currentStep === 1 && (
                  <form onSubmit={handleStep1Next}>
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label htmlFor="enrol_full_name" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                        Full Name (as on official ID) *
                      </label>
                      <input
                        id="enrol_full_name"
                        type="text"
                        required
                        className="form-input-light"
                        placeholder="e.g. Nkenganyi Steadfast"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); saveDraft({ fullName: e.target.value }); }}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                      <div className="form-group">
                        <label htmlFor="enrol_email" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                          Email Address *
                        </label>
                        <input
                          id="enrol_email"
                          type="email"
                          required
                          className="form-input-light"
                          placeholder="your.name@gmail.com"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); saveDraft({ email: e.target.value }); }}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="enrol_phone" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                          Mobile / WhatsApp Phone *
                        </label>
                        <input
                          id="enrol_phone"
                          type="tel"
                          required
                          className="form-input-light"
                          placeholder="e.g. +237 670 265 493"
                          value={phone}
                          onChange={(e) => { setPhone(e.target.value); saveDraft({ phone: e.target.value }); }}
                          style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                        />
                      </div>
                    </div>

                    {/* Degree Category Selection */}
                    <div className="form-group" style={{ marginBottom: '16px' }}>
                      <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '8px' }}>
                        Select Degree Category *
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {(['HND', 'ND', 'Certification'] as const).map((deg) => (
                          <button
                            key={deg}
                            type="button"
                            onClick={() => handleDegreeChange(deg)}
                            style={{
                              padding: '10px',
                              borderRadius: '8px',
                              border: degreeType === deg ? '2px solid #081F3E' : '1px solid #CBD5E1',
                              background: degreeType === deg ? '#081F3E' : '#FFFFFF',
                              color: degreeType === deg ? '#FFFFFF' : '#081F3E',
                              fontWeight: 800,
                              fontSize: '0.84rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease'
                            }}
                          >
                            {deg === 'HND' ? 'HND (2 Yrs)' : deg === 'ND' ? 'ND (1 Yr)' : 'Certification'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Program of Study */}
                    <div className="form-group" style={{ marginBottom: '24px' }}>
                      <label htmlFor="enrol_program" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                        Program of Study ({degreeType}) *
                      </label>
                      <select
                        id="enrol_program"
                        value={programType}
                        onChange={(e) => { setProgramType(e.target.value); saveDraft({ programType: e.target.value }); }}
                        className="form-input-light"
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem', background: '#FFFFFF' }}
                      >
                        {programOptions[degreeType]?.map((prog) => (
                          <option key={prog} value={prog}>
                            {prog}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      <span>Next: Security &amp; Terms</span>
                      <ArrowRight size={16} />
                    </button>
                  </form>
                )}

                {/* STEP 2: SECURITY & TERMS */}
                {currentStep === 2 && (
                  <form onSubmit={handleStep2Next}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                      <label htmlFor="enrol_password" style={{ display: 'block', fontSize: '0.84rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                        Create Student Portal Password *
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          id="enrol_password"
                          type={showEnrolPassword ? 'text' : 'password'}
                          required
                          minLength={6}
                          className="form-input-light"
                          placeholder="Min. 6 characters for portal login"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          style={{ width: '100%', padding: '12px 42px 12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowEnrolPassword(!showEnrolPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                        >
                          {showEnrolPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      <span style={{ fontSize: '0.76rem', color: '#64748B', marginTop: '4px', display: 'block' }}>
                        You will use this password alongside your email to log into the Student Portal.
                      </span>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', marginBottom: '24px' }}>
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          style={{ marginTop: '3px' }}
                        />
                        <span style={{ fontSize: '0.82rem', color: '#334155', lineHeight: '1.5' }}>
                          I certify that all uploaded academic documents are authentic. I agree to abide by Liah Academy&apos;s institutional attendance policy and code of academic honesty at the Buea Campus.
                        </span>
                      </label>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(1)}
                        className="btn btn-secondary"
                        style={{ padding: '12px 20px', borderRadius: '8px' }}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '12px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <span>Next: Attach Documents</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 3: DOCUMENT UPLOADS (EXACT MATCH OF IMAGE media_1790694494083.png) */}
                {currentStep === 3 && (
                  <form onSubmit={handleRegisterSubmit}>
                    {/* Budget Information Box (Green Alert Card) */}
                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Sparkles size={20} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                      <div>
                        <strong style={{ fontSize: '0.84rem', color: '#065F46', display: 'block', marginBottom: '2px' }}>
                          Distributed Document Upload Budget
                        </strong>
                        <p style={{ fontSize: '0.78rem', color: '#047857', margin: 0, lineHeight: 1.45 }}>
                          Total applicant allocation: <strong>10 MB combined</strong> &bull; Distributed limit: <strong>Max 2.5 MB per document slot</strong>. High-resolution phone photos are automatically compressed on your device for instant submission.
                        </p>
                      </div>
                    </div>

                    {/* Progress Bar of Budget */}
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', marginBottom: '20px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
                        <span>Total File Budget Used: <strong>{totalUploadedMB} MB / 10 MB</strong></span>
                        <span style={{ color: '#059669' }}>{budgetPercentage}% utilized</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${budgetPercentage}%`, height: '100%', background: budgetPercentage > 85 ? '#DC2626' : '#10B981', transition: 'width 0.3s ease' }} />
                      </div>
                    </div>

                    <p style={{ fontSize: '0.82rem', color: '#64748B', marginBottom: '14px' }}>
                      Attach your academic qualifications and official birth certificate for dossier approval:
                    </p>

                    {/* Document Upload Slots */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
                      {(docRequirementsByDegree[degreeType] || []).map((slot) => {
                        const isAttached = !!uploadedDocs[slot.id];
                        const docInfo = uploadedDocs[slot.id];
                        const isUploadingThis = uploadingSlot === slot.id;

                        return (
                          <div 
                            key={slot.id}
                            style={{
                              background: isAttached ? '#F0FDF4' : '#FFFFFF',
                              border: isAttached ? '1.5px solid #86EFAC' : '1px solid #E2E8F0',
                              borderRadius: '10px',
                              padding: '14px 16px',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                              <div>
                                <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#081F3E' }}>
                                  {slot.label} {slot.required && <span style={{ color: '#DC2626' }}>*</span>}
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#64748B', display: 'block', marginTop: '2px' }}>
                                  {slot.hint}
                                </span>
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B', background: '#F1F5F9', padding: '2px 8px', borderRadius: '4px' }}>
                                Max 2.5 MB
                              </span>
                            </div>

                            {/* Slot action / preview */}
                            <div style={{ marginTop: '10px' }}>
                              {isAttached ? (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '8px 12px', borderRadius: '6px', border: '1px solid #BBF7D0' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <CheckCircle size={16} color="#10B981" />
                                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>
                                      {docInfo.fileName} ({docInfo.size})
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDoc(slot.id)}
                                    style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: '0.76rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                  >
                                    <Trash2 size={13} /> Remove
                                  </button>
                                </div>
                              ) : (
                                <label
                                  htmlFor={`doc_upload_${slot.id}`}
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: '#FFFFFF',
                                    border: '1px solid #CBD5E1',
                                    borderRadius: '6px',
                                    padding: '8px 14px',
                                    fontSize: '0.82rem',
                                    fontWeight: 700,
                                    color: '#081F3E',
                                    cursor: isUploadingThis ? 'wait' : 'pointer'
                                  }}
                                >
                                  {isUploadingThis ? <Loader2 size={14} className="animate-spin" /> : <UploadCloud size={14} />}
                                  <span>{isUploadingThis ? 'Compressing & Uploading...' : 'Select Document (Max 2.5 MB)'}</span>
                                  <input
                                    id={`doc_upload_${slot.id}`}
                                    type="file"
                                    accept={slot.accept}
                                    disabled={isUploadingThis}
                                    onChange={(e) => handleFileUploadForSlot(slot.id, slot.label, e)}
                                    style={{ display: 'none' }}
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(2)}
                        className="btn btn-secondary"
                        style={{ padding: '12px 20px', borderRadius: '8px' }}
                      >
                        <ArrowLeft size={16} /> Back
                      </button>
                      <button
                        type="submit"
                        disabled={regLoading}
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        {regLoading ? <Loader2 size={18} className="animate-spin" /> : <UserCheck size={18} />}
                        <span>{regLoading ? 'Processing Application...' : 'Submit Application & Open Portal'}</span>
                      </button>
                    </div>
                  </form>
                )}

                <div style={{ marginTop: '24px', paddingTop: '18px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '0 0 6px 0' }}>
                    Already registered for a previous cohort?
                  </p>
                  <button
                    type="button"
                    onClick={() => setGatewayTab('login')}
                    style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Login to your Student Portal <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

            {/* ----------------------------------------------------
                TAB 2: EXISTING STUDENT LOGIN
                ---------------------------------------------------- */}
            {gatewayTab === 'login' && (
              <div 
                className="premium-card" 
                style={{ 
                  background: '#FFFFFF',
                  borderRadius: '16px',
                  padding: '40px 36px',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(8, 31, 62, 0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                    <Lock size={26} color="#081F3E" />
                  </div>
                  <h2 style={{ fontSize: '1.55rem', fontWeight: 800, color: '#081F3E', margin: '0 0 6px 0' }}>
                    Student Portal Login
                  </h2>
                  <p style={{ color: '#64748B', fontSize: '0.9rem', margin: 0 }}>
                    Enter your registered applicant email and portal password.
                  </p>
                </div>

                {loginError && (
                  <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                      type="email"
                      required
                      className="form-input-light"
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
                    <div style={{ position: 'relative' }}>
                      <input
                        id="portal_login_password"
                        type={showLoginPassword ? 'text' : 'password'}
                        required
                        className="form-input-light"
                        placeholder="Your portal password"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        style={{ width: '100%', padding: '12px 42px 12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                      >
                        {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loginLoading}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    {loginLoading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
                    <span>{loginLoading ? 'Authenticating...' : 'Access Student Dashboard'}</span>
                  </button>
                </form>

                <div style={{ marginTop: '26px', paddingTop: '20px', borderTop: '1px solid #E2E8F0', textAlign: 'center' }}>
                  <p style={{ color: '#64748B', fontSize: '0.86rem', margin: '0 0 8px 0' }}>
                    Don&apos;t have an application account yet?
                  </p>
                  <button
                    type="button"
                    onClick={() => setGatewayTab('enrol')}
                    style={{ background: 'none', border: 'none', color: '#0284C7', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    Start Enrolment Application <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            )}

          </div>
        )}

        {/* =========================================================
            C. DIRECT MTN MOBILE MONEY CHECKOUT MODAL
            ========================================================= */}
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

                  {/* Screenshot Upload with 2.5 MB allocation */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', margin: 0 }}>
                        Attach Proof of Payment (Screenshot) *
                      </label>
                      <span style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        Max 2.5 MB
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
                        Max file size: <strong>2.5 MB</strong> &bull; PNG, JPG, JPEG, PDF (Auto-compressed for fast upload)
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

        {/* =========================================================
            D. OFFICIAL ADMISSION LETTER & FORM MODAL
            ========================================================= */}
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
                    Reference: {student.matricule || `LA26-${String(student.id).padStart(4, '0')}`}
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
                    <p style={{ margin: 0 }}>Bakweri Town Campus, Buea</p>
                  </div>
                </div>

                <div style={{ textAlign: 'center', background: '#081F3E', color: '#FFFFFF', padding: '10px 16px', borderRadius: '6px', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 800 }}>
                    Official Admission Form &amp; Offer of Enrolment
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#F5A623', fontWeight: 600 }}>
                    2026 / 2027 Session &bull; Ref: {student.matricule || `LA26-${String(student.id).padStart(4, '0')}`}
                  </span>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '14px', fontSize: '0.88rem' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px 12px', background: '#F8FAFC', width: '30%', fontWeight: 700, color: '#64748B' }}>Student Matricule:</td>
                      <td style={{ padding: '6px 12px', width: '70%', fontWeight: 800, color: '#081F3E', fontFamily: 'var(--font-mono)' }}>
                        {student.matricule || `LA26-${String(student.id).padStart(4, '0')}`}
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
                  Present this admission confirmation at the <strong>Liah Academy Secretary&apos;s Office in Bakweri Town, Buea</strong> to finalize registration and collect student ID and workstation credentials.
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
