<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";
require_once __DIR__ . "/appointment_validate.php";
require_once __DIR__ . "/client_helpers.php";
require_once __DIR__ . "/db_schema.php";

require_role("admin", "employee");

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$client_id = isset($data->client_id) ? intval($data->client_id) : 0;
$client_name = trim($data->client_name ?? "");
$service_id = isset($data->service_id) ? intval($data->service_id) : 0;
$employee_id = isset($data->employee_id) ? intval($data->employee_id) : 0;
$date = $data->date ?? null;
$time = $data->time ?? null;

$hasClients = schema_has_clients($conn);
$hasClientIdCol = schema_appointments_use_client_id($conn);

if ($hasClients && $hasClientIdCol) {
    if ($client_id <= 0 || !$date || !$time || $service_id <= 0 || $employee_id <= 0) {
        echo json_encode(["error" => "Missing or invalid fields. Select a client from the list."]);
        exit;
    }
    $clientStmt = $conn->prepare("SELECT id, first_name, last_name FROM clients WHERE id = ?");
    $clientStmt->bind_param("i", $client_id);
    $clientStmt->execute();
    $clientRow = $clientStmt->get_result()->fetch_assoc();
    if (!$clientRow) {
        echo json_encode(["error" => "Invalid client"]);
        exit;
    }
    $client_name = client_display_name($clientRow);
    $clientStmt->close();
} else {
    if ($client_name === "" || !$date || !$time || $service_id <= 0 || $employee_id <= 0) {
        echo json_encode([
            "error" => "Database needs update. Import beauty-salon-api/setup_full.sql in phpMyAdmin, then restart.",
        ]);
        exit;
    }
    $client_id = 0;
}

$v = appointment_validate_fields($client_name, $date, $time);
if ($v !== null) {
    echo json_encode(["error" => $v]);
    exit;
}

$svc = $conn->prepare("SELECT id FROM services WHERE id = ?");
$svc->bind_param("i", $service_id);
$svc->execute();
if ($svc->get_result()->num_rows === 0) {
    echo json_encode(["error" => "Invalid service"]);
    exit;
}

$emp = $conn->prepare("SELECT id FROM employees WHERE id = ?");
$emp->bind_param("i", $employee_id);
$emp->execute();
if ($emp->get_result()->num_rows === 0) {
    echo json_encode(["error" => "Invalid employee"]);
    exit;
}

$check = $conn->prepare(
    "SELECT id FROM appointments WHERE employee_id = ? AND date = ? AND time = ?"
);
$check->bind_param("iss", $employee_id, $date, $time);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(["error" => "This employee already has an appointment at that time"]);
    exit;
}

if ($hasClients && $hasClientIdCol && $client_id > 0) {
    $stmt = $conn->prepare(
        "INSERT INTO appointments (client_id, client_name, service_id, employee_id, date, time)
        VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("isiiss", $client_id, $client_name, $service_id, $employee_id, $date, $time);
} else {
    $stmt = $conn->prepare(
        "INSERT INTO appointments (client_name, service_id, employee_id, date, time)
        VALUES (?, ?, ?, ?, ?)"
    );
    $stmt->bind_param("siiss", $client_name, $service_id, $employee_id, $date, $time);
}

if ($stmt->execute()) {
    if ($client_id > 0) {
        client_refresh_visit_count($conn, $client_id);
    }
    echo json_encode(["message" => "Appointment added"]);
} else {
    echo json_encode(["error" => "Insert failed: " . $conn->error]);
}
