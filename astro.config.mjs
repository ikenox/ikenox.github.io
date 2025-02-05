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
  redirects: {
    '/blog/validation-in-clean-arch': '/blog/validation-in-clean-architecture',
    '/blog/inheritance-and-delegation-and-interface': '/blog/inheritance-delegation-interface',
    '/blog/database-is-like-global-variable': '/blog/repository-pattern',
    '/blog/ideavim-introduction': '/blog/ideavim-getting-started',
  },
});
