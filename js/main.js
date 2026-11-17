// andrinkaech.ch – Interaktionen: Details, Scroll-Effekte, Kontakt, Navigation

(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Rotating role line: types, holds, deletes, next word
  (function () {
    const el = document.querySelector('.rot-word');
    if (!el || reduce) return;
    const words = ['Informatiker', 'Scrum Master', 'Pizzaiolo', 'BM-Schüler'];
    let w = 0, i = words[0].length, deleting = true;
    function step() {
      const word = words[w];
      if (deleting) {
        i--; el.textContent = word.slice(0, i);
        if (i <= 0) { deleting = false; w = (w + 1) % words.length; return setTimeout(step, 260); }
        return setTimeout(step, 38);
      }
      const next = words[w];
      i++; el.textContent = next.slice(0, i);
      if (i >= next.length) { deleting = true; return setTimeout(step, 1900); }
      setTimeout(step, 75);
    }
    setTimeout(step, 2600);
  })();

  // Milestones: keyboard focus + tap to open details
  document.querySelectorAll('.t-item').forEach(item => {
    if (!item.querySelector('.more')) return;
    item.classList.add('has-more');
    item.tabIndex = 0;
    item.setAttribute('aria-expanded', 'false');
    item.addEventListener('click', ev => {
      if (ev.target.closest('a')) return;
      // with a mouse, hover alone opens the details; tapping toggles only on touch screens
      if (window.matchMedia('(hover: hover)').matches) return;
      const open = item.classList.toggle('open');
      item.setAttribute('aria-expanded', String(open));
    });
    item.addEventListener('keydown', ev => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        const open = item.classList.toggle('open');
        item.setAttribute('aria-expanded', String(open));
      }
    });
  });

  // Spotlight follows the pointer on cards
  document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('pointermove', ev => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      card.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
  });

  // CEFR segment index for the staggered fill
  document.querySelectorAll('.cefr').forEach(c => [...c.children].forEach((s, i) => s.style.setProperty('--i', i)));

  // Timeline fill lines
  const timelines = [...document.querySelectorAll('.timeline')];
  timelines.forEach(t => { const f = document.createElement('span'); f.className = 'tl-fill'; t.prepend(f); t._fill = f; });

  // Scroll progress + timeline fill
  const bar = document.querySelector('.progress');
  let ticking = false;
  function onScroll() {
    ticking = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, scrollY / max) : 0) + ')';
    const mid = innerHeight * 0.6;
    timelines.forEach(t => {
      const r = t.getBoundingClientRect();
      const h = Math.max(0, Math.min(r.height - 20, mid - r.top));
      t._fill.style.height = h + 'px';
    });
  }
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener('resize', onScroll);
  onScroll();

  // Scroll reveal: elements arrive one after another
  if (reduce || !('IntersectionObserver' in window)) return;
  const sel = 'main .eyebrow, main h2, main .tl-hint, .about > .card, .t-item, .rondisach, .r-stats > div, .r-role li, .ticket, .r-learn .pill, .lang-row, .cert, .chip, .personal > .card, .contact';
  const els = [...document.querySelectorAll(sel)].filter(el => el.getBoundingClientRect().top > innerHeight * 0.92);
  const groups = new Map();
  els.forEach(el => {
    const key = el.parentElement;
    const n = groups.get(key) || 0;
    groups.set(key, n + 1);
    el.style.setProperty('--d', Math.min(n, 6) * 90 + 'ms');
    el.classList.add('rv');
  });
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      el.classList.add('in'); io.unobserve(el);
      // hand the element back to its normal hover styles once it has arrived
      setTimeout(() => el.classList.remove('rv', 'in'), 1500 + parseInt(el.style.getPropertyValue('--d') || 0, 10));
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  els.forEach(el => io.observe(el));
  // Safety net: anything still hidden after a jump (anchor link, print, thumbnail) shows up
  addEventListener('hashchange', () => setTimeout(() => els.forEach(el => { const r = el.getBoundingClientRect(); if (r.top < innerHeight) el.classList.add('in'); }), 50));
})();

(function () {
  // ---------- Copy e-mail ----------
  const copyBtn = document.getElementById('copy');
  const status = document.getElementById('copy-status');
  copyBtn.addEventListener('click', () => {
    const text = document.getElementById('email').textContent;
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(document.getElementById('email'));
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      status.textContent = 'Adresse markiert, jetzt mit Cmd/Ctrl+C kopieren.';
    };
    try {
      navigator.clipboard.writeText(text).then(() => { status.textContent = 'Adresse kopiert.'; }, fallback);
    } catch (e) { fallback(); }
  });

  // ---------- Scroll spy ----------
  const ids = ['start', 'ueber', 'erfahrung', 'ausbildung', 'sprachen', 'persoenlich', 'kontakt'];
  const spy = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      document.querySelectorAll('.dots a, nav.links a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#' + id));
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ids.forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

  // ---------- Labels scroll to sections ----------
  document.querySelectorAll('.obj-label').forEach(b => b.addEventListener('click', () => {
    document.querySelector(b.dataset.target).scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));
})();
