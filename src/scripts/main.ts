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

runLoader().then(() => {
  settleWordmark();
  initReveals();
  initVideos();
});
