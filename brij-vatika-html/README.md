# Brij Vatika — Concept Preview (static HTML)
Concept Preview — Sample Design, Not the Official Website.

Same site as the Next.js version, as plain HTML/CSS/JS. No build step, no npm, no backend.

## Run
Open `index.html` in a browser, or serve the folder (`python3 -m http.server`) and visit http://localhost:8000.
Deploy: upload the whole folder to any static host (Netlify, Vercel, GitHub Pages, cPanel).

## Pages
index.html · about.html · facilities.html · gallery.html · location.html · contact.html (enquiry engine + contact list) · 404.html

## Replace the photos
Overwrite the files in `images/` using the same filenames (photo-01 … photo-08, logo.png). The "DEMO PHOTO — Replace…" tags live in the page HTML (`class="tag"`) — remove them once real photos are in. See ASSETS.md.

## Enquiry engine (contact.html)
`js/engine.js` (logic) + `js/booking-ui.js` (5-step UI). Builds a WhatsApp enquiry, call link, copyable message, tentative .ics reminder; saves a draft in the browser. It does NOT reserve or send anything — the venue confirms availability. To grey out dates the venue is already committed on, add 'YYYY-MM-DD' strings to `BLOCKED_DATES` in `js/engine.js`.

## Motion
`js/motion.js` is dependency-free (no GSAP/Lenis): entrance reveals, scrubbed word reveal, gold line drawing, count-up, parallax, image scroll-zoom, floating feathers/sparkles/petals, pinned story, sideways gallery, circle scene-open, card tilt, page-transition curtain, carousel. Respects prefers-reduced-motion. Google Fonts load from the internet (fallback fonts offline).
