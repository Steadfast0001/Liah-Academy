<?php
/**
 * Liah Academy Theme Footer
 *
 * Renders the site footer and the interactive floating Chat Assistant widget.
 */
?>

<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <!-- Brand Column -->
            <div class="footer-brand-col">
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo-link" style="height:44px; margin-bottom: 20px;">
                    <img class="logo-img" src="<?php echo esc_url( get_template_directory_uri() . '/logo.svg' ); ?>" alt="Liah Academy Logo">
                    <span class="logo-text" style="font-size:18px;">Liah <span style="color:#F5A623;">Academy</span></span>
                </a>
                <p>Buea's premier tech academy and software engineering company, training industry-ready tech specialists and building corporate-level solutions.</p>
                <div class="social-links-grid" style="margin-top: 16px;">
                    <a href="https://facebook.com" target="_blank" class="social-circle-link" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
                    <a href="https://instagram.com" target="_blank" class="social-circle-link" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
                    <a href="https://linkedin.com" target="_blank" class="social-circle-link" aria-label="LinkedIn"><i class="fa-brands fa-linkedin-in"></i></a>
                </div>
            </div>

            <!-- Quick Links -->
            <div>
                <h3 class="footer-col-title">Academy Links</h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url( home_url( '/about' ) ); ?>">About Liah</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/admissions' ) ); ?>">Admissions Portal</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>">Degrees & Programs</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/student-experience' ) ); ?>">Student Life</a></li>
                </ul>
            </div>

            <!-- Academic Divisions -->
            <div>
                <h3 class="footer-col-title">Tech Tracks</h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>">Software Engineering (B.Tech)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>">Cybersecurity Tracks (B.Sc)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>">DevOps Pipelines (HND)</a></li>
                    <li><a href="<?php echo esc_url( home_url( '/degree-programs' ) ); ?>">Cooperation & Innovation</a></li>
                </ul>
            </div>

            <!-- Contact Information -->
            <div>
                <h3 class="footer-col-title">Campus Contact</h3>
                <ul class="footer-links" style="color:#64748B; font-size:15px; line-height:1.8;">
                    <li style="margin-bottom: 8px;">
                        <i class="fa-solid fa-location-dot" style="color:#F5A623; margin-right:8px;"></i>
                        Bakweri Town, Buea, Southwest Region, Cameroon
                    </li>
                    <li style="margin-bottom: 8px;">
                        <i class="fa-solid fa-phone" style="color:#F5A623; margin-right:8px;"></i>
                        +237 677 889 900
                    </li>
                    <li style="margin-bottom: 8px;">
                        <i class="fa-solid fa-envelope" style="color:#F5A623; margin-right:8px;"></i>
                        admissions@liahacademy.org
                    </li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> Liah Academy. All Rights Reserved. Built for high-performance scale.</p>
        </div>
    </div>
</footer>

<!-- ==========================================================================
     CHAT ASSISTANT FLOATING WIDGET
     ========================================================================== -->
<!-- Chat Floating Toggle Bubble Button -->
<div class="chat-widget-bubble" id="chatWidgetToggle" aria-label="Open Chat Assistant">
    <i class="fa-solid fa-comment-dots" style="font-size: 24px;"></i>
</div>

<!-- Chat Popup Window Card -->
<div class="chat-widget-window" id="chatWidgetWindow">
    <!-- Header -->
    <div class="chat-window-header">
        <div class="chat-bot-identity">
            <span class="bot-dot"></span>
            <div>
                <h4 style="font-size:14px; font-weight: 700; margin: 0; color:#F8FAFC;">Liah Assist Bot</h4>
                <span style="font-size: 11px; color:#64748B;">Ready to help</span>
            </div>
        </div>
        <button class="close-chat-btn" id="closeChatBtn" aria-label="Close Chat"><i class="fa-solid fa-xmark"></i></button>
    </div>

    <!-- Messages Container -->
    <div class="chat-messages-area" id="chatMessagesArea">
        <div class="chat-msg bot">
            Hello! Welcome to Liah Academy (Buea). I'm your interactive chat assistant. How can I guide you today?
        </div>
    </div>

    <!-- Quick FAQ Options -->
    <div class="chat-quick-replies" id="chatQuickReplies">
        <div class="quick-reply-chip" data-question="What are the admission requirements?">Requirements</div>
        <div class="quick-reply-chip" data-question="Show me tuition fees and cost breakdown.">Tuition Fees</div>
        <div class="quick-reply-chip" data-question="What degree programs are offered?">Degrees</div>
        <div class="quick-reply-chip" data-question="Where is the campus located?">Location</div>
    </div>

    <!-- Bottom Input row -->
    <div class="chat-input-row">
        <input type="text" class="chat-text-input" id="chatTextInput" placeholder="Type your question..." autocomplete="off">
        <button class="chat-send-btn" id="chatSendBtn" aria-label="Send Message">
            <i class="fa-solid fa-paper-plane"></i>
        </button>
    </div>
</div>

<?php wp_footer(); ?>
</body>
</html>
