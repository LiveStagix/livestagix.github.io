(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  function updatePhoneClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    
    // Formats 24h into clean 12h phone style (e.g., 2:41 instead of 14:41)
    hours = hours % 12 || 12; 
    
    const clockElement = document.getElementById('phone-time');
    if (clockElement) {
      clockElement.textContent = `${hours}:${minutes}`;
    }
  }
  // Run instantly so it doesn't flash "9:41" while loading
  updatePhoneClock();
  // Refresh structural minutes cleanly every 15 seconds
  setInterval(updatePhoneClock, 15000);

  const latestApkUrl = "https://github.com/devdas74/LiveWP-Releases/releases/latest/download/LiveStagix_beta.apk";
  const releaseMetadataUrl = "/release.json";
  const heroDownload = document.getElementById("hero-download-apk");
  const downloadApk = document.getElementById("download-apk");
  const releaseVersion = document.getElementById("release-version");
  const releasePublished = document.getElementById("release-published");
  const releaseSize = document.getElementById("release-size");
  const releasePageLink = document.getElementById("release-page-link");
  const checksumDetails = document.getElementById("checksum-details");
  const releaseChecksum = document.getElementById("release-checksum");
  const copyChecksum = document.getElementById("copy-checksum");
  const checksumFeedback = document.getElementById("checksum-feedback");

  if (heroDownload) heroDownload.href = latestApkUrl;
  if (downloadApk) downloadApk.href = latestApkUrl;

  async function loadLatestRelease() {
    if (!releaseVersion || !releaseSize) return;
    try {
      const response = await fetch(releaseMetadataUrl, {
        headers: { Accept: "application/json" },
        cache: "no-store"
      });
      if (!response.ok) throw new Error("Release metadata unavailable");
      const release = await response.json();
      const asset = release && release.asset && release.asset.name === "LiveStagix_beta.apk"
        ? release.asset
        : null;
      if (!asset) throw new Error("Latest APK asset not found");

      const tag = String(release.tag_name || "").replace(/^v/i, "");
      const betaMatch = tag.match(new RegExp("^(\\d+(?:\\.\\d+)*)-beta-(\\d+)$", "i"));
      releaseVersion.textContent = betaMatch
        ? "Beta " + betaMatch[1] + " · Build " + betaMatch[2]
        : (tag || "Latest official APK");

      const mib = Number(asset.size) / (1024 * 1024);
      releaseSize.textContent = Number.isFinite(mib) ? mib.toFixed(2) + " MiB" : "APK";
      const publishedAt = release.published_at || release.created_at;
      if (releasePublished && publishedAt) {
        const date = new Date(publishedAt);
        releasePublished.textContent = Number.isNaN(date.getTime())
          ? "Latest published release"
          : "Published " + date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
      }
      if (releasePageLink && release.html_url) releasePageLink.href = release.html_url;

      const digest = typeof asset.digest === "string" ? asset.digest.replace(/^sha256:/i, "") : "";
      if (checksumDetails && releaseChecksum && /^[a-f0-9]{64}$/i.test(digest)) {
        releaseChecksum.textContent = digest.toUpperCase();
        checksumDetails.hidden = false;
      }
    } catch (error) {
      releaseVersion.textContent = "Latest official APK";
      releaseSize.textContent = "Details unavailable";
      if (releasePublished) releasePublished.textContent = "The direct download remains available.";
      if (checksumDetails) checksumDetails.hidden = true;
    }
  }

  loadLatestRelease();

  if (copyChecksum && releaseChecksum && checksumFeedback) {
    copyChecksum.addEventListener("click", async () => {
      const value = releaseChecksum.textContent.trim();
      if (!value) return;
      try {
        if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(value);
        checksumFeedback.textContent = "Checksum copied.";
      } catch (error) {
        checksumFeedback.textContent = "Copy unavailable. Select the checksum to copy it manually.";
      }
    });
  }


  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !isOpen);
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (!nav.classList.contains("is-open")) return;
      const target = event.target;
      if (target instanceof Node && !nav.contains(target) && !menuToggle.contains(target)) closeMenu();
    });
  }

  // Keep smooth motion for taps on in-page links, but don't animate the browser's
  // initial fragment restoration when a page with a #section URL is refreshed.
  const reduceMotionForAnchors = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (!(event instanceof MouseEvent) || event.button !== 0 ||
          event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const href = link.getAttribute("href");
      if (!href || href.length < 2) return;

      let targetId;
      try {
        targetId = decodeURIComponent(href.slice(1));
      } catch {
        return;
      }

      const target = document.getElementById(targetId);
      if (!target) return;

      event.preventDefault();
      if (window.location.hash !== href) window.history.pushState(null, "", href);
      target.scrollIntoView({
        behavior: reduceMotionForAnchors.matches ? "auto" : "smooth",
        block: "start"
      });
    });
  });



  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    document.documentElement.classList.add("js-motion");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });

    revealItems.forEach((item) => observer.observe(item));
  }
})();