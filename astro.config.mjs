import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 上线后把 site 换成你的真实域名，例如 https://aiguide.example.com
export default defineConfig({
  site: 'https://vvc3303.github.io',
  base: '/ai-fix-guide/',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
