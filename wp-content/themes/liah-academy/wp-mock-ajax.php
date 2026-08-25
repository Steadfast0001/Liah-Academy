<?php
/**
 * Standalone WordPress Mock AJAX Controller
 *
 * Implements AJAX mocks to handle student applications submissions, document uploads,
 * logins, and session management for local previews.
 */

session_start();
header( 'Content-Type: application/json' );

// Retrieve request variables
$action = isset( $_POST['action'] ) ? $_POST['action'] : '';

switch ( $action ) {
    
    // 1. Mock Registration Form Submit
    case 'liah_register_student':
        $fullname = isset( $_POST['fullname'] ) ? htmlspecialchars(trim($_POST['fullname'])) : '';
        $email    = isset( $_POST['email'] ) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
        $password = isset( $_POST['password'] ) ? $_POST['password'] : '';
        $phone    = isset( $_POST['phone'] ) ? htmlspecialchars(trim($_POST['phone'])) : '';
        
        $degree   = isset( $_POST['degree_type'] ) ? htmlspecialchars($_POST['degree_type']) : 'bsc';
        $program  = isset( $_POST['program_type'] ) ? htmlspecialchars($_POST['program_type']) : 'Software Engineering';
        $format   = isset( $_POST['study_format'] ) ? htmlspecialchars($_POST['study_format']) : 'oncampus';

        if ( empty( $fullname ) || empty( $email ) || empty( $password ) || empty( $phone ) ) {
            echo json_encode( array(
                'success' => false,
                'data'    => array( 'message' => 'Please fill in all required credentials.' )
            ) );
            exit;
        }

        // Simulate save to session variables as a mock database
        $_SESSION['liah_student_id']     = rand( 1000, 9999 );
        $_SESSION['liah_student_name']   = $fullname;
        $_SESSION['liah_student_email']  = $email;
        $_SESSION['liah_student_phone']  = $phone;
        $_SESSION['liah_student_degree'] = $degree;
        $_SESSION['liah_student_program']= $program;
        $_SESSION['liah_student_format'] = $format;
        $_SESSION['liah_student_status'] = 'Under Review';

        echo json_encode( array(
            'success' => true,
            'data'    => array(
                'message'  => 'Registration successful! Redirecting to secure payment...',
                'redirect' => 'preview.php?page=admissions&campay_checkout=1&id=' . $_SESSION['liah_student_id']
            )
        ) );
        exit;

    // 2. Mock Portal Login Check
    case 'liah_portal_login':
        $email    = isset( $_POST['email'] ) ? filter_var(trim($_POST['email']), FILTER_SANITIZE_EMAIL) : '';
        $password = isset( $_POST['password'] ) ? $_POST['password'] : '';

        if ( empty( $email ) || empty( $password ) ) {
            echo json_encode( array(
                'success' => false,
                'data'    => array( 'message' => 'Please input your portal credentials.' )
            ) );
            exit;
        }

        // Mock verification: check if matching simulated registration
        if ( isset( $_SESSION['liah_student_email'] ) && $_SESSION['liah_student_email'] === $email ) {
            $_SESSION['liah_student_id'] = isset( $_SESSION['liah_student_id'] ) ? $_SESSION['liah_student_id'] : rand( 1000, 9999 );
        } else {
            // Default mock login if no previous session exists (for quick testing)
            $_SESSION['liah_student_id']     = rand( 1000, 9999 );
            $_SESSION['liah_student_name']   = 'Steddy Lyonga';
            $_SESSION['liah_student_email']  = $email;
            $_SESSION['liah_student_phone']  = '+237 670 112 233';
            $_SESSION['liah_student_degree'] = 'bsc';
            $_SESSION['liah_student_program']= 'Cybersecurity & Defense Track';
            $_SESSION['liah_student_format'] = 'oncampus';
            $_SESSION['liah_student_status'] = 'Approved'; // Mock approve status for verification test
        }

        echo json_encode( array(
            'success' => true,
            'data'    => array(
                'message'  => 'Credentials approved. Booting portal dashboard...',
                'redirect' => true
            )
        ) );
        exit;

    // 3. Mock Portal Logout Check
    case 'liah_portal_logout':
        // Destroy mock session variables
        unset( $_SESSION['liah_student_id'] );
        unset( $_SESSION['liah_student_name'] );
        unset( $_SESSION['liah_student_email'] );
        unset( $_SESSION['liah_student_phone'] );
        unset( $_SESSION['liah_student_degree'] );
        unset( $_SESSION['liah_student_program'] );
        unset( $_SESSION['liah_student_format'] );
        unset( $_SESSION['liah_student_status'] );

        echo json_encode( array(
            'success' => true,
            'data'    => array( 'message' => 'Session terminated.' )
        ) );
        exit;

    default:
        echo json_encode( array(
            'success' => false,
            'data'    => array( 'message' => 'Action hook not registered in mock bootstrap.' )
        ) );
        exit;
}
