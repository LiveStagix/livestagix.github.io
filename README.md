# LiveStagix Website

The public-facing product website for **LiveStagix**, the Android live wallpaper experience.

This is a lightweight static site built with HTML, CSS and vanilla JavaScript. GitHub Pages publishes the site automatically from the main branch. The social-preview.png image is committed as a static asset so social crawlers can fetch it reliably.

## Site structure

- **index.html** — product landing page, feature descriptions, Google Play links, closed-testing instructions and FAQ
- **styles.css** — responsive visual design, CSS device mockups and motion
- **script.js** — accessible mobile navigation, in-page scrolling, phone-clock display and reveal animations; no private release API lookup
- **logo.svg** — site mark
- **social-preview.svg** — source artwork for the social preview image
- **social-preview.png** — public 1200×630 social preview served to link unfurlers
- **privacy-policy/index.html** — public privacy policy

## Official distribution

LiveStagix's website sends users to Google Play rather than distributing the outdated GitHub APK.

- Google Play listing: https://play.google.com/store/apps/details?id=com.livewp.app
- Closed-test opt-in: https://play.google.com/apps/testing/com.livewp.app
- Privacy Policy: https://livestagix.github.io/privacy-policy/

Closed testing is restricted to eligible testers configured through the Google Group in Play Console. The website workflow does not fetch release metadata from the private `LiveWP-Releases` repository.

© LiveStagix
