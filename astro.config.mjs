import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cloudflare Pages 域名（部署后确认为实际链接再核对）
export default defineConfig({
  site: 'https://ai-fix-guide.pages.dev',
  integrations: [sitemap()],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
