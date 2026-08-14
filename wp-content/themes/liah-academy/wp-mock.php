<?php
/**
 * Standalone WordPress Mock Environment
 *
 * Emulates core WordPress hooks, functions, and queries to run the Liah Academy
 * theme standalone on a standard local PHP built-in web server.
 */

define( 'ABSPATH', dirname( __FILE__ ) . '/' );
define( 'OBJECT', 'OBJECT' );

// Start PHP Session to trace portal log status
if ( ! session_id() ) {
    session_start();
}

// 1. Mock Translation, Formatting, and Sanitization
function __( $text, $domain = '' ) { return $text; }
function esc_html__( $text, $domain = '' ) { return $text; }
function esc_html( $text ) { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
function esc_attr( $text ) { return htmlspecialchars($text, ENT_QUOTES, 'UTF-8'); }
function esc_url( $url ) { return $url; }
function sanitize_text_field( $text ) { return htmlspecialchars(trim($text), ENT_QUOTES, 'UTF-8'); }
function sanitize_email( $email ) { return filter_var(trim($email), FILTER_SANITIZE_EMAIL); }
function is_email( $email ) { return filter_var($email, FILTER_VALIDATE_EMAIL) !== false; }

// 2. Mock routing and assets
function liah_is_preview_mode() {
    return (strpos($_SERVER['SCRIPT_NAME'], 'preview.php') !== false);
}

function home_url( $path = '/' ) {
    $base = liah_is_preview_mode() ? 'preview.php' : 'index.php';
    if ( $path === '/' ) return $base;
    
    // Trim slashes and format to query param
    $page = trim( $path, '/' );
    // Handle anchor links
    if ( strpos( $page, '#' ) !== false ) {
        $parts = explode( '#', $page );
        return $base . '?page=' . $parts[0] . '#' . $parts[1];
    }
    
    return $base . '?page=' . $page;
}

function get_template_directory_uri() {
    return liah_is_preview_mode() ? 'wp-content/themes/liah-academy' : '.';
}

function language_attributes() {
    echo 'lang="en-US"';
}

function bloginfo( $show = '' ) {
    if ( $show === 'charset' ) echo 'UTF-8';
}

function body_class() {
    $page = isset( $_GET['page'] ) ? sanitize_text_field( $_GET['page'] ) : 'home';
    echo 'class="' . esc_attr( $page ) . ' standalone-preview"';
}

function wp_body_open() {}

function wp_head() {
    $theme_uri = get_template_directory_uri();
    ?>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="<?php echo $theme_uri; ?>/style.css">
    <?php
}

function wp_footer() {
    $theme_uri = get_template_directory_uri();
    ?>
    <script>
        // Define global parameters for mock AJAX operations
        const liahSettings = {
            ajaxUrl: '<?php echo $theme_uri; ?>/wp-mock-ajax.php',
            nonce: 'mock-security-nonce-123',
            themeUrl: '<?php echo $theme_uri; ?>'
        };
    </script>
    <script src="<?php echo $theme_uri; ?>/assets/js/main.js"></script>
    <?php
}

function get_header() {
    include 'header.php';
}

function get_footer() {
    include 'footer.php';
}

// 3. Mock WordPress Database Class to avoid PostgreSQL errors
class MockWPDB {
    public $prefix = 'wp_';
    public $insert_id = 0;

    public function get_var( $query ) { return null; }
    public function get_row( $query, $output = OBJECT ) {
        // Mock application data for dashboard previews
        if ( isset( $_SESSION['liah_student_id'] ) ) {
            return (object) array(
                'id'               => $_SESSION['liah_student_id'],
                'full_name'        => $_SESSION['liah_student_name'],
                'email'            => $_SESSION['liah_student_email'],
                'phone'            => isset($_SESSION['liah_student_phone']) ? $_SESSION['liah_student_phone'] : '+237 677 000 000',
                'degree_type'      => isset($_SESSION['liah_student_degree']) ? $_SESSION['liah_student_degree'] : 'bsc',
                'program_type'     => isset($_SESSION['liah_student_program']) ? $_SESSION['liah_student_program'] : 'Software Engineering',
                'study_format'     => isset($_SESSION['liah_student_format']) ? $_SESSION['liah_student_format'] : 'oncampus',
                'document_url'     => '#',
                'payment_status'   => 'Pending',
                'admission_status' => isset($_SESSION['liah_student_status']) ? $_SESSION['liah_student_status'] : 'Under Review',
                'submission_date'  => date('Y-m-d H:i:s')
            );
        }
        return null;
    }
    public function update( $table, $data, $where, $format = null, $where_format = null ) {
        if ( isset( $data['payment_status'] ) && $data['payment_status'] === 'Paid' ) {
            $_SESSION['liah_student_status'] = 'Approved';
        }
        return true;
    }
    public function insert( $table, $data, $format = null ) {
        // Return true representing successful mock registration
        return true;
    }
    public function prepare( $query, ...$args ) {
        return vsprintf( str_replace('%s', "'%s'", $query), $args );
    }
}
$wpdb = new MockWPDB();

// 4. Mock WordPress WP_Query for custom post types
class WP_Query {
    public $posts = array();
    private $current_post = -1;
    public $post_count = 0;

    public function __construct( $args = array() ) {
        $post_type = isset( $args['post_type'] ) ? $args['post_type'] : 'post';
        
        if ( $post_type === 'liah_course' ) {
            $this->posts = array(
                (object) array(
                    'ID'           => 1,
                    'post_title'   => 'Software Engineering Accelerator',
                    'post_content' => 'Master modern web development, algorithms, and databases to build corporate-level products.',
                    'post_excerpt' => 'Master modern web development, algorithms, and databases.',
                    'degree'       => 'btech',
                    'format'       => 'fulltime',
                    'duration'     => '3 Years',
                    'fee'          => '450000',
                    'modules'      => 'Python, JavaScript, Django, PostgreSQL, Algorithms',
                    'badge'        => 'Academic Program'
                ),
                (object) array(
                    'ID'           => 2,
                    'post_title'   => 'Cybersecurity & Infrastructure Defense',
                    'post_content' => 'Acquire hands-on training in network vulnerability audits, penetration testing, and ethical hacking.',
                    'post_excerpt' => 'Acquire hands-on training in network vulnerability audits.',
                    'degree'       => 'bsc',
                    'format'       => 'oncampus',
                    'duration'     => '3 Years',
                    'fee'          => '500000',
                    'modules'      => 'Linux Administration, PenTesting, Cryptography, Firewall Security',
                    'badge'        => 'Defense Track'
                ),
                (object) array(
                    'ID'           => 3,
                    'post_title'   => 'Cloud Engineering & DevOps Pipelines',
                    'post_content' => 'Build automated application builds, container deployments, and manage secure cloud infrastructures.',
                    'post_excerpt' => 'Build automated application builds and container deployments.',
                    'degree'       => 'hnd',
                    'format'       => 'online',
                    'duration'     => '2 Years',
                    'fee'          => '350000',
                    'modules'      => 'Docker, Kubernetes, AWS, GitLab CI/CD, Terraform',
                    'badge'        => 'Professional HND'
                )
            );
        } elseif ( $post_type === 'liah_service' ) {
            $this->posts = array(
                (object) array(
                    'ID'           => 10,
                    'post_title'   => 'Custom Software Engineering',
                    'post_content' => 'We design and construct scalable enterprise software, mobile apps, and robust API frameworks for global companies.',
                    'icon'         => 'fa-laptop-code'
                ),
                (object) array(
                    'ID'           => 11,
                    'post_title'   => 'Corporate IT Training & Bootcamps',
                    'post_content' => 'Upskill your workforce with hands-on, academy-led masterclasses on cloud, cybersecurity, and data analysis.',
                    'icon'         => 'fa-chalkboard-teacher'
                ),
                (object) array(
                    'ID'           => 12,
                    'post_title'   => 'Network Defense & Infrastructure Audits',
                    'post_content' => 'Secure your corporate assets. We perform detailed security evaluations, network setups, and vulnerability logs.',
                    'icon'         => 'fa-shield-halved'
                )
            );
        }
        $this->post_count = count( $this->posts );
    }

    public function have_posts() {
        return ( $this->current_post + 1 < $this->post_count );
    }

    public function the_post() {
        $this->current_post++;
        $GLOBALS['post'] = $this->posts[$this->current_post];
    }
}

function get_the_ID() {
    global $post;
    return $post->ID;
}

function get_the_title() {
    global $post;
    return $post->post_title;
}

function get_the_excerpt() {
    global $post;
    return $post->post_excerpt;
}

function the_title() {
    echo get_the_title();
}

function the_content() {
    global $post;
    echo $post->post_content;
}

function get_post_meta( $post_id, $key, $single = true ) {
    global $post;
    if ( $key === 'liah_degree_type' ) return isset( $post->degree ) ? $post->degree : '';
    if ( $key === 'liah_length_format' ) return isset( $post->format ) ? $post->format : '';
    if ( $key === 'liah_duration' ) return isset( $post->duration ) ? $post->duration : '';
    if ( $key === 'liah_tuition_fee' ) return isset( $post->fee ) ? $post->fee : '';
    if ( $key === 'liah_modules' ) return isset( $post->modules ) ? $post->modules : '';
    if ( $key === 'liah_badge_text' ) return isset( $post->badge ) ? $post->badge : '';
    if ( $key === 'liah_service_icon' ) return isset( $post->icon ) ? $post->icon : '';
    return '';
}

function wp_reset_postdata() {
    unset( $GLOBALS['post'] );
}

function get_search_query() {
    return isset( $_GET['s'] ) ? sanitize_text_field( $_GET['s'] ) : '';
}

function is_front_page() {
    return ! isset( $_GET['page'] ) || $_GET['page'] === 'home';
}
