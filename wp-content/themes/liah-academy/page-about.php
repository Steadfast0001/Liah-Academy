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
                <?php
                $news_query = new WP_Query( array(
                    'post_type'      => 'liah_news',
                    'posts_per_page' => 3
                ) );

                if ( $news_query->have_posts() ) :
                    while ( $news_query->have_posts() ) : $news_query->the_post();
                        $post_id = get_the_ID();
                        $meta    = get_post_meta( $post_id, 'liah_news_meta', true );
                        $badge   = get_post_meta( $post_id, 'liah_news_badge', true );
                        $color   = get_post_meta( $post_id, 'liah_news_color', true );
                        $image   = get_post_meta( $post_id, 'liah_news_image', true );
                        $color   = $color ? $color : '#081F3E';
                        $badge   = $badge ? $badge : 'Notice';
                        $image   = $image ? $image : 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80';
                ?>
                <a href="<?php the_permalink(); ?>" class="premium-card highlight-post-card" style="text-decoration: none; color: inherit; display: flex; flex-direction: column; box-shadow: none; border: 1px solid rgba(15,23,42,0.08); padding: 0; overflow: hidden; height: 100%;">
                    <div class="highlight-thumb" style="background-image: url('<?php echo esc_url( $image ); ?>'); height: 200px; background-size: cover; background-position: center; position: relative;">
                        <span class="course-badge highlight-badge" style="background: <?php echo esc_attr( $color ); ?>; color: #ffffff; position: absolute; top: 15px; left: 15px;"><?php echo esc_html( $badge ); ?></span>
                    </div>
                    <div class="highlight-body" style="padding: 24px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; background: #fff;">
                        <div>
                            <span class="highlight-meta" style="font-size: 12px; color: #64748B; display: block; margin-bottom: 8px;"><?php echo esc_html( $meta ); ?></span>
                            <h3 style="color: #081F3E; font-size: 18px; margin-bottom: 12px; font-weight: 700; transition: color 0.2s ease;"><?php the_title(); ?></h3>
                            <p class="body-normal" style="color: #64748B; margin-top: 8px; font-size: 14px; line-height: 1.6;"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
                        </div>
                        <span style="color: var(--color-primary-accent); font-weight: 700; font-size: 13px; display: inline-flex; align-items: center; gap: 6px; margin-top: 15px;">Read Full Story <i class="fa-solid fa-arrow-right"></i></span>
                    </div>
                </a>
                <?php
                    endwhile;
                    wp_reset_postdata();
                else :
                ?>
                <div style="grid-column: span 3; text-align:center; padding: 40px; color:#64748B;">
                    <p>No highlights or updates published yet.</p>
                </div>
                <?php endif; ?>
            </div>
        </div>
    </section>
</main>

<?php
get_footer();
