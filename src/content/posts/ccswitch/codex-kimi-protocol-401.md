---
title: "Codex CLI 连 Kimi 报 401：Chat Completions 和 Responses 协议不兼容"
description: "Codex 用 CC Switch 连 Kimi 返回 401 Unauthorized。根因是 Codex 走 Responses API、Kimi 只支持 Chat Completions，协议不兼容导致代理转换失败。"
pubDate: 2026-08-03
pillar: ccswitch
tags: [Codex, Kimi, "401", 协议]
readingMinutes: 4
---

用 Codex CLI 通过 CC Switch 连国内模型，Kimi 是最容易踩 401 的一个。问题不在密钥，而在于**协议用错了**。

## 报错现象

```text
unexpected status 401 Unauthorized: CC Switch local proxy failed
while handling Codex endpoint /responses.
Provider: Kimi; model: kimi-k2.6;
upstream_status: HTTP 401; cause: Invalid Authentication
```

## 原因分析

- **Codex CLI** 使用 OpenAI 的 **Responses API** 协议（`/responses`）
- **Kimi** 只支持标准的 **Chat Completions API** 协议（`/v1/chat/completions`）
- 两者协议不兼容，CC Switch 代理在转换 `/responses` 时失败，向上返回 401

所以不是你 Key 填错，是 Kimi 根本不提供 Codex 需要的协议。

## 解决步骤

**改用官方适配了 Responses API 的模型**——阿里云百炼 Qwen：

1. 在 CC Switch 或 Codex 配置里，把模型从 Kimi 换成百炼 Qwen
2. 确认该模型的 `wire_api` 是 `responses`
3. 用 Codex 的官方接入流程配置百炼（见同站《Codex CLI 接入阿里云百炼 Qwen》篇）

## 效果验证

- 不再返回 401
- Codex 能正常对话、调用工具

## 排错速查表

| 现象 | 判断 |
|------|------|
| 401 + endpoint `/responses` | 模型不支持 Responses 协议 |
| 模型只支持 Chat Completions | 换适配 Responses 的模型（百炼 Qwen） |
| base_url 或 config 报错 | 切到协议匹配的接口地址 |

> 核心经验：**Codex 挑模型，不只挑名字，还挑协议**。不是所有国内模型都实现了 Responses API，选官方明确适配的才不折腾。