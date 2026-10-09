(() => {
  const nav = document.querySelector('.nav');
  const toggle = nav?.querySelector('.nav-toggle');
  const links = nav?.querySelector('.nav-links');
  if (!toggle || !links) return;
  function setOpen(open) {
    nav.classList.toggle('mobile-nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  links.addEventListener('click', event => {
    if (event.target.closest('a')) setOpen(false);
  });
  document.addEventListener('click', event => {
    if (!nav.contains(event.target)) setOpen(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false); toggle.focus();
    }
  });
  window.matchMedia('(min-width: 810px)').addEventListener('change', () => setOpen(false));
})();
