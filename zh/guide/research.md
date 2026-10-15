---
title: 科学研究
description: 将任意编码智能体变成研究助手——一个精选的科学研究技能包，把一项研究从模糊的想法带到可检验的假设、严谨的设计、真实的统计、可供发表的图表，以及一次文献检索。
---

# 科学研究

Codeg 内置了一个精选的**科学研究技能**库，能把它的任意编码智能体变成研究助手。它们贯穿一项研究的整个历程——从一个雏形初现的想法，到一个可检验的假设、一份严谨的实验设计、一次诚实的功效计算、真实的统计分析、可供发表的图表，以及一次文献检索。你调用它们的方式与调用任何[技能](/zh/guide/skills)相同：键入 `/` 并选取一个。

[Office 技能包](/zh/guide/office)产出研究*成果物*——演示文稿、论文、工作簿——而 Science 技能包提供的是*方法*：如何界定一个问题、设计研究、跑统计，以及评估结果。两者可以很好地组合；本页讲的是思考的那一半。

这些技能是逐字节从开源项目 [K-Dense-AI/scientific-agent-skills](https://github.com/K-Dense-AI/scientific-agent-skills)（MIT 许可）原样引入的，烘焙进 Codeg，并像任何技能包一样按智能体启用。

## 启用研究技能 {#enable-the-research-skills}

Science 技能包位于**设置 → 技能包 → 科学研究** 下。它与其他技能包共享同一套[中央存储和启用模型](/zh/guide/skills#enable-a-curated-skill-pack)：一个**技能与智能体矩阵**，你在其中勾选你的每个智能体获得哪些技能，Codeg 便会把它们链接进该智能体自己的技能目录。这里没有任何针对特定智能体的魔法——一个已链接的科学技能，只不过是该智能体 `/` 菜单中的一个技能而已。

Science 矩阵上会出现两个 Experts 技能包所没有的徽标——它们标示某个技能的*自身工作流*在运行前需要某些东西：

- **可能需要设置**——该技能附带一些辅助脚本，它们期望一个 **Python**（通常是 `uv`）环境。它仍然能正常链接；只是由脚本支撑的步骤需要该环境存在。该技能自己的 `SKILL.md` 列出了需要安装什么。
- **需要 API 密钥**——该技能的主工作流会调用一个需要密钥的外部服务。只有一个技能带有此标记（Scientific Schematics——见下文）；它像其他技能一样链接，但绘图步骤需要先设置好密钥。

::: tip 启用总是有效的——设置关乎技能本身，而非链接
**可能需要设置**或**需要 API 密钥**徽标从不会阻止启用。它只是提醒你该技能的*工具*有一项前置条件。密钥存放在智能体其他凭据所在的地方——一个智能体运行时所用的环境变量。→ [凭据存放在哪里](/zh/guide/authentication#where-credentials-are-stored)
:::

## 研究技能 {#the-research-skills}

十三个技能，按它们服务的研究阶段分组。每个技能都有自己的 `/` 调用方式，并了解其专业领域的惯例：

| 阶段 | 技能 | 作用 | 设置 |
| ----- | ----- | ------------ | ----- |
| **构思** | **Scientific Brainstorming** | 探索跨学科联系、挑战假设、揭示研究空白 | — |
| | **Hypothesis Generation** | 把观察转化为带有预测和机制的可检验假设 | Python |
| **研究设计** | **Experimental Design** | 随机化、区组、对照，以及析因/DOE 布局——*在*你收集数据*之前* | Python |
| | **Statistical Power** | 样本量与功效分析、最小可检测效应、功效曲线 | Python |
| **分析** | **Statistical Analysis** | 检验选择、假设检查、效应量、APA 风格报告 | Python |
| | **Exploratory Data Analysis** | 对 200+ 种格式的数据文件进行自动化探索，并附质量报告 | Python |
| **可视化** | **Scientific Visualization** | 可供发表的图表——多面板布局、显著性标注、期刊格式 | Python |
| | **Scientific Schematics** | AI 生成的示意图——通路、架构、流程图 | API 密钥 |
| **评估** | **Critical Thinking** | 评判论断与证据——偏倚、混杂因素、GRADE 和偏倚风险 | — |
| | **Peer Review** | 基于清单的稿件与基金评审、CONSORT/STROBE 合规性 | Python |
| | **Scholar Evaluation** | 用 ScholarEval 框架为研究工作打分——从选题到写作 | Python |
| **文献** | **Paper Lookup** | 检索 10 个学术 API（PubMed、arXiv、OpenAlex、Crossref……）以获取论文和全文 | — |
| | **Citation Management** | 核验元数据并生成准确的 BibTeX——DOI 转 BibTeX、参考文献校验 | Python |

有两个值得特别提及。**Paper Lookup** 可访问十个开放的学术 API，且**不需要密钥**——这是一个无需密钥的文献检索，你可以立即启用并使用。**Scientific Schematics** 是唯一需要 API 密钥的技能：它通过一个 AI 图像模型来渲染图示，并需要一个 **OpenRouter** 密钥。

你只需启用某个特定智能体会用到的那些——一个做数据分析的智能体想要的是统计和 EDA 技能，而不是同行评审那一套。

## 从欢迎界面开始 {#start-from-the-welcome-screen}

一个新的对话会显示快捷操作标签页；**科学研究**标签页是快速进入的方式。它把前三个技能——**Scientific Brainstorming**、**Hypothesis Generation**、**Experimental Design**——作为醒目的卡片推荐，其余的精选技能则排在一个可滚动的行中。点击其中一个会放入该技能，并**填充一段起始提示词**，由你用自己的话补全：

```text
/scientific-brainstorming Help me brainstorm research directions — explore
interdisciplinary connections, challenge assumptions, and surface promising
gaps. The area I'm exploring: circadian regulation of gut microbiota
```

如果某个技能未为当前智能体启用，它的卡片会显示一把**锁**——点击它，Codeg 会指引你前往设置将其开启。更喜欢打字？在 composer 中键入 `/` 会列出每一个已启用的技能，因此 `/paper-lookup` 或 `/statistical-analysis` 无需碰卡片即可使用。*（Codex 使用 `$` 而非 `/`。）*

那四个未被推荐的技能——**Peer Review**、**Citation Management**、**Scholar Evaluation**、**Scientific Schematics**——没有欢迎卡片，但一经启用，它们就在 `/` 菜单和设置矩阵中。

## 一次端到端的研究会话 {#a-research-session-end-to-end}

这些技能被设计为可以彼此交接，因此单次对话就能走完整个生命周期：

1. **界定它。** 用 `/scientific-brainstorming` 拓宽问题，然后用 `/hypothesis-generation` 把它打磨成带有预测和机制的东西。
2. **设计它。** `/experimental-design` 布置对照与随机化；`/statistical-power` 在你花一周去收集样本之前，告诉你实际需要多少样本。
3. **分析它。** 让 `/exploratory-data-analysis` 对准你的数据文件做第一遍，然后用 `/statistical-analysis` 挑选正确的检验、检查其假设，并报告效应量。
4. **展示它。** `/scientific-visualization` 渲染可供发表的图表；`/scientific-schematics` 绘制机制示意图。
5. **压力测试它。** `/scientific-critical-thinking` 和 `/peer-review` 会像审稿人那样评判论断和成稿；`/paper-lookup` 和 `/citation-management` 则将其扎根于文献之中，并生成整洁的 BibTeX。

由脚本支撑的技能（那些 **Python** 技能）会运行它们的分析，并把输出——报告、图表——直接落到你的工作文件夹中，在那里它们会在一个[工作区标签页](/zh/guide/workspace)中打开。当科学部分尘埃落定，而你想要一份真正的 `.docx` 或幻灯片形式的成稿时，把结果交给 [Office 技能包](/zh/guide/office)。

## 须知 {#good-to-know}

- **“可能需要设置”关乎技能的脚本，而非 Codeg。** 统计、EDA、可视化，以及大多数评估/文献技能都附带 Python 辅助脚本；启用会立即链接它们，但这些步骤只有在智能体所工作的机器上具备 Python/`uv` 环境后才会运行。每个技能的 `SKILL.md` 都详细说明了它的依赖。
- **一个密钥，一个技能。** 只有 Scientific Schematics 需要 API 密钥（OpenRouter，用于 AI 渲染的图示）。其余一切——包括接入十个 API 的 Paper Lookup——都无需密钥即可运行。
- **它们会自行保持最新。** 因为该技能包被内置进 Codeg，并在每次升级时被重新提取到中央存储，已启用的技能会跟随所引入的上游，无需你操作。就地编辑其中一个，Codeg 会将它标记为**用户已修改**并保留你的版本。
- **按智能体启用，像任何技能一样调用。** 同一个矩阵、同样的 `/id`（Codex 为 `$id`）、对已经打开的会话同样使用**重新连接以应用**。→ [技能](/zh/guide/skills) · [配置智能体](/zh/guide/agents#configure-an-agent)
- **在服务器上运作方式相同。** 技能包界面在浏览器版本中；技能位于 Codeg 运行所在的机器上。

## 后续步骤 {#next-steps}

- [**技能**](/zh/guide/skills)——完整的启用矩阵，以及如何编写你自己的技能。
- [**Office 文档**](/zh/guide/office)——借助实时预览把研究结果变成真正的 `.docx`、`.xlsx` 和 `.pptx` 文件。
- [**MCP 服务器**](/zh/guide/mcp)——为智能体提供内置技能之外的实时数据工具和 API。
- [**使用智能体**](/zh/guide/agents)——挑选并登录将执行研究的智能体。
