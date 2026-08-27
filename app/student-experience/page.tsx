'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { 
  Play, Pause, Volume2, VolumeX, Wifi, ShieldCheck, 
  Laptop, Trophy, Flame, ArrowRight, Video, Sparkles, MapPin, CheckCircle
} from 'lucide-react';

const workshopVideos = [
  {
    id: 1,
    title: 'Live Workshop Session 1: Practical Engineering Lab',
    desc: 'Hands-on technical workshop covering modern software tools, system architecture, and collaborative engineering practices at Liah Academy Buea.',
    src: '/assets/videos/E1.mp4',
    badge: 'LIVE WORKSHOP',
    duration: 'Technical Session'
  },
  {
    id: 2,
    title: 'Live Workshop Session 2: Interactive Student Training & Code Review',
    desc: 'Intensive peer coding, debugging sessions, and practical project demonstrations conducted by industry mentors in our computer labs.',
    src: '/assets/videos/E2.mp4',
    badge: 'STUDENT ACTIVITY',
    duration: 'Mentorship Session'
  }
];

function VideoCard({ video }: { video: typeof workshopVideos[0] }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  return (
    <div 
      className="premium-card"
      style={{
        background: '#FFFFFF',
        borderRadius: '20px',
        overflow: 'hidden',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        boxShadow: '0 12px 36px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {/* Video Box */}
      <div style={{ position: 'relative', width: '100%', height: '320px', background: '#081F3E' }}>
        <video
          ref={videoRef}
          src={video.src}
          playsInline
          muted={isMuted}
          loop
          onClick={togglePlay}
          style={{ width: '100%', height: '100%', objectFit: 'cover', cursor: 'pointer' }}
        />

        {/* Video Overlay Badge */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', zIndex: 10 }}>
          <span style={{ 
            background: '#F5A623', 
            color: '#081F3E', 
            padding: '5px 12px', 
            borderRadius: '4px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.05em' 
          }}>
            {video.badge}
          </span>
        </div>

        {/* Floating Controls */}
        <div 
          style={{ 
            position: 'absolute', 
            top: '16px', 
            right: '16px', 
            display: 'flex', 
            gap: '8px', 
            zIndex: 10 
          }}
        >
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
            style={{
              background: 'rgba(8, 31, 62, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'transform 0.2s ease'
            }}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: '2px' }} />}
          </button>
          
          <button
            onClick={toggleMute}
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
            style={{
              background: 'rgba(8, 31, 62, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#FFFFFF',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backdropFilter: 'blur(6px)',
              transition: 'transform 0.2s ease'
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>

        {/* Center Play Button if paused */}
        {!isPlaying && (
          <div 
            onClick={togglePlay}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'rgba(245, 166, 35, 0.92)',
              color: '#081F3E',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.35)'
            }}
          >
            <Play size={26} style={{ marginLeft: '3px' }} />
          </div>
        )}
      </div>

      {/* Video Metadata */}
      <div style={{ padding: '26px 28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ color: '#081F3E', fontSize: '1.25rem', fontWeight: 800, lineHeight: '1.4', marginBottom: '10px' }}>
            {video.title}
          </h3>
          <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '18px' }}>
            {video.desc}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(15,23,42,0.06)', paddingTop: '16px' }}>
          <span style={{ fontSize: '0.82rem', color: '#B45309', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> {video.duration}
          </span>
          <span style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#F5A623" /> Buea Campus
          </span>
        </div>
      </div>
    </div>
  );
}

export default function StudentExperiencePage() {
  return (
    <main style={{ marginTop: 'calc(var(--header-height) + 40px)', marginBottom: '90px' }}>
      <div className="container">
        
        {/* Header */}
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <span style={{ 
            display: 'inline-block', 
            background: '#FEF3C7', 
            color: '#B45309', 
            padding: '5px 14px', 
            borderRadius: '4px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.75rem', 
            fontWeight: 800, 
            textTransform: 'uppercase', 
            letterSpacing: '0.08em', 
            marginBottom: '14px' 
          }}>
            STUDENT EXPERIENCE &amp; CAMPUS LIFE
          </span>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', fontWeight: 800, color: '#081F3E', marginBottom: '16px' }}>
            Life, Workshops &amp; Activities
          </h1>
          <p className="sub-header" style={{ maxWidth: '750px', margin: '0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.65' }}>
            At Liah Academy, education is hands-on and immersive. Explore our live workshop sessions, coding laboratories, campus facilities, and vibrant tech community in Buea.
          </p>
        </div>

        {/* 1. FEATURED WORKSHOP VIDEOS (E1 & E2) */}
        <section style={{ marginBottom: '80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Video size={24} color="#F5A623" />
            <h2 style={{ color: '#081F3E', margin: 0, fontSize: '1.75rem', fontWeight: 800 }}>
              Workshop Sessions in Action
            </h2>
          </div>
          <p style={{ color: '#64748B', fontSize: '0.95rem', marginBottom: '32px', maxWidth: '680px' }}>
            Watch our students and mentors during live technical workshops, software debugging drills, and collaborative project build sprints.
          </p>

          <div className="grid-2" style={{ gap: '32px', alignItems: 'stretch' }}>
            {workshopVideos.map((vid) => (
              <VideoCard key={vid.id} video={vid} />
            ))}
          </div>
        </section>

        {/* 2. CAMPUS FACILITIES & ENVIRONMENT */}
        <section className="grid-2" style={{ marginBottom: '80px', gap: '30px' }}>
          <div className="premium-card" style={{ background: '#081F3E', color: '#F8FAFC', padding: '40px', borderRadius: '20px' }}>
            <span className="course-badge" style={{ background: 'rgba(245,166,35,0.2)', color: '#F5A623' }}>
              Connectivity &amp; Labs
            </span>
            <h3 style={{ color: '#F8FAFC', margin: '14px 0 16px 0', fontSize: '1.4rem', fontWeight: 800 }}>
              <Wifi size={24} color="#F5A623" style={{ display: 'inline', marginRight: '8px' }} />
              High-Speed Fiber-Optic Wi-Fi
            </h3>
            <p style={{ color: '#CBD5E1', lineHeight: '1.7', marginBottom: '16px' }}>
              Liah Academy operates a dedicated fiber-optic network backbone on campus. High-speed, low-latency Wi-Fi spans across all computer labs, lecture zones, and collaborative study hubs.
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
              Students download machine learning datasets, connect to cloud consoles (AWS, Google Cloud), and push code to GitHub without interruptions.
            </p>
          </div>

          <div className="premium-card" style={{ padding: '40px', borderRadius: '20px' }}>
            <span className="course-badge">Campus Safety</span>
            <h3 style={{ color: '#081F3E', margin: '14px 0 16px 0', fontSize: '1.4rem', fontWeight: 800 }}>
              <ShieldCheck size={24} color="#F5A623" style={{ display: 'inline', marginRight: '8px' }} />
              24/7 Security &amp; Access Control
            </h3>
            <p style={{ color: '#64748B', lineHeight: '1.7', marginBottom: '16px' }}>
              Student safety is our top priority. The Bakweri Town campus is monitored by high-definition CCTV, on-site security personnel, and electronic keycard access protecting development laboratories.
            </p>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Whether collaborating late during semester hackathons or attending weekend workshops, students learn in a secure, supportive environment.
            </p>
          </div>
        </section>

        {/* 3. WORKSHOPS & HACKATHONS */}
        <section 
          style={{ 
            marginBottom: '80px', 
            background: '#FFFFFF', 
            border: '1px solid rgba(15,23,42,0.08)', 
            borderRadius: '20px', 
            padding: '50px 36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
          }}
        >
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="course-badge">Collaboration</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#081F3E' }}>Workshops, Competitions &amp; Bootcamps</h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#64748B' }}>
              Creativity happens when bright minds collaborate. We organize structured hackathons, coding workshops, and tech tournaments in Buea.
            </p>
          </div>

          <div className="grid-3" style={{ gap: '28px' }}>
            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid rgba(15,23,42,0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5A623', marginBottom: '16px' }}>
                <Laptop size={24} />
              </div>
              <h4 style={{ color: '#081F3E', marginBottom: '8px', fontSize: '1.15rem', fontWeight: 800 }}>Technical Workshops</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>
                Weekly hands-on masterclasses covering modern tools: Docker pipelines, Next.js setups, database indexing, and Git branch management.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid rgba(15,23,42,0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5A623', marginBottom: '16px' }}>
                <Trophy size={24} />
              </div>
              <h4 style={{ color: '#081F3E', marginBottom: '8px', fontSize: '1.15rem', fontWeight: 800 }}>Coding Hackathons</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>
                Semester tournaments with cash prizes where students form cross-functional teams to build MVPs judged by tech industry leaders.
              </p>
            </div>

            <div style={{ background: '#F8FAFC', padding: '24px', borderRadius: '12px', border: '1px solid rgba(15,23,42,0.06)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'rgba(245,166,35,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#F5A623', marginBottom: '16px' }}>
                <Flame size={24} />
              </div>
              <h4 style={{ color: '#081F3E', marginBottom: '8px', fontSize: '1.15rem', fontWeight: 800 }}>Intensive Bootcamps</h4>
              <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: '1.6' }}>
                Immersive holiday bootcamps covering bleeding-edge stacks, cloud deployments, mobile apps, and cyber threat hunting.
              </p>
            </div>
          </div>
        </section>

        {/* 4. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        <section 
          style={{ 
            marginBottom: '80px', 
            background: '#FFFFFF', 
            border: '1px solid rgba(15,23,42,0.08)', 
            borderRadius: '20px', 
            padding: '50px 36px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)'
          }}
        >
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="course-badge">Common Questions</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#081F3E' }}>Frequently Asked Questions</h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#64748B' }}>
              Find instant answers to common questions about admissions, lab facilities, internships, and student life in Buea.
            </p>
          </div>

          <div style={{ maxWidth: '780px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              {
                q: 'What are the computer lab and workstation specifications?',
                a: 'Our campus is equipped with dual-boot Linux & Windows workstations, high-speed fiber-optic Wi-Fi, modern multi-monitor dev setups, and automatic power generator backup to guarantee 100% uninterrupted coding sessions.'
              },
              {
                q: 'How does the guaranteed corporate software internship work?',
                a: 'Every enrolled student undergoes a structured internship in our Corporate Software Development & IT Services Division. Students build real client applications alongside senior software architects and graduate with verifiable industry work experience.'
              },
              {
                q: 'Does Liah Academy assist with student accommodation in Buea?',
                a: 'Yes! Our Student Affairs office directly assists all admitted students in securing clean, secure, and affordable hostels and private student apartments within 2–5 minutes walking distance of campus in Bakweri Town, Buea.'
              },
              {
                q: 'Can I study Online or Part-Time while working a job?',
                a: 'Absolutely. We offer 100% Online formats (with a 15% tuition discount) and Evening/Weekend Part-Time cohorts (with a 10% discount) designed for working professionals and remote students across Cameroon.'
              },
              {
                q: 'Can I pay my tuition in installments via Mobile Money?',
                a: 'Yes! We support flexible 2 or 3 installment payment plans. You can pay seamlessly via MTN or Orange Mobile Money directly on the Admissions portal or inside our AI Chat assistant.'
              }
            ].map((faq, idx) => (
              <details
                key={idx}
                style={{
                  background: '#F8FAFC',
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <summary style={{ fontWeight: 700, color: '#081F3E', fontSize: '1rem', outline: 'none', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>{faq.q}</span>
                  <span style={{ color: '#F5A623', fontSize: '1.2rem', fontWeight: 800, marginLeft: '12px' }}>+</span>
                </summary>
                <p style={{ marginTop: '12px', color: '#475569', fontSize: '0.92rem', lineHeight: '1.65', borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '12px' }}>
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* 5. CTA BANNER */}
        <section 
          style={{
            background: 'linear-gradient(135deg, #081F3E 0%, #0F3260 100%)',
            borderRadius: '20px',
            padding: '50px 40px',
            textAlign: 'center',
            color: '#FFFFFF',
            boxShadow: '0 12px 36px rgba(8,31,62,0.15)'
          }}
        >
          <span style={{ 
            background: 'rgba(245,166,35,0.2)', 
            color: '#F5A623', 
            padding: '4px 12px', 
            borderRadius: '4px', 
            fontFamily: 'var(--font-mono)', 
            fontSize: '0.75rem', 
            fontWeight: 800,
            textTransform: 'uppercase'
          }}>
            BECOME PART OF OUR COMMUNITY
          </span>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#FFFFFF', margin: '16px 0' }}>
            Ready to Experience Liah Academy?
          </h2>
          <p style={{ maxWidth: '600px', margin: '0 auto 28px auto', color: '#CBD5E1', fontSize: '1rem', lineHeight: '1.6' }}>
            Enroll in our accredited diploma tracks or professional certifications and build your technology career in Buea.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link href="/admissions" className="btn btn-primary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Apply for Admission <ArrowRight size={16} />
            </Link>
            <Link href="/degree-programs" className="btn btn-secondary" style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Explore Degree Programs
            </Link>
          </div>
        </section>

      </div>
    </main>
  );
}
