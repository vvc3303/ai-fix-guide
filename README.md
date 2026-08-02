# AI 排错指南（ai-fix-guide）

AI 本地部署排错指南站，基于 **Astro** 的静态博客。主打 Ollama、Claude、CCSwitch、Python 环境、Vue 低代码、MCP 配置六大专栏的实战踩坑教程。

## 本地运行

```bash
npm install
npm run dev        # 开发预览，默认 http://localhost:4321
npm run build      # 构建到 dist/
npm run preview    # 本地预览构建产物
```

## 目录结构

```
ai-fix-guide/
├── src/
│   ├── content.config.ts     # 六大栏目定义 + 内容 schema
│   ├── content/posts/        # 文章都在这里（markdown）
│   │   ├── ollama/           #   每个栏目一个子目录
│   │   ├── claude/
│   │   ├── ccswitch/
│   │   ├── python/
│   │   ├── vue/
│   │   ├── mcp/
│   │   └── other/            # FFmpeg、开发平台等零散工具
│   ├── layouts/              # 页面布局
│   ├── components/           # Header / Footer / 文章卡片
│   ├── pages/                # 路由（首页 / 栏目页 / 文章页）
│   └── styles/global.css     # 全站样式
├── astro.config.mjs          # 站点配置
└── public/                   # 静态资源
```

## 怎么写新文章

在 `src/content/posts/` 对应栏目目录下新建 `.md` 文件，frontmatter 格式：

```markdown
---
title: "文章标题"
description: "SEO 描述，一句话说明解决什么问题"
pubDate: 2026-08-02
updatedDate: 2026-08-02        # 可选
pillar: ollama                 # 七选一：ollama / claude / ccswitch / python / vue / mcp / other
tags: [Ollama, 排错]
readingMinutes: 5              # 可选，默认 5
draft: true                    # 可选，true 则不发布
---
```

保存后 `npm run dev` 会自动生效，文章出现在对应栏目页和首页「最新排错文章」。

> 写文铁律：`报错原文 → 原因分析 → 分步解决 → 效果验证`，代码块用 ` ```powershell ` / ` ```python ` 等语言标注，会自动高亮。

## 免费部署

构建产物是纯静态文件，可直接托管到免费平台：

- **Cloudflare Pages**：登录 dashboard → Workers & Pages → Create → 连接 Git 仓库，构建命令 `npm run build`，输出目录 `dist`。
- **Vercel**：Import 仓库 → Framework Preset 选 Astro → 自动识别，直接 Deploy。
- **GitHub Pages**：把 `dist/` 推到 `gh-pages` 分支即可。

**上线前必改**：

1. `astro.config.mjs` 里的 `site` 改成你的真实域名（影响 sitemap）
2. `public/favicon.svg` 可换成你自己的 logo
3. `src/components/Footer.astro` 里的站点说明

## SEO 已内置

- 自动 sitemap：`/sitemap-index.xml`
- 每篇文章有独立的 title / description / 面包屑
- 文章页自动生成目录（TOC）+ 代码高亮（Shiki）
- 移动端适配 + 语义化 HTML 结构
