<?php
/**
 * Template Name: Degree & Program Page Template
 *
 * Renders the Degrees and Programs page, pulling dynamic courses from the CPT liah_course.
 * Supports layout filters for degree types and formats.
 */

get_header();
?>

<main style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        
        <!-- HEADER -->
        <div class="section-header">
            <span class="course-badge">Curriculum</span>
            <h2>Degrees & program tracks</h2>
            <p class="sub-header">Review academic tracks, modules, and formatting details. Select a curriculum track below to verify duration, tuition, and tech stacks.</p>
        </div>

        <!-- 1. ACADEMIC TIER DETAILS (BA, BSc, HND, B.Tech, B.Eng) -->
        <section class="grid-3" style="margin-bottom: 80px;">
            <div class="premium-card">
                <span class="course-badge">Academic Core</span>
                <h3>Degree Levels</h3>
                <p class="body-normal" style="color: #64748B; margin-top: 12px;">Liah Academy structures programs around three primary national certification tracks:</p>
                <ul style="list-style:none; line-height:2.2; font-size:14px; margin-top: 16px; color:#0F172A;">
                    <li><i class="fa-solid fa-graduation-cap" style="color:#F5A623; margin-right:8px;"></i> <strong>HND</strong> - Higher National Diploma</li>
                    <li><i class="fa-solid fa-graduation-cap" style="color:#F5A623; margin-right:8px;"></i> <strong>B.Sc</strong> - Bachelor of Science</li>
                    <li><i class="fa-solid fa-graduation-cap" style="color:#F5A623; margin-right:8px;"></i> <strong>BA</strong> - Bachelor of Arts (Applied Tech)</li>
                </ul>
            </div>

            <div class="premium-card">
                <span class="course-badge">Specialization</span>
                <h3>Program Formats</h3>
                <p class="body-normal" style="color: #64748B; margin-top: 12px;">We focus on technical engineering degrees configured for corporate integration:</p>
                <ul style="list-style:none; line-height:2.2; font-size:14px; margin-top: 16px; color:#0F172A;">
                    <li><i class="fa-solid fa-gear" style="color:#F5A623; margin-right:8px;"></i> <strong>B.Tech</strong> - Bachelor of Technology</li>
                    <li><i class="fa-solid fa-code" style="color:#F5A623; margin-right:8px;"></i> <strong>B.Eng</strong> - Bachelor of Engineering</li>
                    <li><i class="fa-solid fa-shield-halved" style="color:#F5A623; margin-right:8px;"></i> Cyber Operations & Cloud Engineering</li>
                </ul>
            </div>

            <div class="premium-card">
                <span class="course-badge">Format & Length</span>
                <h3>Length & Format</h3>
                <p class="body-normal" style="color: #64748B; margin-top: 12px;">Tracks are designed to fit your schedule. Choose from the following study formats:</p>
                <ul style="list-style:none; line-height:2.2; font-size:14px; margin-top: 16px; color:#0F172A;">
                    <li><i class="fa-solid fa-calendar-days" style="color:#F5A623; margin-right:8px;"></i> <strong>Full-time:</strong> Daily intensive labs (3 Years)</li>
                    <li><i class="fa-solid fa-clock" style="color:#F5A623; margin-right:8px;"></i> <strong>Part-time:</strong> Evenings & weekends (3-4 Years)</li>
                    <li><i class="fa-solid fa-globe" style="color:#F5A623; margin-right:8px;"></i> <strong>Online:</strong> Self-paced remote learning</li>
                    <li><i class="fa-solid fa-location-dot" style="color:#F5A623; margin-right:8px;"></i> <strong>On-campus:</strong> Standard labs in Buea</li>
                </ul>
            </div>
        </section>

        <!-- 2. INTERACTIVE DYNAMIC COURSE EXPLORER -->
        <section class="course-explorer-section">
            <h3 style="color:#081F3E; margin-bottom: 24px; text-align: center;">Curriculum Explorer</h3>
            
            <!-- Filters bar -->
            <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; background:#FFFFFF; padding:16px 24px; border-radius:var(--border-radius-sm); border:1px solid rgba(15,23,42,0.08); margin-bottom: 40px;">
                <div style="display:flex; gap:12px; align-items:center;" id="courseFormatFilters">
                    <span style="font-size:14px; font-weight:700; color:#081F3E;">Format:</span>
                    <button class="quick-reply-chip" style="background:#081F3E; color:#F5A623;" data-filter="all">All Formats</button>
                    <button class="quick-reply-chip" data-filter="fulltime">Full-Time</button>
                    <button class="quick-reply-chip" data-filter="online">Online</button>
                    <button class="quick-reply-chip" data-filter="oncampus">On-Campus</button>
                </div>
                
                <div style="display:flex; align-items:center; gap:8px;">
                    <i class="fa-solid fa-magnifying-glass" style="color:#64748B;"></i>
                    <input type="text" id="explorerSearchInput" placeholder="Quick course search..." style="border:none; border-bottom:1px solid rgba(15,23,42,0.15); padding:6px; font-size:14px; outline:none;" autocomplete="off">
                </div>
            </div>

            <!-- Dynamic Courses Grid -->
            <div class="grid-3" id="courseGridContainer">
                <?php
                // Query dynamic courses
                $courses_query = new WP_Query( array(
                    'post_type'      => 'liah_course',
                    'posts_per_page' => -1
                ) );

                if ( $courses_query->have_posts() ) :
                    while ( $courses_query->have_posts() ) : $courses_query->the_post();
                        $course_id = get_the_ID();
                        $degree    = get_post_meta( $course_id, 'liah_degree_type', true );
                        $format    = get_post_meta( $course_id, 'liah_length_format', true );
                        $duration  = get_post_meta( $course_id, 'liah_duration', true );
                        $fee       = get_post_meta( $course_id, 'liah_tuition_fee', true );
                        $modules   = get_post_meta( $course_id, 'liah_modules', true );
                        $badge     = get_post_meta( $course_id, 'liah_badge_text', true );
                        $badge     = $badge ? $badge : 'Module Track';
                ?>
                <div class="premium-card course-item-card" data-format="<?php echo esc_attr( $format ); ?>">
                    <span class="course-badge"><?php echo esc_html( $badge ); ?></span>
                    <h3 style="color:#081F3E; margin-bottom:12px;"><?php the_title(); ?></h3>
                    <p class="body-normal" style="color:#64748B; font-size:14px; line-height: 1.6;"><?php the_content(); ?></p>
                    
                    <!-- Metadata row -->
                    <div style="margin-top:20px; padding-top:16px; border-top:1px solid rgba(15,23,42,0.08); font-size:13px; color:#64748B;">
                        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
                            <span><strong>Degree:</strong> <?php echo esc_html( strtoupper($degree) ); ?></span>
                            <span><strong>Duration:</strong> <?php echo esc_html( $duration ); ?></span>
                        </div>
                        <div>
                            <span><strong>Study Format:</strong> <?php echo esc_html( ucfirst( $format ) ); ?></span>
                        </div>
                    </div>

                    <!-- Tech tags (JetBrains Mono style compliance) -->
                    <?php if ( ! empty( $modules ) ) : ?>
                    <div class="tech-tag-container">
                        <?php 
                        $tags = explode( ',', $modules );
                        foreach ( $tags as $tag ) :
                            $tag = trim( $tag );
                            if ( ! empty( $tag ) ) :
                        ?>
                        <span class="tech-pill" style="font-family:'JetBrains Mono', monospace; font-size:13px; border-color:#F5A62333; background:#081F3E; color:#F5A623;"><?php echo esc_html( $tag ); ?></span>
                        <?php 
                            endif;
                        endforeach; 
                        ?>
                    </div>
                    <?php endif; ?>
                </div>
                <?php
                    endwhile;
                    wp_reset_postdata();
                else :
                ?>
                <div style="grid-column: span 3; text-align:center; padding: 40px; color:#64748B;">
                    <i class="fa-solid fa-circle-exclamation" style="font-size:32px; margin-bottom:12px;"></i>
                    <p>No courses found matching the database specifications.</p>
                </div>
                <?php endif; ?>
            </div>
        </section>
    </div>
</main>

<?php
get_footer();
