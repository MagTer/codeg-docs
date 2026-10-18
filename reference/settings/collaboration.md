---
title: Collaboration
description: The Collaboration settings screen — whether an agent may hand work to another agent, how deep the chain may go, what each worker is spawned with, the assistants you can @-mention, and the switches that decide which codeg-mcp tools your agents get inside a conversation — live feedback, ask-a-question, session lookup, reading and driving the built-in browser, seeing and using your desktop's windows, and creating automations and to-dos from chat.
---

# Collaboration

**Settings → Collaboration** is where you decide how much of Codeg an agent may reach **beyond its own conversation** — *"How agents work with each other, and which of Codeg's own tools they can reach from inside a conversation."* Two panels:

- **Multi-Agent Collaboration** — whether an agent may hand a sub-task to another agent at all, how deep a chain may recurse, what each agent is spawned with as a worker, and the assistants you can hand work to.
- **In-conversation tools** — the tool groups Codeg injects when an agent starts: feedback, ask-a-question, session lookup, the built-in browser, your desktop's windows, and the create-from-chat writers.

They sit on one page because the same [`codeg-mcp` companion](/reference/architecture) injects both when an agent starts, and deciding one without seeing the other never made much sense. Each panel carries **its own Save** button, and nothing in either takes effect until you press it — except on the **Assistants** tab, where changes apply as you make them.

::: info New in 0.31.2, moved up in 0.33.0
Both panels used to live at the bottom of **Settings → General**, which is how that screen grew to twice the length its name implies. They moved to an entry of their own in **0.31.2**, and since **0.33.0** that entry sits right after **General**. Nothing about what they do changed with either move.
:::

## Multi-Agent Collaboration

The switch that lets an active agent hand sub-tasks to other agents — Codeg's **delegation** feature. Three tabs since **0.36.0**:

- **General** — **Enable delegation** (off by default; when off, the `delegate_to_agent` tool is hidden from the agent's tool catalog), **Maximum delegation depth** (1–8, default **1** — how deep a chain of agents-spawning-agents may recurse), and **Completed-result cache (MB)** (default 512 — how much finished sub-agent output is held in memory while the lead session runs; `0` = unlimited).
- **Agent defaults** — per-agent overrides (mode and config) applied when a delegation call spawns that agent as a worker — a plain agent, not an [assistant](/guide/assistants), which brings its own. Pick the agent from one list, in your agent order: a [custom agent](/guide/custom-agents) is there too, a disabled one isn't, one that isn't installed is marked and can't be picked, and each agent you've customized shows how many overrides it has. Its options follow as rows — the **model** first — and come from a live probe of the agent, so what you pick is exactly what it will accept; switches appear as **Default / On / Off**. A row left on **Default (…)** is dimmed and names the agent's own default. The probe runs with the model you picked, so model-dependent options such as OpenCode's effort list that model's choices; the model row stays usable while the rest reloads, a warning appears under it if the agent didn't switch, and a saved value the agent no longer offers reads *Unavailable (was …)*. The model list is grouped by provider, as the composer's is. With delegation switched off — on the General tab, saved or not — the tab says so and can't be edited.
- **Assistants** — saved delegation setups you can `@`-mention: an agent with every one of its options picked, plus standing instructions. **New assistant** opens the editor; each row has a switch, an edit button, and **Duplicate** and **Delete** on its **⋯** menu, and rows reorder by dragging. Changes here apply as you make them, so the panel's **Save** is hidden on this tab. → [Assistants](/guide/assistants)

**Save** applies **General** and **Agent defaults** together, and an amber dot on either tab marks unsaved changes there. This panel is the control surface; the how-to — writing delegation prompts, watching the team, turning a workflow into a skill — lives in **[Working with Multiple Agents](/guide/multi-agent)**.

One thing switched on here can still be withheld elsewhere, so the panel says so: a warning under **Enable delegation** **names any agent whose per-agent [Let the agent handle files and commands](/guide/agents#let-the-agent-handle-its-own-files-and-commands) switch is on**, because that switch takes the delegation tools away deliberately. The list is read from the policy the backend actually resolved, not guessed from the agent's environment — so it agrees with what the agent will really be handed.

::: info The target list follows your enable toggles
`delegate_to_agent` advertises only the agents you can actually launch, re-read each time an agent starts: a built-in you've disabled in **Settings → Agents** is struck from its list of targets, an enabled custom agent is added to it, and a disabled one is simply never offered. So switching an agent off hides it from the lead as well as from the composer picker. Since **0.36.0** the tool also lists the assistants that were switched on when the lead's session started, each with its description, so the lead can pick one on its own; that list catches up the next time the agent starts, while an assistant you mention is looked up when it's called.
:::

## In-conversation tools

One card, eight switches, one **Save** — *"extra tools Codeg gives an agent inside a conversation. Each is injected when the agent starts, so a change applies to agents started afterwards."*

| Switch | Default | What the agent gains |
| ------ | ------- | -------------------- |
| **Live Feedback** | Off | Take notes and corrections from you *while it's working* — see below |
| **Ask user question** | On | Pause and put a multiple-choice question to you, rendered as a card above the conversation input. The agent blocks until you answer or skip. Since **0.31.0** the card [collapses to its header](/guide/conversations#follow-along-—-the-conversation) while the question stays pending |
| **Get session info** | On | Resolve a session you referenced — a badge like `codeg://session/<id>` — into its title, agent, status, workspace, token usage, and recent messages. Read-only |
| **Read and drive the built-in browser** | Off | List the pages open in the [built-in browser](/guide/browser#let-an-agent-work-on-the-page), read the ones you shared, act on the ones you shared for acting, and open, point or close tabs |
| **Run code in the built-in browser** | Off | Run its own JavaScript on a page you shared for acting. Needs the switch above — and since **0.31.1** *this* switch is where the decision is made: with it on, snippets run **without asking** unless you set [Running code on a page](/reference/settings/browser#running-code-on-a-page) to *Ask me every time* |
| **See and use your desktop's windows** | Off | List your apps and windows, read the ones you share, and act on the ones you share for acting — [computer use](/guide/computer-use). The same setting as **Enable computer use** on [its own page](/reference/settings/computer-use) |
| **Create automations** | Off | Save the conversation as an [automation](/guide/automations) that runs on a schedule |
| **Create to-do tasks** | Off | Queue a card on the [to-do board](/guide/tasks) from the conversation |

The first three are read-only or ask-only. **The other five reach outside the conversation** — two into a page you are looking at, one into the windows on your desktop, two into app state — which is why they all start off and why they're checked again at the moment the tool is called, not only when the agent started: switching one off stops even a session that is already running from using it.

The two browser switches only ever hand a tool to an agent in the **desktop app**; a browser session has no native tabs for an agent to reach, so the rows are inert there, and in a desktop window attached to a remote workspace the agents run on the remote host, out of reach of this computer's tabs. Be clear about what turning the first one on does, though: with **Default sharing level** at its shipped value of *Read and act*, every page in every browser tab is shared with that agent as it loads. A tab's own control still overrides it page by page, and *Share nothing* leaves every share to that control. → [Let an agent work on the page](/guide/browser#let-an-agent-work-on-the-page)

The desktop-windows switch gives tools only where computer use is actually served — the desktop app, or a `codeg-server` started with `CODEG_COMPUTER_USE` — and nothing is readable until you share a window from the status bar. Two of its tools sit behind switches of their own on the [Computer Use](/reference/settings/computer-use) page, both off by default: opening applications and moving windows, and the clipboard. → [What an agent can do](/guide/computer-use#what-an-agent-can-do)

**Ask user question** no longer costs you two dialogs. Under a permission mode that consults you before *every* MCP tool call — Claude Code's default — the real question card used to be preceded by a raw "run this tool?" approval that dumped the questions as JSON. Since **0.31.0** Codeg recognises its own ask tool and answers that one for you, for that turn only. And since **0.35.2** an answered question tells the agent to go ahead with your answers now, instead of asking you again whether it should proceed — Claude Code and Codex included.

**Get session info** spells out to the agent what a session badge *means*: mentioning a session is you pointing at it deliberately, so the agent looks it up without being asked to, once per session mentioned. That mirrors how an `@agent` mention is treated as an instruction to delegate. → [Pick up where another session left off](/guide/multi-agent#pick-up-where-another-session-left-off)

### How live feedback reaches a running agent

There are two channels, and which one you get depends on the agent. The wording you see changes with it, deliberately, because they promise different things:

- **Pushed straight into the turn** — *Insert into current turn*. With an agent whose adapter supports instant steering, your note goes into the work already in flight and the agent sees it right away. That is **Claude Code on adapter 0.65.0 or newer** — and since **0.35.0** a [custom agent](/guide/custom-agents) running that same adapter, recognised by the name the adapter reports when it connects. The floor is checked against the adapter actually running rather than the version Codeg would have installed — launch prefers a copy already on your `PATH`, so the pin alone wouldn't prove it.
- **Pulled by the agent** — *Send note for next check*. Any other session whose agent was handed the `check_user_feedback` tool **when it launched** — so not one that can't take MCP at all, and not one you switched this on for mid-session. Having the tool, the agent still has to volunteer a call to it, and those agents typically only check when you mention it: add something like *"check my live feedback regularly"* to your prompt. The opposite failure is handled since **0.35.2**: an empty check now tells the agent not to check again until its next natural checkpoint, and a third empty check in quick succession tells it plainly to stop polling and get on with the task — wording only, every check is still answered — so an agent no longer burns its turn calling `check_user_feedback` in a loop. Those instructions now reach **Claude Code** and **Codex** too, which read only a tool result's structured part and used to miss them.

A pulled note simply **waits** for the agent's next check. What gets rerouted is a note that couldn't be recorded at all — the turn ended while you were submitting — which is **queued instead, and sent with the next turn**, with Codeg saying so. Attachments follow the same principle from the other side: on the push channel a draft carrying **images and file references travels whole**, and on the pull channel it travels whole too, but by taking the queue rather than being stripped down to its text.

Since **0.30.3** the same two channels drive the composer's **mid-turn send** — the split Send button that appears while the agent is working — so the note doesn't have to go through the **+** menu's dialog. Since **0.30.10** they also drive the insert button on each **queued message**; one whose insert misses the turn moves to the front of the queue since **0.34.0**, so it goes first. → [Talk to an agent mid-turn](/guide/conversations#talk-to-an-agent-mid-turn)

## Good to know

- **Two Saves, not one — and a tab with none.** The delegation panel and the in-conversation-tools card each apply on their own button, and nothing on either takes effect as you flip it. The **Assistants** tab is the exception: it writes each change at once.
- **Tool switches apply the next time an agent starts.** Each adds or removes a tool "for agents started after this is turned on" — an agent that's connected right now won't gain or lose the capability mid-flight. It needn't be a brand-new conversation, though: any conversation picks the change up whenever its agent next launches, including an existing one you return to after its connection ended. A new conversation is simply the surest way. (The two *create* switches, the two *browser* switches and the desktop-windows switch are the exception, and are re-checked at call time — turning one off stops a session that is already running.)
- **These are the codeg-mcp tools.** Delegation and all eight in-conversation tools are served by the [`codeg-mcp` companion](/reference/architecture); the switches here decide which appear in each agent's catalog. Not *every* companion tool is governed here, though — an agent running a [to-do](/guide/tasks) also gets `task_progress` and `task_complete`, injected by the task engine rather than by anything on this screen.
- **An agent that refuses MCP gets none of them.** A [custom agent](/guide/custom-agents) with its **MCP support** switch turned off is connected without the companion at all, so nothing on this screen reaches it. Among the built-ins the same goes for **OpenClaw**, **Pi** and, since **0.36.0**, **Cline**.
- **The status bar carries these same switches.** All nine of them: the [codeg-mcp popover](/guide/multi-agent#the-service-from-the-status-bar) has delegation and every in-conversation tool, and its **open settings** link lands on this page. Flip one there with this page open and the form converges on it rather than sending its stale value back on the next Save.

## Related

- [Working with Multiple Agents](/guide/multi-agent) — the full how-to behind the Multi-Agent Collaboration panel.
- [Assistants](/guide/assistants) — creating, mentioning and managing the setups on the Assistants tab.
- [Built-in Browser](/guide/browser) — what the two browser switches hand an agent, and how a page is shared with one.
- [Computer Use](/guide/computer-use) — what the desktop-windows switch hands an agent, and how a window is shared with one.
- [Browser Use](/reference/settings/browser) — the other half of those two switches: where links open, site rules, sharing level, and whether an agent's code is put in front of you.
- [Architecture](/reference/architecture) — the `codeg-mcp` companion that provides these agent tools.
- [Reference overview](/reference/) — the full 17-screen Settings map.
