---
title: Appearance
description: The Appearance settings screen — theme mode and accent color, custom theme tokens and CSS, window zoom, per-surface fonts, a workspace background image or GIF, the welcome-screen shortcut cards, chat animations and the chat column's width, and the desktop pet manager.
---

# Appearance

**Settings → Appearance** controls how Codeg looks: light or dark, the accent color, your own colors on top of it, how large everything is drawn, the fonts used across each surface, an optional background image, how the conversation moves and how wide it runs, and a couple of extras. It's the screen Settings opens on, and every change here saves automatically and applies immediately — no save button, no restart. (One exception: the custom-CSS editor previews live and saves on **Apply**.)

## Theme mode

A single picker — **Follow system**, **Light**, or **Dark**. *Follow system* tracks your OS setting and flips when it does; the line beneath shows the *effective* theme it resolved to right now. On the desktop app, the native window switches with it.

## Theme color

The accent palette used for buttons, accents, and highlights. Twelve presets — the standard shadcn theme colors, each a swatch you click:

**Neutral** *(default)* · Zinc · Slate · Stone · Gray · Red · Rose · Orange · Green · Blue · Yellow · Violet

The choice recolors the whole app instantly. The first five — **Neutral** *(default)*, Zinc, Slate, Stone, and Gray — keep every surface gray; the seven **accent** colors (Red, Rose, Orange, Green, Blue, Yellow, Violet) go further, tinting panels, the sidebar, the canvas, and even the code-editor background with that hue. It's automatic — there's no separate toggle.

## Custom Style

The twelve presets are a starting point, not a ceiling. **Custom Style** — collapsed by default, with a one-line summary of what it's currently doing (*Preset defaults*, *3 overrides*, *Custom CSS*, or *Suspended*) — lets you change any color in the app, round every corner, and, if you insist, write raw CSS.

Overrides **sit on top of the base preset** rather than replacing it, so switching preset later keeps them.

### Colors and corners

**Enable custom colors** opens the palette: **31 semantic color tokens**, the same set shadcn documents. Seven are up front — *primary*, *primary foreground*, *background*, *foreground*, *accent*, *border*, *sidebar* — chosen because they're visible the moment you change them and hard to break anything with; the other **24 sit under Advanced** (cards, popovers, muted and secondary surfaces, destructive, input, ring, the five chart colors, and the sidebar's own set).

Two things to know about how you edit them:

- **Light and dark are separate.** You're editing the values for whichever mode the app is in right now, and the panel says so — *"Editing light mode values. Switch the app to dark mode to set its own."*
- **Every field can be given back.** A **reset** control beside a token you've changed returns it to the preset's value; **Clear overrides** does the lot.

**Corner radius** is one slider, and it drives the whole scale from `sm` to `4xl` — so a single drag takes the app from sharp to fully rounded without touching anything else.

### Take a theme with you

Your colors are stored in shadcn's `registry:theme` shape, which makes them portable in both directions:

- **Copy theme JSON** puts the current light/dark pair on the clipboard.
- **Import theme…** accepts a `registry:theme` item, a bare `light`/`dark` object, or a flat token map — so a theme from tweakcn, the shadcn registry, or a colleague pastes straight in. **Read clipboard** fills the box for you.

An exported theme installs into any shadcn project with `shadcn add`, and any shadcn theme works here. Nothing about the format is Codeg-specific.

### Custom CSS *(advanced)*

For what the fields can't reach, **Enable custom CSS** opens an editor that applies to **every Codeg window**. The dialog previews live and saves on **Apply**; it shows how much of its **64 KB** budget you've used and how many rules it parsed, so a stylesheet that silently failed to parse says so instead of just doing nothing.

Two things get flagged, and only one of them is removed:

- **`@import` rules are stripped** — they would fetch a remote stylesheet. One that survives removal through escaped syntax blocks the save entirely rather than being let through.
- **A remote `url()` is called out but kept.** It's your stylesheet, so Codeg doesn't rewrite it — it just makes sure you know that applying it makes a network request. → [Privacy & Security](/reference/privacy)

Your color overrides are available inside it as ordinary variables — `var(--primary)`, `var(--background)`, and so on.

::: warning Two ways out if you break the interface
Custom CSS overrides every built-in style, which means it can genuinely make the app unusable — a `display: none` in the wrong place and there's nothing left to click. So there are two escape hatches that don't depend on the interface working:

- **⌘⌥⇧S** *(Ctrl+Alt+Shift+S)* suspends all custom style — colors and CSS both — and the same keys bring it back. It's a deliberately awkward three-modifier combination, listened for ahead of everything else. → [Shortcuts](/reference/settings/shortcuts)
- **`?safeStyle=1`** on the window's URL opens **that one window** with custom style ignored, leaving your other windows alone.

While either is in effect the section says so and offers **Resume custom style**.
:::

## Window zoom

Scales the entire interface — text, controls, and spacing alike — in discrete steps:

**80% · 90% · 100%** *(default)* **· 110% · 125% · 150% · 175% · 200% · 250% · 300%**

The top four rungs arrived in **0.28.2**, taking the ceiling from 150% to **300%** — enough to drive Codeg from across a room, or to read it with low vision without the OS-wide magnifier.

You don't have to come here to change it: **⌘=** and **⌘−** step the same rungs, and **⌘0** returns to 100%. The one place they're declined is **inside the terminal on Windows and Linux**, where `Ctrl+−` and `Ctrl+=` carry shell meaning and belong to whatever you're running; macOS uses Cmd there, which doesn't clash, so the terminal keeps zooming. → [Shortcuts](/reference/settings/shortcuts)

Zoom is stored **per device**, so a large external monitor and a laptop screen can each keep their own comfortable size.

## Fonts

Three independent typefaces, one per surface. Each picks from a set of bundled families (grouped **Sans-serif** / **Monospace**) or **Custom…**, which lets you name any font installed on your system. Bundled fonts load only when selected. What you can set differs by surface:

| Surface | Font list | Size | Ligatures | Word wrap |
| ------- | --------- | ---- | --------- | --------- |
| **Interface** | Sans + monospace | — | — | — |
| **Editor** | Monospace | ✓ | ✓ | ✓ |
| **Terminal** | Monospace | ✓ | ✓ | — |

- **Ligatures** turn on programming ligatures (`=>`, `!=`, `>=`) for fonts that carry them; the toggle disables itself and says so for a font that doesn't. Terminal ligatures apply only to the bundled coding fonts.
- A **live preview** at the bottom renders a line of interface text, a snippet of code, and a terminal command in your current choices — so you can compare before committing.

The editor and terminal these style are the ones in [the workspace](/guide/workspace).

## Workspace background

Put a picture behind the whole workspace. Turn on **Enable background image** and pick an image (**PNG, JPEG, WebP, or GIF**, up to **16 MB**); the sidebar, panels, and tab bars turn translucent and **frosted** so the image shows through, while a mask keeps text readable. One image is shared by light and dark mode.

**GIF joined the list in 0.28**, and an animated one **plays** — through the blur and the frosted panels, not just as a still first frame.

**Or don't bring one.** Since **0.30.4** a **Wallpaper market** button opens the public [Wallhaven](https://wallhaven.cc) gallery inside Settings — **SFW only**, filtered to **All**, **General**, **Anime** or **People**, with a search box and paging. Click a wallpaper and Codeg downloads and applies it in one step; the one you're using is marked **In use**. A picture too big to be a background — over **16 MB**, or over **40 megapixels** — is greyed as **Unavailable** with the reason on it, read straight from the gallery listing so you learn it before spending the download. Wallhaven doesn't always publish both numbers, and a card missing them stays clickable; there the limits are enforced when the download runs.

The controls, top to bottom:

| Control | What it does | Default |
| ------- | ------------ | ------- |
| **Enable background image** | The on/off switch for the whole feature | Off |
| **Image** | Choose, replace, or remove the picture | — |
| **Fill mode** | How the image sits: **Cover**, **Contain**, **Center**, or **Tile** | Cover |
| **Mask opacity** | Fades the image toward the theme background — higher gives text more contrast (up to 99%) | 82% |
| **Image blur** | Softens the image, 0–24 px | 0 px |
| **Panel opacity** | How solid the sidebar, panels, and tab bars are — lower lets more image through, all the way to fully transparent | 30% |

::: tip It travels to the browser too
The image is saved on disk with Codeg's data, so a background you set on the desktop also shows when you open the same install as a [server](/getting-started/deployment) in a browser. The display settings (opacity, blur, fill) are stored per device, like zoom.
:::

## Mode selection area

One switch — **Show on the new conversation page**. It controls whether the **Code Development / Office Work** shortcut cards appear above the composer when you open a fresh conversation. Leave it on for one-click access to the welcome quick actions — they seed a starter prompt for the [Office](/guide/office) and [Research](/guide/research) skills, among others — or turn it off for a bare composer.

## Chat animations

One switch — **Enable chat animations**, **on** by default and new in **0.35.0**. Turn it off and the conversation stops moving: expanding and collapsing, tool-call and working-status animations, a reply folding away, and smooth scrolling all happen at once — the jumps from **Message navigation** and back to a reply's prompt included, and the charts in [reply cards](/guide/skills#cards-tables-and-charts-in-replies) too. Spinners keep turning, since a frozen spinner reads as a hang.

It covers the **conversation area only**; the sidebar, drawers and the rest of the app animate as before. It's applied before the first paint, so a reload with it off doesn't animate even once.

## Chat width

How wide the conversation column and the composer may grow — *"Maximum width of the conversation column and the composer."* New in **0.35.0**.

- **Content width** is a slider from **640 px** up, in steps of 8, reading **Default (768px)** until you move it. **Reset to default** gives it back.
- **Or drag the column itself.** In a conversation tab each edge of the chat column carries a handle: drag either one outward and the column widens on both sides, **double-click** it to reset, or focus it and use **←** / **→**, 32 px a press, with **Esc** or **Home** to reset. The handles appear only in a window at least 768 px wide.
- **Measured at 100% zoom.** The width is stored as it would be at 100% [window zoom](#window-zoom) and scales with it, the way the default always did. A value wider than the window can show is held to what fits, with a small margin on each side, without changing what's stored.

The width reaches every surface that draws a transcript — a conversation tab and its welcome page, a [canvas](/guide/canvas) card, a to-do's or a sub-agent's read-only view — but only the conversation tab has the handles. Change it in one window and the others follow.

## Desktop Pet

A collapsible manager for **floating desktop companions** — animated sprite characters that sit on your screen and double as a live status indicator, showing how many agent sessions are running, awaiting approval, or errored. It's collapsed by default; the number beside its title is how many pets you have.

Three ways to add one:

- **Add pet** — supply your own sprite sheet: a **1536×1872 PNG or WebP with transparency** (Codex-compatible), plus an id and a display name.
- **Import from Codex** — pulls in any pets already installed under `~/.codex/pets/`; disabled when there are none.
- **Pet marketplace** — browse and install community pets, filterable by kind (object, animal, person, creature) and sortable by latest, popular, or most-viewed.

Each pet card lets you **Set active**, **Edit**, or **Delete** it (the active pet can't be deleted), and clicking it previews the animations — idle, run, wave, jump, and the session-state poses. **Summon pet window** floats the active pet on your desktop.

::: info The floating pet is desktop-only
Summoning the on-screen companion needs the native desktop window, so **Summon** appears only in the desktop app. You can still build and manage your pet library from a [browser session](/getting-started/deployment) — there's just nowhere for it to float.
:::

## Good to know

- **Appearance is local.** These are per-machine preferences — zoom explicitly so — not part of any synced profile. Set them once on each device.
- **App language isn't here.** Interface language lives on the [System](/reference/settings/system) screen, not Appearance.
- **Almost everything is instant.** No control here needs a reconnect or a restart; the only thing that waits on a button is the custom-CSS editor, which previews live and saves on **Apply**.
- **Custom style travels with the device, not the profile.** Your color overrides and CSS live in the browser or app you set them in — like zoom, and unlike the background image, whose file is stored with Codeg's data.

## Related

- [The Workspace](/guide/workspace) — the editor and terminal the font settings style.
- [System](/reference/settings/system) — updates, network proxy, language, and backup.
- [Reference overview](/reference/) — the full 17-screen Settings map.
