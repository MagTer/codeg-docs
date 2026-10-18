---
title: Working with Agents
description: Enable a coding agent, make sure it's healthy with a preflight check, and start your first session — the same workspace whichever agent you run.
---

# Working with Agents

Codeg doesn't ship its own model. It's a workspace *for* agents — it connects to the coding-agent CLIs you already run, like Claude Code, Codex, and Gemini, and gives every one of them the same surface: the same composer, the same files and diffs, the same git and terminal. You choose which agent handles a conversation, and everything around it stays the same.

This page covers the essentials — enabling an agent, making sure it's ready to run, and starting a session. Four neighbours go deeper: [Supported Agents](/guide/supported-agents) is the full roster, [Per-Agent Setup](/guide/agent-setup) goes through each agent's own settings, [Authentication & Models](/guide/authentication) covers signing in and picking a model, and [Custom Agents](/guide/custom-agents) is how to add one that isn't on the roster.

## How agents work

Each agent is a separate command-line program. When you start a session, Codeg launches that program as a background process and talks to it over the **Agent Client Protocol (ACP)** — the shared language that lets one workspace drive many different agents. That's why the experience is consistent no matter which one you pick.

Codeg supports **nineteen agents** out of the box, delivered three ways:

- Most run through **npx** (an npm package), so they need Node.js on your machine. Codeg installs and updates them for you.
- **OpenCode**, **Cursor** and **Google Antigravity** are native **binaries** Codeg downloads for your platform (Cursor bundles its own runtime, so it needs no Node.js either).
- **Kiro CLI** and **TRAE CLI** run the copy you installed with the vendor's own installer. Codeg finds it on your `PATH` or in `~/.local/bin`, never installs or pins one, and its **Upgrade** runs the vendor's own updater.

Because ACP is an open protocol, the nineteen aren't a limit: you can **register any other ACP-compatible agent** yourself, from the protocol's public registry or from its distribution JSON, and Codeg drives it the same way. → [Custom Agents](/guide/custom-agents)

Two things are tracked separately for each agent: whether it's **enabled** (allowed to appear in Codeg) and whether it's **installed** (actually present on your machine). They're independent — you can enable an agent before installing it, and Codeg will help you install it when the time comes.

## Enable an agent

Agents are managed in **Settings → Agents** (titled *Agent SDK Management*). The **Agent List** on the left holds every supported agent; select one to see its details on the right. **All agents are enabled by default**, so there's usually nothing to switch on — but the enable toggle in each agent's header lets you hide the ones you don't use. A **+ Add custom agent** button in the top-right corner is how you extend the list beyond the built-in nineteen. → [Custom Agents](/guide/custom-agents)

Only **enabled** agents appear in the composer's agent picker. Disable the ones you'll never touch to keep that list short; if you ever disable everything, the composer just prompts you to *Open Agents settings* and turn one back on. The toggle reaches past the picker, too: an agent you've switched off is also dropped from the targets another agent can [delegate](/guide/multi-agent) to.

## Check it's ready — preflight

Open Settings → Agents and Codeg runs a **preflight check** on each agent — a quick health report, so you know it'll actually run before you rely on it. You'll see a **Version Status** line — the version Codeg recommends against the one installed locally, *Recommended: … · Local: …*, or *Not installed*; for an agent you installed with its vendor's installer, just the local version — followed by a short checklist, each item marked **PASS**, **WARN**, or **FAIL**.

What it checks depends on how the agent is delivered:

- **npx agents** — that **Node.js** and **npm** are installed and new enough (each agent sets a minimum Node version).
- **OpenCode** and **Cursor** — that your platform is supported and the binary is downloaded (OpenCode also fetches its plugins).
- **Kiro CLI** and **TRAE CLI** — one row: that the CLI is on your `PATH` or in `~/.local/bin`. The version row then reads *Local: … Installed with the official installer; Upgrade runs its own updater.*, or *Not found on this machine* with an **Install guide** link.
- **ZCode** — that its bridge is installed, and an **Official ZCode runtime** row that finds your ZCode and a Node.js 22 or later able to load `node:sqlite`, in place of the usual Node rows.

Every failing check comes with a **fix button** right beside it — *Install Node.js*, *Install Plugins*, and so on — and the version row offers **Install**, **Upgrade**, or **Uninstall** as needed, plus **Custom install** for a version of your choosing where the agent supports one — Kiro CLI and TRAE CLI offer only **Upgrade**, or **Install guide** while they're missing. When the agent's newest release is ahead of the one Codeg recommends, an amber **Upgrade to unreviewed latest …** joins them. → [Supported Agents](/guide/supported-agents#unreviewed-latest) Changed something outside Codeg? **Refresh check** re-runs the preflight.

**Installed an agent's CLI yourself?** Codeg counts that. Where it has no managed install of its own, it probes your system for the command — an `npx` package via `npm list -g`, a binary on your `PATH`, or the plain `--version` convention — and reports the real version instead of *Not installed*. Since **0.35.0** an `npx` agent's command is also looked for in **`~/.local/bin`**, after your `PATH` and before npm's own folder, which is where official installers such as Hermes's put it and where a desktop app launched from the dock wouldn't otherwise look. A self-installed **OpenCode 2.x** connects too: Codeg asks it which launch flags it takes instead of handing it 1.x's, which 2.x refuses. Since a session already preferred whatever was on your `PATH`, this just means the version row now agrees with what actually runs. Claude Code and Codex are the exception — there Codeg probes for an ACP adapter with its own executable name, not the `claude` or `codex` you already have — and so is ZCode, whose bridge needs your ZCode on top. → [ACP adapters](/guide/supported-agents#acp-adapters)

**And for those, the pane explains itself.** *"I have `claude` in my terminal and Codeg says it isn't installed"* was baffling enough that Codeg answers it in place: an **ACP adapter** badge sits beside the agent's name, and the first row of its preflight is an **ACP adapter** explainer with a **Learn more** link. It reads your machine rather than reciting the general case — if it found your own CLI it says where, names the adapter package it needs instead, and points out that the two coexist and read the same config directory, so there's no second sign-in. A failed connection is just as specific: it tells you whether the *SDK* or the *ACP adapter* is the missing piece. ZCode's row speaks for its bridge instead: it names the package Codeg runs and asks you to install and sign in to the official ZCode first. → [ZCode](/guide/agent-setup#zcode)

::: tip Preflight checks the plumbing, not the login
Preflight confirms the runtime, version, and install — not whether you're signed in. Getting an agent authenticated (its own subscription, an API key, or a custom endpoint) is a separate step. → [Authentication & Models](/guide/authentication)
:::

### When Codeg and your terminal disagree

Sometimes an agent runs fine in your terminal but Codeg insists it isn't installed. That's almost always a **PATH gap**: a desktop app launched from the dock doesn't inherit the shell setup that a terminal does, so a Node installed by `nvm`, `fnm`, or Homebrew can be invisible to it.

**Diagnose** — beside the preflight list, and on the banner you get when a session is blocked — runs **Environment diagnostics** to find out. It probes how *the app* resolves things, not your shell: the Node and npm it sees, the npm global prefix, where it looked for the agent's executable, any version-manager directories, and — the useful part — a **comparison against your login shell**, listing the PATH entries your terminal has that the app doesn't. It finishes with a plain verdict, like *"The command resolves in your terminal but not in the app — a GUI PATH gap"*, and often a concrete fix such as fully restarting the app. Since **0.35.0** that verdict also comes when your terminal finds the command and nothing else does, rather than a flat *not installed*, and the Node.js check compares the **full** version an agent needs, so a Node 20.2 no longer passes for an agent that wants 20.3. **Copy all** puts the whole report on your clipboard for a bug report.

Preflight runs on its own every time you open the screen; Diagnose is the deeper probe you run yourself when preflight and reality disagree.

## Configure an agent

Most agents work the moment they're installed, but each one's detail pane has plenty you can tune — and there are two ways to do it: **visual controls** for the everyday settings, or the agent's **raw config file** for anything the UI doesn't expose.

- **Visual settings.** The pane surfaces the common options as ordinary form controls — sign-in, model selection, custom endpoints, reasoning effort, and each agent's own switches — so you rarely need to hand-edit anything. Signing in and choosing models are covered in [Authentication & Models](/guide/authentication), and what each agent's pane holds in [Per-Agent Setup](/guide/agent-setup).
- **Environment Variables.** `KEY=value` pairs passed to the agent when it launches.
- **Config Management.** Where the agent has one, edit its own native config file (its *Native JSON Config*) directly from Codeg, for the settings the visual controls don't reach.
- **Drag to reorder.** The order of the Agent List doubles as a preference — the first enabled agent is the one Codeg reaches for when nothing else is specified (more on that below).

Change a setting while a session is open and that session keeps running on its old configuration — Codeg won't interrupt you mid-task. Instead, a bar appears at the **top of the conversation** noting it's still on the previous config; click **Reconnect to apply** and the session reloads with the new settings while **keeping its full history**. No need to close and reopen anything.

::: tip When the agent turns a setting down
Some of what the composer offers is a *request*, not a command — the agent answers with the options it actually adopted. Pick a model or a mode an agent won't take and it used to look like the setting springing back for no reason. Now Codeg says what was adopted instead, naming it, and **keeps your preference for next time**: a refusal is often about *this* session rather than the choice itself, and a model switch an agent declines mid-conversation frequently succeeds in a fresh one.
:::

### Let the agent handle its own files and commands

Codeg normally serves an agent's file reads, file writes and terminal commands itself, over the protocol. That's convenient — but it means those operations run in **Codeg's** process, outside whatever sandbox the agent applies to *itself*. An agent configured to deny reads of `**/.env` can't enforce it against a read it delegated: its own audit log records the profile as applied, with no violation, because nothing it controls ever saw the access.

A switch beside the environment editor on each agent's page — **Let the agent handle files and commands** — hands all three back. Codeg then advertises neither channel and refuses both if called anyway, and the agent does its own I/O under its own rules.

It's **off by default**, and the reason is on the switch: *Codeg adds no sandbox itself, so turn this on only if the agent has one configured.* Most agents ship none, so for most of them this trades a working file channel for nothing.

::: warning It also withholds delegation
Turning it on drops the **delegation** tools for that agent, because `delegate_to_agent` is a third door into the same room — it has Codeg spawn a second agent under Codeg's policy and relay the output back, which is exactly the containment leak the switch exists to close. The [Multi-Agent Collaboration](/guide/multi-agent) panel **names the agents this applies to** rather than reading "enabled" while the tools quietly aren't there. Setting `CODEG_ACP_HOST_TOOLS=agent` in the agent's environment does the same thing. → [Configuration](/getting-started/configuration)
:::

## Start a session

Start a new conversation and the composer shows an **agent picker** — a row of pills, one per enabled agent. Click one and Codeg connects to it; from there, set the **model**, the **mode** and the agent's other options from the [settings button](/guide/conversations#start-a-session-—-the-composer) in the composer. All of those come from the **agent itself**, not Codeg, so what's on offer depends on which agent you're running. Your choice of agent locks in once you send the first message — a conversation stays with the agent that started it.

**Which agent by default?** Codeg picks in this order:

1. The folder's **default agent**, if you've set one (folder menu → *Set default agent*).
2. Otherwise, the **first agent** in your Settings → Agents order.

So a per-folder default always wins, and the list order is the fallback. → [The Workspace](/guide/workspace#folders-and-the-sidebar) covers setting a folder's default.

The first time you use an agent in a session, you'll see **Connecting…** while Codeg launches the CLI and completes its handshake. Since **0.35.2** you can still change your mind then: pick another agent and the one that was starting is stopped at once, and the last one you pick is the one that connects. If it can't connect — the agent's disabled, not installed, unsupported on your platform, or slow to respond — Codeg raises an **alert**: a toast that says what went wrong, with **Retry** and, when the fix lives there, **Open Agents settings**. The alert stays in the status bar's **Alerts** list afterwards, without the Retry. The connection heart below the composer turns red and says why too.

## Connection status

While you work, the **connection heart** below the composer shows the agent's state — connected, connecting, error, or disconnected — with *Responding…* told apart from a resting *Connected* in its popover. Click it for the details and a **Reconnect** that tries to resume the session. Where the agent can't load one, or the load fails, Codeg starts a new agent session on the same conversation instead: the transcript stays, but the agent no longer has the earlier context. → [When the connection looks wrong](/guide/conversations#when-the-connection-looks-wrong)

Sessions you're not looking at may disconnect after a few idle minutes to free up resources — not while background work is still running, and not a Claude Code session with [Remote Control](/guide/conversations#continue-on-your-phone-—-remote-control) on — but the tab you're actively in stays connected, and Codeg **reconnects automatically** when you come back to a session.

## Next steps

- [**Supported Agents**](/guide/supported-agents) — the full roster, and where each agent keeps its sessions.
- [**Per-Agent Setup**](/guide/agent-setup) — what's particular to each agent: its sign-in, its settings pane, its quirks.
- [**Custom Agents**](/guide/custom-agents) — register an ACP-compatible agent that isn't on that roster.
- [**Authentication & Models**](/guide/authentication) — sign in with a subscription, an API key, or a custom endpoint, and choose your model.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — let one agent delegate parts of a task to others.
