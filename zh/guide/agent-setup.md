---
title: 各智能体配置
description: 逐个介绍 Codeg 驱动的每个智能体有哪些独特之处——它如何登录、它的设置页上有哪些开关、有哪些值得提前知道的脾性——从 Claude Code、Codex 到 Kiro、ZCode、TRAE CLI 和 Command Code。
---

# 各智能体配置

每个智能体在**设置 → 智能体**里都有同一套通用控件——启用开关、预检、环境变量，以及智能体有原始配置时的原始配置编辑器——这些在[使用智能体](/zh/guide/agents)里介绍。除此之外，每个智能体的详情面板还带着只属于它的东西：它怎么登录、它的 CLI 认得哪些开关，以及在依赖它之前值得知道的脾性。本页按智能体列表的顺序，一个一个地讲。

名单本身——每个智能体由谁出品、跑在什么之上、把会话存在哪里——见[支持的智能体](/zh/guide/supported-agents)；它们共用的登录方式见[认证与模型](/zh/guide/authentication)。

## Claude Code {#claude-code}

Anthropic 的编程智能体。Codeg 为它安装的是 **`claude-agent-acp`** 适配器，而不是 `claude` CLI——两者的区别见 [ACP 适配器](/zh/guide/supported-agents#acp-adapters)——而这个适配器读取的是同一个 `~/.claude` 目录，所以你已有的登录会直接沿用。面板里可以用**官网订阅**、**自定义接口**或已保存的[模型提供商](/zh/guide/authentication#save-and-reuse-a-model-provider)让它登录。

自 **0.37.0** 起，Claude Code 适配器的两项能力在 Codeg 里也用得上了：它会[建议你的下一条提示词](/zh/guide/conversations#let-claude-code-suggest-the-next-prompt)——代价是大多数回合之后多发一次请求——而[远程控制](/zh/guide/conversations#continue-on-your-phone-—-remote-control)让你把会话带到手机上继续。你为 Claude Code 定义的自定义子智能体，会作为一个 **Agent** 选项出现在 composer 的智能体设置按钮里。

### 归属标识与遥测 {#claude-code-attribution-and-telemetry}

Claude Code 的面板带有两个开关，Codeg 特意让它们与 Claude Code 自身的默认值相反：

- **向接口发送归属/计费标识**——**关闭**，因此 Codeg 不会添加该标识性请求头。
- **禁用遥测或多余的网络请求**——**开启**，因此非必要流量保持关闭。

Codeg 会明确写入这两项，而不是任其隐含，因此面板上显示的就是实际生效的。如果你的环境需要，可以把任一项改回去——比如按归属请求头计费的受管账户。→ [隐私](/zh/reference/privacy)

## Codex {#codex}

OpenAI 的编程智能体，同样经由一个适配器 **`codex-acp`** 驱动——见 [ACP 适配器](/zh/guide/supported-agents#acp-adapters)。它是那个在 Codeg *内部*登录的智能体：选择**官网订阅**，**使用 ChatGPT 登录**会显示一个代码和一个链接，供你在浏览器里批准。→ [用订阅登录](/zh/guide/authentication#sign-in-with-a-subscription)

### 沙箱与审批 {#codex-sandbox-and-approvals}

Codex 的面板中有一个**沙箱与审批**分组——对应两个问题：它能触及多少，以及何时停下来询问：

- **审批策略**——Codex 请求许可的积极程度：**按需询问**（由它自行决定何时询问）、**仅信任只读**（只有已知安全的只读命令才会无人值守运行）、**从不询问**（完全没有提示），或**精细控制**，即按提示类型分别设置——shell 提权、策略规则、技能脚本、权限请求以及 MCP 提示——每一类要么展示给你，要么自动拒绝。若不作设置，它会遵循 Codex 自己"按需询问"的默认行为。
- **沙箱模式**——它能写入什么：**只读**、**可写工作区**或**完全放开（无沙箱）**。可写工作区还会增加**额外可写目录**（绝对路径，每行一个），以及用于**网络访问**、是否排除 **TMPDIR** 和 **/tmp** 的开关——默认全部关闭。

有两点需要了解：这些会写入你全局的 `~/.codex/config.toml`，因此 `codex` CLI 及其 IDE 会话也会读取它们；而且它们是**线程默认值**——它们管辖 Codex 自行开启的那些回合。普通提示在什么规则下运行，取决于会话当前所处的**模式**：会话*起始*时的模式由 Codeg 依据这两项设置推导出来，此后则由 composer 的模式选择器决定。更改后需重启会话方能生效。在 Windows 上，除非你启用了 Codex 的实验性 Windows 沙箱，可写工作区会回退为只读。

#### Codex 的模式 {#codex-modes}

composer 提供的是 Codex 自己的四个预设，在任何语言下都沿用英文名称。自 codex-acp **2.0**（Codeg **0.32.3**）起，它们是：

| 模式 | 可以写入什么 | 越权请求由谁应答 |
| --- | --- | --- |
| **Read-only** | 什么都不能写——每次编辑前 Codex 都会询问 | 你 |
| **Workspace access** | 工作区 | 你——针对工作区之外的一切 |
| **Auto review** *（默认）* | 工作区 | 一个模型：它筛查每个请求，只把看起来不安全的拿来问你 |
| **Full access** | 一切——没有沙箱 | 没有人：什么都不会问 |

*Auto review* 在 2.0 之前叫 *Approve for me*。此外，你之前停在 *Ask for approval* 上的会话，现在会以 **Read-only** 打开——这比听起来更严格，因为在 1.7 到 1.13 版的适配器上，那个预设带的是一个**可写**的工作区：这些版本根本没有提供只读沙箱，是 2.0 把它恢复了。想重新自由编辑工作区、而其他一切照旧先问你，就选 **Workspace access**。

会话**起始**时处于哪个模式，取决于你的配置：

| 在 `~/.codex/config.toml` 中 | 会话起始于 |
| --- | --- |
| `sandbox_mode = "read-only"` | Read-only |
| `workspace-write`，审批策略为 `never` | Auto review |
| `workspace-write`，审批策略为其他任意值 | Workspace access |
| `danger-full-access`，审批策略为 `never` | Full access |
| `danger-full-access`，审批策略为其他任意值 | Workspace access——收紧的是沙箱，而不是去掉审批 |
| 没有 `sandbox_mode` | 适配器的默认值，即 Auto review |

在早于 2.0 的适配器上，这两行 *Workspace access* 改为起始于 Auto review。Full access 只会出自两项设置都精确匹配的情况——不会有任何推断把会话带进它——而文件里一旦有 `default_permissions` 配置档，Codeg 就完全不参与推导，因为 Codex 会通过那个配置档解析，推导出的模式反而会把它覆盖掉。

::: warning 「仅信任只读」在这里没有对应项
**仅信任只读**是唯一无法被兑现的审批策略：适配器的预设里没有一个与它对应，因此 Codeg 会话会把它当作**按需询问**处理——由模型决定何时发问，而沙箱本就允许的操作不再提示。面板会如实说明这一点，而不是让这个控件看起来生效了。如果你原本是靠「仅信任只读」来做约束的，请改为收紧**沙箱模式**。

在 **0.25** 之前，这两项设置根本到不了 Codeg 会话——适配器每个回合都会重新发送它自己的策略，于是一个被明确设为只读的沙箱可能被悄悄放宽。推导起始模式正是对此的修复，而它以**沙箱模式**为准，因为那正是猜错会*扩大*访问范围的那条轴：这个推导绝不会选出比你设定的更宽的沙箱。（它做不到的，是补上适配器本身就没有的沙箱——这就是上文 1.7 到 1.13 那段空缺的由来。）
:::

同一个面板里还有两个开关值得知道：

- **默认模式下允许提问。** Codex 只在 *Plan* 模式下才允许调用它的 `request_user_input` 工具，所以在普通的一轮里，它的提问会被直接拒绝，**你根本不会收到任何提问卡片**——智能体问了、被告知工具不可用，然后继续靠猜。打开这个开关，它在普通轮次里也能向你发问。它会把 `[features].default_mode_request_user_input` 写进你的 `~/.codex/config.toml` —— 与 Codex 自己的 `codex features enable` 所设置的是同一个键，而这个标志在上游仍处于开发中。功能标志在线程创建时解析，因此它**在你下一个会话中才生效**，而不是当前已打开的这个。
- **自定义模型**可以按两种形态添加。默认那种克隆的是原生 GPT 条目；如果要接第三方网关，请选 **OpenAI 兼容**那种，Codex 会发出一个朴素的 Responses 请求——不带 code-mode 工具、不带 multi-agent、不带 responses-lite、不带自定义的 apply-patch 工具——而这样一个朴素的 Responses 请求，正是这类网关所能处理的全部。它是叠在普通逐项覆盖之上的一个预设，所以已经存在的模型也可以随时在两种形态之间切换。
- **新的官方模型会自己出现。** 一份自定义过的列表——你在里面加过模型，或去掉过官方模型——以前会把 Codex 自己的模型表整个替换掉，于是 OpenAI 后来发布的模型一直不会出现，直到你刷新列表并重新保存。自 **0.32.4** 起，每当 Codex 被安装或升级，Codeg 都会尝试重建这份列表：先是你自己的模型，再是按 Codex 自己的顺序排列的每一个官方模型，减去你移除的那些——它们会继续保持移除。如果读不到已安装的 Codex 的模型列表，你现有的列表就保持原样。
- **默认模型就是 Codex 自己的默认模型。** 一个从未选过模型的 Codex 对话，跑的是 Codex 的默认模型——自 **0.32.4** 起是 **GPT-6.1 Sol**。如果你给 Codex 用的供应商还不提供它，请在 composer 里选一个模型，或填写该供应商的**模型**字段。

## Gemini {#gemini}

Google 官方的 Gemini CLI，通过 `npx` 运行。选择 **Google 登录（OAuth）**，并先在终端里运行一次 `gemini` 完成 Google 的登录；也可以用**自定义接口**或已保存的[模型提供商](/zh/guide/authentication#save-and-reuse-a-model-provider)。它的会话存放在 `~/.gemini` 下，`GEMINI_CLI_HOME` 可以把它挪走——它指的是 `.gemini` *上一级*的目录，和 Antigravity 的 `GEMINI_HOME` 不是同一种约定。→ [每个智能体把会话保存在何处](/zh/guide/supported-agents#where-each-agent-keeps-its-sessions)

## OpenClaw {#openclaw}

一个由你自己托管的个人 AI 助手，通过 `npx` 运行。它**拒绝 MCP 服务器**，所以你的 MCP 服务器一个也到不了 OpenClaw 会话，它也无法发起[委派](/zh/guide/multi-agent)——不过别的智能体可以把任务委派*给*它。它的会话存储 `~/.openclaw/agents/` 不能挪位置。

## OpenCode {#opencode}

一个开源编程智能体，Codeg 会为你的平台下载它的原生二进制文件。你自己装的那一份也会被识别——**OpenCode 2.x** 也一样，因为 Codeg 会先问它接受哪些启动参数，而不是直接递给它 1.x 的那一套。

### 不用写 JSON 的权限配置 {#opencode-permissions-without-the-json}

OpenCode 用 `opencode.json` 里的 `permission` 块来决定哪些操作可以无人值守地运行。它设置页上的一张**权限**卡片替你编辑这个块：

- **自动接受所有权限**——一个开关，一条放行一切的规则。它同时会清掉其他还能拦下运行的地方，因为残留的按智能体配置块或旧版配置块会悄悄地把它覆盖掉。
- **全局默认**——那条 `*` 规则：对下方没有单独覆盖的一切采取**允许**、**询问**还是**拒绝**。
- **逐工具权限**——OpenCode 已发布 schema 中所列的每个工具各一项：执行 shell 命令、修改文件、读取文件、访问工作目录之外的路径、启动子智能体、加载技能、搜索、抓取网页等等，每一项都配有一行说明它涵盖什么。
- 对支持模式匹配的工具还有**细粒度规则**——`*` 匹配任意字符，`?` 精确匹配一个，开头的 `~` 展开为你的主目录。

这张卡片真正要解决的坑是**顺序**。OpenCode 会把整个块摊平成一个列表，并取**最后**一条匹配，因此写在 `bash` *之后*的一条 `*` 会悄悄把它覆盖掉——你精心写下的规则确实在文件里，却什么也没做。Codeg 总是把 `*` 写在最前面；而一个反着写的文件会**被标出并附上「修正顺序」按钮**，而不是被当作正在生效的样子渲染出来。当两条互相重叠的模式并不存在唯一正确顺序时，它会如实说明，把选择权留给你。

权限块之外的每一个键都会原封不动地熬过这次编辑，而一个 Codeg 无法解析的文件会让**可视化编辑器暂停**，而不是被改写。

面板上**行为与压缩**卡片里的**会话分享**已经不起作用了：OpenCode 在 **1.19.1** 中停止了会话分享，而 Codeg 从 **0.36.0** 起就内置了这个版本——这一项的提示文字也写明了这一点。另外，在 macOS 27 上，构建必须带有有效签名才能启动：OpenCode 第一个签名正确的构建是 **1.18.34**，而自 **0.37.0** 起固定的 **1.19.3** 在 Apple Silicon 和 Intel 上都签名正确。

## Cline {#cline}

一个自主编程智能体 CLI，通过 `npx` 运行。

::: warning macOS 27 上的 Cline
macOS 27 会在启动时直接杀掉 Cline **3.0.65 及更早版本**，因为这些构建带着损坏的签名——CLI 一启动就退出，会话在开始后一秒之内就会死掉。在 Apple Silicon 上，从 **3.0.66** 起的构建都能通过签名检查，Codeg 自 **0.37.0** 起固定的 **3.0.73** 也在其中；如果你的版本更旧，请在设置 → 智能体中按**升级**。3.0.66 到 3.0.73 的 **Intel** 构建仍然通不过严格检查，而 macOS 27 是否会拦下它，目前还没有测试过。
:::

0.36 和 0.37 带来的三处变化值得了解：

- **没有 Codeg 的工具。** Cline 从不连接通过 ACP 递给它的 MCP 服务器，所以自 **0.36.0** 起，Codeg 不再把自己的伴随服务递给它。这意味着 Cline 会话里没有[委派](/zh/guide/multi-agent)、实时反馈、提问卡片、浏览器或电脑操作工具——而且应用里没有任何地方会提示这一点。Cline 自己设置里的 MCP 服务器（也就是设置 → MCP 写入的那些）照常工作。
- **它停留在 Codeg 安装的那个版本上。** 自 **0.37.0** 起，Codeg 以 `CLINE_NO_AUTO_UPDATE=1` 启动它，因此 Cline 不会再在一段对话关闭后把自己更新到最新发布版本。
- **对话中途切换模型现在能生效了**，你重新打开一段 Cline 对话时 Codeg 重新应用的模型也一样：自 **0.37.0** 起，每个会话都运行在 Codeg 启动的那个 `cline --acp` 进程里，而不是跑在 Cline 共享的 hub 上。**Plan** 和 **Act** 仍然只在 Cline 开始处理一段对话时才生效，所以在第一条消息之后切换不会有任何效果，除非 Cline 改变这一点。

## Hermes {#hermes}

Nous Research 的自我进化智能体，自己管理着一整套模型提供商。

::: info Hermes 在 0.24 改用 npm
Hermes 原本是这里唯一的 Python 条目，通过 `uv` 安装。上游停用了那条渠道——PyPI 停在 **0.19.0**——因此 Codeg 的托管安装改成了一个固定在经过审计的确切版本上的 npm 包：它的安装步骤会检出官方的 Hermes 发布版，并在包内部引导出**一套隔离的 Python 环境**——自 **0.35.0** 起是 Python 3.14，升级时会重建这套环境。你依然不需要管理任何 Python 环境，只是这套环境不再位于你机器上的 `uv` 里了。配置与凭据仍然原样留在 `~/.hermes`。

有两个实际影响：托管安装在下载时会遵循 **`HTTP_PROXY` / `HTTPS_PROXY`**；而如果你有一份用**官方安装程序**装的 Hermes，那一份依然比托管的那份优先——它会自我更新，所以 Codeg 让位给它，而不是把它盖住。Codeg 先找应用的 `PATH`，再找 `~/.local/bin`，最后才是 npm 自己的目录，所以在那个 `PATH` 上排在前面的另一个 `hermes` 仍然优先。`~/.local/bin` 这一步是 **0.35.0** 新加的：安装程序会把 Hermes 放在那里，而桌面应用的 `PATH` 里常常没有这个目录，Codeg 以前不从终端启动时就会漏掉这一份。
:::

### 选择一个提供商 {#hermes-pick-a-provider}

Hermes 是一个特例——它管理着自己旗下的一批模型提供商，因此它没有单个密钥，而是有自己的配置面板，带一个**供应商**下拉菜单，按三种方式分组：

- **API 密钥**提供商——输入你的密钥（如果该提供商需要，还有一个基础 URL）以及一个模型名称。密钥会保存到 Hermes 自己的 `~/.hermes/.env` 中。
- **OAuth** 提供商（Nous、OpenAI Codex、Gemini、GitHub Copilot 等）——无需输入密钥；点击**运行 Hermes 设置**，Hermes 会在终端中为你完成认证。
- **AWS**（Bedrock）——使用你环境中现有的 AWS 凭据。

对于面板未涵盖的任何内容，**打开配置文件夹**会显示 `~/.hermes`，而一个高级部分让你直接编辑 Hermes 的 `config.yaml`。

## CodeBuddy {#codebuddy}

腾讯云的 AI 编程助手，通过 `npx` 运行。在终端里运行一次 `codebuddy` 完成登录，Codeg 就会自动识别那次登录。

在 CodeBuddy 自己的终端里、用 **2.168.2** 开启的对话，会把每一步都交给同一个 REPL 工具执行，所以它在 Codeg 里每一步都显示为一张 **REPL** 卡片；在 Codeg 里开启的对话不受影响。自 **0.36.0** 起，重新打开的对话会按你输入时的样子显示斜杠命令，而不是它展开后的提示词。

## Kimi Code {#kimi-code}

月之暗面（Moonshot AI）的 CLI 编程助手，通过 `npx` 运行。如果你的账户在 **kimi.ai** 而不是 kimi.com，登录需要 `kimi login --region global`。少了这个参数，CLI 总是指向 kimi.com，kimi.ai 的账户根本进不去 —— Codeg 的登录提示会替你点名它。

### 提供商、模型与推理 {#kimi-code-provider-model-and-reasoning}

Kimi Code 是另一个拥有专属面板的智能体，该面板在 **0.23** 中被重做过。原因在于这个 CLI 的一个怪癖：`kimi acp` 只接受**已存储的登录令牌**，从不接受在启动时递给它的密钥。所以 API 密钥没法简单地透传过去——Codeg 会往 `~/.kimi-code/config.toml` 里写入一个**受管提供商**，并埋下一个本地的门禁令牌，好让会话能够开启。推理依然跑在你自己的密钥上；那个令牌只负责开门。

**凭据**——两条互斥的路径：

- **API Key**——从 Kimi 接受的六种提供商形态中选一个（**Kimi / Moonshot**、**OpenAI**（Chat Completions 或 Responses 两种形态）、**Anthropic**、**Google Gemini**，或使用你的 GCP 凭据、完全不需要密钥的 **Google Vertex AI**），再在需要时填一个基础 URL。Moonshot 的两个区域——`api.moonshot.ai` 与 `api.moonshot.cn`——只有一次点击之隔。
- **Kimi 账号登录（订阅）**——在终端里运行 `kimi login`，Codeg 会复用那次登录，自己什么都不存。用这种方式保存会移除 Codeg 的 API 密钥门禁令牌。

**模型**——写入 `config.toml` 的模型 id，外加**最大上下文长度**。第二个字段看起来可选，其实不是：Kimi 的 schema 要求它，缺了它 Kimi 会丢弃整个模型配置块，于是每一次提问的回复都是空的。它默认为 **262144**。**测试并获取模型**会用你的密钥发起调用并报告它实际能访问到什么，于是一个拼写错误会当场显示为*该模型不在列表中*，而不是在对话进行到一半时变成*模型未找到*。

**推理**——只有当模型声明了推理能力时，Kimi 才会在 composer 中提供**思考**选择器，所以这一节负责替它声明一个。**可选档位**会成为该选择器的选项，并被原样转发给提供商，因此请挑选你的模型接受的那些；一个都不选，composer 就退回到一个朴素的关 / 开切换。你可以设定一个**默认档位**（或者交给 Kimi 自己决定）；对于总是会推理的模型，还可以把*关*这一项整个去掉。更改在新会话中生效。

**高级**中有**凭据写入位置**——内联的 `api_key` 还是提供商的 env 子表——以及一个 `config.toml` 的原始编辑器，它会原样覆盖整个文件，替换掉上面那些结构化字段所设置的一切。

**历史读起来和实时时一样。** 自 **0.35.2** 起，在 Kimi Code **2.2.0** 上，重新打开的对话会按你发送时的样子显示你的提示词：附件显示为徽章和缩略图，而不是原始的 `<resource>` 文本；你调用的技能或命令显示为 `/name args`；在 Kimi 自行发起的回合里，也不会再有一段内部提示词顶替你的消息。标题会略去附件文本，用文件名指代被提及的文件，最长 100 个字符，也不会再在两个版本之间来回切换。

::: warning 残留的环境变量会压过配置
`kimi acp` 读取 `KIMI_MODEL_*` 这一族变量——`KIMI_MODEL_BASE_URL`、`KIMI_MODEL_API_KEY`、`KIMI_MODEL_NAME`——而且是*先于* `config.toml` 读取的，因此智能体[环境变量](/zh/guide/agents#configure-an-agent)中残留的一个，就会悄悄覆盖掉这个面板写入的一切。只要还有任何一个存在，面板就会提醒你，而保存操作会清除它们——于是你看到的就是真正生效的。
:::

## Pi {#pi}

一个可自我扩展的编程智能体，通过 `npx` 运行。它会悄悄丢掉递给它的 MCP 服务器，所以它无法发起[委派](/zh/guide/multi-agent)——别的智能体仍然可以把任务委派给它。

### 项目信任 {#pi-project-trust}

Pi 会加载仓库自带的 `.pi/` 文件——设置、技能、提示词，以及 **`.pi/extensions`，那是一些 JavaScript 模块，其顶层代码会在 pi 启动时以你的权限运行**。它对某个文件夹是否这么做，取决于 pi 自己的信任决定；而从 **0.25** 起，这个决定归你。

当你在一个带有这些文件、且尚无任何信任记录覆盖它的仓库里打开 Pi 会话时，对话中会出现一条提示。**查看…** 会打开一个对话框，列出它找到的每一个文件，标出其中**会执行代码**的那些，并说明两件容易被忽略的事：这个回答会**被它内部的每一个文件夹继承**，而且它写入的是 pi 自己的信任文件，因此**你自己在终端里运行 `pi` 时同样适用**。选择信任会让 pi 重启，因为它只在启动时解析一次信任关系；而选择不信任则不会，因为正在运行的那个进程本来就在跳过这些文件。

pi 设置页上的**项目信任**卡片列出你已经做过决定的每一个文件夹，每行都带一个**撤销**。

::: warning 如果你在 0.25 之前用过 Pi
早先的版本会把它启动过 pi 的**每一个**文件夹都标记为受信任，且从不询问——这足以让「在一个刚克隆下来的仓库里创建或恢复一个 Pi 对话」就运行掉它自带的任何 `.pi/extensions`，没有发出任何提示词，对话记录里也什么都没有。去掉这个行为并不会收回它已经写下的授权，因此那些文件夹**现在会阻止启动，直到你确认它们**，并且每一条都会列出来供你查看。它们被保留而非删除，是因为 pi 的那个文件不记录来源——删除它们会悄悄撤销你自己在 pi 里做出的决定。问题编号 [#446](https://github.com/spacering-net/codeg/issues/446)。→ [隐私与安全](/zh/reference/privacy)
:::

### 自定义供应商上的思考强度 {#pi-reasoning-on-a-custom-provider}

只有当一个模型**声明**了自己会思考时，pi 才会为它发送思考强度——而一个未声明的模型，它的每一档都会被压到 *Off*，这就是以前在自定义供应商上一碰 composer 的思考强度选择器它就弹回去的原因。

pi 页面上的**推理**卡片就是你做这个声明的地方：一个开关、**pi 接受的档位**（以标签形式呈现）——自 **0.32.3** 起**最高**一档加入后共有七个——以及折叠起来的、每一档实际发出去的值，一个期望收到 `LOW`/`HIGH` 的端点需要的正是这个。这个列表不能自由填写，因为 pi 的也不能；七个之外的名称会被适配器拒绝。默认档位的下拉框只会收窄到你实际开放出来的那些档。

自 **0.31.0** 起，pi 模型的**上下文窗口**改为读取 pi 自己的 `models.json`，按（供应商，模型 id）解析，并遵循 pi 对未声明窗口的已列出模型采用 128K 的默认值。于是自建或中转的模型会在上下文环里显示真实的百分比，而不是一串裸 Token 数、或者一个 pi 并未实际采用的窗口值。

### 每个模型能思考到哪一档，以及它需要怎样的 Pi {#pi-thinking-levels-and-version}

自 **0.32.3** 起，pi 的思考强度可以一直开到**最高**——但仅限提供这一档的模型：最上面的两档 *xhigh* 和 *max*，只对明确列出了它们的模型存在。所以 composer 的思考强度选择器列出的，是**当前模型**真正具备的档位；而 pi 的设置页会在你选定的档位下方说明 pi 会如何对待所选模型——*"提供：关闭 · 低 · …"*，或者以琥珀色提示该模型**不提供**你选的档位，pi 会改用它具备的最接近的一档运行：先取高一档，没有再取低一档。提供你所选档位的模型仍会按该档运行。

随之而来的还有两项要求：

- **Pi 0.81.0 或更高版本。** 打开会话需要它。pi 的设置页会用琥珀色标出过旧的运行时，而在过旧的运行时上打开会话会失败，并弹出一条如实说明原因的通知——带一个**打开 Agents 管理**按钮——而不是一个内部错误。
- **在哪里都指向同一处的路径。** **pi 命令或路径**必须是绝对路径或你 `PATH` 上的命令名，**agent 目录**必须是绝对路径或位于 `~/` 之下。相对路径——比如一个 `./pi-test.sh` 包装脚本——在每个工作区里都会指向不同的地方，所以它会被当场拒绝，改好之前什么都不会保存。

## Grok {#grok}

xAI 的编程智能体，通过 `npx` 运行。它的面板有一个**认证方式**选择器——**官网订阅**（`grok login`）、**XAI API 密钥**或**自定义接口** → [用订阅登录](/zh/guide/authentication#sign-in-with-a-subscription)——而且和大多数智能体不同，它在面板里还保留着自己的一个**推理级别**下拉框，从低一直到**最高**，写入 Grok 自己的配置。

## Cursor {#cursor}

Anysphere 的编程智能体，以原生二进制文件的形式下载，自带 Node 运行时。它的**认证方式**要么是**官网订阅**——Codeg 会给出需要运行的 `cursor-agent login` 命令——要么是用于无人值守机器的 **Cursor API 密钥**，两者都写入与 CLI 共享的 `~/.cursor/cli-config.json`。→ [用订阅登录](/zh/guide/authentication#sign-in-with-a-subscription)

::: warning Cursor：那盏不作数的绿灯
`cursor-agent status` 只凭**有没有** token 就报告自己已登录，从不读它的有效期——而协议侧对一个五分钟内就要过期的 token 会拒绝开新会话，CLI 又没有刷新凭据的授权方式。于是一份过期的登录会一直显示**已登录**，而每一条提示都失败。

自 **0.31.2** 起，Codeg 会拿凭据去 Cursor 那边实际校验一次，并如实汇报：存着的登录用不了时显示**已登录（凭据未通过校验）**（通常是会话过期，重新登录即可；CLI 自己没法刷新浏览器登录），如果用的是密钥方式，同一个状态会指出这是一把**被拒绝的 API 密钥**（已吊销、已过期或敲错了）。Codeg 给出的那条登录命令在**服务器**上同样能用——那里没有浏览器可开，所以它前面带了 `NO_OPEN_BROWSER=1`，让 `cursor-agent` 改为打印一个 URL 给你在自己机器上打开；唯一的例外是 Windows 主机，那个 POSIX 前缀在那儿跑不了。无人值守的服务器，请改用 API 密钥方式。
:::

### 族系加旋钮，而不是两百个 id {#cursor-families-and-knobs-not-two-hundred-ids}

Cursor 的目录是一个*组合*一个 id —— 大约两百个 —— 于是要够到某个思考档位或者 Fast 标志，就得背下 `claude-opus-5-thinking-max-fast` 这样一串字符串。从 **0.30.0** 起，Cursor 设置页上的模型选择器——它决定一个会话从哪个模型起步——把这份目录按**族系**归并，并把那些差异作为旋钮摆在族系名旁边：**思考**、**思考强度**和 **Fast 快速模式**，每一个只在该族系确实在这一维上有变化时才出现。

没有任何东西是被拼出来的。交回去的每一个值都是 Cursor 自己的 CLI 报上来的，因为那套后缀语法确实有歧义 —— Cursor 还带着 `claude-4.5-opus-high` 这类历史别名，它的*名字*本身就以一个看起来像强度的词收尾。要一个并不存在的组合，它会向最近的同族收敛，并守住你刚刚动过的那一维。会话跑起来之后，Cursor 会自己报出同样这些旋钮——上下文大小也在其中——作为 composer 智能体设置按钮里各自独立的设置项。

Cursor 的**权限开关**如今显示的是会话实际运行的模式，这在 0.30.0 之前并非如此：*Run Everything* 和 *Ask* 的写法分不出「用户选了 Ask」和「用户从来没选过」。

自 **0.31.2** 起，Codeg 也会回应 Cursor **自己的协议扩展**。它的 CLI 会发出 `cursor/ask_question`、`cursor/create_plan`、`cursor/update_todos`、`cursor/task` 和 `cursor/generate_image` 这些自定义请求；没人回应时，每一个都会返回「方法未找到」，正在跑的回合每生成一个 Task 就会亮一条红色横幅。现在需要你的那两个落进了你已经熟悉的卡片——**提问卡**和**计划审批**，和 Grok 走同一条路——另外三个也会被答复，免得智能体一直等在那里。

**0.31.2** 起，**Linux 上的 Cursor** 也重新能用了：Codeg 给 Cursor bundle 打的兼容补丁是照着 macOS 构建写的，在 Linux 上打错了位置，于是每一条提示都死于一个 `TypeError`。已经带着坏补丁的安装会被就地修复。你自己装在 `/opt` 下的 `cursor-agent` 既不会被打补丁也不会被修复——它不在 Codeg 管理的范围内。

**Cursor 自己加的 MCP 设置会保留下来。** 自 **0.37.0** 起，在设置 → MCP 中保存一个 Cursor 服务器，或者从 MCP 市场重新安装它，都会保留 `envFile`、`auth`、`tls` 这类字段；SSE 服务器仍然是 SSE；而且这些 Cursor 专有的字段不会再混进 Codeg 为其他智能体写入的配置里。→ [MCP 服务器](/zh/guide/mcp)

## DeepSeek Harness {#deepseek-harness}

DeepSeek 自己的编程 harness。Codeg 通过社区的 `deepseek-acp` 桥接器驱动它，而不是 DeepSeek 那个只面向自动化的传输层——[原因见此](/zh/guide/supported-agents#deepseek-harness)。它需要 Node.js **22** 或更高版本。

### 端点与密钥 {#deepseek-harness-endpoint-and-key}

**DeepSeek Harness** 的面板是最短的那一个，因为适配器把它的两项设置都当作普通的环境变量来读：

- **API 端点**——留空即使用 DeepSeek 自己的 `https://api.deepseek.com`。要走代理或兼容端点时再填；它要求一个完整的 `http(s)` URL，且不带查询串。
- **API 密钥**——以 `DEEPSEEK_API_KEY` 传给智能体。

模型和思考强度**不在**这里。适配器把两者都作为普通的会话选项通告出来，因此它们位于 [composer](/zh/guide/conversations#start-a-session-—-the-composer) 中，归属于一段对话而不是这个智能体。启动时的默认模型是该智能体原始[环境变量](/zh/guide/agents#configure-an-agent)里的 `DEEPSEEK_ACP_MODEL`——刻意不放进这个面板，这样这里的一次保存就永远不会覆盖掉你正在那边编辑的那一行模型配置。

::: tip 环境变量的优先级高于凭据文件
DeepSeek Harness 也可以在终端里登录，那会把密钥存进 `~/.dsh/.credentials.yaml`。环境变量优先——所以如果你是那样登录的，就**让 API 密钥这一栏留空**，而不是填上同一个值、再让自己有两处需要同步维护。
:::

## Qoder {#qoder}

阿里巴巴的编程智能体 CLI，通过 `npx` 运行。

### 登录，或者给无头机器一个令牌 {#qoder-sign-in-or-hand-a-token-to-a-headless-box}

Qoder 的面板开头是一行**账号**状态，说明你是否已登录，以及 Qoder 自己记录的认证方式。登录走的是 Qoder 自家的浏览器流程——面板会给出可以直接粘进终端的那条 **`qoder login`** 命令，并且写的是 Codeg 所管理的那一份的**完整路径**，因为那一份位于 Codeg 的缓存里而不在你的 `PATH` 上，光敲 `qoder login` 只会得到「命令未找到」。跑完它，再点刷新。

对于打不开浏览器的机器——服务器、容器——则有一个**个人访问令牌**字段，以 `QODER_PERSONAL_ACCESS_TOKEN` 传入。留空即使用账户登录。

Qoder 读取的其他一切都在**同一个文件**里，`$QODER_CONFIG_DIR/settings.json`（默认 `~/.qoder`），与 `qoder` CLI 共用——而**高级：原始 settings.json** 会原样编辑它。这是刻意的：把整个文件写回去，也是**删除**一个键的唯一方式，而逐字段的编辑器表达不了这件事。

模型和思考强度不在这里。Qoder 通过 ACP 上报它们，所以由 composer 自己的选择器按会话掌管——而且自 **0.35.2** 起，对话详情显示的是你最后切换到的那个模型，而不是对话开始时用的那个。→ [认证与模型](/zh/guide/authentication)

自 **0.35.2** 起，Qoder 还能用**它自己的提问工具**向你发问，用的是其他智能体也在用的同一张提问卡片，而在此之前它只能退而使用 Codeg 的。你选中的答案事后会留在卡片上——多选的也一样——现在 Claude Code 自己的提问工具也是如此，不会再显示*未选择*。

## Google Antigravity {#google-antigravity}

Google 的智能体优先编程工具，以原生二进制文件的形式下载。它的 ACP 服务器以一整棵下载下来的目录树交付，没有独立的命令名，所以它是唯一一个 Codeg 无法从你 `PATH` 上的副本里识别出来的智能体。

::: info 自 0.32.2 起，Antigravity 可以在 Intel Mac 上运行
Antigravity 曾是名单上唯一的平台缺口：Google 只为 Apple Silicon、Linux 和 Windows 发布它，Codeg 在 Intel Mac 上会拒绝安装。**1.2.1** 是它第一个带 Intel 构建的版本，Codeg 在 **0.32.2** 中换到了这个版本——所以现在名单上的每一个智能体，只要运行时能跑，它就能跑。自 **0.37.0** 起固定的 **1.4.1** 依然提供 Intel 构建。
:::

### 由一个文件决定它如何登录 {#antigravity-one-file-decides-how-it-signs-in}

Antigravity 的 ACP 服务器只从一个地方读取它的认证意图——`$GEMINI_HOME/antigravity-acp/settings.json` 中的 `auth.type`——没有它，**每一个新会话都会直接失败**，报*需要认证*。Codeg 会在启动时替你写这个文件，所以你不会撞上这堵墙：当文件和这个面板都没有指定方式时，它写入**使用 Google 账号登录**，而这只不过让服务器打开一个浏览器而已。文件中已有的方式绝不会被覆盖。这个面板，是你换成别的方式的地方。

四种方式，各自只要它真正需要的东西：

| 方式 | 需要什么 |
| ------ | ------------- |
| **使用 Google 账号登录** | 你的 Google 账户，适用于包括免费档在内的任何 Antigravity 套餐。第一个新会话会打开浏览器完成登录，之后令牌被缓存复用 |
| **Gemini Enterprise** | 一个 GCP **项目和区域**，外加第一个会话时的浏览器登录 |
| **Gemini API Key** | 一个 Gemini Developer API 密钥，以 `GEMINI_API_KEY` 传入 |
| **Gemini Enterprise Agent Platform** | 即原先的 Vertex AI。要么单独用一个 API 密钥，要么用项目和区域配合应用默认凭据（`gcloud auth application-default login`） |

如果某种方式所需的条件没填齐就保存，面板会点名缺了什么并拒绝保存，而不是放任会话在之后以一个你只能靠猜的理由失败。

有两点行为值得知道：

- **你所选方式之外的凭据会在启动时被清除。** 留在你 shell 里的 `GEMINI_API_KEY`，无法悄悄接管一个你按 Google 登录配置好的会话。
- **如果 Codeg 写不了那个设置文件**——比如你把它设成了只读——它会明说，而不是假装保存成功了。你的选择在 Codeg 这一侧存下了，但 Antigravity 仍会按那个文件所写的方式认证，所以要么你自己去设 `auth.type`，要么把文件挪开再保存一次。

模型和会话模式通过 ACP 传来，因此它们在 composer 里而不在这里。自 **0.34.0** 起，Antigravity **1.3.0** 还会汇报它的上下文窗口用了多少，所以 composer 旁边的那个圆环会实时跟着 Antigravity 会话走。而自 **0.35.2** 起，随着 **1.4.0**，模型选择器**每个族系只列一个模型**，具体变体改在单独的 **Thinking Level** 选项里选。更新前你选过的模型会被沿用，而切换会从你的下一条消息开始生效。

从 **0.30.3** 起，Antigravity 也和其他下载安装的智能体一样接受**自定义版本** —— 而填一个从未发布过的版本号，现在会**直接下载失败**，不再把钉住的那份安装包悄悄记成你填的号，让「版本状态」信心十足地报出一个你根本没有的构建。Google 从 **1.2.0** 起更改了下载文件的命名，所以自定义版本必须是 **1.2.0 或更高**——在 Intel Mac 上则是 **1.2.1 或更高**，因为那里的第一个构建就是 1.2.1——更早的版本会下载失败。

#### 在没有浏览器的机器上登录 {#signing-in-on-a-machine-with-no-browser}

Antigravity 的 Google 登录是**它自己**跑的：它在 `127.0.0.1` 上开一个端口，调起系统浏览器，然后等五分钟让重定向回来。而在无头服务器上根本没有浏览器可调 —— 并且这次调用是静默失败而不是抛错 —— 于是第一次会话会那样干等五分钟然后死掉，全程没有给出任何人能打开的链接。

从 **0.29.0** 起，Antigravity 面板提供了一条不需要浏览器的登录路径。Codeg 起一个短命的智能体进程，接住它打印出来的授权 URL，然后展示给你：

1. 用**你手上确实有的任何浏览器**打开那个 URL —— 手机、笔记本，哪里都行。
2. 照常同意授权。你会落到一个 `127.0.0.1` 的页面上，而它**打不开**，因为那个端口在服务器上，不在你手上这台设备上。这是预期之中的。
3. 把这个打不开的页面的**完整地址**复制下来，粘回 Codeg。

Codeg 正跑在那个端口*确实*在监听的机器上，于是它替你完成这次重定向，登录随之完成。

Antigravity 自己只通告了寥寥几条命令，所以自 **0.36.0** 起，它的 `/` 菜单里也会列出你的[技能](/zh/guide/skills)——从设置 → Skills 所管理的那些文件夹里读取，排在它自己的命令之后，并略去与其中任何一条命令同名的技能。自动化和待办任务的编辑器里也会列出它们。

## Kiro CLI {#kiro-cli}

Amazon 的 Kiro 智能体，**0.36.0** 新增。Codeg 不负责安装它：你用 [Kiro 自己的安装程序](https://kiro.dev/docs/getting-started/installation/)装好 `kiro-cli`，Codeg 会在你的 `PATH` 上或 `~/.local/bin` 里找到它，并启动 Kiro 自己的 ACP 服务器 `kiro-cli acp`。它的徽章写着**官方安装**，版本行显示你手上的版本——找不到时则显示*本机未找到*，并附一个**安装指南**链接。**升级**运行的是 Kiro 自己的更新程序 `kiro-cli update --non-interactive`，所以被更新的正是你终端里用的那一份；已经在运行的会话会继续用原来的构建，直到重新连接。这里没有自定义安装，也不会提供未经审查的最新版本。

**登录**是 Kiro 自己的事：在终端里运行一次 `kiro-cli login`，Codeg 的会话就会复用这次登录。对于打不开浏览器的服务器或容器，在面板的**配置管理**卡片上填写 **API Key（可选）**；它以 `KIRO_API_KEY` 传入，并保存在 Codeg 的数据库里。同一张卡片上还有**权限模式**：

- **运行工具前询问（默认）**——每个需要批准的工具调用都会先交给你，shell 命令和文件写入都在其中；只读工具不经询问直接运行。
- **信任所有工具（--trust-all-tools）**——会话带着这个参数启动，什么都不会再问。它对新会话生效；已经打开的会话会出现*重连以应用*横条。

无论选哪一种，都用**保存 Kiro 配置**保存。

**在对话里**，Kiro 用它自己的方式报告模型、agent 和推理设置，所以 Codeg 根据它报告的内容拼出这些设置项：**Model**、**Agent**——`kiro_default`、`kiro_planner`、`kiro_guide`，以及你放在 `~/.kiro/agents` 里的任何 agent——还有在模型支持时才出现的 **Thinking** 和 **Reasoning effort**。它们的名称在任何界面语言下都保持英文。`/` 菜单先列出 Kiro 自己的命令，再列出它的技能、它的 `.kiro/prompts` 和它的 MCP 提示词；与内置命令同名的提示词，或名字以 `$` 开头的提示词，都会被略去，因为 Kiro 会去运行别的东西。

**历史记录**来自 Kiro 自己的存储 `~/.kiro/sessions/cli/`，所以在 Kiro 终端里跑的会话也能[导入](/zh/guide/aggregation)。`KIRO_HOME` 可以把它挪走，它指的就是 `.kiro` 目录本身。Kiro 不记录 token 数，所以 [Token 用量](/zh/guide/token-usage)会统计它的会话，但没有 token；上下文圆环照常工作，依据的是 Kiro 报告的百分比。Codeg 核对过的那个 Kiro 版本 2.24.1 没有声明支持分叉，所以不会出现*从此处分叉*。

**MCP 服务器**写入 `~/.kiro/settings/mcp.json`——不支持 SSE——而 Kiro 自己的逐服务器设置在 Codeg 里编辑之后也会保留。→ [MCP 服务器](/zh/guide/mcp) Kiro 在技能包的矩阵里占有一列，读取 `~/.kiro/skills` 和项目里的 `.kiro/skills`。

::: info 自定义的 Kiro 已转成这个内置智能体
如果你之前从 ACP 注册表把 Kiro CLI 添加成了自定义智能体，升级到 0.36.0 时它会变成内置的这一个，并把它的对话、打开的标签页、文件夹默认值、自动化、待办任务设置、委派默认设置、标签和 composer 里的选择一并带过来。那个自定义定义已经不在了，ACP 注册表也不再把 Kiro 作为自定义智能体提供。
:::

::: warning 只设在智能体上的 `KIRO_HOME`
设在 Kiro 自己的环境变量里的 `KIRO_HOME` 会改变 Codeg 读取其历史的位置，但**设置 → MCP** 和技能相关的界面只认 Codeg 自身环境里的 `KIRO_HOME`。
:::

## ZCode {#zcode}

Z.ai 的 ZCode，**0.36.0** 新增，通过一个社区 ACP 桥接器接入——[为什么这样设计](/zh/guide/supported-agents#zcode)。它需要两样 Codeg 不负责安装的东西：已安装并登录的**官方 ZCode**，以及能加载 `node:sqlite` 的 **Node.js 22** 或更高版本。在**设置 → 智能体**里，Codeg 只安装桥接器 `zcode-acp-server`，它的**升级**也只更新桥接器。

**查找 ZCode。** Codeg 先找桌面应用自己的入口——Windows 上是 `%LOCALAPPDATA%\Programs\ZCode\resources\glm\zcode.cjs`，macOS 上在 `ZCode.app` 内部，Linux 上在 `/opt/ZCode` 或 `/usr/share/zcode` 下——然后再找你 `PATH` 上的 `zcode`。至于 Node，它会逐个尝试能找到的每一个，先是你的 `PATH`，再是常见的版本管理器，并采用第一个版本在 22 或以上、且能加载 `node:sqlite` 的，所以排在你 `PATH` 前面的旧版 Node 不会挡住更新的那个。自动检测失败时，在 ZCode 的**环境变量**里设置 **`ZCODE_BIN`**（ZCode 的 `zcode.cjs` 入口）或 **`ZCODE_NODE`**——取值为绝对路径或你 `PATH` 上的命令名；相对路径会被拒绝，而你设的值会原样使用，不会被换成猜测的结果。预检里的 **Official ZCode runtime** 一行会显示找到了什么。

**登录、模型和凭据**都留在 ZCode 里，面板上也没有配置卡片——只有环境变量编辑器，外加一段说明这一点的提示。ZCode 的 **Start Plan** 账户无法通过桥接器运行：它的请求需要验证码，而只有 ZCode 桌面应用能完成。GLM Coding Plan 账户不受影响。

**在对话里**，模式、模型和思考设置都以桥接器报告的为准。新会话在 ZCode 确认它的模式之前不会发送任何内容——确认的是你上次选的模式（如果这个会话提供它），否则是 *build*——如果 60 秒内没有确认，会话会直接失败，而不是把你的消息发出去。权限请求使用 Codeg 的普通卡片。桥接器还会在它运行的每个工作区里写入一个处于禁用状态的沙箱模板 `.zcode/acp/sandbox.json`。

**首次接入暂不支持的：** 从某条消息分叉、附件、HTTP 和 SSE 类型的 MCP 服务器——ZCode 只接受 **stdio** 服务器，Codeg 把它们记在自己的一份记录里，在会话开始时递过去——以及导入 ZCode 自己的历史：Codeg 只记录你在 Codeg 里运行的对话，别的一概没有。ZCode 在技能包的矩阵里没有对应的一列。到目前为止它只在 Windows 上测试过；macOS 和 Linux 并不会被拒绝，只是还没测试。你之前作为[自定义智能体](/zh/guide/custom-agents)配置的 ZCode 仍是一个独立的智能体，有它自己的历史。

## TRAE CLI {#trae-cli}

字节跳动的 TRAE CLI 2.0，**0.37.0** 新增，仅向 TRAE 企业版旗舰版套餐的客户开放。和 Kiro CLI 一样，Codeg 不负责安装它：你用 [TRAE 自己的安装程序](https://docs.trae.cn/cli_get-started-with-trae-cli-2)装好 `traecli`，Codeg 会在你的 `PATH` 上（Windows 安装程序就把它放在那里）或 `~/.local/bin` 里找到它，并启动 `traecli acp serve`。徽章写着**官方安装**，**升级**运行 `traecli update`，如果你本来就是最新版也会告诉你；这里同样没有自定义安装，也不会提供未经审查的最新版本。

它的**配置管理**卡片：

- **登录**——`traecli login` 命令，带一个复制按钮。在终端里运行一次，用企业 SSO 登录；Codeg 的会话会复用这次登录。
- **个人访问令牌（可选）**——用于打不开浏览器的服务器或 Docker 部署。TRAE CLI 自己不会读取这个令牌，所以 Codeg 会在每次启动会话时用它登录；设在 Codeg 自身环境里的 `TRAECLI_PERSONAL_ACCESS_TOKEN` 效果相同。如果这次登录失败，Codeg 仍会尝试用 `traecli login` 留下的登录状态打开会话，前提是那份登录仍然有效。
- **企业 API 地址（可选）**——仅当你的组织在自有域名上部署 TRAE 时才需要；以 `TRAECLI_HOST` 传入。

用**保存 TRAE CLI 配置**保存。模型、模式和推理强度不在这张卡片上：它们由 TRAE CLI 报告，所以在 composer 的智能体设置按钮里。

TRAE CLI 自己完成文件读写和命令执行。它的 **MCP 服务器**写入 `~/.trae/traecli.toml` 的 `[mcp_servers]` 下——不支持 SSE——技能则写入 `~/.trae/skills`，这个文件夹与 TRAE IDE 共用。`TRAE_HOME` 会把两者一起挪走，不过设置 → MCP 和技能相关的界面只认 Codeg 自身环境里的 `TRAE_HOME`。它的历史由 Codeg 自己记录，所以里面只有你在 Codeg 里运行的对话，TRAE CLI 自己终端里的会话暂时还无法导入。到目前为止它只在 macOS 上测试过，Docker 镜像里也不包含 `traecli`。

## Command Code {#command-code}

Command Code 的终端编程智能体，**0.37.0** 新增。它是一个普通的 npm 智能体——在设置 → 智能体里点**安装**就能装好，需要 **Node.js 22** 或更高版本——你自己用 `npm i -g command-code` 装的那一份也会被识别。Codeg 总是以 `command-code` 启动它，从不使用它的短名 `cmd`，因为在 Windows 上那是系统 shell。

它的**配置管理**卡片：

- **登录**——`command-code login` 命令，带一个复制按钮。在终端里运行一次；Codeg 的会话会复用这次登录。
- **API 密钥（可选）**——用于打不开浏览器的机器。它以 `COMMAND_CODE_API_KEY` 传入，**优先于**那次登录，所以想用登录就把它留空。设在 Codeg 自身环境里的密钥同样有效。

用**保存 Command Code 配置**保存。模型、模式和推理强度来自 Command Code，位于 composer 的智能体设置按钮里——而那里的模型列表是 **Command Code 自己的模型目录**：你自己添加到 Command Code 的模型在 Codeg 里选不到。它的提问会以权限卡片的形式到达，每个答案对应一个选项。

它的 **MCP 服务器**写入 `~/.commandcode/mcp.json`——不支持 SSE——技能写入 `~/.commandcode/skills`。它的历史由 Codeg 自己记录，所以 Command Code 自己终端里的会话暂时还无法导入；Command Code 也没有声明支持分叉，所以不会出现*从此处分叉*。到目前为止它只在 macOS 上测试过。

## 后续步骤 {#next-steps}

- [**支持的智能体**](/zh/guide/supported-agents)——完整名单、每个智能体跑在什么之上，以及各自把会话存在哪里。
- [**认证与模型**](/zh/guide/authentication)——各智能体共用的登录方式、模型提供商，以及如何选择模型。
- [**使用智能体**](/zh/guide/agents)——启用一个智能体、运行它的预检，并开启一个会话。
- [**自定义智能体**](/zh/guide/custom-agents)——注册一个不在名单上的 ACP 智能体。
