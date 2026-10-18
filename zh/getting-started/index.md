---
title: 简介
description: Codeg 是一个多智能体编程工作区——在一个地方运行、聚合并编排不断壮大的 AI 编程智能体家族。
---

# 简介

**Codeg 是一个多智能体编程工作区**——在一个地方运行、聚合并编排不断壮大的 AI 编程智能体家族。

Codeg 不会将你绑定到单一助手，而是把 Claude Code、Codex CLI、Google Antigravity、OpenCode、Qoder 以及[更多智能体](/zh/guide/supported-agents)汇聚到一个共享工作区中——然后让它们*协同*工作：一个主导智能体可以把子任务交给其他类型的智能体，每个智能体都作为独立会话运行。你负责指挥，它们负责协作。

<div class="stat-strip">
  <div class="stat"><span class="stat__num">19</span><span class="stat__label">个编程智能体，一个工作区</span></div>
  <div class="stat"><span class="stat__num">3</span><span class="stat__label">个聊天频道来驱动它们</span></div>
  <div class="stat"><span class="stat__num">3</span><span class="stat__label">种托管方式——桌面 · 服务器 · Docker</span></div>
  <div class="stat"><span class="stat__num">0</span><span class="stat__label">遥测——默认本地优先</span></div>
</div>

![Codeg 导览](/images/gallery.svg)

<div class="cta-row">
  <a class="cta cta--brand" href="/zh/getting-started/installation">下载 Codeg →</a>
  <a class="cta" href="/zh/getting-started/deployment">运行服务器</a>
  <a class="cta" href="/zh/guide/">浏览指南</a>
</div>

## Codeg 为何存在 {#why-codeg-exists}

在软件发展的大部分历史中，工作的单位一直是按键。随后出现了自动补全，接着是聊天，如今则迎来了一代**智能体式（agentic）**工具——它们几乎全凭自身之力就能包揽整个任务：规划、编辑文件、运行命令并不断迭代。

这一转变既引人瞩目，也伴随着混乱。最强大的那些智能体各自作为独立的命令行工具发布，各有自己的模型、强项、会话格式和主目录。在日常使用中，一次只用一个智能体会留下实实在在的缺口——而弥合这些缺口正是 Codeg 的全部意义所在：

<div class="beforeafter">
  <div class="ba ba--before">
    <p class="ba__title">独自应付各种智能体 CLI</p>
    <ul>
      <li>历史记录散落在 <code>~/.claude</code>、<code>~/.codex</code>、<code>~/.gemini</code> 以及十几个各自为政的孤岛中</li>
      <li>每个智能体各自为战——无法让 Claude Code 在某个棘手步骤上借助 Codex</li>
      <li>被拴在笔记本电脑上的交互式终端里</li>
    </ul>
  </div>
  <div class="ba ba--after">
    <p class="ba__title">使用 Codeg</p>
    <ul>
      <li>横跨你所运行的每一个智能体的单一可搜索时间线</li>
      <li>主导智能体在会话进行中将子任务委派给其他智能体</li>
      <li>桌面端或服务器承载核心，原生 iOS 与 Android 客户端随身连接</li>
    </ul>
  </div>
</div>

Codeg 押注于一点：面对日益碎片化的智能体格局，答案不是选出一个赢家，而是**编排**——一个开放、不锁定特定智能体的工作区，让你博采各家之长。

> 软件工作的单位正在从按键转向任务——也从单一助手转向一支智能体团队。Codeg 正是为这一转变而打造的工作区。

## Codeg 能做什么 {#what-codeg-does}

三个理念定义了这个工作区。

### 1. 聚合——为每个智能体提供统一的归处 {#_1-aggregate-—-one-home-for-every-agent}

Codeg 读取你的智能体自己的会话存储，并将它们汇入一个统一、可搜索的工作区。你的 Claude Code、Codex、Gemini 和 OpenCode 历史记录不再散落在各自独立的目录中，而是汇成一条可供你浏览、恢复和搜索的时间线——无论它们出自哪个工具。

如今已有十九个智能体接入，各有自己的模型、强项和会话格式：

<AgentRoster />

→ [支持的智能体](/zh/guide/supported-agents)

### 2. 协作——像团队一样工作的智能体 {#_2-collaborate-—-agents-that-work-as-a-team}

在单个会话中，一个主智能体可以将子任务委派给*不同类型*的子智能体——Claude Code 在某一步转向 Codex，在另一步转向 Gemini——每一次被委派的运行都会成为一个独立的一级会话，供你打开并查看。这构建于开放的 **[Agent Client Protocol（ACP）](https://agentclientprotocol.com)** 之上，并借助一个小巧的 `codeg-mcp` 伴生程序，向智能体自身暴露一个 `delegate_to_agent` 工具。

<div class="light-only">

![Codeg 中的多智能体协作](/images/collaboration-light.png)

</div>

<div class="dark-only">

![Codeg 中的多智能体协作](/images/collaboration-dark.png)

</div>

→ [多智能体协作](/zh/guide/multi-agent)

### 3. 运维——将智能体作为一等基础设施 {#_3-operate-—-agents-as-first-class-infrastructure}

Codeg 把智能体视为你可以*运行*的东西，而不仅仅是与之聊天的对象：

- **[自动化](/zh/guide/automations)**——保存一套完整配置的设置，以无头方式按 cron 计划或按需运行。
- **[待办任务](/zh/guide/tasks)**——把要做的事写下来，让智能体一件件做完，每个任务都在一份独立的代码副本中进行，且在你验收之前都不会合并。
- **[仓库面板](/zh/guide/repository)**——把一个项目的 GitHub、GitLab 或 Gitea issue 与 pull request 列出来，把其中一条交给智能体——或者让面板自己把符合条件的接过去——再把结果作为 pull request 送回去。
- **[电脑操作](/zh/guide/computer-use)** *（预览）*——把一个桌面窗口、整个应用或整个屏幕共享给你的智能体，让它们看得见、能上手操作，一键就能让它们停下。
- **[聊天频道](/zh/guide/chat-channels)**——从 Telegram、Lark（飞书）或 iLink（微信）驱动会话：创建任务、批准权限，并实时获得回复，无需打开浏览器。
- **[随处使用](/zh/getting-started/installation)**——在桌面应用、独立服务器或 Docker 中运行智能体，再通过原生 iOS、Android 客户端或任意浏览器保持连接。
- **[可扩展](/zh/guide/mcp)**——MCP 服务器和[技能](/zh/guide/skills)可添加工具与专业能力，而内置的 [Office](/zh/guide/office) 和[科学研究](/zh/guide/research)工具集则赋予智能体真实世界的能力，[界面渲染](/zh/guide/skills#cards-tables-and-charts-in-replies)还能让它们用卡片、表格和图表作答。新项目从[项目引导](/zh/guide/project-boot)开始。

<div class="light-only">

![在 Codeg 中处理 Office 文档](/images/office-light.png)

</div>

<div class="dark-only">

![在 Codeg 中处理 Office 文档](/images/office-dark.png)

</div>

## 为保持开放而生 {#built-to-stay-open}

Codeg 刻意不对你*应该*使用哪个智能体持有成见，并谨慎对待你的数据：

- **智能体无关。** 新智能体通过 ACP 接入，而非借助定制集成，因此工作区会随生态系统一同成长。
- **本地优先。** 解析、存储和项目操作默认都在你的机器上进行；网络调用只会因你自己发起的事情而发生。参见[隐私与安全](/zh/reference/privacy)。
- **一个内核，四个二进制文件。** 一个共享的 Rust 内核同时驱动桌面应用、独立服务器、MCP 伴生程序和电脑操作 helper；原生移动客户端则通过经过认证的 API 连接到这个内核。参见[架构](/zh/reference/architecture)。

Codeg 站在开放工作的肩膀之上——用 [Agent Client Protocol](https://agentclientprotocol.com) 实现智能体连接，用 [Superpowers](https://github.com/obra/superpowers) 提供专家技能，用 [OfficeCLI](https://github.com/iOfficeAI/OfficeCLI) 处理文档，用 [scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills) 支持科研。

## 未来之路 {#the-road-ahead}

智能体生态仍在不断倍增——每个月都有新模型、新 CLI、新专长涌现。Codeg 的方向是顺应这条曲线而非与之对抗：更多受支持的智能体、更多频道（Discord、Slack 和钉钉即将到来）、它们之间更丰富的协作模式，以及更深入的无头自主能力。项目引导基于标签页的脚手架也被设计为能够超越其首个模板持续成长。

目标始终不变：一个与智能体保持同步的工作区，让你随时都能取用最好的工具——或者同时取用好几个——而这一切都无需离开同一个工作区。

## 后续步骤 {#next-steps}

<div class="nextsteps">
  <a class="nextstep" href="/zh/getting-started/installation">
    <span class="nextstep__title">下载与安装 →</span>
    <span class="nextstep__desc">获取桌面、iPhone、iPad 或 Android 版 Codeg，并连接你的第一个工作区。</span>
  </a>
  <a class="nextstep" href="/zh/guide/supported-agents">
    <span class="nextstep__title">支持的智能体 →</span>
    <span class="nextstep__desc">了解 Codeg 聚合了哪些智能体，以及每个智能体将会话存储在何处。</span>
  </a>
  <a class="nextstep" href="/zh/guide/">
    <span class="nextstep__title">指南 →</span>
    <span class="nextstep__desc">多智能体协作、频道、自动化等更多内容。</span>
  </a>
  <a class="nextstep" href="/zh/getting-started/deployment">
    <span class="nextstep__title">部署 →</span>
    <span class="nextstep__desc">桌面、独立服务器和 Docker 选项。</span>
  </a>
</div>
