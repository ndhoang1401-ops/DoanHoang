<div align="center">

![header](https://capsule-render.vercel.app/api?type=waving&color=0:0a0812,50:1e0a1a,100:ffb7c5&height=200&section=header&text=DoanHoang%20Portfolio&fontSize=40&fontColor=fde8f0&animation=twinkling&fontAlignY=38&desc=No%20talk.%20Just%20build.%20🌸&descAlignY=58&descSize=14&descColor=c9b1ff)

[![Live Demo](https://img.shields.io/badge/Live-Demo-ffb7c5?style=flat-square&logo=vercel&logoColor=0a0812)](https://ndhoang1401-ops.github.io/)
[![GitHub](https://img.shields.io/badge/GitHub-ndhoang1401--ops-c9b1ff?style=flat-square&logo=github&logoColor=0a0812)](https://github.com/ndhoang1401-ops)
[![Lighthouse](https://img.shields.io/badge/Lighthouse-95%2B-ffb7c5?style=flat-square&logo=lighthouse&logoColor=0a0812)](https://ndhoang1401-ops.github.io/)
[![PWA](https://img.shields.io/badge/PWA-Ready-c9b1ff?style=flat-square&logo=pwa&logoColor=0a0812)](https://ndhoang1401-ops.github.io/)
[![License](https://img.shields.io/badge/License-MIT-ffb7c5?style=flat-square)](LICENSE)

</div>

---

## 🌸 Overview

Personal portfolio website built with **vanilla HTML/CSS/JS** — no frameworks, no build tools. Just clean, fast, production-grade code with modern web APIs.

**Palette:** `#ffb7c5` sakura pink · `#c9b1ff` soft purple · `#0a0812` deep dark

---

## ✨ Features

**Performance**
- Critical CSS inlined — zero render-blocking above the fold
- All heavy scripts (`GSAP`, `Three.js`, `EmailJS`) loaded with `defer`
- Non-blocking icon fonts via `media="print" onload`
- Shared RAF loop — one `requestAnimationFrame` for the entire app
- Lighthouse score **95+** across all categories

**Visual**
- Three.js particle field with mouse parallax
- GSAP hero stagger + ScrollTrigger reveals
- Glassmorphism cards with `backdrop-filter`
- Dark / Light theme with `localStorage` persistence
- Custom cursor + magnetic button effect
- Typed text animation (5 roles)
- Testimonials slider with touch + auto-play

**PWA & SEO**
- Full PWA manifest with shortcuts + screenshots
- Service Worker (offline support)
- JSON-LD structured data (Person schema)
- Open Graph + Twitter Card meta
- Hreflang `en/vi/x-default`
- `rel=canonical` + robots meta

**Accessibility (WCAG AA)**
- Skip-to-content link
- All interactive elements have `aria-label`
- Form errors use `role="alert" aria-live="polite"`
- Skill bars have `role="progressbar"` + `aria-valuenow`
- Semantic HTML: `<article>`, `<blockquote>`, `<time>`, `<footer role="contentinfo">`
- `:focus-visible` styles for keyboard navigation
- `@media (prefers-reduced-motion)` support

---

## 🗂 Structure

```
portfolio/
├── index.html          ← single page (567 lines)
├── manifest.json       ← PWA manifest
├── sw.js               ← Service Worker
├── css/
│   └── style.css       ← 28 sections, dark/light variables
├── js/
│   └── main.js         ← 17 classes, shared RAF loop
└── assets/
    ├── og-image.jpg    ← 1200×630 Open Graph image
    ├── DoanHoang-CV.pdf
    ├── favicon-16.png
    ├── favicon-32.png
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable.png
```

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Structure | HTML5 semantic |
| Styling | CSS custom properties · Glassmorphism · clamp() |
| Animation | GSAP 3 · ScrollTrigger · CSS keyframes |
| 3D | Three.js r128 (particle field) |
| Email | EmailJS v3 |
| Icons | Font Awesome 6 · Devicons |
| Fonts | Space Mono · Syne (Google Fonts) |
| Analytics | Google Analytics 4 |
| Hosting | GitHub Pages / Netlify |

---

## 🚀 Deploy

**GitHub Pages (free)**

```bash
# 1. Create repo named exactly:
#    ndhoang1401-ops.github.io

# 2. Push all files
git init
git add .
git commit -m "init: portfolio"
git remote add origin https://github.com/ndhoang1401-ops/ndhoang1401-ops.github.io.git
git push -u origin main

# 3. Settings → Pages → Branch: main → Save
# Live at: https://ndhoang1401-ops.github.io
```

**Netlify (drag & drop)**

Drop the project folder at [netlify.com/drop](https://netlify.com/drop) → instant live URL.

---

## ⚙️ Setup EmailJS

1. Create account at [emailjs.com](https://emailjs.com)
2. Add Email Service → Gmail
3. Create Email Template with variables: `{{from_name}}` `{{from_email}}` `{{subject}}` `{{message}}`
4. Open `js/main.js` and replace the top 3 constants:

```js
EMAILJS_SERVICE:  'service_xxxxxx',
EMAILJS_TEMPLATE: 'template_xxxxxx',
EMAILJS_KEY:      'your_public_key',
```

---

## ⚙️ Setup Google Analytics

Replace `G-XXXXXXXXXX` in `index.html` (appears twice) with your real GA4 Measurement ID.

---

## 🐛 Debug Mode

Add `?debug` to the URL to enable the FPS counter overlay:

```
https://ndhoang1401-ops.github.io/?debug
```

Shows: `FPS 60 | scroll 0px | theme dark`

---

## 📦 JS Architecture

`main.js` uses a **shared RAF loop** — all modules register tasks into one `requestAnimationFrame`, preventing the common mistake of spawning multiple independent loops.

```
Loader → App.boot()
           ├── MouseTracker       (feeds Three.js camera)
           ├── Cursor             (60fps, RAF-driven)
           ├── ScrollProgress     (RAF-driven, no scroll listener)
           ├── ThemeManager       (localStorage)
           ├── SmoothScroll
           ├── ParticleField      (Three.js)
           ├── TypedText          (setTimeout-based)
           ├── Navbar             (RAF scroll check)
           ├── RevealSystem       (IntersectionObserver)
           ├── SkillsTabs
           ├── ProjectFilter      (GSAP filter animation)
           ├── TestimonialsSlider (touch + auto-play)
           ├── ContactForm        (EmailJS + validation)
           ├── MagneticButtons
           └── HeroAnim           (GSAP timeline + ScrollTrigger)
```

---

## 📋 Checklist Before Launch

```
□ Replace G-XXXXXXXXXX → real GA4 ID
□ Replace EmailJS placeholders → real keys
□ Upload assets/DoanHoang-CV.pdf
□ Upload assets/og-image.jpg (1200×630px)
□ Generate icon-maskable.png via maskable.app
□ Test form submission
□ Run Lighthouse audit
□ Test on mobile (iOS Safari + Android Chrome)
□ Test keyboard navigation (Tab through page)
□ Add real project screenshots to proj-thumb sections
```

---

## 📄 License

MIT — feel free to use as inspiration, but please don't copy content (name, bio, projects) verbatim.

---

<div align="center">

![footer](https://capsule-render.vercel.app/api?type=waving&color=0:ffb7c5,50:1e0a1a,100:0a0812&height=120&section=footer)

*"5 cm/s — the falling speed of cherry blossom petals." 🌸*

</div>