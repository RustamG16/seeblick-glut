// Desktop: one glass preview card follows the hovered/focused dish row and swaps its still.
// Touch: the stills are inline thumbnails (CSS), nothing to do here.
export function initDishes() {
  const list = document.querySelector<HTMLElement>('[data-dishes]');
  const card = document.querySelector<HTMLElement>('[data-preview]');
  if (!list || !card || getComputedStyle(card).display === 'none') return;

  const img = card.querySelector<HTMLImageElement>('[data-preview-img]')!;
  const cap = card.querySelector<HTMLElement>('[data-preview-cap]')!;
  const col = card.offsetParent as HTMLElement;

  const show = (row: HTMLElement) => {
    const thumb = row.querySelector<HTMLImageElement>('.dish__thumb');
    const name = row.querySelector('.dish__name')?.textContent ?? '';
    if (thumb && img.getAttribute('src') !== thumb.getAttribute('src')) {
      img.src = thumb.currentSrc || thumb.src;
    }
    cap.textContent = name;
    const rr = row.getBoundingClientRect();
    const top = rr.top - col.getBoundingClientRect().top + rr.height / 2 - card.offsetHeight / 2;
    card.style.top = `${top}px`;
    card.classList.add('is-visible');
  };
  const hide = () => card.classList.remove('is-visible');

  list.querySelectorAll<HTMLElement>('.dish').forEach((row) => {
    row.addEventListener('pointerenter', () => show(row));
    row.addEventListener('focus', () => show(row));
    row.addEventListener('blur', hide);
  });
  list.addEventListener('pointerleave', hide);
}
