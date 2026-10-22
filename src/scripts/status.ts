// Live "open now" line, computed from the hours in site.ts (Tue–Sun 12:00–14:30, 18:00–22:30, Europe/Vienna).
const SERVICES: [number, number][] = [
  [12 * 60, 14 * 60 + 30],
  [18 * 60, 22 * 60 + 30],
];
const DAYS = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
const hhmm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;

function viennaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Vienna',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '';
  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'));
  return { day, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

export function statusLine(): { open: boolean; text: string } {
  const { day, minutes } = viennaNow();
  const openDay = (d: number) => d !== 1; // Montag Ruhetag
  if (openDay(day)) {
    for (const [from, to] of SERVICES) {
      if (minutes >= from && minutes < to) return { open: true, text: `Jetzt geöffnet · bis ${hhmm(to)}` };
      if (minutes < from) return { open: false, text: `Heute ab ${hhmm(from)}` };
    }
  }
  for (let i = 1; i <= 7; i++) {
    const d = (day + i) % 7;
    if (openDay(d)) return { open: false, text: `${i === 1 ? 'Morgen' : DAYS[d]} ab ${hhmm(SERVICES[0][0])}` };
  }
  return { open: false, text: 'Montag Ruhetag' };
}

export function initStatus() {
  const render = () => {
    const s = statusLine();
    document.querySelectorAll<HTMLElement>('[data-status]').forEach((el) => {
      el.dataset.open = String(s.open);
      const t = el.querySelector('[data-status-text]');
      if (t) t.textContent = s.text;
    });
  };
  render();
  setInterval(render, 60_000);
}
