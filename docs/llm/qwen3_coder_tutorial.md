# 新一代代码大模型 Qwen3-Coder 中文使用教程

> 本文编译自 Qwen-Team 官方博客文章 [Qwen3-Coder: Agentic Coding in the World](https://qwenlm.github.io/blog/qwen3-coder/)。

2025年7月22日，Qwen团队发布了新一代的代码大模型 **Qwen3-Coder**。它在“智能体编码”（Agentic Coding）方面展现出卓越的能力，能够在真实世界的软件工程任务中，通过多轮交互自主完成复杂的编码任务。

## 重要提示
**目前只有API按量收费的前提下，费用非常高昂。甚至超过Claude Sonnet 4 的价格。谨慎使用，注意用量**

## Qwen3-Coder 核心亮点

- **性能卓越**：最强版本 **Qwen3-Coder-480B-A35B-Instruct** 是一个拥有4800亿参数的混合专家（MoE）模型，激活参数为35亿。其在智能体编码、浏览器使用和工具调用等多个基准测试中，性能均达到开源模型的顶尖水平，可与 Claude Sonnet 4 相媲美。
- **超长上下文**：原生支持 **256K** tokens 的上下文长度，并可通过技术外推扩展至 **100万** tokens，处理超大代码库和复杂文档毫无压力。
- **开源工具链**：同步开源了官方命令行工具 **Qwen Code**，该工具基于 Gemini Code 修改，为 Qwen3-Coder 的强大能力进行了深度定制。
- **前沿训练技术**：模型经过 **7.5万亿** tokens 的数据预训练（其中70%为代码），并创新性地引入了**代码强化学习（Code RL）**和**长程智能体强化学习（Agent RL）**进行后训练，显著提升了代码执行成功率和解决复杂任务的能力。

## 快速上手指南

开发者可以通过多种方式来使用和体验 Qwen3-Coder 的强大功能。

### 方式一：使用官方命令行工具 Qwen Code

Qwen Code 是官方推荐的 CLI 工具，能最大限度地发挥 Qwen3-Coder 的模型潜力。

**环境要求**：
- Node.js (版本 20 或更高)

**安装步骤**：
1.  通过 npm 全局安装 Qwen Code：
    ```bash
    npm i -g @qwen-code/qwen-code
    ```

2.  配置环境变量。你需要一个兼容 OpenAI 标准的 API Key。这里我们使用阿里云的**模型服务Dashscope**作为示例。
    -   前往[Dashscope控制台](https://dashscope.console.aliyun.com/)开通服务并创建 API Key。
    -   在你的终端环境中配置以下环境变量：
        ```bash
        # Dashscope提供的 API Key
        export OPENAI_API_KEY="sk-your_dashscope_api_key"
        
        # Dashscope的 Qwen3-Coder 模型服务地址
        export OPENAI_API_BASE="https://dashscope.aliyuncs.com/compatible-mode/v1"
        
        # 指定要使用的模型名称
        export QWEN_MODEL_NAME="qwen3-coder-instruct"
        ```

3.  开始使用！现在你可以通过 `qwen` 命令与代码智能体进行交互了。
    ```bash
    qwen "请帮我实现一个快速排序算法"
    ```

### 方式二：在 Claude Code 中使用 Qwen3-Coder

如果你是 Claude Code 的用户，也可以通过简单的配置，将后端模型替换为 Qwen3-Coder。

- **NPM 包方式**：
  ```bash
  npm install -g @anthropic-ai/claude-code
  ```
  配置环境变量
  ```bash
  # 国内用户：
  export ANTHROPIC_BASE_URL=https://dashscope.aliyuncs.com/api/v2/apps/claude-code-proxy
  # 国际用户
  export ANTHROPIC_BASE_URL=https://dashscope-intl.aliyuncs.com/api/v2/apps/claude-code-proxy
  export ANTHROPIC_AUTH_TOKEN=your-dashscope-apikey
  ```


### 方式三：在 IDE 插件（Cline）中使用

对于习惯在 IDE 中进行开发的用户，可以通过 Cline 插件（或其他支持 OpenAI 兼容接口的插件）来集成 Qwen3-Coder。

1.  安装 Cline 插件。
2.  进入插件设置，找到 API 配置部分。
3.  选择 `Custom (OpenAI Compatible)` 作为模型提供商。
4.  填入以下信息：
    -   **API Key**: `sk-your_dashscope_api_key`
    -   **API Host**: `https://dashscope.aliyuncs.com/compatible-mode/v1`
    -   **Model**: `qwen3-coder-instruct`

### 方式四：直接调用 API

你也可以通过任何兼容 OpenAI API 格式的 HTTP 客户端或 SDK 直接调用模型。

以下是一个使用 OpenAI Python 库的调用示例：

```python
import os
from openai import OpenAI

# 从环境变量读取配置
api_key = os.getenv("OPENAI_API_KEY", "sk-your_dashscope_api_key")
base_url = os.getenv("OPENAI_API_BASE", "https://dashscope.aliyuncs.com/compatible-mode/v1")

# 初始化客户端
client = OpenAI(
    api_key=api_key,
    base_url=base_url,
)

# 构建消息
messages = [
    {
        "role": "system",
        "content": "You are a helpful assistant."
    },
    {
        "role": "user",
        "content": "Who are you?"
    }
]

# 发起请求
completion = client.chat.completions.create(
    model="qwen3-coder-instruct",
    messages=messages,
    temperature=0.7,
    top_p=0.8,
    stream=False,
)

# 打印结果
if completion.choices:
    print(completion.choices[0].message.content)

```

## 总结与展望

Qwen3-Coder 不仅仅是一个强大的代码补全工具，更是一个初具雏形的“AI 软件工程师”。它通过创新的智能体强化学习，在真实开发场景中展现了巨大的潜力。

未来，Qwen 团队将继续改进其代码智能体，发布更多尺寸的模型以降低部署成本，并探索代码智能体自我完善的可能性。
