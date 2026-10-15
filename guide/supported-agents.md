---
title: Supported Agents
description: The fifteen coding agents Codeg drives over ACP — what each one is, the runtime it needs, and where it keeps its sessions on disk — plus how to register one that isn't on the list.
---

# Supported Agents

Codeg drives **fifteen coding agents**, and once one is running they all feel the same — same composer, same diffs, same git and terminal — because Codeg talks to each over the **Agent Client Protocol (ACP)**. What differs is underneath: who builds the agent, what runtime it needs on your machine, and where it keeps its own history. This page is the map.

Enabling an agent, its preflight health check, and starting a session are covered in [Working with Agents](/guide/agents); signing in and choosing a model are in [Authentication & Models](/guide/authentication). Here we stick to the roster itself — and, at the end, [how to add to it](#beyond-the-built-in-roster).

## The roster

Codeg installs, pins, and updates every one of these for you — you never fetch one by hand. What you *do* need on your machine is the runtime each agent runs on:

| Agent | What it is | Runs on |
| ----- | ---------- | ------- |
| **Claude Code** | Anthropic's Claude coding agent | Node.js |
| **Codex** | OpenAI's coding-assistant CLI | Node.js |
| **Gemini** | Google's official Gemini CLI | Node.js |
| **OpenClaw** | A personal AI assistant you self-host | Node.js |
| **OpenCode** | An open-source coding agent | Bundled binary |
| **Cline** | An autonomous coding-agent CLI | Node.js |
| **Hermes** | Nous Research's self-improving agent | Node.js |
| **CodeBuddy** | Tencent Cloud's AI coding assistant | Node.js |
| **Kimi Code** | Moonshot AI's CLI coding assistant | Node.js |
| **Pi** | A self-extensible coding agent | Node.js |
| **Grok** | xAI's coding agent and CLI | Node.js |
| **Cursor** | Anysphere's Cursor coding agent | Bundled binary |
| **DeepSeek Harness** | DeepSeek's own coding harness | Node.js **22+** |
| **Qoder** | Alibaba's Qoder coding-agent CLI | Node.js |
| **Google Antigravity** | Google's agent-first coding tool | Bundled binary |

Two delivery routes sit behind that last column:

- **Node.js (npm).** Twelve of the fifteen ship as npm packages that Codeg runs with `npx`, so they need Node.js installed. Codeg pins a known-good version of each and upgrades it for you. Each declares its own minimum Node version, and preflight checks yours against it — several want **Node 22**, DeepSeek Harness among them, and since **0.35.0** Codex's adapter needs **20.3.0** or later: on Node 20.0 through 20.2 every message fails. A floor can sit inside a major version like that, so **Diagnose** compares the full version too since 0.35.0, where it used to pass any Node 20 for an agent that needs 20.3.
- **Bundled binary.** **OpenCode**, **Cursor** and **Google Antigravity** are native binaries Codeg downloads for your exact platform — nothing else to install. Cursor's download is larger because it carries its own Node runtime and tools, so it doesn't need Node.js on your machine either.

::: info Antigravity runs on Intel Macs since 0.32.2
Antigravity used to be the roster's one platform hole: Google published it for Apple Silicon, Linux and Windows only, and Codeg refused the install on an Intel Mac. **1.2.1** is its first release with an Intel build, and Codeg moved to it in **0.32.2** — so every agent on the roster now runs anywhere its runtime does. **1.4.0**, pinned since **0.35.2**, still ships one.
:::

::: warning Cline on macOS 27
macOS 27 kills Cline **3.0.65 and earlier** at launch, because those builds carry a broken signature — the CLI exits at once, and a session dies within a second of starting. On Apple Silicon, builds from **3.0.66** on pass the signature check, **3.0.71** — the version Codeg pins since **0.35.2** — included; if yours is older, press **Upgrade** in Settings → Agents. The **Intel** build of those same versions still fails the strict check, and whether macOS 27 stops it has not been tested. OpenCode's first properly signed build is **1.18.34**, and **1.19.0**, pinned since 0.35.2, is signed for both Apple Silicon and Intel.
:::

::: info Hermes moved to npm in 0.24
Hermes used to be the one Python entry, installed through `uv`. Upstream retired that channel — PyPI stops at **0.19.0** — so Codeg's managed install is now an npm package pinned to an exact, audited version, whose install step checks out the official Hermes release and bootstraps **its own isolated Python environment** inside the package — Python 3.14 since **0.35.0**, and upgrading rebuilds it. You still don't manage a Python environment; it just isn't `uv` on your machine any more. Config and credentials stay exactly where they were, in `~/.hermes`.

Two practical consequences: the managed install honors **`HTTP_PROXY` / `HTTPS_PROXY`** for its own downloads, and if you have Hermes from the **official installer**, that copy still wins over the managed one — it self-updates, so Codeg defers to it rather than shadowing it. Codeg looks on the app's `PATH` first, then in `~/.local/bin`, then in npm's own folder, so a different `hermes` that comes first on that `PATH` still takes precedence. The `~/.local/bin` step is new in **0.35.0**: the installer puts Hermes there, a desktop app's `PATH` often lacks it, and Codeg used to miss that copy when it wasn't started from a terminal.
:::

::: info A pin can sit behind latest, and can be lifted again
"Codeg pins a known-good version" occasionally means *not the newest one*. **Kimi Code** spent three releases held back at 0.36.1: from 0.37 through 0.38 it rejected any ACP session carrying a stdio MCP server, which for Kimi always includes Codeg's own companion — taking [multi-agent delegation](/guide/multi-agent) **and** every MCP server you'd added down with it. 0.39.0 restored stdio handling, so the pin is **lifted** and Kimi Code now tracks a current release again.

One thing that arrived with it: if your account is on **kimi.ai** rather than kimi.com, signing in needs `kimi login --region global`. Without the flag the CLI always targets kimi.com and a kimi.ai account has no way in — Codeg's login hint names it for you. → [Kimi Code](/guide/authentication#kimi-code-provider-model-and-reasoning)
:::

The order above is the **default Agent List order** in Settings → Agents. It's a preference, not a ranking — drag agents to reorder them, and the first enabled one becomes Codeg's fallback when nothing else has picked the agent for a conversation. → [Working with Agents](/guide/agents#start-a-session)

## ACP adapters {#acp-adapters}

Codeg speaks exactly one language to an agent: **ACP**. For twelve of the fifteen that costs nothing, because what Codeg installs runs the vendor's own CLI — Gemini, OpenClaw, OpenCode, Cline, Hermes, CodeBuddy, Kimi Code, Pi, Grok, Cursor, Qoder, and Google Antigravity all ship the protocol themselves, which is why a copy you installed by hand is generally picked up straight away. Two footnotes to that: **Hermes** is the near-miss — since upstream stopped publishing to PyPI, the managed package is a thin pinned wrapper whose `hermes` command execs the real upstream binary it installed, so `hermes acp` is still the vendor's own adapter. And **Antigravity** is the one Codeg can't pick up from your machine at all: its ACP server ships as a downloaded tree with no standalone command name, so there's nothing on your `PATH` to find.

**Claude Code and Codex are the two exceptions.** Anthropic's `claude` CLI and OpenAI's `codex` CLI don't speak ACP. So what Codeg installs for those two entries isn't the vendor CLI at all — it's a separate **ACP adapter**: an npm package, maintained by the Agent Client Protocol organization (the project the Zed team originally started), that wraps the vendor's agent and translates it into the protocol.

| Entry in Codeg | Package it installs | Executable | Upstream |
| -------------- | ------------------- | ---------- | -------- |
| **Claude Code** | `@agentclientprotocol/claude-agent-acp` | `claude-agent-acp` | [agentclientprotocol/claude-agent-acp](https://github.com/agentclientprotocol/claude-agent-acp) |
| **Codex** | `@agentclientprotocol/codex-acp` | `codex-acp` | [agentclientprotocol/codex-acp](https://github.com/agentclientprotocol/codex-acp) |

That table answers the most common surprise on this page: **"I have `claude` in my terminal, but Codeg says it's not installed."** Both halves of that sentence are true. Codeg looks for `claude-agent-acp`, not `claude` — and for `codex-acp`, not `codex`. These aren't two names for one thing; they're different packages with different executable names, and having one tells you nothing about the other.

Since **0.23** the app makes that point where you'd hit it, rather than leaving it to this page: those two agents carry an **ACP adapter** badge next to their name in **Settings → Agents**, and the top row of their preflight explains the split — including where it found your own CLI, if it did — with a **Learn more** link that lands right here.

Installing the adapter doesn't touch the CLI you already have. It's a separate package under its own name — it won't overwrite, upgrade, or uninstall your `claude` or `codex`. It doesn't *need* one either: each adapter carries its own runtime, `claude-agent-acp` depending on `@anthropic-ai/claude-agent-sdk` and `codex-acp` on `@openai/codex`, both pulled down with it at install time. So either agent runs on a machine that has never seen the vendor CLI.

What the adapter does share is your configuration — including being signed in. Claude Code reads `~/.claude` (`CLAUDE_CONFIG_DIR` moves it) and Codex reads `~/.codex` (`CODEX_HOME` moves it): the same directories the CLIs use, and the same files Codeg's own settings panes write to, `~/.claude/settings.json` and `~/.codex/config.toml`. Sign in once in your terminal and the adapter simply continues with that account — there's no second login. History follows the same rule and stays in the vendor's own folders, [as the table below shows](#where-each-agent-keeps-its-sessions).

::: tip Point the Codex adapter at your own binary
Set `CODEX_PATH` in the Codex agent's **Environment Variables** and `codex-acp` runs the executable you name instead of the copy it bundles — useful if you keep a particular `codex` build around. → [Working with Agents](/guide/agents#configure-an-agent)
:::

### Install the newest release instead of the recommended one {#unreviewed-latest}

The Kimi story above cuts both ways: a reviewed pin is what keeps a bad release out, and it's also what stands between you and a model that shipped this morning. Since **0.32.4** that trade is a button rather than a setting. When an agent's newest release is **ahead of the version Codeg recommends**, its **Version Status** in **Settings → Agents** shows an amber **Upgrade to unreviewed latest …**. It asks before installing anything, and the dialog says what you're taking on: the release hasn't been reviewed by Codeg, it can break the agent in Codeg — occasionally a release is known broken — and going back means a **Custom install** of the recommended version, which it names. Confirm, and Codeg installs exactly that release, with no fallback to the recommended one if it fails.

- **Where "latest" comes from.** For an npx agent, the package's `latest` tag on npm. For a downloaded binary — OpenCode, Cursor, Antigravity, or a custom agent added from the registry — the ACP registry's current archive for your platform, as long as it still fits the download pattern Codeg knows. Agents installed through `uvx` get no offer, and neither do custom agents you wrote out by hand.
- **When it looks.** Once each time you open the agent's page. Nothing polls in the background, and while the lookup runs, or after it fails, nothing is offered.
- **After you take it**, the local version is ahead of the recommended one and the row reads *Already latest*, with no warning and no button back. **Install** and **Upgrade** always mean the recommended version, so returning to it is **Custom install** with that version number — as the dialog says.
- **It replaced a setting.** From **0.30.3** until **0.32.4** each npx agent had an **Adapter version** dropdown — *Pinned* or *Latest (unreviewed)* — read at install time. It's gone: an agent you'd set to *Latest* went back to installing and upgrading to the recommended version, and this button is how you reach for the newest one now.

**Version Status** in the same panel is the number to trust — it reports what a local probe found, beside the version Codeg recommends. On an npx agent that probe is `npm list`, which can fail for reasons of its own, and a failed one falls back to the last version recorded rather than claiming nothing is installed; so a reading that survives a failed upgrade is worth re-checking.

### DeepSeek Harness takes a third route {#deepseek-harness}

**DeepSeek Harness**, new in **0.26**, is neither of the two cases above. DeepSeek publishes an ACP transport of its own — `@deepseek-ai/dsh-acp` — but it's built for automation: no streaming, no tool presentation, and it refuses MCP servers outright, so a session run through it would arrive as a finished block of text with none of the workspace around it. Codeg drives the **community `deepseek-acp` bridge** instead, pinned to an exact version like every other managed install.

It carries no adapter badge and no vendor-CLI confusion to explain, because there's no `deepseek` command on your machine it could be mistaken for. What you get in exchange for the extra hop is a full-fidelity session: streaming replies, tool cards, and MCP.

| What | Where it lands |
| ---- | -------------- |
| **Sign-in** | The agent's own settings pane: **API endpoint** and **API key**. Blank endpoint means the adapter's default, `https://api.deepseek.com` |
| **Model and reasoning effort** | The **composer**, not settings — the adapter advertises them as ordinary session options, so they're per conversation |
| **Skills** | The upstream skills chain, including `$DSH_HOME/skills` → [Skills](/guide/skills) |
| **MCP servers** | Delivered over the protocol itself → [MCP Servers](/guide/mcp) |

The key is passed as `DEEPSEEK_API_KEY`, and an environment variable outranks the credentials file — so if you'd rather sign in through the terminal, leave the field empty. The launch-default model stays where power users expect it, as `DEEPSEEK_ACP_MODEL` in the raw environment editor, precisely so the settings pane can never overwrite a model line you're editing there.

## Where each agent keeps its sessions

Every agent stores its own conversation history in its own place and format, long before Codeg is in the picture. That's exactly what [Conversation Aggregation](/guide/aggregation) reads when it imports your past work: Codeg looks in each agent's native store for sessions you ran in the folder you're importing, and lists what it finds.

Here's where "each agent's native store" actually lives:

| Agent | Default location | Format | Relocate with |
| ----- | ---------------- | ------ | ------------- |
| **Claude Code** | `~/.claude/projects/` | JSONL | `CLAUDE_CONFIG_DIR` |
| **Codex** | `~/.codex/sessions/` | JSONL | `CODEX_HOME` |
| **Gemini** | `~/.gemini/` | JSON files | `GEMINI_CLI_HOME` |
| **OpenClaw** | `~/.openclaw/agents/` | JSONL | — |
| **OpenCode** | `~/.local/share/opencode/opencode.db` | SQLite | `XDG_DATA_HOME` |
| **Cline** | `~/.cline/data/` | JSON files | `CLINE_DIR` |
| **Hermes** | `~/.hermes/state.db` | SQLite | `HERMES_HOME` |
| **CodeBuddy** | `~/.codebuddy/projects/` | JSONL | `CODEBUDDY_CONFIG_DIR` |
| **Kimi Code** | `~/.kimi-code/sessions/` | JSONL | `KIMI_CODE_HOME` |
| **Pi** | `~/.pi/agent/sessions/` | JSONL | `PI_CODING_AGENT_SESSION_DIR` |
| **Grok** | `~/.grok/sessions/` | JSONL | `GROK_HOME` |
| **Cursor** | `~/.cursor/chats/` | SQLite (blob store) | `CURSOR_CONFIG_DIR` |
| **DeepSeek Harness** | `~/.dsh/sessions/` | Compressed JSONL | `DSH_HOME` |
| **Qoder** | `~/.qoder/projects/` | JSONL | `QODER_CONFIG_DIR` |
| **Google Antigravity** | `~/.gemini/antigravity-acp/conversations/` | SQLite (one file per session) | `GEMINI_HOME` |

Most agents write a **JSONL transcript** — a plain-text log, one event per line — while OpenCode and Hermes keep everything in a single **SQLite** database, Cursor and Antigravity store each conversation as its own SQLite file, and Gemini and Cline use their own JSON files. Codeg reads each format natively; you never convert anything.

::: warning `GEMINI_HOME` and `GEMINI_CLI_HOME` are not the same variable
They sit two rows apart in that table and mean different things. **`GEMINI_CLI_HOME`** (Gemini CLI) names the *parent* directory, and `.gemini` is joined onto it. **`GEMINI_HOME`** (Antigravity) names the `.gemini` directory **itself**. Setting the one you meant to set the other way relocates the store somewhere neither tool looks.
:::

DeepSeek is the one that's compressed: its `session.jsonl.zstd` isn't a single Zstandard archive but a **run of frames appended batch by batch**, which is what lets the harness keep writing to it. Codeg decodes the frames in sequence and keeps everything up to the last complete one, so a session **still being written** lists and opens rather than reading as corrupt.

::: tip Moved a store? Codeg follows the same variable.
Point an agent at a non-default location with one of the environment variables above and Codeg honors it too, so a relocated history still opens and imports. Since **0.35.2** that's true whether the variable is in Codeg's own environment or in the agent's **Environment Variables** under Settings → Agents — where it wins, and where an empty value unsets it, back to the agent's default. Before, a variable set only on the agent left its conversations opening empty. A `HOME` set there isn't followed. OpenClaw is the exception: its store isn't relocatable.
:::

A [custom agent](/guide/custom-agents) has no row here, because it usually keeps no store Codeg could read. For those, Codeg writes the history itself — an append-only JSONL transcript per session under `acp-transcripts/<registry-id>/`, in `~/.codeg/` by default — and reads it back exactly as it reads a native store. Being Codeg's own data, it relocates with `CODEG_HOME` (or `CODEG_DATA_DIR`) rather than with any agent's variable.

## How agents differ

The surface is identical, but a few things vary by agent — worth knowing so nothing catches you off guard:

- **Models and modes come from the agent, not Codeg.** The model dropdown and the mode dropdown (plan-first, accept-edits, and the like) list whatever the connected agent reports over ACP. Two agents will offer different models and different modes — that's the agent talking, not a Codeg setting. → [Authentication & Models](/guide/authentication)
- **Sign-in differs too.** Some agents log in with their own subscription or OAuth, others take a provider API key or a custom endpoint. Each agent's detail pane shows only the options that apply to it. → [Authentication & Models](/guide/authentication)
- **OpenClaw opts out of MCP.** It's the one agent that doesn't accept Model Context Protocol servers, so an MCP server you've added won't reach an OpenClaw session — Codeg forwards none to it. Most other agents receive your MCP servers normally. → [MCP Servers](/guide/mcp)

## Beyond the built-in roster

The roster above is the set Codeg **adapts by hand** — each of those agents got a parser for its session files, its own settings pane, and whatever small accommodations its quirks demand. That work is what earns a slot in the table.

It isn't the boundary of what Codeg can drive, though. ACP is an open standard, so since **0.22** you can register any other agent that speaks it: pick one from the protocol's public registry, or paste its distribution JSON. Codeg installs it, runs the same preflight, records its history for it, and treats it like a built-in everywhere else — the picker, the status bar, search, and delegation. → [Custom Agents](/guide/custom-agents)

## Next steps

- [**Working with Agents**](/guide/agents) — enable one of these, run its preflight, and start a session.
- [**Custom Agents**](/guide/custom-agents) — add an ACP-compatible agent that isn't on this roster.
- [**Authentication & Models**](/guide/authentication) — sign in and pick a model for the agent you chose.
- [**Conversation Aggregation**](/guide/aggregation) — import the sessions from the stores listed above.
