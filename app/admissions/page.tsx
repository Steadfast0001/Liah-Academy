'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Calculator, UserCheck, ShieldCheck, CreditCard, 
  CheckCircle, FileText, Lock, ArrowRight, ArrowLeft, 
  UserPlus, AlertCircle, RefreshCw, Sparkles, Check,
  UploadCloud, FileCheck, Trash2, Paperclip, Loader2,
  Clock, Award, Building, Mail, MapPin, Info, Zap
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

function AdmissionsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const degreeParam = searchParams.get('degree');
  const programParam = searchParams.get('program');

  // Application Form State
  const [currentStep, setCurrentStep] = useState(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [degreeType, setDegreeType] = useState<'HND' | 'ND' | 'Certification'>('HND');
  const [programType, setProgramType] = useState('Software Engineering HND');
  const [studyFormat, setStudyFormat] = useState('oncampus');
  const [uploadedDocs, setUploadedDocs] = useState<Record<string, { fileName: string; size: string; label: string; url?: string }>>({});
  const [uploadingSlot, setUploadingSlot] = useState<string | null>(null);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');
  const [prefilledMessage, setPrefilledMessage] = useState<string | null>(null);
  const [hasSavedDraft, setHasSavedDraft] = useState(false);

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

  // Pre-fill from URL parameters & Restore Auto-Saved Incomplete Draft
  useEffect(() => {
    // Pre-fill from URL parameters
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
      setCurrentStep(1);
    }

    // Restore auto-saved draft if user left without completing
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
  }, [degreeParam, programParam]);

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

  // Step 1 Validation
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

  // Step 2 Validation
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

  // Document Upload Handler for Step 3 (Auto-optimized fast client compression + distributed upload budget)
  const handleFileUploadForSlot = async (slotId: string, slotLabel: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawFile = e.target.files?.[0];
    if (!rawFile) return;

    // Per-document distributed allocation: 2.5 MB max per slot, 10 MB total
    const maxSlotBytes = 2.5 * 1024 * 1024; // 2.5 MB per slot
    const maxTotalBytes = 10 * 1024 * 1024; // 10 MB overall budget

    setUploadingSlot(slotId);
    setRegError('');

    try {
      // 1. Instant client-side optimization for photos (compresses 10MB camera photos to ~300KB in 30ms)
      const file = await compressImageFile(rawFile);

      if (file.size > maxSlotBytes) {
        const actualMb = (file.size / (1024 * 1024)).toFixed(2);
        setRegError(`File "${file.name}" is ${actualMb} MB. To ensure balanced upload performance, each document is allocated up to 2.5 MB (Total Budget: 10 MB). Please select or compress your document.`);
        setUploadingSlot(null);
        return;
      }

      // Calculate current cumulative total size
      const currentTotalBytes = Object.values(uploadedDocs).reduce((acc, doc: any) => {
        const docSizeBytes = doc.bytes || 350 * 1024;
        return acc + docSizeBytes;
      }, 0);

      if (currentTotalBytes + file.size > maxTotalBytes) {
        setRegError(`Total upload budget (10 MB) exceeded. Please remove or compress existing files.`);
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

  // Final Registration Submission -> Navigates to /portal
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegLoading(true);
    setRegError('');

    // Check required documents
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
        // Seamlessly route to dedicated Student Portal
        router.push('/portal');
      } else {
        setRegError(data.message || 'Registration failed. Please check your details and try again.');
      }
    } catch (netErr: any) {
      console.error('Registration error:', netErr);
      setRegLoading(false);
      setRegError(netErr?.message && netErr.message !== 'Failed to fetch' ? netErr.message : 'Connection error. Please ensure your network is connected and try again.');
    }
  };

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="course-badge">Admissions &amp; Portal</span>
          <h1>Admissions &amp; Tuition<br />Portal</h1>
          <p className="sub-header">
            Review admission requirements, check transparent institutional tuition schedules, and enrol for upcoming cohorts.
          </p>
        </div>

        {/* 1. ADMISSION REQUIREMENTS & TUITION SCHEDULE (SIDE-BY-SIDE CARDS MATCHING IMAGE) */}
        <section id="requirements" style={{ marginBottom: '60px', scrollMarginTop: '120px' }}>
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={16} color="#B45309" />
                  </div>
                  <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                    Admission Requirements
                  </h3>
                </div>
                
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '22px' }}>
                  Prospective students must provide the following documentation during registration to qualify for academic review:
                </p>

                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.88rem', color: '#334155' }}>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>GCE Advanced Level</strong> (Minimum 2 papers) or equivalent.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Clear scanned copy</strong> of National ID card or Passport.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Copy of High School transcripts</strong> / GCE Ordinary Level.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Statement of purpose</strong> / letter of interest for software engineering/cybersecurity.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                    <span style={{ color: '#F5A623', fontWeight: 900, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                    <span><strong>Tuition / Registration Payment Clearance:</strong> All registrations are complete only after the applicant has completed payment.</span>
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
                  All registrations and lab workstation reservations are complete only after the applicant has completed payment.
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CreditCard size={16} color="#B45309" />
                  </div>
                  <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                    Institutional Tuition Schedule
                  </h3>
                </div>
                
                <p style={{ color: '#64748B', fontSize: '0.9rem', lineHeight: '1.55', marginBottom: '20px' }}>
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
                    DIRECT ADMISSIONS
                  </span>
                  <h4 style={{ color: '#FFFFFF', margin: '2px 0', fontSize: '1.2rem', fontWeight: 800 }}>
                    Ready to Begin?
                  </h4>
                  <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>
                    Complete registration below to reserve your cohort lab station.
                  </span>
                </div>

                <a 
                  href="#apply" 
                  style={{ 
                    background: '#F5A623', 
                    color: '#081F3E', 
                    padding: '9px 18px', 
                    borderRadius: '6px', 
                    fontWeight: 800, 
                    fontSize: '0.85rem', 
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Apply Now &rarr;
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 2. ADMISSIONS APPLICATION FORM SECTION */}
        <section id="apply" style={{ scrollMarginTop: '120px' }}>
          
          {/* Quick Portal Switcher Banner */}
          <div style={{
            background: '#FFFFFF',
            border: '1.5px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px 24px',
            maxWidth: '760px',
            margin: '0 auto 28px auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
          }}>
            <div>
              <strong style={{ color: '#081F3E', fontSize: '0.95rem', display: 'block', marginBottom: '2px' }}>
                Already registered or applied?
              </strong>
              <span style={{ color: '#64748B', fontSize: '0.82rem' }}>
                Access the dedicated Student Portal to check your dossier status, download letters, or submit payments.
              </span>
            </div>
            <Link
              href="/portal"
              style={{
                background: '#081F3E',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '6px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Access Student Portal <ArrowRight size={14} />
            </Link>
          </div>

          {/* APPLICATION FORM CONTAINER */}
          <div className="premium-card" style={{ maxWidth: '760px', margin: '0 auto', padding: '36px' }}>
            
            {/* Header / Title */}
            <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '16px', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#F5A623', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ENROLMENT DOSSIER
              </span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#081F3E', margin: '4px 0 0 0' }}>
                Online Enrolment Application
              </h2>
            </div>

            {/* Auto-Saved Draft Notification */}
            {hasSavedDraft && (
              <div style={{
                background: 'linear-gradient(135deg, #081F3E 0%, #0F2F57 100%)',
                border: '1.5px solid #F5A623',
                borderRadius: '10px',
                padding: '12px 16px',
                marginBottom: '20px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>💾</span>
                  <span style={{ fontSize: '0.82rem' }}>
                    Welcome back{fullName ? `, ${fullName}` : ''}! Your progress at <strong>Step {currentStep} of 3</strong> has been saved.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleClearDraft}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    color: '#CBD5E1',
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    cursor: 'pointer'
                  }}
                >
                  Start Fresh
                </button>
              </div>
            )}

            {/* Pre-fill Notification */}
            {prefilledMessage && (
              <div style={{ 
                background: '#FEF3C7', 
                border: '1px solid rgba(245, 166, 35, 0.4)', 
                padding: '10px 14px', 
                borderRadius: '8px', 
                marginBottom: '20px', 
                color: '#B45309', 
                fontWeight: 700, 
                fontSize: '0.85rem' 
              }}>
                ✓ {prefilledMessage}
              </div>
            )}

            {/* 3 Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
              {[
                { step: 1, label: 'Bio & Program' },
                { step: 2, label: 'Security & Terms' },
                { step: 3, label: 'Documents' }
              ].map((s) => (
                <div key={s.step} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: currentStep >= s.step ? '#081F3E' : '#E2E8F0',
                    color: currentStep >= s.step ? '#FFFFFF' : '#64748B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '0.85rem'
                  }}>
                    {currentStep > s.step ? '✓' : s.step}
                  </div>
                  <span style={{ fontSize: '0.82rem', fontWeight: currentStep === s.step ? 800 : 500, color: currentStep === s.step ? '#081F3E' : '#94A3B8' }}>
                    {s.label}
                  </span>
                  {s.step < 3 && <div style={{ flex: 1, height: '2px', background: currentStep > s.step ? '#081F3E' : '#E2E8F0', margin: '0 8px' }} />}
                </div>
              ))}
            </div>

            {regError && (
              <div style={{ background: '#FEF2F2', border: '1px solid #FCA5A5', color: '#DC2626', padding: '12px 16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem' }}>
                {regError}
              </div>
            )}

            {/* FORM BODY */}
            <form onSubmit={currentStep === 1 ? handleStep1Next : currentStep === 2 ? handleStep2Next : handleRegisterSubmit}>
              
              {/* STEP 1: Bio & Programme */}
              {currentStep === 1 && (
                <div>
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label htmlFor="admissions_fullname" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Applicant Full Legal Name *
                    </label>
                    <input
                      id="admissions_fullname"
                      type="text"
                      className="form-input-light"
                      required
                      placeholder="e.g. Marie Claire Tamba"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="admissions_email" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                        Email Address *
                      </label>
                      <input
                        id="admissions_email"
                        type="email"
                        className="form-input-light"
                        required
                        placeholder="e.g. marie@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                      />
                    </div>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label htmlFor="admissions_phone" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                        Mobile Phone Number *
                      </label>
                      <input
                        id="admissions_phone"
                        type="tel"
                        className="form-input-light"
                        required
                        placeholder="e.g. 670 123 456"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                      />
                    </div>
                  </div>

                  {/* Degree Track Selection */}
                  <div className="form-group" style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '8px' }}>
                      Academic Division Track *
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                      {(['HND', 'Certification', 'ND'] as const).map(deg => (
                        <button
                          key={deg}
                          type="button"
                          onClick={() => handleDegreeChange(deg)}
                          style={{
                            padding: '12px 8px',
                            borderRadius: '8px',
                            border: degreeType === deg ? '2px solid #081F3E' : '1px solid #CBD5E1',
                            background: degreeType === deg ? '#081F3E' : '#FFFFFF',
                            color: degreeType === deg ? '#FFFFFF' : '#081F3E',
                            fontWeight: 800,
                            fontSize: '0.85rem',
                            cursor: 'pointer'
                          }}
                        >
                          {deg === 'Certification' ? 'Certifications' : `${deg} Program`}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Program Selection */}
                  <div className="form-group" style={{ marginBottom: '24px' }}>
                    <label htmlFor="admissions_program" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Selected Specialty Program *
                    </label>
                    <select
                      id="admissions_program"
                      value={programType}
                      onChange={(e) => setProgramType(e.target.value)}
                      className="form-input-light"
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                    >
                      {(programOptions[degreeType] || []).map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                      Continue to Step 2 <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Password & Policies */}
              {currentStep === 2 && (
                <div>
                  <div className="form-group" style={{ marginBottom: '20px' }}>
                    <label htmlFor="admissions_password" style={{ display: 'block', fontSize: '0.86rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Create Portal Access Password *
                    </label>
                    <input
                      id="admissions_password"
                      type="password"
                      className="form-input-light"
                      required
                      placeholder="At least 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', fontSize: '0.92rem' }}
                    />
                    <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginTop: '4px' }}>
                      Used to log into your Student Portal to check status and download letters.
                    </span>
                  </div>

                  <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px', marginBottom: '20px' }}>
                    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', margin: 0 }}>
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        style={{ marginTop: '3px', width: '16px', height: '16px' }}
                      />
                      <span style={{ fontSize: '0.84rem', color: '#334155', lineHeight: 1.5 }}>
                        I certify that all information submitted is true and correct. I understand that all programs at Liah Academy are conducted <strong>100% on-campus at the Bakweri Town Campus in Buea</strong>.
                      </span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="btn btn-secondary"
                      style={{ color: '#081F3E', borderColor: 'rgba(15,23,42,0.2)' }}
                    >
                      <ArrowLeft size={16} /> Back
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: '0.9rem' }}>
                      Continue to Documents <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Document Uploads & Submit */}
              {currentStep === 3 && (
                <div>
                  {/* Distributed Upload Guidelines Notice */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    background: '#F0FDF4',
                    border: '1.5px solid #86EFAC',
                    padding: '14px 18px',
                    borderRadius: '10px',
                    marginBottom: '16px',
                    color: '#166534'
                  }}>
                    <Zap size={22} color="#16A34A" style={{ flexShrink: 0 }} />
                    <div style={{ fontSize: '0.84rem', lineHeight: 1.45 }}>
                      <strong style={{ color: '#14532D', display: 'block', marginBottom: '2px' }}>
                        Distributed Document Upload Budget
                      </strong>
                      <span>
                        Total applicant allocation: <strong>10 MB combined</strong> &bull; Distributed limit: <strong>Max 2.5 MB per document slot</strong>. High-resolution phone photos are automatically compressed on your device for instant submission.
                      </span>
                    </div>
                  </div>

                  {/* Real-time Total Budget Meter */}
                  {(() => {
                    const totalBytes = Object.values(uploadedDocs).reduce((acc: number, d: any) => acc + (d.bytes || 350 * 1024), 0);
                    const totalMb = (totalBytes / (1024 * 1024)).toFixed(2);
                    const pct = Math.min(100, Math.round((totalBytes / (10 * 1024 * 1024)) * 100));
                    return (
                      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '10px 14px', marginBottom: '18px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#475569', fontWeight: 600, marginBottom: '6px' }}>
                          <span>Total File Budget Used: <strong style={{ color: '#081F3E' }}>{totalMb} MB / 10 MB</strong></span>
                          <span style={{ color: pct > 80 ? '#DC2626' : '#059669' }}>{pct}% utilized</span>
                        </div>
                        <div style={{ width: '100%', height: '6px', background: '#E2E8F0', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${Math.max(5, pct)}%`, height: '100%', background: pct > 80 ? '#DC2626' : '#10B981', transition: 'width 0.3s' }} />
                        </div>
                      </div>
                    );
                  })()}

                  <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '18px' }}>
                    Attach your academic qualifications and official birth certificate for dossier approval:
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                    {(docRequirementsByDegree[degreeType] || []).map((slot) => {
                      const uploaded = uploadedDocs[slot.id];
                      return (
                        <div key={slot.id} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '14px 16px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px', flexWrap: 'wrap', gap: '6px' }}>
                            <strong style={{ fontSize: '0.88rem', color: '#081F3E' }}>
                              {slot.label} {slot.required && <span style={{ color: '#DC2626' }}>*</span>}
                            </strong>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontSize: '0.72rem', background: '#E0F2FE', color: '#0369A1', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                                Max 2.5 MB
                              </span>
                              {uploaded && <span style={{ color: '#059669', fontSize: '0.78rem', fontWeight: 700 }}>✓ Attached ({uploaded.size || 'OK'})</span>}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.78rem', color: '#64748B', display: 'block', marginBottom: '10px' }}>
                            {slot.hint}
                          </span>

                          {uploaded ? (
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#ECFDF5', padding: '8px 12px', borderRadius: '6px', border: '1px solid #A7F3D0' }}>
                              <span style={{ fontSize: '0.82rem', color: '#065F46', fontWeight: 700 }}>{uploaded.fileName}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDoc(slot.id)}
                                style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                              >
                                Remove
                              </button>
                            </div>
                          ) : uploadingSlot === slot.id ? (
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F1F5F9', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E' }}>
                              <Loader2 size={14} className="animate-spin" /> Uploading...
                            </div>
                          ) : (
                            <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFFFFF', border: '1px solid #CBD5E1', padding: '6px 14px', borderRadius: '6px', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', cursor: 'pointer' }}>
                              <UploadCloud size={14} /> Select File (Max 10 MB)
                              <input
                                type="file"
                                accept={slot.accept}
                                onChange={(e) => handleFileUploadForSlot(slot.id, slot.label, e)}
                                style={{ display: 'none' }}
                              />
                            </label>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                      style={{ padding: '12px 28px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                      {regLoading ? <Loader2 size={16} className="animate-spin" /> : null}
                      <span>{regLoading ? 'Submitting Application...' : 'Submit Application & Open Portal'}</span>
                    </button>
                  </div>
                </div>
              )}

            </form>
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
        Loading Admissions Portal...
      </div>
    }>
      <AdmissionsContent />
    </Suspense>
  );
}
