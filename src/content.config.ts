import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

export const pillars = ['ollama', 'claude', 'ccswitch', 'python', 'vue', 'mcp', 'other'] as const;
export type Pillar = (typeof pillars)[number];

export const pillarMeta: Record<
  Pillar,
  { name: string; icon: string; desc: string; color: string }
> = {
  ollama: {
    name: 'Ollama',
    icon: '🦙',
    desc: '本地模型部署、量化、GPU 加速、API 调用踩坑合集',
    color: 'var(--c-ollama)',
  },
  claude: {
    name: 'Claude',
    icon: '✨',
    desc: 'Claude Code、API 调用、403/限流/区域限制排错',
    color: 'var(--c-claude)',
  },
  ccswitch: {
    name: 'CCSwitch',
    icon: '🔀',
    desc: 'CCSwitch 配置、接入、鉴权与计费问题',
    color: 'var(--c-ccswitch)',
  },
  python: {
    name: 'Python 环境',
    icon: '🐍',
    desc: '安装、虚拟环境、pip、依赖冲突与版本管理',
    color: 'var(--c-python)',
  },
  vue: {
    name: 'Vue 低代码',
    icon: '💚',
    desc: 'Vue3 + Vite 工程、组件封装、前后端联调排错',
    color: 'var(--c-vue)',
  },
  mcp: {
    name: 'MCP 配置',
    icon: '🔌',
    desc: 'MCP 协议、Server 搭建、Claude/本地模型接入',
    color: 'var(--c-mcp)',
  },
  other: {
    name: '其他工具',
    icon: '🛠️',
    desc: 'FFmpeg、开发平台、各类环境工具的零散踩坑',
    color: 'var(--c-other)',
  },
};

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    pillar: z.enum(pillars),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    readingMinutes: z.number().int().min(1).default(5),
  }),
});

export const collections = { posts };
