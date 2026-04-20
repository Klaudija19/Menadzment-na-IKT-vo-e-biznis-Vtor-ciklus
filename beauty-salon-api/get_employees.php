<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$result = $conn->query("SELECT * FROM employees ORDER BY name");
$data = [];
if ($result) {
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
}

echo json_encode($data);
