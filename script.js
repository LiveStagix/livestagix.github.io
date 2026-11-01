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

  // LiveStagix overlay scrollbar: keeps native document scrolling and draws only a fading thumb.
  function initOverlayScrollbar() {
    const root = document.documentElement;
    const body = document.body;
    if (!root || !body || document.querySelector(".scrollbar-overlay")) return;

    const scrollbar = document.createElement("div");
    scrollbar.className = "scrollbar-overlay";
    scrollbar.setAttribute("role", "scrollbar");
    scrollbar.setAttribute("aria-label", "Page scroll position");
    scrollbar.setAttribute("aria-orientation", "vertical");
    scrollbar.setAttribute("aria-controls", "main");
    scrollbar.setAttribute("aria-valuemin", "0");
    scrollbar.setAttribute("aria-valuemax", "1000");
    scrollbar.setAttribute("aria-valuenow", "0");
    scrollbar.tabIndex = 0;

    const thumb = document.createElement("span");
    thumb.className = "scrollbar-overlay-thumb";
    scrollbar.appendChild(thumb);
    root.appendChild(scrollbar);

    let hideTimer = 0;
    let dragging = false;
    let dragOffset = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function getMetrics() {
      const viewport = Math.max(1, window.innerHeight || root.clientHeight);
      const scrollHeight = Math.max(root.scrollHeight, body.scrollHeight);
      const maxScroll = Math.max(0, scrollHeight - viewport);
      const minThumb = Math.min(34, viewport);
      const thumbHeight = maxScroll > 0
        ? Math.min(viewport, Math.max(minThumb, viewport * viewport / scrollHeight))
        : viewport;
      const travel = Math.max(0, viewport - thumbHeight);
      const scrollTop = clamp(
        window.scrollY || root.scrollTop || body.scrollTop || 0,
        0,
        maxScroll
      );
      return { viewport, scrollHeight, maxScroll, thumbHeight, travel, scrollTop };
    }

    function updateThumb() {
      const metrics = getMetrics();
      const top = metrics.maxScroll > 0
        ? (metrics.scrollTop / metrics.maxScroll) * metrics.travel
        : 0;

      thumb.style.height = metrics.thumbHeight + "px";
      thumb.style.transform = "translate3d(0," + top + "px,0)";
      scrollbar.setAttribute(
        "aria-valuenow",
        String(metrics.maxScroll > 0
          ? Math.round((metrics.scrollTop / metrics.maxScroll) * 1000)
          : 0)
      );
      scrollbar.setAttribute("aria-disabled", metrics.maxScroll > 0 ? "false" : "true");
      return metrics;
    }

    function showThumb() {
      scrollbar.classList.add("is-visible");
      window.clearTimeout(hideTimer);
    }

    function scheduleHide() {
      window.clearTimeout(hideTimer);
      if (dragging || document.activeElement === scrollbar) return;
      hideTimer = window.setTimeout(() => {
        scrollbar.classList.remove("is-visible");
      }, 850);
    }

    function onScroll() {
      updateThumb();
      showThumb();
      scheduleHide();
    }

    function scrollToPointer(clientY, metrics, offset) {
      if (metrics.maxScroll <= 0 || metrics.travel <= 0) return;
      const bounds = scrollbar.getBoundingClientRect();
      const wantedTop = clamp(clientY - bounds.top - offset, 0, metrics.travel);
      window.scrollTo(0, (wantedTop / metrics.travel) * metrics.maxScroll);
    }

    scrollbar.addEventListener("pointerdown", (event) => {
      const metrics = updateThumb();
      if (metrics.maxScroll <= 0) return;
      event.preventDefault();
      showThumb();
      dragging = true;
      scrollbar.classList.add("is-dragging");
      const bounds = scrollbar.getBoundingClientRect();
      const pointerY = event.clientY - bounds.top;
      const currentTop = metrics.maxScroll > 0
        ? (metrics.scrollTop / metrics.maxScroll) * metrics.travel
        : 0;
      dragOffset = event.target === thumb
        ? pointerY - currentTop
        : metrics.thumbHeight / 2;

      try {
        scrollbar.setPointerCapture(event.pointerId);
      } catch (_) {
        // Pointer capture is optional; native document scrolling remains available.
      }

      if (event.target !== thumb) {
        scrollToPointer(event.clientY, metrics, dragOffset);
      }
    });

    scrollbar.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const metrics = updateThumb();
      scrollToPointer(event.clientY, metrics, dragOffset);
      showThumb();
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      scrollbar.classList.remove("is-dragging");
      updateThumb();
      scheduleHide();
    }

    scrollbar.addEventListener("pointerup", endDrag);
    scrollbar.addEventListener("pointercancel", endDrag);
    scrollbar.addEventListener("lostpointercapture", endDrag);

    scrollbar.addEventListener("keydown", (event) => {
      const metrics = getMetrics();
      if (metrics.maxScroll <= 0) return;
      let target = metrics.scrollTop;
      const pageStep = Math.max(120, metrics.viewport * 0.85);

      switch (event.key) {
        case "ArrowDown": target += 48; break;
        case "ArrowUp": target -= 48; break;
        case "PageDown": target += pageStep; break;
        case "PageUp": target -= pageStep; break;
        case "Home": target = 0; break;
        case "End": target = metrics.maxScroll; break;
        default: return;
      }

      event.preventDefault();
      showThumb();
      window.scrollTo(0, clamp(target, 0, metrics.maxScroll));
      scheduleHide();
    });

    scrollbar.addEventListener("focus", showThumb);
    scrollbar.addEventListener("blur", scheduleHide);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      updateThumb();
      if (scrollbar.classList.contains("is-visible")) scheduleHide();
    }, { passive: true });
    window.addEventListener("orientationchange", updateThumb, { passive: true });

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(() => updateThumb());
      resizeObserver.observe(body);
    }

    updateThumb();
  }

  initOverlayScrollbar();

})();