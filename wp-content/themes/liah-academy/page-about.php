<?php
/**
 * Template Name: About Page Template
 *
 * Renders the About page divided into Top Admin, Business & Partnership, and Highlights.
 */

get_header();
?>

<!-- Secondary Sticky Navigation for sections -->
<div class="about-nav-anchor">
    <div class="container" style="display:flex; justify-content:center;">
        <a href="#top-admin" class="about-nav-link active">Top Admin</a>
        <a href="#partnerships" class="about-nav-link">Business & Partnerships</a>
        <a href="#highlights" class="about-nav-link">News & Highlights</a>
    </div>
</div>

<main style="margin-top: 40px;">
    <!-- 1. TOP ADMIN SECTION -->
    <section id="top-admin" class="about-section-container bg-light-section">
        <div class="container">
            <div class="section-header">
                <span class="course-badge">Leadership</span>
                <h2>Top administration</h2>
                <p class="sub-header">Meet the executive team guiding Liah Academy's academic vision and cooperative initiatives.</p>
            </div>

            <!-- Admin Content Split -->
            <div class="grid-2" style="margin-bottom: 60px;">
                <div>
                    <h3 style="margin-bottom: 20px; color:#081F3E;"><i class="fa-solid fa-building-columns" style="color:#F5A623; margin-right:10px;"></i> University Executive Board</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 16px;">The Executive Board oversees academic compliance, operational development, and admissions regulations at Liah Academy. Composed of senior academicians and technology specialists, the board ensures the academy adheres to national standards while deploying state-of-the-art tech programs.</p>
                    <p class="body-normal" style="color:#64748B;">Our mission is to establish Buea as a global hub of modern technical expertise, starting from our base in Bakweri Town.</p>
                </div>
                <div>
                    <h3 style="margin-bottom: 20px; color:#081F3E;"><i class="fa-solid fa-lightbulb" style="color:#F5A623; margin-right:10px;"></i> Office of Cooperation & Innovation</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 16px;">This office bridges academic research and industrial software applications. It manages relationships with tech companies, creates research labs, and promotes entrepreneurship among students.</p>
                    <p class="body-normal" style="color:#64748B;">It facilitates student incubator tracks, giving learners access to real-world corporate development cycles at Liah's software company branch.</p>
                </div>
            </div>

            <!-- Executive Profiles -->
            <div class="grid-3 admin-grid">
                <div class="premium-card member-card">
                    <div class="member-avatar">DO</div>
                    <h4>Dr. Daniel Ndip Okey</h4>
                    <p class="small-badge" style="color:#F5A623; margin-top:4px;">Rector / Board Chair</p>
                    <p style="font-size:14px; color:#64748B; margin-top:12px;">Doctor of Software Engineering with 15+ years in international academic governance.</p>
                </div>

                <div class="premium-card member-card">
                    <div class="member-avatar">BE</div>
                    <h4>Brenda E. Lyonga</h4>
                    <p class="small-badge" style="color:#F5A623; margin-top:4px;">Director of Innovation</p>
                    <p style="font-size:14px; color:#64748B; margin-top:12px;">Former DevOps advisor, managing technology incubators and corporate networks.</p>
                </div>

                <div class="premium-card member-card">
                    <div class="member-avatar">TA</div>
                    <h4>Teke A. Mbah</h4>
                    <p class="small-badge" style="color:#F5A623; margin-top:4px;">Dean of Academics</p>
                    <p style="font-size:14px; color:#64748B; margin-top:12px;">Supervises curriculum alignment across Web engineering, Data Science, and HNDs.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- 2. BUSINESS & PARTNERSHIP SECTION -->
    <section id="partnerships" class="about-section-container bg-dark-section" style="border-top:1px solid rgba(245, 166, 35, 0.15); border-bottom:1px solid rgba(245, 166, 35, 0.15);">
        <div class="container">
            <div class="section-header">
                <span class="course-badge" style="background:rgba(245, 166, 35, 0.15); color:#F5A623;">Collaboration</span>
                <h2>Business & partnerships</h2>
                <p class="sub-header" style="color:#64748B;">Connecting academic training directly to industry demands, local business incubators, and global certifications.</p>
            </div>

            <div class="grid-2" style="align-items: center; margin-bottom: 60px;">
                <div>
                    <h3 style="color:#F8FAFC; margin-bottom: 16px;"><i class="fa-solid fa-award" style="color:#F5A623; margin-right:10px;"></i> Recognition & Awards</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 16px;">Liah Academy is recognized nationally for its practical methodology. We have won multiple awards including:</p>
                    <ul style="color:#64748B; list-style:none; line-height:2; font-size:15px;">
                        <li><i class="fa-solid fa-circle-check" style="color:#F5A623; margin-right:8px;"></i> Cameroon Silicon Mountain Innovation Award (2025)</li>
                        <li><i class="fa-solid fa-circle-check" style="color:#F5A623; margin-right:8px;"></i> Best Academic Incubator in Southwest Region (2025)</li>
                        <li><i class="fa-solid fa-circle-check" style="color:#F5A623; margin-right:8px;"></i> Certified Partner for Linux Academy Frameworks</li>
                    </ul>
                </div>
                <div class="premium-card" style="background:rgba(8, 31, 62, 0.4); border-color:rgba(245, 166, 35, 0.1); color:#F8FAFC; padding:40px;">
                    <h3 style="color:#F8FAFC; margin-bottom: 16px;"><i class="fa-solid fa-handshake" style="color:#F5A623; margin-right:10px;"></i> Partnerships</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 16px;">We partner with local tech institutions and global cloud providers to offer professional pathways, certification voucher codes, and internship placements.</p>
                    <p class="body-normal" style="color:#64748B;">Our corporate division recruits directly from top-performing graduates, guaranteeing immediate careers in software projects.</p>
                </div>
            </div>

            <!-- Partner Logos grid -->
            <div class="grid-4 partners-grid">
                <div class="partner-logo-container">
                    <span style="font-family:var(--font-heading); font-weight:800; color:#64748B;">SILICON MOUNTAIN</span>
                </div>
                <div class="partner-logo-container">
                    <span style="font-family:var(--font-heading); font-weight:800; color:#64748B;">MINESEC CERTIFIED</span>
                </div>
                <div class="partner-logo-container">
                    <span style="font-family:var(--font-heading); font-weight:800; color:#64748B;">LINUX LABS</span>
                </div>
                <div class="partner-logo-container">
                    <span style="font-family:var(--font-heading); font-weight:800; color:#64748B;">AWS ACADEMY</span>
                </div>
            </div>
        </div>
    </section>

    <!-- 3. HIGHLIGHTS SECTION -->
    <section id="highlights" class="about-section-container bg-light-section">
        <div class="container">
            <div class="section-header">
                <span class="course-badge">Highlights</span>
                <h2>News, events & announcements</h2>
                <p class="sub-header">Stay up-to-date with current events at Liah Academy, workshop schedules, and student competitions in Buea.</p>
            </div>

            <div class="grid-3 highlights-grid">
                <!-- News Card -->
                <div class="premium-card highlight-post-card" style="box-shadow:none; border:1px solid rgba(15,23,42,0.08);">
                    <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80');">
                        <span class="course-badge highlight-badge">News</span>
                    </div>
                    <div class="highlight-body">
                        <span class="highlight-meta">August 14, 2026</span>
                        <h3>Liah Software division Launches API suite</h3>
                        <p class="body-normal" style="color:#64748B; margin-top:8px;">Our company division has officially deployed its new SaaS accounting API for businesses in Douala and Buea, built entirely on Python and PostgreSQL.</p>
                    </div>
                </div>

                <!-- Event Card -->
                <div class="premium-card highlight-post-card" style="box-shadow:none; border:1px solid rgba(15,23,42,0.08);">
                    <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80');">
                        <span class="course-badge highlight-badge" style="background:#E28704; color:#ffffff;">Event</span>
                    </div>
                    <div class="highlight-body">
                        <span class="highlight-meta">September 10, 2026</span>
                        <h3>Front-End Engineering Bootcamp</h3>
                        <p class="body-normal" style="color:#64748B; margin-top:8px;">A 3-day practical bootcamp in HTML5, CSS3, and React.js. Free registration for registered candidates and alumni.</p>
                    </div>
                </div>

                <!-- Announcement Card -->
                <div class="premium-card highlight-post-card" style="box-shadow:none; border:1px solid rgba(15,23,42,0.08);">
                    <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80');">
                        <span class="course-badge highlight-badge" style="background:#081F3E; color:#F5A623;">Announcement</span>
                    </div>
                    <div class="highlight-body">
                        <span class="highlight-meta">August 28, 2026</span>
                        <h3>Admissions Deadline Extension</h3>
                        <p class="body-normal" style="color:#64748B; margin-top:8px;">Due to local requests, the early-bird registration and document upload window for Fall semester is extended to late September.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
