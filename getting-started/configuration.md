---
title: Configuration
description: Configure codeg-server with environment variables, learn where Codeg stores its data, and tune logging, storage, proxies, and the agent runtime.
---

# Configuration

Codeg is configured in two places. The desktop app and the web UI expose almost everything through the **Settings** screens — appearance, agents, version control, web service, and more. Everything *outside* the UI — how the standalone [`codeg-server`](/getting-started/deployment) binds and authenticates, where data lives on disk, and a handful of advanced runtime knobs — is controlled by **environment variables**, and that's what this page documents.

::: tip Using the desktop app?
You probably don't need this page. Configure Codeg from **Settings** instead — see the [Reference](/reference/) section. Reach for environment variables when you run `codeg-server`, or when you need to tune something the UI doesn't expose.
:::

## How it works

`codeg-server` reads its configuration from environment variables — set them however you launch it: inline in a shell, in a systemd unit, in your Docker Compose `environment:` block, or with `docker run -e`. There is **no configuration file**; the server's only persistent state is its SQLite database (plus, on the desktop, one small [preferences file](#desktop-preferences)).

Two conventions apply throughout:

- An **empty or whitespace** value counts as unset — the default applies.
- Numeric knobs treat **`0` or an unparseable value** as "use the default," except where `0` explicitly means *disable* (called out below).

## Core settings

The variables you're most likely to set on a server:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_PORT` | `3080` | HTTP and WebSocket listen port. |
| `CODEG_HOST` | `0.0.0.0` | Bind address — an IP, `localhost`, or a bracketed IPv6 literal. `0.0.0.0` exposes it on every interface. |
| `CODEG_TOKEN` | *(random)* | Access token required on every API and WebSocket request. The exceptions carry proof of their own — a single-use download link, an Office live preview's per-document capability, a forge's [signed webhook delivery](/reference/privacy#webhooks-for-auto-processing) — or give nothing away: the web app's own files, and the login page's language lookup. If unset, one is generated, saved to the database, and printed to stderr at startup. |
| `CODEG_DATA_DIR` | *(per-OS — see below)* | Root for the database, uploads, logs, and secrets. |
| `CODEG_STATIC_DIR` | `./web` | Directory of the bundled web UI to serve. |
| `CODEG_MCP_BIN` | *(auto)* | Path to the `codeg-mcp` companion when it doesn't sit beside the server binary — needed for some source builds. Without it, [multi-agent delegation](/guide/multi-agent) is silently disabled. |
| `CODEG_BRIDGE_PORTS` | *(`CODEG_PORT`+1 … +10)* | Ports the [port bridge](/guide/browser#in-a-browser-session-the-port-bridge) binds, one per dev server shown in the workbench: a range (`3081-3090`), a comma list, `auto` (any free port), or `off`. A value that doesn't parse turns the bridge off rather than guessing. |
| `CODEG_BRIDGE_PUBLIC_HOST` | *(unset)* | Hostname the workbench should use for the bridge ports instead of the one it was loaded from — for a reverse proxy that names them differently. |
| `CODEG_BRIDGE_HOST_PATTERN` | *(unset)* | Reach dev servers by **hostname** on Codeg's own port instead of binding a port range: `auto` (the port in front of the workbench's host — `3000.codeg.example.com`) or a template with `{port}` in it once, such as `{port}.preview.example.com`. Needs a wildcard DNS record, and a wildcard virtual host on any proxy in front. A value that doesn't parse turns the bridge off. → [By hostname](/guide/browser#by-hostname-instead-of-by-port) |
| `CODEG_BROWSER_TUNNEL` | `all` | What a desktop app attached to this server as a [remote workspace](/guide/browser#in-a-remote-workspace-window) may reach through its built-in browser: `all`, `private` (loopback, private and link-local addresses), or `off`, in any case. Unset or blank means `all`; any other value turns it off. |
| `CODEG_COMPUTER_USE` | *(off)* | `1`, `true`, `yes` or `on` offers [computer use](/guide/computer-use#on-a-server) on the server machine's own desktop, through the `codeg-computer-helper` installed beside the server. On Linux it warns when there's no `DISPLAY` or `WAYLAND_DISPLAY`. The desktop app doesn't read it. |

See [Deployment](/getting-started/deployment#access-it-securely) for the networking and TLS implications of `CODEG_HOST` and `CODEG_TOKEN`.

## Where Codeg stores its data

Unless you set `CODEG_DATA_DIR`, `codeg-server` keeps its data in the platform data directory:

| Platform | Default data directory |
| -------- | ---------------------- |
| macOS | `~/Library/Application Support/codeg` |
| Linux | `~/.local/share/codeg` |
| Windows | `%APPDATA%\codeg` |

The desktop app stores the same kind of data in the same place, under an `app.codeg` folder. Inside the data directory you'll find:

- **`codeg.db`** — the SQLite database: sessions, settings, channels, automations — effectively all of Codeg's state.
- **`uploads/`** — files uploaded as attachments in a browser or a remote-workspace window.
- **`pets/`** — desktop-pet assets.
- **`logs/`** — rotating daily log files (see [Logging](#logging)).
- **`tokens.json`** — the server's encrypted secret store (git credentials and the like). On the desktop these live in your OS keyring instead, so this file is server-only.

To back up or migrate a deployment, copy this directory. (The in-app **backup** feature exports the same state as a portable `.codegbak` archive.)

::: warning Skills live outside the data directory
Installed skills are kept under `~/.codeg/skills/`, which follows `CODEG_HOME` (default `~/.codeg`), **not** `CODEG_DATA_DIR`. If you relocate the data directory on a server, set `CODEG_HOME` too if you want skills to move with it. `CODEG_HOME` also takes precedence over `CODEG_DATA_DIR` for `uploads/`, `pets/`, and `logs/` when both are set.
:::

## Storage limits

By default the total size of uploads is limited only by your disk. To bound it:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_UPLOAD_MAX_TOTAL_BYTES` | *(no cap)* | Hard ceiling, in bytes, on everything under `uploads/` — e.g. `10737418240` for 10 GiB. Unset, `0`, or an invalid value disables the cap. |
| `CODEG_UPLOAD_QUOTA_STRICT` | *(off)* | When truthy (`1` / `true` / `yes` / `on`), refuse to start (exit code 2) if the quota above is set but unparseable, instead of falling back to "no cap" with a warning. Use it when policy requires a configured quota to actually take effect. |
| `CODEG_BACKUP_UPLOAD_MAX_BYTES` | *(no cap)* | Largest backup archive the restore endpoint will accept. |

Each file you upload as an attachment in a browser or a remote-workspace window is also capped at **20 MiB** — a fixed limit, not configurable. A larger file is skipped with a message naming it, and the others still attach. A file that's already on the server, such as one you choose with **Pick server file**, is attached by its path on the server, so the cap doesn't apply to it. Before **0.22.0** the cap was 2 MiB.

## Logging

Codeg writes rotating daily logs to `logs/` in the data directory and mirrors them to the in-app viewer.

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_LOG` | *(saved level)* | A tracing filter directive — `info`, `debug`, or targeted like `codeg=debug,tower_http=warn`. Takes precedence over `RUST_LOG`, and while it's set it locks the level picker in the UI. |
| `RUST_LOG` | *(unset)* | The standard Rust log filter. Used only when `CODEG_LOG` is empty. |
| `CODEG_LOG_MAX_FILES` | `30` | Number of rotated daily log files to retain. |
| `CODEG_LOG_MAX_BYTES` | `536870912` | Ceiling on a single day's log file (512 MB). Past it the file latches off for the day and the cut-off is reported in the Logs viewer. `0` disables the cap. |

For day-to-day use you can change the level from the UI instead — see [Settings → Logs](/reference/settings/logs).

## Proxy support

At startup Codeg snapshots the standard `HTTP_PROXY`, `HTTPS_PROXY`, and `ALL_PROXY` variables (and their lowercase forms) and propagates them to every agent process it launches. One proxy setting therefore covers Codeg *and* the agents it drives — the intended path for corporate gateways. Since **0.32.2** every agent launched with a proxy also gets the local addresses — `localhost`, `127.0.0.1`, `::1` — added to its `NO_PROXY`, so an agent's connections to its own local services never travel to a proxy on another machine; the **Bypass proxy for** list in [Settings → System](/reference/settings/system#network-proxy) adds addresses of your own. A `*` in that list, or in a `NO_PROXY` you export, is passed on alone as *bypass everything* — which Antigravity no longer fully honours from **1.3.0** on; the same page explains why. See [Privacy & Security](/reference/privacy) for how Codeg handles network access.

## Advanced tuning

You'll rarely touch these — the defaults are chosen to be right for almost everyone. They govern how long idle agent connections and preview servers linger before being reaped:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_ACP_IDLE_TIMEOUT_SECS` | `180` | Reap an agent connection after this many seconds idle. `0` disables the sweep. |
| `CODEG_ACP_SPAWN_HANDSHAKE_TIMEOUT_SECS` | `60` | How long to wait for an agent to launch and finish its handshake before giving up. |
| `CODEG_ACP_BACKGROUND_KEEPALIVE_MAX_SECS` | `3600` | How long a connection with unfinished background work stays exempt from the idle sweep. `0` disables the exemption. |
| `CODEG_OFFICE_WATCH_IDLE_TIMEOUT_SECS` | `300` | Reap an idle [Office live-preview](/guide/office) server after this many seconds. `0` disables. |
| `CODEG_ACP_HOST_TOOLS` | *(unset)* | Set to `agent` and Codeg stops serving file access and terminal commands, so the agent runs them itself, under its own sandbox — and loses the delegation tools with them. There's a per-agent switch for this beside each agent's environment editor; setting the variable on Codeg's own process makes it the default for agents that don't set it themselves. → [Working with Agents](/guide/agents#let-the-agent-handle-its-own-files-and-commands) |

Remote-workspace sync exposes a further set of concurrency knobs (`CODEG_WORKSPACE_UPLOAD_MAX_CONCURRENCY` and friends); their defaults are sensible and rarely need changing.

### Update supervision

When you run the server under `--supervise` (see [Deployment](/getting-started/deployment#keep-your-server-up-to-date)), two knobs shape the in-place-upgrade safety net:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_UPGRADE_TRIAL_SECS` | `30` | The window a freshly upgraded server has to boot successfully before it's automatically rolled back. |
| `CODEG_RESTART_DELAY_MS` | `2000` | Pause before the supervisor relaunches the server after an upgrade (minimum `200`). |

The supervisor sets `CODEG_SUPERVISED`, and the Docker image sets `CODEG_RUNTIME=docker`, automatically — these are managed for you, not something you set by hand.

## Desktop preferences {#desktop-preferences}

The desktop app keeps its settings in the database, managed from the Settings screens — with one exception. `~/.codeg/preferences.json` is read *before* the app window starts and holds a single field:

```json
{ "disable_hardware_acceleration": false }
```

It mirrors a toggle in the app's settings. Edit it by hand only to recover from a GPU or driver problem that stops the window from rendering — set it to `true`, relaunch, and Codeg starts without hardware acceleration. `codeg-server` never reads this file.

Two environment variables reach the [built-in browser](/guide/browser) on the desktop, both read once at startup:

| Variable | Default | What it does |
| -------- | ------- | ------------ |
| `CODEG_POLICY_FILE` | *(per-OS — see [Site rules](/guide/browser#rules-set-by-an-administrator))* | Path to the administrator policy that can fix per-site rules or turn the built-in browser off for every user of the machine. |
| `CODEG_BROWSER_SIGN_IN_HOSTS` | *(Google's sign-in hosts)* | Comma-separated hostnames — subdomains count — whose sign-in pages a tab should present a Firefox identity to, for a provider that refuses embedded browsers the way Google does. |

## Your agents' own settings

Codeg finds each agent's existing sessions through *that agent's* own environment variable — `CLAUDE_CONFIG_DIR`, `CODEX_HOME`, `GEMINI_CLI_HOME`, and so on. If you've pointed an agent CLI at a non-default location, Codeg follows it automatically — whether the variable is set in Codeg's own environment or, since **0.35.2**, in that agent's **Environment Variables** under Settings → Agents, which wins. The full mapping is in [Supported Agents](/guide/supported-agents#where-each-agent-keeps-its-sessions).

## Next steps

- [**Deployment**](/getting-started/deployment) — launch, supervise, and update `codeg-server`.
- [**Supported Agents**](/guide/supported-agents) — where each agent keeps its sessions, and the variables Codeg honors.
- [**Settings → Logs**](/reference/settings/logs) — change log levels and inspect runtime logs from the UI.
