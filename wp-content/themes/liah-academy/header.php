<?php
if ( ! function_exists( 'liah_nav_active_class' ) ) {
    function liah_nav_active_class( $slugs ) {
        if ( ! is_array( $slugs ) ) {
            $slugs = array( $slugs );
        }
        
        // Standalone preview mode detection
        if ( ! defined( 'ABSPATH' ) || ( defined('WP_DEBUG') && !constant('ABSPATH') ) || strpos( $_SERVER['SCRIPT_NAME'], 'preview.php' ) !== false ) {
            $current = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : 'home';
            if ( in_array( $current, $slugs ) ) {
                return ' active';
            }
            return '';
        }
        
        // WordPress core mode checks
        foreach ( $slugs as $slug ) {
            if ( $slug === 'home' && ( is_front_page() || is_home() ) ) {
                return ' active';
            }
            if ( is_page( $slug ) ) {
                return ' active';
            }
            // Page template fallback checks
            if ( $slug === 'about' && is_page_template( 'page-about.php' ) ) {
                return ' active';
            }
            if ( $slug === 'admissions' && is_page_template( 'page-admissions.php' ) ) {
                return ' active';
            }
            if ( $slug === 'degree-programs' && is_page_template( 'page-programs.php' ) ) {
                return ' active';
            }
            if ( $slug === 'student-experience' && is_page_template( 'page-experience.php' ) ) {
                return ' active';
            }
            if ( $slug === 'contact' && is_page_template( 'page-contact.php' ) ) {
                return ' active';
            }
        }
        
        return '';
    }
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Liah Academy - Buea's Premier Tech Academy and Software Company. Empowering next-generation tech leaders and constructing enterprise solutions.">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<!-- Main Glassmorphism Header Nav Wrapper -->
<header class="site-header">
    <div class="header-container">
        <!-- Top Left Brand logo -->
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-link">
            <img class="logo-img" src="<?php echo esc_url( get_template_directory_uri() . '/logo.png' ); ?>" alt="Liah Academy Logo">
            <span class="logo-text">Liah <span>Academy</span></span>
        </a>

        <!-- Hamburger Icon for responsive mobile nav toggle -->
        <button class="menu-toggle" id="mobileMenuToggle" aria-label="Toggle Menu">
            <i class="fa-solid fa-bars"></i>
        </button>

        <!-- Main Nav Links -->
        <nav class="nav-wrapper">
            <ul class="nav-menu" id="primaryNavMenu">
                <li class="menu-item<?php echo liah_nav_active_class('home'); ?>">
                    <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="menu-link">Home</a>
                </li>
                
                <li class="menu-item<?php echo liah_nav_active_class('degree-programs'); ?>">
                    <a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>" class="menu-link">Degree & Program</a>
                </li>
                
                <li class="menu-item<?php echo liah_nav_active_class('admissions'); ?>">
                    <a href="<?php echo esc_url( home_url( '/admissions' ) ); ?>" class="menu-link">Admission</a>
                </li>
                
                <li class="menu-item<?php echo liah_nav_active_class('student-experience'); ?>">
                    <a href="<?php echo esc_url( home_url( '/student-experience' ) ); ?>" class="menu-link">Student Experience</a>
                </li>
                
                <!-- About Hover Dropdown Menu Item -->
                <li class="menu-item has-dropdown<?php echo liah_nav_active_class('about'); ?>" id="aboutMenuItem">
                    <span class="menu-link" tabindex="0">About <i class="fa-solid fa-chevron-down" style="font-size: 11px; margin-left: 6px;"></i></span>
                    <ul class="dropdown-menu">
                        <li class="dropdown-item"><a href="<?php echo esc_url( home_url( '/about#top-admin' ) ); ?>">Top Admin</a></li>
                        <li class="dropdown-item"><a href="<?php echo esc_url( home_url( '/about#partnerships' ) ); ?>">Business & Partnerships</a></li>
                        <li class="dropdown-item"><a href="<?php echo esc_url( home_url( '/about#highlights' ) ); ?>">News & Highlights</a></li>
                    </ul>
                </li>
                
                <li class="menu-item<?php echo liah_nav_active_class('contact'); ?>">
                    <a href="<?php echo esc_url( home_url( '/contact' ) ); ?>" class="menu-link">Contact</a>
                </li>
                
                <!-- Navbar Primary CTA Button -->
                <li class="menu-item">
                    <a href="<?php echo esc_url( home_url( '/admissions#apply' ) ); ?>" class="menu-link nav-cta">Apply Now</a>
                </li>
            </ul>
        </nav>
    </div>
</header>

<?php
/**
 * Search Bar: Positioned DIRECTLY below the navigation bar.
 * Appears exclusively on the Landing Home Page.
 */
if ( is_front_page() ) :
?>
<div class="home-search-bar-wrap">
    <form role="search" method="get" class="home-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>">
        <input type="search" class="search-input-field" placeholder="Search courses, degree tracks, workshops, or academic requirements..." value="<?php echo get_search_query(); ?>" name="s" id="courseSearchInput" autocomplete="off" />
        <button type="submit" class="search-submit-btn">
            <i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Search
        </button>
    </form>
</div>
<?php endif; ?>
