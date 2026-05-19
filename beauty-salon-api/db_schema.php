<?php
/**
 * Detect which tables/columns exist (supports old DBs before migration).
 */
function schema_table_exists(mysqli $conn, string $table): bool
{
    $safe = $conn->real_escape_string($table);
    $result = $conn->query("SHOW TABLES LIKE '{$safe}'");
    return $result && $result->num_rows > 0;
}

function schema_column_exists(mysqli $conn, string $table, string $column): bool
{
    $safeTable = $conn->real_escape_string($table);
    $safeCol = $conn->real_escape_string($column);
    $result = $conn->query("SHOW COLUMNS FROM `{$safeTable}` LIKE '{$safeCol}'");
    return $result && $result->num_rows > 0;
}

function schema_has_clients(mysqli $conn): bool
{
    return schema_table_exists($conn, "clients");
}

function schema_appointments_use_client_id(mysqli $conn): bool
{
    return schema_column_exists($conn, "appointments", "client_id");
}
