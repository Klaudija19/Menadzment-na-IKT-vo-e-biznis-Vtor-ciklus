-- Run in phpMyAdmin on an existing beauty_salon database.

USE beauty_salon;

CREATE TABLE IF NOT EXISTS clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(190) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  visit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Link appointments to clients (keeps client_name for older rows until migrated).
ALTER TABLE appointments
  ADD COLUMN client_id INT DEFAULT NULL AFTER id;

-- Optional: import distinct client_name values into clients (split on first space).
-- Run only if you already have appointment rows with client_name filled in.
-- INSERT INTO clients (first_name, last_name, visit_count)
-- SELECT
--   SUBSTRING_INDEX(TRIM(client_name), ' ', 1),
--   CASE
--     WHEN LOCATE(' ', TRIM(client_name)) > 0
--     THEN SUBSTRING(TRIM(client_name), LOCATE(' ', TRIM(client_name)) + 1)
--     ELSE ''
--   END,
--   COUNT(*)
-- FROM appointments
-- WHERE TRIM(client_name) <> ''
-- GROUP BY TRIM(client_name);
