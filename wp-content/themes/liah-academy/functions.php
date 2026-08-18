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
        $is_pgsql = ( strpos( get_class( $wpdb ), 'pgsql' ) !== false || defined( 'PG4WP_ROOT' ) );
        if ( $is_pgsql ) {
            $sql = "CREATE SEQUENCE IF NOT EXISTS {$table_name}_seq;
            CREATE TABLE $table_name (
                id bigint NOT NULL DEFAULT nextval('{$table_name}_seq'::text) PRIMARY KEY,
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
                submission_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
            );";
        } else {
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
                PRIMARY KEY (id)
            ) ENGINE=InnoDB;";
        }
        $wpdb->query( $sql );
    }

    $reviews_table = $wpdb->prefix . 'liah_reviews';
    $reviews_query = $wpdb->prepare(
        "SELECT COUNT(*) FROM information_schema.tables WHERE table_name = %s",
        $reviews_table
    );
    $reviews_table_exists = $wpdb->get_var( $reviews_query );
    
    if ( ! $reviews_table_exists ) {
        $is_pgsql = ( strpos( get_class( $wpdb ), 'pgsql' ) !== false || defined( 'PG4WP_ROOT' ) );
        if ( $is_pgsql ) {
            $sql_reviews = "CREATE SEQUENCE IF NOT EXISTS {$reviews_table}_seq;
            CREATE TABLE $reviews_table (
                id bigint NOT NULL DEFAULT nextval('{$reviews_table}_seq'::text) PRIMARY KEY,
                reviewer_name varchar(100) NOT NULL,
                reviewer_role varchar(100) NOT NULL,
                rating int NOT NULL,
                review_text text NOT NULL,
                submission_date timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
            );";
        } else {
            $sql_reviews = "CREATE TABLE $reviews_table (
                id bigint(20) NOT NULL AUTO_INCREMENT,
                reviewer_name varchar(100) NOT NULL,
                reviewer_role varchar(100) NOT NULL,
                rating int(11) NOT NULL,
                review_text text NOT NULL,
                submission_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
                PRIMARY KEY (id)
            ) ENGINE=InnoDB;";
        }
        $wpdb->query( $sql_reviews );
    }
}
add_action( 'init', 'liah_initialize_database' );

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

    // Send email notifications
    $admin_email = get_option( 'admin_email' );
    $subject_admin = '[Liah Academy] New Student Application Submitted';
    $message_admin = "Hello Admin,\n\n" .
                     "A new student application has been submitted:\n" .
                     "- Name: $full_name\n" .
                     "- Email: $email\n" .
                     "- Phone: $phone\n" .
                     "- Degree Preference: $degree_type\n" .
                     "- Program Preference: $program_type\n\n" .
                     "You can review and update their status in the Admissions Dashboard:\n" .
                     home_url( '/wp-admin/admin.php?page=liah-admissions' ) . "\n\n" .
                     "Regards,\nLiah Academy System";
    
    wp_mail( $admin_email, $subject_admin, $message_admin );

    $subject_student = 'Welcome to Liah Academy - Application Received';
    $message_student = "Dear $full_name,\n\n" .
                       "Thank you for registering at Liah Academy! Your application has been successfully received.\n\n" .
                       "Here is a summary of your choice:\n" .
                       "- Selected Program: $program_type\n" .
                       "- Study Format: $study_format\n\n" .
                       "Our academic board is currently reviewing your uploaded documents. You can log into your portal at any time to monitor your status:\n" .
                       home_url( '/admissions' ) . "\n\n" .
                       "Best regards,\nLiah Academy Admissions Team";
                       
    wp_mail( $email, $subject_student, $message_student );

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

/**
 * Fetch Liah Academy Google reviews dynamically or fall back to high-quality defaults.
 */
function liah_fetch_google_reviews() {
    $cached = get_transient( 'liah_google_reviews' );
    if ( false !== $cached ) {
        return $cached;
    }

    $default_data = array(
        'rating'             => 4.9,
        'user_ratings_total' => 85,
        'reviews'            => array(
            array(
                'author_name'               => 'Steddy Lyonga',
                'rating'                    => 5,
                'text'                      => 'Liah Academy is Buea\'s leading tech hub. Their combined curriculum and company projects gave me hands-on database experience that got me hired as a web engineer.',
                'profile_photo_url'        => '',
                'relative_time_description' => '2 weeks ago',
            ),
            array(
                'author_name'               => 'Mirabelle B.',
                'rating'                    => 5,
                'text'                      => 'The cybersecurity labs at Liah are state-of-the-art. Instructors are developers themselves, so you learn real deployment workflows instead of just theory.',
                'profile_photo_url'        => '',
                'relative_time_description' => '1 month ago',
            ),
            array(
                'author_name'               => 'Nfor Collins',
                'rating'                    => 5,
                'text'                      => 'Outstanding developer-grade environment. Worked with their corporate dev team on a PostgreSQL deployment.',
                'profile_photo_url'        => '',
                'relative_time_description' => '3 months ago',
            )
        )
    );

    $api_key  = defined( 'GOOGLE_PLACES_API_KEY' ) ? GOOGLE_PLACES_API_KEY : '';
    $place_id = defined( 'GOOGLE_PLACE_ID' ) ? GOOGLE_PLACE_ID : '';

    if ( empty( $api_key ) || empty( $place_id ) ) {
        // Cache defaults for 12 hours
        set_transient( 'liah_google_reviews', $default_data, 12 * HOUR_IN_SECONDS );
        return $default_data;
    }

    $url = sprintf(
        'https://maps.googleapis.com/maps/api/place/details/json?place_id=%s&fields=reviews,rating,user_ratings_total&key=%s',
        urlencode( $place_id ),
        urlencode( $api_key )
    );

    $response = wp_remote_get( $url );
    if ( is_wp_error( $response ) ) {
        return $default_data;
    }

    $body = wp_remote_retrieve_body( $response );
    $json = json_decode( $body, true );

    if ( ! empty( $json['result'] ) ) {
        $result = $json['result'];
        $reviews = array();
        
        if ( ! empty( $result['reviews'] ) ) {
            foreach ( $result['reviews'] as $rev ) {
                $reviews[] = array(
                    'author_name'               => isset( $rev['author_name'] ) ? sanitize_text_field( $rev['author_name'] ) : '',
                    'rating'                    => isset( $rev['rating'] ) ? intval( $rev['rating'] ) : 5,
                    'text'                      => isset( $rev['text'] ) ? sanitize_textarea_field( $rev['text'] ) : '',
                    'profile_photo_url'        => isset( $rev['profile_photo_url'] ) ? esc_url_raw( $rev['profile_photo_url'] ) : '',
                    'relative_time_description' => isset( $rev['relative_time_description'] ) ? sanitize_text_field( $rev['relative_time_description'] ) : '',
                );
            }
        }

        $data = array(
            'rating'             => isset( $result['rating'] ) ? floatval( $result['rating'] ) : 4.9,
            'user_ratings_total' => isset( $result['user_ratings_total'] ) ? intval( $result['user_ratings_total'] ) : 85,
            'reviews'            => ! empty( $reviews ) ? $reviews : $default_data['reviews'],
        );

        set_transient( 'liah_google_reviews', $data, 12 * HOUR_IN_SECONDS );
        return $data;
    }

    return $default_data;
}

// AJAX Website Review Submission Endpoint
function liah_handle_submit_review() {
    check_ajax_referer( 'liah-portal-nonce', 'nonce' );

    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_reviews';

    $name    = sanitize_text_field( $_POST['name'] );
    $role    = sanitize_text_field( $_POST['role'] );
    $rating  = intval( $_POST['rating'] );
    $comment = sanitize_textarea_field( $_POST['comment'] );

    if ( empty( $name ) || empty( $role ) || empty( $comment ) || $rating < 1 || $rating > 5 ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Please fill out all fields correctly.', 'liah-academy' ) ) );
    }

    $insert_result = $wpdb->insert(
        $table_name,
        array(
            'reviewer_name' => $name,
            'reviewer_role' => $role,
            'rating'        => $rating,
            'review_text'   => $comment
        ),
        array( '%s', '%s', '%d', '%s' )
    );

    if ( $insert_result === false ) {
        wp_send_json_error( array( 'message' => esc_html__( 'Database error: Could not submit review.', 'liah-academy' ) ) );
    }

    wp_send_json_success( array(
        'message' => esc_html__( 'Review submitted successfully!', 'liah-academy' )
    ) );
}
add_action( 'wp_ajax_nopriv_liah_submit_review', 'liah_handle_submit_review' );
add_action( 'wp_ajax_liah_submit_review', 'liah_handle_submit_review' );

// Admissions Admin Dashboard Page
function liah_admissions_admin_menu() {
    add_menu_page(
        __( 'Liah Admissions', 'liah-academy' ),
        __( 'Admissions', 'liah-academy' ),
        'manage_options',
        'liah-admissions',
        'liah_render_admissions_admin_page',
        'dashicons-welcome-learn-more',
        6
    );
}
add_action( 'admin_menu', 'liah_admissions_admin_menu' );

function liah_render_admissions_admin_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';

    // Handle Actions (Status Updates)
    if ( isset( $_POST['liah_action'] ) && check_admin_referer( 'liah_admin_action', 'liah_nonce' ) ) {
        $app_id = intval( $_POST['app_id'] );
        if ( $_POST['liah_action'] === 'update_status' ) {
            $new_status = sanitize_text_field( $_POST['status'] );
            $wpdb->update( $table_name, array( 'admission_status' => $new_status ), array( 'id' => $app_id ) );
            
            // Send status update notification email to the student
            $student_row = $wpdb->get_row( $wpdb->prepare( "SELECT * FROM $table_name WHERE id = %d", $app_id ) );
            if ( $student_row ) {
                $subject = '[Liah Academy] Application Review Status Update';
                if ( $new_status === 'Approved' ) {
                    $message = "Dear {$student_row->full_name},\n\n" .
                               "Congratulations! Your application to Liah Academy has been reviewed and APPROVED by the academic board.\n\n" .
                               "Please log into your portal dashboard to pay the admission auditing fee (10,000 XAF) and begin your enrollment process:\n" .
                               home_url( '/admissions' ) . "\n\n" .
                               "Best regards,\nLiah Academy Admissions Team";
                } elseif ( $new_status === 'Rejected' ) {
                    $message = "Dear {$student_row->full_name},\n\n" .
                               "Thank you for your interest in Liah Academy. After reviewing your documents, the academic board has decided not to move forward with your application at this time.\n\n" .
                               "If you have any questions or want to appeal this decision, please reply directly to this email.\n\n" .
                               "Best regards,\nLiah Academy Admissions Team";
                } else {
                    $message = "Dear {$student_row->full_name},\n\n" .
                               "Your application status has been updated to: $new_status.\n\n" .
                               "You can track your timeline at:\n" .
                               home_url( '/admissions' ) . "\n\n" .
                               "Best regards,\nLiah Academy Admissions Team";
                }
                wp_mail( $student_row->email, $subject, $message );
            }
            
            echo '<div class="notice notice-success is-dismissible"><p>Application status updated successfully.</p></div>';
        } elseif ( $_POST['liah_action'] === 'update_payment' ) {
            $new_payment = sanitize_text_field( $_POST['payment'] );
            $wpdb->update( $table_name, array( 'payment_status' => $new_payment ), array( 'id' => $app_id ) );
            echo '<div class="notice notice-success is-dismissible"><p>Payment status updated successfully.</p></div>';
        }
    }

    // Fetch all applications
    $applications = $wpdb->get_results( "SELECT * FROM $table_name ORDER BY id DESC" );

    // Count stats
    $total = count( $applications );
    $pending = 0;
    $approved = 0;
    $rejected = 0;
    foreach ( $applications as $app ) {
        if ( $app->admission_status === 'Approved' ) {
            $approved++;
        } elseif ( $app->admission_status === 'Rejected' ) {
            $rejected++;
        } else {
            $pending++;
        }
    }
    ?>
    <div class="wrap">
        <h1 class="wp-heading-inline">Liah Academy - Student Admissions Manager</h1>
        <hr class="wp-header-end">

        <!-- Stats Overview Cards -->
        <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin: 20px 0;">
            <div style="background: #fff; padding: 20px; border-left: 4px solid #0073aa; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px;">
                <span style="font-size: 14px; color: #666; font-weight: 600;">Total Registrations</span>
                <div style="font-size: 28px; font-weight: 700; color: #333; margin-top: 5px;"><?php echo $total; ?></div>
            </div>
            <div style="background: #fff; padding: 20px; border-left: 4px solid #f0b849; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px;">
                <span style="font-size: 14px; color: #666; font-weight: 600;">Pending Review</span>
                <div style="font-size: 28px; font-weight: 700; color: #333; margin-top: 5px;"><?php echo $pending; ?></div>
            </div>
            <div style="background: #fff; padding: 20px; border-left: 4px solid #46b450; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px;">
                <span style="font-size: 14px; color: #666; font-weight: 600;">Approved</span>
                <div style="font-size: 28px; font-weight: 700; color: #333; margin-top: 5px;"><?php echo $approved; ?></div>
            </div>
            <div style="background: #fff; padding: 20px; border-left: 4px solid #dc3232; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px;">
                <span style="font-size: 14px; color: #666; font-weight: 600;">Rejected</span>
                <div style="font-size: 28px; font-weight: 700; color: #333; margin-top: 5px;"><?php echo $rejected; ?></div>
            </div>
        </div>

        <!-- Main Applications Table -->
        <table class="wp-list-table widefat fixed striped table-view-list" style="margin-top: 20px;">
            <thead>
                <tr>
                    <th style="width: 50px;">ID</th>
                    <th style="font-weight: 700;">Candidate Info</th>
                    <th style="font-weight: 700;">Academic Preference</th>
                    <th style="font-weight: 700;">Uploaded Docs</th>
                    <th style="font-weight: 700; width: 120px;">Payment Status</th>
                    <th style="font-weight: 700; width: 150px;">Admission Status</th>
                    <th style="font-weight: 700;">Submission Date</th>
                </tr>
            </thead>
            <tbody>
                <?php if ( empty( $applications ) ) : ?>
                    <tr>
                        <td colspan="7" style="text-align: center; padding: 20px; color: #666;">No applications found.</td>
                    </tr>
                <?php else : ?>
                    <?php foreach ( $applications as $app ) : ?>
                        <tr>
                            <td><?php echo $app->id; ?></td>
                            <td>
                                <strong><?php echo esc_html( $app->full_name ); ?></strong><br>
                                <span style="font-size: 12px; color: #555;">Email: <?php echo esc_html( $app->email ); ?></span><br>
                                <span style="font-size: 12px; color: #555;">Phone: <?php echo esc_html( $app->phone ); ?></span>
                            </td>
                            <td>
                                <span style="text-transform: uppercase; font-weight: 600; font-size: 11px; background: #eee; padding: 2px 6px; border-radius: 3px;"><?php echo esc_html( $app->degree_type ); ?></span>
                                <div style="margin-top: 4px; font-size: 13px; font-weight: 500; color: #222;"><?php echo esc_html( $app->program_type ); ?></div>
                                <span style="font-size: 12px; color: #666;">Format: <?php echo esc_html( $app->study_format ); ?></span>
                            </td>
                            <td>
                                <?php
                                $docs = explode( ',', $app->document_url );
                                $idx = 1;
                                foreach ( $docs as $doc ) {
                                    $doc = trim( $doc );
                                    if ( ! empty( $doc ) ) {
                                        echo '<a href="' . esc_url( $doc ) . '" target="_blank" class="button button-small" style="margin-right: 4px; margin-bottom: 4px;"><i class="dashicons dashicons-media-document" style="font-size:16px; width:16px; height:16px; margin-top:2px;"></i> Doc ' . $idx++ . '</a>';
                                    }
                                }
                                ?>
                            </td>
                            <td>
                                <form method="post" style="display:inline-block;">
                                    <?php wp_nonce_field( 'liah_admin_action', 'liah_nonce' ); ?>
                                    <input type="hidden" name="app_id" value="<?php echo $app->id; ?>">
                                    <input type="hidden" name="liah_action" value="update_payment">
                                    <select name="payment" onchange="this.form.submit()" style="font-size: 12px; padding: 2px; <?php echo $app->payment_status === 'Paid' ? 'color:#46b450; font-weight:600;' : 'color:#d54e21;'; ?>">
                                        <option value="Pending" <?php selected( $app->payment_status, 'Pending' ); ?>>Pending</option>
                                        <option value="Paid" <?php selected( $app->payment_status, 'Paid' ); ?>>Paid</option>
                                    </select>
                                </form>
                            </td>
                            <td>
                                <form method="post" style="display:inline-block;">
                                    <?php wp_nonce_field( 'liah_admin_action', 'liah_nonce' ); ?>
                                    <input type="hidden" name="app_id" value="<?php echo $app->id; ?>">
                                    <input type="hidden" name="liah_action" value="update_status">
                                    <select name="status" onchange="this.form.submit()" style="font-size: 12px; padding: 2px; <?php echo $app->admission_status === 'Approved' ? 'color:#46b450; font-weight:600;' : ($app->admission_status === 'Rejected' ? 'color:#dc3232;' : 'color:#f0b849;'); ?>">
                                        <option value="Under Review" <?php selected( $app->admission_status, 'Under Review' ); ?>>Under Review</option>
                                        <option value="Approved" <?php selected( $app->admission_status, 'Approved' ); ?>>Approved</option>
                                        <option value="Rejected" <?php selected( $app->admission_status, 'Rejected' ); ?>>Rejected</option>
                                    </select>
                                </form>
                            </td>
                            <td><?php echo esc_html( date( 'M d, Y @ H:i', strtotime( $app->submission_date ) ) ); ?></td>
                        </tr>
                    <?php endforeach; ?>
                <?php endif; ?>
            </tbody>
        </table>
    </div>
    <?php
}
