---
title: 认证与模型
description: 用智能体自己的订阅、提供商 API 密钥或自定义端点为其登录——然后选择它运行的模型，并了解每一份凭据的存放位置。
---

# 认证与模型

Codeg 不附带自己的任何模型。每个智能体都带来自己的凭据——你已经在付费的订阅、一个提供商 API 密钥，或一个兼容的端点——并与它自己的模型通信。本页讲的是让一个智能体完成认证以便它能运行，以及在它能运行之后选择它使用哪个模型。

你按智能体逐个进行，在**设置 → 智能体**中：打开一个智能体，它的详情面板会显示适用于它的登录选项——[各智能体配置](/zh/guide/agent-setup)逐一介绍了每个面板。一个独立的**模型提供商**面板为支持它们的智能体保存可复用的凭据。启用一个智能体并确认它状态正常是第一步——参见[使用智能体](/zh/guide/agents)——而[支持的智能体](/zh/guide/supported-agents)是这一切所适用的名单。

## 智能体如何认证 {#how-agents-authenticate}

由于每个智能体都以自己的方式进行认证，它的详情面板只提供对它有意义的选项——通常是单个**认证模式**下拉菜单。在整个名单中，这些选项呈现为三种形态：

- **智能体自己的账户**——用你已经拥有的订阅或套餐登录（Anthropic、ChatGPT、Google 等等）。Codeg 会复用智能体自己的登录；你无需交给它一个密钥。
- **一个提供商 API 密钥和端点**——直接在智能体的卡片中输入一个 API URL 和密钥，以便通过某个 API 账户或兼容网关计费。这就是**自定义端点**选项。
- **一个已保存的模型提供商**——把智能体指向一份你已存储一次的可复用凭据。适用于 **Claude Code、Codex 和 Gemini**。

这些是互斥的：一个智能体一次只使用一种，切换认证模式会在它们之间切换。接下来的三节将逐一讲解。

最新的四个智能体完全没有认证模式下拉菜单。**Kiro CLI**、**TRAE CLI** 和 **Command Code** 用它们自己的登录命令登录，在终端里运行一次即可——TRAE CLI 和 Command Code 的面板会给出这条命令，并带一个复制按钮——并为打不开浏览器的机器提供一个可选的密钥或令牌；**ZCode** 则完全在官方 ZCode 应用里登录。见下文。

## 用订阅登录 {#sign-in-with-a-subscription}

最简单的路径是使用智能体自己的订阅——也就是你在它的 CLI 中会使用的套餐。对大多数智能体而言，这意味着在终端里**通过智能体自己的工具登录一次**；随后 Codeg 会复用那次登录，不会额外存储任何东西：

- **Claude Code**——选择**官网订阅**，Codeg 就会使用你现有的 `claude` 登录。无需密钥。
- **Gemini**——选择 **Google 登录（OAuth）**，并先在终端中运行 `gemini` 来完成 Google 的登录。
- **Kimi Code**、**CodeBuddy**——在终端中运行智能体自己的登录命令（`kimi login`、`codebuddy`），Codeg 会自动识别它。Kimi Code 走 API 密钥这条路时另有一个自己的面板。→ [Kimi Code](/zh/guide/agent-setup#kimi-code-provider-model-and-reasoning)
- **Kiro CLI**、**TRAE CLI**、**Command Code**——在终端里运行一次智能体自己的登录命令：`kiro-cli login`、`traecli login`（用你的企业 SSO）或 `command-code login`；TRAE CLI 和 Command Code 的面板会给出这条命令，并带一个复制按钮。在服务器或容器上，它们各自改用一份凭据：Kiro 的 **API Key**（`KIRO_API_KEY`）、TRAE CLI 的**个人访问令牌**（Codeg 会在每次启动会话时用它登录），以及 Command Code 的 **API 密钥**（`COMMAND_CODE_API_KEY`，它优先于那次登录）。→ [各智能体配置](/zh/guide/agent-setup#kiro-cli)
- **ZCode**——在官方 ZCode 里登录即可；Codeg 运行的桥接器会复用那次登录，Codeg 不复制任何东西。ZCode 的 **Start Plan** 账户无法通过桥接器运行，因为它的请求需要验证码，而只有 ZCode 桌面应用能完成；GLM Coding Plan 账户可以正常使用。→ [ZCode](/zh/guide/agent-setup#zcode)
- **Grok** 和 **Cursor** 各自拥有一个**认证方式**选择器：
  - **Grok**——**官网订阅**（通过 `grok login` 使用 SuperGrok 或 X Premium+；不存储任何东西）、**XAI API 密钥**（来自 xAI 控制台的密钥，用于无人值守运行），或**自定义接口**（一个带有自己的基础 URL 和密钥的自定义模型，它会成为 Grok 的默认模型）。
  - **Cursor**——**官网订阅**，此时 Codeg 会向你展示需要运行的 `cursor-agent login` 命令（会打开一个浏览器窗口），你刷新后它会显示**已登录**；或者使用来自 Cursor 控制台的 **Cursor API 密钥**，用于无人值守和服务器机器。请注意该密钥是一个 *Cursor 账户*密钥——`cursor-agent` 只与 Cursor 自己的后端通信，因此它并非通往第三方端点的途径。Codeg 会把两者都写入与该 CLI 共享的 `~/.cursor/cli-config.json`。自 **0.31.2** 起，Codeg 还会检查存着的登录是否仍然可用，而不是轻信 CLI 的一面之词。→ [Cursor](/zh/guide/agent-setup#cursor)

集成终端（**⌘J**）就在手边，供你完成这些一次性登录。

**Codex 是例外**——它在 Codeg *内部*登录。选择**官网订阅**并点击**使用 ChatGPT 登录**：Codeg 会显示一个代码和一个验证链接，你在浏览器中批准它，面板便会以绿色的**账户已登录**予以确认。随时再次点击即可重新登录或切换账户。

## 用 API 密钥或自定义端点连接 {#connect-with-an-api-key-or-custom-endpoint}

更愿意按 API 调用付费，或通过一个 OpenAI/Anthropic/Gemini 兼容的网关来路由？在智能体的认证模式中选择**自定义接口**并填写：

- **API URL**——你的提供商或网关的基础 URL。
- **API Key**——你的密钥，带有一个显示/隐藏切换。
- **Model**——要请求的模型 id（在智能体需要时填写）。

Codeg 会在智能体启动时把这些交给它。大多数智能体都接受这条路径，实际显示的字段取决于该智能体所能理解的内容。Kiro CLI、ZCode、TRAE CLI 和 Command Code 不提供这条路径：它们各自只与自己的服务通信（TRAE CLI 的面板可以改为把它指向你所在组织自己部署的 TRAE）。

## 保存并复用模型提供商 {#save-and-reuse-a-model-provider}

如果你在多个端点之间切换，或希望一份凭据在多个会话之间共享，那就把它保存为一个**模型提供商**，而不必反复输入。此功能适用于 **Claude Code、Codex 和 Gemini**——这三者的 CLI 能够干净利落地接受基础 URL 和密钥的覆盖。

1. 前往**设置 → 模型供应商 → 添加供应商**。
2. 给它一个**名称**、一个 **API URL**、一个 **API Key**、它所面向的**智能体类型**，以及一个**模型**。**Claude Code** 类型的提供商拿到的则是 Claude Code 的一组模型槽位，而不是单个模型——一个主模型和一个推理模型、每个档次各一个默认模型（**Haiku**、**Sonnet**、**Opus**，以及自 **0.32.3** 起的 **Fable**），外加一个用于模型选择器的自定义条目。
3. 在**设置 → 智能体**中打开那个智能体，把它的认证模式设为**模型供应商**，然后选择你保存的那个。

一旦绑定，智能体的 API 字段会显示为只读，由该提供商填充——而对 Claude Code 来说，提供商对每一个模型槽位都说了算：它填了的槽位会设到智能体上，它留空的槽位会被清空，因此早先配置留下的东西不会残留在底下。在 Claude Code 上，把认证模式从**模型供应商**切走再切回来，会保留你之前选中的那个提供商——在 **0.32.3** 之前，它会改绑到你最早创建的那个提供商，并把它的模型保存下来。之后编辑某个提供商时，Codeg 会标记出任何需要**重新连接**才能采用该更改的运行中会话。

::: tip 自定义端点与模型提供商的区别
它们配置的是同一样东西——一个基础 URL、一个密钥和一个模型——但作用范围不同。**自定义接口**是在单个智能体上内联输入的；而**模型提供商**是一条你设置一次并复用的具名记录。如果你只为一个智能体使用一个端点，自定义端点更简单；如果你要同时应付好几个，就把它们保存为提供商。（提供商一经创建，它的智能体类型就固定了。）
:::

## 选择一个模型 {#choose-a-model}

你能选哪些模型，取决于**智能体**，而非 Codeg。一旦某个智能体连接上，composer 的[智能体设置按钮](/zh/guide/conversations#start-a-session-—-the-composer)里的模型列表会准确列出该智能体针对你的登录方式所提供的模型——因此选择会因智能体而异。列表较长时会带一个搜索框，智能体推荐的模型也会被标出来。在那里选一个，它就会对该对话生效。

- **Codeg 会为每个智能体记住你上次的选择**，并在你下次用该智能体开启会话时预选它。
- **没有按文件夹设置的模型默认值**——模型是在会话层面选择的。（文件夹默认值设定的是*智能体*，而非模型。）
- **重新打开的 Claude Code 历史，会在模型具备 1M 窗口时按 1M 计算。** 自 **0.35.0** 起，对于原生具备 1M 窗口的模型——Opus 4.7 及之后、Sonnet 5 及之后、Haiku 5.5、Fable 和 Mythos——你重新打开的 Claude Code 对话，其上下文圆环会以 **1M** 而不是 200K 为基准来计算。窗口大小并不会被存下来，所以旧对话会在下一次被读取时用上它。同一个版本还把 **Claude Haiku 5.5** 设为推荐的 Haiku 模型，在 Claude Code 的面板上和模型供应商的对话框里都是如此。
- **保存在 *(1M context)* 条目上的 Claude Code 对话依然能用。** 自 Claude Code **2.1.285** 起，通过自定义 API 地址接入的网关只会列出普通模型——它们默认就使用 1M 窗口——而有些账户更早就已经没有单独的 *Opus (1M context)* 条目了。设在这类条目上的对话会改用与它对应的普通模型继续，而不是退回默认模型。如果你的网关上限是 200K，Claude Code 自己的建议是 `/autocompact 200k`。
- **保存下来的 Fable 选择在 Claude Code 2.1.287 下依然有效。** 这个版本随适配器 **0.86.0** 自 Codeg **0.34.0** 起内置，它把 Fable 条目从 `claude-fable-5-1` 改成了 `fable`，于是 Codeg 保存的 Fable 选择对不上任何条目，每次连接都会退回默认模型。现在 Codeg 会把这个选择转到唯一一个指向同一模型的条目上——按它的名称 *Fable 5.1*、按它描述的开头，或者按 **Fable 默认模型**槽位（模型供应商里叫**默认 Fable 模型**）钉住的 id 来认——前提是还有条目指向这个版本；*(1M context)* 的 Fable 选择也按同样方式转过去。如果没有条目指向它，或者有不止一个，就什么都不转，会话使用 Claude Code 的默认模型。保存下来的选择本身不会被改写——重新选一次 Fable，就会存下新的 id。
- **模型一律按其所属智能体的叫法显示。** 自 **0.31.0** 起，Codeg 会记录智能体模型选择器公布的 id/名称对应关系，因此回复页脚、会话详情和侧边栏悬浮胶囊显示的是 `Qwen3.8-Flash`，而不是会话记录里那个形如 `qfmodel` 的账号内部 id。

**推理强度**在 composer 里按会话设置——只有少数几个智能体的面板补上了 composer 表达不了的东西：

- **Grok** 保留着设置面板里的下拉，从低一直到 **Max**，写进 Grok 自己的配置。
- **Claude Code** 和 **Codex** 曾经也有，直到 **0.30.0** 把两个都删掉了。它们读起来像是决定一轮「想多深」的旋钮，而真正说了算的是 composer 里按会话的选择器，于是两者可能各说各话，屏幕上还没有任何东西说明谁赢了。已经写进配置文件的 `effortLevel` 会被**原样留着**，而不是顺手清理掉。
- **Pi** 的做法更像 Kimi Code 而不是 Grok：因为 pi 只会为*声明*了自己会思考的模型发送强度，它的面板正是你做这个声明的地方 —— 一个开关、你的模型接受 pi 七个档位中的哪些，以及每一档实际发出去的值。自 **0.32.3** 起，这些档位一直到**最高**，面板还会说明 pi 实际会以哪一档运行所选模型。→ [Pi：自定义供应商上的思考强度](/zh/guide/agent-setup#pi-reasoning-on-a-custom-provider) · [每个模型能思考到哪一档](/zh/guide/agent-setup#pi-thinking-levels-and-version)
- **Kimi Code** 则反过来：它的面板负责声明有哪些级别*存在*，再由 composer 的思考选择器把它们呈现出来。→ [Kimi Code](/zh/guide/agent-setup#kimi-code-provider-model-and-reasoning)
- **Cursor** 把强度当作它的模型的一个旋钮——在它的设置页上，它附在会话起步时所用的模型上；会话跑起来之后，它又成了一项独立的设置。→ [Cursor：族系加旋钮](/zh/guide/agent-setup#cursor-families-and-knobs-not-two-hundred-ids)
- **Kiro CLI** 只为支持它们的模型提供 **Thinking** 和 **Reasoning effort**，这两项设置由 Codeg 根据 Kiro 报告的内容拼出来。→ [Kiro CLI](/zh/guide/agent-setup#kiro-cli)

## 凭据存储在何处 {#where-credentials-are-stored}

Codeg 把智能体凭据保存在智能体自己保存的地方——不会有任何内容上传到 Codeg：

- **智能体自己的原生配置。** 由智能体的 CLI 处理的订阅登录或密钥会留在该智能体的文件中——`~/.codex/auth.json`、`~/.hermes/.env`、`~/.grok/auth.json`、Kiro 的 `~/.kiro`、TRAE CLI 的 `~/.trae`、Command Code 的 `~/.commandcode/auth.json` 等等——正是智能体自己的工具存放它的地方。ZCode 的登录状态则留在 ZCode 应用内部。
- **Codeg 的本地数据库。** 你输入到 Codeg UI 中的密钥——自定义端点密钥、已保存的模型提供商，以及 Kiro CLI、TRAE CLI 或 Command Code 面板上的密钥或令牌——由 Codeg 存储在本地，并在智能体启动时作为环境变量注入。与智能体自己的配置文件一样，它们在静态时并未加密，而遮蔽显示只是表面功夫——因此请把对你机器的访问权限视为安全边界。

这与 **git 账户**令牌是分开的，后者*确实*保存在你的系统密钥环中。→ [git 账户](/zh/guide/git#git-accounts)

## 后续步骤 {#next-steps}

- [**使用智能体**](/zh/guide/agents)——在登录之前，先启用一个智能体并运行它的预检。
- [**支持的智能体**](/zh/guide/supported-agents)——完整名单，以及每个智能体是什么。
- [**多智能体协作**](/zh/guide/multi-agent)——你的智能体登录之后，让它们协同工作。
