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
$price = isset($data->price) ? floatval($data->price) : 0;

if ($id <= 0 || $name === "" || $price <= 0) {
    echo json_encode(["error" => "Missing or invalid fields"]);
    exit;
}

$stmt = $conn->prepare("UPDATE services SET name = ?, price = ? WHERE id = ?");
$stmt->bind_param("sdi", $name, $price, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Service updated"]);
} else {
    echo json_encode(["error" => "Update failed"]);
}
