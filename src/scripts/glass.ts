// Light on glass: the specular rim and sheen follow the pointer; the window panes catch a faint
// reflection; reservation buttons lean a few pixels toward the hand. Pointer-fine devices only.
export function initGlass() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const panes = [...document.querySelectorAll<HTMLElement>('[data-glass], .fenster__glare')];
  let x = 0;
  let y = 0;
  let queued = false;

  const frame = () => {
    queued = false;
    for (const el of panes) {
      const r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > innerHeight + 200) continue;
      el.style.setProperty('--gx', `${x - r.left}px`);
      el.style.setProperty('--gy', `${y - r.top}px`);
    }
  };

  addEventListener(
    'pointermove',
    (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!queued) {
        queued = true;
        requestAnimationFrame(frame);
      }
    },
    { passive: true },
  );

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((btn) => {
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
      const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
      btn.style.setProperty('--mx', `${dx * 8}px`);
      btn.style.setProperty('--my', `${dy * 6}px`);
    });
    btn.addEventListener('pointerleave', () => {
      btn.style.setProperty('--mx', '0px');
      btn.style.setProperty('--my', '0px');
    });
  });
}
