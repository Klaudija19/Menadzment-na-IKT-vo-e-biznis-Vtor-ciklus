<?php
/**
 * Keep visit_count in sync with linked appointments.
 */
function client_refresh_visit_count(mysqli $conn, int $clientId): void
{
    if ($clientId <= 0) {
        return;
    }
    $stmt = $conn->prepare(
        "UPDATE clients SET visit_count = (
            SELECT COUNT(*) FROM appointments WHERE client_id = ?
        ) WHERE id = ?"
    );
    $stmt->bind_param("ii", $clientId, $clientId);
    $stmt->execute();
    $stmt->close();
}

function client_display_name(array $row): string
{
    $first = trim($row["first_name"] ?? "");
    $last = trim($row["last_name"] ?? "");
    return trim($first . " " . $last);
}
