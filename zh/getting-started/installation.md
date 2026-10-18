---
title: 下载与安装
description: 下载适用于 macOS、Windows、Linux、iPhone、iPad 或 Android 的 Codeg，然后连接工作区并运行你的第一个会话。
---

# 下载与安装

Codeg 由两个互补部分组成。**桌面应用**在 macOS、Windows 或 Linux 上运行智能体与项目；原生 **iOS 和 Android 客户端**则连接到由你掌控的 Codeg 桌面端或服务器，让你离开电脑后也能继续推进任务。

## 桌面应用 {#desktop-app}

当你希望 Codeg 及其智能体在当前电脑上运行时，请安装桌面应用。若要改在专用机器上无头运行 Codeg，请参见[部署](/zh/getting-started/deployment)。

<Download />

## 移动应用 {#mobile-apps}

使用移动应用发起和跟进会话、查看智能体的实时输出、处理权限审批，并浏览项目上下文。它们是客户端，而不是独立的智能体运行环境：文件、智能体 CLI 与会话仍保留在运行 Codeg 的那台机器上。

<MobileDownload />

在 Android 上，请打开下载的 `.apk`；如果系统询问，请允许浏览器或文件管理器“安装未知应用”。官方[发布页](https://github.com/xintaofei/codeg-android/releases/latest)还提供 SHA-256 校验值供你核验。

### 连接到 Codeg 工作区 {#connect-a-mobile-app}

移动应用需要一个可访问的 Codeg 主机及其访问令牌：

1. **选择 Codeg 的运行位置。** 若已有桌面应用，请启用**设置 → Web 服务**，并复制界面显示的地址与令牌；若需要常开的工作区，则可改为[部署 `codeg-server`](/zh/getting-started/deployment)。
2. **让主机可被访问。** 当两个设备处于同一个受信任网络时，可以使用 `http://192.168.1.10:3080` 之类的局域网地址。远程访问时，请通过受信任的反向代理、VPN 或隧道使用 HTTPS。
3. **添加服务器。** 在移动应用中新增服务器配置，填写地址与令牌，执行**测试连接**并保存；应用随后会加载该主机上的项目与会话。

::: warning 妥善保管访问令牌
该令牌可以访问你的 Codeg 工作区。明文 HTTP 只适合受信任的局域网；跨越任何不受信任的网络时，请使用 HTTPS 或可信隧道。iOS 将令牌存入 Keychain，Android 则使用 Android Keystore 进行保护。
:::

## 安装桌面应用 {#install-the-desktop-app}

### macOS {#macos}

macOS 版本使用 Apple Developer ID 签名，并**经过 Apple 公证**，因此无需任何绕过 Gatekeeper 的操作即可打开。

1. 打开 `.dmg`——为 Apple Silicon（M 系列）选择 **aarch64**，为 Intel 选择 **x64**。
2. 将 **Codeg** 拖入 **Applications**。
3. 从 Applications 或 Spotlight 启动它。首次打开时，macOS 可能会要求你确认打开一个从互联网下载的应用。

### Windows {#windows}

1. 运行你下载的 `…_x64-setup.exe`（在 Arm 设备上则运行 `arm64` 安装程序）。
2. 如果 **SmartScreen** 显示“未知发布者”提示，请选择**更多信息 → 仍要运行**——该安装程序尚未附带 Authenticode 证书进行分发。
3. Codeg 完成安装并出现在开始菜单中。更新会被动应用（见下文）。

### Linux {#linux}

- **AppImage（x64）：** 赋予其可执行权限并运行——
  ```bash
  chmod +x codeg_*_amd64.AppImage
  ./codeg_*_amd64.AppImage
  ```
- **Debian / Ubuntu：** `sudo apt install ./codeg_*_amd64.deb`
- **Fedora / RHEL：** `sudo dnf install ./codeg-*.x86_64.rpm`

Codeg 的界面运行在 **WebKitGTK** 运行时（`libwebkit2gtk-4.1`）之上。`.deb` / `.rpm` 软件包会自动引入它；对于 AppImage，如果系统中尚未安装，则需你自行安装。arm64 没有发布 AppImage——请在该平台上使用 `.deb` 或 `.rpm`。

## 桌面系统要求 {#desktop-system-requirements}

- 一个 64 位桌面操作系统：**macOS**（Apple Silicon 或 Intel）、**Windows 10/11**，或带有 WebKitGTK 的现代 **Linux** 发行版。
- 要*驱动*智能体，你至少需要安装一个智能体 CLI。Codeg 可以在 **设置 → 智能体**中为你安装和管理其中大多数——通过 `npx` 或预构建的二进制文件；基于 `npx` 的那些需要在你的 `PATH` 中有 **Node.js**。另有两个——**Kiro CLI** 和 **TRAE CLI**——要用各自厂商的官方安装程序来安装，Codeg 再从那里找到它们。参见[支持的智能体](/zh/guide/supported-agents)。

::: tip 多智能体委派开箱即用
桌面应用捆绑了 `codeg-mcp` 伴生程序，因此[多智能体协作](/zh/guide/multi-agent)可立即使用——无需额外设置。
:::

## 首次运行桌面会话 {#first-desktop-session}

三个步骤带你从全新安装走向运行中的会话：

1. **启用一个智能体。** 打开 **设置 → 智能体**，选择一个（Claude Code、Codex、Gemini……），让 Codeg 运行它的**预检**——它会标记出任何缺失项，并主动提出为你安装该智能体。→ [使用智能体](/zh/guide/agents)
2. **进行身份验证。** 使用该智能体自己的订阅登录、将其指向自定义端点，或使用模型提供商的 API 密钥。→ [身份验证与模型](/zh/guide/authentication)
3. **启动一个会话。** 打开一个项目文件夹，在 composer 中选择你的智能体和模型，然后发送你的第一条提示词。该智能体过去的会话会自动[导入到工作区](/zh/getting-started/#what-codeg-does)。

## 保持更新 {#staying-up-to-date}

- **iPhone 与 iPad：**通过 App Store 获取更新。
- **Android：**从 [Android 发布页](https://github.com/xintaofei/codeg-android/releases/latest)下载新的 APK 与 SHA-256 校验值。
- **桌面端：** **设置 → 系统 → 软件更新**会下载经过签名的版本并重启 Codeg——在 Windows 上，则是先关闭它，再由安装程序重新打开它。自 **0.36.0** 起，只有当更新的签名写明的正是所提供的那个版本时，它才会被安装。参见[系统设置](/zh/reference/settings/system#software-update)。

## 其他连接方式 {#other-ways-to-connect}

- **从终端或 CI 任务使用 Codeg**——自 **0.38.0** 起随附的 `codeg-cli` 可通过桌面应用或服务器运行智能体和助手，每次运行都会保存为对话。→ [命令行](/zh/guide/command-line)
- **从任意浏览器使用你的桌面应用**——启用 **设置 → Web 服务**，Codeg 便会通过网络提供其界面，并由访问令牌保护（并为手机提供二维码）。由于它监听所有网络接口，你可以从任何能连接到你机器的设备访问你的桌面会话——无需单独的服务器。→ [Web 服务](/zh/reference/settings/web-service)
- **在专用服务器上运行**——对于无头或团队使用场景，部署 `codeg-server` 并从任意浏览器使用 Codeg。→ [部署](/zh/getting-started/deployment)
- **从源码构建**——参见[开发](/zh/reference/development)指南。

## 后续步骤 {#next-steps}

- [**支持的智能体**](/zh/guide/supported-agents)——Codeg 聚合了哪些智能体，以及每个智能体将会话保存在何处。
- [**指南**](/zh/guide/)——多智能体协作、聊天频道、自动化等更多内容。
- [**配置**](/zh/getting-started/configuration)——环境变量与运行时选项。
