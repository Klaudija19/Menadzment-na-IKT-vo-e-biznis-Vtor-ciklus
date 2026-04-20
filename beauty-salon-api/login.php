<?php
require_once __DIR__ . "/cors_json.php";
require_once __DIR__ . "/db.php";

$data = json_decode(file_get_contents("php://input"));

if (!$data) {
    echo json_encode(["error" => "No data received"]);
    exit;
}

$email = trim($data->email ?? "");
$password = $data->password ?? "";

if ($email === "" || $password === "") {
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();
    if (password_verify($password, $user["password"])) {
        $role = isset($user["role"]) ? $user["role"] : "employee";
        echo json_encode([
            "success" => true,
            "user" => [
                "id" => (int) $user["id"],
                "name" => $user["name"],
                "email" => $user["email"],
                "role" => $role,
            ],
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Wrong password"]);
    }
} else {
    echo json_encode(["success" => false, "message" => "User not found"]);
}
