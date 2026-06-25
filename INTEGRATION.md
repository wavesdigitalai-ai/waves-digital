# Integrating the audit popup into your site

You have 4 files now:
- `audit-widget.css` — all the audit's styles, scoped under `#modalOverlay` so they can't collide with your site's existing CSS
- `audit-widget.js` — all the logic, wrapped in its own closure, exposing only `window.WDA`
- `audit-widget-modal.html` — the popup markup itself (no demo/launcher page — just the modal)
- `business-audit.html` — the original standalone demo, kept for reference/testing only

Do this on **both** the main site and the Scale page.

## 1. Add the fonts (skip if your site already loads them)
In `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet">
```

## 2. Add the widget CSS
In `<head>`, after your existing stylesheet:
```html
<link rel="stylesheet" href="audit-widget.css">
```

## 3. Paste the modal markup
Open `audit-widget-modal.html`, copy everything in it, and paste it right before `</body>` on each page.

## 4. Add the widget script
Right after the modal markup (still before `</body>`):
```html
<script src="audit-widget.js"></script>
```

## 5. Wire up your existing buttons
Find whatever button/link on each page you want to trigger the audit, and add:
```html
onclick="WDA.openAuditModal()"
```
That's it — no new button needed, just point your existing CTA at that one line. You can do this on as many buttons as you want, on both pages (e.g. a hero CTA *and* a footer CTA on the main site).

## 6. Fill in the config (one-time, lives in audit-widget.js near the top)
```js
const CONFIG = {
  GOOGLE_SHEETS_URL: "...",   // from the Apps Script deployment
  WHATSAPP_NUMBER: "91XXXXXXXXXX",
  SCALE_URL: "..."            // your real Scale checkout link
};
```
Since both pages load the same `audit-widget.js`, you only fill this in once and it works everywhere.

## Notes
- `audit-widget.js` is already self-contained (wrapped in its own closure) — it won't collide with any of your site's own scripts or variables, even if your site happens to also use a variable called `state`.
- `audit-widget.css` is scoped to `#modalOverlay` only — it was tested against a page with deliberately conflicting `.btn`/`.wrap` classes to confirm nothing leaks either direction.
- If you ever update the audit's questions/copy/logic, edit `audit-widget.js` once — both pages pick up the change automatically since they load the same file.
