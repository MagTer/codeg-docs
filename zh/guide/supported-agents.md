---
title: 支持的智能体
description: Codeg 通过 ACP 驱动的十九个编程智能体——每一个是什么、它如何来到你的机器上、在那里需要什么，以及它把会话保存在磁盘的什么位置——以及如何注册一个不在名单上的智能体。
---

# 支持的智能体

Codeg 驱动**十九个编程智能体**，一旦其中一个开始运行，它们的使用感受都是一样的——同一个 composer、同样的 diff、同样的 git 和终端——因为 Codeg 通过 **Agent Client Protocol（ACP）** 与每一个通信。不同之处在底层：智能体由谁构建、它在你的机器上需要什么运行时，以及它把自己的历史保存在哪里。本页就是这张地图。

启用一个智能体、它的预检健康检查，以及开启一个会话，都在[使用智能体](/zh/guide/agents)中介绍；登录和选择模型在[认证与模型](/zh/guide/authentication)中；而每个智能体自己的设置和脾性，见[各智能体配置](/zh/guide/agent-setup)。这里我们只专注于名单本身——以及在页面末尾，[如何为它添加新成员](#beyond-the-built-in-roster)。

## 名单 {#the-roster}

这些智能体中，有十七个由 Codeg 替你安装、固定版本并更新。另外两个——**Kiro CLI** 和 **TRAE CLI**——它运行的是你用厂商自己的安装程序装好的那一份。你*确实*需要在机器上准备的，是每个智能体运行所依赖的东西：

| 智能体 | 是什么 | 运行环境 |
| ----- | ---------- | ------- |
| **Claude Code** | Anthropic 的 Claude 编程智能体 | Node.js |
| **Codex** | OpenAI 的编程助手 CLI | Node.js |
| **Gemini** | Google 官方的 Gemini CLI | Node.js |
| **OpenClaw** | 可自托管的个人 AI 助手 | Node.js |
| **OpenCode** | 一个开源编程智能体 | 捆绑二进制文件 |
| **Cline** | 一个自主编程智能体 CLI | Node.js |
| **Hermes** | Nous Research 的自我改进智能体 | Node.js |
| **CodeBuddy** | 腾讯云的 AI 编程助手 | Node.js |
| **Kimi Code** | Moonshot AI 的 CLI 编程助手 | Node.js |
| **Pi** | 一个可自我扩展的编程智能体 | Node.js |
| **Grok** | xAI 的编程智能体与 CLI | Node.js |
| **Cursor** | Anysphere 的 Cursor 编程智能体 | 捆绑二进制文件 |
| **DeepSeek Harness** | DeepSeek 自家的编程 harness | Node.js **22+** |
| **Qoder** | 阿里巴巴的 Qoder 编程智能体 CLI | Node.js |
| **Google Antigravity** | Google 的智能体优先编程工具 | 捆绑二进制文件 |
| **Kiro CLI** | Amazon 的终端版 Kiro 智能体 | 你自己的 `kiro-cli`，来自 Kiro 的安装程序 |
| **ZCode** | Z.ai 的 ZCode，经由社区 ACP 桥接器接入 | 能加载 `node:sqlite` 的 Node.js **22+**，外加已登录的官方 ZCode |
| **TRAE CLI** | 字节跳动的 TRAE CLI 2.0，面向 TRAE 企业版旗舰版套餐 | 你自己的 `traecli`，来自 TRAE 的安装程序 |
| **Command Code** | Command Code 的终端编程智能体 | Node.js **22+** |

最后一列背后有三条交付路径：

- **Node.js（npm）。** 十九个中有十四个以 npm 包的形式交付，Codeg 用 `npx` 运行它们，因此它们需要安装 Node.js。Codeg 会为每一个固定一个已知可用的版本，并为你升级它。对 **ZCode** 来说，这个包只是桥接器：智能体本身是你自己安装的官方 ZCode，而它运行所用的 Node 还必须能加载 `node:sqlite`——这由预检里专门的一行来检查。每个包都声明了自己的最低 Node 版本，预检会拿你的版本去比对——有几个要求 **Node 22**，DeepSeek Harness 和 Command Code 都在其中；而自 **0.35.0** 起，Codex 的适配器需要 **20.3.0** 或更高版本：在 Node 20.0 到 20.2 上，每条消息都会失败。最低版本可能像这样落在某个主版本的中间，所以自 0.35.0 起，**诊断**也会比对完整的版本号——以前，对一个需要 20.3 的智能体，它会让任何 Node 20 通过。
- **捆绑二进制文件。** **OpenCode**、**Cursor** 和 **Google Antigravity** 是原生二进制文件，Codeg 会为你确切的平台下载它们——无需安装其他任何东西。Cursor 的下载体积更大，因为它自带 Node 运行时和工具，所以它同样不需要你的机器上有 Node.js。
- **你自己的安装。** **Kiro CLI** 和 **TRAE CLI** 只能通过各自厂商的安装程序获得，所以 Codeg 从不安装它们，也不固定它们的版本：它会先在你的 `PATH` 上、再到 `~/.local/bin` 里查找 `kiro-cli` 或 `traecli`，找到什么就启动什么。它们在设置 → 智能体里的徽章写着**官方安装**；版本行显示你手上的版本，或者显示*本机未找到*并附一个**安装指南**链接；而**升级**运行的是厂商自己的更新程序。

最新的几个还很年轻：到目前为止，ZCode 只在 Windows 上测试过，TRAE CLI 和 Command Code 只在 macOS 上测试过——不过 Codeg 在其他平台上并不会拒绝它们中的任何一个。每个智能体各自的特别之处——从 macOS 27 上的 Cline 到 Intel Mac 上的 Antigravity——见[各智能体配置](/zh/guide/agent-setup)。

::: info 版本固定可以停在最新版之前，也可以再解开
「Codeg 固定一个已知可用的版本」偶尔意味着*不是最新的那一个*。**Kimi Code** 曾被压在 0.36.1 上整整三个版本：从 0.37 到 0.38，它会拒绝任何带着 stdio MCP 服务器的 ACP 会话，而对 Kimi 来说那总是包含 Codeg 自己的伴生服务器 —— 于是[多智能体委派](/zh/guide/multi-agent)**以及**你添加的每一个 MCP 服务器都跟着一起倒下。0.39.0 恢复了对 stdio 的处理，所以这个固定**已经解开**，Kimi Code 重新跟上了当前版本。
:::

上面的顺序是设置 → 智能体中**默认的智能体列表顺序**。它是一种偏好设置，而非排名——拖动智能体即可重新排序，而当没有其他方式为一段对话选定智能体时，第一个已启用的智能体就成为 Codeg 的后备选择。→ [使用智能体](/zh/guide/agents#start-a-session)

## ACP 适配器 {#acp-adapters}

Codeg 与智能体之间只说一种语言：**ACP**。十九个里有十五个不需要为此付出什么，因为 Codeg 运行的就是厂商自己的 CLI——Gemini、OpenClaw、OpenCode、Cline、Hermes、CodeBuddy、Kimi Code、Pi、Grok、Cursor、Qoder、Google Antigravity、Kiro CLI、TRAE CLI 和 Command Code 都自带这个协议，所以你手动装过的那一份，Codeg 一般会直接认出来。对 Kiro CLI 和 TRAE CLI 而言，你装的那一份就是唯一的一份。这里有两条脚注：**Hermes** 是那个差一点的例外——自从上游不再发布到 PyPI，托管的那个包就成了一层固定版本的薄壳，它的 `hermes` 命令会 exec 它装下来的那个真正的上游程序，所以 `hermes acp` 仍然是厂商自己的适配器；而 **Antigravity** 则是 Codeg 根本没法从你机器上认出来的那一个——它的 ACP 服务器以一整棵下载下来的目录树的形式交付，没有独立的命令名，因此你的 `PATH` 上没有任何东西可供查找。

**Claude Code 和 Codex 是典型的例外。** Anthropic 的 `claude` CLI 和 OpenAI 的 `codex` CLI 并不会说 ACP。所以 Codeg 为这两个条目装的根本不是厂商 CLI，而是一个独立的 **ACP 适配器**：一个由 Agent Client Protocol 官方组织（该项目最初由 Zed 团队发起）维护的 npm 包，它把厂商的智能体包裹起来，翻译成这个协议。

| Codeg 里的条目 | 实际安装的包 | 可执行命令 | 上游仓库 |
| -------------- | ------------ | ---------- | -------- |
| **Claude Code** | `@agentclientprotocol/claude-agent-acp` | `claude-agent-acp` | [agentclientprotocol/claude-agent-acp](https://github.com/agentclientprotocol/claude-agent-acp) |
| **Codex** | `@agentclientprotocol/codex-acp` | `codex-acp` | [agentclientprotocol/codex-acp](https://github.com/agentclientprotocol/codex-acp) |

这张表回答的，正是本页最常见的那句困惑：**"我终端里明明有 `claude`，Codeg 却说没装。"** 这句话的两半其实都没错。Codeg 找的是 `claude-agent-acp` 而不是 `claude`，是 `codex-acp` 而不是 `codex`。它们不是同一个东西的两种叫法，而是两个不同的包、两个不同的可执行命令——有没有其中一个，说明不了另一个的情况。

从 **0.23** 起，应用会在你真正撞上这件事的地方把它讲清楚，而不再全靠本页：这两个智能体在**设置 → 智能体**中的名称旁带有一个 **ACP 适配器**徽章（[ZCode](#zcode) 也带有一个），其预检的第一行会解释这个区别——包括它是否找到了你自己的 CLI、在哪里找到的——并带有一个直接跳到这里的**了解详情**链接。

装适配器不会动你已有的 CLI。它是一个用着自己名字的独立包，不会覆盖、升级或卸载你的 `claude` 和 `codex`。它也并不*需要*它们：这两个适配器各自都自带运行时，`claude-agent-acp` 依赖 `@anthropic-ai/claude-agent-sdk`，`codex-acp` 依赖 `@openai/codex`，安装时一并带下来。所以在一台从没装过厂商 CLI 的机器上，这两个智能体照样能跑。

适配器真正与 CLI 共用的是配置——登录状态也在其中。Claude Code 读的是 `~/.claude`（用 `CLAUDE_CONFIG_DIR` 可以改），Codex 读的是 `~/.codex`（用 `CODEX_HOME` 可以改）：正是两个 CLI 各自使用的目录，也正是 Codeg 的设置面板所写入的那两个文件——`~/.claude/settings.json` 和 `~/.codex/config.toml`。你在终端里登录过一次，适配器就沿用那个账号，不必再登录一遍。历史记录也遵循同样的规则，仍留在厂商自己的目录里，[见下方的表格](#where-each-agent-keeps-its-sessions)。

::: tip 让 Codex 适配器改用你指定的可执行文件
在 Codex 智能体的**环境变量**中设置 `CODEX_PATH`，`codex-acp` 就会运行你指定的那个可执行文件，而不是它自带的那一份——如果你手头留着某个特定的 `codex` 构建版本，这会很有用。→ [使用智能体](/zh/guide/agents#configure-an-agent)
:::

### 安装最新发布版本，而不是推荐版本 {#unreviewed-latest}

上面 Kimi 的故事有两面：一个经过审核的固定版本，既是把坏版本挡在外面的东西，也是横在你和今早刚上线的新模型之间的东西。从 **0.32.4** 起，这笔账变成了一个按钮，而不再是一项设置。当某个智能体的最新发布**领先于 Codeg 推荐的版本**时，它在**设置 → 智能体**里的**版本状态**会显示一个琥珀色的**升级到未经审查的最新版本 …**。它在安装任何东西之前都会先问你，对话框会讲明你要承担什么：这个版本未经 Codeg 审查，可能让这个智能体在 Codeg 里不可用——偶尔还有已知是坏的版本——而要回退，就得用**自定义安装**重装推荐版本，对话框会写出这个版本号。确认之后，Codeg 安装的恰好就是那个版本；如果安装失败，也不会回退到推荐版本。

- **「最新」从哪里来。** 对 npx 类智能体，是这个包在 npm 上的 `latest` 标签。对下载的二进制文件——OpenCode、Cursor、Antigravity，或者从注册表添加的自定义智能体——是 ACP 注册表里当前适用于你平台的那份归档，前提是它仍然符合 Codeg 认得的下载模式。通过 `uvx` 安装的智能体不会出现这个提议，你手写出来的自定义智能体也不会，Kiro CLI 和 TRAE CLI 同样不会——它们自己的更新程序会让它们保持最新。
- **它什么时候去查。** 每次打开这个智能体的页面时查一次。后台不会轮询；查询进行中、或查询失败之后，都不会提供它。
- **装了之后**，本地版本领先于推荐版本，这一行会显示*已是最新版本*，没有警告，也没有退回去的按钮。**安装**和**升级**始终指的是推荐版本，所以要回到它，就得用**自定义安装**填入那个版本号——正如对话框所说。
- **它取代了一项设置。** 从 **0.30.3** 到 **0.32.4**，每个 npx 类智能体都有一个**适配器版本**下拉框——*固定版本*或*最新版（未经审查）*——在安装时读取。这个下拉框已经去掉了：你设成*最新版*的智能体恢复为安装和升级到推荐版本，而现在要够到最新发布，靠的就是这个按钮。

同一面板里的**版本状态**就是该信的那个号码——它报告的是本地探测到的结果，旁边是 Codeg 推荐的版本。对 npx 类智能体来说那次探测是 `npm list`，而它本身也可能因为别的原因失败；失败时会退回到上一次记录下来的版本，而不是宣称什么都没装。所以一个在升级失败之后仍然存在的读数，值得再确认一遍。

### DeepSeek Harness 走的是第三条路 {#deepseek-harness}

**0.26** 新加入的 **DeepSeek Harness** 不属于上面两种情况。DeepSeek 自己也发布了一个 ACP 传输层——`@deepseek-ai/dsh-acp`——但它是为自动化场景设计的：不支持流式输出、不呈现工具调用，而且干脆拒绝 MCP 服务器，因此通过它跑起来的会话只会给你一整块写完的文本，工作区的一切都不在。Codeg 转而驱动**社区维护的 `deepseek-acp` 桥接**，并像其他每一个托管安装那样固定在确切版本上。

它没有适配器角标，也没有「厂商 CLI 认错了」的问题需要解释，因为你的机器上根本没有一个叫 `deepseek` 的命令会被它混淆。多出这一跳换来的是一个完整保真的会话：流式回复、工具卡片，还有 MCP。

| 什么 | 在哪里 |
| ---- | -------------- |
| **登录** | 该智能体自己的设置面板：**API 端点**和 **API 密钥**。端点留空即使用适配器的默认值 `https://api.deepseek.com` |
| **模型与思考强度** | 在 **composer** 里，而不是设置里——适配器把它们作为普通的会话选项通告出来，因此它们是按对话生效的 |
| **技能** | 上游的技能链，包括 `$DSH_HOME/skills` → [技能](/zh/guide/skills) |
| **MCP 服务器** | 通过协议本身投送 → [MCP 服务器](/zh/guide/mcp) |

密钥以 `DEEPSEEK_API_KEY` 传入，而环境变量的优先级高于凭据文件——所以如果你更愿意在终端里登录，把这个字段留空就好。启动时的默认模型仍留在老手们预期的位置，即原始环境变量编辑器里的 `DEEPSEEK_ACP_MODEL`，正是为了让设置面板永远不会覆盖掉你正在那边编辑的那一行模型配置。

### ZCode 经由桥接器驱动官方应用 {#zcode}

**0.36** 新加入的 **ZCode** 同样通过一个社区桥接器驱动——`zcode-acp-server`，固定在 **0.72.0**，上游为 [william0wang/zcode-acp](https://github.com/william0wang/zcode-acp)——它也是第三个带 **ACP 适配器**徽章的智能体。不过它的工作方式与 Claude Code 和 Codex 的适配器正好相反：桥接器本身不带任何智能体。它驱动的是**你已安装并登录的官方 ZCode**，运行在能加载 `node:sqlite` 的 Node.js 22 或更高版本上，因此模型、凭据和登录都留在 ZCode 里，而 Codeg 里的**升级**只更新桥接器。

它的适配器那一行说的正是这些，而且只有在桥接器已安装**并且**找到了 ZCode 时才会通过；它的**了解详情**打开的是桥接器的仓库，而不是本页。如何找到 ZCode、找不到时如何为 Codeg 指明它，以及首次接入暂不支持哪些功能，见[各智能体配置](/zh/guide/agent-setup#zcode)。

## 每个智能体把会话保存在何处 {#where-each-agent-keeps-its-sessions}

早在 Codeg 出现之前，每个智能体就以自己的位置和格式存储着自己的对话历史。这正是[对话聚合](/zh/guide/aggregation)在导入你过往工作时所读取的内容：Codeg 会在每个智能体的原生存储中查找你在所导入文件夹里运行过的会话，并列出它找到的内容。

以下就是"每个智能体的原生存储"实际所在的位置：

| 智能体 | 默认位置 | 格式 | 重定位变量 |
| ----- | ---------------- | ------ | ------------- |
| **Claude Code** | `~/.claude/projects/` | JSONL | `CLAUDE_CONFIG_DIR` |
| **Codex** | `~/.codex/sessions/` | JSONL | `CODEX_HOME` |
| **Gemini** | `~/.gemini/` | JSON 文件 | `GEMINI_CLI_HOME` |
| **OpenClaw** | `~/.openclaw/agents/` | JSONL | — |
| **OpenCode** | `~/.local/share/opencode/opencode.db` | SQLite | `XDG_DATA_HOME` |
| **Cline** | `~/.cline/data/` | JSON 文件 | `CLINE_DIR` |
| **Hermes** | `~/.hermes/state.db` | SQLite | `HERMES_HOME` |
| **CodeBuddy** | `~/.codebuddy/projects/` | JSONL | `CODEBUDDY_CONFIG_DIR` |
| **Kimi Code** | `~/.kimi-code/sessions/` | JSONL | `KIMI_CODE_HOME` |
| **Pi** | `~/.pi/agent/sessions/` | JSONL | `PI_CODING_AGENT_SESSION_DIR` |
| **Grok** | `~/.grok/sessions/` | JSONL | `GROK_HOME` |
| **Cursor** | `~/.cursor/chats/` | SQLite（blob 存储） | `CURSOR_CONFIG_DIR` |
| **DeepSeek Harness** | `~/.dsh/sessions/` | 压缩的 JSONL | `DSH_HOME` |
| **Qoder** | `~/.qoder/projects/` | JSONL | `QODER_CONFIG_DIR` |
| **Google Antigravity** | `~/.gemini/antigravity-acp/conversations/` | SQLite（每个会话一个文件） | `GEMINI_HOME` |
| **Kiro CLI** | `~/.kiro/sessions/cli/` | JSONL 事件日志，外加每个会话一个 JSON 元数据文件 | `KIRO_HOME` |

大多数智能体写入一份 **JSONL 对话记录**——一种纯文本日志，每行一个事件——而 OpenCode 和 Hermes 把一切保存在单个 **SQLite** 数据库中，Cursor 和 Antigravity 把每段对话存为各自的 SQLite 文件，Gemini 和 Cline 使用它们自己的 JSON 文件，Kiro 则把一份事件日志和一个每回合结束后都会重写的元数据文件配成一对。Codeg 会原生读取每一种格式；你从不需要转换任何东西。

::: warning `GEMINI_HOME` 和 `GEMINI_CLI_HOME` 不是同一个变量
它们在那张表里隔着几行，含义却不同。**`GEMINI_CLI_HOME`**（Gemini CLI）指的是*父*目录，`.gemini` 会被拼接到它后面；**`GEMINI_HOME`**（Antigravity）指的就是 `.gemini` 目录**本身**，正如 **`KIRO_HOME`** 指的就是 `.kiro` 本身（按原样取值，不展开 `~`）。把想设的那一个按另一个的规则去设，会把存储挪到两个工具都不会去找的地方。
:::

被压缩的是 DeepSeek 那一份：它的 `session.jsonl.zstd` 并不是单个 Zstandard 归档，而是**一批一批追加上去的一串帧**，正是这一点让 harness 能一直往里写。Codeg 会按顺序解码这些帧，并保留到最后一个完整帧为止的全部内容——因此一个**还在被写入**的会话照样能列出、能打开，而不是读成一个损坏的文件。

::: tip 移动过存储位置？Codeg 会跟随同一个变量。
用上面某个环境变量把智能体指向一个非默认位置，Codeg 也会遵从它，因此重定位后的历史仍能打开，也仍能导入。自 **0.35.2** 起，无论这个变量是在 Codeg 自己的环境里，还是在设置 → 智能体中该智能体的**环境变量**里，都是如此——后者优先，而且在那里把值留空就是取消这个变量，回到该智能体的默认位置。在此之前，只设在智能体上的变量会让它的对话打开后一片空白。设在那里的 `HOME` 则不会被跟随。OpenClaw 是例外：它的存储无法重定位。
:::

有三个内置智能体在那张表里没有对应的行：**ZCode**、**TRAE CLI** 和 **Command Code**。Codeg 目前还不读取它们自己的存储，所以像对待自定义智能体那样，由它自己记录它们的历史——这意味着里面只有你在 Codeg 里运行的对话，而它们自己终端里的会话暂时还无法导入。

[自定义智能体](/zh/guide/custom-agents)没有对应的行，因为它通常不会留下 Codeg 能读取的存储。对于这类智能体，以及上面那三个，Codeg 会自己写下历史——在它[数据目录](/zh/getting-started/configuration#where-codeg-stores-its-data)中的 `acp-transcripts/<registry-id>/` 下，为每个会话保存一份只追加的 JSONL 对话记录——并像读取原生存储一样把它读回来。那三个内置智能体用的是 `codeg-zcode-acp`、`codeg-trae-cli` 和 `codeg-command-code`。由于它属于 Codeg 自己的数据，它跟随 `CODEG_DATA_DIR` 迁移，而不是跟随任何智能体的变量；设置了 `CODEG_HOME` 时，则以它为准。

## 智能体之间有何不同 {#how-agents-differ}

界面是完全一样的，但有几处会因智能体而异——值得了解，以免有什么让你措手不及：

- **模型和模式来自智能体，而非 Codeg。** composer 的[智能体设置按钮](/zh/guide/conversations#start-a-session-—-the-composer)里的模型、模式（计划优先、接受编辑等）以及其他选项，列出的都是所连接智能体通过 ACP 报告的内容。两个智能体会提供不同的模型和不同的模式——那是智能体在说话，而不是 Codeg 的某项设置。→ [认证与模型](/zh/guide/authentication)
- **登录方式也不同。** 有些智能体用它们自己的订阅或 OAuth 登录，另一些则接受提供商 API 密钥或自定义端点。每个智能体的详情面板只显示适用于它的选项。→ [认证与模型](/zh/guide/authentication)
- **OpenClaw 不参与 MCP。** 它是唯一一个不接受 Model Context Protocol 服务器的智能体，因此你添加的 MCP 服务器不会到达 OpenClaw 会话——Codeg 不会向它转发任何一个。大多数其他智能体会正常接收你的 MCP 服务器，只是传输方式上有两条限制：ZCode 只接受 **stdio** 服务器，而 Codex、DeepSeek Harness、Kiro CLI、TRAE CLI 和 Command Code 不接受 **SSE** 服务器。→ [MCP 服务器](/zh/guide/mcp)
- **有三个智能体永远拿不到 Codeg 自己的工具。** 委派、实时反馈、提问卡片、浏览器和电脑操作工具，都是通过 Codeg 的伴随 MCP 服务器、经由 ACP 递给智能体的。**OpenClaw** 拒绝它，**Pi** 丢掉它，而 **Cline** 从不连接以这种方式递给它的 MCP 服务器——所以自 **0.36.0** 起，Codeg 不再把它提供给 Cline，而 Cline 自己设置里的服务器照常工作。→ [多智能体协作](/zh/guide/multi-agent#how-delegation-works)

## 内置名单之外 {#beyond-the-built-in-roster}

上面的名单是 Codeg **手工适配**的那一批——其中每个智能体都获得了自己的设置面板、针对其会话文件的解析器（只要 Codeg 能读取那些文件），以及应对其种种怪癖所需的各种小改动。正是这些工作才换来表中的一席之地。

不过，这并不是 Codeg 能驱动的边界。ACP 是一项开放标准，所以从 **0.22** 起，你可以注册任何其他会说这门语言的智能体：从该协议的公开注册表中挑一个，或粘贴它的 distribution JSON。Codeg 会安装它、运行同样的预检、替它记录历史，并在其余各处都把它当作内置智能体对待——选择器、状态栏、搜索和委派。→ [自定义智能体](/zh/guide/custom-agents)

## 后续步骤 {#next-steps}

- [**使用智能体**](/zh/guide/agents)——启用其中一个，运行它的预检，然后开启一个会话。
- [**自定义智能体**](/zh/guide/custom-agents)——添加一个不在这份名单上的兼容 ACP 的智能体。
- [**认证与模型**](/zh/guide/authentication)——为你所选的智能体登录并挑选一个模型。
- [**对话聚合**](/zh/guide/aggregation)——从上面列出的存储中导入会话。
