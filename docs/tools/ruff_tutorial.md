# Ruff: 闪电般快速的Python Linter与格式化工具

`Ruff` 是一个用Rust编写的、性能极高的Python代码检查和格式化工具。它的目标是成为Python生态系统中的一站式代码质量工具，速度比现有的工具（如`Flake8`, `isort`, `Black`）快10-100倍。

*   **GitHub**: [astral-sh/ruff](https://github.com/astral-sh/ruff)

## 核心优势

*   **极致性能**: 在整个大型代码库上运行几乎是瞬时的，提供了无与伦比的反馈速度。
*   **功能全面**: 集成了代码检查（Linting）、代码格式化（Formatting）、导入排序等多种功能于一身。
*   **Python 3.12 兼容**: 完全支持最新的Python语法。
*   **配置简单**: 通过 `pyproject.toml` 或 `ruff.toml` 进行统一配置。
*   **可扩展性**: 支持自定义规则和插件。

## 结合 UV 进行安装

在现代Python项目管理中，我们推荐使用 `uv` 来管理环境和依赖。

1.  **创建并激活虚拟环境**:
    ```bash
    # 创建虚拟环境
    uv venv
    # 激活环境 (macOS/Linux)
    source .venv/bin/activate
    ```

2.  **使用 uv 安装 Ruff**:
    将 `ruff` 作为项目的开发依赖项进行安装。
    ```bash
    # 安装ruff
    uv pip install ruff
    ```

## 基本用法

### 代码检查 (Linting)

运行 `ruff check` 来检查代码中的问题。它会报告错误、未使用的导入、不符合规范的写法等。

```bash
# 检查当前目录下的所有Python文件
ruff check .
```

Ruff非常强大，可以自动修复许多检测到的问题。

```bash
# 检查并自动修复
ruff check . --fix
```

### 代码格式化 (Formatting)

`ruff format` 是一个兼容 `Black` 的代码格式化工具，但速度更快。

```bash
# 格式化当前目录下的所有Python文件
ruff format .
```

## 结合 Pre-commit 实现自动化

为了在每次提交代码前自动执行检查和格式化，强烈建议将 `ruff` 与 `pre-commit` 集成。

1.  **安装 pre-commit**:
    如果你还没有安装 `pre-commit`，可以使用 `uv` 进行安装。
    ```bash
    uv pip install pre-commit
    ```

2.  **创建配置文件**:
    在你的项目根目录下创建一个名为 `.pre-commit-config.yaml` 的文件。

3.  **配置 Ruff**:
    将以下内容添加到 `.pre-commit-config.yaml` 中。这个配置会让 `pre-commit` 在提交前自动运行 `ruff` 的检查和格式化。

    ```yaml
    - repo: https://github.com/astral-sh/ruff-pre-commit
    # Ruff version.
    rev: v0.12.4
    hooks:
        # Run the linter.
        - id: ruff-check
        args: [ --fix ]
        # Run the formatter.
        - id: ruff-format
    ```

4.  **安装 pre-commit 钩子**:
    在你的git仓库中安装钩子。
    ```bash
    pre-commit install
    ```

现在，当你尝试 `git commit` 时，`pre-commit` 会自动触发 `ruff` 对你暂存的文件进行检查和格式化。如果 `ruff` 修改了任何文件，提交将会被中止，你需要重新 `git add` 修改后的文件再次提交。

## 最佳实践：结合 UV 和 Pre-commit

`pre-commit` 本身可以管理其钩子所需的环境，但为了确保与项目开发环境的一致性，并利用 `uv` 的速度优势，我们可以进行如下配置。

虽然 `pre-commit` 默认会自己创建隔离的环境来运行 `ruff`，但在某些复杂的项目中，你可能希望确保 `pre-commit` 使用的 `ruff` 版本与你通过 `uv` 在开发环境中安装的版本完全一致。

`pre-commit` 的设计哲学是独立的，它不直接依赖于你的项目虚拟环境。上述的 `.pre-commit-config.yaml` 配置是目前社区的最佳实践，它利用了 `ruff-pre-commit` 仓库中预先构建好的 `ruff` 版本，这已经足够快且高效。

因此，你只需要：

1.  使用 `uv` 管理你的项目主环境（如安装 `ruff` 用于IDE集成和手动检查）。
2.  使用 `pre-commit` 和 `ruff-pre-commit` 配置来自动化提交流程。

这两者可以完美地协同工作，`uv` 负责你的开发环境，`pre-commit` 负责你的提交质量关卡，共同打造一个现代化、高效的Python开发工作流。
