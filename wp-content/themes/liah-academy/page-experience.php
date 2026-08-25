<?php
/**
 * Template Name: Student Experience Page Template
 *
 * Renders the Student Experience page detailing services (wifi & security),
 * interaction (workshops, bootcamps), and exchange/internships programs.
 */

get_header();
?>

<main style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        
        <!-- HEADER -->
        <div class="section-header">
            <span class="course-badge">Student Life</span>
            <h1 style="color:#081F3E; font-size: 32px; font-weight: 800; margin-top: 10px;">The student experience</h1>
            <p class="sub-header" style="color:#475569;">At Liah Academy, education extends beyond lectures. Discover our campus facilities, coding interactions, and internship bridges.</p>
        </div>

        <!-- 1. CAMPUS SERVICES (Security, Internet/Wifi) -->
        <section class="grid-2" style="margin-bottom: 80px;">
            <div class="premium-card wifi-card" style="padding: 48px;">
                <span class="course-badge" style="background:#F5A623; color:#081F3E;">Facilities</span>
                <h3 style="color:#F8FAFC; margin-bottom: 20px;"><i class="fa-solid fa-wifi" style="color:#F5A623; margin-right:10px;" aria-hidden="true"></i> High-speed internet / Wifi</h3>
                <p class="body-large" style="color:#CBD5E1; margin-bottom: 20px;">Liah Academy hosts a fiber-optic backbone connection on campus. High-speed, low-latency Wi-Fi covers all study labs, libraries, and common student hubs.</p>
                <p class="body-normal" style="color:#CBD5E1;">This ensures students can download large datasets, connect to cloud consoles (AWS, Google Cloud), and contribute to Git networks without interruptions.</p>
            </div>

            <div class="premium-card" style="padding: 48px;">
                <span class="course-badge">Protection</span>
                <h3 style="color:#081F3E; margin-bottom: 20px;"><i class="fa-solid fa-shield-halved" style="color:#F5A623; margin-right:10px;" aria-hidden="true"></i> 24/7 Campus Security</h3>
                <p class="body-large" style="color:#475569; margin-bottom: 20px;">The security of our students is paramount. The campus is secured with CCTV systems, dedicated security staff, and strictly managed keycard access entries for students and personnel.</p>
                <p class="body-normal" style="color:#475569;">Whether collaborating on projects late in our innovation hubs or attending weekend bootcamps, students study in a protected environment.</p>
            </div>
        </section>

        <!-- 2. STUDENT INTERACTION (Workshops, Competitions, Bootcamps) -->
        <section style="margin-bottom: 80px; background:#FFFFFF; border:1px solid rgba(15,23,42,0.08); border-radius:var(--border-radius-lg); padding:60px 40px;">
            <h3 style="color:#081F3E; text-align:center; margin-bottom: 12px;">Student interaction & events</h3>
            <p style="color:#475569; text-align:center; max-width:600px; margin: 0 auto 50px auto;">Collaboration sparks creativity. We organize structured hackathons, coding workshops, and specialized tech competitions in Buea.</p>

            <div class="grid-3">
                <div>
                    <h4 style="color:#081F3E; margin-bottom:12px;"><i class="fa-solid fa-laptop-code" style="color:#F5A623; margin-right:10px;" aria-hidden="true"></i> Technical Workshops</h4>
                    <p style="font-size:15px; color:#475569; line-height:1.6;">Weekly interactive meetups focusing on specific tools (Docker pipelines, Django setups, MySQL indexing, Git collaboration workflows).</p>
                </div>
                
                <div>
                    <h4 style="color:#081F3E; margin-bottom:12px;"><i class="fa-solid fa-trophy" style="color:#F5A623; margin-right:10px;" aria-hidden="true"></i> Coding Competitions</h4>
                    <p style="font-size:15px; color:#475569; line-height:1.6;">Semester hackathons with monetary prizes, where students form teams to build prototype products judged by representatives from tech firms.</p>
                </div>
                
                <div>
                    <h4 style="color:#081F3E; margin-bottom:12px;"><i class="fa-solid fa-fire" style="color:#F5A623; margin-right:10px;" aria-hidden="true"></i> Intensive Bootcamps</h4>
                    <p style="font-size:15px; color:#475569; line-height:1.6;">Immersive, hands-on coding tracks during vacations covering new frameworks, cloud APIs, or mobile app structures.</p>
                </div>
            </div>
        </section>

        <!-- 3. EXCHANGE & INTERNSHIP PROGRAM -->
        <section class="grid-2" style="align-items: center;">
            <div>
                <span class="course-badge">Career Bridge</span>
                <h2>Exchange & corporate internships</h2>
                <p class="body-large" style="color:#475569; margin-bottom: 20px;">Liah Academy operates a direct exchange track with our custom software development company. High-performing students join real corporate projects as paid interns, working alongside professional developers.</p>
                <p class="body-normal" style="color:#475569; margin-bottom: 24px;">This provides hands-on familiarity with client specifications, Agile management methods, and strict version control practices, making graduates immediately employable.</p>
                <a href="<?php echo esc_url( home_url( '/admissions' ) ); ?>" class="btn btn-primary">Join the next cohort</a>
            </div>
            
            <div style="position:relative; border-radius:var(--border-radius-md); overflow:hidden; border:1px solid rgba(15,23,42,0.1);">
                <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" alt="Students collaborating at Liah Academy">
                <div style="position:absolute; bottom:0; left:0; width:100%; padding:20px; background:linear-gradient(to top, rgba(8,31,62,0.9), transparent); color:#ffffff;">
                    <span style="font-size:13px; font-weight:700;"><i class="fa-solid fa-quote-left" style="color:#F5A623; margin-right:6px;" aria-hidden="true"></i> Liah workspace innovation lab</span>
                </div>
            </div>
        </section>
    </div>
</main>

<?php
get_footer();
