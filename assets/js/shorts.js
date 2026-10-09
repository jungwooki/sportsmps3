(() => {
  const play = document.querySelector('#bio-shorts-play');
  const player = document.querySelector('#bio-shorts-player');
  if (!play || !player) return;
  play.addEventListener('click', () => {
    const frame = document.createElement('iframe');
    frame.src = 'https://www.youtube-nocookie.com/embed/2czTwDPOxnk?autoplay=1&playsinline=1&rel=0';
    frame.title = '바이오밴딩 설명 · 유튜브 쇼츠';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    player.replaceChildren(frame);
    frame.focus({preventScroll: true});
  });
})();
