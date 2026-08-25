<?php
/**
 * Single post layout for Liah Academy
 *
 * Renders full content for standard posts and custom liah_news CPT entries.
 */

get_header();
?>

<main id="primary" class="site-main" style="margin-top: calc(var(--header-height) + 60px); margin-bottom: 80px;">
    <div class="container" style="max-width: 800px; margin: 0 auto; padding: 0 20px;">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) : the_post();
                $post_id = get_the_ID();
                $is_news = ( get_post_type() === 'liah_news' );
                
                // Fetch CPT metadata if it's liah_news
                $meta = $is_news ? get_post_meta( $post_id, 'liah_news_meta', true ) : get_the_date();
                $badge = $is_news ? get_post_meta( $post_id, 'liah_news_badge', true ) : 'News';
                $color = $is_news ? get_post_meta( $post_id, 'liah_news_color', true ) : '#081F3E';
                $image = $is_news ? get_post_meta( $post_id, 'liah_news_image', true ) : '';
                
                $color = $color ? $color : '#081F3E';
                $badge = $badge ? $badge : 'News';
                
                // If it's a standard post, try getting the core featured image
                if ( ! $image && has_post_thumbnail() ) {
                    $image = get_the_post_thumbnail_url( $post_id, 'large' );
                }
        ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                    <!-- Top Navigation Link back -->
                    <div style="margin-bottom: 24px;">
                        <a href="<?php echo esc_url( home_url( '/about#highlights' ) ); ?>" class="btn btn-secondary" style="font-size: 13px; display: inline-flex; align-items: center; gap: 8px; text-decoration: none; padding: 8px 16px;">
                            <i class="fa-solid fa-arrow-left-long"></i> Back to Highlights
                        </a>
                    </div>

                    <!-- Header Section -->
                    <header class="entry-header" style="margin-bottom: 30px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
                            <span class="course-badge" style="background: <?php echo esc_attr( $color ); ?>; color: #ffffff; padding: 5px 12px; border-radius: 4px; font-weight: 700; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">
                                <?php echo esc_html( $badge ); ?>
                            </span>
                            <span style="font-size: 14px; color: #64748B; font-weight: 500;">
                                <i class="fa-regular fa-calendar-days" style="margin-right: 6px;"></i> <?php echo esc_html( $meta ); ?>
                            </span>
                        </div>
                        <h1 class="entry-title" style="color: #081F3E; font-size: 36px; font-weight: 800; line-height: 1.25; margin: 0 0 10px 0;">
                            <?php the_title(); ?>
                        </h1>
                    </header>

                    <!-- Featured Image Area -->
                    <?php if ( $image ) : ?>
                        <div style="width: 100%; border-radius: 12px; overflow: hidden; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(15,23,42,0.08); border: 1px solid rgba(15,23,42,0.05); line-height: 0;">
                            <img src="<?php echo esc_url( $image ); ?>" style="width: 100%; height: auto; display: block; object-fit: cover;" alt="<?php the_title_attribute(); ?>">
                        </div>
                    <?php endif; ?>

                    <!-- Content Area -->
                    <div class="entry-content" style="color: #334155; font-size: 16px; line-height: 1.8; font-family: 'Inter', sans-serif;">
                        <?php the_content(); ?>
                    </div>
                </article>
        <?php
            endwhile;
        endif;
        ?>
    </div>
</main>

<?php
get_footer();
