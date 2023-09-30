import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://ikenox.info',
  integrations: [mdx(), sitemap()],
  markdown: {
    shikiConfig: { theme: 'slack-dark' },
  },
});
