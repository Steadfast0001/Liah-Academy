'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, ArrowRight, UserPlus, Star, 
  Terminal, Award, Sparkles, Shield, 
  Users, Code, MessageSquare, Plus, ExternalLink,
  MapPin, Volume2, VolumeX, Play, Pause
} from 'lucide-react';
import { PARTNERSHIP_MAILTO_LINK } from '@/lib/constants';
import WebThreads from '@/components/WebThreads';

const heroSlides = [
  { type: 'video', src: '/assets/videos/1.mp4' },
  { type: 'image', src: '/assets/images/1.jpg' },
  { type: 'video', src: '/assets/videos/video.mp4' },
  { type: 'image', src: '/assets/images/2.jpg' },
  { type: 'video', src: '/assets/videos/E1.mp4' },
  { type: 'image', src: '/assets/images/image_3.jpg' },
  { type: 'video', src: '/assets/videos/E2.mp4' },
  { type: 'image', src: '/assets/images/image_4.jpg' },
  { type: 'image', src: '/assets/images/image_5.jpg' },
  { type: 'image', src: '/assets/images/OIP_2.webp' }
];

const newsArticles = [
  {
    id: 1,
    image: '/assets/images/flyer_engineering.png',
    date: 'August 19, 2026',
    title: 'Engineering & Technology Programs Catalog (HND & ND Tracks)',
    excerpt: 'Full Academic Syllabus: School of Engineering and Technology. The School of Engineering and Technology at Liah Academy is admitting candidates across full-stack engineering and cloud defense.',
    link: '/degree-programs'
  },
  {
    id: 2,
    image: '/assets/images/flyer_business.jpg',
    date: 'August 19, 2026',
    title: 'Launching the School of Business and Management HND Programs',
    excerpt: 'National HND Syllabus: Business & Management Department. Liah Academy\'s School of Business and Management has opened admissions for the 2-Year technical diploma cohort.',
    link: '/degree-programs'
  },
  {
    id: 3,
    image: '/assets/images/flyer_certification.png',
    date: 'August 19, 2026',
    title: 'Liah Academy Certification Programs Admissions Now Open',
    excerpt: 'Admissions Announcement: Professional IT Certification Tracks. Liah Academy is officially accepting applications for its high-impact IT Certification Programs in DevOps & Data Science.',
    link: '/degree-programs'
  }
];

const partners = [
  'SILICON MOUNTAIN',
  'MINESEC CERTIFIED',
  'LINUX LABS',
  'AWS ACADEMY'
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reviews, setReviews] = useState<any[]>([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewName, setReviewName] = useState('');
  const [reviewRole, setReviewRole] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);

  // Auto-play video when scrolled into view and pause when scrolled past
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const playPromise = video.play();
            if (playPromise !== undefined) {
              playPromise
                .then(() => setIsPlaying(true))
                .catch(() => {});
            }
          } else {
            video.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.35 }
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  // Rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Fetch reviews from API
  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data) {
          setReviews(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewRole || !reviewComment) return;

    setReviewSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: reviewName,
          role: reviewRole,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      setReviewSubmitting(false);

      if (data.success && data.data) {
        setReviews([data.data, ...reviews]);
        setReviewSuccess(true);
        setReviewName('');
        setReviewRole('');
        setReviewComment('');
        setTimeout(() => {
          setReviewSuccess(false);
          setShowReviewForm(false);
        }, 2000);
      }
    } catch {
      setReviewSubmitting(false);
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  return (
    <main>
      {/* 1. HERO SLIDESHOW SECTION */}
      <section className="hero-slider-section">
        <div className="slider-container">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`slide ${idx === currentSlide ? 'active' : ''}`}
              style={
                slide.type === 'image'
                  ? { backgroundImage: `url('${slide.src}')` }
                  : {}
              }
            >
              {slide.type === 'video' && (
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    position: 'absolute',
                    top: 0,
                    left: 0
                  }}
                >
                  <source src={slide.src} type="video/mp4" />
                </video>
              )}
            </div>
          ))}
        </div>

        <div className="slider-overlay" />

        <div className="container hero-content">
          <span className="hero-tag">
            <Terminal size={14} /> BUEA&apos;S PREMIER TECH HUB
          </span>
          <h1 className="hero-title">
            Forge Your Future in <span>Technology</span>
          </h1>
          <p className="hero-subtitle body-large">
            Liah Academy combines academic excellence with corporate software innovation. Study from our state-of-the-art tech curriculum or hire our professional engineering teams.
          </p>
          <div className="hero-ctas">
            <Link href="/admissions#apply" className="btn btn-primary">
              <UserPlus size={18} /> Apply Now
            </Link>
            <Link href="/degree-programs" className="btn btn-secondary">
              Explore Programs
            </Link>
          </div>
        </div>

        {/* Mission / Vision Glass Badges */}
        <div className="hero-corner-box mission-box">
          <h4 style={{ color: 'var(--color-primary-accent)', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Award size={14} style={{ display: 'inline', marginRight: '6px' }} /> Our Mission
          </h4>
          <p style={{ fontSize: '12px', color: '#CBD5E1', margin: 0 }}>
            To empower tech innovators through practical lab-based learning and build world-class digital solutions.
          </p>
        </div>

        <div className="hero-corner-box vision-box">
          <h4 style={{ color: 'var(--color-primary-accent)', fontSize: '13px', textTransform: 'uppercase', marginBottom: '4px' }}>
            <Sparkles size={14} style={{ display: 'inline', marginRight: '6px' }} /> Our Vision
          </h4>
          <p style={{ fontSize: '12px', color: '#CBD5E1', margin: 0 }}>
            To be the leading practical tech academy and engineering partner in Cameroon and Africa.
          </p>
        </div>
      </section>

      {/* 2. STATS ROW */}
      <section className="bg-light-section" style={{ padding: '40px 0', borderBottom: '1px solid rgba(15, 23, 42, 0.08)', background: '#FFFFFF' }}>
        <div className="container">
          <div className="grid-4" style={{ textAlign: 'center' }}>
            <div>
              <h3 style={{ fontSize: '38px', fontWeight: 800, color: '#081F3E' }}>2024</h3>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Year Established</p>
            </div>
            <div>
              <h3 style={{ fontSize: '38px', fontWeight: 800, color: '#081F3E' }}>500+</h3>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Trained Graduates</p>
            </div>
            <div>
              <h3 style={{ fontSize: '38px', fontWeight: 800, color: '#081F3E' }}>95%</h3>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Career Landing Rate</p>
            </div>
            <div>
              <h3 style={{ fontSize: '38px', fontWeight: 800, color: '#081F3E' }}>100%</h3>
              <p style={{ color: '#64748B', fontWeight: 600, fontSize: '0.85rem', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>Practical &amp; Labs-Based</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. VIDEO PRESENTATION: LIAH IN ACTION */}
      <section className="section-padding" style={{ background: '#081F3E', color: '#F8FAFC' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '36px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: 'rgba(245, 166, 35, 0.15)', 
              color: '#F5A623', 
              padding: '5px 14px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '12px' 
            }}>
              LIAH EXPERIENCE
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#F8FAFC', marginBottom: '12px' }}>
              Liah Academy in Action
            </h2>
            <p className="sub-header" style={{ color: '#CBD5E1', maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Watch our campus walk-through, laboratory practicals, and see how our graduates forge careers in corporate technology.
            </p>
          </div>

          <div 
            style={{ 
              maxWidth: '960px', 
              margin: '0 auto', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 30px rgba(245, 166, 35, 0.15)',
              border: '1px solid rgba(245, 166, 35, 0.25)',
              background: '#041021',
              position: 'relative'
            }}
          >
            {/* Overlay Video Controls Top Right */}
            <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 10, display: 'flex', gap: '8px' }}>
              <button 
                onClick={togglePlay}
                style={{ 
                  background: 'rgba(8, 31, 62, 0.85)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 166, 35, 0.3)', 
                  color: '#F5A623', 
                  borderRadius: '6px', 
                  padding: '8px 12px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
              </button>
              <button 
                onClick={toggleMute}
                style={{ 
                  background: 'rgba(8, 31, 62, 0.85)', 
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(245, 166, 35, 0.3)', 
                  color: '#F5A623', 
                  borderRadius: '6px', 
                  padding: '8px 12px', 
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 700
                }}
              >
                {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
              </button>
            </div>

            <video
              ref={videoRef}
              width="100%"
              height="auto"
              controls
              muted
              playsInline
              preload="metadata"
              style={{ display: 'block', width: '100%', maxHeight: '540px', objectFit: 'cover' }}
            >
              <source src="/assets/videos/video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Campus Tag Overlay Bottom Left */}
            <div style={{ 
              position: 'absolute', 
              bottom: '20px', 
              left: '20px', 
              background: 'rgba(8, 31, 62, 0.85)', 
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(245, 166, 35, 0.3)', 
              padding: '6px 14px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <MapPin size={16} color="#EF4444" />
              <span>BUEA, CAMEROON</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ACADEMIC PATHWAYS DEGREE FORMATS */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              ACADEMIC PATHWAYS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#081F3E', marginBottom: '14px' }}>
              Select your degree format
            </h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Whether you seek HND certification or specialized professional bachelor degrees, we have a track custom built for you.
            </p>
          </div>

          <div className="grid-3" style={{ alignItems: 'stretch' }}>
            {/* Card 1: Higher National Diploma */}
            <div 
              className="premium-card" 
              style={{ 
                borderTop: '5px solid #081F3E', 
                borderRadius: '16px', 
                padding: '36px 30px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  background: '#FEF3C7', 
                  color: '#B45309', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '18px' 
                }}>
                  HND PROGRAM
                </span>
                <h3 style={{ color: '#081F3E', fontSize: '1.45rem', fontWeight: 800, lineHeight: '1.3', marginBottom: '14px' }}>
                  Higher National Diploma
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '24px' }}>
                  A highly practical two-year track focusing directly on core technical competencies and software operations.
                </p>

                <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '20px', marginBottom: '24px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Duration: 2 Years
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> DevOps &amp; Support Modules
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Standard National Exams
                    </li>
                  </ul>
                </div>
              </div>

              <Link 
                href="/degree-programs" 
                className="btn" 
                style={{ 
                  background: '#081F3E', 
                  color: '#FFFFFF', 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                View HND Modules
              </Link>
            </div>

            {/* Card 2: Bachelor of Science (B.Sc) - Highlighted */}
            <div 
              className="premium-card" 
              style={{ 
                borderTop: '5px solid #F5A623', 
                borderRadius: '16px', 
                padding: '36px 30px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderColor: 'rgba(245, 166, 35, 0.4)',
                boxShadow: '0 15px 40px -10px rgba(245, 166, 35, 0.25)'
              }}
            >
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  background: '#FEF3C7', 
                  color: '#B45309', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '18px' 
                }}>
                  PROFESSIONAL DEGREE
                </span>
                <h3 style={{ color: '#081F3E', fontSize: '1.45rem', fontWeight: 800, lineHeight: '1.3', marginBottom: '14px' }}>
                  Bachelor of Science (B.Sc)
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '24px' }}>
                  A three-year comprehensive curriculum covering defense networks, information governance, and cryptography.
                </p>

                <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '20px', marginBottom: '24px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Duration: 3 Years
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Cybersecurity Focus
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Laboratory Internships
                    </li>
                  </ul>
                </div>
              </div>

              <Link 
                href="/degree-programs" 
                className="btn" 
                style={{ 
                  background: '#F5A623', 
                  color: '#081F3E', 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  fontWeight: 800, 
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'block',
                  boxShadow: '0 4px 15px rgba(245, 166, 35, 0.35)'
                }}
              >
                Explore B.Sc Tracks
              </Link>
            </div>

            {/* Card 3: Bachelor of Technology (B.Tech) */}
            <div 
              className="premium-card" 
              style={{ 
                borderTop: '5px solid #081F3E', 
                borderRadius: '16px', 
                padding: '36px 30px', 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                boxShadow: '0 10px 30px rgba(0,0,0,0.04)'
              }}
            >
              <div>
                <span style={{ 
                  display: 'inline-block', 
                  background: '#FEF3C7', 
                  color: '#B45309', 
                  padding: '4px 10px', 
                  borderRadius: '4px', 
                  fontFamily: 'var(--font-mono)', 
                  fontSize: '0.72rem', 
                  fontWeight: 800, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.06em', 
                  marginBottom: '18px' 
                }}>
                  TECHNOLOGY TRACK
                </span>
                <h3 style={{ color: '#081F3E', fontSize: '1.45rem', fontWeight: 800, lineHeight: '1.3', marginBottom: '14px' }}>
                  Bachelor of Technology (B.Tech)
                </h3>
                <p style={{ color: '#64748B', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '24px' }}>
                  A professional program designed around building complex API engines, database models, and cloud setups.
                </p>

                <div style={{ borderTop: '1px solid rgba(15, 23, 42, 0.06)', paddingTop: '20px', marginBottom: '24px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Duration: 3 Years
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Full Stack Engineering
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.92rem', color: '#081F3E', fontWeight: 600 }}>
                      <Check size={16} color="#081F3E" strokeWidth={2.5} /> Direct Incubator Placement
                    </li>
                  </ul>
                </div>
              </div>

              <Link 
                href="/degree-programs" 
                className="btn" 
                style={{ 
                  background: '#081F3E', 
                  color: '#FFFFFF', 
                  width: '100%', 
                  padding: '14px', 
                  borderRadius: '8px', 
                  fontWeight: 700, 
                  textAlign: 'center',
                  fontSize: '0.95rem',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                View B.Tech Modules
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CORPORATE SERVICES DIVISION (Enterprise software & services from Buea) */}
      <section className="section-padding" style={{ background: '#041021', color: '#F8FAFC', position: 'relative', overflow: 'hidden' }}>
        {/* Animated WebThreads Interactive Canvas */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, opacity: 0.9, pointerEvents: 'auto' }}>
          <WebThreads
            color1="#5227FF"
            color2="#FF9FFC"
            color3="#FFFFFF"
            speed={0.2}
            threadCount={6}
            frequency={5}
            spread={0.18}
            taper={1}
            position={0.5}
            fanMode="center"
            glow={0.02}
            falloff={0.6}
            thickness={1.1}
            brightness={0.6}
            opacity={1}
            mirror
            shimmer={false}
            grain
            grainIntensity={0.05}
            mouseInteraction
            mouseStrength={0.3}
          />
        </div>

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div className="grid-2" style={{ alignItems: 'center', gap: '60px' }}>
            {/* Left Column: Heading, description and button */}
            <div>
              <span style={{ 
                display: 'inline-block', 
                background: 'rgba(245, 166, 35, 0.15)', 
                color: '#F5A623', 
                padding: '4px 12px', 
                borderRadius: '4px', 
                fontFamily: 'var(--font-mono)', 
                fontSize: '0.72rem', 
                fontWeight: 800, 
                textTransform: 'uppercase', 
                letterSpacing: '0.06em', 
                marginBottom: '16px' 
              }}>
                CORPORATE DIVISION
              </span>
              <h2 style={{ color: '#F8FAFC', fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, lineHeight: '1.25', marginBottom: '20px' }}>
                Enterprise software &amp; services from Buea
              </h2>
              <p style={{ color: '#94A3B8', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '32px' }}>
                Liah Academy is both an academy and a company. Our professional services arm develops production applications, performs compliance audits, and provides technical consulting globally.
              </p>
              <a 
                href={PARTNERSHIP_MAILTO_LINK}
                className="btn" 
                style={{ 
                  background: '#F5A623', 
                  color: '#081F3E', 
                  padding: '14px 28px', 
                  borderRadius: '8px', 
                  fontWeight: 800, 
                  fontSize: '0.95rem',
                  display: 'inline-block',
                  textDecoration: 'none',
                  boxShadow: '0 4px 15px rgba(245, 166, 35, 0.35)'
                }}
              >
                Partner With Us
              </a>
            </div>

            {/* Right Column: 3 Service cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Card 1 */}
              <div style={{ 
                background: 'rgba(8, 31, 62, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '24px 28px',
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '8px', 
                  background: 'rgba(245, 166, 35, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#F5A623',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Shield size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    Network Defense &amp; Infrastructure Audits
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    Secure your corporate assets. We perform detailed security evaluations, network setups, and vulnerability logs.
                  </p>
                </div>
              </div>

              {/* Card 2 */}
              <div style={{ 
                background: 'rgba(8, 31, 62, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '24px 28px',
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '8px', 
                  background: 'rgba(245, 166, 35, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#F5A623',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Users size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    Corporate IT Training &amp; Bootcamps
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    Upskill your workforce with hands-on, academy-led masterclasses on cloud, cybersecurity, and data analysis.
                  </p>
                </div>
              </div>

              {/* Card 3 */}
              <div style={{ 
                background: 'rgba(8, 31, 62, 0.6)', 
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '12px', 
                padding: '24px 28px',
                display: 'flex',
                gap: '18px',
                alignItems: 'flex-start'
              }}>
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '8px', 
                  background: 'rgba(245, 166, 35, 0.15)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  color: '#F5A623',
                  flexShrink: 0,
                  marginTop: '2px'
                }}>
                  <Code size={20} />
                </div>
                <div>
                  <h4 style={{ color: '#F8FAFC', fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
                    Custom Software Engineering
                  </h4>
                  <p style={{ color: '#94A3B8', fontSize: '0.9rem', lineHeight: '1.6', margin: 0 }}>
                    We design and construct scalable enterprise software, mobile apps, and robust API frameworks for global companies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. NEWS, EVENTS & ANNOUNCEMENTS (Highlights) */}
      <section className="section-padding" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: '#FEF3C7', 
              color: '#B45309', 
              padding: '6px 14px', 
              borderRadius: '6px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.75rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em', 
              marginBottom: '14px' 
            }}>
              HIGHLIGHTS
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', fontWeight: 800, color: '#081F3E', marginBottom: '14px' }}>
              News, events &amp; announcements
            </h2>
            <p className="sub-header" style={{ maxWidth: '680px', margin: '0 auto', color: '#475569', fontSize: '1.05rem', lineHeight: '1.6' }}>
              Stay up-to-date with current events at Liah Academy, workshop schedules, and student competitions in Buea.
            </p>
          </div>

          <div className="grid-3" style={{ alignItems: 'stretch' }}>
            {newsArticles.map((article) => (
              <div 
                key={article.id} 
                className="premium-card" 
                style={{ 
                  borderRadius: '16px', 
                  padding: '20px', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                  border: '1px solid rgba(15, 23, 42, 0.08)'
                }}
              >
                <div>
                  <div style={{ position: 'relative', height: '240px', borderRadius: '10px', overflow: 'hidden', marginBottom: '18px' }}>
                    <Image 
                      src={article.image} 
                      alt={article.title} 
                      fill 
                      style={{ objectFit: 'cover' }} 
                    />
                  </div>
                  <span style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 600, display: 'block', marginBottom: '8px' }}>
                    {article.date}
                  </span>
                  <h3 style={{ color: '#081F3E', fontSize: '1.15rem', fontWeight: 700, lineHeight: '1.4', marginBottom: '10px' }}>
                    {article.title}
                  </h3>
                  <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '20px' }}>
                    {article.excerpt}
                  </p>
                </div>

                <Link 
                  href={article.link} 
                  style={{ 
                    color: '#B45309', 
                    fontWeight: 700, 
                    fontSize: '0.9rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '4px',
                    textDecoration: 'none'
                  }}
                >
                  Read Full Story &rarr;
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. OUR NETWORK & PARTNERS */}
      <section style={{ background: '#041021', padding: '60px 0', borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <span style={{ 
              display: 'inline-block', 
              background: 'rgba(245, 166, 35, 0.15)', 
              color: '#F5A623', 
              padding: '4px 12px', 
              borderRadius: '4px', 
              fontFamily: 'var(--font-mono)', 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              textTransform: 'uppercase', 
              letterSpacing: '0.08em' 
            }}>
              OUR NETWORK &amp; PARTNERS
            </span>
          </div>

          <div className="grid-4" style={{ gap: '20px' }}>
            {partners.map((partner, pIdx) => (
              <div 
                key={pIdx} 
                style={{ 
                  background: 'rgba(8, 31, 62, 0.6)', 
                  border: '1px solid rgba(245, 166, 35, 0.25)', 
                  borderRadius: '10px', 
                  padding: '24px 20px', 
                  textAlign: 'center',
                  color: '#93C5FD',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-mono)'
                }}
              >
                {partner}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. DUAL REVIEWS: GOOGLE REVIEWS & STUDENT REVIEWS */}
      <section style={{ background: '#041021', padding: '0 0 90px 0' }}>
        <div className="container">
          <div className="grid-2" style={{ gap: '30px', alignItems: 'flex-start' }}>
            
            {/* LEFT CARD: Google Reviews */}
            <div style={{ 
              background: '#081F3E', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '16px', 
              padding: '32px 28px',
              color: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
                    <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"/>
                    <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"/>
                    <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
                  </svg>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Google Reviews</h3>
                </div>
                <div style={{ 
                  background: 'rgba(245, 166, 35, 0.15)', 
                  border: '1px solid rgba(245, 166, 35, 0.3)', 
                  color: '#F5A623', 
                  padding: '4px 10px', 
                  borderRadius: '6px', 
                  fontSize: '0.85rem', 
                  fontWeight: 700 
                }}>
                  4.9 ★ (125)
                </div>
              </div>

              {/* Verified Review 1 */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Steddy Lyonga</h4>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F5A623" color="#F5A623" />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                  &ldquo;Liah Academy is Buea&apos;s leading tech hub. Their combined curriculum and company projects gave me hands-on database experience...&rdquo;
                </p>
              </div>

              {/* Verified Review 2 */}
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>Mirabelle B.</h4>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F5A623" color="#F5A623" />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                  &ldquo;The cybersecurity labs at Liah are state-of-the-art. Instructors are developers themselves, so you learn real deployment workflows instead...&rdquo;
                </p>
              </div>

              <a 
                href="https://maps.app.goo.gl/eHgx8Triv6TKKcRf6" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px', 
                  width: '100%', 
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: '1px solid rgba(255, 255, 255, 0.15)', 
                  color: '#F8FAFC', 
                  textDecoration: 'none', 
                  fontSize: '0.9rem', 
                  fontWeight: 700 
                }}
              >
                <span>G</span> Verify on Google
              </a>
            </div>

            {/* RIGHT CARD: Student Reviews */}
            <div style={{ 
              background: '#081F3E', 
              border: '1px solid rgba(255, 255, 255, 0.08)', 
              borderRadius: '16px', 
              padding: '32px 28px',
              color: '#F8FAFC'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <MessageSquare size={22} color="#F5A623" />
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>Student Reviews</h3>
                </div>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  style={{ 
                    background: 'rgba(245, 166, 35, 0.2)', 
                    border: '1px solid rgba(245, 166, 35, 0.4)', 
                    color: '#F5A623', 
                    padding: '6px 12px', 
                    borderRadius: '6px', 
                    fontSize: '0.85rem', 
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={14} /> Write Review
                </button>
              </div>

              {/* Review Form Modal/Drawer */}
              {showReviewForm && (
                <div style={{ 
                  background: 'rgba(4, 16, 33, 0.95)', 
                  border: '1px solid rgba(245, 166, 35, 0.3)', 
                  borderRadius: '10px', 
                  padding: '20px', 
                  marginBottom: '20px' 
                }}>
                  <h4 style={{ color: '#F5A623', marginBottom: '12px', fontSize: '1rem' }}>Submit Student Feedback</h4>
                  {reviewSuccess && (
                    <div style={{ background: '#10B981', color: '#fff', padding: '8px 12px', borderRadius: '6px', marginBottom: '12px', fontSize: '0.85rem' }}>
                      Thank you! Your feedback is posted.
                    </div>
                  )}
                  <form onSubmit={handleReviewSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                      <div>
                        <label htmlFor="review_author_name" style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>Your Name *</label>
                        <input 
                          id="review_author_name"
                          name="review_author_name"
                          type="text" 
                          required 
                          placeholder="Your Name *" 
                          value={reviewName} 
                          onChange={e => setReviewName(e.target.value)} 
                          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }} 
                        />
                      </div>
                      <div>
                        <label htmlFor="review_student_role" style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>Program / Role *</label>
                        <input 
                          id="review_student_role"
                          name="review_student_role"
                          type="text" 
                          required 
                          placeholder="e.g. Student (HND) *" 
                          value={reviewRole} 
                          onChange={e => setReviewRole(e.target.value)} 
                          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }} 
                        />
                      </div>
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Rating:</span>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star 
                          key={star} 
                          size={18} 
                          fill={star <= reviewRating ? '#F5A623' : 'none'} 
                          color="#F5A623" 
                          style={{ cursor: 'pointer' }}
                          onClick={() => setReviewRating(star)} 
                        />
                      ))}
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                      <label htmlFor="review_feedback_message" style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', marginBottom: '4px' }}>Your Feedback *</label>
                      <textarea 
                        id="review_feedback_message"
                        name="review_feedback_message"
                        required 
                        rows={2} 
                        placeholder="Your feedback on Liah Academy..." 
                        value={reviewComment} 
                        onChange={e => setReviewComment(e.target.value)} 
                        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', padding: '8px 12px', borderRadius: '6px', fontSize: '0.85rem' }}
                      />
                    </div>
                    <button 
                      type="submit" 
                      disabled={reviewSubmitting}
                      style={{ background: '#F5A623', color: '#081F3E', border: 'none', padding: '8px 16px', borderRadius: '6px', fontWeight: 800, cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {reviewSubmitting ? 'Posting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}

              {/* Student Review 1: steadfast (student) */}
              <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '18px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>steadfast (student)</h4>
                  <div style={{ display: 'flex', gap: '2px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="#F5A623" color="#F5A623" />
                    ))}
                  </div>
                </div>
                <p style={{ color: '#CBD5E1', fontSize: '0.88rem', lineHeight: '1.6', margin: 0 }}>
                  &ldquo;i love the way liah trains students&rdquo;
                </p>
              </div>

              {/* Live Student Reviews Stream from API */}
              {reviews.filter(r => r.name !== 'steadfast (student)' && r.name !== 'Steddy Lyonga' && r.name !== 'Mirabelle B.').slice(0, 2).map((rev, rIdx) => (
                <div key={rIdx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0, color: '#FFFFFF' }}>{rev.name}</h4>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(rev.rating || 5)].map((_, i) => (
                        <Star key={i} size={12} fill="#F5A623" color="#F5A623" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: '#CBD5E1', fontSize: '0.85rem', lineHeight: '1.5', margin: 0 }}>
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}
