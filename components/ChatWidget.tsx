'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, CheckCircle, AlertCircle, 
  Smartphone, Loader2, CreditCard, User, BookOpen, ExternalLink,
  ChevronRight, RefreshCw, ShieldCheck
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

interface PaymentReceipt {
  reference: string;
  amount: number;
  currency: string;
  operator: string;
  studentName?: string;
  studentEmail?: string;
  feeItem: string;
  date: string;
}

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  actionType?: string;
  studentData?: StudentData;
  showPaymentForm?: boolean;
  prefillData?: any;
  paymentReceipt?: PaymentReceipt;
  pollingState?: {
    reference: string;
    phone: string;
    amount: number;
    feeItem: string;
    studentId?: number;
  };
}

const feeOptions = [
  { label: 'Application Fee', amount: 10000, desc: 'Auditing & Registration' },
  { label: 'Seat Deposit', amount: 50000, desc: 'Enrollment Guarantee' },
  { label: 'HND 1st Installment', amount: 125000, desc: 'Semester 1 Tuition' },
  { label: 'ND 1st Installment', amount: 75000, desc: 'Semester 1 Tuition' },
];

const quickChips = [
  { label: '💳 Pay via Mobile Money', query: 'I want to pay my fees via Mobile Money' },
  { label: '🔍 Check Application Status', query: 'Check my application status' },
  { label: '📚 Degree Programs', query: 'What degree programs and courses are offered?' },
  { label: '💰 Tuition & Discounts', query: 'What are the tuition fees and discounts?' },
  { label: '📝 How to Apply', query: 'What are the admission requirements and how do I apply?' },
  { label: '📍 Buea Campus Map', query: 'Where is the campus located in Buea?' },
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! Welcome to Liah Academy. I'm your interactive admissions & payment assistant. You can ask about our degree programs, check your application status, or pay your fees directly inside this chat via Mobile Money!"
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [showChips, setShowChips] = useState(true);

  // In-Chat Payment Form State
  const [selectedFee, setSelectedFee] = useState<number>(10000);
  const [selectedFeeName, setSelectedFeeName] = useState<string>('Application Fee');
  const [payEmail, setPayEmail] = useState('');
  const [payPhone, setPayPhone] = useState('');
  const [payStudentId, setPayStudentId] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [payLoading, setPayLoading] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // Status Check Form State
  const [statusEmailOrId, setStatusEmailOrId] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (textToSend: string) => {
    const query = textToSend.trim();
    if (!query) return;

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: query
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setShowChips(false);
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
        showPaymentForm: data.actionType === 'payment_form',
        prefillData: data.prefillData
      };

      if (data.prefillData) {
        if (data.prefillData.email) setPayEmail(data.prefillData.email);
        if (data.prefillData.phone) setPayPhone(data.prefillData.phone);
        if (data.prefillData.studentId) setPayStudentId(String(data.prefillData.studentId));
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

  // Trigger In-Chat Payment Flow
  const startPaymentFlow = (presetStudent?: StudentData) => {
    if (presetStudent) {
      setPayEmail(presetStudent.email);
      setPayPhone(presetStudent.phone || '');
      setPayStudentId(String(presetStudent.id));
    }
    const payMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'bot',
      text: "Select your fee payment item and enter your Mobile Money phone number below:",
      showPaymentForm: true,
      actionType: 'payment_form'
    };
    setMessages(prev => [...prev, payMsg]);
  };

  // Submit In-Chat MoMo Payment
  const handleExecutePayment = async (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    if (!payPhone) {
      setPayError('Please enter your Mobile Money phone number.');
      return;
    }

    const finalAmount = customAmount ? parseInt(customAmount) : selectedFee;
    setPayLoading(true);
    setPayError(null);

    try {
      const res = await fetch('/api/payments/campay/collect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: payPhone,
          amount: finalAmount,
          studentId: payStudentId ? parseInt(payStudentId) : null,
          description: `Liah Academy - ${selectedFeeName} (${payEmail || payPhone})`
        })
      });

      const data = await res.json();
      setPayLoading(false);

      if (data.success && data.reference) {
        // Update message to live polling state
        const pollingMsg: ChatMessage = {
          id: Date.now().toString(),
          sender: 'bot',
          text: `📲 **USSD Payment Prompt Dispatched!**\nPlease check your phone (**${payPhone}**) and enter your **Mobile Money PIN** to authorize payment of **${finalAmount.toLocaleString()} XAF**.`,
          pollingState: {
            reference: data.reference,
            phone: payPhone,
            amount: finalAmount,
            feeItem: selectedFeeName,
            studentId: payStudentId ? parseInt(payStudentId) : undefined
          }
        };
        setMessages(prev => [...prev, pollingMsg]);

        // Start Polling Loop
        pollPaymentStatus(data.reference, finalAmount, selectedFeeName, payPhone, payEmail, payStudentId ? parseInt(payStudentId) : undefined);
      } else {
        setPayError(data.message || 'Failed to dispatch Mobile Money prompt. Please check your phone number.');
      }
    } catch {
      setPayLoading(false);
      setPayError('Network error connecting to payment gateway. Please try again.');
    }
  };

  // Live Polling for Mobile Money Clearance
  const pollPaymentStatus = (
    reference: string, 
    amount: number, 
    feeItem: string, 
    phone: string, 
    email?: string, 
    studentId?: number
  ) => {
    let attempts = 0;
    const maxAttempts = 30; // 90 seconds max

    const interval = setInterval(async () => {
      attempts++;
      try {
        const queryParams = new URLSearchParams({
          reference,
          ...(studentId ? { studentId: String(studentId) } : {})
        });

        const res = await fetch(`/api/payments/campay/status?${queryParams.toString()}`);
        const data = await res.json();

        if (data.status === 'SUCCESSFUL') {
          clearInterval(interval);
          const receipt: PaymentReceipt = {
            reference,
            amount,
            currency: 'XAF',
            operator: data.operator || 'Mobile Money',
            studentName: data.student?.full_name || 'Valued Applicant',
            studentEmail: email || data.student?.email,
            feeItem,
            date: new Date().toLocaleString()
          };

          const successMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `🎉 **Payment Verified & Confirmed!**\nYour payment for **${feeItem}** (${amount.toLocaleString()} XAF) has been processed successfully. Your application status is now updated to **PAID & APPROVED** across the Liah Academy network!`,
            paymentReceipt: receipt
          };
          setMessages(prev => [...prev, successMsg]);
        } else if (data.status === 'FAILED' || attempts >= maxAttempts) {
          clearInterval(interval);
          const failMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'bot',
            text: `⚠️ **Payment Timeout or Cancelled.**\nThe Mobile Money prompt timed out or was cancelled. You can try again or contact support at info@liahacademy.com.`
          };
          setMessages(prev => [...prev, failMsg]);
        }
      } catch {
        if (attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }
    }, 3000);
  };

  return (
    <>
      {/* Floating Toggle Bubble */}
      <div
        className="chat-widget-bubble"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Chat Assistant"
        role="button"
        tabIndex={0}
      >
        {isOpen ? <X size={26} /> : <MessageSquare size={26} />}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-widget-window">
          {/* Header */}
          <div className="chat-window-header">
            <div className="chat-bot-identity">
              <span className="bot-dot"></span>
              <div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, margin: 0, color: '#F8FAFC', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  Liah Assist AI <span style={{ background: '#F5A623', color: '#081F3E', fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 900 }}>LIVE</span>
                </h4>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Admissions &amp; In-Chat MoMo Payments</span>
              </div>
            </div>
            <button
              className="close-chat-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close Chat"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="chat-messages-area">
            {messages.map((msg) => (
              <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                <div className={`chat-msg ${msg.sender}`}>
                  {msg.text}

                  {/* Render In-Chat Status Dossier Card */}
                  {msg.studentData && (
                    <div className="chat-status-card">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#FFFFFF' }}>{msg.studentData.full_name}</strong>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Applicant #{msg.studentData.id} • {msg.studentData.email}</div>
                        </div>
                        <span style={{
                          background: msg.studentData.payment_status === 'Paid' ? '#10B981' : '#F59E0B',
                          color: '#FFFFFF',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: 800
                        }}>
                          {msg.studentData.payment_status === 'Paid' ? 'PAID' : 'PAYMENT PENDING'}
                        </span>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>📚 Track: <strong>{msg.studentData.program_type}</strong> ({msg.studentData.degree_type})</div>
                        <div>🏛️ Format: <strong>{msg.studentData.study_format}</strong></div>
                        <div>📋 Review: <strong style={{ color: msg.studentData.admission_status === 'Approved' ? '#10B981' : '#F5A623' }}>{msg.studentData.admission_status}</strong></div>
                      </div>

                      {msg.studentData.payment_status !== 'Paid' && (
                        <button
                          onClick={() => startPaymentFlow(msg.studentData)}
                          className="chat-pay-submit-btn"
                          style={{ marginTop: '12px', fontSize: '0.8rem', padding: '8px' }}
                        >
                          <CreditCard size={14} /> Pay Application Fee in Chat (10,000 XAF)
                        </button>
                      )}
                    </div>
                  )}

                  {/* Render In-Chat Payment Form */}
                  {msg.showPaymentForm && (
                    <div className="chat-payment-card">
                      <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#F5A623', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CreditCard size={14} /> Campay Mobile Money Gateway
                      </div>

                      {payError && (
                        <div style={{ background: 'rgba(239,68,68,0.15)', color: '#FCA5A5', padding: '8px 10px', borderRadius: '6px', fontSize: '0.75rem', marginBottom: '8px', display: 'flex', gap: '6px' }}>
                          <AlertCircle size={14} style={{ flexShrink: 0 }} />
                          <span>{payError}</span>
                        </div>
                      )}

                      <form onSubmit={(e) => handleExecutePayment(e, msg.id)}>
                        <label style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                          Select Fee Item:
                        </label>
                        <div className="chat-fee-selector">
                          {feeOptions.map((opt, i) => (
                            <button
                              key={i}
                              type="button"
                              className={`chat-fee-btn ${selectedFee === opt.amount && !customAmount ? 'active' : ''}`}
                              onClick={() => {
                                setSelectedFee(opt.amount);
                                setSelectedFeeName(opt.label);
                                setCustomAmount('');
                              }}
                            >
                              <div>{opt.label}</div>
                              <div style={{ color: '#F5A623', fontSize: '0.7rem' }}>{opt.amount.toLocaleString()} XAF</div>
                            </button>
                          ))}
                        </div>

                        <label htmlFor={`chat_pay_phone_${msg.id}`} style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                          Mobile Money Phone (MTN / Orange) *
                        </label>
                        <input
                          id={`chat_pay_phone_${msg.id}`}
                          name="chat_pay_phone"
                          type="tel"
                          required
                          placeholder="e.g. 670 123 456 or 699 000 000"
                          value={payPhone}
                          onChange={(e) => setPayPhone(e.target.value)}
                          className="chat-input-field"
                        />

                        <label htmlFor={`chat_pay_email_${msg.id}`} style={{ display: 'block', fontSize: '0.72rem', color: '#94A3B8', marginBottom: '4px' }}>
                          Applicant Email / ID (Optional - for receipt auto-sync)
                        </label>
                        <input
                          id={`chat_pay_email_${msg.id}`}
                          name="chat_pay_email"
                          type="text"
                          placeholder="e.g. yourname@example.com or #1024"
                          value={payEmail || payStudentId}
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v.startsWith('#') || !isNaN(Number(v))) {
                              setPayStudentId(v.replace('#', ''));
                            } else {
                              setPayEmail(v);
                            }
                          }}
                          className="chat-input-field"
                        />

                        <button
                          type="submit"
                          disabled={payLoading}
                          className="chat-pay-submit-btn"
                        >
                          {payLoading ? (
                            <>
                              <Loader2 size={14} className="animate-spin" /> Dispatching USSD Prompt...
                            </>
                          ) : (
                            <>
                              <Smartphone size={14} /> Send USSD PIN Prompt ({selectedFee.toLocaleString()} XAF)
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  )}

                  {/* Render Live USSD Polling Status Indicator */}
                  {msg.pollingState && (
                    <div style={{ marginTop: '10px', background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.3)', borderRadius: '10px', padding: '12px', textAlign: 'center' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245,166,35,0.2)', marginBottom: '8px', color: '#F5A623' }}>
                        <Loader2 size={20} className="animate-spin" />
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#F8FAFC', fontWeight: 700 }}>
                        Awaiting PIN Clearance on Phone...
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                        Ref: {msg.pollingState.reference} • {msg.pollingState.amount.toLocaleString()} XAF
                      </div>
                    </div>
                  )}

                  {/* Render Verified Digital Receipt */}
                  {msg.paymentReceipt && (
                    <div className="chat-receipt-card">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                        <ShieldCheck size={22} color="#10B981" />
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#10B981' }}>Official Payment Receipt</div>
                          <div style={{ fontSize: '0.7rem', color: '#94A3B8' }}>Liah Academy Finance Division</div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '8px', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div>Item: <strong>{msg.paymentReceipt.feeItem}</strong></div>
                        <div>Amount: <strong style={{ color: '#F5A623' }}>{msg.paymentReceipt.amount.toLocaleString()} XAF</strong></div>
                        <div>Ref: <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{msg.paymentReceipt.reference}</span></div>
                        <div>Channel: <strong>{msg.paymentReceipt.operator}</strong></div>
                        <div>Payer: <strong>{msg.paymentReceipt.studentName}</strong></div>
                        <div>Date: <strong>{msg.paymentReceipt.date}</strong></div>
                      </div>

                      <div style={{ marginTop: '10px', background: '#10B981', color: '#FFFFFF', padding: '6px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 800, textAlign: 'center' }}>
                        ✓ ENROLLMENT STATUS CLEARED (PAID)
                      </div>
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
          {showChips && (
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
          )}

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
              aria-label="Send Message"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
