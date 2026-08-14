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
        <!-- Initial slides, background-images enqueued via JS for performance -->
        <div class="slide active" data-bg="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1600&q=80"></div>
        <div class="slide" data-bg="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1600&q=80"></div>
        <div class="slide" data-bg="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1600&q=80"></div>
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
            <!-- News post -->
            <div class="highlight-post-card">
                <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80');">
                    <span class="course-badge highlight-badge">News</span>
                </div>
                <div class="highlight-body">
                    <span class="highlight-meta">August 14, 2026</span>
                    <h3>Annual Tech Innovation Summit Announced</h3>
                    <p class="body-normal" style="color: #64748B; margin-top: 8px;">Liah Academy is hosting its annual summit uniting tech leaders from across the region to present research projects.</p>
                </div>
            </div>

            <!-- Event post -->
            <div class="highlight-post-card">
                <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80');">
                    <span class="course-badge highlight-badge" style="background: #E28704; color: #ffffff;">Event</span>
                </div>
                <div class="highlight-body">
                    <span class="highlight-meta">September 5, 2026</span>
                    <h3>Buea Cybersecurity Capture The Flag (CTF)</h3>
                    <p class="body-normal" style="color: #64748B; margin-top: 8px;">Join local developers and defense specialists in our interactive networking challenges hosted at the campus labs.</p>
                </div>
            </div>

            <!-- Announcement post -->
            <div class="highlight-post-card">
                <div class="highlight-thumb" style="background-image: url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=600&q=80');">
                    <span class="course-badge highlight-badge" style="background: #081F3E; color: #F5A623;">Notice</span>
                </div>
                <div class="highlight-body">
                    <span class="highlight-meta">October 1, 2026</span>
                    <h3>Official Fall Admissions Portal Is Open</h3>
                    <p class="body-normal" style="color: #64748B; margin-top: 8px;">Prospective students are invited to register, submit documents, and join the orientation tracks for fall intake.</p>
                </div>
            </div>
        </div>
    </div>
</section>

<!-- 6. GOOGLE & WEBSITE REVIEWS SECTION -->
<section class="section-padding bg-dark-section" style="border-top: 1px solid rgba(245, 166, 35, 0.1);">
    <div class="container">
        <?php
        $google_data = liah_fetch_google_reviews();
        $rating = isset( $google_data['rating'] ) ? floatval( $google_data['rating'] ) : 4.9;
        $total_ratings = isset( $google_data['user_ratings_total'] ) ? intval( $google_data['user_ratings_total'] ) : 85;
        ?>
        <div class="section-header">
            <span class="course-badge" style="background: rgba(245, 166, 35, 0.15); color: #F5A623;"><i class="fa-brands fa-google" style="margin-right:6px;"></i> Google Reviews</span>
            <h2 style="color: #F8FAFC;">What our community says</h2>
            <p class="sub-header" style="color: #64748B;">Liah Academy maintains a <?php echo esc_html( number_format( $rating, 1 ) ); ?> ★ rating on Google. Check out verified reviews from our tech students and software partners.</p>
        </div>

        <div class="grid-3" style="margin-bottom: 50px; align-items: stretch;">
            <!-- Google Rating Summary Card -->
            <div class="premium-card" style="background: rgba(8, 31, 62, 0.5); border-color: rgba(245, 166, 35, 0.15); color: #F8FAFC; text-align: center; padding: 40px 30px; display: flex; flex-direction: column; justify-content: center; align-items: center;">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1200px-Google_%22G%22_logo.svg.png" style="width: 48px; height: 48px; margin-bottom: 16px;" alt="Google Logo">
                <h3 style="font-size: 56px; font-weight: 800; color: #F5A623; line-height: 1;"><?php echo esc_html( number_format( $rating, 1 ) ); ?></h3>
                <div style="color: #F5A623; margin: 12px 0; font-size: 18px;">
                    <?php
                    $full_stars = floor( $rating );
                    for ( $i = 0; $i < 5; $i++ ) {
                        if ( $i < $full_stars ) {
                            echo '<i class="fa-solid fa-star"></i>';
                        } else {
                            echo '<i class="fa-regular fa-star" style="color: #64748B;"></i>';
                        }
                    }
                    ?>
                </div>
                <p style="color: #64748B; font-size: 14px; margin-bottom: 24px;">Based on <?php echo esc_html( $total_ratings ); ?> verified Google reviews</p>
                <a href="https://share.google/2pqoSX2O6DET6vL5q" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="font-size: 13px;"><i class="fa-brands fa-google" style="margin-right: 8px;"></i> Verify on Google</a>
            </div>

            <?php
            $reviews_list = isset( $google_data['reviews'] ) ? $google_data['reviews'] : array();
            $display_reviews = array_slice( $reviews_list, 0, 2 );
            foreach ( $display_reviews as $rev ) :
                $initials = '';
                if ( ! empty( $rev['author_name'] ) ) {
                    $parts = explode( ' ', $rev['author_name'] );
                    $initials = strtoupper( substr( $parts[0], 0, 1 ) . ( isset( $parts[1] ) ? substr( $parts[1], 0, 1 ) : '' ) );
                }
                $initials = $initials ? $initials : 'GA';
            ?>
            <div class="premium-card" style="background: rgba(8, 31, 62, 0.3); border-color: rgba(245, 166, 35, 0.08); color: #F8FAFC; padding: 30px; display: flex; flex-direction: column; justify-content: space-between;">
                <div>
                    <div style="color: #F5A623; margin-bottom: 16px; font-size: 14px;">
                        <?php for ( $i = 0; $i < 5; $i++ ) : ?>
                            <?php if ( $i < $rev['rating'] ) : ?>
                                <i class="fa-solid fa-star"></i>
                            <?php else : ?>
                                <i class="fa-regular fa-star" style="color: #64748B;"></i>
                            <?php endif; ?>
                        <?php endfor; ?>
                    </div>
                    <p class="body-normal" style="color: #94A3B8; font-style: italic; line-height: 1.6;">"<?php echo esc_html( $rev['text'] ); ?>"</p>
                </div>
                <div style="margin-top: 24px; display: flex; align-items: center; gap: 12px;">
                    <?php if ( ! empty( $rev['profile_photo_url'] ) ) : ?>
                        <img src="<?php echo esc_url( $rev['profile_photo_url'] ); ?>" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover;" alt="<?php echo esc_attr( $rev['author_name'] ); ?>">
                    <?php else : ?>
                        <div style="width: 44px; height: 44px; border-radius: 50%; background: #F5A623; color: #081F3E; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px;">
                            <?php echo esc_html( $initials ); ?>
                        </div>
                    <?php endif; ?>
                    <div>
                        <h4 style="font-size: 15px; color: #F8FAFC;"><?php echo esc_html( $rev['author_name'] ); ?></h4>
                        <span style="font-size: 12px; color: #64748B;"><?php echo esc_html( isset( $rev['relative_time_description'] ) ? $rev['relative_time_description'] : 'Verified Reviewer' ); ?></span>
                    </div>
                </div>
            </div>
            <?php endforeach; ?>
        </div>

        <!-- On-Site Website Review Form / Interactive Submission -->
        <div class="grid-2" style="gap: 40px; background: rgba(8, 31, 62, 0.2); padding: 40px; border-radius: var(--border-radius-md); border: 1px solid rgba(245, 166, 35, 0.1);">
            <div>
                <h3 style="color: #F8FAFC; margin-bottom: 12px;">Submit a Website Review</h3>
                <p class="body-normal" style="color: #64748B; margin-bottom: 24px;">Are you a current student or partner? Share your training or software development experience with us and help others find us.</p>
                
                <form id="websiteReviewForm" style="display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group" style="margin-bottom:0;">
                            <input type="text" id="revName" placeholder="Your Name" style="width:100%; background: rgba(8, 31, 62, 0.4); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 12px; color: #fff; font-size:14px;" required>
                        </div>
                        <div class="form-group" style="margin-bottom:0;">
                            <input type="text" id="revRole" placeholder="Role (e.g. Student, Partner)" style="width:100%; background: rgba(8, 31, 62, 0.4); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 12px; color: #fff; font-size:14px;" required>
                        </div>
                    </div>
                    
                    <div style="display: flex; align-items: center; gap: 12px;">
                        <span style="color: #94A3B8; font-size: 14px;">Select Rating:</span>
                        <div class="star-rating-select" style="display: flex; gap: 6px; font-size: 20px; color: #64748B; cursor: pointer;">
                            <i class="fa-solid fa-star rating-star" data-value="1"></i>
                            <i class="fa-solid fa-star rating-star" data-value="2"></i>
                            <i class="fa-solid fa-star rating-star" data-value="3"></i>
                            <i class="fa-solid fa-star rating-star" data-value="4"></i>
                            <i class="fa-solid fa-star rating-star" data-value="5"></i>
                        </div>
                        <input type="hidden" id="revRating" value="5">
                    </div>

                    <div class="form-group" style="margin-bottom:0;">
                        <textarea id="revComment" rows="3" placeholder="Write your review here..." style="width:100%; background: rgba(8, 31, 62, 0.4); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: 6px; padding: 12px; color: #fff; font-size:14px; resize: none;" required></textarea>
                    </div>

                    <button type="submit" class="btn btn-primary" style="align-self: flex-start; padding: 10px 24px;"><i class="fa-solid fa-paper-plane" style="margin-right: 8px;"></i> Submit Review</button>
                </form>
                
                <div id="reviewSuccessMsg" style="display:none; color: #F5A623; margin-top: 15px; font-size: 14px; font-weight:600;">
                    <i class="fa-solid fa-circle-check" style="margin-right:6px;"></i> Review submitted successfully!
                </div>
            </div>

            <!-- Dynamic reviews stream -->
            <div>
                <h3 style="color: #F8FAFC; margin-bottom: 20px;">Recent Student Submissions</h3>
                <div id="websiteReviewsStream" style="display: flex; flex-direction: column; gap: 16px; max-height: 280px; overflow-y: auto; padding-right: 10px;">
                    <!-- Review 1 -->
                    <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid var(--color-primary-accent); padding: 16px; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: 600; color: #F8FAFC; font-size: 14px;">Belmonde T.</span>
                            <div style="color: #F5A623; font-size: 11px;">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            </div>
                        </div>
                        <p style="color: #94A3B8; font-size: 13px; line-height: 1.5;">"The networking classes are extremely engaging. I appreciate that we work on real hardware configs."</p>
                    </div>
                    <!-- Review 2 -->
                    <div style="background: rgba(8, 31, 62, 0.15); border-left: 3px solid var(--color-primary-accent); padding: 16px; border-radius: 4px;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <span style="font-weight: 600; color: #F8FAFC; font-size: 14px;">Etonge S.</span>
                            <div style="color: #F5A623; font-size: 11px;">
                                <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                            </div>
                        </div>
                        <p style="color: #94A3B8; font-size: 13px; line-height: 1.5;">"Buea finally has a top tier software development academy. The direct internship program with the company is amazing."</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>

<?php
get_footer();
