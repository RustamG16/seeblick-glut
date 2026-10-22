// Static pass: no motion yet. Windows are open, videos not yet injected.
document.querySelectorAll<HTMLElement>('[data-fenster]').forEach((f) => f.classList.add('is-open'));
document.documentElement.classList.remove('intro');
