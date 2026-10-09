(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const easing = 'cubic-bezier(.44, 0, .56, 1)';
  const cleanups = [];

  function setup() {
    if (reducedMotion.matches || !window.IntersectionObserver || !Element.prototype.animate) return;

    // Observe the stable frame, so the image's scale never shifts the visibility threshold.
    document.querySelectorAll('.report-img').forEach(frame => {
      const screen = frame.querySelector('.report-screen');
      if (!screen) return;
      screen.classList.add('welcome-report-pending');
      let animation;
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const visible = entry.isIntersecting && entry.intersectionRatio >= .5;
          const from = {opacity: getComputedStyle(screen).opacity, transform: getComputedStyle(screen).transform};
          animation?.cancel();
          animation = screen.animate([from, visible
            ? {opacity: 1, transform: 'translateY(0) scale(1)'}
            : {opacity: 0, transform: 'translateY(50px) scale(.8)'}],
          {duration: 400, easing, fill: 'both'});
        });
      }, {threshold: .5});
      observer.observe(frame);
      cleanups.push(() => {
        observer.disconnect(); animation?.cancel(); screen.classList.remove('welcome-report-pending');
      });
    });

    const mobile = window.matchMedia('(max-width: 809px)');
    document.querySelectorAll('.plan, .blog-card').forEach((card, index) => {
      card.classList.add('welcome-fade-pending');
      let animation;
      const observer = new IntersectionObserver(entries => {
        if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5)) return;
        animation = card.animate([{opacity: 0}, {opacity: 1}], {
          duration: mobile.matches && card.classList.contains('plan') ? 200 : 400,
          delay: !mobile.matches && card.classList.contains('plan') ? index * 100 : 0,
          easing, fill: 'both'
        });
        observer.disconnect();
      }, {threshold: .5});
      observer.observe(card);
      cleanups.push(() => {
        observer.disconnect(); animation?.cancel(); card.classList.remove('welcome-fade-pending');
      });
    });

    // Match the reference's pixel-per-second ticker speeds and hover behavior.
    document.querySelectorAll('#photoTrack, #logoTrack').forEach(track => {
      const photos = track.id === 'photoTrack';
      const speed = photos ? 18 : 50;
      track.classList.add('welcome-ticker');
      let animation, distance = 0, duration = 0, drag;
      function rebuild() {
        const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
        const nextDistance = (track.scrollWidth + gap) / 2;
        if (!nextDistance || nextDistance === distance) return;
        const progress = animation && duration ? (animation.currentTime % duration) / duration : 0;
        animation?.cancel();
        distance = nextDistance; duration = distance / speed * 1000;
        animation = track.animate([{transform: 'translateX(0)'}, {transform: `translateX(${-distance}px)`}],
          {duration, iterations: Infinity, easing: 'linear'});
        animation.currentTime = progress * duration;
        animation.playbackRate = photos && track.matches(':hover') ? .25 : 1;
      }
      function enter() { if (animation) animation.playbackRate = photos ? .25 : 1; }
      function leave() { if (animation) animation.playbackRate = 1; }
      function down(event) {
        if (!animation || (event.pointerType === 'mouse' && event.button !== 0)) return;
        drag = {x: event.clientX, time: animation.currentTime};
        animation.pause(); track.setPointerCapture(event.pointerId); track.classList.add('is-dragging');
      }
      function move(event) {
        if (!drag) return;
        const time = drag.time - (event.clientX - drag.x) / speed * 1000;
        animation.currentTime = ((time % duration) + duration) % duration;
      }
      function up() {
        if (!drag) return;
        drag = null; track.classList.remove('is-dragging'); animation?.play();
      }
      const listeners = {pointerenter: enter, pointerleave: leave, pointerdown: down,
        pointermove: move, pointerup: up, pointercancel: up, lostpointercapture: up};
      Object.entries(listeners).forEach(([name, handler]) => track.addEventListener(name, handler));
      const resize = new ResizeObserver(rebuild);
      resize.observe(track); rebuild();
      cleanups.push(() => {
        resize.disconnect(); animation?.cancel(); track.classList.remove('welcome-ticker', 'is-dragging');
        Object.entries(listeners).forEach(([name, handler]) => track.removeEventListener(name, handler));
      });
    });
  }

  function reset() { cleanups.splice(0).forEach(cleanup => cleanup()); setup(); }
  reducedMotion.addEventListener('change', reset);
  setup();
})();
