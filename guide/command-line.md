---
title: Command Line
description: Run agents and assistants from a terminal with codeg-cli. Install the command, connect to Codeg, pipe context, run agents in parallel, collect JSON results, and use it in CI.
---

# Command Line

Since **0.38.0**, **`codeg-cli`** lets a script or terminal run prompts through Codeg. It connects to your running desktop app or `codeg-server`, starts an agent, and prints its reply. Each run is an ordinary conversation in Codeg: you can read it, answer a waiting agent, and continue the conversation there. A terminal icon marks these conversations, and **Recent → ⋯ → Command line** filters for them.

```bash
git diff main | codeg-cli -a codex -p "Review this diff" -o review.md
codeg-cli -a claude_code --permissions reads -p "Explain this repository"
codeg-cli --assistant code-reviewer "Review the latest commit" --permissions reads
```

## Get the command {#get-the-command}

`codeg-cli` comes with the desktop app, server archives, install scripts, and Docker image.

| Installation | How to make the command available |
| ------------ | --------------------------------- |
| **macOS app** | **Settings → System → Command-line access → Install command-line tool** links the bundled command into `/usr/local/bin`. macOS asks for an administrator's password if needed. |
| **Windows app** | The same button adds the installer's `bin` folder to your user PATH. Open a new terminal afterwards. |
| **Linux `.deb` / `.rpm`** | Already on PATH as `/usr/bin/codeg-cli`. |
| **Linux AppImage** | Start the app, then use the same button. It links the app's extracted command into `~/.local/bin`; that directory must be on your PATH. |
| **Server install script** | Installed beside `codeg-server`. See [Deployment](/getting-started/deployment). |
| **Docker** | Already available inside the container: `docker compose exec codeg codeg-cli …`. Use a workspace path inside the container. |

An existing command from another installation is left alone. Inside **Codeg's terminals and agent processes**, Codeg puts its own command first on PATH and sets **`CODEG_CLI`** to its full path. If a login shell changes PATH, `"$CODEG_CLI"` still selects that copy. Development builds use **`codeg-cli-dev`** to keep the installed release's command separate.

::: info Updating a 0.37.0 server
An in-place update **from 0.37.0** does not install `codeg-cli`: that release's updater does not know about it. Extract it from your platform's [0.38.0 server archive](https://github.com/spacering-net/codeg/releases/tag/v0.38.0) and place it beside `codeg-server`. Updates started from **0.38.0 onward** bring the matching command along automatically. A fresh install includes it.
:::

## First run {#first-run}

1. **Start Codeg** — the desktop app or `codeg-server`, version 0.38.0 or later. **Command-line access** is on by default under [System settings](/reference/settings/system#command-line-access).
2. **Install and authenticate an agent.** Use [Settings → Agents](/guide/agents) and the agent's [sign-in settings](/guide/authentication), or `codeg-cli agents install SLUG` for an agent Codeg can install.
3. **Open your project in a terminal**, check the connection, and run a prompt:

   ```bash
   codeg-cli status
   codeg-cli agents
   codeg-cli -a claude_code --permissions reads -p "Explain this repository" -o overview.md
   ```

The current directory is the workspace. Pass **`-w DIR`** (also `--workspace`, `--cd`, or `-C`) to choose another. The folder is registered in Codeg if needed, without opening it in the sidebar. `--open` brings the conversation to the front in the local desktop app.

**Choose an agent with `-a SLUG`**, using a slug from `codeg-cli agents`, such as `claude_code` or `codex`. **`-A NAME|ID`** (`--assistant`) uses a saved [assistant](/guide/assistants), including its agent, options, and standing instructions; `codeg-cli assistants` lists them. With neither, the workspace must have a default agent.

## Choose which Codeg to use {#choose-which-codeg-to-use}

Every running Codeg publishes a private **endpoint file**, `<data dir>/cli/endpoint-<pid>.json`, for a local listener. `codeg-cli` checks these selectors in order:

1. **`--url`**, with `--token` or `--token-file` (or `CODEG_TOKEN`): an HTTP(S) Codeg endpoint.
2. **`--data-dir DIR`**: the Codeg using that data directory.
3. **`CODEG_CLI_ENDPOINT_FILE`**: set in Codeg's own terminals and for its agents, so they reach their own Codeg.
4. **`CODEG_URL`**, with **`CODEG_TOKEN`**.
5. **`CODEG_DATA_DIR`**.
6. The [default data directories](/getting-started/configuration#where-codeg-stores-its-data) of the desktop app and server.

It uses the first selector provided. If that target cannot be reached or verified, it stops without sending the prompt to another Codeg. Within a data directory, dead endpoints are skipped; if several runtimes answer, the desktop app wins, then a development desktop, then a server, with the newest instance of each first. **`--runtime desktop|server`** narrows the kind.

**`codeg-cli status`** explains what it found: `ready`, `stale`, `unreachable`, `unverified`, `access_denied`, or `incompatible`. **`codeg-cli open`** starts the local desktop app if needed and waits for it, for 60 seconds by default (`--wait DUR` changes that). A normal run never starts Codeg implicitly.

For a remote server, use its access token and a workspace **on that server**:

```bash
codeg-cli --url https://codeg.example.com --token-file ./codeg-token \
  -w /srv/projects/app -a codex --permissions reads -p "Review the latest commit"
```

With `--url`, **`-w` is required** and its path is sent as written. Use HTTPS across an untrusted network. The local Command-line access switch does not disable access through the server's authenticated HTTP API.

## Commands and run options {#commands-and-run-options}

No subcommand means **`run`**: `codeg-cli "Explain this"` and `codeg-cli run "Explain this"` do the same thing. To send a command name as your prompt, write `codeg-cli run status` or `codeg-cli -p status`. Put run options after `run`, or omit `run` entirely.

| Command | What it does |
| ------- | ------------ |
| `run [PROMPT]` | Start an agent turn and wait for its result. |
| `agents [--json]` | List agents, their availability, and how to install them. |
| `agents install SLUG [--version VERSION] [--wait DUR]` | Install on the machine running Codeg, at its recommended version unless specified. Vendor-installed agents such as Kiro need their own installer. |
| `assistants [--json]` | List saved assistants. |
| `status [--json]` | Show discovered runtimes and which a run would use. |
| `open [--wait DUR]` | Start or find the local desktop app. |
| `result RUN [--wait DUR] [-o FILE]` | Collect a detached or disconnected run's result. |
| `cancel RUN` | Cancel a run. |
| `automations [list] [--json]` | List saved automations. |
| `automations run ID [--wait DUR] [--json]` | Trigger an automation now; optionally wait for it. |

**`-p TEXT`** supplies a prompt; a final positional argument also works. **Piped stdin** is appended as context, or becomes the prompt if no prompt was supplied. `-p -` reads the prompt from stdin, and `--no-stdin` prevents reading it. An interactive terminal or an empty device is never read. Prompt and stdin together can be up to **10 MiB**.

| Run option | Purpose |
| ---------- | ------- |
| `-a SLUG`, `-A NAME\|ID` | Choose an agent or assistant; repeat for [parallel runs](#run-several-agents). |
| `-w DIR` | Working directory; required with `--url`. |
| `-m VALUE`, `--model VALUE` | Select a model the agent offers. |
| `--effort LEVEL` | Select its thinking effort. Kiro cannot confirm this option and does not accept it here. |
| `--mode ID` | Select a session mode, such as `plan` or `acceptEdits`. |
| `-c ID=VALUE` | Set another advertised session option; repeatable. |
| `--permissions POLICY` | How Codeg answers permission requests; **`deny`** by default. |
| `--timeout DUR` | Cancel after a duration such as `90s`, `30m`, or `2h`, measured from command start. |
| `--output-format text\|json\|stream-json` | Final text, a result object, or live JSON events. |
| `-o FILE` | Also save the final reply to a file. |
| `--output-schema FILE` | Require a result matching a JSON Schema. |
| `--title TEXT` | Set a conversation title that the agent cannot replace. |
| `--open` | Bring the conversation to the front in the local desktop app. |
| `--detach` | Return the run id once the prompt has been delivered. |
| `--worktree[=NAME]` | Run in a new git worktree on a `cli/…` branch. Requires git 2.33 or later. |

Model, effort, mode, and `-c` values are checked against the agent's advertised choices **before the prompt is sent**. An unavailable, refused, rewritten, or unapplied choice, or a setter that times out, ends the run with exit code 2. If the agent accepts a value without confirming it, the run can proceed: unconfirmed model, effort, and mode selections are flagged in **`launch.unconfirmed`**; other `-c` options produce a warning notice. A successful exit alone does not prove every selection was confirmed. These choices apply to this run and leave Codeg's saved defaults alone.

## Permissions and questions {#permissions-and-questions}

`--permissions` decides what Codeg answers **when the agent asks**. It gives a one-time answer rather than saving an approval rule in the agent's settings.

| Policy | Permission requests | Questions |
| ------ | ------------------- | --------- |
| **`deny`** (default) | Refuse once. | Decline. |
| **`reads`** | Allow read/search requests once; refuse others. | Decline. |
| **`allow`** | Allow once. | Decline. |
| **`fail`** | Refuse and end the run with exit code 5. | Decline. |
| **`wait`** | Leave for you to answer in Codeg. | Leave for you. |

The agent's own **mode** still determines whether it asks at all. If no suitable one-time approval exists, Codeg refuses rather than picking a lasting one; if it cannot refuse once either, the run ends with code 5. A Grok plan approval is accepted under `allow`, left waiting under `wait`, and abandoned otherwise. Delegated sub-agents follow the same policy.

With **`wait`**, the conversation link is printed on stderr. Open it in Codeg, or add `--open` for the local desktop app, and answer there or through a connected [chat channel](/guide/chat-channels). A timeout still cancels the run, and the JSON result lists unanswered requests in `pending`.

**A nested CLI run cannot broaden its parent's policy**, and runs may nest only one level deep. That guards against mistakes; it is not a sandbox against an agent deliberately bypassing it. For an agent already working in Codeg, prefer Codeg's [delegation tools](/guide/multi-agent).

## Output and structured results {#output-and-structured-results}

| Format | stdout | stderr |
| ------ | ------ | ------ |
| **`text`** (default) | The final reply. | Progress when attached to a terminal, plus errors and hints. |
| **`json`** | One result object at the end. | Errors and hints. |
| **`stream-json`** | One JSON event per line, ending with the result object. | Errors and hints. |

**`-v`** adds progress on stderr even outside a terminal; **`-q`** suppresses progress and the heartbeat; **`--no-color`** removes progress colours. Outside a terminal, an otherwise quiet run prints a heartbeat on stderr after a minute, so CI can tell it is alive.

`-o FILE` writes the final reply atomically. A run that fails after producing a reply can still write it: check the exit code. Without a reply, an existing file is left alone. If writing fails, an otherwise successful run exits 1.

### Read JSON in scripts {#read-json-in-scripts}

```bash
git diff main | codeg-cli -a codex -p "Review this diff" --output-format json > review.json
jq '{is_error, subtype, result, permission_denials, link}' review.json
```

The result includes **`is_error`**, **`subtype`**, **`result`** (the reply), **`run_id`**, **`conversation_id`**, and a **`codeg://session/…` link**, plus duration, the agent's stop reason, denied permissions, and requested/effective launch options. **`launch.unconfirmed`**, when present, marks model, effort, or mode values the agent accepted without confirming. On failure, `error` holds a stable **`code`**, a readable **`message`**, and **`next_steps`** where available. Check both the process exit code and `is_error`.

`stream-json` starts with `init` once a conversation exists, then reports messages, tools, plans, permissions, questions, and notices. Events carry `v: 1`, `seq`, and `run_id`. Ignore unknown fields and event types so scripts keep working as the API grows. The [source reference](https://github.com/spacering-net/codeg/blob/main/docs/cli.md#events) lists every event and result field.

### Require a JSON shape {#require-a-json-shape}

**`--output-schema FILE`** asks for a result validated against a JSON Schema:

```bash
cat > verdict.schema.json <<'EOF'
{
  "type": "object",
  "properties": {
    "verdict": {"enum": ["pass", "fail"]},
    "issues": {"type": "array", "items": {"type": "string"}}
  },
  "required": ["verdict", "issues"],
  "additionalProperties": false
}
EOF
git diff main | codeg-cli -a codex -p "Review this diff" \
  --output-schema verdict.schema.json -o verdict.json
```

Codeg gives the agent a **`submit_result`** tool and validates what it submits. If the agent cannot receive that tool, or finishes without calling it, Codeg checks its JSON reply instead. After five invalid submissions no more are accepted; a turn ending without a matching result exits **7**, with `error_max_structured_output_retries`.

In `text`, stdout and `-o` contain the validated JSON. In the JSON formats, it is in **`structured_output`**, while `result` remains the agent's reply. Without a valid result, text stdout stays empty and the output file is left alone.

The schema must be an object schema, at most **64 KiB**. Drafts 4 through 2020-12 are supported; 2020-12 is the default. References resolve **within the schema only**, never to another file or URL.

## Run several agents {#run-several-agents}

Repeat `-a` or `-A` to give each target the same prompt and stdin. **`--max-parallel`** defaults to 4. Each is its own conversation.

```bash
git diff main | codeg-cli -a claude_code -a codex -A code-reviewer \
  -p "Review this diff" -o review.md
```

- **Text** labels each reply; **JSON** returns an array in target order; **stream-json** interleaves events identified by `run_id`.
- **`-o review.md`** writes one file per target, such as `review.1-claude_code.md` and `review.2-codex.md`.
- All targets share the workspace and timeout. For work that edits files, **`--worktree`** gives each an isolated checkout on a `cli/…` branch; `--worktree=review` names them `review-1`, `review-2`, and so on. Worktrees remain for you to review and merge in Codeg.
- The command exits 0 only if every run succeeds; otherwise it returns the first failed target's code, in target order. Ctrl-C or SIGTERM cancels all the runs.

## Detach and collect later {#detach-and-collect-later}

```bash
run_id=$(codeg-cli --detach -a codex --permissions reads -p "Review the latest commit")
codeg-cli result "$run_id" --wait 30m -o review.md
```

**`--detach`** returns after the prompt is delivered, printing only the run id in text mode. It cannot be combined with `-o`; collect the reply with `result` instead. A `--timeout` still cancels the run when it expires, even after the command has exited.

**`result RUN`** checks once, or waits with `--wait DUR`. A run still going when the wait ends exits **6**, without cancelling it. `result` also collects a run after its original command lost the connection. `cancel RUN` stops it. Run ids may be shortened to an unambiguous prefix of at least eight characters.

Codeg keeps finished CLI results **in memory for up to 30 minutes, limited to the latest 200 finished runs**. A busy instance can evict a result sooner, and restarting Codeg clears them all; the conversation remains in the database. Collect and save results you need promptly. Ctrl-C/SIGTERM on an attached run cancels it (exit 130/143), while interrupting `result` only stops waiting.

## Automations and CI {#automations-and-ci}

Use **`codeg-cli automations run ID`** to trigger a saved [automation](/guide/automations). It returns its run id once started; `--wait 30m` waits for the outcome. Waiting does not cancel the automation. An **Enqueue task** automation succeeds when it has queued the to-do, without waiting for that task's agent work. If another Codeg on the same data directory owns automations, select it with `--runtime`.

For a CI runner, **`--standalone`** starts a sibling or PATH `codeg-server` for this command alone, on loopback with a fresh temporary data directory. It stops the server and removes the directory afterwards. Supply the agent's credentials through your CI system's secrets:

```bash
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash
# Set ANTHROPIC_API_KEY through the CI system's secret environment.
codeg-cli --standalone agents install claude_code
git show HEAD | codeg-cli --standalone -a claude_code -w "$PWD" \
  --timeout 30m -p "Review this commit for bugs" -o review.md
```

Each command starts fresh: npm-installed agents persist, but settings, assistants, and downloaded binaries do not. Add **`--data-dir DIR`** to retain them between commands, using a directory dedicated to CI. A standalone server refuses a directory held by a current Codeg; older versions do not participate in that check, so keep it separate from their data too. `--standalone` cannot be used with `--url`, `--detach`, `result`, `cancel`, or `open`.

A CI job can also connect to an existing server through `--url`/`--token-file` or `CODEG_URL`/`CODEG_TOKEN`. Under the default `deny` policy, pipe the relevant context into the prompt; choose `reads` if the agent should inspect the checkout itself. A successful exit means the **turn completed**; use a structured verdict if the job should fail on findings.

## Exit codes and troubleshooting {#exit-codes-and-troubleshooting}

| Code | Meaning |
| ---- | ------- |
| **0** | The agent turn completed successfully. |
| **1** | Execution failed, including an unavailable agent or an output file that could not be written. |
| **2** | Invalid arguments, workspace, agent, assistant, schema, or session-option selection. |
| **3** | The timeout expired; the run was cancelled. |
| **4** | Codeg could not be reached, verified, or accessed; the API is incompatible; or the retained result is gone. |
| **5** | A required permission could not be granted under the selected policy. |
| **6** | A result, agent install, or automation did not finish within `--wait`; it continues running. |
| **7** | No result matched the requested output schema. |
| **130 / 143** | Interrupted by SIGINT / SIGTERM. An attached run is cancelled. |

**Start with `codeg-cli status`.** `stale` means the endpoint's process has gone; `unreachable` means it is alive but not answering; `unverified` means the responder could not prove its identity. `incompatible` calls for updating the older of Codeg and the CLI. A missing command needs [installation on PATH](#get-the-command), followed by a new terminal on Windows.

**`access_denied` / `error_runtime_access_denied`** usually means the shell's sandbox blocks even loopback networking. Allow local network access for the command or run it outside that sandbox; restarting Codeg does not help. For an agent inside Codeg, its delegation tools avoid this shell connection.

The local listener accepts only this computer and uses a key created on each Codeg launch, kept in an owner-private endpoint file. Any program running as your OS user can read that file and run agents as you. Turning off [Command-line access](/reference/settings/system#command-line-access) closes that listener; it leaves authenticated server access unchanged. See [Privacy & Security](/reference/privacy#command-line-access) for the boundary and the [full CLI reference](https://github.com/spacering-net/codeg/blob/main/docs/cli.md) for all error codes and protocol fields.
