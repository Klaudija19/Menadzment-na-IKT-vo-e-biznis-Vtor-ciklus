-- Bella Luxe / beauty_salon reference schema (MySQL / MariaDB)
-- Run once on an empty database, or compare with your existing tables.
-- Foreign keys are omitted so existing partial data does not block imports.

CREATE DATABASE IF NOT EXISTS beauty_salon CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE beauty_salon;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'employee'
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL
);

CREATE TABLE IF NOT EXISTS services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(160) NOT NULL,
  price DECIMAL(10,2) NOT NULL
);

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

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_id INT DEFAULT NULL,
  client_name VARCHAR(160) DEFAULT NULL,
  service_id INT NOT NULL,
  employee_id INT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL
);

-- Existing DB without role: see migration_add_role.sql
-- Existing DB without clients: see migration_add_clients.sql
-- Admin: UPDATE users SET role = 'admin' WHERE email = 'your@email';
