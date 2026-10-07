'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { 
  UserCheck, ShieldCheck, CreditCard, CheckCircle, 
  LogIn, LogOut, Download, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Smartphone, Loader2, Copy, Image as ImageIcon,
  Clock, Printer, Building, Mail, MapPin, ArrowRight, ArrowLeft, Lock, Zap,
  UserPlus, FileText, Trash2, Paperclip, Eye, EyeOff, ExternalLink,
  Share2, DollarSign, Award, Users, CheckCircle2, Megaphone, Calendar, X
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
  const hydratedRef = React.useRef(false);

  // Active Gateway View: 'enrol' (New Applicant) or 'login' (Registered Student)
  const [gatewayTab, setGatewayTab] = useState<'enrol' | 'login'>('enrol');

  // Logged-in Student Session State
  const [student, setStudent] = useState<any>(null);
  const [isClientReady, setIsClientReady] = useState(false);
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
  const [checkingEmail, setCheckingEmail] = useState(false);
  const [regError, setRegError] = useState('');
  const [hasSavedDraft, setHasSavedDraft] = useState(false);
  const [draftSavedStep, setDraftSavedStep] = useState<number>(1);

  // Step 3: Registration Payment Proof (Optional)
  const [regPaymentProofUrl, setRegPaymentProofUrl] = useState<string>('');
  const [regPaymentFileName, setRegPaymentFileName] = useState<string>('');
  const [regPaymentFileSize, setRegPaymentFileSize] = useState<string>('');
  const [regPaymentUploading, setRegPaymentUploading] = useState<boolean>(false);
  const [regPaymentTxId, setRegPaymentTxId] = useState<string>('');
  const [regCopiedShortCode, setRegCopiedShortCode] = useState<boolean>(false);

  // Direct Mobile Money Payment & Proof Upload State
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

  // Student Referral / Ambassador Program State
  const [studentRefData, setStudentRefData] = useState<any>(null);
  const [studentRefLoading, setStudentRefLoading] = useState(false);
  const [studentRefActivating, setStudentRefActivating] = useState(false);
  const [studentRefCopiedLink, setStudentRefCopiedLink] = useState(false);
  const [studentRefPayoutOpen, setStudentRefPayoutOpen] = useState(false);
  const [studentRefPayoutAmount, setStudentRefPayoutAmount] = useState('');
  const [studentRefPayoutMoMo, setStudentRefPayoutMoMo] = useState('');
  const [studentRefPayoutLoading, setStudentRefPayoutLoading] = useState(false);
  const [studentRefPayoutMsg, setStudentRefPayoutMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [studentRefProofModal, setStudentRefProofModal] = useState<string | null>(null);

  // Official Institutional Announcements State
  const [portalAnnouncements, setPortalAnnouncements] = useState<any[]>([]);
  const [selectedPortalAnnouncement, setSelectedPortalAnnouncement] = useState<any | null>(null);

  const loadStudentReferral = async (studId: number, studPhone?: string) => {
    setStudentRefLoading(true);
    try {
      const res = await fetch(`/api/referrals/stats?student_id=${studId}`);
      const data = await res.json();
      if (data.success && data.data) {
        setStudentRefData(data.data);
        setStudentRefPayoutMoMo(data.data.agent?.momo_number || studPhone || '');
      } else {
        setStudentRefData(null);
      }
    } catch {
      setStudentRefData(null);
    } finally {
      setStudentRefLoading(false);
    }
  };

  const handleActivateStudentReferral = async () => {
    if (!student) return;
    setStudentRefActivating(true);
    try {
      const res = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: student.id,
          student_matricule: student.matricule || `LA26-${String(student.id || '001').padStart(4, '0')}`,
          name: student.full_name,
          momo_number: student.phone,
          email: student.email
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadStudentReferral(student.id, student.phone);
      }
    } catch (err) {
      console.error('Error activating referral:', err);
    } finally {
      setStudentRefActivating(false);
    }
  };

  const handleStudentPayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentRefData?.agent) return;
    const amt = Number(studentRefPayoutAmount);
    if (!amt || amt < 2000) {
      setStudentRefPayoutMsg({ type: 'error', text: 'Minimum withdrawal amount is 2,000 XAF.' });
      return;
    }
    if (amt > studentRefData.agent.balance) {
      setStudentRefPayoutMsg({ type: 'error', text: `Amount exceeds available balance of ${studentRefData.agent.balance.toLocaleString()} XAF.` });
      return;
    }

    setStudentRefPayoutLoading(true);
    setStudentRefPayoutMsg(null);
    try {
      const res = await fetch('/api/referrals/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_code: studentRefData.agent.code,
          amount: amt,
          momo_number: studentRefPayoutMoMo.trim() || studentRefData.agent.momo_number
        })
      });
      const data = await res.json();
      if (data.success) {
        setStudentRefPayoutMsg({ type: 'success', text: 'Withdrawal request submitted! Admin will deposit to your MoMo and upload confirmation proof.' });
        setStudentRefPayoutAmount('');
        await loadStudentReferral(student.id, student.phone);
      } else {
        setStudentRefPayoutMsg({ type: 'error', text: data.message || 'Failed to submit withdrawal request.' });
      }
    } catch {
      setStudentRefPayoutMsg({ type: 'error', text: 'Network error submitting payout request.' });
    } finally {
      setStudentRefPayoutLoading(false);
    }
  };

  // Keep the current UI state authoritative. Do not hydrate from old saved session/draft data
  // after a refresh, otherwise stale values overwrite the latest user change.
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;

    if (tabParam === 'login') {
      setGatewayTab('login');
    } else if (tabParam === 'enrol' || tabParam === 'register') {
      setGatewayTab('enrol');
    }

    if (degreeParam) {
      const upper = degreeParam.toUpperCase();
      let normalizedDegree: 'HND' | 'ND' | 'Certification' = 'HND';
      if (upper.includes('CERT')) normalizedDegree = 'Certification';
      else if (upper.includes('ND') && !upper.includes('HND')) normalizedDegree = 'ND';
      else normalizedDegree = 'HND';
      setDegreeType(normalizedDegree);
      setGatewayTab('enrol');
    }

    if (programParam) {
      setProgramType(programParam);
      setGatewayTab('enrol');
    }

    fetch('/api/admissions/session', { credentials: 'include' })
      .then(async response => response.ok ? response.json() : null)
      .then(data => {
        if (data?.success && data.data) {
          setStudent(data.data);
          setPayAmountOption(getApplicationFee(data.data.degree_type));
        }
      })
      .catch(() => {})
      .finally(() => setIsClientReady(true));
  }, [tabParam, degreeParam, programParam]);

  useEffect(() => {
    if (student?.id) {
      loadStudentReferral(student.id, student.phone);
    }
  }, [student?.id]);

  // Load institutional announcements from backend
  useEffect(() => {
    let isMounted = true;
    const fetchPortalAnnouncements = async () => {
      try {
        const res = await fetch('/api/news', { cache: 'no-store' });
        const json = await res.json();
        if (isMounted && json.success && Array.isArray(json.data)) {
          setPortalAnnouncements(json.data);
        }
      } catch (err) {
        console.warn('Failed to fetch announcements for student portal:', err);
      }
    };
    fetchPortalAnnouncements();
    return () => { isMounted = false; };
  }, []);

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

        if (!payload.fullName && !payload.email && !payload.phone && Object.keys(payload.uploadedDocs || {}).length === 0) {
          localStorage.removeItem('liah_admission_draft');
          setHasSavedDraft(false);
          return;
        }

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

  const handleResumeDraft = () => {
    if (draftSavedStep) {
      setCurrentStep(draftSavedStep);
    }
  };

  // Direct Step Jump Navigation with State Validation
  const handleJumpToStep = (targetStep: number) => {
    if (targetStep === currentStep) return;
    setRegError('');
    if (targetStep === 1) {
      setCurrentStep(1);
      return;
    }
    if (targetStep === 2) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setRegError('Please complete your contact and program information on Step 1 first.');
        return;
      }
      setCurrentStep(2);
      return;
    }
    if (targetStep === 3) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setRegError('Please complete your contact and program information on Step 1 first.');
        return;
      }
      if (!password || password.length < 6) {
        setRegError('Please create a portal password (min. 6 characters) on Step 2 first.');
        return;
      }
      if (!agreeTerms) {
        setRegError('Please accept the institutional attendance & honesty policy on Step 2.');
        return;
      }
      setCurrentStep(3);
      return;
    }
    if (targetStep === 4) {
      if (!fullName.trim() || !email.trim() || !phone.trim()) {
        setRegError('Please complete your contact and program information on Step 1 first.');
        return;
      }
      if (!password || password.length < 6) {
        setRegError('Please create a portal password (min. 6 characters) on Step 2 first.');
        return;
      }
      if (!agreeTerms) {
        setRegError('Please accept the institutional attendance & honesty policy on Step 2.');
        return;
      }
      const requiredList = (docRequirementsByDegree[degreeType] || []).filter(d => d.required);
      const missing = requiredList.filter(d => !uploadedDocs[d.id]);
      if (missing.length > 0) {
        setRegError(`Please upload all mandatory documents (${missing.map(m => m.label).join(', ')}) on Step 3 before proceeding.`);
        return;
      }
      setCurrentStep(4);
      return;
    }
  };

  // Enrolment Step 3 Validation -> Proceed to Step 4 (Payment Verification)
  const handleStep3Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const requiredList = (docRequirementsByDegree[degreeType] || []).filter(d => d.required);
    const missing = requiredList.filter(d => !uploadedDocs[d.id]);
    if (missing.length > 0) {
      setRegError(`Please upload all mandatory documents (${missing.map(m => m.label).join(', ')}) before continuing.`);
      return;
    }
    saveDraft({ currentStep: 4 });
    setCurrentStep(4);
  };

  // Enrolment Step 1 Validation & Database Email Check
  const handleStep1Next = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    const cleanFullname = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (!cleanFullname || !cleanEmail || !cleanPhone) {
      setRegError('Please fill in your full name, email address, and mobile phone number.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setRegError('Please enter a valid email address (e.g. your.name@gmail.com).');
      return;
    }

    setCheckingEmail(true);
    try {
      const res = await fetch(`/api/admissions/check-email?email=${encodeURIComponent(cleanEmail)}`);
      const data = await res.json();
      if (data?.exists) {
        setRegError('An account with this email is already registered. Please log in to your Student Portal below or use another email.');
        setCheckingEmail(false);
        return;
      }
    } catch {
      // Allow proceeding if offline/local dev check has network hiccup
    } finally {
      setCheckingEmail(false);
    }

    saveDraft({ fullName: cleanFullname, email: cleanEmail, phone: cleanPhone, currentStep: 2 });
    setCurrentStep(2);
  };

  // Enrolment Step 2 Validation (Password min 6 & Terms)
  const handleStep2Next = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    if (!password || password.length < 6 || password.length > 128) {
      setRegError('Please create a secure portal password of at least 6 characters (up to 128).');
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

  const handleRegistrationPaymentProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    const maxSlotBytes = 2.5 * 1024 * 1024; // 2.5 MB limit
    setRegPaymentUploading(true);
    setRegError('');

    try {
      const file = await compressImageFile(rawFile);
      if (file.size > maxSlotBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(2);
        e.target.value = '';
        setRegError(`⚠️ Payment Proof Rejected: File is too large! Selected file "${file.name}" is ${actualMb} MB. Maximum allowed limit is 2.5 MB. Please select or compress your file.`);
        setRegPaymentUploading(false);
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('slotId', 'payment_proof');
      formData.append('category', 'payment-proofs');

      const res = await fetch('/api/admissions/upload-doc', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        e.target.value = '';
        setRegError(data.message || '⚠️ Upload failed: Payment proof file was rejected by server.');
        setRegPaymentUploading(false);
        return;
      }

      if (res.ok && data.success && data.url) {
        setRegPaymentProofUrl(data.url);
        setRegPaymentFileName(data.fileName || file.name);
        setRegPaymentFileSize(data.size || ((file.size / 1024).toFixed(0) + ' KB'));
      }
    } catch {
      setRegError('Connection error uploading payment proof. Please try again.');
    } finally {
      setRegPaymentUploading(false);
    }
  };

  const handleRemoveRegPaymentProof = () => {
    setRegPaymentProofUrl('');
    setRegPaymentFileName('');
    setRegPaymentFileSize('');
    setRegPaymentTxId('');
  };

  // Final Registration Submission -> Logs student into portal directly
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    if (!password || password.length < 6 || password.length > 128) {
      setRegLoading(false);
      setCurrentStep(2);
      setRegError('Please create a portal password (min. 6 characters) on Step 2 before submitting.');
      return;
    }

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

      const regFee = getApplicationFee(degreeType);
      
      let detectedRef = searchParams.get('ref') || searchParams.get('referral') || '';
      if (!detectedRef && typeof window !== 'undefined') {
        try {
          detectedRef = localStorage.getItem('liah_ref') || '';
          if (!detectedRef) {
            const m = document.cookie.match(/(?:^|; )liah_ref=([^;]*)/);
            if (m) detectedRef = decodeURIComponent(m[1]);
          }
        } catch {}
      }

      const res = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          full_name: fullName,
          email,
          password,
          phone,
          degree_type: degreeType,
          program_type: programType,
          study_format: studyFormat,
          document_url: docsList.length > 0 ? docsList[0].url : '',
          documents: docsList,
          payment_proof_url: regPaymentProofUrl || '',
          payment_amount: regPaymentProofUrl ? regFee : 0,
          payment_transaction_id: regPaymentTxId || '',
          ref: detectedRef ? detectedRef.trim().toUpperCase() : undefined
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
        credentials: 'include',
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
        localStorage.removeItem('liah_admission_draft');
      } else {
        setLoginError(data.message || 'Invalid email or password. If you do not have an account, please enrol.');
      }
    } catch {
      setLoginLoading(false);
      setLoginError('Connection error. Please check your network and try again.');
    }
  };

  // Handle Student Logout
  const handleStudentLogout = async () => {
    try {
      await fetch('/api/admissions/logout', { method: 'POST', credentials: 'include' });
    } catch {}
    setStudent(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('liah_admission_draft');
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
    setPayError('');
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    // Encode # for tel: URI and trigger the phone dialer
    const encodedCode = code.replace(/#/g, '%23');
    window.location.href = `tel:${encodedCode}`;
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
        credentials: 'include',
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
          setStudent(data.data?.student || updatedStudent);
          localStorage.removeItem('liah_admission_draft');
        }

        setTimeout(() => {
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
                    background: student.payment_status === 'Paid' 
                      ? '#ECFDF5' 
                      : (student.payment_proof_url || student.payment_status === 'Pending Verification') 
                        ? '#EFF6FF' 
                        : '#FEF2F2',
                    color: student.payment_status === 'Paid' 
                      ? '#059669' 
                      : (student.payment_proof_url || student.payment_status === 'Pending Verification') 
                        ? '#1D4ED8' 
                        : '#DC2626'
                  }}
                >
                  {student.payment_status === 'Paid' 
                    ? '✓ Paid' 
                    : (student.payment_proof_url || student.payment_status === 'Pending Verification') 
                      ? '⏳ Verification in Progress' 
                      : 'Pending Payment'}
                </span>
              </div>
            </div>

            {/* Official Academy Announcements & Circulars */}
            {portalAnnouncements.length > 0 && (
              <div style={{ marginBottom: '36px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                      <Megaphone size={18} />
                    </div>
                    <div>
                      <h4 style={{ color: '#081F3E', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                        Official Announcements &amp; Academic Notices
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        Important circulars and updates from the administration
                      </span>
                    </div>
                  </div>
                  <span style={{ background: '#EFF6FF', color: '#1D4ED8', fontSize: '0.78rem', fontWeight: 700, padding: '4px 10px', borderRadius: '20px' }}>
                    {portalAnnouncements.length} {portalAnnouncements.length === 1 ? 'Notice' : 'Notices'}
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {portalAnnouncements.slice(0, 3).map((item: any) => (
                    <div 
                      key={item.id}
                      style={{
                        padding: '16px',
                        background: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '16px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ flex: 1, minWidth: '240px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                          <span style={{ background: '#FEF3C7', color: '#B45309', fontSize: '0.72rem', fontWeight: 800, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                            {item.category || item.badge || 'Notice'}
                          </span>
                          <span style={{ fontSize: '0.78rem', color: '#94A3B8', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Calendar size={11} /> {item.date || 'Recent'}
                          </span>
                        </div>
                        <h5 style={{ color: '#081F3E', margin: '0 0 4px 0', fontSize: '1rem', fontWeight: 800 }}>
                          {item.title}
                        </h5>
                        <p style={{ color: '#64748B', margin: 0, fontSize: '0.86rem', lineHeight: '1.5' }}>
                          {item.excerpt || item.desc || (item.content ? item.content.slice(0, 120) + '...' : '')}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedPortalAnnouncement(item)}
                        style={{
                          background: '#081F3E',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        Read Notice <ArrowRight size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            {/* Complete Submitted Files & Dossier Documents (All Files Submitted) */}
            {(() => {
              // Gather all submitted files: academic documents, single document_url, and payment proof
              let docItems: any[] = [];
              if (Array.isArray(student.documents)) {
                docItems = [...student.documents];
              } else if (typeof student.documents === 'string') {
                try {
                  const parsed = JSON.parse(student.documents);
                  if (Array.isArray(parsed)) docItems = parsed;
                } catch {}
              }

              // Fallback for single document_url if not already in docItems
              if (student.document_url && !docItems.some((d: any) => d.url === student.document_url)) {
                docItems.unshift({
                  id: 'primary_doc',
                  label: 'Academic Qualification / Dossier',
                  fileName: 'Official Academic Document',
                  url: student.document_url,
                  type: 'academic'
                });
              }

              // Add Application Fee Payment Proof if submitted
              if (student.payment_proof_url) {
                docItems.push({
                  id: 'payment_proof',
                  label: 'Application Fee Proof of Payment',
                  fileName: student.payment_transaction_id 
                    ? `MTN MoMo Confirmation (Tx ID: ${student.payment_transaction_id})` 
                    : 'MTN MoMo Payment Screenshot / Receipt',
                  size: 'Payment Proof',
                  url: student.payment_proof_url,
                  type: 'payment',
                  status: student.payment_status === 'Paid' ? '✓ Verified' : '⏳ Verification in Progress'
                });
              }

              if (docItems.length === 0) return null;

              return (
                <div style={{ marginBottom: '36px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FileText size={18} color="#0284C7" />
                      </div>
                      <h4 style={{ color: '#081F3E', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                        Submitted Application &amp; Dossier Files
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.76rem', background: '#F1F5F9', color: '#475569', padding: '3px 10px', borderRadius: '20px', fontWeight: 700 }}>
                      {docItems.length} file{docItems.length !== 1 ? 's' : ''} submitted
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {docItems.map((doc: any, idx: number) => {
                      const isPayment = doc.type === 'payment' || doc.id === 'payment_proof';
                      return (
                        <div 
                          key={idx} 
                          style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center', 
                            background: isPayment ? '#FFFBEB' : '#F8FAFC', 
                            padding: '14px 18px', 
                            borderRadius: '10px', 
                            border: '1px solid ' + (isPayment ? '#FDE68A' : '#E2E8F0'),
                            flexWrap: 'wrap',
                            gap: '10px'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '8px',
                              background: isPayment ? '#FEF3C7' : '#E0F2FE',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0
                            }}>
                              {isPayment ? <Smartphone size={20} color="#B45309" /> : <FileText size={20} color="#0284C7" />}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                                <p style={{ margin: 0, fontWeight: 800, fontSize: '0.9rem', color: '#081F3E' }}>
                                  {doc.label || doc.fileName || `Document ${idx + 1}`}
                                </p>
                                {doc.status && (
                                  <span style={{ 
                                    fontSize: '0.72rem', 
                                    padding: '2px 8px', 
                                    borderRadius: '12px', 
                                    fontWeight: 700, 
                                    background: doc.status.includes('Verified') ? '#ECFDF5' : '#EFF6FF', 
                                    color: doc.status.includes('Verified') ? '#059669' : '#1D4ED8',
                                    border: '1px solid ' + (doc.status.includes('Verified') ? '#A7F3D0' : '#BFDBFE')
                                  }}>
                                    {doc.status}
                                  </span>
                                )}
                              </div>
                              <span style={{ fontSize: '0.76rem', color: '#64748B' }}>
                                {doc.fileName} {doc.size ? `(${doc.size})` : ''}
                              </span>
                            </div>
                          </div>

                          {doc.url && (
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                              <a
                                href={doc.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: '#FFFFFF',
                                  border: '1px solid #CBD5E1',
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: '#081F3E',
                                  textDecoration: 'none'
                                }}
                              >
                                <Eye size={13} /> View
                              </a>
                              <a
                                href={doc.url ? (doc.url.includes('?') ? `${doc.url}&download=1` : `${doc.url}?download=1`) : '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={doc.fileName || 'file'}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '5px',
                                  background: '#081F3E',
                                  border: 'none',
                                  padding: '6px 14px',
                                  borderRadius: '6px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  color: '#FFFFFF',
                                  textDecoration: 'none'
                                }}
                              >
                                <Download size={13} /> Download
                              </a>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {/* Direct Application Fee Payment & Direct Proof Upload Section - ONLY shows if student has NOT initially submitted payment proof */}
            {!student.payment_proof_url && student.payment_status !== 'Paid' && student.payment_status !== 'Pending Verification' && (
              <div style={{ marginBottom: '36px', background: '#FFFFFF', padding: '24px', borderRadius: '12px', border: '1.5px solid #FDE68A', boxShadow: '0 4px 20px rgba(245, 166, 35, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Smartphone size={18} color="#B45309" />
                    </div>
                    <div>
                      <h4 style={{ color: '#081F3E', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                        Application Fee Payment Clearance
                      </h4>
                      <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                        MTN Mobile Money Only &bull; Direct Proof of Payment Submission
                      </span>
                    </div>
                  </div>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '4px 10px',
                    borderRadius: '20px',
                    background: '#FEF3C7',
                    color: '#92400E',
                    border: '1px solid #FDE68A'
                  }}>
                    ⚠️ Action Required
                  </span>
                </div>

                {/* Program & Fee Banner */}
                <div style={{ background: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                        Your Program ({student.degree_type})
                      </span>
                      <span style={{ fontSize: '0.94rem', fontWeight: 800, color: '#081F3E' }}>
                        {student.program_type}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                        Application Fee Required
                      </span>
                      <span suppressHydrationWarning style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669' }}>
                        {getApplicationFee(student.degree_type).toLocaleString('en-US')} XAF
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#0369A1', background: '#FFFFFF', borderRadius: '6px', padding: '6px 10px', border: '1px solid #E0F2FE' }}>
                    ℹ️ <strong>Application Fee Only:</strong> No tuition fees are required on this website. Tuition is settled directly at the campus finance office after admission.
                  </div>
                </div>

                {/* MoMo Process Description */}
                <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 16px', marginBottom: '16px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#92400E', display: 'block', marginBottom: '6px' }}>
                    📌 How to pay via MTN MoMo:
                  </span>
                  <ol style={{ margin: 0, paddingLeft: '18px', fontSize: '0.78rem', color: '#78350F', lineHeight: 1.7 }}>
                    <li>Open your phone <strong>dialer</strong> (call pad).</li>
                    <li>Dial: <strong style={{ color: '#081F3E', fontFamily: 'monospace' }}>{`*126*14*670265493*${getApplicationFee(student.degree_type)}#`}</strong></li>
                    <li>Confirm transaction with your <strong>MoMo PIN</strong>.</li>
                    <li>Take a <strong>screenshot</strong> of the confirmation message.</li>
                    <li>Attach the screenshot below and tap <strong>&quot;Submit Payment Proof&quot;</strong>.</li>
                  </ol>
                </div>

                {/* Direct Upload Form */}
                <form onSubmit={handleProofSubmit}>
                  {payError && (
                    <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.84rem' }}>
                      {payError}
                    </div>
                  )}

                  {paySuccess && (
                    <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', color: '#065F46', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '0.84rem' }}>
                      ✓ Payment proof submitted successfully! Verification is in progress.
                    </div>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', margin: 0 }}>
                        📸 Attach Proof of Payment (Screenshot or PDF) *
                      </label>
                      <span style={{ fontSize: '0.72rem', background: '#E2E8F0', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                        Max 2.5 MB
                      </span>
                    </div>

                    <label
                      htmlFor="dashboard_payment_proof"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '16px',
                        border: '2px dashed ' + (payScreenshotPreview ? '#10B981' : '#CBD5E1'),
                        borderRadius: '8px',
                        background: payScreenshotPreview ? '#F0FDF4' : '#FAFAFA',
                        cursor: 'pointer',
                        textAlign: 'center'
                      }}
                    >
                      {payScreenshotPreview ? (
                        <>
                          <CheckCircle size={22} color="#10B981" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#065F46' }}>
                            {payScreenshotFile ? payScreenshotFile.name : 'Screenshot ready to submit'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#10B981', fontWeight: 600 }}>
                            Click to choose a different screenshot or receipt
                          </span>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={24} color="#64748B" />
                          <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E' }}>
                            Click to select your transaction screenshot or receipt
                          </span>
                          <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                            Max 2.5 MB &bull; PNG, JPG, JPEG, PDF (Auto-compressed)
                          </span>
                        </>
                      )}
                      <input
                        id="dashboard_payment_proof"
                        type="file"
                        accept=".png,.jpg,.jpeg,.webp,.pdf"
                        onChange={handleScreenshotChange}
                        style={{ display: 'none' }}
                      />
                    </label>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="MoMo Transaction ID / Reference (Optional)"
                      value={payTransactionId}
                      onChange={(e) => setPayTransactionId(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.82rem',
                        flex: 1,
                        minWidth: '200px'
                      }}
                    />
                    <button
                      type="submit"
                      disabled={payLoading}
                      className="btn btn-primary"
                      style={{
                        padding: '10px 22px',
                        fontSize: '0.88rem',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#081F3E',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: payLoading ? 'wait' : 'pointer'
                      }}
                    >
                      {payLoading ? <Loader2 size={16} className="animate-spin" /> : <UploadCloud size={16} />}
                      <span>{payLoading ? 'Uploading...' : 'Submit Payment Proof'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* =========================================================
                STUDENT REFERRAL & AMBASSADOR PROGRAM (REFER & EARN)
                ========================================================= */}
            <div style={{
              marginBottom: '36px',
              background: '#FFFFFF',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(245, 166, 35, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Award size={18} color="#D97706" />
                  </div>
                  <div>
                    <h4 style={{ color: '#081F3E', margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
                      Student Ambassador Program (Refer &amp; Earn)
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
                      Earn <strong>15,000 XAF</strong> paid to your MoMo for every student who enrolls using your link
                    </span>
                  </div>
                </div>
                {studentRefData?.agent && (
                  <span style={{ fontSize: '0.76rem', background: '#ECFDF5', color: '#059669', padding: '3px 10px', borderRadius: '20px', fontWeight: 800 }}>
                    ● Code Active: {studentRefData.agent.code}
                  </span>
                )}
              </div>

              {!studentRefData?.agent ? (
                <div style={{
                  background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)',
                  padding: '20px',
                  borderRadius: '10px',
                  border: '1px dashed #CBD5E1',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: '0 0 14px 0', fontSize: '0.9rem', color: '#475569', lineHeight: 1.6 }}>
                    As an official student of Liah Academy, you can earn real cash by inviting friends, classmates, and family to join our programs. When they apply using your link, their <strong>Name and Matricule</strong> are bound to your account and <strong>15,000 XAF</strong> is deposited to your MoMo upon enrolment.
                  </p>
                  <button
                    type="button"
                    onClick={handleActivateStudentReferral}
                    disabled={studentRefActivating}
                    style={{
                      background: '#081F3E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px 24px',
                      fontSize: '0.9rem',
                      fontWeight: 800,
                      cursor: studentRefActivating ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(8, 31, 62, 0.15)'
                    }}
                  >
                    <DollarSign size={16} color="#F5A623" />
                    <span>{studentRefActivating ? 'Activating Referral...' : 'Activate My Referral Link (1-Click)'}</span>
                  </button>
                </div>
              ) : (
                <div>
                  {/* Registration Period & Payout Schedule Info */}
                  {studentRefData.registration_period && (
                    <div style={{
                      background: studentRefData.registration_period.can_request_payout ? '#ECFDF5' : '#FFFBEB',
                      border: `1px solid ${studentRefData.registration_period.can_request_payout ? '#BBF7D0' : '#FDE68A'}`,
                      borderRadius: '8px',
                      padding: '10px 14px',
                      marginBottom: '14px',
                      fontSize: '0.82rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      flexWrap: 'wrap'
                    }}>
                      <div>
                        <strong style={{ color: studentRefData.registration_period.can_request_payout ? '#166534' : '#92400E' }}>
                          📅 {studentRefData.registration_period.title}
                        </strong>
                        <div style={{ color: studentRefData.registration_period.can_request_payout ? '#15803D' : '#B45309', fontSize: '0.78rem', marginTop: '2px' }}>
                          {studentRefData.registration_period.can_request_payout
                            ? 'Admissions registration intake has ended — MoMo commission withdrawals are open!'
                            : `Commission payouts unlock at the end of the registration period (${new Date(studentRefData.registration_period.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}). Keep sharing to earn 15,000 XAF per enrolled student!`}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: studentRefData.registration_period.can_request_payout ? '#10B981' : '#F59E0B',
                        color: '#FFFFFF',
                        whiteSpace: 'nowrap'
                      }}>
                        {studentRefData.registration_period.can_request_payout ? 'Withdrawals Open' : `Locked Until ${new Date(studentRefData.registration_period.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                      </span>
                    </div>
                  )}

                  {/* Referral Link & Share Box */}
                  <div style={{
                    background: '#F8FAFC',
                    padding: '16px',
                    borderRadius: '10px',
                    border: '1px solid #E2E8F0',
                    marginBottom: '16px'
                  }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#081F3E', display: 'block', marginBottom: '8px' }}>
                      🔗 Your Unique Referral Link:
                    </span>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{
                        flex: 1,
                        minWidth: '220px',
                        background: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontFamily: 'monospace',
                        fontSize: '0.82rem',
                        color: '#081F3E',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {typeof window !== 'undefined' ? `${window.location.origin}/portal?tab=enrol&ref=${studentRefData.agent.code}` : `https://liahacademy.org/portal?tab=enrol&ref=${studentRefData.agent.code}`}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}/portal?tab=enrol&ref=${studentRefData.agent.code}`;
                          navigator.clipboard.writeText(url);
                          setStudentRefCopiedLink(true);
                          setTimeout(() => setStudentRefCopiedLink(false), 2500);
                        }}
                        style={{
                          background: studentRefCopiedLink ? '#10B981' : '#081F3E',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {studentRefCopiedLink ? <Check size={14} /> : <Copy size={14} />}
                        <span>{studentRefCopiedLink ? 'Copied!' : 'Copy'}</span>
                      </button>
                      <a
                        href={`https://wa.me/?text=${encodeURIComponent(`Hey! Check out Liah Academy in Buea for top Software Engineering & IT diplomas. Apply using my referral link here: ${typeof window !== 'undefined' ? window.location.origin : 'https://liahacademy.org'}/portal?tab=enrol&ref=${studentRefData.agent.code}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: '#25D366',
                          color: '#FFFFFF',
                          borderRadius: '6px',
                          padding: '8px 14px',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Smartphone size={14} /> Share
                      </a>
                    </div>
                  </div>

                  {/* 3 Metric Cards */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '16px' }}>
                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block' }}>Students Referred</span>
                      <strong style={{ fontSize: '1.3rem', color: '#081F3E', fontWeight: 800 }}>
                        {studentRefData.summary?.total_referrals ?? (studentRefData.downline?.length || 0)}
                      </strong>
                    </div>

                    <div style={{ background: '#F8FAFC', padding: '12px 16px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                      <span style={{ fontSize: '0.76rem', color: '#64748B', display: 'block' }}>Enrolled &amp; Paid</span>
                      <strong style={{ fontSize: '1.3rem', color: '#10B981', fontWeight: 800 }}>
                        {studentRefData.summary?.paid_referrals ?? 0}
                      </strong>
                    </div>

                    <div style={{ background: '#F0FDF4', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                      <span style={{ fontSize: '0.76rem', color: '#166534', display: 'block' }}>Available MoMo Balance</span>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <strong style={{ fontSize: '1.3rem', color: '#166534', fontWeight: 800 }}>
                          {(studentRefData.agent?.balance || 0).toLocaleString()} XAF
                        </strong>
                        <button
                          type="button"
                          onClick={() => {
                            if (studentRefData.registration_period && !studentRefData.registration_period.can_request_payout) {
                              const d = new Date(studentRefData.registration_period.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
                              alert(`Ambassador commission payouts can only be requested at the end of the registration period (${d}). Payouts will automatically open once this intake concludes.`);
                              return;
                            }
                            setStudentRefPayoutOpen(true);
                          }}
                          disabled={(studentRefData.agent?.balance || 0) < 2000 || (Boolean(studentRefData.registration_period) && !studentRefData.registration_period?.can_request_payout)}
                          title={studentRefData.registration_period && !studentRefData.registration_period.can_request_payout ? `Withdrawals open at the end of the registration period (${new Date(studentRefData.registration_period.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })})` : ''}
                          style={{
                            background: ((studentRefData.agent?.balance || 0) >= 2000 && (!studentRefData.registration_period || studentRefData.registration_period.can_request_payout)) ? '#10B981' : '#94A3B8',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: ((studentRefData.agent?.balance || 0) >= 2000 && (!studentRefData.registration_period || studentRefData.registration_period.can_request_payout)) ? 'pointer' : 'not-allowed'
                          }}
                        >
                          {(!studentRefData.registration_period || studentRefData.registration_period.can_request_payout) ? 'Withdraw' : '🔒 Locked'}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Downline Table */}
                  <div style={{ marginTop: '16px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#081F3E', display: 'block', marginBottom: '8px' }}>
                      👥 Your Referred Applicants ({studentRefData.downline?.length || 0}):
                    </span>
                    {(!studentRefData.downline || studentRefData.downline.length === 0) ? (
                      <p style={{ margin: 0, fontSize: '0.82rem', color: '#94A3B8', fontStyle: 'italic' }}>
                        No applicants yet. Share your referral link with prospective students to start earning!
                      </p>
                    ) : (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                          <thead>
                            <tr style={{ background: '#F1F5F9', color: '#64748B', textAlign: 'left' }}>
                              <th style={{ padding: '8px 10px', borderRadius: '6px 0 0 6px' }}>Student Name</th>
                              <th style={{ padding: '8px 10px' }}>Matricule</th>
                              <th style={{ padding: '8px 10px' }}>Program</th>
                              <th style={{ padding: '8px 10px' }}>Status</th>
                              <th style={{ padding: '8px 10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Commission</th>
                            </tr>
                          </thead>
                          <tbody>
                            {studentRefData.downline.map((d: any, idx: number) => {
                              const isPaid = (d.payment_status || '').toLowerCase().includes('paid');
                              return (
                                <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                                  <td style={{ padding: '8px 10px', fontWeight: 700, color: '#081F3E' }}>{d.student_name}</td>
                                  <td style={{ padding: '8px 10px', fontFamily: 'monospace', color: '#0284C7', fontWeight: 700 }}>{d.student_matricule || 'In Review'}</td>
                                  <td style={{ padding: '8px 10px', color: '#64748B' }}>{d.program_type}</td>
                                  <td style={{ padding: '8px 10px' }}>
                                    <span style={{
                                      fontSize: '0.72rem',
                                      padding: '2px 8px',
                                      borderRadius: '4px',
                                      fontWeight: 700,
                                      background: isPaid ? '#ECFDF5' : '#FEF3C7',
                                      color: isPaid ? '#059669' : '#B45309'
                                    }}>
                                      {isPaid ? '✓ Paid' : '⏳ Pending'}
                                    </span>
                                  </td>
                                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 800, color: isPaid ? '#10B981' : '#94A3B8' }}>
                                    {isPaid ? `${(d.commission_amount || d.commission_earned || 15000).toLocaleString()} XAF` : '15,000 XAF'}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Payout Receipts / Proofs */}
                  {studentRefData.payouts && studentRefData.payouts.length > 0 && (
                    <div style={{ marginTop: '16px', borderTop: '1px solid #E2E8F0', paddingTop: '14px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#081F3E', display: 'block', marginBottom: '8px' }}>
                        💳 Your MoMo Withdrawal History:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {studentRefData.payouts.map((p: any, idx: number) => (
                          <div key={idx} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            background: '#F8FAFC',
                            padding: '8px 12px',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            flexWrap: 'wrap',
                            gap: '6px'
                          }}>
                            <div>
                              <strong>{p.amount.toLocaleString()} XAF</strong> to {p.momo_number}
                              <span style={{ color: '#94A3B8', marginLeft: '6px' }}>({new Date(p.created_at).toLocaleDateString()})</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                background: p.status === 'completed' ? '#ECFDF5' : '#EFF6FF',
                                color: p.status === 'completed' ? '#059669' : '#1D4ED8'
                              }}>
                                {p.status === 'completed' ? '✓ Paid & Deposited' : '⏳ Pending Admin Deposit'}
                              </span>
                              {p.proof_screenshot && (
                                <button
                                  type="button"
                                  onClick={() => setStudentRefProofModal(p.proof_screenshot)}
                                  style={{
                                    background: '#EFF6FF',
                                    color: '#0284C7',
                                    border: '1px solid #BAE6FD',
                                    borderRadius: '4px',
                                    padding: '2px 8px',
                                    fontSize: '0.72rem',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  View Deposit Proof
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
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

                {/* Auto-saved draft notification with Resume Option */}
                {hasSavedDraft && currentStep === 1 && (
                  <div style={{ background: '#081F3E', color: '#FFFFFF', padding: '14px 18px', borderRadius: '8px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ fontSize: '1.2rem' }}>💾</span>
                      <div>
                        <strong style={{ display: 'block', fontSize: '0.88rem', color: '#FFFFFF' }}>
                          Welcome back{fullName ? `, ${fullName}` : ''}! You have a saved application draft.
                        </strong>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      {draftSavedStep > 1 && (
                        <button
                          type="button"
                          onClick={handleResumeDraft}
                          style={{ background: '#F5A623', border: 'none', color: '#081F3E', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Resume Step {draftSavedStep}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={handleClearDraft}
                        style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#FFFFFF', borderRadius: '4px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Start Fresh
                      </button>
                    </div>
                  </div>
                )}

                {/* 4-Step Breadcrumb Tracker (Interactive Navigation) */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', position: 'relative' }}>
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(1)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 1 ? 1 : 0.4 }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 1 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {currentStep > 1 ? '✓' : '1'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E', textDecoration: currentStep === 1 ? 'underline' : 'none' }}>Bio &amp; Program</span>
                  </button>
                  <div style={{ flex: 1, height: '2px', background: currentStep >= 2 ? '#081F3E' : '#E2E8F0', margin: '0 8px' }} />
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(2)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 2 ? 1 : 0.4 }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 2 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {currentStep > 2 ? '✓' : '2'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E', textDecoration: currentStep === 2 ? 'underline' : 'none' }}>Security &amp; Terms</span>
                  </button>
                  <div style={{ flex: 1, height: '2px', background: currentStep >= 3 ? '#081F3E' : '#E2E8F0', margin: '0 8px' }} />
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(3)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 3 ? 1 : 0.4 }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 3 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      {currentStep > 3 ? '✓' : '3'}
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E', textDecoration: currentStep === 3 ? 'underline' : 'none' }}>Documents</span>
                  </button>
                  <div style={{ flex: 1, height: '2px', background: currentStep >= 4 ? '#081F3E' : '#E2E8F0', margin: '0 8px' }} />
                  <button
                    type="button"
                    onClick={() => handleJumpToStep(4)}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep >= 4 ? 1 : 0.4 }}
                  >
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: currentStep >= 4 ? '#081F3E' : '#CBD5E1', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 800 }}>
                      4
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#081F3E', textDecoration: currentStep === 4 ? 'underline' : 'none' }}>Payment Proof</span>
                  </button>
                </div>

                {/* Sub-header Step Indicator with Quick Previous Link */}
                {currentStep > 1 && (
                  <div style={{ marginBottom: '18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '8px', padding: '8px 14px' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0284C7',
                        fontSize: '0.84rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '2px 0'
                      }}
                    >
                      <ArrowLeft size={14} /> ← Go back to Step {currentStep - 1}: {
                        currentStep === 2 ? 'Bio & Program' :
                        currentStep === 3 ? 'Security & Terms' : 'Documents'
                      }
                    </button>
                    <span style={{ fontSize: '0.78rem', color: '#1E40AF', fontWeight: 600 }}>
                      Step {currentStep} of 4
                    </span>
                  </div>
                )}

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
                      disabled={checkingEmail}
                      className="btn btn-primary"
                      style={{ width: '100%', padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                      {checkingEmail ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Checking Email Availability...</span>
                        </>
                      ) : (
                        <>
                          <span>Next: Security &amp; Terms</span>
                          <ArrowRight size={16} />
                        </>
                      )}
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
                          style={{
                            width: '100%',
                            padding: '12px 42px 12px 14px',
                            borderRadius: '8px',
                            fontSize: '0.92rem',
                            border: password.length > 0 && password.length < 6 ? '1.5px solid #EF4444' : password.length >= 6 ? '1.5px solid #10B981' : undefined
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowEnrolPassword(!showEnrolPassword)}
                          style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                        >
                          {showEnrolPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                      
                      {/* Real-Time Password Validity Feedback */}
                      <div style={{ marginTop: '6px', fontSize: '0.78rem' }}>
                        {password.length === 0 ? (
                          <span style={{ color: '#64748B' }}>
                            🔒 Choose at least 6 characters (used to sign into your Student Portal).
                          </span>
                        ) : password.length < 6 ? (
                          <span style={{ color: '#DC2626', fontWeight: 600 }}>
                            ⚠️ Password too short: {password.length}/6 characters typed (minimum 6 required).
                          </span>
                        ) : (
                          <span style={{ color: '#059669', fontWeight: 700 }}>
                            ✓ Password length valid ({password.length} characters).
                          </span>
                        )}
                      </div>
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
                        style={{
                          padding: '12px 20px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#F1F5F9',
                          border: '1.5px solid #CBD5E1',
                          color: '#334155',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.borderColor = '#94A3B8'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                      >
                        <ArrowLeft size={16} /> Back to Bio
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

                {/* STEP 3: DOCUMENT UPLOADS */}
                {currentStep === 3 && (
                  <form onSubmit={handleStep3Next}>
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
                        style={{
                          padding: '12px 20px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#F1F5F9',
                          border: '1.5px solid #CBD5E1',
                          color: '#334155',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.borderColor = '#94A3B8'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                      >
                        <ArrowLeft size={16} /> Back to Security
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        style={{ flex: 1, padding: '14px', fontSize: '0.95rem', fontWeight: 800, borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      >
                        <span>Next: Payment Proof</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </form>
                )}

                {/* STEP 4: APPLICATION FEE PAYMENT PROOF */}
                {currentStep === 4 && (
                  <form onSubmit={handleRegisterSubmit}>
                    {/* Program & Fee Summary Banner */}
                    <div style={{
                      background: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      marginBottom: '18px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <span style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                            Your Program ({degreeType})
                          </span>
                          <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#081F3E' }}>
                            {programType}
                          </h4>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.74rem', color: '#0369A1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '2px' }}>
                            Application Fee
                          </span>
                          <span suppressHydrationWarning style={{ fontSize: '1.35rem', fontWeight: 900, color: '#059669' }}>
                            {getApplicationFee(degreeType).toLocaleString('en-US')} XAF
                          </span>
                        </div>
                      </div>
                      <div style={{
                        marginTop: '10px',
                        padding: '8px 12px',
                        background: '#FFFFFF',
                        borderRadius: '6px',
                        border: '1px solid #E0F2FE',
                        fontSize: '0.78rem',
                        color: '#0369A1',
                        fontWeight: 600
                      }}>
                        ℹ️ <strong>Application Fee Only:</strong> No tuition fees are required on this website. Tuition is settled directly at the campus finance office after admission.
                      </div>
                    </div>

                    {/* Step-by-Step Payment Instructions */}
                    <div style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: '10px', padding: '14px 18px', marginBottom: '18px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#92400E', display: 'block', marginBottom: '8px' }}>
                        📌 How to pay via MTN MoMo:
                      </span>
                      <ol style={{ margin: 0, paddingLeft: '20px', fontSize: '0.8rem', color: '#78350F', lineHeight: 1.8 }}>
                        <li>Open your phone <strong>dialer</strong> (call pad).</li>
                        <li>
                          Dial the code below:{' '}
                          <strong style={{ color: '#081F3E', fontFamily: 'monospace' }}>
                            {`*126*14*670265493*${getApplicationFee(degreeType)}#`}
                          </strong>
                        </li>
                        <li>Confirm the transaction with your <strong>MoMo PIN</strong>.</li>
                        <li>Take a <strong>screenshot</strong> of the confirmation message.</li>
                        <li>Attach the screenshot below and tap <strong>&quot;Submit Application &amp; Open Portal&quot;</strong>.</li>
                      </ol>
                    </div>

                    {/* Attach Proof of Payment (Screenshot) Holder */}
                    <div style={{
                      background: regPaymentProofUrl ? '#F0FDF4' : '#FFFFFF',
                      border: regPaymentProofUrl ? '1.5px solid #86EFAC' : '2px dashed #CBD5E1',
                      borderRadius: '12px',
                      padding: '18px',
                      marginBottom: '16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <label style={{ fontSize: '0.86rem', fontWeight: 800, color: '#081F3E', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                          📸 Attach Proof of Payment (Screenshot)
                        </label>
                        <span style={{ fontSize: '0.72rem', background: '#F1F5F9', color: '#475569', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          Max 2.5 MB
                        </span>
                      </div>

                      {regPaymentProofUrl ? (
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF', padding: '12px 16px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <CheckCircle size={22} color="#16A34A" />
                            <div>
                              <strong style={{ fontSize: '0.86rem', color: '#166534', display: 'block' }}>
                                ✓ Screenshot Attached: {regPaymentFileName}
                              </strong>
                              <span style={{ fontSize: '0.74rem', color: '#15803D' }}>
                                {regPaymentFileSize} &bull; Ready for verification upon submission
                              </span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleRemoveRegPaymentProof}
                            style={{
                              background: '#FEE2E2',
                              border: '1px solid #FCA5A5',
                              color: '#DC2626',
                              borderRadius: '6px',
                              padding: '6px 12px',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={13} /> Remove
                          </button>
                        </div>
                      ) : (
                        <div>
                          <label
                            htmlFor="reg_payment_proof_step4"
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '8px',
                              padding: '24px 16px',
                              background: '#FAFAFA',
                              borderRadius: '8px',
                              cursor: regPaymentUploading ? 'wait' : 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            {regPaymentUploading ? (
                              <>
                                <Loader2 size={26} color="#081F3E" className="animate-spin" />
                                <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#081F3E' }}>Compressing and uploading screenshot...</span>
                              </>
                            ) : (
                              <>
                                <ImageIcon size={28} color="#64748B" />
                                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#081F3E' }}>
                                  Click to select your transaction screenshot or receipt
                                </span>
                                <span style={{ fontSize: '0.75rem', color: '#64748B' }}>
                                  PNG, JPG, JPEG, WEBP, PDF &bull; Auto-compressed to under 2.5 MB
                                </span>
                              </>
                            )}
                            <input
                              id="reg_payment_proof_step4"
                              type="file"
                              accept=".png,.jpg,.jpeg,.webp,.pdf"
                              disabled={regPaymentUploading}
                              onChange={handleRegistrationPaymentProofUpload}
                              style={{ display: 'none' }}
                            />
                          </label>

                          <div style={{ marginTop: '12px' }}>
                            <input
                              type="text"
                              placeholder="MoMo Transaction ID / Reference (Optional)"
                              value={regPaymentTxId}
                              onChange={(e) => setRegPaymentTxId(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '10px 14px',
                                borderRadius: '6px',
                                border: '1px solid #CBD5E1',
                                fontSize: '0.82rem'
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Informative Guidance Notice */}
                    <div style={{
                      fontSize: '0.78rem',
                      color: '#475569',
                      background: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      marginBottom: '20px',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '8px',
                      lineHeight: 1.5
                    }}>
                      <span style={{ fontSize: '1rem', marginTop: '-1px' }}>💡</span>
                      <span>
                        <strong>Optional at registration:</strong> If you have not completed your MoMo payment yet, you can leave this empty and click <em>&quot;Submit Application &amp; Open Portal&quot;</em>. You can run the dial code and upload your payment proof anytime directly in your Student Portal after registering.
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        type="button"
                        onClick={() => setCurrentStep(3)}
                        style={{
                          padding: '12px 20px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          background: '#F1F5F9',
                          border: '1.5px solid #CBD5E1',
                          color: '#334155',
                          fontSize: '0.88rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { e.currentTarget.style.background = '#E2E8F0'; e.currentTarget.style.borderColor = '#94A3B8'; }}
                        onMouseOut={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#CBD5E1'; }}
                      >
                        <ArrowLeft size={16} /> Back to Documents
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
                      width={54}
                      height={54}
                      style={{ height: '54px', width: '54px', aspectRatio: '1 / 1', margin: '0 auto', display: 'block' }} 
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

        {/* ========================================================
            MODAL: STUDENT REFERRAL WITHDRAWAL REQUEST
            ======================================================== */}
        {studentRefPayoutOpen && studentRefData?.agent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 31, 62, 0.75)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, color: '#081F3E', fontSize: '1.25rem', fontWeight: 800 }}>
                  Withdraw Ambassador Commission
                </h3>
                <button
                  type="button"
                  onClick={() => setStudentRefPayoutOpen(false)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}
                >
                  ✕
                </button>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 16px 0' }}>
                Available Balance: <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>{studentRefData.agent.balance.toLocaleString()} XAF</strong>
              </p>

              {studentRefData.registration_period && !studentRefData.registration_period.can_request_payout && (
                <div style={{
                  background: '#FFFBEB',
                  color: '#92400E',
                  border: '1px solid #FDE68A',
                  borderRadius: '8px',
                  padding: '12px 14px',
                  fontSize: '0.84rem',
                  lineHeight: 1.5,
                  marginBottom: '16px'
                }}>
                  🔒 <strong>Payouts Locked:</strong> Commission withdrawals for <strong>{studentRefData.registration_period.title}</strong> will only be released at the end of the registration period on <strong>{new Date(studentRefData.registration_period.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
                </div>
              )}

              {studentRefPayoutMsg && (
                <div style={{
                  background: studentRefPayoutMsg.type === 'error' ? '#FEF2F2' : '#ECFDF5',
                  color: studentRefPayoutMsg.type === 'error' ? '#DC2626' : '#065F46',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  fontSize: '0.84rem',
                  marginBottom: '14px'
                }}>
                  {studentRefPayoutMsg.text}
                </div>
              )}

              <form onSubmit={handleStudentPayoutSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                    Withdrawal Amount (XAF) *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={studentRefData.agent.balance}
                    step={1000}
                    placeholder={`Min 2,000 up to ${studentRefData.agent.balance}`}
                    value={studentRefPayoutAmount}
                    onChange={(e) => setStudentRefPayoutAmount(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.92rem',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                    Confirm MoMo Number for Deposit *
                  </label>
                  <input
                    type="tel"
                    required
                    value={studentRefPayoutMoMo}
                    onChange={(e) => setStudentRefPayoutMoMo(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.92rem',
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ fontSize: '0.74rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                    Admin will deposit via MoMo and upload the screenshot receipt.
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setStudentRefPayoutOpen(false)}
                    style={{
                      flex: 1,
                      background: '#F1F5F9',
                      color: '#475569',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={studentRefPayoutLoading || (Boolean(studentRefData.registration_period) && !studentRefData.registration_period?.can_request_payout)}
                    style={{
                      flex: 2,
                      background: (studentRefData.registration_period && !studentRefData.registration_period.can_request_payout) ? '#94A3B8' : '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      fontWeight: 800,
                      cursor: (studentRefPayoutLoading || (studentRefData.registration_period && !studentRefData.registration_period.can_request_payout)) ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {studentRefPayoutLoading
                      ? 'Submitting...'
                      : (studentRefData.registration_period && !studentRefData.registration_period.can_request_payout)
                        ? '🔒 Locked Until End of Intake'
                        : 'Confirm Withdrawal'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================
            MODAL: VIEW MOMO DEPOSIT PROOF IN PORTAL
            ======================================================== */}
        {studentRefProofModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(8, 31, 62, 0.85)',
            zIndex: 99999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '560px',
              width: '100%',
              padding: '24px',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h4 style={{ margin: 0, color: '#081F3E', fontSize: '1.15rem', fontWeight: 800 }}>
                  Official MoMo Deposit Proof
                </h4>
                <button
                  type="button"
                  onClick={() => setStudentRefProofModal(null)}
                  style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}
                >
                  ✕
                </button>
              </div>

              <div style={{ flex: 1, overflowY: 'auto', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', padding: '14px', border: '1px solid #E2E8F0' }}>
                <img
                  src={studentRefProofModal}
                  alt="MoMo Deposit Proof"
                  style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }}
                />
              </div>

              <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <a
                  href={studentRefProofModal}
                  download="liah_momo_deposit_proof"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#081F3E',
                    color: '#FFFFFF',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Download size={15} /> Download Proof
                </a>
                <button
                  type="button"
                  onClick={() => setStudentRefProofModal(null)}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 16px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Official Academy Announcement Reader Modal */}
        {selectedPortalAnnouncement && (
          <div 
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(8, 31, 62, 0.75)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px'
            }}
            onClick={() => setSelectedPortalAnnouncement(null)}
          >
            <div 
              style={{
                background: '#FFFFFF',
                borderRadius: '16px',
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px 24px', borderBottom: '1px solid #E2E8F0', background: '#F8FAFC', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ 
                    background: '#FEF3C7', 
                    color: '#B45309', 
                    fontSize: '0.75rem', 
                    fontFamily: 'var(--font-mono)', 
                    fontWeight: 800, 
                    padding: '4px 10px', 
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}>
                    {selectedPortalAnnouncement.category || selectedPortalAnnouncement.badge || 'Official Notice'}
                  </span>
                  {selectedPortalAnnouncement.date && (
                    <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {selectedPortalAnnouncement.date}
                    </span>
                  )}
                </div>
                <button 
                  type="button"
                  onClick={() => setSelectedPortalAnnouncement(null)}
                  style={{ background: '#E2E8F0', border: 'none', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#334155' }}
                  aria-label="Close Notice"
                >
                  <X size={16} />
                </button>
              </div>

              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {selectedPortalAnnouncement.image && (
                  <div style={{ position: 'relative', width: '100%', height: '260px', borderRadius: '10px', overflow: 'hidden', background: '#0B1528' }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedPortalAnnouncement.image}
                      alt={selectedPortalAnnouncement.title || 'Announcement Flyer'}
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  </div>
                )}

                <h3 style={{ color: '#081F3E', fontSize: '1.4rem', fontWeight: 800, margin: 0, lineHeight: 1.35 }}>
                  {selectedPortalAnnouncement.title}
                </h3>

                {selectedPortalAnnouncement.excerpt && (
                  <div style={{ background: '#F1F5F9', padding: '12px 16px', borderRadius: '8px', borderLeft: '4px solid #0284C7', color: '#1E293B', fontSize: '0.92rem', fontWeight: 600, lineHeight: 1.6 }}>
                    {selectedPortalAnnouncement.excerpt}
                  </div>
                )}

                {selectedPortalAnnouncement.content && (
                  <div style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                    {selectedPortalAnnouncement.content}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '14px', paddingTop: '16px', borderTop: '1px solid #E2E8F0' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPortalAnnouncement(null)}
                    style={{
                      background: '#081F3E',
                      color: '#FFFFFF',
                      padding: '10px 20px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.88rem',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Close Notice
                  </button>
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
