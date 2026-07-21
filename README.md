# The Detailing Studio — Website Demo

A premium, static one-page website demo built for a fictional auto
detailing brand ("The Detailing Studio"). Pure HTML5 / CSS3 / vanilla
JavaScript — no frameworks, no build step, no npm.

## Run it

Just open `index.html` in a browser. That's it — no server, no
install, no build.

To deploy on **GitHub Pages**:
1. Create a new repository and upload the contents of this folder
   (not the folder itself — `index.html` should sit at the repo root).
2. In the repo, go to **Settings → Pages** and set the source to the
   `main` branch, root folder.
3. Your site will publish at `https://<your-username>.github.io/<repo-name>/`.

All asset paths are relative, so it also works unzipped on any static
host (Netlify, Vercel, S3, cPanel, etc.) with zero configuration.

## File structure

```
the-detailing-studio-demo/
├── index.html      All markup and content
├── style.css        All styling and design tokens
├── script.js        All interactivity (vanilla JS, no dependencies)
├── README.md         This file
└── assets/
    ├── logo.svg      Brand monogram used in nav + footer
    └── favicon.svg    Browser tab icon
```

## Before you launch — replace these placeholders

This is a **demo**. The following are placeholder values and must be
updated with real information before the site goes live:

| What | Where | Notes |
|---|---|---|
| Business name & copy | `index.html` | "The Detailing Studio" is a placeholder brand name; the About section copy is placeholder text |
| Contact phone & email | `index.html` footer | Currently `(416) 555-0100` / `hello@thedetailingstudio-demo.com` |
| WhatsApp number | `script.js` → `CONFIG.whatsappNumber` | Digits only, country code first, no `+` or spaces |
| Booking form endpoint | `index.html` → `<form action="https://formspree.io/f/YOUR_FORM_ID">` | Create a free form at [formspree.io](https://formspree.io) and paste your real form ID in. The form won't submit until you do — it will show a friendly "demo mode" message instead. |
| Gallery photos | `index.html` `#gallery` | Six placeholder tiles marked "Add before/after photo" — replace each with a real `<img src="assets/gallery/xxx.jpg" alt="..." loading="lazy">` |
| Reviews | `index.html` `#reviews` | Three placeholder cards. Replace with real, attributed client reviews — never publish invented testimonials |
| Stats/counters | `index.html` `#about` | "Years operating", "Municipalities served" etc. are placeholder numbers — use your real, verifiable figures |
| Social links | `index.html` footer | Instagram / Facebook / Google review links currently point to `#` |
| Logo | `assets/logo.svg` | Simple placeholder monogram — swap for a real logo file if you have one |

Every placeholder is also marked with an HTML comment in the source
so you can find them with a search for `PLACEHOLDER`.

## Design notes

- **Palette**: void black / charcoal panels, electric blue accent,
  metallic silver text — all defined as CSS custom properties at the
  top of `style.css` (`:root`) so the whole site can be re-themed by
  editing a handful of values.
- **Type**: Bricolage Grotesque (display), Manrope (body), Space Mono
  (labels/eyebrows/timeline numbers), loaded from Google Fonts.
- **Signature motif**: a diagonal "gloss sweep" of light plays across
  the hero headline on load and across cards on hover — a nod to the
  reflective finish a detail produces.
- **Motion**: intro animation, scroll reveals, counters and hovers all
  respect `prefers-reduced-motion`.

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, section `aria-labelledby`, `footer`)
- Skip-to-content link
- Visible keyboard focus states throughout
- Form fields have associated `<label>`s and `required` attributes
- Decorative SVGs are `aria-hidden`; functional icons have `aria-label`s

## Customizing quickly

- Colors, spacing and fonts: edit the `:root` block at the top of `style.css`.
- Section copy: edit directly in `index.html` — each section is clearly commented.
- Services / Why Choose Us / FAQ items: duplicate an existing `<article>`,
  `<div class="why-item">` or `<div class="faq-item">` block and edit the text.
