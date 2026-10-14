(() => {
  const RELEASES_URL = "https://github.com/devdas74/LiveWP-Releases/releases/latest";
  const RELEASE_API_URL = "https://api.github.com/repos/devdas74/LiveWP-Releases/releases/latest";

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

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

  document.querySelectorAll(".js-release-link").forEach((link) => {
    link.setAttribute("href", RELEASES_URL);
  });

  const versionElement = document.getElementById("release-version");
  const detailElement = document.getElementById("release-detail");
  const feedStatus = document.getElementById("release-feed-status");

  const showRelease = async () => {
    if (!versionElement || !detailElement || !feedStatus) return;
    try {
      const response = await fetch(RELEASE_API_URL, {
        headers: { Accept: "application/vnd.github+json" },
        cache: "default"
      });
      if (!response.ok) throw new Error("Release feed unavailable");

      const release = await response.json();
      const tag = typeof release.tag_name === "string" ? release.tag_name : "";
      const betaMatch = /^v1\.0-beta-(\d+)$/i.exec(tag);
      const buildMatch = /\bbuild\s*(\d+)\b/i.exec(typeof release.name === "string" ? release.name : "");

      if (betaMatch) {
        versionElement.textContent = "Beta 1.0 · Build " + betaMatch[1];
      } else if (buildMatch) {
        versionElement.textContent = "Latest build · " + buildMatch[1];
      } else if (tag) {
        versionElement.textContent = tag;
      } else {
        throw new Error("No release tag");
      }

      const publishedAt = typeof release.published_at === "string" ? new Date(release.published_at) : null;
      if (publishedAt && !Number.isNaN(publishedAt.getTime())) {
        detailElement.textContent = "Published " + publishedAt.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric"
        }) + " · APK and release notes on GitHub.";
      } else {
        detailElement.textContent = "Official APK and release notes on GitHub.";
      }
      feedStatus.textContent = "RELEASE FEED CONNECTED";
      versionElement.setAttribute("aria-label", "Latest public release " + versionElement.textContent);
    } catch {
      // Keep a useful download route even when the API is unavailable, offline,
      // blocked by a browser extension, or temporarily rate-limited.
      versionElement.textContent = "Latest public build";
      detailElement.textContent = "Open the official release page for the newest available APK and release notes.";
      feedStatus.textContent = "OFFICIAL RELEASE CHANNEL";
    }
  };

  showRelease();

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