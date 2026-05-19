-- Optional demo clients (run after schema / migration_add_clients.sql)
USE beauty_salon;

INSERT INTO clients (first_name, last_name, phone, email, notes, visit_count) VALUES
  ('Sofija', 'Markovska', '070 111 222', 'sofija.m@example.com', 'Prefers gel polish; sensitive skin on hands.', 0),
  ('Ivana', 'Dimitrova', '075 333 444', 'ivana.d@example.com', 'Regular depilation — full legs.', 0),
  ('Elena', 'Jovanova', '078 555 666', NULL, 'Allergic to certain wax brands — check before booking.', 0);
