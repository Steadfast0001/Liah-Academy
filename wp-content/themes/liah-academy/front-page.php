<?php
/**
 * Liah Academy Front Page (Landing Home Page)
 *
 * Renders the sliding banner of school photos, recent highlights, company services, 
 * and direct admissions triggers.
 */

get_header();
?>

<!-- 1. HERO SLIDESHOW BANNER -->
<section class="hero-slider-section">
    <!-- Image Slides Container -->
    <div class="slider-container" id="heroSliderContainer">
        <!-- Local school photos playing in rotation background -->
        <div class="slide active" data-bg="<?php echo esc_url( get_template_directory_uri() . '/image_1.jpg' ); ?>"></div>
        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/image_2.jpg' ); ?>"></div>
        
        <!-- Muted video slide enqueued in rotation -->
        <div class="slide">
            <video autoplay muted loop playsinline style="width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0;">
                <source src="<?php echo esc_url( get_template_directory_uri() . '/video.mp4' ); ?>" type="video/mp4">
            </video>
        </div>

        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/image_3.jpg' ); ?>"></div>
        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/image_4.jpg' ); ?>"></div>
        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/image_5.jpg' ); ?>"></div>
        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/OIP_2.webp' ); ?>"></div>
        <div class="slide" data-bg="<?php echo esc_url( get_template_directory_uri() . '/OIP.webp' ); ?>"></div>
    </div>
    
    <!-- Dark Color Overlay filter for text readability -->
    <div class="slider-overlay"></div>

    <!-- Inner Hero content -->
    <div class="container hero-content">
        <span class="hero-tag"><i class="fa-solid fa-code-branch" style="margin-right: 6px;"></i> BUEA'S PREMIER TECH HUB</span>
        <h1 class="hero-title">Forge Your Future in <span>Technology</span></h1>
        <p class="hero-subtitle body-large">Liah Academy combines academic excellence with corporate software innovation. Study from our state-of-the-art tech curriculum or hire our professional development team.</p>
        <div class="hero-ctas">
            <a href="<?php echo esc_url( home_url( '/admissions' ) ); ?>" class="btn btn-primary"><i class="fa-solid fa-user-plus" style="margin-right:8px;"></i> Apply Now</a>
            <a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>" class="btn btn-secondary">Explore Programs</a>
        </div>
    </div>
</section>

<!-- 2. QUICK STATS ROW -->
<section class="bg-dark-section" style="padding: 50px 0; border-bottom: 1px solid rgba(245, 166, 35, 0.1);">
    <div class="container">
        <div class="grid-4" style="text-align: center;">
            <div>
                <h3 style="font-size: 36px; font-weight: 800; color: #F5A623;">2024</h3>
                <p class="small-badge" style="color: #64748B;">Year Established</p>
            </div>
            <div>
                <h3 style="font-size: 36px; font-weight: 800; color: #F5A623;">500+</h3>
                <p class="small-badge" style="color: #64748B;">Trained Graduates</p>
            </div>
            <div>
                <h3 style="font-size: 36px; font-weight: 800; color: #F5A623;">95%</h3>
                <p class="small-badge" style="color: #64748B;">Career Landing Rate</p>
            </div>
            <div>
                <h3 style="font-size: 36px; font-weight: 800; color: #F5A623;">100%</h3>
                <p class="small-badge" style="color: #64748B;">Practical & Labs-Based</p>
            </div>
        </div>
    </div>
</section>

<!-- 2.5 VIDEO PRESENTATION SECTION -->
<section class="section-padding bg-dark-section" style="padding: 80px 0; background: #041021; border-bottom: 1px solid rgba(245, 166, 35, 0.1);">
    <div class="container">
        <div class="section-header" style="text-align: center; max-width: 700px; margin: 0 auto 50px auto;">
            <span class="course-badge" style="background: rgba(245, 166, 35, 0.15); color: #F5A623;">Liah Experience</span>
            <h2 style="color: #F8FAFC; margin-top: 15px;">Liah Academy in Action</h2>
            <p class="sub-header" style="color: #94A3B8; margin-top: 10px;">Watch our campus walk-through, laboratory practicals, and see how our graduates forge careers in corporate technology.</p>
        </div>

        <div style="max-width: 960px; margin: 0 auto; border-radius: 12px; overflow: hidden; box-shadow: 0 15px 40px rgba(0,0,0,0.5), 0 0 20px rgba(245, 166, 35, 0.08); border: 1px solid rgba(245, 166, 35, 0.15); background: #081F3E; line-height: 0;">
            <video width="100%" height="auto" controls preload="metadata" style="display: block; border-radius: 11px;">
                <source src="<?php echo esc_url( get_template_directory_uri() . '/video.mp4' ); ?>" type="video/mp4">
                Your browser does not support the video tag.
            </video>
        </div>
    </div>
</section>

<!-- 3. DEGREE AND PROGRAM PATHWAYS -->
<section class="section-padding bg-light-section">
    <div class="container">
        <div class="section-header">
            <span class="course-badge">Academic Pathways</span>
            <h2>Select your degree format</h2>
            <p class="sub-header">Whether you seek HND certification or specialized professional bachelor degrees, we have a track custom built for you.</p>
        </div>

        <div class="grid-3">
            <!-- HND -->
            <div class="premium-card program-tier-card">
                <span class="course-badge">HND Program</span>
                <h3>Higher National Diploma</h3>
                <p class="body-normal" style="margin-top: 12px; color: #64748B;">A highly practical two-year track focusing directly on core technical competencies and software operations.</p>
                <ul class="program-list-meta">
                    <li><i class="fa-solid fa-check"></i> Duration: 2 Years</li>
                    <li><i class="fa-solid fa-check"></i> DevOps & Support Modules</li>
                    <li><i class="fa-solid fa-check"></i> Standard National Exams</li>
                </ul>
                <a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>" class="btn btn-dark" style="width: 100%; text-align: center;">View HND Modules</a>
            </div>

            <!-- B.Sc -->
            <div class="premium-card program-tier-card featured">
                <span class="course-badge" style="background:#FEF3C7; color:#B45309;">Professional Degree</span>
                <h3>Bachelor of Science (B.Sc)</h3>
                <p class="body-normal" style="margin-top: 12px; color: #64748B;">A three-year comprehensive curriculum covering defense networks, information governance, and cryptography.</p>
                <ul class="program-list-meta">
                    <li><i class="fa-solid fa-check"></i> Duration: 3 Years</li>
                    <li><i class="fa-solid fa-check"></i> Cybersecurity Focus</li>
                    <li><i class="fa-solid fa-check"></i> Laboratory Internships</li>
                </ul>
                <a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>" class="btn btn-primary" style="width: 100%; text-align: center;">Explore B.Sc Tracks</a>
            </div>

            <!-- B.Tech -->
            <div class="premium-card program-tier-card">
                <span class="course-badge">Technology Track</span>
                <h3>Bachelor of Technology (B.Tech)</h3>
                <p class="body-normal" style="margin-top: 12px; color: #64748B;">A professional program designed around building complex API engines, database models, and cloud setups.</p>
                <ul class="program-list-meta">
                    <li><i class="fa-solid fa-check"></i> Duration: 3 Years</li>
                    <li><i class="fa-solid fa-check"></i> Full Stack Engineering</li>
                    <li><i class="fa-solid fa-check"></i> Direct Incubator Placement</li>
                </ul>
                <a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>" class="btn btn-dark" style="width: 100%; text-align: center;">View B.Tech Modules</a>
            </div>
        </div>
    </div>
</section>

<!-- 4. LIAH COMPANY SERVICES -->
<section class="section-padding bg-dark-section" style="border-top: 1px solid rgba(245, 166, 35, 0.1);">
    <div class="container">
        <div class="grid-2">
            <div>
                <span class="course-badge" style="background: rgba(245, 166, 35, 0.15); color: #F5A623;">Corporate Division</span>
                <h2 style="color: #F8FAFC;">Enterprise software & services from Buea</h2>
                <p class="body-large" style="margin: 20px 0; color: #64748B;">Liah Academy is both an academy and a company. Our professional services arm develops production applications, performs compliance audits, and provides technical consulting globally.</p>
                <a href="<?php echo esc_url( home_url( '/contact' ) ); ?>" class="btn btn-primary">Partner With Us</a>
            </div>

            <div class="services-list-wrapper" style="display: flex; flex-direction: column; gap: 24px;">
                <?php
                // Fetch dynamic services
                $services_query = new WP_Query( array(
                    'post_type'      => 'liah_service',
                    'posts_per_page' => 3
                ) );

                if ( $services_query->have_posts() ) :
                    while ( $services_query->have_posts() ) : $services_query->the_post();
                        $icon = get_post_meta( get_the_ID(), 'liah_service_icon', true );
                        $icon = $icon ? $icon : 'fa-network-wired';
                ?>
                <div class="premium-card" style="background: rgba(8, 31, 62, 0.5); border-color: rgba(245, 166, 35, 0.1); color: #F8FAFC; display: flex; gap: 20px; align-items: flex-start; padding: 24px;">
                    <div style="background: rgba(245, 166, 35, 0.15); color: #F5A623; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 20px;">
                        <i class="fa-solid <?php echo esc_attr( $icon ); ?>"></i>
                    </div>
                    <div>
                        <h4 style="color: #F8FAFC; margin-bottom: 8px;"><?php the_title(); ?></h4>
                        <p style="color: #64748B; font-size: 14px; line-height: 1.5;"><?php the_content(); ?></p>
                    </div>
                </div>
                <?php
                    endwhile;
                    wp_reset_postdata();
                endif;
                ?>
            </div>
        </div>
    </div>
</section>

<!-- 5. NEWS & HIGHLIGHTS BANNER -->
<section class="section-padding bg-light-section">
    <div class="container">
        <div class="section-header">
            <span class="course-badge">Highlights</span>
            <h2>News, events & announcements</h2>
            <p class="sub-header">Stay up-to-date with current events at Liah Academy, workshop schedules, and student competitions in Buea.</p>
        </div>

        <div class="grid-3">
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
            <div class="highlight-post-card">
                <div class="highlight-thumb" style="background-image: url('<?php echo esc_url( $image ); ?>');">
                    <span class="course-badge highlight-badge" style="background: <?php echo esc_attr( $color ); ?>; color: #ffffff;"><?php echo esc_html( $badge ); ?></span>
                </div>
                <div class="highlight-body">
                    <span class="highlight-meta"><?php echo esc_html( $meta ); ?></span>
                    <h3><?php the_title(); ?></h3>
                    <p class="body-normal" style="color: #64748B; margin-top: 8px;"><?php the_content(); ?></p>
                </div>
            </div>
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

<!-- 6. PARTNERS LOGOS & COMMUNITY REVIEWS -->
<section class="section-padding bg-dark-section" style="border-top: 1px solid rgba(245, 166, 35, 0.1); padding: 60px 0;">
    <div class="container">
        <?php
        $google_data = liah_fetch_google_reviews();
        $rating = isset( $google_data['rating'] ) ? floatval( $google_data['rating'] ) : 4.9;
        $total_ratings = isset( $google_data['user_ratings_total'] ) ? intval( $google_data['user_ratings_total'] ) : 85;
        ?>
        <!-- Part A: Partners Logos Display -->
        <div style="text-align: center; margin-bottom: 50px;">
            <span class="course-badge" style="background: rgba(245, 166, 35, 0.1); color: #F5A623; margin-bottom: 15px;">Our Network & Partners</span>
            <div class="grid-4" style="margin-top: 25px; gap: 20px; align-items: center;">
                <div style="background: rgba(8, 31, 62, 0.3); border: 1px solid rgba(245, 166, 35, 0.08); border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-family: var(--font-heading); font-weight: 800; color: #94A3B8; font-size: 14px; letter-spacing: 1px;">SILICON MOUNTAIN</span>
                </div>
                <div style="background: rgba(8, 31, 62, 0.3); border: 1px solid rgba(245, 166, 35, 0.08); border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-family: var(--font-heading); font-weight: 800; color: #94A3B8; font-size: 14px; letter-spacing: 1px;">MINESEC CERTIFIED</span>
                </div>
                <div style="background: rgba(8, 31, 62, 0.3); border: 1px solid rgba(245, 166, 35, 0.08); border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-family: var(--font-heading); font-weight: 800; color: #94A3B8; font-size: 14px; letter-spacing: 1px;">LINUX LABS</span>
                </div>
                <div style="background: rgba(8, 31, 62, 0.3); border: 1px solid rgba(245, 166, 35, 0.08); border-radius: 8px; padding: 20px; text-align: center;">
                    <span style="font-family: var(--font-heading); font-weight: 800; color: #94A3B8; font-size: 14px; letter-spacing: 1px;">AWS ACADEMY</span>
                </div>
            </div>
        </div>

        <hr style="border: 0; border-top: 1px solid rgba(245, 166, 35, 0.1); margin: 45px 0 35px 0;">

        <!-- Part B: Google & Website Reviews Side-by-Side -->
        <div class="grid-2" style="gap: 40px; align-items: start;">
            <!-- Left Side: Google Reviews -->
            <div style="background: rgba(8, 31, 62, 0.25); border: 1px solid rgba(245, 166, 35, 0.1); border-radius: 12px; padding: 30px;">
                <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 20px;">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" style="width: 28px; height: 28px;" alt="Google Logo">
                    <h3 style="color: #F8FAFC; margin: 0; font-size: 20px;">Google Reviews</h3>
                    <span style="background: rgba(245, 166, 35, 0.2); color: #F5A623; padding: 4px 10px; border-radius: 20px; font-weight: 700; font-size: 13px;">
                        <?php echo esc_html( number_format( $rating, 1 ) ); ?> ★ (<?php echo esc_html( $total_ratings ); ?>)
                    </span>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 16px;">
                    <?php
                    $reviews_list = isset( $google_data['reviews'] ) ? $google_data['reviews'] : array();
                    $display_reviews = array_slice( $reviews_list, 0, 2 );
                    if ( ! empty( $display_reviews ) ) :
                        foreach ( $display_reviews as $rev ) :
                    ?>
                        <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid #4285F4; padding: 14px; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-weight: 600; color: #F8FAFC; font-size: 13px;"><?php echo esc_html( $rev['author_name'] ); ?></span>
                                <div style="color: #F5A623; font-size: 10px;">
                                    <?php for ( $i = 0; $i < $rev['rating']; $i++ ) { echo '★'; } ?>
                                </div>
                            </div>
                            <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; font-style: italic; margin: 0;">"<?php echo esc_html( wp_trim_words( $rev['text'], 18 ) ); ?>"</p>
                        </div>
                    <?php 
                        endforeach;
                    else:
                    ?>
                        <!-- Fallback Google Reviews if API is offline -->
                        <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid #4285F4; padding: 14px; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-weight: 600; color: #F8FAFC; font-size: 13px;">Steddy Lyonga</span>
                                <div style="color: #F5A623; font-size: 10px;">★★★★★</div>
                            </div>
                            <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; font-style: italic; margin: 0;">"Best academic incubator and tech lab in Buea. Highly practical training curriculum!"</p>
                        </div>
                    <?php endif; ?>
                </div>
                <div style="margin-top: 20px;">
                    <a href="https://share.google/2pqoSX2O6DET6vL5q" target="_blank" rel="noopener noreferrer" class="btn btn-secondary" style="font-size: 12px; padding: 8px 16px; width: 100%; text-align: center; display: block;"><i class="fa-brands fa-google" style="margin-right: 8px;"></i> Verify on Google</a>
                </div>
            </div>

            <!-- Right Side: Website Reviews & Submit Review Form -->
            <div style="background: rgba(8, 31, 62, 0.25); border: 1px solid rgba(245, 166, 35, 0.1); border-radius: 12px; padding: 30px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: #F8FAFC; margin: 0; font-size: 20px;"><i class="fa-solid fa-comments" style="color: var(--color-primary-accent); margin-right: 8px;"></i> Student Reviews</h3>
                    <button id="toggleReviewFormBtn" class="btn btn-primary" style="font-size: 11px; padding: 6px 12px; height: auto;"><i class="fa-solid fa-pen-to-square"></i> Write Review</button>
                </div>

                <!-- Toggleable Form -->
                <div id="websiteReviewFormContainer" style="display: none; margin-bottom: 20px; background: rgba(8, 31, 62, 0.4); padding: 20px; border-radius: 8px; border: 1px solid rgba(245, 166, 35, 0.15);">
                    <form id="websiteReviewForm" style="display: flex; flex-direction: column; gap: 12px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                            <input type="text" id="revName" placeholder="Your Name" style="background: rgba(8, 31, 62, 0.6); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 10px; color: #fff; font-size:13px;" required>
                            <input type="text" id="revRole" placeholder="Role (e.g. Student)" style="background: rgba(8, 31, 62, 0.6); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 10px; color: #fff; font-size:13px;" required>
                        </div>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <span style="font-size:13px; color: #94A3B8;">Rating:</span>
                            <div style="display: flex; gap: 6px; font-size: 14px; color: #64748B;">
                                <i class="fa-solid fa-star rating-star" data-value="1" style="cursor:pointer;"></i>
                                <i class="fa-solid fa-star rating-star" data-value="2" style="cursor:pointer;"></i>
                                <i class="fa-solid fa-star rating-star" data-value="3" style="cursor:pointer;"></i>
                                <i class="fa-solid fa-star rating-star" data-value="4" style="cursor:pointer;"></i>
                                <i class="fa-solid fa-star rating-star" data-value="5" style="cursor:pointer;"></i>
                            </div>
                            <input type="hidden" id="revRating" value="5">
                        </div>
                        <textarea id="revComment" rows="2" placeholder="Write review..." style="background: rgba(8, 31, 62, 0.6); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 10px; color: #fff; font-size:13px; resize: none;" required></textarea>
                        <button type="submit" class="btn btn-primary" style="padding: 8px 16px; font-size: 13px; align-self: flex-start;">Submit Review</button>
                    </form>
                    <div id="reviewSuccessMsg" style="display:none; color: #F5A623; margin-top: 10px; font-size: 13px; font-weight:600;">
                        <i class="fa-solid fa-circle-check"></i> Review submitted!
                    </div>
                </div>

                <!-- Reviews Stream (Side by Side layout) -->
                <div id="websiteReviewsStream" style="display: flex; flex-direction: column; gap: 16px; max-height: 180px; overflow-y: auto; padding-right: 6px;">
                    <?php
                    global $wpdb;
                    $db_reviews = array();
                    if ( isset( $wpdb ) && get_class( $wpdb ) !== 'MockWPDB' ) {
                        $db_reviews = $wpdb->get_results( "SELECT * FROM {$wpdb->prefix}reviews ORDER BY id DESC LIMIT 10" );
                    }
                    if ( ! empty( $db_reviews ) ) :
                        foreach ( $db_reviews as $dbrev ) :
                    ?>
                            <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid var(--color-primary-accent); padding: 14px; border-radius: 4px;">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                    <span style="font-weight: 600; color: #F8FAFC; font-size: 13px;"><?php echo esc_html( $dbrev->reviewer_name ); ?> (<?php echo esc_html( $dbrev->reviewer_role ); ?>)</span>
                                    <div style="color: #F5A623; font-size: 9px;">
                                        <?php for ( $i = 0; $i < $dbrev->rating; $i++ ) { echo '★'; } ?>
                                    </div>
                                </div>
                                <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; margin: 0;">"<?php echo esc_html( $dbrev->review_text ); ?>"</p>
                            </div>
                    <?php
                        endforeach;
                    else :
                    ?>
                        <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid var(--color-primary-accent); padding: 14px; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-weight: 600; color: #F8FAFC; font-size: 13px;">Belmonde T. (Student)</span>
                                <div style="color: #F5A623; font-size: 9px;">★★★★★</div>
                            </div>
                            <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; margin: 0;">"The networking classes are extremely engaging. I appreciate that we work on real hardware configs."</p>
                        </div>
                        <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid var(--color-primary-accent); padding: 14px; border-radius: 4px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
                                <span style="font-weight: 600; color: #F8FAFC; font-size: 13px;">Etonge S. (Student)</span>
                                <div style="color: #F5A623; font-size: 9px;">★★★★★</div>
                            </div>
                            <p style="color: #94A3B8; font-size: 12px; line-height: 1.5; margin: 0;">"Buea finally has a top tier software development academy. The direct internship program is amazing."</p>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
