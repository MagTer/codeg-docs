---
title: Working with Agents
description: Enable a coding agent, make sure it's healthy with a preflight check, and start your first session — the same workspace whichever agent you run.
---

# Working with Agents

Codeg doesn't ship its own model. It's a workspace *for* agents — it connects to the coding-agent CLIs you already run, like Claude Code, Codex, and Gemini, and gives every one of them the same surface: the same composer, the same files and diffs, the same git and terminal. You choose which agent handles a conversation, and everything around it stays the same.

This page covers the essentials — enabling an agent, making sure it's ready to run, and starting a session. Three neighbours go deeper: [Supported Agents](/guide/supported-agents) is the full roster, [Custom Agents](/guide/custom-agents) is how to add one that isn't on it, and [Authentication & Models](/guide/authentication) covers signing in and picking a model.

## How agents work

Each agent is a separate command-line program. When you start a session, Codeg launches that program as a background process and talks to it over the **Agent Client Protocol (ACP)** — the shared language that lets one workspace drive many different agents. That's why the experience is consistent no matter which one you pick.

Codeg supports **fifteen agents** out of the box, delivered two ways — and it installs and updates them for you:

- Most run through **npx** (an npm package), so they need Node.js on your machine.
- **OpenCode**, **Cursor** and **Google Antigravity** are native **binaries** Codeg downloads for your platform (Cursor bundles its own runtime, so it needs no Node.js either).

Because ACP is an open protocol, the fifteen aren't a limit: you can **register any other ACP-compatible agent** yourself, from the protocol's public registry or from its distribution JSON, and Codeg drives it the same way. → [Custom Agents](/guide/custom-agents)

Two things are tracked separately for each agent: whether it's **enabled** (allowed to appear in Codeg) and whether it's **installed** (actually present on your machine). They're independent — you can enable an agent before installing it, and Codeg will help you install it when the time comes.

## Enable an agent

Agents are managed in **Settings → Agents** (titled *Agent SDK Management*). The **Agent List** on the left holds every supported agent; select one to see its details on the right. **All agents are enabled by default**, so there's usually nothing to switch on — but the enable toggle in each agent's header lets you hide the ones you don't use. A **+ Add custom agent** button in the top-right corner is how you extend the list beyond the built-in fifteen. → [Custom Agents](/guide/custom-agents)

Only **enabled** agents appear in the composer's agent picker. Disable the ones you'll never touch to keep that list short; if you ever disable everything, the composer just prompts you to *Open Agents settings* and turn one back on. The toggle reaches past the picker, too: an agent you've switched off is also dropped from the targets another agent can [delegate](/guide/multi-agent) to.

## Check it's ready — preflight

Open Settings → Agents and Codeg runs a **preflight check** on each agent — a quick health report, so you know it'll actually run before you rely on it. You'll see a **Version Status** line — the version Codeg recommends against the one installed locally, *Recommended: … · Local: …*, or *Not installed* — followed by a short checklist, each item marked **PASS**, **WARN**, or **FAIL**.

What it checks depends on how the agent is delivered:

- **npx agents** — that **Node.js** and **npm** are installed and new enough (each agent sets a minimum Node version).
- **OpenCode** and **Cursor** — that your platform is supported and the binary is downloaded (OpenCode also fetches its plugins).

Every failing check comes with a **fix button** right beside it — *Install Node.js*, *Install Plugins*, and so on — and the version row offers **Install**, **Upgrade**, or **Uninstall** as needed, plus **Custom install** for a version of your choosing where the agent supports one. When the agent's newest release is ahead of the one Codeg recommends, an amber **Upgrade to unreviewed latest …** joins them. → [Supported Agents](/guide/supported-agents#unreviewed-latest) Changed something outside Codeg? **Refresh check** re-runs the preflight.

**Installed an agent's CLI yourself?** Codeg counts that. Where it has no managed install of its own, it probes your system for the command — an `npx` package via `npm list -g`, a binary on your `PATH`, or the plain `--version` convention — and reports the real version instead of *Not installed*. Since **0.35.0** an `npx` agent's command is also looked for in **`~/.local/bin`**, after your `PATH` and before npm's own folder, which is where official installers such as Hermes's put it and where a desktop app launched from the dock wouldn't otherwise look. A self-installed **OpenCode 2.x** connects too: Codeg asks it which launch flags it takes instead of handing it 1.x's, which 2.x refuses. Since a session already preferred whatever was on your `PATH`, this just means the version row now agrees with what actually runs. Claude Code and Codex are the exception — there Codeg probes for an ACP adapter with its own executable name, not the `claude` or `codex` you already have. → [ACP adapters](/guide/supported-agents#acp-adapters)

**And for those two, the pane now explains itself.** *"I have `claude` in my terminal and Codeg says it isn't installed"* was baffling enough that Codeg answers it in place: an **ACP adapter** badge sits beside the agent's name, and the first row of its preflight is an **ACP adapter** explainer with a **Learn more** link. It reads your machine rather than reciting the general case — if it found your own CLI it says where, names the adapter package it needs instead, and points out that the two coexist and read the same config directory, so there's no second sign-in. A failed connection is just as specific: it tells you whether the *SDK* or the *ACP adapter* is the missing piece.

::: tip Preflight checks the plumbing, not the login
Preflight confirms the runtime, version, and install — not whether you're signed in. Getting an agent authenticated (its own subscription, an API key, or a custom endpoint) is a separate step. → [Authentication & Models](/guide/authentication)
:::

### When Codeg and your terminal disagree

Sometimes an agent runs fine in your terminal but Codeg insists it isn't installed. That's almost always a **PATH gap**: a desktop app launched from the dock doesn't inherit the shell setup that a terminal does, so a Node installed by `nvm`, `fnm`, or Homebrew can be invisible to it.

**Diagnose** — beside the preflight list, and on the banner you get when a session is blocked — runs **Environment diagnostics** to find out. It probes how *the app* resolves things, not your shell: the Node and npm it sees, the npm global prefix, where it looked for the agent's executable, any version-manager directories, and — the useful part — a **comparison against your login shell**, listing the PATH entries your terminal has that the app doesn't. It finishes with a plain verdict, like *"The command resolves in your terminal but not in the app — a GUI PATH gap"*, and often a concrete fix such as fully restarting the app. Since **0.35.0** that verdict also comes when your terminal finds the command and nothing else does, rather than a flat *not installed*, and the Node.js check compares the **full** version an agent needs, so a Node 20.2 no longer passes for an agent that wants 20.3. **Copy all** puts the whole report on your clipboard for a bug report.

Preflight runs on its own every time you open the screen; Diagnose is the deeper probe you run yourself when preflight and reality disagree.

## Configure an agent

Most agents work the moment they're installed, but each one's detail pane has plenty you can tune — and there are two ways to do it: **visual controls** for the everyday settings, or the agent's **raw config file** for anything the UI doesn't expose.

- **Visual settings.** The pane surfaces the common options as ordinary form controls — sign-in, model selection, custom endpoints, reasoning effort, and each agent's own switches — so you rarely need to hand-edit anything. Signing in and choosing models are covered in [Authentication & Models](/guide/authentication).
- **Environment Variables.** `KEY=value` pairs passed to the agent when it launches.
- **Config Management.** Edit the agent's own native config file (its *Native JSON Config*) directly from Codeg, for the settings the visual controls don't reach.
- **Drag to reorder.** The order of the Agent List doubles as a preference — the first enabled agent is the one Codeg reaches for when nothing else is specified (more on that below).

Change a setting while a session is open and that session keeps running on its old configuration — Codeg won't interrupt you mid-task. Instead, a bar appears at the **top of the conversation** noting it's still on the previous config; click **Reconnect to apply** and the session reloads with the new settings while **keeping its full history**. No need to close and reopen anything.

::: tip When the agent turns a setting down
Some of what the composer offers is a *request*, not a command — the agent answers with the options it actually adopted. Pick a model or a mode an agent won't take and it used to look like the dropdown springing back for no reason. Now Codeg says what was adopted instead, naming it, and **keeps your preference for next time**: a refusal is often about *this* session rather than the choice itself, and a model switch an agent declines mid-conversation frequently succeeds in a fresh one.
:::

### Let the agent handle its own files and commands

Codeg normally serves an agent's file reads, file writes and terminal commands itself, over the protocol. That's convenient — but it means those operations run in **Codeg's** process, outside whatever sandbox the agent applies to *itself*. An agent configured to deny reads of `**/.env` can't enforce it against a read it delegated: its own audit log records the profile as applied, with no violation, because nothing it controls ever saw the access.

A switch beside the environment editor on each agent's page — **Let the agent handle files and commands** — hands all three back. Codeg then advertises neither channel and refuses both if called anyway, and the agent does its own I/O under its own rules.

It's **off by default**, and the reason is on the switch: *Codeg adds no sandbox itself, so turn this on only if the agent has one configured.* Most agents ship none, so for most of them this trades a working file channel for nothing.

::: warning It also withholds delegation
Turning it on drops the **delegation** tools for that agent, because `delegate_to_agent` is a third door into the same room — it has Codeg spawn a second agent under Codeg's policy and relay the output back, which is exactly the containment leak the switch exists to close. The [Multi-Agent Collaboration](/guide/multi-agent) panel **names the agents this applies to** rather than reading "enabled" while the tools quietly aren't there. Setting `CODEG_ACP_HOST_TOOLS=agent` in the agent's environment does the same thing. → [Configuration](/getting-started/configuration)
:::

### OpenCode: permissions without the JSON

OpenCode decides what runs unattended in the `permission` block of `opencode.json`. A **Permissions** card on its settings page edits that block for you:

- **Auto-accept every permission** — one switch, one allow-all rule. It also clears the other places a run could still be stopped, since a leftover per-agent or legacy block would quietly override it.
- **Global default** — the `*` rule: **Allow**, **Ask**, or **Deny** for anything not overridden below.
- **Per-tool permissions** — one action per tool OpenCode's published schema names: shell commands, file edits, reads, reaching outside the working directory, launching sub-agents, loading skills, search, web fetch, and the rest, each with a one-line description of what it covers.
- **Fine-grained rules** for the tools that support pattern matching — `*` for any characters, `?` for exactly one, a leading `~` for your home directory.

The catch this card exists to handle is **order**. OpenCode flattens the whole block into one list and takes the **last** match, so a `*` written *after* `bash` silently overrides it — your carefully-written rule is in the file and does nothing. Codeg always writes `*` first, and a file that arrived the other way round is **flagged with a Fix order button** rather than being rendered as though it were in force. Where two overlapping patterns have no single right order, it says so and leaves the choice to you.

Every key outside the permission block survives the edit untouched, and a file Codeg can't parse **pauses the visual editor** instead of being rewritten.

### Pi: project trust

Pi loads a repository's own `.pi/` files — settings, skills, prompts, and **`.pi/extensions`, which are JavaScript modules that run at pi startup with your permissions**. Whether it does that for a given folder is pi's own trust decision, and since **0.25** it's yours to make.

When you open a Pi session in a repo that ships those files and nothing covers the folder yet, a notice appears in the conversation. **Review…** opens a dialog that names each file it found, marks the ones that **execute code**, and states the two things that are easy to miss: the answer is **inherited by every folder inside**, and it's written to pi's own trust file, so it **applies when you run `pi` yourself in a terminal** too. Trusting a project restarts pi, since it resolves trust once at startup; declining doesn't, because the running process was already skipping those files.

A **Project trust** card on pi's settings page lists every folder you've decided on, with **Revoke** on each row.

::: warning If you used Pi before 0.25
Earlier versions marked **every** folder they launched pi into as trusted, without asking — enough that creating or restoring a Pi conversation on a freshly cloned repo would run whatever `.pi/extensions` it shipped, with no prompt sent and nothing in the transcript. Dropping that behavior doesn't retract the grants it already wrote, so those folders **now block the launch until you confirm them**, and each is listed for review. They're kept rather than deleted because pi's file records no provenance — pruning them would silently revoke decisions you made inside pi yourself. Reported as [#446](https://github.com/spacering-net/codeg/issues/446). → [Privacy & Security](/reference/privacy)
:::

### Pi: reasoning on a custom provider

Pi sends a reasoning effort only for a model that **declares** it can think — and an undeclared model has every level clamped to *Off*, which is why the composer's reasoning picker used to snap straight back the moment you touched it on a custom provider.

A **Reasoning** card on pi's page is where you declare it: a switch, the **levels pi accepts** as chips — seven since **0.32.3**, when **Max** joined them — and, folded away, the value each level is sent as, which is what an endpoint expecting `LOW`/`HIGH` needs. The list isn't free-form because pi's isn't; a name outside its seven is refused by the adapter. The default-level select narrows to the levels you actually made available.

Since **0.31.0** a pi model's **context window** comes from pi's own `models.json`, resolved by provider and model id and honouring pi's 128K default for a listed model that declares none. A self-hosted or proxied model therefore shows a real percentage in the context ring, instead of a raw token count or a window pi isn't actually running with.

### Pi: what each model can think at, and the Pi it needs {#pi-thinking-levels-and-version}

Since **0.32.3** pi's thinking goes up to **Max** — on the models that offer it, and only those: the two top levels, *xhigh* and *max*, exist only for a model that names them. So the composer's thinking picker lists the levels the **current model** really has, and pi's settings page says, under the level you choose, what pi will do with the selected model — *"offers: off · low · …"*, or, in amber, that the model **doesn't offer** your level and pi will run it at the nearest one it has: the next higher, else the next lower. Models that do offer your level still get it.

Two requirements arrived with it:

- **Pi 0.81.0 or later.** Opening a session needs it. Pi's settings page flags an older runtime in amber, and a session opened on one fails with a notification that says so — with an **Open Agents settings** button — rather than an internal error.
- **Paths that mean the same thing everywhere.** The **Pi command** must be an absolute path or a command name on your `PATH`, and the **agent directory** absolute or under `~/`. A relative one — a `./pi-test.sh` wrapper, say — pointed somewhere different in every workspace, so it's refused inline and nothing saves until it's fixed.

### Cursor: families and knobs, not two hundred ids

Cursor's catalog is one id per *combination* — around two hundred of them — so reaching a thinking level or the Fast flag meant knowing a string like `claude-opus-5-thinking-max-fast` by heart. Since **0.30.0** the picker groups that catalog into **families** and puts the variations beside the family name as knobs: **Thinking**, **Effort** and **Fast**, each shown only where that family actually varies on it.

Nothing is invented. Every value handed back is one Cursor's own CLI reported, because the suffix grammar is genuinely ambiguous — Cursor ships legacy aliases like `claude-4.5-opus-high` whose *name* ends in what looks like an effort token. Ask for a combination that doesn't exist and it clamps to the nearest sibling, holding the dimension you just moved.

Cursor's **permission switch** shows the mode the session actually runs in, which it didn't before 0.30.0: *Run Everything* and *Ask* were written in a way that couldn't tell "the user chose Ask" from "never chose anything".

Since **0.31.2** Codeg also answers Cursor's **own protocol extensions**. The CLI sends `cursor/ask_question`, `cursor/create_plan`, `cursor/update_todos`, `cursor/task` and `cursor/generate_image` as requests of its own invention; unanswered, each came back "method not found" and a live turn painted a red banner on every Task it spawned. The two that need you now land in the cards you already know — the **question card** and the **plan approval**, the same path Grok's take — and the other three are answered so the agent isn't left waiting on them.

On **Linux**, Cursor also simply works again as of **0.31.2**: the compatibility patch Codeg applies to Cursor's bundle was written against the macOS build and mis-targeted on Linux, so every prompt died with a `TypeError`. Installs already carrying the bad patch are repaired in place. A `cursor-agent` you installed yourself under `/opt` is neither patched nor repaired — it's outside what Codeg manages.

### Codex: sandbox and approvals

Codex's pane has a **Sandbox & approvals** group — the two questions of how much it can touch and when it stops to ask:

- **Approval policy** — how readily Codex asks permission: **On request** (it decides when to ask), **Untrusted** (only known-safe read-only commands run unattended), **Never** (no prompts at all), or **Granular**, which breaks it down per prompt type — shell escalations, policy rules, skill scripts, permission requests, and MCP prompts — each of which is either shown to you or auto-rejected. Left alone it follows Codex's own default of asking on request.
- **Sandbox mode** — what it can write: **Read-only**, **Workspace write**, or **Full access (no sandbox)**. Workspace write adds **Extra writable folders** (absolute paths, one per line), plus switches for **network access** and whether to exclude **TMPDIR** and **/tmp** — all off by default.

Two things to know: these go into your global `~/.codex/config.toml`, so the `codex` CLI and its IDE sessions pick them up too; and they're **thread defaults** — they govern the turns Codex starts by itself. What an ordinary prompt runs under is the **mode** the session is in, and Codeg derives the mode a session *starts* in from these two settings; after that, the composer's mode picker decides. Restart a session to apply a change. On Windows, workspace write falls back to read-only unless you've enabled Codex's experimental Windows sandbox.

#### Codex's modes {#codex-modes}

The composer offers Codex's own four presets, named in English in every language. Since codex-acp **2.0** (Codeg **0.32.3**) they are:

| Mode | What it may write | Who answers an escalation |
| --- | --- | --- |
| **Read-only** | Nothing — Codex asks before every edit | You |
| **Workspace access** | The workspace | You, for anything beyond it |
| **Auto review** *(default)* | The workspace | A model, which screens each request and asks you only about what looks unsafe |
| **Full access** | Anything — no sandbox | No one: nothing is asked |

*Auto review* was called *Approve for me* before 2.0. And a session you'd left on *Ask for approval* now opens on **Read-only** — which is stricter than it sounds, because on adapters 1.7 to 1.13 that preset carried a **writable** workspace: those versions shipped no read-only sandbox at all, and 2.0 restored it. Pick **Workspace access** to edit the workspace freely again while being asked about everything else.

The mode a session **starts** in comes from your config:

| In `~/.codex/config.toml` | The session starts in |
| --- | --- |
| `sandbox_mode = "read-only"` | Read-only |
| `workspace-write`, approval `never` | Auto review |
| `workspace-write`, any other approval | Workspace access |
| `danger-full-access`, approval `never` | Full access |
| `danger-full-access`, any other approval | Workspace access — the sandbox is tightened rather than the approvals dropped |
| no `sandbox_mode` | The adapter's default, Auto review |

On an adapter older than 2.0, the two *Workspace access* rows start in Auto review instead. Full access is only ever the result of an exact match on both settings — nothing is inferred into it — and a `default_permissions` profile in the file takes Codeg out of the derivation entirely, since Codex resolves through that profile and a derived mode would override it.

::: warning Untrusted has no equivalent here
**Untrusted** is the one approval policy that can't be honored: none of the adapter's presets is it, so a Codeg session treats it as **on request**, where the model decides when to ask and anything the sandbox already permits stops prompting. The panel says so rather than letting the control look effective. If Untrusted was your containment, tighten **Sandbox mode** instead.

Until **0.25** neither setting reached a Codeg session at all — the adapter re-sent its own policy on every turn, so an explicitly read-only sandbox could be silently widened. Deriving the starting mode is the fix, and it's keyed on **sandbox mode** because that's the axis where guessing wrong *enlarges* access: the derivation never picks a wider sandbox than the one you set. (What it can't do is supply a sandbox the adapter lacks — hence the 1.7 to 1.13 gap above.)
:::

Two more switches in the same pane are worth knowing about:

- **Allow questions in Default mode.** Codex will only call its `request_user_input` tool in *Plan* mode, so in an ordinary turn its question is refused outright and **no question card ever reaches you** — the agent asks, gets told the tool is unavailable, and carries on guessing. Turning this on lets it ask in ordinary turns too. It writes `[features].default_mode_request_user_input` into your `~/.codex/config.toml` — the same key Codex's own `codex features enable` would set, and the flag is still under development upstream. Feature flags resolve when a thread is created, so it **takes effect on your next session**, not the one you have open.
- **Custom models** can be added in one of two shapes. The default clones a native GPT entry; pick the **OpenAI-compatible** one for a third-party gateway, and Codex sends a plain Responses request — no code-mode tools, no multi-agent, no responses-lite, no custom apply-patch tool — which is all such a gateway implements. It's a preset over ordinary per-field overrides, so you can switch a model that already exists either way.
- **New official models arrive by themselves.** A customized list — one where you've added models or taken official ones out — used to replace Codex's own table outright, so a model OpenAI shipped later never appeared until you refreshed the list and saved it again. Since **0.32.4** Codeg tries to rebuild it whenever Codex is installed or upgraded: your own models first, then every official one in Codex's own order, minus the ones you removed — those stay removed. If the installed Codex's list can't be read, the list you have stays as it was.
- **The default model is Codex's own.** A Codex conversation that never had a model picked runs on whatever Codex defaults to — **GPT-6.1 Sol** since **0.32.4**. If the provider you use for Codex doesn't serve it yet, pick a model in the composer or fill in the provider's **Model** field.

### Claude Code: attribution and telemetry

Claude Code's pane carries two switches that Codeg deliberately ships opposite to Claude Code's own defaults:

- **Send attribution/billing identifier to the API** — **off**, so Codeg doesn't add the identifying header.
- **Disable telemetry or redundant network requests** — **on**, so non-essential traffic stays off.

Codeg writes both explicitly rather than leaving them implied, so what the pane shows is what's applied. Flip either back if your setup needs it — a managed account that bills by attribution header, say. → [Privacy](/reference/privacy)

### Qoder: sign in, or hand a token to a headless box

Qoder's pane opens with an **Account** row that says whether you're signed in, plus the auth method Qoder itself recorded. Signing in is Qoder's own browser flow — the pane gives you the exact **`qoder login`** command to paste into a terminal, spelled with the **full path** to the copy Codeg manages, because that one lives in Codeg's cache rather than on your `PATH` and a bare `qoder login` would just say *command not found*. Run it, then hit refresh.

For a machine where no browser can open — a server, a container — there's a **Personal access token** field instead, passed as `QODER_PERSONAL_ACCESS_TOKEN`. Leave it empty to use the account login.

Everything else Qoder reads lives in **one file**, `$QODER_CONFIG_DIR/settings.json` (default `~/.qoder`), shared with the `qoder` CLI — and **Advanced: raw settings.json** edits it verbatim. That's deliberate: writing the whole file back is also the only way to **delete** a key, which a field-by-field editor can't express.

Model and reasoning effort aren't here. Qoder reports them over ACP, so the composer's own selectors own them, per session — and since **0.35.2** a conversation's details show the model you switched to last, not the one it started on. → [Authentication & Models](/guide/authentication)

Since **0.35.2** Qoder can also ask you things with **its own question tool**, on the same question card the other agents use, where before it had to fall back to Codeg's. The answers you pick stay on the card afterwards — multi-select ones included — as they now do for Claude Code's own question tool too, instead of reading *No selection*.

### Antigravity: one file decides how it signs in

Antigravity's ACP server takes its authentication intent from exactly one place — `auth.type` in `$GEMINI_HOME/antigravity-acp/settings.json` — and without it **every new session fails outright** with *Authentication required*. Codeg writes that file for you at launch, so you don't hit that wall: when neither the file nor this pane names a method, it writes **Sign in with Google**, which merely makes the server open a browser. A method already in the file is never overridden. The pane is where you pick something else.

Four methods, each asking for what it actually needs:

| Method | What it needs |
| ------ | ------------- |
| **Sign in with Google** | Your Google account, on any Antigravity plan including the free tier. The first new session opens a browser to finish signing in, then caches the token |
| **Gemini Enterprise** | A GCP **project and location**, plus a browser sign-in on the first session |
| **Gemini API key** | A Gemini Developer API key, passed as `GEMINI_API_KEY` |
| **Gemini Enterprise Agent Platform** | Formerly Vertex AI. Either an API key on its own, or a project and location with Application Default Credentials (`gcloud auth application-default login`) |

Save with a method's requirements unmet and the pane refuses, naming what's missing, rather than letting a session fail later for a reason you'd have to guess at.

Two behaviours worth knowing:

- **Credentials outside the method you picked are cleared at launch.** A `GEMINI_API_KEY` left in your shell can't quietly take over a session you configured for Google sign-in.
- **If Codeg can't write that settings file** — you've made it read-only, say — it tells you so plainly instead of pretending the save took. Your choice is stored on Codeg's side, but Antigravity keeps authenticating the way the file says, so set `auth.type` yourself or move the file aside and save again.

Model and session mode come over ACP, so they live in the composer rather than here. Since **0.34.0**, Antigravity **1.3.0** also reports how full its context window is, so the ring beside the composer follows an Antigravity session live. And since **0.35.2**, with **1.4.0**, the model picker lists **one model per family**, with the variant chosen in a separate **Thinking Level** option. A model you'd picked before the update carries over, and a switch takes effect from your next message.

Since **0.30.3** Antigravity also takes a **custom version**, like the other downloaded agents — and asking for a version that was never published now **fails the download** instead of quietly filing the pinned build under the number you typed, which left Version Status confidently reporting a build you didn't have. Google renamed its downloads from **1.2.0** on, so a custom version has to be **1.2.0 or later** — **1.2.1 or later** on an Intel Mac, where 1.2.1 is the first build — and an earlier one fails to download.

#### Signing in on a machine with no browser

Antigravity runs its Google sign-in **itself**: it opens a port on `127.0.0.1`, calls the system browser, and waits five minutes for the redirect to come back. On a headless server there is no browser to call — and the call fails silently rather than raising — so the first session used to hang for those five minutes and die without ever showing a link anyone could open.

Since **0.29.0** the Antigravity pane offers a browser-free sign-in. Codeg starts a short-lived agent process, catches the authorization URL it prints, and shows it to you:

1. Open that URL in **whatever browser you do have** — your phone, your laptop, anywhere.
2. Consent as normal. You'll land on a `127.0.0.1` page that **won't load**, because that port is on the server, not on the device you're holding. That's expected.
3. Copy that failed page's **full address** and paste it back into Codeg.

Codeg is running on the machine where the port *is* listening, so it performs the redirect on your behalf and the sign-in completes.

## Start a session

Start a new conversation and the composer shows an **agent picker** — a row of pills, one per enabled agent. Click one and Codeg connects to it; from there, choose a **model** and a **mode** in the composer. Both of those lists come from the **agent itself**, not Codeg, so what's on offer depends on which agent you're running. Your choice of agent locks in once you send the first message — a conversation stays with the agent that started it.

**Which agent by default?** Codeg picks in this order:

1. The folder's **default agent**, if you've set one (folder menu → *Set default agent*).
2. Otherwise, the **first agent** in your Settings → Agents order.

So a per-folder default always wins, and the list order is the fallback. → [The Workspace](/guide/workspace#folders-and-the-sidebar) covers setting a folder's default.

The first time you use an agent in a session, you'll see **Connecting…** while Codeg launches the CLI and completes its handshake. Since **0.35.2** you can still change your mind then: pick another agent and the one that was starting is stopped at once, and the last one you pick is the one that connects. If it can't connect — the agent's disabled, not installed, unsupported on your platform, or slow to respond — Codeg raises an **alert**: a toast that says what went wrong, with **Retry** and, when the fix lives there, **Open Agents settings**. The alert stays in the status bar's **Alerts** list afterwards, without the Retry. The connection heart below the composer turns red and says why too.

## Connection status

While you work, the **connection heart** below the composer shows the agent's state — connected, connecting, error, or disconnected — with *Responding…* told apart from a resting *Connected* in its popover. Click it for the details and a **Reconnect** that tries to resume the session. Where the agent can't load one — Cline is among them — or the load fails, Codeg starts a new agent session on the same conversation instead: the transcript stays, but the agent no longer has the earlier context. → [When the connection looks wrong](/guide/workspace#when-the-connection-looks-wrong)

Sessions you're not looking at may disconnect after a few idle minutes to free up resources, but the tab you're actively in stays connected, and Codeg **reconnects automatically** when you come back to a session.

## Next steps

- [**Supported Agents**](/guide/supported-agents) — the full roster, and where each agent keeps its sessions.
- [**Custom Agents**](/guide/custom-agents) — register an ACP-compatible agent that isn't on that roster.
- [**Authentication & Models**](/guide/authentication) — sign in with a subscription, an API key, or a custom endpoint, and choose your model.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — let one agent delegate parts of a task to others.
