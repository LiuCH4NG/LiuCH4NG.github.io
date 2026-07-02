---
title: OpenClaw v2026.4.7 更新
date: 2026-04-08
tags:
  - openclaw
  - AI助手
  - 开源
  - 更新
---

# OpenClaw v2026.4.7 更新：记忆系统回归、推理中枢上线、安全全面加固

> 350K Star 的开源个人 AI 助手 OpenClaw 刚刚发布 v2026.4.7，这是今年迄今最大的一次功能性更新。

![配图](https://raw.githubusercontent.com/openclaw/openclaw/main/docs/assets/openclaw-logo-text-dark.svg)

---

## 一句话总结

这次更新的核心关键词：**记忆回归、推理统一、安全加固**。

如果你长期关注 OpenClaw，这次最让人兴奋的莫过于 Memory Wiki 系统的全面回归，以及全新的 `openclaw infer` 推理中枢。

---

## 本次更新最值得关注的 6 件事

### 1. Memory Wiki 全面回归

曾经被社区强烈呼唤的记忆系统终于回来了！

全新的 `memory-wiki` 栈包含：

- **结构化声明与证据字段**——不再是一团模糊的文本，每条记忆都有来源
- **矛盾聚类与健康度检查**——自动发现记忆冲突
- **陈旧度仪表盘与新鲜度加权搜索**——过时的记忆权重自动降低
- **编译摘要检索**——快速获取浓缩版记忆

**这意味着你的 AI 助手终于有了真正的"长期记忆"。**

### 2. 全新 `openclaw infer` 推理中枢

新增一等公民命令 `openclaw infer ...`，统一了所有 provider 支持的推理工作流：

- 模型推理
- 媒体生成（图片/音乐/视频）
- Web 搜索
- Embedding 任务

**一个命令搞定所有推理需求，不再需要记住不同工具的调用方式。**

同时，媒体生成工具现在支持跨 provider 自动降级——如果某个图片/音乐/视频 provider 挂了，会自动切换到备选，保持你的创作意图不丢失。

### 3. Webhook 插件：外部自动化驱动 TaskFlow

新增内置的 Webhook 入站插件，外部系统可以通过带共享密钥的端点创建和驱动绑定的 TaskFlow。

> 对于想把 OpenClaw 接入 CI/CD、监控系统、Slack Bot 等场景的开发者来说，这是一个关键拼图。

### 4. 安全修复：全方位加固

这次安全修复的广度和深度都令人印象深刻：

| 安全领域 | 修复内容 |
|---------|---------|
| SSRF 防护 | 跨域 307/308 重定向自动丢弃请求体和敏感头 |
| 浏览器 SSRF | 主帧 document 重定向视为导航，阻止内网跳板攻击 |
| 环境变量注入 | 阻止 Java/Rust/Git/K8s/云凭证等危险 env 覆盖 |
| Gateway 配置 | 模型不可再通过 API 修改 exec 审批路径 |
| 会话认证 | 密钥轮换时自动踢出旧的 WebSocket 会话 |
| Base64 解码 | 限制解码前字节数，防止超大多媒体绕过检查 |
| 插件下载 | 验证 SHA-256 完整性，校验失败直接拒绝安装 |

> 这不是补丁，这是对整个攻击面的系统性排查。

### 5. Session 压缩检查点 + 可插拔压缩引擎

新增持久化压缩检查点，运维人员可以在 Sessions UI 中检查和恢复压缩前的状态。

同时引入可插拔的压缩 Provider 注册机制：

```
agents.defaults.compaction.provider
```

插件可以替换内置的 LLM 摘要压缩管线，失败时自动回退。

### 6. Gemma 4 支持 + 一大波 Provider 更新

| Provider | 更新 |
|----------|------|
| Google Gemma 4 | 新增模型支持，保持 Google 原生路由 |
| Arcee AI | 新增内置 Provider 插件 |
| Anthropic Claude | 恢复 Claude CLI 为本地首选路径 |
| Ollama | 自动检测视觉能力，图片附件可用 |
| Mistral Small 4 | 支持推理级别调节 |
| xAI | 识别新域名 `api.grok.x.ai` |

---

## 其他值得注意的改进

- **iOS / Apple Watch**：Watch 审批在 iPhone 锁屏时也能正常工作，包括重连恢复和 APNs 刷新
- **桌面版子 Agent**：支持 `lightContext: true` 轻量启动上下文，不再静默回退到完整注入
- **Discord**：DM 对话身份规范化，`--bind here` 不再丢失路由
- **Slack**：新增 `thread.requireExplicitMention` 选项，线程内也要求显式 @bot
- **TUI**：恢复 Kitty 键盘状态、隐藏 commentary 泄露、修复退出崩溃
- **OpenAI Codex OAuth**：修复刷新令牌重用导致的认证卡死

---

## 如何升级

一行命令搞定：

```bash
curl -fsSL https://openclaw.dev/install | bash
```

或者 Homebrew：

```bash
brew upgrade openclaw
```

---

## 我的看法

v2026.4.7 是一个**记忆能力 + 安全基础设施**双线并进的版本。

Memory Wiki 的回归不只是功能补全，而是让 AI 助手从"无状态的对话工具"进化为"有长期记忆的个人伙伴"。`openclaw infer` 的统一入口则大幅降低了多模态推理的使用门槛。

而安全方面的密集修复说明一件事——**OpenClaw 团队认真对待生产环境安全**。从 SSRF 到环境变量注入到插件完整性校验，几乎覆盖了 AI Agent 运行时的所有关键攻击面。

350K Star、70K Fork、45 位贡献者参与本次发布，OpenClaw 的生态正在加速。

---

**相关链接：**

- GitHub 仓库：https://github.com/openclaw/openclaw
- 完整更新日志：https://github.com/openclaw/openclaw/releases/tag/v2026.4.7

---

*你用 OpenClaw 了吗？最期待 Memory Wiki 还是 `openclaw infer`？欢迎评论区聊聊。*
