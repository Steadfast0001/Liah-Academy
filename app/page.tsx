'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Check, ArrowRight, Star, 
  Award, Shield, Users, Code, 
  Play, Pause, ChevronRight, ChevronLeft,
  X, CheckCircle, Sparkles, BookOpen, Layers, Monitor, Phone
} from 'lucide-react';

const heroSlides = [
  { type: 'video', src: '/assets/videos/1.mp4', position: 'center 20%' },
  { type: 'image', src: '/assets/images/campus_students_liah_shirts.jpg', position: 'center 10%' },
  { type: 'video', src: '/assets/videos/video.mp4', position: 'center 20%' },
  { type: 'image', src: '/assets/images/female_student_practical_guide.jpg', position: 'center 10%' },
  { type: 'video', src: '/assets/videos/E1.mp4', position: 'center 20%' },
  { type: 'image', src: '/assets/images/two_students_laptop_guide.jpg', position: 'center 10%' }
];

const alumniStories = [
  {
    id: 1,
    name: 'Elvis Tabi',
    credential: 'HND Software Engineering',
    role: 'Fullstack Engineer at FinTech',
    image: '/assets/images/male_student_laptop.jpg',
    videoSrc: '/assets/videos/1.mp4',
    story: 'Liah Academy provided the exact practical coding foundation I needed. Within 3 months of completing the Software Engineering track, I landed a remote developer role.'
  },
  {
    id: 2,
    name: 'Nathalie Ewane',
    credential: 'DevOps & Cloud Pipelines',
    role: 'DevOps Apprentice & Cloud Admin',
    image: '/assets/images/female_student_practical_guide.jpg',
    videoSrc: '/assets/videos/video.mp4',
    story: 'The fiber optic labs and 24/7 power backup meant zero downtime during our semester hackathons. Top-tier mentors who actually work on enterprise software.'
  },
  {
    id: 3,
    name: 'Roland Ashu',
    credential: 'HND Cybersecurity & Defense',
    role: 'Cybersecurity SOC Analyst',
    image: '/assets/images/two_students_laptop_guide.jpg',
    videoSrc: '/assets/videos/E1.mp4',
    story: 'The hands-on SOC labs in Bakweri Town transformed theoretical networking into real defense experience. Unmatched tech academy in Cameroon.'
  },
  {
    id: 4,
    name: 'Sarah Mbella',
    credential: 'Data Science & Machine Learning',
    role: 'Data Analyst at TechVentures',
    image: '/assets/images/campus_students_liah_shirts.jpg',
    videoSrc: '/assets/videos/E2.mp4',
    story: 'Working with live datasets and deploying production ML models gave me a strong portfolio that made interviews effortless.'
  },
  {
    id: 5,
    name: 'Nkenganyi Steadfast',
    credential: 'HND Software Engineering',
    role: 'Lead Architect & Tech Founder',
    image: '/assets/images/image_1.jpg',
    videoSrc: '/assets/videos/1.mp4',
    story: 'The curriculum is built for the global software industry. You write real code, collaborate on GitHub, and deploy live applications from day one.'
  }
];

const newsArticles = [
  {
    id: 1,
    image: '/assets/images/flyer_engineering.png',
    category: 'Engineering & Technology',
    date: 'August 19, 2026',
    title: 'Engineering & Technology Programs Catalog (HND & ND Programs)',
    excerpt: 'Full Academic Syllabus: School of Engineering and Technology. The School of Engineering and Technology at Liah Academy is admitting candidates across full-stack engineering and cloud defense.',
    link: '/degree-programs'
  },
  {
    id: 2,
    image: '/assets/images/flyer_engineering.png',
    category: 'Cyber Defense',
    date: 'August 19, 2026',
    title: 'Advanced Cybersecurity & Cloud Defense HND Cohort Launched',
    excerpt: 'Ministry-Accredited Technical Diploma: School of Engineering & Technology. Liah Academy has opened admissions for specialized tracks in Ethical Hacking, Cloud Defense, and Network Architecture.',
    link: '/degree-programs'
  },
  {
    id: 3,
    image: '/assets/images/flyer_certification.png',
    category: 'Professional Tracks',
    date: 'August 19, 2026',
    title: 'Liah Academy Certification Programs Admissions Now Open',
    excerpt: 'Admissions Announcement: Professional IT Certification Programs. Liah Academy is officially accepting applications for its high-impact IT Certification Programs in DevOps & Data Science.',
    link: '/degree-programs'
  }
];

const studentSuccessStories = [
  {
    id: 1,
    image: '/assets/images/female_student_practical_guide.jpg',
    category: 'Alumni Spotlight',
    title: 'From Bakweri Town Campus to High-Growth Tech: Jessica’s Software Engineering Journey',
    excerpt: 'Discover how hands-on terminal training and fullstack TypeScript projects enabled Jessica to land an industry development role before graduation.',
    link: '/student-experience'
  },
  {
    id: 2,
    image: '/assets/images/campus_students_liah_shirts.jpg',
    category: 'Campus Milestone',
    title: 'Liah Academy Celebrates 2026 Convocation & Industry Partner Placements',
    excerpt: 'Over 85% of our graduating cohort secured direct corporate apprenticeships across Cameroon and Silicon Mountain tech companies.',
    link: '/about#highlights'
  },
  {
    id: 3,
    image: '/assets/images/two_students_laptop_guide.jpg',
    category: 'Tech Innovation',
    title: 'Cybersecurity Students Build Open-Source Threat Analysis Tool for Local SMEs',
    excerpt: 'Our student defense lab engineered a lightweight network monitoring tool now utilized by over 20 partner companies in Buea.',
    link: '/student-experience'
  }
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeStory, setActiveStory] = useState<any | null>(null);
  const [storyVideoPlaying, setStoryVideoPlaying] = useState(true);

  // Auto rotate hero slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ background: '#FFFFFF', minHeight: '100vh' }}>
      
      {/* ===================================================
          1. HERO SECTION (Yorkville University Split Hero)
          =================================================== */}
      <section className="york-hero-section">
        <div className="york-hero-media-wrap">
          {heroSlides[currentSlide].type === 'video' ? (
            <video
              key={heroSlides[currentSlide].src}
              src={heroSlides[currentSlide].src}
              autoPlay
              loop
              muted
              playsInline
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: heroSlides[currentSlide].position
              }}
            />
          ) : (
            <Image
              key={heroSlides[currentSlide].src}
              src={heroSlides[currentSlide].src}
              alt="Liah Academy Students"
              fill
              style={{
                objectFit: 'cover',
                objectPosition: heroSlides[currentSlide].position
              }}
              priority
            />
          )}
        </div>

        <div className="york-hero-overlay" />

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div className="york-hero-content">
            <span className="york-hero-kicker">✦ ACHIEVE YOUR POSSIBLE</span>
            <h1 className="york-hero-title">
              Flexible, Career-focused Programs Designed to Help You Move Forward
            </h1>
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
              <Link href="#programs" className="york-hero-btn">
                Explore Programs <ArrowRight size={18} />
              </Link>
              <Link 
                href="/portal?tab=enrol"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1.5px solid rgba(255, 255, 255, 0.4)',
                  color: '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  padding: '14px 26px',
                  borderRadius: '6px',
                  backdropFilter: 'blur(8px)',
                  transition: 'all 0.25s ease'
                }}
              >
                Apply Now
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="york-hero-dots">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              className={`york-dot ${currentSlide === idx ? 'active' : ''}`}
              onClick={() => setCurrentSlide(idx)}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ===================================================
          2. IMPACT STATISTICS BAR (Immediately Under Hero)
          =================================================== */}
      <section className="stats-impact-bar">
        <div className="container">
          <div className="stats-impact-grid">
            <div className="stats-impact-item">
              <div className="stats-impact-num">2024</div>
              <div className="stats-impact-label">
                Year Established
              </div>
            </div>
            <div className="stats-impact-item">
              <div className="stats-impact-num">500+</div>
              <div className="stats-impact-label">
                Trained Graduates
              </div>
            </div>
            <div className="stats-impact-item">
              <div className="stats-impact-num">95%</div>
              <div className="stats-impact-label">
                Career Landing Rate
              </div>
            </div>
            <div className="stats-impact-item">
              <div className="stats-impact-num">100%</div>
              <div className="stats-impact-label">
                Practical &amp; Labs-Based
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          2B. STRATEGIC INDUSTRY & PLACEMENT PARTNERS
          =================================================== */}
      <section style={{ background: '#FFFFFF', padding: '28px 0', borderBottom: '1px solid #E2E8F0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <span style={{ 
              fontSize: '0.72rem', 
              fontWeight: 800, 
              color: '#64748B', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <Sparkles size={13} color="#F5A623" /> Official Industry, Placement &amp; Innovation Partners
            </span>
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: '24px 36px' 
          }}>
            {/* New Generation Technologies */}
            <Link 
              href="/about#partnerships" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                textDecoration: 'none',
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                padding: '8px 16px',
                borderRadius: '10px',
                transition: 'all 0.2s ease'
              }}
            >
              <Image 
                src="/assets/images/new_generation_technologies.png" 
                alt="New Generation Technologies Logo" 
                width={120} 
                height={38} 
                style={{ objectFit: 'contain', width: 'auto', height: 'auto', maxHeight: '34px' }}
              />
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#081F3E', borderLeft: '1px solid #CBD5E1', paddingLeft: '10px' }}>
                Technology Partner
              </span>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 800, fontSize: '0.84rem', letterSpacing: '0.04em' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#F5A623', display: 'inline-block' }} />
              SILICON MOUNTAIN
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 800, fontSize: '0.84rem', letterSpacing: '0.04em' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
              MINESEC CERTIFIED
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 800, fontSize: '0.84rem', letterSpacing: '0.04em' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0284C7', display: 'inline-block' }} />
              LINUX LABS
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          3. MISSION / VALUE PROPOSITION ("Achieve Your Possible")
          =================================================== */}
      <section className="york-mission-section">
        <div className="container">
          <h2 className="york-mission-title">Achieve Your Possible</h2>
          <p className="york-mission-text">
            Your ambition lives outside the boundaries of traditional education. You are building your life and career, often together. Discover flexible, industry-rooted programs that match your pace, fit your life, and help shape what comes next.
          </p>
          <Link href="/contact#inquiry" className="york-mission-btn">
            Direct Inquiries <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===================================================
          4. PROGRAM DIRECTORY COLUMNS (3 Academic Divisions)
          =================================================== */}
      <section id="programs" className="york-programs-directory" style={{ scrollMarginTop: '110px' }}>
        <div className="container">
          <div className="york-programs-grid">
            {/* Division 1: HND Programs */}
            <div>
              <h3 className="york-program-col-title">
                <Link href="/programs/hnd" style={{ color: '#003366', textDecoration: 'none' }}>
                  HND Programs
                </Link>
                <BookOpen size={20} color="#0284C7" />
              </h3>
              <div className="york-program-links-list">
                <Link href="/programs/hnd/software-engineering" className="york-program-link-item">
                  <span>Software Engineering (HND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/hnd/web-graphic-design" className="york-program-link-item">
                  <span>Web &amp; Graphic Design (HND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/hnd/digital-marketing" className="york-program-link-item">
                  <span>Digital Marketing &amp; E-Commerce (HND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/hnd/network-maintenance" className="york-program-link-item">
                  <span>Network &amp; Maintenance (HND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/hnd" style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  Explore All HND Programs &rarr;
                </Link>
              </div>
            </div>

            {/* Division 2: Certification Programs */}
            <div>
              <h3 className="york-program-col-title">
                <Link href="/programs/certifications" style={{ color: '#003366', textDecoration: 'none' }}>
                  Certification Programs
                </Link>
                <Layers size={20} color="#0284C7" />
              </h3>
              <div className="york-program-links-list">
                <Link href="/programs/certifications/data-science" className="york-program-link-item">
                  <span>Data Science &amp; Machine Learning</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/certifications/devops" className="york-program-link-item">
                  <span>DevOps &amp; Cloud Infrastructure</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/certifications/industrial-web-design" className="york-program-link-item">
                  <span>Industrial Web Design</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/certifications/digital-marketing-seo" className="york-program-link-item">
                  <span>Digital Marketing &amp; SEO</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/certifications" style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  Explore All Certifications &rarr;
                </Link>
              </div>
            </div>

            {/* Division 3: ND Programs */}
            <div>
              <h3 className="york-program-col-title">
                <Link href="/programs/nd" style={{ color: '#003366', textDecoration: 'none' }}>
                  ND Programs
                </Link>
                <Award size={20} color="#0284C7" />
              </h3>
              <div className="york-program-links-list">
                <Link href="/programs/nd/computer-engineering" className="york-program-link-item">
                  <span>Computer Engineering (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/ict" className="york-program-link-item">
                  <span>ICT &amp; Support (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/web-design" className="york-program-link-item">
                  <span>Web Design (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/graphic-design-printing" className="york-program-link-item">
                  <span>Graphic Design &amp; Printing (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/basic-computer" className="york-program-link-item">
                  <span>Basic Computer Operations (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/office-automation" className="york-program-link-item">
                  <span>Office Automation Secretaryship (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd/computerized-accounting" className="york-program-link-item">
                  <span>Computerized Accounting (ND)</span>
                  <ChevronRight size={18} color="#0284C7" />
                </Link>
                <Link href="/programs/nd" style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                  Explore All ND Programs &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          5. LAUREL ACCREDITATION & HONORS RIBBON
          =================================================== */}
      <section className="laurel-ribbon-section">
        <div className="container">
          <div className="laurel-ribbon-grid">
            <div className="laurel-badge-item">
              <Award className="laurel-badge-icon" size={28} />
              <span className="laurel-badge-text">MINESUP ACCREDITED TECHNICAL DIPLOMAS</span>
            </div>
            <div className="laurel-badge-item">
              <Code className="laurel-badge-icon" size={28} />
              <span className="laurel-badge-text">SILICON MOUNTAIN TECH ECOSYSTEM</span>
            </div>
            <div className="laurel-badge-item">
              <Shield className="laurel-badge-icon" size={28} />
              <span className="laurel-badge-text">24/7 DEDICATED FIBER OPTIC LABS</span>
            </div>
            <div className="laurel-badge-item">
              <Users className="laurel-badge-icon" size={28} />
              <span className="laurel-badge-text">CERTIFIED INDUSTRY PRACTITIONERS</span>
            </div>
            <div className="laurel-badge-item">
              <Sparkles className="laurel-badge-icon" size={28} />
              <span className="laurel-badge-text">HIGH GRADUATE EMPLOYABILITY &amp; REMOTE WORK</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          6. "OUR ALUMNI SAY IT BEST" (Testimonials Slider)
          =================================================== */}
      <section className="alumni-showcase-section">
        <div className="container">
          <div className="alumni-header">
            <h2 className="alumni-title">Our Alumni Say It Best</h2>
          </div>

          <div className="alumni-cards-slider-wrap">
            <div className="alumni-cards-track">
              {alumniStories.map((alumnus) => (
                <div
                  key={alumnus.id}
                  className="alumni-portrait-card"
                  onClick={() => {
                    setActiveStory(alumnus);
                    setStoryVideoPlaying(true);
                  }}
                >
                  <div className="alumni-photo-box">
                    <Image
                      src={alumnus.image}
                      alt={alumnus.name}
                      fill
                      style={{ objectFit: 'cover' }}
                    />
                    <div className="alumni-play-btn" aria-label={`Play testimonial from ${alumnus.name}`}>
                      <Play size={18} fill="#FFFFFF" />
                    </div>
                  </div>
                  <div className="alumni-card-info">
                    <div>
                      <h4 className="alumni-name">{alumnus.name}</h4>
                      <p className="alumni-credential">{alumnus.credential}</p>
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#0284C7', fontWeight: 600, marginTop: '8px', display: 'inline-block' }}>
                      Watch Story →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          7. "YOUR PATH. YOUR PACE. YOUR ADVANTAGE." (3 Feature Boxes)
          =================================================== */}
      <section className="york-features-section">
        <div className="container">
          <div className="york-features-header">
            <h2 className="york-features-title">Your Path. Your Pace. Your Advantage.</h2>
          </div>

          <div className="york-features-grid">
            <div className="york-feature-box">
              <div className="york-feature-icon-badge">
                <CheckCircle size={22} />
              </div>
              <h3 className="york-feature-heading">Learning That Fits Your Life</h3>
              <p className="york-feature-desc">
                Start when you&apos;re ready with year-round cohort intakes, on-campus study at Bakweri Town Campus, and project-based hands-on mentoring.
              </p>
            </div>

            <div className="york-feature-box">
              <div className="york-feature-icon-badge">
                <Monitor size={22} />
              </div>
              <h3 className="york-feature-heading">Make Your Experience Count</h3>
              <p className="york-feature-desc">
                Graduate sooner and move forward faster with project-based labs, real client software builds, and hands-on terminal defense training.
              </p>
            </div>

            <div className="york-feature-box">
              <div className="york-feature-icon-badge">
                <Code size={22} />
              </div>
              <h3 className="york-feature-heading">Get Career-Ready from Day One</h3>
              <p className="york-feature-desc">
                Build in-demand skills through industry-designed programs taught by active tech architects, software leads, and cyber professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================================================
          8. FULL-WIDTH CALLOUT BANNER
          =================================================== */}
      <section className="york-full-cta-banner">
        <div className="container">
          <h2 className="york-full-cta-title">
            Get Support That Helps You Move Towards What&apos;s Possible
          </h2>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link 
              href="/portal?tab=enrol"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: '#F5A623',
                color: '#041021',
                padding: '12px 28px',
                borderRadius: '6px',
                fontWeight: 800,
                fontSize: '0.88rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              Apply Now →
            </Link>
          </div>
        </div>
      </section>

      {/* ===================================================
          9. LATEST NEWS SECTION
          =================================================== */}
      <section className="york-news-section">
        <div className="container">
          <div className="york-news-header">
            <h2 className="york-news-title">Latest News</h2>
            <Link href="/about#highlights" className="york-view-more-btn">
              View More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="york-news-grid">
            {newsArticles.map((article) => (
              <div key={article.id} className="york-news-card">
                <div className="york-news-img-box">
                  <Image
                    src={article.image}
                    alt={article.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="york-news-body">
                  <span className="york-news-category">{article.category}</span>
                  <h3 className="york-news-card-title">{article.title}</h3>
                  <p className="york-news-card-excerpt">{article.excerpt}</p>
                  <Link href={article.link} style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Full Announcement →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          10. STUDENT SUCCESS STORIES SECTION
          =================================================== */}
      <section className="york-news-section" style={{ background: '#F8FAFC', borderTop: '1px solid #E2E8F0' }}>
        <div className="container">
          <div className="york-news-header">
            <h2 className="york-news-title">Student Success</h2>
            <Link href="/student-experience" className="york-view-more-btn">
              View More <ArrowRight size={14} />
            </Link>
          </div>

          <div className="york-news-grid">
            {studentSuccessStories.map((story) => (
              <div key={story.id} className="york-news-card">
                <div className="york-news-img-box">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    style={{ objectFit: 'cover' }}
                  />
                </div>
                <div className="york-news-body">
                  <span className="york-news-category">{story.category}</span>
                  <h3 className="york-news-card-title">{story.title}</h3>
                  <p className="york-news-card-excerpt">{story.excerpt}</p>
                  <Link href={story.link} style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Read Graduate Story →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================================================
          ALUMNI STORY MODAL POPUP
          =================================================== */}
      {activeStory && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(4, 16, 33, 0.85)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setActiveStory(null)}
        >
          <div 
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Media */}
            <div style={{ position: 'relative', height: '300px', background: '#041021' }}>
              <video
                src={activeStory.videoSrc}
                autoPlay
                controls
                playsInline
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => setActiveStory(null)}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  zIndex: 10
                }}
                aria-label="Close Story"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#003366', margin: 0 }}>
                    {activeStory.name}
                  </h3>
                  <p style={{ color: '#0284C7', fontWeight: 700, fontSize: '0.9rem', margin: '4px 0 0' }}>
                    {activeStory.credential}
                  </p>
                </div>
                <span style={{ fontSize: '0.8rem', background: '#ECFDF5', color: '#059669', padding: '4px 10px', borderRadius: '20px', fontWeight: 700 }}>
                  Verified Alumni
                </span>
              </div>
              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: '1.65', marginBottom: '20px', fontStyle: 'italic' }}>
                &ldquo;{activeStory.story}&rdquo;
              </p>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <Link
                  href="/portal?tab=enrol"
                  onClick={() => setActiveStory(null)}
                  style={{
                    background: '#0284C7',
                    color: '#FFFFFF',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    fontWeight: 700,
                    fontSize: '0.88rem'
                  }}
                >
                  Start Your Journey
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
