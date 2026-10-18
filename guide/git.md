---
title: Git & Worktrees
description: Review diffs, commit and push, branch and merge, resolve conflicts, and run several agents in parallel with git worktrees — all inside the Codeg workspace.
---

# Git & Worktrees

Codeg has a full git client built into the workspace, so reviewing what an agent wrote and landing it are part of the same loop as prompting — no jumping out to a separate git tool. Everything sits in panels you already have open: the **Changes** tab for your working tree, the **Commits** tab for history and remotes, and the **branch chip** just below the composer for picking a branch. The integrated [terminal](/guide/workspace#the-terminal) is always there for the odd command, but you'll rarely need it.

::: tip Where each operation lives
The three surfaces used to overlap — the chip carried the whole git menu while both tabs had toolbars of their own. Each now owns a kind of work:

| Surface | What it holds |
| ------- | ------------- |
| **Changes** tab | The working tree — quick commit, stash and unstash, add all, roll back |
| **Commits** tab | History and remote bookkeeping — including **Manage remotes** |
| **Branch chip** | Picking a branch, plus the operations that act on the one you're on |

Pull, fetch and push appear on all three, since all three are places you'd reasonably want them.
:::

## Review your changes

Open the **Changes** tab in the right panel to see your working tree at a glance, split into **Tracked changes** and **Untracked files**. Each tracked file shows its git status (`M` modified, `A` added, `D` deleted, `R` renamed…) and a running **`+`/`−`** line count. Click any file to open its diff.

Those diffs are **read-only** — side by side, **HEAD** on the left and your **Working Tree** on the right, with Prev/Next to step through each change. They're for reading what changed, whether you or the agent made it; you decide what to keep when you commit, not by editing the diff.

**An image diffs as an image.** Since **0.30.4** a changed `.png`, `.jpg`, `.jpeg`, `.gif`, `.webp`, `.bmp` or `.ico` opens as **before and after pictures** rather than as a wall of unreadable bytes, with a **swipe slider** to drag one over the other and a toggle back to plain side-by-side. **`.svg` is deliberately left as a text diff** — it *is* text, git produces a real line diff for it, and those lines say more than two pictures that may look identical. It works the same in the **Commit** window, the **push workspace** and the **unstash** dialog. A file added or deleted shows *no image at this revision* on the side that has none, and one over **8 MB a side** says so rather than pulling it into memory. A genuinely binary file — anything that isn't an image — now says **binary file, content not shown** instead of rendering as noise.

Right-click a file — or a folder, to act on several at once — for the rest:

- **View Diff** / **Open File** — review the change, or open the real file to edit it.
- **Add to session** — hand the file to the agent as context.
- **Rollback** — discard a file's changes and restore it to the last commit. Destructive, and it asks first.
- **Delete** — for an untracked file, remove it from disk. Also destructive, also confirmed.

There's **no separate staging step** — Codeg doesn't make you `git add` before committing. You just tick the files you want when you commit (below). New files start untracked; **Add to VCS** begins tracking one if you'd like it in git before then.

::: tip Not a repository yet?
If the folder isn't under git, the Changes tab says so — choose **Initialize Git repository** from the branch menu to start one. (The commit toolbar below doesn't render at all outside a repository.)
:::

## Commit

The Changes tab leads with a toolbar, so committing what you're looking at doesn't mean opening anything: type a message in the box and press **Enter**.

That **quick commit takes the tracked changes only** — an unignored `dist/` or `node_modules/` can never ride along with a keystroke — and the draft message is dropped when you switch to another folder, so a message written for one repo can't land in the next.

Beside it, one round button opens the menu with everything else: **pull**, **fetch**, **push**, **stash** and **unstash**, plus **Add all to VCS** and **Rollback all** (both routed through the file picker, so neither writes blind), and **Commit code**, which opens the full **Commit** window.

That window is still there for anything more deliberate: tick the files to include (tracked files come pre-selected, untracked ones don't), click any name to preview its diff, write a message, and commit. Its commit button doubles as a menu — **Commit** records the selected files, **Commit and Push** sends them to your remote in the same step.

Codeg stamps each commit with the author identity from your [git account](#git-accounts) for that remote, so your commits are attributed correctly without you setting `user.name` and `user.email` in every project.

## Branch, merge, and rebase

The **branch chip** sits just below the composer and is your branch switcher. There's one per conversation, so when you [tile several sessions](/guide/workspace#tile-several-sessions-side-by-side) each one shows and switches its own branch. In [Chat mode](/guide/conversations#start-a-session-—-the-composer) there's no chip at all; in a folder that isn't a git repository it reads **No branch** and offers **Initialize Git repository**.

Click it and one searchable list opens. A single search box at the top filters operations *and* branches together, so typing `push` finds the operation and typing part of a branch name gets you straight to the branch. From the top:

- **Operations** — the short list that acts on the branch you're on: **Pull code**, **Fetch remote branches**, **Commit code…**, **Push…**, **New branch…** and **New worktree…**. **New branch…** creates one from where you are and checks it out.
- **Worktree branches** — since **0.30.0**, the branches this repository has checked out in its *other* [worktrees](#work-in-parallel-with-worktrees) — the main working tree first, then the linked ones by name. Picking one takes you to that worktree, the same switch the sidebar does, so moving between parallel checkouts no longer means hunting for the branch in the full local list. The **main** working tree's branch is hoisted to the top as a plain row so it's never behind a fold; the linked worktrees below it group by shared prefix like any other branch list, and those groups start collapsed.
- **Local branches** and **Remote branches** — shared prefixes like `feature/…` fold into collapsed groups, and the checked-out branch is marked **Current**. Local still lists every local branch, worktree ones included.

Pick a branch for its actions — **Switch to this branch**, **merge** it into the current branch, **rebase** the current branch onto it, **Delete branch**, or the two that don't need it checked out at all:

- **Pull code** on another branch fast-forwards it to its upstream **without touching your working tree**, so you can bring `main` current while you're still on your feature branch. It deliberately refuses rather than forcing: a non-fast-forward is rejected, and so is a branch another worktree has checked out. Nothing is ever quietly rewritten under a tree you have open. (On the branch you're actually on, it's the ordinary pull, conflict handling included.)
- **Push** opens the push window preselected for that branch, so you review the commits before they go out. An already-open push window is retargeted rather than left aimed at whatever it was opened for.

A branch that a worktree has checked out also offers **Delete worktree** and **Delete worktree and branch** — see [Delete one when you're done with it](#delete-one-when-you-re-done-with-it).

Switching uses a plain checkout, so Codeg won't move your uncommitted changes for you — **commit or stash first** if git would refuse. Stashing lives in the Changes tab's menu: **Stash changes** tucks your work away (optionally keeping the index staged), and **Unstash** lists your stashes to **apply** or **drop**.

## Push, pull, and remotes

- **Pull code** fetches and merges your upstream; if the merge conflicts, Codeg opens the conflict tool (below) rather than leaving you at a half-finished merge.
- **Fetch remote branches** refreshes everything from your remotes without touching your working tree.
- **Push** opens a window listing the commits you haven't pushed yet, so you see exactly what's about to go out before it does. In the **Commits** tab, every commit is tagged with its push state: a cloud with a check for **Pushed to remote**, a crossed-out cloud for **Not pushed to remote**, and — once you've filtered to a local branch with no upstream — a question mark for **Push status unknown**.
- **Manage Remotes** lets you add, edit, or remove the remotes a repo points at. It sits in the Commits tab's menu, which is where you'll be when it matters: a repo with no refs yet is exactly when adding the first remote is the thing to do.

## Read the history — the Commits tab

The **Commits** tab in the right panel is the project's full history, not just a recent page: it's a timeline that keeps loading older commits as you scroll. Each row carries its push state, the commit subject, the author, when it landed, and its short hash. One actions menu beside the refresh button holds **pull**, **fetch**, **push** and **Manage remotes**.

Two pills at the top narrow what you're looking at, and **Codeg remembers both per project**, so a repo reopens on the view you left it in:

- **Branch** — since **0.32.3** it opens on **HEAD**, with the branch the folder or worktree is on beside it: a filter that re-resolves on every query instead of pinning a name, so the history tracks each checkout you make and still works on a detached HEAD. Open it to search and pick another; local and remote branches are grouped, the checked-out one is tagged **Current**, and the ✕ clears the filter to show **every branch** at once — the old default, now a choice that, like a named branch, is kept for that folder. If a branch you'd filtered by is later deleted, the filter drops back to HEAD rather than showing you nothing. It renders only the rows on screen, so a repository with hundreds of remote branches opens without the pause it used to cost — search, prefix groups and keyboard navigation all still work.
- **Author** — your own commits are one click away (your git identity is listed first, badged **you**), recent choices are kept for reuse, and typing searches every author in the repo.

**Click a commit to expand it** and you get the full picture without leaving the panel: the complete hash and message (both copyable, with a **Show more** toggle when the message is long), the author and exact timestamp, every file it touched with `+`/`−` counts — click a file for its diff at that commit — and chips for the branches that contain it.

**Right-click a commit** for the actions:

- **View Diff** — the whole commit as one diff, in an editor tab.
- **New branch…** — branch from that commit; Codeg creates it *and* switches you to it.
- **Reset to Here** — move the current branch to that commit, choosing the mode: **`--soft`**, **`--mixed`** *(the default)*, **`--hard`**, or **`--keep`**, each explained in the dialog. Reset always targets whatever branch you're actually on, so it's offered from the all-branches view, from **HEAD**, and while viewing the current branch by name — but not while you're looking at a different one, and Codeg says so when that's why.
- **Refresh** and **Push…**

## Sign in to push — git accounts {#git-accounts}

Pushing over HTTPS needs credentials, and Codeg manages them for you as **git accounts** so you're not re-entering a token every push. Add one under **Settings → Version Control**:

- A **GitHub account** — a personal access token, with a link straight to GitHub's token page with the right scopes preselected.
- A **Git account** for GitLab, Bitbucket, or a self-hosted server — server URL, username, and token.

Accounts are matched to a remote by its host, with one marked **Default** to break ties, and the token lives in your OS keyring, never in plain text. Once an account is set:

- **Your pushes and pulls just work** — Codeg supplies the credentials to git automatically.
- **So do the agent's.** When an agent runs its own `git push` in the terminal, it authenticates through the same account — no separate setup.
- **Commits are attributed** to that account's identity.

If a git operation ever hits an auth wall, Codeg prompts inline, validates what you enter, and saves it as an account so it won't ask again. SSH remotes keep using your own SSH keys, so they don't need an account here.

→ [Version Control & Git](/reference/settings/version-control) covers every field in these settings.

## Resolve conflicts

When a merge, rebase, or pull runs into conflicts, Codeg catches it and offers a **Merge Conflicts** prompt: **abort** and back out, or **Open Merge Tool**. The tool is a three-pane editor — **Local (Ours)** on the left, **Remote (Theirs)** on the right, and an editable **Result** in the middle.

Work through each conflict by accepting a side — **Accept Local** or **Accept Remote** on the hunk — or by typing the resolution straight into the Result pane; this is the one diff in Codeg you *can* edit. Header buttons apply a whole side, or every non-conflicting hunk, at once. When a file's clean, **Mark Resolved** and Codeg stages it and moves you to the next. Once every file is resolved, **Complete Merge** finishes the operation — or **Abort** unwinds the whole thing.

## Work in parallel with worktrees

A **git worktree** is a second working copy of the same repository, checked out on its own branch in its own directory. Codeg builds parallel development around them: instead of one agent at a time on one branch, you can have **several agents working at once**, each in its own worktree on its own branch — no stepping on each other's files, no half-finished changes bleeding between tasks.

Create one from the branch menu → **New worktree**. Codeg pre-fills a new branch name and a sibling directory next to your repo (both editable), runs `git worktree add`, and — the good part — **opens a fresh conversation rooted in that worktree**. Start a task there and the agent works entirely inside it.

The location field there is the same one Codeg now uses everywhere it asks for a directory — cloning a repo, creating a worktree, starting a new project. **Home** and **up one level** sit inside the box at its left edge and the folder picker at its right, and the picker's icon tells you which one opens: your operating system's own dialog for local files, Codeg's browser when you're pointed at a server. Choosing a folder **fills the field in** and leaves the confirm step to you, rather than acting on the pick immediately.

In the sidebar, a repo's worktrees group under it, so a project's parallel branches stay together. Switching to a branch that lives in a worktree takes you *to* that worktree instead of checking out over your current one. The payoff: [tile a few sessions side by side](/guide/workspace#tile-several-sessions-side-by-side), each in its own worktree, and watch a fleet of agents build different features at the same time — the natural companion to [multi-agent collaboration](/guide/multi-agent).

Two other features lean on the same mechanism. [Automations](/guide/automations) can execute each run in its own throwaway worktree, so a scheduled task never collides with your working tree. And every [to-do](/guide/tasks) gets one automatically — branch `task/<id>`, in a sibling directory by default or [wherever you point them](/guide/tasks#keep-the-worktrees-somewhere-else) — which is what lets several tasks run at once and land one at a time.

### Delete one when you're done with it

A worktree branch used to be a dead end: deleting the branch could only ever report git's refusal — *"cannot delete branch 'x' used by worktree at …"* — because the checkout has to go first. Pick one in the branch chip and you get the two removals that actually work:

- **Delete worktree** — drops the checkout, **keeps the branch** and its workspace folder, so the worktree can be recreated at that path later.
- **Delete worktree and branch** — drops the checkout, the branch, and the worktree's folder. Its **sessions move to the repo folder**, stamped with where they actually ran, so no history is lost.

Two are refused up front, and it's worth knowing why: the repository's **main working tree** is offered no destructive action at all (git refuses both to remove its checkout and to delete its branch), and a **to-do task that's mid-run or mid-merge blocks removal of the tree it's working in** — forcing it would delete a live agent's directory out from under it. When a worktree folder does go, every to-do referencing it is detached and its card refreshed, rather than left offering a cleanup that could only fail.

::: tip Removing a folder is not deleting a worktree
**Remove from workspace** on a folder's menu takes it out of Codeg and closes its tabs — it leaves the worktree and its branch untouched on disk. Use the branch chip's two entries above when you mean to remove the checkout itself.

To-do worktrees have their own routes on the board, which is usually where you want to be: it offers to remove one when you **merge** or **delete** its task, and since **0.28** a **Delete worktree** button in the task drawer reclaims a leftover checkout — directory and work branch — **without touching the task**, for the ones where you said no at merge time. It tells you if any of that fails. → [To-dos](/guide/tasks#keep-the-board-tidy)
:::

## Next steps

- [**The Side Panel**](/guide/side-panel) — the panel the Changes and Commits tabs live in, beside the files and the session's details.
- [**Conversations**](/guide/conversations) — the composer the branch chip sits under.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — put those parallel worktrees to work with a team of agents.
- [**Automations**](/guide/automations) — run tasks headlessly, each in its own isolated worktree.
