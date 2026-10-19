---
title: 配置
description: 使用环境变量配置 codeg-server，了解 Codeg 将数据存储在何处，并调整日志、存储、代理和智能体运行时。
---

# 配置

Codeg 在两个地方进行配置。桌面应用和 Web 界面通过 **设置** 界面几乎暴露了所有内容——外观、智能体、版本控制、Web 服务等等。而界面*之外*的一切——独立的 [`codeg-server`](/zh/getting-started/deployment) 如何绑定和进行身份验证、数据在磁盘上的位置，以及少数几个高级运行时调节项——则由**环境变量**控制，这正是本页所要介绍的内容。

::: tip 使用桌面应用？
你多半用不到本页。请改从 **设置** 中配置 Codeg——参见[参考](/zh/reference/)部分。当你运行 `codeg-server`，或需要调整界面未暴露的某项内容时，再使用环境变量。
:::

## 工作原理 {#how-it-works}

`codeg-server` 从环境变量读取其配置——无论你以何种方式启动它，都可以设置这些变量：在 shell 中内联设置、在 systemd 单元中、在你的 Docker Compose `environment:` 块中，或用 `docker run -e`。这里**没有配置文件**；服务器唯一的持久状态是它的 SQLite 数据库（在桌面端还额外有一个小小的[偏好设置文件](#desktop-preferences)）。

有两条约定贯穿始终：

- **空值或仅含空白字符**的值视为未设置——将采用默认值。
- 数值型调节项将 **`0` 或无法解析的值**视为“使用默认值”，除非 `0` 明确表示*禁用*（下文会指出）。

## 核心设置 {#core-settings}

你在服务器上最可能设置的变量：

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_PORT` | `3080` | HTTP 和 WebSocket 监听端口。 |
| `CODEG_HOST` | `0.0.0.0` | 绑定地址——一个 IP、`localhost` 或带方括号的 IPv6 字面量。`0.0.0.0` 会在每个接口上暴露它。 |
| `CODEG_TOKEN` | *（随机）* | 每个 API 和 WebSocket 请求都需要的访问令牌。例外的那几类要么自带凭证——一次性下载链接、Office 实时预览的单文档能力凭证、forge [经过签名的 webhook 推送](/zh/reference/privacy#webhooks-for-auto-processing)——要么不泄露任何东西：Web 应用自身的文件，以及登录页的语言查询。若未设置，则会生成一个、保存到数据库，并在启动时打印到 stderr。 |
| `CODEG_AUTH` | `token` | 设为 `proxy-jwt` 时，服务器还会校验身份感知代理的签名断言，放行已由代理登录的浏览器，浏览器因此无需令牌。需要另外设置四个 `CODEG_PROXY_AUTH_*` 变量。→ [通过身份感知代理登录](#sign-in-through-an-identity-aware-proxy) |
| `CODEG_DATA_DIR` | *（因操作系统而异——见下文）* | 数据库、上传文件、日志和密钥的根目录。 |
| `CODEG_STATIC_DIR` | `./web` | 要提供服务的捆绑 Web 界面所在目录。 |
| `CODEG_MCP_BIN` | *（自动）* | 当 `codeg-mcp` 伴生程序不在服务器二进制文件旁边时其所在路径——某些源码构建需要它。没有它，[多智能体委派](/zh/guide/multi-agent)会被静默禁用。 |
| `CODEG_BRIDGE_PORTS` | *（`CODEG_PORT`+1 … +10）* | [端口桥](/zh/guide/browser#in-a-browser-session-the-port-bridge)绑定的端口，工作台里显示的每个开发服务器占一个：一个范围（`3081-3090`）、逗号列表、`auto`（任意空闲端口）或 `off`。解析不了的值会关闭端口桥而不是瞎猜。 |
| `CODEG_BRIDGE_PUBLIC_HOST` | *（未设置）* | 工作台访问桥端口时应使用的主机名（代替加载工作台所用的主机）——给把它们命名成别的名字的反向代理用。 |
| `CODEG_BRIDGE_HOST_PATTERN` | *（未设置）* | 在 Codeg 自己的端口上按**主机名**访问开发服务器，而不是绑定一段端口：`auto`（把端口放在工作台主机名的前面——`3000.codeg.example.com`），或一个恰好含一次 `{port}` 的模板，例如 `{port}.preview.example.com`。需要一条泛域名 DNS 记录，前面若有代理，还要在代理上配置泛域名虚拟主机。解析不了的值会关闭端口桥。→ [按主机名](/zh/guide/browser#by-hostname-instead-of-by-port) |
| `CODEG_BROWSER_TUNNEL` | `all` | 作为[远程工作区](/zh/guide/browser#in-a-remote-workspace-window)连接到本服务器的桌面应用，能通过其内置浏览器访问什么：`all`、`private`（回环、私有和链路本地地址）或 `off`，不区分大小写。未设置或为空即 `all`；其他任何值都会将其关闭。 |
| `CODEG_COMPUTER_USE` | *（关闭）* | 设为 `1`、`true`、`yes` 或 `on` 时，通过安装在服务器旁边的 `codeg-computer-helper`，在服务器那台机器自己的桌面上提供[电脑操作](/zh/guide/computer-use#on-a-server)。在 Linux 上，若没有 `DISPLAY` 或 `WAYLAND_DISPLAY`，它会发出警告。桌面应用不读取这个变量。 |

关于 `CODEG_HOST` 和 `CODEG_TOKEN` 在网络和 TLS 方面的影响，参见[部署](/zh/getting-started/deployment#access-it-securely)。

## 通过身份感知代理登录 {#sign-in-through-an-identity-aware-proxy}

当 `codeg-server` 部署在一个已经负责用户登录的代理之后（例如 [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)），访问令牌就成了代理登录之上的第二次登录。设置 `CODEG_AUTH=proxy-jwt` 后，服务器还会放行携带代理签名断言（一个 JWT）的请求，浏览器因此无需令牌。在此模式下令牌依然有效，供不经过代理的客户端使用，例如 `codeg-cli --url` 和脚本。

| 变量 | 取值 |
| -------- | ----- |
| `CODEG_AUTH` | `proxy-jwt` 开启此模式。未设置或为 `token`：仅使用令牌。 |
| `CODEG_PROXY_AUTH_HEADER` | 携带断言的请求头。 |
| `CODEG_PROXY_AUTH_JWKS_URL` | 代理发布其签名密钥的地址。须为 `https`，仅回环主机可用纯 `http`。 |
| `CODEG_PROXY_AUTH_ISSUER` | 断言必须携带的确切 `iss`。 |
| `CODEG_PROXY_AUTH_AUDIENCE` | 断言的 `aud` 必须包含的值。 |

仅有请求头并不会放行任何请求，因为任何能访问该端口的程序都能设置请求头。服务器会用代理发布的密钥校验断言的签名，并检查其签发者、受众和有效期。所有检查都按失败即拒绝处理：

- 缺少某项设置、模式名拼写错误，或设置了代理相关变量却未设置 `CODEG_AUTH=proxy-jwt`，服务器会在启动时以退出码 2 停止，并指出相应变量。
- 断言缺失、格式错误、已过期、属于其他受众或签发者、由未知密钥签名，或使用 RS256 和 ES256 以外的算法签名，均返回 401。在无法获取任何密钥期间，所有不带令牌的请求也返回 401。服务器只记录原因，从不记录断言本身。
- 断言有效、但请求由其他源的页面发出时，返回 403。参见[来自其他源的请求](#requests-from-other-origins)。

密钥在启动时获取，缓存一小时。当断言引用了服务器未见过的密钥时会提前重新获取，最多每 30 秒一次。获取失败时，继续使用已持有的密钥。`exp` 和 `nbf` 允许 60 秒的时钟偏差。

### Cloudflare Access {#cloudflare-access}

其中 `<team>` 是你的 Zero Trust 团队名称，`<AUD tag>` 是应用概览页上的 **Application Audience (AUD) Tag**：

```bash
CODEG_AUTH=proxy-jwt
CODEG_PROXY_AUTH_HEADER=Cf-Access-Jwt-Assertion
CODEG_PROXY_AUTH_JWKS_URL=https://<team>.cloudflareaccess.com/cdn-cgi/access/certs
CODEG_PROXY_AUTH_ISSUER=https://<team>.cloudflareaccess.com
CODEG_PROXY_AUTH_AUDIENCE=<AUD tag>
```

将服务器绑定到回环地址（`CODEG_HOST=127.0.0.1`），只通过隧道访问它，这样每个浏览器请求都会经过 Access。通过这种方式打开时，Web 应用会跳过令牌提示。Access 会话过期时，应用会显示 **Sign-in expired** 和 **Reload**。重新加载会让 Access 再次运行登录。

### 谁能进入 {#who-gets-in}

在此模式下，Codeg 不挑选用户。凡是代理以本应用的有效断言担保的请求，它都会放行，包括应用策略允许的服务令牌。因此代理的策略就是用户名单。请只纳入应当使用这台服务器的人，例如你自己的地址或某一个组，切勿使用 `Everyone`。受众检查把断言绑定到这一个应用上，因此登录同一代理后面的其他应用并不能进入 Codeg。

### 来自其他源的请求 {#requests-from-other-origins}

断言随代理的会话 Cookie 一起发送，而浏览器也会把这个 Cookie 附加到其他源的页面发出的请求上。因此，凭断言放行的请求必须来自 Codeg 自己的页面。服务器会在两种情况下以 403 拒绝：浏览器把请求标记为来自其他源（`Sec-Fetch-Site`），或者请求的 `Origin` 所指的主机与请求实际发往的主机不同（`Host`，或改写 `Host` 的代理所设置的 `X-Forwarded-Host`）。令牌不受影响，因为其他源的页面无法发送它。

Chrome 在 WebSocket 握手中不发送 `Sec-Fetch-Site`，因此对事件套接字起决定作用的是 `Origin`。所以 Codeg 前面的代理必须原样传递浏览器的 `Host`，或将其放入 `X-Forwarded-Host`。Cloudflare Tunnel 正是如此：它保留 `Host`；设置了 `httpHostHeader` 时，则把原值移到 `X-Forwarded-Host`。否则套接字会被拒绝，服务器的警告会写明 `Origin` 及其看到的主机。

::: warning `SameSite` 不覆盖同级子域名
把 Access 应用的 Cookie 设为 `SameSite=Lax`，可以让来自无关站点的请求不携带它（顶层导航除外，例如点击链接进入 Codeg）。但 `SameSite` 是按*站点*（协议加可注册域名）判断的，而不是按源。同一域名下其他子域名上的页面，例如与 `codeg.example.com` 上的 Codeg 并列、位于 `wiki.example.com` 的另一个应用，属于同一站点，即使 Cookie 设为 `Lax` 或 `Strict`，它发出的请求依然会带上这个 Cookie。拒绝这类请求的正是上文的服务器端检查，在同一域名下部署其他应用之前请记住这一点。
:::

此模式适用于独立服务器 `codeg-server`。桌面应用的 Web 服务仍然只使用令牌。

## Codeg 将数据存储在何处 {#where-codeg-stores-its-data}

除非你设置 `CODEG_DATA_DIR`，否则 `codeg-server` 会把数据保存在平台的数据目录中：

| 平台 | 默认数据目录 |
| -------- | ---------------------- |
| macOS | `~/Library/Application Support/codeg` |
| Linux | `~/.local/share/codeg` |
| Windows | `%APPDATA%\codeg` |

桌面应用将同类数据存储在相同位置的 `app.codeg` 文件夹下。在数据目录中你会找到：

- **`codeg.db`**——SQLite 数据库：会话、设置、频道、自动化——实际上就是 Codeg 的全部状态。
- **`uploads/`**——在浏览器或远程工作区窗口里作为附件上传的文件。
- **`pets/`**——桌面宠物资源。
- **`logs/`**——按天轮转的日志文件（参见[日志](#logging)）。
- **`acp-transcripts/`**——Codeg 为[自定义智能体](/zh/guide/custom-agents#where-its-history-lives)以及 ZCode、TRAE CLI 和 Command Code 自行记录的历史，每个智能体一个文件夹。
- **`mcp/`**——Codeg 自己记录的、它交给 ZCode 的那些 [MCP 服务器](/zh/guide/mcp)。
- **`cli/`**——[命令行访问](/zh/guide/command-line)的私有发现文件，由各个运行中的实例创建；它们是发现凭据，不是供你编辑的配置文件。
- **`tokens.json`**——服务器的加密密钥存储（git 凭据之类）。在桌面端，这些内容改为存放在你的系统密钥环中，因此该文件仅存在于服务器上。

要备份或迁移一个部署，复制此目录即可。（应用内的**备份**功能会将相同的状态导出为一个可移植的 `.codegbak` 归档文件。）

::: warning 技能存放在数据目录之外
已安装的技能保存在 `~/.codeg/skills/` 下，它遵循 `CODEG_HOME`（默认 `~/.codeg`），而**不是** `CODEG_DATA_DIR`。如果你在服务器上重新定位了数据目录，并希望技能随之迁移，也请设置 `CODEG_HOME`。当两者都设置时，对于 `uploads/`、`pets/`、`logs/`、`acp-transcripts/` 和 `mcp/`，`CODEG_HOME` 也优先于 `CODEG_DATA_DIR`。
:::

## 命令行环境变量 {#command-line-environment}

从 **0.38.0** 起，[`codeg-cli`](/zh/guide/command-line) 可通过环境变量选择运行中的 Codeg。这些变量与命令行选项一起配置的是**客户端**：

| 变量 | 用途 |
| -------- | ------- |
| `CODEG_URL` | HTTP(S) Codeg 地址，与 `CODEG_TOKEN` 配合使用。 |
| `CODEG_TOKEN` | 服务器访问令牌；使用 `--url` 却未提供令牌选项时也会读取它。 |
| `CODEG_DATA_DIR` | 在该数据目录中发现本地 Codeg。 |
| `CODEG_CLI_ENDPOINT_FILE` | 某个实例的发现文件。由 Codeg 在自己的终端和智能体进程中设置。 |
| `CODEG_CLI` | Codeg 在这些进程中提供的 CLI 完整路径。若 shell 调整了 PATH，可调用 `"$CODEG_CLI"`。 |

选择顺序是 **`--url` → `--data-dir` → `CODEG_CLI_ENDPOINT_FILE` → `CODEG_URL` → `CODEG_DATA_DIR` → 默认目录**。显式目标连接失败后，不会改选其他实例。只有指定 `--standalone` 时才会启动临时服务器。参见[实例选择](/zh/guide/command-line#choose-which-codeg-to-use)和[命令行访问设置](/zh/reference/settings/system#command-line-access)。

## 存储限制 {#storage-limits}

默认情况下，上传内容的总量只受你的磁盘容量限制。要对其加以约束：

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_UPLOAD_MAX_TOTAL_BYTES` | *（无上限）* | `uploads/` 下所有内容的硬性上限（以字节为单位）——例如 `10737418240` 表示 10 GiB。未设置、`0` 或无效值会禁用该上限。 |
| `CODEG_UPLOAD_QUOTA_STRICT` | *（关闭）* | 当为真值（`1` / `true` / `yes` / `on`）时，如果上面的配额已设置但无法解析，则拒绝启动（退出码 2），而不是带着警告回退到“无上限”。当策略要求已配置的配额必须真正生效时使用它。 |
| `CODEG_BACKUP_UPLOAD_MAX_BYTES` | *（无上限）* | 恢复端点将接受的最大备份归档。 |

此外，在浏览器或远程工作区窗口里作为附件上传的每个文件，各自还有 **20 MiB** 的上限——这是一个固定限制，不可配置。超过上限的文件会被跳过，并有一条提示写明它的名字，其余文件照常附加。已经在服务器上的文件——比如用**附加服务端文件**选中的那些——会直接以它在服务器上的路径附加，不受这个上限约束。**0.22.0** 之前这个上限是 2 MiB。

## 日志 {#logging}

Codeg 会将按天轮转的日志写入数据目录中的 `logs/`，并将它们镜像到应用内的查看器中。

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_LOG` | *（已保存的级别）* | 一个 tracing 过滤指令——`info`、`debug`，或像 `codeg=debug,tower_http=warn` 这样的定向设置。优先于 `RUST_LOG`，并且在其被设置期间，它会锁定界面中的级别选择器。 |
| `RUST_LOG` | *（未设置）* | 标准的 Rust 日志过滤器。仅当 `CODEG_LOG` 为空时使用。 |
| `CODEG_LOG_MAX_FILES` | `30` | 保留的按天轮转日志文件数量。 |
| `CODEG_LOG_MAX_BYTES` | `536870912` | 单日日志文件的上限（512 MB）。触顶后当天的文件会停止写入，并在日志查看器中明确告知。设为 `0` 可取消该上限。 |

对于日常使用，你可以改为从界面更改级别——参见[设置 → 日志](/zh/reference/settings/logs)。

## 代理支持 {#proxy-support}

启动时，Codeg 会对标准的 `HTTP_PROXY`、`HTTPS_PROXY` 和 `ALL_PROXY` 变量（及其小写形式）拍下快照，并将它们传播给它启动的每一个智能体进程。因此，一处代理设置就同时覆盖了 Codeg *以及*它所驱动的智能体——这正是为企业网关设计的路径。自 **0.32.2** 起，每个带着代理启动的智能体，其 `NO_PROXY` 里还会被加入本机地址——`localhost`、`127.0.0.1`、`::1`——这样智能体连向自己本地服务的连接，永远不会被送到另一台机器上的代理那里；[设置 → 系统](/zh/reference/settings/system#network-proxy)里的**不走代理的地址**列表还可以加上你自己的地址。那份列表里、或你导出的 `NO_PROXY` 里的 `*`，会被单独传出去，表示*全部绕过代理*——而 Antigravity 从 **1.3.0** 起不再完全遵守它；原因见同一页。关于 Codeg 如何处理网络访问，参见[隐私与安全](/zh/reference/privacy)。

## 高级调优 {#advanced-tuning}

你很少会用到这些——默认值的选择对几乎所有人来说都是合适的。它们决定了空闲的智能体连接和预览服务器在被回收之前会存续多久：

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_ACP_IDLE_TIMEOUT_SECS` | `180` | 空闲这么多秒后回收一个智能体连接。`0` 会禁用该清理。 |
| `CODEG_ACP_SPAWN_HANDSHAKE_TIMEOUT_SECS` | `60` | 在放弃之前，等待智能体启动并完成其握手的时长。 |
| `CODEG_ACP_BACKGROUND_KEEPALIVE_MAX_SECS` | `3600` | 带有未完成后台工作的连接能豁免于空闲清理多长时间。`0` 会禁用该豁免。 |
| `CODEG_OFFICE_WATCH_IDLE_TIMEOUT_SECS` | `300` | 空闲这么多秒后回收一个空闲的 [Office 实时预览](/zh/guide/office)服务器。`0` 会禁用。 |
| `CODEG_ACP_HOST_TOOLS` | *（未设置）* | 设为 `agent`，Codeg 就不再代为提供文件访问和终端命令，改由智能体自己执行、落在它自己的沙箱之内——同时也会连带失去委托工具。每个智能体的环境变量编辑器旁边都有一个对应的开关；把这个变量设在 Codeg 自己的进程上，则会成为那些自己没有设置它的智能体的默认值。→ [使用智能体](/zh/guide/agents#let-the-agent-handle-its-own-files-and-commands) |

远程工作区同步还暴露了一组并发调节项（`CODEG_WORKSPACE_UPLOAD_MAX_CONCURRENCY` 及类似变量）；它们的默认值很合理，很少需要更改。

### 更新监督 {#update-supervision}

当你在 `--supervise` 下运行服务器时（参见[部署](/zh/getting-started/deployment#keep-your-server-up-to-date)），有两个调节项塑造了就地升级的安全网：

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_UPGRADE_TRIAL_SECS` | `30` | 刚升级的服务器必须在此窗口内成功启动，否则将被自动回滚。 |
| `CODEG_RESTART_DELAY_MS` | `2000` | 升级后监督进程重新启动服务器前的暂停时间（最小 `200`）。 |

监督进程会设置 `CODEG_SUPERVISED`，Docker 镜像会设置 `CODEG_RUNTIME=docker`，这些都是自动完成的——它们由系统为你管理，而非需要你手动设置的东西。

## 桌面偏好设置 {#desktop-preferences}

桌面应用将其设置保存在数据库中，通过设置界面进行管理——但有一个例外。`~/.codeg/preferences.json` 会在应用窗口启动*之前*被读取，其中只保存一个字段：

```json
{ "disable_hardware_acceleration": false }
```

它对应应用设置中的一个开关。只有在遇到导致窗口无法渲染的 GPU 或驱动问题需要恢复时，才手动编辑它——将其设为 `true`，重新启动，Codeg 就会在不使用硬件加速的情况下启动。`codeg-server` 从不读取此文件。

桌面端还有两个环境变量作用于[内置浏览器](/zh/guide/browser)，都在启动时读取一次：

| 变量 | 默认值 | 作用 |
| ---- | ------ | ---- |
| `CODEG_POLICY_FILE` | *（按操作系统而定——见[站点规则](/zh/guide/browser#rules-set-by-an-administrator)）* | 管理员策略文件的路径，可以钉死按站点的规则，也可以为机器上的每位用户关闭内置浏览器。 |
| `CODEG_BROWSER_SIGN_IN_HOSTS` | *（Google 的登录主机）* | 逗号分隔的主机名（子域名也算）：标签页会对这些主机的登录页面呈现 Firefox 身份，用于像 Google 一样拒绝内嵌浏览器的登录提供方。 |

## 智能体自身的设置 {#your-agents-own-settings}

Codeg 通过*每个智能体*自己的环境变量来找到它现有的会话——`CLAUDE_CONFIG_DIR`、`CODEX_HOME`、`GEMINI_CLI_HOME` 等等。如果你已将某个智能体 CLI 指向非默认位置，Codeg 会自动跟随它——无论这个变量是设在 Codeg 自己的环境里，还是自 **0.35.2** 起、设在设置 → 智能体中该智能体的**环境变量**里，后者优先。完整的映射见[支持的智能体](/zh/guide/supported-agents#where-each-agent-keeps-its-sessions)。

## 后续步骤 {#next-steps}

- [**部署**](/zh/getting-started/deployment)——启动、监督和更新 `codeg-server`。
- [**支持的智能体**](/zh/guide/supported-agents)——每个智能体将会话保存在何处，以及 Codeg 所遵循的变量。
- [**设置 → 日志**](/zh/reference/settings/logs)——从界面更改日志级别并查看运行日志。
