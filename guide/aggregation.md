---
title: Conversation Aggregation
description: Pull the sessions you've already run — across every coding agent — into one workspace, resume any of them right where you left off, and @-mention any of them to hand its history to a different agent.
---

# Conversation Aggregation

Every coding agent keeps its own history. Claude Code writes transcripts under `~/.claude`, Codex under `~/.codex`, OpenCode in a local database — each in its own place, in its own format, invisible to the others. **Conversation Aggregation** pulls all of it into one workspace: point Codeg at a project and it sweeps every agent's store for sessions you ran there, then lists them right alongside your Codeg-native conversations.

And nothing you import is a dead archive. Open any of these sessions and keep going — the original agent picks up the thread with its full history intact. A conversation you started last week in a terminal continues in Codeg's workspace as if it never left. Better still, that history stops being private to the agent that wrote it: once a session is in Codeg you can [`@`-mention it](#reference-a-past-session-with) and hand what it learned to *any* agent.

## How to import

Importing happens in its own window, so you can see everything Codeg found and choose what to bring in. Open it either way:

- In the Conversations sidebar, right-click a **folder** (or open its **⋯** menu) and choose **Import local sessions**. This starts you off with that folder's new sessions already ticked and scrolled into view.
- Or use the **import** button on the **Folders** section header, for a clean slate.

Either route opens the **Import Local Sessions** window, which:

1. **Scans first.** It walks every agent's session store, showing a live count per agent as it goes. Large histories take a moment.
2. **Shows you everything it found**, grouped by project folder. Search by title or path, filter to one agent, or flip on **Importable only** to hide what's already in. Tick individual sessions, tick a whole folder, or **Select all**.
3. **Reports what it did.** When the import finishes you get an **Import finished** summary — how many were **Imported**, **Restored**, **Refreshed**, or **Skipped**, plus **Folders created**, **Not found**, and **Failed** — then **Continue importing** or **Close**.

Two things about that list are worth knowing. Folders you haven't opened in Codeg yet are badged **New** — import from one and Codeg creates the folder for you. And a session already in Codeg is still listed, locked, and badged **Imported**, so you can see what's being skipped before you commit.

### Bring back a conversation you deleted

Deleting a conversation in Codeg **hides** it. The conversation and its history stay in the database, which is why the import window can put one back: turn on **Include deleted** — the toggle counts how many the scan found — and deleted sessions stop being locked rows and become selectable ones. Import one and the **original conversation returns, history intact**, rather than a fresh copy of it landing beside the hole.

Two deliberate frictions, because this restores rather than adds. It is **off by default**, and a deleted session is **never preselected** even when the rest of its folder is — Codeg preselects only genuinely new sessions, so opening the window can't stage a restore you never asked for. And turning the toggle back off **drops those rows from your selection** instead of leaving them staged out of sight.

::: tip A delete is not a disposal
The flip side of restorability: a conversation you deleted is still readable by anything that can read the data directory. If that matters to you, the [Privacy & Security](/reference/privacy#what-stays-local) page has the rest of the picture.
:::

- **One pass covers everything.** The scan isn't limited to the folder you started from — it's every supported agent across every project it can find, so you can catch the whole machine up in one go.
- **It's on demand.** Codeg never sweeps in the background or watches your agents' files. Sessions appear only when you ask, so importing is always a deliberate step.
- **It's local.** Import reads the agents' own files on your machine — nothing is uploaded, and the agents' original sessions are left untouched.
- **Sessions with no project folder are skipped**, and counted for you at the bottom of the list.

::: tip Imported sessions land in Review
An import marks what it brings in as **Review** rather than *Completed* — they're work you haven't looked at in Codeg yet, and it keeps them visible now that the sidebar hides completed conversations by default. Clear the queue in bulk with **Complete all sessions** from the folder menu. → [The sidebar's view options](/guide/workspace#folders-and-the-sidebar)
:::

## What Codeg matches

A sweep looks at **every agent Codeg supports** — even the ones you haven't enabled in Codeg. For each, it reads that agent's native session store (Claude Code's `~/.claude/projects`, Codex's `~/.codex/sessions`, OpenCode's local database, and so on) and works out which project directory each session ran in.

That path is the whole rule: **a session is filed under the directory you ran it in.** So the list you get is every agent's history, grouped by project — and an agent you set up long before Codeg still surfaces its past work, as long as its files are on disk.

→ [Supported Agents](/guide/supported-agents) lists where each agent keeps its sessions.

::: tip Moved a project?
Sessions are filed by the directory path they ran in. If you've since renamed or moved the project folder, its older sessions still point at the *old* path — so they're grouped under that old location rather than the folder's new home.
:::

## Imported, updated, skipped

The summary at the end of an import tells you exactly what happened:

- **Imported** — brand-new sessions added to the list.
- **Refreshed** — a session already in Codeg that caught up with what the agent's own store now says: its **title**, and its **last-activity time**. Many agents name a session only after it's been running a while, so a later import picks up that name; and a session you've kept using in the agent's own CLI now sorts by when you actually last touched it, not by when you first imported it.

::: info Names now come from the agent, as soon as it has one
Two fixes changed where a session's name comes from. **Codex sessions show the titles Codex gave them** — Codeg used to fall back to the first user message while Codex kept the real title in its own session index, so the same session read one way here and another there. And since **0.28** a live session **takes its title the moment the agent picks one**, rather than waiting for a reload.

A name **you** set by hand still wins over both. And a session launched from a [to-do](/guide/tasks) card keeps the **card's** name — it used to be overwritten on the first detail load by whatever the agent's own file parsed to, which for an agent that writes no title of its own meant the first line of the composed prompt. Renaming the card now renames the session; sessions from earlier runs were repaired on upgrade.
:::
- **Skipped** — sessions already present with nothing to update.
- **Folders created** — projects that weren't in your workspace yet and got added.
- **Not found** and **Failed** — sessions whose files had vanished, and anything that errored (with the details listed).

Because of that split, **re-importing is always safe.** Run it again after a work session and you'll pull in what's new without disturbing what's there: Codeg won't duplicate a session, overwrite a title you set yourself, or reshuffle your list. Renames, pins, and status are yours and stay untouched. You can even see it before you click — anything already in carries an **Imported** badge and a locked checkbox.

::: info Two stores that changed shape
**OpenCode 2.x** keeps its conversations in new tables of the same database. Until **0.32.3** a fresh 2.x install listed none of them — *no such table: session* — and one upgraded from 1.x listed each conversation twice; now each is listed once, with its latest content. And a **Codex** conversation you edited or retried in the Codex desktop app shows its **current** history since **0.32.2** — the earlier turns followed by the new ones — listed once rather than twice. Since **0.33.0** one you started in that app also shows its attachments as links ahead of your request, and takes its title from what you wrote.
:::

::: tip A session you named yourself keeps its name
Rename a Claude Code session with `/rename` (or `claude -n`, or Ctrl+R in its picker) and that's the name it imports under — not the summary the model wrote for itself. **CodeBuddy** works the same way. If you renamed more than once, the most recent one wins.
:::

## Pick up where you left off

Here's what makes aggregation more than a history viewer: **imported sessions are live.** Open one and it looks like any other conversation — the full transcript, read straight from the agent's own file. Type a prompt and the original agent reconnects to that very session, continuing with everything that came before as its context.

- **The original agent handles it.** An imported Codex session resumes with Codex, a Claude Code session with Claude Code — Codeg hands each agent back its own session by id, so no context is lost in translation.
- **History comes from disk.** Codeg re-reads the agent's transcript every time you open the session, so what you see is always the real thing, never a stale copy. That's also why import is quick: it records where each session lives, not a second copy of it.
- **When a session can't be reopened** — the agent has since expired or deleted it on its side — Codeg tells you and offers to **reload** or start a **new conversation** in its place, rather than leaving you stranded.

Beyond starting in **Review**, imported conversations get no special treatment — they sit in your history sorted by recency, turn up in search (**⌘K**), and behave exactly like the ones you started in Codeg.

## Reference a past session with @

Aggregation's real payoff isn't the list — it's that **any agent can be pointed at any other agent's history.** Once a session is in Codeg, mention it with `@` and the agent you're talking to can read what happened in it. A Claude Code conversation can look up what a Codex session did last Tuesday; a Grok session can pick up the thread from an OpenCode one. The agents can't see each other's stores, but Codeg can, so it stands in the middle and brokers the lookup.

**How to reference one.** Type **@** in the composer and choose from the **Sessions** tab — one you can hide under [Settings → General → Mention panel](/reference/settings/general#mention-panel), so show it again there if it's gone. The list covers **every conversation in your workspace** — every agent, every folder, imported and Codeg-native alike, regardless of status — with the owning agent's icon on each row and its branch or status beside the title. Typing filters on the title *and* the agent, so `codex` narrows the list to Codex sessions. Pick one and it drops into your message as a badge.

**What the agent can read.** The mention resolves to that session's title, which agent ran it, its status, its workspace folder and branch, its model and token usage, and a compact view of its **recent turns** — enough to work out what was tried, what worked, and where it stopped. Two things it deliberately isn't:

- **Read-only.** Referencing a session doesn't resume it, and doesn't touch it. To continue a session for real, open it — see [Pick up where you left off](#pick-up-where-you-left-off).
- **Not a transfer of context.** The agent gets a summary view, not the other session's full transcript verbatim. For a long history, say what you want out of it — *"find out how it configured the retry logic"* beats *"read this session."*

A few ways it earns its keep:

```text
@[Tuesday's Codex session] hit a wall on the migration.
Read what it tried, then take a different approach.
```

- **Cross-agent hand-off.** Sweep in last month's terminal work, then let whichever agent you prefer today build on it — the original agent doesn't have to be the one that continues.
- **Recover the reasoning, not just the diff.** Git tells you *what* changed; the session that made the change tells you *why* it was done that way.
- **Brief a fresh session cheaply.** Rather than re-explaining a long thread, start clean and point at the old one — useful when a conversation has grown too long to work in comfortably.
- **Combine it with delegation.** A lead can read a referenced session and then hand the follow-up to a sub-agent. → [Multi-Agent Collaboration](/guide/multi-agent#pick-up-where-another-session-left-off)

This needs **Get session info** switched on in **Settings → Collaboration** — it is by default. If a referenced session has since been deleted, the lookup simply reports that rather than failing. → [Settings → General](/reference/settings/collaboration#in-conversation-tools)

## Next steps

- [**The Workspace**](/guide/workspace) — where your aggregated conversations live and how the sidebar is organized.
- [**Supported Agents**](/guide/supported-agents) — the full roster, and where each agent stores the sessions this feature imports.
- [**Working with Agents**](/guide/agents) — enable an agent so it can resume the sessions you bring in.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — put a referenced session to work: have one agent read it and delegate the follow-up.
