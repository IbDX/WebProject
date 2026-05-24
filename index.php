<?php
/**
 * Frontend entry point for the separated UI repo.
 */

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: SAMEORIGIN');
header('X-XSS-Protection: 1; mode=block');
header('Content-Type: text/html; charset=utf-8');

readfile(__DIR__ . '/index.html');
