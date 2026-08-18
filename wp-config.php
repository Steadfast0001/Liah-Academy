<?php
/**
 * The base configuration for WordPress
 *
 * This file contains the database settings, auth keys, and table prefix
 * configured specifically for PostgreSQL support via PG4WP driver.
 *
 * @package WordPress
 */

// ** Database settings for PostgreSQL (mapped by PG4WP) ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'liah_db' );

/** Database username */
define( 'DB_USER', 'postgres' );

/** Database password */
define( 'DB_PASSWORD', 'password' );

/** Database hostname (usually localhost or 127.0.0.1) */
define( 'DB_HOST', 'localhost' );

/** Database charset (using utf8 for PostgreSQL compatibility) */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 * Generated for secure session and cookie hashes.
 */
define( 'AUTH_KEY',         'x92&H#mP!8qT^wz7$K@L-2pQ(4vB)5yN_2kL*sP#aW$eR%tY&uI*oP(aS)dF_1' );
define( 'SECURE_AUTH_KEY',  'Y8*wP#mQ!9rS^xz8$L@M-3qR(5wC)6zO_3mL*tQ#bX$fR%uY&vI*pP(bS)eF_2' );
define( 'LOGGED_IN_KEY',    'Z9(xQ#nR!0sT^yz9$M@N-4rS(6wD)7zP_4nL*uQ#cY$gR%vY&wI*qP(cS)fF_3' );
define( 'NONCE_KEY',        'A0)yR#oS!1uU^wz0$N@O-5sT(7wE)8zQ_5oL*vQ#dY$hR%wY&xI*rP(dS)gF_4' );
define( 'AUTH_SALT',        'B1*zS#pT!2vV^x01$O@P-6tU(8wF)9zR_6pL*wQ#eY$iR%xY&yI*sP(eS)hF_5' );
define( 'SECURE_AUTH_SALT', 'C2(aT#qU!3wW^y12$P@Q-7uV(9wG)0zS_7qL*xQ#fY$jR%yY&zI*tP(fS)iF_6' );
define( 'LOGGED_IN_SALT',   'D3)bU#rV!4xX^z23$Q@R-8vW(0wH)1zT_8rL*yQ#gY$kR%zY&aI*uP(gS)jF_7' );
define( 'NONCE_SALT',       'E4*cV#sW!5yY^a34$R@S-9wX(1wI)2zU_9sL*zQ#hY$lR%aY&bI*vP(hS)kF_8' );
/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 * Set to true to display warning logs during theme testing.
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */

// Fapshi Payment Gateway Credentials
define( 'FAPSHI_API_USER', 'your_fapshi_api_user_here' );
define( 'FAPSHI_API_KEY', 'your_fapshi_api_key_here' );
define( 'FAPSHI_SANDBOX', true ); // Set to false when moving to live environment

// Explicitly ensure the active driver is PGSQL for PG4WP
if ( ! defined( 'DB_DRIVER' ) ) {
	define( 'DB_DRIVER', 'pgsql' );
}

define( 'DISALLOW_FILE_EDIT', true );

/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and enqueued files. */
require_once ABSPATH . 'wp-settings.php';
