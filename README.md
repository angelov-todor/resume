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

Drop a square photo at `public/avatar.png` (≥256×256). Without it, the hero falls back to Gravatar.
