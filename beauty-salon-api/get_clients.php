<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";
require_once __DIR__ . "/client_helpers.php";
require_once __DIR__ . "/db_schema.php";

require_role("admin", "employee");

if (!schema_has_clients($conn)) {
    echo json_encode([
        "error" => "Clients table missing. Import setup_full.sql in phpMyAdmin (database: beauty_salon).",
    ]);
    exit;
}

$sql = "SELECT id, first_name, last_name, phone, email, notes, visit_count, created_at
    FROM clients ORDER BY last_name, first_name";
$result = $conn->query($sql);
$clients = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $row["id"] = (int) $row["id"];
        $row["visit_count"] = (int) $row["visit_count"];
        $row["full_name"] = client_display_name($row);
        $clients[] = $row;
    }
}

echo json_encode($clients);
