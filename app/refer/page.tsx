'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Users, DollarSign, Share2, Copy, Check, ArrowRight, Smartphone,
  Award, TrendingUp, AlertCircle, Clock, CheckCircle2, ShieldCheck,
  ExternalLink, Download, FileText, ChevronRight, HelpCircle, Eye
} from 'lucide-react';

interface AgentData {
  id: number;
  full_name: string;
  code: string;
  momo_number: string;
  momo_name?: string;
  email?: string;
  total_referrals: number;
  paid_referrals: number;
  total_earned: number;
  total_paid: number;
  balance: number;
  status: string;
  referral_link?: string;
}

interface DownlineItem {
  id: number;
  student_name: string;
  student_matricule: string;
  program_type: string;
  created_at: string;
  payment_status: string;
  commission_earned: number;
  status: string;
}

interface PayoutItem {
  id: number;
  agent_code: string;
  agent_name: string;
  momo_number: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  created_at: string;
  processed_at?: string;
  transaction_id?: string;
  proof_screenshot?: string;
  admin_notes?: string;
}

interface RegistrationPeriodInfo {
  end_date: string;
  title: string;
  is_unlocked: boolean;
  is_ended: boolean;
  can_request_payout: boolean;
}

function safeStr(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function safeUpper(val: any): string {
  return safeStr(val).toUpperCase();
}

function safeLower(val: any): string {
  return safeStr(val).toLowerCase();
}

function formatSafeDate(val: any, options?: Intl.DateTimeFormatOptions): string {
  if (!val) return '—';
  try {
    const d = new Date(val);
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleDateString('en-GB', options || { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

function ReferPageContent() {
  const searchParams = useSearchParams();

  // Tab: 'register' | 'lookup'
  const [formMode, setFormMode] = useState<'register' | 'lookup'>('register');

  // Registration form inputs
  const [fullName, setFullName] = useState('');
  const [momoNumber, setMomoNumber] = useState('');
  const [momoName, setMomoName] = useState('');
  const [email, setEmail] = useState('');
  const [momoProvider, setMomoProvider] = useState<'mtn' | 'orange'>('mtn');

  // Lookup input
  const [lookupValue, setLookupValue] = useState('');

  // Agent State
  const [agent, setAgent] = useState<AgentData | null>(null);
  const [downline, setDownline] = useState<DownlineItem[]>([]);
  const [payouts, setPayouts] = useState<PayoutItem[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [regPeriod, setRegPeriod] = useState<RegistrationPeriodInfo | null>(null);

  // UI States
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Payout Request Modal
  const [payoutModalOpen, setPayoutModalOpen] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutMomoConfirm, setPayoutMomoConfirm] = useState('');
  const [payoutSubmitting, setPayoutSubmitting] = useState(false);
  const [payoutError, setPayoutError] = useState<string | null>(null);

  // Proof Screenshot Modal
  const [viewingProof, setViewingProof] = useState<string | null>(null);

  // Restore saved agent session
  useEffect(() => {
    const savedCode = localStorage.getItem('liah_agent_code');
    const savedMomo = localStorage.getItem('liah_agent_momo');
    if (savedCode) {
      fetchAgentStats({ code: savedCode });
    } else if (savedMomo) {
      fetchAgentStats({ momo: savedMomo });
    }
  }, []);

  const fetchAgentStats = async (params: { code?: string; momo?: string }) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const q = new URLSearchParams();
      if (params.code) q.set('code', params.code);
      if (params.momo) q.set('momo', params.momo);

      const res = await fetch(`/api/referrals/stats?${q.toString()}`);
      const data = await res.json();

      if (data.success && data.data) {
        setAgent(data.data.agent);
        setDownline(data.data.downline || []);
        setPayouts(data.data.payouts || []);
        setSummary(data.data.summary || null);
        setRegPeriod(data.data.registration_period || null);
        setPayoutMomoConfirm(data.data.agent.momo_number);
        localStorage.setItem('liah_agent_code', data.data.agent.code);
        localStorage.setItem('liah_agent_momo', data.data.agent.momo_number);
      } else {
        if (params.code || params.momo) {
          setErrorMsg(data.message || 'Could not find referral account.');
        }
      }
    } catch {
      setErrorMsg('Failed to connect to referral server.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim() || !momoNumber.trim()) {
      setErrorMsg('Please enter both your Full Name and Mobile Money Number.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/referrals/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim(),
          momo_number: momoNumber.trim(),
          momo_name: momoName.trim(),
          email: email.trim()
        })
      });

      const data = await res.json();
      if (data.success && data.data) {
        setSuccessMsg(data.message || 'Registration successful! Your referral link is ready.');
        localStorage.setItem('liah_agent_code', data.data.code);
        localStorage.setItem('liah_agent_momo', data.data.momo_number);
        // Refresh full stats
        await fetchAgentStats({ code: data.data.code });
      } else {
        setErrorMsg(data.message || 'Registration failed.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupValue.trim()) {
      setErrorMsg('Please enter your referral code or MoMo number.');
      return;
    }
    const val = lookupValue.trim();
    if (val.toUpperCase().startsWith('LIAH-') || val.length < 8) {
      await fetchAgentStats({ code: val.toUpperCase() });
    } else {
      await fetchAgentStats({ momo: val });
    }
  };

  const handleLogoutAgent = () => {
    localStorage.removeItem('liah_agent_code');
    localStorage.removeItem('liah_agent_momo');
    setAgent(null);
    setDownline([]);
    setPayouts([]);
    setSummary(null);
  };

  const getFullReferralUrl = () => {
    if (!agent) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/admissions?ref=${agent.code}`;
    }
    return `https://liahacademy.org/admissions?ref=${agent.code}`;
  };

  const copyLinkToClipboard = () => {
    const url = getFullReferralUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const copyCodeToClipboard = () => {
    if (!agent) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(agent.code);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  const handlePayoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agent) return;
    setPayoutError(null);

    const amt = Number(payoutAmount);
    if (!amt || amt < 2000) {
      setPayoutError('Minimum withdrawal amount is 2,000 XAF.');
      return;
    }
    if (amt > agent.balance) {
      setPayoutError(`Amount exceeds your available balance of ${agent.balance.toLocaleString()} XAF.`);
      return;
    }

    setPayoutSubmitting(true);
    try {
      const res = await fetch('/api/referrals/payout-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agent_code: agent.code,
          amount: amt,
          momo_number: payoutMomoConfirm.trim() || agent.momo_number
        })
      });

      const data = await res.json();
      if (data.success) {
        setPayoutModalOpen(false);
        setPayoutAmount('');
        setSuccessMsg('Payout request submitted! The administrator will deposit via MoMo and upload the payment proof.');
        // Refresh stats
        await fetchAgentStats({ code: agent.code });
      } else {
        setPayoutError(data.message || 'Failed to submit withdrawal request.');
      }
    } catch {
      setPayoutError('Network error submitting payout request.');
    } finally {
      setPayoutSubmitting(false);
    }
  };

  return (
    <div style={{ background: '#F8FAFC', minHeight: '100vh', paddingBottom: '80px' }}>
      
      {/* Hero Header */}
      <section style={{
        background: 'linear-gradient(135deg, #081F3E 0%, #0F3260 100%)',
        color: '#FFFFFF',
        padding: '60px 20px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245, 166, 35, 0.15) 0%, rgba(245, 166, 35, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(245, 166, 35, 0.15)',
            border: '1px solid rgba(245, 166, 35, 0.3)',
            color: '#F5A623',
            padding: '6px 16px',
            borderRadius: '30px',
            fontSize: '0.82rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '16px'
          }}>
            <Award size={16} /> Official Liah Academy Referral Program
          </div>

          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.2,
            margin: '0 0 16px 0',
            letterSpacing: '-0.02em'
          }}>
            Refer Students &amp; Earn <span style={{ color: '#F5A623' }}>15,000 XAF</span> per Enrolment
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            color: '#CBD5E1',
            maxWidth: '680px',
            margin: '0 auto 28px auto',
            lineHeight: 1.6
          }}>
            Become an official Ambassador or Referral Agent for Liah Academy. Share your link with friends, tech lovers, and prospective students. Whenever someone enrolls, you receive 15,000 XAF sent directly to your MTN or Orange MoMo.
          </p>

          {/* Quick value badges */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            fontSize: '0.9rem',
            color: '#E2E8F0'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} color="#10B981" /> Direct MoMo Payouts
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} color="#10B981" /> Automatic Matricule Tracking
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={18} color="#10B981" /> Transparent Deposit Proofs
            </span>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1060px', margin: '-30px auto 0 auto', padding: '0 20px', position: 'relative', zIndex: 2 }}>
        
        {/* Alerts */}
        {errorMsg && (
          <div style={{
            background: '#FEF2F2',
            border: '1px solid #FCA5A5',
            color: '#DC2626',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem'
          }}>
            <AlertCircle size={20} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div style={{
            background: '#ECFDF5',
            border: '1px solid #A7F3D0',
            color: '#065F46',
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.9rem'
          }}>
            <CheckCircle2 size={20} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* ========================================================
            CASE A: AGENT DASHBOARD (LOGGED IN)
            ======================================================== */}
        {agent ? (
          <div>
            {/* Registration Period & Commission Payout Window Banner */}
            {regPeriod && (
              <div style={{
                background: regPeriod.can_request_payout ? '#ECFDF5' : '#FFFBEB',
                border: `1px solid ${regPeriod.can_request_payout ? '#A7F3D0' : '#FDE68A'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '780px' }}>
                  <div style={{ fontSize: '1.8rem', lineHeight: 1 }}>
                    {regPeriod.can_request_payout ? '🎉' : '⏳'}
                  </div>
                  <div>
                    <strong style={{
                      display: 'block',
                      color: regPeriod.can_request_payout ? '#065F46' : '#92400E',
                      fontSize: '0.96rem'
                    }}>
                      {regPeriod.title} — {regPeriod.can_request_payout ? 'Commission Payout Window is OPEN' : 'Registration Period Active'}
                    </strong>
                    <span style={{ fontSize: '0.84rem', color: regPeriod.can_request_payout ? '#047857' : '#B45309', display: 'block', marginTop: '2px' }}>
                      {regPeriod.can_request_payout
                        ? 'Admissions registration intake has ended. You can now request your commission payouts directly to your Mobile Money account!'
                        : `Commission payouts will unlock at the end of the registration period (${formatSafeDate(regPeriod.end_date, { day: 'numeric', month: 'long', year: 'numeric' })}). Keep sharing your link to enroll students and grow your accumulated earnings!`}
                    </span>
                  </div>
                </div>

                <div>
                  <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 800,
                    background: regPeriod.can_request_payout ? '#10B981' : '#F59E0B',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap'
                  }}>
                    {regPeriod.can_request_payout ? '✓ Payouts Open' : `Locked Until ${formatSafeDate(regPeriod.end_date, { day: 'numeric', month: 'short' })}`}
                  </span>
                </div>
              </div>
            )}

            {/* Top Bar with Agent Header & Logout */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '24px 28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div>
                <span style={{
                  display: 'inline-block',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: '#10B981',
                  background: '#ECFDF5',
                  padding: '3px 10px',
                  borderRadius: '20px',
                  marginBottom: '6px'
                }}>
                  ● ACTIVE REFERRAL AGENT
                </span>
                <h2 style={{ margin: 0, color: '#081F3E', fontSize: '1.6rem', fontWeight: 800 }}>
                  {agent.full_name}
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '4px', fontSize: '0.85rem', color: '#64748B' }}>
                  <span>MoMo: <strong style={{ color: '#081F3E' }}>{agent.momo_number}</strong></span>
                  <span>•</span>
                  <span>Agent Code: <strong style={{ color: '#081F3E', fontFamily: 'monospace' }}>{agent.code}</strong></span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (regPeriod && !regPeriod.can_request_payout) {
                      const d = formatSafeDate(regPeriod.end_date, { day: 'numeric', month: 'long', year: 'numeric' });
                      alert(`Referral commission payouts can only be requested at the end of the registration period (${d}). Payouts will automatically open once this intake concludes.`);
                      return;
                    }
                    setPayoutModalOpen(true);
                  }}
                  disabled={agent.balance < 2000 || (Boolean(regPeriod) && !regPeriod?.can_request_payout)}
                  title={regPeriod && !regPeriod.can_request_payout ? `Payouts open at the end of the registration period (${formatSafeDate(regPeriod.end_date, { day: 'numeric', month: 'short' })})` : ''}
                  style={{
                    background: (agent.balance >= 2000 && (!regPeriod || regPeriod.can_request_payout)) ? '#10B981' : '#94A3B8',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: (agent.balance >= 2000 && (!regPeriod || regPeriod.can_request_payout)) ? 'pointer' : 'not-allowed',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: (agent.balance >= 2000 && (!regPeriod || regPeriod.can_request_payout)) ? '0 4px 12px rgba(16, 185, 129, 0.25)' : 'none'
                  }}
                >
                  <DollarSign size={16} />
                  {(!regPeriod || regPeriod.can_request_payout)
                    ? 'Request MoMo Payout'
                    : `🔒 Payouts Open ${formatSafeDate(regPeriod.end_date, { day: 'numeric', month: 'short' })}`}
                </button>
                <button
                  type="button"
                  onClick={handleLogoutAgent}
                  style={{
                    background: '#F1F5F9',
                    color: '#475569',
                    border: '1px solid #CBD5E1',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  Switch Agent
                </button>
              </div>
            </div>

            {/* Referral Link Share Box */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '24px 28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Share2 size={20} color="#F5A623" />
                <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#081F3E', fontWeight: 800 }}>
                  Your Unique Referral Link
                </h3>
              </div>
              <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: '#64748B' }}>
                Share this link on WhatsApp, Facebook, Telegram, or SMS. Anyone who applies using your link will be placed into your Downline with their <strong>Full Name and Matricule</strong> once their admission payment proof is verified and approved by the Administration!
              </p>

              <div style={{
                display: 'flex',
                gap: '10px',
                alignItems: 'center',
                flexWrap: 'wrap'
              }}>
                <div style={{
                  flex: 1,
                  minWidth: '260px',
                  background: '#F8FAFC',
                  border: '1px solid #CBD5E1',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontFamily: 'monospace',
                  fontSize: '0.88rem',
                  color: '#081F3E',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {getFullReferralUrl()}
                </div>

                <button
                  type="button"
                  onClick={copyLinkToClipboard}
                  style={{
                    background: copiedLink ? '#10B981' : '#081F3E',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'background 0.2s ease'
                  }}
                >
                  {copiedLink ? <Check size={16} /> : <Copy size={16} />}
                  <span>{copiedLink ? 'Copied!' : 'Copy Link'}</span>
                </button>

                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Study practical Software Engineering, Cybersecurity & Tech at Liah Academy in Buea! Apply using my official link here: ${getFullReferralUrl()}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: '#25D366',
                    color: '#FFFFFF',
                    borderRadius: '8px',
                    padding: '10px 18px',
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Smartphone size={16} /> Share on WhatsApp
                </a>
              </div>
            </div>

            {/* Metrics Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '28px'
            }}>
              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Total Referred Students
                </span>
                <strong style={{ fontSize: '1.8rem', color: '#081F3E', fontWeight: 900 }}>
                  {summary?.total_referrals ?? downline.length}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                  Registered via your link
                </span>
              </div>

              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Enrolled &amp; Paid
                </span>
                <strong style={{ fontSize: '1.8rem', color: '#10B981', fontWeight: 900 }}>
                  {summary?.paid_referrals ?? downline.filter(d => (d.payment_status || '').toLowerCase().includes('paid')).length}
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                  Fee completed &amp; approved
                </span>
              </div>

              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748B', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                  Total Commissions Earned
                </span>
                <strong style={{ fontSize: '1.8rem', color: '#081F3E', fontWeight: 900 }}>
                  {(agent.total_earned || 0).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>XAF</span>
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#94A3B8', display: 'block', marginTop: '2px' }}>
                  15,000 XAF per paid student
                </span>
              </div>

              <div style={{ background: '#FFFFFF', padding: '20px', borderRadius: '12px', border: '1px solid #10B981', backgroundClip: 'padding-box', position: 'relative' }}>
                <span style={{ fontSize: '0.8rem', color: '#059669', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Available MoMo Balance
                </span>
                <strong style={{ fontSize: '1.8rem', color: '#059669', fontWeight: 900 }}>
                  {(agent.balance || 0).toLocaleString()} <span style={{ fontSize: '1rem', fontWeight: 600 }}>XAF</span>
                </strong>
                <span style={{ fontSize: '0.75rem', color: '#10B981', display: 'block', marginTop: '2px' }}>
                  Ready to withdraw
                </span>
              </div>
            </div>

            {/* Section 1: Your Downline (Referred Students with Name & Matricule) */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '24px 28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#081F3E', fontWeight: 800 }}>
                    Your Downline (Referred Students)
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Every applicant who used your link is tracked here with their Name and Matricule.
                  </span>
                </div>
                <span style={{
                  background: '#F1F5F9',
                  color: '#475569',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}>
                  {downline.length} Student{downline.length !== 1 ? 's' : ''} in Downline
                </span>
              </div>

              {downline.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px dashed #CBD5E1'
                }}>
                  <Users size={36} color="#94A3B8" style={{ marginBottom: '10px' }} />
                  <h4 style={{ margin: '0 0 6px 0', color: '#081F3E', fontWeight: 700 }}>No referrals yet</h4>
                  <p style={{ margin: '0 0 16px 0', fontSize: '0.88rem', color: '#64748B', maxWidth: '420px', marginLeft: 'auto', marginRight: 'auto' }}>
                    Copy your unique referral link above and share it with applicants. When they apply, their full name and matricule will show up here immediately!
                  </p>
                  <button
                    type="button"
                    onClick={copyLinkToClipboard}
                    style={{
                      background: '#081F3E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '8px 16px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Copy My Link
                  </button>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px' }}>Student Name</th>
                        <th style={{ padding: '12px 14px' }}>Matricule</th>
                        <th style={{ padding: '12px 14px' }}>Program</th>
                        <th style={{ padding: '12px 14px' }}>Registered On</th>
                        <th style={{ padding: '12px 14px' }}>Admission Status</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {downline.map((item, idx) => {
                        const isPaid = safeLower(item.payment_status).includes('paid');
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                            <td style={{ padding: '14px', fontWeight: 700, color: '#081F3E' }}>
                              {item.student_name}
                            </td>
                            <td style={{ padding: '14px', fontFamily: 'monospace', fontWeight: 700, color: '#0284C7' }}>
                              {item.student_matricule || 'In Review'}
                            </td>
                            <td style={{ padding: '14px', color: '#475569' }}>
                              {item.program_type}
                            </td>
                            <td style={{ padding: '14px', color: '#64748B', fontSize: '0.82rem' }}>
                              {formatSafeDate(item.created_at, { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td style={{ padding: '14px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                padding: '4px 10px',
                                borderRadius: '4px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                background: isPaid ? '#ECFDF5' : '#FEF3C7',
                                color: isPaid ? '#059669' : '#B45309'
                              }}>
                                {isPaid ? '✓ Enrolled & Paid' : '⏳ Pending Payment'}
                              </span>
                            </td>
                            <td style={{ padding: '14px', textAlign: 'right', fontWeight: 800, color: isPaid ? '#10B981' : '#94A3B8' }}>
                              {isPaid ? `${(item.commission_earned || 15000).toLocaleString()} XAF` : '15,000 XAF (Pending)'}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Section 2: Payout Requests & Proof Receipts */}
            <div style={{
              background: '#FFFFFF',
              borderRadius: '14px',
              padding: '24px 28px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 16px rgba(8, 31, 62, 0.04)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#081F3E', fontWeight: 800 }}>
                    Payout Requests &amp; Deposit Proofs
                  </h3>
                  <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                    Track all your MoMo withdrawals. Once paid, the admin uploads the deposit screenshot here.
                  </span>
                </div>
              </div>

              {payouts.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '30px 20px',
                  background: '#F8FAFC',
                  borderRadius: '10px',
                  border: '1px dashed #CBD5E1',
                  color: '#64748B',
                  fontSize: '0.88rem'
                }}>
                  No withdrawal requests yet. Your balance will accumulate as students complete their enrolment!
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #E2E8F0', color: '#64748B', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                        <th style={{ padding: '12px 14px' }}>Request Date</th>
                        <th style={{ padding: '12px 14px' }}>Amount</th>
                        <th style={{ padding: '12px 14px' }}>MoMo Number</th>
                        <th style={{ padding: '12px 14px' }}>Status</th>
                        <th style={{ padding: '12px 14px' }}>Tx Reference</th>
                        <th style={{ padding: '12px 14px', textAlign: 'right' }}>Deposit Proof</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payouts.map((p, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #F1F5F9' }}>
                          <td style={{ padding: '14px', color: '#64748B', fontSize: '0.82rem' }}>
                            {formatSafeDate(p.created_at, { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '14px', fontWeight: 800, color: '#081F3E' }}>
                            {p.amount.toLocaleString()} XAF
                          </td>
                          <td style={{ padding: '14px', fontFamily: 'monospace', color: '#475569' }}>
                            {p.momo_number}
                          </td>
                          <td style={{ padding: '14px' }}>
                            <span style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              fontSize: '0.78rem',
                              fontWeight: 700,
                              background: p.status === 'completed' ? '#ECFDF5' : p.status === 'rejected' ? '#FEF2F2' : '#EFF6FF',
                              color: p.status === 'completed' ? '#059669' : p.status === 'rejected' ? '#DC2626' : '#1D4ED8'
                            }}>
                              {p.status === 'completed' ? '✓ Paid & Deposited' : p.status === 'rejected' ? '✗ Rejected' : '⏳ Pending Admin Deposit'}
                            </span>
                          </td>
                          <td style={{ padding: '14px', fontFamily: 'monospace', fontSize: '0.82rem', color: '#64748B' }}>
                            {p.transaction_id || 'Pending'}
                          </td>
                          <td style={{ padding: '14px', textAlign: 'right' }}>
                            {p.proof_screenshot ? (
                              <button
                                type="button"
                                onClick={() => setViewingProof(p.proof_screenshot || null)}
                                style={{
                                  background: '#EFF6FF',
                                  color: '#0284C7',
                                  border: '1px solid #BAE6FD',
                                  borderRadius: '6px',
                                  padding: '6px 12px',
                                  fontSize: '0.8rem',
                                  fontWeight: 700,
                                  cursor: 'pointer',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Eye size={14} /> View MoMo Screenshot
                              </button>
                            ) : (
                              <span style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Awaiting deposit</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (

          /* ========================================================
              CASE B: AGENT REGISTRATION / LOOKUP FORM
              ======================================================== */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              padding: '32px 36px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 8px 30px rgba(8, 31, 62, 0.06)'
            }}>
              
              {/* Form Switcher */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                background: '#F1F5F9',
                padding: '5px',
                borderRadius: '10px',
                marginBottom: '28px'
              }}>
                <button
                  type="button"
                  onClick={() => setFormMode('register')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: formMode === 'register' ? '#081F3E' : 'transparent',
                    color: formMode === 'register' ? '#FFFFFF' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Become a Referral Agent
                </button>
                <button
                  type="button"
                  onClick={() => setFormMode('lookup')}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: 'none',
                    background: formMode === 'lookup' ? '#081F3E' : 'transparent',
                    color: formMode === 'lookup' ? '#FFFFFF' : '#64748B',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Access My Dashboard
                </button>
              </div>

              {formMode === 'register' ? (
                /* REGISTRATION FORM */
                <form onSubmit={handleRegister}>
                  <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <h2 style={{ margin: '0 0 6px 0', color: '#081F3E', fontSize: '1.45rem', fontWeight: 800 }}>
                      Join the Refer &amp; Earn Network
                    </h2>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem' }}>
                      Enter your name and Mobile Money number to receive your unique referral link.
                    </p>
                  </div>

                  {/* Full Name */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Roland Eyong"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
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

                  {/* MoMo Number */}
                  <div style={{ marginBottom: '18px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', margin: 0 }}>
                        Mobile Money Number for Payouts *
                      </label>
                      <span style={{ fontSize: '0.74rem', color: '#10B981', fontWeight: 700 }}>
                        MTN MoMo or Orange Money
                      </span>
                    </div>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 670265493 or 699526607"
                      value={momoNumber}
                      onChange={(e) => setMomoNumber(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.92rem',
                        boxSizing: 'border-box'
                      }}
                    />
                    <span style={{ fontSize: '0.74rem', color: '#94A3B8', display: 'block', marginTop: '4px' }}>
                      Commissions will be transferred directly to this Mobile Money number upon request.
                    </span>
                  </div>

                  {/* MoMo Registered Name (Optional) */}
                  <div style={{ marginBottom: '18px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Name on Mobile Money Account (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Eyong Roland Tabe (Matches ID)"
                      value={momoName}
                      onChange={(e) => setMomoName(e.target.value)}
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

                  {/* Email (Optional) */}
                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="e.g. you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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

                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      width: '100%',
                      background: 'linear-gradient(135deg, #081F3E 0%, #0F3260 100%)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '0.96rem',
                      fontWeight: 800,
                      cursor: submitting ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(8, 31, 62, 0.15)'
                    }}
                  >
                    {submitting ? 'Generating Your Link...' : 'Generate My Referral Link & Start Earning'}
                    <ArrowRight size={18} color="#F5A623" />
                  </button>

                  <div style={{ marginTop: '16px', textAlign: 'center' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748B' }}>
                      Are you already an enrolled student?{' '}
                      <Link href="/portal" style={{ color: '#0284C7', fontWeight: 700 }}>
                        Activate referral inside your Student Portal &rarr;
                      </Link>
                    </span>
                  </div>
                </form>
              ) : (
                /* LOOKUP / LOGIN FORM */
                <form onSubmit={handleLookup}>
                  <div style={{ textAlign: 'center', marginBottom: '22px' }}>
                    <h2 style={{ margin: '0 0 6px 0', color: '#081F3E', fontSize: '1.45rem', fontWeight: 800 }}>
                      Access Your Agent Dashboard
                    </h2>
                    <p style={{ margin: 0, color: '#64748B', fontSize: '0.88rem' }}>
                      Enter the Mobile Money number or Referral Code you registered with.
                    </p>
                  </div>

                  <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                      MoMo Phone Number or Referral Code *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 670265493 or LIAH-REF-1234"
                      value={lookupValue}
                      onChange={(e) => setLookupValue(e.target.value)}
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

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      background: '#081F3E',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '14px',
                      fontSize: '0.96rem',
                      fontWeight: 800,
                      cursor: loading ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading ? 'Checking Records...' : 'Open My Referral Dashboard'}
                    <ChevronRight size={18} color="#F5A623" />
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            HOW IT WORKS & FAQ SECTION
            ======================================================== */}
        <section style={{ marginTop: '60px' }}>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#D97706', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ✦ SIMPLE 3-STEP PROCESS
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#081F3E', margin: '6px 0 10px 0' }}>
              How Referral &amp; MoMo Payouts Work
            </h2>
            <p style={{ color: '#64748B', fontSize: '0.92rem', maxWidth: '580px', margin: '0 auto' }}>
              We believe in rewarding our partners and students for expanding our tech community.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
            marginBottom: '40px'
          }}>
            <div style={{ background: '#FFFFFF', padding: '26px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: '#0284C7',
                fontWeight: 900
              }}>
                1
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#081F3E', margin: '0 0 8px 0' }}>
                Get Your Custom Link
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Enter your name and MoMo number above. You will get a personalized referral link with your unique tracking code.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '26px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: '#FEF3C7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: '#D97706',
                fontWeight: 900
              }}>
                2
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#081F3E', margin: '0 0 8px 0' }}>
                Students Apply via Your Link
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                When someone clicks your link and registers for HND, ND, or Certifications, their <strong>Name and Matricule</strong> are instantly logged into your downline.
              </p>
            </div>

            <div style={{ background: '#FFFFFF', padding: '26px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '8px',
                background: '#ECFDF5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '14px',
                color: '#059669',
                fontWeight: 900
              }}>
                3
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#081F3E', margin: '0 0 8px 0' }}>
                Get Paid Direct to MoMo
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748B', lineHeight: 1.6, margin: 0 }}>
                Once the student settles their application fee, 15,000 XAF is credited to your balance. Request a payout anytime and receive the MTN MoMo deposit along with the verification screenshot!
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* ========================================================
          MODAL: REQUEST WITHDRAWAL
          ======================================================== */}
      {payoutModalOpen && agent && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(8, 31, 62, 0.7)',
          zIndex: 9999,
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
              <h3 style={{ margin: 0, color: '#081F3E', fontSize: '1.3rem', fontWeight: 800 }}>
                Request MoMo Payout
              </h3>
              <button
                type="button"
                onClick={() => setPayoutModalOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '0.88rem', color: '#64748B', margin: '0 0 16px 0' }}>
              Available Balance: <strong style={{ color: '#10B981', fontSize: '1.1rem' }}>{agent.balance.toLocaleString()} XAF</strong>
            </p>

            {regPeriod && !regPeriod.can_request_payout && (
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
                🔒 <strong>Payouts Locked:</strong> Commission withdrawals for <strong>{regPeriod.title}</strong> will only be released at the end of the registration period on <strong>{new Date(regPeriod.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</strong>.
              </div>
            )}

            {payoutError && (
              <div style={{ background: '#FEF2F2', color: '#DC2626', padding: '10px', borderRadius: '6px', fontSize: '0.84rem', marginBottom: '14px' }}>
                {payoutError}
              </div>
            )}

            <form onSubmit={handlePayoutSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px' }}>
                  Withdrawal Amount (XAF) *
                </label>
                <input
                  type="number"
                  required
                  min={2000}
                  max={agent.balance}
                  step={1000}
                  placeholder={`Min 2,000 up to ${agent.balance}`}
                  value={payoutAmount}
                  onChange={(e) => setPayoutAmount(e.target.value)}
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
                  value={payoutMomoConfirm}
                  onChange={(e) => setPayoutMomoConfirm(e.target.value)}
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
                  Admin will deposit funds directly to this number and upload proof screenshot.
                </span>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setPayoutModalOpen(false)}
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
                  disabled={payoutSubmitting || (Boolean(regPeriod) && !regPeriod?.can_request_payout)}
                  style={{
                    flex: 2,
                    background: (regPeriod && !regPeriod.can_request_payout) ? '#94A3B8' : '#10B981',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '12px',
                    fontWeight: 800,
                    cursor: (payoutSubmitting || (regPeriod && !regPeriod.can_request_payout)) ? 'not-allowed' : 'pointer'
                  }}
                >
                  {payoutSubmitting
                    ? 'Submitting...'
                    : (regPeriod && !regPeriod.can_request_payout)
                      ? '🔒 Locked Until End of Intake'
                      : 'Confirm Withdrawal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          MODAL: VIEW DEPOSIT PROOF SCREENSHOT
          ======================================================== */}
      {viewingProof && (
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
            maxWidth: '600px',
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
                onClick={() => setViewingProof(null)}
                style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', textAlign: 'center', background: '#F8FAFC', borderRadius: '10px', padding: '14px', border: '1px solid #E2E8F0' }}>
              <img
                src={viewingProof}
                alt="MoMo Deposit Proof"
                style={{ maxWidth: '100%', maxHeight: '60vh', objectFit: 'contain', borderRadius: '8px' }}
              />
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <a
                href={viewingProof}
                download="liah_momo_payout_proof"
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
                <Download size={15} /> Download Receipt
              </a>
              <button
                type="button"
                onClick={() => setViewingProof(null)}
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

    </div>
  );
}

export default function ReferPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#081F3E', fontWeight: 700 }}>Loading Referral Gateway...</div>
      </div>
    }>
      <ReferPageContent />
    </Suspense>
  );
}
