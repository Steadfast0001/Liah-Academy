<?php
/**
 * The main template file
 *
 * @package Liah_Academy
 */

get_header();
?>

<main id="primary" class="site-main" style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        <?php
        if ( have_posts() ) :
            while ( have_posts() ) :
                the_post();
                ?>
                <article id="post-<?php the_ID(); ?>" <?php post_class(); ?> style="margin-bottom: 40px;">
                    <header class="entry-header">
                        <h2 class="entry-title" style="margin-bottom: 12px;"><a href="<?php the_permalink(); ?>" style="color: #081F3E; text-decoration: none; font-weight: 700;"><?php the_title(); ?></a></h2>
                    </header>

                    <div class="entry-summary" style="color: #475569; line-height: 1.7;">
                        <?php the_excerpt(); ?>
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
