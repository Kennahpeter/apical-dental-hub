# Apical Dental Hub — website

Static pages + a small owner-only price editor. Hosted on **Vercel**, prices stored in **Neon** (Postgres).

```
index.html, services.html, pricing.html, gallery.html, about.html, contact.html   ← public pages
admin/index.html        ← owner price editor  (yoursite/admin)
api/prices.js           ← GET prices (public) · PUT prices (owner only)
api/login.js            ← owner login / logout
api/_lib/               ← database + login helpers
db/schema.sql           ← optional: table is created automatically on first use
robots.txt, sitemap.xml ← search engines
vercel.json             ← security headers, caching, noindex for /admin
```

## 1. Deploy (about 15 minutes)

1. **Put the code on GitHub** — create a repo and upload this folder (or `git push`).
2. **Vercel** → *Add New → Project* → import the repo. No build settings needed. Deploy.
3. **Neon database** → in the Vercel project open *Storage → Create Database → Neon* (free tier is plenty).
   Vercel adds `DATABASE_URL` for you. (Or create a project at neon.tech and paste its connection string as `DATABASE_URL`.)
4. **Vercel → Settings → Environment Variables**, add:
   - `ADMIN_PASSWORD` — the owner's password (long, not reused anywhere)
   - `SESSION_SECRET` — any long random text
5. **Redeploy** (Deployments → ⋯ → Redeploy) so the variables take effect.
6. Open `https://<your-project>.vercel.app/admin`, log in, and save prices. The table is created automatically.

## 2. Editing prices (owner)

Go to **/admin**, log in, change names / units / prices, add or delete treatments, reorder with ↑ ↓, then **Save changes**.
The pricing page (estimator + price list) and the "From KES … / jaw" badges on the Home and Services pages update within about a minute.
If the database is ever unreachable, the site keeps working with the built-in prices.

> Page titles and Google descriptions still mention "braces from KES 10,000". If the braces price changes, update those `<meta name="description">` lines too.

## 3. When the domain is bought

1. Vercel → Project → *Settings → Domains* → add `apicaldentalhub.co.ke` and `www.apicaldentalhub.co.ke`, then set the DNS records Vercel shows at your registrar.
2. If the domain is **different** from `https://www.apicaldentalhub.co.ke`, run once and redeploy:
   ```
   npm run set-domain -- https://www.your-new-domain.co.ke
   ```
   This updates canonical links, social previews, structured data, robots.txt and sitemap.xml.

## 4. Getting found on Google (do these after the domain is live)

Already in the code: unique titles and descriptions, canonical URLs, Open Graph + Twitter cards, `Dentist` structured data
(address, hours, phones, services, Facebook + Instagram), breadcrumbs, `robots.txt`, an image `sitemap.xml`, WebP images with
alt text, lazy loading and long-term image caching.

Owner to-do list — these matter more than code for a local clinic:
1. **Google Search Console** → add the domain, verify (paste the tag where each page says `google-site-verification`, or use DNS), then submit `/sitemap.xml`.
2. **Google Business Profile** — claim/create "Apical Dental Hub", same name, address and phone as the website, link to the site, add photos, ask happy patients for reviews. This is the #1 driver of "dentist near me" results.
3. Keep **name, address, phone** identical everywhere (Facebook, Instagram bio, directories).
4. Post regularly on Instagram and link back to the website in the bio.
5. Optional: Bing Webmaster Tools (import from Search Console in one click).

## 5. Photos

- Clinic photos are in `assets/img/gallery/` as WebP (cropped, phone watermark removed, location data stripped).
  To add more: export at ~1200px wide as `.webp`, put it in that folder and copy one `<figure>` block in `gallery.html`.
- Only use photos the clinic took itself (with patient consent) or free-licence stock (e.g. Unsplash). Pinterest images belong to other people and can't be reused.
- The clinic-room photos on Home/About/Contact are Unsplash stock — swap for real clinic photos when available.

## Other quick edits
- **Brand colours:** `assets/js/tailwind-config.js`
- **Navbar / footer / CTA:** identical in every page between `<!-- NAV START -->`/`<!-- NAV END -->` etc. Change one, paste into the others.

## Local development
```
npm install
npx vercel dev      # serves pages + /api with your .env (copy .env.example → .env)
```
