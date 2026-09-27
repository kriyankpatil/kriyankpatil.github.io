(() => {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  const supportsObserver = "IntersectionObserver" in window;
  if (supportsObserver) document.documentElement.classList.add("js-enabled");

  const revealItems = document.querySelectorAll(".reveal");
  if (supportsObserver) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -5% 0px" });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }

  const navLinks = [...document.querySelectorAll(".main-nav a")];
  const navSections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);
  if (supportsObserver && navSections.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          if (link.getAttribute("href") === "#" + entry.target.id) {
            link.setAttribute("aria-current", "location");
          } else {
            link.removeAttribute("aria-current");
          }
        });
      });
    }, { rootMargin: "-20% 0px -65% 0px" });
    navSections.forEach((section) => navObserver.observe(section));
  }

  let framePending = false;
  const updateScrollProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    document.documentElement.style.setProperty("--scroll-progress", progress + "%");
    framePending = false;
  };
  window.addEventListener("scroll", () => {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollProgress);
  }, { passive: true });
  updateScrollProgress();
})();
