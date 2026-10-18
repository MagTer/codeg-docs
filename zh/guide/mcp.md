---
title: MCP 服务器
description: 用 Model Context Protocol 服务器为你的智能体提供额外的工具和数据源——从注册表添加它们或手动添加，并选择哪些智能体获得每一个，一切都在 Codeg 中的同一处完成。
---

# MCP 服务器

**Model Context Protocol（MCP）** 是一项开放标准，用于向编码智能体交付额外的工具和数据——一个 GitHub 服务器、一个 Postgres 连接、一个无头浏览器、你公司的内部 API。Codeg 驱动的任何智能体都可以使用 MCP 服务器；问题在于，每一个智能体都用它*各自*的配置文件、各自的格式保存自己的 MCP 设置。Codeg 是统一管理它们的唯一入口：只需添加一次服务器，勾选哪些智能体应当拥有它，Codeg 就会替你把它写入它们各自的配置中。

Codeg 并不运行这些工具——MCP 是*智能体*的功能，服务器与智能体通信，而非与 Codeg 通信。Codeg 提供给你的是其上的管理层：对已安装内容的扫描、一个可搜索的、用于添加更多服务器的注册表，以及针对每个服务器的按智能体开关，这样你就再也无需为每个 CLI 手动编辑不同的文件。

## MCP 服务器在何处管理 {#where-mcp-servers-are-managed}

打开**设置 → MCP**。这是一个双栏界面。左栏有两个标签页——**本地**（已在你机器上的服务器）和**市场**（可从中安装的注册表）——右栏则是你所选内容的详情与编辑器。

## 在 Codeg 眼中服务器是什么样的 {#what-a-server-looks-like-to-codeg}

每个服务器都是一个 **id** 加上一个 **spec**（一个小的 JSON 对象），再加上它被启用的**智能体**集合。spec 有两种形态：

- **stdio**——你的智能体启动并通过 stdin/stdout 与之通信的本地命令：
  ```json
  {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_TOKEN": "ghp_…" }
  }
  ```
- **remote**——智能体连接到的 **HTTP** 或 **SSE** 端点：
  ```json
  {
    "type": "http",
    "url": "https://mcp.example.com/sse",
    "headers": { "Authorization": "Bearer …" }
  }
  ```

编辑器强制执行的一条经验法则：**`env` 属于 stdio 服务器**，在那里它用于设置所启动进程的环境。而 remote 服务器则改用 `headers` 携带其密钥——若你把 `env` 放到 HTTP/SSE 的 spec 上，Codeg 会警告你。

## 从注册表安装 {#install-from-a-registry}

**市场**标签页会搜索一个市场。内置了两个：

- **官方 MCP 注册表**——`registry.modelcontextprotocol.io`，权威索引。
- **Smithery**——一个庞大的社区目录。

选择一个提供方，搜索，然后选中一个结果以查看它的详情——描述、主页、它支持的协议、版本，以及它是否已验证。点击**安装**，Codeg 会引导你完成：

1. **协议**——一个服务器可能提供不止一种运行方式（比如 stdio *或*一个托管的 HTTP 端点）；选择其一。
2. **参数**——填写该选项所需的内容：API 密钥、端点、标志。必填字段会被标记，密钥会被遮蔽，且每一项都有自己的类型（文本、数字、布尔值、一组固定的选项，或 JSON）。
3. **目标应用**——勾选哪些智能体获得该服务器。

确认后，Codeg 会把完成的 spec 写入每个选定智能体的配置中。

## 手动添加一个 {#add-one-by-hand}

明确知道你想要什么？在**本地**标签页，点击**新建 MCP**，为它指定一个 id，粘贴 spec JSON，并选择智能体。它会与那些从注册表安装的服务器并列出现。对于任何不在任何目录中的服务器——内部工具、你正在开发的东西、一次性的用途——都走这条路。

**从已知服务器开始**会替你把表单填好。自 **0.31.0** 起，这份清单里包含 Google 官方的 **Chrome DevTools** 服务器，而这件事的意义不止是省几次敲键：注册表里存在同名的仿冒条目，这个按钮钉死的是真的那个包（`chrome-devtools-mcp`）。选择哪些智能体、是否创建仍然由你决定，`npx` 会在第一次运行时把它下载下来。

::: info 它不是内置浏览器
DevTools 服务器驱动的是**另一个** Chrome，Codeg 管不到。你会拿到[内置浏览器工具](/zh/guide/browser#let-an-agent-work-on-the-page)没有的网络与性能数据——也拿不到它们的那套防护：没有按标签页共享、标签页上没有活动条、也没有逐段代码的确认。两样工具，两件事。
:::

## 扫描已有的内容 {#scan-what-s-already-there}

**本地**标签页不仅显示你*在* Codeg 中添加的内容——它还会**扫描你的智能体自己的配置文件**，并列出它找到的每一个 MCP 服务器。因此，你通过手动编辑 `~/.claude.json` 设置的服务器，或另一个工具安装的服务器，也会显示在这里，随时可以编辑、移除，或为*更多*智能体开启。**刷新**会重新运行扫描。

**一份读不了的配置，不会再把整个页面一起拖垮。** 在 **0.30.2** 之前，只要有一个智能体的配置文件格式错误或读不出来，整次扫描就会失败，于是其他所有智能体的服务器也跟着消失。现在健康的那些照常列出，出问题的那个会在**它们旁边给出一条警告**，点明是哪个智能体、出了什么问题 —— 是列表*旁边*的一条警告，而不是取代列表的一个错误。空的配置文件就按空的来读，因为它本来就是空的。

这条警告还在时，**保存会被拦下**，而不是被放行去造成破坏。一个智能体的分配关系是从这个页面读得到的那些智能体推算出来的，所以在有智能体被隐藏的情况下保存，会悄悄把这个服务器从它那里剥掉。先修好或移走那个文件，按**刷新**，然后再编辑。

## 选择哪些智能体获得某个服务器 {#choose-which-agents-get-a-server}

每个服务器的详情面板都有一行**已启用应用**——每个智能体一个复选框。Codeg 会把服务器写入你所勾选的每个智能体的原生 MCP 配置中，并在你取消勾选时将其移除：

| 智能体 | Codeg 将它写入何处 |
| ----- | --------------------- |
| **Claude Code** | `~/.claude.json`（`mcpServers`） |
| **Codex** | Codex 的 `config.toml`（`[mcp_servers.*]`） |
| **Gemini** | `~/.gemini/settings.json` |
| **OpenCode**、**Cline**、**Hermes**、**CodeBuddy**、**Kimi Code**、**Grok**、**Cursor** | 各智能体自己的 MCP 配置 |
| **Qoder** | `~/.qoder/settings.json`（`mcpServers`） |
| **Google Antigravity** | `<GEMINI_HOME>/config/mcp_config.json` |
| **Kiro CLI** | `~/.kiro/settings/mcp.json`（`mcpServers`） |
| **TRAE CLI** | `~/.trae/traecli.toml`（`[mcp_servers.*]`） |
| **Command Code** | `~/.commandcode/mcp.json`（`mcpServers`） |
| **DeepSeek Harness** | `$DSH_HOME/mcp.json`——Codeg 自己的记录，因为该智能体不读取任何属于自己的配置文件 |
| **ZCode** | Codeg [数据目录](/zh/getting-started/configuration#where-codeg-stores-its-data)中的 `mcp/zcode.json`——Codeg 自己的记录，原因相同 |

把服务器写入 JSON 配置时**会保留文件原有的键顺序**：自 **0.32.0** 起，文件的其余部分会保持你写下的顺序，而不是每次保存都被按字母顺序重新排列。

只要有任何一个条目仍然指定了已退役的 `kaos` 执行器，**Kimi Code 2.2.0** 就会拒绝它的整个 `mcp.json`，所以自 **0.35.2** 起，Codeg 会从它保存的每个 Kimi 条目中去掉 `kaos`。Codeg 没有动过的条目则保持原样——如果升级之后 Kimi 不再加载你的服务器，请到那里找找有没有残留的 `kaos`。

这就是**十九个智能体中的十七个**——除 **OpenClaw** 和 **Pi** 之外的每一个。OpenClaw 根本不接受 MCP 服务器（它是唯一选择不参与的智能体），因此不会作为目标提供；Pi 也不在列表中。→ [智能体之间有何不同](/zh/guide/supported-agents#how-agents-differ)

**DeepSeek** 和 **ZCode** 在服务器*如何*到达它们这件事上是例外。其他每一个智能体都会在启动时读取自己的配置文件，因此 Codeg 写进去就可以撒手不管。而它们的桥接不读取任何配置文件——服务器只在创建或恢复会话时通过协议到达它们——所以 `$DSH_HOME/mcp.json` 和 `mcp/zcode.json` 是 Codeg 关于「要发送什么」的记录，而不是智能体会去查阅的东西，真正的投送路径是 ACP 连接。

**并非每个智能体都能承载每一种传输方式。** ZCode 只接受 **stdio** 服务器，而 Codex、DeepSeek Harness、Kiro CLI、TRAE CLI 和 Command Code 都不接受 **SSE** 服务器。保存时，无法承载该服务器传输方式的智能体会被直接略过——Codeg 之前以这个名字为它写入的任何内容也会被移除——因此只有当你勾选的智能体*没有一个*能承载它时，保存才会失败，而不是等到启动时才失败。

**智能体自己的按服务器设置会被保留。** 有些智能体会在条目上保存一些 Codeg 编辑器不显示的额外字段。自 **0.37.0** 起，保存时会保留 **Cursor** 的这类字段——`envFile`、`auth`、`tls` 等——凡是你没有改动的字段都原样保留，而从市场重新安装某个服务器时，也会保留所有它没有设置的 Cursor 字段；SSE 服务器会保持为 SSE，不再变成 HTTP；这些 Cursor 独有的字段也不会再扩散到 Codeg 为其他智能体写入的配置里——对于 OpenClaw 和 pi 已经列着的服务器，它们的配置也算在内——以前 Cursor 的 `auth` 会因此让 OpenClaw 拒绝它的整个配置，让 pi 跳过这个服务器。**Kiro CLI** 的 `disabled`、`autoApprove`、`disabledTools`、`timeout` 和 `oauth` 设置，在你从编辑器保存时也会以同样的方式保留，因此你在 Kiro 中禁用的服务器会保持禁用。

::: info 自定义智能体不会列在这里
这个页面的工作方式是往每个智能体**自己的**配置文件里写内容，而对于你自己注册的[自定义智能体](/zh/guide/custom-agents)，Codeg 刻意对它的配置文件一无所知——因此它们不会作为目标出现在这里。它们仍然能得到的是 Codeg 自己的伴随服务器，条件与任何内置智能体相同：只要它在[协作设置](/zh/reference/settings/collaboration)中的某项功能开启，它就会被挂上；而其中的[委派](/zh/guide/multi-agent)工具，要在委派本身启用后才会携带。若要给自定义智能体配置属于它自己的 MCP 服务器，请按该智能体原生的方式去配置。
:::

::: tip 更改在下一个会话生效
因为服务器存在于智能体的配置中，智能体会在它**启动会话**时读取它。添加或更改服务器后，它会对新的对话生效；对于一个已经打开的对话，**重新连接以应用**会在不丢失你历史的情况下加载新配置。→ [配置智能体](/zh/guide/agents#configure-an-agent)
:::

## 须知 {#good-to-know}

- **密钥位于智能体的配置文件中。** 你输入到某个服务器的 `env`、`headers` 或某个安装参数中的 API 密钥，会被写入每个被分配智能体在磁盘上各自的配置里——也就是那些智能体本就用来保存设置的同一批文件——并未加密存储。请把对你机器的访问权当作边界，正如对待[智能体凭据](/zh/guide/authentication#where-credentials-are-stored)一样。
- **stdio 服务器需要其命令可用。** `npx`、`uvx`、某个二进制文件——凡是 spec 所启动的东西，都必须位于智能体运行时所用的 PATH 上，否则服务器不会启动。
- **在服务器上运作方式相同。** MCP 界面同样在浏览器版本中；一个 remote 服务器只需要 Codeg 运行所在的机器能够访问该端点。
- **移除一个服务器**会一次性把它从所有曾启用它的智能体中删除——你无需逐一手动清理每份配置。
- **Claude Code 会在对话里回应 `/mcp`。** 自 **0.34.0** 起（适配器 0.86.0），`/mcp` 出现在 Claude Code 的 `/` 菜单里，回复列出你的 MCP 服务器及各自的工具数量；`/mcp reconnect`、`/mcp enable` 和 `/mcp disable` 后面跟一个服务器名或 `all`，就能对它们进行操作。重新打开对话时，命令和它的回答都不会再显示。从 Codeg 里重连，无法发起服务器的 OAuth 登录。
- **自 0.35.0 起，Codex 也会。** 在 codex-acp **2.2** 下，Codex 对话里的 `/mcp` 会报告每个 MCP 服务器的**实时状态**，`/mcp reconnect` 则会重新连接它们。每次状态检查都会为会话里的每个 MCP 服务器短暂地多启动一份副本，Codeg 自己的伴随服务器也不例外——这并无害处。

## 后续步骤 {#next-steps}

- [**技能**](/zh/guide/skills)——扩展智能体的另一种方式：可复用的指令包，按智能体启用，用一个 `/command` 调用。
- [**支持的智能体**](/zh/guide/supported-agents#how-agents-differ)——哪些智能体接受 MCP 服务器，以及它们在其他方面有何不同。
- [**使用智能体**](/zh/guide/agents#configure-an-agent)——重新连接一个正在运行的会话以应用配置更改。
