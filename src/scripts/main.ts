import { runLoader } from './loader';
import { initChrome, initGlut, initKinetics, initReveals } from './motion';
import { initVideos } from './video';
import { initStatus } from './status';

initStatus();
initChrome();
initGlut();
initKinetics();

// Tells the head failsafe the app is alive; set only after every init above has run.
(window as Window & { __sgReady?: boolean }).__sgReady = true;

// Reveals arm now (titles split before first paint of the page under the loader) and fire on entry.
initReveals();
runLoader().then(() => {
  document.documentElement.classList.add('ready');
  initVideos();
});
