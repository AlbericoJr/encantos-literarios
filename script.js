(() => {
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // separa o texto em palavras para o efeito de revelação
  document.querySelectorAll('[data-reveal]').forEach(el => {
    const walk = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t.trim()) return frag.append(t);
            const s = document.createElement('span'); s.className = 'w'; s.textContent = t; frag.append(s);
          });
          n.replaceWith(frag);
        } else walk(n);
      });
    };
    walk(el);
  });

  const header = document.querySelector('.site-header');
  const hero = document.querySelector('.hero');
  const pins = [...document.querySelectorAll('[data-pin]')];
  let ticking = false;

  function update() {
    ticking = false;
    const vh = innerHeight;
    header.classList.toggle('is-scrolled', scrollY > 30);
    hero.style.setProperty('--h', reduce ? 0 : clamp(scrollY / (vh * .9)).toFixed(3));

    pins.forEach(sec => {
      const r = sec.getBoundingClientRect();
      const range = sec.offsetHeight - vh;
      let p = range > 0 ? clamp(-r.top / range) : 1;
      if (getComputedStyle(sec.querySelector('.pin__stage')).position !== 'sticky') p = 1;
      if (reduce) p = 1;
      sec.style.setProperty('--p', p.toFixed(3));

      const rv = sec.querySelector('[data-reveal]');
      if (rv) {
        const words = rv.querySelectorAll('.w');
        const on = Math.round(clamp((p - .05) / .6) * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < on));
        rv.classList.toggle('done', on >= words.length);
        const ic = sec.querySelectorAll('.intro__ico');
        [.05, .4, .65].forEach((t, i) => ic[i]?.classList.toggle('show', p > t));
      }
    });
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
})();
