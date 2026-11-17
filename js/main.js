// andrinkaech.ch – Scroll-Effekte, Navigation, Kontakt

(function () {
  document.documentElement.classList.add('js');

  // Header: Linie, sobald gescrollt wird
  const header = document.querySelector('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Elemente beim Scrollen einblenden (leicht gestaffelt)
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      let delay = 0;
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.style.transitionDelay = delay + 'ms';
        delay += 70;
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  // Aktiven Abschnitt in der Navigation markieren
  const links = [...document.querySelectorAll('.nav a')];
  const sections = links.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  let ticking = false;
  const spy = () => {
    ticking = false;
    const line = window.innerHeight * 0.4;
    let current = null;
    sections.forEach(s => {
      const r = s.getBoundingClientRect();
      if (r.top <= line && r.bottom > line) current = s.id;
    });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  spy();
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(spy); }
  }, { passive: true });

  // E-Mail-Adresse kopieren
  const copy = document.getElementById('copy');
  const status = document.getElementById('copy-status');
  if (copy) {
    copy.addEventListener('click', async () => {
      const email = copy.dataset.email;
      try {
        await navigator.clipboard.writeText(email);
        status.textContent = 'Adresse kopiert.';
      } catch (e) {
        status.textContent = email;
      }
      clearTimeout(copy._t);
      copy._t = setTimeout(() => { status.textContent = ''; }, 2500);
    });
  }

  // Jahr im Footer
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
