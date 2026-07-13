import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { site } from '../content/site';
import manifest from '../../assets-out/manifest.json';
import { FlipbookScrubber } from './scrubber';

gsap.registerPlugin(ScrollTrigger);

// one pinned beat: ~150vh intro text on dark, then ~800vh of tour scrub
const TOUR_VH = 950;
const INTRO_FRACTION = 150 / 950;
// half-width of the cross-dissolve window around each leg seam, in global progress.
// The AI legs don't frame-match at the boundaries, so we dissolve between the two
// boundary frames under a dark dip instead of hard-cutting (film dissolve = time passes).
const SEAM_HALF = 0.035;
const DIP_PEAK = 0.6;

interface TourLeg {
  id: string;
  file: string;
  caption: string;
  startFrame: number;
  endFrame: number;
  durationSec: number;
  /** optional scroll-pacing override — larger = slower scrub for this leg */
  scrollWeight?: number;
}

type MotionStyle = 'track' | 'kick' | 'fade';

const MOTION_BY_LEG: Record<string, MotionStyle> = {
  leg1: 'track',
  leg2: 'kick',
  leg3: 'fade',
};

const legEase = gsap.parseEase('power2.inOut');
const outEase = gsap.parseEase('power3.out');

// ScrollTrigger's relative "+=" offsets are px-based; convert vh ourselves
const vh = (n: number) => () => `+=${Math.round((n / 100) * window.innerHeight)}`;

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

function mapRange(p: number, start: number, end: number): number {
  if (end <= start) return p >= end ? 1 : 0;
  return clamp01((p - start) / (end - start));
}

interface LegSpan {
  leg: TourLeg;
  el: HTMLElement | null;
  style: MotionStyle;
  pStart: number;
  pEnd: number;
}

function buildLegSpans(container: HTMLElement): LegSpan[] {
  const legs = manifest.legs as TourLeg[];
  const weight = (l: TourLeg) => l.scrollWeight ?? l.durationSec;
  const total = legs.reduce((s, l) => s + weight(l), 0);
  let acc = 0;
  return legs.map((leg) => {
    const pStart = acc / total;
    acc += weight(leg);
    return {
      leg,
      el: container.querySelector<HTMLElement>(`[data-tour-caption="${leg.id}"]`),
      style: MOTION_BY_LEG[leg.id] ?? 'fade',
      pStart,
      pEnd: acc / total,
    };
  });
}

interface FrameState {
  frame: number;
  blendTo: number;
  mix: number;
  dip: number;
}

function frameForProgress(spans: LegSpan[], p: number): FrameState {
  // inside a seam window? hold the two boundary frames and dissolve between them
  for (let i = 0; i < spans.length - 1; i++) {
    const seam = spans[i].pEnd;
    if (p >= seam - SEAM_HALF && p <= seam + SEAM_HALF) {
      const tw = mapRange(p, seam - SEAM_HALF, seam + SEAM_HALF);
      const mix = tw * tw * (3 - 2 * tw); // smoothstep
      return {
        frame: spans[i].leg.endFrame - 1,
        blendTo: spans[i + 1].leg.startFrame - 1,
        mix,
        dip: DIP_PEAK * (1 - Math.abs(2 * tw - 1)) ** 1.5,
      };
    }
  }

  const span = spans.find((s) => p < s.pEnd) ?? spans[spans.length - 1];
  const local = mapRange(p, span.pStart, span.pEnd);
  const { startFrame, endFrame } = span.leg;
  return {
    frame: Math.round(startFrame - 1 + legEase(local) * (endFrame - startFrame)),
    blendTo: -1,
    mix: 0,
    dip: 0,
  };
}

function updateCaption(span: LegSpan, p: number) {
  const el = span.el;
  if (!el) return;

  const title = el.querySelector<HTMLElement>('[data-caption-title]');
  const sub = el.querySelector<HTMLElement>('[data-caption-sub]');

  const local = mapRange(p, span.pStart, span.pEnd);
  if (p < span.pStart || p >= span.pEnd) {
    el.style.opacity = '0';
    if (sub) sub.style.opacity = '0';
    return;
  }

  const tOut = 1 - mapRange(local, 0.82, 0.94);
  let vis = 0;

  switch (span.style) {
    case 'track': {
      // composed, slow: letters track in from wide spacing
      const tIn = mapRange(local, 0.06, 0.26);
      const e = outEase(tIn);
      vis = Math.min(tIn, tOut);
      if (title) {
        title.style.letterSpacing = `${0.5 - 0.36 * e}em`;
        title.style.transform = `translateY(${(1 - e) * 14}px)`;
      }
      break;
    }
    case 'kick': {
      // one energetic beat, then still
      const tIn = mapRange(local, 0.06, 0.15);
      const e = outEase(tIn);
      vis = Math.min(tIn * tIn, tOut);
      if (title) {
        title.style.transform = `scale(${1.3 - 0.3 * e})`;
      }
      break;
    }
    case 'fade': {
      // soft crossfade, near-static
      const tIn = mapRange(local, 0.08, 0.3);
      vis = Math.min(tIn, tOut);
      if (title) {
        title.style.transform = `translateY(${-local * 8}px)`;
      }
      break;
    }
  }

  el.style.opacity = String(vis);

  if (sub) {
    // subline trails the title, whatever the leg's personality
    const tSub = mapRange(local, 0.16, 0.34);
    sub.style.opacity = String(Math.min(tSub, tOut));
    sub.style.transform = `translateY(${(1 - outEase(tSub)) * 10}px)`;
  }
}

/**
 * Intro beat, scrub-linked within the first INTRO_FRACTION of the pin:
 * "Ein Haus." crossfades to "Jede Geschichte." over the solid dip, then the
 * dip lifts and the first frame appears BEHIND the text before it exits.
 */
function updateIntro(wordA: HTMLElement | null, wordB: HTMLElement | null, t: number): number {
  if (wordA) {
    const aOut = 1 - mapRange(t, 0.28, 0.5);
    wordA.style.opacity = String(aOut);
    wordA.style.transform = `translateY(${-(1 - aOut) * 26}px)`;
  }
  if (wordB) {
    const bIn = mapRange(t, 0.42, 0.62);
    const bOut = 1 - mapRange(t, 0.84, 0.98);
    wordB.style.opacity = String(Math.min(bIn, bOut));
    wordB.style.transform = `translateY(${(1 - bIn) * 26}px)`;
  }
  // solid until 60% of the intro, then reveal the video behind the text
  return 1 - mapRange(t, 0.6, 1);
}

export function initTour(reducedMotion: boolean) {
  const section = document.getElementById('tour');
  if (!section) return;

  const canvas = section.querySelector<HTMLCanvasElement>('[data-tour-canvas]');
  const stage = section.querySelector<HTMLElement>('[data-tour-stage]');
  if (reducedMotion || !canvas || !stage) return;

  const isMobile = window.innerWidth < 768;
  const pattern = isMobile
    ? site.assets.tourFrames.mobilePattern
    : site.assets.tourFrames.desktopPattern;

  let scrubber: FlipbookScrubber;
  try {
    scrubber = new FlipbookScrubber(
      canvas,
      {
        frameCount: manifest.totalFrames,
        width: manifest.width,
        height: manifest.height,
        pattern,
      },
      {
        onProgress(loaded, total) {
          const bar = section.querySelector<HTMLElement>('.tour__load-bar');
          if (bar) bar.style.width = `${(loaded / total) * 100}%`;
        },
        onReady() {
          section.querySelector<HTMLElement>('[data-tour-load]')?.classList.add('is-done');
        },
        onFirstPaint() {
          section.querySelector<HTMLElement>('[data-tour-poster]')?.classList.add('is-hidden');
        },
      },
    );
  } catch {
    return; // canvas unavailable — static fallback stays
  }

  section.classList.add('tour--active');

  // start preloading frames as the section approaches the viewport
  const preloadObserver = new IntersectionObserver(
    (entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        scrubber.preload();
        preloadObserver.disconnect();
      }
    },
    { rootMargin: '100% 0px' },
  );
  preloadObserver.observe(section);

  const spans = buildLegSpans(section);
  const progressBar = section.querySelector<HTMLElement>('[data-tour-progress]');
  const dip = section.querySelector<HTMLElement>('[data-tour-dip]');
  const wordA = section.querySelector<HTMLElement>('[data-prebeat-a]');
  const wordB = section.querySelector<HTMLElement>('[data-prebeat-b]');

  // the intro covers the canvas with the solid dip until it lifts
  if (dip) dip.style.opacity = '1';

  ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: vh(TOUR_VH),
    pin: true,
    scrub: true,
    anticipatePin: 1,
    onUpdate(self) {
      const p = self.progress;

      if (p < INTRO_FRACTION) {
        const introDip = updateIntro(wordA, wordB, p / INTRO_FRACTION);
        scrubber.setFrame(0);
        if (dip) dip.style.opacity = String(introDip);
        spans.forEach((span) => updateCaption(span, 0));
        if (progressBar) progressBar.style.transform = 'scaleY(0)';
        return;
      }

      if (wordA) wordA.style.opacity = '0';
      if (wordB) wordB.style.opacity = '0';

      const tp = mapRange(p, INTRO_FRACTION, 1);
      const state = frameForProgress(spans, tp);
      if (state.mix > 0) {
        scrubber.setBlend(state.frame, state.blendTo, state.mix);
      } else {
        scrubber.setFrame(state.frame);
      }
      if (dip) dip.style.opacity = String(state.dip);
      spans.forEach((span) => updateCaption(span, tp));
      if (progressBar) progressBar.style.transform = `scaleY(${tp})`;
    },
  });
}
