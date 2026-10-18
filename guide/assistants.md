---
title: Assistants
description: Save an agent with every one of its options and a set of standing instructions as an assistant, then @-mention it — or let the lead agent pick it by its description — to hand off a task with exactly that setup.
---

# Assistants

An **assistant** is a delegation you've set up once: an agent, every one of its options picked, standing instructions it follows on every task, and a name, an avatar and a description. Mention it with `@` in the message box and the agent you're talking to hands it the task — the [delegation](/guide/multi-agent) you'd have asked for anyway, without restating which agent, which model, which mode and which rules every time. The lead can also pick one on its own, going by its description. Assistants arrived in **0.36.0**.

::: warning Delegation has to be on
An assistant is a delegation, so it needs **Enable delegation** under **Settings → Collaboration → Multi-Agent Collaboration → General**, which is off by default — and, as with any delegation, a lead agent that was started after you switched it on. While it's off, the Assistants tab says so, with a **Go to General** button. → [Turn it on](/guide/multi-agent#turn-it-on)
:::

## Create one {#create-one}

Open **Settings → Collaboration → Multi-Agent Collaboration → Assistants** and choose **New assistant**. The editor has three parts.

- **Avatar, name and description.** The name is up to 40 characters, unique among your assistants whatever the case. The description, up to 200 characters, says **when to use** this assistant: it's shown under the name in the mention panel, and handed to the delegating agent, which goes by it when it picks an assistant itself. The avatar starts as the name's first letter, on a colour chosen from the name. Click it for **Letter**, **Emoji** — sixty to pick from, or type your own — or **Image**, an upload cropped to a square and scaled down to 128×128. Letter and emoji avatars take one of ten colours.
- **Agent, and every one of its options.** Pick the agent — a disabled one isn't offered, and one that isn't installed is listed but can't be picked — and then a value for **each** of its options: the model first, which loads the options that go with it, then the rest in the agent's own order. Nothing is preselected and there's no *Default*, because an assistant runs with what you chose; the agent's recommended value is only marked **Recommended**. Saving stays blocked until every option the agent offers values for has one, and the footer counts what's still to pick.
- **Standing instructions** — up to 20,000 characters, with a live count: the role and the working rules this assistant follows. They're handed to the agent with **every** task it's given, a resumed one included, and they don't show among the messages of its session.

**Create** saves the assistant, switched on. Changes on this tab take effect as you make them — there's no **Save** to press here, unlike the tab's two neighbours.

## Use one {#use-one}

**Mention it.** Type `@` in the message box. Since 0.36.0 the mention panel has an **Assistants** tab, right after **Agents**, listing the assistants that are switched on and whose agent is enabled. Pick one and it lands as a badge with its avatar. Like an [agent mention](/guide/multi-agent#delegate-with-an-mention), it's read as an explicit instruction to delegate that work to that assistant, so say what the task is in the same breath:

```text
@Reviewer check the changes on this branch before I merge them.
```

The same panel works in the [to-do](/guide/tasks) and [automation](/guide/automations) editors, for a task or a run whose agent should hand work on.

**Or let the lead choose.** The delegate tool tells the lead which assistants were switched on when its session started — each one's name, agent and description — so a lead deciding who should take a piece of work can pick an assistant by its description. One you create later can still be reached from the same session by mentioning it, since an assistant is looked up at the moment the lead calls it; the lead's own list catches up the next time its agent starts.

## What runs {#what-runs}

Delegating to an assistant runs **its setup**: its agent, its saved options and its standing instructions. The lead decides only the task and, if it wants, the folder to work in. Whatever agent the lead names is ignored, and your [Agent defaults](/reference/settings/collaboration#multi-agent-collaboration) don't apply — they're for delegations to a plain agent. An option the agent has added since you saved the assistant keeps the agent's own value, and so does one whose saved value the agent no longer offers — after an update, say — since that value is skipped when the sub-agent starts rather than failing the task. When the editor marks an option *Unavailable*, pick again.

The sub-agent keeps a snapshot of the assistant as it was when the task began, so a cut-off task that's [resumed](/guide/multi-agent#a-sub-task-that-was-cut-off-can-be-picked-up) runs on the same setup even if you've edited or deleted the assistant in the meantime.

From there it's an ordinary delegation: a card in the lead's reply, a conversation of its own, its own permission prompts. The card shows the assistant's avatar with a small mark of the agent it ran on, and its name followed by the agent's. The sub-agent's [Session Details](/guide/side-panel#session-details) carry an **Assistant** row, and its row in the sidebar wears the assistant's avatar instead of the agent's icon.

## When it doesn't go through {#when-it-doesn-t-go-through}

The delegation card's badge says why:

| Badge | What happened |
| ----- | ------------- |
| **assistant not found** | It was deleted or switched off, or the lead named an id that doesn't exist. The lead is told which assistants it can use — and not to give the task to another agent instead |
| **spawn failed** | The assistant's agent is disabled or not installed |
| **needs restart** | Codeg hasn't finished upgrading. Restart **Codeg** — not the agent — and try again |
| **no answer** | Codeg didn't answer in time, and the lead is told to try again shortly |

## Manage them {#manage-them}

The **Assistants** tab lists them in order, each with its avatar, its description, and its agent followed by up to three of its saved choices. A chip marks one whose agent is **not installed** or **disabled**.

- **Reorder** by dragging a row's handle, or focus the handle and press **↑** or **↓**.
- **Switch one off** with its switch. It leaves the mention panel at once and can't be delegated to; a lead that was already running still lists it until its agent next starts, but a call to it is refused. It stays here until you switch it back on.
- **Edit** with the pencil, or by clicking the row. If the agent's options have changed since you saved — a value it no longer offers, an option it has added — the editor marks them, *Unavailable (was …)* or **New**, and asks you to pick again. An assistant whose agent is disabled or not installed shows its saved options read-only.
- **Duplicate**, on the **⋯** menu, makes a copy named *Name (2)*.
- **Delete** asks first. The assistant leaves settings and the mention panel and can't be delegated to again, but delegation cards already in your conversations keep showing it, marked *(deleted)*.

[Configuration sync](/reference/settings/system#configuration-sync) carries your assistants to your other machines; one that arrives with the name of a different assistant already there is renamed *Name (2)*.

## Good to know {#good-to-know}

- **An assistant is a preset, not a colleague.** It keeps no memory between tasks: each delegation starts cold, from the task the lead writes and the standing instructions. Write the instructions as rules for any task, and keep what's particular to one task in the message.
- **The instructions reach the agent's provider.** They're part of the prompt the sub-agent sends its model, and the agent's own history on disk keeps them, even though Codeg doesn't show them in the session.
- **Who can use one.** Any agent that can [lead a delegation](/guide/multi-agent#how-delegation-works) — sixteen of the nineteen built-ins — can hand work to an assistant. The assistant's own agent can be any agent you can delegate to.

## Next steps

- [**Multi-Agent Collaboration**](/guide/multi-agent) — how delegation works, and the patterns worth building assistants for.
- [**Settings → Collaboration**](/reference/settings/collaboration) — the Assistants tab beside the delegation switches and the Agent defaults.
- [**Per-Agent Setup**](/guide/agent-setup) — what each agent's options mean before you pin them in an assistant.
