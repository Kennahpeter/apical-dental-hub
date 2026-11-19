// Usage: npm run set-domain -- https://www.yourdomain.co.ke  (currently set to the vercel.app address)
// Replaces the placeholder domain in every page, robots.txt and sitemap.xml.
import fs from 'node:fs';
const OLD = 'https://apical-dental-hub.vercel.app';
const next = (process.argv[2] || '').replace(/\/$/, '');
if (!/^https:\/\/[a-z0-9.-]+\.[a-z]{2,}$/i.test(next)) {
  console.error('Give the full domain, e.g. npm run set-domain -- https://www.apicaldentalhub.co.ke');
  process.exit(1);
}
const files = fs.readdirSync('.').filter((f) => /\.(html|xml|txt)$/.test(f));
for (const f of files) {
  const s = fs.readFileSync(f, 'utf8');
  if (s.includes(OLD)) { fs.writeFileSync(f, s.split(OLD).join(next)); console.log('updated', f); }
}
const self = 'scripts/set-domain.mjs';
fs.writeFileSync(self, fs.readFileSync(self, 'utf8').replace(`const OLD = '${OLD}'`, `const OLD = '${next}'`));
