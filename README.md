# LiveStagix Website

The public-facing product website for **LiveStagix**, the Android live wallpaper experience.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript. It does not require a package install or build step.

## Site structure

- **index.html** — product landing page, feature descriptions, setup steps, download links and FAQ
- **styles.css** — responsive visual design, CSS device mockups and motion
- **script.js** — accessible mobile navigation, reveal animations and latest-release lookup
- **logo.svg** — site mark
- **.github/workflows/deploy-pages.yml** — automatic GitHub Pages deployment

## Official download

The website links to the public release channel:

- Latest APK: https://github.com/devdas74/LiveWP-Releases/releases/latest
- Public releases: https://github.com/devdas74/LiveWP-Releases

The release card reads the latest published release from GitHub's Releases API when available. If the request fails or is rate-limited, the site keeps the official release links available and shows a safe fallback rather than inventing a build number.

The Android app source repository is private and is intentionally not advertised as a public source-code link.

## Publish with GitHub Pages

The repository includes a GitHub Actions workflow that publishes only the public site files (index.html, styles.css, script.js and logo.svg).

One-time repository setup:

1. Open **Settings → Pages**.
2. Under **Build and deployment**, choose **GitHub Actions** as the source.
3. Open **Actions → Publish LiveStagix website** and rerun the latest failed run if the first automatic attempt happened before Pages was enabled.

After Pages is enabled, pushes to main publish the site automatically. The expected project-site URL is:

https://livestagix.github.io/

## Editing guidelines

- Describe capabilities from the Stable app only.
- Do not present device-dependent enhancement paths as universally available or always active.
- Keep all APK downloads pointed at the official release URL.
- Keep this repository separate from the Android application repository.

© LiveStagix
