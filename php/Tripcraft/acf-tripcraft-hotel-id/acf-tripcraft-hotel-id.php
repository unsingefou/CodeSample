<?php

/*
Plugin Name: ACF: Tripcraft Hotel Id
Plugin URI: https://bitbucket.org/tripcraft/acf-field-type-hotel-id/overview
Description: Input that connects hotel in wordpress with id in tripcraft backend
Version: 1.0.0
Author: Tripcraft
Author URI: AUTHOR_URL
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
*/

// exit if accessed directly
if( ! defined( 'ABSPATH' ) ) exit;


// check if class already exists
if( !class_exists('acf_plugin_tripcraft_hotel_id') ) :

	class acf_plugin_tripcraft_hotel_id {

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
			load_plugin_textdomain( 'acf-tripcraft-hotel-id', false, plugin_basename( dirname( __FILE__ ) ) . '/lang' );

			// include field
			add_action('acf/include_field_types', 	array($this, 'include_field_types')); // v5
			add_action('acf/register_fields', 		array($this, 'include_field_types')); // v4

			register_activation_hook( __FILE__, array($this, 'mass_update_posts' ) );


			add_action('admin_menu', array($this, 'create_settings_page'));
			add_action( 'admin_init', array( $this, 'setup_settings_page' ));

			$plugin = plugin_basename( __FILE__ );
			add_filter( "plugin_action_links_$plugin", array($this, 'plugin_add_settings_link'));

		}


		/*
		*  include_field_types
		*
		*  This function will include the field type class
		*
		*  @type	function
		*  @date	17/02/2016
		*  @since	1.0.0
		*
		*  @param	$version (int) major ACF version. Defaults to false
		*  @return	n/a
		*/

		function include_field_types( $version = false ) {

			// support empty $version
			if( !$version ) $version = 4;


			// include
			include_once('fields/acf-tripcraft-hotel-id-v' . $version . '.php');

		}

		/*
		* Copy existing hotel_id from posts to proper tripcraft_hotel_id
		*/
		function mass_update_posts() {
			$args = array(
				'post_type'=>'post', //whatever post type you need to update
				'numberposts'=>-1
			);

			$all_posts = get_posts($args);

			foreach($all_posts as $key => $post){

				delete_post_meta($post->ID, 'article_hotels');
				$post_meta = get_post_meta($post->ID);

				for ($i = 1; $i <= 6; $i++) {
					if ($i == 1) {
						$x = null;
					} else {
						$x = $i;
					}

					$hotel_name = 'hotel_name' . $x;
					$hotel_image = 'hotel_image' . $x;
					$hotel_article = 'hotel_article' . $x;
					$hotel_code = 'hotel_id' . $x;
					$system_code = 'hotel_code' . $x;
					$hotel_features = 'hotel_features' . $x;
					$hotel_location = 'hotel_location' . $x;
					$instagram_feed = 'instagram_feed' . $x;
					$hotel_social = 'hotel_social' . $x;

					if (isset($post_meta[$hotel_name]) && $post_meta[$hotel_name][0] != '') {
						$hotel = array(
							'hotel_name' => (isset($post_meta[$hotel_name]) ? $post_meta[$hotel_name][0] : null),
							'hotel_image' => (isset($post_meta[$hotel_image]) ? $post_meta[$hotel_image][0] : null),
							'hotel_article' => (isset($post_meta[$hotel_article]) ? $post_meta[$hotel_article][0] : null),
							'hotel_code' => (isset($post_meta[$hotel_code]) ? $post_meta[$hotel_code][0] : null),
							'system_code' => (isset($post_meta[$system_code]) ? $post_meta[$system_code][0] : null),
							'hotel_features' => (isset($post_meta[$hotel_features]) ? $post_meta[$hotel_features][0] : null),
							'hotel_location' => (isset($post_meta[$hotel_location]) ? $post_meta[$hotel_location][0] : null),
							'instagram_feed' => (isset($post_meta[$instagram_feed]) ? $post_meta[$instagram_feed][0] : null),
							'hotel_social' => (isset($post_meta[$hotel_social]) ? $post_meta[$hotel_social][0] : null)
						);
						add_row('article_hotels', $hotel, $post->ID );
					}
				}
			}
		}

		function plugin_add_settings_link( $links ) {
	    $settings_link = '<a href="options-general.php?page=tripcraft_hotel_id">' . __( 'Settings' ) . '</a>';
	    array_push( $links, $settings_link );
	  	return $links;
		}


		function create_settings_page() {
			add_submenu_page(
				'options-general.php',
				'Tripcraft Hotel ID Settings',
				'Tripcraft Hotel ID Settings',
				'administrator',
				'tripcraft_hotel_id',
				array($this, 'plugin_settings_page_content')
			);
		}

		public function plugin_settings_page_content() {
			if (!current_user_can('manage_options')) {
					return;
			}
			?>
			<div class="wrap">
				<h2>Tripcraft Hotel ID Setting</h2>
				<form method="post" action="options.php">
          <?php
              settings_fields( 'tripcraft_hotel_id' );
              do_settings_sections( 'tripcraft_hotel_id' );
              submit_button();
          ?>
				</form>
			</div> <?php
		}

		public function setup_settings_page() {
			//register the option field first
			register_setting( 'tripcraft_hotel_id', 'acf_tripcraft_hotel_master_url' );

			add_settings_section( 'acf_tripcraft_hotel_id_section', 'Remote Server Settings', false, 'tripcraft_hotel_id' );
			add_settings_field( 'acf_tripcraft_hotel_master_url', 'Hotel Master Url', array( $this, 'field_callback' ), 'tripcraft_hotel_id', 'acf_tripcraft_hotel_id_section' );
		}

		public function field_callback( $arguments ) {
			echo '<input name="acf_tripcraft_hotel_master_url" id="acf_tripcraft_hotel_master_url" type="text" value="' . get_option( 'acf_tripcraft_hotel_master_url' ) . '" />';

		}
	}


// initialize
new acf_plugin_tripcraft_hotel_id();


// class_exists check
endif;

?>
