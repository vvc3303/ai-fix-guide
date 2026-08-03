---
title: "Codex CLI 排错：auth 凭据、npm 路径冲突、临时目录堆积"
description: "Codex 本地装好后遇到认证凭据读不出来、npm install -g 提示会更新另一个安装、临时目录堆积清理失败三个问题，逐一排查。"
pubDate: 2026-08-03
pillar: codex
tags: [Codex, npm, 排错]
readingMinutes: 5
---

Codex 命令行工具用起来挺顺，但安装/启动阶段容易遇到几个"隐藏"问题。下面是三个真实遇到过的坑及解法。

## 问题一：认证凭据损坏

**报错现象**：

```text
stored credentials could not be read — expected value at line 1 column 1
```

**原因分析**：`~/.codex/auth.json` 文件格式可能损坏。不过实际检查后发现**文件存在且内容正常**——这类报错可能是历史残留或旧版本导致。

**解决步骤**：

1. 检查凭据文件是否正常：

```powershell
Get-Content "$env:USERPROFILE\.codex\auth.json"
```

2. 内容正常就**保留现有 auth.json**，重新安装 Codex 后会自动沿用，不需要删。

## 问题二：npm 安装路径冲突

**报错现象**：

```text
npm install -g @openai/codex would update a different install
```

**原因分析**：编辑器（如 TRAE）内置的 npm **全局路径**和系统 npm 的全局路径不一致，同一个包被当成"两个安装"。

**解决步骤**：

1. 查一下两条 npm 的全局路径是否一致：

```powershell
npm prefix -g
where npm
```

2. 用**系统 npm**（不是编辑器内置的）重新安装 Codex，让其统一到同一个全局目录：

```powershell
npm install -g @openai/codex
```

3. 验证版本：

```powershell
codex --version
```

> 当前实测 Codex 重装后运行正常，说明问题三的"重新安装"路径有效。

## 问题三：临时文件堆积

**报错现象**：

```text
failed to clean up stale arg0 temp dirs: 目录不是空的
```

**原因分析**：`~/.codex/tmp/arg0/` 下堆积了 **80+ 个陈旧临时目录**，清理进程失败，不影响使用但越来越脏。

**解决步骤**（可选）：手动清理：

```powershell
Remove-Item "$env:USERPROFILE\.codex\tmp\arg0\*" -Recurse -Force
```

清理后下次启动不再报清理失败。

## 排错速查表

| 现象 | 处理 |
|------|------|
| 认证凭据读不出来 | 检查 auth.json，内容正常就保留 |
| 提示会更新另一个安装 | 用系统 npm 统一重装 |
| 临时目录清理失败 | 手动清空 arg0 目录 |

> 核心经验：**Codex 这类 CLI 的坑多在"环境不一致"**——npm 路径、凭据文件、临时目录。先把环境对齐，再考虑是不是 Codex 本身的问题。
