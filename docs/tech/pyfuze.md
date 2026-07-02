#  Python 高效项目打包工具——pyfuze 

## 概述

pyfuze 是一个强大的 Python 项目打包工具，可以将 Python 项目打包成单个可执行文件。它基于 [cosmopolitan](https://github.com/jart/cosmopolitan) 和 [uv](https://github.com/astral-sh/uv) 构建，支持多种打包模式，并且**在同x86平台中，可以实现一次打包，多平台运行**。

## 安装

### 使用 pip 安装
```bash
pip install pyfuze
```

### 使用 uvx 直接运行
```bash
uvx pyfuze -h
```

## 打包模式

pyfuze 提供三种打包模式：

| 模式 | 离线支持 | 跨平台 | 大小 | 兼容性 |
|------|----------|--------|------|--------|
| **Bundle** (默认) | :material-check: | :material-close: | :material-alert-octagon: 大 | :material-check-circle: 高 |
| **Online** | :material-close: | :material-check: | :material-check-circle: 小 | :material-check-circle: 高 |
| **Portable** | :material-check: | :material-check: | :material-alert-circle: 中 | :material-alert-octagon: 低 |

### Bundle 模式
- 包含 Python 和所有依赖项
- 只能在打包时的相同平台上运行
- 提供最高兼容性
- 运行时将内容解压到 `--unzip-path`

### Online 模式
- 生成小型、跨平台的包
- 运行时解压并下载依赖到 `--unzip-path`（需要网络连接）
- 保持包轻量且适应不同系统

### Portable 模式
- 创建独立的跨平台可执行文件
- 无需解压或网络连接
- 仅支持纯 Python 项目和依赖
- 基于 Python 3.12.3 版本

## 基本用法

```bash
pyfuze [OPTIONS] PYTHON_PROJECT
```

## 常用选项

- `--mode TEXT`: 打包模式 (bundle/online/portable)
- `--output-name TEXT`: 输出可执行文件名
- `--entry TEXT`: 入口 Python 文件 (默认: main.py)
- `--reqs TEXT`: 指定依赖的 requirements.txt 文件
- `--include TEXT`: 包含额外文件或文件夹
- `--exclude TEXT`: 排除项目文件或文件夹
- `--unzip-path TEXT`: 解压路径 (bundle 和 online 模式)
- `--python TEXT`: 指定 Python 版本
- `--pyproject FILE`: 包含 pyproject.toml 文件
- `--uv-lock FILE`: 包含 uv.lock 文件
- `--win-gui`: 在 Windows 上隐藏控制台窗口
- `--env TEXT`: 添加环境变量
- `--uv-install-script-windows TEXT`: Windows 上的UV安装脚本
- `--uv-install-script-unix TEXT`: Unix 系统的UV安装脚本

## **国内部署加速推荐配置**
- `--env UV_DEFAULT_INDEX=https://mirrors.aliyun.com/pypi/simple`: 配置国内UV镜像源加速
- `--uv-install-script-windows https://gitee.com/wangnov/uv-custom/releases/download/0.8.15/uv-installer-custom.ps1`: Windows 上的UV安装脚本
- `--uv-install-script-unix https://gitee.com/wangnov/uv-custom/releases/download/0.8.15/uv-installer-custom.sh`: Unix 系统的UV安装脚本


## 使用示例

### 1. Portable 模式 - 简单脚本

适用于简单的 Python 脚本：

```bash
pyfuze ./simple.py --mode portable --reqs requests
```

### 2. Bundle 模式 - 复杂项目

适用于文件夹结构的复杂项目：

```bash
pyfuze ./complex_project \
  --entry app.py \
  --pyproject ./complex_project/pyproject.toml \
  --uv-lock ./complex_project/uv.lock \
  --include ./complex_project/config.txt \
  --exclude ./complex_project/build.py \
  --unzip-path ./extracted \
  --win-gui
```

### 3. Online 模式 - 跨平台部署

适用于需要跨平台部署的场景：

```bash
pyfuze ./complex_project \
  --entry app.py \
  --pyproject ./complex_project/pyproject.toml \
  --uv-lock ./complex_project/uv.lock \
  --include ./complex_project/config.txt \
  --exclude ./complex_project/build.py \
  --unzip-path ./extracted \
  --win-gui \
  --mode online \
  --uv-install-script-windows <mirror-url> \
  --uv-install-script-unix <mirror-url> \
  --env INSTALLER_DOWNLOAD_URL=<mirror-url> \
  --env UV_PYTHON_INSTALL_MIRROR=<mirror-url> \
  --env UV_DEFAULT_INDEX=<mirror-url>
```

## 工作目录

默认工作目录是 `<unzip-path>/src`。

### 切换到可执行文件所在目录
```python
import os
os.chdir(os.path.dirname(os.environ["PYFUZE_EXECUTABLE_PATH"]))
```

### 切换到用户调用目录
```python
import os
os.chdir(os.environ["PYFUZE_INVOKE_DIR"])
```

## 注意事项

1. **代码保护**: pyfuze 不提供任何代码加密或混淆功能
2. **平台兼容性**: 
   - Online 模式的跨平台能力受 uv 限制
   - Portable 模式的跨平台能力受 APE 规范限制
3. **网络要求**: Online 模式需要网络连接来下载依赖
4. **文件大小**: Bundle 模式生成的文件较大，包含所有依赖


## 故障排除

1. **依赖问题**: 确保所有依赖在 pyproject.toml 或 requirements.txt 中正确定义
2. **平台兼容性**: 检查目标平台是否支持所选模式
3. **网络问题**: Online 模式需要稳定的网络连接
4. **权限问题**: 确保有足够的权限写入解压目录

## 支持与资源

- [GitHub Issues](https://github.com/TanixLu/pyfuze/issues) - 报告问题和功能请求
- [Discord](https://discord.gg/GE9FyB5vtt) - 社区讨论

## 许可证

pyfuze 使用 [MIT 许可证](https://github.com/TanixLu/pyfuze/blob/main/LICENSE)。