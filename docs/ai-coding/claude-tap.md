---
title: 别再盲盒式用 AI 编程助手了：claude-tap 把每次 LLM 调用都摊在阳光下
date: 2026-07-31
---

# 别再盲盒式用 AI 编程助手了：claude-tap 把每次 LLM 调用都摊在阳光下

> 来源：HelloGitHub 第 122 期推荐  
> 项目地址：https://github.com/liaohch3/claude-tap  
> 在线体验/文档：https://liaohch3.com/claude-tap/  
> GitHub Stars：**2.9k**｜Forks：**252**

---

## 一、一个让人抓狂的日常

用 Claude Code、Cursor CLI 或 Codex 写代码，体验确实爽：一句话改完一个功能，自动跑测试、自动读报错、自动调工具。但爽着爽着，总会出现几个“灵魂时刻”：

- 账单里 Token 消耗莫名其妙，根本不知道哪一步烧掉了大头；
- AI 突然开始循环调用同一个工具，像钻牛角尖一样出不来；
- 换了个模型或升级了客户端后，输出风格变了，想对比到底哪条 system prompt 或工具描述被改了；
- 团队协作时，同事说“它刚才不是这样的”，你却拿不出任何 trace 证据。

这些问题的本质都一样：**AI 编程助手对大多数人来说是个黑盒**。你看得见输入和最终输出，但中间每一轮对话、每一次工具调用、每一段上下文窗口的变化，都被封在客户端和 API 之间。

直到我在 HelloGitHub 第 122 期看到 **claude-tap**——一个专门给 AI 编程助手“开膛破肚”的本地流量分析工具。

---

## 二、claude-tap 是什么？

一句话概括：**claude-tap 是 AI 编程 Agent 的本地代理 + Trace 查看器。**

它站在你的客户端（Claude Code、Codex CLI、Cursor CLI、Kimi、Hermes Agent 等）和远端 API 之间，把所有 HTTP / SSE / WebSocket 流量截下来，整理成一个可以逐条查看、对比、导出的 trace。你能看到：

- 每一次请求的 **system prompt、user message、assistant message**；
- 完整的 **tool schema、tool 调用、tool 返回结果**；
- 流式响应的 **逐段内容与最终拼接结果**；
- **input / output / cache read / cache creation** 等 token 明细；
- 相邻两次请求之间的**结构化 diff**。

并且所有数据都保存在本地，**无需上传到任何第三方 dashboard**。

![claude-tap demo](https://github.com/liaohch3/claude-tap/raw/main/docs/demo.gif)

---

## 三、支持的客户端：几乎覆盖了主流 AI 编程工具

| 客户端 | 典型场景 |
|---|---|
| Claude Code | Anthropic API、AWS Bedrock、Vertex、DeepSeek/GLM 等兼容网关 |
| Codex CLI / Codex App | OpenAI API Key 或 ChatGPT 订阅 OAuth |
| Gemini CLI | Google OAuth / Code Assist 流量 |
| Cursor CLI | Cursor Agent 会话 + 本地 transcript 导入 |
| Kimi CLI / Kimi Code CLI | Moonshot API |
| OpenCode / MiMo Code / OpenClaw | 多 provider 终端助手 |
| Pi | 多 provider coding agent |
| Hermes Agent | Nous Portal、OpenRouter、Kimi、GLM、OpenAI 等多 provider |
| Grok Build CLI、Qoder CLI、Antigravity CLI、CodeBuddy CLI | 也都能抓 |

也就是说，不管你用哪一家的 Agent，基本都能用同一套工作流来 debug。

---

## 四、三个让我立刻想装上它的场景

### 1. 定位“Token 刺客”

Agent 一轮对话动辄几万 token，但钱到底花在哪？claude-tap 的查看器会按请求列出 input / output / cache read / cache creation，配合相邻请求的 diff，一眼就能定位是哪条消息或哪次 tool 调用把上下文撑爆了。

### 2. 抓住“无限循环”的元凶

AI 工具调用卡死循环，多半是 tool 描述写得太模糊，或者某次 tool 返回的结果被模型误读。claude-tap 能把每一轮 tool 调用和返回结构化展开，甚至能对比两轮请求之间的 message 变化，帮你快速锁定循环起点。

### 3. 对比不同模型/版本的 prompt 变化

客户端升级后行为变了？把升级前后的 trace 导出成紧凑的 HTML 文件，用结构化 diff 直接看 system prompt、tool schema、参数有没有被改动。这对需要稳定 reproducibility 的团队来说非常关键。

---

## 五、安装与上手：比想象的简单

要求 Python 3.11+。

```bash
# 推荐用 uv
uv tool install claude-tap

# 或者 pip
pip install claude-tap
```

然后直接用 `claude-tap` 代替原来的客户端命令：

```bash
# Claude Code（默认启用实时查看器）
claude-tap --

# Codex CLI
claude-tap --tap-client codex --

# Gemini CLI（默认 forward proxy 模式）
claude-tap --tap-client gemini -- "hello"

# Kimi Code CLI
claude-tap --tap-client kimi-code --
```

`--` 后面的参数会原样传给对应客户端。运行后浏览器会自动打开本地查看器，边跑边抓。

如果只想抓包不想开浏览器：

```bash
claude-tap --tap-no-live --
```

事后查看已保存的 trace：

```bash
claude-tap browse
```

---

## 六、数据安全与隐私：本地优先

对很多企业用户来说，最大的顾虑是“我的代码和 prompt 会不会被发到第三方”。claude-tap 的设计原则很直接：

- 所有 trace 默认写在本地 `./.traces`（可自定义目录）；
- 常见认证头会自动 redact；
- 查看器是一个**零外部依赖的自包含 HTML 文件**，可以离线打开，也可以导出给同事复现。

当然，抓包工具本身有权限看到你的明文流量，所以不要在多人共享机器上长期运行，也不要把 trace 文件随手传到公开仓库。

---

## 七、一些需要注意的坑

1. **proxy 模式不同**：Claude Code / Codex 默认用 reverse proxy（改客户端 base_url），Gemini / Cursor / OpenCode / Hermes 等默认用 forward proxy（注入 HTTPS_PROXY）。如果 corporate 环境有严格代理策略，需要看 support matrix 调整。
2. **macOS 需要信任本地 CA**：forward proxy 客户端（如 Gemini、Cursor）在 macOS 上会自动把本地 CA 加入 login keychain，第一次可能弹出钥匙串授权。
3. **OAuth 会话隔离**：抓 Codex App 时会启动一个独立的 user-data-dir，避免污染你正常使用的窗口，但需要重新登录一次。
4. **AWS Bedrock SigV4 不 rewrite**：原生 AWS 域名不会被 reverse proxy，需要显式使用 forward proxy 模式。

---

## 八、总结：AI Agent 时代必备的基础设施

AI 编程助手正在从“玩具”变成生产工具。生产工具的一个重要标志就是：**出了问题能查、能复现、能审计。**

claude-tap 做的事情，本质上就是把 Agent 的 API 流量变成可观测的日志。它不解决“AI 写不好代码”的问题，但能让你知道“AI 为什么这么写”“这次调用到底花了多少 token”“是哪条消息让模型跑偏了”。

如果你正在用 Claude Code、Codex、Cursor 或 Hermes Agent 做日常开发，强烈建议装一个试试。至少下次账单暴涨或 Agent 钻牛角尖的时候，你不会只能对着屏幕叹气。

---

**一句话推荐：**

> claude-tap = 给 AI 编程助手装的“行车记录仪”：它不改你的 workflow，只把你原本看不见的 API 流量，变成能查、能对比、能归档的证据。

---

**相关链接**

- GitHub：https://github.com/liaohch3/claude-tap
- 文档/在线 Demo：https://liaohch3.com/claude-tap/
- PyPI：https://pypi.org/project/claude-tap/
- 来源：HelloGitHub 第 122 期

---

**互动话题**：你在用 AI 编程助手时，最想搞清楚但又查不到的“黑盒瞬间”是什么？欢迎在评论区聊聊。
