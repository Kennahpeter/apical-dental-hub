import { checkPassword, setSession, clearSession, isAuthed } from './_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET') return res.status(200).json({ authed: isAuthed(req) });
  if (req.method === 'DELETE') { clearSession(res); return res.status(200).json({ ok: true }); }
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const password = req.body && req.body.password;
  if (!checkPassword(password)) {
    await new Promise((r) => setTimeout(r, 800)); // slow down guessing
    return res.status(401).json({ error: 'Wrong password' });
  }
  setSession(res);
  return res.status(200).json({ ok: true });
}
