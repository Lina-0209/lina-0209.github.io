# Nan Li — Academic Homepage

Static academic homepage for Nan Li (李楠).

Planned public address: https://lina-0209.github.io/

## Publishing

Use the public repository `Lina-0209/lina-0209.github.io`.
In **Settings → Pages**, select **Deploy from a branch**, then **main / (root)**.
The site is plain HTML, CSS and JavaScript; no build step or package installation is required.
The `.nojekyll` file keeps GitHub Pages from processing these static files with Jekyll.

## Updating

- `index.html`: English content and page structure.
- `assets/site.js`: Chinese translations and language switching.
- `assets/compact.css`: compact responsive layout.
- `assets/interactions.js`: image galleries.
- `assets/Nan-Li-CV.pdf`: current CV; update the query version in all CV links when replacing it.

For a local preview, run `python3 -m http.server 8000` in this directory and open http://localhost:8000/.

This export preserves the existing homepage, bilingual content, image galleries, avatar interactions, and the CV updated on 2026-11-12.
