<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";

require_admin();

$data = json_decode(file_get_contents("php://input"));
if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$first = trim($data->first_name ?? "");
$last = trim($data->last_name ?? "");
$phone = trim($data->phone ?? "");
$email = trim($data->email ?? "");
$notes = trim($data->notes ?? "");

if ($first === "" || $last === "") {
    echo json_encode(["error" => "First and last name are required"]);
    exit;
}

$stmt = $conn->prepare(
    "INSERT INTO clients (first_name, last_name, phone, email, notes) VALUES (?, ?, ?, ?, ?)"
);
$stmt->bind_param("sssss", $first, $last, $phone, $email, $notes);

if ($stmt->execute()) {
    echo json_encode([
        "message" => "Client added",
        "id" => (int) $conn->insert_id,
    ]);
} else {
    echo json_encode(["error" => "Insert failed"]);
}
