// Ambient video for Fenster windows: sources injected on approach, playback only while
// ≥ 50 % visible, one page-level Pause that every caption button toggles.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const small = matchMedia('(max-width: 899px)').matches;
const saveData = Boolean((navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

let paused = reduced;
const videos: HTMLVideoElement[] = [];
const visible = new Set<HTMLVideoElement>();

function load(v: HTMLVideoElement) {
  if (v.dataset.loaded) return;
  v.dataset.loaded = '1';
  v.src = (small || saveData ? v.dataset.sd : v.dataset.hd) ?? '';
  v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true });
}

let hero: HTMLVideoElement | undefined;
let heroGate = false;

function play(v: HTMLVideoElement) {
  if (paused || (v === hero && !heroGate)) return;
  load(v);
  v.play().catch(() => {
    /* autoplay refused: the poster stays, which is the designed state */
  });
}

function syncButtons() {
  document.querySelectorAll<HTMLButtonElement>('[data-pause]').forEach((b) => {
    b.textContent = paused ? 'Abspielen' : 'Pause';
    b.setAttribute('aria-pressed', String(paused));
  });
}

export function initVideos() {
  document.querySelectorAll<HTMLVideoElement>('video[data-video]').forEach((v) => videos.push(v));

  const near = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && !paused && load(e.target as HTMLVideoElement)),
    { rootMargin: '600px 0px' },
  );
  const seen = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) {
          visible.add(v);
          play(v);
        } else {
          visible.delete(v);
          v.pause();
        }
      }),
    { threshold: 0.5 },
  );

  for (const v of videos) {
    if (v.dataset.eager === undefined) near.observe(v);
    seen.observe(v);
  }

  // The hero clip waits for window.load so it never competes with the LCP poster.
  hero = videos.find((v) => v.dataset.eager !== undefined);
  if (hero) {
    const go = () => {
      heroGate = true;
      if (visible.has(hero!)) play(hero!);
    };
    document.readyState === 'complete' ? setTimeout(go, 150) : addEventListener('load', go, { once: true });
  }

  document.addEventListener('click', (e) => {
    const btn = (e.target as HTMLElement).closest('[data-pause]');
    if (!btn) return;
    paused = !paused;
    syncButtons();
    for (const v of videos) {
      if (paused) v.pause();
      else if (visible.has(v)) play(v);
    }
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach((v) => v.pause());
    else visible.forEach((v) => play(v));
  });

  syncButtons();
}
