/* =====================================================================
   SITE — SEEBLICK & GLUT (VENUE / ORBIT-ambient)
   Everything below CONFIG is archetype-agnostic engine code (verbatim).
   ===================================================================== */

const CONFIG = {
  frames: {
    path: 'frames/hero/frame_',
    ext: '.webp',
    count: 160,
    pad: 4,
    poster: 'frames/hero/frame_0001.webp'
  },
  heroScrub: { nameRevealEnd: 0.20, mottoRevealAt: 0.14, hintFadeAt: 0.06 }
};

/* ---------- smooth scroll (Lenis, optional) ---------- */
let lenis = null;
try {
  if (window.Lenis && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    lenis = new Lenis({ lerp: 0.09 });
    const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
    requestAnimationFrame(raf);
  }
} catch (e) { /* native scroll fallback */ }

/* ---------- FlipbookScrubber ----------
   Canvas frame-sequence scrubber with:
   - coarse-first preloading (every 8th frame, then fill)
   - nearest-loaded-frame fallback while loading
   - cover-fit draw, devicePixelRatio aware                     */
class FlipbookScrubber {
  constructor(canvas, cfg) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.cfg = cfg;
    this.isMobile = innerWidth < 768 && !!cfg.mobilePath;
    this.count = this.isMobile ? (cfg.mobileCount || cfg.count) : cfg.count;
    this.images = new Array(this.count).fill(null);
    this.loaded = new Set();
    this.current = -1;
    this.resize();
    addEventListener('resize', () => { this.resize(); this.draw(this.current < 0 ? 0 : this.current); });
    this.preload();
  }
  src(i) {
    const n = String(i + 1).padStart(this.cfg.pad, '0');
    const base = this.isMobile ? this.cfg.mobilePath : this.cfg.path;
    return `${base}${n}${this.cfg.ext}`;
  }
  load(i) {
    if (this.images[i]) return;
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => {
      this.loaded.add(i);
      if (this.current === -1 && i === 0) this.draw(0);
      else if (i === this.current) this.draw(i);   // upgrade a fallback draw
    };
    img.src = this.src(i);
    this.images[i] = img;
  }
  preload() {
    this.load(0);
    for (let i = 0; i < this.count; i += 8) this.load(i);        // coarse pass
    let i = 0;
    const fill = () => {
      let done = 0;
      while (i < this.count && done < 6) { this.load(i); i++; done++; }
      if (i < this.count) requestIdleCallback ? requestIdleCallback(fill) : setTimeout(fill, 60);
    };
    (requestIdleCallback ? requestIdleCallback(fill) : setTimeout(fill, 200));
  }
  nearestLoaded(i) {
    if (this.loaded.has(i)) return i;
    for (let d = 1; d < this.count; d++) {
      if (this.loaded.has(i - d)) return i - d;
      if (this.loaded.has(i + d)) return i + d;
    }
    return -1;
  }
  resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    this.canvas.width = innerWidth * dpr;
    this.canvas.height = innerHeight * dpr;
  }
  draw(i) {
    const j = this.nearestLoaded(i);
    if (j < 0) return;
    this.current = i;
    const img = this.images[j];
    const cw = this.canvas.width, ch = this.canvas.height;
    const s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);   // cover
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  setProgress(p) {
    const i = Math.max(0, Math.min(this.count - 1, Math.round(p * (this.count - 1))));
    if (i !== this.current) this.draw(i);
  }
}

/* section progress helper (0..1 through a tall wrapper) */
const progressOf = (el) => {
  const r = el.getBoundingClientRect();
  const total = el.offsetHeight - innerHeight;
  return total <= 0 ? 1 : Math.max(0, Math.min(1, -r.top / total));
};

/* ---------- hero: name split + scrub bindings ---------- */
document.querySelectorAll('[data-line]').forEach(line => {
  line.innerHTML = [...line.textContent].map(c => `<span class="ch">${c === ' ' ? '&nbsp;' : c}</span>`).join('');
});
const chars = [...document.querySelectorAll('.hero__name .ch')];
const scrubber = new FlipbookScrubber(document.getElementById('hero-canvas'), CONFIG.frames);
const hero = document.getElementById('hero');
const motto = document.getElementById('hero-motto');
const hint = document.getElementById('hero-hint');
const progressBar = document.querySelector('#hero-progress i');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- story: scroll-driven copy reveal ---------- */
const storyCopy = document.querySelector('.story__copy');

/* ---------- master rAF loop (single scroll reader) ---------- */
const tick = () => {
  const hp = progressOf(hero);
  scrubber.setProgress(hp);

  if (!reduced) {
    const reveal = Math.min(1, hp / CONFIG.heroScrub.nameRevealEnd);
    chars.forEach((ch, i) => {
      const local = Math.max(0, Math.min(1, reveal * (chars.length + 6) - i));
      ch.style.transform = `translateY(${(1 - local) * 110}%)`;
      ch.style.opacity = local;
    });
    motto.style.opacity = hp > CONFIG.heroScrub.mottoRevealAt ? 1 : 0;
    motto.style.transition = 'opacity .8s';
    hint.style.opacity = hp > CONFIG.heroScrub.hintFadeAt ? 0 : 1;
    hint.style.transition = 'opacity .4s';
    if (progressBar) progressBar.style.height = `${hp * 100}%`;

    if (storyCopy) {
      const sp = progressOf(document.getElementById('story'));
      storyCopy.classList.toggle('is-visible', sp > 0.25);
    }
  }

  requestAnimationFrame(tick);
};
requestAnimationFrame(tick);

/* ---------- menu: stagger reveal on scroll ---------- */
const menuIO = new IntersectionObserver((entries) => {
  entries.forEach(en => {
    if (en.isIntersecting) {
      en.target.classList.add('is-visible');
      menuIO.unobserve(en.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('[data-reveal]').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 6) * 0.06}s`;
  menuIO.observe(el);
});

/* ---------- craft: reveal on enter ---------- */
const craftCopy = document.querySelector('.craft__copy');
if (craftCopy) {
  const craftIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        craftCopy.classList.add('is-visible');
        craftIO.unobserve(en.target);
      }
    });
  }, { threshold: 0.3 });
  craftIO.observe(document.getElementById('craft'));
}

/* ---------- background video loops (swap in when real assets land) ---------- */
document.querySelectorAll('[data-video]').forEach(holder => {
  const v = document.createElement('video');
  Object.assign(v, { src: holder.dataset.video, muted: true, loop: true, autoplay: true, playsInline: true });
  v.addEventListener('canplay', () => { holder.innerHTML = ''; holder.appendChild(v); v.play().catch(() => {}); }, { once: true });
  v.addEventListener('error', () => { /* keep gradient placeholder */ });
});

/* ---------- reservation form ---------- */
const form = document.getElementById('reserve-form');
const toast = document.getElementById('reserve-toast');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }
    toast.hidden = false;
    form.reset();
    setTimeout(() => { toast.hidden = true; }, 4000);
  });
}

/* ---------- anchor scroll via lenis ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
  const t = document.querySelector(a.getAttribute('href'));
  if (t) { e.preventDefault(); lenis ? lenis.scrollTo(t) : t.scrollIntoView({ behavior: 'smooth' }); }
}));
