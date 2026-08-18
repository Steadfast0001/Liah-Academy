<?php
/**
 * @package PostgreSQL_For_Wordpress
 * @version $Id$
 * @author	Hawk__, www.hawkix.net
 */

/**
* This file does all the initialisation tasks
*/

// Logs are put in the pg4wp directory
define( 'PG4WP_LOG', PG4WP_ROOT.'/logs/');
// Check if the logs directory is needed and exists or create it if possible
if( (PG4WP_DEBUG || PG4WP_LOG_ERRORS) &&
	!file_exists( PG4WP_LOG) &&
	is_writable(dirname( PG4WP_LOG)))
	mkdir( PG4WP_LOG);

// Load the driver defined in 'db.php'
require_once( PG4WP_ROOT.'/driver_'.DB_DRIVER.'.php');

// This loads up the wpdb class applying appropriate changes to it
$replaces = array(
	'define( '	=> '// define( ',
	'class wpdb'	=> 'class wpdb2',
	'new wpdb'	=> 'new wpdb2',
	'mysql_'	=> 'wpsql_',
	'mysqli_'	=> 'wpsqli_',
	' mysqli'	=> ' wpsqli',
	'<?php'		=> '',
	'?>'		=> '',
);
eval( str_replace( array_keys($replaces), array_values($replaces), file_get_contents(ABSPATH.'/wp-includes/class-wpdb.php')));

// Create wpdb object if not already done
if (! isset($wpdb))
	$wpdb = new wpdb2( DB_USER, DB_PASSWORD, DB_NAME, DB_HOST );

class wpsqli {
    public $connect_errno = 0;
}

class wpsqli_result {
    public $result_resource;
    public function __construct( $result_resource ) {
        $this->result_resource = $result_resource;
    }
}

function wpsqli_report( $flags ) {
    return true;
}

function wpsqli_init() {
    return new wpsqli();
}

function wpsqli_real_connect( $dbh, $host, $dbuser, $dbpassword, $database, $port, $socket, $client_flags ) {
    $conn = wpsql_connect( $host, $dbuser, $dbpassword );
    if ( ! $conn ) {
        $dbh->connect_errno = 1;
        return false;
    }
    if ( ! empty( $database ) ) {
        wpsql_select_db( $database );
    }
    return true;
}

function wpsqli_select_db( $dbh, $dbname ) {
    return wpsql_select_db( $dbname, $dbh );
}

function wpsqli_query( $dbh, $query ) {
    $res = wpsql_query( $query );
    if ( $res === false ) {
        return false;
    }
    if ( $res === true ) {
        return true;
    }
    return new wpsqli_result( $res );
}

function wpsqli_real_escape_string( $dbh, $data ) {
    return wpsql_real_escape_string( $data, $dbh );
}

function wpsqli_error( $dbh = null ) {
    return wpsql_error();
}

function wpsqli_errno( $dbh = null ) {
    return wpsql_error() ? 1 : 0;
}

function wpsqli_affected_rows( $dbh ) {
    return wpsql_affected_rows();
}

function wpsqli_insert_id( $dbh ) {
    return wpsql_insert_id( '' );
}

function wpsqli_fetch_object( $result ) {
    if ( ! is_object( $result ) || ! isset( $result->result_resource ) ) {
        return false;
    }
    return wpsql_fetch_object( $result->result_resource );
}

function wpsqli_fetch_array( $result ) {
    if ( ! is_object( $result ) || ! isset( $result->result_resource ) ) {
        return false;
    }
    return wpsql_fetch_array( $result->result_resource );
}

function wpsqli_num_fields( $result ) {
    if ( ! is_object( $result ) || ! isset( $result->result_resource ) ) {
        return 0;
    }
    return wpsql_num_fields( $result->result_resource );
}

function wpsqli_fetch_field( $result ) {
    if ( ! is_object( $result ) || ! isset( $result->result_resource ) ) {
        return false;
    }
    $field = wpsql_fetch_field( $result->result_resource );
    $obj = new stdClass();
    $obj->name = $field;
    return $obj;
}

function wpsqli_free_result( $result ) {
    if ( is_object( $result ) && isset( $result->result_resource ) ) {
        return wpsql_free_result( $result->result_resource );
    }
    return true;
}

function wpsqli_close( $dbh ) {
    return true;
}

function wpsqli_get_server_info( $dbh ) {
    return wpsql_get_server_info();
}

function wpsqli_set_charset( $dbh, $charset ) {
    return true;
}

function wpsqli_character_set_name( $dbh ) {
    return 'utf8';
}

function wpsqli_connect_errno() {
    return 0;
}

function wpsqli_connect_error() {
    return '';
}

function wpsqli_more_results( $dbh ) {
    return false;
}

function wpsqli_next_result( $dbh ) {
    return false;
}
