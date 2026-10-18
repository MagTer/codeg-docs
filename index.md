---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  text: Multi-agent coding workspace
  tagline: Run every coding agent together — and keep the work moving on every screen.

homeFeatures:
  - icon: 📥
    title: Conversation Aggregation
    details: Import sessions from your agents' own histories into one unified, searchable workspace — one timeline no matter which tool produced them.
    link: /guide/aggregation
    linkText: Learn more
  - icon: 🤝
    title: Multi-Agent Collaboration
    details: A main agent delegates to sub-agents of different types (Claude Code calling Codex, Gemini…) to jointly complete a task, each running as its own session.
    link: /guide/multi-agent
    linkText: Learn more
  - icon: 🚀
    title: Project Boot
    details: Visually scaffold new projects with a live-preview split pane, then open them straight in the workspace.
    link: /guide/project-boot
    linkText: Learn more
  - icon: 💬
    title: Chat Channels
    details: Drive your agents from Telegram, Lark (Feishu) and iLink (Weixin) — create tasks, approve permissions, get real-time replies.
    link: /guide/chat-channels
    linkText: Learn more
  - icon: 📄
    title: Office Documents
    details: Create, analyze, proofread and edit .docx / .xlsx / .pptx via the bundled officecli, with live in-tab preview.
    link: /guide/office
    linkText: Learn more
  - icon: 🔬
    title: Scientific Research
    details: Bundled research skills — hypothesis, experimental design, statistics, visualization — that any agent can invoke.
    link: /guide/research
    linkText: Learn more
  - icon: ⚡
    title: Automations
    details: Save a composer setup as a reusable automation that runs headlessly, on a cron schedule or on demand.
    link: /guide/automations
    linkText: Learn more
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 5h4M11 18.5h2"/></svg>'
    title: Native iOS & Android
    details: Start sessions, stream replies, handle approvals, and browse projects from the native mobile clients while your agents keep running on your machine.
    link: /getting-started/installation#mobile-apps
    linkText: Get the apps
---

<div class="light-only home-hero-workspace">
  <img src="/images/main-light.png" width="3026" height="2048" alt="Codeg main interface" decoding="async">
</div>

<div class="dark-only home-hero-workspace">
  <img src="/images/main-dark.png" width="3026" height="2048" alt="Codeg main interface" decoding="async">
</div>

<nav class="home-hero-actions" aria-label="Get started with Codeg">
  <a class="home-hero-action home-hero-action--primary" href="/getting-started/installation">Download Codeg →</a>
  <a class="home-hero-action" href="/getting-started/">What is Codeg?</a>
  <a class="home-hero-action no-icon" href="https://github.com/spacering-net/codeg">View on GitHub</a>
</nav>

<MobileShowcase />

<HomeFeatures />
