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

$id = isset($data->id) ? intval($data->id) : 0;
$first = trim($data->first_name ?? "");
$last = trim($data->last_name ?? "");
$phone = trim($data->phone ?? "");
$email = trim($data->email ?? "");
$notes = trim($data->notes ?? "");

if ($id <= 0 || $first === "" || $last === "") {
    echo json_encode(["error" => "Missing or invalid fields"]);
    exit;
}

$stmt = $conn->prepare(
    "UPDATE clients SET first_name = ?, last_name = ?, phone = ?, email = ?, notes = ? WHERE id = ?"
);
$stmt->bind_param("sssssi", $first, $last, $phone, $email, $notes, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Client updated"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}
