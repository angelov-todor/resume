const button = document.querySelector<HTMLButtonElement>('[data-theme-toggle]');

function setTheme(next: 'light' | 'dark') {
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('theme', next);
  } catch {
    /* ignore */
  }
  if (button) button.setAttribute('aria-pressed', String(next === 'dark'));
}

if (button) {
  button.addEventListener('click', () => {
    const current = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
  button.setAttribute('aria-pressed', String(document.documentElement.dataset.theme === 'dark'));
}
