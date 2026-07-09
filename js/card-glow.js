(function () {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.addEventListener('mousemove', e => {
    const card = e.target.closest('.card');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });

  // FIX: reset glow position on leave so it doesn't linger
  document.addEventListener('mouseleave', e => {
    const card = e.target.closest('.card');
    if (card) {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    }
  }, true);
})();