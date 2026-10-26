# LiveStagix Website

The public-facing product website for **LiveStagix**, the Android live wallpaper experience.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript. GitHub Actions generates the social-preview image and deploys the static files to GitHub Pages.

## Site structure

- **index.html** — product landing page, feature descriptions, Google Play links, closed-testing instructions and FAQ
- **styles.css** — responsive visual design, CSS device mockups and motion
- **script.js** — accessible mobile navigation, in-page scrolling, phone-clock display and reveal animations; no private release API lookup
- **logo.svg** — site mark
- **social-preview.svg** — source artwork for the social preview image
- **privacy-policy/index.html** — public privacy policy
- **.github/workflows/deploy-pages.yml** — automatic GitHub Pages deployment

## Official distribution

LiveStagix's website sends users to Google Play rather than distributing the outdated GitHub APK.

- Google Play listing: https://play.google.com/store/apps/details?id=com.livewp.app
- Closed-test opt-in: https://play.google.com/apps/testing/com.livewp.app
- Privacy Policy: https://livestagix.github.io/privacy-policy/

Closed testing is restricted to eligible testers configured through the Google Group in Play Console. The website workflow does not fetch release metadata from the private `LiveWP-Releases` repository.

© LiveStagix
