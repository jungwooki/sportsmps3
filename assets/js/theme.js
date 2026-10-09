(() => {
  const key = 'mps-sportsmps-theme';
  let theme = 'dark';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'light' || saved === 'dark') theme = saved;
  } catch {}
  function apply() {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#191919' : '#f6f7f8');
    const button = document.querySelector('#theme-toggle');
    if (!button) return;
    button.setAttribute('aria-pressed', String(theme === 'light'));
    button.setAttribute('aria-label', theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환');
    button.querySelector('.theme-label').textContent = theme === 'dark' ? '라이트' : '다크';
    button.firstElementChild.textContent = theme === 'dark' ? '☼' : '◐';
  }
  apply();
  document.addEventListener('DOMContentLoaded', () => {
    apply();
    document.querySelector('#theme-toggle')?.addEventListener('click', () => {
      theme = theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, theme); } catch {}
      apply();
    });
  });
})();
