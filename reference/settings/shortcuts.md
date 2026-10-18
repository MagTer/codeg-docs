---
title: Shortcuts
description: The Shortcuts settings screen — the full catalog of Codeg's keyboard shortcuts, their defaults, and how to rebind them by recording a new key combination.
---

# Shortcuts

**Settings → Shortcuts** lists every keyboard shortcut Codeg responds to, and lets you rebind any of them. Each row is one action — its name, a short description, and a button showing its current binding. Change one by *recording* a new combination; reset the whole set with one button.

::: tip Notation
Below, **⌘** stands for the primary modifier: **Command** on macOS, **Ctrl** on Windows and Linux (Codeg shows whichever your OS uses). **⇧** is Shift, and **⌥** is Option / Alt.
:::

## Rebinding a shortcut

Click a row's shortcut button — it switches to **Press shortcut…** — then press the combination you want. A few rules the recorder enforces:

- **A modifier is required.** Most actions need **Ctrl/Cmd or Alt** (optionally with Shift); a bare letter won't register. The two composer actions — *Send Message* and *Newline in Message* — are the exception, and accept a plain key like <kbd>Enter</kbd>.
- **Conflicts are refused.** If the combination already belongs to another action, Codeg rejects it and tells you which action holds it — so you can't silently shadow an existing binding.
- **Esc cancels** the recording without changing anything.

**Reset defaults** (top-right) restores every shortcut at once; it's disabled when nothing has been changed.

## The default shortcuts

### Panels & layout

| Action | Shortcut | What it does |
| ------ | -------- | ------------ |
| **Open Search** | ⌘K | Show or hide the conversation search panel |
| **Toggle Left Sidebar** | ⌘B | Show or hide the conversation-list sidebar |
| **Toggle Terminal** | ⌘J | Show or hide the bottom terminal panel |
| **Toggle Right Panel** | ⌘E | Show or hide the auxiliary info panel |

### Tabs, windows & navigation

| Action | Shortcut | What it does |
| ------ | -------- | ------------ |
| **New Conversation** | ⌘T | Create a new conversation tab in the current folder |
| **New Terminal** | ⌘T | Create a new terminal tab (when focus is on the terminal) |
| **Open Folder** | ⌘O | Open the folder picker in a new window |
| **Open Settings** | ⌘, | Open the Settings window |
| **Close Current Tab** | ⌘W | Close the current conversation or file tab |
| **Close Current Terminal** | ⌘W | Close the current terminal tab (when focus is on the terminal) |
| **Close All File Tabs** | ⌘⇧W | Close all open file tabs (when the file pane is active) |
| **Next Tab** | ⌘Tab | Switch to the next conversation or file tab |
| **Previous Tab** | ⌘⇧Tab | Switch to the previous conversation or file tab |
| **Jump to tab 1–9** | ⌘1 … ⌘9 | Go straight to that tab by position |
| **Reopen Closed Tab** | ⌘⇧T | Bring back the tab you just closed |

### Composer

| Action | Shortcut | What it does |
| ------ | -------- | ------------ |
| **Send Message** | Enter | Send the current message in the input box |
| **Newline in Message** | ⇧Enter | Insert a newline in the message input box |

### Appearance

| Action | Shortcut | What it does |
| ------ | -------- | ------------ |
| **Suspend/resume custom style** | ⌘⌥⇧S | Turn all [custom colors and CSS](/reference/settings/appearance#custom-style) off, and back on |
| **Zoom In** | ⌘= | Step the [window zoom](/reference/settings/appearance#window-zoom) up one rung |
| **Zoom Out** | ⌘− | Step it down one rung |
| **Reset Zoom** | ⌘0 | Back to 100% |

The three zoom keys move through the same discrete rungs the Appearance screen offers, and stop at either end rather than wrapping. **⌘=** is the unshifted key US keyboards send for *Ctrl/Cmd +*, so **⌘⇧+** and the numpad `+` work as well. Inside the **terminal**, the Ctrl forms are declined on Windows and Linux — `Ctrl+−` and `Ctrl+=` belong to whatever's running in there — while macOS keeps zooming, Cmd having no shell meaning.

## Good to know

- **A new default steps aside for a binding you already made.** These three arrived in **0.28.2**, and if your saved profile had bound ⌘0 to something of your own, that binding keeps the chord and *Reset Zoom* arrives **unassigned** — bind it by hand from this screen. Before that fix, a default added after your profile was written landed on top of your binding and fired both actions at once, with nothing on screen to say so. The check compares the chords as written, so the rare case it can't see is a **layout collision**: on AZERTY, `Ctrl+−` is also the `6` key's position, so a binding you'd made on `⌘6` can still fire alongside *Zoom Out*. If two things happen on one press, rebind one of them.
- **Reopen won't resurrect something you deleted.** ⌘⇧T brings back a tab you *closed*; a conversation you **deleted** is retracted from the reopen stack, so the shortcut can't undo a deletion by the back door.
- **Some bindings are shared on purpose.** ⌘T and ⌘W each drive two actions — a *terminal* one and a *conversation/file-tab* one — and Codeg picks the right one from what's focused. That's why the default set has apparent duplicates the conflict check still allows: **⌘T** opens a new terminal when the terminal is focused, otherwise a new conversation; **⌘W** closes the focused terminal or the current tab.
- **Only the composer keys can be modifier-free.** *Send Message* and *Newline in Message* are the two actions you can bind to a plain key — swap them (say, <kbd>⇧Enter</kbd> to send, <kbd>Enter</kbd> for a newline) if you prefer.
- **The custom-style shortcut is an escape hatch, and is built like one.** Custom CSS can leave you with an interface you can't click, so this binding is deliberately a three-modifier combination that collides with nothing, and Codeg listens for it ahead of everything else — it still fires when the rest of the UI has been styled into uselessness. Rebind it if you like, but keep it something you can reach blind.
- **Two keys aren't listed here, because they're fixed.** **Tab** in an empty message box fills in the prompt Claude Code [suggests](/guide/conversations#let-claude-code-suggest-the-next-prompt) — ahead of any binding, so it wins even if you've bound *Send Message* to Tab — and **Alt+↑ / Alt+↓** move a focused tab up or down the [side panel's](/guide/side-panel#the-tab-rail) rail. Neither can be rebound.
- **Shortcuts are saved on the device.** They live in the app's local storage, per device — not part of a synced profile. Set them once on each machine, the same as [Appearance](/reference/settings/appearance).

## Related

- [The Workspace](/guide/workspace) — the sidebar, terminal, and panels these shortcuts toggle.
- [Reference overview](/reference/) — the full 17-screen Settings map.
