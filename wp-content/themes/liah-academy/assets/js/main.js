/**
 * Liah Academy - Main JavaScript Frontend Controller
 *
 * Handles hero slideshow, nav dropdowns, multi-step application form validation,
 * AJAX registration portal actions, tuition calculator formulas, course explorer filters,
 * and the floating chat assistant FAQ logic.
 */

document.addEventListener('DOMContentLoaded', function() {
    
    /* ==========================================================================
       1. CORE MOBILE NAV & ACCORDION DROPDOWN ENGINE
       ========================================================================== */
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const primaryNavMenu = document.getElementById('primaryNavMenu');
    const aboutMenuItem = document.getElementById('aboutMenuItem');

    if (mobileMenuToggle && primaryNavMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            primaryNavMenu.classList.toggle('open');
            // Toggle hamburger icon between bars and close X mark
            const icon = mobileMenuToggle.querySelector('i');
            if (primaryNavMenu.classList.contains('open')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });
    }

    // Toggle dropdown sub-menu on mobile when clicking "About" (default is hover on desktop)
    if (aboutMenuItem) {
        const link = aboutMenuItem.querySelector('.menu-link');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                aboutMenuItem.classList.toggle('dropdown-open');
            }
        });
        
        // Accessibility focus support
        link.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                aboutMenuItem.classList.toggle('dropdown-open');
            }
        });
    }

    /* ==========================================================================
       2. HERO SLIDESHOW ROTATION
       ========================================================================== */
    const slides = document.querySelectorAll('#heroSliderContainer .slide');
    let currentSlide = 0;

    if (slides.length > 0) {
        // Enqueue background images dynamically
        slides.forEach(slide => {
            const bgUrl = slide.getAttribute('data-bg');
            if (bgUrl) {
                slide.style.backgroundImage = `url('${bgUrl}')`;
            }
        });

        // Rotate slideshow every 5 seconds
        setInterval(function() {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 5000);
    }

    /* ==========================================================================
       3. COURSE EXPLORER & FILTERS (Search & Format Tags)
       ========================================================================== */
    const courseGridContainer = document.getElementById('courseGridContainer');
    const courseCards = document.querySelectorAll('.course-item-card');
    const explorerSearchInput = document.getElementById('explorerSearchInput');
    const formatFilterBtns = document.querySelectorAll('#courseFormatFilters button');

    let activeFilter = 'all';
    let searchQuery = '';

    function filterCoursesList() {
        let visibleCount = 0;

        courseCards.forEach(card => {
            const cardFormat = card.getAttribute('data-format');
            const cardTitle = card.querySelector('h3').textContent.toLowerCase();
            const cardContent = card.querySelector('.body-normal').textContent.toLowerCase();
            const cardModules = card.querySelector('.tech-tag-container') ? card.querySelector('.tech-tag-container').textContent.toLowerCase() : '';
            
            const matchesFilter = (activeFilter === 'all' || cardFormat === activeFilter);
            const matchesSearch = (searchQuery === '' || 
                                   cardTitle.includes(searchQuery) || 
                                   cardContent.includes(searchQuery) ||
                                   cardModules.includes(searchQuery));

            if (matchesFilter && matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        
        // Show empty message if nothing visible
        const emptyMsg = document.getElementById('explorerEmptyMsg');
        if (visibleCount === 0) {
            if (!emptyMsg && courseGridContainer) {
                const msg = document.createElement('div');
                msg.id = 'explorerEmptyMsg';
                msg.style.gridColumn = 'span 3';
                msg.style.textAlign = 'center';
                msg.style.padding = '40px';
                msg.style.color = '#64748B';
                msg.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="font-size:32px; margin-bottom:12px;"></i><p>No program tracks match your search queries.</p>';
                courseGridContainer.appendChild(msg);
            }
        } else if (emptyMsg) {
            emptyMsg.remove();
        }
    }

    if (explorerSearchInput) {
        explorerSearchInput.addEventListener('input', function(e) {
            searchQuery = e.target.value.toLowerCase().trim();
            filterCoursesList();
        });
    }

    if (formatFilterBtns.length > 0) {
        formatFilterBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                formatFilterBtns.forEach(b => b.style.background = 'none');
                formatFilterBtns.forEach(b => b.style.color = 'var(--color-primary-accent)');
                
                // Set active styling
                btn.style.background = 'var(--color-primary-base)';
                btn.style.color = 'var(--color-primary-accent)';
                
                activeFilter = btn.getAttribute('data-filter');
                filterCoursesList();
            });
        });
    }

    /* ==========================================================================
       4. TUITION FEE & PAYMENT PLAN CALCULATOR
       ========================================================================== */
    const calcDegree = document.getElementById('calcDegree');
    const calcFormat = document.getElementById('calcFormat');
    const calcInstallments = document.getElementById('calcInstallments');
    const calcTotalOutput = document.getElementById('calcTotalOutput');
    const calcInstallmentDetail = document.getElementById('calcInstallmentDetail');

    function calculateTuition() {
        if (!calcDegree || !calcFormat || !calcInstallments) return;

        // Fetch selection details
        const selectedDegreeOpt = calcDegree.options[calcDegree.selectedIndex];
        const selectedFormatOpt = calcFormat.options[calcFormat.selectedIndex];
        const selectedInstallmentOpt = calcInstallments.options[calcInstallments.selectedIndex];

        const baseFee = parseFloat(selectedDegreeOpt.getAttribute('data-basefee'));
        const multiplier = parseFloat(selectedFormatOpt.getAttribute('data-multiplier'));
        const discountPercentage = parseFloat(selectedInstallmentOpt.getAttribute('data-discount'));
        const installmentCount = parseInt(selectedInstallmentOpt.value);

        // Apply format multiplier (oncampus, online savings, etc.)
        let adjustedFee = baseFee * multiplier;

        // Apply discount or finance fees
        // Positive discount percentage subtracts; negative adds interest
        adjustedFee = adjustedFee * (1 - discountPercentage);

        // Round cleanly
        const finalFee = Math.round(adjustedFee);

        // Formatting currency with commas
        calcTotalOutput.textContent = finalFee.toLocaleString() + ' XAF';

        // Calculate division detail
        if (installmentCount === 1) {
            calcInstallmentDetail.textContent = 'Payable in full at registration (5% Discount included)';
        } else {
            const installmentAmount = Math.round(finalFee / installmentCount);
            calcInstallmentDetail.textContent = `${installmentCount} Payments of ${installmentAmount.toLocaleString()} XAF each`;
        }
    }

    // Bind event listeners to calculator selectors
    if (calcDegree) {
        calcDegree.addEventListener('change', calculateTuition);
        calcFormat.addEventListener('change', calculateTuition);
        calcInstallments.addEventListener('change', calculateTuition);
        // Initial run
        calculateTuition();
    }

    /* ==========================================================================
       5. ADMISSIONS REGISTRATION PORTAL (Forms Tabs & Multi-Step Logic)
       ========================================================================== */
    const tabBtnRegister = document.getElementById('tabBtnRegister');
    const tabBtnLogin = document.getElementById('tabBtnLogin');
    const portalPaneRegister = document.getElementById('portalPaneRegister');
    const portalPaneLogin = document.getElementById('portalPaneLogin');

    // Tab toggles between registration (signup) and login
    if (tabBtnRegister && tabBtnLogin) {
        tabBtnRegister.addEventListener('click', function() {
            tabBtnRegister.classList.add('active');
            tabBtnLogin.classList.remove('active');
            portalPaneRegister.classList.remove('hidden');
            portalPaneLogin.classList.add('hidden');
        });

        tabBtnLogin.addEventListener('click', function() {
            tabBtnLogin.classList.add('active');
            tabBtnRegister.classList.remove('active');
            portalPaneLogin.classList.remove('hidden');
            portalPaneRegister.classList.add('hidden');
        });
    }

    // File upload indicator update
    const regAdmissionDoc = document.getElementById('regAdmissionDoc');
    const uploadFileFeedback = document.getElementById('uploadFileFeedback');

    if (regAdmissionDoc && uploadFileFeedback) {
        regAdmissionDoc.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                if (e.target.files.length === 1) {
                    uploadFileFeedback.textContent = `Selected: ${e.target.files[0].name}`;
                } else {
                    const names = Array.from(e.target.files).map(f => f.name).join(', ');
                    uploadFileFeedback.textContent = `Selected ${e.target.files.length} files: ${names}`;
                }
                uploadFileFeedback.style.color = 'var(--color-secondary-accent)';
            }
        });
    }

    // Multi-Step Registration navigation
    const btnNextStep1 = document.getElementById('btnNextStep1');
    const btnNextStep2 = document.getElementById('btnNextStep2');
    const btnPrevStep2 = document.getElementById('btnPrevStep2');
    const btnPrevStep3 = document.getElementById('btnPrevStep3');

    const formStep1 = document.getElementById('formStep1');
    const formStep2 = document.getElementById('formStep2');
    const formStep3 = document.getElementById('formStep3');

    const indicatorStep1 = document.getElementById('indicatorStep1');
    const indicatorStep2 = document.getElementById('indicatorStep2');
    const indicatorStep3 = document.getElementById('indicatorStep3');

    // Validation helpers
    function validateFormInputs(inputs) {
        let valid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                input.style.borderColor = 'red';
                valid = false;
            } else {
                input.style.borderColor = '';
            }
        });
        return valid;
    }

    if (btnNextStep1) {
        btnNextStep1.addEventListener('click', function() {
            const inputs = formStep1.querySelectorAll('input');
            if (validateFormInputs(inputs)) {
                formStep1.classList.add('hidden');
                formStep2.classList.remove('hidden');
                indicatorStep1.classList.add('completed');
                indicatorStep2.classList.add('active');
            }
        });
    }

    if (btnNextStep2) {
        btnNextStep2.addEventListener('click', function() {
            formStep2.classList.add('hidden');
            formStep3.classList.remove('hidden');
            indicatorStep2.classList.add('completed');
            indicatorStep3.classList.add('active');
        });
    }

    if (btnPrevStep2) {
        btnPrevStep2.addEventListener('click', function() {
            formStep2.classList.add('hidden');
            formStep1.classList.remove('hidden');
            indicatorStep1.classList.remove('completed');
            indicatorStep2.classList.remove('active');
        });
    }

    if (btnPrevStep3) {
        btnPrevStep3.addEventListener('click', function() {
            formStep3.classList.add('hidden');
            formStep2.classList.remove('hidden');
            indicatorStep2.classList.remove('completed');
            indicatorStep3.classList.remove('active');
        });
    }

    /* ==========================================================================
       6. AJAX DATABASE ENDPOINTS CALLS (Submit, Login & Logout)
       ========================================================================== */
    const studentRegistrationForm = document.getElementById('studentRegistrationForm');
    const studentLoginForm = document.getElementById('studentLoginForm');
    const portalLogoutBtn = document.getElementById('portalLogoutBtn');

    // Submit Registration via AJAX (Postgres application database insert)
    if (studentRegistrationForm) {
        studentRegistrationForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('btnSubmitRegistration');
            const errorArea = document.getElementById('registerFormError');
            const successArea = document.getElementById('registerFormSuccess');

            errorArea.style.display = 'none';
            successArea.style.display = 'none';

            // Verify file upload chosen
            if (!regAdmissionDoc.files.length) {
                errorArea.textContent = 'Please choose a document to upload.';
                errorArea.style.display = 'block';
                return;
            }

            // Build dynamic FormData object
            const formData = new FormData(studentRegistrationForm);
            formData.append('action', 'liah_register_student');
            formData.append('nonce', liahSettings.nonce);

            // Display loading indicator
            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 6px;"></i>';

            fetch(liahSettings.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    successArea.textContent = data.data.message;
                    successArea.style.display = 'block';
                    setTimeout(() => {
                        if (data.data.redirect && typeof data.data.redirect === 'string') {
                            window.location.href = data.data.redirect;
                        } else {
                            window.location.reload();
                        }
                    }, 1500);
                } else {
                    errorArea.textContent = data.data.message || 'Registration failed.';
                    errorArea.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Complete Application <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i>';
                }
            })
            .catch(err => {
                errorArea.textContent = 'System error occurred during submit. Please try again.';
                errorArea.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Complete Application <i class="fa-solid fa-circle-check" style="margin-left: 8px;"></i>';
            });
        });
    }

    // Portal login (Verify credentials against Custom database table)
    if (studentLoginForm) {
        studentLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = studentLoginForm.querySelector('button[type="submit"]');
            const errorArea = document.getElementById('loginFormError');
            
            errorArea.style.display = 'none';

            const formData = new FormData(studentLoginForm);
            formData.append('action', 'liah_portal_login');
            formData.append('nonce', liahSettings.nonce);

            submitBtn.disabled = true;
            submitBtn.innerHTML = 'Verifying... <i class="fa-solid fa-spinner fa-spin" style="margin-left:6px;"></i>';

            fetch(liahSettings.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);
                } else {
                    errorArea.textContent = data.data.message || 'Login failed.';
                    errorArea.style.display = 'block';
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = 'Log In & Check Status <i class="fa-solid fa-right-to-bracket" style="margin-left:8px;"></i>';
                }
            })
            .catch(err => {
                errorArea.textContent = 'A connection error occurred.';
                errorArea.style.display = 'block';
                submitBtn.disabled = false;
                submitBtn.innerHTML = 'Log In & Check Status <i class="fa-solid fa-right-to-bracket" style="margin-left:8px;"></i>';
            });
        });
    }

    // Portal Log out
    if (portalLogoutBtn) {
        portalLogoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            portalLogoutBtn.disabled = true;
            portalLogoutBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

            const formData = new FormData();
            formData.append('action', 'liah_portal_logout');
            formData.append('nonce', liahSettings.nonce);

            fetch(liahSettings.ajaxUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                window.location.reload();
            })
            .catch(err => {
                window.location.reload();
            });
        });
    }

    /* ==========================================================================
       7. FLOATING CHAT ASSISTANT WIDGET LOGIC
       ========================================================================== */
    const chatWidgetToggle = document.getElementById('chatWidgetToggle');
    const chatWidgetWindow = document.getElementById('chatWidgetWindow');
    const closeChatBtn = document.getElementById('closeChatBtn');
    const chatMessagesArea = document.getElementById('chatMessagesArea');
    const chatTextInput = document.getElementById('chatTextInput');
    const chatSendBtn = document.getElementById('chatSendBtn');
    const chatQuickReplies = document.getElementById('chatQuickReplies');

    if (chatWidgetToggle && chatWidgetWindow) {
        // Toggle window display
        chatWidgetToggle.addEventListener('click', function() {
            chatWidgetWindow.classList.toggle('open');
            // Scroll messages to bottom on open
            setTimeout(() => {
                chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
            }, 300);
        });

        if (closeChatBtn) {
            closeChatBtn.addEventListener('click', function() {
                chatWidgetWindow.classList.remove('open');
            });
        }

        // Add message node to panel
        function appendChatMessage(text, sender) {
            const msgNode = document.createElement('div');
            msgNode.classList.add('chat-msg', sender);
            msgNode.textContent = text;
            chatMessagesArea.appendChild(msgNode);
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }

        // Show typing indicator bubble
        let typingIndicatorNode = null;
        function showBotTypingIndicator() {
            if (typingIndicatorNode) return;
            
            typingIndicatorNode = document.createElement('div');
            typingIndicatorNode.classList.add('chat-msg', 'bot', 'typing-bubble');
            typingIndicatorNode.innerHTML = '<span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>';
            chatMessagesArea.appendChild(typingIndicatorNode);
            chatMessagesArea.scrollTop = chatMessagesArea.scrollHeight;
        }

        // Remove typing indicator bubble
        function hideBotTypingIndicator() {
            if (typingIndicatorNode) {
                typingIndicatorNode.remove();
                typingIndicatorNode = null;
            }
        }

        // Generate bot answer based on keyword checking
        function getBotResponse(userQuery) {
            const query = userQuery.toLowerCase().trim();

            if (query.includes('admission') || query.includes('requirement') || query.includes('apply') || query.includes('register') || query.includes('signup')) {
                return "To apply at Liah Academy, select your desired track (HND, ND, or Certification) and fill out the step-by-step Admissions Form. Upload your credentials (GCE slip, transcripts) in PDF/DOC format. Once submitted, log in to track your status on the dashboard!";
            }
            if (query.includes('fee') || query.includes('tuition') || query.includes('cost') || query.includes('pay') || query.includes('finance') || query.includes('price')) {
                return "Tuition fees: HND programs are 250,000 XAF/year; National Diploma (ND) programs are 150,000 XAF/year; Professional Certifications are 300,000 to 350,000 XAF. We offer discounts for one-time payments and flexible installment options. Check our Tuition Estimator on the Admissions page!";
            }
            if (query.includes('degree') || query.includes('program') || query.includes('course') || query.includes('hnd') || query.includes('nd') || query.includes('certification') || query.includes('track')) {
                return "We offer tracks under three main divisions:\n1. HND (Software Engineering, Web/Graphics, Network/Maintenance, Digital Marketing, and Business Management courses like Accounting, HR, Marketing).\n2. ND (Computer Engineering, ICT, Web Design, QuickBooks).\n3. Certifications (9-month Data Science and DevOps, 6-month Industrial Web Design). Check the Degrees & Programs page!";
            }
            if (query.includes('location') || query.includes('address') || query.includes('buea') || query.includes('backweri') || query.includes('bakweri') || query.includes('find') || query.includes('map')) {
                return "Liah Academy is located in Backweri Town, Buea, Southwest Region, Cameroon. Our campus is set on the lower slopes of Mount Cameroon, providing a serene environment for practical studies. See our interactive contact map page!";
            }
            if (query.includes('housing') || query.includes('hostel') || query.includes('accommodation') || query.includes('dorm')) {
                return "While we do not have student dormitories on campus, our student affairs office helps students locate safe and affordable student hostels and local apartments in Backweri Town, Buea.";
            }
            if (query.includes('internship') || query.includes('job') || query.includes('work') || query.includes('employ') || query.includes('benefit')) {
                return "A key benefit of Liah Academy is that all students undergo direct practical internship placements in our corporate software development division, building real-world enterprise applications before graduation.";
            }
            if (query.includes('scholarship') || query.includes('financial') || query.includes('aid') || query.includes('discount')) {
                return "Yes! Liah Academy offers merit-based and need-based financial aid. You can also get a 5% discount on tuition if you pay the full amount upfront. Contact our finance desk at info@liahacademy.com for more info.";
            }
            if (query.includes('wifi') || query.includes('internet') || query.includes('security') || query.includes('experience') || query.includes('lab')) {
                return "Our campus features high-speed fiber-optic Wi-Fi, modern computer laboratories with dedicated power backup, and card-key security systems to protect our practical workspaces.";
            }
            if (query.includes('hello') || query.includes('hi') || query.includes('hey') || query.includes('greetings') || query.includes('whatsapp')) {
                return "Hello! I'm Liah Assist Bot. I'm here to help with information about admissions, courses, fees, location, and housing. What would you like to know?";
            }
            
            return "Thank you for asking! I recommend visiting our Admissions Portal, checking our Programs listings, or contacting our administration team directly at info@liahacademy.com or +237 652 154 095.";
        }

        // Process message transmission
        function sendUserMessage(text) {
            if (!text.trim()) return;

            // Display user message
            appendChatMessage(text, 'user');

            // Hide quick option chips after first query to clear space
            if (chatQuickReplies) {
                chatQuickReplies.style.display = 'none';
            }

            // Trigger typing response delay
            showBotTypingIndicator();
            setTimeout(function() {
                hideBotTypingIndicator();
                const botReply = getBotResponse(text);
                appendChatMessage(botReply, 'bot');
            }, 1200);
        }

        // Bind text sending button
        if (chatSendBtn && chatTextInput) {
            chatSendBtn.addEventListener('click', function() {
                const text = chatTextInput.value;
                chatTextInput.value = '';
                sendUserMessage(text);
            });

            chatTextInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') {
                    const text = chatTextInput.value;
                    chatTextInput.value = '';
                    sendUserMessage(text);
                }
            });
        }

        // Bind quick reply chips
        if (chatQuickReplies) {
            const chips = chatQuickReplies.querySelectorAll('.quick-reply-chip');
            chips.forEach(chip => {
                chip.addEventListener('click', function() {
                    const question = chip.getAttribute('data-question');
                    sendUserMessage(question);
                });
            });
        }

        // ==========================================================================
        // 14. WEBSITE & GOOGLE REVIEWS INTERACTION ENGINE
        // ==========================================================================
        const ratingStars = document.querySelectorAll('.rating-star');
        const hiddenRatingInput = document.getElementById('revRating');
        if (ratingStars.length && hiddenRatingInput) {
            ratingStars.forEach(star => {
                star.addEventListener('click', function() {
                    const val = parseInt(this.getAttribute('data-value'));
                    hiddenRatingInput.value = val;
                    
                    // Toggle active colors
                    ratingStars.forEach(s => {
                        const sVal = parseInt(s.getAttribute('data-value'));
                        if (sVal <= val) {
                            s.style.color = '#F5A623';
                        } else {
                            s.style.color = '#64748B';
                        }
                    });
                });
            });
            
            // Initialize default star color
            ratingStars.forEach(s => {
                if (parseInt(s.getAttribute('data-value')) <= 5) {
                    s.style.color = '#F5A623';
                }
            });
        }

        const reviewForm = document.getElementById('websiteReviewForm');
        const reviewSuccessMsg = document.getElementById('reviewSuccessMsg');
        const reviewsStream = document.getElementById('websiteReviewsStream');
        if (reviewForm && reviewSuccessMsg && reviewsStream) {
            reviewForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const name = document.getElementById('revName').value.trim();
                const role = document.getElementById('revRole').value.trim();
                const rating = parseInt(hiddenRatingInput.value);
                const comment = document.getElementById('revComment').value.trim();
                
                const submitBtn = reviewForm.querySelector('button[type="submit"]');
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Submitting... <i class="fa-solid fa-spinner fa-spin" style="margin-left: 6px;"></i>';

                const formData = new FormData();
                formData.append('action', 'liah_submit_review');
                formData.append('nonce', liahSettings.nonce);
                formData.append('name', name);
                formData.append('role', role);
                formData.append('rating', rating);
                formData.append('comment', comment);

                fetch(liahSettings.ajaxUrl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right: 8px;"></i> Submit Review';
                    
                    if (data.success) {
                        // Build stars html
                        let starsHtml = '';
                        for (let i = 0; i < 5; i++) {
                            if (i < rating) {
                                starsHtml += '<i class="fa-solid fa-star"></i>';
                            } else {
                                starsHtml += '<i class="fa-regular fa-star" style="color: #64748B;"></i>';
                            }
                        }
                        
                        // Append new review card to stream
                        const newRev = document.createElement('div');
                        newRev.style.background = 'rgba(8, 31, 62, 0.15)';
                        newRev.style.borderLeft = '3px solid var(--color-primary-accent)';
                        newRev.style.padding = '16px';
                        newRev.style.borderRadius = '4px';
                        newRev.style.opacity = '0';
                        newRev.style.transform = 'translateY(10px)';
                        newRev.style.transition = 'all 0.4s ease-out';
                        
                        newRev.innerHTML = `
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600; color: #F8FAFC; font-size: 14px;">${name} (${role})</span>
                                <div style="color: #F5A623; font-size: 11px;">
                                    ${starsHtml}
                                </div>
                            </div>
                            <p style="color: #94A3B8; font-size: 13px; line-height: 1.5;">"${comment}"</p>
                        `;
                        
                        reviewsStream.insertBefore(newRev, reviewsStream.firstChild);
                        
                        // Trigger animation
                        setTimeout(() => {
                            newRev.style.opacity = '1';
                            newRev.style.transform = 'translateY(0)';
                        }, 50);
                        
                        // Success alert & clear fields
                        reviewForm.reset();
                        reviewSuccessMsg.style.display = 'block';
                        
                        // Reset rating stars to 5
                        hiddenRatingInput.value = 5;
                        ratingStars.forEach(s => {
                            s.style.color = '#F5A623';
                        });
                        
                        setTimeout(() => {
                            reviewSuccessMsg.style.display = 'none';
                        }, 3000);
                    } else {
                        alert(data.data.message || 'Could not submit review.');
                    }
                })
                .catch(err => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right: 8px;"></i> Submit Review';
                    alert('A connection error occurred.');
                });
            });
        }
    }
});
