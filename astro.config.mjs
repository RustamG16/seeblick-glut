import { defineConfig } from 'astro/config';

// Published on GitHub Pages under /seeblick-glut. Override with SITE / BASE for a custom domain.
export default defineConfig({
  output: 'static',
  site: process.env.SITE ?? 'https://rustamg16.github.io',
  base: process.env.BASE ?? '/seeblick-glut',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
