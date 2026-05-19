-- ============================================================
-- Bella Luxe — FULL setup (run once in phpMyAdmin → Import)
-- ============================================================

CREATE DATABASE IF NOT EXISTS beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_salon;

DROP TABLE IF EXISTS appointments;
DROP TABLE IF EXISTS clients;
DROP TABLE IF EXISTS services;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee'
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(80) NOT NULL,
  last_name VARCHAR(80) NOT NULL,
  phone VARCHAR(40) DEFAULT NULL,
  email VARCHAR(190) DEFAULT NULL,
  notes TEXT DEFAULT NULL,
  visit_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT DEFAULT NULL,
  client_name VARCHAR(160) DEFAULT NULL,
  service_id INT NOT NULL,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL
);

-- Demo admin: email admin@bellaluxe.local / password: admin123
INSERT INTO users (name, email, password, role) VALUES
  ('Administrator', 'admin@bellaluxe.local', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin');

INSERT INTO employees (name) VALUES
  ('Ana Stojanovska'),
  ('Marija Petrovska'),
  ('Elena Nikolovska');

INSERT INTO services (name, price) VALUES
  ('Classic manicure', 700.00),
  ('Gel polish', 900.00),
  ('Classic pedicure', 1200.00),
  ('Women''s haircut', 1500.00),
  ('Eyebrow shaping', 400.00);

INSERT INTO clients (first_name, last_name, phone, email, notes, visit_count) VALUES
  ('Sofija', 'Markovska', '070 111 222', 'sofija@example.com', 'Prefers gel polish.', 0),
  ('Ivana', 'Dimitrova', '075 333 444', 'ivana@example.com', 'Regular depilation.', 0);

-- Demo login: admin@bellaluxe.local / password
