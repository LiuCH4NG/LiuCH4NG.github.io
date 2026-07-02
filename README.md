# 学习笔记 · LiuCH4NG 技术博客

基于 [MkDocs](https://www.mkdocs.org/) + [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/) 搭建的个人技术博客，记录 AI、大语言模型、Agent 架构、后端与系统设计的实践和思考。

🔗 在线访问：<https://liuch4ng.github.io/>

## 技术栈

- **站点生成**：MkDocs + Material for MkDocs
- **包管理**：[uv](https://docs.astral.sh/uv/)（Python ≥ 3.12）
- **部署**：GitHub Actions → GitHub Pages（推送到 `main` 自动构建部署）
- **主题**：Anthropic 风格自定义皮肤（暖纸 / 珊瑚 / 衬线标题）

## 本地开发

### 1. 安装依赖

确保已安装 [uv](https://docs.astral.sh/uv/getting-started/installation/)，然后在项目根目录执行：

```bash
uv sync          # 按 pyproject.toml + uv.lock 安装 mkdocs 与 mkdocs-material
```

### 2. 启动实时预览

```bash
uv run mkdocs serve
```

浏览器打开 <http://127.0.0.1:8000>，修改 `docs/` 下的 Markdown 会自动热刷新。

### 3. 构建静态站点

```bash
uv run mkdocs build        # 产物输出到 site/
```

本地预览构建产物：

```bash
python -m http.server 8000 -d site
```

## 项目结构

```
blog/
├── docs/                # Markdown 源码
│   ├── index.md         # 首页
│   ├── tech/            # 效率工具
│   ├── llm/             # 大语言模型
│   ├── models/          # 模型评测与发布
│   ├── ai-coding/       # AI 编程工具
│   ├── agent/           # Agent 与智能体架构
│   ├── products/        # AI 产品动态
│   ├── prompt-eng/      # 提示词与工程化
│   ├── thinking/        # 管理与应用思考
│   ├── tools/           # 工具与效率
│   └── assets/          # 图片等静态资源
├── docs/stylesheets/    # 自定义样式（Anthropic 风格主题）
├── mkdocs.yml           # 站点配置（导航 / 主题 / 扩展）
├── pyproject.toml       # Python 依赖
└── .github/workflows/   # GitHub Pages 自动部署工作流
```

## 写作指南

### 新增文章

1. 在对应分类目录下创建 `.md`，例如 `docs/llm/new_topic.md`
2. 在 `mkdocs.yml` 的 `nav` 中添加导航条目（标题含冒号等特殊字符时用双引号包裹）
3. `uv run mkdocs serve` 本地预览确认
4. 推送到 `main`，GitHub Actions 自动构建并部署

### 文章配图

图片放在 `docs/assets/wechat/<slug>/`，正文用相对路径引用（文件名避免空格和括号）：

```markdown
![描述](../assets/wechat/<slug>/image.png)
```

## Docker 部署（可选）

先构建 `site/`，再用 Nginx 容器托管：

```bash
uv run mkdocs build
docker-compose up -d      # 访问 http://localhost
docker-compose down       # 停止
```

## 目录约定

- 站内跳转请使用 Markdown 链接语法 `[文本](path.md)`（MkDocs 会自动改写为目录 URL）；若在原始 HTML `<a href>` 中写 `.md` 链接则不会被改写，会导致 404。
- `site/`、`.venv/` 已在 `.gitignore` 中忽略，不应提交。
