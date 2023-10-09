import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';

import prefetch from '@astrojs/prefetch';

// https://astro.build/config
export default defineConfig({
  site: 'https://ikenox.info',
  integrations: [
    mdx(),
    sitemap(),
    prefetch({
      selector: "a[href^='/']",
      throttle: 10,
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'slack-dark',
    },
  },
  output: 'hybrid',
  adapter: cloudflare(),
});
