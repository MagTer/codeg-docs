---
title: MCP Servers
description: Give your agents extra tools and data sources with Model Context Protocol servers — add them from a registry or by hand, and choose which agents get each one, all from one place in Codeg.
---

# MCP Servers

**Model Context Protocol (MCP)** is the open standard for handing a coding agent extra tools and data — a GitHub server, a Postgres connection, a headless browser, your company's internal API. Any of the agents Codeg drives can use MCP servers; the catch is that each one keeps its MCP setup in its *own* config file, in its own format. Codeg is the single place to manage them all: add a server once, tick which agents should have it, and Codeg writes it into each of their configs for you.

Codeg doesn't run the tools — MCP is the *agent's* feature, and the server talks to the agent, not to Codeg. What Codeg gives you is the management layer on top: a scan of what's already installed, a searchable registry to add more, and a per-agent switch for every server, so you're never hand-editing a different file for each CLI.

## Where MCP servers are managed

Open **Settings → MCP**. It's a two-pane screen. The left pane has two tabs — **Local** (the servers already on your machine) and **Market** (a registry to install from) — and the right pane is the detail and editor for whatever you've selected.

## What a server looks like to Codeg

Every server is an **id** plus a **spec** (a small JSON object) plus the set of **agents** it's turned on for. Specs come in two shapes:

- **stdio** — a local command your agents launch and talk to over stdin/stdout:
  ```json
  {
    "type": "stdio",
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": { "GITHUB_TOKEN": "ghp_…" }
  }
  ```
- **remote** — an **HTTP** or **SSE** endpoint the agents connect to:
  ```json
  {
    "type": "http",
    "url": "https://mcp.example.com/sse",
    "headers": { "Authorization": "Bearer …" }
  }
  ```

A rule of thumb the editor enforces: **`env` belongs on stdio servers**, where it sets the launched process's environment. A remote server carries its secrets in `headers` instead — put `env` on an HTTP/SSE spec and Codeg warns you.

## Install from a registry

The **Market** tab searches a marketplace. Two are built in:

- **Official MCP Registry** — `registry.modelcontextprotocol.io`, the canonical index.
- **Smithery** — a large community catalog.

Pick a provider, search, and select a result to see its detail — description, homepage, protocols it supports, version, and whether it's verified. Hit **Install** and Codeg walks you through:

1. **Protocol** — a server may offer more than one way to run (say stdio *or* a hosted HTTP endpoint); choose one.
2. **Parameters** — fill in what that option needs: API keys, endpoints, flags. Required fields are marked, secrets are masked, and each has its own type (text, number, boolean, a fixed set of choices, or JSON).
3. **Target apps** — tick which agents get the server.

Confirm, and Codeg writes the finished spec into each chosen agent's config.

## Add one by hand

Know exactly what you want? On the **Local** tab, click **New MCP**, give it an id, paste the spec JSON, and choose the agents. It lands right alongside the registry-installed ones. This is the path for a server that isn't in any catalog — an internal tool, something you're developing, a one-off.

**Start from a known server** fills the form for you. Since **0.31.0** that list includes Google's official **Chrome DevTools** server, which matters more than a saved keystroke: the registry carries lookalikes under the same name, and the button pins the real package (`chrome-devtools-mcp`). You still pick the agents and press Create, and `npx` downloads it on first run.

::: info It is not the built-in browser
The DevTools server drives a **separate Chrome** that Codeg doesn't supervise. You get network and performance data the [built-in browser tools](/guide/browser#let-an-agent-work-on-the-page) don't offer — and none of their safeguards: no per-tab sharing, no activity strip on the tab, no approval per snippet of code. Two different tools for two different jobs.
:::

## Scan what's already there

The **Local** tab doesn't only show what you added *in* Codeg — it **scans your agents' own config files** and lists every MCP server it finds. So a server you set up by hand-editing `~/.claude.json`, or one another tool installed, shows up here too, ready to edit, remove, or switch on for *more* agents. **Refresh** re-runs the scan.

**One unreadable config no longer takes the page down with it.** Before **0.30.2** a single malformed or unreadable agent config failed the whole scan, so every other agent's servers vanished too. Now the healthy ones still list and the broken one gets a **warning beside them**, naming the agent and the problem — an error *next to* the list rather than instead of it. An empty config file simply reads as empty, which is what it is.

While that warning is up, **saving is blocked** rather than allowed to do damage. An agent's assignments are computed from the agents this page could read, so saving with one hidden would quietly strip the server from it. Fix or remove the file, hit **Refresh**, then edit.

## Choose which agents get a server

Each server's detail pane has an **Enabled apps** row — a checkbox per agent. Codeg writes the server into the native MCP config of every agent you tick, and takes it back out when you untick:

| Agent | Where Codeg writes it |
| ----- | --------------------- |
| **Claude Code** | `~/.claude.json` (`mcpServers`) |
| **Codex** | Codex's `config.toml` (`[mcp_servers.*]`) |
| **Gemini** | `~/.gemini/settings.json` |
| **OpenCode**, **Cline**, **Hermes**, **CodeBuddy**, **Kimi Code**, **Grok**, **Cursor** | each agent's own MCP config |
| **Qoder** | `~/.qoder/settings.json` (`mcpServers`) |
| **Google Antigravity** | `<GEMINI_HOME>/config/mcp_config.json` |
| **Kiro CLI** | `~/.kiro/settings/mcp.json` (`mcpServers`) |
| **TRAE CLI** | `~/.trae/traecli.toml` (`[mcp_servers.*]`) |
| **Command Code** | `~/.commandcode/mcp.json` (`mcpServers`) |
| **DeepSeek Harness** | `$DSH_HOME/mcp.json` — Codeg's own record, since the agent reads no config file of its own |
| **ZCode** | `mcp/zcode.json` in Codeg's [data directory](/getting-started/configuration#where-codeg-stores-its-data) — Codeg's own record, for the same reason |

Writing a server into a JSON config **keeps the file's key order**: since **0.32.0** the rest of it stays in the order you wrote it, instead of being re-sorted alphabetically on every save.

**Kimi Code 2.2.0** rejects its whole `mcp.json` if any entry still names the retired `kaos` executor, so since **0.35.2** Codeg drops `kaos` from every Kimi entry it saves. An entry Codeg doesn't touch keeps whatever it had — if Kimi stops loading your servers after the upgrade, look for a leftover `kaos` there.

That's **seventeen of the nineteen agents** — every one except **OpenClaw** and **Pi**. OpenClaw doesn't accept MCP servers at all (it's the one agent that opts out), so it's not offered as a target; Pi isn't in the list either. → [How agents differ](/guide/supported-agents#how-agents-differ)

**DeepSeek** and **ZCode** are the odd ones out in *how* a server reaches them. Every other agent reads its own config file at startup, so Codeg writes there and steps back. Their bridges read none — servers reach them only over the protocol, when a session is created or restored — so `$DSH_HOME/mcp.json` and `mcp/zcode.json` are Codeg's records of what to send rather than something the agent consults, and the ACP connection is the delivery path.

**Not every agent can host every transport.** ZCode takes **stdio** servers only, and Codex, DeepSeek Harness, Kiro CLI, TRAE CLI and Command Code take no **SSE** server. When you save, an agent that can't host the server's transport is simply left out — and anything Codeg wrote for it under that name before is taken out — so the save fails only when *none* of the agents you ticked can host it, rather than later at launch.

**An agent's own per-server settings survive.** Some agents keep extra fields on an entry that Codeg's editor doesn't show. Since **0.37.0** a save keeps **Cursor's** — `envFile`, `auth`, `tls` and the like — for every field you didn't change, and reinstalling a server from the marketplace keeps every Cursor field it doesn't set; an SSE server stays SSE instead of turning into HTTP; and those Cursor-only fields no longer spread into the configs Codeg writes for other agents — OpenClaw's and pi's included, for a server they already list — where Cursor's `auth` used to make OpenClaw reject its whole config and pi skip the server. **Kiro CLI's** `disabled`, `autoApprove`, `disabledTools`, `timeout` and `oauth` settings are kept the same way when you save from the editor, so a server you disabled in Kiro stays disabled.

::: info Custom agents aren't listed here
This screen works by writing into each agent's **own** config file, and Codeg deliberately knows nothing about the config file of a [custom agent](/guide/custom-agents) you registered yourself — so those aren't offered as targets. What they still get is Codeg's own companion server, on the same terms as any built-in: it's attached whenever one of its [Collaboration settings](/reference/settings/collaboration) features is on, and carries the [delegation](/guide/multi-agent) tool once delegation itself is enabled. To give a custom agent an MCP server of its own, configure it in that agent's native way.
:::

::: tip Changes apply on the next session
Because a server lives in the agent's config, the agent reads it when it **starts a session**. Add or change a server and it takes effect for new conversations; for one that's already open, **Reconnect to apply** picks up the new config without losing your history. → [Configure an agent](/guide/agents#configure-an-agent)
:::

## Good to know

- **Secrets sit in the agents' config files.** An API key you type into a server's `env`, `headers`, or an install parameter is written into each assigned agent's own config on disk — the same files those agents already keep their settings in — not encrypted at rest. Treat access to your machine as the boundary, exactly as for [agent credentials](/guide/authentication#where-credentials-are-stored).
- **stdio servers need their command available.** `npx`, `uvx`, a binary — whatever the spec launches has to be on the PATH the agent runs with, or the server won't start.
- **It works the same on a server.** The MCP screen is in the browser build too; a remote server just needs the machine Codeg runs on to reach the endpoint.
- **Removing a server** takes it out of every agent it was enabled for at once — you don't have to clean up each config by hand.
- **Claude Code answers `/mcp` in the conversation.** Since **0.34.0** (adapter 0.86.0) `/mcp` is in Claude Code's `/` menu and replies with your MCP servers and their tool counts, and `/mcp reconnect`, `/mcp enable` and `/mcp disable`, followed by a server's name or `all`, act on them. Neither the command nor its answer is shown when you open the conversation again. A reconnect can't start a server's OAuth sign-in from Codeg.
- **So does Codex, since 0.35.0.** With codex-acp **2.2**, `/mcp` in a Codex conversation reports each MCP server's **live status**, and `/mcp reconnect` reconnects them. Each status check briefly starts one more copy of every session MCP server, Codeg's own companion included, which is harmless.

## Next steps

- [**Skills**](/guide/skills) — the other way to extend an agent: reusable instruction packs, enabled per agent, invoked with a `/command`.
- [**Supported Agents**](/guide/supported-agents#how-agents-differ) — which agents take MCP servers, and how they otherwise differ.
- [**Working with Agents**](/guide/agents#configure-an-agent) — reconnect a running session to apply config changes.
