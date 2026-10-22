import gsap from 'gsap';
import type { Hearth } from './glut';

// First view carries GSAP core only. ScrollTrigger (for the one scrubbed sequence) and three.js
// load together when §4 comes within 150 % of the viewport.

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The only kinetic-type moment: the wordmark settles once — wght 300→400, opsz 72→144, 900 ms. */
export function settleWordmark() {
  const el = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!el || reduced()) return;
  const v = { w: 300, o: 72 };
  const apply = () => (el.style.fontVariationSettings = `'wght' ${v.w}, 'opsz' ${v.o}, 'SOFT' 0, 'WONK' 0`);
  apply();
  gsap.to(v, {
    w: 400,
    o: 144,
    duration: 0.9,
    ease: 'expo.out',
    onUpdate: apply,
    onComplete: () => el.style.removeProperty('font-variation-settings'),
  });
}

/** Windows open once, when their top passes 85 % of the viewport. The mat is already there. */
export function initReveals() {
  const windows = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  if (reduced()) {
    windows.forEach((w) => w.classList.add('is-open'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-open');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -15% 0px' },
  );
  windows.forEach((w) => io.observe(w));
}

export function initChrome() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const hero = document.querySelector<HTMLElement>('.hero');
  const reserve = document.querySelector<HTMLElement>('#reservieren');
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const dock = document.querySelector<HTMLElement>('[data-dock]');
  const solidFixed = header?.classList.contains('is-solid');

  let queued = false;
  const update = () => {
    queued = false;
    if (header && !solidFixed) header.classList.toggle('is-solid', scrollY > 80);
    if (hero) {
      const past = hero.getBoundingClientRect().bottom < innerHeight * 0.3;
      const before = !reserve || reserve.getBoundingClientRect().top > innerHeight * 0.8;
      rail?.classList.toggle('is-on', past && before);
      dock?.classList.toggle('is-on', past && before);
    }
  };
  addEventListener(
    'scroll',
    () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true },
  );
  update();

  // Window index: the window crossing the middle band of the screen.
  if (!rail) return;
  const num = rail.querySelector<HTMLElement>('[data-rail-num]')!;
  const cap = rail.querySelector<HTMLElement>('[data-rail-cap]')!;
  const ticks = [...rail.querySelectorAll<HTMLElement>('[data-tick]')];
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const f = e.target as HTMLElement;
        num.textContent = f.dataset.num ?? '';
        cap.textContent = `— ${f.dataset.caption ?? ''}`;
        ticks.forEach((t) => t.classList.toggle('is-active', t.dataset.tick === f.dataset.num));
      }),
    { rootMargin: '-45% 0px -45% 0px' },
  );
  document.querySelectorAll('[data-fenster]').forEach((f) => io.observe(f));
}

/**
 * §4 — when the section approaches (after load): load ScrollTrigger for the stoke scrub and
 * three.js for the hearth. The hairline works even if WebGL does not.
 */
export function initGlut() {
  const section = document.querySelector<HTMLElement>('[data-glut]');
  const col = document.querySelector<HTMLElement>('[data-glut-col]');
  const line = document.querySelector<HTMLElement>('[data-hearth-line]');
  const host = document.querySelector<HTMLElement>('[data-hearth]');
  const poster = host?.parentElement?.querySelector<HTMLImageElement>('.fenster__media');
  if (!section || !col) return;
  if (reduced()) {
    line?.style.setProperty('--stoke', '1');
    return;
  }

  let hearth: Hearth | null = null;

  const go = () => {
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();

        const { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger);
        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: 'none',
          scrollTrigger: { trigger: col, start: 'top 70%', end: 'bottom 70%', scrub: 1 },
          onUpdate: () => {
            line?.style.setProperty('--stoke', proxy.p.toFixed(3));
            hearth?.setStoke(proxy.p);
          },
        });
        document.fonts?.ready.then(() => ScrollTrigger.refresh());

        if (!host || !poster) return;
        try {
          const { mountHearth } = await import('./glut');
          hearth = await mountHearth(host, poster.currentSrc || poster.src);
          hearth?.setStoke(proxy.p);
        } catch {
          /* the poster is the fallback */
        }
      },
      { rootMargin: '150% 0px' },
    );
    io.observe(section);
  };
  document.readyState === 'complete' ? go() : addEventListener('load', go, { once: true });
}
