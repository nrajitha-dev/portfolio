/* ── Project filter ─────────────────────────────────────
   FIX: hidden cards used display:none but the reveal animation
        re-shows them with opacity:0 when scrolled to — now
        also adds .visible immediately on show.
   FIX: No animation between filter transitions — added
        quick fade using CSS opacity trick.
   ══════════════════════════════════════════════════════ */
(function () {
  const chips = document.querySelectorAll('.f-chip');
  if (!chips.length) return;

  const cards = document.querySelectorAll('.proj-card');

  // Set initial state — first chip active
  const first = chips[0];
  if (first) first.setAttribute('aria-pressed', 'true');

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');

      const cat = chip.dataset.filter;
      cards.forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        if (match) {
          card.style.display = 'flex';
          // FIX: ensure reveal class is applied so card isn't invisible
          requestAnimationFrame(() => card.classList.add('visible'));
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
})();