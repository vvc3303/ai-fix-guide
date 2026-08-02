---
title: "ClaudeCode、Codex 调不了，GPT 却正常？CCSwitch 协议适配差异"
description: "同一个 CCSwitch 里 GPT 模型正常，ClaudeCode/Codex 却调不了。原因是 Codex 原生适配 OpenAI 协议、Claude 需单独适配中转协议。"
pubDate: 2026-08-02
pillar: ccswitch
tags: [CCSwitch, ClaudeCode, Codex, 协议适配]
readingMinutes: 4
---

在 CCSwitch / 多模型调度里，最诡异的现象就是：**GPT 模型一切正常，ClaudeCode、Codex 却怎么都调不起来**。

## 报错现象

- GPT 系列模型调用正常
- ClaudeCode、Codex 模型调用失败 / 返回错误
- 报错信息集中在「协议不匹配」「无法连接」这类

## 原因分析

这俩模型对协议的要求不一样：

| 模型 | 协议适配 | 说明 |
|------|---------|------|
| **Codex** | 原生适配 OpenAI 协议 | 可以直接按 OpenAI 兼容方式调用 |
| **Claude 系列** | 需单独适配中转协议 | 原生 Anthropic 协议**国内无法直连**，必须经中转转换 |

所以不是模型没配，而是 **Claude 系列没走对协议通道**。

## 解决步骤

**把 Claude 系列模型封装为 OpenAI 兼容中转接口后再填入配置**：

1. 在中转服务商处确认「Claude 系列」的**模型 id 和调用端点**（通常和 OpenAI 兼容端点不同）
2. 把 Claude 模型挂到 **OpenAI 兼容接口**下（中转服务商一般提供这类转换）
3. 配置里填入转换后的地址 + Claude 模型 id，不要直接填 Anthropic 原生地址

```text
# 错误：直接在 ClaudeCode 里填 Anthropic 原生协议
# 正确：在中转服务商封装成 OpenAI 兼容接口后，再填到 CCSwitch
Base URL: https://中转地址/v1
Model:    claude-...（中转商给的 id）
```

## 效果验证

- ClaudeCode 能正常调用
- Codex 仍按 OpenAI 协议正常工作
- 三套模型（GPT / Claude / Codex）在 CCSwitch 里并存可切

## 排错速查表

| 现象 | 处理 |
|------|------|
| 只有 Claude 系列失败 | 走 OpenAI 兼容中转封装 |
| Codex 失败 | 确认走的是 OpenAI 协议 |
| 都不行 | 回到「协议混用」那篇检查 |

> 核心经验：**「GPT 能用、Claude 不能用」不是模型问题，是协议问题**。Claude 系列在国内的标配姿势是「封装成 OpenAI 兼容再接入」。
