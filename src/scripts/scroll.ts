import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function initHeroEntrance() {
  const heroLines = document.querySelectorAll('[data-hero-line]');
  const heroTagline = document.querySelector('[data-hero-tagline]');
  const heroCta = document.querySelector('.hero__cta');

  if (heroLines.length) {
    gsap.set(heroLines, { yPercent: 110, opacity: 0 });
    gsap.to(heroLines, {
      yPercent: 0,
      opacity: 1,
      duration: 1.1,
      stagger: 0.12,
      ease: 'power3.out',
      delay: 0.2,
    });
  }

  if (heroTagline) {
    gsap.from(heroTagline, {
      opacity: 0,
      y: 24,
      duration: 0.9,
      ease: 'power2.out',
      delay: 0.7,
      immediateRender: false,
    });
  }

  if (heroCta) {
    gsap.from(heroCta, {
      opacity: 0,
      y: 16,
      duration: 0.8,
      ease: 'power2.out',
      delay: 1,
      immediateRender: false,
    });
  }
}

function initBatchedReveals() {
  const batches: { trigger: string; stagger: number; start?: string }[] = [
    { trigger: '#philosophy', stagger: 0.14 },
    { trigger: '#tour-events', stagger: 0.12 },
    { trigger: '#craft', stagger: 0.1 },
    { trigger: '#practical', stagger: 0.08 },
  ];

  batches.forEach(({ trigger, stagger, start = 'top 82%' }) => {
    const container = document.querySelector(trigger);
    if (!container) return;

    const els = gsap.utils.toArray<HTMLElement>('[data-reveal]', container);
    if (!els.length) return;

    gsap.set(els, { opacity: 0, y: 28 });

    ScrollTrigger.create({
      trigger: container,
      start,
      once: true,
      onEnter: () => {
        gsap.to(els, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger,
          ease: 'power2.out',
          onComplete: () => {
            els.forEach((el) => el.style.removeProperty('transform'));
          },
        });
      },
    });
  });
}

export function initScrollAnimations(reducedMotion: boolean) {
  if (reducedMotion) {
    gsap.set('[data-reveal]', { opacity: 1 });
    gsap.set(['[data-hero-line]', '[data-hero-tagline]', '.hero__cta'], { opacity: 1 });
    return;
  }

  initHeroEntrance();
  initBatchedReveals();
}
