<?php
/**
 * Plugin Name:       PrePublish
 * Plugin URI:        https://
 * Description:
 * Version:           1.0.0
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Mark Chouinard
 * Author URI:        https://chouinard.me/
 * License:           GPL v2 or later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:
 * Domain Path:       /languages
 */

add_action( 'enqueue_block_editor_assets', 'pp_block_editor_assets' );

function pp_block_editor_assets() {

	$assets_path = __DIR__ . '/build/index.asset.php';
	if ( file_exists( $assets_path ) ) {
		$assets = require $assets_path;
		wp_enqueue_script( 'prepublish',
			plugin_dir_url( __FILE__ ) . 'build/index.js',
			$assets['dependencies'],
			$assets['version'],
			true );
		$style_file = __DIR__ . '/build/index.css';
		if ( file_exists( $style_file ) ) {
			wp_enqueue_style( 'prepublish-style',
				plugin_dir_url( __FILE__ ) . 'build/index.css',
				[],
				'1.0.0' );
		}
	}

}
