---
title: 架构
description: 架构 —— Codeg 如何组合在一起，从它的单一 Rust 核心和共享 Web UI，到四个二进制文件以及它们通过 ACP 驱动的智能体 CLI。
---

# 架构

在底层，Codeg 由为数不多、排布简单的组件构成：**一个 Rust 核心**、**一个 Web 前端**，以及由它们构建出的**四个二进制文件** —— 桌面应用、独立服务器、一个小巧的按智能体伴生程序，以及电脑操作所依托的 helper。会话所做的一切 —— 驱动智能体、打开终端、读取文件、向另一个智能体委派 —— 都流经这个共享核心。本页是地图；各个[设置界面](/zh/reference/)和[指南](/zh/guide/)才是实地。

## 四个二进制文件 {#the-four-binaries}

Codeg 从**单个 Cargo 工作区中交付四个 Rust 二进制文件**，它们全部由同一个库 crate（`codeg_lib`）编译而来：

| 二进制文件 | 角色 |
| ------ | ---- |
| **`codeg`** | **桌面应用** —— 一个包裹着 Web UI 的 [Tauri](https://tauri.app/) 外壳（原生窗口、系统托盘、自动更新器）。 |
| **`codeg-server`** | **独立服务器** —— 一个 HTTP + WebSocket 服务器，向浏览器提供相同的 UI，用于无头或共享部署。 |
| **`codeg-mcp`** | **按次启动的伴生程序** —— 一个微型的 stdio [MCP](https://modelcontextprotocol.io/) 服务器，由智能体 CLI 运行，用于访问 Codeg 自身的工具：委派，以及会话内工具。 |
| **`codeg-computer-helper`** | **电脑操作 helper** —— 真正读取并操作桌面窗口的那个进程，服务于桌面应用，或提供[电脑操作](/zh/guide/computer-use)的服务器。 |

前两个是你*运行*的；另外两个则会为你自动启动 —— 伴生程序每个智能体会话一个（更多内容见[下文](#multi-agent-delegation-and-codeg-mcp)），helper 在电脑操作首次需要它时启动（见[下文](#computer-use-and-codeg-computer-helper)）。由于它们共享 `codeg_lib`，桌面应用和服务器是**同一产品的两道前门** —— 区别在于 UI 如何访问核心，而不是核心做什么。

桌面应用随附的是放在它旁边的伴生程序和 helper，**不包括**服务器。在 **0.33.0** 之前，它一直带着一份从未用过的 `codeg-server` —— 约 70 MB —— 因为打包器会收走构建产出的每一个二进制文件；如今每个独立二进制文件都有了自己的构建特性，默认关闭，桌面构建就不会再顺带把它们产出来。→ [开发](/zh/reference/development)

## 一个核心，一个前端 {#one-core-one-frontend}

两个组件承担着真正的工作，且二者在每个二进制文件中都被复用：

- **Rust 核心（`codeg_lib`）** —— 会话与智能体编排、数据库、git、凭据、Web 服务器、日志。它在 `codeg` 中开启 [Tauri](https://tauri.app/) 的桌面功能进行构建，而在其余三个中则以无头（无 GUI）方式编译。
- **Web 前端** —— 一个 [Next.js](https://nextjs.org/) / React 应用，导出为静态文件。桌面应用在其 webview 中加载它们；服务器则将完全相同的产物提供给浏览器。

将前端与核心连接起来的是一个**传输层**，它是"两道前门"设计的关键：同一份 UI 代码无论哪种方式都与核心通信，并在运行时选择自己的通道。

- 在**桌面应用**中，UI 通过 **Tauri 的 IPC** 直接调用核心 —— 进程内，无网络。
- 在**浏览器**中，完全相同的 UI 通过 **HTTP 和一个 WebSocket** 与 `codeg-server` 通信以获取实时事件。

这正是为什么 [Web 服务](/zh/reference/settings/web-service)界面能把"完整的工作区"递到你的手机上，而[无头部署](/zh/getting-started/deployment)体验起来与桌面应用别无二致 —— 这是一个前端跑在两种传输之上，而不是两个应用。

### 原生移动客户端 {#native-mobile-clients}

[iOS 与 Android 应用](/zh/getting-started/installation#mobile-apps)在不移动核心的前提下增加了第三种客户端路径。它们是使用 SwiftUI 和 Jetpack Compose 构建的原生应用，而不是 Web 前端的外壳；两者都通过经过认证的 **HTTP + WebSocket API** 与桌面 Web 服务或 `codeg-server` 通信。访问令牌存放在 iOS Keychain 中，或由 Android Keystore 保护。

手机上不会运行智能体 CLI，也不会放置项目检出。文件、数据库、git 操作和智能体子进程仍由主机持有；移动应用负责发送指令并渲染实时事件流。两个客户端均开放源码：[Codeg for iOS](https://github.com/xintaofei/codeg-ios) 与 [Codeg for Android](https://github.com/xintaofei/codeg-android)。

## 智能体如何运行 {#how-agents-run}

Codeg 并不重新实现 Claude Code、Codex、Gemini 等等 —— 它**驱动它们真正的 CLI**。每个智能体作为一个**子进程**运行，Codeg 通过 **[Agent Client Protocol](https://agentclientprotocol.com/)（ACP）**与之通信 —— 这与像 Zed 这样的编辑器和编码智能体对话所用的是同一套 JSON-RPC 协议。自 **0.32.0** 起，这套通信运行在该协议官方的 Rust 运行时 —— `agent-client-protocol` crate（2.2）—— 之上，取代了 Codeg 过去自带的、打过补丁的前代 crate 副本；Codeg 处理不了的某一条消息，再也不会把整个连接一起拖垮。

在这一关系中，Codeg 是**客户端**，智能体是**服务器**：Codeg 打开一个会话，将模型的这一轮流式传回你的屏幕，并在智能体的请求到达时逐一响应 —— 在**终端**中运行命令、**读取或写入文件**、为有风险的操作请求**权限**。对于 Codeg 不处理的请求，它会回一个*不支持*的答复，这样智能体就能继续往下走，而不是干等着。由于每个智能体都被规范化到同一套协议上，它们全都落入单一的工作区、置于同一套控制之下 —— 这正是聚合对话、在智能体之间切换得以实现的根本所在。

当 Codeg 启动一个智能体时，它还会给智能体一组待连接的 **MCP 服务器**。其中之一通常是 Codeg 自己的伴生程序 —— 只要它的工具组至少有一个开着 —— 但不接受通过协议传入 MCP 服务器的智能体除外：内置智能体中的 **OpenClaw**、**Pi**，以及自 **0.36.0** 起的 **Cline**，还有关掉了 MCP 支持的自定义智能体。

## 多智能体委派与 `codeg-mcp` {#multi-agent-delegation-and-codeg-mcp}

`codeg-mcp` 是一个智能体能够将工作**交给另一个智能体**的方式 —— 也是它触及 Codeg 自身其余工具的途径。当 Codeg 启动一个智能体 CLI 时，它注入一个指向该二进制文件的 MCP 服务器条目；CLI 通过 stdio 启动它，其 LLM 便获得一组 Codeg 工具 —— 最重要的是 **`delegate_to_agent`**，外加来自[协作设置](/zh/reference/settings/collaboration)的可切换工具组：`check_user_feedback`、`ask_user_question` 和 `get_session_info`，内置浏览器的 `browser_*` 工具，电脑操作的 `computer_*` 工具，以及那两个从对话中创建内容的写入工具。一次 `delegate_to_agent` 调用会经由伴生程序回传到父 Codeg 进程，后者启动工作智能体并将其结果流式传回；其他每一次调用也走同一条路，由 Codeg 自己来应答。自 **0.36.0** 起，这次调用可以用 id 指名一个[助手](/zh/guide/assistants)，而不是一个智能体：伴生程序的工具描述里列出了会话开始时已启用的那些助手，Codeg 在调用到达时解析这个 id，用助手保存的选项启动它自己的智能体，并把它的常驻指令加进任务里。伴生程序如果发现自己在和一个较旧的 Codeg 通信，就会拒绝这次调用并要求重启，而不是把工作交给一个普通的智能体。

智能体拿到哪些工具组，是在**它启动时**决定的 —— 伴生程序的工具列表在该会话内是固定的 —— 因此打开某个工具组，只会作用于之后启动的智能体。有几个工具组还会在每次调用时重新检查，因此把其中一个*关掉*，对正在运行的会话同样生效。

还有两个工具走的是同一条通道，但没有属于自己的设置开关：**`task_progress`** 和 **`task_complete`**，它们让智能体为正在执行的[任务](/zh/guide/tasks)上报进展里程碑和最终结论。它们只会注入到任务引擎启动的那些进程中，因此普通对话永远看不到它们。

有两个实际的后果，二者都植根于它的交付方式：

- **它就住在其父进程旁边。** 安装程序、Docker 镜像和桌面捆绑包都将 `codeg-mcp` 放在 `codeg` / `codeg-server` 旁边。若源码构建采用了不寻常的布局，可以用 **`CODEG_MCP_BIN=/abs/path/codeg-mcp`** 明确指向它。
- **它是可选的，且优雅降级。** 如果伴生程序缺失，委派会被直接跳过 —— 仅记录一条警告，会话的其余部分正常运行。

这一切面向用户的一面是[使用多个智能体](/zh/guide/multi-agent)；本页则是其底层的管道。

## 电脑操作与 `codeg-computer-helper` {#computer-use-and-codeg-computer-helper}

[电脑操作](/zh/guide/computer-use)需要一个能截取窗口画面、并向窗口发送输入的进程，而 Codeg 刻意不让自己的进程来做这件事。做这件事的是 **helper**：Codeg 在首次需要电脑操作时启动它，helper 再把 **cua-driver** —— 负责读取和点击的开源驱动 —— 作为自己的子进程运行，并在每次启动前核对驱动的摘要与钉住的值是否一致。Codeg 通过一条私有通道与 helper 通信，每个请求都带着当前的*停止*计数，因此在你按下停止之前发出的请求，即使在那之后才到达，也会被拒绝。

- **在 macOS 上**，helper 是一个独立的应用 `codeg-computer-helper.app`，随 Codeg 的应用包一起分发，并从 Codeg 应用支持目录中的一份副本运行。辅助功能和屏幕录制权限授予的是**它**，而不是 Codeg —— 因此智能体在 Codeg 下通过 shell 运行的任何东西都不会继承这些权限 —— 而且在 Codeg 的签名发布版里，它会核实与它通信的确实是 Codeg。→ [为什么由 helper 持有权限](/zh/guide/computer-use#why-a-helper-holds-the-permissions-on-macos)
- **在 Windows 和 Linux 上**，它是放在 `codeg` 旁边的一个普通二进制文件，也无从做这样的隔离：在这两个平台上，你运行的任何程序都能截取屏幕、注入输入。
- **在服务器上**，`codeg-server` 使用安装在它旁边的 helper —— 发布压缩包和安装脚本都附带了一个 —— 并且只在以 `CODEG_COMPUTER_USE=1` 启动时才会使用。Docker 镜像里没有 helper。

这个 helper 会随启动它的那个 Codeg 一起退出；它写到错误输出的内容 —— 包括驱动的输出 —— 都会进入 Codeg 自己的[日志](/zh/reference/settings/logs)。

## 你的数据存放在哪里 {#where-your-data-lives}

Codeg 将其状态保存在**本地机器**上。它的[数据目录](/zh/getting-started/configuration#where-codeg-stores-its-data) —— 即平台自己的数据目录，例如 macOS 上桌面应用的 `~/Library/Application Support/app.codeg`，或服务器上的 `CODEG_DATA_DIR` —— 存放 **SQLite 数据库**（对话、设置、账户元数据），以及**上传**和**[日志](/zh/reference/settings/logs)**目录。你的**[技能](/zh/guide/skills)**存放在 **`~/.codeg/`** 之下，它会随 `CODEG_HOME` 移动 —— 而一旦设置了 `CODEG_HOME`，上传和日志也会随它一起搬过去。机密是刻意的例外：在桌面端，令牌会进入**操作系统密钥环**，而非上述任何文件 —— 这一拆分在[版本控制](/zh/reference/settings/version-control)以及[数据与同步](/zh/reference/settings/system#backup-restore)中都有描述。Codeg 自己记录的智能体历史 —— 它为自定义智能体以及 ZCode、TRAE CLI 和 Command Code 写下的 `acp-transcripts` —— 也存放在数据目录中，除非设置了 `CODEG_HOME`，那样它会一起挪过去。

中间没有 Codeg 云。桌面应用和你运行的服务器都将一切保留在它们运行所在的机器上；唯一离开的，只是智能体自身对你所配置的模型提供商的调用 —— 以及你自己打开的东西，比如 Claude Code 的远程控制，或者用于配置同步的 WebDAV 服务器。[隐私与安全](/zh/reference/privacy)介绍了这在实践中意味着什么。

## 值得了解 {#good-to-know}

- **四个二进制文件，一套代码库。** `codeg`、`codeg-server`、`codeg-mcp` 和 `codeg-computer-helper` 是同一 Rust 工作区、同一 `codeg_lib` 核心之上的构建目标 —— 而不是需要保持同步的四个独立程序。
- **桌面应用和服务器是同一个应用。** 区别在于传输方式（Tauri IPC 对 HTTP/WebSocket），而非功能集 —— [Web 服务](/zh/reference/settings/web-service)界面和[无头部署](/zh/getting-started/deployment)是访问同一份 UI 的两种途径。
- **移动端是客户端，而不是另一套核心。** iOS 与 Android 通过经过认证的 API 连接；项目和智能体仍运行在桌面端或服务器主机上。
- **智能体依旧是智能体。** Codeg 通过 ACP 编排官方 CLI；它不会 fork 或替换它们，因此每个智能体都保留自己的行为、认证和更新。
- **`codeg-mcp` 是按会话且用后即弃的。** 每次智能体启动会生成一个，并随其退出；失去它只会让你损失它提供的工具 —— 委派和会话内工具 —— 别无其他。

## 相关内容 {#related}

- [部署](/zh/getting-started/deployment) —— 将 `codeg-server`（或 Docker）作为同一核心的无头部署来运行。
- [Web 服务](/zh/reference/settings/web-service) —— 桌面应用通往浏览器 UI 的自有前门。
- [下载与安装](/zh/getting-started/installation#mobile-apps) —— 获取原生客户端，并将其连接到 Codeg 主机。
- [使用多个智能体](/zh/guide/multi-agent) —— `codeg-mcp` 所实现的委派功能。
- [协作](/zh/reference/settings/collaboration) —— 决定每个智能体接收哪些 `codeg-mcp` 工具的开关。
- [电脑操作](/zh/guide/computer-use) —— `codeg-computer-helper` 为你做了什么。
- [隐私与安全](/zh/reference/privacy) —— 哪些内容留在本地，哪些离开去往模型提供商。
