<?php

/*
Plugin Name: Tripcraft Widgets
Plugin URI: https://bitbucket.org/tripcraft/acf-field-type-hotel-id/overview
Description: Contains various widgets used for hotels
Version: 1.0.0
Author: Tripcraft
Author URI: AUTHOR_URL
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if( !class_exists('tripcraft_widgets') ) :

	class tripcraft_widgets {

		/*
		*  __construct
		*
		*  This function will setup the class functionality
		*
		*  @type	function
		*  @date	17/02/2016
		*  @since	1.0.0
		*
		*  @param	n/a
		*  @return	n/a
		*/

		function __construct() {

			// vars
			$this->settings = array(
				'version'	=> '1.0.0',
				'url'		=> plugin_dir_url( __FILE__ ),
				'path'		=> plugin_dir_path( __FILE__ )
			);


			// set text domain
			// https://codex.wordpress.org/Function_Reference/load_plugin_textdomain
			load_plugin_textdomain( 'tripcraft_widgets', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' );

			add_action('admin_menu', array($this, 'create_settings_page'));
			add_action( 'admin_init', array( $this, 'setup_settings_page' ));

			//$plugin = plugin_basename( __FILE__ );
			//add_filter( "plugin_action_links_$plugin", array($this, 'plugin_add_settings_link'));

			add_action( 'init', array($this, 'register_shortcodes'));

		}
		function register_shortcodes() {
			add_shortcode( 'hotel-teaser-rate', array($this, 'hotel_teaser_rate'));
		}

		function hotel_teaser_rate ($atts){
			$params = shortcode_atts( array(
        'hotel_id' => ''
    	), $atts );

			$url = get_option('tripcraft_widgets_hotel_master_url'). "/wordpress/hotels/{$params['hotel_id']}";
			$response = wp_remote_get($url);

			$api_response = json_decode( wp_remote_retrieve_body( $response ), true );

			if ($api_response !== null && array_key_exists('teaser_rate', $api_response) && $api_response['teaser_rate'] !== NULL) {
				return "<div class='teaser-rate-value'>
						<div class='hotel-price'>$<span>" . $api_response['teaser_rate'] . "</span></div>
	    			<div class='hotel-price-description'>Tonight</div>
					</div>";
			} else {
				return "";
			}
		}

		function create_settings_page() {
			add_menu_page(
				'Tripcraft Widgets Settings',
				'Tripcraft Widgets',
				'administrator',
				'tripcraft_widgets',
				array($this, 'plugin_settings_page_content')
			);
		}

		public function plugin_settings_page_content() {
			if (!current_user_can('manage_options')) {
					return;
			}
			?>
			<div class="wrap">
				<h2>Tripcraft Widgets Settings</h2>
				<form method="post" action="options.php">
          <?php
              settings_fields( 'tripcraft_widgets' );
              do_settings_sections( 'tripcraft_widgets' );
              submit_button();
          ?>
				</form>
			</div> <?php
		}

		public function setup_settings_page() {
			//register the option field first
			register_setting( 'tripcraft_widgets', 'tripcraft_widgets_hotel_master_url' );

			add_settings_section( 'tripcraft_remote_server_settings', 'Remote Server Settings', false, 'tripcraft_widgets' );
			add_settings_field( 'tripcraft_widgets_hotel_master_url', 'Hotel Master Url', array( $this, 'field_callback' ), 'tripcraft_widgets', 'tripcraft_remote_server_settings' );
		}

		public function field_callback( $arguments ) {
			echo '<input name="tripcraft_widgets_hotel_master_url" id="tripcraft_widgets_hotel_master_url" type="text" value="' . get_option( 'tripcraft_widgets_hotel_master_url' ) . '" />';

		}
	}


// initialize
new tripcraft_widgets();


// class_exists check
endif;

?>
