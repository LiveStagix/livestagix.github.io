# LiveStagix Website

The public-facing product website for **LiveStagix**, the Android live wallpaper experience.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript. GitHub Pages publishes the site automatically from the `main` branch. The `social-preview.png` image is committed as a static asset so social crawlers can fetch it reliably.

## Site structure

- **index.html** — product landing page, features, Google Play pre-registration, direct APK download and FAQ
- **user-guide/index.html** — public, full LiveStagix user guide
- **about/index.html**, **privacy-policy/index.html** and **security/index.html** — public project, privacy and release-verification pages
- **_includes/header.html** and **_includes/footer.html** — single shared source for site-wide navigation and footer
- **styles.css** — responsive dark visual design, glass surfaces, CSS device mockups and motion
- **script.js** — accessible mobile navigation, in-page scrolling, phone-clock display, reveal animations and latest-release metadata
- **social-preview.png** — public 1200×630 social preview served to link unfurlers
- **social-preview.svg** — source artwork for the social preview image

GitHub Pages uses its built-in Jekyll processing to insert the shared HTML includes at publish time. The published pages remain complete static HTML; there is no client-side template fetch or added runtime framework.

## Get LiveStagix

The website presents two ways to get the app:

1. **Google Play pre-registration** — visitors can pre-register for the upcoming public release and receive a notification when installation becomes available.
2. **Direct APK download** — visitors can download the latest published official Stable APK and install it manually on Android.

Google Play and direct APK distribution are separate installation routes. Pre-registration does not provide immediate installation; the direct APK is available through the public release repository.

- **Google Play pre-registration:** https://play.google.com/store/apps/details?id=com.livewp.app
- **Latest APK release:** https://github.com/LiveStagix/LiveWP-Releases/releases/latest
- **All APK releases and release notes:** https://github.com/LiveStagix/LiveWP-Releases/releases
- **Privacy Policy:** https://livestagix.github.io/privacy-policy/

The site does not store duplicate APK files. The direct-download button uses GitHub's latest-release route, while the release card reads the current tag, publication date, file size and SHA-256 digest from the public GitHub Releases API. If release metadata is unavailable, the direct download link remains usable.

## Maintenance

Publish official Stable APK assets in `LiveStagix/LiveWP-Releases`. The one-time 1.84 compatibility release retains the legacy `LiveStagix_beta.apk` filename; from 1.85 onward, use `LiveStagix.apk`. The website reads the published asset name from `release.json` and builds its direct-download URL from that value. Keep historical tags and assets unchanged.

© LiveStagix
