# UV 教程

`uv` 是一个现代的 Python 包安装器和解析器，旨在提供比 `pip` 和 `pip-tools` 更快的性能。

## 安装 `uv`

通常，您可以通过 `pipx` 或直接下载二进制文件来安装 `uv`。

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## 创建虚拟环境

使用 `uv venv` 可以快速创建一个新的虚拟环境：

```bash
uv venv
```

这会在当前目录下创建一个 `.venv` 目录。

## 激活虚拟环境

在 Linux/macOS 上：

```bash
source .venv/bin/activate
```

在 Windows 上：

```bash
.venv\Scripts\activate
```

## 安装包

使用 `uv pip install` 来安装 Python 包：

```bash
uv pip install requests beautifulsoup4
```

## 升级包

```bash
uv pip install --upgrade some-package
```

## 卸载包

```bash
uv pip uninstall some-package
```

## 导出依赖

```bash
uv pip freeze > requirements.txt
```

## 从 `requirements.txt` 安装

```bash
uv pip install -r requirements.txt
```

## 更多信息

请查阅 `uv` 官方文档以获取更多高级用法和详细信息。
