-- Add more services without touching employees (run in phpMyAdmin if you already have data).
-- Duplicate names are allowed; adjust prices as needed.

USE beauty_salon;

INSERT INTO services (name, price) VALUES
  ('Depilation — full legs', 2500.00),
  ('Depilation — underarms', 450.00),
  ('Spa pedicure', 1500.00),
  ('Waxing — full legs', 2200.00),
  ('Eyebrow shaping', 400.00),
  ('Facial — deep cleansing', 1600.00);
