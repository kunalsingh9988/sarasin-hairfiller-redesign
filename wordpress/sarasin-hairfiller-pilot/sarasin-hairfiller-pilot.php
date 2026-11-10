<?php
/**
 * Plugin Name: Sarasin Hairfiller Pilot — Staging Review
 * Description: Optional isolated review-page template. Does not create pages, publish posts, change themes or enable indexing.
 * Version: 0.3.1
 * Requires at least: 6.0
 * Requires PHP: 7.4
 */

if (!defined('ABSPATH')) {
    exit;
}

function sarasin_hairfiller_pilot_is_page() {
    return is_page() && is_page_template('sarasin-hairfiller-pilot.php');
}

add_filter('theme_page_templates', function ($templates) {
    $templates['sarasin-hairfiller-pilot.php'] = 'Sarasin Hairfiller Pilot (staging review)';
    return $templates;
});

add_filter('template_include', function ($template) {
    if (sarasin_hairfiller_pilot_is_page()) {
        return plugin_dir_path(__FILE__) . 'templates/pilot.php';
    }
    return $template;
}, 99);

add_action('wp_enqueue_scripts', function () {
    if (!sarasin_hairfiller_pilot_is_page()) {
        return;
    }
    $base = plugin_dir_url(__FILE__) . 'public/';
    wp_enqueue_style('sarasin-pilot-homepage', $base . 'homepage.css', array(), '20261110-fonts');
    wp_enqueue_script('sarasin-pilot-ui', $base . 'homepage.js', array(), '20261110', true);
    wp_enqueue_script('sarasin-pilot-measurement', $base . 'measurement.js', array(), '20261110', true);
}, 50);

// Asset rewriting is restricted to the explicitly selected pilot page template.
add_filter('the_content', function ($content) {
    if (!sarasin_hairfiller_pilot_is_page() || !in_the_loop() || !is_main_query()) {
        return $content;
    }
    $base = plugin_dir_url(__FILE__) . 'public/assets/';
    return preg_replace_callback('/\b(src|href)="assets\/([^"<>]+)"/', function ($match) use ($base) {
        return $match[1] . '="' . esc_url($base . $match[2]) . '"';
    }, $content);
}, 20);

function sarasin_hairfiller_pilot_indexing_approved() {
    return defined('SARASIN_HAIRFILLER_PILOT_LAUNCH_APPROVED') && SARASIN_HAIRFILLER_PILOT_LAUNCH_APPROVED === true;
}

// A template imported accidentally onto production must not become indexable by default.
add_filter('wp_robots', function ($robots) {
    if (sarasin_hairfiller_pilot_is_page() && !sarasin_hairfiller_pilot_indexing_approved()) {
        $robots['noindex'] = true;
        unset($robots['index']);
    }
    return $robots;
});

add_filter('wp_headers', function ($headers) {
    if (sarasin_hairfiller_pilot_is_page() && !sarasin_hairfiller_pilot_indexing_approved()) {
        $headers['X-Robots-Tag'] = 'noindex, follow';
    }
    return $headers;
});
