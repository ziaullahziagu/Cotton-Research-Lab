const navButton = document.querySelector('.nav-toggle');
const nav = document.querySelector('#nav');
const navLinks = [...document.querySelectorAll('#nav a')];

navButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  navButton.setAttribute('aria-expanded', String(open));
  navButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});

navLinks.forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  navButton.setAttribute('aria-expanded', 'false');
  navButton.setAttribute('aria-label', 'Open navigation');
}));

const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach(section => observer.observe(section));
}

document.querySelector('#year').textContent = new Date().getFullYear();

// Client-side publication/resource filter.
const search = document.querySelector('#pub-search');
const cards = [...document.querySelectorAll('.publication-card')];
const count = document.querySelector('#pub-count');
search.addEventListener('input', () => {
  const term = search.value.trim().toLowerCase();
  let visible = 0;
  cards.forEach(card => {
    const match = (card.dataset.search + ' ' + card.textContent).toLowerCase().includes(term);
    card.hidden = !match;
    if (match) visible++;
  });
  count.textContent = term ? `${visible} matching resource${visible === 1 ? '' : 's'}` : 'Research library';
});

// Replace the placeholder email below before publishing.
document.querySelector('#contact-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const recipient = 'your.email@university.edu';
  const subject = encodeURIComponent(`Cotton Research Lab: ${data.get('topic')}`);
  const body = encodeURIComponent(
    `Name: ${data.get('name')}\nEmail: ${data.get('email')}\nTopic: ${data.get('topic')}\n\nMessage:\n${data.get('message')}`
  );
  document.querySelector('#form-status').textContent =
    'Your email application should open with a prepared draft. Update the placeholder recipient before publishing.';
  window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
});
