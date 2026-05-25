<?php
/**
 * Hybrid entry point for the unified repo.
 * Handles both API requests and serving the frontend UI.
 */

$path = trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');
$segments = $path === '' ? [] : explode('/', $path);

if (in_array('api', $segments, true)) {
    // ---- Backend API Logic ----
    define('APP_ROOT', dirname(__FILE__));
    define('APP_ENV', getenv('APP_ENV') ?: 'production');

    if (getenv('APP_ENV') === 'development') {
        ini_set('display_errors', 1);
        error_reporting(E_ALL);
    } else {
        ini_set('display_errors', 0);
        error_reporting(0);
    }

    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: SAMEORIGIN');
    header('X-XSS-Protection: 1; mode=block');

    require_once APP_ROOT . '/src/utils/Response.php';

    require APP_ROOT . '/src/controllers/Router.php';
    exit;
}

// ---- Frontend Logic ----
// Serve the frontend index.html for any non-API routes
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: text/html; charset=utf-8');

readfile(__DIR__ . '/index.html');
