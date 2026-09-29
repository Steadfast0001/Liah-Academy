'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, X, Send, Bot, CheckCircle, 
  Loader2, User, Phone, Mail, ExternalLink,
  MessageCircle, Sparkles, Shield, Clock
} from 'lucide-react';
import { WhatsAppIcon } from './SocialIcons';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user' | 'agent';
  sender_name?: string;
  text: string;
  timestamp?: string;
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userContact, setUserContact] = useState<string>('');
  const [showContactFields, setShowContactFields] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'agent',
      sender_name: 'Liah Admissions Desk',
      text: 'Hello! 👋 Welcome to Liah Academy Live Support. Send us a message here and our admissions counselors will respond to you live.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen, messages]);

  // Initialize session ID
  useEffect(() => {
    let sid = '';
    try {
      if (typeof window !== 'undefined') {
        sid = localStorage.getItem('liah_chat_session_id') || '';
        if (!sid) {
          sid = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
          localStorage.setItem('liah_chat_session_id', sid);
        }
        const savedName = localStorage.getItem('liah_chat_user_name');
        if (savedName) setUserName(savedName);
        const savedContact = localStorage.getItem('liah_chat_user_contact');
        if (savedContact) setUserContact(savedContact);
      }
    } catch {
      sid = `chat_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    }
    setSessionId(sid);

    // Initial fetch of conversation history
    if (sid) {
      fetch(`/api/chat?sessionId=${sid}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
            setMessages(data.messages);
          }
        })
        .catch(() => {});
    }
  }, []);

  // Real-time polling for live responses from admin
  useEffect(() => {
    if (!sessionId) return;

    const pollInterval = setInterval(async () => {
      if (typeof document !== 'undefined' && document.hidden && !isOpen) return;

      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.messages) && data.messages.length > 0) {
          setMessages(prev => {
            if (data.messages.length > prev.length) {
              if (!isOpen) {
                setUnreadCount(prevUnread => prevUnread + (data.messages.length - prev.length));
              }
              return data.messages;
            }
            return prev;
          });
        }
      } catch {}
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [sessionId, isOpen]);

  // Global hotkey Ctrl+J / Cmd+J to toggle live chat
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

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = input.trim();
    if (!text || isSending) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      sender_name: userName || 'Student / Visitor',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Optimistic append
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsSending(true);

    try {
      if (userName && typeof window !== 'undefined') {
        localStorage.setItem('liah_chat_user_name', userName);
      }
      if (userContact && typeof window !== 'undefined') {
        localStorage.setItem('liah_chat_user_contact', userContact);
      }

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          query: text,
          userName: userName || undefined,
          userPhone: userContact || undefined,
          userEmail: userContact?.includes('@') ? userContact : undefined
        })
      });

      const data = await res.json();
      if (data.success && data.response) {
        // If an automated acknowledgement or answer was returned and not yet in messages
        const botReply: ChatMessage = {
          id: `reply_${Date.now()}`,
          sender: 'agent',
          sender_name: 'Liah Support',
          text: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => {
          // Avoid duplicate text if already fetched via poll
          if (prev.some(m => m.text === botReply.text && m.sender !== 'user')) return prev;
          return [...prev, botReply];
        });
      }
    } catch {
      // Offline fallback note
      setMessages(prev => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: 'agent',
          sender_name: 'System',
          text: 'Message stored. If internet was interrupted, our admissions desk will see your message once connectivity restores.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Open Live Chat"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, #081F3E 0%, #0F2F57 100%)',
            color: '#FFFFFF',
            border: '2px solid #F5A623',
            borderRadius: '50px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 8px 25px rgba(8, 31, 62, 0.4)',
            cursor: 'pointer',
            zIndex: 9999,
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          className="hover:scale-105"
        >
          <div style={{ position: 'relative' }}>
            <MessageSquare size={22} color="#F5A623" />
            <span style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              background: '#10B981',
              border: '2px solid #081F3E'
            }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.02em' }}>
            Live Chat
          </span>
          {unreadCount > 0 && (
            <span style={{
              background: '#DC2626',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '20px',
              height: '20px',
              fontSize: '0.72rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {/* Live Chat Modal Box */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '20px',
            right: '20px',
            width: 'min(400px, calc(100vw - 32px))',
            height: 'min(580px, calc(100vh - 40px))',
            background: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(8, 31, 62, 0.35)',
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 99999,
            overflow: 'hidden',
            fontFamily: 'inherit'
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #081F3E 0%, #0F2F57 100%)',
              color: '#FFFFFF',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '2px solid #F5A623'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                background: 'rgba(245, 166, 35, 0.2)',
                border: '1.5px solid #F5A623',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={20} color="#F5A623" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#FFFFFF' }}>
                  Liah Academy Support
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
                  <span style={{ fontSize: '0.75rem', color: '#CBD5E1', fontWeight: 600 }}>
                    Admissions Desk Online
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close Chat"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '30px',
                  height: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Optional Quick User Identification Toggle */}
          <div style={{
            background: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            padding: '8px 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.78rem',
            color: '#64748B'
          }}>
            <span>
              Chatting as: <strong style={{ color: '#081F3E' }}>{userName || 'Prospective Student'}</strong>
            </span>
            <button
              type="button"
              onClick={() => setShowContactFields(!showContactFields)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284C7',
                fontWeight: 700,
                cursor: 'pointer',
                fontSize: '0.78rem'
              }}
            >
              {showContactFields ? 'Done' : 'Set Name / Phone'}
            </button>
          </div>

          {/* Contact Details Dropdown */}
          {showContactFields && (
            <div style={{ background: '#F1F5F9', padding: '12px 16px', borderBottom: '1px solid #CBD5E1' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '6px' }}>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', width: '100%' }}
                />
                <input
                  type="text"
                  placeholder="Phone or Email"
                  value={userContact}
                  onChange={(e) => setUserContact(e.target.value)}
                  style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem', width: '100%' }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                Helps our admissions team address you and follow up if needed.
              </span>
            </div>
          )}

          {/* Message Thread Feed */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              background: '#FFFFFF'
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    alignSelf: isUser ? 'flex-end' : 'flex-start'
                  }}
                >
                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginBottom: '3px', padding: '0 4px' }}>
                    {isUser ? (m.sender_name || 'You') : (m.sender_name || 'Admissions Counselor')} • {m.timestamp || ''}
                  </span>
                  <div
                    style={{
                      background: isUser ? '#081F3E' : '#F1F5F9',
                      color: isUser ? '#FFFFFF' : '#0F172A',
                      padding: '10px 14px',
                      borderRadius: isUser ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      fontSize: '0.88rem',
                      lineHeight: '1.45',
                      wordBreak: 'break-word',
                      boxShadow: isUser ? '0 2px 8px rgba(8, 31, 62, 0.15)' : 'none',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {m.text}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div style={{
            padding: '8px 12px',
            background: '#F8FAFC',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {[
              'What programs are available?',
              'What are the tuition fees?',
              'How do I enrol online?'
            ].map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => handleQuickQuestion(q)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '16px',
                  padding: '4px 10px',
                  fontSize: '0.74rem',
                  fontWeight: 600,
                  color: '#081F3E',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* WhatsApp Direct Option Banner */}
          <div style={{
            background: '#F0FDF4',
            borderTop: '1px solid #DCFCE7',
            padding: '6px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.76rem'
          }}>
            <span style={{ color: '#166534', fontWeight: 600 }}>Prefer direct WhatsApp?</span>
            <a
              href="https://wa.me/237670265493?text=Hello%20Liah%20Academy%20Admissions%20Team"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#15803D',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <WhatsAppIcon size={13} /> +237 670 265 493
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px',
              background: '#FFFFFF',
              borderTop: '1px solid #E2E8F0',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <input
              ref={inputRef}
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1.5px solid #CBD5E1',
                fontSize: '0.88rem',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={!input.trim() || isSending}
              style={{
                background: input.trim() ? '#081F3E' : '#94A3B8',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                width: '42px',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                flexShrink: 0,
                transition: 'background 0.2s'
              }}
            >
              {isSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} color="#F5A623" />}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
