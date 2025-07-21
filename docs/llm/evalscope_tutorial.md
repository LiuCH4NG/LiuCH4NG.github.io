# 使用 EvalScope 精准评估大模型：一份面向医学考试场景的实战教程

在这篇博文中，我们将深入探讨如何使用 `evalscope` 框架，对大语言模型（LLM）在专业领域（以医学高级职称病学考试为例）的能力进行标准化、可复现的评估。本教程将从最开始的数据准备阶段讲起，一步步带您完成整个评估流程。

## 背景

评估大语言模型是一项复杂的任务。我们不仅需要好的数据集，还需要一个能够保证评估流程标准化、结果可复现、并且易于扩展的工具。`evalscope` 正为此而生，它通过简单的配置文件，就能让我们对不同的模型和数据集进行灵活组合和高效评估。

## 第 1 步：数据准备与标准化

这是整个评估流程的基石。高质量、格式统一的数据是保证评估结果有效性的前提。

### 1.1. 原始数据分析

在我们的项目 `docs` 目录下，存放着大量的原始资料，包括 PDF 版本的试卷和初步转换的 CSV 文件。这些数据来源多样，格式可能存在不一致，例如：

-   文件名五花八门。
-   CSV 文件中的列名、列数可能不同。
-   可能包含非结构化的元数据解析错误。

直接在这些原始数据上进行评估，会导致流程繁琐且容易出错。因此，我们需要一个标准化的评估数据集。

### 1.2. 构建标准评估集

为了解决上述问题，我们创建了 `eval_data/` 目录。这个目录存放着我们为本次评估精心准备的、格式完全统一的 CSV 文件。

**标准格式要求：**

-   **文件名**: 清晰、简洁，能反映数据内容即可。
-   **文件编码**: 统一为 `UTF-8`。
-   **列结构**: 每个 CSV 文件都包含以下标准列：
    -   `question`: 题干内容。
    -   `A`, `B`, `C`, `D`, `E`: 分别对应五个选项的内容。如果某道题没有某个选项（如只有 A, B, C, D），则对应列可留空。
    -   `answer`: 该题目的标准答案，通常是选项的字母（如 `A`）。

通过这一层标准化的转换，我们确保了 `evalscope` 在读取数据时，可以用一套统一的规则来处理所有文件，极大地简化了后续的配置和评估过程。

## 第 2 步：环境配置

在开始评估前，我们需要搭建好运行环境。

### 2.1. 安装依赖库

项目根目录下的 `requirements.txt` 文件已经定义了所有必需的 Python 库。打开您的终端，运行以下命令进行安装：

```bash
pip install -r requirements.txt
```

### 2.2. 设置 API 密钥

如果您计划评估需要通过 API 调用的商业模型（如阿里云通义千问、智谱 GLM、DeepSeek 等），则必须在您的环境中配置相应的 API Key。`evalscope` 会自动从环境变量中读取这些密钥。

以阿里云 DashScope 为例，您可以这样设置：

```bash
# 建议将此行添加到您的 .bashrc 或 .zshrc 配置文件中，以便长期有效
export DASHSCOPE_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

请务必将 `sk-xxxxxxxx...` 替换为您自己的有效密钥。

## 第 3 步：编写 `eval_config.yaml` 配置文件

这是 `evalscope` 的核心。一个 YAML 配置文件定义了评估任务的所有要素：**谁来考**（模型）、**考什么**（数据集）以及**怎么考**（评估方法）。

让我们在项目根目录下创建 `eval_config.yaml` 文件，并填入以下内容：

```yaml
# eval_config.yaml: EvalScope 评估配置文件

# 1. 定义要评估的模型 (MaaS & Open-source)
models:
  # - id: qwen-max
  #   # display_name: Qwen-Max-API  # 为报告设置别名
  - model_id: Qwen/Qwen2-7B-Instruct
    model_source: modelscope
    model_revision: v1.0.0
    device: 'auto'
    precision: 'torch.bfloat16'

# 2. 定义数据集和评估任务
datasets:
  - name: medical_psychiatry_exam
    type: file
    path: ./eval_data/
    pattern: '*.csv'  # 使用通配符匹配 eval_data 下所有 csv 文件
    metric: 'accuracy'  # 对选择题，我们关心的是准确率

    # 适配器 (Adapter): 连接数据与模型的桥梁
    adapter:
      # 定义如何将数据行格式化为模型的输入 Prompt
      prompt:
        content: "以下是中国医学高级职称考试的一道单项选择题，请仔细阅读题目和选项，并给出最正确的答案选项字母。\n\n题目：{question}\n\n选项：\n{options}\n\n答案："
        column_map:
          question: 'question'
          options:
            columns: ['A', 'B', 'C', 'D', 'E']
            item_template: "{col}. {content}\n"
      
      # 定义标准答案来自哪一列
      answer:
        column: 'answer'

# 3. 全局评估配置
eval:
  output_dir: ./outputs
  max_prompt_length: 2048
```

### 配置文件详解

-   `models`: 定义一个或多个要参与评估的模型。您可以同时评估多个模型，`evalscope` 会依次运行它们。
-   `datasets`: 定义评估数据集。我们指向 `eval_data` 目录，并用 `pattern: '*.csv'` 来告诉 `evalscope` 加载该目录下所有的 CSV 文件。
-   `adapter`: 这是最关键的部分。
    -   `prompt.content`: 定义了一个 Prompt 模板。`{question}` 和 `{options}` 是占位符。
    -   `prompt.column_map`: 建立了模板占位符与 CSV 文件列名之间的映射关系。
        -   `question: 'question'` 表示用 `question` 列的内容填充 `{question}`。
        -   `options` 的配置稍微复杂，它告诉 `evalscope` 将 `A`, `B`, `C`, `D`, `E` 这几列的内容，按照 `item_template` 定义的格式（例如 `A. xxxxx\nB. yyyyy\n`）合并成一个字符串，然后填充到 `{options}` 占位符。
    -   `answer.column`: 指明标准答案存储在 `answer` 列。

## 第 4 步：启动评估任务

当配置文件编写完成后，启动评估只需要一条简单的命令：

```bash
evalscope run --config eval_config.yaml
```

执行后，`evalscope` 会：
1.  加载模型。
2.  遍历 `eval_data` 目录下的所有 CSV 文件。
3.  对每个文件中的每一行，根据 `adapter` 规则生成 Prompt。
4.  将 Prompt 发送给模型，获取预测结果。
5.  将预测结果与 `answer` 列的标准答案进行比对。
6.  计算 `accuracy` 指标。
7.  将所有结果汇总，并保存在 `outputs` 目录中。

## 第 5 步：分析评估结果

评估完成后，`outputs` 目录下会生成一个以时间戳命名的新文件夹，例如 `outputs/20250719_120000/`。其中包含了所有详细的评估数据：

-   `reports/summary.csv`: **最重要的结果文件**。一个清晰的表格，展示了每个模型在数据集上的核心指标。您可以直接用 Excel 或 Numbers 打开，直观地比较性能。
-   `predictions/<model_name>/... .jsonl`: 包含了模型对于每一道题的详细输入（prompt）、原始输出（raw_prediction）和解析后的答案（parsed_prediction）。当您需要深入分析某个模型的具体表现或错误案例时，这里是最佳的数据来源。
-   `logs/eval_log.log`: 记录了评估过程中的所有日志信息，用于调试和问题排查。

## Qwen3最佳实践代码
```python
from evalscope import TaskConfig, run_task

import os
from dotenv import load_dotenv

load_dotenv()

eval_data_list = 'eval_data/'

subset_list = [file.split('_')[0] for file in os.listdir(eval_data_list)]

print(subset_list)

task_cfg = TaskConfig(
    model='Qwen/Qwen3-32B',
    # model='Qwen3-ai_patient',
    api_url='https://api.siliconflow.cn/v1/chat/completions',
    api_key=os.getenv('sillicon_api_key'),
    eval_type='service',
    datasets=['general_mcq'],
    dataset_args={
        'general_mcq': {
            "local_path": eval_data_list,  # 自定义数据集路径
            "subset_list": subset_list,
            'prompt_template': '以下是中国医学高级职称考试的单项选择题，请回答问题，并选出其中的正确答案。你的回答的最后一行应该是这样的格式：“答案是：LETTER”（不带引号），其中 LETTER 是 A、B、C、D、E 中的一个。\n{query}'
        },
    },
    eval_batch_size=16,
    generation_config={
        'max_tokens': 8192,  # 最大生成token数，建议设置为较大值避免输出截断
        'temperature': 0.7,  # 采样温度 (qwen 报告推荐值)
        'top_p': 0.8,  # top-p采样 (qwen 报告推荐值)
        'top_k': 20,  # top-k采样 (qwen 报告推荐值)
        'n': 1,  # 每个请求产生的回复数量
        'chat_template_kwargs': {'enable_thinking': False}  # 关闭思考模式
    },
    timeout=60000,  # 超时时间
    stream=True,  # 是否使用流式输出
    limit=1000,  # 设置为1000条数据进行测试
     use_cache='outputs/20250708_153201'
)

run_task(task_cfg=task_cfg)
```

## [EvalScope 官方教程](https://evalscope.readthedocs.io/zh-cn/latest/)
