---
title: General
description: The General settings screen — the shell new terminals and agent command lines use, forced colour in command output, hardware-accelerated rendering, which tabs the @ mention panel shows, what the window's close button does, and desktop notifications, taskbar and Dock alerts, and notification sounds.
---

# General

**Settings → General** is the app-behaviour screen: which shell new terminals open, how command output is coloured, how the window is drawn and what its close button does, which tabs the composer's **@** panel offers, and how Codeg gets your attention when an agent wants you.

Everything here applies the moment you change it — rendering then asks for a restart, and a custom shell path waits for the **Save** button beside it.

::: info Two panels moved out in 0.31.2
**Multi-Agent Collaboration** and **In-conversation tools** used to sit at the bottom of this screen. They now have their own entry: **[Settings → Collaboration](/reference/settings/collaboration)**. The **Built-in browser** block, which was folded at the very bottom, became **[Settings → Browser Use](/reference/settings/browser)** — named *Browser* until **0.33.0**.
:::

## Default Terminal

Chooses the shell Codeg launches when you open a new terminal tab from the terminal bar or the file tree. The **Default shell** dropdown is built by probing your machine, so it lists what you actually have:

- **System default** — whatever your OS hands out.
- **Named shells** — on Windows, *PowerShell 7 (pwsh)*, *Windows PowerShell*, and *Command Prompt (cmd)*; a shell that isn't installed still appears, marked *not installed*.
- **Custom path** — type an absolute path (or a name resolvable on `PATH`), then **Save**. If the path doesn't exist on this host, Codeg warns you but still lets you save it.

Picking a named option saves immediately; a custom path waits for the Save button beside it.

Under the dropdown, **Currently using: …** names the program your choice actually resolves to — and since **0.31.2** it answers for *the selection*, not for the host's fallback. Before that it printed the same path (`C:\WINDOWS\system32\cmd.exe` on a typical Windows box) whichever row you picked, which reads exactly like a setting that does nothing. Now *Windows PowerShell* reads back as `…\v1.0\powershell.exe`, a shell the host can't find is echoed **verbatim** rather than quietly replaced by one you didn't choose, and the *not installed* badge on the row comes from the same probe — so the two can't disagree.

The terminal this shell feeds is the one in [the workspace](/guide/workspace). Since **0.25** it isn't only that terminal: when an **agent** asks Codeg to run a whole command line, that runs through this shell too. Left on *System default* nothing changes from before.

What it can't reach is an agent that carries a shell of its own: **Codex** and **Claude Code** run commands inside their own process and never ask Codeg to spawn one, so this picker has no say in what they use.

::: warning A non-POSIX shell may reject what agents write
Agents emit **POSIX syntax** — `&&`, `2>&1`, `$(…)`. Your interactive shell is your business, but naming one that doesn't read POSIX means an agent's command line can fail with a syntax error rather than doing anything. **fish**, **nushell** and **Windows PowerShell 5.1** are the ones this bites; PowerShell 7 and cmd are handled with their own calling conventions.
:::

## Colorize command output

Off by default. On, Codeg sets `CLICOLOR_FORCE=1` in the agent's environment, which forces ANSI colour out of the commands it runs — so their output renders **in colour in the transcript** instead of as plain text. Takes effect on sessions started afterwards.

It's opt-in for a reason worth knowing before you turn it on. Agents like Claude Code spawn their shell commands **inside their own process**, so the variable is inherited by everything downstream, and `CLICOLOR_FORCE` is by convention the one colour variable `NO_COLOR` cannot override. The output Codeg renders is the same output the agent parses: `gh … --json` emits ANSI inside the JSON, and piping that into `jq` fails. The agent also captures the escape sequences into its own context — tokens spent on colour nobody may be looking at.

A per-agent `CLICOLOR_FORCE` in an agent's own [environment variables](/guide/agents) still outranks this switch, either way.

## Disable hardware acceleration

A single switch, named for what it does rather than for the category it belongs to — turning it *on* is what turns acceleration *off*. Reach for it if the app shows a black screen or rendering glitches: certain AMD GPUs and Intel integrated graphics on Windows, and the proprietary NVIDIA driver on Linux. It changes how the underlying webview draws, so Codeg saves the choice and then asks you to **Restart now** for it to take hold — and since **0.30.3**, turning it back off takes effect on that restart too, instead of the setting being inherited by the new process and looking stuck.

The section appears in a **local Windows or Linux desktop window**, which is where there's a knob to turn: WebView2 and WebKitGTK each expose one the app can flip at startup. macOS's WKWebView exposes none, so no switch is shown there rather than one that would do nothing; a browser session has none either; and a desktop window **attached to a remote workspace** hides it too, since the webview it would redraw is the local one and the settings you're editing are the remote host's.

## Mention panel

New in **0.35.2**: which tabs the composer's **@** panel shows, and in what order — *"Choose which tabs the @ panel in the composer shows, and drag them into the order you want."* One row per tab, each with a drag handle and a switch:

| Tab | Default |
| --- | ------- |
| **Agents** | Shown, first |
| **Files** | Always shown — its switch is locked on |
| **Sessions** | Shown |
| **Commits** | Shown |

Drag a row by its handle, or focus the handle and use **↑** / **↓**. The panel opens on the **first tab in your order that has matches**, and **Tab** / **Shift+Tab** cycle through the shown tabs only. A hidden tab isn't just out of sight — its source isn't searched at all, so hiding **Sessions** and **Commits** also spares those lookups. **Reset**, greyed out while you're on the defaults, returns to the built-in order, and a tab added in a later release joins at the end, shown.

It applies to every composer with an **@** panel: a conversation's, the [to-do](/guide/tasks) editor and follow-up box, and the [automation](/guide/automations) editor. Skills and commands were never tabs here — they come from **/**, or **$** in Codex. Every change saves at once, reaches your other windows as you make it, and is kept per device.

## Close Button Behavior

What the main window's **✕** actually does, as a choice rather than a guess. Three values, added in **0.30.8**:

- **Ask every time** *(default)* — a dialog with a **remember my choice** box. Ticking it pins the answer, and this setting stays editable afterwards.
- **Minimize to tray** — the window hides and Codeg keeps running, which is what the app always did where a tray existed.
- **Exit codeg** — the close button quits.

The old behaviour was one hardcoded rule — hide to tray if there's a tray, exit otherwise — which left one group of users finding the app still running and another finding it gone, with no way to say which they meant.

**Tray capability wins over the preference.** On a system with no usable tray the close button always exits, whatever is stored, and the picker is visibly disabled with that reason — hiding the main window where nothing can restore it would strand the tray-less webviews, the [desktop pet](/reference/settings/appearance) among them. Local desktop windows only: a window attached to a remote workspace would be configuring a close button on someone else's machine, so the section isn't shown there.

## Desktop notifications

Codeg raises an **OS notification** when an agent wants you. It's one of three ways this screen can call you back, and the three sit together on purpose: a banner from the system, the window's own [taskbar button or Dock icon](#taskbar-and-dock-alerts), and a [sound](#notification-sounds).

**It's on by default**, unlike the sounds, and the asymmetry is deliberate: desktop notifications already worked before this screen existed, so the release that gave them switches couldn't be the release that silently stopped delivering them. Sounds were genuinely new, and a quiet install had to stay quiet. So the defaults here are the old behaviour written down — everything on, delivered only while the window is out of sight. The section starts folded either way; switching the master toggle on unfolds it, since that's a request to see what it does.

Four controls:

- **Permission** — whether this browser or machine will actually show them, said plainly rather than assumed. **Allowed**, **Blocked** (only the browser's own site settings can undo that — a page cannot ask again), **Not requested**, with an **Allow notifications** button, or **Unavailable**, which means the page isn't in a secure context: reach the server over HTTPS or on localhost. The desktop app is the honest special case — it posts through the system notification centre, which **doesn't report back** whether Codeg is allowed, so it says *Managed by the system* and offers **Send a test** and **Open system settings** instead of a status it would be guessing at.
- **Delivered as** — which app the system is filing these under. Normally Codeg; if its own identifier couldn't be claimed, the row names the app whose switches apply instead, and says that installing Codeg to your Applications folder restores its identity.
- **Notify when** — **Always**, **Window is not focused**, or **Window is not visible**. The last is the default and the strictest, and is what Codeg did before this setting existed. It's also the answer to *"I never get notifications"*: a window sitting open on a second monitor is **visible**, so *not visible* never fires for it. Pick *not focused* if that's you.
- **Hide notification contents** — replace the body with a generic line so agent output never reaches the notification centre, which keeps its payload outside the app after you've closed the conversation. The conversation's title is left out as well, and the notification is headed *folder - Codeg*, so you can still tell where to go back to.

**A notification names its conversation.** Since **0.32.3** its title is the conversation's own title, and the body starts with **that conversation's** folder rather than whichever one the window happens to have open — for a tab you closed while its agent was still working, and for a card on the canvas, too.

Then a switch per event, six of them: **Turn Complete**, **Permission Request**, **Agent Question**, **Agent Error**, **Background task** and **Work task**. Repeats of the same event within a few seconds collapse into one notification. A **plan approval** counts as a permission request, with no switch of its own: Claude Code's has always arrived as one, and since **0.35.2** the plan-approval card Grok and Cursor raise notifies too, where it used to raise nothing.

::: info The event list isn't the sound list
Sounds mirror the five triggers the [chat channels](/guide/chat-channels) push. Notifications mirror what the app actually notifies about, which is a different set: it **adds** a settled [background task](/guide/workspace) and a [work task](/guide/tasks) reaching review or failing — two app-level events the agent protocol has no envelope for — and **drops** *User Message*, an echo of your own keystroke that has no business in a notification centre. [Taskbar and Dock alerts](#taskbar-and-dock-alerts) use the notification list, event for event.
:::

## Taskbar and Dock alerts

New in **0.35.2**: the **desktop app** flashes its taskbar button or bounces its Dock icon when an agent needs you while you're somewhere else. What each level looks like is the platform's:

| Platform | **Briefly** | **Until you return** |
| -------- | ----------- | -------------------- |
| macOS | The Dock icon bounces once | It keeps bouncing until you switch back to Codeg |
| Windows | The taskbar button flashes a few times, then stays highlighted | It keeps flashing until you switch back to the window |
| Linux | The window is marked urgent | The same mark — Linux has only one |

How that Linux mark shows depends on your desktop environment, and Codeg clears it itself once the window has focus again.

**It's on by default**, and the master switch unfolds an **Events** list — the same six as desktop notifications — each set to **Off**, **Briefly** or **Until you return**. The defaults follow one rule: what leaves an agent **blocked on you** keeps asking, what's only news asks once.

| Event | Default |
| ----- | ------- |
| **Turn Complete** | Briefly |
| **Permission Request** | Until you return |
| **Agent Question** | Until you return |
| **Agent Error** | Briefly |
| **Background task** | Briefly |
| **Work task** | Briefly |

Permission requests include plan approvals here too. And three things decide when it fires at all:

- **Never for the window you're looking at.** Each window asks only while it isn't focused — and typing into a [built-in browser](/guide/browser) tab counts as being in it. On macOS the Dock icon belongs to the whole app, so it bounces only while you're in **another app**; with a different Codeg window in front, there's nothing to bounce.
- **Independent of notifications.** The two sections share their event list and nothing else: turning notifications off doesn't stop the taskbar, nor the other way round. Notifications also have **Notify when**; this section has only the rule above.
- **Not for what you missed.** Reconnecting to a session replays its history without flashing anything, and repeats of one event within a second and a half count once.

The section is **desktop only** — a browser tab has no taskbar entry of its own — and it's there in a desktop window attached to a remote workspace as well, which flashes its own entry. Like the sections beside it, it starts folded.

## Notification sounds

Off by default. Turn it on and an agent event plays a short tone, so you can leave a long turn running in another window and still know when it wants you.

The five events are exactly the ones the [chat channels](/guide/chat-channels) push — the same triggers, a different sink; a channel message leaves the machine, a sound doesn't:

| Event | Default tone |
| ----- | ------------ |
| **Turn Complete** | Chime |
| **Permission Request** | Alert |
| **Agent Question** | Ding |
| **Agent Error** | Descending |
| **User Message** | Silent |

Seven tones to choose from — *Chime, Ding, Blip, Pop, Alert, Descending*, and **Silent** to skip an event without turning the rest off — each with a **preview** button. *User Message* starts silent because it fires on your own action, which is the least useful cue of the five.

Two settings govern all of them: a **volume** slider, and **Only when the window is not focused** — stay quiet while you're actually looking at Codeg.

Like desktop notifications and taskbar alerts, this section **starts folded** — notifications and sounds together used to fill the page before anything below them.

::: info These are per device
Four parts of this screen are kept in the browser or app you set them in, not in Codeg's database: notifications, taskbar and Dock alerts, sounds, and the [mention panel's](#mention-panel) tabs. Where an alert lands is a property of the machine you're at: a phone browser attached to the same server has no business beeping — or buzzing — because your desktop was configured to. For sounds it also means they play in the **workspace window** of that device only.
:::

## Good to know

- **Everything saves on change.** There's no Save button on this screen; only a **custom shell path** waits for one, because a half-typed path isn't a setting. Rendering additionally needs a restart.
- **Three sections can be absent, each for a reason.** Rendering shows only in a **local** Windows or Linux desktop window, because that's where there's a webview knob to turn; the close-button picker only in a local desktop window, and it's disabled with a reason where the system has no usable tray. Those two are gone in the browser and in a window attached to a remote workspace, where they'd be configuring the wrong machine. **Taskbar and Dock alerts** are absent only in the browser, which has no taskbar entry to flash — a window attached to a remote workspace keeps them, because the entry it flashes is its own.
- **Colour here isn't the app's colour.** *Colorize command output* forces colour out of the commands **an agent** runs. It has nothing to do with the app's own theme — that's [Appearance](/reference/settings/appearance) — and nothing to do with the terminal you type in yourself.
- **Looking for the agent tool switches?** Delegation and the in-conversation tools moved to [Collaboration](/reference/settings/collaboration) in **0.31.2**, and the built-in browser to [Browser Use](/reference/settings/browser).

## Related

- [Collaboration](/reference/settings/collaboration) — delegation and the in-conversation tools, which used to live at the bottom of this screen.
- [Browser Use](/reference/settings/browser) — the built-in browser's own screen, likewise.
- [The Workspace](/guide/workspace) — the terminal the default-shell setting feeds.
- [Chat Channels](/guide/chat-channels) — the five events the notification sounds mirror.
- [Reference overview](/reference/) — the full 17-screen Settings map.
