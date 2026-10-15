---
title: Built-in Browser
description: Web pages open as tabs beside your files in the desktop app — links from conversations, tool results and the terminal, dev servers, docs, OAuth pages. How links are routed, what a browser tab can do, how to view a page as a tablet or phone, how to hand a page to the conversation or share it with an agent, site rules, what survives a restart, and where the browsing data lives.
---

# Built-in Browser

Agents hand you links all day: the dev server they just started, the docs page they quoted, the pull request they opened. In the **desktop app** those pages open **inside Codeg**, as tabs in the file pane next to your code, instead of throwing you out to another application. The page is a real browser engine — the same WebKit as Safari on macOS, WebView2 on Windows, WebKitGTK on Linux — with its own cookies, its own history and its own address bar. Nothing about the engine is emulated: even the [tablet and phone views](#view-a-page-as-a-tablet-or-phone) change only the size the page is laid out at.

Because the page is in the app, it is also a surface you and an agent can share: you can [hand a page, an element, a screenshot or a console error into the conversation](#hand-a-page-to-the-conversation), and you can [let an agent read and drive a page you have shared](#let-an-agent-work-on-the-page), with everything it does written on the tab where you can watch it.

::: info Its settings screen is Browser Use
Everything below lives under **[Settings → Browser Use](/reference/settings/browser)** — named *Browser* until **0.33.0**, and an entry of its own since **0.31.2**. Before that it was a folded block at the bottom of *Settings → General*, which is where older instructions will send you.
:::

::: tip Desktop first
In a browser session ([`codeg-server`](/getting-started/deployment)) there is no browser engine to embed: web links open in a new tab of the browser you are already in, and of the settings described here only three apply — site rules (to block), local servers and the terminal link menu. The one exception is a **dev server running on the Codeg host** — `http://localhost:3000` as an agent printed it — which opens as a tab inside the workbench through the [port bridge](#in-a-browser-session-the-port-bridge).

A desktop window attached to a **remote workspace** has the built-in browser since **0.32.2**, and opens the remote host's own addresses through it. → [In a remote workspace window](#in-a-remote-workspace-window)
:::

## Where a link opens

Every `http(s)` link in the app goes through one decision, made the moment you click:

1. **A site rule** for that host wins outright (see [Site rules](#site-rules) below). A rule that says *block* stops the click with a message.
2. Otherwise the **default for where the link came from** applies — conversation messages, tool results, the terminal, the editor and notifications each have their own default, and each starts as *Built-in browser*. Change any of them under **Settings → Browser Use → Where links open**.
3. **⌘-click** (macOS) or **Ctrl-click** (Windows, Linux) opens the link *the other way*, just this once: in the system browser when the default is built-in, and in a built-in tab when the default is the system browser.

The **right-click menu** on a link offers the same three choices explicitly — open in the built-in browser, open in the system browser, copy the link — and links that are not web pages keep their old behaviour: a file path opens the file, `mailto:` and `tel:` go to the OS, an unknown scheme is refused rather than handed to anything.

The first time a link opens in the built-in browser Codeg says so once, with an **Always use system browser** button in the toast for anyone who would rather keep things as they were.

For the terminal there is one more option: **Terminal link menu** (off by default) makes a plain click on a link show a small menu at the pointer — built-in browser, system browser, copy link — instead of opening it at once. ⌘/Ctrl-click still opens the link directly.

## Inside a browser tab

A browser tab has a small toolbar and nothing else in the way of the page:

- **Address bar.** Type an address and press Enter. Bare hosts get `https://` (loopback and private addresses get `http://`); there is no search fallback — the address bar is an address bar.
- **Back, forward, reload / stop, copy link, open in system browser.**
- **Device** — the button right after the address bar lays the page out as a tablet, a phone or a size you type. → [View a page as a tablet or phone](#view-a-page-as-a-tablet-or-phone)
- **⌘W closes the tab, not the window.** On macOS, ⌘W pressed while focus is inside a page — a browser tab, an HTML document view, an HTML preview — closes that tab, as it does anywhere else in the workspace. Until **0.32.3** the keystroke reached the menu's *Close Window* instead and took the whole window with it.
- **Find in page** with **⌘F / Ctrl-F** — Enter and Shift+Enter step through matches, Escape closes the bar. The search is the engine's own, so the page cannot see or interfere with it. (There is no *n of m* counter: WebKit only reports whether a step matched.)
- **Links inside the page.** A ⌘/Ctrl-click opens a background tab right next to the current one. A page that opens a window after you clicked something — an OAuth pop-up, a `target="_blank"` link — gets a tab beside its opener, and keeps `window.opener` and the referrer as it would in a browser. A pop-up nobody asked for (a timer, a script on load) is blocked and reported in a bar under the toolbar, with an **Open anyway** button that opens the address as a plain tab. Since **0.31.1** a pop-up that **closes itself** when it's finished — which is how a Google sign-in ends — takes its tab with it, instead of leaving an empty *Sign In* tab behind. Only a tab a page opened that way may close itself; an ordinary tab cannot.
- **A blank tab is yours, not the engine's.** The empty **Browser tab** is painted in the app's own colours since **0.31.1** — dark mode no longer opens onto a white page, a theme change repaints the blank tabs already open, and an in-app toast is visible over one.
- **Downloads.** A file the page offers lands in your **Downloads** folder under a sanitised name; an existing file is never replaced (you get `name (1).ext`), and nothing is ever opened automatically. The download bar offers **Show in folder** and nothing else.
- **Pages that fail.** A host that cannot be found, a certificate that is not valid, a server that refuses the connection — each gets its own message, worded by the engine, the moment the engine gives up, with **Retry** and **Open in system browser** buttons. A page a site rule blocks gets a block page instead, with only *Retry* (and a pointer to the rule).
- **Refused navigations.** When the page itself tries to go somewhere a tab must not — a `mailto:`, a custom scheme, a blocked host — the page stays where it is and a bar under the toolbar says so. For `mailto:` and `tel:` the bar offers **Open with system app**; other schemes stay refused.

Menus, dialogs and drawers open **over** the page: while one is open the page shows its last frame and comes back live the moment the overlay closes.

Three things a browser has that this first release does not: **favicons**, **download progress** while a file is coming down (a download reports when it finishes), and **preloading** a tab before you switch to it.

## View a page as a tablet or phone

Since **0.34.0** a tab can lay its page out at a device's size, so you can check a responsive layout without resizing anything. The **device button**, right after the address bar — its tooltip reads *Device: Desktop* — opens a **View as** menu:

| Device | Page size |
| ------ | --------- |
| **Desktop** | *Full pane* — the page fills the tab, as it always has. The default |
| **Tablet** | 768 × 1024 |
| **Phone** | 390 × 844 |
| **Custom** | A width and height you type |

A device tab shows its page in a **frame** centred in the pane, with the size written above it. When the pane is smaller than the device, the frame shrinks and the page is **zoomed out by the same factor** — the line above it gives the scale, *· 62%* — so the page still lays out at the device's width instead of reflowing to the pane's. The engines won't zoom a page below 25%, so a device more than four times the size of the pane is laid out smaller than asked, and an amber line says what it actually got: *Pane too small: laid out at 1872 × 1052*. The presets are portrait only; for a phone on its side, use **Custom** at 844 × 390.

**Custom** turns the size above the frame into two fields, with the cursor already in the width. **Enter** or clicking away keeps what you typed, **Escape** puts the old value back, and **↑** / **↓** step it by 1 — by 10 with **Shift**. Sizes are whole CSS pixels from **100 to 8192**; anything outside that range is pulled back into it. A tab you switch to Custom starts at the size you typed last, **1280 × 800** until you've typed one, and from then on each tab keeps its own.

::: warning Only the size changes
A device view changes the page's **viewport** and nothing else. The page keeps the engine's own user agent and mouse input — touch isn't emulated — so a site that picks its mobile version by browser type still serves you the desktop one. What follows the width, such as media queries and responsive grids, does see the device.
:::

- **Each tab keeps its device** — when it's unloaded in the background, across a restart, and when you reopen it with ⇧⌘T, unless that address is already open in another tab of the same profile, which is brought forward instead. A new tab starts on Desktop, whoever opened it: you, a link, a pop-up or an agent. No browser tool can change a tab's device.
- **In the pane, the page's zoom is Codeg's while a device is on.** It's reapplied every time the frame is fitted, so a zoom you apply in the page yourself — Ctrl+wheel on Windows — is undone at the next fit; switching back to Desktop returns the page to 100% once and leaves the zoom to you again.
- **A tab in its own window** — with **Tab surface** set to *Separate window*, which until **0.35.2** was every tab on Linux — isn't framed. The window itself is resized so the page area matches the device at full size, and going back to Desktop gives the window its earlier size. The size, or Custom's two fields, moves to the tab's card in the pane, the one reading *This page is shown in its own window*. The window's page zoom is left as you set it, so keep it at 100% when the exact size matters.
- **In a browser session**, a [port-bridge](#in-a-browser-session-the-port-bridge) tab has the same button, ahead of **Reload**. There the frame is scaled down rather than zoomed, so the page always lays out at the full device size and the *Pane too small* line never appears.

## A server you start in a terminal

Start a dev server in a Codeg terminal — or let an agent start one — and Codeg reads the address it prints. **Settings → Browser Use → Local servers** decides what happens next:

- **Notify me** (the default) — a toast says *A server is running at …*, with an **Open** button.
- **Open a tab** — the page opens in a **background** tab, so whatever you were reading keeps the column.
- **Do nothing** — no interruption at all.

Only addresses **on this machine** count, and only once something is actually listening on them: a framework that prints its address before it has bound the port doesn't get a tab that fails to load.

Whatever that setting says, the **+** at the end of the tab strip lists the local servers running **right now**, beside **Browser tab** for a blank one — so a server you dismissed, or started before you thought about it, is always one menu away.

## HTML files: the document view

An `.html` file opened in the file pane — a report an agent wrote, a generated chart, a static site's `index.html` — is shown through the built-in browser too, in a **document view** served straight from the file's folder rather than through a web server. It is a real page with a real address, so relative links, images, stylesheets and pages linking to each other all work; what it is not allowed to do is leave that folder.

- **Safe mode by default.** The document renders with **no script and no network**: markup, styles, images and fonts from its own folder, nothing else. This is the same posture the inline preview has always taken.
- **Enable scripts** (the button in the view's header) switches that one file to **dynamic mode** for the rest of the session: its scripts run, and may read other files in the folder (`fetch('data.json')` works). They still cannot reach the network, open windows or download anything. The folder is the workspace folder the file sits in, so `../shared/app.js` works inside a workspace; a file outside every workspace folder is confined to its own directory.
- **What you approved is what runs.** Dynamic mode remembers when you enabled it. If any file the document uses is changed afterwards — the agent rewrote a script, a build replaced an asset — the view drops back to safe mode on its own, reloads, and says which file changed, with an **Enable again** button. Nothing that changed after the approval is ever served with scripts on.
- **Links out of the document.** A link to a web page is not followed inside the view; a bar offers **Open link**, which opens it the way any link in the app opens (your defaults and site rules apply). `mailto:` and `tel:` get **Open with system app**. Downloads are not possible from a document.
- **Edits.** The view shows the file as saved; unsaved edits in the editor are not reflected until you save, and a saved file reloads by itself.
- **The inline preview is still there.** The view's **⋯** menu has **Use inline preview** for this file, and **Settings → Browser Use → HTML file previews** turns the document view off for every file (the web app always uses the inline preview).

The document view is available on macOS and Windows. Linux keeps the inline preview: its tabs embed in the workspace since **0.35.2**, but the private address scheme a document view is served from can't yet be registered for them there. A document view is never [shared with an agent](#let-an-agent-work-on-the-page): it is not listed to one and cannot be granted, whatever address the platform happens to give it.

## Hand a page to the conversation

A browser tab is also a way *into* the conversation. The **Send to chat** control at the right of the address bar opens a menu headed *Send this page to the chat*, with four ways to do it:

- **Pick an element…** — the pointer becomes a picker; click something on the page and that element is what's sent. Escape stops picking.
- **Send a screenshot** — what the tab is showing right now.
- **Mark up a screenshot…** — the same screenshot, opened first in an editor where you draw numbered **boxes** and **arrows** on it, with **Undo** and **Clear**. **Add to chat** sends the marked-up picture *and* where each mark sits on the page, in the page's own coordinates — so "box 2" in your message points at something real. New in **0.32.2**.
- **Send the console errors** — what the page printed and what failed on it. When nothing has gone wrong the item says so and can't be chosen, rather than sending you an empty list.

Each one carries the page it came from, and lands in the composer of the conversation you have open as a badge — *Page element*, *Page screenshot*, *Marked-up screenshot*, *3 console errors* — that you can still take off before you send. The sent message keeps that badge, with the site it came from beneath it, live, in history and on another client alike. With no conversation open, the control says which one it is missing.

### Mark up a screenshot

The editor opens on the capture, with **Box** selected; drag across the picture to draw, and each mark gets the next number. **Arrow** draws a pointer instead. The marks are red with a white halo; there's no colour, text or freehand tool. ⌘/Ctrl+Z undoes, **Clear** wipes the lot (and can itself be undone), and ⌘/Ctrl+Enter adds the result to the chat. A drag too short to mean anything is ignored, and once you've drawn, a stray click outside the editor doesn't throw your marks away.

What the agent receives is the picture plus one line per mark — *box: W×H at (x, y)*, *arrow: pointing at (x, y), from (x, y)* — in the page's CSS pixels, with a note that the marks aren't part of the page. Send with no marks and it's an ordinary screenshot.

## Let an agent work on the page

The other direction: an agent can list your open tabs, read the structure of a page you have shared, act on it — click, hover, type, press a key, choose an option — take a screenshot, read what the page printed to its console, and open, point or close tabs.

Two things have to be true first. **One of them starts closed; the other does not:**

1. **The tool group is off for every agent until you turn it on.** **Settings → Collaboration → In-conversation tools → Read and drive the built-in browser**. Unlike most of that card, it is re-read at the moment a tool is *called* rather than only when the agent started — so switching it off stops a session that is already running, not just the next one.
2. **The page has to be shared — and out of the box it shares itself.** Each tab carries a control at the left of its address bar (**Read only**, **Read and act**, or nothing at all), but the **Default sharing level** setting ships as **Read and act**, and that grants each *new* site a tab arrives at as the page loads, with nobody asked. A shared tab wears a badge — *Shared*, or *Shared · can act* — in the address bar and a matching mark in the tab strip, and one press takes it back.

So the switch in step 1 is the real gate: until an agent has the tool group, none of this is handed to anyone.

::: warning Worth being deliberate about
Once an agent *has* the tool group, and as long as the standing level is anything but *Share nothing*, **a page is shared as it loads** — including one the agent opened for itself with `browser_open_tab` — on every site that tab has not already been told otherwise about. Set **Default sharing level** to *Share nothing* if you would rather every share be a decision you made in the tab.
:::

### What a share covers, and when it ends

A grant belongs to **one tab and one origin** — the site the page was on when it was granted. Leaving that origin ends it; what happens next depends on the standing level:

- **With a standing level** (the shipped default), the next origin is granted as the page loads and nothing interrupts you — an alarm bar on every cross-site click would be noise, and the toolbar badge already says what the current page is shared at. But **a tab remembers what you decided, per site**: a site you stopped sharing stays unshared when that tab returns to it, and one you narrowed to *Read only* comes back at *Read only*. The standing level speaks for any site the tab holds no decision about — one it has not been to, and one it saw while the level was *Share nothing*, which is deliberately not written down so that turning the level on later reaches the page already in front of you. An SSO bounce out and back therefore cannot launder a share you ended. That memory lives as long as the tab does: a tab restored after a restart starts with none of it, and the standing level applies to it afresh. The gap runs the other way: if the tab lands somewhere no grant can bind to, the share ends, nothing replaces it, and nothing says so either.
- **With *Share nothing***, leaving the origin ends the share and a bar says so, offering to share the new one instead.

A share on a `localhost` address can also end because **another program took that port** from the one that was serving it — but only where Codeg could identify that program when you shared. A grant it could not pin is never re-checked, and behaves as it would have without the feature.

### You can see what it did

Every read, every action and every refusal is written on the tab it happened to — *What agents did here*, in the address bar, with a count beside it. The refusals are the point: an agent that tried to click on a page you shared for reading only leaves a line saying it was refused, so a share that is too narrow looks different from an agent that did nothing.

Two things leave no line, for the same reason — there is no tab left to read it on, or no page it happened to. **Closing** a tab succeeds by making it disappear, so only a *refused* close is recorded; and **listing** your open tabs is not an action on any one page.

### What the agent actually gets

| Needs | Tools |
| ----- | ----- |
| Nothing but the tool group | `browser_list_tabs`, `browser_open_tab` — there is no tab yet for a grant to be on |
| The tab **shared** | `browser_snapshot` (the page's accessibility tree, each element with a `ref`), `browser_console_messages`, `browser_screenshot` |
| The tab shared **for acting** | `browser_click`, `browser_hover`, `browser_type`, `browser_press_key`, `browser_select_option` — and `browser_navigate`, `browser_close_tab`, except on a tab with no page in it to protect (a blank one, or one showing an error) |
| Shared for acting, **and its own switch** | `browser_eval` — which is also the one you can ask to be [shown every snippet](#running-its-own-code) |

`browser_list_tabs` gives an agent each tab's **origin** — `scheme://host` with its port, not the path or the query — and whether it is shared, but **not its title** until it is: a title is text the page chose, and a page you have not shared should not get to narrate itself, while the address is what you need to see to decide at all. A refusal comes back to the agent as an *answer*, not an error, so a tab you did not share ends the tool call rather than the turn.

### Running its own code

**Run code in the built-in browser** is a second switch, off by default and inert without the first. It also needs the page shared **for acting**, not merely for reading.

With all three in place, **the code runs** — and **that switch is where you decided it would**. Until **0.31.1** every snippet was put in front of you instead, unconditionally and without the answer ever being remembered, which is the most repetitive consent in the app: somebody who has turned this switch on and shared a tab at *Read and act* has already made the decision, and the hundredth dialog is answered by reflex rather than read. So the weight moved **up** — one question while you are deciding, instead of a hundred while you are working. The switch's own text says as much now.

What did not move is anything that gates it. The tool group, this switch and the tab's *Read and act* grant are all read in the backend before a call is raised at all, and an agent can reach none of them. And a silent run is not an unseen one: it is written to that tab's **agent activity** like every other act.

If you want the old behaviour, it is one setting: **Settings → Browser Use → [Running code on a page](/reference/settings/browser#running-code-on-a-page) → Ask me every time**. Then each snippet is shown in full, with the site it would run on, and waits for **Run it once** or **Don't run it** — approving one never approves the next, and there is deliberately no *always allow* button beside the code. The window that owns the tab is the one asked. A call that is refused, or that nobody was there to answer, comes back to the agent as a decline it is told not to retry.

Desktop only: a browser session has no native tabs, so none of these tools are offered to an agent there in the first place. A desktop window attached to a [remote workspace](#in-a-remote-workspace-window) doesn't share its pages with agents either — that workspace's agents run on its host, not on this computer.

## Site rules

**Settings → Browser Use → Site rules** is a small table that decides, per site, before any default is consulted:

| Action | Meaning |
| ------ | ------- |
| **Built-in browser** | Always open here, whatever the source's default says (⌘/Ctrl-click still inverts). |
| **System browser** | Always hand off, e.g. for a site that refuses to log in inside an embedded view. |
| **Block** | Never open — not from a link, not from the address bar, not when a page links or redirects to it, not in a frame, not as a pop-up. |

A pattern is a **hostname** (`wiki.example.com`), a **wildcard suffix** (`*.example.com` — matches `a.example.com` and `a.b.example.com`, not `example.com` itself), or **`*`**, optionally followed by **`:port`** (`localhost:3000`, `[::1]:8080`). The **most specific matching pattern wins**: an exact host beats a wildcard, a longer suffix beats a shorter one, `*` comes last, and a pinned port breaks ties — so the table needs no ordering.

### Rules set by an administrator

An administrator can fix rules for every user of a machine, and can turn the built-in browser off altogether, with a small JSON file:

| Platform | Path |
| -------- | ---- |
| macOS | `/Library/Application Support/codeg/policy.json` |
| Windows | `%ProgramData%\codeg\policy.json` |
| Linux | `/etc/codeg/policy.json` |

`CODEG_POLICY_FILE` points at a different file. The file is read once at startup:

```json
{
  "browser": {
    "enabled": true,
    "hostRules": [
      { "pattern": "*.internal.example", "action": "block" },
      { "pattern": "sso.example.com", "action": "system" }
    ]
  }
}
```

Both keys are optional. Managed rules show in the settings table with a lock and cannot be edited; they are consulted before the user's own rules, so a more specific user rule cannot lift a managed block. With `"enabled": false` every link goes to the system browser and the settings section says why. A malformed rule is skipped and logged; a malformed file is logged and ignored rather than silently lifting or imposing restrictions.

## Tabs across restarts

Browser tabs survive a restart the way a browser's do. Codeg remembers, per window, the page each tab was actually on, its title and its [device](#view-a-page-as-a-tablet-or-phone); on the next launch the tabs are back in the strip, **drawn faded and not loaded** — a tab loads when you first switch to it, so twenty restored tabs cost twenty small records and no memory. **⇧⌘T / Ctrl+Shift+T** reopens a browser tab you just closed, at the page it was showing and on the same device — unless that address is already open in another tab of the same profile, which is brought forward instead. History, scroll position and form contents are not kept across restarts.

There is also an optional **Unload background tabs** switch (off by default): a browser tab that stays in the background for thirty minutes releases its engine and loads again when you come back, faded in the strip meanwhile.

## Profiles, browsing data and the proxy {#browsing-data-cookies-and-the-proxy}

The built-in browser keeps its own **profile**: cookies, caches and site storage live apart from Codeg's own data and, on macOS 14 and later, in a store of their own. Sign in to a site once and you stay signed in across restarts.

You can have more than one profile — a second set of cookies and sign-ins, for a second account on the same site or for keeping work and personal sessions apart. **Settings → Browser Use → Profiles** lists them: add one by name, clear one's browsing data (which signs you out of sites in that profile, without touching the app's own settings), delete one (its tabs are closed and its data removed), and pick which profile **new tabs open in**. A tab's profile is fixed for its life: once any profile besides the default exists, the tab's toolbar shows a chip with the profile's name, and the chip's menu opens the same page in another profile — as a new tab beside it. Pop-ups share their opener's profile; a tab you ⌘-click open from another tab lands in that tab's profile; tabs restored after a restart come back in the profile they had (in the default one if that profile was deleted meanwhile). Profiles besides the default need macOS 14 or later; on earlier macOS the section shows a single **Browsing data → Clear…** row instead.

**Google sign-in compatibility** (on by default; macOS and Windows) makes browser tabs present a Firefox identity to Google's sign-in pages — `accounts.google.com` and `accounts.youtube.com`, nothing else. Google refuses to sign users in from embedded browsers it does not recognise; everywhere else the engine's own identity is kept, because bot checks reject an identity that does not match the engine that sent it. Another sign-in provider with the same refusal can be added through the `CODEG_BROWSER_SIGN_IN_HOSTS` environment variable (a comma-separated list of hostnames; subdomains count). Two limits: it works in embedded tabs, not in the separate-window surface; and on macOS, when a sign-in page redirects you to another site — the way a login provider sends you back to the app you were signing in to — the first request to that site still carries the sign-in identity, and everything after it uses the engine's own. (On Windows the identity is decided per request, so the redirect carries the engine's own identity straight away.)

Browser tabs use the proxy configured under **Settings → System → Network proxy**, the same one the app and the agents use. On macOS this needs **version 14 or later**: before it, browser tabs cannot be proxied at all, and with a proxy configured a tab **refuses to open** rather than reaching the network around it — the settings row says as much. Where it is supported, the change applies to open tabs at their next connection; on Linux to tabs opened afterwards; on Windows after a restart (WebView2 fixes its proxy when the first browser tab of a process is created). Addresses on this machine — `localhost`, `127.0.0.1`, `::1` — never go through the proxy, so a dev server keeps working whatever the proxy would do with it. `http://` and `socks5://` proxies are supported; an `https://` proxy is not.

The **Web inspector** switch in the same settings section is **on by default**: it puts **Open inspector** in a tab's **⋯** menu and allows *Inspect Element* in the page's own right-click menu. The inspector opens **in a window of its own** rather than docking into the tab — docked, it would take half the file pane and squeeze the page into a corner, which for a browser tab is the wrong trade. Codeg registers that as the preference rather than forcing it, so a dock or undock **you** perform from the inspector's own toolbar is remembered by the engine and wins from then on. Like **Tab surface** below it, the switch applies to tabs opened from then on, because a webview cannot be made inspectable after it exists. **Tab surface** decides how pages are hosted: keep *Automatic* unless embedded tabs misbehave on your system — *Separate window* opens each tab as its own window, which until **0.35.2** was the only way Linux could show one.

## In a browser session: the port bridge

When you use Codeg through `codeg-server`, `localhost` in a link means the *server's* loopback, which your browser cannot reach. For those links the server steps in: it binds one extra port per dev server (from the ten ports after its own, or `CODEG_BRIDGE_PORTS`) and forwards it to the dev server, and the workbench shows the page in a tab on that port. Nothing is rewritten — the page is served at `/` exactly as it would be on the host, so module imports, client-side routers and hot reload all work.

- Only plain `http://` addresses on the server's loopback are bridged (`localhost`, `127.0.0.1`, `[::1]`, `0.0.0.0`). Public addresses still open in a new browser tab; private-network hosts are not the server's to forward.
- The tab's toolbar has the [**device** button](#view-a-page-as-a-tablet-or-phone), **Reload**, **Open in a new tab** (a full browser tab on the same bridge port, for anything the frame cannot show) and **Copy address**. Switching away from the tab and back reloads the page.
- Access is per session: opening the page mints a short credential that the tab exchanges for a cookie on the bridge port. A bridge port closes a minute after its last tab is closed, or after two hours without a request. Nobody reaches the dev server through the bridge without having opened it from a signed-in workbench first.
- If the frame says the **bridge port can't be reached**, the port is bound on the server but not published to your browser: expose the range (Docker: publish `3081-3090` alongside `3080`, or whatever `CODEG_BRIDGE_PORTS` says), or set `CODEG_BRIDGE_PUBLIC_HOST` when a reverse proxy gives the bridge a different hostname. A workbench served over HTTPS needs the bridge ports behind HTTPS too.

Unless `CODEG_BRIDGE_PUBLIC_HOST` gives the bridge a hostname of its own, the page shares one with the workbench. Where it does, of Codeg's own cookies the page sees the **locale** ones and never your **access token**, which lives in storage scoped to the workbench's own origin; and any *other* cookie on that hostname is one the page can read and one the bridge forwards to the dev server with its requests, Codeg's own being stripped out first. Two dev servers shown at once cannot reach each other through their bridge ports either: a bridge port only answers requests the browser marks as coming from that page itself — by Fetch Metadata where the browser sends it (HTTPS, or the local machine), else by the request's `Origin` or `Referer`. Two consequences: an address you type into the address bar on a plain-HTTP deployment is refused (open it from Codeg instead), and a page that comes back to the dev server from another site — a login provider's redirect, say — is refused too and needs reopening from Codeg.

### By hostname instead of by port {#by-hostname-instead-of-by-port}

Publishing a range of ports is the awkward part of the bridge behind a proxy. Since **0.32.0** a server can name dev servers by **hostname** instead: set **`CODEG_BRIDGE_HOST_PATTERN`**, and `3000.codeg.example.com` reaches port 3000 through the port Codeg already listens on — nothing extra is bound and there's no range to publish.

- **`auto`** puts the port in front of the host the workbench was reached at — `3000.codeg.example.com` for a workbench on `codeg.example.com`, `3000.localhost` for one on `localhost` — or in front of `CODEG_BRIDGE_PUBLIC_HOST` when that's set. It needs the workbench reached **by name**: reached by IP address, there's no name to put the port in front of.
- **A template** with `{port}` in it exactly once — `{port}.preview.example.com`, `p{port}-codeg.example.com` — for a naming scheme of your own. Keep it on the workbench's own site, because the bridge's access cookie isn't sent to a hostname on another one.
- **DNS and the proxy have to agree.** A wildcard DNS record has to point those names at the server, and a reverse proxy in front needs a wildcard virtual host that passes the `Host` header through — `*.codeg.example.com { reverse_proxy codeg:3080 }` in Caddy. When a page can't be reached, the tab says exactly that.
- **A value that doesn't parse turns the bridge off** rather than guessing, and `CODEG_BRIDGE_PORTS=off` still turns it off with a pattern set.

Only names Codeg actually handed out are answered. The variable is read wherever a browser reaches Codeg: by `codeg-server`, and by the desktop app's own [Web Service](/reference/settings/web-service).

## In a remote workspace window {#in-a-remote-workspace-window}

A desktop window [attached to a remote workspace](/guide/workspace#desktop-and-browser) has the built-in browser since **0.32.2** — and the addresses it matters most for are the ones that live **on the remote host**: the `localhost:3000` an agent printed there, a container's private IP. Those open in a **remote tab**, whose every connection leaves **from the remote host**, through its codeg server, so what you see is what the remote machine serves.

- **What counts as the remote host's.** Loopback addresses (`localhost`, `127.0.0.1`, `::1`, `*.localhost`) and private ones (`10.x`, `172.16–31.x`, `192.168.x`, link-local, `*.local`) — except the remote server's own name or address, which this computer reaches directly (unless that's a loopback address itself, as when you reach the server through an SSH tunnel). A link to one of them always opens as a remote tab, with only a blocking site rule consulted first, and typing one into a local tab's address bar opens a remote tab beside it. A public address opens as an ordinary tab, from this computer.
- **Everything inside a remote tab** goes through the remote host — a public site the page loads included.
- **A page that fails says why, from the remote side** — nothing listening at that address there, no route to it from the remote host, an address the server won't open, a timeout, or the connection to the remote host being down. A banner on the tab reads *Opened through {host}* and turns red when that connection drops.
- **The remote server must be 0.32.2 or later**; an older one has no tunnel to offer, and the tab says so. Its operator can narrow what remote tabs may reach with `CODEG_BROWSER_TUNNEL` — `all` (the default), `private` (loopback, private and link-local addresses only), or `off`. → [Configuration](/getting-started/configuration)
- **On macOS** a remote tab needs **macOS 14 or later**, and shows the remote host's `localhost` as **`remote.localhost`** in the address bar, because WebKit sends loopback addresses around any proxy. A link you copy from it, and a page you send to a conversation, carry the real address.
- **When a tab can't open at all** — no tunnel, an older server, an older macOS — a placeholder says the address is on the remote host, gives the reason, and offers **Copy address**; **Try {host}** for a `localhost` address with a port, which opens that port on the remote host's own name from this computer; or **Open on this computer** for a private address.
- **Agents can't use the browser here.** A remote workspace's agents run on its host, not on this computer, so sharing a page with them is switched off in remote windows.

Remote tabs have no profile menu and no *Open in system browser*. → [Privacy & Security](/reference/privacy#the-built-in-browser)

## What differs by platform

| | macOS | Windows | Linux |
| --- | --- | --- | --- |
| Pages are hosted | embedded in the workspace | embedded in the workspace | embedded in the workspace, on X11 and Wayland — since 0.35.2 |
| Failure messages | by kind (not found / not secure / cannot connect) | by kind, except a name that cannot be found | by kind, with a name that cannot be found told apart only when the engine reports it so |
| Last frame under overlays | yes | yes | yes |
| Find in page | yes | yes | yes |
| HTML document view | yes | yes | not yet (inline preview) |
| Profiles besides the default | macOS 14 and later | yes | yes |
| Google sign-in identity | yes (embedded tabs) | yes (embedded tabs) | not yet |
| Proxy changes apply | to open tabs | after a restart | to new tabs |
| Remote-workspace tabs | macOS 14 and later | yes | yes |
| Tablet, phone and custom views | framed in the pane | framed in the pane | framed in the pane |

Until **0.35.2**, Linux opened every tab as a window of its own; now its tabs sit in the file pane like everyone else's — each tab you open in a web process of its own, while a pop-up shares its opener's — and keyboard focus goes back to the workspace when an overlay covers a page you were typing in. *Separate window* under **Tab surface** is still there on all three platforms for a system where embedding misbehaves.

Sharing a page with an agent, handing one to the conversation, and the local-server menu work the same on all three.

## Related

- [The Workspace](/guide/workspace) — the file pane the browser tabs live in, and the keyboard shortcuts.
- [Working with Agents](/guide/agents) — where most of those links come from.
- [Browser Use settings](/reference/settings/browser) — every row on the screen, one by one.
- [Computer Use](/guide/computer-use) — the same idea for native desktop windows.
- [Collaboration settings](/reference/settings/collaboration#in-conversation-tools) — the two in-conversation tools that let an agent reach a page at all.
- [Privacy & Security](/reference/privacy) — what stays on your machine, and what an agent can and cannot see.
