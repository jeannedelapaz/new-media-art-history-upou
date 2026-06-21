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
