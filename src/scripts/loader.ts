// The intro plays once per session: the card is printed (Remotion wordmark on cream), then it
// lifts off the page upward (clip-path, CSS transition) and the masthead is underneath.
const MIN_MS = 2300;
const MAX_MS = 3200;
const LIFT_MS = 900;

export function runLoader(): Promise<void> {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!loader || !root.classList.contains('intro')) {
    loader?.remove();
    return Promise.resolve();
  }

  // The intro always lands on the masthead.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);

  const video = loader.querySelector<HTMLVideoElement>('[data-loader-video]')!;
  const bar = loader.querySelector<HTMLElement>('[data-loader-bar]')!;
  const started = performance.now();

  video.src = video.dataset.src ?? '';
  video.play().catch(() => loader.classList.add('is-fallback'));
  const fallbackTimer = setTimeout(() => {
    if (video.currentTime === 0) loader.classList.add('is-fallback');
  }, 900);

  // Progress: fonts + the LCP poster are the real work; the rest is the wordmark's own time.
  const poster = document.querySelector<HTMLImageElement>('.mast .plate__media');
  const ready = Promise.all([
    document.fonts.ready,
    poster && !poster.complete ? new Promise((r) => poster.addEventListener('load', r, { once: true })) : null,
  ]);
  let done = false;
  const tick = () => {
    const p = Math.min(done ? 1 : 0.92, (performance.now() - started) / MIN_MS);
    bar.style.transform = `scaleX(${p})`;
    if (!done) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const minWait = new Promise((r) => setTimeout(r, MIN_MS));
  const maxWait = new Promise((r) => setTimeout(r, MAX_MS));

  return Promise.race([Promise.all([ready, minWait]), maxWait]).then(
    () =>
      new Promise<void>((resolve) => {
        done = true;
        clearTimeout(fallbackTimer);
        bar.style.transform = 'scaleX(1)';
        loader.classList.add('is-leaving');
        root.classList.add('intro-out');
        setTimeout(() => {
          loader.remove();
          root.classList.remove('intro', 'intro-out');
          try {
            sessionStorage.setItem('sg-intro', '1');
          } catch {
            /* private mode: the intro may play again, harmless */
          }
          resolve();
        }, LIFT_MS);
      }),
  );
}
