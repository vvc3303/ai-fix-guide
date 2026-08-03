---
title: "CC Switch 启动即退出：本地代理 127.0.0.1:4000 连不上"
description: "Codex / ChatGPT 请求超时，查下来是 CC Switch 的本地代理 127.0.0.1:4000 没跑起来。进程启动即退出、crash.log 有崩溃记录，三步排查。"
pubDate: 2026-08-03
pillar: ccswitch
tags: [CCSwitch, Codex, 代理, 端口]
readingMinutes: 4
---

用 Codex 或 ChatGPT 客户端时，请求一路超时，最后定位到根因不是 OpenAI 的问题，而是 **CC Switch 的本地代理根本没跑起来**。

## 报错现象

- ChatGPT base URL `https://chatgpt.com/backend-api/` 请求 **timed out**
- 本地代理 `127.0.0.1:4000` **连接被拒绝**
- CC Switch 进程看起来启动了，但马上又退出，系统托盘没有图标

## 原因分析

配置里把请求指向本地代理 `http://127.0.0.1:4000`，由 CC Switch 转发到 ChatGPT/Claude 后端。但 **CC Switch 进程启动后立即退出**，代理端口没人监听，所有依赖它的请求全部超时。

历史崩溃记录：`crash.log` 里可以看到类似

```text
cannot move state from Destroyed
```

说明进程之前就崩溃过，可能被系统杀软或状态残留导致起不来。

## 解决步骤

1. **从开始菜单手动启动 CC Switch**（不要用命令行里残留的进程）
2. 启动后**检查系统托盘**是否有 CC Switch 图标——只有托盘有图标才是真正跑起来了
3. **验证代理端口**：

```powershell
Test-NetConnection 127.0.0.1 -Port 4000 | Select TcpTestSucceeded
# 或
netstat -ano | findstr :4000
```

4. 如果**持续无法运行**：
   - 重新安装 CC Switch
   - 检查杀毒软件是否拦截了它的进程

## 效果验证

- `127.0.0.1:4000` 端口可连通
- Codex / ChatGPT 请求不再超时
- 系统托盘常驻 CC Switch 图标

## 排错速查表

| 现象 | 处理 |
|------|------|
| 4000 端口拒绝连接 | 手动启动 CC Switch 并检查托盘 |
| 启动即退出 | 重装或排查杀软拦截 |
| 请求超时 | 确认代理端口已监听 |
| 崩溃历史 | 查看 crash.log 里的原因 |

> 核心经验：**所有指向本地代理的工具，先确认代理进程真的活着**。进程图标和端口监听才是唯一标准，别只看"进程似乎启动了"。
