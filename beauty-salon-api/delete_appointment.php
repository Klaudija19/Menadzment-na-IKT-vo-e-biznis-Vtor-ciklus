<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;

if ($id <= 0) {
    echo json_encode(["error" => "Invalid id"]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM appointments WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Deleted"]);
} else {
    echo json_encode(["error" => "Delete failed"]);
}
