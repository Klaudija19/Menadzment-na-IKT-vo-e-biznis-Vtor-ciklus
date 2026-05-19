<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";

require_admin();

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;
if ($id <= 0) {
    echo json_encode(["error" => "Invalid id"]);
    exit;
}

$check = $conn->prepare("SELECT COUNT(*) AS c FROM appointments WHERE client_id = ?");
$check->bind_param("i", $id);
$check->execute();
$row = $check->get_result()->fetch_assoc();
if ((int) $row["c"] > 0) {
    echo json_encode(["error" => "Cannot delete: client has appointments. Remove appointments first."]);
    exit;
}

$stmt = $conn->prepare("DELETE FROM clients WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Deleted"]);
} else {
    echo json_encode(["error" => "Delete failed"]);
}
