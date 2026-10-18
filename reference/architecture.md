---
title: Architecture
description: Architecture — how Codeg fits together, from its one Rust core and shared web UI to the five binaries and the agent CLIs they drive over ACP.
---

# Architecture

Underneath, Codeg is a small number of moving parts arranged simply: **one Rust core**, **one web frontend**, and **five binaries** built from them — the desktop app, the standalone server, the command-line client, a small per-agent companion, and the helper that computer use runs through. Everything a session does — driving an agent, opening a terminal, reading a file, delegating to another agent — flows through that shared core. This page is the map; the individual [Settings screens](/reference/) and [guides](/guide/) are the territory.

## The five binaries {#the-four-binaries}

Codeg ships **five Rust binaries from a single Cargo workspace**, all compiled from the same library crate (`codeg_lib`):

| Binary | Role |
| ------ | ---- |
| **`codeg`** | The **desktop app** — a [Tauri](https://tauri.app/) shell (native window, system tray, auto-updater) wrapping the web UI. |
| **`codeg-server`** | The **standalone server** — an HTTP + WebSocket server that serves the same UI to a browser, for headless or shared deployments. |
| **`codeg-cli`** | The **command-line client**, added in 0.38.0 — runs prompts through an existing desktop app or server and prints the result. → [Command Line](/guide/command-line) |
| **`codeg-mcp`** | The **per-launch companion** — a tiny stdio [MCP](https://modelcontextprotocol.io/) server an agent CLI runs to reach Codeg's own tools: delegation, and the in-conversation tools. |
| **`codeg-computer-helper`** | The **computer-use helper** — the process that actually reads and acts on desktop windows, for the desktop app or a server that offers [computer use](/guide/computer-use). |

You run the desktop app or server, and optionally `codeg-cli` to call one from a terminal. The companion and helper are started for you — the companion once per agent session (more on it [below](#multi-agent-delegation-and-codeg-mcp)), the helper the first time computer use needs it ([below](#computer-use-and-codeg-computer-helper)). Because they share `codeg_lib`, the desktop app and the server are the **same product with two front doors** — the difference is how the UI reaches the core, not what the core does.

The desktop app ships with `codeg-cli`, the companion, and the helper, and **not** with the server. Until **0.33.0** it carried a copy of `codeg-server` it never used — about 70 MB — because the bundler takes every binary the build produces; each standalone binary now has a build feature of its own, off by default, so the desktop build doesn't produce them by accident. → [Development](/reference/development)

## One core, one frontend

The desktop app and server share two main pieces:

- **The Rust core (`codeg_lib`)** — session and agent orchestration, the database, git, credentials, the web server, logging. It's built with [Tauri](https://tauri.app/)'s desktop features on for `codeg`, and compiled headless (no GUI) for the other four.
- **The web frontend** — a [Next.js](https://nextjs.org/) / React app, exported as static files. The desktop app loads them in its webview; the server serves the very same bundle to browsers.

What connects the frontend to the core is a **transport layer**, and it's the key to the two-front-doors design: the same UI code talks to the core either way, choosing its channel at runtime.

- In the **desktop app**, the UI calls the core directly through **Tauri's IPC** — in-process, no network.
- In a **browser**, the identical UI talks to `codeg-server` over **HTTP and a WebSocket** for live events.

This is why the [Web Service](/reference/settings/web-service) screen can hand your phone "the full workspace," and a [headless deployment](/getting-started/deployment) feels identical to the desktop — it's one frontend over two transports, not two apps.

### Native mobile clients

The [iOS and Android apps](/getting-started/installation#mobile-apps) add a third client path without moving the core. They are native SwiftUI and Jetpack Compose applications rather than wrappers around the web frontend, and they talk to a desktop Web Service or `codeg-server` through the same authenticated **HTTP + WebSocket API**. The access token is kept in iOS Keychain or protected by Android Keystore.

No agent CLI or project checkout runs on the phone. The host still owns the files, database, git operations, and agent subprocesses; the mobile app sends commands and renders the resulting live event stream. Both clients are open source: [Codeg for iOS](https://github.com/xintaofei/codeg-ios) and [Codeg for Android](https://github.com/xintaofei/codeg-android).

## Command-line client {#command-line-client}

`codeg-cli` is a client of a **running** Codeg, not another agent runtime. The desktop app and server each expose a loopback-only CLI listener, discovered through a private endpoint file under `<data dir>/cli/`; a remote command uses the server's token-authenticated HTTP API instead. The shared core creates the conversation, launches the agent, and applies the run's permission policy. The CLI follows its events and prints the result as text or JSON. `--standalone` explicitly starts a temporary server for a command, then stops it afterwards. → [Command Line](/guide/command-line)

## How agents run

Codeg doesn't reimplement Claude Code, Codex, Gemini, and the rest — it **drives their real CLIs**. Each agent runs as a **subprocess**, and Codeg speaks to it over the **[Agent Client Protocol](https://agentclientprotocol.com/) (ACP)** — the same JSON-RPC protocol an editor like Zed uses to talk to a coding agent. Since **0.32.0** that conversation runs on the protocol's official Rust runtime, the `agent-client-protocol` crate (2.2), in place of the patched copy of its predecessor Codeg used to carry; one message Codeg fails to handle no longer takes the whole connection down with it.

In that relationship Codeg is the **client** and the agent is the **server**: Codeg opens a session, streams the model's turn back to your screen, and answers the agent's requests as they arrive — run a command in a **terminal**, **read or write a file**, ask **permission** for a risky action. A request Codeg doesn't handle gets a *not supported* answer, so the agent can carry on rather than wait. Because every agent is normalized to the one protocol, they all land in a single workspace under one set of controls — which is what makes aggregating conversations and switching between agents possible in the first place.

When Codeg launches an agent, it also hands it a set of **MCP servers** to connect to. One of those is usually Codeg's own companion — whenever at least one of its tool groups is on — except for an agent that won't take MCP servers over the protocol: **OpenClaw**, **Pi** and, since **0.36.0**, **Cline** among the built-ins, and a custom agent with its MCP support switched off.

## Multi-agent delegation and `codeg-mcp`

`codeg-mcp` is how one agent can **hand work to another** — and how it reaches the rest of Codeg's own tools. When Codeg starts an agent CLI, it injects an MCP server entry pointing at this binary; the CLI launches it over stdio, and its LLM gains a set of Codeg tools — above all **`delegate_to_agent`**, plus the toggleable groups from [Collaboration settings](/reference/settings/collaboration): `check_user_feedback`, `ask_user_question` and `get_session_info`, the built-in browser's `browser_*` tools, computer use's `computer_*` tools, and the two create-from-chat writers. A `delegate_to_agent` call travels back through the companion to the parent Codeg process, which spins up the worker agent and streams its result home; every other call travels the same way, to be answered by Codeg itself. Since **0.36.0** the call can name an [assistant](/guide/assistants) by id instead of an agent: the companion's tool description lists the assistants switched on when the session began, and Codeg resolves the id when the call arrives, starting the assistant's own agent with its saved options and adding its standing instructions to the task. A companion that finds itself talking to an older Codeg refuses that call, asking for a restart, rather than handing the work to a plain agent.

Which groups an agent gets is decided **when it launches** — the companion's tool list is fixed for that session — so switching a group on reaches agents started afterwards. Several groups are also re-checked on every call, so switching one *off* reaches a running session too.

Two more ride the same channel without a settings toggle of their own: **`task_progress`** and **`task_complete`**, which let an agent report milestones and a verdict for the [task](/guide/tasks) it's executing. They're injected only into spawns the task engine started, so an ordinary conversation never sees them.

Two practical consequences, both grounded in how it's shipped:

- **It lives next to its parent.** Installers, the Docker image, and the desktop bundle all place `codeg-mcp` beside `codeg` / `codeg-server`. A source build in an unusual layout can point at it explicitly with **`CODEG_MCP_BIN=/abs/path/codeg-mcp`**.
- **It's optional and fails soft.** If the companion is missing, delegation is simply skipped — a single warning is logged and the rest of the session runs normally.

The user-facing side of all this is [Working with Multiple Agents](/guide/multi-agent); this is the plumbing beneath it.

## Computer use and `codeg-computer-helper`

[Computer use](/guide/computer-use) needs a process that can capture windows and send input to them, and Codeg deliberately keeps that out of its own. The **helper** does it: Codeg starts it the first time computer use is needed, and the helper in turn runs **cua-driver** — the open-source driver that does the reading and clicking — as its child, checking the driver's pinned digest before every launch. Codeg talks to the helper over a private channel, and every request carries the current *Stop* count, so a request sent before you pressed Stop is refused even if it arrives after.

- **On macOS** the helper is an app of its own, `codeg-computer-helper.app`, shipped inside Codeg's bundle and run from a copy in Codeg's application-support folder. Accessibility and Screen Recording are granted to **it**, not to Codeg — so nothing an agent runs in a shell under Codeg inherits them — and in Codeg's signed releases it checks that Codeg is the one talking to it. → [Why a helper holds the permissions](/guide/computer-use#why-a-helper-holds-the-permissions-on-macos)
- **On Windows and Linux** it's a plain binary beside `codeg`, and there's no such separation to make: any program you run can capture the screen and inject input there.
- **On a server**, `codeg-server` uses a helper installed beside it — the release archives and install scripts include one — and only when started with `CODEG_COMPUTER_USE=1`. The Docker image has none.

The helper exits with the Codeg that started it, and what it writes to its error output — the driver's included — ends up in Codeg's own [log](/reference/settings/logs).

## Where your data lives

Codeg keeps its state on the **local machine**. Its [data directory](/getting-started/configuration#where-codeg-stores-its-data) — the platform's own, such as `~/Library/Application Support/app.codeg` for the desktop app on macOS, or `CODEG_DATA_DIR` on a server — holds the **SQLite database** (conversations, settings, account metadata) and the **uploads** and **[logs](/reference/settings/logs)** directories. Your **[skills](/guide/skills)** live under **`~/.codeg/`**, which moves with `CODEG_HOME` — and a `CODEG_HOME`, when set, takes the uploads and logs with it. Secrets are the deliberate exception: on desktop, tokens go into the **OS keyring** rather than any of these files — the split described under [Version Control](/reference/settings/version-control) and again in [Data & sync](/reference/settings/system#backup-restore). Codeg's own record of agents' history — the `acp-transcripts` it writes for custom agents and for ZCode, TRAE CLI and Command Code — sits in the data directory too, unless `CODEG_HOME` is set, which takes it along.

There's no Codeg cloud in the middle. The desktop app and a server you run both keep everything on the box they run on; the only things that leave are the agent's own calls to whatever model provider you've configured — and what you switch on yourself, such as Claude Code's Remote Control or a WebDAV server for configuration sync. [Privacy & Security](/reference/privacy) covers what that means in practice.

## Good to know

- **Five binaries, one codebase.** `codeg`, `codeg-server`, `codeg-cli`, `codeg-mcp` and `codeg-computer-helper` are build targets of the same Rust workspace over the same `codeg_lib` core — not five separate programs to keep in sync.
- **Desktop and server are the same app.** The distinction is the transport (Tauri IPC vs HTTP/WebSocket), not the feature set — the [Web Service](/reference/settings/web-service) screen and a [headless deployment](/getting-started/deployment) are two ways to reach the identical UI.
- **Mobile is a client, not another core.** iOS and Android connect over the authenticated API; projects and agents keep running on the desktop or server host.
- **Agents stay agents.** Codeg orchestrates the official CLIs over ACP; it doesn't fork or replace them, so each keeps its own behavior, auth, and updates.
- **`codeg-mcp` is per-session and disposable.** One is spawned per agent launch and exits with it; losing it costs you its tools — delegation and the in-conversation tools — and nothing else.

## Related

- [Deployment](/getting-started/deployment) — running `codeg-server` (or Docker) as a headless deployment of the same core.
- [Web Service](/reference/settings/web-service) — the desktop app's own front door to the browser UI.
- [Download and install](/getting-started/installation#mobile-apps) — get the native clients and connect them to a Codeg host.
- [Working with Multiple Agents](/guide/multi-agent) — the delegation feature that `codeg-mcp` implements.
- [Collaboration](/reference/settings/collaboration) — the toggles that decide which `codeg-mcp` tools each agent receives.
- [Computer Use](/guide/computer-use) — what `codeg-computer-helper` does for you.
- [Privacy & Security](/reference/privacy) — what stays local, and what leaves for the model provider.
