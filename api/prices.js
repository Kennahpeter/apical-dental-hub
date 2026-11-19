// GET  /api/prices  → public price list (used by the website)
// PUT  /api/prices  → owner only: replace the whole list  { items: [{id,name,unit,price}] }
import { sql, listPrices, ensureTable, DEFAULT_PRICES } from './_lib/db.js';
import { isAuthed } from './_lib/auth.js';

const clean = (s, max) => String(s ?? '').replace(/[<>]/g, '').trim().slice(0, max);
const slug = (s) => clean(s, 40).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      const rows = await listPrices();
      res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
      return res.status(200).json({ items: rows });
    }

    if (req.method === 'PUT') {
      res.setHeader('Cache-Control', 'no-store');
      if (!isAuthed(req)) return res.status(401).json({ error: 'Please log in again' });

      const input = Array.isArray(req.body && req.body.items) ? req.body.items : null;
      if (!input || input.length === 0 || input.length > 50) return res.status(400).json({ error: 'Send between 1 and 50 items' });

      const seen = new Set();
      const items = [];
      for (const [i, raw] of input.entries()) {
        const name = clean(raw.name, 60);
        const unit = clean(raw.unit, 30);
        const price = Math.round(Number(raw.price));
        let id = raw.id === 'braces' ? 'braces' : (slug(raw.id) || slug(name));
        if (!name) return res.status(400).json({ error: `Row ${i + 1}: treatment name is empty` });
        if (!Number.isFinite(price) || price < 0 || price > 10_000_000) return res.status(400).json({ error: `Row ${i + 1}: price must be a number of shillings` });
        while (seen.has(id)) id += '-2';
        seen.add(id);
        items.push({ id, name, unit, price, sort: i });
      }
      if (!seen.has('braces')) return res.status(400).json({ error: 'The Braces row is used by the estimator and cannot be removed' });

      await ensureTable();
      const db = sql();
      await db.transaction([
        db`DELETE FROM prices`,
        ...items.map((p) => db`INSERT INTO prices (id, name, unit, price, sort, updated_at)
                               VALUES (${p.id}, ${p.name}, ${p.unit}, ${p.price}, ${p.sort}, now())`),
      ]);
      return res.status(200).json({ ok: true, items: await listPrices() });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    // If the database is unreachable, the public site still works with the built-in prices.
    if (req.method === 'GET') return res.status(200).json({ items: DEFAULT_PRICES, fallback: true });
    return res.status(500).json({ error: 'Server error — please try again' });
  }
}
