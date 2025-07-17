# 个人博客

这是一个基于 MkDocs 和 Material for MkDocs 搭建的个人博客。

## 🚀 快速开始

### 1. 环境准备

确保您已经安装了 `uv`。如果尚未安装，请参考 [uv 官方文档](https://astral.sh/uv/install/)。

在项目根目录，使用 `uv` 创建并初始化虚拟环境：

```bash
uv venv
```

然后，安装 MkDocs 和 Material for MkDocs：

```bash
/Users/liuchang/work/learn/blog/.venv/bin/python -m uv pip install mkdocs mkdocs-material
```

### 2. 本地开发

在本地启动 MkDocs 开发服务器，您可以在浏览器中实时预览您的博客：

```bash
/Users/liuchang/work/learn/blog/.venv/bin/python -m mkdocs serve
```

访问 `http://127.0.0.1:8000` 即可查看。

### 3. 构建站点

当您准备好发布博客时，可以构建静态站点文件：

```bash
/Users/liuchang/work/learn/blog/.venv/bin/python -m mkdocs build
```

这将在项目根目录下生成一个 `site` 目录，其中包含所有静态 HTML、CSS 和 JavaScript 文件。

### 4. 使用 Docker Compose 部署

为了方便部署，我们使用 Docker Compose。确保您已经安装了 Docker 和 Docker Compose。

首先，确保您已经构建了最新的 `site` 目录（参考步骤 3）。

然后，在项目根目录下运行：

```bash
docker-compose up -d
```

这将启动一个 Nginx 容器，并将本地的 `site` 目录映射到容器中。您可以通过访问主机的 80 端口来访问您的博客。

要停止服务：

```bash
docker-compose down
```

## ✍️ 内容创作

您的博客内容位于 `docs/` 目录下，使用 Markdown 格式编写。

*   `docs/index.md` 是博客的首页。
*   `docs/tech/uv_tutorial.md` 是一个关于 `uv` 的教程示例。

### 添加新文章

1.  在 `docs/` 目录下（或其子目录中）创建新的 Markdown 文件，例如 `docs/new_article.md`。
2.  编辑 `mkdocs.yml` 文件，将新文章添加到导航 (`nav`) 中，以便它在博客中显示。

### 更新配置

博客的全局配置在 `mkdocs.yml` 文件中。您可以修改 `site_name`、`theme`、`nav` 等设置。

每次修改 `mkdocs.yml` 或 `docs/` 目录下的 Markdown 文件后，请记得重新执行 `mkdocs build` 命令，然后根据您的部署方式（本地开发服务器或 Docker Compose）重新启动或刷新。
