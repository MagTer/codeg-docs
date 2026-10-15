---
title: Guide
description: How to use Codeg — the workspace, the built-in browser, computer use, infinite canvases, conversation aggregation and token usage, agents and multi-agent collaboration, chat channels, automations, to-dos, and the office, research, and project workflows.
---

# Guide

You've [installed Codeg](/getting-started/installation) and run your first session. This guide is everything after that — how to get real work done, from the coding surface you live in to the agents, channels, automations, and specialized workflows built on top. *(New to the project? The [Introduction](/getting-started/) covers what Codeg is and the thinking behind it.)*

The pages are ordered **core-outward**: start with the Essentials, bring in agents and let them collaborate, then reach for whatever the job needs. Each page stands on its own, so feel free to jump straight to what you're after.

::: tip Not sure where to begin?
Read **[The Workspace](/guide/workspace)** to learn the surface every session runs on, then **[Working with Agents](/guide/agents)** to put an agent to work in it. Curious about the headline feature? Jump to **[Multi-Agent Collaboration](/guide/multi-agent)**.
:::

## Essentials

The surface every Codeg session runs on — learn these first.

- [**The Workspace**](/guide/workspace) — the integrated engineering loop: file tree, editor and diff, git changes, commit, and an embedded terminal, all alongside the agent — and [several folders at once](/guide/workspace#work-across-several-folders) when one project isn't the whole picture.
- [**Built-in Browser**](/guide/browser) — web pages open as tabs beside your files: links from conversations and the terminal, dev servers, a locked-down view for local HTML — and a page you can hand to the conversation, marked up, or share with an agent.
- [**Computer Use**](/guide/computer-use) — share a desktop window, a whole app or the screen with your agents, read only or read and act, and stop it all with one click. A preview.
- [**Infinite Canvas**](/guide/canvas) — boards that lay your work out in space, as many as you like: regions bound to folders, Collections you curate, pinned files and terminals, and cards that expand into working conversations.
- [**Conversation Aggregation**](/guide/aggregation) — pull your existing sessions from every supported agent into one searchable workspace, and pick any of them up where you left off.
- [**Git & Worktrees**](/guide/git) — review diffs, stage and commit, manage remotes, and run work in parallel with built-in git worktrees.
- [**Token Usage**](/guide/token-usage) — what your agents actually spent, by day, folder, agent and model, what it would cost at API list prices, with a cache-hit reading and a card you can share.

## Agents

Codeg is agent-agnostic — one consistent interface over many coding CLIs.

- [**Working with Agents**](/guide/agents) — enable an agent, run its preflight check, and start a session.
- [**Supported Agents**](/guide/supported-agents) — the full roster, and where each agent keeps its sessions on disk.
- [**Custom Agents**](/guide/custom-agents) — register any other ACP-compatible agent: pick one from the public registry or paste its distribution JSON.
- [**Authentication & Models**](/guide/authentication) — sign in with an agent's own plan, point it at a custom endpoint, or use a provider API key, and choose your model.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — let the main agent delegate to sub-agents of other types within a single task, each running as its own session.

## Channels & Automation

Drive Codeg without sitting in front of it.

- [**Chat Channels**](/guide/chat-channels) — connect Telegram, Lark (Feishu), and iLink (Weixin) to create tasks, approve permissions, and get live updates — all from your chat app.
- [**Automations**](/guide/automations) — save a fully-configured composer as a reusable automation and run it headlessly, on a cron schedule or on demand.
- [**To-dos**](/guide/tasks) — write down what needs doing and let agents work through the list, each in its own git worktree, waiting for your review before anything merges.
- [**Repository Panel**](/guide/repository) — hand a GitHub, GitLab or Gitea issue or pull request straight to an agent, or let the panel pick them up on a schedule or a webhook, then send the result back as a pull request or a comment.

## Extending Codeg

Give every agent more tools and more know-how.

- [**MCP Servers**](/guide/mcp) — add Model Context Protocol servers from a local scan or the built-in registry to expand what your agents can do.
- [**Skills**](/guide/skills) — install reusable skill packs into a shared store and enable them for the agents you choose, at global or project scope.

## Domain Workflows

Purpose-built modes for specific kinds of work.

- [**Office Documents**](/guide/office) — create, analyze, proofread, and edit `.docx`, `.xlsx`, and `.pptx` files through the bundled officecli, with live in-tab preview.
- [**Scientific Research**](/guide/research) — a curated set of research skills, from hypothesis and experimental design to analysis and write-up, that any agent can invoke.
- [**Project Boot**](/guide/project-boot) — scaffold a new project visually, configuring it on the left while a live preview updates on the right.

Running Codeg on a server instead of the desktop? Everything here works the same in the browser — see [Deployment](/getting-started/deployment) and [Configuration](/getting-started/configuration).
