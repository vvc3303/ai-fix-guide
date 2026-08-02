---
title: "MCP 在 VSCode 配好，ClaudeCode/Codex/OpenCode 却用不了"
description: "VSCode 里配置好的 MCP 工具，其他 AI 客户端没法复用。手动把 MCP 配置 JSON 复制到对应客户端配置目录，并补上 Node.js 运行依赖。"
pubDate: 2026-08-02
pillar: mcp
tags: [MCP, VSCode, ClaudeCode, OpenCode, 同步]
readingMinutes: 4
---

VSCode 里辛苦配好的 MCP 工具，到 ClaudeCode、Codex、OpenCode 里却一个都调不到。原因是：**配置是 VSCode 私有的，不会自动同步**。

## 报错现象

- VSCode 内 MCP 工具正常
- ClaudeCode / Codex / OpenCode 里找不到这些工具
- 反复重装、重启都没用

## 原因分析

不同 AI 客户端读的是**各自的配置文件**，互不相通：

| 客户端 | MCP 配置位置 |
|--------|-------------|
| VSCode | VSCode 的 settings / MCP 面板 |
| ClaudeCode | `~/.claude.json` 或项目 `.mcp.json` |
| OpenCode | 各自客户端的配置目录 |

另外，MCP server 大多是 Node.js 写的，客户端调用时还需要 **Node.js 运行环境依赖**，缺了也会失败。

## 解决步骤

1. **手动复制 MCP 配置 JSON**：把 VSCode 里那一份 MCP 配置，粘贴到目标客户端的配置目录对应文件里。
2. **逐个客户端确认格式**：ClaudeCode 用它的 `.mcp.json` / 配置，OpenCode 用它的配置目录，格式略有不同，别直接照搬。
3. **补齐 Node.js 运行环境依赖**：

```powershell
node -v     # 确认已装 Node
npm install -g @modelcontextprotocol/server-xxx   # 缺哪个装哪个
```

4. 重启目标客户端，验证工具是否出现在列表。

## 效果验证

- ClaudeCode / Codex / OpenCode 都能看到并调用 MCP 工具
- 报错信息里不再有「找不到模块 / 连接失败」

## 排错速查表

| 现象 | 处理 |
|------|------|
| 工具不出现 | 复制 JSON 到对应客户端配置目录 |
| 出现但调用失败 | 补 Node.js 依赖 |
| 照搬格式报错 | 按客户端各自格式改 |

> 核心经验：**MCP 配置是「各客户端私有」的，不会自动同步**。换客户端 = 手动搬配置 + 确认运行依赖。
