(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Keep all footer links visible on desktop and use compact disclosures on mobile.
  function initFooterAccordions() {
    const groups = Array.from(document.querySelectorAll(".footer-nav-group"));
    if (!groups.length || typeof window.matchMedia !== "function") return;

    const mobileQuery = window.matchMedia("(max-width: 780px)");
    let wasMobile = null;

    function syncFooterMode() {
      const isMobile = mobileQuery.matches;
      groups.forEach((group) => {
        const summary = group.querySelector(":scope > summary");
        if (isMobile && wasMobile !== true) {
          group.open = false;
        } else if (!isMobile) {
          group.open = true;
        }
        if (summary) summary.tabIndex = isMobile ? 0 : -1;
      });
      wasMobile = isMobile;
    }

    syncFooterMode();
    if (typeof mobileQuery.addEventListener === "function") {
      mobileQuery.addEventListener("change", syncFooterMode);
    } else if (typeof mobileQuery.addListener === "function") {
      mobileQuery.addListener(syncFooterMode);
    }
  }

  initFooterAccordions();

  function updatePhoneClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");

    // Formats 24h into clean 12h phone style (e.g., 2:41 instead of 14:41)
    hours = hours % 12 || 12;

    const clockElement = document.getElementById("phone-time");
    if (clockElement) {
      clockElement.textContent = `${hours}:${minutes}`;
    }
  }
  // Run instantly so it doesn't flash "9:41" while loading
  updatePhoneClock();
  // Refresh structural minutes cleanly every 15 seconds
  setInterval(updatePhoneClock, 15000);

  const latestApkUrl =
    "https://github.com/LiveStagix/LiveWP-Releases/releases/latest/download/LiveStagix_beta.apk";
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
        cache: "no-store",
      });
      if (!response.ok) throw new Error("Release metadata unavailable");
      const release = await response.json();
      const asset =
        release && release.asset && release.asset.name === "LiveStagix_beta.apk"
          ? release.asset
          : null;
      if (!asset) throw new Error("Latest APK asset not found");

      const tag = String(release.tag_name || "").replace(/^v/i, "");
      const betaMatch = tag.match(new RegExp("^(\\d+(?:\\.\\d+)*)-beta-(\\d+)$", "i"));
      releaseVersion.textContent = betaMatch
        ? "Beta " + betaMatch[1] + " · Build " + betaMatch[2]
        : tag || "Latest official APK";

      const mib = Number(asset.size) / (1024 * 1024);
      releaseSize.textContent = Number.isFinite(mib) ? mib.toFixed(2) + " MiB" : "APK";
      const publishedAt = release.published_at || release.created_at;
      if (releasePublished && publishedAt) {
        const date = new Date(publishedAt);
        releasePublished.textContent = Number.isNaN(date.getTime())
          ? "Latest published release"
          : "Published " +
            date.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
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
        if (!navigator.clipboard || !navigator.clipboard.writeText)
          throw new Error("Clipboard unavailable");
        await navigator.clipboard.writeText(value);
        checksumFeedback.textContent = "Checksum copied.";
      } catch (error) {
        checksumFeedback.textContent = "Copy unavailable. Select the checksum to copy it manually.";
      }
    });
  }

  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("primary-nav");
  const topbar = nav ? nav.closest(".topbar") : null;
  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nav.classList.remove("is-open");
    if (topbar) topbar.classList.remove("menu-open");
  };

  window.addEventListener("resize", closeMenu, { passive: true });

  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      const shouldOpen = !isOpen;
      menuToggle.setAttribute("aria-expanded", String(shouldOpen));
      menuToggle.setAttribute("aria-label", shouldOpen ? "Close navigation" : "Open navigation");
      nav.classList.toggle("is-open", shouldOpen);
      if (topbar) topbar.classList.toggle("menu-open", shouldOpen);
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
      if (target instanceof Node && !nav.contains(target) && !menuToggle.contains(target))
        closeMenu();
    });
  }

  // Keep smooth motion for taps on in-page links, but don't animate the browser's
  // initial fragment restoration when a page with a #section URL is refreshed.
  const reduceMotionForAnchors = window.matchMedia("(prefers-reduced-motion: reduce)");
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (event) => {
      if (
        !(event instanceof MouseEvent) ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;

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
        block: "start",
      });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  const reducedMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if ("IntersectionObserver" in window && !reducedMotion) {
    document.documentElement.classList.add("js-motion");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -30px 0px" },
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  // Overlay indicator follows the real document scroller while accounting for the visual viewport.
  function initOverlayScrollbar() {
    const root = document.documentElement;
    const body = document.body;
    const scroller = document.scrollingElement || root || body;
    const visualViewport = window.visualViewport || null;
    if (!root || !body || !scroller || document.querySelector(".scrollbar-overlay")) return;

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
    let updateFrame = 0;
    let dragging = false;
    let dragOffset = 0;

    const initialDpr = Math.max(1, window.devicePixelRatio || 1);
    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    function getMetrics() {
      const layoutHeight = Math.max(
        1,
        scroller.clientHeight || root.clientHeight || window.innerHeight,
      );
      const viewportHeight = Math.max(1, visualViewport ? visualViewport.height : layoutHeight);
      const viewportWidth = Math.max(
        1,
        visualViewport
          ? visualViewport.width
          : scroller.clientWidth || root.clientWidth || window.innerWidth,
      );
      const offsetTop = visualViewport ? visualViewport.offsetTop : 0;
      const offsetLeft = visualViewport ? visualViewport.offsetLeft : 0;
      const visualScale =
        visualViewport && Number.isFinite(visualViewport.scale) ? visualViewport.scale : 1;
      const currentDpr = Math.max(1, window.devicePixelRatio || initialDpr);
      const effectiveScale = Math.max(0.25, (currentDpr / initialDpr) * visualScale);
      const cssUnit = 1 / effectiveScale;

      // Use one canonical scroller and include visual-viewport panning during pinch zoom.
      const scrollHeight = Math.max(scroller.scrollHeight, layoutHeight);
      const maxScroll = Math.max(0, scrollHeight - viewportHeight);
      const scrollTop = clamp(scroller.scrollTop + offsetTop, 0, maxScroll);
      const minThumb = Math.min(32 * cssUnit, viewportHeight);
      const thumbHeight =
        maxScroll > 0
          ? Math.min(
              viewportHeight,
              Math.max(minThumb, (viewportHeight * viewportHeight) / scrollHeight),
            )
          : viewportHeight;
      const travel = Math.max(0, viewportHeight - thumbHeight);
      const maxLayoutScroll = Math.max(0, scrollHeight - layoutHeight);

      return {
        layoutHeight,
        viewportHeight,
        viewportWidth,
        offsetTop,
        offsetLeft,
        scrollHeight,
        maxScroll,
        scrollTop,
        thumbHeight,
        travel,
        maxLayoutScroll,
        cssUnit,
      };
    }

    function updateThumb() {
      const metrics = getMetrics();
      const trackWidth = 18 * metrics.cssUnit;
      const thumbWidth = (dragging ? 4 : 3) * metrics.cssUnit;
      const thumbRight = (dragging ? 5 : 6) * metrics.cssUnit;
      const thumbTop =
        metrics.maxScroll > 0 ? (metrics.scrollTop / metrics.maxScroll) * metrics.travel : 0;

      // Pin the track to the visible viewport, not the larger layout viewport.
      scrollbar.style.top = metrics.offsetTop + "px";
      scrollbar.style.left = metrics.offsetLeft + metrics.viewportWidth - trackWidth + "px";
      scrollbar.style.right = "auto";
      scrollbar.style.bottom = "auto";
      scrollbar.style.width = trackWidth + "px";
      scrollbar.style.height = metrics.viewportHeight + "px";

      thumb.style.height = metrics.thumbHeight + "px";
      thumb.style.width = thumbWidth + "px";
      thumb.style.right = thumbRight + "px";
      thumb.style.minHeight = 32 * metrics.cssUnit + "px";
      thumb.style.transform = "translate3d(0," + thumbTop + "px,0)";

      scrollbar.setAttribute(
        "aria-valuenow",
        String(
          metrics.maxScroll > 0 ? Math.round((metrics.scrollTop / metrics.maxScroll) * 1000) : 0,
        ),
      );
      scrollbar.setAttribute("aria-disabled", metrics.maxScroll > 0 ? "false" : "true");
      return metrics;
    }

    function requestUpdate() {
      if (updateFrame) return;
      updateFrame = window.requestAnimationFrame(() => {
        updateFrame = 0;
        updateThumb();
      });
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
      requestUpdate();
      showThumb();
      scheduleHide();
    }

    function onViewportChange() {
      requestUpdate();
      if (scrollbar.classList.contains("is-visible")) scheduleHide();
    }

    function setDocumentScrollTop(documentTop, metrics) {
      const layoutTop = clamp(documentTop - metrics.offsetTop, 0, metrics.maxLayoutScroll);
      scroller.scrollTop = layoutTop;
    }

    function scrollToPointer(clientY, metrics, offset) {
      if (metrics.maxScroll <= 0 || metrics.travel <= 0) return;
      const wantedTop = clamp(clientY - offset, 0, metrics.travel);
      const documentTop = (wantedTop / metrics.travel) * metrics.maxScroll;
      setDocumentScrollTop(documentTop, metrics);
    }

    scrollbar.addEventListener("pointerdown", (event) => {
      const metrics = updateThumb();
      if (metrics.maxScroll <= 0) return;
      event.preventDefault();
      showThumb();
      dragging = true;
      scrollbar.classList.add("is-dragging");

      // Pointer coordinates are relative to the visible viewport.
      const pointerY = clamp(event.clientY, 0, metrics.viewportHeight);
      const currentTop =
        metrics.maxScroll > 0 ? (metrics.scrollTop / metrics.maxScroll) * metrics.travel : 0;
      dragOffset = event.target === thumb ? pointerY - currentTop : metrics.thumbHeight / 2;
      updateThumb();

      try {
        scrollbar.setPointerCapture(event.pointerId);
      } catch (_) {
        // Pointer capture is optional; native document scrolling remains available.
      }

      if (event.target !== thumb) scrollToPointer(pointerY, metrics, dragOffset);
    });

    scrollbar.addEventListener("pointermove", (event) => {
      if (!dragging) return;
      const metrics = getMetrics();
      scrollToPointer(event.clientY, metrics, dragOffset);
      requestUpdate();
      showThumb();
    });

    function endDrag() {
      if (!dragging) return;
      dragging = false;
      scrollbar.classList.remove("is-dragging");
      requestUpdate();
      scheduleHide();
    }

    scrollbar.addEventListener("pointerup", endDrag);
    scrollbar.addEventListener("pointercancel", endDrag);
    scrollbar.addEventListener("lostpointercapture", endDrag);

    scrollbar.addEventListener("keydown", (event) => {
      const metrics = getMetrics();
      if (metrics.maxScroll <= 0) return;
      let target = metrics.scrollTop;
      const pageStep = Math.max(120, metrics.viewportHeight * 0.85);

      switch (event.key) {
        case "ArrowDown":
          target += 48;
          break;
        case "ArrowUp":
          target -= 48;
          break;
        case "PageDown":
          target += pageStep;
          break;
        case "PageUp":
          target -= pageStep;
          break;
        case "Home":
          target = 0;
          break;
        case "End":
          target = metrics.maxScroll;
          break;
        default:
          return;
      }

      event.preventDefault();
      showThumb();
      setDocumentScrollTop(clamp(target, 0, metrics.maxScroll), metrics);
      requestUpdate();
      scheduleHide();
    });

    scrollbar.addEventListener("focus", showThumb);
    scrollbar.addEventListener("blur", scheduleHide);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onViewportChange, { passive: true });
    window.addEventListener("orientationchange", onViewportChange, { passive: true });

    if (visualViewport) {
      visualViewport.addEventListener("scroll", onScroll, { passive: true });
      visualViewport.addEventListener("resize", onViewportChange, { passive: true });
    }

    if ("ResizeObserver" in window) {
      const resizeObserver = new ResizeObserver(requestUpdate);
      resizeObserver.observe(scroller);
      if (body !== scroller) resizeObserver.observe(body);
    }

    updateThumb();
  }

  initOverlayScrollbar();
})();
