参考文档 [Linux 系统安装 ComfyUI 教程 | ComfyUI Wiki](https://comfyui-wiki.com/zh/install/install-comfyui/install-comfyui-on-linux)

### 第一步：系统环境准备

ComfyUI 需要 Python 3.9 或更高版本。检查您的 Python 版本：

```bash
python3 --version
# 或
python --version
```

## 第二步：创建虚拟环境

ComfyUI 支持三种主要的虚拟环境创建方式：venv、UV 和 conda。以下是每种方法的详细步骤：

### 方法一：使用 venv（推荐）

venv 是 Python 内置的标准虚拟环境工具，无需额外安装。

#### 1. 创建虚拟环境
```bash
# 在项目目录下创建名为 comfyui-env 的虚拟环境
python3 -m venv comfyui-env
```

#### 2. 激活虚拟环境
```bash
# Linux/macOS
source comfyui-env/bin/activate

# Windows
# .\comfyui-env\Scripts\activate
```

#### 3. 升级 pip
```bash
python -m pip install --upgrade pip
```

### 方法二：使用 UV（高性能工具）

UV 是一个现代化的 Python 包管理工具，速度比 pip 快 10-100 倍。

#### 1. 安装 UV
```bash
# macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Windows
# powershell -c "irm https://astral.sh/uv/install.ps1 | iex"
```

#### 2. 创建虚拟环境
```bash
# 在项目目录下创建虚拟环境
uv venv comfyui-env
```

#### 3. 激活虚拟环境
```bash
# Linux/macOS
source comfyui-env/bin/activate

# 安装PIP
python3 -m ensurepip --upgrade

# Windows
# .\comfyui-env\Scripts\activate
```

### 方法三：使用 Conda（Anaconda/Miniconda）

Conda 是一个流行的数据科学环境管理工具，特别适合处理复杂的依赖关系。

#### 1. 创建虚拟环境
```bash
# 创建名为 comfyui-env 的环境，指定 Python 版本
conda create --name comfyui-env python=3.11

# 激活环境
conda activate comfyui-env
```

#### 2. 配置 pip 源（可选，国内用户推荐）
```bash
# 配置清华源加速下载
pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple
```

## 第三步：安装ComfyUI

前提条件：Git，Wget

#### 安装 Comfy CLI
```bash
pip install comfy-cli

# 注：如果虚拟环境使用Conda，需要优先安装指定版本的`av`（PyAV）
pip install av==14.2.0
```
####  配置命令行自动补全（可选）
为了获得更好的使用体验，可以启用命令行自动补全：

```
comfy --install-completion
```
#### 安装 ComfyUI

使用 comfy-cli 安装 ComfyUI 非常简单，只需要一条命令：

```
comfy install
```

此命令将：

- 下载并安装最新版本的 ComfyUI
- 自动安装 ComfyUI-Manager（节点管理器）
- 配置基本的项目结构

#### 安装选项

您可以使用以下选项来自定义安装：

```
# 安装到默认位置 ~/comfy
comfy install 
# 安装到指定目录
comfy --workspace=/path/to/your/workspace install 
```

#### 启动 ComfyUI

```bash
# 后台运行
comfy launch --background 
# 指定监听地址和端口
comfy launch -- --listen 0.0.0.0 --port 8080
```

## 第四步：下载需要的模型

```bash
# Wan 2.1 的 VAE（变分自编码器），负责在像素空间 ↔ 潜在空间之间编解码，属于“解码器/编码器权重”。
wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/split_files/vae/wan_2.1_vae.safetensors

# OpenAI CLIP 系列中的 Clip-ViT-H/14 视觉塔模型（large 版本；文件名里 h 即 hidden size larger）。在图生视频、图生图分支里提取输入图像的视觉特征，供扩散网络作为条件使用。
wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/split_files/clip_vision/clip_vision_h.safetensors

# text_encoders (二选一即可)
# UM-T5-XXL（Unified Multilingual T5-ExtraExtraLarge）文本编码器，提供对英文/多语言 prompt 的 transformer 语义抽取
wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/split_files/text_encoders/umt5_xxl_fp16.safetensors
# 或者
wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/split_files/text_encoders/umt5_xxl_fp8_e4m3fn_scaled.safetensors
```
确保文件保存的位置
```bash
models/
├── clip_vision
│   └── clip_vision_h.safetensors
├── controlnet
│   └── put_controlnets_and_t2i_here
├── diffusion_models
│   └── wan2.1-i2v-14b-480p-Q3_K_S.gguf
├── text_encoders
│   └── umt5_xxl_fp8_e4m3fn_scaled.safetensors
└── vae
    └── wan_2.1_vae.safetensors
```
#### Wan2.1-I2V量化模型下载

[city96/Wan2.1-I2V-14B-720P-gguf](https://www.modelscope.cn/models/city96/Wan2.1-I2V-14B-720P-gguf)

[city96/Wan2.1-I2V-14B-480P-gguf](https://www.modelscope.cn/models/city96/Wan2.1-I2V-14B-480P-gguf)

说明：`wan2.1-i2v-14b-720p-<量化等级>.ggufGGUF`  

常见文件对应关系  
* BF16 / F16：原始 16 bit 精度，33GB，精度最好、显存要求最高  
* Q8_0 / Q6_K / Q5_* / Q4_* / Q3_*：社区常用的 llama.cpp k-quants，数字越小、体积越小、速度越快，但细节损失越多
* Q3_K_S：最小（≈7.9 GB），最低显存即可跑，画面细节会软  
* Q4_K_M / Q4_0：主流折中选择（10–11 GB）  
* Q5_K_M / Q5_0：细节更好，显存要 12 GB+  
* Q8_0：接近 F16 观感，只是轻微量化，18 GB

*通常体积越大，效果越好，但同时对设备性能要求也越高*

## 第五步：模型推理

1. 在ComfyUI启动后，通过对应地址端口打开 Web 控制台
2. 安装gguf插件：点击右上角 **Manager**，选择 **Custom Nodes Manager**，搜索 [**ComfyUI-GGUF**](https://github.com/city96/ComfyUI-GGUF "ComfyUI-GGUF") 进行安装
3. 加载工作流文件 ：
	* wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/example%20workflows_Wan2.1/image_to_video_wan_480p_example.json
	* wget https://www.modelscope.cn/models/Comfy-Org/Wan_2.1_ComfyUI_repackaged/resolve/master/example%20workflows_Wan2.1/image_to_video_wan_720p_example.json
4. 确保 `Unet Loader(GGUF)` 节点加载了  `wan2.1-i2v-14b-Q4_K_M.gguf` 模型
5. 确保 `Load CLIP` 节点加载了 `umt5_xxl_fp8_e4m3fn_scaled.safetensors` 模型
6. 确保 `Load VAE` 节点加载了 `wan_2.1_vae.safetensors` 模型
7. 确保 `Load CLIP Vision` 节点加载了 `clip_vision_h.safetensors` 模型
8. 在 `Load Image` 节点中加载前面提供的输入图片
9. 在 `CLIP Text Encoder` 节点中输入你想要生成的视频描述内容，或者使用工作流中的示例
10. 点击 `Run` 按钮，或者使用快捷键 `Ctrl(cmd) + Enter(回车)` 来执行视频生成