---
title: Token Usage
description: The dashboard behind the session counter — how many tokens your agents actually spent, broken down by day, folder, agent and model, what they'd cost at API list prices, a cache-hit reading and a share card.
---

# Token Usage

Most agents record what they spent, and each one keeps that number in its own transcript, in its own format, in its own directory. **Token Usage** is the one place they're added up: a full report of what your agents have actually consumed, across every folder and every agent, over any window you choose.

It answers the questions you can't answer from a single conversation. Which project is expensive. Whether that new model is really cheaper. How much of your context is being served from cache instead of billed fresh. When, in an average week, you actually build.

## Open it

The **session counter in the status bar** — the *"N conversations"* along the bottom edge — is the way in. Click it and Codeg opens the report. Nothing else needs configuring.

On a brand-new install the page says **Nothing counted yet** and offers **Count my sessions**: Codeg has to read your agents' transcripts once before it has anything to add up. After that it keeps itself current as you work.

The headline session count is built to **reconcile with that status-bar number** — set the range to *All time* and the two agree, rather than leaving you to wonder which one is lying.

## What it counts

Codeg doesn't estimate the tokens. It reads the **usage each agent wrote down itself** — input, output, cache write and cache read, per turn — out of that agent's own transcript, and stores one row per turn so a report doesn't have to re-parse gigabytes of history to draw a chart.

That sync is incremental: a conversation is re-parsed only when its record has moved since the last pass, which includes the moment an [imported session](/guide/aggregation) comes back into view after growing in the agent's own CLI. An empty parse never erases usage that was already recorded.

A few consequences worth knowing:

- **The numbers are the agents' numbers.** Codeg is doing arithmetic, not metering — so what you see here is what your provider saw, subject to what the agent chose to report.
- **An agent that records nothing contributes no tokens.** **Cursor** writes no token counts anywhere, and **Kiro CLI** records every counter as zero, so their sessions add nothing to the totals, the breakdowns, or the heaviest-sessions list — reporting a confident zero would be worse than reporting nothing. They do still count as **sessions**, since the headline session number follows your workspace list rather than the token table, which is what keeps it agreeing with the status bar. So if Cursor is a real part of your rotation, read the per-session averages knowing they're divided by sessions that couldn't contribute.
- **The tokens are counted; the price is estimated.** Since **0.35.2** the page also says what the tokens would cost at the providers' API list prices — an estimate, labelled as one, and never your bill: what you actually pay depends on your plan. → [What it would cost at list price](#what-it-would-cost-at-list-price)
- **Dimensions are read live.** Folder, agent and deletion state are joined from the conversation itself, so moving a folder or deleting a session lands in the report without a re-sync.
- **Hermes reports per session, not per turn.** Its per-message rows carry no input/output split, so counting only per-turn usage would report those conversations as zero — a confident wrong number. Instead the session total is written as a single entry, filed at the session's last turn. Right for every total and breakdown; coarse only on the time axis.
- **Grok's numbers were wrong until 0.26.2.** Every Grok session read *output 0, cache read 0, cache write 0*, because Codeg was reading how full the **context window** was rather than what the session had **spent** — in one captured session, 26,827 shown against 495,523 actually used. The four buckets now come from Grok's own per-turn figures and add up to its own total. The context ring is unaffected: occupancy is what it was always measuring. That fix didn't sweep your history by itself — a Grok session was re-read the next time it *moved*, and older ones kept their old numbers until **Rebuild all** — but the full rebuilds that came with 0.35.0 and 0.35.2 re-read every agent, Grok included, so once a sync has run on one of those versions, every Grok session whose transcript can still be read is on the new numbers.
- **Cline 3.0.66 and later count output without reasoning.** From that version on, a reasoning model's *output* figure no longer includes its reasoning tokens, so it reads lower than the same work did before.
- **Codex stopped counting cache writes as fresh input in 0.35.0.** Its *input* column shrinks and its *cache write* column fills, while its totals stay what they were. **CodeBuddy's** totals grew in the same release, because requests that end in a tool call are counted now.
- **Qoder's sub-agents are counted since 0.35.2.** Before, what they spent wasn't counted at all, so a Qoder session's totals grow once it's recounted.

## Narrow the view

One toolbar row sits above the report:

| Control | What it offers |
| ------- | -------------- |
| **Time range** | **7 / 30 / 90 days** as segments, with **This month**, **This year**, **All time** and **Custom** folded behind **More** |
| **Group by** | **Day**, **Week**, or **Month** — each range preset suggests its natural bucket until you pick one yourself |
| **Folders · Agents · Models** | Searchable pickers, all-inclusive by default; **Reset filters** clears them together. A folder reads *alias [ name ]*, so an alias leads its real directory name instead of replacing it |
| **⋯** | **Refresh** (with the time it last ran), **Rebuild all**, and **Share** |

**Custom** opens a two-month calendar anchored a month back, so the second pane isn't all future and greyed out. Clicking into a range you've already finished starts a new one rather than dragging whichever end you didn't mean to touch.

Both the range and the buckets speak **your local calendar days**, end to end — a day is a day where you are, not where the database is.

## Read the report

**The headline** is total tokens for the range, with a [list-price estimate](#what-it-would-cost-at-list-price) under it and two things beside it: the change **vs. the previous period** of the same length, and a **cache-hit ring**. The ring is the one worth learning to read — it says how much of the context your agents worked with came out of cache instead of being computed fresh, and spells out what re-sending it at full price would have amounted to. Since **0.31.0** it reads to **one decimal**, here and on the share card and in the composer's own token popover, so the three surfaces print the same number instead of one of them rounding to a whole percent.

Under it, four tiles, each carrying an average as its subtitle:

| Tile | And beneath it |
| ---- | -------------- |
| **Sessions** | Average tokens per session |
| **Turns** | Average turns per session |
| **Active days** | Your longest unbroken streak |
| **Generation time** | Average per active day |

Then the panels:

- **Usage over time** — a stacked bar per bucket, splitting **cache read** from **fresh compute**, with the turn and session counts on each bar's tooltip. Beside it, the busiest bucket in the range and your peak hour of the day.
- **What the tokens were** — the same total broken four ways: **input** (what you sent), **output** (what the model wrote), **cache write**, and **cache read** (context you didn't pay full price for).
- **When you build** — a weekday-by-hour heatmap of your own local time, which tends to be the panel people screenshot. It names the hour your work is densest around.
- **Usage distribution** — the same range grouped **by folder**, **by agent**, or **by model**, ranked. **Click a row to filter the whole report by it**, which is how you get from *"Claude is most of my spend"* to *"…and almost all of it is this one repository"* in two clicks.
- **Heaviest sessions** — the individual conversations that cost the most, with their folder, agent and total.

::: info A range large enough to be flagged
Ask for something pathological — a decade of continuous heavy use — and the report says so: *"This range is very large, the numbers cover only the most recent slice of it."* Rows are read newest-first, so what you keep is the recent history the dashboard is mostly about.
:::

### What it would cost at list price {#what-it-would-cost-at-list-price}

Since **0.35.2** a muted line under the headline total reads **≈ $… API list**: what the range's tokens would cost bought at the providers' **base API list prices**, taken from the public [models.dev](https://models.dev) catalog. Hover it for what that does and doesn't include. In **Usage distribution**, the **By model** view adds the same estimate to each model's row — the top seven, in a window wide enough to show it.

- **Each bucket is priced on its own.** Input, output, cache writes and cache reads each go at that model's own rate. A bucket the catalog publishes no price for counts as unpriced, rather than borrowing another bucket's rate.
- **A model is priced at its maker's rate.** A model recorded as *provider/model* is priced from that provider's own listing. A plain model name goes to the company that makes it, where that company lists it — even when a cloud or a reseller sells it for something else — so a Claude model reached through a gateway is priced as Anthropic lists it, as long as the agent recorded the model's own name. With no maker's listing, a price is used when every seller agrees on it, or when the few large hosts Codeg prefers do; otherwise the model goes unpriced.
- **Some tokens may go unpriced.** A model nobody publishes a price for — a local one, a private deployment, an id the catalog doesn't know — is left out, and the line then says how much of the range it covers: *≈ $12.40 API list · 86% of tokens*. It never claims 100% while anything is missing. A turn that recorded no model of its own is priced by its session's model; one whose model can't be told even from that stays unpriced.
- **List price, not your bill.** It leaves out long-context and reasoning surcharges, and it says nothing about what a subscription charges, which works differently. Use it to compare models, agents and projects, not to reconcile an invoice.
- **Dollars only.** Small amounts keep more decimals, and *<$0.0001* is a real answer for a short session.

The rates are read on the machine running Codeg: from a copy cached for a day, else a fresh download of the catalog, else an older cached copy, else the snapshot built into Codeg — which since **0.35.2** carries cache prices too, so the estimate can price cache tokens offline. The download is a plain request for the public list, with nothing about your usage in it. The share card carries no prices.

## Share it

**Share** renders the view you're looking at as a poster card — *My AI coding stats* — with the range, the total, your top models and top projects, and an **archetype** picked from what the numbers actually say: *Night Owl*, *Early Bird*, *Weekend Warrior*, *Cache Master*, *Marathoner*, *Polyglot*, *Laser Focus*, *Deep Diver*, *Steady Builder*.

The card follows your **current theme** rather than pinning a palette of its own, so a card exported from a light gray theme doesn't come back purple. **Save image** writes a PNG; **Copy image** puts it on the clipboard.

The card is a snapshot of the range and filters in front of you — so filter first, then share, if you want to post one project rather than all of them.

## Refresh and rebuild

Two entries in the **⋯** menu, and the difference matters:

- **Refresh** — the incremental pass. It re-reads only the conversations whose records moved, shows a progress count while it works, and reports how many it counted. This is what runs on its own; you rarely need to press it.
- **Rebuild all** — re-parses every transcript from scratch, whether or not it looks stale. The escape hatch for a session that **grew outside Codeg** — you kept working in the agent's own CLI — and Codeg had no reason to look at it again. It doesn't wipe first: each conversation's rows are swapped one transaction at a time, so the dashboard is never briefly empty, and a transcript that happens to be unreadable right now keeps the numbers it already had instead of being erased and stamped as counted.

Only one sync runs at a time. A second one doesn't queue up behind the first; it's simply told one is already running, since re-parsing the same files twice buys nothing.

::: tip Your history is rebuilt when the counting changes
The stored rows carry the version of the accounting that produced them. When a release changes **how** tokens are counted — as 0.23.3 did, fixing Claude API calls being counted twice, Codex tool-calling rounds being missed, and Claude sub-agent usage being left out, and as **0.35.0** (Codex's cache writes) and **0.35.2** (Qoder's sub-agents) did again — the next sync rebuilds everything rather than trusting stamps that only ever tracked whether the *transcript* had moved. Otherwise the dashboard would serve a mix of old wrong numbers and new right ones indefinitely. A rebuild re-reads every agent, not just the one whose accounting changed, which is how CodeBuddy's tool-call requests reached your history in 0.35.0 too.
:::

## Good to know

- **Each turn is filed under its own timestamp.** A session that runs past midnight is split across both days, turn by turn — it isn't attributed wholesale to the day you started it. (Hermes is the exception, since its one session-wide entry has only one instant to sit at.)
- **Your usage stays local.** The facts live in Codeg's own database beside your conversations, computed from files already on your machine, and nothing about them is sent anywhere. The one request this page can make is for the public price list behind the estimate, and only when there's no cached copy less than a day old. → [Privacy & Security](/reference/privacy)
- **The status bar is the only entry point.** There's no sidebar row for it — the counter you were already looking at is the button.
- **A task costs a session.** Every [to-do](/guide/tasks) that runs is a full agent session with its own transcript, so four running at once show up here as four sessions' worth.
- **Context usage is a different number.** The ring beside the composer tracks how full *this conversation's* context window is right now; this page is cumulative spend across everything. → [Conversations](/guide/conversations#start-a-session-—-the-composer)
- **One conversation's totals are in its Session Details dialog** — open it from the conversation header's **⋮** menu. Since **0.37.0** the side panel's Session Details tab no longer shows them. → [The Side Panel](/guide/side-panel#session-details)
- **Claude Code's prompt guesses aren't here.** With its adapter at 0.92.0 or later, Claude Code makes one more request after most turns to [suggest your next prompt](/guide/conversations#let-claude-code-suggest-the-next-prompt). It counts in your usage with the provider, but it never reaches the transcript this page reads.

## Next steps

- [**The Workspace**](/guide/workspace) — the status bar this page opens from.
- [**Conversations**](/guide/conversations#start-a-session-—-the-composer) — the per-conversation context ring beside the composer.
- [**Conversation Aggregation**](/guide/aggregation) — how sessions you ran in an agent's own CLI get here in the first place.
- [**Authentication & Models**](/guide/authentication) — the models the *by model* breakdown is naming.
- [**Privacy & Security**](/reference/privacy) — what stays on your machine, this dashboard included.
