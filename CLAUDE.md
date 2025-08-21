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

## Common Commands

### 环境设置
```bash
# 创建虚拟环境
uv venv

# 安装依赖
/Users/liuchang/work/learn/blog/.venv/bin/python -m uv pip install mkdocs mkdocs-material
```

### 本地开发
```bash
# 启动开发服务器
/Users/liuchang/work/learn/blog/.venv/bin/python -m mkdocs serve
```
访问 `http://127.0.0.1:8000` 查看预览

### 构建和部署
```bash
# 构建静态站点
/Users/liuchang/work/learn/blog/.venv/bin/python -m mkdocs build

# 本地预览构建结果
python -m http.server 8000 -d site
# 访问 http://localhost:8000

# 使用 Docker Compose 部署（可选）
docker-compose up -d

# 停止 Docker 服务
docker-compose down

# 上传到服务器（需要配置 SSH，可选）
./upload_web.sh
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

## Content Structure

文档按以下结构组织：
- `docs/index.md`: 首页
- `docs/tech/`: 效率工具相关教程
- `docs/llm/`: 大语言模型相关教程

添加新文章时，需要在 `mkdocs.yml` 的 `nav` 部分添加相应的导航链接。

## Configuration Notes

- 主题使用 Material for MkDocs，支持明暗主题切换
- 配置了代码高亮、搜索功能、导航标签等功能
- 使用 Roboto 字体和 JetBrains Mono 等宽字体
- 包含社交链接（GitHub）和作者信息
- 已配置 GitHub Pages 自动部署

## Development Workflow

1. 在 `docs/` 目录下创建或编辑 Markdown 文件
2. 更新 `mkdocs.yml` 中的导航结构（如需要）
3. 本地预览：`mkdocs serve`
4. 构建站点：`mkdocs build`
5. 推送到 main 分支触发自动部署到 GitHub Pages