<?php
/**
 * Liah Academy Theme Functions
 *
 * Provides all core theme support, custom post types, PostgreSQL-compatible 
 * database creation for student applications, AJAX portal endpoints, and file upload handlers.
 */

// Exit if accessed directly
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/* ==========================================================================
   1. THEME SUPPORT & ASSETS SETUP
   ========================================================================== */
function liah_theme_setup() {
    // Add title tag support
    add_theme_support( 'title-tag' );
    
    // Add post thumbnail support
    add_theme_support( 'post-thumbnails' );
    
    // Register navigation menus
    register_nav_menus( array(
        'primary-menu' => esc_html__( 'Primary Navigation Menu', 'liah-academy' ),
    ) );
}
add_action( 'after_setup_theme', 'liah_theme_setup' );

// Enqueue styles and scripts
function liah_theme_assets() {
    // Enqueue FontAwesome for icons
    wp_enqueue_style( 'font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', array(), '6.4.0' );
    
    // Theme primary stylesheet (style.css contains Google Fonts import)
    wp_enqueue_style( 'liah-main-style', get_stylesheet_uri(), array(), '1.0.0' );
    
    // Theme custom JavaScript
    wp_enqueue_script( 'liah-main-js', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true );
    
    // Pass admin-ajax.php URL and localized data to JS
    wp_localize_script( 'liah-main-js', 'liahSettings', array(
        'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
        'nonce'     => wp_create_nonce( 'liah-portal-nonce' ),
        'themeUrl'  => get_template_directory_uri(),
    ) );
}
add_action( 'wp_enqueue_scripts', 'liah_theme_assets' );

/* ==========================================================================
   2. SESSION CONFIGURATION (For student portal return login tracking)
   ========================================================================== */
function liah_start_session() {
    if ( ! session_id() ) {
        session_start();
    }
}
add_action( 'init', 'liah_start_session', 1 );

/* ==========================================================================
   3. CUSTOM POST TYPES REGISTRATION
   ========================================================================== */
function liah_register_custom_posts() {
    // 1. Courses Custom Post Type
    register_post_type( 'liah_course', array(
        'labels'      => array(
            'name'          => __( 'Courses', 'liah-academy' ),
            'singular_name' => __( 'Course', 'liah-academy' ),
            'add_new_item'  => __( 'Add New Course', 'liah-academy' ),
            'edit_item'     => __( 'Edit Course', 'liah-academy' ),
        ),
        'public'      => true,
        'has_archive' => true,
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'menu_icon'   => 'dashicons-welcome-learn-more',
        'show_in_rest'=> true,
    ) );

    // 2. Services Custom Post Type (Company side)
    register_post_type( 'liah_service', array(
        'labels'      => array(
            'name'          => __( 'Services', 'liah-academy' ),
            'singular_name' => __( 'Service', 'liah-academy' ),
            'add_new_item'  => __( 'Add New Service', 'liah-academy' ),
            'edit_item'     => __( 'Edit Service', 'liah-academy' ),
        ),
        'public'      => true,
        'supports'    => array( 'title', 'editor', 'thumbnail', 'excerpt', 'custom-fields' ),
        'menu_icon'   => 'dashicons-networking',
        'show_in_rest'=> true,
    ) );
}
add_action( 'init', 'liah_register_custom_posts' );

/* ==========================================================================
   4. DATABASE SETUP (PostgreSQL-compatible Admissions Table)
   ========================================================================== */
function liah_initialize_database() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';
    
    // Check if table exists
    // Using standard SQL query that works in both MySQL and PostgreSQL systems
    $query = $wpdb->prepare(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = %s",
        $table_name
    );
    $table_exists = $wpdb->get_var( $query );

    if ( ! $table_exists ) {
        // Standard SQL compatible with PostgreSQL and MySQL.
        // We'll write the column definition. Under PG4WP, serial column creations
        // are translated from the AUTO_INCREMENT syntax, or we can check the database engine.
        // dbDelta requires very specific formatting: two spaces after PRIMARY KEY.
        $charset_collate = '';
        if ( ! empty( $wpdb->charset ) ) {
            $charset_collate = "DEFAULT CHARACTER SET {$wpdb->charset}";
        }
        if ( ! empty( $wpdb->collate ) ) {
            $charset_collate .= " COLLATE {$wpdb->collate}";
        }

        // Standard dbDelta syntax. PG4WP intercepts and translates this perfectly.
        $sql = "CREATE TABLE $table_name (
            id bigint(20) NOT NULL AUTO_INCREMENT,
            full_name varchar(100) NOT NULL,
            email varchar(100) NOT NULL UNIQUE,
            password varchar(255) NOT NULL,
            phone varchar(50) NOT NULL,
            degree_type varchar(50) NOT NULL,
            program_type varchar(100) NOT NULL,
            study_format varchar(50) NOT NULL,
            document_url varchar(255) NOT NULL,
            payment_status varchar(30) DEFAULT 'Pending' NOT NULL,
            admission_status varchar(30) DEFAULT 'Under Review' NOT NULL,
            submission_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once( ABSPATH . 'wp-admin/includes/upgrade.php' );
        dbDelta( $sql );
    }
}
add_action( 'after_switch_theme', 'liah_initialize_database' );

/* ==========================================================================
   5. SEED DEFAULT DATA ON ACTIVE (Premium Out-of-the-Box Experience)
   ========================================================================== */
function liah_seed_default_posts() {
    // 1. Seed Courses CPT if empty
    $courses_count = wp_count_posts( 'liah_course' );
    if ( ! isset( $courses_count->publish ) || $courses_count->publish == 0 ) {
        $default_courses = array(
            array(
                'title'       => 'Software Engineering Accelerator',
                'excerpt'     => 'Master modern web development, algorithms, and databases to build corporate-level products.',
                'degree'      => 'B.Tech',
                'format'      => 'fulltime',
                'duration'    => '3 Years',
                'fee'         => '450000', // XAF
                'modules'     => 'Python, JavaScript, Django, PostgreSQL, Algorithms',
                'badge'       => 'Academic Program'
            ),
            array(
                'title'       => 'Cybersecurity & Infrastructure defense',
                'excerpt'     => 'Acquire hands-on training in network vulnerability audits, penetration testing, and ethical hacking.',
                'degree'      => 'B.Sc',
                'format'      => 'oncampus',
                'duration'    => '3 Years',
                'fee'         => '500000',
                'modules'     => 'Linux Administration, PenTesting, Cryptography, Firewall Security',
                'badge'       => 'Defense Track'
            ),
            array(
                'title'       => 'Cloud Engineering & DevOps Pipelines',
                'excerpt'     => 'Build automated application builds, container deployments, and manage secure cloud infrastructures.',
                'degree'      => 'HND',
                'format'      => 'online',
                'duration'    => '2 Years',
                'fee'         => '350000',
                'modules'     => 'Docker, Kubernetes, AWS, GitLab CI/CD, Terraform',
                'badge'       => 'Professional HND'
            )
        );

        foreach ( $default_courses as $c ) {
            $post_id = wp_insert_post( array(
                'post_title'   => $c['title'],
                'post_content' => $c['excerpt'],
                'post_excerpt' => $c['excerpt'],
                'post_status'  => 'publish',
                'post_type'    => 'liah_course',
            ) );
            if ( $post_id ) {
                update_post_meta( $post_id, 'liah_degree_type', $c['degree'] );
                update_post_meta( $post_id, 'liah_length_format', $c['format'] );
                update_post_meta( $post_id, 'liah_duration', $c['duration'] );
                update_post_meta( $post_id, 'liah_tuition_fee', $c['fee'] );
                update_post_meta( $post_id, 'liah_modules', $c['modules'] );
                update_post_meta( $post_id, 'liah_badge_text', $c['badge'] );
            }
        }
    }

    // 2. Seed Services CPT if empty
    $services_count = wp_count_posts( 'liah_service' );
    if ( ! isset( $services_count->publish ) || $services_count->publish == 0 ) {
        $default_services = array(
            array(
                'title'   => 'Custom Software Engineering',
                'content' => 'We design and construct scalable enterprise software, mobile apps, and robust API frameworks for global companies.',
                'icon'    => 'fa-laptop-code'
            ),
            array(
                'title'   => 'Corporate IT Training & Bootcamps',
                'content' => 'Upskill your workforce with hands-on, academy-led masterclasses on cloud, cybersecurity, and data analysis.',
                'icon'    => 'fa-chalkboard-teacher'
            ),
            array(
                'title'   => 'Network Defense & Infrastructure Audits',
                'content' => 'Secure your corporate assets. We perform detailed security evaluations, network setups, and vulnerability logs.',
                'icon'    => 'fa-shield-halved'
            )
        );

        foreach ( $default_services as $s ) {
            $post_id = wp_insert_post( array(
                'post_title'   => $s['title'],
                'post_content' => $s['content'],
                'post_status'  => 'publish',
                'post_type'    => 'liah_service',
            ) );
            if ( $post_id ) {
                update_post_meta( $post_id, 'liah_service_icon', $s['icon'] );
            }
        }
    }
}
add_action( 'after_switch_theme', 'liah_seed_default_posts' );

/* ==========================================================================
   6. PORTAL AJAX CONTROLLERS (Student signup, upload and login)
   ========================================================================== */

// 1. AJAX Student Registration (Sign-up) Handler
function liah_handle_student_registration() {
    // Verify nonce for security
    check_ajax_referer( 'liah-portal-nonce', 'nonce' );

    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';

    // Retrieve and sanitize fields
    $full_name     = sanitize_text_field( $_POST['fullname'] );
    $email         = sanitize_email( $_POST['email'] );
    $password      = $_POST['password'];
    $phone         = sanitize_text_field( $_POST['phone'] );
    $degree_type   = sanitize_text_field( $_POST['degree_type'] );
    $program_type  = sanitize_text_field( $_POST['program_type'] );
    $study_format  = sanitize_text_field( $_POST['study_format'] );

    // Validations
    if ( empty( $full_name ) || empty( $email ) || empty( $password ) || empty( $phone ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Please complete all required fields.', 'liah-academy' ) ) );
    }

    if ( ! is_email( $email ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Please provide a valid email address.', 'liah-academy' ) ) );
    }

    // Check if email already registered
    $existing = $wpdb->get_var( $wpdb->prepare(
        "SELECT id FROM $table_name WHERE email = %s",
        $email
    ) );
    if ( $existing ) {
        wp_send_json_error( array( 'message' => esc_html__( 'This email is already registered. Please log in instead.', 'liah-academy' ) ) );
    }

    // Handle document upload (single or multiple)
    if ( empty( $_FILES['admission_doc'] ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Please upload the required PDF/Word document.', 'liah-academy' ) ) );
    }

    $uploaded_files = $_FILES['admission_doc'];
    $document_urls = array();
    
    if ( ! function_exists( 'wp_handle_upload' ) ) {
        require_once( ABSPATH . 'wp-admin/includes/file.php' );
    }

    $upload_overrides = array( 'test_form' => false );

    if ( is_array( $uploaded_files['name'] ) ) {
        $file_count = count( $uploaded_files['name'] );
        for ( $i = 0; $i < $file_count; $i++ ) {
            if ( $uploaded_files['error'][$i] !== UPLOAD_ERR_OK ) {
                continue;
            }
            $file = array(
                'name'     => $uploaded_files['name'][$i],
                'type'     => $uploaded_files['type'][$i],
                'tmp_name' => $uploaded_files['tmp_name'][$i],
                'error'    => $uploaded_files['error'][$i],
                'size'     => $uploaded_files['size'][$i],
            );
            $movefile = wp_handle_upload( $file, $upload_overrides );
            if ( $movefile && ! isset( $movefile['error'] ) ) {
                $document_urls[] = $movefile['url'];
            }
        }
    } else {
        $movefile = wp_handle_upload( $uploaded_files, $upload_overrides );
        if ( $movefile && ! isset( $movefile['error'] ) ) {
            $document_urls[] = $movefile['url'];
        }
    }

    if ( empty( $document_urls ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Document upload failed. Please try again.', 'liah-academy' ) ) );
    }

    $document_url = implode( ', ', $document_urls );

    // Hash password securely
    $hashed_password = password_hash( $password, PASSWORD_DEFAULT );

    // Insert record in Postgres/MySQL applications table
    $insert_result = $wpdb->insert(
        $table_name,
        array(
            'full_name'        => $full_name,
            'email'            => $email,
            'password'         => $hashed_password,
            'phone'            => $phone,
            'degree_type'      => $degree_type,
            'program_type'     => $program_type,
            'study_format'     => $study_format,
            'document_url'     => $document_url,
            'payment_status'   => 'Pending',
            'admission_status' => 'Under Review'
        ),
        array( '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s' )
    );

    if ( $insert_result === false ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Database registration failed. Please try again.', 'liah-academy' ) ) );
    }

    $application_id = $wpdb->insert_id;

    // Log the user into session
    $_SESSION['liah_student_id']    = $application_id;
    $_SESSION['liah_student_email'] = $email;
    $_SESSION['liah_student_name']  = $full_name;

    // Generate Fapshi link (if API configured) or fallback to simulator
    $payment_url = liah_get_fapshi_payment_link( $email, $application_id );

    wp_send_json_success( array(
        'message'  => esc_html__( 'Registration successful! Redirecting to Fapshi payment gateway...', 'liah-academy' ),
        'redirect' => $payment_url
    ) );
}
add_action( 'wp_ajax_nopriv_liah_register_student', 'liah_handle_student_registration' );
add_action( 'wp_ajax_liah_register_student', 'liah_handle_student_registration' );

// Fapshi Integration Helper
function liah_get_fapshi_payment_link( $email, $student_id ) {
    $api_user = defined('FAPSHI_API_USER') ? FAPSHI_API_USER : 'mock_user';
    $api_key  = defined('FAPSHI_API_KEY') ? FAPSHI_API_KEY : 'mock_key';
    $sandbox  = defined('FAPSHI_SANDBOX') ? FAPSHI_SANDBOX : true;
    
    // If mock or not configured, return a mock redirect to our local Fapshi Simulator
    if ( $api_user === 'mock_user' || empty( $api_user ) ) {
        return home_url( '/admissions?fapshi_checkout=1&id=' . $student_id );
    }
    
    $url = $sandbox ? 'https://sandbox.fapshi.com/initiate-pay' : 'https://api.fapshi.com/initiate-pay';
    
    $payload = array(
        'amount'      => 10000, // 10,000 XAF Admission Fee
        'email'       => $email,
        'userId'      => 'student_' . $student_id,
        'externalId'  => 'liah_admission_' . $student_id . '_' . time(),
        'message'     => 'Liah Academy Admission Auditing Fee',
        'redirectUrl' => home_url( '/admissions?payment=success&id=' . $student_id )
    );
    
    $response = wp_remote_post( $url, array(
        'headers' => array(
            'Content-Type' => 'application/json',
            'apiuser'      => $api_user,
            'apikey'       => $api_key
        ),
        'body'    => json_encode( $payload ),
        'timeout' => 15
    ) );
    
    if ( is_wp_error( $response ) ) {
        return home_url( '/admissions?fapshi_checkout=1&id=' . $student_id );
    }
    
    $body = json_decode( wp_remote_retrieve_body( $response ) );
    return isset( $body->link ) ? $body->link : home_url( '/admissions?fapshi_checkout=1&id=' . $student_id );
}

// 2. AJAX Student Login (Check Application Status) Handler
function liah_handle_student_login() {
    check_ajax_referer( 'liah-portal-nonce', 'nonce' );

    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';

    $email    = sanitize_email( $_POST['email'] );
    $password = $_POST['password'];

    if ( empty( $email ) || empty( $password ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Please provide both email and password.', 'liah-academy' ) ) );
    }

    // Retrieve student credentials
    $student = $wpdb->get_row( $wpdb->prepare(
        "SELECT id, full_name, password FROM $table_name WHERE email = %s",
        $email
    ) );

    if ( ! $student || ! password_verify( $password, $student->password ) ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Invalid email or password credentials.', 'liah-academy' ) ) );
    }

    // Log the user into session
    $_SESSION['liah_student_id']    = $student->id;
    $_SESSION['liah_student_email'] = $email;
    $_SESSION['liah_student_name']  = $student->full_name;

    wp_send_json_success( array(
        'message'  => esc_html__( 'Login successful. Redirecting to dashboard...', 'liah-academy' ),
        'redirect' => true
    ) );
}
add_action( 'wp_ajax_nopriv_liah_portal_login', 'liah_handle_student_login' );
add_action( 'wp_ajax_liah_portal_login', 'liah_handle_student_login' );

// 3. AJAX Student Logout Handler
function liah_handle_student_logout() {
    check_ajax_referer( 'liah-portal-nonce', 'nonce' );

    // Clear session details
    unset( $_SESSION['liah_student_id'] );
    unset( $_SESSION['liah_student_email'] );
    unset( $_SESSION['liah_student_name'] );

    wp_send_json_success( array(
        'message' => esc_html__( 'Logged out successfully.', 'liah-academy' )
    ) );
}
add_action( 'wp_ajax_liah_portal_logout', 'liah_handle_student_logout' );
add_action( 'wp_ajax_nopriv_liah_portal_logout', 'liah_handle_student_logout' );

// 4. AJAX Course search filter endpoint
function liah_filter_courses() {
    $search = isset( $_GET['search'] ) ? sanitize_text_field( $_GET['search'] ) : '';
    $format = isset( $_GET['format'] ) ? sanitize_text_field( $_GET['format'] ) : 'all';

    $args = array(
        'post_type'      => 'liah_course',
        'posts_per_page' => -1,
        's'              => $search,
    );

    if ( $format !== 'all' ) {
        $args['meta_query'] = array(
            array(
                'key'     => 'liah_length_format',
                'value'   => $format,
                'compare' => '='
            )
        );
    }

    $query = new WP_Query( $args );
    $courses = array();

    if ( $query->have_posts() ) {
        while ( $query->have_posts() ) {
            $query->the_post();
            $id = get_the_ID();
            $courses[] = array(
                'title'       => get_the_title(),
                'excerpt'     => get_the_excerpt(),
                'degree'      => get_post_meta( $id, 'liah_degree_type', true ),
                'format'      => get_post_meta( $id, 'liah_length_format', true ),
                'duration'    => get_post_meta( $id, 'liah_duration', true ),
                'fee'         => number_format( (float) get_post_meta( $id, 'liah_tuition_fee', true ) ) . ' XAF',
                'modules'     => get_post_meta( $id, 'liah_modules', true ),
                'badge'       => get_post_meta( $id, 'liah_badge_text', true ) ? get_post_meta( $id, 'liah_badge_text', true ) : 'Module Track',
            );
        }
        wp_reset_postdata();
    }

    wp_send_json_success( $courses );
}
add_action( 'wp_ajax_liah_filter_courses', 'liah_filter_courses' );
add_action( 'wp_ajax_nopriv_liah_filter_courses', 'liah_filter_courses' );
