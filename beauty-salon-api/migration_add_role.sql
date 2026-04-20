-- Run in phpMyAdmin if the users table has no role column yet.
ALTER TABLE users
  ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'employee' AFTER password;

-- Then set one administrator (change the email):
-- UPDATE users SET role = 'admin' WHERE email = 'admin@bellaluxe.local';
