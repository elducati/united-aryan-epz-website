# United Aryan EPZ — Frontend Revamp

This repository contains the legacy static site. The revamp plan includes:

- Accessibility and performance audit (Lighthouse)
- Modern dev tooling (`vite`, `eslint`, `prettier`)
- CSS modernization with variables and responsive design
- Image optimization and lazy-loading
- CI checks with Lighthouse CI

Getting started

1. Install dependencies:

```bash
npm install
```

2. Run dev server:

```bash
npm run start
```

3. Run linters and formatters:

```bash
npm run lint
npm run format
```

4. Run Lighthouse audit (local):

```bash
npm run audit
```

Next steps: I'll scaffold a src/ structure, centralize CSS, and start refactoring HTML for semantic markup.

Image optimization

1. Install native dependencies (Sharp requires build tools on some systems):

```bash
npm install
```

2. Generate responsive JPEG and WebP variants:

```bash
npm run images:optimize
```

Generated files are written to `assets/optimized/` and a `manifest.json` is created there.

Automating `srcset` wiring

After generating the optimized images, run:

```bash
npm run images:wire
```

This will scan root `*.html` files and replace matching `<img src="...">` tags with `<picture>` blocks using the generated WebP/JPEG srcsets found in `assets/optimized/manifest.json`.
