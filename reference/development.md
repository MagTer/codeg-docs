---
title: Development
description: Development — build Codeg from source. Prerequisites, the five binaries and how to compile each, the everyday dev loops, and the lint, test, and check commands.
---

# Development

This page is for **building Codeg from source** — to hack on it, package it yourself, or run an unreleased build. Codeg is a single Cargo workspace that produces five Rust binaries plus a [Next.js](https://nextjs.org/) frontend, and the toolchain reflects that: you need both a Node and a Rust setup. The commands below are the ones the project itself uses; run them from the repository root unless noted.

## Prerequisites

| Tool | Version | For |
| ---- | ------- | --- |
| **Node.js** | `>=22` (recommended) | the frontend and the `pnpm` scripts |
| **pnpm** | `>=10` | the package manager the repo is pinned to |
| **Rust** | stable (2021 edition) | the `codeg_lib` core and all five binaries |
| **Tauri 2 build deps** | — | the **desktop** binary only (`codeg`) |

The Tauri system libraries are needed only if you're building the **desktop** app; the server, CLI client, and two companions compile without them. On Debian/Ubuntu:

```bash
sudo apt-get update
sudo apt-get install -y \
  libwebkit2gtk-4.1-dev \
  libayatana-appindicator3-dev \
  librsvg2-dev \
  patchelf
```

(macOS and Windows have their own Tauri prerequisites — see the [Tauri 2 prerequisites guide](https://v2.tauri.app/start/prerequisites/).)

Then install the JavaScript dependencies once:

```bash
pnpm install
```

## The five binaries {#the-four-binaries}

Everything builds from one workspace over the shared `codeg_lib` crate — the [Architecture](/reference/architecture) page explains that design. What differs between the binaries is **Cargo features**. The *default* features build the **desktop** app with Tauri's GUI on. Each of the other four needs a feature of its own — `server-bin`, `mcp-bin`, `computer-helper`, `cli-bin` — and is built with `--no-default-features`, so the same core compiles **headless**.

Those four features are off by default on purpose. The desktop bundler packs every binary a build produces, and before they existed that's how the desktop app came to ship a server it never used.

| Binary | What it is | Build |
| ------ | ---------- | ----- |
| **`codeg`** | Tauri desktop app (window, tray, updater) | `pnpm tauri build` · `pnpm tauri dev` |
| **`codeg-server`** | Standalone HTTP + WebSocket server for browser / headless use | `pnpm server:build` · `pnpm server:dev` |
| **`codeg-cli`** | Terminal client for a running desktop app or server | `cargo build --release --bin codeg-cli --no-default-features --features cli-bin` (from `src-tauri/`), or `pnpm tauri:prepare-sidecars` |
| **`codeg-mcp`** | Per-launch stdio MCP companion that gives agent CLIs `delegate_to_agent` and the in-conversation tools | `pnpm tauri:prepare-sidecars` |
| **`codeg-computer-helper`** | The [computer-use](/guide/computer-use) helper, which runs cua-driver | `pnpm tauri:prepare-sidecars` |

::: warning `codeg-mcp` must sit next to its parent
At runtime the companion is looked up **beside** `codeg` / `codeg-server`. `pnpm tauri dev` and `pnpm tauri build` build and place it for you, and installers and the Docker image do the same. If you build it somewhere else — or run a hand-built `codeg-server` — point the runtime at it with **`CODEG_MCP_BIN=/abs/path/codeg-mcp`**. When it can't be found, [multi-agent delegation](/guide/multi-agent) is skipped (one warning is logged) and everything else keeps working.
:::

## Everyday commands

The common loops, from the lightest to the fullest:

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

`tauri:prepare-sidecars` builds `codeg-mcp`, `codeg-computer-helper` and `codeg-cli` with their own features and copies each into `src-tauri/binaries/`, where the desktop bundler picks them up. For a macOS target it also wraps the helper in an app of its own, `codeg-computer-helper.app`, which the bundle carries under `Contents/Helpers/` — macOS charges an executable's permissions to the app it sits in, and a helper beside `codeg` would hold Codeg's.

When you're iterating on the frontend and don't need delegation, computer use or the bundled CLI, skip the sidecar step to save time:

```bash
CODEG_SKIP_SIDECAR=1 pnpm tauri dev
```

It skips building the three sidecars, nothing more: one staged by an earlier run is still used as it is, and on a fresh checkout delegation, computer use, and the bundled CLI have no binary to run. Leave the flag unset for anything you intend to ship.

::: tip Rebuild the helper after touching `src/computer/`
A development build refuses a computer-use helper built from other sources than its own. After a change under `src-tauri/src/computer/`, run `pnpm tauri:prepare-sidecars` once and restart `pnpm tauri dev`. On macOS each rebuild also voids the helper's old Accessibility and Screen Recording grants: remove the old `codeg-computer-helper` from System Settings' list first, then grant again.
:::

## Checks and tests

Frontend, from the repository root:

```bash
pnpm eslint .        # lint

pnpm test            # vitest, once
pnpm test:watch      # vitest, watch mode
pnpm test:coverage   # with coverage
```

Rust, from **`src-tauri/`** — each binary is checked with the features it actually ships with:

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

The `test-utils` feature enables the test helpers and fixtures the integration tests need, and turns on all four standalone features, so the desktop test and lint runs build those binaries too. `cargo insta review` is for when a change to the conversation parsers shifts a stored snapshot and you want to accept the new output.

## Building the server from source

To produce a runnable server without the desktop toolchain, build the frontend, then the headless binaries side by side:

```bash
pnpm install && pnpm build                                                        # frontend → out/
cd src-tauri
cargo build --release --bin codeg-server --no-default-features --features server-bin
cargo build --release --bin codeg-mcp    --no-default-features --features mcp-bin   # delegation companion
cargo build --release --bin codeg-cli    --no-default-features --features cli-bin   # command-line client
CODEG_STATIC_DIR=../out ./target/release/codeg-server                             # companions picked up as siblings
```

`CODEG_STATIC_DIR` points the server at the static export you just built. Because these binaries land in `target/release/`, the server finds `codeg-mcp` as a sibling automatically; split them across directories and you'll need `CODEG_MCP_BIN` again. For the *packaged* ways to run a server — install script, release tarball, Docker — see [Deployment](/getting-started/deployment), and [Configuration](/getting-started/configuration) for the full environment-variable list.

A server that should offer [computer use](/guide/computer-use) on its own desktop also needs the helper beside it, and has to be started with `CODEG_COMPUTER_USE=1`:

```bash
cargo build --release --bin codeg-computer-helper --no-default-features --features computer-helper
CODEG_COMPUTER_USE=1 CODEG_STATIC_DIR=../out ./target/release/codeg-server
```

::: tip Point a running server at a fresh companion
Rebuilt just `codeg-mcp` and want a manually-launched `codeg-server` to use it without reinstalling? Export its absolute path:

```bash
export CODEG_MCP_BIN=$(pwd)/src-tauri/target/release/codeg-mcp
```
:::

## Good to know

- **Node for the frontend, Rust for the core.** Every build needs both toolchains; only the **desktop** binary additionally needs the Tauri system libraries.
- **Default features = desktop; each headless binary has a feature of its own.** `--no-default-features` plus `server-bin`, `mcp-bin`, `computer-helper` or `cli-bin` is what turns the shared core into the server or one of the companions — the thread running through every build and check command on this page.
- **`pnpm tauri dev` / `build` handles the sidecars.** You rarely call `tauri:prepare-sidecars` directly; it runs as part of the desktop build, and `CODEG_SKIP_SIDECAR=1` skips it when you don't need fresh ones.
- **Keep `codeg-mcp` next to its parent.** The most common source-build gotcha — if delegation quietly does nothing, check that the companion is a sibling or that `CODEG_MCP_BIN` is set.

## Related

- [Architecture](/reference/architecture) — the one-core / five-binary design these commands compile.
- [Deployment](/getting-started/deployment) — the packaged ways to run `codeg-server` once it's built.
- [Configuration](/getting-started/configuration) — the runtime environment variables, including `CODEG_STATIC_DIR` and `CODEG_MCP_BIN`. (`CODEG_SKIP_SIDECAR` is a build-time flag and lives on this page.)
- [Working with Multiple Agents](/guide/multi-agent) — the delegation feature the `codeg-mcp` companion powers.
