---
title: Infinite Canvas
description: Infinite boards that lay your work out in space — as many canvases as you like, each with regions for folders and agents, cards that expand into real working conversations, files and terminals pinned where you need them, and sticky notes for the thinking in between.
---

# Infinite Canvas

The tab strip is a good way to hold one conversation and a poor way to hold twelve. **Infinite Canvas** is the other answer: boards with no edges where your work is laid out *in space* — a region per folder, a region per agent, cards you can pin anywhere — and where a card **expands into a real conversation** you can type into. Several agents run side by side on one board instead of one tab at a time, with the files you're reading and the terminals you're running beside them.

It arrived in **0.30.0** as *Infinite Conversations*, a single board. Since **0.32.4** it's **Infinite Canvas**, and it holds **as many canvases as you like** — one per project, per feature, per review — each its own board. The route is a full page like To-dos and the Repository panel, and like them it can be switched off if it isn't how you work.

::: tip Mostly a view of your work, not a copy of it
A conversation card *is* one of your conversations, a folder region *is* one of your folders, and a file card *is* the file — delete a conversation and its cards go with it, rename it and the card renames. What a canvas adds for those is **position**, plus the freedom to have one conversation sitting in three places at once, or on several canvases.

Three things on a canvas *are* its own: a **Collection**'s membership, a **sticky note**'s text, and a **terminal card**'s running shell. Those exist nowhere else, which is why deleting them is treated differently below.
:::

A canvas carries **root conversations only**. A sub-agent session — anything a delegation or a loop spawned — is sub-structure of the conversation that owns it rather than a peer to lay out, so it never becomes a card of its own. A card does show a badge counting the sub-agents underneath it. → [Multi-Agent Collaboration](/guide/multi-agent)

## Open it

**Infinite Canvas** is the last row in the left sidebar's navigation block, beneath the Repository panel, and it's in the status bar's [quick actions](/guide/workspace#the-layout) under *Navigation*. It opens on your [canvases](#your-canvases) — or straight back into the one you had open, if you've been in one since Codeg started. Clicking the row again while you're inside a canvas takes you back up to the list.

If you don't want the row, switch it off under the sidebar's [navigation items](/guide/workspace#choose-which-navigation-rows-you-see) — quick actions still reaches it.

## Your canvases

The route opens on **Canvases**: one card per canvas, most recently edited first. Each card shows

- a **thumbnail** of the board — its regions as outlines and its cards and notes as shapes, in their colours, so a canvas is recognisable before you open it;
- a strip in the canvas's **colour** across the top;
- its **name** — *Untitled canvas* until you give it one — and up to two lines of **description**;
- how many **items** it holds and when it was last **edited**, with the exact time on hover.

Click a card to open it. Its **⋯** button — or a right-click — offers **Open**, **Edit canvas…** and **Delete canvas…**. Once there's at least one canvas, a search box filters by name and description as you type, and **New canvas** sits beside it.

**New canvas** asks for a **name**, a **description** and a **colour**, all optional — a blank name reads *Untitled canvas* — and opens the new canvas the moment it's created. **Edit canvas…** is the same dialog for an existing one. Inside a canvas, the title bar reads *Infinite Canvas › name*: the first part takes you **back to all canvases**, and the name opens a menu with **Edit canvas…** and **Delete canvas…**.

::: warning Deleting a canvas deletes what's on it
**Delete canvas…** always asks, and says what it's about to remove: the canvas and **everything on it** — regions, cards, notes — with a count of the items, and how many **terminal cards** will be closed with their processes stopped. The conversations, folders and files it shows are **not** touched; they were only ever shown there. Another window that has that canvas open drops back to the list and says the canvas was deleted.
:::

If you used the single board before **0.32.4**, it's still there: everything on it moved onto a canvas named *Untitled canvas*. If the board was empty, the list simply starts empty.

## Fill it

A new canvas is empty, and offers the one-click way out: **Generate from current workspace** builds the whole thing from what you already have open — a region per folder, the conversations inside them, laid out for you. It's the fastest way to see what a canvas is *for*, and you can rearrange everything afterwards.

The deliberate way is **Add to canvas**, which places one thing at a time. Its first entry is **New conversation** — a blank card in the workspace's active folder, which becomes a real conversation on your first message. Below it, the eight things you can lay out:

| What you add | What it does |
| --- | --- |
| **Folder region** | Mirrors one open folder and shows every conversation in it, worktree children merged in |
| **Folder group region** | Mirrors a [sidebar folder group](/guide/workspace#group-your-folders) — every folder in the group, in one band |
| **Agent region** | Every conversation running on one agent, across folders |
| **Conversation card** | One conversation, pinned wherever you drop it. Searchable picker |
| **File card** | A file, read in place — see [below](#files-and-terminals-on-the-board) |
| **Terminal card** | A shell running in one of your folders — see [below](#files-and-terminals-on-the-board) |
| **Custom region** | A **Collection**: nothing automatic, just what you drag into it |
| **Sticky note card** | Text. For the reasoning that doesn't belong in anyone's transcript |

The first three are **bound** — they follow their folder, group or agent, so a new conversation appears in them by itself. A Collection is **yours**: it holds exactly what you put in it and nothing arrives uninvited.

## Files and terminals on the board {#files-and-terminals-on-the-board}

Since **0.30.5** a canvas holds more than conversations.

A **file card** is a file you want in view while the agents work — a spec, a plan, a log, a design. **Add to canvas → File card** lists the files already open in the workspace; type to search the active folder instead, or, in a local desktop window, **Browse…** for a file anywhere on this machine. The card renders the file the way the file pane does — Markdown and HTML with a **Preview** / **Source** toggle, images, Office documents, PDFs with their own toolbar since **0.35.2**, source code — because it's a view of that same file tab, not a copy; a PDF even keeps its page and zoom between the card and the tab. It's **read-only** on purpose: editing stays in the file column, where saving is. **Reload** re-reads it from disk, **Open in workspace** jumps to the tab, and a link inside a rendered Markdown file opens in the workspace rather than swapping out what the card shows. A file that has since gone stays on the board as a frame you can remove.

A **terminal card** is a shell in one of your folders — pick the folder from **Add to canvas → Terminal card**. It runs your default shell, survives you leaving the route, and is still running, with its recent output, when you come back: closing a view kills nothing. When its process exits, the last output stays on screen with a **Restart terminal** button over it, and the card keeps working after you close the folder it was made for. So a board can hold the `pnpm dev` for each repo of a feature, beside the conversations working on them.

Removing a terminal card — or a selection or a canvas with one in it — **asks first**, because the shell inside exists nowhere else. Quitting Codeg stops terminal cards along with every other terminal.

## Curate it by dragging

The board's whole editing model is drag-and-drop, and the two directions mean different things:

- **Drag a card out of a region** onto open board and it becomes a pinned card. Out of a **Collection** that's a **move**; out of a **bound** region it's a **copy**, because a folder region has no say in which conversations exist — removing the card wouldn't remove it from the folder.
- **Drag a card into a Collection** to collect it.

One conversation can sit in **any number** of regions at once, which is the point of the copy rule, and on any number of canvases. Select a card and its twins elsewhere on the same canvas light up too, so you can see where else it lives.

Beyond that: **rename** a region, **collapse** it, **resize** it, give anything a **colour** (regions, cards and notes alike; a card inside a region wears the region's colour), and set a region's member grid to a fixed number of **columns** or **rows** or leave it **Auto**. A region with more members than fit shows **+N more**, with **Show all conversations** / **Show fewer**. **Auto-arrange** packs the board back into order when it has sprawled, and **Export as PNG** takes a picture of it, named after the canvas — capped at 4096×4096, so a board spread far enough apart is cropped rather than shrunk indefinitely.

Marquee-select several things and the toolbar offers **Group into a region** — the fastest way to make a Collection, since you gather first and name it after.

::: warning Deleting a selection asks about what exists nowhere else
A conversation card is a *view*: remove it and the conversation is untouched. A **sticky note** is not — its text exists nowhere else — and neither is a **terminal card**'s shell. So a delete that includes notes **with something written in them**, or any terminal cards, confirms first and says how many, while a selection of pure cards, or of notes you never typed into, just goes.
:::

## A card is a real conversation

This is what separates the board from a map. **Expand** a pinned card and you get a working conversation: the transcript, the composer, the model picker, and the permission, question and plan dialogs — everything you need to actually run a turn without leaving the board. A **new conversation** card additionally offers the **agent** picker, since that's the one moment the choice is still open — and since **0.35.2** it stays open while the agent you picked is still connecting, so a wrong pick is one more click: the last agent you choose is the one that connects. An existing conversation keeps the agent it was started with, exactly as it does in a tab.

A few things live in the tab view and deliberately don't come along: the **message queue**, the [**mid-turn send**](/guide/workspace#talk-to-an-agent-mid-turn), and **export**. The board is for running several conversations side by side, not for replacing the single-conversation surface where those belong.

**A file link in a card opens beside it.** The workspace's file column is off screen while the board covers the page, so clicking a file badge, a Markdown link or **view diff** in a card's transcript opens a read-only viewer in a side panel next to the conversation, with **Open in workspace** one click away. For a plain file it's the same workspace file tab underneath — the panel is a view of it — so nothing is lost by reading it there. Before **0.30.3** those clicks opened a tab in a column you couldn't see, which looked like nothing happening at all. The [To-dos board](/guide/tasks) does the same, for the same reason, and since **0.32.2** a web page opened that way shows there too, instead of leaving the panel blank.

A card inside a region has to be **moved out to the canvas first** before it can expand — a full conversation surface is far bigger than a region's member grid slot, so it gets pinned before it grows.

::: tip Opening a canvas doesn't start every agent on it
The rule is about not **spawning** agents, not about refusing one that's already there. A card whose conversation is **dormant** draws its transcript straight away but doesn't connect until you first click it — otherwise walking onto a canvas with a dozen cards would bring up a dozen agent CLIs at once. A card whose agent is **already running** comes back live, because leaving it asleep would show you a disconnected card while its turn streams into it.

Once a card *is* live it holds on to its connection: panning it off the screen can't quietly unmount it into a disconnect. And a card for a conversation you already have open in a tab attaches as a **viewer** — the tab keeps the connection, the card watches.
:::

## Find your way around

A board is bigger than the window by design, so the bottom corner carries the navigation: **zoom in / out**, **reset zoom to 100%**, **fit view**, and a **map** of the whole board above them. The map can be hidden, and whether it's up is remembered per device, for every canvas at once.

Each canvas keeps **its own zoom and position**, remembered between visits on each device and separate from the app's [interface zoom](/reference/settings/appearance#window-zoom). That separation is deliberate: making the board bigger is the corner control's job, so a card's size doesn't shift under you when you scale the interface. The dock, the map and the menus are window chrome and do still follow the app's zoom.

A conversation that's currently running **pulses**, and a region counts how many of its members are running — so a glance at a collapsed region tells you whether anything in it is working. A card carrying sub-agents badges how many.

## Good to know

- **Canvases are stored with your data, not in the browser.** They're the same canvases in the desktop app and in a [server](/getting-started/deployment) sharing that data directory, and edits from one show up in the other. Where you were looking on each one is kept per device.
- **Closing a folder doesn't break its region.** A canvas resolves against every folder Codeg knows about, not just the ones currently open in the sidebar, so a region keeps working after you close its folder. *Folder unavailable* is for a folder that's genuinely gone — deleted or missing — and a deleted folder group leaves the same kind of tombstone.
- **A conversation that's gone reads as *Conversation removed*.** Remove the card when you see it; nothing else needs cleaning up. Deleting a conversation takes it off every canvas it was on.
- **The row can be hidden.** If the canvas isn't for you, switch **Infinite Canvas** off in the sidebar's navigation items.

## Next steps

- [**The Workspace**](/guide/workspace) — the tab-based surface this is an alternative to, and where folder groups are set up.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — the other way to have several agents working at once, where they talk to *each other* rather than to you.
- [**To-dos**](/guide/tasks) — for work you want run unattended and reviewed later, rather than watched side by side.
