LIAH ACADEMY WORDPRESS THEME
===================================
Author: Antigravity AI
Version: 1.0.0
Description: Custom high-performance premium WordPress theme for Liah Academy, Buea. Supports PHP & MySQL/MariaDB databases.

INSTALLATION & SETUP
-----------------------------------
1. Place this theme folder inside your WordPress installation directory at:
   `/wp-content/themes/liah-academy/`

2. Activate the theme:
   - Go to your WordPress Dashboard.
   - Navigate to Appearance > Themes.
   - Find "Liah Academy Theme" and click "Activate".

3. Database Setup (MySQL/MariaDB):
   - This theme is fully compatible with standard MySQL and MariaDB.
   - On theme activation, the theme will automatically execute standard SQL statements to create the custom student applications table (`wp_students`) and seed initial courses and services.

4. Page Configuration:
   - The theme features a custom `front-page.php` which will load automatically as your landing page.
   - Create the following pages in WordPress Admin and set their template styles:
     - "About" (assign the "About Page" template)
     - "Admissions" (assign the "Admissions Page" template)
     - "Degree & Program" (assign the "Degree & Program Page" template)
     - "Student Experience" (assign the "Student Experience Page" template)
     - "Contact" (assign the "Contact Page" template)
   - Go to Settings > Reading, and verify "Your homepage displays" is set to "Your latest posts" (front-page.php handles layout automatically) or select a Static Page as home.

THEME HIGHLIGHTS & INTERACTIONS
-----------------------------------
* Premium Color Palette: Midnight Navy (#081F3E), Radiant Gold (#F5A623), Warm Amber (#E28704), Deep Space Blue (#041021), Ghost White (#F8FAFC).
* Unified Sign-Up / Registration: Multi-step registration form that writes to the MySQL students table and uploads applicant documentation. Creates a custom user session for status checkins.
* Fee & Installments Calculator: Interactive cost estimator based on degree formats.
* Responsive Slide Deck: School landscape background transitions.
* Floating Chat Assistant: Bubble helper that answers pre-set FAQ prompts or dynamically matches text strings to guide users.
