import type { Hearth } from './glut';

// Poster motion, first view without GSAP: one rAF ticker drives the marquees and the stamps
// (both speed up with scroll velocity), one IntersectionObserver reveals titles, boxes, plates
// and engravings. GSAP + ScrollTrigger + three.js arrive together only near "Die Glut".

const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Split [data-split] titles into masked letters; words stay unbroken. */
function splitTitles() {
  document.querySelectorAll<HTMLElement>('[data-split]').forEach((el) => {
    const text = el.textContent ?? '';
    el.setAttribute('aria-label', text.trim());
    let i = 0;
    el.innerHTML = text
      .trim()
      .split(/\s+/)
      .map(
        (word) =>
          `<span class="split__word" aria-hidden="true">${[...word]
            .map((ch) => `<span class="split__mask"><span class="split__ch" style="--i:${i++}">${ch}</span></span>`)
            .join('')}</span>`,
      )
      .join(' ');
    el.dataset.in = 'split';
  });
}

export function initReveals() {
  if (reduced()) return; // everything is already in place
  splitTitles();
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }),
    { rootMargin: '0px 0px -12% 0px' },
  );
  document.querySelectorAll('[data-in]').forEach((el) => io.observe(el));
  document.documentElement.classList.add('reveals');
}

/** Marquees and stamps share one ticker; scroll velocity adds speed and decays. */
export function initKinetics() {
  const marquees = [...document.querySelectorAll<HTMLElement>('[data-marquee]')].map((el) => {
    const track = el.querySelector<HTMLElement>('.marquee__track')!;
    // Fill to at least two viewport widths, then one more copy so the loop can wrap seamlessly.
    const unit = track.innerHTML;
    let copies = 1;
    while (track.scrollWidth < innerWidth * 2 && copies < 24) {
      track.insertAdjacentHTML('beforeend', unit);
      copies++;
    }
    const period = track.scrollWidth;
    track.insertAdjacentHTML('beforeend', track.innerHTML);
    return { el, track, period, speed: Number(el.dataset.speed ?? 1), x: 0, on: false };
  });
  const stamps = [...document.querySelectorAll<SVGElement>('[data-stamp]')].map((el) => ({ el, a: 0, on: false }));
  if (reduced()) return;

  const io = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      const m = marquees.find((m) => m.el === e.target) ?? stamps.find((s) => s.el === e.target);
      if (m) m.on = e.isIntersecting;
    }),
  );
  marquees.forEach((m) => io.observe(m.el));
  stamps.forEach((s) => io.observe(s.el));

  let lastY = scrollY;
  let boost = 0;
  let last = performance.now();
  const tick = (now: number) => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const dy = scrollY - lastY;
    lastY = scrollY;
    boost += (Math.min(40, Math.abs(dy)) * Math.sign(dy) - boost) * 0.12;
    if (!document.hidden) {
      for (const m of marquees) {
        if (!m.on) continue;
        const dir = Math.sign(m.speed) || 1;
        // base 60 px/s × speed; scrolling down pushes in the marquee's direction, up reverses
        m.x -= (60 * m.speed + boost * 14 * dir) * dt;
        m.x = ((m.x % m.period) - m.period) % m.period;
        m.track.style.transform = `translate3d(${m.x}px,0,0)`;
      }
      for (const s of stamps) {
        if (!s.on) continue;
        s.a = (s.a + (14 + Math.abs(boost) * 6) * dt) % 360;
        s.el.style.transform = `rotate(${s.a}deg)`;
      }
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

export function initChrome() {
  const header = document.querySelector<HTMLElement>('[data-header]');
  const mast = document.querySelector<HTMLElement>('.mast');
  const reserve = document.querySelector<HTMLElement>('#reservieren');
  const dock = document.querySelector<HTMLElement>('[data-dock]');

  // Two rect reads per scroll event: cheap enough to run directly, and not starved when rAF is throttled.
  const update = () => {
    header?.classList.toggle('is-scrolled', scrollY > 24);
    if (mast && dock) {
      const past = mast.getBoundingClientRect().bottom < innerHeight * 0.5;
      const before = !reserve || reserve.getBoundingClientRect().top > innerHeight * 0.75;
      dock.classList.toggle('is-on', past && before);
    }
  };
  addEventListener('scroll', update, { passive: true });
  update();
}

/**
 * "Die Glut" — when the section approaches (after load): GSAP + ScrollTrigger for the stoke
 * scrub and three.js for the hearth. The hairline works even if WebGL does not.
 */
export function initGlut() {
  const section = document.querySelector<HTMLElement>('[data-glut]');
  const col = document.querySelector<HTMLElement>('[data-glut-col]');
  const line = document.querySelector<HTMLElement>('[data-hearth-line]');
  const host = document.querySelector<HTMLElement>('[data-hearth]');
  const poster = host?.parentElement?.querySelector<HTMLImageElement>('.plate__media');
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

        const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger')]);
        gsap.registerPlugin(ScrollTrigger);
        const proxy = { p: 0 };
        gsap.to(proxy, {
          p: 1,
          ease: 'none',
          scrollTrigger: { trigger: col, start: 'top 75%', end: 'bottom 40%', scrub: 1 },
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
