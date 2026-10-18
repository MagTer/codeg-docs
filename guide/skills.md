---
title: Skills
description: Give your agents reusable know-how — enable curated skill packs (Experts, Science, Office) and the UI Render skill from a shared store, or write your own SKILL.md, then invoke them in any conversation with a slash command.
---

# Skills

A **skill** is a reusable instruction file — a Markdown `SKILL.md` with a name, a description, and a procedure — that an agent can pull into a task on demand. Where an [MCP server](/guide/mcp) gives an agent new *tools and data*, a skill gives it *know-how*: how to run a disciplined code review, how to design an experiment, how to build a `.docx` from scratch. You invoke one in a conversation by typing `/` and picking it from the menu.

Skills are the agent's own feature — each supported agent reads them from its own skills directory. Codeg is the management layer on top, and it gives you two ways to put skills there:

- **Skill packs** — curated bundles Codeg ships (**Experts**, **Science**, **Office**), plus **UI Render**, the one skill that lets an agent [answer in cards, tables and charts](#cards-tables-and-charts-in-replies). You enable a pack's skills for the agents you choose, and Codeg links them in.
- **Your own skills** — write a `SKILL.md` by hand. Author it once in the shared store and switch it on across agents from the same matrix as the packs (**Skill Packs → Custom**), or write it straight into a single agent's own directory (**Skills**).

Either way the result is the same: the skill shows up in that agent's `/` menu, ready to invoke. Both live under adjacent Settings screens — **Skill Packs** and **Skills** — and the rest of this page covers each in turn.

## Enable a curated skill pack

Open **Settings → Skill Packs**. It's a tabbed hub — **Experts**, **Science**, **Office Tools**, **UI** and **Custom** — over three curated, Codeg-managed bundles, the UI Render skill, and your own skills ([below](#custom-skills)), all sharing one **central store** (`~/.codeg/skills`) and one enabling model:

| Pack | What's in it | Depth |
| ---- | ------------ | ----- |
| **Experts** | A software-engineering workflow library (drawn from the open-source *superpowers* collection) — grouped by **discovery**, **planning**, **execution**, **quality**, **debugging**, **review**, and **meta**. | Ready out of the box |
| **Science** | A research toolkit — **ideation**, **design**, **analysis**, **visualization**, **evaluation**, and **literature**. → [Scientific Research](/guide/research) |
| **Office Tools** | Document skills that create and edit `.docx`, `.xlsx`, and `.pptx`, powered by the bundled **officecli** tool. → [Office Documents](/guide/office) |
| **UI** | One skill, **UI Render**, that teaches an agent to answer with interactive cards, tables and charts in Codeg's chat. → [below](#cards-tables-and-charts-in-replies) | Ready out of the box |

### The skill-and-agent matrix

Each tab shows a grid: skills down the side (grouped by category), your agents across the top — every agent that actually reads skills from somewhere Codeg can write to. That's every built-in except ZCode, which keeps no skill folder Codeg could fill; Kiro CLI, TRAE CLI and Command Code, new to the grid in 0.36 and 0.37, each take `<id>/SKILL.md` folders only. Tick a cell to enable that skill for that agent, untick to remove it. Everything is batchable:

- A skill's **⋯** menu enables or disables it across **every agent** at once.
- An agent's column header does the reverse — **every skill** for one agent.
- **Select** several skills (the checkboxes) to flip a chosen set for a chosen subset of agents, and the top-right **Bulk** menu — *Enable everything (visible)* or *Disable everything (visible)* — toggles the whole grid.
- Click a skill's name to open a **preview drawer** — its full `SKILL.md`, plus a per-agent switch list.

Enabling is instant and reversible; disabling in bulk asks first, since it's the destructive direction.

### How enabling actually works

The central store is the single source of truth. When you enable a skill for an agent, Codeg drops a **symlink** (a *junction* on Windows) from that agent's skills directory into the central copy — so nothing is duplicated, and there's no separate database of what's on: the link either exists or it doesn't. The **Open central folder** button in the toolbar reveals `~/.codeg/skills` if you want to look.

A cell isn't always a plain on/off. You may see:

- **Blocked** — a real folder of the same name already sits in the agent's skills directory, so Codeg won't overwrite it. Move or rename it, then enable.
- **Linked elsewhere** — that name is already a link pointing somewhere other than Codeg's store.
- **Copy mode** *(amber ring)* — the filesystem refused a symlink, so Codeg copied the files instead. It still works; it just won't auto-update in place.

::: tip Packs update themselves
Experts (and any bundled skill) are baked into Codeg and re-extracted to the central store when you upgrade — so enabled skills stay current with no action from you. Edit an Experts or Science skill in place and Codeg flags it **user modified** and preserves your version. **UI Render** is the exception: Codeg rewrites it whenever it differs from the copy it ships, so an edit there doesn't survive. Science skills may carry a **needs key** or **needs setup** badge — they'll link fine, but the skill itself needs an API key or a Python environment before it runs; see the skill's own instructions and [where credentials live](/guide/authentication#where-credentials-are-stored).
:::

### Author your own skills in the shared store {#custom-skills}

The last tab, **Custom**, is where your *own* skills live in that same central store — so you write a skill once and enable it across any agent from the matrix, instead of re-creating it in each agent's directory. It behaves like the pack tabs (same grid, same symlink-in), but the skills are yours to edit.

From the Custom tab you can:

- **Create, edit, duplicate, and delete** skills, kept under `~/.codeg/skills`.
- **Import from a folder** — bring in an existing skill directory. On the desktop that's the native file picker; on the web or a remote workspace it's the server-side directory browser.
- **Import from an agent** — pull several skills at once out of an agent's own global skills directory into the shared store. The picker lists only that agent's *own* skills; anything already provided by the Experts, Science, or Office packs — or Codeg's own UI Render — is filtered out, so you won't re-import a bundled skill.
- Drop a skill folder into `~/.codeg/skills` yourself, and it shows up on the next **refresh** — anything that isn't part of the Experts, Science, or Office packs, or Codeg's own copy of UI Render, counts as a custom skill.

Once a custom skill is in the store, enable it per agent exactly like a pack skill — tick its cells in [the matrix](#the-skill-and-agent-matrix), or fan it out with the **⋯** and column menus.

## Cards, tables and charts in replies

Since **0.35.0** an agent can answer with more than text: a reply can carry **interactive cards and tables** — and since **0.35.1** charts — drawn right in the conversation while it streams. What makes an agent write them is one skill, **UI Render**, on the **UI** tab of Skill Packs. What draws them is Codeg's chat, for every agent, with nothing to switch on.

**Enable it per agent.** The tab is the same skill-and-agent matrix as the others, with a single row — *Generative UI → UI Render* — and a column for every agent that reads skills from somewhere Codeg can write to, custom agents included. Tick the agents you want; each one gets the skill in conversations started after you enable it.

**Then ask.** Start a message with `/ui-render` — `$ui-render` in Codex — and say what you want to see: *"/ui-render list the changed files as a table"*. Or just ask for something as cards, a table or a chart; an agent that has the skill reaches for it when a visual layout helps, and answers in plain Markdown when it doesn't. The skill also tells it to build cards from **real data in the session**, never invented numbers, unless you've asked for a mock-up.

What it teaches is a **`spec`** block in the reply — JSON Patch lines that build up a tree of components from a catalog of shadcn pieces: cards, tables, tabs, accordions, badges, alerts, progress bars, form inputs and buttons, and seven charts — **area, bar, line, pie or donut, radar, radial and scatter**. How that renders:

- **It grows as it streams.** The card fills in while the reply is still being written; a line that hasn't arrived whole is held back rather than drawn half-done.
- **Only an agent's own reply text is read.** A `spec` block you paste into your message, or one that turns up in a tool's output, stays a code block — and so does one that doesn't parse or fails to render, which falls back to showing its source.
- **Charts follow your theme**, show their values on hover, and hold still while the reply streams; they animate only with [chat animations](/reference/settings/appearance#chat-animations) on. Since **0.35.1** cards sit flat in the message, with no shadow.
- **Inputs and buttons stay inside the card.** Nothing is wired back to the agent or the app, so filling in a field or pressing a button changes only that card's own state. A link opens the way any link in the conversation does.
- **What's drawn stays drawn.** Rendering doesn't depend on the skill, so cards in older replies still render after you disable it, from whichever agent wrote them.

The skill itself is Codeg's: its `SKILL.md` is rewritten from the copy Codeg ships whenever the two differ, so an edit made to it is lost. A skill **of your own** named `ui-render` in the central store is never touched — the tab says the name is taken, badges the row **Name in use**, and asks you to rename yours on the **Custom** tab before the built-in one can be enabled. A real folder of that name in one agent's skills directory blocks only that agent's cell, the same way it would [for a pack skill](#how-enabling-actually-works).

::: info Coming from 0.35.0
**0.35.0** shipped this behind a single switch, *Generative UI (json-render)*, and the skill was called **json-render**. **0.35.1** replaced the switch with the per-agent matrix and renamed the skill: if you'd had the switch on, the agents that already had json-render get ui-render in its place when you upgrade; if it was off, Codeg's json-render links are cleared away. A json-render skill of your own is left alone either way.
:::

## Write your own skill

The **Skills** screen authors a skill a different way from the Custom tab above: you write **straight into one agent's own skills directory** (global or per-project), not the shared store — no matrix, and the skill belongs to that agent alone. Use it for something specific to one agent or one project; use **Skill Packs → Custom** when you want to write once and share across every agent.

For a skill that isn't in any pack — an internal convention, a workflow you keep repeating — open **Settings → Skills** and author it directly.

Pick a **managed target** (only agents that actually support skills appear in the dropdown), then choose a **scope**:

- **Global** — the agent's home skills directory (Claude Code's is `~/.claude/skills`), available in every folder.
- **Folder** — a project-scoped directory (`{folder}/.claude/skills`) that only shows up when you're working in that folder. Pick the folder from the list of ones you've opened in Codeg.

Click **New Skill**, give it an id (which becomes the on-disk file or `{id}/SKILL.md` directory, and the `/`-name you'll invoke), and write the body. The editor is split: a Markdown source pane and a **live preview** that renders the content and pulls out the YAML front-matter fields. A `SKILL.md` is just front-matter plus a procedure:

```markdown
---
name: pr-review
description: Review a pull request for correctness, tests, and style
---

When asked to review a PR:
1. Read the diff and summarize the intent in one line.
2. Check each changed file for logic errors and missing tests.
3. Flag anything that breaks the project's conventions.
```

Save, and it lands right beside the pack-installed skills. From the list you can **preview**, **edit**, **open the folder** it lives in, or **delete** it. Skills shipped as part of the system are marked **read-only** — you can read them but not change them. Because you're writing straight into the agent's own skills directory, this is the agent's native skill format; Codeg just gives you an editor and a preview for it.

## Invoke a skill in a conversation

Enabled skills surface in the composer the moment you need them. Type **`/`** and they appear in the autocomplete right next to slash commands — pick one to drop it into your message. *(Codex uses **`$`** instead of `/`, matching its own convention.)* Most agents list their skills there themselves. For two, Codeg reads them from the folders Settings → Skills manages: Codex, in its `$` list, and since **0.36.0** Google Antigravity — which lists only a few commands of its own — after those commands in its `/` menu. A command whose name carries a colon, like Qoder's `/sites:sites-building`, reads as one command since **0.37.0** and reaches the agent exactly as named. Since **0.35.0** a command that takes arguments shows what goes after it, as the agent describes it — Codex's `/review-branch` reads *branch name* — in that list, in the **+** menu's *Slash commands* and in the automation editor; picking it still inserts just the command. The **+** menu also carries shortcuts for the three skill families — Experts, Office, and Research — so you can reach a common skill without remembering its name.

Two things to know:

- A skill that **isn't enabled for the current agent** shows as locked — enable it for that agent first (in Skill Packs or Skills), and it'll light up.
- **Folder-scoped** skills you wrote only appear while you're working in their folder; global ones are always there.

## Good to know

- **Skills are per agent, not per Codeg.** Enabling one for Claude Code doesn't enable it for Codex — that's the whole point of the matrix. Turn on the same skill for as many agents as you like.
- **Changes apply on the next session.** A skill is read when the agent starts a conversation; for one that's already open, **Reconnect to apply** picks it up without losing history. → [Configure an agent](/guide/agents#configure-an-agent)
- **Disabling is safe, and thorough.** It never touches the central copy, and a link in another agent's own folder stays put. What it removes is Codeg's link in **every** global skills folder this agent reads — the shared `~/.agents/skills` among them — so a skill another agent was reading from that shared folder goes for both. Removing a bundled skill entirely takes it out of all agents at once.
- **It works the same on a server.** Both Settings screens are in the browser build; skills live on the machine Codeg runs on.
- **A custom Pi agent directory opts out.** If you've pointed Pi at a non-default `PI_CODING_AGENT_DIR`, it isn't managed by the shared store and won't appear as a target. → [How agents differ](/guide/supported-agents#how-agents-differ)
- **A custom agent has to declare where its skills go.** Codeg can't guess where an agent you registered yourself reads skills from, so it appears as a column only once you tick the **shared `.agents/skills` store** or name a **dedicated skills directory** on its settings card. Until then it's left out — a link there could only fail. → [Custom Agents](/guide/custom-agents#give-it-skills)

## Next steps

- [**Office Documents**](/guide/office) — put the Office pack to work: build and edit `.docx`, `.xlsx`, and `.pptx` with live preview.
- [**Scientific Research**](/guide/research) — the Science pack in depth, from hypothesis to write-up.
- [**MCP Servers**](/guide/mcp) — the other way to extend an agent: give it new tools and data sources.
- [**Custom Agents**](/guide/custom-agents#give-it-skills) — declare where an agent you registered yourself loads its skills from.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — distinct from the Experts pack: one agent delegating whole sub-tasks to another agent type.
