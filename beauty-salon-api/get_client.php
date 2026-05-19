<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";
require_once __DIR__ . "/client_helpers.php";

require_role("admin", "employee");

$id = isset($_GET["id"]) ? intval($_GET["id"]) : 0;
if ($id <= 0) {
    echo json_encode(["error" => "Invalid id"]);
    exit;
}

$stmt = $conn->prepare(
    "SELECT id, first_name, last_name, phone, email, notes, visit_count, created_at
    FROM clients WHERE id = ?"
);
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
if ($result->num_rows === 0) {
    echo json_encode(["error" => "Client not found"]);
    exit;
}

$client = $result->fetch_assoc();
$client["id"] = (int) $client["id"];
$client["visit_count"] = (int) $client["visit_count"];
$client["full_name"] = client_display_name($client);
$stmt->close();

$historySql = "SELECT a.id, a.date, a.time, a.service_id, a.employee_id,
    s.name AS service_name, e.name AS employee_name
    FROM appointments a
    LEFT JOIN services s ON a.service_id = s.id
    LEFT JOIN employees e ON a.employee_id = e.id
    WHERE a.client_id = ?
    ORDER BY a.date DESC, a.time DESC";
$hist = $conn->prepare($historySql);
$hist->bind_param("i", $id);
$hist->execute();
$historyResult = $hist->get_result();
$appointments = [];
$serviceTypes = [];

while ($row = $historyResult->fetch_assoc()) {
    $row["id"] = (int) $row["id"];
    $appointments[] = $row;
    if (!empty($row["service_name"]) && !in_array($row["service_name"], $serviceTypes, true)) {
        $serviceTypes[] = $row["service_name"];
    }
}
$hist->close();

echo json_encode([
    "client" => $client,
    "appointments" => $appointments,
    "service_types" => $serviceTypes,
]);
