# Resume Single-Page Site — Design

**Date:** 2026-05-08
**Owner:** Todor Angelov (angelov-todor)
**Repo target:** `github.com/angelov-todor/resume`
**Live URL:** `https://angelov-todor.github.io/resume`

## Goal

A single-page personal resume / CV site for Todor Angelov, Software Architect. Editorial-minimalist visual direction. No employer branding. Deployed from a personal GitHub repo to GitHub Pages.

## Visual Direction

**Editorial Minimalist** — inspired by Stripe/Linear long-form pages and print-magazine spreads.

- Generous whitespace, clear vertical rhythm
- Display serif (Georgia / Times) for headings; system sans for UI chrome and metadata
- Monospace accents for tech-stack chips and section numbers
- Single accent: the foreground color itself. No coloured branding.
- Light by default; dark mode available

## Information Architecture

Single page, top-to-bottom, with anchor links in the header:

1. **Header** — name (left, uppercase, small), nav (`Work`, `Skills`, `Contact`), theme toggle
2. **Hero** — kicker label, large display name, lead paragraph, three at-a-glance stats (years, education, stacks)
3. **Selected Work** (`#work`) — six marquee projects, magazine-spread layout
4. **Earlier Work** — condensed two-column list of older roles
5. **Skills & Technologies** (`#skills`) — labelled groups in a 2-col grid
6. **Footer** (`#contact`) — GitHub + LinkedIn links, copyright

### The six marquee projects

| # | Project | Era | Role |
|---|---|---|---|
| 1 | Astraex — AstraBit | 2025 — now | Tech Lead / Architect |
| 2 | NABR — Photorealistic Real Estate | 2024 — 2025 | Senior Engineer |
| 3 | Fleet Services IoT — GPS Bulgaria | 2023 — 2024 | Senior Engineer |
| 4 | Real Estate Platform — Back-office | 2022 — 2023 | Senior Engineer |
| 5 | JupiterDevShop — Content & Product Platforms | 2021 — 2022 | Senior Engineer |
| 6 | Smart Valor — Crypto Exchange | 2018 — 2021 | Senior Engineer |

Each marquee entry: dates + role on the left; project title, blurb, tech-stack chips, and 2–3 key responsibility bullets on the right.

NABR's role title is normalized to "Senior Engineer" (resume said "Senior iOS Engineer", but the work described is Unreal/Go/GCP infrastructure — iOS title would mislead).

### Earlier Work (condensed)

JigSaw, Professional Services, OpenStack Assurance Adapter, Viptela xStats Adapter, ADK, Docker API Adapter, CAS & UMS, Website Mobilizer, CDN, CRM. Each row: project name + year. No further detail on the page; they're listed for completeness.

## Tech Stack

- **Framework:** Astro (latest stable, ≥4.x). Static output; zero client-side framework runtime.
- **Language:** TypeScript for data + scripts; `.astro` files for templates.
- **Styling:** Hand-written CSS with CSS variables. No utility framework, no preprocessor.
- **Client JS:** ~1–2 KB total — theme toggle and `IntersectionObserver` for fade-in. No bundlers beyond Astro defaults.
- **Hosting:** GitHub Pages, deployed via `actions/deploy-pages@v4`.

Astro chosen over vanilla because the user requested it; benefits are typed content data and component decomposition without shipping a runtime.

## File Layout

```
resume/
├── src/
│   ├── pages/index.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── Project.astro          # one marquee entry
│   │   ├── EarlierWork.astro
│   │   ├── Skills.astro
│   │   └── Footer.astro
│   ├── layouts/Base.astro         # <html>, <head>, theme-flash guard
│   ├── data/resume.ts             # typed source of truth for content
│   ├── styles/global.css
│   └── scripts/
│       ├── theme.ts               # toggle + persistence
│       └── reveal.ts              # IntersectionObserver fade
├── public/
│   ├── avatar.jpg                 # user-supplied (optional)
│   └── favicon.svg
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .github/workflows/deploy.yml
├── .gitignore                     # includes .superpowers/, .brainstorm/, dist/, node_modules/
└── README.md
```

## Content Model

`src/data/resume.ts` exports a typed `resume` object — single source of truth.

```ts
export interface ProjectEntry {
  id: string;
  title: string;
  client?: string;
  era: string;             // "2025 — now"
  role: string;            // "Tech Lead / Architect"
  blurb: string;
  stack: string[];         // chips, uppercase
  highlights?: string[];   // bullets, only on marquee
}

export interface SkillGroup { label: string; value: string }

export interface Resume {
  name: string;
  title: string;
  kicker: string;          // "SOFTWARE ARCHITECT · 16 YEARS"
  lead: string;            // hero lead paragraph
  stats: { num: string; lbl: string }[];
  marquee: ProjectEntry[];
  earlier: { name: string; year: string }[];
  skills: SkillGroup[];
  education: SkillGroup[];
  links: { label: string; href: string }[];
}
```

Editing the resume = editing one file. Each component imports from `resume.ts` and renders the relevant slice.

## Theming

- `<html data-theme="light|dark">` toggled at runtime.
- CSS variables: `--bg`, `--fg`, `--muted`, `--rule`, `--card`, `--soft`, `--chip`, `--chip-border`.
- First visit: read `prefers-color-scheme`. Subsequent visits: read `localStorage["theme"]`.
- **No flash on load:** inline blocking script in `<head>` (not deferred) sets `data-theme` before paint.

```html
<script is:inline>
  const t = localStorage.getItem('theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.dataset.theme = t;
</script>
```

Toggle button in header writes the new value to `localStorage` and `data-theme`.

## Scroll-Fade Animation

`src/scripts/reveal.ts`:

- Selects `.section` elements.
- `IntersectionObserver` with `threshold: 0.15`. On enter, add `.is-visible`.
- CSS: sections start at `opacity: 0; transform: translateY(12px)` and transition to visible.
- Hero is visible immediately (no fade) — it's above the fold.
- `@media (prefers-reduced-motion: reduce)` disables transforms; sections render visible immediately.

## Print Styles

`@media print`:

- Force light theme (CSS variables set to light values regardless of `data-theme`).
- Hide: header nav, theme toggle, footer animations, anchor underlines.
- Single column; `max-width: none`; padding tightened.
- `print-color-adjust: exact` and `-webkit-print-color-adjust: exact` so the chip borders and dividers survive.
- Page-break controls: `page-break-inside: avoid` on `.project` blocks; `page-break-after: avoid` on section headings.
- Earlier-work two-column list collapses cleanly.
- A4 default; should also produce a reasonable Letter PDF.

Manual test: `Ctrl+P → Save as PDF` produces a 2–3 page document.

## Avatar

- `public/avatar.jpg` (square, ≥256×256). User drops in a LinkedIn export or any preferred photo.
- If `public/avatar.jpg` is missing at build time, hero renders a Gravatar fallback using the email `todor.angelov@wisertech.com` (md5 → `https://www.gravatar.com/avatar/<hash>?s=192&d=mp`).
- Rendered as an 88 px circular portrait next to the hero name. Optional, hidden cleanly if no avatar resolves.

The fallback decision happens at build time in `index.astro` via a tiny `fs.existsSync` check; no runtime image-load races.

## Deployment

`.github/workflows/deploy.yml`:

- Triggers on push to `main`.
- Steps: checkout, setup-node@v4 (lts), `npm ci`, `npm run build`, `actions/upload-pages-artifact@v3`, `actions/deploy-pages@v4`.
- Astro `astro.config.mjs`: `site: 'https://angelov-todor.github.io'`, `base: '/resume'`.
- One-time manual setup: GitHub repo settings → Pages → Source: "GitHub Actions".

## Accessibility

- Semantic HTML: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`.
- Theme toggle has `aria-label` and `aria-pressed`.
- Color contrast checked for both themes (≥ 4.5:1 for body text).
- Keyboard navigable; focus styles preserved (no `outline: none`).
- `prefers-reduced-motion` respected.

## Out of Scope (YAGNI)

Explicitly **not** building:

- SEO beyond basic `<title>`, `<meta description>`, Open Graph image
- Analytics / telemetry of any kind
- Contact form / mailto handler
- Internationalization (the page is English; the header has one Bulgarian word as a flourish)
- A blog, projects gallery, or any subpage
- Backing API or CMS
- Custom domain (uses `github.io` subdomain)
- Tech-stack icons (user explicitly skipped)

## Known Content Values

These are confirmed and will be hardcoded in `src/data/resume.ts`:

- **Name:** Todor Angelov
- **Title:** Software Architect
- **Years experience:** 16
- **Education:** PhD in Computer Informatics, MSc Computer Software Technology, BSc Informatics — University of Plovdiv "Paisii Hilendarski"
- **Languages spoken:** Bulgarian (native), English (fluent), German (basic)
- **GitHub:** `https://github.com/angelov-todor`
- **LinkedIn:** `https://www.linkedin.com/in/todor-angelov-b5b18274/`
- **Email for Gravatar fallback:** `todor.angelov@wisertech.com`

## Open Items (User Provides After Implementation)

- `public/avatar.jpg` — user-supplied photo. If absent at deploy time, Gravatar fallback kicks in.
- Final blurbs may need a polish pass after the user reviews the live page.

## Success Criteria

- Page loads at `https://angelov-todor.github.io/resume` after `git push`.
- Lighthouse Performance ≥ 95, Accessibility ≥ 95.
- Dark mode toggle works without flash on reload.
- `Ctrl+P → Save as PDF` produces a clean, recruiter-presentable 2–3 page document.
- The six marquee projects are clearly featured; earlier work is present but condensed.
- No employer branding anywhere on the page.
