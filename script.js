(() => {
  const progressBar = document.getElementById("progressBar");
  const scrollHint = document.getElementById("scrollHint");
  const chapterContents = document.querySelectorAll(".chapter-content");
  const outroContent = document.querySelector(".outro-content");
  const heroContent = document.querySelector(".hero-content");
  const chapterBgs = document.querySelectorAll(".chapter-parallax-bg");

  const PARALLAX_STRENGTH = 0.35;

  /* ── Parallax on scroll ── */
  function applyParallax() {
    const scrollY = window.scrollY;
    const viewH = window.innerHeight;

    // Hero: move content up slowly as user scrolls away
    if (heroContent) {
      const heroShift = scrollY * 0.4;
      const heroOpacity = Math.max(1 - scrollY / (viewH * 0.8), 0);
      heroContent.style.transform = `translate3d(0, ${heroShift}px, 0)`;
      heroContent.style.opacity = heroOpacity;
    }

    // Chapter images: scroll slower than page → parallax
    chapterBgs.forEach((bg) => {
      const img = bg.querySelector("img");
      if (!img) return;

      const rect = bg.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height / 2;
      const distFromCenter = sectionCenter - viewH / 2;
      const shift = distFromCenter * PARALLAX_STRENGTH;

      img.style.transform = `translate3d(0, ${shift}px, 0)`;
    });
  }

  /* ── Progress bar ── */
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + "%";
  }

  /* ── Fade-in on scroll (Intersection Observer) ── */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { root: null, threshold: 0.15 });

  chapterContents.forEach((el) => observer.observe(el));
  if (outroContent) observer.observe(outroContent);

  /* ── Hide scroll hint after first scroll ── */
  let hintHidden = false;
  function hideScrollHint() {
    if (!hintHidden && window.scrollY > 100) {
      hintHidden = true;
      scrollHint.style.transition = "opacity 0.5s ease";
      scrollHint.style.opacity = "0";
    }
  }

  /* ── rAF-based scroll handler for smoothness ── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        applyParallax();
        updateProgress();
        hideScrollHint();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => applyParallax(), { passive: true });

  applyParallax();
  updateProgress();
})();
