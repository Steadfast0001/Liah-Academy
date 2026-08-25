'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Mail, Send, CheckCircle, AlertCircle, Info, Handshake } from 'lucide-react';
import SocialLinksList from '@/components/SocialIcons';
import { PARTNERSHIP_MAILTO_LINK } from '@/lib/constants';

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
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(data.message || 'Failed to submit inquiry.');
      }
    } catch {
      setLoading(false);
      setError('Connection error. Please try again.');
    }
  };

  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header">
          <span className="course-badge">Contact Us</span>
          <h1>Get in Touch with Liah</h1>
          <p className="sub-header">
            Have questions about admissions, fees, corporate software contracts, or partnership structures? Drop us a line below or visit our Buea campus.
          </p>
        </div>

        <div className="grid-2">
          {/* LEFT COLUMN: Campus Info & Inquiry Form */}
          <div>
            {/* Campus Info Card */}
            <section className="premium-card" style={{ marginBottom: '30px' }}>
              <h3 style={{ color: '#081F3E', marginBottom: '24px', fontSize: '1.25rem' }}>
                <MapPin size={22} color="#F5A623" style={{ display: 'inline', marginRight: '8px' }} />
                Campus Contact Information
              </h3>

              <ul className="contact-details-list">
                <li>
                  <div className="icon-wrap">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', marginBottom: '4px', color: '#081F3E' }}>Main Campus Address</h4>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>Backweri Town, Buea, Southwest Region, Cameroon</p>
                  </div>
                </li>

                <li>
                  <div className="icon-wrap">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', marginBottom: '4px', color: '#081F3E' }}>Telephone Lines</h4>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>+237 652 154 095 / +237 699 526 607</p>
                  </div>
                </li>

                <li>
                  <div className="icon-wrap">
                    <Mail size={20} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '15px', marginBottom: '4px', color: '#081F3E' }}>Official Email Address</h4>
                    <p style={{ fontSize: '14px', color: '#64748B' }}>info@liahacademy.com</p>
                  </div>
                </li>
              </ul>

              <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(15,23,42,0.08)' }}>
                <h4 style={{ fontSize: '13px', color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
                  Social Channels
                </h4>
                <div style={{ marginTop: 0 }}>
                  <SocialLinksList iconSize={18} />
                </div>
              </div>
            </section>

            {/* Corporate Partnership Card */}
            <section className="premium-card" style={{ marginBottom: '30px', background: 'linear-gradient(135deg, #081F3E 0%, #0D2D59 100%)', color: '#FFFFFF' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <Handshake size={24} color="#F5A623" />
                <h3 style={{ color: '#FFFFFF', margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  Corporate &amp; Academic Partnerships
                </h3>
              </div>
              <p style={{ color: '#CBD5E1', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '20px' }}>
                Interested in co-marketing, technical integrations, corporate software engineering, or hiring our graduates?
              </p>
              <a 
                href={PARTNERSHIP_MAILTO_LINK}
                className="btn"
                style={{
                  background: '#F5A623',
                  color: '#081F3E',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(245, 166, 35, 0.35)'
                }}
              >
                <Mail size={16} /> Partner With Us (Email)
              </a>
            </section>

            {/* Direct Inquiry Form */}
            <section id="inquiry" className="premium-card" style={{ scrollMarginTop: '120px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span style={{ 
                  background: '#FEF3C7', 
                  color: '#B45309', 
                  padding: '3px 10px', 
                  borderRadius: '4px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase' 
                }}>
                  DIRECT INQUIRY
                </span>
              </div>
              <h3 style={{ color: '#081F3E', marginBottom: '18px', fontSize: '1.3rem', fontWeight: 800 }}>
                <Mail size={22} color="#F5A623" style={{ display: 'inline', marginRight: '8px' }} />
                Send a Direct Inquiry
              </h3>

              {success && (
                <div style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981', padding: '14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={20} />
                  <span>Thank you! Your message has been delivered to our admissions office.</span>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.15)', color: '#DC2626', padding: '14px', borderRadius: '8px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Your Name *</label>
                    <input
                      type="text"
                      className="form-input-light"
                      required
                      placeholder="e.g. Marie Claire"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>Your Email *</label>
                    <input
                      type="email"
                      className="form-input-light"
                      required
                      placeholder="e.g. marie@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    className="form-input-light"
                    placeholder="e.g. Admissions Inquiry / Corporate Software"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Message *</label>
                  <textarea
                    className="form-input-light"
                    rows={4}
                    required
                    placeholder="How can we assist you?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  {loading ? 'Sending Message...' : 'Send Inquiry'} <Send size={16} />
                </button>
              </form>
            </section>
          </div>

          {/* RIGHT COLUMN: Campus Map & Directions */}
          <div>
            <section className="premium-card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ color: '#081F3E', marginBottom: '12px', fontSize: '1.25rem' }}>
                <MapPin size={20} color="#F5A623" style={{ display: 'inline', marginRight: '8px' }} />
                Campus Map & Geolocation
              </h3>
              <p style={{ color: '#64748B', marginBottom: '20px', fontSize: '0.95rem' }}>
                Liah Academy is situated in Bakweri Town, Buea, nested along the serene lower slopes of Mount Cameroon.
              </p>

              {/* Realtime Google Map Embed */}
              <div style={{ flexGrow: 1, minHeight: '380px', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(15,23,42,0.1)' }}>
                <iframe
                  src="https://maps.google.com/maps?q=Liah%20Academy,%20Bakweri%20Town,%20Buea,%20Cameroon&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '380px', display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Liah Academy Location Map"
                />
              </div>

              <div style={{ marginTop: '20px', fontSize: '13px', color: '#64748B', lineHeight: '1.6', background: '#F8FAFC', padding: '14px', borderRadius: '8px' }}>
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
