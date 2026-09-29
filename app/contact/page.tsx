'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Info, MessageSquare, ArrowRight } from 'lucide-react';
import SocialLinksList from '../../components/SocialIcons';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSuccess(true);
        setName('');
        setEmail('');
        setSubject('');
        setMessage('');
        setTimeout(() => setSuccess(false), 6000);
      } else {
        setError(data.message || 'Failed to submit inquiry.');
      }
    } catch {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 36px)', marginBottom: '90px' }}>
      <div className="container" style={{ maxWidth: '1240px' }}>
        
        {/* Header Section without kicker tag */}
        <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 48px' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', 
            fontWeight: 800, 
            color: '#081F3E', 
            letterSpacing: '-0.02em',
            marginBottom: '14px' 
          }}>
            Get in Touch with Liah
          </h1>
          <p style={{ 
            color: '#475569', 
            fontSize: '1.08rem', 
            lineHeight: 1.65,
            margin: 0
          }}>
            Reach out for admissions, alumni relations, corporate partnership, or general inquiries. Drop us a line, we would love to hear from you.
          </p>
        </div>

        {/* 2-Column Main Layout Grid */}
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', 
            gap: '32px',
            alignItems: 'stretch'
          }}
        >
          
          {/* ===================================================
              LEFT COLUMN: Direct Inquiry Form (Top) + Contact Info (Bottom)
              =================================================== */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            
            {/* 1. DIRECT INQUIRY CARD (TOP) */}
            <section 
              id="inquiry" 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(8, 31, 62, 0.04)',
                scrollMarginTop: '120px'
              }}
            >
              <div style={{ marginBottom: '22px' }}>
                <h2 style={{ 
                  color: '#081F3E', 
                  fontSize: '1.45rem', 
                  fontWeight: 800, 
                  margin: '0 0 6px 0' 
                }}>
                  Direct Inquiry
                </h2>
                <p style={{ 
                  color: '#64748B', 
                  fontSize: '0.92rem', 
                  lineHeight: 1.5,
                  margin: 0 
                }}>
                  Have questions about admissions, fees, corporate software contracts, or general inquiries?
                </p>
              </div>

              {success && (
                <div style={{ 
                  background: 'rgba(16, 185, 129, 0.12)', 
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#065F46', 
                  padding: '14px 16px', 
                  borderRadius: '8px', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '0.92rem',
                  fontWeight: 600
                }}>
                  <CheckCircle size={20} color="#10B981" style={{ flexShrink: 0 }} />
                  <span>Thank you! Your message has been received by the Liah Academy admissions desk.</span>
                </div>
              )}

              {error && (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  border: '1px solid rgba(239, 68, 68, 0.25)',
                  color: '#DC2626', 
                  padding: '14px 16px', 
                  borderRadius: '8px', 
                  marginBottom: '20px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  fontSize: '0.92rem'
                }}>
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                
                {/* Row 1: Name & Email */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="contact_user_name" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px', display: 'block' }}>
                      Your Name: *
                    </label>
                    <input
                      id="contact_user_name"
                      name="name"
                      type="text"
                      className="form-input-light"
                      required
                      placeholder="e.g. Marie Claire"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      style={{ borderRadius: '8px', padding: '12px 14px', fontSize: '0.92rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ margin: 0 }}>
                    <label htmlFor="contact_user_email" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px', display: 'block' }}>
                      Your Email: *
                    </label>
                    <input
                      id="contact_user_email"
                      name="email"
                      type="email"
                      className="form-input-light"
                      required
                      placeholder="e.g. marie@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ borderRadius: '8px', padding: '12px 14px', fontSize: '0.92rem' }}
                    />
                  </div>
                </div>

                {/* Row 2: Subject */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="contact_user_subject" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px', display: 'block' }}>
                    Subject:
                  </label>
                  <input
                    id="contact_user_subject"
                    name="subject"
                    type="text"
                    className="form-input-light"
                    placeholder="Select a Reason for Contact (e.g. Admissions Inquiry / Software)"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    style={{ borderRadius: '8px', padding: '12px 14px', fontSize: '0.92rem' }}
                  />
                </div>

                {/* Row 3: Message */}
                <div className="form-group" style={{ margin: 0 }}>
                  <label htmlFor="contact_user_message" style={{ fontSize: '0.88rem', fontWeight: 700, color: '#081F3E', marginBottom: '6px', display: 'block' }}>
                    Message: *
                  </label>
                  <textarea
                    id="contact_user_message"
                    name="message"
                    className="form-input-light"
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{ borderRadius: '8px', padding: '12px 14px', fontSize: '0.92rem', resize: 'vertical' }}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: '#F5A623',
                    color: '#081F3E',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '14px 24px',
                    fontWeight: 800,
                    fontSize: '0.95rem',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 12px rgba(245, 166, 35, 0.3)',
                    transition: 'all 0.2s ease',
                    marginTop: '4px'
                  }}
                >
                  {loading ? 'Sending Inquiry...' : 'Send Inquiry'} <ArrowRight size={16} />
                </button>
              </form>
            </section>

            {/* 2. CAMPUS CONTACT INFORMATION CARD (BOTTOM) */}
            <section 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '30px 32px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(8, 31, 62, 0.04)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5A623', display: 'inline-block' }} />
                <h3 style={{ color: '#081F3E', fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                  Campus Contact Information
                </h3>
              </div>

              {/* 2 Side-by-Side Contact Staff / Desk Boxes */}
              <div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                  gap: '16px',
                  marginBottom: '24px'
                }}
              >
                {/* Contact Box 1: Admissions Desk */}
                <div 
                  style={{ 
                    background: '#F8FAFC', 
                    borderRadius: '10px', 
                    padding: '18px 16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Phone size={14} color="#B45309" />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Admissions Desk
                      </h4>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                      Admissions officer for HND, ND &amp; Certifications
                    </p>
                  </div>
                  <a
                    href="https://wa.me/237699526607?text=Hello%20Liah%20Academy%20Admissions"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      color: '#059669',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={12} /> +237 699 526 607
                  </a>
                </div>

                {/* Contact Box 2: Campus Administration */}
                <div 
                  style={{ 
                    background: '#F8FAFC', 
                    borderRadius: '10px', 
                    padding: '18px 16px',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Mail size={14} color="#B45309" />
                      </div>
                      <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: '#081F3E' }}>
                        Campus Secretariat
                      </h4>
                    </div>
                    <p style={{ margin: '0 0 12px 0', fontSize: '0.78rem', color: '#64748B', lineHeight: 1.4 }}>
                      Corporate partnerships &amp; academic records
                    </p>
                  </div>
                  <a
                    href="tel:+237652154095"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      borderRadius: '6px',
                      color: '#059669',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      textDecoration: 'none'
                    }}
                  >
                    <Phone size={12} /> +237 652 154 095
                  </a>
                </div>
              </div>

              {/* Social Channels Row */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(15, 23, 42, 0.08)' }}>
                <span style={{ 
                  display: 'block', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  color: '#94A3B8', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.08em', 
                  marginBottom: '10px' 
                }}>
                  Social Channels
                </span>
                <SocialLinksList iconSize={18} />
              </div>
            </section>

          </div>

          {/* ===================================================
              RIGHT COLUMN: Campus Map & Geolocation
              =================================================== */}
          <div>
            <section 
              className="premium-card" 
              style={{ 
                background: '#FFFFFF',
                borderRadius: '16px',
                padding: '36px 32px',
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 10px 30px rgba(8, 31, 62, 0.04)',
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <MapPin size={22} color="#F5A623" />
                <h3 style={{ color: '#081F3E', margin: 0, fontSize: '1.4rem', fontWeight: 800 }}>
                  Campus Map &amp; Geolocation
                </h3>
              </div>
              <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '0.92rem', lineHeight: 1.5 }}>
                Liah Academy is located in Bakweri Town, Buea, located along the serene lower slopes of Mount Cameroon.
              </p>

              {/* Realtime Interactive Google Map Embed */}
              <div 
                style={{ 
                  flexGrow: 1, 
                  minHeight: '440px', 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid #E2E8F0',
                  boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.04)'
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Liah%20Academy,%20Bakweri%20Town,%20Buea,%20Cameroon&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '440px', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Liah Academy Location Map"
                />
              </div>

              {/* Transit Directions Banner */}
              <div 
                style={{ 
                  marginTop: '20px', 
                  fontSize: '0.84rem', 
                  color: '#475569', 
                  lineHeight: '1.6', 
                  background: '#F8FAFC', 
                  padding: '14px 16px', 
                  borderRadius: '10px',
                  border: '1px solid #E2E8F0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#081F3E', fontWeight: 700, marginBottom: '4px' }}>
                  <Info size={16} color="#F5A623" />
                  <span>Transit Directions</span>
                </div>
                From the Mile 17 motor park, take a town taxi heading towards Bakweri Town. Ask to be dropped at the Liah Innovation Hub along the main road.
              </div>
            </section>
          </div>

        </div>
      </div>
    </main>
  );
}
