---
title: 开发
description: 开发 —— 从源码构建 Codeg。前置要求、五个二进制文件及各自的编译方式、日常开发流程，以及 lint、测试和检查命令。
---

# 开发

本页面向**从源码构建 Codeg** —— 无论是为了对它做二次开发、自行打包，还是运行一个未发布的构建。Codeg 是单个 Cargo 工作区，产出五个 Rust 二进制文件外加一个 [Next.js](https://nextjs.org/) 前端，其工具链也反映了这一点：你既需要 Node 环境，也需要 Rust 环境。下面的命令正是项目自身所用的；除非另有说明，请从仓库根目录运行它们。

## 前置要求 {#prerequisites}

| 工具 | 版本 | 用于 |
| ---- | ------- | --- |
| **Node.js** | `>=22`（推荐） | 前端和 `pnpm` 脚本 |
| **pnpm** | `>=10` | 仓库锁定使用的包管理器 |
| **Rust** | stable（2021 版） | `codeg_lib` 核心和全部五个二进制文件 |
| **Tauri 2 构建依赖** | — | 仅 **桌面** 二进制文件（`codeg`） |

只有在构建**桌面**应用时才需要 Tauri 系统库；服务器、命令行客户端和那两个伴生程序无需它们即可编译。在 Debian/Ubuntu 上：

```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf
```

（macOS 和 Windows 有各自的 Tauri 前置要求 —— 参见 [Tauri 2 前置要求指南](https://v2.tauri.app/start/prerequisites/)。）

然后安装一次 JavaScript 依赖：

```bash
pnpm install
```

## 五个二进制文件 {#the-four-binaries}

一切都从单个工作区、在共享的 `codeg_lib` crate 之上构建 —— [架构](/zh/reference/architecture)页面解释了这一设计。二进制文件之间的差异在于 **Cargo 特性**。*默认*特性构建开启了 Tauri GUI 的**桌面**应用。其余四个各自需要一个属于自己的特性 —— `server-bin`、`mcp-bin`、`computer-helper`、`cli-bin` —— 并以 `--no-default-features` 构建，于是同一核心以**无头**方式编译。

这四个特性默认关闭是有意为之。桌面打包器会把一次构建产出的每个二进制文件都打进包里，在有这些特性之前，桌面应用正是这样带上了一个它从未用过的服务器。

| 二进制文件 | 它是什么 | 构建 |
| ------ | ---------- | ----- |
| **`codeg`** | Tauri 桌面应用（窗口、托盘、更新器） | `pnpm tauri build` · `pnpm tauri dev` |
| **`codeg-server`** | 用于浏览器 / 无头场景的独立 HTTP + WebSocket 服务器 | `pnpm server:build` · `pnpm server:dev` |
| **`codeg-cli`** | 运行中的桌面应用或服务器的终端客户端 | 在 `src-tauri/` 中运行 `cargo build --release --bin codeg-cli --no-default-features --features cli-bin`，或 `pnpm tauri:prepare-sidecars` |
| **`codeg-mcp`** | 按次启动的 stdio MCP 伴生程序，为智能体 CLI 提供 `delegate_to_agent` 和会话内工具 | `pnpm tauri:prepare-sidecars` |
| **`codeg-computer-helper`** | [电脑操作](/zh/guide/computer-use)的 helper，负责运行 cua-driver | `pnpm tauri:prepare-sidecars` |

::: warning `codeg-mcp` 必须紧挨其父进程
运行时，伴生程序会在 `codeg` / `codeg-server` **旁边**被查找。`pnpm tauri dev` 和 `pnpm tauri build` 会为你构建并放置它，安装程序和 Docker 镜像也是如此。如果你把它构建在了别处 —— 或者运行的是一个手工构建的 `codeg-server` —— 请用 **`CODEG_MCP_BIN=/abs/path/codeg-mcp`** 让运行时指向它。当它无法被找到时，[多智能体委派](/zh/guide/multi-agent)会被跳过（记录一条警告），其余一切照常工作。
:::

## 日常命令 {#everyday-commands}

从最轻量到最完整的常见流程：

```bash
# Frontend only — Next.js dev server, no Rust involved
pnpm dev

# Frontend static export to out/
pnpm build

# Full desktop app — Tauri + Next.js; builds all three sidecars automatically
pnpm tauri dev

# Desktop release build — bundles codeg-mcp, codeg-computer-helper and codeg-cli
pnpm tauri build

# Standalone server — no Tauri / GUI required
pnpm server:dev
pnpm server:build          # release binary → src-tauri/target/release/codeg-server

# Build the three sidecars on their own, for the host triple
pnpm tauri:prepare-sidecars   # output: src-tauri/binaries/<bin>-<triple>
```

`tauri:prepare-sidecars` 会用各自的特性构建 `codeg-mcp`、`codeg-computer-helper` 和 `codeg-cli`，并把它们分别复制到 `src-tauri/binaries/`，桌面打包器会从那里取用。针对 macOS 目标时，它还会把 helper 包装成一个独立的应用 `codeg-computer-helper.app`，由应用包放在 `Contents/Helpers/` 之下 —— macOS 会把一个可执行文件的权限算在它所在的那个应用头上，放在 `codeg` 旁边的 helper 持有的就会是 Codeg 的权限。

当你在迭代前端、且不需要委派、电脑操作或随附 CLI 时，跳过 sidecar 步骤可以节省时间：

```bash
CODEG_SKIP_SIDECAR=1 pnpm tauri dev
```

它只是跳过三个 sidecar 的构建，仅此而已：之前某次运行留下的 sidecar 仍会原样使用；而在全新检出的代码上，委派、电脑操作和随附 CLI 就没有对应的二进制文件可运行。对于任何你打算交付的东西，请不要设置该标志。

::: tip 改动 `src/computer/` 后要重新构建 helper
开发构建会拒绝使用由不同于它自身的源码构建出来的电脑操作 helper。在 `src-tauri/src/computer/` 下做了改动后，运行一次 `pnpm tauri:prepare-sidecars`，再重启 `pnpm tauri dev`。在 macOS 上，每次重新构建还会让 helper 原有的辅助功能和屏幕录制授权失效：先从系统设置的列表里移除旧的 `codeg-computer-helper`，再重新授权。
:::

## 检查与测试 {#checks-and-tests}

前端，从仓库根目录：

```bash
pnpm eslint .        # lint

pnpm test            # vitest, once
pnpm test:watch      # vitest, watch mode
pnpm test:coverage   # with coverage
```

Rust，从 **`src-tauri/`** 目录 —— 每个二进制文件都带着它实际交付时所用的特性受到检查：

```bash
cargo check                                                                    # desktop (default features)
cargo check --no-default-features --features server-bin --bin codeg-server     # server mode
cargo check --no-default-features --features mcp-bin --bin codeg-mcp           # MCP companion
cargo check --no-default-features --features cli-bin --bin codeg-cli           # command-line client
cargo clippy --all-targets --features test-utils -- -D warnings

cargo test --features test-utils                                               # desktop (incl. integration)
cargo test --no-default-features --features server-bin --bin codeg-server --lib   # server mode
cargo insta review                                                             # accept parser snapshot updates
```

`test-utils` 特性启用集成测试所需的测试辅助工具和固件，并会打开全部四个独立二进制文件的特性，因此桌面的测试和 lint 运行也会构建那些二进制文件。`cargo insta review` 用于当对话解析器的某项改动移动了已存储的快照、而你想接受新输出时。

## 从源码构建服务器 {#building-the-server-from-source}

要在没有桌面工具链的情况下产出一个可运行的服务器，先构建前端，然后并排构建无头二进制文件：

```bash
pnpm install && pnpm build                                                        # frontend → out/
cd src-tauri
cargo build --release --bin codeg-server --no-default-features --features server-bin
cargo build --release --bin codeg-mcp    --no-default-features --features mcp-bin   # delegation companion
cargo build --release --bin codeg-cli    --no-default-features --features cli-bin   # command-line client
CODEG_STATIC_DIR=../out ./target/release/codeg-server                             # companions picked up as siblings
```

`CODEG_STATIC_DIR` 让服务器指向你刚构建的静态导出产物。由于这些二进制文件都落在 `target/release/` 中，服务器会自动将 `codeg-mcp` 作为同级找到；若把它们分散到不同目录，你就又需要 `CODEG_MCP_BIN` 了。至于运行服务器的*已打包*方式 —— 安装脚本、发布 tarball、Docker —— 参见[部署](/zh/getting-started/deployment)，环境变量的完整清单则见[配置](/zh/getting-started/configuration)。

如果服务器要在它自己的桌面上提供[电脑操作](/zh/guide/computer-use)，它旁边还需要有 helper，并且必须以 `CODEG_COMPUTER_USE=1` 启动：

```bash
cargo build --release --bin codeg-computer-helper --no-default-features --features computer-helper
CODEG_COMPUTER_USE=1 CODEG_STATIC_DIR=../out ./target/release/codeg-server
```

::: tip 让运行中的服务器指向一个新构建的伴生程序
只重新构建了 `codeg-mcp`，并想让一个手动启动的 `codeg-server` 无需重装即可使用它？导出它的绝对路径：

```bash
export CODEG_MCP_BIN=$(pwd)/src-tauri/target/release/codeg-mcp
```
:::

## 值得了解 {#good-to-know}

- **Node 用于前端，Rust 用于核心。** 每次构建都需要两套工具链；只有**桌面**二进制文件额外需要 Tauri 系统库。
- **默认特性 = 桌面；每个无头二进制文件各有自己的特性。** 正是 `--no-default-features` 加上 `server-bin`、`mcp-bin`、`computer-helper` 或 `cli-bin`，把共享核心变成服务器或其中一个伴生程序 —— 这是贯穿本页每一条构建和检查命令的主线。
- **`pnpm tauri dev` / `build` 会处理 sidecar。** 你很少直接调用 `tauri:prepare-sidecars`；它作为桌面构建的一部分运行，而当你不需要重新构建它们时，`CODEG_SKIP_SIDECAR=1` 可将其跳过。
- **让 `codeg-mcp` 紧挨其父进程。** 最常见的源码构建坑 —— 如果委派悄无声息地什么都不做，检查一下伴生程序是否是同级，或者 `CODEG_MCP_BIN` 是否已设置。

## 相关内容 {#related}

- [架构](/zh/reference/architecture) —— 这些命令所编译的一核心 / 五二进制文件设计。
- [部署](/zh/getting-started/deployment) —— 服务器构建完成后运行 `codeg-server` 的已打包方式。
- [配置](/zh/getting-started/configuration) —— 运行时环境变量，包括 `CODEG_STATIC_DIR` 和 `CODEG_MCP_BIN`。（`CODEG_SKIP_SIDECAR` 是构建期标志，介绍在本页。）
- [使用多个智能体](/zh/guide/multi-agent) —— `codeg-mcp` 伴生程序所驱动的委派功能。
