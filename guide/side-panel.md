---
title: The Side Panel
description: The panel along the right edge of the workspace — a tab rail you can reorder, Session Details with the agent's plan and message navigation, the project's files, diffs and previews, your git changes and history, and the project's automations, to-dos, issues and pull requests.
---

# The Side Panel

The panel along the right edge of the workspace holds everything *about* the conversation you're in that isn't the conversation itself: its details, the agent's plan and a map of your messages, the project's files, your uncommitted changes and history, and — since **0.37.0** — the project's automations, to-dos, issues and pull requests. Each is a tab, and the tabs line up on a rail down the panel's right edge.

The conversation it sits beside is [Conversations](/guide/conversations); the window around both is [The Workspace](/guide/workspace).

## Open and close it {#open-and-close-it}

Open it with the **Toggle Auxiliary Panel** button in the window's top-right corner, or with **⌘E** / **Ctrl+E** — *Toggle Right Panel* in [Settings → Shortcuts](/reference/settings/shortcuts), where you can rebind it. The same two close it again, and since **0.37.0** so does a click on **the tab that's already selected**. A click on any other tab just switches to it; a press that turns into a drag, a right-click, and **Enter** or **Space** on a focused tab all leave the panel open, so from the keyboard you close it with the shortcut. It reopens on the tab you left.

Drag the divider on its left edge to resize it, from **200 px** — 260 px in the desktop app on Windows and Linux — up to **900 px**; it starts at 320. Whether it's open and how wide it is are remembered. Which tab was showing isn't: a window you open or reload starts it on **Session Details**.

The [full-page views](/guide/workspace#the-layout) — To-dos, Automations, the Repository panel, Token Usage and the canvas — fold it away while they're showing, and it comes back as it was when you return to your conversations.

**On a phone**, or in any window narrower than 768 px, the panel is a drawer that slides in from the right, with its tabs as a row of icons across the top in the same order. Tapping the selected tab closes it, and so do a swipe, a tap on the strip of page it leaves showing, and the back gesture. Opening a file from **Files**, a run's conversation from **Automations**, or **Open full page** from a project tab closes it too. Jumping to a message from [Message navigation](#message-navigation) doesn't: the transcript moves behind the drawer.

## The tab rail {#the-tab-rail}

Since **0.36.0** the tabs stand on a **vertical rail of icons along the panel's right edge**, and the strip across the top names the tab you're on. They used to be a row along the top that folded into a dropdown once the panel got narrow. There are eight:

| Tab | What it holds |
| --- | ------------- |
| **Session Details** | The conversation's details, the agent's plan, and message navigation — [below](#session-details) |
| **Files** | The project tree, which opens into the editor and previews — [below](#work-with-files-—-editor-diffs-and-previews) |
| **Changes** | Your working tree: diffs, quick commit, stash — [below](#review-and-commit) |
| **Commits** | The history timeline, branches and remotes — [below](#review-and-commit) |
| **Automations** | This project's automations and their runs — [below](#the-project-s-automations-to-dos-issues-and-pull-requests) |
| **To-dos** | This project's to-do board |
| **Issues** | This project's issues on its forge |
| **Pull requests** | Its pull requests — **Merge requests** when the remote is on GitLab |

A folder conversation always has all eight; the Issues and Pull requests tabs explain themselves inside when the folder has no forge to talk to. A [Chat-mode](/guide/conversations#start-a-session-—-the-composer) conversation has no project, so the panel holds **Session Details** alone and the rail isn't shown. With neither a folder conversation nor a chat open, the button and the shortcut do nothing.

**Put the tabs in your order.** Drag a tab up or down the rail, or focus it and press **Alt+↑** or **Alt+↓** — ⌥ on a Mac — to move it a place; plain **↑** and **↓** step between tabs. The order is kept **on this device** — a browser keeps one per server address — and every open window follows a change at once. There's no reset: drag the tabs back into their original order and Codeg forgets the custom one, so a tab added in a later release lands in its built-in place. If you'd reordered them in 0.36.0, the four tabs that arrived in 0.37.0 join as a block right after **Commits**, wherever you'd put it. **Alt+↑/↓** is fixed — it isn't among the bindings in Settings → Shortcuts — and it belongs to the desktop rail: a phone's row of tabs can't be reordered.

## Session details

**Session Details** is about the conversation you're in — the active tab, the one the composer acts on — and reads *No active session* when there's none. Since **0.37.0** it has three parts, top to bottom.

**A summary card.** The title on a row of its own, up to two lines, or *Untitled conversation*; under it the agent and the conversation's status; then **Model**, **Git Branch**, **Session ID** and **Extension ID**, plus **Parent Session** on a sub-agent's conversation and **Assistant** on one an [assistant](/guide/assistants) ran. The model reads the way the agent's own picker names it. The branch is the one **recorded on the conversation** — detected when Codeg created it, or whatever an imported transcript recorded — not the branch checked out now. **Session ID** is Codeg's own number for the conversation and **Extension ID** is the agent's session id, a long one cut short with its last eight characters kept and the whole id in the tooltip. Those two are the copyable fields: hover or focus the row for the button.

### Agent Plan {#agent-plan}

When the agent keeps a plan, **Agent Plan** draws it as a bar with one segment per step — green done, blue under way, grey not started — beside a `done/total` count, then lists the steps: done ones struck through, the one under way in blue, each step's full text, status and priority in its tooltip. Fold the section and it **keeps the bar and the step under way** while hiding the rest, so the panel stays short without losing where the agent is. It shows the plan of the reply that's running, and otherwise the latest plan in the conversation; with no plan at all, the section isn't there. The plan card inside the reply itself is unchanged.

### Message navigation {#message-navigation}

**Message navigation** lists every message you sent — numbered, one line of each — and, on a closed row, how many **sub-agents** and **files** its round involved. It covers the **whole conversation**, including history that hasn't loaded yet; *Loading earlier messages…* shows at the top while it fetches.

- **It follows your reading.** The message at the top of the transcript's view is highlighted in the list. When that row scrolls out of the panel, a **Current message #n** pill appears, with an arrow pointing to it; click the pill to bring the row back into view.
- **Click a message to go there, and to open it.** The transcript jumps to it — loading it first if it isn't loaded yet — and the row unfolds into the round's **sub-agents** and the **files it changed**. A sub-agent shows as a card with its agent or assistant, its status badge and its task, and opens that sub-agent's conversation in the stacked viewer. A file shows with its `+`/`−` counts: click the row to read its diff right there, inline or side by side, click its name to open the file, or **View Diff** to open the whole diff in a file tab. One message is open at a time — the latest, until you pick another — and **Collapse** closes it.

Both sections fold from their headers. Whether each is open, and whether the panel's diffs read inline (the default) or side by side, are remembered across windows — that diff choice is the panel's own, apart from the toggle on the other [diff previews](#work-with-files-—-editor-diffs-and-previews).

**What moved here.** Until **0.37.0** the plan, the message navigator and a *Sub-agents* chip floated in the transcript's top-left corner; that corner is empty now. A [canvas](/guide/canvas) card and the read-only viewers — a sub-agent's conversation, a to-do's transcript — have no side panel beside them, so they still show the *Plan* and *Sub-agents* chips, without a navigator.

::: tip Token usage and timestamps are in the dialog
Since 0.37.0 the tab no longer shows token usage, the duration, or the created and updated times. The **Session Details dialog** still does: open it from the conversation header's **⋮** menu, by right-clicking the conversation, or by right-clicking its row in the sidebar. It carries the same identifiers, then **Token Usage** — total, input, output, cache write and read, how much of the context window is used, and the duration — and the **Created** and **Updated** times.
:::

## Work with files — editor, diffs, and previews

The **Files** tab is your project tree, rooted at the workspace; click any file to open it in the center file pane. **Drag** an entry to rearrange the project or feed the agent: drop a file or folder onto another folder (or the workspace root) to **move it on disk**, or drop it into the composer to **attach it** as a file reference for your next message — the drop target decides which, with no modifier keys. The tree also takes the keyboard: **↑/↓** move, **→** opens a folder or steps into it, **←** closes it or jumps to the parent, **Home/End** go to the ends, and **Enter** opens a file or toggles a folder. Every row carries a **⋯** button opening the same menu right-click and long-press do — a visible way in on a touch screen, where a row is also draggable and a long press can be ambiguous.

- **Copy — the path, or the file.** A row's context menu carries a **Copy** submenu: **Relative path** (what a prompt or a `git` command wants), **Absolute path** (what another app wants), and **File** — or **Folder** on a directory — which puts the entry **itself** on the system clipboard, so pasting in Finder or Explorer writes a real copy of it. New in **0.31.2**, and available on file rows, folder rows and the workspace root alike. The third row is desktop-only: in the browser, and in a desktop window attached to a remote workspace, the files live on another machine and the copy would land on *that* machine's clipboard, so it isn't offered.
- **Editing.** Files open in a full editor. There's **no Save button** — Codeg saves on **⌘/Ctrl+S**, when the editor loses focus, and automatically a few seconds after you stop typing; an unsaved file shows a **`*`** in its tab. Send a file, or just a selection, to the agent with **⌘L**.
- **Diffs.** The agent's edits open as **read-only diffs** — side by side (**HEAD ↔ Working Tree**) or as an inline unified diff, one file at a time, with change counts and prev/next navigation. Diffs are for *review*; you commit from the git panel (below), not by accepting individual lines.
- **The smaller diff cards read side by side too.** The compact previews — a diff inside a reply, the one a permission prompt shows you before you approve an edit, a [to-do](/guide/tasks)'s changed files, and a **View Diff** opened as its own tab — gained an **inline ⇄ side-by-side** toggle in their top-right corner in **0.28.2**. **Inline stays the default**, and the choice is remembered and shared: set it on one and every other preview follows. A file that is purely *new* stays single-column, having no old side to show.
- **Live previews** open in the same pane: **Office** documents (`.docx`, `.xlsx`, `.pptx`) render and refresh as the agent edits them; **Markdown** and **HTML** get a **Preview ⇄ Edit Source** toggle (HTML runs scripts only if you opt in); images zoom and pan. → [Office Documents](/guide/office)
- **PDFs get a viewer of their own** since **0.35.2** — in a file tab, in the side panel that opens files beside a to-do's or a canvas card's transcript, and on a [canvas](/guide/canvas) file card. Its toolbar zooms in and out — **⌘/Ctrl+wheel** and a pinch do too — fits to width, jumps to a page, and finds text with a match count, **⌘/Ctrl+F** with focus in the viewer. The text is selectable, a link opens the way any link in the app does, and a password-protected file asks for its password. A PDF is read-only, up to 100 MB, and one inside a workspace folder that changes on disk reloads in place, keeping your page and zoom; a PDF opened from outside every folder isn't watched, so reopen it to see a newer version.
- **Download from the header.** In a browser, and in a desktop window attached to a remote workspace, a file tab's header has a **Download file** button beside its **⋮** since **0.35.2** — for a file outside your workspace folders too, such as an agent's output in `/tmp`. A browser saves it through its own downloads; a remote-workspace window asks where.

::: tip Merge conflicts get their own editor
Resolving a conflict opens a three-pane merge editor — **Local**, **Result**, **Remote** — where you *can* accept changes hunk by hunk. It's the one place with per-hunk controls; everywhere else, diffs stay read-only.
:::

## Review and commit

Two tabs put version control a glance away:

- **Changes** lists your working-tree edits — tracked and untracked, with per-file line counts. From here you can open a file's diff, discard an edit (**Rollback**), or start a commit.
- **Commits** is your whole history, as a timeline that loads more as you scroll. Two filter pills narrow it — **Branch** and **Author** — and Codeg remembers both per project. Click a commit to expand it: the full message, the files it touched with their `+`/`−` counts (click one for its diff), and which branches contain it. Right-click for **View Diff**, **New branch…**, **Reset to Here**, or **Push…**

The Branch pill starts on **HEAD** — the branch you're on, named beside it — which re-resolves on every query, so the history follows you through each checkout and keeps working even on a detached HEAD. Naming a branch pins the view to that one, and clearing the pill with its ✕ shows **every branch** at once; whichever you choose is kept for that folder. Before **0.32.3** the tab opened on every branch.

The Changes tab commits directly: type a message in its toolbar and press Enter for a quick commit of the tracked files, or open the full **Commit** window to tick exactly what you want, write a message, and choose **Commit** or **Commit and Push**. Its menu also holds pull, fetch, push, stash and unstash. Branch switching, merging and worktrees are the [branch chip's](/guide/git#branch-merge-and-rebase) job.

Parallel development with worktrees, remote accounts, and the full git workflow have their own page. → [Git & Worktrees](/guide/git)

## The project's automations, to-dos, issues and pull requests

Since **0.37.0** the last four tabs bring full-page views into the panel for **the project of the conversation you're in** — its folder, or, for a [worktree](/guide/git#work-in-parallel-with-worktrees), the repository it belongs to, even when that repository is closed in the sidebar. Each carries **Open full page** at the right of its header, which opens the full view already narrowed to that project — for Issues and Pull requests, as long as the project's own folder is open in the sidebar; the full Repository panel can only show an open project, so for a worktree whose repository is closed it opens on another open project if there is one, and otherwise asks you to *Pick a project folder*. When there's no project to go by, they say *No folder open*.

- **Automations** lists the project's [automations](/guide/automations) — those on its root and on its worktrees — with when each runs next, or last ran. A row's **⋯** runs it now, enables or disables it, or deletes it. Click a row for its detail in place — schedule and target, prompt, and run history, whose runs open their conversations — and **Back** for the list. Writing one happens on the full page: **New automation** opens its template gallery with this project preselected, and **Edit** opens the editor there.
- **To-dos** is the project's [board](/guide/tasks) as four stacked sections — **Needs you**, **In progress**, **To do**, and **Done**, which starts folded — with a search box, and **New task**, which opens the task editor right there. The cards are the board's own, with every action and dialog they have there: start, merge, follow up, [Handle later](/guide/tasks#set-it-aside-for-later), view the session. Dragging between columns, the list view, the folder picker and task settings stay on the full page.
- **Issues** and **Pull requests** are the [Repository panel's](/guide/repository) list, locked to this project's `origin` remote and to one kind of item: search, the **Open** / **Closed** / **All** filter, **Assigned to me**, labels, and **New issue** on the Issues tab. A row opens the same detail panel the full page does, **Start** included, to hand the item to an agent. Switching folders, switching between issues and pull requests, page sizes and the panel's settings — auto-processing among them — stay on the full page. A folder without a forge remote Codeg recognizes, or without an account for its host, says so in the tab, with **Add an account** where that's the fix. Neither tab asks the forge for anything while it's hidden.

## Next steps

- [**Conversations**](/guide/conversations) — the composer and the transcript the panel sits beside.
- [**Git & Worktrees**](/guide/git) — the full git workflow behind the Changes and Commits tabs.
- [**To-dos**](/guide/tasks), [**Automations**](/guide/automations) and the [**Repository Panel**](/guide/repository) — the full pages behind the project tabs.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — the delegations whose sub-agents Message navigation lists.
