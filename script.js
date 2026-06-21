// ===========================================
// SCROLL-DRIVEN RAIL: fill + active dot
// ===========================================
const railFill = document.getElementById('railFill');
const railStops = document.querySelectorAll('.rail-stop');
const sections = document.querySelectorAll('.section');

function updateRail() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  railFill.style.height = progress + '%';

  // Determine which section is most in view
  let activeId = sections[0].id;
  const viewportMid = scrollTop + window.innerHeight * 0.4;

  sections.forEach((section) => {
    if (section.offsetTop <= viewportMid) {
      activeId = section.id;
    }
  });

  railStops.forEach((stop) => {
    stop.classList.toggle('active', stop.dataset.stop === activeId);
  });
}

window.addEventListener('scroll', updateRail, { passive: true });
window.addEventListener('resize', updateRail);
updateRail();

// ===========================================
// TIMELINE CARDS: click to expand detail panel
// ===========================================
const timelineCards = document.querySelectorAll('.timeline-card');

timelineCards.forEach((card) => {
  card.addEventListener('click', () => {
    const id = card.dataset.card;
    const detail = document.getElementById('detail-' + id);
    const section = card.closest('.section');
    const allCardsInSection = section.querySelectorAll('.timeline-card');
    const allDetailsInSection = section.querySelectorAll('.card-detail');

    const isAlreadyOpen = card.getAttribute('aria-expanded') === 'true';

    // Close all cards/details in this section first
    allCardsInSection.forEach((c) => c.setAttribute('aria-expanded', 'false'));
    allDetailsInSection.forEach((d) => { d.hidden = true; });

    // If it wasn't already open, open this one
    if (!isAlreadyOpen) {
      card.setAttribute('aria-expanded', 'true');
      detail.hidden = false;
      detail.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
});

// Close buttons inside detail panels
document.querySelectorAll('.card-close').forEach((btn) => {
  btn.addEventListener('click', () => {
    const detail = btn.closest('.card-detail');
    detail.hidden = true;
    const id = detail.id.replace('detail-', '');
    const card = document.querySelector(`.timeline-card[data-card="${id}"]`);
    if (card) card.setAttribute('aria-expanded', 'false');
  });
});

// ===========================================
// SCROLL-TRIGGERED REVEAL
// Fades + slides elements up as they enter view.
// Respects prefers-reduced-motion (handled in CSS via
// the .reveal base state being skipped there).
// ===========================================
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  const revealTargets = document.querySelectorAll(
    '.kicker, .decade-headline, .prose p, .timeline, .closing-button, .hero-headline, .hero-sub, .scroll-cue'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealTargets.forEach((el) => revealObserver.observe(el));
}

// ===========================================
// CUSTOM CURSOR
// A small dot that follows the mouse and grows
// over clickable elements. Desktop/mouse only —
// skips entirely on touch devices.
// ===========================================
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;

if (hasFinePointer && !prefersReducedMotion) {
  const cursorDot = document.createElement('div');
  cursorDot.className = 'cursor-dot';
  document.body.appendChild(cursorDot);
  document.body.classList.add('has-custom-cursor');

  let cursorX = 0, cursorY = 0;
  let dotX = 0, dotY = 0;

  window.addEventListener('mousemove', (e) => {
    cursorX = e.clientX;
    cursorY = e.clientY;
    cursorDot.style.opacity = '1';
  });

  document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
  });

  function animateCursor() {
    // Light easing so the dot trails very slightly, not 1:1 snapping
    dotX += (cursorX - dotX) * 0.25;
    dotY += (cursorY - dotY) * 0.25;
    cursorDot.style.transform = `translate(${dotX}px, ${dotY}px)`;
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  const interactiveSelector = 'a, button, .timeline-card, .rail-stop, .card-close';
  document.querySelectorAll(interactiveSelector).forEach((el) => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('cursor-dot--active'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('cursor-dot--active'));
  });
}
