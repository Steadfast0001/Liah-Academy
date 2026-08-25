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
    $table_name = $wpdb->prefix . 'students';
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

// Check for Campay payment returns
if ( isset( $_GET['payment'] ) && $_GET['payment'] === 'success' && isset( $_GET['id'] ) ) {
    global $wpdb;
    $table_name = $wpdb->prefix . 'students';
    if ( $wpdb && get_class($wpdb) !== 'MockWPDB' ) {
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

$show_campay_checkout = isset( $_GET['campay_checkout'] ) && isset( $_GET['id'] );
$checkout_student_name = '';
if ( $show_campay_checkout ) {
    $checkout_id = intval( $_GET['id'] );
    if ( isset( $_SESSION['liah_student_name'] ) && isset( $_SESSION['liah_student_id'] ) && $_SESSION['liah_student_id'] == $checkout_id ) {
        $checkout_student_name = $_SESSION['liah_student_name'];
    } else {
        global $wpdb;
        $table_name = $wpdb->prefix . 'students';
        if ( $wpdb && get_class($wpdb) !== 'MockWPDB' ) {
            $checkout_student_name = $wpdb->get_var( $wpdb->prepare( "SELECT full_name FROM $table_name WHERE id = %d", $checkout_id ) );
        }
        $checkout_student_name = $checkout_student_name ? $checkout_student_name : 'Steddy Lyonga';
    }
}
?>

<main style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        
        <?php
        $campay_username = defined('CAMPAY_USERNAME') ? CAMPAY_USERNAME : '';
        $campay_sandbox  = defined('CAMPAY_SANDBOX') ? CAMPAY_SANDBOX : false;
        
        // Use the demo SDK URL for sandbox, and live SDK URL for production
        $campay_app_id   = 'tUNm1FL1E_DdbTQtTJSWaHmeWcltK1uZegWmZTKteSeE1h1po8zm6DhQSw_kS0_NX1lH93eCi-7X49WfahowPw';
        $campay_sdk_url  = $campay_sandbox 
            ? 'https://demo.campay.net/sdk/js?app-id=' . $campay_app_id 
            : 'https://campay.net/sdk/js?app-id=' . $campay_app_id;
            
        $use_campay_sdk  = ! empty( $campay_username );
        ?>

        <?php if ( $show_campay_checkout ) : ?>
            <!-- CAMPAY CHECKOUT GATEWAY -->
            <div class="premium-card" style="max-width: 500px; margin: 40px auto; border-top: 6px solid #F5A623; box-shadow: var(--box-shadow-premium);">
                <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid rgba(15,23,42,0.08);">
                    <span style="font-family: var(--font-mono); font-size:11px; background: rgba(245,166,35,0.15); color: #B45309; padding: 4px 10px; border-radius: 4px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Secure Mobile Checkout</span>
                    <h3 style="margin-top: 12px; color: #081F3E; text-transform:none;">Admission Fee Payment</h3>
                    <p style="font-size:13px; color:#0F172A; margin-top:4px;">Candidate: <strong><?php echo esc_html( $checkout_student_name ); ?></strong></p>
                </div>

                <div style="text-align:center; margin-bottom: 30px;">
                    <span style="font-size: 13px; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Total Payable</span>
                    <h2 style="font-size: 40px; font-weight: 800; color: #081F3E; margin: 4px 0;">10,000 XAF</h2>
                    <span style="font-size: 12px; color: #10B981; font-weight:700;"><i class="fa-solid fa-lock"></i> Secured by end-to-end encryption</span>
                </div>

                <?php if ( $use_campay_sdk ) : ?>
                    <!-- LIVE CAMPAY SDK WIDGET BUTTON -->
                    <div style="padding: 10px 0; text-align: center;">
                        <p style="font-size: 14px; color: #475569; margin-bottom: 24px; line-height: 1.6;">Click the button below to pay your application fee safely using MTN Mobile Money or Orange Money via Campay.</p>
                        <button id="payButton" class="btn btn-primary" style="width: 100%; height: 50px; font-size: 16px; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px;">
                            <i class="fa-solid fa-credit-card"></i> Pay 10,000 XAF
                        </button>
                    </div>

                    <script src="<?php echo esc_url( $campay_sdk_url ); ?>"></script>
                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            if (typeof campay !== 'undefined') {
                                campay.options({
                                    payButtonId: "payButton",
                                    description: "Liah Academy Admission Auditing Fee for <?php echo esc_js( $checkout_student_name ); ?>",
                                    amount: "10000",
                                    currency: "XAF",
                                    externalReference: "liah_<?php echo esc_js( $checkout_id ); ?>_<?php echo time(); ?>",
                                    redirectUrl: "<?php echo esc_url( home_url( '/admissions?payment=success&id=' . $checkout_id ) ); ?>",
                                });
                                
                                campay.onSuccess = function (data) { 
                                    // Update database status via AJAX and redirect
                                    const formData = new FormData();
                                    formData.append('action', 'liah_complete_campay_payment');
                                    formData.append('nonce', '<?php echo wp_create_nonce( "liah-portal-nonce" ); ?>');
                                    formData.append('student_id', '<?php echo esc_js( $checkout_id ); ?>');
                                    formData.append('reference', data.reference || '');

                                    fetch('<?php echo admin_url( "admin-ajax.php" ); ?>', {
                                        method: 'POST',
                                        body: formData
                                    }).then(() => {
                                        window.location.href = "<?php echo esc_url( home_url( '/admissions?payment=success&id=' . $checkout_id ) ); ?>";
                                    });
                                };
                                
                                campay.onFail = function (data) { 
                                    alert('Payment failed. Status: ' + (data.status || 'Failed'));
                                };

                                campay.onModalClose = function (data) { 
                                    console.log('Payment modal closed');
                                };
                            }
                        });
                    </script>
                <?php else : ?>
                    <!-- FALLBACK LOCAL SIMULATOR FORM -->
                    <form id="fapshiSimulatorForm">
                        <input type="hidden" id="fapshiStudentId" value="<?php echo esc_attr( $checkout_id ); ?>">
                        
                        <div class="form-group">
                            <label style="font-weight: 700; color: #081F3E;">Select Mobile Wallet Provider</label>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px; margin-bottom: 20px;">
                                <label style="border: 2px solid #EAB308; border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; background: rgba(234,179,8,0.08); font-weight: 700; font-size: 14px; color: #854D0E;" id="lblMtn">
                                    <input type="radio" name="wallet" value="MTN" checked style="accent-color: #EAB308;"> MTN MoMo
                                </label>
                                <label style="border: 2px solid rgba(15,23,42,0.1); border-radius: 8px; padding: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; font-weight: 700; font-size: 14px;" id="lblOrange">
                                    <input type="radio" name="wallet" value="ORANGE" style="accent-color: #F97316;"> Orange Money
                                </label>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="fapshiPhone" style="font-weight: 700; color: #081F3E;">Mobile Money Number *</label>
                            <div style="display: flex; align-items: center; margin-top: 8px;">
                                <span style="background: rgba(15,23,42,0.05); border: 1px solid rgba(15,23,42,0.15); border-right: none; padding: 10px 14px; border-top-left-radius: 8px; border-bottom-left-radius: 8px; font-weight: 700; color: #081F3E; font-size: 15px; height: 46px; display: flex; align-items: center; justify-content: center;">+237</span>
                                <input type="tel" class="form-input-light" id="fapshiPhone" placeholder="e.g. 67X XXX XXX" style="margin-top: 0; border-top-left-radius: 0; border-bottom-left-radius: 0; flex-grow: 1; height: 46px;" required>
                            </div>
                            <p style="font-size: 12px; color: #64748B; margin-top: 8px; margin-bottom: 20px; line-height:1.4;">
                                <i class="fa-solid fa-circle-info" style="color: var(--color-primary-accent); margin-right: 4px;"></i>
                                You will receive a USSD push notification on your phone to confirm your PIN.
                            </p>
                        </div>

                        <input type="hidden" id="fapshiRedirectUrl" value="<?php echo esc_url( home_url( '/admissions?payment=success&id=' . $checkout_id ) ); ?>">

                        <button type="submit" class="btn btn-primary" style="width: 100%; margin-top: 10px;" id="btnFapshiPay">Pay 10,000 XAF <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i></button>
                    </form>

                    <script>
                        document.addEventListener('DOMContentLoaded', function() {
                            const form = document.getElementById('fapshiSimulatorForm');
                            const lblMtn = document.getElementById('lblMtn');
                            const lblOrange = document.getElementById('lblOrange');
                            const radios = document.getElementsByName('wallet');
                            const phoneInput = document.getElementById('fapshiPhone');

                            radios.forEach(radio => {
                                radio.addEventListener('change', function() {
                                    if (lblMtn && lblOrange) {
                                        if (radio.value === 'MTN') {
                                            lblMtn.style.borderColor = '#EAB308';
                                            lblMtn.style.background = 'rgba(234,179,8,0.08)';
                                            lblMtn.style.color = '#854D0E';
                                            
                                            lblOrange.style.borderColor = 'rgba(15,23,42,0.1)';
                                            lblOrange.style.background = 'none';
                                            lblOrange.style.color = '';
                                            if (phoneInput) phoneInput.placeholder = 'e.g. 67X XXX XXX';
                                        } else {
                                            lblOrange.style.borderColor = '#F97316';
                                            lblOrange.style.background = 'rgba(249,115,22,0.08)';
                                            lblOrange.style.color = '#C2410C';
                                            
                                            lblMtn.style.borderColor = 'rgba(15,23,42,0.1)';
                                            lblMtn.style.background = 'none';
                                            lblMtn.style.color = '';
                                            if (phoneInput) phoneInput.placeholder = 'e.g. 69X XXX XXX';
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
                                    btn.innerHTML = 'Connecting to secure gateway... <i class="fa-solid fa-spinner fa-spin" style="margin-left:6px;"></i>';

                                    // Prepare AJAX payload
                                    const formData = new FormData();
                                    formData.append('action', 'liah_process_campay_payment');
                                    formData.append('nonce', liahSettings.nonce);
                                    formData.append('student_id', id);
                                    formData.append('phone', phone);

                                    fetch(liahSettings.ajaxUrl, {
                                        method: 'POST',
                                        body: formData
                                    })
                                    .then(response => response.json())
                                    .then(res => {
                                        if (res.success) {
                                            if (res.data.status === 'simulated') {
                                                // Simulator Mode timings
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
                                            } else {
                                                // Live Campay USSD prompt initiated!
                                                btn.innerHTML = 'USSD Push Sent! Check your phone... <i class="fa-solid fa-mobile-screen-button" style="margin-left:6px;"></i>';
                                                
                                                setTimeout(() => {
                                                    btn.innerHTML = 'Payment Processing... Please authorize PIN prompt.';
                                                }, 3000);

                                                setTimeout(() => {
                                                    window.location.href = redirectUrl;
                                                }, 10000);
                                            }
                                        } else {
                                            btn.disabled = false;
                                            btn.innerHTML = 'Pay 10,000 XAF <i class="fa-solid fa-circle-check" style="margin-left:8px;"></i>';
                                            alert(res.data.message || 'Payment initiation failed.');
                                        }
                                    })
                                    .catch(err => {
                                        btn.disabled = false;
                                        btn.innerHTML = 'Pay 10,000 XAF <i class="fa-solid fa-circle-check" style="margin-left:8px;"></i>';
                                        alert('A network error occurred: ' + err.message);
                                    });
                                });
                            }
                        });
                    </script>
                <?php endif; ?>
            </div>

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
                                <option value="hnd" data-basefee="250000" selected>Higher National Diploma (HND) - 250,000 XAF/yr</option>
                                <option value="nd" data-basefee="150000">National Diploma (ND) - 150,000 XAF</option>
                                <option value="cert" data-basefee="350000">Professional Certification - 350,000 XAF</option>
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
                                                                                <li><strong>Documents:</strong> 
                                            <?php 
                                            $docs = explode( ',', $student->document_url );
                                            $doc_count = count( $docs );
                                            foreach ( $docs as $index => $doc_url ) {
                                                $doc_url = trim( $doc_url );
                                                if ( empty( $doc_url ) ) continue;
                                                $label = $doc_count > 1 ? 'Doc ' . ($index + 1) : 'View Uploaded File';
                                                ?>
                                                <a href="<?php echo esc_url( $doc_url ); ?>" target="_blank" style="color:#E28704; text-decoration: underline; margin-right: 12px;"><i class="fa-solid fa-file-pdf" style="margin-right:4px;"></i> <?php echo esc_html( $label ); ?></a>
                                                <?php
                                            }
                                            ?>
                                        </li>
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
                                            <div class="timeline-event-node <?php echo ($student->admission_status === 'Under Review' || $student->admission_status === 'Approved' || $student->admission_status === 'Rejected') ? 'active' : ''; ?>">
                                                <span class="timeline-dot"></span>
                                                <div class="timeline-text">
                                                    <h5>Academic Board Review</h5>
                                                    <p>Academic panel is auditing uploaded documents.</p>
                                                </div>
                                            </div>

                                            <!-- Step 3: Result -->
                                            <div class="timeline-event-node <?php echo ($student->admission_status === 'Approved' || $student->admission_status === 'Rejected') ? 'completed' : ''; ?>">
                                                <span class="timeline-dot"></span>
                                                <div class="timeline-text">
                                                    <h5>Admissions Result</h5>
                                                    <p>
                                                        Current Status: 
                                                        <strong style="color: <?php 
                                                            if ($student->admission_status === 'Approved') {
                                                                echo '#10B981';
                                                            } elseif ($student->admission_status === 'Rejected') {
                                                                echo '#EF4444';
                                                            } else {
                                                                echo '#E28704';
                                                            }
                                                        ?>;">
                                                            <?php echo esc_html( $student->admission_status ); ?>
                                                        </strong>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Dynamic Action notice depending on status -->
                                    <div style="margin-top:20px; padding:20px; background: rgba(8, 31, 62, 0.3); border: 1px solid rgba(245, 166, 35, 0.15); border-radius: var(--border-radius-sm); color:#F8FAFC;">
                                        <?php if ( $student->admission_status === 'Approved' ) : ?>
                                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                                <div style="display: flex; align-items: center; gap: 8px; color: #10B981; font-weight: 600;">
                                                    <i class="fa-solid fa-circle-check" style="font-size: 16px;"></i>
                                                    <span>Congratulations! Your application has been approved.</span>
                                                </div>
                                                
                                                <?php if ( $student->payment_status !== 'Paid' ) : ?>
                                                    <p style="color: #94A3B8; font-size: 14px; margin: 0;">Your admission auditing fee (10,000 XAF) is pending authorization.</p>
                                                    <a href="<?php echo esc_url( home_url( '/admissions?campay_checkout=1&id=' . $student->id ) ); ?>" class="btn btn-primary" style="align-self: flex-start; font-size: 13px; padding: 10px 20px;">
                                                        <i class="fa-solid fa-credit-card" style="margin-right:8px;"></i> Pay Auditing Fee (10,000 XAF)
                                                    </a>
                                                <?php else : ?>
                                                    <div style="display: flex; align-items: center; gap: 8px; color: #F5A623; font-weight: 600; background: rgba(245, 166, 35, 0.1); padding: 10px 14px; border-radius: 4px; border-left: 3px solid #F5A623; margin-top: 10px;">
                                                        <i class="fa-solid fa-check-double"></i>
                                                        <span>Auditing Fee Paid (10,000 XAF) - Verification Complete!</span>
                                                    </div>
                                                    <p style="color: #94A3B8; font-size: 14px; margin-top: 8px;">You are officially enrolled in the Liah Academy database. Our student affairs team will contact you with course enrollment dates and credentials.</p>
                                                <?php endif; ?>
                                            </div>
                                        <?php elseif ( $student->admission_status === 'Rejected' ) : ?>
                                            <div style="display: flex; align-items: center; gap: 8px; color: #EF4444; font-weight: 600;">
                                                <i class="fa-solid fa-circle-xmark" style="font-size: 16px;"></i>
                                                <span>We regret to inform you that your application has been rejected based on the academic board review.</span>
                                            </div>
                                        <?php else: ?>
                                            <div style="display: flex; align-items: center; gap: 8px; color: #E28704;">
                                                <i class="fa-solid fa-clock" style="font-size: 16px;"></i>
                                                <span>Your application is currently under academic review. Once approved, the payment panel to authorize tuition fees will populate here.</span>
                                            </div>
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
                                            <option value="HND">HND (2 Years)</option>
                                            <option value="ND">ND (1 Year)</option>
                                            <option value="Certification">Professional Certification</option>
                                        </select>
                                    </div>

                                    <div class="form-group">
                                        <label for="regProgramType">Program / Track Selection</label>
                                        <select class="form-input-light" id="regProgramType" name="program_type">
                                            <optgroup label="HND - School of Engineering & Technology">
                                                <option value="Software Engineering HND">Software Engineering HND</option>
                                                <option value="Web and Graphics Design HND">Web and Graphics Design HND</option>
                                                <option value="Digital Marketing and E-Commerce HND">Digital Marketing and E-Commerce HND</option>
                                                <option value="Network and Maintenance HND">Network and Maintenance HND</option>
                                            </optgroup>
                                            <optgroup label="ND - School of Engineering & Technology">
                                                <option value="Computer Engineering ND">Computer Engineering ND</option>
                                                <option value="ICT ND">ICT ND</option>
                                                <option value="Web Design ND">Web Design ND</option>
                                                <option value="Graphics Design and Printing ND">Graphics Design and Printing ND</option>
                                                <option value="Basic Computer ND">Basic Computer ND</option>
                                                <option value="Office Automation Secretaryship ND">Office Automation Secretaryship ND</option>
                                                <option value="Computerized Accounting ND">Computerized Accounting ND</option>
                                            </optgroup>
                                            <optgroup label="HND - School of Business & Management">
                                                <option value="Accounting HND">Accounting HND</option>
                                                <option value="Management HND">Management HND</option>
                                                <option value="Marketing HND">Marketing HND</option>
                                                <option value="Digital Marketing HND">Digital Marketing HND</option>
                                                <option value="Human Resource Management HND">Human Resource Management HND</option>
                                            </optgroup>
                                            <optgroup label="Professional Certifications">
                                                <option value="Data Science Certification">Data Science Certification</option>
                                                <option value="DevOps Certification">DevOps Certification</option>
                                                <option value="Industrial Web Design">Industrial Web Design</option>
                                                <option value="Digital Marketing and SEO">Digital Marketing and SEO</option>
                                            </optgroup>
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
                                          <strong>Application Fee:</strong> A non-refundable fee of <strong>10,000 XAF</strong> is required. We accept MTN Mobile Money (MoMo) and Orange Money (OM) via secure payment.
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
