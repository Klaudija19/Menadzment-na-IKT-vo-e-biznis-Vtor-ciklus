<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$name = trim($data->name ?? "");
$email = trim($data->email ?? "");
$password = $data->password ?? "";

if ($name === "" || $email === "" || $password === "") {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["error" => "Invalid email"]);
    exit;
}

if (strlen($password) < 6) {
    echo json_encode(["error" => "Password must be at least 6 characters"]);
    exit;
}

$dup = $conn->prepare("SELECT id FROM users WHERE email = ?");
$dup->bind_param("s", $email);
$dup->execute();
if ($dup->get_result()->num_rows > 0) {
    echo json_encode(["error" => "Email already registered"]);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);

$hasRole = false;
$cols = @$conn->query("SHOW COLUMNS FROM users LIKE 'role'");
if ($cols && $cols->num_rows > 0) {
    $hasRole = true;
}

if ($hasRole) {
    $stmt = $conn->prepare("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'employee')");
    $stmt->bind_param("sss", $name, $email, $hash);
} else {
    $stmt = $conn->prepare("INSERT INTO users (name, email, password) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $name, $email, $hash);
}

if ($stmt->execute()) {
    echo json_encode(["message" => "User registered"]);
} else {
    echo json_encode(["error" => "Registration failed"]);
}
