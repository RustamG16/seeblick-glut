const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function injectSources(video: HTMLVideoElement, wrap: HTMLElement) {
  if (video.querySelector('source')) return;

  const mobile = wrap.dataset.mobile ?? '';
  const desktop = wrap.dataset.desktop ?? '';

  if (mobile) {
    const m = document.createElement('source');
    m.src = mobile;
    m.media = '(max-width: 768px)';
    m.type = 'video/mp4';
    video.appendChild(m);
  }
  if (desktop) {
    const d = document.createElement('source');
    d.src = desktop;
    d.type = 'video/mp4';
    video.appendChild(d);
  }
}

function showVideoWhenPlaying(wrap: HTMLElement, video: HTMLVideoElement) {
  const reveal = () => {
    if (video.readyState < 2) return;
    wrap.classList.add('is-playing');
  };

  video.addEventListener('playing', reveal, { once: true });
  video.addEventListener('timeupdate', reveal, { once: true });

  if (!video.paused && video.readyState >= 2) reveal();
}

function activateVideo(wrap: HTMLElement) {
  if (reducedMotion) {
    wrap.classList.add('is-reduced');
    return;
  }

  const video = wrap.querySelector<HTMLVideoElement>('.ambient-video');
  if (!video) return;

  injectSources(video, wrap);
  video.hidden = false;
  showVideoWhenPlaying(wrap, video);

  if (!video.querySelector('source')) return;

  video.load();
  video.play().catch(() => {
    /* autoplay blocked — keep poster visible */
  });
}

function initEagerVideos() {
  const eagerWraps = document.querySelectorAll<HTMLElement>(
    '[data-ambient-video][data-lazy="false"]',
  );

  eagerWraps.forEach((wrap) => {
    if (reducedMotion) {
      wrap.classList.add('is-reduced');
      return;
    }

    const video = wrap.querySelector<HTMLVideoElement>('.ambient-video');
    if (!video) return;

    showVideoWhenPlaying(wrap, video);
    video.play().catch(() => {
      /* autoplay blocked — keep poster visible */
    });
  });
}

function initLazyVideos() {
  const lazyWraps = document.querySelectorAll<HTMLElement>(
    '[data-ambient-video][data-lazy="true"]',
  );

  if (!lazyWraps.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        activateVideo(entry.target as HTMLElement);
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '200px 0px' },
  );

  lazyWraps.forEach((wrap) => observer.observe(wrap));
}

export function initVideos() {
  initEagerVideos();
  initLazyVideos();
}
