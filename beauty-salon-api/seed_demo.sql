-- Optional demo data: 3 employees and a fuller salon service list.
-- Run once after schema.sql. If you already ran this, use seed_extra_services.sql
-- or add services from the app (Services → New service).

USE beauty_salon;

INSERT INTO employees (name) VALUES
  ('Ana Stojanovska'),
  ('Marija Petrovska'),
  ('Elena Nikolovska');

INSERT INTO services (name, price) VALUES
  ('Classic manicure', 700.00),
  ('Gel polish', 900.00),
  ('Classic pedicure', 1200.00),
  ('Spa pedicure', 1500.00),
  ('Depilation — full legs', 2500.00),
  ('Depilation — underarms', 450.00),
  ('Depilation — bikini line', 800.00),
  ('Waxing — full legs', 2200.00),
  ('Women''s haircut', 1500.00),
  ('Hair colour', 2200.00),
  ('Blow-dry & styling', 900.00),
  ('Eyebrow shaping', 400.00),
  ('Eyelash extensions — classic set', 2800.00),
  ('Massage — 45 min', 1800.00),
  ('Facial — deep cleansing', 1600.00);
