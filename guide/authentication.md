---
title: Authentication & Models
description: Sign an agent in with its own subscription, a provider API key, or a custom endpoint — then pick the model it runs, and know where every credential lives.
---

# Authentication & Models

Codeg ships no model of its own. Every agent brings its own credentials — a subscription you already pay for, a provider API key, or a compatible endpoint — and talks to its own models. This page is about getting an agent authenticated so it can run, and choosing which model it uses once it can.

You do this per agent, in **Settings → Agents**: open an agent and its detail pane shows the sign-in options that apply to it — [Per-Agent Setup](/guide/agent-setup) goes through every pane. A separate **Model Providers** pane holds reusable credentials for the agents that support them. Enabling an agent and confirming it's healthy come first — see [Working with Agents](/guide/agents) — and [Supported Agents](/guide/supported-agents) is the roster this all applies to.

## How agents authenticate

Because each agent authenticates its own way, its detail pane offers only the options that make sense for it — usually a single **auth mode** dropdown. Across the roster, those options come in three shapes:

- **The agent's own account** — sign in with the subscription or plan you already have (Anthropic, ChatGPT, Google, and so on). Codeg reuses the agent's own login; you don't hand it a key.
- **A provider API key and endpoint** — type an API URL and key straight into the agent's card to bill against an API account or a compatible gateway. This is the **Custom Endpoint** option.
- **A saved Model Provider** — point the agent at a reusable credential you've stored once. Available for **Claude Code, Codex, and Gemini**.

These are mutually exclusive: an agent uses one at a time, and switching the auth mode swaps between them. The next three sections take each in turn.

The four newest agents have no auth mode dropdown at all. **Kiro CLI**, **TRAE CLI** and **Command Code** sign in with their own login command, run once in a terminal — TRAE CLI's and Command Code's panes show it, with a copy button — and take an optional key or token for a machine where no browser can open; **ZCode** signs in entirely inside the official ZCode app. See below.

## Sign in with a subscription

The simplest path is to use the agent's own subscription — the plan you'd use from its CLI. For most agents that means **logging in through the agent's own tool once**, in a terminal; Codeg then reuses that login and stores nothing extra:

- **Claude Code** — choose **Official Subscription** and Codeg uses your existing `claude` login. No key required.
- **Gemini** — choose **Google Login** and complete Google's sign-in by running `gemini` in a terminal first.
- **Kimi Code**, **CodeBuddy** — run the agent's own login in a terminal (`kimi login`, `codebuddy`) and Codeg picks it up. Kimi Code has a pane of its own for the API-key route. → [Kimi Code](/guide/agent-setup#kimi-code-provider-model-and-reasoning)
- **Kiro CLI**, **TRAE CLI**, **Command Code** — run the agent's own login once in a terminal: `kiro-cli login`, `traecli login` (your enterprise SSO) or `command-code login`; TRAE CLI's and Command Code's panes show the command with a copy button. For a server or a container, each takes a credential instead: Kiro's **API key** (`KIRO_API_KEY`), TRAE CLI's **Personal access token**, which Codeg signs in with whenever a session starts, and Command Code's **API key** (`COMMAND_CODE_API_KEY`), which outranks the login. → [Per-Agent Setup](/guide/agent-setup#kiro-cli)
- **ZCode** — sign in to the official ZCode itself; the bridge Codeg runs reuses that login, and Codeg copies nothing. A ZCode **Start Plan** account can't run through the bridge, since its requests need a captcha only the ZCode desktop app can solve; GLM Coding Plan accounts work. → [ZCode](/guide/agent-setup#zcode)
- **Grok** and **Cursor** each have an **Authentication method** picker of their own:
  - **Grok** — **Official Subscription** (SuperGrok or X Premium+ via `grok login`; nothing stored), **XAI API key** (a key from the xAI console, for headless runs), or **Custom endpoint** (a custom model with its own base URL and key, which becomes Grok's default).
  - **Cursor** — **official subscription**, where Codeg shows you the `cursor-agent login` command to run (a browser window opens) and reports **Logged in** once you refresh, or a **Cursor API key** from the Cursor dashboard for headless and server machines. Note that key is a *Cursor account* key — `cursor-agent` only talks to Cursor's own backend, so it isn't a route to a third-party endpoint. Codeg writes both into `~/.cursor/cli-config.json`, shared with the CLI. Since **0.31.2** Codeg also checks that a stored login still works rather than trusting the CLI's word. → [Cursor](/guide/agent-setup#cursor)

The integrated terminal (**⌘J**) is right there for those one-time logins.

**Codex is the exception** — it signs in *inside* Codeg. Pick **Official Subscription** and click **Log in with ChatGPT**: Codeg shows a code and a verification link, you approve it in your browser, and the pane confirms with a green **Account logged in**. Click again anytime to re-login or switch accounts.

## Connect with an API key or custom endpoint

Prefer to pay per API call, or route through an OpenAI/Anthropic/Gemini-compatible gateway? Choose **Custom Endpoint** in the agent's auth mode and fill in:

- **API URL** — the base URL of your provider or gateway.
- **API Key** — your key, masked with a show/hide toggle.
- **Model** — the model id to request, where the agent expects one.

Codeg hands these to the agent when it launches. Most agents accept this route, and the exact fields shown follow whatever that agent understands. Kiro CLI, ZCode, TRAE CLI and Command Code don't offer it: each talks to its own service (TRAE CLI's pane can point it at your organization's own TRAE deployment instead).

## Save and reuse a Model Provider

If you switch between endpoints, or want one credential shared across sessions, save it as a **Model Provider** instead of retyping it. This is available for **Claude Code, Codex, and Gemini** — the three whose CLIs cleanly accept a base-URL-and-key override.

1. Go to **Settings → Model Providers → Add Provider**.
2. Give it a **name**, an **API URL**, an **API Key**, the **agent type** it's for, and a **model**. A **Claude Code** provider gets Claude Code's model slots instead of the single model — a main and a reasoning model, a default for each tier (**Haiku**, **Sonnet**, **Opus**, and since **0.32.3** **Fable**), and a custom entry for the model picker.
3. Open that agent in **Settings → Agents**, set its auth mode to **Model Provider**, and select the one you saved.

Once bound, the agent's API fields show read-only, filled from the provider — and for Claude Code the provider speaks for every model slot: one it fills is set on the agent, one it leaves empty is cleared, so nothing from an earlier setup lingers underneath. On Claude Code, switching the auth mode away from **Model Provider** and back keeps the provider you'd picked — until **0.32.3** it rebound to your oldest one and saved its model. Edit a provider later and Codeg flags any running sessions that need to **reconnect** to pick up the change.

::: tip Custom Endpoint vs. Model Provider
They configure the same thing — a base URL, a key, and a model — but differ in reach. **Custom Endpoint** is typed inline on one agent; a **Model Provider** is a named record you set up once and reuse. If you only ever use one endpoint for one agent, Custom Endpoint is simpler; if you juggle several, save them as providers. (An agent's type is fixed once a provider is created.)
:::

## Choose a model

Which models you can pick comes from the **agent**, not Codeg. Once an agent connects, the model list on the composer's [settings button](/guide/conversations#start-a-session-—-the-composer) shows exactly what that agent offers for the way you signed in — so the choices differ from one agent to the next. A long list gets a search box, and the model the agent recommends is marked. Pick one there and it takes effect for the conversation.

- **Codeg remembers your last pick** per agent and preselects it next time you start a session with that agent.
- There's **no per-folder model default** — the model is chosen at the session level. (A folder default sets the *agent*, not the model.)
- **Reopened Claude Code history reads a 1M window where the model has one.** Since **0.35.0** the context ring of a Claude Code conversation you reopen measures against **1M** for the models that have it natively — Opus 4.7 and later, Sonnet 5 and later, Haiku 5.5, Fable and Mythos — instead of 200K. The window isn't stored, so older conversations pick it up the next time they're read. The same release made **Claude Haiku 5.5** the suggested Haiku model, on Claude Code's pane and in the model provider dialogs.
- **A Claude Code conversation saved on a *(1M context)* entry keeps working.** Since Claude Code **2.1.285**, a gateway behind a custom API address lists the plain models only — they use their 1M window by default — and some accounts lost the separate *Opus (1M context)* entry earlier. A conversation set to such an entry carries on with its plain twin rather than falling back to the default model. If your gateway stops at 200K, Claude Code's own advice is `/autocompact 200k`.
- **A saved Fable pick survives Claude Code 2.1.287.** That version, bundled with adapter **0.86.0** since Codeg **0.34.0**, renamed its Fable entry from `claude-fable-5-1` to `fable`, so the Fable pick Codeg had saved matched nothing and every connect fell back to the default model. Codeg now carries the pick over to the one entry that names the same model — by its name, *Fable 5.1*, by the start of its description, or by the id a **Default Fable Model** slot pins — for as long as an entry still names that version; a *(1M context)* Fable pick follows the same way. If no entry names it, or more than one does, nothing is carried over and the session runs on Claude Code's default. The saved pick itself isn't rewritten — choosing Fable again saves the new id.
- **A model is captioned the way its own agent names it.** Since **0.31.0** Codeg records the id/name pairs an agent's model picker advertises, so the reply footer, the session details and the sidebar's hover chip read `Qwen3.8-Flash` where the transcript itself only records an account-internal id like `qfmodel`.

**Reasoning effort** is set in the composer, per session — with a few agent panes adding something the composer can't express:

- **Grok** keeps a settings-pane dropdown, from low up to **Max**, written into Grok's own config.
- **Claude Code** and **Codex** had one until **0.30.0**, when both were deleted. They read as the knob that decides how hard a turn thinks while the composer's per-session picker is what actually governs it, so the two could disagree with nothing on screen to say which won. An `effortLevel` already written into a config file is **left alone** rather than cleaned up.
- **Pi** works like Kimi Code rather than like Grok: because pi only sends an effort for a model that *declares* one, its pane is where you declare it — a switch, which of pi's seven levels your model accepts, and the value each is sent as. Since **0.32.3** those levels run up to **Max**, and the pane says what pi will actually run the selected model at. → [Pi: reasoning on a custom provider](/guide/agent-setup#pi-reasoning-on-a-custom-provider) · [What each model can think at](/guide/agent-setup#pi-thinking-levels-and-version)
- **Kimi Code** works the other way round: its pane declares which levels *exist* and the composer's Thinking picker offers them. → [Kimi Code](/guide/agent-setup#kimi-code-provider-model-and-reasoning)
- **Cursor** treats effort as one of its model's knobs — on its settings pane for the model a session starts on, and as a setting of its own once a session is running. → [Cursor's families and knobs](/guide/agent-setup#cursor-families-and-knobs-not-two-hundred-ids)
- **Kiro CLI** offers **Thinking** and **Reasoning effort** only for a model that supports them, as settings Codeg builds from what Kiro reports. → [Kiro CLI](/guide/agent-setup#kiro-cli)

## Where credentials are stored

Codeg keeps agent credentials where the agents themselves do — nothing is uploaded to Codeg:

- **The agent's own native config.** A subscription login or key handled by the agent's CLI stays in that agent's files — `~/.codex/auth.json`, `~/.hermes/.env`, `~/.grok/auth.json`, Kiro's `~/.kiro`, TRAE CLI's `~/.trae`, Command Code's `~/.commandcode/auth.json`, and so on — exactly where the agent's own tool keeps it. ZCode's sign-in stays inside the ZCode app.
- **Codeg's local database.** Keys you type into Codeg's UI — Custom Endpoint keys, saved Model Providers, and the key or token on Kiro CLI's, TRAE CLI's or Command Code's pane — are stored locally by Codeg and injected as environment variables when the agent launches. Like the agents' own config files, they aren't encrypted at rest, and the masked display is only cosmetic — so treat access to your machine as the boundary.

This is separate from **git account** tokens, which *are* kept in your OS keyring. → [git accounts](/guide/git#git-accounts)

## Next steps

- [**Working with Agents**](/guide/agents) — enable an agent and run its preflight before you sign in.
- [**Supported Agents**](/guide/supported-agents) — the full roster and what each agent is.
- [**Multi-Agent Collaboration**](/guide/multi-agent) — once your agents are signed in, let them work together.
