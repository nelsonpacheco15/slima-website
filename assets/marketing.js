/* Slima — shared marketing site behavior.
   Currently: sticky-nav scroll-state animation.
   Performance: rAF-throttled, passive scroll listener. */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const THRESHOLD = 24; // px scrolled before nav floats

  let scrolled = false;
  let ticking = false;

  function update() {
    const next = window.scrollY > THRESHOLD;
    if (next !== scrolled) {
      scrolled = next;
      nav.classList.toggle('is-scrolled', scrolled);
    }
    ticking = false;
  }

  // Run once on load (in case the page loads partway down)
  update();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    },
    { passive: true }
  );
})();
