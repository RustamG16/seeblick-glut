import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Hearth } from './glut';

gsap.registerPlugin(ScrollTrigger);

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** The only kinetic-type moment: the wordmark settles once — wght 300→400, opsz 72→144, 900 ms. */
export function settleWordmark() {
  const el = document.querySelector<HTMLElement>('[data-wordmark]');
  if (!el || reduced()) return;
  const v = { w: 300, o: 72 };
  const apply = () => (el.style.fontVariationSettings = `'wght' ${v.w}, 'opsz' ${v.o}, 'SOFT' 0, 'WONK' 0`);
  apply();
  gsap.to(v, { w: 400, o: 144, duration: 0.9, ease: 'expo.out', onUpdate: apply, onComplete: () => el.style.removeProperty('font-variation-settings') });
}

/** Windows open once, as they come into view. The mat is already there. */
export function initReveals() {
  const windows = gsap.utils.toArray<HTMLElement>('[data-reveal]');
  if (reduced()) {
    windows.forEach((w) => w.classList.add('is-open'));
    return;
  }
  windows.forEach((w) =>
    ScrollTrigger.create({ trigger: w, start: 'top 85%', once: true, onEnter: () => w.classList.add('is-open') }),
  );
}

export function initChrome() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  if (header && !header.classList.contains('is-solid')) {
    ScrollTrigger.create({
      start: 80,
      end: 'max',
      onToggle: (self) => header.classList.toggle('is-solid', self.isActive),
    });
  }

  // Window index rail: the number of the window nearest the middle of the screen.
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const railNum = rail?.querySelector<HTMLElement>('[data-rail-num]');
  const railCap = rail?.querySelector<HTMLElement>('[data-rail-cap]');
  const ticks = rail ? [...rail.querySelectorAll<HTMLElement>('[data-tick]')] : [];
  gsap.utils.toArray<HTMLElement>('[data-fenster]').forEach((f) =>
    ScrollTrigger.create({
      trigger: f,
      start: 'top 60%',
      end: 'bottom 40%',
      onToggle: (self) => {
        if (!self.isActive || !rail) return;
        railNum!.textContent = f.dataset.num ?? '';
        railCap!.textContent = `— ${f.dataset.caption ?? ''}`;
        ticks.forEach((t) => t.classList.toggle('is-active', t.dataset.tick === f.dataset.num));
      },
    }),
  );

  const hero = document.querySelector('.hero');
  const reserve = document.querySelector('#reservieren');
  const dock = document.querySelector<HTMLElement>('[data-dock]');
  if (hero) {
    ScrollTrigger.create({
      trigger: hero,
      start: 'bottom 30%',
      endTrigger: reserve ?? undefined,
      end: 'top 80%',
      onToggle: (self) => {
        rail?.classList.toggle('is-on', self.isActive);
        dock?.classList.toggle('is-on', self.isActive);
      },
    });
  }
}

/** §4: scrolling the right column stokes the hearth and fills the ember hairline. */
export function initStoke(getHearth: () => Hearth | null) {
  const col = document.querySelector<HTMLElement>('[data-glut-col]');
  const line = document.querySelector<HTMLElement>('[data-hearth-line]');
  if (!col || reduced()) {
    line?.style.setProperty('--stoke', '1');
    return;
  }
  const proxy = { p: 0 };
  gsap.to(proxy, {
    p: 1,
    ease: 'none',
    scrollTrigger: { trigger: col, start: 'top 70%', end: 'bottom 70%', scrub: 1 },
    onUpdate: () => {
      line?.style.setProperty('--stoke', proxy.p.toFixed(3));
      getHearth()?.setStoke(proxy.p);
    },
  });
}

/** Load the hearth when §4 is within 150 % of the viewport, after the page has loaded. */
export function lazyHearth(onReady: (h: Hearth) => void) {
  const section = document.querySelector<HTMLElement>('[data-glut]');
  const host = document.querySelector<HTMLElement>('[data-hearth]');
  const poster = host?.parentElement?.querySelector<HTMLImageElement>('.fenster__media');
  if (!section || !host || !poster || reduced()) return;

  const go = () => {
    const io = new IntersectionObserver(
      async ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        try {
          const { mountHearth } = await import('./glut');
          const h = await mountHearth(host, poster.currentSrc || poster.src);
          if (h) onReady(h);
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

export function refresh() {
  ScrollTrigger.refresh();
}
