/* ══════════════════════════════════════════════════════
   PARTIALS
   FIX: location.pathname.split('/').pop() returns '' on
        some servers for index routes — added fallback.
   FIX: nav-links click handler used e.target.tagName which
        misses clicks on <svg> children inside <a> tags.
        Now use .closest('a') instead.
   FIX: No keyboard trap fix — ESC key now closes mobile nav.
   FIX: Missing aria-label on nav-cta for screen readers.
   ══════════════════════════════════════════════════════ */
(function () {
  const PAGES = [
    { href: 'index.html',      label: 'Home' },
    { href: 'about.html',      label: 'About' },
    { href: 'experience.html', label: 'Experience' },
    { href: 'projects.html',   label: 'Projects' },
    { href: 'skills.html',     label: 'Skills' },
    { href: 'contact.html',    label: 'Contact' },
  ];

  // FIX: handle trailing slash, root path, and empty filename
  const raw = location.pathname.split('/').pop();
  const current = raw && raw.endsWith('.html') ? raw : 'index.html';

  function navHTML() {
    const links = PAGES.map(p => {
      const active = p.href === current;
      return `<li><a href="${p.href}"${active ? ' aria-current="page" class="active"' : ''}>${p.label}</a></li>`;
    }).join('');
    return `
      <div class="nav-logo">nrajitha<span style="color:var(--cyan2)">.dev</span></div>
      <button class="nav-toggle" id="nav-toggle"
        aria-expanded="false" aria-controls="nav-links"
        aria-label="Toggle navigation menu" type="button">
        <span></span><span></span><span></span>
      </button>
      <ul class="nav-links" id="nav-links" role="list">${links}</ul>
      <a href="contact.html" class="nav-cta" aria-label="Hire me — go to contact page">Hire me</a>
    `;
  }

  function footerHTML() {
    return `
      <div class="footer-logo">nrajitha<span>.dev</span></div>
      <div class="footer-links">
        <a href="https://github.com/nrajitha-dev" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/n-rajitha/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href="https://leetcode.com/u/N_Rajitha/" target="_blank" rel="noopener noreferrer">LeetCode</a>
        <a href="mailto:nrajitha142@gmail.com">Email</a>
      </div>
      <div class="footer-right">© 2026 N. Rajitha · Bengaluru, India</div>
    `;
  }

  const navEl    = document.getElementById('site-nav');
  const footerEl = document.getElementById('site-footer');
  if (navEl)    navEl.innerHTML    = navHTML();
  if (footerEl) footerEl.innerHTML = footerHTML();

  // Mobile nav toggle
  const toggle = document.getElementById('nav-toggle');
  const linksEl = document.getElementById('nav-links');

  function closeNav() {
    if (!linksEl || !toggle) return;
    linksEl.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  }

  if (toggle && linksEl) {
    toggle.addEventListener('click', () => {
      const open = linksEl.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });

    // FIX: was e.target.tagName === 'A' which breaks on SVG icon children
    linksEl.addEventListener('click', e => {
      if (e.target.closest('a')) closeNav();
    });

    // FIX: ESC key closes nav — basic keyboard accessibility
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeNav();
    });

    // FIX: clicking outside the nav closes it
    document.addEventListener('click', e => {
      if (!navEl.contains(e.target)) closeNav();
    });
  }
})();