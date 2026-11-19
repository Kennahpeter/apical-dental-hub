-- Optional: the API creates this table automatically on first use.
-- Run it yourself in the Neon SQL editor if you prefer.
CREATE TABLE IF NOT EXISTS prices (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  unit       TEXT NOT NULL DEFAULT '',
  price      INTEGER NOT NULL CHECK (price >= 0),
  sort       INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO prices (id, name, unit, price, sort) VALUES
  ('braces',     'Braces',              'per jaw',     10000, 0),
  ('scaling',    'Scaling & Polishing', 'per session', 3000,  1),
  ('whitening',  'Teeth Whitening',     'per session', 15000, 2),
  ('extraction', 'Extraction',          'per tooth',   2000,  3),
  ('rootcanal',  'Root Canal',          'per tooth',   12000, 4)
ON CONFLICT (id) DO NOTHING;
