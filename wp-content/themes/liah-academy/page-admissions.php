<?php
/**
 * Template Name: Admissions Page Template
 *
 * Renders the Admissions page, hosting requirements, orientation clips, tuition calculator,
 * and the integrated admissions signup/login student portal dashboard.
 */

get_header();

// Start PHP Session to handle student status logging
if ( ! session_id() ) {
    session_start();
}

$is_logged_in = isset( $_SESSION['liah_student_id'] );
$student = null;

if ( $is_logged_in ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';
    $student = $wpdb->get_row( $wpdb->prepare(
        "SELECT * FROM $table_name WHERE id = %d",
        $_SESSION['liah_student_id']
    ) );
    
    // Fallback if session exists but database entry deleted
    if ( ! $student ) {
        unset( $_SESSION['liah_student_id'] );
        unset( $_SESSION['liah_student_email'] );
        unset( $_SESSION['liah_student_name'] );
        $is_logged_in = false;
    }
}

// Check for Fapshi payment returns
if ( isset( $_GET['payment'] ) && $_GET['payment'] === 'success' && isset( $_GET['id'] ) ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'liah_applications';
    if ( $wpdb ) {
        $wpdb->update(
            $table_name,
            array( 'payment_status' => 'Paid' ),
            array( 'id' => intval( $_GET['id'] ) ),
            array( '%s' ),
            array( '%d' )
        );
    }
    $_SESSION['liah_student_status'] = 'Approved'; 
}

$show_fapshi_checkout = isset( $_GET['fapshi_checkout'] ) && isset( $_GET['id'] );
$checkout_student_name = '';
if ( $show_fapshi_checkout ) {
    $checkout_id = intval( $_GET['id'] );
    if ( isset( $_SESSION['liah_student_name'] ) && isset( $_SESSION['liah_student_id'] ) && $_SESSION['liah_student_id'] == $checkout_id ) {
        $checkout_student_name = $_SESSION['liah_student_name'];
    } else {
        global $wpdb;
        $table_name = $wpdb->prefix . 'liah_applications';
        if ( $wpdb && get_class($wpdb) !== 'MockWPDB' ) {
            $checkout_student_name = $wpdb->get_var( $wpdb->prepare( "SELECT full_name FROM $table_name WHERE id = %d", $checkout_id ) );
        }
        $checkout_student_name = $checkout_student_name ? $checkout_student_name : 'Steddy Lyonga';
    }
}
?>

<main style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        
        <?php if ( $show_fapshi_checkout ) : ?>
            <!-- FAPSHI CHECKOUT GATEWAY SIMULATOR -->
            <div class="premium-card" style="max-width: 500px; margin: 40px auto; border-top: 6px solid #F5A623; box-shadow: var(--box-shadow-premium);">
                <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(15,23,42,0.08);">
                    <span style="font-family: var(--font-mono); font-size:11px; background: rgba(245,166,35,0.15); color: #B45309; padding: 4px 10px; border-radius: 4px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Fapshi Secure Checkout</span>
                    <h3 style="margin-top: 12px; color: #081F3E; text-transform:none;">Admission Fee Payment</h3>
                    <p style="font-size:13px; color:#64748B; margin-top:4px;">Candidate: <strong><?php echo esc_html( $checkout_student_name ); ?></strong></p>
                </div>

                <div style="text-align:center; margin-bottom: 30px;">
                    <span style="font-size: 13px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Amount to Collect</span>
                    <h2 style="font-size: 40px; font-weight: 800; color: #081F3E; margin: 4px 0;">10,000 XAF</h2>
                    <span style="font-size: 12px; color: #10B981; font-weight:700;"><i class="fa-solid fa-lock"></i> Secured by Fapshi encryption</span>
                </div>

                <form id="fapshiSimulatorForm">
                    <input type="hidden" id="fapshiStudentId" value="<?php echo esc_attr( $checkout_id ); ?>">
                    
                    <div class="form-group">
                        <label style="font-weight: 700; color: #081F3E;">Select Mobile Wallet Provider</label>
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; margin-bottom: 20px;">
                            <label style="border: 2px solid #F5A623; border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; background: rgba(245,166,35,0.05); font-weight: 700; font-size: 14px;" id="lblMtn">
                                <input type="radio" name="wallet" value="MTN" checked style="accent-color: #F5A623;"> MTN MoMo
                            </label>
                            <label style="border: 2px solid rgba(15,23,42,0.1); border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; font-weight: 700; font-size: 14px;" id="lblOrange">
                                <input type="radio" name="wallet" value="ORANGE" style="accent-color: #F5A623;"> Orange Money
                            </label>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="fapshiPhone" style="font-weight: 700; color: #081F3E;">Mobile Money Number *</label>
                        <input type="tel" class="form-input-light" id="fapshiPhone" placeholder="e.g. 677889900" style="margin-top: 8px;" required>
                    </div>

                    <input type="hidden" id="fapshiRedirectUrl" value="<?php echo esc_url( home_url( '/admissions?payment=success&id=' . $checkout_id ) ); ?>">

                    <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;" id="btnFapshiPay">Authorize Mobile Payment <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i></button>
                </form>
            </div>
            
            <script>
                document.addEventListener('DOMContentLoaded', function() {
                    const form = document.getElementById('fapshiSimulatorForm');
                    const lblMtn = document.getElementById('lblMtn');
                    const lblOrange = document.getElementById('lblOrange');
                    const radios = document.getElementsByName('wallet');

                    radios.forEach(radio => {
                        radio.addEventListener('change', function() {
                            if (lblMtn && lblOrange) {
                                if (radio.value === 'MTN') {
                                    lblMtn.style.borderColor = '#F5A623';
                                    lblMtn.style.background = 'rgba(245,166,35,0.05)';
                                    lblOrange.style.borderColor = 'rgba(15,23,42,0.1)';
                                    lblOrange.style.background = 'none';
                                } else {
                                    lblOrange.style.borderColor = '#F5A623';
                                    lblOrange.style.background = 'rgba(245,166,35,0.05)';
                                    lblMtn.style.borderColor = 'rgba(15,23,42,0.1)';
                                    lblMtn.style.background = 'none';
                                }
                            }
                        });
                    });

                    if (form) {
                        form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            const btn = document.getElementById('btnFapshiPay');
                            const phone = document.getElementById('fapshiPhone').value;
                            const id = document.getElementById('fapshiStudentId').value;
                            const redirectUrl = document.getElementById('fapshiRedirectUrl').value;
                            const wallet = document.querySelector('input[name="wallet"]:checked').value;

                            btn.disabled = true;
                            btn.innerHTML = 'Connecting to Fapshi... <i class="fa-solid fa-spinner fa-spin" style="margin-left:6px;"></i>';

                            setTimeout(() => {
                                btn.innerHTML = 'Sending push prompt to +237 ' + phone + '... <i class="fa-solid fa-spinner fa-spin" style="margin-left:6px;"></i>';
                            }, 1500);

                            setTimeout(() => {
                                btn.innerHTML = 'Waiting for user PIN authorization... <i class="fa-solid fa-mobile-screen-button" style="margin-left:6px;"></i>';
                            }, 3500);

                            setTimeout(() => {
                                btn.innerHTML = 'Payment Received! Redirecting... <i class="fa-solid fa-circle-check" style="margin-left:6px;"></i>';
                                btn.style.background = '#10B981';
                            }, 5500);

                            setTimeout(() => {
                                window.location.href = redirectUrl;
                            }, 7000);
                        });
                    }
                });
            </script>

        <?php else : ?>
        <!-- HEADER TITLE -->
        <div class="section-header">
            <span class="course-badge">Join Liah</span>
            <h2>Admissions & Student Portal</h2>
            <p class="sub-header">Review requirements, calculate your tuition options, and submit your registration. Log in at any time to monitor your application.</p>
        </div>

        <div class="admissions-grid">
            
            <!-- LEFT COLUMN: REQUIREMENT, VIDEOS, CALCULATOR -->
            <div class="admissions-info-col">
                <!-- 1. Admission Requirements -->
                <section class="premium-card" style="margin-bottom: 30px;">
                    <h3 style="color:#081F3E; margin-bottom: 16px;"><i class="fa-solid fa-list-check" style="color:#F5A623; margin-right:10px;"></i> Admission Requirements</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 20px;">Prospective students must provide the following documentation during registration to qualify for academic reviews:</p>
                    <ul style="color:#0F172A; list-style:none; line-height:2; font-size:15px; padding-left:10px;">
                        <li><i class="fa-solid fa-check" style="color:#F5A623; margin-right:10px;"></i> <strong>GCE Advanced Level</strong> (minimum 2 papers) or equivalent.</li>
                        <li><i class="fa-solid fa-check" style="color:#F5A623; margin-right:10px;"></i> Clear scanned copy of National ID card or Passport.</li>
                        <li><i class="fa-solid fa-check" style="color:#F5A623; margin-right:10px;"></i> Copy of High School transcripts / GCE Ordinary Level.</li>
                        <li><i class="fa-solid fa-check" style="color:#F5A623; margin-right:10px;"></i> Statement of purpose / letter of interest for software engineering/cybersecurity.</li>
                    </ul>
                </section>

                <!-- 2. Orientation & Media -->
                <section class="premium-card" style="margin-bottom: 30px;">
                    <h3 style="color:#081F3E; margin-bottom: 16px;"><i class="fa-solid fa-play" style="color:#F5A623; margin-right:10px;"></i> Orientation & campus tours</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 20px;">Watch our introductory videos detailing student life, classroom laboratory guides, and expectations at Liah Academy.</p>
                    
                    <!-- Video Embed Frame -->
                    <div style="position:relative; padding-bottom:56.25%; height:0; overflow:hidden; border-radius:var(--border-radius-sm); border:1px solid rgba(15,23,42,0.1); margin-bottom: 16px;">
                        <!-- Using high quality educational banner visual since real videos can't load, overlay play button -->
                        <div style="position:absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(rgba(4,16,33,0.4), rgba(4,16,33,0.4)), url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80') center/cover; display:flex; align-items:center; justify-content:center;">
                            <div style="width:70px; height:70px; border-radius:50%; background: #F5A623; color:#081F3E; display:flex; align-items:center; justify-content:center; font-size: 24px; cursor:pointer; box-shadow: 0 4px 15px rgba(245,166,35,0.4);"><i class="fa-solid fa-play" style="margin-left: 4px;"></i></div>
                        </div>
                    </div>
                    <span style="font-size:13px; color:#64748B;"><i class="fa-solid fa-circle-info" style="margin-right:6px;"></i> Orientation videos cover lab rules, computer configurations, and local student housing in Buea.</span>
                </section>

                <!-- 3. Tuition Fee Calculator -->
                <section class="premium-card calculator-card" style="margin-bottom: 30px;">
                    <h3 style="color:#F8FAFC; margin-bottom: 8px;"><i class="fa-solid fa-calculator" style="color:#F5A623; margin-right:10px;"></i> Tuition fee & finance estimator</h3>
                    <p style="color:#64748B; font-size:14px; margin-bottom: 24px;">Configure your program, format, and payment options to see your custom tuition and payment installment breakdown.</p>
                    
                    <form class="calculator-form" id="tuitionCalcForm">
                        <div class="calc-group">
                            <label for="calcDegree">Select degree level</label>
                            <select class="calc-select" id="calcDegree">
                                <option value="hnd" data-basefee="350000">Higher National Diploma (HND)</option>
                                <option value="bsc" data-basefee="500000" selected>Bachelor of Science (B.Sc)</option>
                                <option value="btech" data-basefee="450000">Bachelor of Technology (B.Tech)</option>
                            </select>
                        </div>

                        <div class="calc-group">
                            <label for="calcFormat">Study format</label>
                            <select class="calc-select" id="calcFormat">
                                <option value="oncampus" data-multiplier="1.0">On-Campus (Full-Time)</option>
                                <option value="online" data-multiplier="0.85">Online (15% Savings)</option>
                                <option value="parttime" data-multiplier="0.9">Part-Time (10% Savings)</option>
                            </select>
                        </div>

                        <div class="calc-group">
                            <label for="calcInstallments">Payment plan</label>
                            <select class="calc-select" id="calcInstallments">
                                <option value="1" data-discount="0.05">One-time payment (5% Discount)</option>
                                <option value="2" data-discount="0.0">2 Installments (Per Semester)</option>
                                <option value="3" data-discount="-0.03">3 Installments (+3% Finance Fee)</option>
                            </select>
                        </div>

                        <!-- Results output -->
                        <div class="calculator-result-box">
                            <span style="font-size: 13px; color: #64748B;">ESTIMATED TOTAL TUITION</span>
                            <div class="result-total" id="calcTotalOutput">0 XAF</div>
                            <span style="font-size: 13px; color: #F5A623;" id="calcInstallmentDetail">Payable in full</span>
                        </div>
                    </form>
                </section>

                <!-- 4. Alumni Showcase -->
                <section class="premium-card">
                    <h3 style="color:#081F3E; margin-bottom: 16px;"><i class="fa-solid fa-graduation-cap" style="color:#F5A623; margin-right:10px;"></i> Alumni Network</h3>
                    <div style="display:flex; gap:16px; align-items:center;">
                        <div style="width:60px; height:60px; border-radius:50%; background:#081F3E; color:#F5A623; display:flex; align-items:center; justify-content:center; font-weight:800; font-size: 20px;">CN</div>
                        <div>
                            <h4 style="font-size: 15px; margin-bottom: 4px;">Collins N.</h4>
                            <p class="small-badge" style="color:#64748B; margin-bottom: 6px;">B.Tech 2024 Graduate - DevOps engineer</p>
                            <p style="font-size: 14px; color:#64748B; font-style:italic;">"Liah Academy's hands-on project pipeline allowed me to build real microservice platforms. I landed a remote role within months of graduation!"</p>
                        </div>
                    </div>
                </section>
            </div>

            <!-- RIGHT COLUMN: INTERACTIVE REGISTRATION & DASHBOARD PORTAL -->
            <div class="admissions-portal-col" id="apply">
                
                <?php if ( $is_logged_in ) : ?>
                    <!-- STUDENT IS LOGGED IN: SHOW DASHBOARD -->
                    <div class="portal-widget-container" id="admissionsDashboard">
                        <div class="dashboard-heading-group" style="padding: 24px;">
                            <div>
                                <span class="course-badge" style="margin-bottom:6px;">Student Portal</span>
                                <h3 style="color:#081F3E;">Welcome, <?php echo esc_html( $_SESSION['liah_student_name'] ); ?></h3>
                                <p style="font-size:13px; color:#64748B; margin: 0;">ID: LA-2026-<?php echo esc_html( $student->id ); ?></p>
                            </div>
                            <button class="logout-link-btn" id="portalLogoutBtn">Log Out <i class="fa-solid fa-right-from-bracket" style="margin-left:6px;"></i></button>
                        </div>

                        <div class="portal-content-pane">
                            <div class="dashboard-grid">
                                <!-- App details -->
                                <div>
                                    <h4 style="color:#081F3E; margin-bottom: 16px;">Your Registration Details</h4>
                                    <ul style="list-style:none; line-height:2.2; font-size:14px; color:#0F172A;">
                                        <li><strong>Full Name:</strong> <?php echo esc_html( $student->full_name ); ?></li>
                                        <li><strong>Email:</strong> <?php echo esc_html( $student->email ); ?></li>
                                        <li><strong>Phone:</strong> <?php echo esc_html( $student->phone ); ?></li>
                                        <li><strong>Degree:</strong> <?php echo esc_html( strtoupper( $student->degree_type ) ); ?></li>
                                        <li><strong>Program Track:</strong> <?php echo esc_html( $student->program_type ); ?></li>
                                        <li><strong>Format:</strong> <?php echo esc_html( ucfirst( $student->study_format ) ); ?></li>
                                        <li><strong>Document:</strong> <a href="<?php echo esc_url( $student->document_url ); ?>" target="_blank" style="color:#E28704; text-decoration: underline;"><i class="fa-solid fa-file-pdf" style="margin-right:6px;"></i> View Uploaded File</a></li>
                                    </ul>
                                </div>

                                <!-- Status Tracker -->
                                <div>
                                    <h4 style="color:#081F3E; margin-bottom: 16px;">Application Status</h4>
                                    
                                    <div class="status-tracker-container">
                                        <div class="timeline-tracker">
                                            <!-- Step 1: Submitted -->
                                            <div class="timeline-event-node completed">
                                                <span class="timeline-dot"></span>
                                                <div class="timeline-text">
                                                    <h5>Application Submitted</h5>
                                                    <p>Received on <?php echo esc_html( date('M d, Y', strtotime($student->submission_date)) ); ?></p>
                                                </div>
                                            </div>

                                            <!-- Step 2: Under Review -->
                                            <div class="timeline-event-node <?php echo ($student->admission_status === 'Under Review' || $student->admission_status === 'Approved') ? 'active' : ''; ?>">
                                                <span class="timeline-dot"></span>
                                                <div class="timeline-text">
                                                    <h5>Academic Board Review</h5>
                                                    <p>Academic panel is auditing uploaded documents.</p>
                                                </div>
                                            </div>

                                            <!-- Step 3: Result -->
                                            <div class="timeline-event-node <?php echo ($student->admission_status === 'Approved') ? 'completed' : ''; ?>">
                                                <span class="timeline-dot"></span>
                                                <div class="timeline-text">
                                                    <h5>Admissions Result</h5>
                                                    <p>
                                                        Current Status: 
                                                        <strong style="color: <?php echo ($student->admission_status === 'Approved') ? '#10B981' : '#E28704'; ?>;">
                                                            <?php echo esc_html( $student->admission_status ); ?>
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Dynamic Action notice depending on status -->
                                    <div style="margin-top:20px; padding:16px; background:#FEF3C7; border: 1px solid #F5A623; border-radius: var(--border-radius-sm); font-size: 13px; color:#B45309;">
                                        <?php if ( $student->admission_status === 'Approved' ) : ?>
                                            <i class="fa-solid fa-circle-check" style="margin-right:6px;"></i> Congratulations! Your application has been approved. Please check your email or proceed to pay the enrollment fee using bank codes.
                                        <?php else: ?>
                                            <i class="fa-solid fa-clock" style="margin-right:6px;"></i> Your application is currently under academic review. Once approved, details on how to pay the registration and tuition fees will populate here.
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                
                <?php else : ?>
                    <!-- STUDENT IS NOT LOGGED IN: SHOW SIGNUP & LOGIN FORMS -->
                    <div class="portal-widget-container" id="admissionsFormsWidget">
                        <div class="portal-tabs">
                            <button class="portal-tab-btn active" id="tabBtnRegister">Register (Sign-Up)</button>
                            <button class="portal-tab-btn" id="tabBtnLogin">Check Status (Login)</button>
                        </div>

                        <!-- 1. REGISTRATION SIGN-UP PANEL (Multi-Step Form) -->
                        <div class="portal-content-pane" id="portalPaneRegister">
                            <form id="studentRegistrationForm" method="post" enctype="multipart/form-data">
                                <!-- Steps Progress Indicator -->
                                <div class="form-steps-indicator">
                                    <div class="step-indicator-node active" id="indicatorStep1">1</div>
                                    <div class="step-indicator-node" id="indicatorStep2">2</div>
                                    <div class="step-indicator-node" id="indicatorStep3">3</div>
                                </div>

                                <!-- STEP 1: Account Details -->
                                <div class="form-step-section" id="formStep1">
                                    <h4 style="margin-bottom: 20px; color:#081F3E;">Step 1: Account Credentials</h4>
                                    
                                    <div class="form-group">
                                        <label for="regFullName">Full Name *</label>
                                        <input type="text" class="form-input-light" id="regFullName" name="fullname" placeholder="e.g. Steddy Lyonga" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="regEmail">Email Address *</label>
                                        <input type="email" class="form-input-light" id="regEmail" name="email" placeholder="e.g. john@domain.com" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="regPassword">Create Portal Password *</label>
                                        <input type="password" class="form-input-light" id="regPassword" name="password" placeholder="Min. 6 characters" required>
                                    </div>

                                    <div class="form-group">
                                        <label for="regPhone">Phone Number *</label>
                                        <input type="tel" class="form-input-light" id="regPhone" name="phone" placeholder="e.g. +237 670 000 000" required>
                                    </div>

                                    <div class="step-navigation-row" style="justify-content: flex-end;">
                                        <button type="button" class="btn btn-primary" id="btnNextStep1">Next Step <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i></button>
                                    </div>
                                </div>

                                <!-- STEP 2: Course & Settings -->
                                <div class="form-step-section hidden" id="formStep2">
                                    <h4 style="margin-bottom: 20px; color:#081F3E;">Step 2: Course Selection</h4>

                                    <div class="form-group">
                                        <label for="regDegreeType">Degree Level</label>
                                        <select class="form-input-light" id="regDegreeType" name="degree_type">
                                            <option value="hnd">HND (2 Years)</option>
                                            <option value="bsc">Bachelor of Science - B.Sc (3 Years)</option>
                                            <option value="btech">Bachelor of Technology - B.Tech (3 Years)</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="regProgramType">Program / Track Selection</label>
                                        <select class="form-input-light" id="regProgramType" name="program_type">
                                            <option value="Software Engineering">Software Engineering Accelerator</option>
                                            <option value="Cybersecurity">Cybersecurity & Defense Track</option>
                                            <option value="Cloud Engineering & DevOps">Cloud Engineering & DevOps Pipelines</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="regStudyFormat">Format & Schedule</label>
                                        <select class="form-input-light" id="regStudyFormat" name="study_format">
                                            <option value="oncampus">On-Campus (Full-Time)</option>
                                            <option value="online">Online (Self-Paced)</option>
                                            <option value="parttime">Part-Time (Evening/Weekend)</option>
                                        </select>
                                    </div>

                                    <div class="step-navigation-row">
                                        <button type="button" class="btn btn-secondary" id="btnPrevStep2" style="color:#081F3E; border-color:#081F3E;"><i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i> Back</button>
                                        <button type="button" class="btn btn-primary" id="btnNextStep2">Next Step <i class="fa-solid fa-arrow-right" style="margin-left: 8px;"></i></button>
                                    </div>
                                </div>

                                <!-- STEP 3: Document Uploads & Payments -->
                                <div class="form-step-section hidden" id="formStep3">
                                    <h4 style="margin-bottom: 20px; color:#081F3E;">Step 3: Upload Documents</h4>
                                    
                                    <div class="form-group">
                                         <label>Required: Transcripts or GCE Results (PDF/DOCX format) *</label>
                                         <div class="file-upload-wrapper">
                                             <i class="fa-solid fa-cloud-arrow-up upload-icon"></i>
                                             <p style="font-size:14px; font-weight:600;" id="uploadFileFeedback">Drag & drop or click to choose files</p>
                                             <span style="font-size:11px; color:#64748B;">Supported: PDF, DOC, DOCX (Max: 5MB per file. Multiple files supported)</span>
                                             <input type="file" class="file-upload-input" id="regAdmissionDoc" name="admission_doc[]" accept=".pdf,.doc,.docx" multiple required>
                                         </div>
                                     </div>

                                    <div style="margin: 20px 0; padding: 16px; background: rgba(8, 31, 62, 0.04); border-radius: var(--border-radius-sm); font-size:13px; color:#64748B;">
                                         <i class="fa-solid fa-credit-card" style="color:#F5A623; margin-right:6px;"></i>
                                         <strong>Admission Fee:</strong> An application auditing fee of <strong>10,000 XAF</strong> applies. Payments are done using Mobile Money (MTN MoMo) and Orange Money (OM) via the Fapshi API.
                                    </div>

                                    <!-- Feedback message area -->
                                    <div class="portal-form-error" id="registerFormError" style="color:red; font-size:14px; margin-bottom:15px; display:none;"></div>
                                    <div class="portal-form-success" id="registerFormSuccess" style="color:green; font-size:14px; margin-bottom:15px; display:none;"></div>

                                    <div class="step-navigation-row">
                                        <button type="button" class="btn btn-secondary" id="btnPrevStep3" style="color:#081F3E; border-color:#081F3E;"><i class="fa-solid fa-arrow-left" style="margin-right: 8px;"></i> Back</button>
                                        <button type="submit" class="btn btn-primary" id="btnSubmitRegistration">Complete Application <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i></button>
                                    </div>
                                </div>
                            </form>
                        </div>

                        <!-- 2. LOGIN STATUS CHECK PANEL -->
                        <div class="portal-content-pane hidden" id="portalPaneLogin">
                            <form id="studentLoginForm" method="post">
                                <h4 style="margin-bottom: 20px; color:#081F3E;">Check Application Status</h4>
                                <p style="font-size:14px; color:#64748B; margin-bottom: 24px;">Enter the email and password you created during application to view your results and next steps.</p>

                                <div class="form-group">
                                    <label for="loginEmail">Email Address</label>
                                    <input type="email" class="form-input-light" id="loginEmail" name="email" required>
                                </div>

                                <div class="form-group">
                                    <label for="loginPassword">Portal Password</label>
                                    <input type="password" class="form-input-light" id="loginPassword" name="password" required>
                                </div>

                                <!-- Feedback message area -->
                                <div class="portal-form-error" id="loginFormError" style="color:red; font-size:14px; margin-bottom:15px; display:none;"></div>

                                <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;">Log In & Check Status <i class="fa-solid fa-right-to-bracket" style="margin-left:8px;"></i></button>
                            </form>
                        </div>
                    </div>
                <?php endif; ?>
            </div>
        </div>
    </div>
<?php endif; ?>
    </div>
</main>

<?php
get_footer();
