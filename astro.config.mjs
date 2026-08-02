import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// 上线后把 site 换成你的真实域名，例如 https://aiguide.example.com
export default defineConfig({
  site: 'https://ai-fix-guide.example.com',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
