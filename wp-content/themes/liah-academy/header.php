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
    
    <!-- SEO Meta Tags -->
    <title><?php wp_title( '|', true, 'right' ); ?><?php bloginfo( 'name' ); ?> - Forge Your Future in Technology</title>
    <meta name="description" content="Liah Academy in Buea, Cameroon is a premier practical tech academy and software engineering company offering HND, National Diploma (ND), and professional certifications in Software Engineering, DevOps, Data Science, and Cybersecurity.">
    <meta name="keywords" content="Liah Academy, Buea tech academy, software engineering Cameroon, HND software engineering Buea, DevOps training Buea, cybersecurity training Cameroon, IT certifications Buea, learn programming Cameroon, hire developers Buea, Backweri Town Buea">
    <meta name="robots" content="index, follow">
    <link rel="canonical" href="<?php echo esc_url( home_url( $_SERVER['REQUEST_URI'] ) ); ?>">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:title" content="Liah Academy | Forge Your Future in Technology">
    <meta property="og:description" content="Buea's premier tech academy & software development company. Study practical HND, ND, and Certification tracks in Software Engineering, DevOps, and Cybersecurity.">
    <meta property="og:image" content="<?php echo esc_url( get_template_directory_uri() . '/logo.png' ); ?>">
    <meta property="og:url" content="<?php echo esc_url( home_url( $_SERVER['REQUEST_URI'] ) ); ?>">
    <meta property="og:site_name" content="Liah Academy">

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Liah Academy | Forge Your Future in Technology">
    <meta name="twitter:description" content="Study practical, lab-based engineering tracks and professional IT certifications at Liah Academy, Buea.">
    <meta name="twitter:image" content="<?php echo esc_url( get_template_directory_uri() . '/logo.png' ); ?>">

    <!-- Local SEO (Buea, Cameroon) -->
    <meta name="geo.region" content="CM-SW">
    <meta name="geo.placename" content="Buea">
    <meta name="geo.position" content="4.1560;9.2631">
    <meta name="ICBM" content="4.1560, 9.2631">

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

                <!-- Header Search Icon Trigger -->
                <li class="menu-item" style="display: flex; align-items: center;">
                    <button class="menu-link" id="headerSearchToggle" aria-label="Toggle Search" style="background: none; border: none; color: inherit; cursor: pointer; display: flex; align-items: center; padding: 0 12px; height: 100%;">
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button>
                </li>
                
                <!-- Navbar Primary CTA Button -->
                <li class="menu-item">
                    <a href="<?php echo esc_url( home_url( '/admissions#apply' ) ); ?>" class="menu-link nav-cta">Apply Now</a>
                </li>
            </ul>
        </nav>
    </div>
</header>

<!-- Dropdown Header Search Bar Wrap -->
<div class="header-search-bar-wrap" id="headerSearchFormWrap" style="position: fixed; top: 70px; left: 0; width: 100%; background: rgba(8, 31, 62, 0.97); border-bottom: 1px solid rgba(245, 166, 35, 0.2); padding: 18px 0; z-index: 998; display: none; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);">
    <div class="container">
        <form role="search" method="get" class="header-search-form" action="<?php echo esc_url( home_url( '/' ) ); ?>" style="display: flex; width: 100%; max-width: 800px; margin: 0 auto; gap: 12px; padding: 0 20px;">
            <input type="search" class="search-input-field" placeholder="Search courses, degree tracks, or requirements..." value="<?php echo get_search_query(); ?>" name="s" id="headerSearchInput" autocomplete="off" style="flex-grow: 1; background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.15); color: #F8FAFC; padding: 12px 18px; border-radius: 8px; font-size: 15px; outline: none;" />
            <button type="submit" class="search-submit-btn" style="background: var(--color-primary-accent); color: #081F3E; border: none; padding: 12px 26px; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 15px;">
                <i class="fa-solid fa-magnifying-glass" style="margin-right: 6px;"></i> Search
            </button>
        </form>
    </div>
</div>
