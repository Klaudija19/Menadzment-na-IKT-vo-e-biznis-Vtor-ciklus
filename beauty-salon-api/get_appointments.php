<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";
require_once __DIR__ . "/auth_helpers.php";
require_once __DIR__ . "/client_helpers.php";
require_once __DIR__ . "/db_schema.php";

require_role("admin", "employee");

$employeeId = isset($_GET["employee_id"]) ? intval($_GET["employee_id"]) : 0;
$hasClients = schema_has_clients($conn);

if ($hasClients) {
    $baseSql = "SELECT a.*,
        c.first_name AS client_first_name,
        c.last_name AS client_last_name,
        s.name AS service_name,
        s.price AS service_price,
        e.name AS employee_name
        FROM appointments a
        LEFT JOIN clients c ON a.client_id = c.id
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN employees e ON a.employee_id = e.id";
} else {
    $baseSql = "SELECT a.*,
        s.name AS service_name,
        s.price AS service_price,
        e.name AS employee_name
        FROM appointments a
        LEFT JOIN services s ON a.service_id = s.id
        LEFT JOIN employees e ON a.employee_id = e.id";
}

$appointments = [];

function format_appointment_row(array $row): array
{
    $fromClient = "";
    if (!empty($row["client_first_name"]) || !empty($row["client_last_name"])) {
        $fromClient = trim(
            ($row["client_first_name"] ?? "") . " " . ($row["client_last_name"] ?? "")
        );
    }
    $row["client_name"] = $fromClient !== "" ? $fromClient : ($row["client_name"] ?? "");
    if (isset($row["client_id"])) {
        $row["client_id"] = $row["client_id"] !== null ? (int) $row["client_id"] : null;
    }
    return $row;
}

if ($employeeId > 0) {
    $sql = $baseSql . " WHERE a.employee_id = ? ORDER BY a.date, a.time";
    $stmt = $conn->prepare($sql);
    if ($stmt) {
        $stmt->bind_param("i", $employeeId);
        $stmt->execute();
        $result = $stmt->get_result();
        while ($row = $result->fetch_assoc()) {
            $appointments[] = format_appointment_row($row);
        }
        $stmt->close();
    }
} else {
    $sql = $baseSql . " ORDER BY a.date, a.time";
    $result = $conn->query($sql);
    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $appointments[] = format_appointment_row($row);
        }
    }
}

echo json_encode($appointments);
