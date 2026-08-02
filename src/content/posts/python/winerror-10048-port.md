---
title: "WinError 10048 端口占用：Python 服务起不来的标准解法"
description: "Python 后端启动报 WinError 10048，说明端口已被其他进程占用。用两条命令找出占用进程，或直接换端口启动。"
pubDate: 2026-08-02
pillar: python
tags: [Python, WinError, 端口, 后端]
readingMinutes: 3
---

启动 Python 后端服务，啪一下弹出来：

```text
OSError: [WinError 10048] ... only one usage of each socket address
```

这不是代码问题，是**端口被别人占了**。

## 报错现象

```text
socket.error: [Errno 10048] 通常每个套接字地址(协议/网络地址/端口)只允许使用一次
```

服务起不来，换个端口可能就正常。

## 原因分析

上次运行的服务进程没退干净（比如被强制关闭、`ctrl+c` 没杀死子进程），端口一直被占着，新服务抢不到。

## 解决步骤

### 方案一：杀掉占用进程

```powershell
# 找到占用 5000 端口的 PID
netstat -ano | findstr :5000

# 得到类似   TCP 0.0.0.0:5000  0.0.0.0:0  LISTENING  12345
# 最后那个 12345 就是 PID，结束它
taskkill /PID 12345 /F
```

### 方案二：更换空闲端口

如果那个进程不能杀（比如是别的服务在跑），改项目配置换端口：

```text
# 例如 Flask / FastAPI / uvicorn
uvicorn app:app --port 5001
```

## 效果验证

- 服务正常启动，控制台打印监听地址
- 浏览器访问 `http://localhost:端口` 能通

## 排错速查表

| 现象 | 处理 |
|------|------|
| 10048 端口占用 | netstat 找 PID → taskkill |
| 端口是别的服务 | 换空闲端口启动 |
| 重启后仍占用 | 检查是否有残留 Python 进程 |

> 核心经验：**10048 先查端口再查代码**。`netstat -ano | findstr :端口` 是 Windows 下最快的一行诊断。
