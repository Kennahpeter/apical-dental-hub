# Apical Dental Hub — website

Static site: no build step. Open `index.html` in a browser, or upload the whole folder to Netlify, Vercel or cPanel (`public_html`).

## Quick edits
- **Brand colours:** `assets/js/tailwind-config.js` (shared by every page)
- **Prices:** the `PRICES` object at the top of `assets/js/pricing.js` — the estimator and the price list both read from it. Whitening, extraction and root canal are placeholders.
- **Navbar / footer / CTA band:** identical in every page between `<!-- NAV START -->`/`<!-- NAV END -->`, `<!-- FOOTER START -->`/`<!-- FOOTER END -->` and `<!-- CTA START -->`/`<!-- CTA END -->`. Change one, then paste it into the other four pages. The current-page highlight is set by `main.js`, so the markup stays the same everywhere.
- **Logo:** search for `LOGO:` in any page to swap the inline SVG for `assets/img/logo.png`.
- **Photos:** replace `assets/img/clinic-interior.svg` and `team-1/2/3.svg` (each `<img>` has a comment showing the suggested file name). Team names on `about.html` are placeholders.
- **Domain:** replace `https://www.apicaldentalhub.co.ke` in the `<head>` of each page (canonical + Open Graph) and in the home page JSON-LD.
