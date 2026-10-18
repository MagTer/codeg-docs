---
title: Custom Agents
description: Register any ACP-compatible coding agent beyond Codeg's built-in nineteen — pick one from the public ACP registry or paste its distribution JSON, and Codeg installs it, records its history, and treats it like every other agent.
---

# Custom Agents

Codeg ships with [nineteen agents](/guide/supported-agents) it has adapted by hand — each one got a slot in the agent list and, wherever Codeg can read them, a parser for its session files. But the **Agent Client Protocol** is an open standard, and plenty of agents speak it without ever having crossed Codeg's path. Since **0.22**, you can add those yourself.

A custom agent isn't a second-class citizen. Once registered it appears in the agent list, the composer picker, the status bar, conversation search, and the delegation targets — everywhere a built-in appears. Codeg installs it, runs a preflight check on it, and, because such an agent usually keeps no history Codeg could read, **records the transcript itself** so its conversations show up in the workspace like everyone else's.

Everything happens in one place: **Settings → Agents**, where a **+ Add custom agent** button sits in the top-right corner of the header. It opens a dialog with two tabs — *"Register any ACP-compatible agent. Pick one from the public ACP registry, or paste its registry information."*

## Add one from the ACP registry

The **ACP registry** tab is the easy path. Codeg downloads the protocol's public catalog — [`cdn.agentclientprotocol.com/registry/v1/latest/registry.json`](https://cdn.agentclientprotocol.com/registry/v1/latest/registry.json) — and lists every agent published there, with its mark, name, description, and version. Type in the search box to filter; **Retry** re-fetches if the download failed.

Each row carries an **Add** button, unless one of two things is true:

- **Added** — you already have this one.
- **No build available for this platform** — the entry publishes nothing that runs on your machine. Codeg says so up front rather than letting you install something that could never launch.

Press **Add** and the row spins briefly, then flips to *Added* as the agent joins the list on the left. Adding pulls in the entry's whole `distribution` object verbatim, picks the channel that runs on your machine, and **inlines the agent's icon** into the saved definition — so the mark still renders later, even offline.

On **Windows**, most of the registry's binary agents only install since **0.35.0**: they used to look for a doubled name like `kilo.exe.exe` and stop at *Locating binary…*.

## Add one by hand

The **Manual** tab is for anything the registry doesn't carry: an agent you're building, an internal tool, a fork with a different package name. It's a short form.

| Field | What it's for |
| ----- | ------------- |
| **Registry ID** | The agent's identity — used as its wire name (`custom:<id>`), its transcript folder, and its binary-cache key. Up to 64 characters of letters, digits, `-`, `_`, and `.`; it can't begin with a `.` or reuse a built-in agent's name (`codex`, `gemini`, `claude_code`, …) |
| **Display name** | What you'll see in the picker and the status bar |
| **Version** | A label, shown in the version status row |
| **Distribution (JSON)** | How to launch it — [see below](#the-distribution-json) |
| **Launch via** | Which channel to use, when the JSON publishes more than one |
| **Icon** *(optional)* | An image under **256 KB**, *"stored with the agent, so it works offline. Without one, a colored initial is used."* |
| **Version probe command** *(optional)* | A command that prints the installed version. Left empty, Codeg runs the agent command with `--version` |
| **Skills** | Two declarations — [covered below](#give-it-skills) |

### The distribution JSON

This is the only field with any depth, and it's deliberately **paste-compatible with the ACP registry**: the box takes either a bare `distribution` object or a whole registry entry (Codeg unwraps it and keeps the name, version, and icon it carries). Copy an entry out of the registry and it just works.

Three channels are understood, and a **Templates** row drops a filled-in starter for each:

- **`npx`** — an npm package, run with `npx`. Needs Node.js.
  ```json
  {
    "npx": {
      "package": "@scope/agent-cli@1.0.0",
      "args": ["--acp"],
      "cmd": "agent-cli"
    }
  }
  ```
- **`uvx`** — a Python package, run with `uv`.
  ```json
  {
    "uvx": {
      "package": "agent-cli==1.0.0",
      "args": ["--acp"],
      "cmd": "agent-cli"
    }
  }
  ```
- **`binary`** — a downloadable archive, **keyed by platform** — or, since **0.35.0**, a single executable published as it is, which installs like a one-file archive as long as it's a native program for this platform. Installer packages (`.dmg`, `.pkg`, `.deb`, `.rpm`, `.msi`) are still refused. The template is pre-filled with *your* machine's key (`darwin-aarch64`, `linux-x86_64`, and so on), so what you write is something this machine can actually install.
  ```json
  {
    "binary": {
      "darwin-aarch64": {
        "archive": "https://example.com/agent-darwin-aarch64.tar.gz",
        "cmd": "./agent",
        "args": ["acp"]
      }
    }
  }
  ```

Two keys are worth spelling out, because they mean different things per channel:

- **`cmd`** — for **npx/uvx**, the executable the package installs (`qwen` for `@qwen-code/qwen-code`). Codeg derives it from the package name when you leave it out, so set it when the two differ. For **binary**, it's the launch path *inside* the archive.
- **`sha256`** — optional on a binary entry; when present, Codeg verifies the download against it.

A spec that publishes none of the three is rejected outright — *"No npx, uvx, or binary distribution found"* — rather than leaving the form quietly unready. Malformed JSON says *"Not valid JSON"*.

::: tip Publishing both a binary and a package
A few registry entries ship more than one channel. **Launch via** is your explicit answer, stored with the definition, so it can't silently flip between releases. When you add from the registry, Codeg picks the channel that runs on this machine — a binary published only for other platforms falls back to npx instead of failing.
:::

## Install it and check it's ready

A custom agent goes through the same [preflight check](/guide/agents#check-it-s-ready-—-preflight) as a built-in, and the same **Install / Upgrade / Uninstall** buttons on the version row. npx and uvx agents need their runtime; binary agents download to the checksum-verified cache Codeg already uses for OpenCode and Cursor.

**Already installed the CLI yourself?** Codeg now recognizes that. When it has no managed install of its own it probes the system: your declared version-probe command first, then `npm list -g` for npx packages, then the `--version` convention — and reports the real version rather than *Not installed*. (Since 0.22 that applies to the built-in agents too.)

The version row reads differently depending on where the definition came from:

- **Registry-added** — the full comparison, *Recommended: 1.4.0 · Local: 1.3.2*, with upgrade hints. When a release newer than the recommended one is out, an amber **Upgrade to unreviewed latest …** is offered too. → [Supported Agents](/guide/supported-agents#unreviewed-latest)
- **Manually added** — the local version alone, *Local: 1.3.2. Installed.* Your typed version isn't a published one, so comparing against it would be noise.

If the agent can't run here at all, the detail pane says why in place: *"This agent cannot launch here: …"*.

## Where its history lives

Most built-in agents keep their own session files, and Codeg [reads them natively](/guide/aggregation). An arbitrary ACP agent usually keeps nothing usable — so Codeg writes the history itself, the same way it does for three built-ins whose own stores it doesn't read yet: ZCode, TRAE CLI and Command Code.

Each session gets an **append-only JSONL transcript** under `acp-transcripts/<registry-id>/`, recording the prompts sent and the updates received, straight from the protocol — since **0.35.0** that includes what you [insert into a running turn](/guide/conversations#talk-to-an-agent-mid-turn) and the turns an agent starts on its own, after a background job say, so those survive a reload too. That folder sits in Codeg's data directory — the desktop app and `codeg-server` both point `CODEG_DATA_DIR` there — and `CODEG_HOME`, when you set it, takes precedence, which is what you'll want on a server. → [Configuration](/getting-started/configuration#where-codeg-stores-its-data) Codeg then projects that back into conversations exactly the way it projects a built-in agent's native store: the sessions appear in the Conversations list, open with their full transcript, and turn up in [import](/guide/aggregation). A session you opened but never prompted isn't listed, and a session the agent no longer remembers is chained onto its successor so it isn't shown twice.

This is why a custom agent needs no adapter work: the transcript *is* the ACP traffic, and ACP is the same for everyone.

## Give it skills

Codeg can't detect where an arbitrary agent loads [skills](/guide/skills) from — so you tell it. A custom agent's detail pane has a skills card with two independent declarations:

- **Shared `.agents/skills` store** — the cross-agent convention that OpenCode, Gemini, Cline, Codex, Pi, Cursor, TRAE CLI and Command Code already read (`~/.agents/skills` plus a project-local `.agents/skills`). Ticking it declares *"this agent reads the shared store"* and adds it to every skills matrix.
- **Dedicated skills directory** — an **absolute** path the agent loads skills from, its own store. `~` expands to your home directory; the field has its own **Save changes** button, so a half-typed path never round-trips.

Either one alone puts the agent on the Experts, Science, Office Tools, UI and Custom matrices. Set **both** and the dedicated directory is listed first, so linking a skill targets it and leaves the shared store untouched — the same ordering Pi and Cursor use.

::: warning Registry-added agents start with neither
Adding from the catalog leaves both declarations off, because the registry doesn't say where the agent reads skills from. Until you declare one, the agent simply doesn't appear as a column in the skills matrices — which is the honest answer, since a link there could only fail.
:::

## Delegation and MCP

**Delegation works.** A custom agent is `@`-mentionable in the composer and a valid target for [multi-agent collaboration](/guide/multi-agent) — it travels as `custom:<id>` and Codeg appends it to the delegate tool's target list. It's also listed in the agent picker under **Settings → Collaboration → Multi-Agent Collaboration → Agent defaults**, probed live like a built-in, so delegated sessions start configured the way you want — and it can be the agent behind an [assistant](/guide/assistants).

Whether it can *lead* a delegation is up to the agent: the delegate tool arrives as an MCP tool over ACP, so an agent that accepts MCP servers over the protocol can delegate, and one that doesn't can only be delegated to.

**MCP servers are not assignable from Settings → MCP.** That screen writes into each agent's *native* config file, and Codeg deliberately knows nothing about a custom agent's — so custom agents aren't offered as targets there. What they do get is what rides the protocol itself: Codeg's own `codeg-mcp` companion, on exactly the same terms as a built-in agent. It's attached whenever at least one of its features is switched on in [Settings → Collaboration](/reference/settings/collaboration) — delegation, live feedback, ask-a-question, session lookup, or creating automations and to-dos — and each feature's tools appear only while that feature is on. So `delegate_to_agent` reaches a custom agent once you've [enabled delegation](/guide/multi-agent#turn-it-on), not before. → [MCP Servers](/guide/mcp)

### When an agent refuses MCP entirely

Some agents reject any `mcpServers` entry outright and fail session creation when they get one — which used to mean they simply **could not be connected to from Codeg at all**, since the companion was injected for every custom agent.

The **MCP support** switch on a custom agent's settings page (and in the add/edit form) is the answer. It's **on by default**, so nothing about an agent you already added changes. Turn it off and Codeg starts that agent's sessions without the companion attached, and it connects — at the cost of everything the companion carries: no delegation, no live feedback, no ask-a-question, no session lookup, and no creating automations or to-dos from the conversation. The change applies to the **next connection**, not the one in flight.

You shouldn't have to guess when you need it. A `session/new` that fails on an agent that was handed MCP servers now reports itself as exactly that — the agent's own message, plus a pointer to this switch — rather than as a generic connection failure.

## Edit or remove an agent

Two cards sit at the bottom of a custom agent's detail pane (a **Custom** badge in its header tells you which agents have them).

**Edit agent** reopens the manual form, prefilled from the stored definition — *"Update the name, icon, distribution and skills declarations. The agent ID cannot be changed."* The id is locked because it *is* the identity: conversations reference `custom:<id>`, so changing it would create a new agent and orphan the old one's history.

**Remove agent** deletes the definition — *"Existing conversations keep their history; the agent just can no longer be launched."* The confirmation offers one extra choice: **Also delete its recorded conversation history**, which clears the JSONL transcripts too. Leave it unticked and the past work stays readable.

## Good to know

- **A built-in can take over a custom agent.** When a release adds a built-in that you'd already registered from the ACP registry, it depends on the id. **Kiro CLI** registered as `kiro-cli` became the built-in on the upgrade to **0.36.0**, with its conversations, tabs, folder defaults, automations, to-do settings, delegation defaults, tags and composer picks carried across. A **ZCode**, **TRAE CLI** or **Command Code** you'd registered yourself stays a separate custom agent with its own history — nothing is migrated, and the built-ins use registry ids of their own (`codeg-zcode-acp`, `codeg-trae-cli`, `codeg-command-code`) that a custom definition can't take.
- **The id is forever.** Pick it deliberately: it names the wire type, the transcript folder, and the binary cache entry. Everything else — name, icon, version, distribution, skills — is editable.
- **Disabled means invisible.** The enable toggle works the same as for a built-in, and since 0.22 it reaches further: a disabled agent is dropped from the delegate tool's target list, not just from the composer picker.
- **Icons are stored, not linked.** The registry's mark is inlined into the definition when you add it, so the agent list renders offline. A monochrome SVG is masked to follow your theme rather than rendered as-is.
- **It works on a server too.** The dialog is in the browser build, and the platform key it fills the binary template with is the *server's* — the machine that actually performs installs.
- **No per-agent quirk handling — with one exception.** Codeg's built-in agents each carry small adaptations for their non-standard behavior. A custom agent gets plain ACP semantics, live and in history alike — which is exactly why the two never diverge. The exception, since **0.35.0**, is steering: a custom agent whose adapter reports itself as Claude Code's own, `@agentclientprotocol/claude-agent-acp`, takes [Insert into current turn](/guide/conversations#talk-to-an-agent-mid-turn) directly, under the same version floor as the built-in Claude Code — a second Claude Code account registered as a custom agent, say. Its history is still Codeg's own transcript.

## Next steps

- [**Supported Agents**](/guide/supported-agents) — the nineteen agents Codeg adapts by hand, and what each one needs.
- [**Working with Agents**](/guide/agents) — enabling, preflight, configuration, and starting a session, all of which apply here too.
- [**Skills**](/guide/skills) — what the shared store and the skills matrices actually do.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — put your new agent on a team.
