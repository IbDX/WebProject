<?php
/**
 * Secure Banking Application - Main Entry Point
 * 
 * Routes API requests and serves frontend
 */

// Set error reporting
if (getenv('APP_ENV') === 'development') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}

// Security headers
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Strict-Transport-Security: max-age=31536000; includeSubDomains');
header('Content-Security-Policy: default-src \'self\'; script-src \'self\' \'unsafe-inline\'; style-src \'self\' \'unsafe-inline\'');

// Set up application
define('APP_ROOT', dirname(__FILE__));
define('APP_ENV', getenv('APP_ENV') ?: 'production');

// CORS handling
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    http_response_code(200);
    exit;
}

// Check if this is an API request
$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = $path === '' ? [] : explode('/', $path);

if (in_array('api', $segments, true)) {
    // Route to API
    require APP_ROOT . '/src/controllers/Router.php';
} else {
    // Serve frontend
    require APP_ROOT . '/public/index.html';
}
?>
