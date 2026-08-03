---
title: "Claude Code 接入 DeepSeek：ConnectionRefused 与端点失效全记录"
description: "Claude Code 报 Unable to connect to API，直连 Anthropic 不通，改用 DeepSeek 兼容端点后又遇到端点失效。从直连失败到切换 /v1 的完整排错。"
pubDate: 2026-08-03
pillar: claude
tags: [ClaudeCode, DeepSeek, ConnectionRefused, 端点]
readingMinutes: 6
---

Claude Code 在 Windows 上接入国内模型的完整踩坑记录。核心就两件事：**官方端点连不上** 和 **兼容端点会失效**。

## 报错一：Unable to connect to API（官方端点不通）

**报错现象**：

```text
Unable to connect to API (ConnectionRefused)
```

**原因分析**：Claude Code 默认访问 `api.anthropic.com`，但在中国大陆该域名无法直接访问，连接被拒绝。

**解决步骤**：改用国内模型的 Anthropic 兼容端点。以 DeepSeek 为例：

```powershell
[Environment]::SetEnvironmentVariable("ANTHROPIC_AUTH_TOKEN", "sk-xxx", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_BASE_URL", "https://api.deepseek.com/anthropic", "User")
[Environment]::SetEnvironmentVariable("ANTHROPIC_MODEL", "deepseek-chat", "User")
```

## 报错二：换端点后仍 ConnectionRefused（端点失效）

**报错现象**：配置 `/anthropic` 端点后，再次报：

```text
Unable to connect to API (ConnectionRefused)
```

**原因分析**：DeepSeek 的 Anthropic 兼容端点 `https://api.deepseek.com/anthropic` 返回 `Authentication Fails (governor)`——**这个地址可能已变更或不再支持当前认证方式**。但它的 OpenAI 兼容端点 `https://api.deepseek.com/v1` 仍正常工作（返回 200）。

**解决步骤**：把 `ANTHROPIC_BASE_URL` 从 `/anthropic` 改到 `/v1`，更新模型名。

配置文件 `~/.claude/settings.json`：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "sk-xxx",
    "ANTHROPIC_BASE_URL": "https://api.deepseek.com/v1",
    "ANTHROPIC_MODEL": "deepseek-chat"
  }
}
```

## 排查顺序

遇到连接错误**不要急于重装**，先 `claude doctor` 诊断，再按 **网络 → 配置 → 缓存** 的顺序查。

## 排错速查表

| 现象 | 处理 |
|------|------|
| 官方端点 ConnectionRefused | 换国内兼容端点 |
| 兼容端点失效 | 切到 OpenAI 兼容 `/v1` |
| 改了仍异常 | 清缓存 + `claude doctor` |
| 不敢确定端点通不通 | 用 `Invoke-WebRequest` 测连通性 |

> 核心经验：**第三方 API 兼容端点可能随时变更**。之前能用的地址突然失效很正常，用请求工具测连通，切到仍工作的接口。