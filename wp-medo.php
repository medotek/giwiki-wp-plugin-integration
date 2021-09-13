<?php
/**
 * Plugin Name: Medo Plugin Integration with SEELIEDB
 * Plugin URI:  https://seeliedb.guda.club/
 * Description: Intégration de la base de données seeliedb
 * Version:     1.0.0
 * Author:      Medo
 * Author URI:  https://guda.club/
 * Text Domain: medo
 * License:     GPL-2.0+
 * License URI: http://www.gnu.org/licenses/gpl-2.0.txt
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
    die;
}

/**
 * Enqueue frontend scripts.
 */
function medo_weapons_script() {

    wp_enqueue_style( 'medo-frontend-css',   plugins_url( 'assets/css/weapons.css', __FILE__ ),[ 'jquery' ], '1.1', 'all');


    wp_enqueue_script(
        'medo-frontend-js',
        plugins_url( 'assets/js/weapons.js', __FILE__ ),
        [ 'jquery' ],
        '11272018'
    );
}
add_action( 'wp_enqueue_scripts', 'medo_weapons_script' );



function medo_shortcode_weapons(){
    return '
    <div class="weapons-filter">

        <div class="rarity-filter">
            <label for="">Trier par rareté : </label>
            <button class="all active-filter" data-filter="*">All</button>
            <button class="rarity-5" data-filter=".rarity-5">5*</button>
            <button class="rarity-4" data-filter=".rarity-4">4*</button>
            <button class="rarity-3" data-filter=".rarity-3">3*</button>
            <button class="rarity-2" data-filter=".rarity-2">2*</button>
            <button class="rarity-1" data-filter=".rarity-1">1*</button>
        </div>
        <br>
        <div class="type-filter">
            <label for="">Trier par type : </label>
            <button class="all active-filter" data-filter="*">All</button>
            <button class="claymore" data-filter=".claymore">Épée à deux mains</button>
            <button class="polearm" data-filter=".polearm">Arme d\'hast</button>
            <button class="bow" data-filter=".bow">Arc</button>
            <button class="sword" data-filter=".sword">Épée à une main</button>
            <button class="catalist" data-filter=".catalist">Catalyseur</button>
        </div>
    </div>
    <div id="weapons-list"></div>
    <div class="weapon-overlay"></div>
    <div class="weapon-full-detail"></div>
    ';
}
add_shortcode('weapons', 'shortcode_weapons');

