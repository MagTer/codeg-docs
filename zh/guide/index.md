---
title: 指南
description: 如何使用 Codeg——工作区、内置浏览器、电脑操作、无限画布、对话聚合与 Token 用量、智能体与多智能体协作、聊天频道、自动化、待办任务，以及 Office、科学研究和项目工作流。
---

# 指南

你已经[安装了 Codeg](/zh/getting-started/installation) 并运行了第一个会话。本指南涵盖此后的一切——如何真正完成工作，从你日常使用的编码界面，到构建于其上的智能体、频道、自动化和专门的工作流。*（初次接触本项目？[简介](/zh/getting-started/)介绍了 Codeg 是什么以及它背后的思考。）*

这些页面按**由核心向外**的顺序排列：从基础部分开始，引入智能体并让它们协作，然后根据工作需要取用任何功能。每个页面都可独立阅读，因此尽管直接跳到你想要的内容。

::: tip 不确定从哪里开始？
阅读**[工作区](/zh/guide/workspace)**，了解每个会话运行所在的界面，然后阅读**[使用智能体](/zh/guide/agents)**，让智能体在其中开始工作。对招牌功能感到好奇？直接跳到**[多智能体协作](/zh/guide/multi-agent)**。
:::

## 基础 {#essentials}

每个 Codeg 会话运行所在的界面——请先学习这些。

- [**工作区**](/zh/guide/workspace)——集成的工程闭环：文件树、编辑器与差异视图、git 变更、提交，以及一个内嵌终端，全部与智能体并排呈现——当一个项目并非全貌时，还可以[同时纳入多个文件夹](/zh/guide/workspace#work-across-several-folders)。
- [**内置浏览器**](/zh/guide/browser)——网页以标签页的形式开在你的文件旁边：对话和终端里的链接、开发服务器、本地 HTML 的受限视图，以及一个你可以递给对话（还可以先加上标注）、或共享给智能体的页面。
- [**电脑操作**](/zh/guide/computer-use)——把一个桌面窗口、整个应用或整个屏幕共享给你的智能体，仅读取或读取并操作，一键就能全部停下。预览功能。
- [**无限画布**](/zh/guide/canvas)——把你的工作铺在空间里的画板，想建多少块都行：绑定到文件夹的区域、由你亲手整理的收藏区、钉在上面的文件和终端，以及可以展开成正在进行的对话的卡片。
- [**对话聚合**](/zh/guide/aggregation)——将你在每个受支持智能体中的现有会话汇聚到一个可搜索的工作区中，并从任意会话中断处继续。
- [**Git 与 Worktree**](/zh/guide/git)——查看差异、暂存与提交、管理远程仓库，并借助内置的 git worktree 并行开展工作。
- [**Token 用量**](/zh/guide/token-usage)——你的智能体到底花了多少，按天、文件夹、智能体和模型拆开看，按 API 标价算要花多少钱，还有缓存命中率和一张可以分享的卡片。

## 智能体 {#agents}

Codeg 与具体智能体无关——用一致的界面驾驭众多编码 CLI。

- [**使用智能体**](/zh/guide/agents)——启用某个智能体，运行其预检，然后开始一个会话。
- [**支持的智能体**](/zh/guide/supported-agents)——完整名录，以及每个智能体在磁盘上保存会话的位置。
- [**自定义智能体**](/zh/guide/custom-agents)——注册任何其他兼容 ACP 的智能体：从公开注册表中挑一个，或粘贴它的 distribution JSON。
- [**认证与模型**](/zh/guide/authentication)——使用智能体自带的订阅方案登录、将其指向自定义端点，或使用提供商 API 密钥，并选择你的模型。
- [**多智能体协作**](/zh/guide/multi-agent)——让主智能体在单个任务中把工作委派给其他类型的子智能体，每个子智能体作为各自独立的会话运行。

## 频道与自动化 {#channels-automation}

无需坐在 Codeg 前也能驱动它。

- [**聊天频道**](/zh/guide/chat-channels)——连接 Telegram、Lark (Feishu) 和 iLink (Weixin)，即可创建任务、批准权限并获取实时更新——全部在你的聊天应用中完成。
- [**自动化**](/zh/guide/automations)——将完整配置好的 composer 保存为可复用的自动化，并以无头方式按 cron 计划或按需运行。
- [**待办任务**](/zh/guide/tasks)——把要做的事写下来，让智能体一件件做完，每个任务都在自己的 git worktree 中进行，在你验收之前不会合并任何东西。
- [**仓库面板**](/zh/guide/repository)——把一条 GitHub、GitLab 或 Gitea 的 issue 或 pull request 直接交给智能体，或者让面板按计划、或在收到 webhook 时自己把它们接过去，再把结果作为 pull request 或一条评论送回去。

## 扩展 Codeg {#extending-codeg}

为每个智能体赋予更多工具和更多专业知识。

- [**MCP 服务器**](/zh/guide/mcp)——通过本地扫描或内置注册表添加 Model Context Protocol 服务器，以扩展你的智能体的能力。
- [**技能**](/zh/guide/skills)——将可复用的技能包安装到共享存储中，并在全局或项目范围为你选定的智能体启用它们。

## 领域工作流 {#domain-workflows}

为特定类型的工作量身打造的模式。

- [**Office 文档**](/zh/guide/office)——通过内置的 officecli 创建、分析、校对和编辑 `.docx`、`.xlsx` 和 `.pptx` 文件，并在标签页内实时预览。
- [**科学研究**](/zh/guide/research)——一套精选的研究技能，涵盖从假设与实验设计到分析与撰写的全过程，任何智能体都可调用。
- [**项目引导**](/zh/guide/project-boot)——以可视化方式脚手架搭建新项目，在左侧进行配置，右侧的实时预览同步更新。

在服务器而非桌面上运行 Codeg？这里的一切在浏览器中同样有效——参见[部署](/zh/getting-started/deployment)和[配置](/zh/getting-started/configuration)。
