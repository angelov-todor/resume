import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://angelov-todor.github.io',
  base: '/resume',
  build: {
    assets: 'assets',
  },
  trailingSlash: 'ignore',
});
