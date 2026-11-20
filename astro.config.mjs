import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://metehanbeyaz.com',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
});
