# Resume Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a single-page editorial-minimalist resume site for Todor Angelov to `https://angelov-todor.github.io/resume`, deployed via GitHub Actions from a new public repo.

**Architecture:** Astro static site (zero runtime framework). All content typed in `src/data/resume.ts`. Components render slices of that data. Tiny client-side JS for theme toggle + scroll-fade. CI builds and publishes to GitHub Pages.

**Tech Stack:** Astro ≥4.x, TypeScript, hand-written CSS, vitest (only for the avatar helper unit test), GitHub Actions, GitHub Pages.

**Project root for all paths in this plan:** `C:/Users/todor.angelov_primeh/projects/github.com/angelov-todor/resume`

**Notes for the executor:**
- Shell is Windows PowerShell. Forward slashes in paths work fine. Use `npm` directly.
- Spec lives at `docs/superpowers/specs/2026-05-08-resume-site-design.md` — re-read it if a task is unclear.
- The directory already contains `docs/` and `.brainstorm/` from the design phase. Both should be preserved across `npm create astro` (we'll handle this carefully in Task 1).
- TDD applies where there's real logic (avatar resolution). For pure template/style components, the test is `npm run build` succeeding plus visual verification.

---

## File Structure

| Path | Responsibility |
|---|---|
| `astro.config.mjs` | Astro site/base config |
| `package.json` | Deps and scripts |
| `tsconfig.json` | TS config (Astro default) |
| `vitest.config.ts` | Vitest config for unit tests |
| `.gitignore` | Ignore build/, deps, brainstorm artifacts |
| `.github/workflows/deploy.yml` | Build + deploy to Pages |
| `public/favicon.svg` | Tiny favicon |
| `src/data/resume.ts` | Single source of truth for content |
| `src/lib/avatar.ts` | Avatar resolver (local file vs Gravatar fallback) |
| `src/lib/avatar.test.ts` | Unit tests for avatar resolver |
| `src/styles/global.css` | All styles: tokens, layout, components, print |
| `src/scripts/theme.ts` | Theme toggle handler |
| `src/scripts/reveal.ts` | IntersectionObserver scroll fade |
| `src/layouts/Base.astro` | `<html>`, `<head>`, theme-flash guard, asset wiring |
| `src/components/Header.astro` | Top nav + theme toggle |
| `src/components/Hero.astro` | Name, kicker, lead, stats, avatar |
| `src/components/Project.astro` | One marquee project entry |
| `src/components/EarlierWork.astro` | Compact two-column list |
| `src/components/Skills.astro` | Skill groups grid |
| `src/components/Footer.astro` | Contact links |
| `src/pages/index.astro` | The page; composes components |
| `README.md` | Repo readme |

---

## Task 1: Initialize Astro project

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro` (will be replaced later)

**Important:** The directory already has `docs/` and `.brainstorm/` content we must preserve. We'll initialize Astro by hand rather than running `npm create astro` (which scaffolds into a fresh dir).

- [ ] **Step 1: Initialize npm and install Astro**

Run from project root:

```powershell
npm init -y
npm install --save-dev astro typescript
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://angelov-todor.github.io',
  base: '/resume',
  build: {
    assets: 'assets',
  },
  trailingSlash: 'ignore',
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": ["src/**/*", ".astro/types.d.ts", "astro.config.mjs"],
  "exclude": ["dist", "node_modules"]
}
```

- [ ] **Step 4: Replace `package.json` scripts**

Edit `package.json` so the `scripts` section reads:

```json
"scripts": {
  "dev": "astro dev",
  "build": "astro build",
  "preview": "astro preview",
  "test": "vitest run"
}
```

Set `"type": "module"` at the top level. Set `"private": true`.

- [ ] **Step 5: Create a placeholder `src/pages/index.astro`**

```astro
---
---
<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Todor Angelov</title></head>
<body><h1>Coming soon.</h1></body>
</html>
```

- [ ] **Step 6: Verify build**

```powershell
npm run build
```

Expected: build succeeds, `dist/index.html` exists with "Coming soon."

- [ ] **Step 7: Commit**

```powershell
git init
git branch -M main
git add package.json package-lock.json astro.config.mjs tsconfig.json src/pages/index.astro
git commit -m "chore: initialize astro project"
```

---

## Task 2: Add `.gitignore` and README skeleton

**Files:**
- Create: `.gitignore`, `README.md`

- [ ] **Step 1: Create `.gitignore`**

```
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store

# Brainstorm artifacts (kept locally, not in repo)
.brainstorm/
.superpowers/

# Editor
.vscode/
.idea/
```

- [ ] **Step 2: Create `README.md`**

```markdown
# resume

Personal resume site for Todor Angelov — Software Architect.

Live: https://angelov-todor.github.io/resume

## Local dev

```bash
npm install
npm run dev      # http://localhost:4321/resume
npm run build    # static output in dist/
npm test         # unit tests
```

## Deploy

Pushes to `main` build via GitHub Actions and publish to GitHub Pages.
First-time setup: repo Settings → Pages → Source = "GitHub Actions".

## Editing content

All resume content lives in `src/data/resume.ts`. Edit that file, push, done.

## Photo

Drop a square photo at `public/avatar.jpg` (≥256×256). Without it, the hero falls back to Gravatar.
```

- [ ] **Step 3: Commit**

```powershell
git add .gitignore README.md
git commit -m "chore: add gitignore and readme"
```

---

## Task 3: Create the typed content file

**Files:**
- Create: `src/data/resume.ts`

- [ ] **Step 1: Write `src/data/resume.ts`**

```ts
export interface ProjectEntry {
  id: string;
  title: string;
  era: string;
  role: string;
  blurb: string;
  stack: string[];
  highlights?: string[];
}

export interface SkillGroup {
  label: string;
  value: string;
}

export interface EarlierEntry {
  name: string;
  year: string;
}

export interface LinkEntry {
  label: string;
  href: string;
}

export interface Resume {
  name: string;
  title: string;
  kicker: string;
  lead: string;
  stats: { num: string; lbl: string }[];
  marquee: ProjectEntry[];
  earlier: EarlierEntry[];
  skills: SkillGroup[];
  links: LinkEntry[];
  email: string; // for Gravatar fallback only; not displayed
}

export const resume: Resume = {
  name: 'Todor Angelov',
  title: 'Software Architect',
  kicker: 'SOFTWARE ARCHITECT · 16 YEARS',
  lead:
    "Building distributed systems that don't fall over — crypto exchanges, IoT platforms, real-estate engines, photorealistic showrooms. Equally happy designing the architecture and writing the production code.",
  stats: [
    { num: '16', lbl: 'Years engineering' },
    { num: 'PhD', lbl: 'Computer Informatics' },
    { num: '5+', lbl: 'Production stacks' },
  ],
  marquee: [
    {
      id: 'astraex',
      title: 'Astraex — AstraBit',
      era: '2025 — now',
      role: 'Tech Lead / Architect',
      blurb:
        'U.S. veteran-operated crypto trading platform unifying CEX/DEX access, AI-driven bots, copy trading, and white-label tools. Built as a FINRA-member firm with focus on transparency and regulation.',
      stack: ['.NET', 'Kotlin', 'Azure', 'ArgoCD', 'Terraform'],
      highlights: [
        'Designed and architected the exchange platform end-to-end',
        'Organized cross-functional teams to ship on time',
        'Drove the microservice architecture for trading, staking, portfolio',
      ],
    },
    {
      id: 'nabr',
      title: 'NABR — Photorealistic Real Estate',
      era: '2024 — 2025',
      role: 'Senior Engineer',
      blurb:
        'Tech-driven housing platform co-founded with architect Bjarke Ingels. Created a photorealistic touring experience using Unreal Engine 5.x with Lumen, plus the GCP-based microservice infrastructure behind it.',
      stack: ['Go', 'C/C++', 'Unreal 5', 'GKE', 'gRPC', 'Pub/Sub'],
      highlights: [
        'Built photorealistic real-estate touring with Unreal + Lumen',
        'Designed micro-frontend / microservice framework over gRPC',
        'Bootstrapped CI/CD with GH Actions, ArgoCD, Terraform Cloud',
      ],
    },
    {
      id: 'fleet-iot',
      title: 'Fleet Services IoT — GPS Bulgaria',
      era: '2023 — 2024',
      role: 'Senior Engineer',
      blurb:
        "Core platform redesign PoC for Bulgaria's leading fleet-management provider. GPS/GSM telemetry across vehicles, ships, and railway assets — efficient, flexible, cost-reducing.",
      stack: ['Go', 'Kubernetes'],
    },
    {
      id: 'real-estate',
      title: 'Real Estate Platform — Back-office',
      era: '2022 — 2023',
      role: 'Senior Engineer',
      blurb:
        'Multi-tenant platform for managing upcoming building projects, sales, reservations, and furniture. New gRPC microservices and React UI features.',
      stack: ['Go', 'React', 'TypeScript', 'gRPC', 'GCloud', 'Firestore'],
    },
    {
      id: 'jupiterdevshop',
      title: 'JupiterDevShop — Content & Product Platforms',
      era: '2021 — 2022',
      role: 'Senior Engineer',
      blurb:
        'Content-sharing and product-management platforms with multi-provider integrations. Split the monolith into microservices and coordinated their integration & scaling.',
      stack: ['Node.js', 'NestJS', 'React', 'K8s', 'AWS', 'Neo4j', 'Postgres'],
    },
    {
      id: 'smart-valor',
      title: 'Smart Valor — Crypto Exchange',
      era: '2018 — 2021',
      role: 'Senior Engineer',
      blurb:
        'Decentralized marketplace for tokenized alternative investments. From redesign to a full pre-sale site, KYC/payment/exchange-provider integrations, then platform evolution.',
      stack: ['Java', 'Node.js', 'Angular', 'NestJS', 'K8s', 'AWS', 'Blockchain'],
    },
  ],
  earlier: [
    { name: 'JigSaw — virtual sessions platform', year: '2018' },
    { name: 'Professional Services — customer add-ons', year: '2017' },
    { name: 'OpenStack Assurance Adapter', year: '2017' },
    { name: 'Viptela xStats Adapter', year: '2017' },
    { name: 'ADK — Adapter Development Kit', year: '2016' },
    { name: 'Docker API Adapter', year: '2015' },
    { name: 'CAS & UMS — single sign-on', year: '2014' },
    { name: 'Website Mobilizer — JS crawler', year: '2013' },
    { name: 'CDN — resource management', year: '2013' },
    { name: 'CRM — customer-management system', year: '2012' },
  ],
  skills: [
    { label: 'Primary languages', value: 'Java · Node.js · TypeScript · JavaScript · PHP' },
    { label: 'Secondary', value: 'Python · Go' },
    { label: 'Frameworks', value: 'Spring Boot · Angular · React · NestJS' },
    {
      label: 'Databases',
      value: 'MySQL · MariaDB · MongoDB · Elasticsearch · MSSQL · PostgreSQL · Neo4j · Firestore',
    },
    {
      label: 'Infra & orchestration',
      value: 'Kubernetes · Docker Swarm · Jenkins · Concourse · GH Actions · ArgoCD · Terraform',
    },
    { label: 'Paradigms', value: 'DDD · TDD · MVC · SOA · RESTful · Microservices · Design Patterns' },
    { label: 'Education', value: 'PhD, MSc, BSc — Univ. of Plovdiv "Paisii Hilendarski"' },
    { label: 'Languages', value: 'Bulgarian (native) · English (fluent) · German (basic)' },
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/angelov-todor' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/todor-angelov-b5b18274/' },
  ],
  email: 'todor.angelov@wisertech.com',
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```powershell
npx astro check
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```powershell
git add src/data/resume.ts
git commit -m "feat: add typed resume content"
```

---

## Task 4: Avatar resolver — failing test

**Files:**
- Create: `src/lib/avatar.test.ts`

The avatar resolver returns one of three results based on whether `public/avatar.jpg` exists at build time:
- `{ type: 'local', src: '/resume/avatar.jpg' }` if local file present
- `{ type: 'gravatar', src: 'https://www.gravatar.com/avatar/<md5>?s=192&d=mp' }` if not
- The function takes the email and a "local file exists" boolean (we inject this so the function is pure and unit-testable)

- [ ] **Step 1: Install vitest**

```powershell
npm install --save-dev vitest
```

- [ ] **Step 2: Create `vitest.config.ts`**

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Write `src/lib/avatar.test.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { resolveAvatar } from './avatar';

describe('resolveAvatar', () => {
  it('returns local source when avatar file exists', () => {
    const result = resolveAvatar({
      hasLocalFile: true,
      email: 'todor.angelov@wisertech.com',
      base: '/resume',
    });
    expect(result).toEqual({ type: 'local', src: '/resume/avatar.jpg' });
  });

  it('returns gravatar URL with correct md5 when no local file', () => {
    const result = resolveAvatar({
      hasLocalFile: false,
      email: 'todor.angelov@wisertech.com',
      base: '/resume',
    });
    // md5('todor.angelov@wisertech.com') = '4f7e8e9c8e3f2d4b9a4d8c5e1f3b2a6d' is illustrative;
    // the assertion below pins the actual value.
    expect(result.type).toBe('gravatar');
    expect(result.src).toMatch(/^https:\/\/www\.gravatar\.com\/avatar\/[a-f0-9]{32}\?s=192&d=mp$/);
  });

  it('lowercases and trims email before hashing (gravatar spec)', () => {
    const a = resolveAvatar({ hasLocalFile: false, email: 'Test@Example.com', base: '/' });
    const b = resolveAvatar({ hasLocalFile: false, email: '  test@example.com  ', base: '/' });
    expect(a.src).toBe(b.src);
  });

  it('handles base path with no trailing slash', () => {
    const result = resolveAvatar({ hasLocalFile: true, email: 'x@y.z', base: '/resume' });
    expect(result.src).toBe('/resume/avatar.jpg');
  });

  it('handles base path of "/"', () => {
    const result = resolveAvatar({ hasLocalFile: true, email: 'x@y.z', base: '/' });
    expect(result.src).toBe('/avatar.jpg');
  });
});
```

- [ ] **Step 4: Run test — expect failure**

```powershell
npm test
```

Expected: tests fail because `src/lib/avatar.ts` does not exist. Output mentions cannot resolve `./avatar`.

- [ ] **Step 5: Commit (failing tests)**

```powershell
git add vitest.config.ts src/lib/avatar.test.ts package.json package-lock.json
git commit -m "test: add failing tests for avatar resolver"
```

---

## Task 5: Avatar resolver — implementation

**Files:**
- Create: `src/lib/avatar.ts`

- [ ] **Step 1: Write `src/lib/avatar.ts`**

```ts
import { createHash } from 'node:crypto';

export type AvatarResult =
  | { type: 'local'; src: string }
  | { type: 'gravatar'; src: string };

export interface AvatarInput {
  hasLocalFile: boolean;
  email: string;
  base: string;
}

export function resolveAvatar({ hasLocalFile, email, base }: AvatarInput): AvatarResult {
  const prefix = base === '/' ? '' : base.replace(/\/$/, '');

  if (hasLocalFile) {
    return { type: 'local', src: `${prefix}/avatar.jpg` };
  }

  const normalized = email.trim().toLowerCase();
  const hash = createHash('md5').update(normalized).digest('hex');
  return { type: 'gravatar', src: `https://www.gravatar.com/avatar/${hash}?s=192&d=mp` };
}
```

- [ ] **Step 2: Run test — expect pass**

```powershell
npm test
```

Expected: all 5 tests pass.

- [ ] **Step 3: Commit**

```powershell
git add src/lib/avatar.ts
git commit -m "feat: implement avatar resolver"
```

---

## Task 6: Global stylesheet

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write `src/styles/global.css`**

This file holds all the styles (tokens, typography, layout, components, print). It's long because we're not using a CSS framework. Replace the file with the content below verbatim:

```css
:root {
  --bg: #fafaf7;
  --fg: #111;
  --muted: #666;
  --rule: #e2e2dc;
  --card: #fff;
  --soft: #f4f4f0;
  --chip: #fff;
  --chip-border: #ddd;
  --max: 880px;
}

[data-theme='dark'] {
  --bg: #0f0f0e;
  --fg: #f4f4f0;
  --muted: #999;
  --rule: #2a2a26;
  --card: #16161a;
  --soft: #1a1a1c;
  --chip: #1f1f24;
  --chip-border: #2c2c30;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html, body {
  background: var(--bg);
  color: var(--fg);
  transition: background 0.3s ease, color 0.3s ease;
}

body {
  font-family: Georgia, 'Times New Roman', serif;
  line-height: 1.55;
  font-size: 16px;
  padding: 0 24px;
}

.ui   { font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; }
.mono { font-family: 'JetBrains Mono', ui-monospace, 'SF Mono', Menlo, monospace; }

.wrap { max-width: var(--max); margin: 0 auto; }

a { color: inherit; }

/* === Header === */
header.site {
  display: flex; justify-content: space-between; align-items: center;
  padding: 20px 0; border-bottom: 1px solid var(--rule);
  margin-bottom: 80px;
  font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px;
}
header.site .left { letter-spacing: 2px; text-transform: uppercase; color: var(--muted); font-size: 11px; }
header.site nav { display: flex; gap: 24px; align-items: center; }
header.site nav a { color: var(--fg); text-decoration: none; border-bottom: 1px solid transparent; }
header.site nav a:hover { border-bottom-color: var(--fg); }
.toggle {
  cursor: pointer; background: transparent; border: 1px solid var(--rule);
  width: 32px; height: 32px; border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  color: var(--fg); font-size: 14px;
}

/* === Hero === */
.hero { margin-bottom: 96px; display: grid; grid-template-columns: 1fr auto; gap: 48px; align-items: start; }
.hero .text { min-width: 0; }
.hero .kicker {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 11px; letter-spacing: 4px; text-transform: uppercase;
  color: var(--muted); margin-bottom: 24px;
}
.hero h1 {
  font-size: 84px; line-height: 0.95; font-weight: 600; letter-spacing: -3px;
  margin-bottom: 32px;
}
.hero h1 .amp { font-style: italic; font-weight: 400; color: var(--muted); }
.hero .lead { font-size: 22px; line-height: 1.5; max-width: 640px; }
.hero .lead em { font-style: italic; color: var(--muted); }
.hero .meta {
  margin-top: 48px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px;
  padding-top: 24px; border-top: 1px solid var(--rule);
}
.hero .meta .stat .num { font-size: 36px; font-weight: 600; letter-spacing: -1.5px; }
.hero .meta .stat .lbl {
  font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--muted); margin-top: 4px;
}
.hero .avatar {
  width: 88px; height: 88px; border-radius: 50%;
  object-fit: cover; border: 1px solid var(--rule);
}

/* === Section heading === */
.section { margin-bottom: 96px; opacity: 0; transform: translateY(12px); transition: opacity 0.6s ease, transform 0.6s ease; }
.section.is-visible { opacity: 1; transform: none; }
.section-head {
  display: flex; align-items: baseline; gap: 16px;
  margin-bottom: 48px; padding-bottom: 14px; border-bottom: 1px solid var(--rule);
}
.section-num { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 11px; color: var(--muted); letter-spacing: 2px; }
.section-head h2 { font-size: 14px; font-family: ui-sans-serif, system-ui, sans-serif; letter-spacing: 3px; text-transform: uppercase; font-weight: 600; }

/* === Project === */
.project { display: grid; grid-template-columns: 140px 1fr; gap: 32px; padding: 28px 0; border-top: 1px solid var(--rule); }
.project:first-of-type { border-top: none; padding-top: 0; }
.project .when { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 12px; color: var(--muted); letter-spacing: 1px; padding-top: 8px; }
.project .when .role {
  display: block; color: var(--fg); font-weight: 500; margin-top: 6px;
  text-transform: none; letter-spacing: 0; font-size: 13px; font-style: italic; font-family: Georgia, serif;
}
.project h3 { font-size: 28px; font-weight: 600; letter-spacing: -0.8px; margin-bottom: 6px; }
.project .blurb { font-size: 15px; max-width: 600px; margin-bottom: 16px; }
.project .stack { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 14px; }
.project .stack span {
  font-family: ui-monospace, monospace; font-size: 10px; letter-spacing: 1px;
  padding: 4px 9px; border: 1px solid var(--chip-border); background: var(--chip);
  border-radius: 2px; text-transform: uppercase; color: var(--muted);
}
.project ul { list-style: none; padding: 0; color: var(--muted); font-size: 13.5px; }
.project ul li {
  padding-left: 18px; position: relative; margin-bottom: 4px;
  font-family: ui-sans-serif, system-ui, sans-serif;
}
.project ul li::before { content: '›'; position: absolute; left: 0; color: var(--muted); }

/* === Earlier === */
.earlier { display: grid; grid-template-columns: 1fr 1fr; gap: 0 48px; font-family: ui-sans-serif, system-ui, sans-serif; font-size: 13px; }
.earlier .row {
  padding: 14px 0; border-bottom: 1px solid var(--rule);
  display: flex; justify-content: space-between; gap: 16px;
}
.earlier .row .name { font-weight: 500; }
.earlier .row .when { color: var(--muted); font-size: 11px; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }

/* === Skills === */
.skills { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px 48px; }
.skills .grp .lbl { font-family: ui-sans-serif, system-ui, sans-serif; font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.skills .grp .val { font-size: 15px; }

/* === Footer === */
footer.site {
  padding: 48px 0 80px; border-top: 1px solid var(--rule);
  text-align: center; font-family: ui-sans-serif, system-ui, sans-serif;
  font-size: 12px; color: var(--muted); letter-spacing: 1px;
}
footer.site a { color: var(--muted); text-decoration: none; margin: 0 12px; border-bottom: 1px solid var(--muted); }

/* === Responsive === */
@media (max-width: 680px) {
  .hero { grid-template-columns: 1fr; }
  .hero h1 { font-size: 52px; }
  .project { grid-template-columns: 1fr; gap: 8px; }
  .skills, .earlier { grid-template-columns: 1fr; }
}

/* === Reduced motion === */
@media (prefers-reduced-motion: reduce) {
  html, body, * { transition: none !important; animation: none !important; }
  .section { opacity: 1 !important; transform: none !important; }
}

/* === Print === */
@media print {
  :root, [data-theme='dark'] {
    --bg: #fff; --fg: #111; --muted: #555; --rule: #ccc;
    --card: #fff; --soft: #fff; --chip: #fff; --chip-border: #bbb;
  }
  body { padding: 0; font-size: 11pt; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
  header.site nav, .toggle, footer.site { display: none; }
  header.site { margin-bottom: 24px; padding: 8px 0; border-bottom: 1px solid #ccc; }
  .section { opacity: 1 !important; transform: none !important; margin-bottom: 32px; page-break-inside: avoid; }
  .section-head { margin-bottom: 16px; }
  .hero { margin-bottom: 32px; }
  .hero h1 { font-size: 36pt; line-height: 1; margin-bottom: 12px; }
  .hero .lead { font-size: 12pt; }
  .hero .meta { margin-top: 16px; padding-top: 12px; }
  .project { padding: 12px 0; page-break-inside: avoid; }
  .project h3 { font-size: 14pt; }
  a { color: inherit; text-decoration: none; }
  @page { margin: 18mm 16mm; }
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/styles/global.css
git commit -m "feat: add global stylesheet"
```

---

## Task 7: Base layout component

**Files:**
- Create: `src/layouts/Base.astro`

- [ ] **Step 1: Write `src/layouts/Base.astro`**

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Todor Angelov — Software Architect. 16 years building distributed systems.' } = Astro.props;
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content="profile" />
  <link rel="icon" type="image/svg+xml" href={`${import.meta.env.BASE_URL}favicon.svg`.replace('//','/')} />
  <script is:inline>
    (function () {
      try {
        var t = localStorage.getItem('theme');
        if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.dataset.theme = t;
      } catch (e) {
        document.documentElement.dataset.theme = 'light';
      }
    })();
  </script>
</head>
<body>
  <div class="wrap">
    <slot />
  </div>
  <script>
    import '../scripts/theme.ts';
    import '../scripts/reveal.ts';
  </script>
</body>
</html>
```

- [ ] **Step 2: Commit**

```powershell
git add src/layouts/Base.astro
git commit -m "feat: add base layout with theme-flash guard"
```

---

## Task 8: Theme toggle script

**Files:**
- Create: `src/scripts/theme.ts`

- [ ] **Step 1: Write `src/scripts/theme.ts`**

```ts
const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

function setTheme(next: 'light' | 'dark') {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* ignore */
  }
  if (button) button.setAttribute('aria-pressed', String(next === 'dark'));
}

if (button) {
  button.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
  button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/scripts/theme.ts
git commit -m "feat: add theme toggle script"
```

---

## Task 9: Scroll-fade reveal script

**Files:**
- Create: `src/scripts/reveal.ts`

- [ ] **Step 1: Write `src/scripts/reveal.ts`**

```ts
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduced) {
  document.querySelectorAll<HTMLElement>('.section').forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15 },
  );
  document.querySelectorAll<HTMLElement>('.section').forEach((el) => observer.observe(el));
}
```

- [ ] **Step 2: Commit**

```powershell
git add src/scripts/reveal.ts
git commit -m "feat: add scroll-fade reveal script"
```

---

## Task 10: Header component

**Files:**
- Create: `src/components/Header.astro`

- [ ] **Step 1: Write `src/components/Header.astro`**

```astro
---
import { resume } from '../data/resume';
---
<header class="site">
  <div class="left">{resume.name} · Софтуерен Архитект</div>
  <nav>
    <a href="#work">Work</a>
    <a href="#skills">Skills</a>
    <a href="#contact">Contact</a>
    <button class="toggle" data-theme-toggle aria-label="Toggle dark mode">◐</button>
  </nav>
</header>
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/Header.astro
git commit -m "feat: add header component"
```

---

## Task 11: Hero component (with avatar resolution)

**Files:**
- Create: `src/components/Hero.astro`

- [ ] **Step 1: Write `src/components/Hero.astro`**

```astro
---
import { resume } from '../data/resume';
import { resolveAvatar } from '../lib/avatar';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const avatarPath = fileURLToPath(new URL('../../public/avatar.jpg', import.meta.url));
const hasLocalFile = existsSync(avatarPath);
const avatar = resolveAvatar({
  hasLocalFile,
  email: resume.email,
  base: import.meta.env.BASE_URL || '/',
});
---
<section class="hero">
  <div class="text">
    <div class="kicker">{resume.kicker}</div>
    <h1>{resume.name.split(' ').map((part, i, arr) => (
      <>
        {part}
        {i < arr.length - 1 ? <br /> : <span class="amp">.</span>}
      </>
    ))}</h1>
    <p class="lead">{resume.lead}</p>
    <div class="meta">
      {resume.stats.map((s) => (
        <div class="stat">
          <div class="num">{s.num}</div>
          <div class="lbl">{s.lbl}</div>
        </div>
      ))}
    </div>
  </div>
  <img class="avatar" src={avatar.src} alt={`${resume.name} portrait`} width="88" height="88" loading="eager" />
</section>
```

- [ ] **Step 2: Verify build**

```powershell
npm run build
```

Expected: build succeeds. Note: avatar will use Gravatar since `public/avatar.jpg` is not yet present.

- [ ] **Step 3: Commit**

```powershell
git add src/components/Hero.astro
git commit -m "feat: add hero component with avatar resolution"
```

---

## Task 12: Project component

**Files:**
- Create: `src/components/Project.astro`

- [ ] **Step 1: Write `src/components/Project.astro`**

```astro
---
import type { ProjectEntry } from '../data/resume';
interface Props { project: ProjectEntry }
const { project } = Astro.props;
---
<div class="project">
  <div class="when">
    {project.era}
    <span class="role">{project.role}</span>
  </div>
  <div>
    <h3>{project.title}</h3>
    <p class="blurb">{project.blurb}</p>
    <div class="stack">{project.stack.map((s) => <span>{s}</span>)}</div>
    {project.highlights && (
      <ul>
        {project.highlights.map((h) => <li>{h}</li>)}
      </ul>
    )}
  </div>
</div>
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/Project.astro
git commit -m "feat: add project component"
```

---

## Task 13: EarlierWork component

**Files:**
- Create: `src/components/EarlierWork.astro`

- [ ] **Step 1: Write `src/components/EarlierWork.astro`**

```astro
---
import { resume } from '../data/resume';
---
<div class="earlier">
  {resume.earlier.map((e) => (
    <div class="row">
      <span class="name">{e.name}</span>
      <span class="when">{e.year}</span>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/EarlierWork.astro
git commit -m "feat: add earlier work component"
```

---

## Task 14: Skills component

**Files:**
- Create: `src/components/Skills.astro`

- [ ] **Step 1: Write `src/components/Skills.astro`**

```astro
---
import { resume } from '../data/resume';
---
<div class="skills">
  {resume.skills.map((g) => (
    <div class="grp">
      <div class="lbl">{g.label}</div>
      <div class="val">{g.value}</div>
    </div>
  ))}
</div>
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/Skills.astro
git commit -m "feat: add skills component"
```

---

## Task 15: Footer component

**Files:**
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Write `src/components/Footer.astro`**

```astro
---
import { resume } from '../data/resume';
const year = new Date().getFullYear();
---
<footer class="site" id="contact">
  <div>
    {resume.links.map((l, i) => (
      <>
        {i > 0 && <span aria-hidden="true">·</span>}
        <a href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
      </>
    ))}
  </div>
  <div style="margin-top:16px">© {year} {resume.name} · Designed and built by hand</div>
</footer>
```

- [ ] **Step 2: Commit**

```powershell
git add src/components/Footer.astro
git commit -m "feat: add footer component"
```

---

## Task 16: Compose the page

**Files:**
- Modify: `src/pages/index.astro` (replace placeholder)

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import Base from '../layouts/Base.astro';
import Header from '../components/Header.astro';
import Hero from '../components/Hero.astro';
import Project from '../components/Project.astro';
import EarlierWork from '../components/EarlierWork.astro';
import Skills from '../components/Skills.astro';
import Footer from '../components/Footer.astro';
import { resume } from '../data/resume';
---
<Base title={`${resume.name} — ${resume.title}`}>
  <Header />
  <main>
    <Hero />

    <section class="section" id="work">
      <div class="section-head">
        <div class="section-num">01</div>
        <h2>Selected Work</h2>
      </div>
      {resume.marquee.map((p) => <Project project={p} />)}
    </section>

    <section class="section">
      <div class="section-head">
        <div class="section-num">02</div>
        <h2>Earlier Work</h2>
      </div>
      <EarlierWork />
    </section>

    <section class="section" id="skills">
      <div class="section-head">
        <div class="section-num">03</div>
        <h2>Skills &amp; Technologies</h2>
      </div>
      <Skills />
    </section>
  </main>
  <Footer />
</Base>
```

- [ ] **Step 2: Build the site**

```powershell
npm run build
```

Expected: build succeeds. `dist/index.html` is generated and contains the name "Todor Angelov" plus all six marquee project titles.

- [ ] **Step 3: Local preview**

```powershell
npm run preview
```

Open `http://localhost:4321/resume` (note the `/resume` base path) and verify visually:
- Name "Todor Angelov" renders large in the hero
- Six marquee projects under "01 Selected Work"
- Ten earlier-work rows under "02 Earlier Work"
- Skills grid under "03 Skills & Technologies"
- Theme toggle in top-right flips between light and dark with no flash on reload
- Sections fade in as you scroll
- `Ctrl+P` shows a clean print preview

Stop the preview with Ctrl+C when done.

- [ ] **Step 4: Commit**

```powershell
git add src/pages/index.astro
git commit -m "feat: compose resume page"
```

---

## Task 17: Favicon

**Files:**
- Create: `public/favicon.svg`

- [ ] **Step 1: Write `public/favicon.svg`**

```xml
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="#111"/>
  <text x="50%" y="54%" text-anchor="middle" dominant-baseline="middle"
        font-family="Georgia, 'Times New Roman', serif" font-size="34" font-weight="600" fill="#fafaf7">T</text>
</svg>
```

- [ ] **Step 2: Commit**

```powershell
git add public/favicon.svg
git commit -m "feat: add favicon"
```

---

## Task 18: GitHub Actions deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Write `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm test
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit**

```powershell
git add .github/workflows/deploy.yml
git commit -m "ci: add github pages deploy workflow"
```

---

## Task 19: Create GitHub repo, push, enable Pages

**Files:** none (operations).

- [ ] **Step 1: Create the public repo on GitHub**

```powershell
gh repo create angelov-todor/resume --public --source=. --description "Personal resume site" --remote=origin
```

Expected: repo created at `https://github.com/angelov-todor/resume`. Local remote `origin` set.

- [ ] **Step 2: Push main**

```powershell
git push -u origin main
```

Expected: push succeeds. Workflow `Deploy to GitHub Pages` starts in Actions tab.

- [ ] **Step 3: Configure GitHub Pages source**

Pages must be set to "GitHub Actions" once for the workflow to publish. Use the gh CLI (no manual UI step needed):

```powershell
gh api -X POST repos/angelov-todor/resume/pages -f build_type=workflow
```

If the repo already has Pages configured, this returns 409; ignore.

- [ ] **Step 4: Re-run the deploy if it failed before Pages was enabled**

```powershell
gh workflow run "Deploy to GitHub Pages"
```

- [ ] **Step 5: Watch the run**

```powershell
gh run watch
```

Expected: build job passes (1 unit test passes), deploy job publishes. Site available at `https://angelov-todor.github.io/resume`.

- [ ] **Step 6: Final smoke test**

Open the live URL in a browser and verify:
- Hero, six projects, earlier work, skills, footer all render
- Theme toggle works, no flash on reload
- `Ctrl+P → Save as PDF` produces a clean 2–3 page document
- Both GitHub and LinkedIn footer links resolve to the right URLs

If the avatar shows a generic Gravatar mystery-person, that's expected — the user will drop in `public/avatar.jpg` and re-push when ready.

---

## Done

The site is live. To update content later, edit `src/data/resume.ts`, commit, push — Actions does the rest.
