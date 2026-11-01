# LiveStagix website repository instructions

These instructions apply to AI coding agents and automated tools working in this repository. Read this file and the relevant website sections before editing.

## Scope and approval

- Inspect the current page, styles, scripts, shared components and related pages before proposing a change. Do not assume a remembered implementation is still current.
- Do not make a website code change until the user has approved that specific modification. Explain the finding and the smallest proposed change first.
- After approval, make only the changes needed for the task. Do not bundle unrelated redesigns, SEO edits, refactors or content rewrites.
- Work on the `main` branch. Do not create another deployment branch or change GitHub Pages publishing settings unless explicitly requested.
- Preserve existing behavior, content, responsive layout, visual design, SEO metadata, accessibility and link destinations unless the approved task specifically changes them.
- Inspect the final diff for unrelated content or behavior changes before considering a task complete.

## Website architecture

- This is a lightweight static GitHub Pages website using semantic HTML, CSS and vanilla JavaScript.
- Keep the site dependency-light. Do not introduce a frontend framework, bundler, build system or runtime dependency without explicit approval.
- Keep shared styling in `styles.css` and shared browser behavior in `script.js` unless a page-specific inline block is genuinely required by the existing design.
- Preserve all four published pages and their canonical paths:
  - `index.html`
  - `about/index.html`
  - `privacy-policy/index.html`
  - `security/index.html`
- Preserve SEO and discovery files, search-engine verification files, release metadata and static assets. Do not casually edit `sitemap.xml`, `robots.txt`, `llms.txt`, `release.json`, `BingSiteAuth.xml`, Google verification files, images, icons or social-preview artwork.
- Preserve accessibility semantics, keyboard interaction, focus behavior, reduced-motion support, responsive breakpoints and mobile navigation behavior.
- Treat `.github/workflows/sync-stylesheet-cache.yml` as a functional deployment helper. When `styles.css` changes, let its existing automation calculate and update the stylesheet content version. Do not hard-code or manually guess the `?v=sha256-...` value.
- Do not hand-edit generated or binary assets, build output, caches or dependency directories.

## Readability and formatting are mandatory

- Readability is part of correctness. Never minify, compress, code-golf or collapse readable HTML, CSS or JavaScript to reduce line count.
- Keep one logical statement or CSS declaration per line. Use consistent indentation, blank lines and clear grouping.
- Use semantic HTML and descriptive class, ID and JavaScript names. Avoid cryptic abbreviations.
- Keep JavaScript functions and event handlers easy to scan. Preserve useful comments and explain non-obvious layout, browser and compatibility decisions.
- Keep CSS rules grouped by component or page section. Preserve existing custom properties and responsive media-query organization.
- Follow `.editorconfig` and `.prettierrc.json`; do not introduce a competing style or change formatter settings merely to make a patch pass.
- Format authored website source with the pinned Prettier version used by the repository's formatting workflow.
- Format only the files changed by the task. Do not reformat unrelated files.
- Be careful with whitespace-sensitive HTML, inline scripts/styles, preformatted content and text that is intentionally spaced. Formatting must not intentionally rewrite page copy or change rendered behavior.

## Editing and verification workflow

1. Inspect the target code and relevant call sites or page references.
2. State the exact intended change and obtain approval for that modification.
3. Make the smallest scoped edit.
4. Format each modified authored HTML, CSS and JavaScript file with the repository's Prettier settings.
5. Inspect the complete diff for accidental copy changes, altered links/metadata, CSS behavior changes, JavaScript logic changes and unrelated edits.
6. Run the website source-formatting check and `git diff --check`.
7. For behavior or layout changes, perform appropriate browser/device verification when available. A formatting check alone does not prove visual correctness.
8. Summarize changed files, verification performed and anything that could not be tested.

Never treat successful formatting as proof that website behavior, SEO, accessibility or browser compatibility is correct.
