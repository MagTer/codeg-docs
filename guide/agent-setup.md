---
title: Per-Agent Setup
description: Agent by agent, what's particular to each one Codeg drives — how it signs in, the switches on its settings pane, and the quirks worth knowing — from Claude Code and Codex to Kiro, ZCode, TRAE CLI and Command Code.
---

# Per-Agent Setup

Every agent gets the same general controls in **Settings → Agents** — the enable switch, preflight, environment variables, and the raw config editor where it has one — and those are covered in [Working with Agents](/guide/agents). Beyond them, each agent's detail pane carries what is particular to that agent: how it signs in, the switches its CLI understands, and the quirks worth knowing before you rely on it. This page goes through them one agent at a time, in the order of the Agent List.

The roster itself — who builds each agent, what it runs on, where it keeps its sessions — is [Supported Agents](/guide/supported-agents), and the sign-in routes they share are in [Authentication & Models](/guide/authentication).

## Claude Code

Anthropic's coding agent. What Codeg installs for it is the **`claude-agent-acp`** adapter rather than the `claude` CLI — [ACP adapters](/guide/supported-agents#acp-adapters) explains the difference — and the adapter reads the same `~/.claude` directory, so the login you already have carries over. The pane signs it in with **Official Subscription**, a **Custom Endpoint**, or a saved [Model Provider](/guide/authentication#save-and-reuse-a-model-provider).

Two things Claude Code's adapter does show up in Codeg since **0.37.0**: it [suggests your next prompt](/guide/conversations#let-claude-code-suggest-the-next-prompt) — for one more request after most turns — and [Remote Control](/guide/conversations#continue-on-your-phone-—-remote-control) lets you carry a session to your phone. Custom subagents you've defined for Claude Code appear as an **Agent** option on the composer's settings button.

### Attribution and telemetry {#claude-code-attribution-and-telemetry}

Claude Code's pane carries two switches that Codeg deliberately ships opposite to Claude Code's own defaults:

- **Send attribution/billing identifier to the API** — **off**, so Codeg doesn't add the identifying header.
- **Disable telemetry or redundant network requests** — **on**, so non-essential traffic stays off.

Codeg writes both explicitly rather than leaving them implied, so what the pane shows is what's applied. Flip either back if your setup needs it — a managed account that bills by attribution header, say. → [Privacy](/reference/privacy)

## Codex

OpenAI's coding agent, also driven through an adapter, **`codex-acp`** — see [ACP adapters](/guide/supported-agents#acp-adapters). It's the agent that signs in *inside* Codeg: choose **Official Subscription** and **Log in with ChatGPT** shows a code and a link to approve in your browser. → [Sign in with a subscription](/guide/authentication#sign-in-with-a-subscription)

### Sandbox and approvals {#codex-sandbox-and-approvals}

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

## Gemini

Google's official Gemini CLI, run through `npx`. Choose **Google Login** and run `gemini` once in a terminal to finish Google's sign-in, or use a **Custom Endpoint** or a saved [Model Provider](/guide/authentication#save-and-reuse-a-model-provider). Its sessions live under `~/.gemini`, which `GEMINI_CLI_HOME` relocates by naming the directory *above* `.gemini` — not the same convention as Antigravity's `GEMINI_HOME`. → [Where each agent keeps its sessions](/guide/supported-agents#where-each-agent-keeps-its-sessions)

## OpenClaw

A personal AI assistant you self-host, run through `npx`. It **refuses MCP servers**, so none of yours reach an OpenClaw session and it can't lead a [delegation](/guide/multi-agent) — though another agent can delegate *to* it. Its session store, `~/.openclaw/agents/`, can't be relocated.

## OpenCode

An open-source coding agent that Codeg downloads as a native binary for your platform. A copy you installed yourself is picked up too — an **OpenCode 2.x** included, since Codeg asks it which launch flags it takes instead of handing it 1.x's.

### Permissions without the JSON {#opencode-permissions-without-the-json}

OpenCode decides what runs unattended in the `permission` block of `opencode.json`. A **Permissions** card on its settings page edits that block for you:

- **Auto-accept every permission** — one switch, one allow-all rule. It also clears the other places a run could still be stopped, since a leftover per-agent or legacy block would quietly override it.
- **Global default** — the `*` rule: **Allow**, **Ask**, or **Deny** for anything not overridden below.
- **Per-tool permissions** — one action per tool OpenCode's published schema names: shell commands, file edits, reads, reaching outside the working directory, launching sub-agents, loading skills, search, web fetch, and the rest, each with a one-line description of what it covers.
- **Fine-grained rules** for the tools that support pattern matching — `*` for any characters, `?` for exactly one, a leading `~` for your home directory.

The catch this card exists to handle is **order**. OpenCode flattens the whole block into one list and takes the **last** match, so a `*` written *after* `bash` silently overrides it — your carefully-written rule is in the file and does nothing. Codeg always writes `*` first, and a file that arrived the other way round is **flagged with a Fix order button** rather than being rendered as though it were in force. Where two overlapping patterns have no single right order, it says so and leaves the choice to you.

Every key outside the permission block survives the edit untouched, and a file Codeg can't parse **pauses the visual editor** instead of being rewritten.

**Sharing**, on the pane's **Behavior & compaction** card, no longer does anything: OpenCode discontinued session sharing in **1.19.1**, which Codeg has bundled since **0.36.0** — the setting's hint says so. And on macOS 27, where a build needs a valid signature to launch at all, OpenCode's first properly signed build is **1.18.34**; **1.19.3**, pinned since **0.37.0**, is signed for both Apple Silicon and Intel.

## Cline

An autonomous coding-agent CLI, run through `npx`.

::: warning Cline on macOS 27
macOS 27 kills Cline **3.0.65 and earlier** at launch, because those builds carry a broken signature — the CLI exits at once, and a session dies within a second of starting. On Apple Silicon, builds from **3.0.66** on pass the signature check, **3.0.73** — the version Codeg pins since **0.37.0** — included; if yours is older, press **Upgrade** in Settings → Agents. The **Intel** build of 3.0.66 through 3.0.73 still fails the strict check, and whether macOS 27 stops it has not been tested.
:::

Three changes from 0.36 and 0.37 are worth knowing:

- **No Codeg tools.** Cline never connects the MCP servers handed to it over ACP, so since **0.36.0** Codeg stops handing it its companion. That means no [delegation](/guide/multi-agent), live feedback, question card, browser or computer-use tools in a Cline session — and nothing in the app says so. The MCP servers in Cline's own settings, which Settings → MCP writes to, keep working.
- **It stays on the version Codeg installed.** Since **0.37.0** Codeg launches it with `CLINE_NO_AUTO_UPDATE=1`, so Cline no longer updates itself to its newest release once a conversation closes.
- **Switching the model mid-conversation works**, and so does the model Codeg reapplies when you reopen a Cline conversation: since **0.37.0** each session runs in the `cline --acp` process Codeg started, rather than on Cline's shared hub. **Plan** and **Act** still only take effect when Cline starts working on a conversation, so switching after the first message does nothing until Cline changes that.

## Hermes

Nous Research's self-improving agent, which manages its own stable of model providers.

::: info Hermes moved to npm in 0.24
Hermes used to be the one Python entry, installed through `uv`. Upstream retired that channel — PyPI stops at **0.19.0** — so Codeg's managed install is now an npm package pinned to an exact, audited version, whose install step checks out the official Hermes release and bootstraps **its own isolated Python environment** inside the package — Python 3.14 since **0.35.0**, and upgrading rebuilds it. You still don't manage a Python environment; it just isn't `uv` on your machine any more. Config and credentials stay exactly where they were, in `~/.hermes`.

Two practical consequences: the managed install honors **`HTTP_PROXY` / `HTTPS_PROXY`** for its own downloads, and if you have Hermes from the **official installer**, that copy still wins over the managed one — it self-updates, so Codeg defers to it rather than shadowing it. Codeg looks on the app's `PATH` first, then in `~/.local/bin`, then in npm's own folder, so a different `hermes` that comes first on that `PATH` still takes precedence. The `~/.local/bin` step is new in **0.35.0**: the installer puts Hermes there, a desktop app's `PATH` often lacks it, and Codeg used to miss that copy when it wasn't started from a terminal.
:::

### Pick a provider {#hermes-pick-a-provider}

Hermes is a special case — it manages its own stable of model providers, so instead of a single key it has its own config pane with a **provider** dropdown, grouped three ways:

- **API key** providers — enter your key (and a base URL, if the provider needs one) plus a model name. The key is saved to Hermes's own `~/.hermes/.env`.
- **OAuth** providers (Nous, OpenAI Codex, Gemini, GitHub Copilot, and more) — no key to type; click **Run Hermes setup** and Hermes authenticates you in a terminal.
- **AWS** (Bedrock) — uses your existing AWS credentials from the environment.

For anything the pane doesn't cover, **Open Config Folder** reveals `~/.hermes`, and an Advanced section lets you edit Hermes's `config.yaml` directly.

## CodeBuddy

Tencent Cloud's coding assistant, run through `npx`. Sign in by running `codebuddy` once in a terminal, and Codeg picks that login up.

A conversation started in CodeBuddy's own terminal on **2.168.2** runs every step through a single REPL tool, so in Codeg it shows one **REPL** card per step; conversations you start in Codeg aren't affected. Since **0.36.0** a reopened conversation shows a slash command the way you typed it, not the prompt it expanded to.

## Kimi Code

Moonshot AI's CLI coding assistant, run through `npx`. If your account is on **kimi.ai** rather than kimi.com, signing in needs `kimi login --region global`. Without the flag the CLI always targets kimi.com and a kimi.ai account has no way in — Codeg's login hint names it for you.

### Provider, model, and reasoning {#kimi-code-provider-model-and-reasoning}

Kimi Code is the other agent with a pane of its own, rebuilt in **0.23**. The reason is a quirk of the CLI: `kimi acp` only accepts a **stored login token**, never a key handed to it at launch. So an API key can't simply be passed through — Codeg writes a **managed provider** into `~/.kimi-code/config.toml` and seeds a local gate token so sessions can open at all. Inference still runs on your key; the token only unlocks the door.

**Credential** — two mutually exclusive routes:

- **API key** — pick the provider shape from six Kimi accepts (**Kimi / Moonshot**, **OpenAI** in either Chat Completions or Responses form, **Anthropic**, **Google Gemini**, or **Google Vertex AI**, which uses your GCP credentials and takes no key at all), then a base URL where one is needed. Moonshot's two regions — `api.moonshot.ai` and `api.moonshot.cn` — are one click apart.
- **Sign in with a Kimi account** — run `kimi login` in a terminal and Codeg reuses that login, storing nothing. Saving this way removes the API-key gate token.

**Model** — the model id written to `config.toml`, plus **Max context size**. That second field looks optional and isn't: Kimi's schema requires it, and without it Kimi discards the entire model block and every prompt comes back empty. It defaults to **262144**. **Test & list models** calls your key and reports what it can actually reach, so a typo shows up as *this model is not in the list* rather than as a *model not found* mid-conversation.

**Reasoning** — Kimi only offers a **Thinking** picker in the composer when the model declares a reasoning capability, so this section declares one for it. **Levels offered** become the picker's rows and are forwarded to the provider verbatim, so pick ones your model accepts; choose none and the composer falls back to a plain Off / On toggle. You can set a **default level** (or let Kimi choose), and for a model that always reasons, drop the *Off* row entirely. Changes take effect on new sessions.

**Advanced** holds **Credential placement** — inline `api_key` versus the provider's env sub-table — and a raw editor for `config.toml`, which overwrites the whole file verbatim and replaces everything the structured fields above set.

**History reads the way it did live.** Since **0.35.2**, on Kimi Code **2.2.0**, a reopened conversation shows your prompts as you sent them: attachments as badges and thumbnails rather than raw `<resource>` text, a skill or command you invoked as `/name args`, and no internal prompt standing in for your message on a turn Kimi started itself. Titles leave attachment text out, name a mentioned file by its name, stop at 100 characters, and no longer flip between two versions.

::: warning A leftover environment variable wins
`kimi acp` reads the `KIMI_MODEL_*` family — `KIMI_MODEL_BASE_URL`, `KIMI_MODEL_API_KEY`, `KIMI_MODEL_NAME` — *before* `config.toml`, so one left in the agent's [Environment Variables](/guide/agents#configure-an-agent) silently overrides everything this pane writes. The pane warns you while any is still set, and saving clears them — so what you can see is what's in force.
:::

## Pi

A self-extensible coding agent, run through `npx`. It quietly drops the MCP servers handed to it, so it can't lead a [delegation](/guide/multi-agent) — another agent can still delegate to it.

### Project trust {#pi-project-trust}

Pi loads a repository's own `.pi/` files — settings, skills, prompts, and **`.pi/extensions`, which are JavaScript modules that run at pi startup with your permissions**. Whether it does that for a given folder is pi's own trust decision, and since **0.25** it's yours to make.

When you open a Pi session in a repo that ships those files and nothing covers the folder yet, a notice appears in the conversation. **Review…** opens a dialog that names each file it found, marks the ones that **execute code**, and states the two things that are easy to miss: the answer is **inherited by every folder inside**, and it's written to pi's own trust file, so it **applies when you run `pi` yourself in a terminal** too. Trusting a project restarts pi, since it resolves trust once at startup; declining doesn't, because the running process was already skipping those files.

A **Project trust** card on pi's settings page lists every folder you've decided on, with **Revoke** on each row.

::: warning If you used Pi before 0.25
Earlier versions marked **every** folder they launched pi into as trusted, without asking — enough that creating or restoring a Pi conversation on a freshly cloned repo would run whatever `.pi/extensions` it shipped, with no prompt sent and nothing in the transcript. Dropping that behavior doesn't retract the grants it already wrote, so those folders **now block the launch until you confirm them**, and each is listed for review. They're kept rather than deleted because pi's file records no provenance — pruning them would silently revoke decisions you made inside pi yourself. Reported as [#446](https://github.com/spacering-net/codeg/issues/446). → [Privacy & Security](/reference/privacy)
:::

### Reasoning on a custom provider {#pi-reasoning-on-a-custom-provider}

Pi sends a reasoning effort only for a model that **declares** it can think — and an undeclared model has every level clamped to *Off*, which is why the composer's reasoning picker used to snap straight back the moment you touched it on a custom provider.

A **Reasoning** card on pi's page is where you declare it: a switch, the **levels pi accepts** as chips — seven since **0.32.3**, when **Max** joined them — and, folded away, the value each level is sent as, which is what an endpoint expecting `LOW`/`HIGH` needs. The list isn't free-form because pi's isn't; a name outside its seven is refused by the adapter. The default-level select narrows to the levels you actually made available.

Since **0.31.0** a pi model's **context window** comes from pi's own `models.json`, resolved by provider and model id and honouring pi's 128K default for a listed model that declares none. A self-hosted or proxied model therefore shows a real percentage in the context ring, instead of a raw token count or a window pi isn't actually running with.

### What each model can think at, and the Pi it needs {#pi-thinking-levels-and-version}

Since **0.32.3** pi's thinking goes up to **Max** — on the models that offer it, and only those: the two top levels, *xhigh* and *max*, exist only for a model that names them. So the composer's thinking picker lists the levels the **current model** really has, and pi's settings page says, under the level you choose, what pi will do with the selected model — *"offers: off · low · …"*, or, in amber, that the model **doesn't offer** your level and pi will run it at the nearest one it has: the next higher, else the next lower. Models that do offer your level still get it.

Two requirements arrived with it:

- **Pi 0.81.0 or later.** Opening a session needs it. Pi's settings page flags an older runtime in amber, and a session opened on one fails with a notification that says so — with an **Open Agents settings** button — rather than an internal error.
- **Paths that mean the same thing everywhere.** The **Pi command** must be an absolute path or a command name on your `PATH`, and the **agent directory** absolute or under `~/`. A relative one — a `./pi-test.sh` wrapper, say — pointed somewhere different in every workspace, so it's refused inline and nothing saves until it's fixed.

## Grok

xAI's coding agent, run through `npx`. Its pane has an **Authentication method** picker — **Official Subscription** (`grok login`), **XAI API key**, or **Custom endpoint** → [Sign in with a subscription](/guide/authentication#sign-in-with-a-subscription) — and, unlike most agents, a **reasoning effort** dropdown of its own, from low up to **Max**, written into Grok's own config.

## Cursor

Anysphere's coding agent, downloaded as a native binary that carries its own Node runtime. Its **Authentication method** is either the **official subscription** — Codeg shows the `cursor-agent login` command to run — or a **Cursor API key** for headless machines, and both are written into `~/.cursor/cli-config.json`, shared with the CLI. → [Sign in with a subscription](/guide/authentication#sign-in-with-a-subscription)

::: warning Cursor: a green light that wasn't
`cursor-agent status` reports itself signed in from the mere **presence** of a token, expiry unread — while the protocol path refuses to open a session on a token within five minutes of expiring, and the CLI has no refresh grant. An aged-out login therefore read **Logged in** forever while every single prompt failed.

Since **0.31.2** Codeg checks the credential against Cursor itself and says what it finds: **Signed in — credential not verified** when a stored login can't be used (usually an expired session — sign in again; the CLI can't refresh a browser login on its own), or the same state naming a **rejected API key** (revoked, expired or mistyped) when that's the method. The sign-in command Codeg offers also works on a **server**, where there is no browser to open: it's prefixed `NO_OPEN_BROWSER=1` so `cursor-agent` prints a URL for you to open on your own machine instead — except on a Windows host, where that POSIX prefix wouldn't run. For an unattended server, use the API key method.
:::

### Families and knobs, not two hundred ids {#cursor-families-and-knobs-not-two-hundred-ids}

Cursor's catalog is one id per *combination* — around two hundred of them — so reaching a thinking level or the Fast flag meant knowing a string like `claude-opus-5-thinking-max-fast` by heart. Since **0.30.0** the model picker on Cursor's settings pane — which sets the model a session starts on — groups that catalog into **families** and puts the variations beside the family name as knobs: **Thinking**, **Effort** and **Fast**, each shown only where that family actually varies on it.

Nothing is invented. Every value handed back is one Cursor's own CLI reported, because the suffix grammar is genuinely ambiguous — Cursor ships legacy aliases like `claude-4.5-opus-high` whose *name* ends in what looks like an effort token. Ask for a combination that doesn't exist and it clamps to the nearest sibling, holding the dimension you just moved. Once a session is running, Cursor reports the same knobs itself — context size among them — as settings of their own on the composer's settings button.

Cursor's **permission switch** shows the mode the session actually runs in, which it didn't before 0.30.0: *Run Everything* and *Ask* were written in a way that couldn't tell "the user chose Ask" from "never chose anything".

Since **0.31.2** Codeg also answers Cursor's **own protocol extensions**. The CLI sends `cursor/ask_question`, `cursor/create_plan`, `cursor/update_todos`, `cursor/task` and `cursor/generate_image` as requests of its own invention; unanswered, each came back "method not found" and a live turn painted a red banner on every Task it spawned. The two that need you now land in the cards you already know — the **question card** and the **plan approval**, the same path Grok's take — and the other three are answered so the agent isn't left waiting on them.

On **Linux**, Cursor also simply works again as of **0.31.2**: the compatibility patch Codeg applies to Cursor's bundle was written against the macOS build and mis-targeted on Linux, so every prompt died with a `TypeError`. Installs already carrying the bad patch are repaired in place. A `cursor-agent` you installed yourself under `/opt` is neither patched nor repaired — it's outside what Codeg manages.

**The MCP settings Cursor adds itself survive.** Since **0.37.0**, saving a Cursor server in Settings → MCP, or reinstalling it from the Marketplace, keeps fields such as `envFile`, `auth` and `tls`; an SSE server stays SSE; and those Cursor-only fields no longer leak into the configs Codeg writes for other agents. → [MCP Servers](/guide/mcp)

## DeepSeek Harness

DeepSeek's own coding harness, which Codeg drives through the community `deepseek-acp` bridge rather than DeepSeek's automation-only transport — [why](/guide/supported-agents#deepseek-harness). It needs Node.js **22** or later.

### Endpoint and key {#deepseek-harness-endpoint-and-key}

**DeepSeek Harness**'s pane is the short one, because the adapter takes both of its settings as plain environment variables:

- **API endpoint** — leave it blank for DeepSeek's own `https://api.deepseek.com`. Fill it in for a proxy or a compatible endpoint; it wants a full `http(s)` URL with no query string.
- **API key** — passed to the agent as `DEEPSEEK_API_KEY`.

Model and reasoning effort are **not** here. The adapter advertises both as ordinary session options, so they live in the [composer](/guide/conversations#start-a-session-—-the-composer) and belong to a conversation rather than to the agent. The launch-default model is `DEEPSEEK_ACP_MODEL` in the agent's raw [Environment Variables](/guide/agents#configure-an-agent) — deliberately not in this pane, so a save here can never overwrite a model line you're editing there.

::: tip An environment variable outranks the credentials file
DeepSeek Harness can also be signed in from a terminal, which stores the key in `~/.dsh/.credentials.yaml`. The environment takes precedence — so if that's how you signed in, **leave the API key field empty** rather than filling it with the same value and having two places to keep in step.
:::

## Qoder

Alibaba's coding-agent CLI, run through `npx`.

### Sign in, or hand a token to a headless box {#qoder-sign-in-or-hand-a-token-to-a-headless-box}

Qoder's pane opens with an **Account** row that says whether you're signed in, plus the auth method Qoder itself recorded. Signing in is Qoder's own browser flow — the pane gives you the exact **`qoder login`** command to paste into a terminal, spelled with the **full path** to the copy Codeg manages, because that one lives in Codeg's cache rather than on your `PATH` and a bare `qoder login` would just say *command not found*. Run it, then hit refresh.

For a machine where no browser can open — a server, a container — there's a **Personal access token** field instead, passed as `QODER_PERSONAL_ACCESS_TOKEN`. Leave it empty to use the account login.

Everything else Qoder reads lives in **one file**, `$QODER_CONFIG_DIR/settings.json` (default `~/.qoder`), shared with the `qoder` CLI — and **Advanced: raw settings.json** edits it verbatim. That's deliberate: writing the whole file back is also the only way to **delete** a key, which a field-by-field editor can't express.

Model and reasoning effort aren't here. Qoder reports them over ACP, so the composer's own selectors own them, per session — and since **0.35.2** a conversation's details show the model you switched to last, not the one it started on. → [Authentication & Models](/guide/authentication)

Since **0.35.2** Qoder can also ask you things with **its own question tool**, on the same question card the other agents use, where before it had to fall back to Codeg's. The answers you pick stay on the card afterwards — multi-select ones included — as they now do for Claude Code's own question tool too, instead of reading *No selection*.

## Google Antigravity

Google's agent-first coding tool, downloaded as a native binary. Its ACP server ships as a downloaded tree with no standalone command name, so it's the one agent Codeg can't pick up from a copy on your `PATH`.

::: info Antigravity runs on Intel Macs since 0.32.2
Antigravity used to be the roster's one platform hole: Google published it for Apple Silicon, Linux and Windows only, and Codeg refused the install on an Intel Mac. **1.2.1** is its first release with an Intel build, and Codeg moved to it in **0.32.2** — so every agent on the roster now runs anywhere its runtime does. **1.4.1**, pinned since **0.37.0**, still ships one.
:::

### One file decides how it signs in {#antigravity-one-file-decides-how-it-signs-in}

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

Antigravity advertises only a few commands of its own, so since **0.36.0** its `/` menu also lists your [skills](/guide/skills) — read from the folders Settings → Skills manages, after its own commands, leaving out any skill named like one of them. The automation and to-do editors list them too.

## Kiro CLI

Amazon's Kiro agent, new in **0.36.0**. Codeg doesn't install it: you install `kiro-cli` with [Kiro's own installer](https://kiro.dev/docs/getting-started/installation/), and Codeg finds it on your `PATH` or in `~/.local/bin` and launches `kiro-cli acp`, Kiro's own ACP server. Its badge reads **official installer** and its version row shows the version you have — or *Not found on this machine*, with an **Install guide** link. **Upgrade** runs `kiro-cli update --non-interactive`, Kiro's own updater, so the copy your terminal uses is the one updated; sessions already running keep their build until they reconnect. There's no Custom install and no unreviewed-latest offer.

**Signing in** is Kiro's own business: run `kiro-cli login` once in a terminal and Codeg's sessions reuse it. For a server or a container where no browser can open, fill in **API key (optional)** on the pane's **Configuration** card; it's passed as `KIRO_API_KEY` and stored in Codeg's database. The same card holds **Permission mode**:

- **Ask before running tools (default)** — Kiro sends you each tool call that needs approval, shell commands and file writes among them; read-only tools run without asking.
- **Trust all tools (--trust-all-tools)** — sessions launch with that flag, and nothing asks. It applies to new sessions; an open one shows the *Reconnect to apply* bar.

Save either with **Save Kiro Config**.

**In a conversation**, Kiro reports its model, its agent and its reasoning in its own way, so Codeg builds the settings from what it reports: **Model**, **Agent** — `kiro_default`, `kiro_planner`, `kiro_guide` and any agents you keep in `~/.kiro/agents` — and, for a model that supports them, **Thinking** and **Reasoning effort**. Their names stay in English in every interface language. The `/` menu lists Kiro's own commands, then its skills, its `.kiro/prompts` and its MCP prompts; a prompt named like a built-in command, or one whose name starts with `$`, is left out, because Kiro would run something else.

**History** comes from Kiro's own store, `~/.kiro/sessions/cli/`, so sessions from Kiro's terminal [import](/guide/aggregation) too. `KIRO_HOME` moves it, and names the `.kiro` directory itself. Kiro records no token counts, so [Token Usage](/guide/token-usage) counts its sessions but no tokens; the context ring still works, from the percentage Kiro reports. The Kiro release Codeg was checked against, 2.24.1, doesn't advertise forking, so *Fork from here* isn't offered.

**MCP servers** go to `~/.kiro/settings/mcp.json` — no SSE — and Kiro's own per-server settings survive edits made in Codeg. → [MCP Servers](/guide/mcp) Kiro is a column in Skill Packs, reading `~/.kiro/skills` and a project's `.kiro/skills`.

::: info A custom Kiro became this one
If you'd added Kiro CLI as a custom agent from the ACP registry, upgrading to 0.36.0 turned it into the built-in, carrying its conversations, open tabs, folder defaults, automations, to-do settings, delegation defaults, tags and composer picks across. The custom definition is gone, and the ACP registry no longer offers Kiro as a custom agent.
:::

::: warning `KIRO_HOME` set only on the agent
A `KIRO_HOME` in Kiro's own Environment Variables moves where Codeg reads its history, but **Settings → MCP** and the skill screens follow only a `KIRO_HOME` in Codeg's own environment.
:::

## ZCode

Z.ai's ZCode, new in **0.36.0**, through a community ACP bridge — [why it's built that way](/guide/supported-agents#zcode). It needs two things Codeg doesn't install: the **official ZCode**, installed and signed in, and **Node.js 22** or later with `node:sqlite`. From **Settings → Agents** Codeg installs only the bridge, `zcode-acp-server`, and its **Upgrade** updates only the bridge.

**Finding ZCode.** Codeg looks for the desktop app's own entry first — `%LOCALAPPDATA%\Programs\ZCode\resources\glm\zcode.cjs` on Windows, inside `ZCode.app` on macOS, under `/opt/ZCode` or `/usr/share/zcode` on Linux — then for `zcode` on your `PATH`. For Node it tries each one it can find, your `PATH` and then the usual version managers, and takes the first that's 22 or later and loads `node:sqlite`, so an older Node at the front of your `PATH` doesn't hide a newer one. When detection fails, set **`ZCODE_BIN`** (ZCode's `zcode.cjs` entry) or **`ZCODE_NODE`** in ZCode's **Environment Variables** — an absolute path or a command name on your `PATH`; a relative path is refused, and a value you set is used as given rather than swapped for a guess. The **Official ZCode runtime** row in preflight shows what was found.

**Signing in, models and credentials** stay in ZCode, and the pane has no configuration card — just the environment editor, with a note saying so. A ZCode **Start Plan** account can't run through the bridge: its requests need a captcha only the ZCode desktop app can solve. GLM Coding Plan accounts aren't affected.

**In a conversation**, the mode, model and thinking settings are whatever the bridge reports. A new session sends nothing until ZCode has confirmed its mode — the one you last picked, if the session offers it, otherwise *build* — and if that doesn't happen within 60 seconds the session fails rather than sending your message. Permission requests use Codeg's ordinary cards. The bridge also writes a disabled sandbox template, `.zcode/acp/sandbox.json`, into each workspace it runs in.

**What the first integration leaves out:** forking from a message, attachments, HTTP and SSE MCP servers — ZCode takes **stdio** servers only, which Codeg keeps in a record of its own and hands over when a session starts — and importing ZCode's own history: Codeg records the conversations you run in it, and nothing else. ZCode has no column in Skill Packs. So far it has been tested on Windows only; macOS and Linux aren't refused, just untested. A ZCode you set up earlier as a [custom agent](/guide/custom-agents) stays a separate agent, with its own history.

## TRAE CLI

ByteDance's TRAE CLI 2.0, new in **0.37.0**, which is available to customers on TRAE Enterprise's flagship plan. Like Kiro CLI, Codeg doesn't install it: you install `traecli` with [TRAE's own installer](https://docs.trae.cn/cli_get-started-with-trae-cli-2), and Codeg finds it on your `PATH` — where the Windows installer puts it — or in `~/.local/bin`, and launches `traecli acp serve`. The badge reads **official installer**, **Upgrade** runs `traecli update` and tells you when you were already up to date, and there's no Custom install or unreviewed-latest offer.

Its **Configuration** card:

- **Sign in** — the `traecli login` command, with a copy button. Run it once in a terminal to sign in with your enterprise SSO; Codeg's sessions reuse that login.
- **Personal access token (optional)** — for a server or a Docker install where no browser can open. TRAE CLI doesn't read the token by itself, so Codeg signs in with it whenever a session starts; a `TRAECLI_PERSONAL_ACCESS_TOKEN` in Codeg's own environment works the same way. If that sign-in fails, Codeg still tries to open the session on whatever `traecli login` left behind, which works only if that login is still good.
- **Enterprise API URL (optional)** — only if your organization runs TRAE on its own domain; passed as `TRAECLI_HOST`.

Save with **Save TRAE CLI Config**. Model, mode and reasoning effort aren't on the card: TRAE CLI reports them, so they're on the composer's settings button.

TRAE CLI does its own file reads, writes and commands. Its **MCP servers** go to `~/.trae/traecli.toml`, under `[mcp_servers]` — no SSE — and its skills to `~/.trae/skills`, a folder the TRAE IDE shares. `TRAE_HOME` moves both, though Settings → MCP and the skill screens follow only a `TRAE_HOME` in Codeg's own environment. Codeg records its history itself, so only the conversations you run in Codeg are there, and sessions from TRAE CLI's own terminal can't be imported yet. So far it has been tested on macOS only, and the Docker image doesn't include `traecli`.

## Command Code

Command Code's terminal coding agent, new in **0.37.0**. It's an ordinary npm agent — **Install** in Settings → Agents puts it in place, and it needs **Node.js 22** or later — and a copy you installed yourself with `npm i -g command-code` is picked up too. Codeg always launches it as `command-code`, never by its short name `cmd`, which on Windows is the system shell.

Its **Configuration** card:

- **Sign in** — the `command-code login` command, with a copy button. Run it once in a terminal; Codeg's sessions reuse that login.
- **API key (optional)** — for a machine where no browser can open. It's passed as `COMMAND_CODE_API_KEY`, which **outranks** the login, so leave it empty to use the login. A key in Codeg's own environment works too.

Save with **Save Command Code Config**. Model, mode and effort come from Command Code and live on the composer's settings button — and the model list there is **Command Code's own catalog**: models you've added to Command Code yourself can't be picked in Codeg. Its questions arrive as permission cards, with one option per answer.

Its **MCP servers** go to `~/.commandcode/mcp.json` — no SSE — and its skills to `~/.commandcode/skills`. Codeg records its history itself, so sessions from Command Code's own terminal can't be imported yet, and Command Code doesn't advertise forking, so *Fork from here* isn't offered. So far it has been tested on macOS only.

## Next steps

- [**Supported Agents**](/guide/supported-agents) — the roster, what each agent runs on, and where each keeps its sessions.
- [**Authentication & Models**](/guide/authentication) — the sign-in routes the agents share, model providers, and picking a model.
- [**Working with Agents**](/guide/agents) — enable an agent, run its preflight, and start a session.
- [**Custom Agents**](/guide/custom-agents) — register an ACP agent that isn't on the roster.
