---
title: Office Documents
description: Turn any agent into a document author — create and edit real .docx, .xlsx, and .pptx files with the bundled OfficeCLI, then watch them build in a live in-tab preview that refreshes as the agent works.
---

# Office Documents

Codeg can turn any of its agents into a document author — one that produces **real** `.docx`, `.xlsx`, and `.pptx` files, not Markdown that exports to them. You describe what you want in plain language, the agent builds the file in your folder, and you open it in a workspace tab for a **live preview** that refreshes on its own as the agent keeps editing.

The whole thing rides on a document engine called **OfficeCLI** and a matching set of [skills](/guide/skills). Once you've installed the engine and enabled a few skills, using it is just a conversation.

## Set up OfficeCLI

The office skills are a curated [skill pack](/guide/skills#enable-a-curated-skill-pack), so they live under **Settings → Skill Packs → Office Tools**. Unlike the other packs, they depend on an external binary — **OfficeCLI** (the open-source [iOfficeAI/OfficeCLI](https://github.com/iOfficeAI/OfficeCLI)) — that Codeg installs and drives for you. Three steps, all on that one screen:

1. **Install** — one click. Codeg runs OfficeCLI's official installer and streams the log so you can watch it land (`~/.local/bin/officecli` on macOS/Linux, `%LOCALAPPDATA%\OfficeCLI` on Windows). The detection line then reads **Installed**, **Not installed**, or **Installed but not runnable**.
2. **Sync Skills** — pulls OfficeCLI's document skills into Codeg's shared skill store, so they become enableable.
3. **Enable them per agent** — tick the skills you want for the agents you want, in the same skill-and-agent matrix the other packs use. → [Enable a skill pack](/guide/skills#enable-a-curated-skill-pack)

::: tip It's ready the moment it's installed
Right after a fresh install, `officecli` may not be on your shell's `PATH` yet — so Codeg makes sure the agents it launches can find the binary anyway, and stops once the system `PATH` catches up. You don't have to restart anything.
:::

## The document skills

Syncing loads nine skills across three families. Each has its own `/`-invocation and knows the conventions of the document type it builds:

| Family | Skill | Good for |
| ------ | ----- | -------- |
| **Presentations** | **Presentation** | Board reviews, sales decks, all-hands |
| | **Pitch Deck** | Fundraising decks — Seed, Series A–C, SAFE, convertible |
| | **Morph Animation PPT** | Cinematic Morph-transition presentations |
| | **3D Morph PPT** | 3D Morph with GLB models and camera moves |
| **Documents** | **Word Document** | Reports, letters, memos, proposals |
| | **Academic Paper** | Journal/thesis with citations, equations, cross-refs |
| **Spreadsheets** | **Excel Workbook** | Formulas, pivots, trackers |
| | **Financial Model** | 3-statement, DCF, LBO, scenarios, projections |
| | **Data Dashboard** | CSV/tabular data → KPI/analytics dashboards |

You only enable the ones you'll use — a spreadsheet agent doesn't need the pitch-deck skill.

## Create a document

With a skill enabled for your agent, there are two ways in:

- **From the welcome screen.** A fresh conversation offers quick-action cards — **Excel**, **Word**, and **PowerPoint** are promoted up front, with the rest (pitch deck, morph, academic, financial, dashboard) in the composer's **+** menu. Clicking one drops the right skill in and seeds a starter prompt.
- **By hand.** Type `/` and pick the skill — say `/officecli-pptx` — then describe the deck. *(Codex uses `$`.)*

Then just talk to the agent the way you'd brief a colleague:

```text
/officecli-pptx Build a 10-slide Q3 board review from the numbers in
metrics.csv — revenue, churn, and headcount, one chart per slide, and
a summary slide at the end.
```

The agent calls OfficeCLI to author the file directly in your working folder. Ask for changes in follow-up messages — "make slide 4 a table," "tighten the summary" — and it edits the same file in place.

## Watch it build — live preview

Open the produced `.docx`, `.xlsx`, or `.pptx` in a workspace file tab and Codeg renders it right there — no export step, no external Office app, no leaving Codeg. The three formats all preview in-tab.

The preview is **live**: as the agent keeps editing the file, it refreshes on its own. Under the hood Codeg runs an `officecli watch` server for the file and points the tab's preview at it, so the rendered document and the agent's edits never fight over the file on disk — you just watch the deck fill in slide by slide.

Since **0.35.2** a file tab's preview **stays live while you look elsewhere**. Switch to another tab and back, and the document is as you left it, scrolled where you were, instead of starting over and reloading. That costs something: every Office tab you've shown keeps its `officecli` process running until you **close the tab** — around 65 MB for a one-paragraph document, more for a real one — and Codeg runs at most 32 at once. Close the documents you're done with.

A large document, or a busy machine, can take a while before its first preview appears, because OfficeCLI renders the whole file before it answers. Codeg now waits up to **two minutes** for that, where it used to give up after eight seconds — and quitting Codeg while a preview is still starting no longer locks that file out of previews for the next five minutes.

You usually don't have to open it at all. **Auto-open preview** — the switch at the top of **Settings → Skill Packs → Office Tools**, **on by default** — opens the live preview by itself the first time an agent creates or edits a Word, Excel or PowerPoint file, so the document appears as it's written rather than after you go looking for it.

It opens a document **once**. A preview you close stays closed: since **0.31.2** a tab you opened by hand counts as having seen the file, so closing it doesn't hand the next edit a reason to reopen it — and a document that's been **deleted** isn't reopened either, which used to happen when the agent's own cleanup was the last thing the watcher reported.

## Good to know

- **The files are real and yours.** They're standard Office documents in your folder — open them in Word, Excel, or PowerPoint, email them, commit them. Nothing about them is Codeg-specific.
- **On a server, install OfficeCLI on the server host.** The Office tab installs it there just the same, and the preview is streamed back to your browser through the server. If a preview reports OfficeCLI missing, the screen shows the exact one-line install command to run on that host.
- **A desktop window bound to a remote server can't show the preview inline** — for that setup, open the file in the server's own web UI instead (the preview panel says so when it applies).
- **Minimal Linux images may be missing a system library** OfficeCLI needs (for example ICU/`libicu` on slim server images). If the engine won't start, the detection line and the preview surface an actionable hint naming what to add.
- **Manage it from the same place.** The Office tab also **uninstalls** OfficeCLI and re-syncs skills when a new version ships.

## Next steps

- [**Skills**](/guide/skills) — how enabling a pack per agent works, and how to write your own skills.
- [**Scientific Research**](/guide/research) — the other curated domain pack, from hypothesis to write-up.
- [**The Workspace**](/guide/workspace) — the file tabs and preview surface these documents open in.
- [**Working with Agents**](/guide/agents) — pick and sign in the agent that will do the authoring.
