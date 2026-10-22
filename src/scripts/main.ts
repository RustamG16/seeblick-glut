import { runLoader } from './loader';
import { initChrome, initGlut, initReveals, settleWordmark } from './motion';
import { initVideos } from './video';
import { initStatus } from './status';
import { initGlass } from './glass';
import { initDishes } from './dishes';

initStatus();
initGlass();
initDishes();
initChrome();
initGlut();

// Tells the head failsafe the app is alive; set only after every init above has run.
(window as Window & { __sgReady?: boolean }).__sgReady = true;

runLoader().then(() => {
  settleWordmark();
  initReveals();
  initVideos();
});
