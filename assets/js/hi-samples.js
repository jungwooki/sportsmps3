(() => {
  const dialog = document.getElementById('hi-sample-dialog');
  if (!dialog) return;
  const tabs = [...dialog.querySelectorAll('[role="tab"]')];
  const panels = [...dialog.querySelectorAll('[role="tabpanel"]')];
  let opener;
  let jumpTarget;
  let scrollBefore = 0;
  function select(key) {
    tabs.forEach((tab, index) => {
      const active = tab.id === `hi-tab-${key}`;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[index].hidden = !active;
    });
    dialog.scrollTop = 0;
  }
  document.querySelectorAll('[data-hi-open]').forEach(button => {
    button.addEventListener('click', () => {
      opener = button;
      scrollBefore = window.scrollY;
      select(button.dataset.hiOpen);
      document.body.classList.add('hi-modal-open');
      dialog.showModal();
      dialog.scrollTop = 0;
    });
  });
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab.id.replace('hi-tab-', '')));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(tabs[next].id.replace('hi-tab-', ''));
      tabs[next].focus();
    });
  });
  panels.forEach(panel => {
    const formats = [...panel.querySelectorAll('[data-format]')];
    formats.forEach(button => button.addEventListener('click', () => {
      formats.forEach(other => {
        const active = other === button;
        other.setAttribute('aria-pressed', String(active));
        document.getElementById(other.getAttribute('aria-controls')).hidden = !active;
      });
    }));
  });
  document.getElementById('hi-sample-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  });
  dialog.querySelectorAll('[data-hi-jump]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      jumpTarget = document.getElementById(link.dataset.hiJump);
      dialog.close();
    });
  });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('hi-modal-open');
    if (jumpTarget) {
      const target = jumpTarget;
      jumpTarget = null;
      target.tabIndex = -1;
      target.focus({preventScroll:true});
      target.scrollIntoView({behavior:'instant', block:'start'});
      return;
    }
    window.scrollTo({top:scrollBefore, behavior:'instant'});
    opener?.focus({preventScroll:true});
  });
})();
