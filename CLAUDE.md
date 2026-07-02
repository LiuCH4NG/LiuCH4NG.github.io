# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

这是一个基于 MkDocs 和 Material for MkDocs 搭建的个人博客项目，用于记录学习笔记和技术教程。

## Architecture

项目采用 MkDocs 静态站点生成器，使用 Material 主题。主要组件包括：

- **文档源码**: `docs/` 目录包含所有 Markdown 文件
- **配置文件**: `mkdocs.yml` 定义站点结构、主题和导航
- **构建输出**: `site/` 目录包含生成的静态文件
- **部署**: 使用 GitHub Pages 进行自动部署

### 项目结构
```
blog/
├── docs/                    # 文档源码目录
│   ├── index.md            # 首页
│   ├── tech/               # 效率工具教程
│   ├── llm/                # 大语言模型教程
│   ├── models/             # 模型评测与发布（公众号文章）
│   ├── ai-coding/          # AI 编程工具（公众号文章）
│   ├── agent/              # Agent 与智能体架构（公众号文章）
│   ├── products/           # AI 产品动态（公众号文章）
│   ├── prompt-eng/         # 提示词与工程化（公众号文章）
│   ├── thinking/           # 管理与应用思考（公众号文章）
│   ├── tools/              # 工具与效率（公众号文章）
│   └── assets/
│       ├── images/         # 站点通用图片
│       └── wechat/<slug>/  # 各公众号文章的配图（按文章 slug 分目录）
├── mkdocs.yml              # MkDocs 配置文件
├── pyproject.toml          # Python 项目配置
├── .github/workflows/      # GitHub Actions 工作流
├── site/                   # 构建输出目录（自动生成）
├── Dockerfile              # Docker 镜像配置
└── docker-compose.yml      # Docker Compose 配置
```

### 依赖管理
- 使用 `uv` 作为 Python 包管理器
- 主要依赖: `mkdocs`, `mkdocs-material`
- Python 版本要求: >=3.12

## Common Commands

### 环境设置
```bash
# 创建虚拟环境
uv venv

# 激活虚拟环境并安装依赖
source .venv/bin/activate
uv pip install mkdocs mkdocs-material

# 或者直接使用 uv 运行命令（推荐）
uv run mkdocs serve
```

### 本地开发
```bash
# 启动开发服务器（使用 uv，推荐）
uv run mkdocs serve

# 或者使用虚拟环境路径
.venv/bin/python -m mkdocs serve
```
访问 `http://127.0.0.1:8000` 查看预览

### 构建和部署
```bash
# 构建静态站点
uv run mkdocs build
# 或 .venv/bin/python -m mkdocs build

# 本地预览构建结果
python -m http.server 8000 -d site
# 访问 http://localhost:8000

# 上传到服务器（需要配置 SSH）
./upload_web.sh
```

### Docker 部署（可选）
```bash
# 使用 Docker Compose 部署
docker-compose up -d

# 停止 Docker 服务
docker-compose down
```

### GitHub Pages 部署
项目已配置为使用 GitHub Actions 自动部署到 GitHub Pages：

- **自动触发**：推送到 main 分支时自动构建和部署
- **访问地址**：https://liuch4ng.github.io/
- **工作流文件**：`.github/workflows/deploy.yml`

手动触发部署或查看部署状态：
1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Deploy to GitHub Pages" 工作流
3. 点击 "Run workflow" 手动触发（如需要）

## Configuration Notes

### MkDocs 配置 (`mkdocs.yml`)
- **主题**: Material for MkDocs，支持明暗主题自动切换
- **功能特性**: 导航标签、搜索高亮、代码复制、TOC 集成
- **字体**: Roboto (正文) + JetBrains Mono (代码)
- **Markdown 扩展**: 支持代码高亮、警告框、表格、任务列表、Mermaid 图表等

### GitHub Pages 部署
- **自动触发**: 推送到 main 分支或 PR 到 main 分支
- **访问地址**: https://liuch4ng.github.io/
- **工作流**: `.github/workflows/deploy.yml` 使用 Python 3.12 环境
- **部署策略**: 构建后将 site/ 内容复制到根目录部署

### 内容管理
添加新文章的步骤：
1. 在相应目录下创建 `.md` 文件：
   - 效率工具教程：`docs/tech/`
   - 大语言模型教程：`docs/llm/`
   - 模型评测与发布：`docs/models/`
   - AI 编程工具：`docs/ai-coding/`
   - Agent 与智能体架构：`docs/agent/`
   - AI 产品动态：`docs/products/`
   - 提示词与工程化：`docs/prompt-eng/`
   - 管理与应用思考：`docs/thinking/`
   - 工具与效率：`docs/tools/`
2. 如果文章含图片，将图片放在 `docs/assets/wechat/<slug>/`，正文用相对路径引用：`![描述](../assets/wechat/<slug>/image.png)`
3. 在 `mkdocs.yml` 的 `nav` 部分添加导航链接（标题含冒号等特殊字符时用双引号包裹）
4. 本地预览确认效果
5. 推送到 main 分支触发自动部署

### 公众号文章迁移规范
从 `wechat/` 仓库迁移公众号文章到 blog 时：
- 仅迁移每个主题文件夹下的主文章 `.md`（如 `公众号文章.md`），不迁移 `research.md`、`chat.md`、`tasks/` 等素材。
- 图片引用需从 Obsidian 的 `![[...]]` 改写为标准 markdown：`![](../assets/wechat/<slug>/filename.png)`。
- 公众号引导 GIF（`gif.gif`）和二维码等推广图不保留，迁移时删除。
- 非图片的 Obsidian 双链（如 `[[target|显示文本]]`）转换为纯文本显示。
- 不修改 `wechat/` 源目录，blog 只使用复制后的内容。
- 图片文件名避免空格和括号（markdown 图片 URL 会在空格/括号处断裂），必要时重命名。

## Development Workflow

1. 编辑或创建 Markdown 文件：放入对应主题目录（`docs/tech/`、`docs/llm/`、`docs/models/`、`docs/ai-coding/`、`docs/agent/`、`docs/products/`、`docs/prompt-eng/`、`docs/thinking/`、`docs/tools/`）
2. 更新导航配置：在 `mkdocs.yml` 的 `nav` 部分添加新文章链接
3. 本地预览：`uv run mkdocs serve`
4. 构建验证：`uv run mkdocs build`
5. 提交推送：推送到 main 分支触发 GitHub Pages 自动部署