---
title: "国内直连 Claude 官方接口 403：网络直达 + 中转权限两个坑"
description: "直连 Anthropic 原生接口国内网络 403 无法访问，改用中转后 ClaudeCode 又报 403 服务商未开通模型权限。两个 403 两种解法。"
pubDate: 2026-08-02
pillar: claude
tags: [Claude, Anthropic, "403", 中转]
readingMinutes: 4
---

直连 Claude 官方接口报 403，是「网络 + 权限」叠加造成的。别急着怀疑密钥，先分清 403 是哪种。

## 报错现象（两种 403）

**场景一：直连官方**

直接调用 Anthropic 原生接口（`https://api.anthropic.com/v1/messages`），返回：

```text
403 Forbidden
```

**场景二：走中转**

改用中转服务后调用 ClaudeCode，依然 403：

```text
403: model not enabled / forbidden
```

## 原因分析

| 场景 | 根因 |
|------|------|
| 直连官方 403 | 国内网络无法直达 Anthropic，请求被墙/拦截 |
| 中转 ClaudeCode 403 | 中转服务商**未开通该模型的权限**，Key 可用但模型不可用 |

两种情况都是「不是密钥错，是路不通或没权限」。

## 解决步骤

### 场景一：直连 403

1. 切换为 **OpenAI 兼容协议的中转接口**配置（而不是直连 Anthropic 原生接口）
2. 改用**本地 Ollama 兜底**：把不重要的请求走 `http://localhost:11434`

### 场景二：中转 ClaudeCode 403

1. 先到中转服务商后台确认**是否开通了 Claude 系列模型权限**
2. 开通后如果仍 403，确认填的是 Claude 的模型名（不是 GPT 的）

## 效果验证

- 请求不再返回 403
- ClaudeCode 能正常对话、调用工具
- 断网/官方不可用时有 Ollama 本地兜底

## 排错速查表

| 现象 | 处理 |
|------|------|
| 直连官方 403 | 换 OpenAI 兼容中转接口 |
| 中转仍 403 | 检查服务商是否开通该模型 |
| 中转慢/不稳 | 本地 Ollama 兜底 |

> 核心经验：**国内用 Claude，第一反应别是换密钥，而是换「协议 + 通道」**。中转地址、密钥、模型名三者要配套。
