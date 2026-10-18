---
title: 命令行
description: 使用 codeg-cli 从终端运行智能体和助手：安装命令、连接 Codeg、通过管道传入上下文、并行运行、收集 JSON 结果，以及在 CI 中使用。
---

# 命令行

从 **0.38.0** 起，**`codeg-cli`** 让脚本和终端也能通过 Codeg 运行提示词。它连接正在运行的桌面应用或 `codeg-server`，启动智能体，并打印回答。每次运行都会在 Codeg 中留下一段普通对话：你可以查看、回答等待中的智能体，并在那里继续对话。这些对话带有终端图标，**最近 → ⋯ → 命令行**可以筛选出它们。

```bash
git diff main | codeg-cli -a codex -p "Review this diff" -o review.md
codeg-cli -a claude_code --permissions reads -p "Explain this repository"
codeg-cli --assistant code-reviewer "Review the latest commit" --permissions reads
```

## 获取命令 {#get-the-command}

`codeg-cli` 随桌面应用、服务器压缩包、安装脚本和 Docker 镜像一同提供。

在桌面应用中打开**设置 → 系统 → 命令行访问 → 安装命令行工具**。这个按钮会让其他终端也能找到随附命令：

| 安装方式 | 可执行文件 | PATH 设置 |
| ------------ | ---------- | ---------- |
| **macOS 应用** | `/Applications/codeg.app/Contents/MacOS/codeg-cli` | 按钮将它链接到 `/usr/local/bin`，需要时会请求管理员密码。 |
| **Windows 应用** | `%LOCALAPPDATA%\codeg\bin\codeg-cli.exe` | 按钮将安装目录的 `bin` 文件夹加入用户 PATH。之后请打开新终端。 |
| **Linux `.deb` / `.rpm`** | `/usr/bin/codeg-cli` | 已在 PATH 上。 |
| **Linux AppImage** | `<data dir>/cli/bin/codeg-cli` | 先启动应用；按钮会将提取出的副本链接到 `~/.local/bin`。该目录需要在 PATH 上。 |
| **服务器压缩包／安装脚本** | `codeg-server` 旁边 | 安装脚本默认使用 PATH 上的目录。手动解压后则需将所在目录加入 PATH；参见[部署](/zh/getting-started/deployment)。 |
| **Docker** | 容器内的 `/usr/local/bin/codeg-cli` | 通过 `docker compose exec` 运行，工作目录使用容器内的路径。 |

例如，使用[部署指南](/zh/getting-started/deployment#with-compose)中的 Compose 服务和项目挂载：

```bash
docker compose exec codeg codeg-cli -w /projects/app -a claude_code \
  --permissions reads -p "Review the latest commit"
```

::: details 在 macOS 或 Windows 上手动设置 PATH
在 macOS 上，将应用中的命令链接到 PATH 上的目录：

```bash
sudo mkdir -p /usr/local/bin
sudo ln -s /Applications/codeg.app/Contents/MacOS/codeg-cli /usr/local/bin/codeg-cli
```

不加 `-f` 会保留已有命令。如果应用装在其他位置，请调整路径。

在 Windows 上，在 PowerShell 中运行一次，然后打开新终端：

```powershell
$cliBin = Join-Path $env:LOCALAPPDATA "codeg\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (($userPath -split ";") -notcontains $cliBin) {
  $newUserPath = (@($userPath, $cliBin) | Where-Object { $_ }) -join ";"
  [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
}
```

自定义安装请使用对应的 `bin` 文件夹。该命令可在 PowerShell、`cmd` 和 Git Bash 中使用。
:::

若已有其他安装提供的命令，Codeg 会保留它。在 **Codeg 的终端和智能体进程中**，Codeg 会将自己的命令放在 PATH 最前面，并将 **`CODEG_CLI`** 设为其完整路径。如果登录 shell 调整了 PATH，`"$CODEG_CLI"` 仍能选中这份命令。开发构建使用 **`codeg-cli-dev`**，与已安装正式版的命令分开。

::: info 更新 0.37.0 服务器
**从 0.37.0 开始**的就地更新不会安装 `codeg-cli`，因为该版更新器还不认识它。请从对应平台的 [0.38.0 服务器压缩包](https://github.com/spacering-net/codeg/releases/tag/v0.38.0)中提取，放到 `codeg-server` 旁边。**从 0.38.0 及之后的版本发起**的更新会自动带上匹配的命令。全新安装已包含它。
:::

## 首次运行 {#first-run}

1. **启动 Codeg**——桌面应用或 `codeg-server`，版本为 0.38.0 或更高。[系统设置](/zh/reference/settings/system#command-line-access)中的**命令行访问**默认开启。
2. **安装智能体并完成认证。** 使用[设置 → 智能体](/zh/guide/agents)和智能体的[登录设置](/zh/guide/authentication)；对于 Codeg 可以安装的智能体，也可以运行 `codeg-cli agents install SLUG`。
3. **在终端进入项目目录**，检查连接并运行提示词：

   ```bash
   codeg-cli status
   codeg-cli agents
   codeg-cli -a claude_code --permissions reads -p "Explain this repository" -o overview.md
   ```

当前目录就是工作目录。用 **`-w DIR`**（也可写 `--workspace`、`--cd` 或 `-C`）指定其他目录。需要时，该文件夹会登记到 Codeg 中，但不会自动在侧边栏打开。`--open` 会在本机桌面应用中将对话带到前台。

**`-a SLUG` 选择智能体**，名称来自 `codeg-cli agents`，例如 `claude_code` 或 `codex`。**`-A NAME|ID`**（`--assistant`）使用已保存的[助手](/zh/guide/assistants)，包括其智能体、选项和常驻指令；`codeg-cli assistants` 可列出它们。两者都不指定时，工作目录必须已设有默认智能体。

## 选择连接哪个 Codeg {#choose-which-codeg-to-use}

每个运行中的 Codeg 都会为本地监听器发布一个私有的**发现文件**：`<data dir>/cli/endpoint-<pid>.json`。`codeg-cli` 按以下优先级选择：

1. **`--url`**，配合 `--token` 或 `--token-file`（也可使用 `CODEG_TOKEN`）：通过 HTTP(S) 连接 Codeg。
2. **`--data-dir DIR`**：使用该数据目录的 Codeg。
3. **`CODEG_CLI_ENDPOINT_FILE`**：Codeg 会在自己的终端和智能体进程中设置它，让命令连回所属的 Codeg。
4. **`CODEG_URL`**，配合 **`CODEG_TOKEN`**。
5. **`CODEG_DATA_DIR`**。
6. 桌面应用和服务器的[默认数据目录](/zh/getting-started/configuration#where-codeg-stores-its-data)。

只使用第一个已提供的选择条件。如果目标无法连接或验证，命令就会停止，不会把提示词转交给另一个 Codeg。在同一数据目录中，失效的端点会被跳过；若多个实例可用，依次优先选择桌面应用、开发版桌面应用、服务器，同类中选择最新启动的实例。**`--runtime desktop|server`** 可限定类型。

**`codeg-cli status`** 会解释发现的状态：`ready`、`stale`、`unreachable`、`unverified`、`access_denied` 或 `incompatible`。**`codeg-cli open`** 会在需要时启动本机桌面应用并等待，默认等待 60 秒（可用 `--wait DUR` 调整）。普通运行不会自行启动 Codeg。

连接远程服务器时，使用它的访问令牌，以及**服务器上的**工作目录：

```bash
codeg-cli --url https://codeg.example.com --token-file ./codeg-token \
  -w /srv/projects/app -a codex --permissions reads -p "Review the latest commit"
```

使用 `--url` 时，**必须指定 `-w`**，路径会按原样发送。在不受信任的网络中请使用 HTTPS。本地的「命令行访问」开关不影响通过服务器认证 HTTP API 的访问。

## 命令与运行选项 {#commands-and-run-options}

不写子命令就表示 **`run`**：`codeg-cli "Explain this"` 与 `codeg-cli run "Explain this"` 等价。若提示词恰好是命令名，请写 `codeg-cli run status` 或 `codeg-cli -p status`。运行选项应放在 `run` 之后，也可以完全省略 `run`。

```text
codeg-cli [GLOBAL OPTIONS] [run] [RUN OPTIONS] [PROMPT]
```

| 命令 | 作用 |
| ------- | ------------ |
| `run [PROMPT]` | 启动智能体回合，并等待结果。 |
| `agents [--json]` | 列出智能体、可用状态及安装方式。 |
| `agents install SLUG [--version VERSION] [--wait DUR] [--json]` | 在运行 Codeg 的机器上安装智能体，未指定版本时使用 Codeg 推荐的版本。Kiro 等由厂商安装的智能体需要使用其自己的安装器。 |
| `assistants [--json]` | 列出已保存的助手。 |
| `status [--json]` | 显示发现的实例，以及运行时会选中哪一个。 |
| `open [--wait DUR] [--json]` | 启动或找到本机桌面应用。 |
| `result RUN [--wait DUR] [--output-format FORMAT] [-o FILE]` | 收集已分离或断开连接的运行结果。 |
| `cancel RUN [--json]` | 取消一次运行。 |
| `automations [list] [--json]` | 列出已保存的自动化。 |
| `automations run ID [--wait DUR] [--json]` | 立即触发自动化，可选择等待结果。 |

即使命令退出或 `--wait` 到期，智能体安装仍会在 Codeg 中继续。例如，`codeg-cli agents install claude_code --wait 5m` 在五分钟后仍未完成时退出 **6**；再次运行同一命令会跟进已有安装。完整语法可通过 `codeg-cli --help` 或 `codeg-cli COMMAND --help` 查看。

### 全局选项 {#global-options}

以下选项适用于运行和子命令：

| 选项 | 用途 |
| ------ | ------- |
| `--url URL` | 通过 HTTP(S) 连接 Codeg。 |
| `--token TOKEN`、`--token-file FILE` | 为该 URL 提供认证令牌；未指定时使用 `CODEG_TOKEN`。 |
| `--data-dir DIR` | 按数据目录选择本机 Codeg；配合 `--standalone` 时，将当前命令的服务器数据保存在该目录。 |
| `--runtime desktop\|server` | 将本地发现限定为指定类型的 Codeg。 |
| `--standalone` | 为当前命令单独启动和停止服务器；参见 [CI](#use-a-temporary-server-in-ci)。 |
| `-q`、`--quiet` | 关闭进度和心跳。 |
| `-v`、`--verbose` | 在非终端环境下也显示进度，并输出诊断信息。 |
| `--no-color` | 取消进度颜色。 |

### 提示词与运行选项 {#prompt-and-run-options}

**`-p TEXT`** 提供提示词，最后一个位置参数也可以。**通过管道传入的 stdin** 会追加为上下文；如果没有提供提示词，它本身就是提示词。`-p -` 从 stdin 读取提示词，`--no-stdin` 则禁止读取。交互式终端和空设备不会被读取。提示词与 stdin 合计最多 **10 MiB**。

| 运行选项 | 用途 |
| ---------- | ------- |
| `-a`／`--agent SLUG`、`-A`／`--assistant NAME\|ID` | 选择智能体或助手；可重复指定以[并行运行](#run-several-agents)。 |
| `-w`／`--workspace DIR`（`--cd`、`-C`） | 工作目录；使用 `--url` 时必填。 |
| `--max-parallel N` | 最多同时运行 N 个目标，默认为 4，其余排队。 |
| `-m VALUE`、`--model VALUE` | 选择智能体提供的模型。 |
| `--effort LEVEL` | 选择思考强度。Kiro 无法确认该选项，因此这里不接受。 |
| `--mode ID` | 选择会话模式，例如 `plan` 或 `acceptEdits`。 |
| `-c`／`--config ID=VALUE` | 设置智能体公布的其他会话选项，可重复指定。 |
| `--permissions POLICY` | Codeg 如何回答权限请求，默认为 **`deny`**。 |
| `--timeout DUR` | 从命令启动开始计时，在 `90s`、`30m`、`2h` 等时长后取消。 |
| `--output-format FORMAT`（`--format`） | `text`、`json` 或 `stream-json`；参见[输出](#output-and-structured-results)。 |
| `-o`／`--output FILE` | 将最终回答同时保存到文件。 |
| `--output-schema FILE` | 要求结果匹配指定的 JSON Schema。 |
| `--title TEXT` | 设置智能体无法替换的对话标题。 |
| `--open` | 在本机桌面应用中将对话带到前台。 |
| `--no-stdin` | 忽略管道输入，适用于外层脚本需要自行使用 stdin 的情况。 |
| `--detach` | 提示词送达后立即返回运行 ID。 |
| `--worktree[=NAME]` | 在新的 git worktree 中运行，使用 `cli/…` 分支。需要 git 2.33 或更高版本。 |

模型、思考强度、模式和 `-c` 的值会在**发送提示词之前**按智能体公布的选项校验。不可用、被拒绝、被改写或未执行的选择，以及设置请求超时，都会使运行以退出码 2 结束。如果智能体接受了值但未确认，运行可以继续：未确认的模型、思考强度和模式会标记在 **`launch.unconfirmed`** 中，其他 `-c` 选项则产生警告提示。成功退出本身并不代表每项选择都已得到确认。这些选择只影响本次运行，不会修改 Codeg 保存的默认值。

## 权限与提问 {#permissions-and-questions}

`--permissions` 决定**智能体提出请求时** Codeg 如何作答。它只给出一次性回答，不会在智能体设置中保存长期审批规则。

| 策略 | 权限请求 | 提问 |
| ------ | ------------------- | --------- |
| **`deny`**（默认） | 本次拒绝。 | 拒绝回答。 |
| **`reads`** | 只读和搜索请求本次允许，其余拒绝。 | 拒绝回答。 |
| **`allow`** | 本次允许。 | 拒绝回答。 |
| **`fail`** | 拒绝并以退出码 5 结束运行。 | 拒绝回答。 |
| **`wait`** | 留给你在 Codeg 中回答。 | 留给你回答。 |

智能体自己的**模式**仍然决定它是否发起请求。如果没有合适的一次性允许选项，Codeg 会拒绝，而不会选择长期允许；如果连一次性拒绝也做不到，运行就以退出码 5 结束。Grok 的计划审批在 `allow` 下通过，在 `wait` 下等待，否则放弃。委派的子智能体也遵循同一策略。

使用 **`wait`** 时，对话链接会打印到 stderr。在 Codeg 中打开它，或为本机桌面应用加上 `--open`，然后在那里或通过已连接的[聊天频道](/zh/guide/chat-channels)作答。超时仍会取消运行，JSON 结果会在 `pending` 中列出未回答的请求。

**嵌套的 CLI 运行不能放宽父运行的权限策略**，而且最多只能嵌套一层。这是防误操作措施，无法作为防止智能体刻意绕过限制的沙箱。对于已经在 Codeg 中工作的智能体，优先使用 Codeg 的[委派工具](/zh/guide/multi-agent)。

## 输出与结构化结果 {#output-and-structured-results}

| 格式 | stdout | stderr |
| ------ | ------ | ------ |
| **`text`**（默认） | 最终回答。 | 连接终端时的进度，以及错误和提示。 |
| **`json`** | 结束时的一个结果对象。 | 错误和提示。 |
| **`stream-json`** | 每行一个 JSON 事件，最后是结果对象。 | 错误和提示。 |

**`-v`** 会在非终端环境下也向 stderr 输出进度；**`-q`** 关闭进度和心跳；**`--no-color`** 取消进度颜色。在非终端环境下，若运行静默了一分钟，stderr 会输出一行心跳，让 CI 知道任务仍在进行。

`-o FILE` 以原子方式写入最终回答。一次运行即使在生成回答后失败，仍可能写入文件，因此要检查退出码。没有回答时，已有文件保持原样。写入失败会使原本成功的运行以退出码 1 结束。

### 在脚本中读取 JSON {#read-json-in-scripts}

在 Bash 脚本中保存 JSON 时，保留退出状态，避免后续 `jq` 命令掩盖运行失败：

```bash
set -euo pipefail
cli_exit=0
git diff main | codeg-cli -a codex -p "Review this diff" \
  --output-format json > review.json || cli_exit=$?
if [ "$cli_exit" -ne 0 ]; then
  cat review.json >&2
  exit "$cli_exit"
fi
jq -e '.is_error == false' review.json > /dev/null
jq '{subtype, result, permission_denials, link}' review.json
```

成功的结果包含以下字段（其他字段省略）：

```json
{
  "v": 1,
  "type": "result",
  "seq": 42,
  "run_id": "8d0c7c2e-3f0b-4a5e-9c1b-6f2d1e0a7b44",
  "subtype": "success",
  "is_error": false,
  "result": "No blocking issues found.",
  "stop_reason": "end_turn",
  "duration_ms": 48210,
  "permission_denials": [],
  "conversation_id": 214,
  "link": "codeg://session/214"
}
```

**`launch.requested`** 和 **`launch.effective`** 记录请求的模型、思考强度、模式及其实际生效值。若存在 **`launch.unconfirmed`**，它会标记智能体接受但未确认的选择。失败时，`error` 包含稳定的 **`code`**、可读的 **`message`**，以及适用时的 **`next_steps`**。

在 JSON 格式中，参数解析后的失败也会输出结果对象，即使没有连上 Codeg。如果尚未创建对话，`conversation_id` 和 `link` 为 `null`；`run_id` 也可能为 `null`。CLI 无法解析的参数只会向 stderr 输出消息，并退出 2。

`stream-json` 在对话创建后以 `init` 开始，随后报告消息、工具、计划、权限、提问和提示；在此之前失败则只输出结果。事件包含 `v: 1`、`seq` 和 `run_id`，其中 `seq` 在每次运行内递增。请忽略未知字段和事件类型，让脚本在 API 扩展后仍能工作。[源码参考](https://github.com/spacering-net/codeg/blob/main/docs/cli.md#events)列出了全部事件和结果字段。

### 要求特定的 JSON 结构 {#require-a-json-shape}

**`--output-schema FILE`** 要求结果通过指定 JSON Schema 的校验：

```bash
set -euo pipefail
cat > verdict.schema.json <<'EOF'
{
  "type": "object",
  "properties": {
    "verdict": {"enum": ["pass", "fail"]},
    "issues": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["verdict", "issues"],
  "additionalProperties": false
}
EOF
git diff main | codeg-cli -a codex --permissions reads -p "Review this diff" \
  --output-schema verdict.schema.json -o verdict.json
jq -e '.verdict == "pass"' verdict.json > /dev/null
```

最后一条命令会让脚本在结论为 `"fail"` 时失败。合法的结论本身，无论是 `"pass"` 还是 `"fail"`，都算一次成功的 CLI 运行。

Codeg 会给智能体一个 **`submit_result`** 工具，并校验它提交的内容。该工具只提交结果；如果智能体在调用前请求权限，Codeg 会允许本次调用，不受 `--permissions` 限制。如果智能体无法接收该工具，或未调用就结束回合，Codeg 会改为检查回答：整段回答必须是 JSON，或包含一个 `json` 代码块。无效提交累计五次后不再接受；回合结束仍无匹配结果时，退出码为 **7**，`subtype` 为 `error_max_structured_output_retries`。

在 `text` 模式中，stdout 和 `-o` 写入的是校验通过的 JSON。在 JSON 格式中，它位于 **`structured_output`**，而 `result` 仍是智能体的回答。`--output-schema` 控制结果的结构，`--output-format` 控制 CLI 外层的输出格式。没有有效结果时，单次运行的文本 stdout 保持为空，其输出文件保持原样。

Schema 根必须声明 `"type": "object"`，大小最多 **64 KiB**；数组或单个值请放在属性内。支持 draft 4、6、7、2019-09 和 2020-12，默认为 2020-12。引用**只能在 schema 内部**解析，不会读取其他文件或 URL。

## 并行运行多个智能体 {#run-several-agents}

重复指定 `-a` 或 `-A`，让每个目标接收相同的提示词和 stdin。**`--max-parallel`** 默认为 4。每个目标各有一段对话。

```bash
git diff main | codeg-cli -a claude_code -a codex -A code-reviewer \
  -p "Review this diff" -o review.md
```

- **文本**会为每份回答加上标签；**JSON** 按目标顺序返回数组，每次运行带有 `target_index`；**stream-json** 交错输出以 `run_id` 区分的事件。
- **`-o review.md`** 为每个目标写一个文件，例如 `review.1-claude_code.md` 和 `review.2-codex.md`。
- 使用 **`--output-schema`** 时，文本 stdout 为每个目标输出一个 JSON 值，没有有效结果则为 `null`；标签改为输出到 stderr。
- 所有目标共享工作目录和超时。修改文件时，用 **`--worktree`** 为每个目标提供独立检出。
- 仅当所有运行都成功时命令才退出 0；否则按目标顺序返回第一个失败目标的退出码。Ctrl-C 或 SIGTERM 会取消所有运行。

### 在独立 worktree 中修改代码 {#edit-in-separate-worktrees}

```bash
codeg-cli -a claude_code -a codex --max-parallel 2 \
  --worktree=fix-tests --permissions allow --timeout 30m \
  -p "Fix the failing tests and summarize your changes"
```

每次运行会在仓库旁边创建一个新的 [git worktree](/zh/guide/git#work-in-parallel-with-worktrees)，从仓库的 **HEAD** 开始。当前检出目录中未提交的改动不会复制过去。指定两个目标时，此示例创建 `cli/fix-tests-1` 和 `cli/fix-tests-2` 分支；名称已被占用时会追加运行 ID 后缀。单个目标使用 `cli/fix-tests`。未命名时，Codeg 使用运行 ID 的前几位。

如果 `-w` 指向仓库根目录之下，智能体会在新 worktree 中相同的子目录工作。`init` 和结果都包含 `worktree: {path, branch}`。worktree 和分支会保留，供你在 Codeg 中验收、合并或删除；若启动在创建对话之前就失败，新建的 worktree 和分支会被移除。

**命名 worktree 要使用 `=`**：`--worktree=review` 会命名，而 `--worktree review` 会创建未命名 worktree，并将 `review` 当作提示词。需要 git 2.33 或更高版本。

## 分离运行，稍后收集 {#detach-and-collect-later}

```bash
run_id=$(codeg-cli --detach -a codex --permissions reads -p "Review the latest commit")
codeg-cli result "$run_id" --wait 30m -o review.md
```

**`--detach`** 在提示词送达后返回，文本模式只打印运行 ID。它不能与 `-o` 同用，需通过 `result` 收集回答。即使命令已经退出，`--timeout` 到期时仍会取消运行。

两种 JSON 格式在分离时都返回 `init` 事件。多个目标时，文本模式每行打印一个 ID，`json` 返回 init 事件数组；`--max-parallel` 必须至少等于目标数量，以便所有目标都能在命令退出前启动。

**`result RUN`** 查询一次，或配合 `--wait DUR` 等待。等待结束时若仍在运行，会以退出码 **6** 退出，不会取消运行。原命令失去连接后，也可以用 `result` 收集结果。`cancel RUN` 则会取消。运行 ID 可缩短为至少八个字符、且没有歧义的前缀。

Codeg 将已结束的 CLI 结果**在内存中最多保留 30 分钟，且仅保留最近 200 次已结束运行**。繁忙的实例可能更早淘汰结果，重启 Codeg 会清空全部结果；对话仍保留在数据库中。请及时收集并保存需要的结果。对前台运行按 Ctrl-C／发送 SIGTERM 会取消它（退出码 130／143）；中断 `result` 则只会停止等待。

## 自动化与 CI {#automations-and-ci}

### 运行已保存的自动化 {#run-a-saved-automation}

使用 **`codeg-cli automations run ID`** 触发已保存的[自动化](/zh/guide/automations)。启动后会返回运行 ID；`--wait 30m` 等待结果。停止等待不会取消自动化。**排入任务**类型的自动化在待办入队后即成功，不会等待该任务的智能体工作。若同一数据目录上的另一个 Codeg 持有自动化运行权，请用 `--runtime` 选中它。

```bash
codeg-cli automations
codeg-cli automations run 3 --wait 30m --json
```

使用 `--wait` 时，命令在成功后退出 0、失败后退出 1，仍在运行则退出 6。需要结果时，请在触发命令上加 `--wait`；自动化的数字运行 ID 不能交给 `result` 查询。

### 在 CI 中使用临时服务器 {#use-a-temporary-server-in-ci}

在 CI runner 中，**`--standalone`** 会为当前命令启动位于旁边或 PATH 上的 `codeg-server`，仅监听本机，使用全新的临时数据目录。结束后会停止服务器并删除目录。请通过 CI 系统的机密配置提供智能体凭据：

```bash
set -euo pipefail
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0
# Set ANTHROPIC_API_KEY through the CI system's secret environment.
codeg-cli --standalone agents install claude_code
git show HEAD | codeg-cli --standalone -a claude_code -w "$PWD" \
  --timeout 30m -p "Review this commit for bugs" -o review.md
```

服务器中的智能体会继承当前命令的环境变量，包括凭据。每条命令都从全新状态开始：通过 npm 安装的智能体会保留，但设置、助手和下载的二进制文件不会。在每条命令上加上 **`--data-dir DIR`**，使用 CI 专用目录即可在命令间保留它们。独立服务器会拒绝已被当前版本 Codeg 占用的目录；旧版不参与该检查，因此也要避开其数据目录。

`--standalone` 不能与 `--url`、`--detach`、`result`、`cancel` 或 `open` 同用。对于 `agents install` 和 `automations run`，它会始终等到结束，因此也不要指定 `--wait`。

::: details GitHub Actions 示例
将下面内容保存为 `.github/workflows/codeg-review.yml`，并在仓库的 Actions secrets 中添加 `ANTHROPIC_API_KEY`。它会审查每次推送的最新提交，并将回答保存为构建产物。

```yaml
name: Codeg review
on: [push, workflow_dispatch]
permissions:
  contents: read
jobs:
  review:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Review the commit
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          set -euo pipefail
          curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0
          codeg-cli --standalone agents install claude_code
          git show HEAD | codeg-cli --standalone -a claude_code -w "$GITHUB_WORKSPACE" \
            --permissions reads --timeout 30m -p "Review this commit for bugs" -o review.md
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: codeg-review
          path: review.md
          if-no-files-found: ignore
```
:::

CI 任务也可以通过 `--url`／`--token-file`，或 `CODEG_URL`／`CODEG_TOKEN` 连接现有服务器，使用服务器上的工作目录，并将智能体凭据放在**服务器的环境变量**中。若要为多条命令共用一个由 CI 任务启动的服务器，参见[完整 CI 参考](https://github.com/spacering-net/codeg/blob/main/docs/cli.md#in-ci)。

在默认 `deny` 策略下，应通过管道将相关上下文送入提示词；如果智能体需要自行检查检出目录，请选择 `reads`。成功退出表示**回合完成**；如果要让检查发现的问题影响 CI 结果，应使用[结构化结论](#require-a-json-shape)。

## 退出码与故障排查 {#exit-codes-and-troubleshooting}

| 退出码 | 含义 |
| ---- | ------- |
| **0** | 智能体回合成功完成。 |
| **1** | 执行失败，包括智能体不可用或输出文件无法写入。 |
| **2** | 参数、工作目录、智能体、助手、schema 或会话选项无效。 |
| **3** | 超时，运行已取消。 |
| **4** | Codeg 无法连接、验证或访问；API 不兼容；或保留的结果已失效。 |
| **5** | 所选策略无法授予所需权限。 |
| **6** | 结果、智能体安装或自动化未在 `--wait` 时限内完成，仍在继续。 |
| **7** | 没有符合输出 schema 的结果。 |
| **130 / 143** | 被 SIGINT／SIGTERM 中断。前台运行会被取消。 |

**先运行 `codeg-cli status`。** `stale` 表示发现文件对应的进程已退出；`unreachable` 表示进程仍在但没有响应；`unverified` 表示响应方未能证明身份。`incompatible` 需要更新 Codeg 和 CLI 中较旧的那一个。找不到命令时，需要先[将它安装到 PATH](#get-the-command)，Windows 上还需打开新终端。

**`access_denied`／`error_runtime_access_denied`** 通常表示 shell 的沙箱连本机回环网络也禁止了。请允许该命令访问本地网络，或在沙箱外运行；重启 Codeg 不会解决。对于 Codeg 内的智能体，委派工具不需要经过这条 shell 连接。

脚本应按稳定的 `error.code` 处理错误，不要匹配消息文案：

| 错误代码 | 检查方法 |
| ---------- | ------------- |
| `token_missing`、`unauthorized` | 使用服务器的 `CODEG_TOKEN`，而不是智能体服务商的 API key。检查 `--token-file` 或 CLI 的 `CODEG_TOKEN`。 |
| `workspace_required`、`workspace_not_found` | 使用 `--url` 时，让 `-w` 指向**服务器上**实际存在的绝对目录。 |
| `unknown_agent`、`no_agent`、`agent_not_installed` | 运行 `codeg-cli agents`，用 `-a` 选择列出的名称，并在运行 Codeg 的机器上安装智能体。 |
| `invalid_value`、`option_unavailable` | 使用该智能体提供的模型、思考强度、模式或会话选项；适用时错误消息会列出可选值。 |
| `runtime_lost` | Codeg 已连续 30 秒没有响应，智能体可能仍在运行。重新连上同一个 Codeg，并在结果仍保留时用 `result RUN` 收集。 |
| `data_dir_in_use` | 连接已在使用该数据目录的 Codeg，或为 `--standalone` 指定独立目录。 |
| `output_schema_unmet` | 检查智能体回答和提示事件；回合结束时没有符合 schema 的结果。 |

本地监听器只接受本机连接，使用每次 Codeg 启动时生成的密钥，保存在仅所有者可读的发现文件中。以你的操作系统用户身份运行的任何程序都能读取它，并以你的身份运行智能体。关闭[命令行访问](/zh/reference/settings/system#command-line-access)会关闭该监听器，不影响已认证的服务器访问。边界详见[隐私与安全](/zh/reference/privacy#command-line-access)，全部错误码和协议字段见[完整 CLI 参考](https://github.com/spacering-net/codeg/blob/main/docs/cli.md)。
