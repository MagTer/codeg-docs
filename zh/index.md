---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  text: 多智能体编程工作区
  tagline: 让每个编程智能体协同工作，并在任意设备上随时接手。

homeFeatures:
  - icon: 📥
    title: 对话聚合
    details: 把各个智能体自己的历史会话导入统一、可搜索的工作区——无论出自哪种工具，都汇聚成同一条时间线。
    link: /zh/guide/aggregation
    linkText: 了解更多
  - icon: 🤝
    title: 多智能体协作
    details: 主智能体将任务委派给不同类型的子智能体（Claude Code 调用 Codex、Gemini……）共同完成，每个子智能体作为独立会话运行。
    link: /zh/guide/multi-agent
    linkText: 了解更多
  - icon: 🚀
    title: 项目引导
    details: 通过实时预览的分屏可视化地脚手架新项目，然后直接在工作区中打开。
    link: /zh/guide/project-boot
    linkText: 了解更多
  - icon: 💬
    title: 聊天频道
    details: 从 Telegram、飞书（Lark）和 iLink（微信）驱动你的智能体——创建任务、审批权限、获取实时回复。
    link: /zh/guide/chat-channels
    linkText: 了解更多
  - icon: 📄
    title: Office 文档
    details: 通过内置的 officecli 创建、分析、校对和编辑 .docx / .xlsx / .pptx，并支持标签页内实时预览。
    link: /zh/guide/office
    linkText: 了解更多
  - icon: 🔬
    title: 科学研究
    details: 内置科研技能——假设、实验设计、统计、可视化——任何智能体都可调用。
    link: /zh/guide/research
    linkText: 了解更多
  - icon: ⚡
    title: 自动化
    details: 将一套 composer 配置保存为可复用的自动化，以无头方式按 cron 计划或按需运行。
    link: /zh/guide/automations
    linkText: 了解更多
  - icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5"/><path d="M10 5h4M11 18.5h2"/></svg>'
    title: 原生 iOS 与 Android
    details: 通过原生移动客户端发起会话、跟进实时回复、处理审批并浏览项目；智能体则继续在你的电脑上运行。
    link: /zh/getting-started/installation#mobile-apps
    linkText: 获取应用
---

<div class="light-only home-hero-workspace">
  <img src="/images/main-light.png" width="3026" height="2048" alt="Codeg 主界面" decoding="async">
</div>

<div class="dark-only home-hero-workspace">
  <img src="/images/main-dark.png" width="3026" height="2048" alt="Codeg 主界面" decoding="async">
</div>

<nav class="home-hero-actions" aria-label="开始使用 Codeg">
  <a class="home-hero-action home-hero-action--primary" href="/zh/getting-started/installation">下载 Codeg →</a>
  <a class="home-hero-action" href="/zh/getting-started/">什么是 Codeg？</a>
  <a class="home-hero-action no-icon" href="https://github.com/spacering-net/codeg">在 GitHub 上查看</a>
</nav>

<MobileShowcase />

<HomeFeatures />
