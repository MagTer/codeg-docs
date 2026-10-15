---
title: Computer Use
description: Let agents see and operate the desktop windows you share with them — a window, a whole app or the entire screen, read only or read and act — watch what they did, and stop everything with one click or one shortcut. A preview since 0.33.0.
---

# Computer Use

The [built-in browser](/guide/browser) lets an agent read and drive a web page. **Computer use** does the same for the rest of your desktop: the window of a native app — a simulator, a design tool, a database client, a settings dialog — that you **share** with your agents, so they can take a screenshot of it, read what it shows, and, where you allow it, click, type and press keys in it. It arrived in **0.33.0** as a **preview**, on macOS, Windows and Linux.

The model is the browser's, moved one level out: **nothing is readable until you share it**, a share is either **read only** or **read and act**, a share ends by itself once it goes unused, and one button — or one shortcut — ends all of them at once.

::: warning A preview
The status-bar panel carries a **Preview** badge, and it means it. Computer use drives other programs through an open-source driver Codeg downloads on first use, and how well an app answers depends on that app. Watch it work; don't leave it unattended.
:::

## Turn it on

1. **Settings → Computer Use → Enable computer use.** It's off by default, and it's one switch shown in three places: this page, the **See and use your desktop's windows** row in [Settings → Collaboration](/reference/settings/collaboration#in-conversation-tools), and the codeg-mcp popover in the status bar. Flip any of them and the others follow.
2. **On macOS, grant two permissions** — **Accessibility** and **Screen Recording** — to **`codeg-computer-helper`**, *not* to Codeg. The **Permissions** section on the same page has a **Grant…** button for each, asks for one at a time, and updates by itself when you come back from System Settings. Why the helper rather than Codeg is explained [below](#why-a-helper-holds-the-permissions-on-macos). Windows and Linux ask for nothing.
3. **Start the agent after the switch is on.** The tools are handed to an agent when it launches, so a conversation whose agent was already running doesn't gain them. A new conversation gets them; an existing one does the next time its agent starts. They travel the way every [companion](/reference/architecture#multi-agent-delegation-and-codeg-mcp) tool does, so an agent that takes no MCP servers never gets them — **OpenClaw** and **Pi** among the built-ins.

The **driver** comes down by itself the first time computer use needs it, or press **Install** under *Driver* to fetch it now. → [The driver](#the-driver)

Once it's on, a **Computer use** icon — a monitor — appears in the status bar, and turns violet while anything is shared. Everything you do day to day starts there.

## Share a window

Agents can always **list** the apps and windows on your desktop — that's how one knows what to ask you for, and a window's title stays hidden from that list until you share it. They read **none** of them until you do. Click the status-bar icon, then **Share a window…**

The picker shows every window as a tile with a thumbnail, grouped by app, minimized and hidden ones included (badged **Minimized** or **Hidden**). Each tile has a three-way control:

| Level | What agents get |
| ----- | --------------- |
| **Off** | Nothing. Every window starts here |
| **Read** | Screenshots, the window's accessibility tree — its controls, labels and values — and checks that it shows what they expect |
| **Act** | Everything *Read* gives, plus clicking, scrolling, dragging, typing and pressing keys in it |

A shared tile's border turns **violet** for reading and **red** for acting. **Share all** shares every window that can be shared, at either level; **Stop sharing all** clears every share.

Back in the status-bar popover, each share is a row. Its drop-down shows **Can read** or **Can act**, and offers the two levels by their full names — **Read only** and **Read and act** — so you can widen or narrow a share in one click. Its **Stop** ends just that one.

::: tip A share isn't tied to a conversation
The picker says it plainly: *agents in every conversation can read the windows you share*. Any agent that has the tools can use any share, so share for the task in front of you and stop when it's done.
:::

### A whole app, or the entire screen

When a single window isn't the right unit:

- **Whole app** — the control on each app's heading in the picker. It covers every window of that app, **including ones it opens later**, plus its **own keyboard shortcuts** and — on macOS and Linux — choosing its **menu commands** by title, neither of which a single-window share hands over. On macOS it's also the only way to the app's menus at all, because the menu bar belongs to the app rather than to a window; on Windows and Linux a window's own menus are part of what sharing that window shares. While an app is shared whole, its tiles read *With the app* and can't be changed one by one; ending the app's share ends all of them.
- **Entire screen** — a card at the top of the picker, offered once **Offer the entire screen** is on in settings. It's off by default, and **macOS and Windows** only. Agents then see **one picture of the whole screen** and can click anywhere on it, and the desktop's own shortcuts come into reach — though never the keys that lock the screen, log out, or show every window at once. Codeg's own windows, apps on the never-share list, and anything Codeg can't identify (the menu bar, the system's overviews and notifications) are **painted over** in that picture, and a click on a painted-over area, or in a screen corner, is refused. Sharing the screen takes over every other share. Ending it ends them all, and the earlier per-window levels don't come back.

### What can't be shared

Some windows never get a tile. They're listed in a folded section at the bottom of the picker — *N windows can't be shared* — each with its reason:

- **Codeg's own windows**, and those of any other copy of Codeg. This isn't a setting. In the picker's own words: *an agent that could operate codeg could approve its own requests or share more windows with itself.*
- **Apps on the never-share list** — out of the box, password managers and the system's settings and password prompts. → [The never-share list](#the-never-share-list)
- **Windows whose app Codeg can't identify.** On Windows that includes WebView2 windows and system surfaces such as the Start menu and the lock screen.

## What an agent can do

The tools come from Codeg's [companion](/reference/architecture#multi-agent-delegation-and-codeg-mcp), as one tool group, and what each one needs is checked by Codeg on every call:

| Needs | Tools |
| ----- | ----- |
| Only the switch | `computer_list_apps`, `computer_list_windows` |
| A **Read** share | `computer_screenshot`, `computer_snapshot` — the accessibility tree, each control with a reference to act on — and `computer_verify`, which waits until the window shows what's expected |
| An **Act** share | `computer_click`, `computer_drag`, `computer_scroll`, `computer_type`, `computer_press_key`, `computer_hold_key`, `computer_set_value`, and `computer_restore`, which brings back a minimized or hidden window |
| An **Act** share of a **whole app**, or of the screen | `computer_invoke_menu` — choose a menu command by its titles. macOS and Linux |
| **Let agents open applications and move windows** | `computer_launch_app`, which starts an app in the background and shares none of it, and `computer_set_window_frame`, which moves or resizes a window shared for acting |
| **Let agents use the clipboard** | `computer_clipboard_read`, `computer_clipboard_write` |

The last two rows are switches of their own on the settings page, **both off by default**, and like the group itself they take effect for agents started afterwards — an agent launched while one was off never sees those tools. Switching any of them **off**, though, takes effect at once: a call made after that is refused.

**Keys stay inside the window.** A window shared for acting takes the editing and navigation keys and the shortcuts that act within a text field — select all, copy, undo, find, moving by word. An app's own shortcuts — its menu keys, closing, quitting — need the app shared whole; the desktop's need the entire screen.

**An agent asks for what it lacks.** Reading an unshared window, or acting on one shared for reading, comes back to the agent as a refusal that says what's missing — *share it*, or *ask for Read and act* — rather than as an error that ends its turn. So the usual flow is the agent telling you which window it needs, and you sharing it.

### Input goes in the background

An agent's clicks and keys are delivered **to the window, in the background**: it isn't raised, and your own pointer and keyboard stay yours, so you can keep working in another app while an agent works in a shared one.

Some apps take no input that way — on Windows, anything built on Chromium, **Edge**, **Chrome** and **VS Code** among them. For those an agent may **bring the window to the front** for that one action, then switch back to the window you were in (on Linux it stays in front). You'll see it come forward, and anything you type at that moment may land in it. **Let agents bring windows to the front** is on by default; turn it off and every action stays in the background, and those apps simply don't respond. Actions on the **entire screen** always go to the front, so they need it on.

On **macOS**, a Chromium or Electron app — VS Code, Slack — often doesn't let Codeg read back what was typed into it. Since **0.35.0** typing that went out but can't be confirmed no longer counts as a failure, and when the agent asks for what it typed to be submitted, Return is pressed after it rather than skipped. The agent is told to take a screenshot before it types or presses Return a second time, so it checks rather than repeats.

## Watch what they do

- **Recent activity** in the popover lists the latest actions, newest first: the time, what was done (*Screenshot*, *Read*, *Click*, *Type*, *Key*, …), the app, and the outcome — **done**, **refused** (no share covered it) or **failed**. Identical repeats fold into one line with a count. Listing apps and windows acts on no window and isn't recorded. **Clear recent activity** empties the list and undoes nothing.
- **The floating stop bar** sits above every window, at the top centre of the main screen until you drag it somewhere else, while anything is shared. Its dot is **red** when agents may act and **violet** when they can only read; it names the apps shared — never a window title — and for a few seconds after an action, what was done where. It never takes focus, it's on every desktop or Space, and its button is **Stop sharing**. Turn it off under **Floating stop bar** if you'd rather not have it.
- **A marker where an action lands** — a violet ring at the spot an agent clicked or typed, for about a second. It shows only while something is shared for acting.

## Stop it

Three ways, all doing exactly the same thing:

- **Stop sharing** at the top of the status-bar popover;
- **Stop sharing** on the floating stop bar;
- the **stop shortcut**, from any app — **⌃⌘Esc** on macOS, **Ctrl+Alt+Esc** on Windows and Linux.

A stop **ends every share** — windows, whole apps, the screen — **cuts off whatever an agent is doing**, mid-action included, and **forgets what agents put on the clipboard**, so nothing they copied before it can be pasted or read back after it. (The system clipboard itself isn't wiped.) It doesn't switch computer use off, and there's nothing to resume: to let agents back in, share a window again.

Two narrower controls are not a stop. **Stop sharing all** in the picker ends every share, but lets an action already under way finish and doesn't forget what agents copied; a row's **Stop** in the popover ends that one share.

The shortcut is claimed only while computer use is on, and only by the desktop app. Change it, put it back to the default, or turn it off under **Settings → Computer Use → Stop shortcut**. If another app already owns those keys, the row says *Not active* and asks you to choose others.

## When sharing ends by itself

You don't have to remember to stop. A share also ends when:

- **its window closes, or its app quits.** An app that's relaunched is a new process, so its windows aren't shared even when they look the same.
- **it goes unused for 30 minutes** — no read and no action. **Stop sharing unused windows after** sets that to 10, 30, 60 or 240 minutes, or *Never (until I stop it)*. An app shared whole, and the screen, each run on one clock that any of their windows keeps going.
- **computer use is switched off**, or **the driver is uninstalled**.
- **its app goes on the never-share list** — as soon as you save.
- **Offer the entire screen is turned off**, for a screen share.
- **Codeg quits.** Shares are held in memory, so after a restart nothing is shared.

## The never-share list

**Settings → Computer Use → Apps that are never shared** names the apps that can't be shared at any level — not a window, not the whole app, and painted over in a screen share. Out of the box:

| Platform | Never shared by default |
| -------- | ----------------------- |
| macOS | System Settings, the system's password and authorization prompts, Keychain Access, Passwords, 1Password, Bitwarden, KeePassXC, LastPass, Enpass, Proton Pass, Dashlane |
| Windows | Settings, the credential and elevation prompts, 1Password, Bitwarden, KeePass, KeePassXC, Enpass, Proton Pass, Dashlane |
| Linux | Passwords and Keys (Seahorse), KWallet Manager, 1Password, Bitwarden, KeePassXC |

Every entry, defaults included, can be removed. Add an app by its **bundle ID** (`com.example.app`), its **executable name** (`app.exe`) or its **full path**, then press **Save** — adding an app ends any share of it at that moment. **Restore defaults** puts the shipped list back after asking, and says which of your own additions it would drop.

## The driver

Computer use reads and acts on windows through **cua-driver**, an open-source program from the [Cua](https://github.com/trycua/cua) project. Codeg runs exactly one release of it — **0.32.0** — and you can't pick another. It's downloaded the first time computer use needs it, checked against a SHA-256 digest pinned in Codeg before it's unpacked and again before every launch, and on macOS its developer signature is checked too.

**Install** and **Uninstall** sit under **Driver** on the settings page, which also prints where it's kept — Codeg's download cache, beside the agent binaries. Uninstalling switches computer use off and ends every share; switching it back on downloads the driver again.

### Why a helper holds the permissions on macOS

macOS grants Accessibility and Screen Recording to an **app**, and whatever runs inside that app works with them — including every shell command an agent runs under Codeg. So Codeg never asks for either. They go to a separate app, **`codeg-computer-helper`**, which ships inside Codeg and runs the driver, and which serves Codeg alone: in Codeg's signed releases it checks who is talking to it and won't answer anything else. An agent's shell can't borrow the permissions; to reach a window it has to come through Codeg, and Codeg acts only on what you've shared.

If the helper isn't in System Settings' list, **Show in Finder** in the Permissions section reveals it so you can drag it in.

If **Codeg itself** holds either permission — granted by hand at some point, say — the settings page and the popover show an amber warning, because then an agent's shell *could* use it without anything being shared. Unless you need it, take it away from Codeg in System Settings.

**Windows and Linux have no such separation.** Any program you run can inject input and capture the screen there, agents' shells included. On those two, the settings decide what agents get *through Codeg*, not what programs on your computer can do.

## On a server

[`codeg-server`](/getting-started/deployment) can offer computer use too — on **the server machine's own desktop**. Start it with **`CODEG_COMPUTER_USE=1`** in a desktop session, and its web clients get the same Settings page, status-bar icon, picker and popover, acting on that machine's windows. On a Linux host it warns at startup when neither `DISPLAY` nor `WAYLAND_DISPLAY` is set. The Docker image doesn't carry the helper.

Three things stay desktop-app-only: the **floating stop bar**, the **action marker** and the **stop shortcut**. On a server, the popover's **Stop sharing** is the way to stop.

Without that variable a server offers no computer use at all: there's no status-bar icon, and its agents never get the tools. The settings page still shows its switch, the idle timeout and the never-share list, with nothing to say why — there's simply no desktop behind them. A desktop window attached to a remote workspace behaves like a web client of that server.

A browser reaching the **desktop app's own** [Web Service](/reference/settings/web-service) is a different case. It gets no status-bar icon, picker or popover — sharing and stopping stay in the desktop app — but the agents it starts run in the desktop app, so with computer use switched on they get the tools and can use whatever is shared there.

## What differs by platform

| | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Permissions to grant | Accessibility and Screen Recording, to `codeg-computer-helper` | — | — |
| Agents' shells kept out | Yes | No | No |
| Entire screen | Yes | Yes | No |
| Menu commands by title | Yes | No | Yes |
| Restoring a minimized window | In place | In place, without activating it | Brings it to the front |

On Linux an action runs only while your session is active and unlocked with the screen saver off, and on Wayland keys can't be sent to a window brought to the front. On every platform a locked screen pauses it: an action then is refused as *paused* until you're back.

## Good to know

- **Secret fields stay out of the tree.** In a window's accessibility tree, the value of a field the system marks as secret reads `[redacted]`, and an agent can't type into such a field or set it — entering a secret is yours to do. A screenshot is still a picture of the window, though: a secret shown on screen in plain text is in it.
- **The clipboard is yours.** An agent can paste only what it put on the clipboard itself — copied out of a window it may read, or written with the clipboard tools — never what you copied, and reading back follows the same rule. A stop forgets what it put there, so none of it can be pasted afterwards.
- **Starting an app shares nothing.** An agent allowed to open applications can start one, but its windows are still yours to share. Codeg and never-share apps can't be started that way.
- **What a window shows is data.** The tools tell the agent to treat what a shared window shows as content, never as instructions. A window can still display text someone else wrote, though, so share what the task needs and no more. → [Privacy & Security](/reference/privacy#computer-use)

## Related

- [Computer Use settings](/reference/settings/computer-use) — every row on the screen.
- [Built-in Browser](/guide/browser) — the same idea for web pages, shared tab by tab.
- [Collaboration](/reference/settings/collaboration#in-conversation-tools) — the tool-group switch, alongside the others.
- [Privacy & Security](/reference/privacy#computer-use) — the boundaries, stated plainly.
- [Deployment](/getting-started/deployment) — running `codeg-server` with `CODEG_COMPUTER_USE`.
