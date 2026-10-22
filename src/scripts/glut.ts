// Fenster 04 — Die Glut. One bounded three.js window (WebGL contract, 06-build-plan.md):
// the poster is the scene's ember-bed texture, sparks rise from it, scroll "stokes" the fire.
// Pauses offscreen, disposes on pagehide, degrades (half particles → poster) if frames run long.
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  WebGLRenderer,
} from 'three';

export interface Hearth {
  setStoke(p: number): void;
}

const bedVert = /* glsl */ `
  varying vec2 vUv;
  void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`;

// Ember bed: the poster, its glow breathing with the stoke, heat shimmer above the coals.
const bedFrag = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uTime;
  uniform float uLight;
  uniform vec2 uCover;
  varying vec2 vUv;
  void main() {
    vec2 uv = (vUv - 0.5) * uCover + 0.5;
    float heat = smoothstep(0.75, 0.25, uv.y);
    uv.x += sin(uv.y * 38.0 + uTime * 3.1) * 0.0018 * heat;
    uv.y += sin(uv.x * 24.0 + uTime * 2.3) * 0.0014 * heat;
    vec3 c = texture2D(uMap, uv).rgb;
    float lum = dot(c, vec3(0.299, 0.587, 0.114));
    float hot = smoothstep(0.35, 0.85, lum);
    vec3 glow = c * (0.72 + 0.6 * uLight) + vec3(1.0, 0.42, 0.15) * hot * 0.35 * uLight;
    float vign = smoothstep(1.15, 0.35, length((vUv - vec2(0.5, 0.35)) * vec2(1.0, 1.25)));
    gl_FragColor = vec4(glow * mix(0.55, 1.0, vign), 1.0);
  }
`;

// Sparks: stateless — each spark's life is a function of time and its seed. The share of
// sparks alive follows the emission rate (40 → 140 per second at full stoke).
const sparkVert = /* glsl */ `
  attribute float aSeed;
  attribute float aLife;
  uniform float uTime;
  uniform float uEmit;
  uniform float uScale;
  uniform float uTilt;
  varying float vT;
  varying float vAlive;
  void main() {
    float t = fract(uTime / aLife + aSeed * 17.0);
    vT = t;
    vAlive = step(aSeed, uEmit);
    float x = (fract(aSeed * 91.7) - 0.5) * 1.5;
    x += sin(t * 6.0 + aSeed * 40.0) * 0.08 * t + sin(t * 2.0 + aSeed * 9.0) * 0.12 * t;
    x += uTilt * (0.5 + t);
    float y = -0.55 + t * (0.9 + fract(aSeed * 37.3) * 1.1);
    gl_Position = vec4(x, y, 0.0, 1.0);
    gl_PointSize = (2.0 + fract(aSeed * 13.1) * 3.5) * (1.0 - t * 0.7) * uScale * vAlive;
  }
`;

const sparkFrag = /* glsl */ `
  varying float vT;
  varying float vAlive;
  void main() {
    if (vAlive < 0.5) discard;
    float d = length(gl_PointCoord - 0.5);
    float a = smoothstep(0.5, 0.0, d);
    vec3 c = mix(vec3(1.0, 0.70, 0.48), vec3(0.91, 0.36, 0.18), smoothstep(0.0, 0.45, vT));
    c = mix(c, vec3(0.23, 0.10, 0.05), smoothstep(0.5, 1.0, vT));
    gl_FragColor = vec4(c, a * (1.0 - vT));
  }
`;

export async function mountHearth(host: HTMLElement, posterUrl: string): Promise<Hearth | null> {
  const mobile = matchMedia('(max-width: 899px)').matches;
  const canvas = document.createElement('canvas');
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: 'low-power' });
  } catch {
    return null; // no WebGL: the poster stays
  }
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1 : 1.5));
  renderer.outputColorSpace = SRGBColorSpace;

  const texture = await new TextureLoader().loadAsync(posterUrl).catch(() => null);
  if (!texture) {
    renderer.dispose();
    return null;
  }
  texture.colorSpace = SRGBColorSpace;

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const bedMat = new ShaderMaterial({
    vertexShader: bedVert,
    fragmentShader: bedFrag,
    uniforms: { uMap: { value: texture }, uTime: { value: 0 }, uLight: { value: 0.6 }, uCover: { value: [1, 1] } },
  });
  const bed = new Mesh(new PlaneGeometry(2, 2), bedMat);
  scene.add(bed);

  const max = mobile ? 700 : 1800;
  const seeds = new Float32Array(max);
  const lives = new Float32Array(max);
  for (let i = 0; i < max; i++) {
    seeds[i] = (i + Math.random()) / max;
    lives[i] = 2 + Math.random() * 3;
  }
  const sparkGeo = new BufferGeometry();
  sparkGeo.setAttribute('position', new BufferAttribute(new Float32Array(max * 3), 3));
  sparkGeo.setAttribute('aSeed', new BufferAttribute(seeds, 1));
  sparkGeo.setAttribute('aLife', new BufferAttribute(lives, 1));
  const sparkMat = new ShaderMaterial({
    vertexShader: sparkVert,
    fragmentShader: sparkFrag,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uEmit: { value: 40 / 140 }, uScale: { value: renderer.getPixelRatio() }, uTilt: { value: 0 } },
  });
  const sparks = new Points(sparkGeo, sparkMat);
  sparks.frustumCulled = false;
  scene.add(sparks);

  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 600ms cubic-bezier(.16,1,.3,1)';
  host.appendChild(canvas);

  const fit = () => {
    const w = host.clientWidth;
    const h = host.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    // object-fit: cover for the bed texture (poster is 4:5, same as the window)
    const img = texture.image as HTMLImageElement;
    const ta = img.width / img.height;
    const va = w / h;
    bedMat.uniforms.uCover.value = va > ta ? [1, ta / va] : [va / ta, 1];
  };
  const ro = new ResizeObserver(fit);
  ro.observe(host);
  fit();

  let stoke = 0;
  let light = 0.6;
  let running = false;
  let onScreen = false;
  let raf = 0;
  let last = performance.now();
  let t = 0;
  let tilt = 0;
  // Quality tier: mean frame time > 22 ms over 2 s → halve sparks once, then stop (poster stays).
  let sampleStart = last;
  let sampleFrames = 0;
  let tier = 0;

  const loop = (now: number) => {
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    t += dt;
    const target = 0.6 + 0.6 * stoke;
    light += (target - light) * Math.min(1, dt * 4);
    const flicker = 1 + 0.15 * Math.sin(t * 6 * Math.PI * 2) * 0.5 + 0.15 * Math.sin(t * 2.3 * Math.PI) * 0.5;
    bedMat.uniforms.uTime.value = t;
    bedMat.uniforms.uLight.value = light * flicker;
    sparkMat.uniforms.uTime.value = t;
    sparkMat.uniforms.uEmit.value = (40 + 100 * stoke) / 140;
    sparkMat.uniforms.uTilt.value += (tilt - sparkMat.uniforms.uTilt.value) * Math.min(1, dt * 3);
    renderer.render(scene, camera);
    if (canvas.style.opacity === '0') canvas.style.opacity = '1';

    sampleFrames++;
    if (now - sampleStart > 2000) {
      const mean = (now - sampleStart) / sampleFrames;
      if (mean > 22) {
        if (tier === 0) {
          sparkGeo.setDrawRange(0, Math.floor(max / 2));
          tier = 1;
        } else {
          dispose();
          return;
        }
      }
      sampleStart = now;
      sampleFrames = 0;
    }
  };

  const start = () => {
    if (running || !onScreen || document.hidden) return;
    running = true;
    last = performance.now();
    sampleStart = last;
    sampleFrames = 0;
    raf = requestAnimationFrame(loop);
  };
  const stop = () => {
    running = false;
    cancelAnimationFrame(raf);
  };

  const io = new IntersectionObserver(([e]) => {
    onScreen = e.isIntersecting;
    onScreen ? start() : stop();
  });
  io.observe(host);

  const onVis = () => (document.hidden ? stop() : start());
  document.addEventListener('visibilitychange', onVis);

  const onMove = (e: PointerEvent) => {
    tilt = (e.clientX / innerWidth - 0.5) * 0.07; // a couple of degrees of drift, desktop only
  };
  if (!mobile && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', onMove, { passive: true });

  let disposed = false;
  function dispose() {
    if (disposed) return;
    disposed = true;
    stop();
    io.disconnect();
    ro.disconnect();
    document.removeEventListener('visibilitychange', onVis);
    removeEventListener('pointermove', onMove);
    sparkGeo.dispose();
    sparkMat.dispose();
    bed.geometry.dispose();
    bedMat.dispose();
    texture.dispose();
    renderer.dispose();
    canvas.remove();
  }
  addEventListener('pagehide', dispose, { once: true });

  return {
    setStoke(p: number) {
      stoke = Math.max(0, Math.min(1, p));
    },
  };
}
