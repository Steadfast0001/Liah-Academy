'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, X, Maximize2, Minimize2, CreditCard, Smartphone, 
  Search, BookOpen, MapPin, Phone, MessageCircle, CheckCircle, 
  ArrowRight, Loader2, Copy, Check, ShieldCheck, ExternalLink,
  GraduationCap, Layers, UserCheck, ChevronRight
} from 'lucide-react';

export default function FloatingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'pay' | 'apply' | 'track' | 'programs' | 'contact'>('pay');

  // MoMo Pay State
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedCode, setCopiedCode] = useState(false);
  const [dialed, setDialed] = useState(false);
  const [autoChecking, setAutoChecking] = useState(false);
  const [payReceipt, setPayReceipt] = useState<any>(null);

  // Fast Apply State
  const [applyName, setApplyName] = useState('');
  const [applyEmail, setApplyEmail] = useState('');
  const [applyPhone, setApplyPhone] = useState('');
  const [applyDegree, setApplyDegree] = useState<'HND' | 'ND' | 'Certification'>('HND');
  const [applyProgram, setApplyProgram] = useState('Software Engineering HND');
  const [applyLoading, setApplyLoading] = useState(false);
  const [applySuccess, setApplySuccess] = useState<any>(null);
  const [applyError, setApplyError] = useState('');

  // Track Status State
  const [trackQuery, setTrackQuery] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState('');

  const currentEffectiveAmount = customAmount ? (parseInt(customAmount) || 0) : (payAmount || 10000);
  const liveShortCode = `*126*14*670265493*${currentEffectiveAmount || 10000}#`;

  // Global hotkey Ctrl+J / Cmd+J to toggle floating page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDial = (amount: number) => {
    setDialed(true);
    try {
      navigator.clipboard.writeText(`*126*14*670265493*${amount}#`);
    } catch {}
    window.location.href = `tel:*126*14*670265493*${amount}%23`;
  };

  const handleAutoCheck = async () => {
    setAutoChecking(true);
    try {
      const res = await fetch('/api/payments/momo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: currentEffectiveAmount,
          phone: '670265493',
          pin: '0000'
        })
      });
      const data = await res.json();
      setAutoChecking(false);
      if (data.success) {
        setPayReceipt(data.data?.receipt || {
          reference: data.data?.payment?.reference,
          amount: currentEffectiveAmount,
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        });
      }
    } catch {
      setAutoChecking(false);
    }
  };

  const handleFastApply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplyLoading(true);
    setApplyError('');
    try {
      const res = await fetch('/api/admissions/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: applyName,
          email: applyEmail,
          phone: applyPhone,
          degree_type: applyDegree,
          program_type: applyProgram,
          password: 'LiahCandidate2026!'
        })
      });
      const data = await res.json();
      setApplyLoading(false);
      if (data.success) {
        setApplySuccess(data.student);
      } else {
        setApplyError(data.message || 'Registration error. Please check your details.');
      }
    } catch {
      setApplyLoading(false);
      setApplyError('Network error connecting to admissions server.');
    }
  };

  const handleTrackDossier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackQuery.trim()) return;
    setTrackLoading(true);
    setTrackError('');
    setTrackResult(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: `Check status for ${trackQuery.trim()}` })
      });
      const data = await res.json();
      setTrackLoading(false);

      if (data.studentData) {
        setTrackResult(data.studentData);
      } else {
        setTrackError(data.response || `No student application found for "${trackQuery}".`);
      }
    } catch {
      setTrackLoading(false);
      setTrackError('Could not verify dossier status right now.');
    }
  };

  return (
    <>
      {/* Floating Circular Trigger Button (Matching Image 1) */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        left: '24px',
        zIndex: 9998
      }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Floating Portal"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #F5A623 0%, #E28704 100%)',
            color: '#081F3E',
            border: 'none',
            boxShadow: '0 10px 25px rgba(245, 166, 35, 0.45)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="Open Quick Portal (Admissions, MoMo & Programs)"
        >
          {isOpen ? <X size={26} color="#081F3E" /> : <Sparkles size={26} color="#081F3E" />}
        </button>
      </div>

      {/* Floating Page Window / Modal Overlay */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: isMaximized ? '0' : '85px',
          left: isMaximized ? '0' : '24px',
          width: isMaximized ? '100vw' : '520px',
          maxWidth: 'calc(100vw - 32px)',
          height: isMaximized ? '100vh' : '640px',
          maxHeight: 'calc(100vh - 100px)',
          background: '#081F3E',
          border: '1.5px solid rgba(245, 166, 35, 0.45)',
          borderRadius: isMaximized ? '0' : '20px',
          boxShadow: '0 30px 80px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 9999,
          animation: 'fadeIn 0.25s ease'
        }}>
          {/* Floating Header */}
          <div style={{
            padding: '14px 18px',
            background: 'linear-gradient(90deg, #041021 0%, #081F3E 100%)',
            borderBottom: '1px solid rgba(245, 166, 35, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #F5A623 0%, #E28704 100%)',
                color: '#081F3E',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900
              }}>
                LA
              </div>
              <div>
                <h4 style={{ margin: 0, color: '#FFFFFF', fontSize: '1rem', fontWeight: 800 }}>
                  Liah Floating Portal
                </h4>
                <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.74rem' }}>
                  Instant Admissions, MTN MoMo &amp; Student Desk
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#CBD5E1',
                  borderRadius: '6px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isMaximized ? 'Restore' : 'Maximize'}
              >
                {isMaximized ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>

              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'rgba(239,68,68,0.2)',
                  border: 'none',
                  color: '#FCA5A5',
                  borderRadius: '6px',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Navigation Tab Bar */}
          <div style={{
            display: 'flex',
            background: '#041021',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: '4px 8px',
            gap: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {[
              { id: 'pay', label: '💳 MTN MoMo', icon: Smartphone },
              { id: 'apply', label: '🎓 Fast Apply', icon: GraduationCap },
              { id: 'track', label: '🔍 Track Dossier', icon: Search },
              { id: 'programs', label: '📚 Programs', icon: BookOpen },
              { id: 'contact', label: '📍 Buea Campus', icon: MapPin },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: 'none',
                    background: isActive ? 'rgba(245, 166, 35, 0.2)' : 'transparent',
                    color: isActive ? '#FDE047' : '#94A3B8',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Body */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '18px',
            background: 'linear-gradient(180deg, #081F3E 0%, #041021 100%)',
            color: '#F8FAFC'
          }}>
            {/* TAB 1: MTN MoMo Pay */}
            {activeTab === 'pay' && (
              <div>
                <div style={{
                  background: 'rgba(245, 166, 35, 0.1)',
                  border: '1px solid rgba(245, 166, 35, 0.3)',
                  borderRadius: '10px',
                  padding: '12px',
                  marginBottom: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Smartphone size={20} color="#F5A623" />
                  <div style={{ fontSize: '0.82rem', color: '#FDE047', fontWeight: 600 }}>
                    Official Short Code: <strong>*126*14*670265493*Amount#</strong>
                  </div>
                </div>

                {/* Amount Selection */}
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700 }}>
                    Select Fee Amount (XAF):
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                    {[
                      { label: 'Application Fee', val: 10000 },
                      { label: 'Seat Deposit', val: 50000 },
                      { label: 'HND Installment 1', val: 125000 },
                      { label: 'ND Installment 1', val: 75000 }
                    ].map(opt => (
                      <button
                        key={opt.val}
                        type="button"
                        onClick={() => {
                          setPayAmount(opt.val);
                          setCustomAmount('');
                          setDialed(false);
                        }}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '8px',
                          border: payAmount === opt.val && !customAmount ? '2px solid #F5A623' : '1px solid rgba(255,255,255,0.12)',
                          background: payAmount === opt.val && !customAmount ? 'rgba(245, 166, 35, 0.25)' : 'rgba(255,255,255,0.04)',
                          color: '#FFFFFF',
                          textAlign: 'left',
                          fontSize: '0.78rem',
                          cursor: 'pointer'
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{opt.label}</div>
                        <div style={{ color: '#FDE047', fontSize: '0.72rem' }}>{opt.val.toLocaleString()} XAF</div>
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    placeholder="Or enter custom amount in XAF..."
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setDialed(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: '#041021',
                      color: '#FFFFFF',
                      fontSize: '0.84rem'
                    }}
                  />
                </div>

                {/* Generated Short Code Card */}
                <div style={{
                  background: '#020617',
                  border: '2px solid #F5A623',
                  borderRadius: '12px',
                  padding: '14px',
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.74rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700, textTransform: 'uppercase' }}>
                    Live Dial String
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontSize: '1.2rem',
                    fontWeight: 900,
                    color: '#FDE047',
                    letterSpacing: '1px',
                    marginBottom: '12px'
                  }}>
                    {liveShortCode}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => handleDial(currentEffectiveAmount)}
                      style={{
                        width: '100%',
                        padding: '12px 18px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #F5A623 0%, #E28704 100%)',
                        color: '#081F3E',
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 15px rgba(245, 166, 35, 0.4)'
                      }}
                    >
                      <Smartphone size={18} /> Pay Now — Open MTN MoMo ({currentEffectiveAmount.toLocaleString()} XAF)
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCopy(liveShortCode)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        background: copiedCode ? '#10B981' : 'rgba(255,255,255,0.06)',
                        color: '#FFFFFF',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {copiedCode ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedCode ? 'Copied to Clipboard!' : 'Copy Short Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Auto-check confirmation */}
                {dialed && !payReceipt && (
                  <div style={{
                    background: 'rgba(16,185,129,0.12)',
                    border: '1px solid #10B981',
                    borderRadius: '10px',
                    padding: '12px',
                    marginBottom: '14px'
                  }}>
                    <div style={{ fontSize: '0.8rem', color: '#A7F3D0', fontWeight: 700, marginBottom: '8px' }}>
                      📲 Code dispatched to phone dialer. Enter Secret PIN to conclude:
                    </div>
                    <button
                      type="button"
                      disabled={autoChecking}
                      onClick={handleAutoCheck}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#10B981',
                        color: '#FFFFFF',
                        fontWeight: 800,
                        fontSize: '0.84rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {autoChecking ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                      ✓ I Entered PIN — Auto-Check &amp; Activate Session
                    </button>
                  </div>
                )}

                {/* Receipt Card */}
                {payReceipt && (
                  <div style={{
                    background: '#ECFDF5',
                    border: '2px solid #10B981',
                    borderRadius: '10px',
                    padding: '14px',
                    color: '#065F46',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ fontWeight: 800, fontSize: '0.92rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={18} color="#10B981" /> Payment Confirmed &amp; Approved!
                    </div>
                    <div>Reference: <strong>{payReceipt.reference}</strong></div>
                    <div>Amount: <strong>{payReceipt.amount?.toLocaleString()} XAF</strong></div>
                    <div>Recipient: <strong>670265493 (Liah Academy)</strong></div>
                    <div>Status: <strong style={{ color: '#059669' }}>PAID &amp; APPROVED</strong></div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Fast Apply */}
            {activeTab === 'apply' && (
              <div>
                <h4 style={{ color: '#FDE047', margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 800 }}>
                  1-Minute Fast Registration
                </h4>
                <p style={{ margin: '0 0 14px 0', color: '#94A3B8', fontSize: '0.78rem' }}>
                  Create your applicant dossier directly in this floating window.
                </p>

                {applyError && (
                  <div style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '8px 12px', borderRadius: '6px', fontSize: '0.78rem', marginBottom: '12px' }}>
                    ⚠️ {applyError}
                  </div>
                )}

                {applySuccess ? (
                  <div style={{ background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: '10px', padding: '16px', color: '#065F46' }}>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
                      🎉 Application Created Successfully!
                    </div>
                    <p style={{ fontSize: '0.82rem', margin: '0 0 10px 0' }}>
                      Welcome, <strong>{applySuccess.full_name}</strong>! Your applicant ID is <strong>#{applySuccess.id}</strong>.
                    </p>
                    <Link
                      href="/admissions"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: '#081F3E',
                        color: '#F5A623',
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 800,
                        textDecoration: 'none'
                      }}
                    >
                      Continue on Full Portal <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleFastApply}>
                    <div style={{ marginBottom: '10px' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', marginBottom: '4px' }}>Full Legal Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. John Doe"
                        value={applyName}
                        onChange={(e) => setApplyName(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.82rem' }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', marginBottom: '4px' }}>Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="john@example.com"
                          value={applyEmail}
                          onChange={(e) => setApplyEmail(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.82rem' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', marginBottom: '4px' }}>Phone (MoMo) *</label>
                        <input
                          type="tel"
                          required
                          placeholder="670 123 456"
                          value={applyPhone}
                          onChange={(e) => setApplyPhone(e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.82rem' }}
                        />
                      </div>
                    </div>

                    <div style={{ marginBottom: '12px' }}>
                      <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', marginBottom: '4px' }}>Degree Track *</label>
                      <select
                        value={applyDegree}
                        onChange={(e) => {
                          const deg = e.target.value as any;
                          setApplyDegree(deg);
                          setApplyProgram(deg === 'HND' ? 'Software Engineering HND' : (deg === 'ND' ? 'Web Design ND' : 'DevOps Certification'));
                        }}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.82rem', marginBottom: '8px' }}
                      >
                        <option value="HND">Higher National Diploma (HND - 2 Years)</option>
                        <option value="ND">National Diploma (ND - 1 Year)</option>
                        <option value="Certification">Professional Certification</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={applyLoading}
                      style={{
                        width: '100%',
                        padding: '11px 16px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#F5A623',
                        color: '#081F3E',
                        fontWeight: 900,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      {applyLoading ? <Loader2 size={16} className="animate-spin" /> : <GraduationCap size={16} />}
                      Create Admission Dossier
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 3: Track Dossier */}
            {activeTab === 'track' && (
              <div>
                <h4 style={{ color: '#FDE047', margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 800 }}>
                  Track Your Admission Status
                </h4>
                <p style={{ margin: '0 0 14px 0', color: '#94A3B8', fontSize: '0.78rem' }}>
                  Enter your registered Email Address or Student ID Number:
                </p>

                <form onSubmit={handleTrackDossier} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    required
                    placeholder="e.g. john@example.com or #1002"
                    value={trackQuery}
                    onChange={(e) => setTrackQuery(e.target.value)}
                    style={{ flex: 1, padding: '9px 12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.82rem' }}
                  />
                  <button
                    type="submit"
                    disabled={trackLoading}
                    style={{
                      padding: '9px 16px',
                      borderRadius: '8px',
                      border: 'none',
                      background: '#F5A623',
                      color: '#081F3E',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {trackLoading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
                    Search
                  </button>
                </form>

                {trackError && (
                  <div style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '10px 14px', borderRadius: '8px', fontSize: '0.78rem' }}>
                    {trackError}
                  </div>
                )}

                {trackResult && (
                  <div style={{
                    background: '#020617',
                    border: '1.5px solid #F5A623',
                    borderRadius: '10px',
                    padding: '14px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#FDE047' }}>Dossier #{trackResult.id}</span>
                      <span style={{
                        background: trackResult.payment_status === 'Paid' ? '#10B981' : '#F59E0B',
                        color: '#FFFFFF',
                        padding: '2px 8px',
                        borderRadius: '4px',
                        fontSize: '0.72rem',
                        fontWeight: 700
                      }}>
                        {trackResult.payment_status}
                      </span>
                    </div>

                    <div style={{ color: '#CBD5E1', lineHeight: '1.6', marginBottom: '12px' }}>
                      <div>Candidate: <strong>{trackResult.full_name}</strong></div>
                      <div>Program: <strong>{trackResult.program_type} ({trackResult.degree_type})</strong></div>
                      <div>Status: <strong style={{ color: '#34D399' }}>{trackResult.admission_status}</strong></div>
                    </div>

                    <Link
                      href="/admissions"
                      onClick={() => setIsOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        background: '#F5A623',
                        color: '#081F3E',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        textDecoration: 'none'
                      }}
                    >
                      Open Full Dossier &amp; Admission Letter <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Programs Catalog */}
            {activeTab === 'programs' && (
              <div>
                <h4 style={{ color: '#FDE047', margin: '0 0 10px 0', fontSize: '0.95rem', fontWeight: 800 }}>
                  Degree Programs &amp; Certifications
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { title: 'Software Engineering HND', dur: '2 Years', fee: '250,000 XAF/yr', school: 'Engineering' },
                    { title: 'Cybersecurity & Cloud Defense HND', dur: '2 Years', fee: '250,000 XAF/yr', school: 'Security' },
                    { title: 'Information & Comm. Tech (ICT) ND', dur: '1 Year', fee: '150,000 XAF/yr', school: 'IT' },
                    { title: 'Web Design ND', dur: '1 Year', fee: '150,000 XAF/yr', school: 'Design' },
                    { title: 'DevOps Certification', dur: '9 Months', fee: '350,000 XAF', school: 'Cloud' },
                    { title: 'Data Science & Machine Learning', dur: '9 Months', fee: '350,000 XAF', school: 'AI Lab' }
                  ].map((p, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      padding: '10px 12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.84rem', color: '#FFF' }}>{p.title}</div>
                        <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>{p.dur} &bull; {p.fee}</div>
                      </div>
                      <button
                        onClick={() => {
                          setApplyProgram(p.title);
                          setActiveTab('apply');
                        }}
                        style={{
                          background: '#F5A623',
                          border: 'none',
                          color: '#081F3E',
                          padding: '5px 10px',
                          borderRadius: '6px',
                          fontWeight: 800,
                          fontSize: '0.72rem',
                          cursor: 'pointer'
                        }}
                      >
                        Enroll
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: Buea Campus & Contact */}
            {activeTab === 'contact' && (
              <div>
                <h4 style={{ color: '#FDE047', margin: '0 0 8px 0', fontSize: '0.95rem', fontWeight: 800 }}>
                  Buea Campus &amp; Support Hotline
                </h4>
                <div style={{ fontSize: '0.8rem', color: '#CBD5E1', lineHeight: '1.6', marginBottom: '14px' }}>
                  <div>📍 <strong>Address:</strong> Backweri Town, Buea, Southwest Region, Cameroon</div>
                  <div>🕒 <strong>Hours:</strong> Mon – Sat: 8:00 AM – 5:00 PM WAT</div>
                  <div>✉️ <strong>Email:</strong> info@liahacademy.com</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <a
                    href="https://wa.me/237652154095?text=Hello%20Liah%20Academy%2C%20I%20am%20inquiring%20about%20admissions."
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: '#10B981',
                      color: '#FFFFFF',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.84rem',
                      textDecoration: 'none'
                    }}
                  >
                    <MessageCircle size={16} /> Open Direct WhatsApp (+237 652 154 095)
                  </a>

                  <a
                    href="tel:+237652154095"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      background: 'rgba(255,255,255,0.08)',
                      color: '#FFFFFF',
                      border: '1px solid rgba(255,255,255,0.2)',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '0.84rem',
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={16} /> Call Hotline (+237 652 154 095)
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
