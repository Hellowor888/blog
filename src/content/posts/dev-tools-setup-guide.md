---
title: 小白也能看懂的开发环境搭建指南：Git、VS Code 与 Claude Code 安装及 AI 编程配置
date: 2026-05-28
tags: [Claude Code, Git, VS Code, 教程]
excerpt: 一份从零开始的开发工具安装与 AI 编程环境配置指南，涵盖 Git、Visual Studio Code、Claude Code 以及各大模型 API 的接入方法。
section: tech
---

## 写在前面

你可能听过周围的人在聊 "用 AI 写代码"，但翻了一圈教程发现要么过时了，要么默认你已经装好了某某环境——然后你卡在了第一步。

这篇文章就是写给"零基础"的你。我们会从安装 Git 开始，然后安装 Visual Studio Code，最后安装和配置 Claude Code 并接入各大模型运营商的 API 服务。所有步骤都在 Windows 上验证过（macOS 和 Linux 也一并附上），每一步都有截图指令，你照做就行。

读完这篇指南，你将拥有一套完整的 AI 编程环境，可以让你用自然语言与 Claude Code 对话，完成代码编写、调试、重构等任务。

---

## 第一章：安装 Git

Git 是世界上最流行的版本控制系统。你可以把它理解成文档的 "无限撤销 + 时光机"——每一次修改都会留下记录，你随时可以回到过去的任意一个版本。

### 1.1 Windows 安装

1. 打开浏览器，访问 **https://git-scm.com/downloads/win** ，下载会自动开始。如果没有，点击页面上的 "Click here to download manually"。
2. 下载完成后，双击 `.exe` 安装包。
3. 安装过程中，大部分选项保持默认即可。但有几个地方需要留意：
   - **Select Components** 页面：确保勾选了 "Git Bash Here" 和 "Git GUI Here"。
   - **Default editor** 页面：建议选择 "Use Visual Studio Code as Git's default editor"（如果你还没装 VS Code，先选 Vim 或 Nano，后面装了 VS Code 再改）。
   - **Adjusting the name of the initial branch** 页面：选择 "Override the default branch name for new repositories"，保持 `main`。
   - **Configuring the line ending conversions** 页面：选择 "Checkout Windows-style, commit Unix-style line endings"。
   - **Configuring the terminal emulator** 页面：选择 "Use MinTTY"。
   - **Default behavior of `git pull`** 页面：选择 "Fast-forward or merge"。
4. 一路 Next，等待安装完成。

验证安装：在桌面右键，选择 "Open Git Bash here"，输入：

```bash
git --version
```

如果看到类似 `git version 2.47.0` 的输出，说明安装成功。

### 1.2 macOS 安装

打开终端（Terminal），输入：

```bash
xcode-select --install
```

按提示完成安装。这会把 Git 也一并装好。

或者使用 Homebrew：

```bash
brew install git
```

验证：

```bash
git --version
```

### 1.3 Linux (Ubuntu/Debian) 安装

```bash
sudo apt update
sudo apt install git -y
git --version
```

### 1.4 Git 初始配置

安装完成后，需要设置用户名和邮箱——这些信息会体现在你的每一次提交记录中：

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱@example.com"
```

---

## 第二章：安装 Visual Studio Code

Visual Studio Code（简称 VS Code）是微软开发的免费代码编辑器，目前是全世界使用人数最多的代码编辑器。它本身很轻量，但可以通过插件扩展成功能强大的开发环境。

### 2.1 下载与安装

1. 打开浏览器，访问 **https://code.visualstudio.com/** ，点击 "Download for Windows"（或对应你的系统）。
2. 双击安装包。
3. 安装选项中，**建议勾选以下两项**，会让你之后的使用方便很多：
   - **"将 '通过 Code 打开' 操作添加到 Windows 资源管理器目录上下文菜单"**：这样你在文件夹上右键就能用 VS Code 打开。
   - **"将 '通过 Code 打开' 操作添加到 Windows 资源管理器文件上下文菜单"**。
   - **"添加到 PATH"**：这样你在终端里输入 `code` 就能启动 VS Code。
4. 其余保持默认，完成安装。

macOS 用户：下载 `.zip` 解压后拖入 Applications 文件夹即可。

Linux 用户：下载 `.deb` 后 `sudo dpkg -i code_*.deb` 或使用 Snap `sudo snap install code --classic`。

### 2.2 安装中文语言包（可选）

1. 打开 VS Code，点击左侧活动栏的 **扩展图标**（四个小方块的图标，或按 `Ctrl+Shift+X`）。
2. 在搜索框中输入 `Chinese`。
3. 找到 **"Chinese (Simplified) (简体中文) Language Pack for Visual Studio Code"**，点击 Install。
4. 安装完成后重启 VS Code。

### 2.3 推荐安装的插件

在扩展商店搜索并安装以下插件：

| 插件名称 | 用途 |
|---|---|
| **Prettier - Code formatter** | 自动格式化代码，让代码风格统一 |
| **ESLint** | JavaScript/TypeScript 代码质量检查 |
| **GitLens** | Git 增强工具，可以看到每行代码是谁什么时候改的 |
| **Markdown Preview Enhanced** | Markdown 实时预览 |

---

## 第三章：安装 Node.js（Claude Code 的前置条件）

Claude Code 是通过 npm（Node Package Manager）安装的命令行工具，所以你需要先安装 Node.js。

### 3.1 Windows / macOS 安装

1. 打开 **https://nodejs.org/** ，下载 LTS（长期支持）版本。截至 2026 年 5 月，推荐 22.x LTS。
2. 双击安装包，一路 Next。**确保勾选了 "Automatically install the necessary tools"**（Windows 上会额外安装 Chocolatey 包管理器，点上就行）。
3. 安装完成后，重启终端。

验证安装：

```bash
node --version    # 应显示 v22.x.x
npm --version     # 应显示 10.x.x
```

### 3.2 Linux 安装

推荐使用 NodeSource 仓库：

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install nodejs -y
```

或用 nvm（Node Version Manager），方便多版本切换：

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
# 重启终端后
nvm install 22
nvm use 22
```

---

## 第四章：安装 Claude Code

Claude Code 是 Anthropic 推出的 AI 编程助手，可以直接在终端里用自然语言对话、编写代码、调试程序。它不是一个"聊天机器人"，而是一个真正能读写文件、执行命令、操作 Git 的智能代理。

### 4.1 全局安装

打开终端（Windows 上用 Git Bash 或 PowerShell，macOS/Linux 用 Terminal），输入：

```bash
npm install -g @anthropic-ai/claude-code
```

安装完成后验证：

```bash
claude --version
```

如果看到了版本号，恭喜，Claude Code 安装成功。

### 4.2 首次启动与认证

在终端中输入：

```bash
claude
```

首次启动会打开浏览器页面要求登录。你需要一个 Anthropic 账号。登录方式有两种：

- **Anthropic Console 账号**：直接在 Anthropic 官网注册，然后在 Claude Code 中选择 "Console" 登录。
- **API Key 方式**：如果你有 API Key，可以在启动前设置环境变量。

如果你还没有 API Key，先去 **https://console.anthropic.com/** 注册账号并生成一个。

拿到 API Key 后，可以通过以下方式之一使用：

**方式一：环境变量（推荐）**

在终端中执行（每次打开终端需要重新执行，永久设置见下方）：

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-你的密钥..."
```

**Windows (PowerShell):**
```powershell
$env:ANTHROPIC_API_KEY="sk-ant-api03-你的密钥..."
```

**方式二：使用第三方模型**

如果你没有 Anthropic 的 API Key，或者想用其他模型（如 DeepSeek、OpenAI、智谱 GLM 等），可以通过 `claude configure` 来设置：

```bash
claude configure
```

Claude Code 会引导你完成 OAuth 登录或 API Key 设置。

### 4.3 永久设置 API Key

**macOS / Linux：** 将下面这行加入 `~/.bashrc` 或 `~/.zshrc`：

```bash
echo 'export ANTHROPIC_API_KEY="sk-ant-api03-你的密钥..."' >> ~/.bashrc
source ~/.bashrc
```

**Windows (PowerShell)：**

以管理员身份打开 PowerShell，执行：

```powershell
[System.Environment]::SetEnvironmentVariable('ANTHROPIC_API_KEY', 'sk-ant-api03-你的密钥...', 'User')
```

关闭并重新打开 PowerShell，用 `echo $env:ANTHROPIC_API_KEY` 验证。

### 4.4 Claude Code 基本用法

安装完成并认证后，在终端中进入你的项目目录，输入：

```bash
claude
```

然后你就可以用中文和 Claude Code 对话了。例如：

- "帮我在这个文件夹里创建一个 React 项目"
- "这段代码有什么问题？"
- "帮我写一个 Python 脚本来处理 CSV 文件"

Claude Code 可以直接读写文件、执行终端命令、操作 Git——它会向你请求权限来执行这些操作。

### 4.5 在 VS Code 中使用 Claude Code

Claude Code 提供了 VS Code 扩展，可以在编辑器内部使用。在扩展商店搜索 **"Claude Code"** 安装即可。安装后，在 VS Code 中按 `Ctrl+Shift+P` 打开命令面板，输入 `Claude Code` 就能看到各种命令。

目前 Claude Code 插件推荐使用 Anthropic 提供的官方版本（搜索 `anthropic.claude-code`）。

---

## 第五章：接入各大模型运营商 API

Claude Code 默认使用 Anthropic 的 Claude 模型，但它也支持接入其他模型提供商的 API。下面列出主流厂商的 API Key 获取方法。

### 5.1 Anthropic（Claude 系列）

1. 访问 **https://console.anthropic.com/** ，注册或登录。
2. 进入 Dashboard → API Keys → Create Key。
3. 复制 Key（**注意：Key 只显示一次**），设置为环境变量：

```bash
export ANTHROPIC_API_KEY="sk-ant-api03-..."
```

### 5.2 OpenAI（GPT 系列）

1. 访问 **https://platform.openai.com/api-keys** ，登录。
2. 点击 "Create new secret key"。
3. 复制 Key，设置为环境变量：

```bash
export OPENAI_API_KEY="sk-proj-..."
```

在 Claude Code 中使用 OpenAI 模型，需要在 `claude configure` 中切换 provider，或使用 `.claude/settings.json` 配置。

### 5.3 DeepSeek

DeepSeek 是目前性价比最高的国产模型，API 价格低廉且效果出色。

1. 访问 **https://platform.deepseek.com/api_keys** ，注册或登录。
2. 点击 "创建 API Key"。
3. 复制 Key，设置为环境变量：

```bash
export DEEPSEEK_API_KEY="sk-..."
```

### 5.4 智谱 AI（ChatGLM / GLM-4）

1. 访问 **https://open.bigmodel.cn/** ，注册。
2. 进入控制台 → API Keys，创建一个。
3. 设置环境变量：

```bash
export ZHIPU_API_KEY="你的Key"
```

### 5.5 阿里百炼（通义千问）

1. 访问 **https://dashscope.console.aliyun.com/** ，用阿里云账号登录。
2. 进入 API-KEY 管理，创建 Key。
3. 设置环境变量：

```bash
export DASHSCOPE_API_KEY="sk-..."
```

### 5.6 月之暗面（Kimi）

1. 访问 **https://platform.moonshot.cn/** ，登录。
2. 进入控制台 → API Keys。
3. 设置环境变量：

```bash
export MOONSHOT_API_KEY="sk-..."
```

### 5.7 切换模型的通用方法

在 Claude Code 中切换不同提供商的模型，可以创建一个 `.claude/settings.json` 文件在你的项目目录中。例如，使用 DeepSeek 的配置：

```json
{
  "apiKeyHelper": "echo $DEEPSEEK_API_KEY",
  "model": "deepseek-v4-pro"
}
```

或者在项目根目录执行：

```bash
claude configure
```

然后按提示选择 provider 和模型。Anthropic 会定期更新支持的外部模型列表，建议随时关注官方文档。

如果你不想为每个项目单独配置，也可以把配置放在用户全局设置中：

**Windows:** `C:\Users\你的用户名\.claude\settings.json`
**macOS / Linux:** `~/.claude/settings.json`

---

## 第六章：常见问题排查

### Q1: `npm install -g` 提示权限错误（macOS/Linux）

在命令前加 `sudo`，或者更推荐的做法——将 npm 全局包安装到用户目录：

```bash
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

### Q2: `claude` 命令找不到

通常是因为 npm 全局安装路径没有加入 PATH。先执行 `npm config get prefix` 查看 npm 全局路径，然后确保该路径下的 `bin` 目录在你的 PATH 中。

### Q3: Git 报错 "Failed to connect to github.com"

这是网络问题，常见于国内网络环境。可以尝试：
- 在终端中设置代理：`export https_proxy=http://127.0.0.1:7890`
- 或者配置 Git 使用代理：`git config --global http.proxy http://127.0.0.1:7890`
- 如果你没有代理，可以尝试在 GitHub 仓库 URL 前加上 `https://ghproxy.com/` 作为镜像。

### Q4: API Key 设置了但 Claude Code 认不到

确认环境变量名拼写是否正确（常见错误：大小写不匹配、多了空格）。在终端中 `echo $ANTHROPIC_API_KEY` 确认能输出你的 Key。

### Q5: VS Code 终端中 git 命令不生效

重启 VS Code。如果还不行，在 VS Code 中按 `Ctrl+Shift+P`，输入 `Terminal: Select Default Profile`，确保选的是 Git Bash（Windows）或系统的默认 shell。

---

## 写在最后

到这里，你已经拥有了：

- **Git**：用来管理代码版本
- **VS Code**：用来编辑代码
- **Claude Code**：用 AI 辅助编写和调试代码
- **多个模型 API**：按需选择性价比最高的模型

这套工具组合覆盖了从写代码到管代码再到 AI 辅助的全部环节。刚开始可能会觉得东西有点多，但这个行业的共识是——前期花半天时间把环境搭建好，后面写代码的效率会翻很多倍。

祝你编程愉快。
