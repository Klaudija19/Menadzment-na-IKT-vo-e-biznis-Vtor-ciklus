<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/appointment_validate.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$client_name = trim($data->client_name ?? "");
$service_id = isset($data->service_id) ? intval($data->service_id) : 0;
$employee_id = isset($data->employee_id) ? intval($data->employee_id) : 0;
$date = $data->date ?? null;
$time = $data->time ?? null;

if ($client_name === "" || !$date || !$time || $service_id <= 0 || $employee_id <= 0) {
    echo json_encode(["error" => "Missing or invalid fields"]);
    exit;
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

$stmt = $conn->prepare(
    "INSERT INTO appointments (client_name, service_id, employee_id, date, time) VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("siiss", $client_name, $service_id, $employee_id, $date, $time);

if ($stmt->execute()) {
    echo json_encode(["message" => "Appointment added"]);
} else {
    echo json_encode(["error" => "Insert failed"]);
}
