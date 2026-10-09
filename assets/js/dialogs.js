(() => {
  let position = 0;
  let returnTo = null;
  let switching = false;
  function open(dialog, trigger) {
    position = scrollY;
    returnTo = trigger;
    document.body.classList.add('quick-open');
    dialog.showModal();
    dialog.scrollTop = 0;
  }
  for (const name of ['booking', 'pricing']) {
    const dialog = document.querySelector('#' + name + '-dialog');
    const trigger = document.querySelector('#' + name + '-open');
    trigger.addEventListener('click', () => open(dialog, trigger));
    dialog.querySelector('.quick-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const r = dialog.getBoundingClientRect();
      if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => {
      if (switching) { switching = false; return; }
      document.body.classList.remove('quick-open');
      window.scrollTo({top:position, behavior:'instant'});
      returnTo?.focus({preventScroll:true});
    });
  }
  document.querySelector('#pricing-book').addEventListener('click', () => {
    switching = true;
    document.querySelector('#pricing-dialog').close();
    const booking = document.querySelector('#booking-dialog');
    booking.showModal();
    booking.scrollTop = 0;
  });
})();
