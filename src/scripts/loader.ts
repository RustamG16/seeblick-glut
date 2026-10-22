import gsap from 'gsap';

// The intro plays once per session. The night pane holds the Remotion wordmark, counts the
// windows 00 → 08 as the page loads, then closes down onto window 00: the dark is handed
// to the first window and the paper page is revealed around it.
const MIN_MS = 2600;
const MAX_MS = 4200;

export function runLoader(): Promise<void> {
  const root = document.documentElement;
  const loader = document.querySelector<HTMLElement>('[data-loader]');
  if (!loader || !root.classList.contains('intro')) {
    loader?.remove();
    return Promise.resolve();
  }

  // The intro always lands on window 00.
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  if (!location.hash) scrollTo(0, 0);

  const video = loader.querySelector<HTMLVideoElement>('[data-loader-video]')!;
  const count = loader.querySelector<HTMLElement>('[data-loader-count]')!;
  const bar = loader.querySelector<HTMLElement>('[data-loader-bar]')!;
  const started = performance.now();
  const progress = { p: 0 };

  const setProgress = (p: number) => {
    progress.p = Math.max(progress.p, p);
    count.textContent = String(Math.round(progress.p * 8)).padStart(2, '0');
    bar.style.transform = `scaleX(${progress.p})`;
  };

  video.src = video.dataset.src ?? '';
  video.play().catch(() => loader.classList.add('is-fallback'));
  const fallbackTimer = setTimeout(() => {
    if (video.currentTime === 0) loader.classList.add('is-fallback');
  }, 900);

  // Progress: fonts + the LCP poster are the real work; the rest is the wordmark's own time.
  const poster = document.querySelector<HTMLImageElement>('.hero .fenster__media');
  const ready = Promise.all([
    document.fonts.ready,
    poster && !poster.complete ? new Promise((r) => poster.addEventListener('load', r, { once: true })) : null,
  ]);
  const tick = () => {
    const t = (performance.now() - started) / MIN_MS;
    setProgress(Math.min(0.92, t));
    if (progress.p < 0.92) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const minWait = new Promise((r) => setTimeout(r, MIN_MS));
  const maxWait = new Promise((r) => setTimeout(r, MAX_MS));

  return Promise.race([Promise.all([ready, minWait]), maxWait]).then(
    () =>
      new Promise<void>((resolve) => {
        clearTimeout(fallbackTimer);
        setProgress(1);
        const pane = document.querySelector<HTMLElement>('.hero [data-pane]');
        const r = pane?.getBoundingClientRect();
        const inset = r
          ? `inset(${r.top}px ${innerWidth - r.right}px ${innerHeight - r.bottom}px ${r.left}px round 2px)`
          : 'inset(50% 50% 50% 50% round 2px)';
        const tl = gsap.timeline({
          onComplete: () => {
            loader.remove();
            root.classList.remove('intro');
            try {
              sessionStorage.setItem('sg-intro', '1');
            } catch {
              /* private mode: the intro may play again, harmless */
            }
            resolve();
          },
        });
        tl.to(loader.children, { opacity: 0, duration: 0.45, ease: 'power2.out' }, 0.15)
          .to(loader, { clipPath: inset, duration: 1.1, ease: 'expo.inOut' }, 0.2)
          .to(loader, { opacity: 0, duration: 0.35, ease: 'power1.out' }, 1.15);
      }),
  );
}
