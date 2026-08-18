<?php
/**
 * The template for displaying all pages
 *
 * @package Liah_Academy
 */

get_header();
?>

<main id="primary" class="site-main" style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        <?php
        while ( have_posts() ) :
            the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
                <header class="entry-header" style="margin-bottom: 30px;">
                    <h1 class="entry-title" style="color: #081F3E; font-size: 36px; font-weight: 800;"><?php the_title(); ?></h1>
                </header>

                <div class="entry-content" style="color: #475569; line-height: 1.8; font-size: 16px;">
                    <?php
                    the_content();
                    ?>
                </div>
            </article>
            <?php
        endwhile;
        ?>
    </div>
</main>

<?php
get_footer();
