<?php
/**
 * Template Name: Contact Page Template
 *
 * Renders the Contact Us page, displaying campus details, contact forms,
 * and a stylized custom SVG map of Buea Bakweri Town.
 */

get_header();
?>

<main style="margin-top: calc(var(--header-height) + 40px); margin-bottom: 80px;">
    <div class="container">
        
        <!-- HEADER -->
        <div class="section-header">
            <span class="course-badge">Contact Us</span>
            <h2>Get in touch with Liah</h2>
            <p class="sub-header">Have questions about admissions, fees, corporate software contracts, or partnership structures? Drop us a line below or visit our Buea campus.</p>
        </div>

        <div class="grid-2">
            <!-- LEFT COLUMN: CONTACT DETAILS & INQUIRY FORM -->
            <div>
                <!-- Campus Address card -->
                <section class="premium-card" style="margin-bottom: 30px;">
                    <h3 style="color:#081F3E; margin-bottom: 24px;"><i class="fa-solid fa-address-book" style="color:#F5A623; margin-right:10px;"></i> Campus Information</h3>
                    
                    <ul class="contact-details-list">
                        <li>
                            <div class="icon-wrap"><i class="fa-solid fa-location-dot"></i></div>
                            <div>
                                <h4 style="font-size:15px; margin-bottom: 4px;">Main Campus Address</h4>
                                <p style="font-size:14px; color:#64748B;">Backweri Town, Buea, Cameroon</p>
                            </div>
                        </li>
                        <li>
                            <div class="icon-wrap"><i class="fa-solid fa-phone"></i></div>
                            <div>
                                <h4 style="font-size:15px; margin-bottom: 4px;">Telephone Lines</h4>
                                <p style="font-size:14px; color:#64748B;">+237 652 154 095 / +237 699 526 607</p>
                            </div>
                        </li>
                        <li>
                            <div class="icon-wrap"><i class="fa-solid fa-envelope"></i></div>
                            <div>
                                <h4 style="font-size:15px; margin-bottom: 4px;">Official Email Address</h4>
                                <p style="font-size:14px; color:#64748B;">info@liahacademy.com</p>
                            </div>
                        </li>
                    </ul>
                    
                    <div style="margin-top: 32px; padding-top: 24px; border-top:1px solid rgba(15,23,42,0.08);">
                        <h4 style="font-size: 14px; margin-bottom: 12px; color:#0F172A; text-transform: uppercase; letter-spacing: 0.05em;">Social Channels</h4>
                        <div class="social-links-grid" style="margin-top:0;">
                            <a href="https://www.facebook.com/photo/?fbid=747845957358700&set=a.467739685369330" target="_blank" class="social-circle-link" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                            <a href="https://www.instagram.com/p/DZ7omcLtYKT/" target="_blank" class="social-circle-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                            <a href="https://www.tiktok.com/@liahacademy0/video/7656312713143979284" target="_blank" class="social-circle-link" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
                            <a href="https://linkedin.com" target="_blank" class="social-circle-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                        </div>
                    </div>
                </section>

                <!-- Custom inquiry Form -->
                <section class="premium-card">
                    <h3 style="color:#081F3E; margin-bottom: 20px;"><i class="fa-solid fa-envelope-open-text" style="color:#F5A623; margin-right:10px;"></i> Direct Inquiry</h3>
                    <form id="contactInquiryForm" action="#" method="post">
                        <div class="form-row">
                            <div class="form-group">
                                <label for="contactName">Your Name *</label>
                                <input type="text" class="form-input-light" id="contactName" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="contactEmail">Your Email *</label>
                                <input type="email" class="form-input-light" id="contactEmail" name="email" required>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="contactSubject">Subject</label>
                            <input type="text" class="form-input-light" id="contactSubject" name="subject">
                        </div>

                        <div class="form-group">
                            <label for="contactMessage">Message *</label>
                            <textarea class="form-input-light" id="contactMessage" name="message" rows="5" style="resize:none;" required></textarea>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%;">Send Inquiry <i class="fa-solid fa-paper-plane" style="margin-left:8px;"></i></button>
                    </form>
                </section>
            </div>

            <!-- RIGHT COLUMN: STYLIZED VECTOR MAP OF BUEA BAKWERI TOWN -->
            <div>
                <section class="premium-card" style="height: 100%; display: flex; flex-direction: column;">
                    <h3 style="color:#081F3E; margin-bottom: 12px;"><i class="fa-solid fa-map-location-dot" style="color:#F5A623; margin-right:10px;"></i> Campus Map</h3>
                    <p class="body-normal" style="color:#64748B; margin-bottom: 24px;">Liah Academy is situated in Bakweri Town, Buea, nested along the lower slopes of Mount Cameroon, a cool and serene academic environment.</p>

                    <!-- Stylized SVG Map Container -->
                    <div class="custom-vector-map-frame" style="flex-grow: 1;">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
                            <!-- Background Map grid grid -->
                            <rect width="400" height="400" fill="#E6EEF4" />
                            
                            <!-- Road outlines (Buea Highways & Streets) -->
                            <!-- Buea-Kumba highway -->
                            <path d="M -50,300 C 100,280 280,240 450,220" fill="none" stroke="#FFFFFF" stroke-width="12" />
                            <path d="M -50,300 C 100,280 280,240 450,220" fill="none" stroke="#CBD5E1" stroke-width="2" stroke-dasharray="6,4" />
                            
                            <!-- Bakweri Town bypass/road -->
                            <path d="M 120,450 C 140,320 220,180 250,-50" fill="none" stroke="#FFFFFF" stroke-width="8" />
                            
                            <!-- Connecting streets -->
                            <line x1="170" y1="270" x2="350" y2="350" stroke="#FFFFFF" stroke-width="6" />
                            <line x1="200" y1="130" x2="80" y2="80" stroke="#FFFFFF" stroke-width="6" />

                            <!-- Mount Cameroon backdrop outline at the top left -->
                            <path d="M -20,120 L 50,60 L 140,110 L 220,40 L 310,130 L 420,50 L 450,150 L -20,150 Z" fill="#D1FAE5" opacity="0.6" />
                            <!-- Mountain peak text -->
                            <text x="70" y="80" font-family="'Outfit', sans-serif" font-size="10" fill="#059669" font-weight="600" opacity="0.6">MT. CAMEROON SLOPES</text>

                            <!-- Campus Location Points -->
                            <!-- 1. University of Buea UB -->
                            <circle cx="80" cy="285" r="16" fill="#1E3A8A" opacity="0.15" />
                            <circle cx="80" cy="285" r="5" fill="#1E3A8A" />
                            <text x="95" y="288" font-family="'Inter', sans-serif" font-size="11" fill="#1E3A8A" font-weight="700">University of Buea</text>

                            <!-- 2. Mile 17 Gate -->
                            <circle cx="340" cy="235" r="5" fill="#475569" />
                            <text x="280" y="222" font-family="'Inter', sans-serif" font-size="10" fill="#475569" font-weight="600">Mile 17 Terminal</text>

                            <!-- 3. LIAH ACADEMY (Featured point in Bakweri Town) -->
                            <!-- Pulsing glowing background circle -->
                            <circle cx="210" cy="180" r="24" fill="#F5A623" opacity="0.2">
                                <animate attributeName="r" values="18;26;18" dur="3s" repeatCount="indefinite" />
                                <animate attributeName="opacity" values="0.3;0.1;0.3" dur="3s" repeatCount="indefinite" />
                            </circle>
                            <!-- Inner pin point -->
                            <path d="M 210,165 C 202,165 196,171 196,179 C 196,191 210,205 210,205 C 210,205 224,191 224,179 C 224,171 218,165 210,165 Z" fill="#081F3E" stroke="#F5A623" stroke-width="2" />
                            <circle cx="210" cy="178" r="4" fill="#F5A623" />
                            
                            <!-- Label tag -->
                            <g transform="translate(145, 125)">
                                <rect width="130" height="30" rx="4" fill="#081F3E" stroke="#F5A623" stroke-width="1.5" />
                                <text x="65" y="19" font-family="'Outfit', sans-serif" font-weight="800" font-size="11" fill="#F8FAFC" text-anchor="middle">LIAH ACADEMY (HQ)</text>
                            </g>
                            <text x="210" y="218" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#081F3E" text-anchor="middle">Bakweri Town</text>
                        </svg>
                    </div>

                    <div style="margin-top:20px; font-size:13px; color:#64748B; line-height: 1.5;">
                        <i class="fa-solid fa-circle-info" style="color:#F5A623; margin-right:6px;"></i>
                        <strong>Directions:</strong> From the Mile 17 terminal, take a taxi heading towards Bakweri Town. Request the driver to stop at the Liah Innovation Hub, situated right along the main tarred road.
                    </div>
                </section>
            </div>
        </div>
    </div>
</main>

<?php
get_footer();
