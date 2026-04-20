<?php
/**
 * Database connection (adjust in one place for deploy).
 */
$host = getenv("DB_HOST") ?: "localhost";
$user = getenv("DB_USER") ?: "root";
$dbPass = getenv("DB_PASS");
$password = $dbPass === false ? "" : $dbPass;
$dbname = getenv("DB_NAME") ?: "beauty_salon";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    http_response_code(500);
    header("Content-Type: application/json; charset=utf-8");
    echo json_encode(["error" => "Database connection failed"]);
    exit();
}

$conn->set_charset("utf8mb4");
