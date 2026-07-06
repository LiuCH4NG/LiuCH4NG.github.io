---
date: 2026-05-16
---

# :material-hammer: 洞穴人说话省75%Token？这个AI提示词技巧火了

> **"为什么用很多词，当少词也能行？"**
> —— 一位远古智者（其实是个程序员）

---

## 这是什么黑魔法？

最近GitHub上出现了一个让人忍俊不禁、又细思极恐的项目——**Caveman**（石器人）。

它的核心思想只有一句话：**让 Claude 像洞穴人一样说话，砍掉75%的废话Token，同时保留100%的技术准确性。**

项目描述是这样写的（原文就是这种风格）：

> *"why use many token when few token do trick"*
> （为何用多词，当少词可以？）

听起来很蠢？先别笑。这背后有真实的省钱逻辑。

---

## 先看效果对比

同样是解释一个 React 重渲染的问题：

**:material-account-voice: 正常 Claude（69个Token）：**
> "The reason your React component is re-rendering is likely because you're creating a new object reference on each render cycle. When you pass an inline object as a prop, React's shallow comparison sees it as a different object every time, which triggers a re-render. I'd recommend using useMemo to memoize the object."

**:material-hammer: 洞穴人 Claude（19个Token）：**
> "New object ref each render. Inline object prop = new ref = re-render. Wrap in `useMemo`."

---

同样的 Bug，同样的解决方案，**Token用量从69降到19，省了72%。**

再看一个：

**:material-account-voice: 正常 Claude：**
> "Sure! I'd be happy to help you with that. The issue you're experiencing is most likely caused by your authentication middleware not properly validating the token expiry. Let me take a look and suggest a fix."

**:material-hammer: 洞穴人 Claude：**
> "Bug in auth middleware. Token expiry check use `<` not `<=`. Fix:"

第二个直接给出了问题根因，第一个先废话了30个Token才开始干活。

---

## 它是怎么工作的？

Caveman 是一个 **Claude Code Skill**（技能文件），本质上是一段精心设计的系统提示词，告诉模型在被激活时切换进"极简输出模式"。

安装只需一行命令：

```bash
claude install-skill JuliusBrussee/caveman
```

触发方式很灵活，你可以说：
- `/caveman`
- "talk like caveman"
- "caveman mode"
- "less tokens please"

退出说："stop caveman" 或 "normal mode" 即可。

---

## 洞穴人模式删掉了什么，保留了什么？

这才是这个技巧最精妙的地方。它**不是无脑压缩**，而是有选择地删除"认知冗余"：

| 内容类型 | 洞穴人怎么处理 |
|---------|-------------|
| 英文解释性文字 | :material-hammer: 砍掉填充词，只留骨干 |
| 代码块 | ✍ 正常书写（洞穴人不傻） |
| 技术术语 | :material-brain: 完整保留（polymorphism 还是 polymorphism） |
| 报错信息 | :material-clipboard: 原文引用 |
| Git commit & PR | ✍ 正常书写 |
| 冠词 a/an/the | :material-skull-outline: 全删 |
| 客套话 | :material-skull-outline: "Sure, I'd be happy to" 灭绝 |
| 模糊措辞 | :material-skull-outline: "It might be worth considering" 灭绝 |

简单说，它消灭的是大语言模型最爱说的那些**"语言润滑剂"**——那些让回答听起来更礼貌、更流畅，但对技术内容毫无贡献的词。

---

## 为什么LLM会产生这么多废话Token？

这是一个值得深思的问题。

大语言模型在训练时，大量学习了人类写作中的"礼貌范式"——我们写邮件、写文章、做口头表达时，会自然地加入过渡语、客套话、缓冲语气。这些在人际沟通中有价值，但在**技术问答场景**里，它们纯粹是噪音。

常见的"Token杀手"：

- `"I'd be happy to help you with that"` → 8个废Token
- `"The reason this is happening is because"` → 7个废Token  
- `"I would recommend that you consider"` → 7个废Token
- `"Sure, let me take a look at that for you"` → 10个废Token

每次API调用都在为这些废话付费。如果你的产品每天有几万次调用，这个损耗相当可观。

---

## 这背后的提示词工程原理

Caveman 的本质是一种**输出约束型提示词**技术，它的核心设计思路包括：

**1. 角色绑定（Role Binding）**
给模型指定一个极端风格的角色（洞穴人），让模型自动推断这个角色应该如何说话——简短、直接、去冠词、去礼貌语。

**2. 正/负例对比（Contrast Examples）**
技巧中隐含了大量"这样写 vs 不这样写"的对比，帮助模型快速校准目标风格的边界。

**3. 域保护（Domain Protection）**
明确声明代码块、技术术语、报错信息要"原样保留"，防止模型在极简化过程中误伤技术内容。

**4. 可逆开关（Reversible Toggle）**
支持随时切回正常模式，不影响其他任务。

---

## 实际收益有多少？

作者给出的数据：

```
TOKENS SAVED          ████████ 75%
TECHNICAL ACCURACY    ████████ 100%
SPEED INCREASE        ████████ ~3x
VIBES                 ████████ OOG（原始！）
```

75%的Token节省意味着：
- **省钱**：API成本直接砍掉四分之三
- **提速**：生成的Token越少，响应越快
- **准确**：技术信息无损

---

## 它能用在哪些场景？

适合洞穴人模式的场景：

:material-check: **代码调试**：直接说哪里错了，怎么改  
:material-check: **技术问答**：快速获取答案，不要铺垫  
:material-check: **代码审查**：批量处理时省大量Token  
:material-check: **自动化脚本**：后端批处理，没人看废话  

不适合的场景：

:material-close: **用户界面回复**：终端用户需要友好语气  
:material-close: **文档撰写**：需要完整表达  
:material-close: **解释性内容**：新手需要更多上下文  

---

## 一个更深的启发

Caveman 项目本身很轻量，但它揭示了一个重要的AI使用哲学：

**LLM的输出风格是可编程的。**

我们习惯了接受模型默认的输出格式，但实际上通过提示词，我们可以精确控制模型"怎么说"，而不影响"说什么"。这就是提示词工程的核心价值之一——不是让模型更聪明，而是让模型**更高效地把聪明用在刀刃上**。

洞穴人只是一个有趣的实现，但这种思路可以延伸到很多地方：

- 让模型只输出JSON，不输出解释
- 让模型用Markdown表格代替长段落
- 让模型在批处理时跳过所有元评论

**Token 是钱，废话是成本。** 洞穴人想通了这件事。

---

## 如何安装和使用

> 需要先安装 Claude Code CLI

```bash
# 安装技能
claude install-skill JuliusBrussee/caveman

# 使用时在对话中输入
/caveman

# 退出时输入
normal mode
```

项目地址：`github.com/JuliusBrussee/caveman`

---

## 最后

下次你在等 Claude 慢慢说完 "Sure! I'd be happy to help you with that, the reason this issue is occurring is most likely because..." 的时候，想想洞穴人。

**洞穴人不废话。洞穴人直接给答案。洞穴人省你的钱。**

:material-hammer:

---

*如果觉得这个项目有趣，欢迎转发。下一期我们聊聊更多 Claude Code Skill 的玩法。*
