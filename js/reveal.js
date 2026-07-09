/* ── Scroll reveal ──────────────────────────────────────
   FIX: skill-fill data-w relied on element being inside a
        .reveal wrapper — if .skill-fill had its own .reveal
        the width set in the callback was immediately overridden
        by the CSS transition starting from 0. Added slight
        rAF delay so the transition has a frame to register from.
   FIX: unobserve was called inside the observer callback —
        that's correct. No change needed there.
   FIX: threshold .12 can miss tall cards on short viewports.
        Added rootMargin for better mobile triggering.
   ══════════════════════════════════════════════════════ */
(function () {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    revealEls.forEach(el => {
      el.classList.add('visible');
      el.querySelectorAll('.skill-fill').forEach(b => { b.style.width = (b.dataset.w || 0) + '%'; });
    });
    return;
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('visible');
      // FIX: rAF ensures CSS transition sees the width change after layout
      requestAnimationFrame(() => {
        e.target.querySelectorAll('.skill-fill').forEach(b => {
          b.style.width = (b.dataset.w || 0) + '%';
        });
      });
      io.unobserve(e.target);
    });
  }, {
    threshold: .1,
    // FIX: rootMargin gives earlier trigger on mobile
    rootMargin: '0px 0px -40px 0px'
  });

  revealEls.forEach(el => io.observe(el));
})();