---
title: Computer Use
description: The Computer Use settings screen — the switch that lets agents see and operate the desktop windows you share, the cua-driver it runs on, the macOS permissions for codeg-computer-helper, how long a share lasts, the never-share list, the stop shortcut and floating stop bar, and what agents may do beyond clicking.
---

# Computer Use

**Settings → Computer Use** is the control surface of [computer use](/guide/computer-use) — *"Let agents see and use the desktop windows you share with them."* (The page's own heading reads *Computer use*.) It's new in **0.33.0**, as a preview. This page lists every row on it; what sharing a window means, and how to stop, is in the guide.

The screen saves in two ways. The **switch** at the top applies the moment you flip it, and so do **Install** and **Uninstall** under *Driver*. Everything under **Sharing, input and stopping** waits for that section's **Save** button.

## Enable computer use

**Off** by default. *"Agents can list your apps and windows, read the windows you share, and click and type in the ones you let them act on. No window can be read until you share it from the status bar."*

It's the same setting as the **See and use your desktop's windows** row in [Collaboration → In-conversation tools](/reference/settings/collaboration#in-conversation-tools), and as that row in the status bar's codeg-mcp popover — three views of one switch. Turning it on gives the tools to agents **started afterwards**. Turning it off acts at once: every share ends, the helper stops, and a call already on its way is refused.

## Driver

*Desktop app, or a server started with `CODEG_COMPUTER_USE`.* One row, **cua-driver**, showing its state — *Not installed*, *Downloading…*, *Installed · 0.36.0*, or an older release installed while this Codeg runs another — *0.32.0 is installed; this codeg runs 0.36.0* after the upgrade to 0.37.0 — and, once installed, the path it's kept at.

- **Install** fetches it now instead of on first use; **Upgrade to …** takes its place when only an older release is cached.
- **Uninstall** asks first, then switches computer use off and ends every share. Switching back on downloads the driver again.

Codeg runs exactly one release — **0.36.0** since **0.37.0**, 0.32.0 before — from the Cua project's GitHub releases, checked against a SHA-256 digest pinned in Codeg. There's no choosing another. → [The driver](/guide/computer-use#the-driver)

## Permissions

*macOS only — the desktop app, or a server on a Mac.* Two rows, **Accessibility** (*"Read windows' contents and act on them"*) and **Screen Recording** (*"Take screenshots and read window titles"*), each either **Granted** or offering a **Grant…** button. Both are for **`codeg-computer-helper`**, not for Codeg. With computer use off, the section only says to switch it on first.

- **Grant…** asks for that one permission. If macOS shows its own prompt, that's all; otherwise Codeg opens the right pane of System Settings. Both buttons wait while a request is pending.
- The section **updates by itself** when you come back to the window; **Refresh** re-checks on demand.
- While either is missing, a note says to turn on *codeg-computer-helper — not codeg*, and **Show in Finder** reveals the helper for when it isn't in System Settings' list.
- An **amber warning** appears if **Codeg itself** holds either permission: then an agent's shell could use it with nothing shared. → [Why a helper holds the permissions](/guide/computer-use#why-a-helper-holds-the-permissions-on-macos)

## Sharing, input and stopping

One **Save** covers everything in this section.

### Stop sharing unused windows after

**30 minutes** by default; also 10, 60 and 240 minutes, or **Never (until I stop it)**. A share ends when no agent has used the window — read it or acted on it — for that long. An app shared whole and the entire screen each run on a single clock.

### Apps that are never shared

The never-share list. Each entry shows its name and the identifiers it matches. The shipped entries are password managers and the system's settings and password prompts; your own are marked **Added by you**. Remove any entry, defaults included, with its ×; add one by **bundle ID** (`com.example.app`), **executable name** (`app.exe`) or **full path**. Typing the name of a default you removed puts that default back.

**Restore defaults** asks first, saying how many of your additions come off and how many removed defaults go back. Nothing changes until **Save** — and saving ends any share of an app you've just added. → [The never-share list](/guide/computer-use#the-never-share-list)

### Stop shortcut

*Desktop app only.* **⌃⌘Esc** on macOS, **Ctrl+Alt+Esc** on Windows and Linux. From any app it does what **Stop sharing** does. Click the keys to record new ones — a letter, a digit, F1–F12, Esc or a punctuation key, held with at least two modifiers, one of them Ctrl (or ⌘ on a Mac), and never the Windows key — or use **Default** or **Turn off**.

The line under it says where it stands: *Active*; *Takes effect while computer use is switched on*; *Off*, in which case only the buttons stop sharing; or **Not active** — another app probably holds those keys, so choose others. Codeg holds the keys only while computer use is on.

### Floating stop bar

*Desktop app only.* **On** by default. While anything is shared, a small bar floats above every window saying what agents may do, with a **Stop sharing** button. With it off, the status-bar popover and the shortcut still stop sharing.

### Let agents bring windows to the front

*Desktop app, or a server offering computer use.* **On** by default. Some apps take no keys or typing while they're in the background — on Windows, anything built on Chromium, such as Edge, Chrome and VS Code — so an agent may raise a window it's allowed to act on for one action, then switch back to the window you were in (on Linux it stays in front). You'll see it happen, and a keystroke of yours at that moment may land in it.

### Default input mode

**Background** (the default) or **Foreground**: how an agent's clicks, scrolling, typing and keys reach a window when it doesn't ask for either. Background leaves the window where it is and your pointer and keyboard to you; Foreground brings the window up for every action. It's locked to Background while the switch above is off, and your choice is kept for when it's back on.

### Let agents open applications and move windows

**Off** by default. One switch for two tools: start an installed app in the background — never Codeg, nor an app on the never-share list — and move or resize a window shared for acting. Starting an app shares none of its windows.

### Let agents use the clipboard

**Off** by default. With it on, an agent may put text on the clipboard to paste it, and read back what *it* copied out of a window you shared. What you copied yourself is never read for an agent. Pasting with ⌘V or Ctrl+V needs no switch, but only ever pastes what the agent put there itself.

### Offer the entire screen

**Off** by default, and offered on macOS and Windows only — the row isn't there on Linux. With it on, the share picker offers the **entire screen**: one picture of all of it, a click anywhere, every window that can be shared and the desktop's own shortcuts, with Codeg's windows and the never-share list painted over. Turning it off ends a screen share.

## Good to know

- **Two kinds of save.** The switch and the driver buttons act at once; the section below them has its own **Save**.
- **Rows come and go with where it runs.** The driver, the permissions, and the rows about how agents act and what else they may do appear only where computer use is actually served — the desktop app, or a `codeg-server` started with `CODEG_COMPUTER_USE`. The shortcut and the floating bar are the desktop app's alone. Anywhere else the page shows only the switch, the idle timeout and the never-share list. On a server without that variable there's no desktop behind them; in a browser on the desktop app's own Web Service they're still the desktop's settings, and the rest is managed from the desktop app itself. → [On a server](/guide/computer-use#on-a-server)
- **What these settings bound.** On macOS the permissions belong to a helper only Codeg can use, so agents' shells can't reach them. Windows and Linux have no such separation: there, these settings decide what agents get *through Codeg*, not what programs on your computer can do.
- **There's no activity log here.** What agents did is in the status-bar popover's **Recent activity**, kept in memory for the session.

## Related

- [Computer Use](/guide/computer-use) — sharing, watching and stopping, end to end.
- [Collaboration](/reference/settings/collaboration#in-conversation-tools) — the same switch, among the other in-conversation tools.
- [Browser Use](/reference/settings/browser) — the built-in browser's own screen.
- [Privacy & Security](/reference/privacy#computer-use) — what an agent can and can't reach.
- [Reference overview](/reference/) — the full 17-screen Settings map.
