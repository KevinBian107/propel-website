/* ══════════════════════════════════════════════
   Propel Documentation — Interactive Behaviors
   ══════════════════════════════════════════════ */

(function () {
  "use strict";

  // ── Mobile sidebar toggle ──
  const toggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".docs-sidebar");

  if (toggle && sidebar) {
    toggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !toggle.contains(e.target)
      ) {
        sidebar.classList.remove("open");
      }
    });
  }

  // ── Right ToC: Active heading tracking ──
  const tocLinks = document.querySelectorAll(".docs-toc a");
  const headings = [];

  tocLinks.forEach((link) => {
    const id = link.getAttribute("href")?.replace("#", "");
    const heading = id && document.getElementById(id);
    if (heading) headings.push({ el: heading, link });
  });

  if (headings.length > 0) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            tocLinks.forEach((l) => l.classList.remove("active"));
            const match = headings.find((h) => h.el === entry.target);
            if (match) match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h.el));
  }

  // ── Sidebar: Expand current section ──
  const currentPath = window.location.pathname;
  const sidebarLinks = document.querySelectorAll(".docs-sidebar .sidebar-link");

  sidebarLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href && currentPath.endsWith(href.replace(/^\.?\/?/, ""))) {
      link.classList.add("active");
    }
  });
})();
