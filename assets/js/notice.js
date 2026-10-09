(() => {
  const notice = document.querySelector('#selection-notice');
  if (!notice) return;
  const previousFocus = document.activeElement;
  const player = notice.querySelector('#notice-shorts-player');
  const play = notice.querySelector('#notice-shorts-play');
  notice.querySelector('.selection-close').addEventListener('click', () => notice.close());
  play?.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/2czTwDPOxnk?autoplay=1&playsinline=1&rel=0';
    frame.title = '좋아하는 것을, 오래도록. · 아이들의 꿈을 위한 MPS의 시작';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(frame);
    frame.focus({preventScroll: true});
  });
  notice.addEventListener('close', () => {
    document.body.classList.remove('notice-open');
    if (player && play) player.replaceChildren(play);
    const target = previousFocus instanceof HTMLElement && previousFocus !== document.body
      ? previousFocus : document.querySelector('.topbar > a');
    target?.focus({preventScroll: true});
  });
  document.body.classList.add('notice-open');
  notice.showModal();
})();
