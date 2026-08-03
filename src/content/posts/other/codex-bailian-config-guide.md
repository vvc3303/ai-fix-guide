---
title: "Codex CLI 接入阿里云百炼 Qwen：安装包名、config、base_url、缓存 4 个坑"
description: "想让 Codex 用上阿里云百炼 Qwen，npm 包名写错、config.toml 缺 provider 区块、base_url 404、缓存残留不生效，四个坑一次讲清全部解法。"
pubDate: 2026-08-03
pillar: other
tags: [Codex, 百炼, 阿里云, config.toml]
readingMinutes: 8
---

把 Codex CLI 接入阿里云百炼 Qwen，我从装包到跑通一共踩了 4 个坑，全是"配置细节"，逐一拆解。

## 坑一：npm 包名写错，404

**报错现象**：

```text
npm error 404 Not Found - GET https://registry.npmjs.org/@anthropic-ai%2fcodex-cli - Not found
```

**根因**：用了错误的包名 `@anthropic-ai/codex-cli`。**Codex CLI 是 OpenAI 的产品，不是 Anthropic 的**。

**解决**：

```powershell
npm install -g @openai/codex
codex --version
```

## 坑二：配置后仍显示 Kimi（config.toml 缺区块）

**报错现象**：Codex 启动显示 `model: kimi-k2.6`，而不是配置的 Qwen。

**根因**：config.toml 里只写了 `model_provider = "bailian"`，但**缺少完整的 `[model_providers.bailian]` 区块**，Codex 识别不了这个 provider。

**解决**：补全配置块。`~/.codex/config.toml`：

```toml
model = "qwen3.7-max"
model_provider = "bailian"
wire_api = "responses"

[model_providers.bailian]
name = "bailian"
base_url = "https://dashscope.aliyuncs.com/compatible-mode/v1"
env_key = "BAILIAN_API_KEY"
wire_api = "responses"
```

同时设置好环境变量 `BAILIAN_API_KEY`。

## 坑三：reachability 404（base_url 错了）

**报错现象**：

```text
✗ reachability provider base URL route returned 404 - verify the configured API prefix
```

**根因**：base_url 写了不存在的路径 `https://dashscope.aliyuncs.com/apps/anthropic`。

**解决**：更正为百炼的 OpenAI 兼容接口：

```text
https://dashscope.aliyuncs.com/compatible-mode/v1
```

## 坑四：配置清了它还是显示 Kimi（缓存残留）

**报错现象**：config.toml 已改对，`codex doctor` 也通过，启动后**仍显示 kimi**。

**根因**：三个隐藏缓存源在干扰旧配置：

- `auth.json`：保存了旧的 `OPENAI_API_KEY`
- `cc-switch-model-catalog.json`：缓存了 CC Switch 的模型列表
- `state_*.sqlite`：保存了 kimi 的历史会话记录

**解决**：彻底清除缓存：

```powershell
Remove-Item "$env:USERPROFILE\.codex\auth.json" -Force
Remove-Item "$env:USERPROFILE\.codex\cc-switch-model-catalog.json" -Force
Remove-Item "$env:USERPROFILE\.codex\.codex-global-state.json" -Force
Remove-Item "$env:USERPROFILE\.codex\state_*.sqlite" -Force
Remove-Item "$env:USERPROFILE\.codex\sessions" -Recurse -Force
```

清完重启 Codex，新配置才真正生效。

## 有效配置参考

**Claude Code（DeepSeek）**打法不在范围内，这里专注 Codex + 百炼：

| 配置项 | 值 |
|--------|-----|
| model | `qwen3.7-max` |
| model_provider | `bailian` |
| base_url | `https://dashscope.aliyuncs.com/compatible-mode/v1` |
| wire_api | `responses` |
| env_key | `BAILIAN_API_KEY` |
| 配置文件 | `~/.codex/config.toml` |

## 排错速查表

| 现象 | 处理 |
|------|------|
| npm 404 | 用 `@openai/codex` |
| 显示旧模型 | 补 `[model_providers.xxx]` 区块 |
| reachability 404 | 用 compatible-mode/v1 地址 |
| 改完仍旧配置 | 清 auth/cache/sqlite 缓存 |

> 核心经验：**Codex 配置失效，八成是"provider 区块没写全"或"隐藏缓存没清"**。先 `codex doctor`，再检查 config.toml 是否完整，最后清缓存。