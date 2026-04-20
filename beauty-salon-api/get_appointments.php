<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$employeeId = isset($_GET["employee_id"]) ? intval($_GET["employee_id"]) : 0;

$baseSql = "SELECT a.*, s.name AS service_name, s.price AS service_price, e.name AS employee_name
    FROM appointments a
    LEFT JOIN services s ON a.service_id = s.id
    LEFT JOIN employees e ON a.employee_id = e.id";

$appointments = [];

if ($employeeId > 0) {
    $sql = $baseSql . " WHERE a.employee_id = ? ORDER BY a.date, a.time";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $employeeId);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $appointments[] = $row;
        }
        $stmt->close();
    }
} else {
    $sql = $baseSql . " ORDER BY a.date, a.time";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $appointments[] = $row;
        }
    }
}

echo json_encode($appointments);
