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

if ($name === "") {
    echo json_encode(["error" => "Name is required"]);
    exit;
}

$stmt = $conn->prepare("INSERT INTO employees (name) VALUES (?)");
$stmt->bind_param("s", $name);

if ($stmt->execute()) {
    echo json_encode(["message" => "Employee added"]);
} else {
    echo json_encode(["error" => "Insert failed"]);
}
