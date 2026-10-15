---
title: Browser Use
description: The Browser Use settings screen — where links open per source, site rules and the administrator policy, what agents are allowed to see and do on a page, whether their code is put in front of you, local servers, the HTML document view, the web inspector, tab surface, background unloading, profiles and browsing data, proxy and downloads.
---

# Browser Use

**Settings → Browser Use** is the control surface of the [built-in browser](/guide/browser) — its own heading reads *Built-in browser* — *"Web pages opened from conversations, tool results and the terminal can appear as tabs next to your files instead of leaving the app."* This page lists every row on it; the behaviour behind them is described in the guide.

Everything here applies the moment you change it — there is no Save button — and a change is mirrored into every open window. A few rows say *from now on* because a tab's engine cannot be reconfigured after it exists.

::: info Named Browser Use since 0.33.0
The entry was **Browser** until **0.33.0**, when **Computer Use** arrived beside it. Before **0.31.2** it was a folded block at the bottom of **Settings → General**, five pickers tall — a page of its own is what made the fold unnecessary.
:::

::: tip In a browser session, three rows
There's no browser engine to configure in a browser session — every page opens in the browser you're already in — so most of this screen isn't there. Since **0.32.0** three rows are, because they still decide something and this is the only place to set them: **Site rules** (to block), **Local servers**, and the **Terminal link menu**. Before that the whole entry was hidden, which left the notice for a server started in a terminal impossible to turn off.
:::

## Where links open

One picker per source — **Conversation messages**, **Tool results**, **Terminal**, **Editor**, **Notifications** — each starting at **Built-in browser**, with **System browser** as the other value. ⌘/Ctrl-click always opens a link *the other way*, whatever the picker says. → [Where a link opens](/guide/browser#where-a-link-opens)

## Site rules

A table of patterns and actions that is consulted **before** any of those defaults: a **hostname** (`wiki.example.com`), a **wildcard suffix** (`*.example.com`) or **`*`**, each with an optional `:port`, and an action of *Built-in browser*, *System browser* or **Block**. Add a row at the bottom, change a row's action in place, remove it with the trash button. The **most specific matching pattern wins**, so there is nothing to order.

In a browser session the only action on offer is **Block** — where a link opens isn't a choice there — and a rule you set to one of the other two keeps showing it.

Rows with a **lock** were set by an administrator's [policy file](/guide/browser#rules-set-by-an-administrator) and cannot be changed here; a user rule cannot lift a managed block however specific it is. When that file turns the browser off entirely, a note at the top of the screen says so and every link goes to the system browser.

## Default sharing level

**Read and act** by default; also *Read only* and *Share nothing*. This is what every site a tab arrives at is shared with agents at, **with nobody asked** — a tab's own control still overrides it site by site, and *Share nothing* leaves every share to that control. It is inert until an agent has the [browser tool group](/reference/settings/collaboration#in-conversation-tools), which ships off. → [Let an agent work on the page](/guide/browser#let-an-agent-work-on-the-page)

## Running code on a page

What happens when an agent asks to run **its own JavaScript** on a page shared at *Read and act*:

- **Run without asking** *(default)* — it runs. The decision was made at the **Run code in the built-in browser** switch, which ships off, plus the page's sharing level; every run is still listed in that tab's **agent activity**.
- **Ask me every time** — each snippet is put in front of you in full, with the site it would run on, and waits for **Run it once** / **Don't run it**. Approving one snippet never approves the next, and there is no *always allow* button beside the code: somebody who turned this dialog on wants each snippet.

New in **0.31.1**, and the point of it is where the weight sits, not how much of it there is. The tool group, the `browser_eval` switch and the tab's *Read and act* grant are all enforced in the backend and none of them are reachable from this row — what it replaces is the per-snippet dialog, which used to be unconditional, was never remembered, and was the most repetitive consent in the app. Whichever way it is set, the window that owns the tab is the one that answers, and a refused or unanswered call comes back to the agent as a decline.

## Local servers

What happens when a server started in a Codeg terminal prints its address: **Notify me** (the default — a toast with an **Open** button), **Open a tab** (in the background), or **Do nothing**. Addresses on this machine only, and only once something is actually listening. Either way the tab strip's **+** lists the local servers running right now. In a browser session the row is there too, and *Open a tab* opens the server through the [port bridge](/guide/browser#in-a-browser-session-the-port-bridge). → [A server you start in a terminal](/guide/browser#a-server-you-start-in-a-terminal)

## Terminal link menu

Off by default. On, a plain click on a link in the terminal shows a small menu — built-in browser, system browser, copy link — instead of opening it right away; ⌘/Ctrl-click still opens directly. Shown in a browser session too.

## HTML file previews

On by default where the [document view](/guide/browser#html-files-the-document-view) exists (macOS and Windows). Off, every `.html` file uses the inline preview, as the web app does. Inert on platforms without the document view.

## Web inspector

On by default. Puts **Open inspector** in a tab's **⋯** menu and allows *Inspect Element* in the page's right-click menu. Since **0.31.0** the inspector opens **in a window of its own** rather than docking into the tab — and a dock or undock you perform from the inspector's own toolbar is remembered by the engine and wins from then on. Applies to tabs opened from now on, because a webview cannot be made inspectable after it exists.

## Tab surface

*Automatic*, *Embedded in the workspace* or *Separate window*. Leave it on Automatic, which embeds tabs in the workspace, unless they misbehave on your system. That includes Linux since **0.35.2**, on X11 and Wayland alike — until then it always used separate windows. Applies to tabs opened from now on.

## Unload background tabs

Off by default. On, a browser tab that stays in the background for thirty minutes releases its engine and loads again when you return — faded in the tab strip meanwhile. Scroll position and history are lost.

## Network proxy

Read-only: which proxy browser tabs use right now, taken from **[Settings → System → Network proxy](/reference/settings/system)**, and whether a change needs new tabs or a restart on this platform. Addresses on this machine are never proxied. On macOS before version 14 tabs cannot be proxied at all, and with a proxy configured a tab **refuses to open** rather than reaching around it — the row says so.

## Downloads

Read-only: the folder a page's downloads land in. Nothing is opened automatically, and an existing file is never replaced.

## Google sign-in compatibility

On by default (macOS and Windows). Presents a **Firefox identity to Google's sign-in pages only** — `accounts.google.com` and `accounts.youtube.com` — because Google refuses to sign users in from embedded browsers; everywhere else a tab identifies as the engine it runs in. `CODEG_BROWSER_SIGN_IN_HOSTS` adds another provider that refuses the same way. Embedded tabs only, not the separate-window surface.

## Profiles, and browsing data

Each **profile** keeps its own cookies, site storage and sign-ins. Add one by name, **clear** one's browsing data (which signs you out of sites in that profile without touching the app's own settings), **delete** one (its tabs close with it), and pick which profile **new tabs open in**. Profiles need **macOS 14 or later**; on earlier macOS the section is replaced by a single **Browsing data → Clear…** row for the one profile there is. → [Profiles, browsing data and the proxy](/guide/browser#browsing-data-cookies-and-the-proxy)

## Good to know

- **No Save button.** Every row is written as you change it and mirrored to other windows, which is why this screen behaves differently from [Collaboration](/reference/settings/collaboration), where each panel has its own Save.
- **"From now on" means what it says.** The web inspector and tab surface are read when a tab is created, so open tabs keep the setting they were born with.
- **The agent-facing rows are two of many gates.** *Default sharing level* and *Running code on a page* only ever loosen or tighten something an agent already has: the tool group on [Collaboration](/reference/settings/collaboration#in-conversation-tools) is what hands it the browser at all, and it ships off.
- **An administrator can settle the whole screen.** A [policy file](/guide/browser#rules-set-by-an-administrator) can pin rules or turn the built-in browser off for every user of a machine; managed rows are locked and labelled.

## Related

- [Built-in Browser](/guide/browser) — the feature these switches control, end to end.
- [Collaboration](/reference/settings/collaboration#in-conversation-tools) — the two switches that let an agent reach a page at all.
- [Computer Use](/reference/settings/computer-use) — the screen beside this one, for desktop windows rather than web pages.
- [Privacy & Security](/reference/privacy#the-built-in-browser) — what the browser keeps, and what an agent can and cannot see.
- [System](/reference/settings/system) — the network proxy this screen reports.
- [Reference overview](/reference/) — the full 17-screen Settings map.
