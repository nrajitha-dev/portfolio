
(function () {
  const counters = document.querySelectorAll('.count-up');
  if (!counters.length) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const DURATION = 1400; // ms

  counters.forEach(el => {
    const target  = +el.dataset.target;
    const suffix  = el.dataset.suffix || '';
    const isFloat = suffix.startsWith('.');

    if (reduceMotion) {
      el.textContent = isFloat ? target + suffix : target + suffix;
      return;
    }

    // Suppress screen reader during animation
    el.setAttribute('aria-live', 'off');
    el.setAttribute('aria-atomic', 'true');

    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();

      const start = performance.now();
      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / DURATION, 1);
        // ease-out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(target * eased);
        if (isFloat) {
          el.textContent = progress >= 1 ? target + suffix : current;
        } else {
          el.textContent = current + suffix;
        }

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          // Announce final value to screen readers
          el.setAttribute('aria-live', 'polite');
          el.textContent = target + suffix;
        }
      }
      requestAnimationFrame(step);
    }, { threshold: .5 });

    io.observe(el);
  });
})();