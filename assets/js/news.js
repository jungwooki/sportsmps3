(() => {
  const list = document.getElementById('news-list');
  const more = document.getElementById('news-more');
  const status = document.getElementById('news-status');
  if (!list || !more || !status) return;
  const items = [...list.children];
  more.addEventListener('click', () => {
    const next = items.filter(item => item.hidden).slice(0, 4);
    next.forEach(item => { item.hidden = false; });
    const visible = items.filter(item => !item.hidden).length;
    status.textContent = `${items.length}개 기사 중 ${visible}개 표시`;
    // Move focus to the newly shown articles, including when the button disappears.
    next[0]?.querySelector('a').focus({ preventScroll: true });
    more.hidden = visible === items.length;
  });
})();
