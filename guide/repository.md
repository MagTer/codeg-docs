---
title: Repository Panel
description: Hand a GitHub, GitLab or Gitea issue or pull request straight to an agent, or let the panel pick matching ones up on a schedule or a webhook — each works in its own worktree, you review the result on the board, and the outcome goes back to the thread it came from.
---

# Repository Panel

Most agent work starts with someone reading an issue and retyping it into a prompt. The **Repository panel** removes that step: it lists a folder's **GitHub, GitLab or Gitea** issues and pull requests inside Codeg, and hands the one you pick to an agent as a [to-do task](/guide/tasks) — its own worktree, its own session, and the same review gate before anything lands.

It shipped in **0.27.0** behind a **Beta** mark, which came off in **0.30.0** once the panel could do the whole loop: read a change through tabs, comment on it, open and close issues, and merge — without a browser. **Gitea** joined in **0.30.4**, and with it **Forgejo**: Forgejo is a fork of Gitea serving the same `/api/v1`, so the client that talks to one talks to the other and there's no separate setting for it.

Since **0.35.2** the panel can also do the handing over itself. [Auto-processing](#let-it-pick-items-up-by-itself) scans the repository on a schedule, or the moment the forge sends a webhook, and turns the items that match your rules into tasks — the same tasks **Start** would have made, through the same gates.

::: tip Where it fits
The panel is a *front door* to To-dos, not a parallel system. Everything it creates is an ordinary task on the ordinary board, with one extra fact recorded: which item it came from. That provenance is what unlocks the delivery step at the end — and what makes the [auto-merge rule](#the-rules-that-do-not-bend) different.
:::

## Open it

**Repository panel** sits in the left sidebar beneath To-dos, and in the status bar's [quick actions](/guide/workspace#the-layout) under *Navigation*. Like Automations and To-dos it takes over the main area; the **Back to Conversations** button at the start of its title returns you to your conversations.

Since **0.37.0** the side panel also has **Issues** and **Pull requests** tabs — **Merge requests** on GitLab — showing this list for the project you're in: search, the state filter, **Assigned to me**, labels, **New issue**, and the same detail panel with **Start**. Switching folders, page sizes and the panel settings stay here. → [The Side Panel](/guide/side-panel#the-project-s-automations-to-dos-issues-and-pull-requests)

Two buttons join the window's top-right cluster while it's open: **Refresh**, which reloads the whole list rather than narrowing it, and **Panel settings**. Refresh greys out until a repository is actually loaded; settings never does, since there's always a global row to change.

## Before you start, an account

The panel reads through the same credentials git does, under [**Settings → Version Control**](/reference/settings/version-control). Pick a project folder and Codeg looks at its `origin` remote:

- **A host that is none of the three** — say a Gitee or Bitbucket remote. The panel says **only GitHub, GitLab and Gitea are supported** and names the host, rather than falling back to GitHub and reporting whatever the wrong API answered, which used to come out as "no GitHub account for gitee.com" or a raw API failure. **Add an account** is still offered, because that's the other way in for a self-hosted instance.
- **A remote, but no account for that host** — the empty state names the provider and the host and offers **Add an account**, which takes you straight to the settings screen.

Reaching that verdict costs a probe rather than a guess. A host Codeg doesn't recognise by name is **asked what it is**, cheapest question first:

1. **Gitea**, at `GET {origin}/api/v1/version`. It goes first because it's the only question here needing no credential *and* answering in its body — every Gitea serves that endpoint publicly and replies with a version object. A blanket gateway returning 200 to everything doesn't produce that shape, so ruling one out costs nothing extra. Neither GitHub Enterprise (`/api/v3`) nor GitLab (`/api/v4`) mounts `/api/v1` at all.
2. **GitLab**, at `GET {origin}/api/v4/version` — which GitLab answers 200 with a token and 401 without, while GitHub Enterprise 404s. Neither answer decides anything on its own, because an authenticating gateway in front of a GitHub Enterprise can produce either one for every request. So a JSON 200 or 401 is only a *candidate*, and Codeg confirms it against a path nothing routes: real GitLab 404s there, a blanket gateway answers the same as before, and Codeg declines to conclude rather than breaking a setup that works.

What gets remembered is a **conclusive** answer, for the rest of the session. A host that's unreachable, or whose server returns a transient error, leaves the question open and is asked again next time — so a Gitea that happened to be restarting doesn't get written off until Codeg has actually heard from it. (A transient answer from the Gitea probe doesn't stop the GitLab one: if that resolves conclusively, that verdict stands.)

Which forge you're talking to is **derived from the remote on Codeg's side**, never claimed by the client — because that choice is what picks the credentials. A GitLab token is never spent on a GitHub call, and a GitHub Enterprise host on its own domain resolves by its URL rather than by its name.

GitLab has its own accounts panel since **0.27.0** and Gitea since **0.30.4**; a GitLab token needs the **api** scope, a Gitea one **write:repository**, **write:issue** and **read:user**. → [Version Control](/reference/settings/version-control#gitea-accounts)

## Find the item

The list is a triage surface, not a browser bookmark. Across the top:

- **Issues** and **Pull requests** — or **Merge requests**, because a GitLab user doesn't have pull requests and being told they do reads like the wrong tool answered. Each tab shows a count for the state you're filtered to, and which one you were on is **remembered across sessions**, next to the page size and for the same reason: it says which list you work in.
- **Search** over title and description.
- **State** — Open, Closed, or All. A pull request row additionally shows **Merged** and **Draft** where they apply.
- **Assigned to me** — one toggle, the fastest filter in the panel.
- **Labels** — a searchable multi-select over the repository's own labels. It **stays open as you pick**, because two labels shouldn't cost two trips, and it's hidden entirely on a repository that has none. Only the first 100 labels are listed, and it says so when that bites.
- **Sort** — Newest, Oldest, Recently updated, Least recently updated.

Paging sits at the bottom with a **per page** selector (10 / 20 / 30 / 50, default 20). Two limits are worth knowing because the panel is honest about both rather than quietly returning less:

- **A search that timed out** says the page may be missing matches.
- **Only the first *n* matches can be paged through.** Past that the forge's own API stops answering, and the panel tells you to narrow the filters rather than showing you a page that isn't there.

Click a row and its **details open in a side panel** — the description, every label, and the same **Start** action — so reading an issue doesn't cost you your filters, your page, and your scroll position. (The panel shows what the list already fetched, and a body is capped at 16,000 characters on the way in, so a genuinely enormous issue is worth opening in the browser.) **Open in browser** is there when you want the real thread.

Since **0.28.2** the panel also carries the **discussion**, not just the description — because on most issues the description is the opening bid and the comments are where it was actually settled. Each one renders through the same Markdown renderer as the body, with its author, a relative timestamp, an **edited** mark where the forge really recorded an edit, and a permalink out to it. **Load more** pages through the rest.

The thread is fetched **when you open the panel**, not with the list: folding it into the list would spend a request per row to draw a page whose reader opens at most one of them. On GitLab, the housekeeping events — *changed the milestone*, *assigned to* — are filtered out, so what you read is the conversation and matches the comment count on the row. A thread with hundreds of comments opens quickly because only what's on screen is drawn, the rest arriving as you scroll.

A row whose item already has a task shows that instead of **Start** — a status chip that takes you to the board, plus a small **re-trigger** link where starting another run makes sense. The chip reads **Deferred** for a task you've set aside with [Handle later](/guide/tasks#set-it-aside-for-later).

### A change opens as three tabs

An issue is one scroll, because a one-tab bar says nothing. A **pull or merge request** is three, with the branch pair kept in the header where it stays readable from all of them:

- **Conversation** — the description and the thread, same as an issue.
- **Checks** — CI, with the **worst state as a glyph on the tab** so a red build is visible without opening it. Three answers are kept apart rather than blurred: green, *nothing configured*, and *this account can't look* — and on GitHub a fourth, half-readable, because check runs and commit statuses sit behind two different permissions.
- **Files changed** — the file list, each row opening onto its own diff, with the **count on the tab** where the forge gives an exact one (GitLab reports a truncated `1000+` on very large changes, and a count that isn't a number isn't shown).

Opening a file's diff **costs no extra request**: both forges already ship the hunks with the file page and Codeg was throwing them away. A row with nothing to open isn't clickable. On GitHub it says which of two reasons applies — binary content, or a diff withheld for being too large while its lines were still counted. On GitLab an empty diff is reported as binary either way, so read that as *no diff available* rather than as a statement about the file.

### Act on it without leaving

Reading was the whole story until **0.29.0**. The panel now writes as well:

- **Comment.** A composer under the thread, posting as the account that reads the panel.
- **Close or reopen.** One button, which **confirms first** — unlike the composer it writes to somebody else's repository on a single click with nothing typed.
- **File a new issue.** Title and body. It opens straight away, and drops into the list without a manual refresh **when the list you're looking at could contain it** — the Issues tab, first page, sorted newest or recently-updated, no search term, not *Assigned to me*, not closed-only, and carrying every label you've filtered to. Anywhere else it opens in the detail panel and the list is left alone, rather than showing you a row that doesn't belong on the page you're on.

Both writes **take the forge's answer as the truth rather than assuming their own worked**. A posted comment comes back carrying the id the thread de-duplicates on, the author your token actually resolved to, and its permalink. A state change comes back as the row the forge now serves — which is how a pull request somebody merged in the browser a minute ago lands as **merged** instead of the *closed* you asked for.

### Merge it from here

An open change can be merged without a browser. The merge box sits between the discussion and the composer and shows what you need to decide: **whether the branches conflict**, and **what CI says** — that last only when there's an actual verdict to report, so a repository with no checks configured, or one this account can't read, simply shows nothing there rather than a reassuring green.

The button is a split button, and its menu is **the repository's own settings** — merge commit, squash, rebase, each offered only where that repository allows it. A repo that has squash-only turned on shows you squash only, rather than an option that would fail on submit. If those settings can't be read, Codeg falls back to offering a plain merge, which the forge may still refuse.

::: tip This is not the same as merging a task
The **Merge** you press on a [to-do](/guide/tasks#merge-it) lands an agent's branch in *your* checkout, and may need an agent to resolve conflicts. This one merges a pull request **on the forge**, the way the web UI would. Different button, different place, different meaning — a task sourced from a pull request still can't be merged locally at all. → [The rules that do not bend](#the-rules-that-do-not-bend)
:::

## Hand it over

**Start** opens a dialog whose first question is the one that matters: **how should this be handled?** Four scenarios, two per kind — which pair you're offered depends on what you clicked.

For an **issue**:

| Scenario | What the agent is told |
| --- | --- |
| **Fix / implement** | Judge whether the report holds up, then fix the cause you identified — and verify it the way this project would, with build, tests or lint |
| **Plan first** | Judge whether the report holds up, then deliver an implementation plan — approach, files, risks, how it'll be verified — and stop. Change no files |

For a **pull or merge request**:

| Scenario | What the agent is told |
| --- | --- |
| **Review & fix** | Judge first whether the change's approach holds up. If it does, review it against the base branch and fix what's worth fixing in place; if it doesn't, commit nothing and hand the review back to you |
| **Review only** | Report findings with locations, severity and suggested fixes. **Commit nothing** |

Three things separate these from a prompt you'd write yourself.

**Both issue scenarios have to judge the report before acting on it.** Not as a preamble — as a step with an outcome. The agent is told to reproduce the reported behaviour, or otherwise show from the code where and why it goes wrong, with file and line references; and for a feature request, to confirm the behaviour is genuinely missing rather than already available under another name or setting, and that adding it fits how the project already works.

Since **0.35.2** the question is wider than *does it reproduce*, because a report can describe something that really happens and still not hold. It doesn't hold when the behaviour **can't be reproduced**, is **already fixed** here, only happens because of the **reporter's own environment or configuration**, or is **what the project intends** — a report of intended behaviour is a feature request, not a bug. What the report says about the cause, and the fix it suggests, are **claims to check**, not instructions: a real problem with the wrong diagnosis still holds, and the agent works on the cause it found. And when it can't tell which side of that line a report falls on — too vague to reproduce, or a question of intent only the maintainers can answer — it's told to treat the report as not holding, because that call is yours.

Verification was a separate *Investigate only* scenario until **0.28.2**, and it was retired precisely because being a mode you could pick made verification look like something the other two could skip. → [When the report doesn't hold](#when-it-turns-out-not-to-be-real)

**The review scenarios get the change already checked out.** The worktree starts at the pull request's **head commit**, so the agent reads and builds the actual proposal rather than the base branch, and its commits go *on top* — which is what makes pushing them back sensible later.

**The review scenarios are told to judge the approach, not just the diff.** *Is the change warranted at all; is this the best way given the rest of this codebase; is it production-ready as it stands?* And explicitly: if the design is what's wrong, say so and propose better — don't rewrite the pull request into it, because a rewrite its author never asked for isn't a review.

**For Review & fix, that judgement is a gate**, since **0.32.3**. The agent has to decide *first* whether the approach holds up — whether the change should be made at all, and whether it needs a different design rather than fixes — and when it doesn't, or when the agent isn't sure, it **commits nothing**, not even the small fixes. It reports why, with file and line references, what to do instead, and the other problems it found, opening with that verdict. That ending counts as a **success**, so the to-do comes back to **Needs you** for your review like any other, rather than with fixes piled onto a design that would have to be thrown away. A design problem found halfway through the review stops the fixing too, and the report says which fixes were already committed.

The rest of the dialog:

- **An optional extra instruction** for this item specifically.
- **Comment the outcome back on this item** — see [below](#the-comment-that-goes-back).
- **A preview** of the issue content the task will carry, so you can see what you're about to send.
- **A duplicate guard.** If an active task already handles this item, the footer becomes **View the existing task** / **Create anyway** rather than silently minting a second one. Restarting a task whose item is already live warns the same way.

Create it and you get an ordinary to-do, in that folder, which starts under the folder's own concurrency limit like any other.

### When the report doesn't hold {#when-it-turns-out-not-to-be-real}

Sometimes the answer is *no*. An issue may already have been fixed, work as designed, happen only on the reporter's machine, describe a version you're not on, or simply not carry enough to go on.

**That ends the task successfully.** The agent is told to change nothing — not even the small improvements it noticed on the way — and to hand the decision back: what it ran, what it saw instead, the most likely explanation, and what would change its conclusion. Since **0.35.2** it's also told to **open its reply with the verdict**, in one line, so a task that stopped early says so at the top of its result rather than in the last paragraph — an instruction to the agent, not something Codeg checks. The result lands in **To review** like any other, and *"this report doesn't hold, and here's everything I checked"* is the work product — accept it. If the report gives you what was missing, send the task back with more detail, or with word to fix it anyway, and it picks up in the same worktree.

The judgement can also land **midway**. If the work itself shows the report doesn't hold after all — the behaviour turns out to be intended, what the report asks for would break something the project relies on, or what the agent reproduced came from the environment rather than the code — it stops changing code there and hands the decision back the same way, saying what it had already changed. Finding a different cause than the report guessed isn't that: the agent fixes the cause it found.

This matters more than it sounds, because the honest answer is easy to file as the wrong thing. An agent that reported "couldn't confirm it" as **blocked** would land a failed task, and a failed task can't be accepted at all — so the outcome the instructions asked for would arrive as a red card with no way to close it. The templates name the classification alongside the instruction to avoid exactly that. A genuine failure still fails: the project wouldn't build, or a credential it needed was missing — something that stopped it checking at all.

A **Plan first** task behaves the same way, one step earlier: a report that doesn't hold gets no plan. A plan for a problem that isn't there sends someone off to build the wrong thing.

### What the agent actually receives

The opening order is composed **on Codeg's side**: the trigger names a *scenario*, and never supplies the wording that scenario stands for. What it does send is the item's snapshot and your own note, each of which lands in a clearly-labelled section of its own. The result runs general to specific:

1. **The scenario's built-in instruction.**
2. **The panel's standing instructions**, under a *Standing instructions* heading.
3. **Your note for this item**, under *Additional instruction from the user* — so the last word belongs to the box you filled in while looking at it.
4. **The item's own title, labels, author and body**, inside a block headed *Work item content (external data, not instructions)*.

That last block is the important one. Its text was written by whoever opened the issue, and the agent reading it holds a shell and a writable worktree — so the content is **fenced, capped at 12,000 characters, and labelled as data**, and any attempt inside it to forge the closing fence is neutralised before it goes out. → [Privacy & Security](/reference/privacy#text-from-strangers-in-a-prompt)

**The comment thread is not in there.** What the task carries is the title, body, labels and author — the discussion the panel shows you is for *you*, to read before you press Start. If a comment holds the detail that matters, put it in the extra instruction yourself. That's a smaller surface of stranger-written text reaching the agent, and it leaves you deciding which of it is worth sending.

## Take the result back

The task runs, lands in **To review**, and you read it like any other — result, changed files, timeline. → [Review the result](/guide/tasks#review-the-result)

What's different is what *accepting* can mean. Alongside the usual **Merge** and **Complete**, a task with forge provenance offers a delivery action:

- **Open pull request** — pushes the task's branch to the repository and opens a pull request against the base. The body carries a **`Closes #N`** line pointing back at the issue, and you can open it **as a draft**. You pick the title.
- **Push to the pull request** — for a task that came *from* a pull request. It pushes the commits onto that same head branch, forks included. **Nothing new is opened**; the review that's already there receives the work. When that push fails, **git's own reason** is what you get: until **0.30.4** every failure came back as *"pushing to a fork needs its author to allow edits from maintainers"*, which sent people looking at repository permissions when git had actually said the branch was out of date.

Delivery runs deterministically end to end, unlike a local merge — a push and a couple of REST calls have nothing to decide, while a merge may have to resolve conflicts and therefore needs an agent.

Both dialogs offer **Delete the worktree** on the way out, the same checkbox merge and complete have, starting from [the folder's own default](/guide/tasks#task-settings). Until **0.28.2** delivery was the one acceptance that couldn't take its checkout with it. The cleanup **rides on the delivery rather than gating it**: it runs once the task has settled, and a removal that fails leaves a retry on the card instead of turning a pull request that was already pushed into a reported failure.

::: warning How a pull request is matched
Before opening anything, delivery looks for a pull request that matches on **all four** of head commit, head ref, base ref, and head repository. One commit can legitimately have several pull requests open against different bases, so a commit hash alone would settle the task against the wrong one. Four outcomes:

- **Matched and already merged** — that *is* the delivery. The task settles against it rather than opening a duplicate.
- **Matched and open** — adopted, and the task settles against it.
- **Matched but closed without merging** — the task goes **back to review**. That was a human decision, and the engine won't overrule it by reopening or duplicating.
- **A pull request already open from this branch to this base, but pointing at a different commit** — someone else pushed. Also back to review, because creating is impossible (a forge allows one open pull request per head/base pair) and adopting would settle the task against work it never produced.

If nothing matches at all, delivery opens a **new** pull request — the ordinary case for a task's first delivery.
:::

The branch is pushed as **the account that triggered the task** — not "whichever account is default right now" — so marking a different account default later can't quietly change which identity does the pushing. (Commit *authorship* is a separate thing, set by the git config the agent committed under.)

### The comment that goes back

Leave **Comment the outcome back** on and Codeg posts a single comment on the item when the task settles. It says which task, what happened, and the diff counters:

- **Merged locally** into a branch, with the short commit — worded that way deliberately, because it landed in *your* checkout and was never pushed. To everyone else reading the thread the branch is untouched and that hash resolves to nothing.
- **Delivered**, with the pull request's URL.
- **Completed** without landing anything. Until **0.32.3** this one said *accepted*, which on a pull request read as approving it; now it says what happened — on a pull or merge request, *it made no changes, so nothing was pushed*, or *its work was not pushed* when the worktree was already gone; on an issue, *it made no changes*, or *its work was not merged*.

**No agent-written text ever reaches that thread** — not the result summary, not the commit message, not the verdict note. The comment is built from the task id, the outcome and the counters, and there is no parameter that could carry anything else. Other people read that thread; what an agent wrote about its own work isn't theirs to receive.

If the comment fails to post, the timeline records that too rather than dropping it.

## Panel settings

The settings dialog is scoped exactly like [task settings](/guide/tasks#task-settings) — a **Scope** picker with one **global** row, *All folders (global defaults)*, plus an optional **per-folder** override, where **Configuration** chooses between *Global defaults* and *Custom* — and an override wins **wholesale**: saving one detaches that folder from the global row entirely rather than merging field by field. The rule is copied on purpose; the two dialogs sit one click apart and shouldn't do different arithmetic.

Since **0.35.2** the form has two tabs. **General** holds what the dialog has always held:

- **Default for issues** and **Default for pull / merge requests** — which scenario the Start dialog opens on. It only sets the starting position; the request that follows always names its scenario outright.
- **Comment the outcome back by default** — the starting state of that switch, still yours to change per item.
- **Standing instructions** — per scenario, plus an **Every scenario** slot that's appended to all of them. *"Reply in English. Run the project's tests before you finish."*

Standing instructions land **after** the scenario's built-in wording and **before** your per-item note, so there's no need to restate the built-ins. They ride with the task's **opening order only** — text you want on every turn belongs in the task settings' [per-stage prompts](/guide/tasks#add-your-own-instructions-per-stage) instead. Each one caps at 4,000 characters, and going over is **refused with an error rather than silently trimmed**: text you typed shouldn't disappear without being told.

**Auto-processing** is the other tab — see [below](#let-it-pick-items-up-by-itself). It carries a small dot whenever its rules are switched on in the form, so you can tell from the General tab that they're live. A folder set to follow the global defaults shows no tabs at all; while the global rules are on, it shows that folder's [Activity](#watch-it-work) instead, read-only, with **Scan now**.

## Let it pick items up by itself

**Auto-processing** turns matching issues and pull requests into tasks **without anyone pressing Start**. Each one goes through exactly the path the [Start dialog](#hand-it-over) does — the same scenario templates, the same fenced item content, the same standing instructions and duplicate guard — so an automatic task is an ordinary to-do that happens to have been created by a rule. Its timeline opens with *Created by auto-processing*, and the line names what set it off: a *scheduled scan*, a *webhook* or a *manual scan*.

It does nothing until you switch on a trigger, and it's scoped like the rest of the dialog: rules on the global row cover every project folder that follows the global settings, and a folder on **Custom** has rules of its own. Only **open project folders** are processed — never a worktree, and never a folder you've closed.

### What wakes it

Two triggers, either or both:

- **Scan on a schedule** — look through the repository every **Scan every** interval: 1, 5, 15 or 30 minutes, or 1, 3, 6, 12 or 24 hours. **15 minutes** is the default.
- **Scan on webhook events** — scan as soon as the forge reports that an issue or pull request changed. → [Set up the webhook](#set-up-the-webhook)

**A webhook only starts a scan.** Nothing in a delivery is trusted beyond the repository it names: the scan that follows reads the items from the forge's own API, with the folder's own account, exactly as a scheduled one does. So the two combine well — a webhook for speed, a schedule as the backstop for a delivery that never arrived.

### What it picks up

- **Issues** — on by default, handled as **Fix / implement** unless you choose **Plan first** under **Handle as**.
- **Pull / merge requests** — off by default, handled as **Review & fix** unless you choose **Review only**. **Skip drafts until they are ready** starts ticked.

These **Handle as** choices belong to this tab. They don't follow the General tab's two defaults, which only decide where the Start dialog opens.

**Only what moved after you switched it on.** With **Include items that were already open** off — the default — a scan picks up only items **opened or updated** since auto-processing was switched on, and the hint under the switch names that moment. The window runs on the forge's *updated* time, so any update brings an older item in; labelling it is the deliberate way to do that. A scan normally reads only what changed since the one before; editing the rules sends the next one back to that starting moment, so items the old rules passed over get another look, and switching both triggers off and on again starts the clock anew. Turn **Include items that were already open** on and every open item that matches is fair game.

**Each item is picked up at most once.** An item that has ever had a task — in any state, archived, even one you deleted, and including a task you started by hand — is left alone from then on. Starting another one yourself from the panel still works.

### Rules for labels and authors

Four lists, each a row of chips — type a pattern and press Enter:

- **Only items with one of these labels**
- **Never items with any of these labels**
- **Only items opened by**
- **Never items opened by**

Patterns ignore case, and `*` matches anything: `area/*` is every label starting with `area/`, `*[bot]` every bot account. Anything else matches exactly — `bug` doesn't match `bugfix`. An item has to pass **every list that has entries**, the **Never** lists always win, and an empty list doesn't filter at all; an item with no author on record fails a non-empty *Only items opened by*. Each list takes up to 100 patterns of up to 200 characters, and going over is refused on save rather than trimmed. In a folder's own settings, the label fields suggest the repository's labels as you type.

### What happens to what it creates

- **Start right away** — on by default. Each new task is queued at once, and the folder's concurrency limit decides when it runs, exactly as if you'd pressed **Start** on its card. Off, it waits in **To do** — unless the folder's [task settings](/guide/tasks#task-settings) have **Process automatically** on, in which case the board claims it as soon as there's room anyway.
- **Comment the outcome back** — off by default, and separate from the General tab's default, which is on. When a task finishes it posts the same short status comment the Start dialog's switch would — [built from the outcome and the counters only](#the-comment-that-goes-back).

The account that reads the item, and later pushes its branch, is the host's **default account at the moment the scan creates the task** — and from then on it's pinned to the task, as it is for one you start yourself. Nothing about merging changes: a task from a repository item still [never merges unattended](#the-rules-that-do-not-bend).

### Watch it work

When the scope is a folder — one with its own rules, or one following the global ones — the tab ends in an **Activity** card:

- **The last scan** — when, what set it off, and four counts: *listed* (open items inside the window), *matched* (passed the rules), *already had a task*, and *created*.
- **New tasks**, by number and title.
- **Passed over**, with why: *other kind*, *not open*, *draft*, *excluded label*, *excluded author*, *no matching label*, *author not listed*.
- **What went wrong**, if anything — an item that couldn't be created, a task created but not started, or a scan that stopped on an error such as a missing account.
- **The next scheduled scan** and **the last webhook delivery**, where those apply.

A listing too long to read in one go is cut short and says so; the next scan carries on through the same window. **Scan now** runs one straight away with the **saved** rules, so it waits until a trigger is switched on and saved, and until any edit you've made is saved too. The activity is kept in memory, and a restart empties it.

Only one Codeg process runs the to-do board for a data directory, and auto-processing runs wherever the board does. A desktop app and a server sharing one directory therefore don't both scan; the one that doesn't hold the board says *Another codeg process runs the task board for this data directory, so auto-processing runs there, not here.*

### Set up the webhook

Switch on **Scan on webhook events** and the tab gives you the two values to paste into the forge:

- **Payload URL** — where deliveries go, ending in `/api/forge_webhook`. In a browser, or a desktop window attached to a remote workspace, it's the server you're already talking to. The **desktop app** receives webhooks only while its [Web Service](/reference/settings/web-service) is running, and then lists one URL per address the service reports; with the service stopped, the list is empty and says where to start it.
- **Secret** — a random one is generated the moment you switch the webhook on; there's no field to type one of your own. The eye button reveals it, **Copy** copies it either way, and **Generate a new secret** replaces it on the next Save. Switching the webhook off keeps the secret, so the value already pasted into the forge still works when you switch it back on.

In the repository's webhook settings, enter that URL with the content type **`application/json`** and the secret, and choose the **issue** and **pull request** events — on GitLab, **Issues events** and **Merge request events**, with the secret as the **Secret token**. Pushes, comments and every other event are acknowledged and ignored.

**The forge has to be able to reach that address.** A LAN address works for a self-hosted forge on the same network; it doesn't for github.com. When the forge can't reach Codeg, scan on a schedule instead.

Every delivery has to prove it knows the secret — an HMAC signature from GitHub, Gitea and Forgejo, the secret token itself from GitLab — and one that doesn't is refused before anything else happens. Each answer is a single line in the forge's own delivery log, which is where to look when a webhook isn't working: *pong* for GitHub's test ping, *scanning …* for an accepted delivery, *ignored* with the reason for an event or a repository that doesn't apply. → [Privacy & Security](/reference/privacy#webhooks-for-auto-processing)

## The rules that do not bend

- **No task from a repository item ever merges automatically.** Not a setting you can turn on — a rule. Its prompt embeds text written by arbitrary external users, so landing it unattended would be an injection-to-main-branch pipeline. A folder set to [land reviewed tasks by itself](/guide/tasks#let-a-folder-land-them-for-you) skips these rows entirely. For an **issue**-sourced task your own **Merge** click still works normally; a human just has to make it.
- **A task from a pull request can't be merged locally at all.** Its work belongs on the pull request's own branch, where its author and reviewers are looking — landing it on your base branch would take those changes in behind their backs, under a local commit, with the pull request left open and apparently unmerged. So **Merge** is replaced by **Push to the pull request**, and the refusal lives in the backend rather than only in the button, so an old client or a direct API call meets it too.
- **The identity is pinned at trigger time.** Which account reads the item and pushes the branch is decided when you press Create — or, for an [automatic task](#let-it-pick-items-up-by-itself), when the scan creates it — and a later default change doesn't move it. Updating that account's **token** keeps the identity intact — [removing and re-adding the account does not](/reference/settings/version-control#github-accounts).

## Good to know

- **Nothing is mirrored.** The panel reads the forge's REST API directly each time — there's no local copy of your issues, and Refresh is a button. The only reads that happen without you are the scans you switch on under [auto-processing](#let-it-pick-items-up-by-itself).
- **It's per folder.** The panel acts on the project folder you've picked, and refuses an item whose repository doesn't match that folder's remote, naming both.
- **The row can be hidden.** If you don't use it, switch **Repository panel** off under the sidebar's [navigation items](/guide/workspace#choose-which-navigation-rows-you-see) — quick actions still reaches it.
- **Self-hosted works.** GitHub Enterprise, self-managed GitLab, and a Gitea or Forgejo instance all resolve by their server URL, including on a non-default port or plain `http://`, and links back to the item are built from that same origin. Asking the instance what it is, rather than guessing from its hostname, arrived for **GitLab in 0.30.0** — which is what used to fail as a bare `410` — and the **Gitea and Forgejo** question was added in **0.30.4**.
- **A host you configured is always attempted, whatever it's called.** A provider-less account is ambiguous by construction — the plain-git credential dialog writes the same bytes a legacy GitHub Enterprise account does — so Codeg tries rather than refusing a panel that would have worked.

## Next steps

- [**To-dos**](/guide/tasks) — the board every item lands on, and everything about how a task runs, reviews and merges.
- [**Version Control**](/reference/settings/version-control) — the GitHub, GitLab and Gitea accounts this panel reads through.
- [**Privacy & Security**](/reference/privacy#text-from-strangers-in-a-prompt) — what happens to text written by someone you've never met.
- [**Git & Worktrees**](/guide/git) — the worktree each task gets, and how to clean up after one.
