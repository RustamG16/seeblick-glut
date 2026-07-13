export interface ScrubberManifest {
  frameCount: number;
  width: number;
  height: number;
  pattern: string;
}

type ProgressCallback = (loaded: number, total: number) => void;

function frameUrl(pattern: string, index: number): string {
  const n = String(index + 1).padStart(5, '0');
  return pattern.replace('%05d', n);
}

/**
 * Memory budget for decoded frames. Decoding every frame of a long 1080p
 * flipbook as ImageBitmaps pins gigabytes of RAM and freezes the tab, so we
 * keep a spine of evenly spaced frames (instant scrub fallback anywhere on
 * the timeline) plus a sliding window around the current frame, and evict
 * the rest.
 */
const CACHE_BYTES = 360 * 1024 * 1024;
const SPINE_STEP = 8;

export class FlipbookScrubber {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private manifest: ScrubberManifest;
  private bitmaps = new Map<number, ImageBitmap>();
  private loading = new Set<number>();
  private loaded = new Set<number>();
  private current = -1;
  private drawnIndex = -1;
  private painted = false;
  private preloadStarted = false;
  private onProgress?: ProgressCallback;
  private onReady?: () => void;
  private onFirstPaint?: () => void;
  private readyFired = false;
  private maxCached = 64;
  private spineCount: number;

  constructor(
    canvas: HTMLCanvasElement,
    manifest: ScrubberManifest,
    callbacks?: {
      onProgress?: ProgressCallback;
      onReady?: () => void;
      onFirstPaint?: () => void;
    },
  ) {
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) throw new Error('Canvas 2D context unavailable');
    this.canvas = canvas;
    this.ctx = ctx;
    this.manifest = manifest;
    this.onProgress = callbacks?.onProgress;
    this.onReady = callbacks?.onReady;
    this.onFirstPaint = callbacks?.onFirstPaint;
    this.spineCount = Math.ceil(manifest.frameCount / SPINE_STEP);
    this.resize();
    window.addEventListener('resize', this.handleResize);
  }

  private isSpine(i: number): boolean {
    return i % SPINE_STEP === 0 || i === this.manifest.frameCount - 1;
  }

  /** Evict the cached non-spine frame farthest from the current frame. */
  private evict() {
    while (this.bitmaps.size > this.maxCached) {
      let victim = -1;
      let worst = -1;
      for (const key of this.bitmaps.keys()) {
        if (this.isSpine(key)) continue;
        const d = Math.abs(key - Math.max(this.current, 0));
        if (d > worst) {
          worst = d;
          victim = key;
        }
      }
      if (victim < 0) return;
      this.bitmaps.get(victim)?.close();
      this.bitmaps.delete(victim);
    }
  }

  private handleResize = () => {
    this.resize();
    if (this.drawnIndex >= 0) this.draw(this.drawnIndex);
  };

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
  }

  private src(i: number): string {
    return frameUrl(this.manifest.pattern, i);
  }

  private reportProgress() {
    const spineLoaded = Math.min(
      [...this.loaded].filter((i) => this.isSpine(i)).length,
      this.spineCount,
    );
    this.onProgress?.(spineLoaded, this.spineCount);
    if (!this.readyFired && spineLoaded >= this.spineCount) {
      this.readyFired = true;
      this.onReady?.();
    }
  }

  private async decodeFrame(i: number): Promise<void> {
    if (this.bitmaps.has(i) || this.loading.has(i)) return;
    this.loading.add(i);

    try {
      const res = await fetch(this.src(i));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      let bitmap = await createImageBitmap(await res.blob());
      // keep no larger than the canvas needs (cover fit, never upscale)
      const scale = Math.min(
        1,
        Math.max(this.canvas.width / bitmap.width, this.canvas.height / bitmap.height),
      );
      if (scale < 0.95) {
        const resized = await createImageBitmap(bitmap, {
          resizeWidth: Math.max(1, Math.round(bitmap.width * scale)),
          resizeHeight: Math.max(1, Math.round(bitmap.height * scale)),
          resizeQuality: 'medium',
        });
        bitmap.close();
        bitmap = resized;
      }
      this.maxCached = Math.max(
        24,
        Math.floor(CACHE_BYTES / (bitmap.width * bitmap.height * 4)),
      );
      this.bitmaps.set(i, bitmap);
      this.loaded.add(i);
      this.evict();
      this.reportProgress();

      if (this.current === -1 && i === 0) {
        this.draw(0);
      } else if (i === this.current) {
        this.draw(i);
      }
    } catch {
      /* skip failed frame */
    } finally {
      this.loading.delete(i);
    }
  }

  private decodeAhead(from: number) {
    const ahead = 6;
    for (let j = 1; j <= ahead; j++) {
      if (from + j < this.manifest.frameCount) this.scheduleDecode(from + j);
      if (j <= 2 && from - j >= 0) this.scheduleDecode(from - j);
    }
  }

  private scheduleDecode(i: number) {
    const run = () => this.decodeFrame(i);
    if ('requestIdleCallback' in window) {
      requestIdleCallback(run, { timeout: 120 });
    } else {
      setTimeout(run, 16);
    }
  }

  preload() {
    if (this.preloadStarted) return;
    this.preloadStarted = true;

    // spine only — the rest streams in on demand around the scrub position
    this.scheduleDecode(0);
    for (let i = 0; i < this.manifest.frameCount; i += SPINE_STEP) {
      this.scheduleDecode(i);
    }
    this.scheduleDecode(this.manifest.frameCount - 1);
  }

  nearestLoaded(i: number): number {
    if (this.bitmaps.has(i)) return i;
    for (let d = 1; d < this.manifest.frameCount; d++) {
      if (this.bitmaps.has(i - d)) return i - d;
      if (this.bitmaps.has(i + d)) return i + d;
    }
    return -1;
  }

  private drawBitmap(bitmap: ImageBitmap, alpha: number) {
    const cw = this.canvas.width;
    const ch = this.canvas.height;
    const s = Math.max(cw / bitmap.width, ch / bitmap.height);
    const w = bitmap.width * s;
    const h = bitmap.height * s;
    this.ctx.globalAlpha = alpha;
    this.ctx.drawImage(bitmap, (cw - w) / 2, (ch - h) / 2, w, h);
    this.ctx.globalAlpha = 1;
  }

  draw(i: number) {
    const j = this.nearestLoaded(i);
    if (j !== i) this.scheduleDecode(i);
    if (j < 0) return;

    this.drawnIndex = i;
    const bitmap = this.bitmaps.get(j);
    if (!bitmap) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBitmap(bitmap, 1);

    if (!this.painted) {
      this.painted = true;
      this.onFirstPaint?.();
    }

    this.decodeAhead(i);
  }

  setFrame(i: number) {
    const clamped = Math.max(0, Math.min(this.manifest.frameCount - 1, i));
    if (clamped !== this.current) {
      this.current = clamped;
      this.draw(clamped);
    }
  }

  /** Cross-dissolve two frames (seam transitions). mix 0 = all a, 1 = all b. */
  setBlend(a: number, b: number, mix: number) {
    if (mix <= 0) {
      this.setFrame(a);
      return;
    }
    if (mix >= 1) {
      this.setFrame(b);
      return;
    }

    const ja = this.nearestLoaded(a);
    const jb = this.nearestLoaded(b);
    if (ja < 0 && jb < 0) return;

    this.current = -1; // force redraw on next setFrame
    this.drawnIndex = a;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const bmpA = ja >= 0 ? this.bitmaps.get(ja) : undefined;
    const bmpB = jb >= 0 ? this.bitmaps.get(jb) : undefined;
    if (bmpA) this.drawBitmap(bmpA, 1);
    if (bmpB) this.drawBitmap(bmpB, bmpA ? mix : 1);

    if (!this.painted && (bmpA || bmpB)) {
      this.painted = true;
      this.onFirstPaint?.();
    }

    this.decodeAhead(a);
  }

  destroy() {
    window.removeEventListener('resize', this.handleResize);
    this.bitmaps.forEach((b) => b.close());
    this.bitmaps.clear();
  }
}
