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

$name = trim($data->name ?? "");
$price = isset($data->price) ? floatval($data->price) : 0;

if ($name === "" || $price <= 0) {
    echo json_encode(["error" => "Valid name and price are required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO services (name, price) VALUES (?, ?)");
$stmt->bind_param("sd", $name, $price);

if ($stmt->execute()) {
    echo json_encode(["message" => "Service added"]);
} else {
    echo json_encode(["error" => "Insert failed"]);
}
