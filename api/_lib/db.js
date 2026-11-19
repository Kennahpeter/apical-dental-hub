// Neon Postgres connection + the prices table.
// The table is created and filled with the starting prices automatically the first time it is used.
import { neon } from '@neondatabase/serverless';

export const DEFAULT_PRICES = [
  { id: 'braces',     name: 'Braces',              unit: 'per jaw',     price: 10000, sort: 0 },
  { id: 'scaling',    name: 'Scaling & Polishing', unit: 'per session', price: 3000,  sort: 1 },
  { id: 'whitening',  name: 'Teeth Whitening',     unit: 'per session', price: 15000, sort: 2 },
  { id: 'extraction', name: 'Extraction',          unit: 'per tooth',   price: 2000,  sort: 3 },
  { id: 'rootcanal',  name: 'Root Canal',          unit: 'per tooth',   price: 12000, sort: 4 },
];

let sqlClient;
export function sql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL is not set');
  sqlClient ||= neon(url);
  return sqlClient;
}

let ready = false;
export async function ensureTable() {
  if (ready) return;
  const db = sql();
  await db`CREATE TABLE IF NOT EXISTS prices (
    id         TEXT PRIMARY KEY,
    name       TEXT NOT NULL,
    unit       TEXT NOT NULL DEFAULT '',
    price      INTEGER NOT NULL CHECK (price >= 0),
    sort       INTEGER NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;
  const [{ n }] = await db`SELECT count(*)::int AS n FROM prices`;
  if (n === 0) {
    for (const p of DEFAULT_PRICES) {
      await db`INSERT INTO prices (id, name, unit, price, sort)
               VALUES (${p.id}, ${p.name}, ${p.unit}, ${p.price}, ${p.sort})
               ON CONFLICT (id) DO NOTHING`;
    }
  }
  ready = true;
}

export async function listPrices() {
  await ensureTable();
  return sql()`SELECT id, name, unit, price, sort, updated_at FROM prices ORDER BY sort, name`;
}
