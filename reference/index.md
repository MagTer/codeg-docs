---
title: Reference
description: The reference desk — a screen-by-screen map of Codeg's Settings, how the app is built, how it handles your data, and how to build it from source.
---

# Reference

The [Guide](/guide/) is the *how* — how to run an agent, wire up a channel, build a document. This section is the *what*: a screen-by-screen tour of Codeg's **Settings**, how the app is **built**, how it treats your **data**, and how to build it **from source**. Reach for it when you're staring at a specific toggle and want to know exactly what it does.

Some of Codeg's settings screens are big enough to have their own how-to in the Guide — MCP, Skills, Agents. The rest are configuration you set once and forget. The map below covers **all** of them, so you can always find where a screen is documented, then jump to it.

## The Settings surface

Codeg gathers every preference into one **Settings** window (its sidebar is headed *Preferences*). Here's the whole surface, in the order the app lists it, and where each screen is documented:

| Settings screen | What it controls | Documented in |
| --------------- | ---------------- | ------------- |
| **Appearance** | Theme mode & color, window zoom, fonts, chat animations & width, desktop pet | [Appearance](/reference/settings/appearance) |
| **General** | Default terminal, command-output colour, rendering, the @ mention panel, what the close button does, desktop notifications, taskbar & Dock alerts, and sounds | [General](/reference/settings/general) |
| **Collaboration** | Delegation between agents, the assistants you can @-mention, and the in-conversation tools each agent is given | [Collaboration](/reference/settings/collaboration) |
| **MCP** | Model Context Protocol servers — add, scan, enable per agent | [Guide → MCP Servers](/guide/mcp) |
| **Skills** | Write and edit your own agent skills | [Guide → Skills](/guide/skills) |
| **Skill Packs** | Curated bundles — Experts, Science, Office Tools — plus the UI Render skill and your own | [Guide → Skills](/guide/skills#enable-a-curated-skill-pack) |
| **Agents** | The agent CLIs — connect, configure, run preflight, and [register your own](/guide/custom-agents) | [Guide → Working with Agents](/guide/agents), [Per-Agent Setup](/guide/agent-setup) |
| **Model Providers** | API provider credentials for agents | [Guide → Authentication & Models](/guide/authentication) |
| **Quick Messages** | Reusable message snippets for the composer | [Quick Messages](/reference/settings/quick-messages) |
| **Browser Use** | The built-in browser — where links open, site rules, what agents may see and do on a page | [Browser Use](/reference/settings/browser) |
| **Computer Use** | Letting agents see and operate the desktop windows you share — the driver, macOS permissions, the never-share list, how to stop | [Computer Use](/reference/settings/computer-use) |
| **Shortcuts** | Keyboard shortcuts | [Shortcuts](/reference/settings/shortcuts) |
| **Version Control** | Git executable, GitHub, GitLab and other Git accounts | [Version Control](/reference/settings/version-control) |
| **Chat Channels** | IM bots for notifications and remote control | [Guide → Chat Channels](/guide/chat-channels) |
| **Web Service** | Expose Codeg to a browser — port, token, QR *(desktop only)* | [Web Service](/reference/settings/web-service) |
| **Runtime Logs** | Diagnostic logs — level, live viewer, files | [Runtime Logs](/reference/settings/logs) |
| **System** | Updates, launch at login, command-line access, network proxy, language, configuration sync, backup & restore | [System](/reference/settings/system) |

Opening Settings lands you on **Appearance**. Every screen is there whether you run the desktop app or reach Codeg through a browser — with one exception, dropped from the nav in a browser session: **Web Service**, because it's the screen that *turns on* browser access in the first place. Two more are there but narrower. **Browser Use** keeps only the rows that still decide something in a browser — site rules (to block), what a server started in a terminal does, and the terminal's link menu. **Computer Use** acts on the server machine's own desktop, and only when that server was started with `CODEG_COMPUTER_USE=1`.

::: tip Six screens have a full how-to in the Guide
MCP, Skills, Skill Packs, Agents, Model Providers, and Chat Channels are features you *use*, not just settings you tweak — so they're written up as task guides. The eleven remaining screens are covered here, in reference form.
:::

::: info The map moves when the app does
**0.33.0** added **Computer Use**, renamed **Browser** to **Browser Use** to sit beside it, and regrouped the list: **Collaboration** now follows **General**, and **Quick Messages** comes ahead of the two *Use* screens. Collaboration and the browser's screen are themselves recent, split out of General in **0.31.2**. The browser's page in these docs kept its address through the rename, so an older link still lands on it.
:::

## Architecture & Security

How Codeg is built, and how it handles what you give it.

- [**Architecture**](/reference/architecture) — one Rust core, five binaries: the `codeg` desktop app, the standalone `codeg-server`, the `codeg-cli` terminal client, the `codeg-mcp` companion that powers delegation and the in-conversation tools, and the `codeg-computer-helper` behind computer use. How the pieces fit, and how they drive external agent CLIs over ACP.
- [**Privacy & Security**](/reference/privacy) — what stays on your machine, when the network is actually touched, and how agent credentials and web-service tokens are handled.

## Contributing

- [**Development**](/reference/development) — requirements, the build commands for each binary, and the dev loop for building Codeg from source.

---

Everything here describes the app you actually run — desktop or [server](/getting-started/deployment). For the project itself — the people behind Codeg, the community, and the license — see [About](/about).
