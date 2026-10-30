# LiveStagix Website

The public-facing product website for **LiveStagix**, the Android live wallpaper experience.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript. GitHub Pages publishes the site automatically from the `main` branch. The social-preview.png image is committed as a static asset so social crawlers can fetch it reliably.

## Site structure

- **index.html** — product landing page, features, direct APK download, Google Play links and FAQ
- **styles.css** — responsive dark visual design, glass surfaces, CSS device mockups and motion
- **script.js** — accessible mobile navigation, in-page scrolling, phone-clock display, reveal animations and latest-release metadata
- **privacy-policy/index.html** — public privacy policy
- **social-preview.png** — public 1200×630 social preview served to link unfurlers
- **social-preview.svg** — source artwork for the social preview image

## Official distribution

The primary website download points directly to the APK asset in the public release repository. The site does not store duplicate APK files. The download button uses GitHub's latest-release route, while the release card reads the current tag, publication date, file size and SHA-256 digest from the public GitHub Releases API. If release metadata is unavailable, the direct download link remains usable.

- **Direct APK download:** https://github.com/devdas74/LiveWP-Releases/releases/latest/download/LiveStagix_beta.apk
- **All APK releases and release notes:** https://github.com/devdas74/LiveWP-Releases/releases
- **Google Play listing:** https://play.google.com/store/apps/details?id=com.livewp.app
- **Google Play closed-test opt-in:** https://play.google.com/apps/testing/com.livewp.app
- **Privacy Policy:** https://livestagix.github.io/privacy-policy/

The Google Play closed test is restricted to eligible testers configured through Play Console. APK distribution through the website is separate from Google Play installation.

## Maintenance

Publish official APK assets in `devdas74/LiveWP-Releases` using the consistent filename `LiveStagix_beta.apk`. The website's latest-download route follows the newest published GitHub release automatically. Keep the asset filename consistent so the download button continues to resolve.

© LiveStagix
