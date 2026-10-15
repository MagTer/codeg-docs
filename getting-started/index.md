---
title: Introduction
description: Codeg is a multi-agent coding workspace — one place to run, aggregate, and orchestrate the growing family of AI coding agents.
---

# Introduction

**Codeg is a multi-agent coding workspace** — one place to run, aggregate, and orchestrate the growing family of AI coding agents.

Rather than tying you to a single assistant, Codeg brings Claude Code, Codex CLI, Google Antigravity, OpenCode, Qoder, and [more](/guide/supported-agents) into a shared workspace — then lets them work *together*: a lead agent can hand subtasks to agents of other types, each running as its own session. You conduct; they collaborate.

<div class="stat-strip">
  <div class="stat"><span class="stat__num">15</span><span class="stat__label">coding agents, one workspace</span></div>
  <div class="stat"><span class="stat__num">3</span><span class="stat__label">chat channels to drive them</span></div>
  <div class="stat"><span class="stat__num">3</span><span class="stat__label">ways to host — desktop · server · Docker</span></div>
  <div class="stat"><span class="stat__num">0</span><span class="stat__label">telemetry — local-first by default</span></div>
</div>

![A tour of Codeg](/images/gallery.svg)

<div class="cta-row">
  <a class="cta cta--brand" href="/getting-started/installation">Download Codeg →</a>
  <a class="cta" href="/getting-started/deployment">Run a server</a>
  <a class="cta" href="/guide/">Explore the guide</a>
</div>

## Why Codeg exists

For most of software's history, the unit of work was the keystroke. Then came autocomplete, then chat, and now a generation of **agentic** tools that take a whole task — plan it, edit files, run commands, and iterate — largely on their own.

That shift has been remarkable, and messy. The strongest agents ship as separate command-line tools, each with its own models, strengths, session format, and home directory. In day-to-day use, working with them one at a time leaves real gaps — and closing those gaps is the whole point of Codeg:

<div class="beforeafter">
  <div class="ba ba--before">
    <p class="ba__title">Juggling agent CLIs on your own</p>
    <ul>
      <li>History scattered across <code>~/.claude</code>, <code>~/.codex</code>, <code>~/.gemini</code>, and a dozen more silos</li>
      <li>Each agent works alone — no way to let Claude Code lean on Codex for one tricky step</li>
      <li>Tethered to an interactive terminal on your laptop</li>
    </ul>
  </div>
  <div class="ba ba--after">
    <p class="ba__title">With Codeg</p>
    <ul>
      <li>One searchable timeline across every agent you run</li>
      <li>A lead agent delegates sub-tasks to other agents, mid-session</li>
      <li>Desktop or server at the core, with native iOS and Android clients in your pocket</li>
    </ul>
  </div>
</div>

Codeg is a bet that the answer to a fragmenting agent landscape isn't to pick a winner — it's **orchestration**: an open, agent-agnostic workspace where you compose the best of each.

> The unit of software work is moving from the keystroke to the task — and from a single assistant to a team of agents. Codeg is the workspace built for that shift.

## What Codeg does

Three ideas define the workspace.

### 1. Aggregate — one home for every agent

Codeg reads the native session store of each supported agent and pulls them into a single, searchable workspace. Your Claude Code, Codex, Gemini, and OpenCode histories stop living in fifteen separate directories and become one timeline you can browse, resume, and search — no matter which tool produced them.

Fifteen agents plug in today, each with its own models, strengths, and session format:

<AgentRoster />

→ [Supported Agents](/guide/supported-agents)

### 2. Collaborate — agents that work as a team

Within a single session, a main agent can delegate subtasks to sub-agents of *different types* — Claude Code reaching for Codex on one step, Gemini on another — with each delegated run becoming its own first-class session you can open and inspect. This is built on the open **[Agent Client Protocol (ACP)](https://agentclientprotocol.com)** and a small `codeg-mcp` companion that surfaces a `delegate_to_agent` tool to the agents themselves.

<div class="light-only">

![Multi-agent collaboration in Codeg](/images/collaboration-light.png)

</div>

<div class="dark-only">

![Multi-agent collaboration in Codeg](/images/collaboration-dark.png)

</div>

→ [Multi-Agent Collaboration](/guide/multi-agent)

### 3. Operate — agents as first-class infrastructure

Codeg treats agents as something you *run*, not just chat with:

- **[Automations](/guide/automations)** — save a fully-configured setup and run it headlessly, on a cron schedule or on demand.
- **[To-dos](/guide/tasks)** — write down what needs doing and let agents work through the list, each in its own copy of the code, each waiting for your review before it merges.
- **[Repository panel](/guide/repository)** — list a project's GitHub, GitLab or Gitea issues and pull requests, hand one to an agent — or let the panel pick matching ones up by itself — and send the result back as a pull request.
- **[Computer Use](/guide/computer-use)** *(preview)* — share a desktop window, a whole app or the screen with your agents, and let them see it and work in it, with one click to stop them.
- **[Chat Channels](/guide/chat-channels)** — drive sessions from Telegram, Lark (Feishu), or iLink (Weixin): create tasks, approve permissions, and get real-time replies without opening a browser.
- **[Anywhere you need it](/getting-started/installation)** — run agents in the desktop app, on a standalone server, or in Docker, then stay connected through the native iOS and Android clients or any browser.
- **[Extensible](/guide/mcp)** — MCP servers and [Skills](/guide/skills) add tools and expertise, while bundled [Office](/guide/office) and [Scientific Research](/guide/research) toolsets give agents real-world capabilities, and [UI Render](/guide/skills#cards-tables-and-charts-in-replies) lets them answer in cards, tables and charts. New projects start from [Project Boot](/guide/project-boot).

<div class="light-only">

![Working with Office documents inside Codeg](/images/office-light.png)

</div>

<div class="dark-only">

![Working with Office documents inside Codeg](/images/office-dark.png)

</div>

## Built to stay open

Codeg is deliberately un-opinionated about *which* agent you should use, and careful about your data:

- **Agent-agnostic.** New agents plug in through ACP rather than bespoke integrations, so the workspace grows as the ecosystem does.
- **Local-first.** Parsing, storage, and project operations happen on your machine by default; network calls happen only for something you set in motion. See [Privacy & Security](/reference/privacy).
- **One core, four binaries.** A shared Rust core powers the desktop app, the standalone server, the MCP companion and the computer-use helper alike; native mobile clients connect to that core over its authenticated API. See the [Architecture](/reference/architecture).

Codeg stands on the shoulders of open work — the [Agent Client Protocol](https://agentclientprotocol.com) for agent connectivity, [Superpowers](https://github.com/obra/superpowers) for expert skills, [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) for documents, and [scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) for research.

## The road ahead

The agent ecosystem is still multiplying — new models, new CLIs, new specialties arriving every month. Codeg's direction follows that curve rather than fighting it: more supported agents, more channels (Discord, Slack, and DingTalk are on the way), richer collaboration patterns between them, and deeper headless autonomy. Project Boot's tab-based scaffolding is built to grow beyond its first template, too.

The goal stays constant: a workspace that keeps pace with the agents, so you can always reach for the best tool — or several at once — without leaving home.

## Next steps

<div class="nextsteps">
  <a class="nextstep" href="/getting-started/installation">
    <span class="nextstep__title">Download & install →</span>
    <span class="nextstep__desc">Get Codeg for desktop, iPhone, iPad, or Android and connect your first workspace.</span>
  </a>
  <a class="nextstep" href="/guide/supported-agents">
    <span class="nextstep__title">Supported Agents →</span>
    <span class="nextstep__desc">See which agents Codeg aggregates and where each stores its sessions.</span>
  </a>
  <a class="nextstep" href="/guide/">
    <span class="nextstep__title">Guide →</span>
    <span class="nextstep__desc">Multi-agent collaboration, channels, automations, and more.</span>
  </a>
  <a class="nextstep" href="/getting-started/deployment">
    <span class="nextstep__title">Deployment →</span>
    <span class="nextstep__desc">Desktop, standalone server, and Docker options.</span>
  </a>
</div>
