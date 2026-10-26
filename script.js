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