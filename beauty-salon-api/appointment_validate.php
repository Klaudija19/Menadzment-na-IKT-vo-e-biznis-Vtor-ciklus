<?php
/**
 * Shared validation for appointment payloads (add + update).
 *
 * @return string|null Error message or null if OK.
 */
function appointment_validate_fields($client_name, $date, $time)
{
    if (strlen($client_name) > 160) {
        return "Client name is too long (max 160 characters)";
    }

    if (!is_string($date) || !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) {
        return "Invalid date format";
    }

    $parts = array_map("intval", explode("-", $date));
    if (count($parts) !== 3 || !checkdate($parts[1], $parts[2], $parts[0])) {
        return "Invalid calendar date";
    }

    if (!is_string($time) || !preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $time)) {
        return "Invalid time format";
    }

    return null;
}
