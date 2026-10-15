---
title: Automations
description: Save an agent task once and let Codeg run it for you — on a cron schedule or on demand — each run landing as a normal conversation in its own git worktree, or as a card filed on the to-do board.
---

# Automations

An **automation** is an agent task you set up once and let Codeg run on its own — on a schedule, or at the press of a button. You compose it exactly like a normal message (a prompt, an agent, a folder, a mode), hand it a cadence, and from then on Codeg fires it **headlessly**: each run spins up the agent, does the work, and lands as an ordinary conversation you can open and read. Nobody has to be at the keyboard.

Since 0.23 a fire can also **[queue a task](#choose-what-a-fire-does)** instead of starting a session — same schedule, but the work lands on the [to-do board](/guide/tasks) as something you review.

It's the hands-off counterpart to [Chat Channels](/guide/chat-channels): a chat channel lets you drive Codeg from your phone, while an automation runs with nobody driving at all. Reach for it for the routine agent work you'd rather not kick off by hand — a nightly code review, a weekly dependency bump, CI triage, a recurring security sweep.

## Where automations live

Automations are their own view, opened from **Automations** in the left sidebar (the ⚡ item, right by your conversations). One toolbar runs across the top — a **folder** filter, an **enabled / disabled** filter, and **New** on the right — and below it a single panel splits into the list of your automations and the selected one's detail. If a scheduled run ever fails, the sidebar item carries a small badge so you notice — it clears when you open the view.

The first time in, there's nothing to show, so you land on a gallery of **templates** to start from.

## Create one — from a template or from scratch

Hit **New automation** and either pick a template or start blank. Codeg ships seven templates, each a ready-to-edit starting prompt:

| Template | What it does |
| -------- | ------------ |
| **Code review** | Review recent changes for bugs, regressions, and quality issues |
| **Dependency updates** | Find outdated dependencies and apply safe upgrades |
| **Test coverage** | Write tests for the highest-value gaps |
| **Security audit** | Sweep for injection, auth gaps, secret handling, and more |
| **CI triage** | Investigate failing checks and propose fixes |
| **TODO sweep** | Collect and prioritize `TODO`/`FIXME` comments |
| **Release notes** | Summarize changes since the last release tag |

A template just seeds the editor — a suggested prompt and cadence you then tweak. The editor itself is **the same composer you use for a normal conversation**: a rich prompt box with `@`-mentions for files, agents, sessions and commits, the `/` command menu for commands and [skills](/guide/skills) — with each command's arguments shown beside it since **0.35.0** — an agent picker, and the mode-and-options bar. Whatever you'd set up for a one-off message, you capture here as a reusable launch. Give it a name, write the prompt, and the rest is *where* and *when*.

## Choose what a fire does

Under **Action**, decide what actually happens when the automation goes off:

- **Launch session** *(default)* — the original behavior, and everything the rest of this page describes: the run spawns an agent and produces a conversation.
- **Enqueue task** — instead of running anything, the automation **files a card on the folder's [to-do board](/guide/tasks)**, titled after the automation and carrying the same prompt and agent. The [task engine](/guide/tasks#set-it-running) owns execution from there, on the board's own settings and concurrency limit.

Enqueue is the answer to a nightly job you never get around to reading. What the schedule leaves behind is a **queue on the board** rather than a pile of finished sessions to go hunting through — and since the board owns execution from there, you decide what happens to those to-dos. Leave them and they wait for you to press start; turn on the board's **Process automatically** and they'll have run overnight, each isolated in its own worktree, sitting in review with a diff to read by morning.

Two things change when you pick it: the folder list narrows to **project roots** (a to-do board belongs to a project, never a worktree), and the isolation controls below stop applying — a task always gets a worktree of its own.

::: tip Automations you already saved are unchanged
An automation from before 0.23 keeps launching sessions. Nothing is migrated, and nothing needs to be.
:::

## Point it at a folder — and isolate the run

Under **Target**, pick the workspace folder the automation runs in, and — for a **Launch session** automation — choose how it isolates its work:

- **New worktree per run** *(default)* — every run mints a fresh [git worktree](/guide/git#work-in-parallel-with-worktrees), so it never touches your working tree and repeated runs never collide with each other. This is what you want for anything that writes files.
- **Run in the folder** — the run works directly in the folder's tree, optionally on a **branch** you choose. It shares your uncommitted changes, so it can collide with work in progress — Codeg says as much right there. (A remote-only branch needs the worktree option; the shared mode can't track one.)

## Schedule it — or keep it manual

Under **Trigger**, choose **On a schedule** or **Manual only**.

For a schedule, you don't have to hand-write cron. There are one-tap presets — **Hourly**, **Daily 9am**, **Weekdays 9am** — a raw cron field if you want it, and a visual **Schedule builder** (pick a frequency — every N minutes, hourly, daily, weekdays, weekly on a weekday, monthly on a day — and it writes the expression). A live **Next run** line shows exactly when it'll fire next, in your device's auto-detected **timezone**, computed by the very same evaluator the scheduler uses — so the preview never lies.

If you do write cron by hand, it's the standard five fields:

```text
┌─ minute (0–59)
│ ┌─ hour (0–23)
│ │ ┌─ day of month (1–31)
│ │ │ ┌─ month (1–12)
│ │ │ │ ┌─ day of week (0–6, Sun–Sat)
│ │ │ │ │
0 9 * * 1-5     # 09:00, Monday–Friday
0 * * * *       # every hour, on the hour
*/30 * * * *    # every 30 minutes
```

**Manual only** automations never fire on their own — they sit until you press **Run now**.

## What a run actually does

Whether it fires on schedule or you hit **Run now**, a **Launch session** run is a real, live session:

- It spawns the agent headlessly and **produces a normal conversation** that appears in your sidebar the moment it starts. Open it to watch the work stream in, or to step in. Since **0.26.1** that conversation is **named after the automation** — not after the first eighty characters of its prompt, which is identical on every run and never said which automation a session belonged to.
- It **replays the mode you saved**, so how far it goes on its own is exactly the mode you picked in the editor. A run is a genuine agent session: if the agent stops to ask permission or a question, that surfaces in the produced conversation. For a truly unattended cadence, pick a mode that doesn't pause for approvals, or keep the task read-only — the analysis templates are deliberately written to *not* change files.
- **One run at a time, per automation.** If a run is still going when the next one comes due, the new one is recorded as **Skipped** rather than piling on top.

An **Enqueue task** run is the opposite — it never touches any of that. There's no worktree and no agent: it writes one to-do onto the board and settles as **Succeeded** immediately, its summary naming the task it queued. Because a run is never still going when the next one comes due, an enqueue automation is never **Skipped**. The *tasks* do accumulate, though — an hourly schedule with **Process automatically** off hands you a very long to-do column, so pick a cadence you'll actually work through.

The detail pane's **Run history** is a timeline of every run — its status (**Running**, **Succeeded**, **Failed**, **Cancelled**, or **Skipped**), when it started and how long it took, a one-line summary or the error, a **View conversation** link to jump into what it produced, and a **Cancel** button while it's still going.

::: tip Runs happen while Codeg is running
The scheduler lives inside Codeg — desktop app or [server](/getting-started/deployment). A schedule that comes due while Codeg is closed fires **once** the next time it's open and due, not once for every slot it missed. And if Codeg quits mid-run, that run is marked **Failed** on the next start (never faked as done) — the automation simply fires again on its next schedule.
:::

## Let an agent write one

You aren't the only one who can save an automation. An agent in a conversation can **park work instead of only doing it**: one tool saves an automation — on a cron schedule or manual — and its sibling queues a [to-do](/guide/tasks). *"This check should really run every night"* becomes a saved automation without you leaving the conversation to go build it.

Both are **off by default**, under **Settings → Collaboration → In-conversation tools**. They're the two switches there that *write* app state rather than only reading it, so they're deliberately opt-in — and unlike the read-only tools, they're re-checked at the moment they're called, meaning switching one off stops a session that's already running from using it. → [Settings → General](/reference/settings/collaboration#in-conversation-tools)

Two details worth knowing:

- **The project is resolved, not guessed.** An explicit folder path wins; otherwise it's the conversation's folder, otherwise its working directory — and a **worktree normalizes back to the repository it was cut from**, so a to-do never lands on a temporary checkout's board. Anything it can't resolve comes back as a refusal the agent can act on rather than an opaque error.
- **Cron is held to five fields** at the tool boundary. A six-field expression would have been stored happily and then fired two days off, so it's rejected instead.

Whatever the agent saves is an ordinary automation — it shows up in this view, and you edit, disable or delete it exactly like one you wrote yourself.

## Manage them

Each row — via the **⋯** menu or a right-click — gives you **Run now**, **Enable/Disable**, **Edit**, and **Delete**. On the detail side, the enable switch sits in the header and **Run now** / **Edit** sit directly under the title, above the schedule facts, the prompt, and the run history. When you have more than a couple, the toolbar's two filters narrow the list by **folder** or by **enabled state**; a folder filter left pointing at a folder that no longer holds any automations quietly falls back to *all*. The folder control is the [searchable picker](/guide/tasks#keep-the-board-tidy) the whole workbench uses — one row per folder reading *alias [ name ]* over its path, matching on all three — and so is the workspace folder in the automation editor.

## Good to know

- **It works the same on a server.** The engine runs in both the desktop app and the standalone server, so automations fire wherever Codeg is running. (If a desktop app and a server ever share one data directory, only one of them drives the automations — they won't double-fire.)
- **Every session run is a full agent session** — its own token cost, its own entry in your history. A frequent schedule multiplies both. A task run costs nothing until the board starts the task.
- **Worktree runs leave folders behind.** Each per-run worktree is a real folder Codeg tracks; the same [worktree tools](/guide/git#work-in-parallel-with-worktrees) clean them up. Older run history is pruned automatically over time.

## Next steps

- [**To-dos**](/guide/tasks) — where an *Enqueue task* automation files its work, and how you review and merge it.
- [**Chat Channels**](/guide/chat-channels) — the other way to run Codeg hands-off: drive it from Telegram, Lark, or WeChat.
- [**Git & Worktrees**](/guide/git#work-in-parallel-with-worktrees) — how per-run isolation works, and how to manage the worktrees runs create.
- [**Working with Agents**](/guide/agents) — the agents and modes an automation replays.
- [**Skills**](/guide/skills) — bottle a repeatable workflow into a `/command` and drop it into an automation's prompt.
