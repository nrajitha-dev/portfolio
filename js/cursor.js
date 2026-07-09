
(function () {
  const canUseCustomCursor =
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!canUseCustomCursor) return;

  const dot = document.getElementById('cursor-dot');
  const glow = document.getElementById('cursor-glow');

  if (!dot || !glow) return;

  document.body.classList.add('cursor-enabled');
  dot.style.opacity = '0';
  glow.style.opacity = '0';

  let mx = 0, my = 0, gx = 0, gy = 0;
  let hasMoved = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top = my + 'px';
    if (!hasMoved) {
      hasMoved = true;
      gx = mx; gy = my; 
      dot.style.opacity = '';
      glow.style.opacity = '';
    }
  });

  function lerpCursor() {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glow.style.left = gx + 'px';
    glow.style.top = gy + 'px';
    requestAnimationFrame(lerpCursor);
  }
  lerpCursor();
})();