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

In the desktop app, open **Settings → System → Command-line access → Install command-line tool**. The button makes the bundled command available to other terminals:

| Installation | Executable | PATH setup |
| ------------ | ---------- | ---------- |
| **macOS app** | `/Applications/codeg.app/Contents/MacOS/codeg-cli` | The button links it into `/usr/local/bin`, asking for an administrator's password if needed. |
| **Windows app** | `%LOCALAPPDATA%\codeg\bin\codeg-cli.exe` | The button adds the installer's `bin` folder to your user PATH. Open a new terminal afterwards. |
| **Linux `.deb` / `.rpm`** | `/usr/bin/codeg-cli` | Already on PATH. |
| **Linux AppImage** | `<data dir>/cli/bin/codeg-cli` | Start the app first; the button links its extracted copy into `~/.local/bin`. That directory must be on PATH. |
| **Server archive / install script** | Beside `codeg-server` | The install scripts use a directory on PATH by default. For a manual extraction, add their directory to PATH; see [Deployment](/getting-started/deployment). |
| **Docker** | `/usr/local/bin/codeg-cli` inside the container | Run through `docker compose exec`, with a workspace path inside the container. |

For example, with the Compose service and project mount from the [deployment guide](/getting-started/deployment#with-compose):

```bash
docker compose exec codeg codeg-cli -w /projects/app -a claude_code \
  --permissions reads -p "Review the latest commit"
```

::: details Set up PATH manually on macOS or Windows
On macOS, link the app's command into a directory on PATH:

```bash
sudo mkdir -p /usr/local/bin
sudo ln -s /Applications/codeg.app/Contents/MacOS/codeg-cli /usr/local/bin/codeg-cli
```

Without `-f`, this leaves an existing command in place. Adjust the app path if you installed it elsewhere.

On Windows, run this once in PowerShell, then open a new terminal:

```powershell
$cliBin = Join-Path $env:LOCALAPPDATA "codeg\bin"
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if (($userPath -split ";") -notcontains $cliBin) {
  $newUserPath = (@($userPath, $cliBin) | Where-Object { $_ }) -join ";"
  [Environment]::SetEnvironmentVariable("Path", $newUserPath, "User")
}
```

For a custom installation, use its `bin` folder. The executable works in PowerShell, `cmd`, and Git Bash.
:::

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

```text
codeg-cli [GLOBAL OPTIONS] [run] [RUN OPTIONS] [PROMPT]
```

| Command | What it does |
| ------- | ------------ |
| `run [PROMPT]` | Start an agent turn and wait for its result. |
| `agents [--json]` | List agents, their availability, and how to install them. |
| `agents install SLUG [--version VERSION] [--wait DUR] [--json]` | Install on the machine running Codeg, at its recommended version unless specified. Vendor-installed agents such as Kiro need their own installer. |
| `assistants [--json]` | List saved assistants. |
| `status [--json]` | Show discovered runtimes and which a run would use. |
| `open [--wait DUR] [--json]` | Start or find the local desktop app. |
| `result RUN [--wait DUR] [--output-format FORMAT] [-o FILE]` | Collect a detached or disconnected run's result. |
| `cancel RUN [--json]` | Cancel a run. |
| `automations [list] [--json]` | List saved automations. |
| `automations run ID [--wait DUR] [--json]` | Trigger an automation now; optionally wait for it. |

An agent install continues in Codeg if the command exits or its `--wait` expires. For example, `codeg-cli agents install claude_code --wait 5m` exits **6** if still installing after five minutes; repeat the command to follow the same install. Use `codeg-cli --help` or `codeg-cli COMMAND --help` for full syntax.

### Global options {#global-options}

These apply to runs and subcommands:

| Option | Purpose |
| ------ | ------- |
| `--url URL` | Connect to Codeg over HTTP(S). |
| `--token TOKEN`, `--token-file FILE` | Authenticate to that URL; otherwise use `CODEG_TOKEN`. |
| `--data-dir DIR` | Select a local Codeg by its data directory; with `--standalone`, retain the command's server data there. |
| `--runtime desktop\|server` | Limit local discovery to that kind of Codeg. |
| `--standalone` | Start and stop a server for this command alone; see [CI](#use-a-temporary-server-in-ci). |
| `-q`, `--quiet` | Suppress progress and the heartbeat. |
| `-v`, `--verbose` | Show progress even outside a terminal, plus diagnostics. |
| `--no-color` | Remove progress colours. |

### Prompt and run options {#prompt-and-run-options}

**`-p TEXT`** supplies a prompt; a final positional argument also works. **Piped stdin** is appended as context, or becomes the prompt if no prompt was supplied. `-p -` reads the prompt from stdin, and `--no-stdin` prevents reading it. An interactive terminal or an empty device is never read. Prompt and stdin together can be up to **10 MiB**.

| Run option | Purpose |
| ---------- | ------- |
| `-a` / `--agent SLUG`, `-A` / `--assistant NAME\|ID` | Choose an agent or assistant; repeat for [parallel runs](#run-several-agents). |
| `-w` / `--workspace DIR` (`--cd`, `-C`) | Working directory; required with `--url`. |
| `--max-parallel N` | Run up to N targets at once; defaults to 4, with the rest queued. |
| `-m VALUE`, `--model VALUE` | Select a model the agent offers. |
| `--effort LEVEL` | Select its thinking effort. Kiro cannot confirm this option and does not accept it here. |
| `--mode ID` | Select a session mode, such as `plan` or `acceptEdits`. |
| `-c` / `--config ID=VALUE` | Set another advertised session option; repeatable. |
| `--permissions POLICY` | How Codeg answers permission requests; **`deny`** by default. |
| `--timeout DUR` | Cancel after a duration such as `90s`, `30m`, or `2h`, measured from command start. |
| `--output-format FORMAT` (`--format`) | `text`, `json`, or `stream-json`; see [Output](#output-and-structured-results). |
| `-o` / `--output FILE` | Also save the final reply to a file. |
| `--output-schema FILE` | Require a result matching a JSON Schema. |
| `--title TEXT` | Set a conversation title that the agent cannot replace. |
| `--open` | Bring the conversation to the front in the local desktop app. |
| `--no-stdin` | Ignore piped input, useful when an enclosing script owns stdin. |
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

In a Bash script, keep the exit status when saving JSON so a later `jq` command cannot hide a failed run:

```bash
set -euo pipefail
cli_exit=0
git diff main | codeg-cli -a codex -p "Review this diff" \
  --output-format json > review.json || cli_exit=$?
if [ "$cli_exit" -ne 0 ]; then
  cat review.json >&2
  exit "$cli_exit"
fi
jq -e '.is_error == false' review.json > /dev/null
jq '{subtype, result, permission_denials, link}' review.json
```

A successful result includes these fields (other fields omitted):

```json
{
  "v": 1,
  "type": "result",
  "seq": 42,
  "run_id": "8d0c7c2e-3f0b-4a5e-9c1b-6f2d1e0a7b44",
  "subtype": "success",
  "is_error": false,
  "result": "No blocking issues found.",
  "stop_reason": "end_turn",
  "duration_ms": 48210,
  "permission_denials": [],
  "conversation_id": 214,
  "link": "codeg://session/214"
}
```

**`launch.requested`** and **`launch.effective`** record the requested and effective model, effort, and mode. **`launch.unconfirmed`**, when present, marks selections the agent accepted without confirming. On failure, `error` holds a stable **`code`**, a readable **`message`**, and **`next_steps`** where available.

In JSON formats, failures after argument parsing also produce a result object, even if Codeg could not be reached. If no conversation was created, `conversation_id` and `link` are `null`; `run_id` can also be `null`. Arguments the CLI cannot parse produce only stderr and exit 2.

`stream-json` starts with `init` once a conversation exists, then reports messages, tools, plans, permissions, questions, and notices. A failure before then produces the result alone. Events carry `v: 1`, `seq`, and `run_id`; `seq` increases within each run. Ignore unknown fields and event types so scripts keep working as the API grows. The [source reference](https://github.com/spacering-net/codeg/blob/main/docs/cli.md#events) lists every event and result field.

### Require a JSON shape {#require-a-json-shape}

**`--output-schema FILE`** asks for a result validated against a JSON Schema:

```bash
set -euo pipefail
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
git diff main | codeg-cli -a codex --permissions reads -p "Review this diff" \
  --output-schema verdict.schema.json -o verdict.json
jq -e '.verdict == "pass"' verdict.json > /dev/null
```

The last command makes the script fail on a `"fail"` verdict. A valid verdict by itself, whether `"pass"` or `"fail"`, is a successful CLI run.

Codeg gives the agent a **`submit_result`** tool and validates what it submits. This tool only hands in the result; if the agent asks permission to call it, Codeg allows that call regardless of `--permissions`. If the agent cannot receive it, or finishes without calling it, Codeg checks the reply instead: the whole reply must be JSON, or contain a single `json` code block. After five invalid submissions no more are accepted; a turn ending without a matching result exits **7**, with `error_max_structured_output_retries`.

In `text`, stdout and `-o` contain the validated JSON. In the JSON formats, it is in **`structured_output`**, while `result` remains the agent's reply. Use `--output-schema` for the result's shape and `--output-format` for the surrounding CLI output. Without a valid result, a single run's text stdout stays empty and its output file is left alone.

The schema must be at most **64 KiB**, with a root that declares `"type": "object"`; put arrays or single values inside a property. Drafts 4, 6, 7, 2019-09, and 2020-12 are supported; 2020-12 is the default. References resolve **within the schema only**, never to another file or URL.

## Run several agents {#run-several-agents}

Repeat `-a` or `-A` to give each target the same prompt and stdin. **`--max-parallel`** defaults to 4. Each is its own conversation.

```bash
git diff main | codeg-cli -a claude_code -a codex -A code-reviewer \
  -p "Review this diff" -o review.md
```

- **Text** labels each reply; **JSON** returns an array in target order with a `target_index` per run; **stream-json** interleaves events identified by `run_id`.
- **`-o review.md`** writes one file per target, such as `review.1-claude_code.md` and `review.2-codex.md`.
- With **`--output-schema`**, text stdout contains one JSON value per target, or `null` for one without a valid result; labels go to stderr instead.
- All targets share the workspace and timeout. For edits, give each its own checkout with **`--worktree`**.
- The command exits 0 only if every run succeeds; otherwise it returns the first failed target's code, in target order. Ctrl-C or SIGTERM cancels all the runs.

### Edit in separate worktrees {#edit-in-separate-worktrees}

```bash
codeg-cli -a claude_code -a codex --max-parallel 2 \
  --worktree=fix-tests --permissions allow --timeout 30m \
  -p "Fix the failing tests and summarize your changes"
```

Each run gets a new [git worktree](/guide/git#work-in-parallel-with-worktrees) beside the repository, starting from its **HEAD**. Uncommitted changes in your current checkout are not copied. With two targets, this example creates branches `cli/fix-tests-1` and `cli/fix-tests-2`; a name already taken gets a run-id suffix. A single target uses `cli/fix-tests`. Without a name, Codeg uses the start of the run id.

The agent works in the same subdirectory if `-w` points below the repository root. Both `init` and the result include `worktree: {path, branch}`. The worktrees and branches stay for you to review, merge, or delete in Codeg; a launch that fails before creating a conversation removes its new worktree and branch.

**Use `=` to name a worktree**: `--worktree=review` names it, while `--worktree review` creates an unnamed worktree and uses `review` as the prompt. Requires git 2.33 or later.

## Detach and collect later {#detach-and-collect-later}

```bash
run_id=$(codeg-cli --detach -a codex --permissions reads -p "Review the latest commit")
codeg-cli result "$run_id" --wait 30m -o review.md
```

**`--detach`** returns after the prompt is delivered, printing only the run id in text mode. It cannot be combined with `-o`; collect the reply with `result` instead. A `--timeout` still cancels the run when it expires, even after the command has exited.

In either JSON format, detach returns the `init` event. With several targets, text prints one id per line and `json` returns an array of init events; `--max-parallel` must be at least the number of targets so all can start before the command exits.

**`result RUN`** checks once, or waits with `--wait DUR`. A run still going when the wait ends exits **6**, without cancelling it. `result` also collects a run after its original command lost the connection. `cancel RUN` stops it. Run ids may be shortened to an unambiguous prefix of at least eight characters.

Codeg keeps finished CLI results **in memory for up to 30 minutes, limited to the latest 200 finished runs**. A busy instance can evict a result sooner, and restarting Codeg clears them all; the conversation remains in the database. Collect and save results you need promptly. Ctrl-C/SIGTERM on an attached run cancels it (exit 130/143), while interrupting `result` only stops waiting.

## Automations and CI {#automations-and-ci}

### Run a saved automation {#run-a-saved-automation}

Use **`codeg-cli automations run ID`** to trigger a saved [automation](/guide/automations). It returns its run id once started; `--wait 30m` waits for the outcome. Waiting does not cancel the automation. An **Enqueue task** automation succeeds when it has queued the to-do, without waiting for that task's agent work. If another Codeg on the same data directory owns automations, select it with `--runtime`.

```bash
codeg-cli automations
codeg-cli automations run 3 --wait 30m --json
```

With `--wait`, the command exits 0 on success, 1 on failure, or 6 if still running. Add `--wait` to the trigger command when you need the outcome; its numeric automation run id cannot be passed to `result`.

### Use a temporary server in CI {#use-a-temporary-server-in-ci}

For a CI runner, **`--standalone`** starts a sibling or PATH `codeg-server` for this command alone, on loopback with a fresh temporary data directory. It stops the server and removes the directory afterwards. Supply the agent's credentials through your CI system's secrets:

```bash
set -euo pipefail
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0
# Set ANTHROPIC_API_KEY through the CI system's secret environment.
codeg-cli --standalone agents install claude_code
git show HEAD | codeg-cli --standalone -a claude_code -w "$PWD" \
  --timeout 30m -p "Review this commit for bugs" -o review.md
```

The server's agents inherit the command's environment, including credentials. Each command starts fresh: npm-installed agents persist, but settings, assistants, and downloaded binaries do not. Add **`--data-dir DIR`** to each command to retain them between commands, using a directory dedicated to CI. A standalone server refuses a directory held by a current Codeg; older versions do not participate in that check, so keep it separate from their data too.

`--standalone` cannot be used with `--url`, `--detach`, `result`, `cancel`, or `open`. For `agents install` and `automations run`, it always waits for completion, so omit `--wait` too.

::: details GitHub Actions example
Save this as `.github/workflows/codeg-review.yml` and add `ANTHROPIC_API_KEY` to the repository's Actions secrets. It reviews the latest commit on each push and saves the reply as an artifact.

```yaml
name: Codeg review
on: [push, workflow_dispatch]
permissions:
  contents: read
jobs:
  review:
    runs-on: ubuntu-latest
    timeout-minutes: 40
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 2
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - name: Review the commit
        env:
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}
        run: |
          set -euo pipefail
          curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0
          codeg-cli --standalone agents install claude_code
          git show HEAD | codeg-cli --standalone -a claude_code -w "$GITHUB_WORKSPACE" \
            --permissions reads --timeout 30m -p "Review this commit for bugs" -o review.md
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: codeg-review
          path: review.md
          if-no-files-found: ignore
```
:::

A CI job can also connect to an existing server through `--url`/`--token-file` or `CODEG_URL`/`CODEG_TOKEN`, with a workspace on that server and the agent's credentials in the **server's environment**. For several commands sharing one job-owned server, see the [full CI reference](https://github.com/spacering-net/codeg/blob/main/docs/cli.md#in-ci).

Under the default `deny` policy, pipe the relevant context into the prompt; choose `reads` if the agent should inspect the checkout itself. A successful exit means the **turn completed**; use a [structured verdict](#require-a-json-shape) if the job should fail on findings.

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

For scripts, branch on the stable `error.code` rather than matching its message:

| Error code | What to check |
| ---------- | ------------- |
| `token_missing`, `unauthorized` | Use the server's `CODEG_TOKEN`, not an agent provider's API key. Check `--token-file` or the CLI's `CODEG_TOKEN`. |
| `workspace_required`, `workspace_not_found` | With `--url`, give `-w` an absolute directory that exists **on the server**. |
| `unknown_agent`, `no_agent`, `agent_not_installed` | Run `codeg-cli agents`, choose its slug with `-a`, and install the agent where Codeg runs. |
| `invalid_value`, `option_unavailable` | Use a model, effort, mode, or session option that this agent offers; the error lists choices where available. |
| `runtime_lost` | Codeg stopped answering for 30 seconds; the agent may still be running. Reconnect to the same Codeg and use `result RUN` while the result is retained. |
| `data_dir_in_use` | Connect to the Codeg already using that data directory, or give `--standalone` its own directory. |
| `output_schema_unmet` | Inspect the agent's reply and notices; the turn ended without a result matching the schema. |

The local listener accepts only this computer and uses a key created on each Codeg launch, kept in an owner-private endpoint file. Any program running as your OS user can read that file and run agents as you. Turning off [Command-line access](/reference/settings/system#command-line-access) closes that listener; it leaves authenticated server access unchanged. See [Privacy & Security](/reference/privacy#command-line-access) for the boundary and the [full CLI reference](https://github.com/spacering-net/codeg/blob/main/docs/cli.md) for all error codes and protocol fields.
