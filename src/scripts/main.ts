import { runLoader } from './loader';
import { initChrome, initReveals, initStoke, lazyHearth, refresh, settleWordmark } from './motion';
import { initVideos } from './video';
import { initStatus } from './status';
import { initGlass } from './glass';
import { initDishes } from './dishes';
import type { Hearth } from './glut';

let hearth: Hearth | null = null;

initStatus();
initGlass();
initDishes();
initChrome();
initStoke(() => hearth);
lazyHearth((h) => (hearth = h));

runLoader().then(() => {
  settleWordmark();
  initReveals();
  initVideos();
  refresh();
});

document.fonts?.ready.then(refresh);
