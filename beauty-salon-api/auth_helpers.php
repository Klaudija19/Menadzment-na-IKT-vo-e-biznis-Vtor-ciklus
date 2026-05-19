<?php
/**
 * Lightweight role check via X-User-Role header (set by React after login).
 */
function request_user_role(): ?string
{
    $role = null;
    if (function_exists("getallheaders")) {
        $headers = getallheaders();
        if (is_array($headers)) {
            foreach ($headers as $key => $value) {
                if (strtolower((string) $key) === "x-user-role") {
                    $role = strtolower(trim((string) $value));
                    break;
                }
            }
        }
    }
    if ($role === null && isset($_SERVER["HTTP_X_USER_ROLE"])) {
        $role = strtolower(trim((string) $_SERVER["HTTP_X_USER_ROLE"]));
    }
    if ($role === null && isset($_GET["role"])) {
        $role = strtolower(trim((string) $_GET["role"]));
    }
    // Fallback for servers that drop custom headers (common on XAMPP).
    if ($role === null && isset($_POST["role"])) {
        $role = strtolower(trim((string) $_POST["role"]));
    }
    if (in_array($role, ["admin", "employee"], true)) {
        return $role;
    }
    return null;
}

function require_role(string ...$allowed): void
{
    $role = request_user_role();
    if ($role === null || !in_array($role, $allowed, true)) {
        http_response_code(403);
        echo json_encode(["error" => "Access denied"]);
        exit;
    }
}

function require_admin(): void
{
    require_role("admin");
}
