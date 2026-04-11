// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://paintprocalculator.com',
  trailingSlash: 'never',
  build: {
    format: 'file',
  },
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        const path = new URL(item.url).pathname;
        if (path === '/' || path === '') {
          item.priority = 1.0;
          item.changefreq = 'daily';
        } else if (path.startsWith('/paint-calculator')) {
          item.priority = 0.8;
          item.changefreq = 'monthly';
        } else if (path === '/blog') {
          item.priority = 0.8;
          item.changefreq = 'weekly';
        } else if (path.startsWith('/blog/')) {
          item.priority = 0.7;
          item.changefreq = 'monthly';
        }
        return item;
      },
    })
  ],
  vite: {
    plugins: [tailwindcss()]
  }
});
