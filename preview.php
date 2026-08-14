<?php
/**
 * Standalone Interactive Preview Router
 *
 * Bootstraps the mock WordPress parameters and routes templates from the liah-academy theme
 * folder to allow reviewing page interactions without database installations.
 */

// Prevent direct loading inside WordPress core
if ( defined( 'ABSPATH' ) ) {
    exit;
}

// Load mock bootstrap definitions
require_once 'wp-content/themes/liah-academy/wp-mock.php';

// Route template layouts
$page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : 'home';

switch ( $page ) {
    case 'about':
        include 'wp-content/themes/liah-academy/page-about.php';
        break;
    case 'admissions':
        include 'wp-content/themes/liah-academy/page-admissions.php';
        break;
    case 'degree-programs':
        include 'wp-content/themes/liah-academy/page-programs.php';
        break;
    case 'student-experience':
        include 'wp-content/themes/liah-academy/page-experience.php';
        break;
    case 'contact':
        include 'wp-content/themes/liah-academy/page-contact.php';
        break;
    case 'home':
    default:
        include 'wp-content/themes/liah-academy/front-page.php';
        break;
}
