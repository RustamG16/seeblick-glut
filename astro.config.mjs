import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://seeblick-glut.at',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      cssMinify: true,
    },
  },
});
