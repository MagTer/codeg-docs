---
title: Runtime Logs
description: The Runtime Logs settings screen — set how much Codeg records, tail its diagnostic log live with per-module overrides, and open or download the rotating files on disk.
---

# Runtime Logs

**Settings → Runtime Logs** is Codeg's built-in diagnostic log. The screen sums it up as *"View and configure application diagnostic logs. Logs are written to local files and kept in memory for live viewing."* It does two jobs: it sets **how much** Codeg records, and it gives you a **live viewer** to read what's being recorded — plus a way to reach the rotating files on disk when you need history the viewer no longer holds.

Every record goes to three places at once, all driven by the single level you pick here: your terminal's **stderr**, a **rotating file** on disk, and an **in-memory buffer** the viewer reads. This is the screen to open when something misbehaves and you — or a bug report — need to see what the app was actually doing.

## Log level

The **capture level** is the master dial — *"Controls how much detail is captured. Higher levels (Debug, Trace) record more but produce larger logs. Off disables logging."* Pick from the dropdown, coarsest to finest:

- **Off** — capture nothing.
- **Error** — only failures.
- **Warning** — failures and warnings.
- **Info** *(default)* — the normal running commentary.
- **Debug** / **Trace** — progressively more verbose, for chasing a specific problem. Bigger logs; turn back down when you're done.

Each level includes everything above it — *Info* also records warnings and errors. The choice **saves the moment you make it** (a brief spinner shows while it writes) and applies immediately, across every window.

::: info When the dropdown is greyed out
If you launched Codeg with a `CODEG_LOG` or `RUST_LOG` environment variable set, that variable owns the level and the control locks, with the note *"Log level is controlled by the RUST_LOG / CODEG_LOG environment variable; change it there to take effect."* `CODEG_LOG` takes precedence over `RUST_LOG`; unset both to hand control back to this screen. It's the standard Rust logging knob, so a directive like `RUST_LOG=codeg_lib::web=debug` works the same way the per-module overrides below do.
:::

## Per-module overrides

Sometimes you want one noisy subsystem turned up without drowning in *everything* at Debug. **Per-module overrides** do exactly that — *"Set a different level for specific modules (e.g. codeg_lib::acp) without changing the global level."*

**Add** appends a row: a **module target** and its own level. The target field autocompletes Codeg's main subsystems —

- `codeg_lib::acp` — the agent protocol layer (`codeg_lib::acp::delegation` for multi-agent hand-offs),
- `codeg_lib::web` — the web server,
- `codeg_lib::chat_channel` — chat channels,
- `codeg_lib::db` — the database,

— but any valid module path is accepted. A target has to look like `name::name::…`; a malformed one is flagged in red and simply left out when the settings save, rather than silently breaking the filter. Set the row's level and that module logs at it while the global dial stays wherever you left it. Remove a row with its **✕**. Like the global level, overrides save on their own — a target when you click away from it, a level change or a removal at once.

## The live viewer

**Recent logs** is a tail of the buffer — *"Live view of recent log records. Filter by level or search text."* By default it **follows new records to the bottom** as they arrive; scroll up to read history and it leaves you there.

The toolbar:

- **Pause / Live** — stop following, or resume the live tail. Paused, the view holds still while logs keep accumulating behind it.
- **Refresh** — re-pull the newest records from the buffer.
- **Clear** — empty the *view*. It doesn't touch the files or the buffer — **Refresh** brings the records right back; it's just a way to wipe the screen and watch what happens next from a clean slate.
- **Open folder** *(desktop)* — reveal the log directory in your file manager (see [below](#log-files-on-disk)).

Below that, a **search** box (matches the message or the target) and a **level filter** — *All levels*, *Error+*, *Warning+*, and so on — narrow what's shown, with a running **"{shown} / {total} shown"** count.

That filter is **view-only**: it changes what you *see*, not what Codeg *records* — that's the [capture level](#log-level) above. Narrowing the view to *Error+* doesn't stop Info lines from being captured; it just hides them here.

Each line shows its **time** (to the millisecond), **level** (color-coded: red errors, amber warnings, blue info, muted debug and trace), **target** module, and **message**. Lines carrying structured context — the enclosing span chain and key/value fields — show a **▸** you can expand to read them, handy for following one request through the code.

The viewer holds the **newest ~5,000 records** in memory (a rolling buffer, also byte-capped, so a long-running app doesn't grow without bound). Older lines scroll out of the buffer but stay in the files on disk — which is what the next section is for.

## Log files on disk

The buffer is only the recent tail; the **full history lives in files**. Codeg writes a new file per day into **`logs/`** beside its database, in the [data directory](/getting-started/configuration#where-codeg-stores-its-data) — for the desktop app on macOS that's `~/Library/Application Support/app.codeg/logs` — named by binary and date: `codeg.<date>.log` for the desktop app, `codeg-server.<date>.log` for a [standalone server](/getting-started/deployment). `CODEG_HOME` takes precedence (`$CODEG_HOME/logs`). `~/.codeg/logs` is only the last resort for a process with no data directory at all — the desktop app and `codeg-server` both set theirs as they start. They're structured **JSON** lines, easy to grep or pipe through `jq`. Codeg keeps the **most recent 30** by default (override with `CODEG_LOG_MAX_FILES`) and prunes older ones.

Since **0.35.0** the desktop app writes to that one folder **however it was started**. Before, a launch from the Dock or the Start menu wrote to `~/.codeg/logs`, a relaunch after an update wrote beside the database, and **Open folder** always showed the second — so logs from an older version may be in either place.

How you reach them depends on where you're running:

- **Desktop** — the **Open folder** button in the viewer toolbar reveals the folder the logs are actually being written to, in Finder / Explorer / your file manager. Open the day you need directly.
- **In a browser** *(web mode or a server)* — a **Log files** panel lists the files on the machine with their current sizes and a **Download** button each, *"for history beyond the live buffer."* A single download returns at most the newest **16 MiB** of a file; anything larger comes back as a `.tail.log` slice with a heads-up, and the complete file stays on disk. (On a Windows host, the file being written today used to list as 0 bytes until 0.35.0.)

### A day's log can't fill your disk

`CODEG_LOG_MAX_FILES` bounds how many *days* are kept — never how large the day in progress may get. That gap was real: a field report had the desktop app write **34 GB in under nine hours** with nothing stopping it and nothing saying so.

Each day's file now carries a **512 MB ceiling** (`CODEG_LOG_MAX_BYTES`; `0` disables it). Past that the file latches off for the rest of the day, and the cut-off — plus a tally of what it went on to drop — is reported **in this viewer** as well as to stderr, so a log that goes quiet is never one that went quiet silently. The boundary is UTC, matching the rotation stamp, and it resumes from what today's file already holds rather than handing out a fresh ceiling on every relaunch.

The protocol chatter behind that kind of flood is also quieter by default: the ACP transport logs every JSON-RPC message several times over, so its targets carry a standing level ceiling. Ask for more specifically — `RUST_LOG=sacp::jsonrpc::transport_actor=trace` — and you still get it.

### A crash leaves a record

Before **0.31.2**, a Rust panic left **nothing** behind. On Windows the runtime aborts with `STATUS_STACK_BUFFER_OVERRUN` (`0xc0000409`), so all a bug report could carry was a Windows Error Reporting bucket naming `codeg.exe` and a log that simply stops mid-file — no message, no location, no backtrace.

Codeg now writes the crash down before the process dies: the **panic message**, the **thread**, the **file, line and column**, the **app version**, and a **backtrace** (captured unconditionally, not left to `RUST_BACKTRACE`, which nobody reporting a crash has set). It goes straight into the day's file **synchronously** — the ordinary path hands records to a background writer that an aborting process never gets to run — and then to stderr, the buffer and this viewer like any other error.

Two things worth knowing when you go looking:

- **Grep for `codeg_lib::panic`.** That's the record's target, chosen to be the string you'd search for. It's also what keeps it out of the logging stack's own silencing.
- **It's bounded, and it's written once.** One process can spend at most **1 MiB** on panic records — a task panicking on every turn of a restart loop would otherwise become the storm the daily ceiling exists to prevent — and a line says so when the allowance is gone. Most panics don't end the process (async tasks catch theirs), so this is the common case rather than the rare one; the file records each one exactly once.

All five binaries install it — desktop, `codeg-server`, `codeg-mcp`, the supervisor and the credential helper — before any of them does real work. For `codeg-mcp` the record goes to stderr only, like everything else it logs.

::: tip codeg-mcp is the exception
The per-launch [`codeg-mcp` companion](/reference/architecture) logs to **stderr only** — no file, no buffer — so it never appears on this screen. What you see here is the desktop app or the server itself, not the MCP helpers they spawn.
:::

## Good to know

- **Two different "levels" on one screen.** The **capture level** (and per-module overrides) decide what gets *recorded*; the viewer's **level filter** and **search** only decide what's *shown*. Turn capture down to shrink your logs; use the filter to find a needle without changing anything.
- **Everything auto-saves.** The level and each override persist as you change them — there's no save button, just a brief spinner. The setting is remembered across restarts and shared live across windows.
- **Clear isn't delete.** *Clear* wipes only the on-screen view; the files on disk and the in-memory buffer are untouched, and *Refresh* repopulates from the buffer.
- **Debug and Trace are for a reason, then off.** They're invaluable while reproducing a bug and expensive the rest of the time — big files, more I/O. Bump the level (or a single module) up while you reproduce, grab the log, then bring it back to *Info*.
- **The env var wins.** If `CODEG_LOG` / `RUST_LOG` is set, the screen can't change the level — by design, so a launch-time directive isn't quietly overridden. Clear it to edit here.

## Related

- [Architecture](/reference/architecture) — the binaries (`codeg`, `codeg-server`, `codeg-mcp`) whose `codeg_lib::…` targets show up in these logs, and the computer-use helper whose output Codeg copies in.
- [Deployment](/getting-started/deployment) — where the server writes `codeg-server.<date>.log`, and why a browser session gets a download list instead of an Open-folder button.
- [System](/reference/settings/system) — the other operations-facing screen: updates, network proxy, language, and backup.
- [Reference overview](/reference/) — the full 17-screen Settings map.
