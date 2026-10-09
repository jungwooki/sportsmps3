(() => {
  const pages = [...document.querySelectorAll('.page')];
  const previous = document.querySelector('#prev');
  const next = document.querySelector('#next');
  const menu = document.querySelector('#contents');
  const toggle = document.querySelector('#menu-toggle');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelector('#page-total').textContent = pages.length;
  let current = 0;
  let queued = false;
  function update() {
    const marker = Math.min(innerHeight * .35, 230);
    current = 0;
    pages.forEach((page, index) => { if (page.getBoundingClientRect().top <= marker) current = index; });
    pages.forEach((page, index) => page.classList.toggle('page-entering', index === current && !reducedMotion.matches));
    document.querySelector('#page-number').textContent = String(current + 1).padStart(2, '0');
    document.querySelector('#page-name').textContent = pages[current].dataset.title;
    document.querySelector('#reading-progress').style.width = `${(current + 1) / pages.length * 100}%`;
    previous.disabled = current === 0;
    next.disabled = current === pages.length - 1;
    menu.querySelectorAll('a').forEach((link, index) => {
      if (index === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    document.querySelectorAll('.domain-shortcuts a').forEach(link => {
      if (link.getAttribute('href') === `#${pages[current].id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    queued = false;
  }
  function setMenu(open, restoreFocus = false) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? '목차 닫기' : '목차 열기');
    document.body.classList.toggle('menu-open', open);
    document.querySelector('main').inert = open;
    document.querySelector('.bottom-nav').inert = open;
    if (open) menu.querySelector('a').focus();
    else if (restoreFocus) toggle.focus();
  }
  function go(index) {
    if (index < 0 || index >= pages.length) return;
    pages[index].scrollIntoView({behavior: reducedMotion.matches ? 'instant' : 'smooth', block: 'start'});
  }
  previous.addEventListener('click', () => go(current - 1));
  next.addEventListener('click', () => go(current + 1));
  toggle.addEventListener('click', () => setMenu(menu.hidden, !menu.hidden));
  document.querySelectorAll('a[href^="#"]').forEach(link => link.addEventListener('click', () => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    const wasOpen = !menu.hidden;
    setMenu(false);
    if (wasOpen) { target.setAttribute('tabindex', '-1'); target.focus({preventScroll: true}); }
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) setMenu(false, true);
    if (!menu.hidden && event.key === 'Tab') {
      const controls = [toggle, ...menu.querySelectorAll('a')];
      if (event.shiftKey && document.activeElement === controls[0]) { event.preventDefault(); controls.at(-1).focus(); }
      else if (!event.shiftKey && document.activeElement === controls.at(-1)) { event.preventDefault(); toggle.focus(); }
    }
  });
  addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(update); } }, {passive:true});
  addEventListener('resize', update);
  document.fonts.ready.then(update);
  update();
})();
