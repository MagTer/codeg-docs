---
title: 部署
description: 使用 codeg-server 或 Docker 在 Linux 或 macOS 服务器上以无头方式运行 Codeg，并从任意浏览器访问你的工作区。
---

# 部署

**`codeg-server`** 就是以无头方式运行的 Codeg——与桌面应用相同的智能体、会话、频道和[多智能体协作](/zh/guide/multi-agent)，由你掌控的机器提供服务，并可在任意浏览器中访问。只需在一台常开的服务器上部署一次，你的工作区便可从任何设备访问，无需桌面端。它由访问令牌守护。

::: tip 只是想偶尔在浏览器中使用桌面应用？
那你不需要服务器——打开 [Web 服务](/zh/reference/settings/web-service)，正在运行的桌面应用便会通过网络提供自身。当你想让 Codeg 在**没有**桌面端的情况下运行时——常开、无头或共享——再考虑 `codeg-server`。
:::

## 部署方式 {#ways-to-deploy}

| 方式 | 最适合 |
| ------ | -------- |
| [**Docker**](#docker) | 最简单的持久化部署——隔离、自我监督、一条命令搞定 |
| [**一行命令安装**](#one-line-install-linux-macos) | 将原生二进制文件直接装到 Linux 或 macOS 主机上 |
| [**预构建二进制文件**](#prebuilt-binaries) | 手动、离线或完全受控的安装 |
| [**从源码构建**](#build-from-source) | 自定义补丁或不受支持的平台 |

每种方式都会安装 `codeg-server` 及其 `codeg-mcp` 伴生程序，因此多智能体委派在服务器上的运作方式与桌面端完全一致。自 **0.33.0** 起，安装脚本和发布压缩包还会附带 `codeg-computer-helper`，供要在自己桌面上提供[电脑操作](/zh/guide/computer-use)的服务器使用；Docker 镜像则不带。

从 **0.38.0** 起，安装包和 Docker 镜像还包含 **`codeg-cli`**，用于从终端或 CI 任务运行智能体和助手。→ [命令行](/zh/guide/command-line)

## Docker {#docker}

最快的持久化部署只需一条命令：

```bash
docker run -d -p 3080:3080 -v codeg-data:/data ghcr.io/spacering-net/codeg:latest
```

这就是一次完整的安装：该镜像捆绑了 Web 界面、`git` 和 `ssh`，以自带的监督进程作为 PID 1 运行，并将所有内容持久化到 `codeg-data` 卷中。首次启动时，它会生成一个随机访问令牌并写入日志——用 `docker logs` 读取它，或者设置你自己的令牌并挂载一个项目目录以处理本地仓库：

```bash
docker run -d -p 3080:3080 \
  -v codeg-data:/data \
  -v /path/to/projects:/projects \
  -e CODEG_TOKEN=your-secret-token \
  ghcr.io/spacering-net/codeg:latest
```

镜像以多架构（amd64 + arm64）形式发布到 `ghcr.io/spacering-net/codeg` 和 Docker Hub 上的 `xintaofei/codeg`，并以每个版本的版本号作为标签（`:0.38.0`）。`:latest` 只跟随**稳定**版本——候选发布版有自己的版本标签，以 `-rc.N` 结尾，且永远不会移动 `latest`。

::: warning 还在从 `ghcr.io/xintaofei/codeg` 拉取？请换成新名称
Codeg 的仓库已迁到 `spacering-net/codeg`，自 **0.34.0** 起，GitHub 的镜像仓库改用新名称发布。**`ghcr.io/xintaofei/codeg` 停在 0.33.0**——仍写着它的容器或 Compose 文件会一直拉取那个版本，再也不会更新。把镜像改成 `ghcr.io/spacering-net/codeg` 即可；`codeg-data` 卷与镜像名称无关，数据会一并带过去。Docker Hub 上的 `xintaofei/codeg` 照常更新。
:::

### 使用 Compose {#with-compose}

对于任何长期运行的场景，请使用 Compose。将以下内容保存为 `docker-compose.yml`：

```yaml
services:
  codeg:
    image: ghcr.io/spacering-net/codeg:latest
    ports:
      - "3080:3080"
      - "3081-3090:3081-3090"   # 端口桥：在工作台里显示开发服务器
                                  # （或设置 CODEG_BRIDGE_HOST_PATTERN 并删掉这一行）
    volumes:
      - codeg-data:/data
      # - /path/to/projects:/projects   # optional: expose local repos
    environment:
      - CODEG_TOKEN=${CODEG_TOKEN:-}
      - CODEG_PORT=3080
      - CODEG_HOST=0.0.0.0
    restart: unless-stopped

volumes:
  codeg-data:
```

然后运行 `docker compose up -d`。通过 `.env` 文件或你的 shell 提供 `CODEG_TOKEN`。

::: warning 就地升级无法在容器重建后保留
服务器可以自我升级（参见[保持服务器更新](#keep-your-server-up-to-date)），但在 Docker 内部，该升级会写入正在运行的容器的可写层——而非镜像。你的 `/data` 卷会保留，但一旦容器被重建（`docker compose up --force-recreate`、重新执行 `docker run`，或在 `docker pull` 之后重建），升级后的二进制文件就会丢失。要永久升级，请拉取或构建新镜像，并据此重建容器。
:::

## 一行命令安装（Linux / macOS） {#one-line-install-linux-macos}

将原生二进制文件直接安装到主机上：

```bash
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash
```

这会将 `codeg-server`、`codeg-mcp`、`codeg-computer-helper` 和 `codeg-cli` 放入 `/usr/local/bin`，并将捆绑的 Web 资源放入 `/usr/local/share/codeg/web`，仅在目标位置尚不可写时才使用 `sudo`。用 `--version` / `--dir` 来固定版本或更改位置：

```bash
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0 --dir ~/.local/bin
```

然后启动它。安装程序会为你打印出确切的命令；在无人值守的主机上添加 `--supervise`，这样失败的自我升级就会自动回滚：

```bash
CODEG_STATIC_DIR=/usr/local/share/codeg/web codeg-server --supervise
```

除非你自行设置 `CODEG_TOKEN`，否则访问令牌会在启动时打印到 stderr。

### Windows {#windows}

```powershell
irm https://raw.githubusercontent.com/spacering-net/codeg/main/install.ps1 | iex
```

这会安装到 **`%LOCALAPPDATA%\codeg-server`** 并将其添加到你的 PATH。用随它一起安装的 Web 文件启动它：

```powershell
$env:CODEG_STATIC_DIR="$env:LOCALAPPDATA\codeg-server\web"; codeg-server
```

用 `.\install.ps1 -Version v0.38.0` 固定版本，或用 `-InstallDir` 选择安装文件夹。Windows 上禁用了自我更新——请通过重新运行安装程序来升级。

::: info 自 0.33.0 起，服务器有了自己的文件夹
它以前安装在 `%LOCALAPPDATA%\codeg`——也就是**桌面应用的**文件夹——两者在那里可能互相覆盖对方的文件、终止对方的进程。重新运行脚本时，如果发现服务器与桌面应用共用那个文件夹，脚本会把服务器迁到 `codeg-server`，只带走 `codeg-server.exe` 及其 PATH 条目，桌面应用的文件一概不动；独占旧文件夹的服务器则留在原处。脚本会拒绝任何装有桌面应用的目标位置，而从桌面应用文件夹启动的服务器会在启动时警告它应该搬走。如果有服务、计划任务或快捷方式仍在启动旧的那一份，或者 `CODEG_STATIC_DIR` 仍指向 `%LOCALAPPDATA%\codeg\web`，请把它们改为指向新文件夹。
:::

## 预构建二进制文件 {#prebuilt-binaries}

每个版本都会在 [Releases](https://github.com/spacering-net/codeg/releases) 页面提供一个自包含的服务器捆绑包——包含二进制文件和 Web 资源，均经过签名和校验和验证：

| 平台 | 文件 |
| -------- | ---- |
| Linux x64 | `codeg-server-linux-x64.tar.gz` |
| Linux arm64 | `codeg-server-linux-arm64.tar.gz` |
| macOS x64 | `codeg-server-darwin-x64.tar.gz` |
| macOS arm64 | `codeg-server-darwin-arm64.tar.gz` |
| Windows x64 | `codeg-server-windows-x64.zip` |

解压并运行——`web/` 文件夹与二进制文件放在一起，因此只需将 `CODEG_STATIC_DIR` 指向它：

```bash
tar xzf codeg-server-linux-x64.tar.gz
cd codeg-server-linux-x64
CODEG_STATIC_DIR=./web ./codeg-server --supervise
```

## 从源码构建 {#build-from-source}

```bash
pnpm install && pnpm build          # build the web UI
cd src-tauri
cargo build --release --bin codeg-server --no-default-features --features server-bin
cargo build --release --bin codeg-mcp --no-default-features --features mcp-bin   # delegation companion
cargo build --release --bin codeg-cli --no-default-features --features cli-bin   # command-line client
CODEG_STATIC_DIR=../out ./target/release/codeg-server
```

完整的工具链和平台先决条件请见[开发](/zh/reference/development)指南。

## 配置 {#configuration}

`codeg-server` 完全通过环境变量进行配置——没有配置文件：

| 变量 | 默认值 | 说明 |
| -------- | ------- | ----------- |
| `CODEG_PORT` | `3080` | HTTP 端口 |
| `CODEG_HOST` | `0.0.0.0` | 绑定地址 |
| `CODEG_TOKEN` | *（随机）* | 访问令牌——若未设置，则在启动时打印到 stderr |
| `CODEG_DATA_DIR` | `~/.local/share/codeg` | SQLite 数据库、上传文件和资源 |
| `CODEG_STATIC_DIR` | `./web` | Web 界面目录（捆绑的 `web/` 导出） |
| `CODEG_MCP_BIN` | *（同级目录）* | `codeg-mcp` 的路径（当它不与服务器放在一起时） |
| `CODEG_BRIDGE_PORTS` | *（`CODEG_PORT` 之后的十个端口）* | [端口桥](/zh/guide/browser#in-a-browser-session-the-port-bridge)可占用的端口，用于在工作台里显示开发服务器——一个范围（`3081-3090`）、一个列表、`auto` 或 `off` |
| `CODEG_BRIDGE_PUBLIC_HOST` | *（加载工作台所用的主机）* | 当反向代理给桥端口换了名字时，浏览器访问它们应使用的主机名 |
| `CODEG_BRIDGE_HOST_PATTERN` | *（未设置——按端口桥接）* | 在 Codeg 自己的端口上按**主机名**显示开发服务器，而不是占用一段端口：`auto`，或形如 `{port}.preview.example.com` 的模板。需要泛域名解析 → [按主机名](/zh/guide/browser#by-hostname-instead-of-by-port) |
| `CODEG_BROWSER_TUNNEL` | `all` | 作为远端工作区连接到本服务器的桌面应用，其内置浏览器能经由本服务器访问哪些地址：`all`、`private` 或 `off` → [远端工作区窗口](/zh/guide/browser#in-a-remote-workspace-window) |
| `CODEG_COMPUTER_USE` | *（关闭）* | 设为 `1` 时，在服务器那台机器自己的桌面上提供[电脑操作](/zh/guide/computer-use#on-a-server) |

::: tip 生产环境中务必设置令牌
若不设置，`CODEG_TOKEN` 会被随机生成并打印到日志中——用于快速试用尚可，但对于任何长期部署都应设置你自己的令牌。可调项的完整列表——上传配额、ACP 超时、日志——见[配置](/zh/getting-started/configuration)。
:::

## 安全访问 {#access-it-securely}

默认情况下，服务器绑定 `0.0.0.0:3080`，因此任何能路由到该主机的设备都可以访问它。这正是远程访问所需要的——但这也意味着**令牌是你唯一的防线**。在公开主机上有几件事要做对：

- **将其置于 HTTPS 之后。** `codeg-server` 使用纯 HTTP 通信，没有内置的 TLS。请在其前面架设一个反向代理——Caddy、nginx 或 Traefik——由它终止 TLS 并转发到 `127.0.0.1:3080`。设置 `CODEG_HOST=127.0.0.1`，使得只有代理（而非整个网络）能够直接访问服务器。
- **对令牌保密。** 每个 API 和 WebSocket 请求都必须携带它，只有少数几类除外：自带凭证的那几种——一次性下载链接、Office 实时预览的单文档能力凭证，以及 forge 的 webhook 推送（改为通过签名验证）——还有不泄露任何东西的应用自身文件和登录页的语言查询。通过以新的 `CODEG_TOKEN` 重启来轮换它。
- **或者让登录代理为浏览器担保。** 在 Cloudflare Access 之类的身份感知代理之后，`CODEG_AUTH=proxy-jwt` 会凭代理的签名断言放行浏览器，不再需要令牌，用户只需登录一次。令牌对 `codeg-cli` 和脚本依然有效。此时由代理的策略决定谁能进入。→ [通过身份感知代理登录](/zh/getting-started/configuration#sign-in-through-an-identity-aware-proxy)
- **如果你用 webhook，就要放 forge 进来。** 仓库面板的 [webhook 触发](/zh/guide/repository#set-up-the-webhook)会投递到这台服务器上的 `/api/forge_webhook`，而 forge 只能向它访问得到的地址投递。如果前面挡着一道登录网关——比如 Cloudflare Access——请为这条路径开个例外，否则推送永远到不了 Codeg；每一次推送到达时都会与某个文件夹的密钥比对。→ [Webhook](/zh/reference/privacy#webhooks-for-auto-processing)
- **桥端口也照此发布。** [端口桥](/zh/guide/browser#in-a-browser-session-the-port-bridge)同样在 `CODEG_HOST` 上绑定 `CODEG_BRIDGE_PORTS`。这些端口只回应从已登录工作台打开过页面的浏览器，但放在 TLS 代理之后时它们同样需要 TLS（工作台用自己的 scheme 访问它们），而 `CODEG_HOST=127.0.0.1` 时它们和主端口一样需要转发。不想运行它就设置 `CODEG_BRIDGE_PORTS=off`。
- **或者干脆不用这些端口。** 设置了 `CODEG_BRIDGE_HOST_PATTERN`，开发服务器就会在工作台已经在用的那个端口上按名字访问——`3000.codeg.example.com`——因此无需额外发布任何东西，只要有一条泛域名 DNS 记录、并在你的代理上配置一个泛域名虚拟主机，把这些名字送到服务器即可。
- **决定远端工作区的浏览器能访问什么。** 作为[远端工作区](/zh/guide/browser#in-a-remote-workspace-window)连接到本服务器的桌面应用，会通过服务器承载的一条隧道，在其内置浏览器里打开服务器那一侧的地址——默认可以访问服务器能访问到的任何地方，理由是持有令牌本就能在那里运行命令。`CODEG_BROWSER_TUNNEL=private` 把它限定在回环、私有和链路本地地址——其中仍包括云服务商的元数据地址——而 `off` 则把它关掉。
- **除非你主动开启，电脑操作始终是关闭的。** 设置 `CODEG_COMPUTER_USE=1` 后，任何持有令牌的人都能从浏览器把那台机器的窗口共享给智能体，而唯一的停止入口在状态栏弹层里——悬浮停止条和停止快捷键都只属于桌面应用。→ [在服务器上](/zh/guide/computer-use#on-a-server)

对于负载均衡器或编排器的存活探测，经过身份验证的 `POST /api/health`（携带 bearer 令牌）会返回 `{"status":"ok","version":"…"}`。

### 如果你的代理要求它自己的请求头 {#if-your-proxy-demands-its-own-headers}

有些网关在请求不带上它们要的东西时，压根不会转发——最常见的就是 Cloudflare Access 的 service token。从 **0.28.2** 起，远端工作区连接可以携带**自定义 HTTP 请求头**，桌面客户端发往该连接的每个请求都会带上它们。

它们位于该连接的管理对话框中，在访问令牌下方的**自定义请求头**一节里。除非这个连接已经配置过，否则这一节保持折叠，而且**值是掩码显示**的——因为这里的请求头几乎总是承载着某种凭据。它是一个列表而不是「名字唯一」的表，所以需要发两次的请求头也能用，同名的两个值会按你输入的顺序保持。

这些请求头属于**那个连接自己的主机**，不会去到别处——而且和访问令牌一样，只走你配置的那个协议：配置为 `https://box:8443` 的连接，不会把凭据交给 `http://box:8443`。

::: warning 这些存在数据库里，而不是密钥环里
一个连接的访问令牌及其自定义请求头，未加密地存放在该连接位于 Codeg SQLite 数据库中的那一行上——这与进入操作系统密钥环的 Git 和聊天凭据不同。任何能读到数据目录的人都能读到它们。→ [隐私与安全](/zh/reference/privacy#where-secrets-are-kept)
:::

## 把它安装成应用 {#install-it-as-an-app}

网页版可以像应用一样安装。把它添加到手机主屏幕——或者在提供安装选项的桌面浏览器里安装它——它就会在自己独立的窗口中打开，并配有一个满版图标。自 **0.35.0** 起，手机浏览器的地址栏以及 Android 的导航栏会跟随你的浅色或深色主题，而应用的 manifest 会带着你的 cookie 获取，因此在登录代理之后也能正常安装。

自 **0.35.2** 起，它还会**在你的浏览器里保存一份自身的副本**。被浏览器休眠的标签页重新打开时不必再下载一遍 Codeg；而在服务器重启或离线期间刷新页面，显示的会是 Codeg 自己的*连接已断开*界面，带有**立即重连**，而不是浏览器的错误页。保存下来的是应用本身，不含任何属于你的东西：

- **只有构建文件和页面外壳。** 任何 `/api` 调用和实时连接都不会经过这份缓存，所以里面不会存下任何对话、文件或设置——经由[端口桥](/zh/guide/browser#in-a-browser-session-the-port-bridge)显示的开发服务器也会直接穿过它。
- **只在浏览器允许的地方**——通过 **HTTPS**，或在 `localhost` 上。以纯 `http://` 局域网地址访问服务器的手机不会得到这份副本，桌面应用也从不使用它。
- **每个版本一份。** 新版本会装上一份新副本，并清掉更早的那些，只留下上一个版本的文件。如果安装无法完成——比如位于一个会把这次请求重定向走的登录代理之后——那就只是没有副本而已，其他一切照旧。
- **页面仍然先找服务器要。** 只有服务器答不了时——完全连不上，或者服务器出错——页面加载才会用这份副本，所以跳转到登录页的重定向，或服务器实际给出的任何其他答复，都照常通过。构建文件本身在一个版本内不会变，直接从副本里取。

**服务器升级或回滚后**，已打开的标签页可能仍在运行旧版界面。从 **0.38.0** 起，Codeg 会在页面加载和重新连接后检查服务器版本。不一致时，会显示持续保留的提示，列出两个版本，并提供**刷新**按钮。由当前页面发起的应用内升级或回滚会自行刷新。新加载的页面会向服务器重新验证文件；带内容哈希的构建资源仍可缓存。

Codeg 没有为浏览器缓存提供开关；要移除这份副本，请在浏览器里清除该站点的数据。

## 保持服务器更新 {#keep-your-server-up-to-date}

与桌面应用一样，`codeg-server` 也可从**设置 → 软件更新**自我更新：它会下载适用于其平台的、经过签名的版本，验证签名（自 **0.36.0** 起，签名必须写明的恰好是所提供的那个版本，这样一个较旧的已签名压缩包就没法冒充成较新的版本），替换磁盘上的二进制文件和 Web 资源，然后重启——无需重新部署。上一个版本会被保留，因此同一界面上还提供了**回滚**。此功能仅限 Linux/macOS（Windows 上已禁用）。自 **0.32.1** 起，无法写入自身安装位置的服务器——比如二进制文件或 Web 文件夹不归它所有、磁盘已满——会在你尝试**之前**就在该界面上说明这一点，并改为提供发布页面，供你手动更新。

**从 0.37.0 更新不会安装 `codeg-cli`。** 请从新版本的服务器压缩包中提取，并放到 `codeg-server` 旁边。**从 0.38.0 及之后的版本发起**的更新会同时更新匹配的 CLI。服务器重启会结束正在进行的 CLI 运行，因此请先让重要工作完成再升级。

在其监督进程下运行它，以确保升级安全：

```bash
./codeg-server --supervise
```

使用 `--supervise` 时，刚升级的进程如果在其试用窗口内未能启动，就会自动还原到上一个版本。不使用它时，服务器仍会就地更新（它会重新执行自身），但无法在启动失败时自动回滚。Docker 镜像已经在监督模式下运行。

::: tip 重启需要服务管理器
`--supervise` 能让服务器在升级过程中保持存活，但它无法在机器重启后把进程拉起来。Codeg 不附带 systemd 单元——如果你希望它自动恢复，请将 `codeg-server --supervise` 包装进你自己的单元，或依靠 Compose 的 `restart: unless-stopped`。
:::

## 后续步骤 {#next-steps}

- [**配置**](/zh/getting-started/configuration)——每一个环境变量和运行时选项。
- [**Web 服务**](/zh/reference/settings/web-service)——通过网络提供你现有的桌面应用，而无需运行服务器。
- [**支持的智能体**](/zh/guide/supported-agents)——在无头主机上安装和管理智能体。
- [**架构**](/zh/reference/architecture)——桌面应用与 `codeg-server` 如何共享同一个 Rust 内核。
