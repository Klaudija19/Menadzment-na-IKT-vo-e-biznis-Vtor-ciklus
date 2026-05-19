<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/db_schema.php";

$ok = true;
$checks = [];

$checks["database"] = $conn->query("SELECT 1") ? "connected" : "failed";
if ($checks["database"] === "failed") {
    $ok = false;
}

$tables = ["users", "employees", "services", "clients", "appointments"];
foreach ($tables as $t) {
    $exists = schema_table_exists($conn, $t);
    $checks["table_{$t}"] = $exists ? "ok" : "missing";
    if (!$exists) {
        $ok = false;
    }
}

$checks["users_role_column"] = schema_column_exists($conn, "users", "role") ? "ok" : "missing";
$checks["appointments_client_id"] = schema_column_exists($conn, "appointments", "client_id") ? "ok" : "missing";

if ($checks["users_role_column"] === "missing" || $checks["appointments_client_id"] === "missing") {
    $ok = false;
}

echo json_encode([
    "ok" => $ok,
    "message" => $ok
        ? "API and database look good."
        : "Database incomplete — import setup_full.sql in phpMyAdmin.",
    "checks" => $checks,
]);
