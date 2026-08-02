# AI 排错指南

AI 本地部署排错指南站，主打 **Ollama、Claude、CCSwitch、Python 环境、Vue 低代码、MCP 配置** 等实战踩坑教程。

所有内容基于真实踩坑整理，每篇文章按「报错原文 → 原因分析 → 分步解决 → 效果验证」展开，帮你快速定位并解决本地部署时遇到的各种报错。

## 技术栈

- [Astro](https://astro.build) 静态站点生成器
- Shiki 代码高亮
- 自动生成 sitemap
- 响应式布局，移动端友好

## 本地运行

```bash
npm install
npm run dev
```

浏览器访问 http://localhost:4321

## 栏目

| 栏目 | 覆盖范围 |
|------|---------|
| Ollama | 本地模型部署、量化、GPU、API 调用 |
| Claude | Claude Code、API 调用、403/限流/区域限制 |
| CCSwitch | 协议配置、多模型调度、鉴权计费 |
| Python 环境 | 安装、pip、虚拟环境、依赖冲突 |
| Vue 低代码 | 工程搭建、组件、前后端联调、报表 |
| MCP 配置 | 协议、Server 搭建、多客户端接入 |
| 其他工具 | FFmpeg、开发平台等零散踩坑 |
