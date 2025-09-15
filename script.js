/* ==================================================
   Site scripts (modularized & tidied)
================================================== */

/**
 * Utilities
 */
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/**
 * Scroll spy (home page anchors only)
 * Highlights the current section in the nav as you scroll.
 */
function initScrollSpy() {
  const sections = $$('#content .section');
  const links = $$('.nav-links a');

  const isHome =
    /(^|\/)index\.html?$/.test(location.pathname) ||
    location.pathname.endsWith('/') ||
    location.pathname === '';

  const currentFile = location.pathname.split('/').pop() || 'index.html';

  // Mark current-page nav link (works across pages)
  links.forEach((a) => {
    try {
      const url = new URL(a.href, location.href);
      const file = url.pathname.split('/').pop() || 'index.html';
      if (file === currentFile && !a.hash) a.classList.add('is-current');
      if (!isHome && file !== currentFile) a.classList.remove('is-current');
    } catch {
      /* noop */
    }
  });

  if (!isHome || sections.length === 0) return;

  let ticking = false;
  const setActive = () => {
    const y = window.scrollY + 120;
    let current = sections[0]?.id;
    for (const sec of sections) if (y >= sec.offsetTop) current = sec.id;
    links.forEach((a) => {
      const isActive = a.getAttribute('href') === `#${current}`;
      a.classList.toggle('is-active', isActive);
      if (isActive) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    ticking = false;
  };
  setActive();

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(setActive);
        ticking = true;
      }
    },
    { passive: true }
  );
}

/**
 * Mobile nav toggle
 */
function initMobileNav() {
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  if (!nav || !toggle) return;

  toggle.addEventListener('click', () => {
    nav.classList.toggle('open');
    const expanded = nav.classList.contains('open');
    toggle.setAttribute('aria-expanded', String(expanded));
  });
}

/**
 * Polaroid tilt-on-hover (used on personal page)
 */
function initPolaroidTilt() {
  const cards = $$('.polaroid.tilt');
  if (cards.length === 0) return;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  cards.forEach((card) => {
    let raf = null;

    const enter = () => card.style.setProperty('--ty', '-6px');
    const move = (e) => {
      const r = card.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      const rx = clamp(-dy * 6, -8, 8);
      const ry = clamp(dx * 6, -8, 8);
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        card.style.setProperty('--rx', `${rx}deg`);
        card.style.setProperty('--ry', `${ry}deg`);
      });
    };
    const leave = () => {
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--ty', '0');
    };

    card.addEventListener('mouseenter', enter);
    card.addEventListener('mousemove', move);
    card.addEventListener('mouseleave', leave);
  });
}

/**
 * Init
 */
document.addEventListener('DOMContentLoaded', () => {
  initScrollSpy();
  initMobileNav();
  initPolaroidTilt();
});
