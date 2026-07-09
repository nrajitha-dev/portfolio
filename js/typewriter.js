/* ── Typewriter ─────────────────────────────────────────
   Home page only. If the visitor prefers reduced motion,
   just show the first role as static text. */
(function () {
  const typedEl = document.getElementById('typed');
  if (!typedEl) return;

  const words = [
    'Full-Stack Developer',
    'Python & Django Engineer',
    'REST API Developer',
    'Google Cloud Silver League',
    'Open to Full-Time Roles'
  ];

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    typedEl.textContent = words[0];
    return;
  }

  let wi = 0, ci = 0, del = false;
  function type() {
    const w = words[wi];
    typedEl.textContent = del ? w.slice(0, --ci) : w.slice(0, ++ci);
    if (!del && ci === w.length) { del = true; setTimeout(type, 2200); return; }
    if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; }
    setTimeout(type, del ? 38 : 78);
  }
  type();
})();
