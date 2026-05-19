<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";
require_once __DIR__ . "/appointment_validate.php";
require_once __DIR__ . "/client_helpers.php";

require_admin();

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$id = isset($data->id) ? intval($data->id) : 0;
$client_id = isset($data->client_id) ? intval($data->client_id) : 0;
$service_id = isset($data->service_id) ? intval($data->service_id) : 0;
$employee_id = isset($data->employee_id) ? intval($data->employee_id) : 0;
$date = $data->date ?? null;
$time = $data->time ?? null;

if ($id <= 0 || $client_id <= 0 || !$date || !$time || $service_id <= 0 || $employee_id <= 0) {
    echo json_encode(["error" => "Missing or invalid fields"]);
    exit;
}

$oldStmt = $conn->prepare("SELECT client_id FROM appointments WHERE id = ?");
$oldStmt->bind_param("i", $id);
$oldStmt->execute();
$oldRow = $oldStmt->get_result()->fetch_assoc();
if (!$oldRow) {
    echo json_encode(["error" => "Appointment not found"]);
    exit;
}
$oldClientId = (int) ($oldRow["client_id"] ?? 0);
$oldStmt->close();

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
    "SELECT id FROM appointments WHERE employee_id = ? AND date = ? AND time = ? AND id <> ?"
);
$check->bind_param("issi", $employee_id, $date, $time, $id);
$check->execute();
if ($check->get_result()->num_rows > 0) {
    echo json_encode(["error" => "This employee already has an appointment at that time"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE appointments SET client_id = ?, client_name = ?, service_id = ?, employee_id = ?, date = ?, time = ?
    WHERE id = ?"
);
$stmt->bind_param("isiissi", $client_id, $client_name, $service_id, $employee_id, $date, $time, $id);

if ($stmt->execute()) {
    if ($oldClientId > 0) {
        client_refresh_visit_count($conn, $oldClientId);
    }
    client_refresh_visit_count($conn, $client_id);
    echo json_encode(["message" => "Appointment updated"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}
