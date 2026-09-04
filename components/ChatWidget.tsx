'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, CheckCircle, AlertCircle, 
  Smartphone, Loader2, CreditCard, User, BookOpen, ExternalLink,
  ChevronRight, RefreshCw, ShieldCheck, Copy, Check, MessageCircle, 
  HelpCircle, GraduationCap, Search, MapPin, Phone, Maximize2, Minimize2, Sparkles, ArrowRight
} from 'lucide-react';

interface StudentData {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  degree_type: string;
  program_type: string;
  study_format: string;
  admission_status: string;
  payment_status: string;
  created_at?: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionType?: string;
  studentData?: StudentData;
  showPaymentDirectives?: boolean;
  prefillData?: any;
}

const feeOptions = [
  { label: 'Application Fee', amount: 10000, desc: 'Auditing & Registration' },
  { label: 'Seat Deposit', amount: 50000, desc: 'Enrollment Guarantee' },
  { label: 'HND 1st Installment', amount: 125000, desc: 'Semester 1 Tuition' },
  { label: 'ND 1st Installment', amount: 75000, desc: 'Semester 1 Tuition' },
];

const quickChips = [
  { label: '💳 Pay via MTN MoMo (*126*14*)', query: 'I want to pay my fees via MTN Mobile Money' },
  { label: '🔍 Check Application Status', query: 'Check my application status' },
  { label: '📚 Degree Programs', query: 'What degree programs and courses are offered?' },
  { label: '💰 Tuition & Discounts', query: 'What are the tuition fees and discounts?' },
  { label: '📝 How to Apply', query: 'What are the admission requirements and how do I apply?' },
  { label: '📍 Buea Campus Map', query: 'Where is the campus located in Buea?' },
  { label: '📞 Contact / WhatsApp', query: 'How can I contact Liah Academy admissions?' }
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'pay' | 'apply' | 'track' | 'programs'>('chat');
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! Welcome to Liah Academy 🎓. I'm your interactive admissions assistant and student portal desk.\n\nYou can chat with me, explore our degree tracks, check your dossier status, or pay your fees using our instant MTN MoMo short code: *126*14*670265493*Amount#!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // In-Chat Payment Directives State
  const [selectedFee, setSelectedFee] = useState<number>(10000);
  const [selectedFeeName, setSelectedFeeName] = useState<string>('Application Fee');
  const [customChatAmount, setCustomChatAmount] = useState<string>('');
  const [studentIdTag, setStudentIdTag] = useState<string>('');
  const [copiedShortCode, setCopiedShortCode] = useState(false);
  const [shortCodeDialed, setShortCodeDialed] = useState(false);
  const [autoChecking, setAutoChecking] = useState(false);

  // In-Chat PIN Terminal State
  const [showChatPinPrompt, setShowChatPinPrompt] = useState(false);
  const [chatPin, setChatPin] = useState('');
  const [chatPinSubmitting, setChatPinSubmitting] = useState(false);
  const [chatPinError, setChatPinError] = useState('');
  const [chatMomoReceipt, setChatMomoReceipt] = useState<any>(null);

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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (activeTab === 'chat') {
      scrollToBottom();
    }
  }, [messages, isTyping, showChatPinPrompt, chatMomoReceipt, shortCodeDialed, activeTab]);

  // Global hotkey Ctrl+J / Cmd+J
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

  const handleCopyShortCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedShortCode(true);
    setTimeout(() => setCopiedShortCode(false), 2500);
  };

  const handleRunShortCode = (code: string, amount: number) => {
    setShortCodeDialed(true);
    setChatPin('');
    setChatPinError('');
    try {
      navigator.clipboard.writeText(code);
    } catch {}
    const dialUri = `tel:*126*14*670265493*${amount}%23`;
    window.location.href = dialUri;
  };

  const handleAutoCheckStatus = async () => {
    setAutoChecking(true);
    setChatPinError('');
    const effectiveAmount = customChatAmount ? (parseInt(customChatAmount) || 0) : (selectedFee || 10000);

    try {
      const res = await fetch('/api/payments/momo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentIdTag ? parseInt(studentIdTag) : undefined,
          amount: effectiveAmount,
          phone: '670265493',
          pin: '0000'
        })
      });

      const data = await res.json();
      setAutoChecking(false);

      if (data.success) {
        setChatMomoReceipt(data.data?.receipt || {
          reference: data.data?.payment?.reference,
          amount: effectiveAmount,
          recipient: '670265493 (Liah Academy)',
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        });

        const successMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🎉 MoMo Payment Validated! ${effectiveAmount.toLocaleString()} XAF has been received. Your admission status is now APPROVED!`
        };
        setMessages(prev => [...prev, successMsg]);
      } else {
        setShowChatPinPrompt(true);
      }
    } catch {
      setAutoChecking(false);
      setShowChatPinPrompt(true);
    }
  };

  const handleChatAuthorizePin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPin || chatPin.length < 4) {
      setChatPinError('Please enter your 4 or 5-digit Secret PIN.');
      return;
    }
    setChatPinSubmitting(true);
    setChatPinError('');

    const effectiveAmount = customChatAmount ? (parseInt(customChatAmount) || 0) : (selectedFee || 10000);

    try {
      const res = await fetch('/api/payments/momo-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentIdTag ? parseInt(studentIdTag) : undefined,
          amount: effectiveAmount,
          phone: '670265493',
          pin: chatPin
        })
      });

      const data = await res.json();
      setChatPinSubmitting(false);

      if (data.success) {
        setShowChatPinPrompt(false);
        setChatMomoReceipt(data.data?.receipt || {
          reference: data.data?.payment?.reference,
          amount: effectiveAmount,
          recipient: '670265493 (Liah Academy)',
          date: new Date().toLocaleString(),
          status: 'PAID & APPROVED'
        });

        const successMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `🎉 MoMo Payment Validated! ${effectiveAmount.toLocaleString()} XAF has been authorized. Your admission dossier status is now APPROVED!`
        };
        setMessages(prev => [...prev, successMsg]);
      } else {
        setChatPinError(data.message || 'PIN verification failed. Please check your PIN.');
      }
    } catch {
      setChatPinSubmitting(false);
      setChatPinError('Network error confirming PIN authorization.');
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    // Switch to chat tab if from another tab
    setActiveTab('chat');

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      
      setIsTyping(false);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.response || "I'm happy to help! You can reach our admissions team directly at info@liahacademy.com.",
        actionType: data.actionType,
        studentData: data.studentData,
        showPaymentDirectives: data.actionType === 'payment_form',
        prefillData: data.prefillData
      };

      if (data.prefillData?.studentId) {
        setStudentIdTag(String(data.prefillData.studentId));
      }

      setMessages(prev => [...prev, botMsg]);
    } catch {
      setIsTyping(false);
      const fallbackMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Thanks for reaching out! You can learn more by applying on our Admissions page or contacting us at info@liahacademy.com."
      };
      setMessages(prev => [...prev, fallbackMsg]);
    }
  };

  const handleFastApplySubmit = async (e: React.FormEvent) => {
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

  const handleTrackDossierSubmit = async (e: React.FormEvent) => {
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

  const currentPayAmount = customChatAmount ? (parseInt(customChatAmount) || 0) : (selectedFee || 10000);
  const activeShortCode = `*126*14*670265493*${currentPayAmount || 10000}#`;

  return (
    <>
      {/* Unified Single Circular Golden Floating Button (Bottom-Right, Matching Image 1) */}
      <div
        className="chat-widget-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Liah Assistant &amp; Student Desk"
        role="button"
        tabIndex={0}
      >
        {isOpen ? <X size={26} color="#081F3E" /> : <MessageSquare size={26} color="#081F3E" />}
      </div>

      {/* Floating Panel (Positioned on the Right) */}
      {isOpen && (
        <div 
          className="chat-modal-window"
          style={isMaximized ? {
            position: 'fixed',
            bottom: 0,
            right: 0,
            left: 0,
            top: 0,
            width: '100vw',
            maxWidth: '100vw',
            height: '100vh',
            maxHeight: '100vh',
            borderRadius: 0,
            zIndex: 99999
          } : {}}
        >
          {/* Header */}
          <div className="chat-header" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="chat-header-info" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="chat-avatar">
                <Bot size={20} color="#081F3E" />
                <span className="online-badge" />
              </div>
              <div>
                <h4 className="chat-header-title" style={{ fontSize: '0.95rem', fontWeight: 800 }}>Liah Assistant</h4>
                <p className="chat-header-status" style={{ fontSize: '0.72rem' }}>24/7 Admissions, MoMo &amp; Student Desk</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsMaximized(!isMaximized)}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: '#CBD5E1',
                  borderRadius: '6px',
                  width: '28px',
                  height: '28px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
                title={isMaximized ? 'Restore Window' : 'Expand Window'}
              >
                {isMaximized ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
              </button>

              <button
                className="chat-close-btn"
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Integrated Navigation Bar (Switch between AI Chat, MoMo Pay, Fast Apply, Track, Programs) */}
          <div style={{
            display: 'flex',
            background: '#041021',
            borderBottom: '1px solid rgba(245,166,35,0.2)',
            padding: '4px 6px',
            gap: '4px',
            overflowX: 'auto',
            scrollbarWidth: 'none'
          }}>
            {[
              { id: 'chat', label: '💬 AI Advisor', icon: Bot },
              { id: 'pay', label: '💳 MTN MoMo', icon: Smartphone },
              { id: 'apply', label: '🎓 Fast Apply', icon: GraduationCap },
              { id: 'track', label: '🔍 Track Dossier', icon: Search },
              { id: 'programs', label: '📚 Programs', icon: BookOpen },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    background: isActive ? 'rgba(245, 166, 35, 0.25)' : 'transparent',
                    color: isActive ? '#FDE047' : '#94A3B8',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '0.74rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <Icon size={13} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: AI Chat Assistant */}
          {activeTab === 'chat' && (
            <>
              {/* Messages Body */}
              <div className="chat-messages-container">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`chat-msg ${msg.sender === 'user' ? 'user' : 'bot'}`}
                  >
                    {msg.sender === 'bot' && (
                      <div className="bot-icon-circle">
                        <Bot size={14} />
                      </div>
                    )}
                    <div className="chat-bubble-content">
                      <div style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}>
                        {msg.text}
                      </div>

                      {/* Render Verified Student Dossier Card */}
                      {msg.studentData && (
                        <div className="chat-dossier-card">
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ fontWeight: 800, color: '#F5A623', fontSize: '0.85rem' }}>
                              Verified Dossier #{msg.studentData.id}
                            </div>
                            <span style={{ 
                              fontSize: '0.7rem', 
                              padding: '2px 6px', 
                              borderRadius: '4px', 
                              background: msg.studentData.payment_status === 'Paid' ? '#10B981' : '#F59E0B', 
                              color: '#FFFFFF',
                              fontWeight: 700
                            }}>
                              {msg.studentData.payment_status === 'Paid' ? 'PAID' : 'PAYMENT PENDING'}
                            </span>
                          </div>
                          
                          <div style={{ fontSize: '0.78rem', color: '#CBD5E1', lineHeight: '1.6' }}>
                            <div><strong>Name:</strong> {msg.studentData.full_name}</div>
                            <div><strong>Program:</strong> {msg.studentData.program_type} ({msg.studentData.degree_type})</div>
                            <div><strong>Admission:</strong> <span style={{ color: '#FDE047', fontWeight: 700 }}>{msg.studentData.admission_status}</span></div>
                          </div>

                          {msg.studentData.payment_status !== 'Paid' && (
                            <button
                              onClick={() => {
                                setStudentIdTag(String(msg.studentData?.id));
                                setActiveTab('pay');
                              }}
                              style={{
                                width: '100%',
                                marginTop: '10px',
                                padding: '8px 12px',
                                borderRadius: '6px',
                                background: '#F5A623',
                                color: '#081F3E',
                                fontWeight: 800,
                                fontSize: '0.78rem',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '6px'
                              }}
                            >
                              <CreditCard size={14} /> Pay Application Fee (10,000 XAF)
                            </button>
                          )}
                        </div>
                      )}

                      {/* Direct Links inside Chat */}
                      {(msg.showPaymentDirectives || msg.actionType === 'payment_form') && (
                        <div style={{ marginTop: '8px' }}>
                          <button
                            onClick={() => setActiveTab('pay')}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '6px',
                              background: '#F5A623',
                              color: '#081F3E',
                              fontWeight: 800,
                              fontSize: '0.78rem',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Smartphone size={14} /> Open MTN MoMo Payment Panel
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="chat-msg bot" style={{ display: 'flex', gap: '4px', padding: '10px 14px' }}>
                    <span style={{ animation: 'pulse 1s infinite' }}>●</span>
                    <span style={{ animation: 'pulse 1s infinite 0.2s' }}>●</span>
                    <span style={{ animation: 'pulse 1s infinite 0.4s' }}>●</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Action Chips */}
              <div className="chat-quick-replies">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    className="quick-reply-chip"
                    onClick={() => handleSendMessage(chip.query)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

              {/* Bottom Input Row */}
              <div className="chat-input-row">
                <input
                  id="chat_ai_assistant_input"
                  name="chat_ai_assistant_input"
                  aria-label="Type your message to admissions assistant"
                  type="text"
                  className="chat-text-input"
                  placeholder="Ask a question, check status, or type 'pay'..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSendMessage(input);
                  }}
                />
                <button
                  className="chat-send-btn"
                  onClick={() => handleSendMessage(input)}
                  aria-label="Send message"
                >
                  <Send size={16} />
                </button>
              </div>
            </>
          )}

          {/* TAB 2: MTN MoMo Pay */}
          {activeTab === 'pay' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#081F3E', color: '#F8FAFC' }}>
              <div style={{
                background: 'rgba(245, 166, 35, 0.12)',
                border: '1px solid rgba(245, 166, 35, 0.35)',
                borderRadius: '8px',
                padding: '10px',
                marginBottom: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Smartphone size={18} color="#F5A623" />
                <div style={{ fontSize: '0.8rem', color: '#FDE047', fontWeight: 700 }}>
                  Official Short Code: <strong>*126*14*670265493*Amount#</strong>
                </div>
              </div>

              {/* Amount Selection */}
              <div style={{ marginBottom: '12px' }}>
                <label style={{ display: 'block', fontSize: '0.76rem', color: '#94A3B8', marginBottom: '6px', fontWeight: 700 }}>
                  Select Payment Amount:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  {feeOptions.map(opt => (
                    <button
                      key={opt.amount}
                      type="button"
                      onClick={() => {
                        setSelectedFee(opt.amount);
                        setSelectedFeeName(opt.label);
                        setCustomChatAmount('');
                        setShortCodeDialed(false);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: selectedFee === opt.amount && !customChatAmount ? '2px solid #F5A623' : '1px solid rgba(255,255,255,0.12)',
                        background: selectedFee === opt.amount && !customChatAmount ? 'rgba(245, 166, 35, 0.25)' : 'rgba(255,255,255,0.04)',
                        color: '#FFFFFF',
                        textAlign: 'left',
                        fontSize: '0.74rem',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>{opt.label}</div>
                      <div style={{ color: '#FDE047', fontSize: '0.7rem' }}>{opt.amount.toLocaleString()} XAF</div>
                    </button>
                  ))}
                </div>

                <input
                  type="number"
                  placeholder="Or enter custom amount in XAF..."
                  value={customChatAmount}
                  onChange={(e) => {
                    setCustomChatAmount(e.target.value);
                    setShortCodeDialed(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid rgba(255,255,255,0.2)',
                    background: '#041021',
                    color: '#FFFFFF',
                    fontSize: '0.82rem'
                  }}
                />
              </div>

              {/* Big "Pay Now — Open MTN MoMo" Action Button (Short code runs in background) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
                <button
                  type="button"
                  onClick={() => handleRunShortCode(activeShortCode, currentPayAmount || 10000)}
                  style={{
                    width: '100%',
                    padding: '13px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #F5A623 0%, #E28704 100%)',
                    color: '#081F3E',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(245, 166, 35, 0.4)'
                  }}
                >
                  <Smartphone size={18} /> Pay Now — Open MTN MoMo ({(currentPayAmount || 10000).toLocaleString()} XAF)
                </button>
              </div>

              {/* Auto-check confirmation */}
              {shortCodeDialed && !chatMomoReceipt && (
                <div style={{
                  background: 'rgba(16,185,129,0.12)',
                  border: '1px solid #10B981',
                  borderRadius: '8px',
                  padding: '10px',
                  marginBottom: '12px'
                }}>
                  <div style={{ fontSize: '0.76rem', color: '#A7F3D0', fontWeight: 700, marginBottom: '6px' }}>
                    📲 Code dispatched. Entered Secret PIN on your phone?
                  </div>
                  <button
                    type="button"
                    disabled={autoChecking}
                    onClick={handleAutoCheckStatus}
                    style={{
                      width: '100%',
                      padding: '9px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#10B981',
                      color: '#FFFFFF',
                      fontWeight: 800,
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {autoChecking ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                    ✓ I Entered PIN — Auto-Check Status
                  </button>
                </div>
              )}

              {/* Receipt Card */}
              {chatMomoReceipt && (
                <div style={{
                  background: '#ECFDF5',
                  border: '2px solid #10B981',
                  borderRadius: '8px',
                  padding: '12px',
                  color: '#065F46',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ fontWeight: 800, fontSize: '0.86rem', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={16} color="#10B981" /> Payment Confirmed &amp; Approved!
                  </div>
                  <div>Reference: <strong>{chatMomoReceipt.reference}</strong></div>
                  <div>Amount: <strong>{chatMomoReceipt.amount?.toLocaleString()} XAF</strong></div>
                  <div>Recipient: <strong>670265493 (Liah Academy)</strong></div>
                  <div>Status: <strong style={{ color: '#059669' }}>PAID &amp; APPROVED</strong></div>
                </div>
              )}

            </div>
          )}

          {/* TAB 3: Fast Apply */}
          {activeTab === 'apply' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#081F3E', color: '#F8FAFC' }}>
              <h4 style={{ color: '#FDE047', margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 800 }}>
                1-Minute Fast Registration
              </h4>
              <p style={{ margin: '0 0 12px 0', color: '#94A3B8', fontSize: '0.76rem' }}>
                Create your applicant dossier directly without leaving this page.
              </p>

              {applyError && (
                <div style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '8px 10px', borderRadius: '6px', fontSize: '0.76rem', marginBottom: '10px' }}>
                  ⚠️ {applyError}
                </div>
              )}

              {applySuccess ? (
                <div style={{ background: '#ECFDF5', border: '1.5px solid #10B981', borderRadius: '8px', padding: '14px', color: '#065F46' }}>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '6px' }}>
                    🎉 Application Created Successfully!
                  </div>
                  <p style={{ fontSize: '0.78rem', margin: '0 0 10px 0' }}>
                    Welcome, <strong>{applySuccess.full_name}</strong>! Your applicant ID is <strong>#{applySuccess.id}</strong>.
                  </p>
                  <button
                    onClick={() => {
                      setStudentIdTag(String(applySuccess.id));
                      setActiveTab('pay');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      width: '100%',
                      background: '#081F3E',
                      color: '#F5A623',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 800,
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Proceed to Pay Registration Fee (10,000 XAF) <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleFastApplySubmit}>
                  <div style={{ marginBottom: '8px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', marginBottom: '4px' }}>Full Legal Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={applyName}
                      onChange={(e) => setApplyName(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.8rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', marginBottom: '4px' }}>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="john@example.com"
                        value={applyEmail}
                        onChange={(e) => setApplyEmail(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', marginBottom: '4px' }}>Phone (MoMo) *</label>
                      <input
                        type="tel"
                        required
                        placeholder="670 123 456"
                        value={applyPhone}
                        onChange={(e) => setApplyPhone(e.target.value)}
                        style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ marginBottom: '10px' }}>
                    <label style={{ display: 'block', fontSize: '0.74rem', color: '#94A3B8', marginBottom: '4px' }}>Degree Track *</label>
                    <select
                      value={applyDegree}
                      onChange={(e) => {
                        const deg = e.target.value as any;
                        setApplyDegree(deg);
                        setApplyProgram(deg === 'HND' ? 'Software Engineering HND' : (deg === 'ND' ? 'Web Design ND' : 'DevOps Certification'));
                      }}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.8rem', marginBottom: '6px' }}
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
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#F5A623',
                      color: '#081F3E',
                      fontWeight: 900,
                      fontSize: '0.84rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    {applyLoading ? <Loader2 size={15} className="animate-spin" /> : <GraduationCap size={15} />}
                    Create Admission Dossier
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: Track Dossier */}
          {activeTab === 'track' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#081F3E', color: '#F8FAFC' }}>
              <h4 style={{ color: '#FDE047', margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 800 }}>
                Track Application Status
              </h4>
              <p style={{ margin: '0 0 12px 0', color: '#94A3B8', fontSize: '0.76rem' }}>
                Enter your registered Email Address or Student ID:
              </p>

              <form onSubmit={handleTrackDossierSubmit} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <input
                  type="text"
                  required
                  placeholder="e.g. john@example.com or #1002"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.2)', background: '#041021', color: '#FFF', fontSize: '0.8rem' }}
                />
                <button
                  type="submit"
                  disabled={trackLoading}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    background: '#F5A623',
                    color: '#081F3E',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  {trackLoading ? <Loader2 size={13} className="animate-spin" /> : <Search size={13} />}
                  Search
                </button>
              </form>

              {trackError && (
                <div style={{ background: 'rgba(239,68,68,0.2)', color: '#FCA5A5', padding: '8px 10px', borderRadius: '6px', fontSize: '0.76rem' }}>
                  {trackError}
                </div>
              )}

              {trackResult && (
                <div style={{
                  background: '#020617',
                  border: '1.5px solid #F5A623',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.78rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontWeight: 800, color: '#FDE047' }}>Dossier #{trackResult.id}</span>
                    <span style={{
                      background: trackResult.payment_status === 'Paid' ? '#10B981' : '#F59E0B',
                      color: '#FFFFFF',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontSize: '0.68rem',
                      fontWeight: 700
                    }}>
                      {trackResult.payment_status}
                    </span>
                  </div>

                  <div style={{ color: '#CBD5E1', lineHeight: '1.5', marginBottom: '10px' }}>
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
                      gap: '4px',
                      background: '#F5A623',
                      color: '#081F3E',
                      padding: '7px 10px',
                      borderRadius: '6px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      textDecoration: 'none'
                    }}
                  >
                    Open Full Dossier &amp; Admission Letter <ArrowRight size={13} />
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Programs Catalog */}
          {activeTab === 'programs' && (
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', background: '#081F3E', color: '#F8FAFC' }}>
              <h4 style={{ color: '#FDE047', margin: '0 0 8px 0', fontSize: '0.92rem', fontWeight: 800 }}>
                Degree Programs &amp; Certifications
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {[
                  { title: 'Software Engineering HND', dur: '2 Years', fee: '250,000 XAF/yr' },
                  { title: 'Cybersecurity & Cloud Defense HND', dur: '2 Years', fee: '250,000 XAF/yr' },
                  { title: 'Information & Comm. Tech (ICT) ND', dur: '1 Year', fee: '150,000 XAF/yr' },
                  { title: 'Web Design ND', dur: '1 Year', fee: '150,000 XAF/yr' },
                  { title: 'DevOps Certification', dur: '9 Months', fee: '350,000 XAF' },
                  { title: 'Data Science & Machine Learning', dur: '9 Months', fee: '350,000 XAF' }
                ].map((p, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.8rem', color: '#FFF' }}>{p.title}</div>
                      <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>{p.dur} &bull; {p.fee}</div>
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
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: 800,
                        fontSize: '0.7rem',
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
        </div>
      )}
    </>
  );
}
