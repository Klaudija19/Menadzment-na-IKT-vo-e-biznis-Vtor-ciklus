<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$id = isset($data->id) ? intval($data->id) : 0;
$name = trim($data->name ?? "");

if ($id <= 0 || $name === "") {
    echo json_encode(["error" => "Missing or invalid fields"]);
    exit;
}

$stmt = $conn->prepare("UPDATE employees SET name = ? WHERE id = ?");
$stmt->bind_param("si", $name, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Employee updated"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}
