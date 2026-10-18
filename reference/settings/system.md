---
title: System
description: Configure software updates, launch at login, command-line access, the network proxy, language, configuration sync, and backup and restore.
---

# System

**Settings → System** — labeled **System Management** in the app — manages software updates, launch at login, command-line access, the network proxy, language, and data sync and backups. Each section saves independently; there is no page-level Save.

## Software Update

Checks the configured release source for a newer Codeg and, where it can, installs it in place. The panel shows your **current version** and a **Check for updates** button; after a check it notes the time (*"Last checked…"*) and either *"You're on the latest version"* or the details of the release waiting for you — its version, date, and full release notes.

::: tip You don't have to come looking
A new release also announces itself in the workspace: a **New v…** badge appears in the [status bar](/guide/workspace#the-layout), and its popover carries the same version, **What's new** notes, and actions. Both surfaces read one shared check — a single fetch answers both, and they never disagree. **Later** dismisses a release, per version and across every open window, leaving a plain grey icon you can still click; the next release lights the badge again.

**The notes come in your language.** Codeg publishes each release as one body carrying the English notes, a separator, and the Chinese translation — so both surfaces used to show you a half you couldn't read, which in a 320-pixel popover is the half standing between you and the buttons. Since **0.25** the matching half is picked from your [interface language](#language): Chinese for 简体中文 and 繁體中文, English for the other eight. The split is read from the separator the publishing format actually writes, not guessed from where the Chinese starts — so a release with no separator renders whole rather than being truncated for both readers.
:::

What the upgrade button does depends on where you're running — this is the one screen where desktop and server genuinely differ:

- **Desktop app** — **Upgrade to vX** downloads the release and shows a progress bar. On macOS and Linux it then flips to **Restart to update**, which relaunches into the new version. On **Windows** there's no restart step: once the download is done Codeg closes and the installer runs without prompts and reopens it. Since **0.36.0** Codeg first stops its agents with their `codeg-mcp` companions, its terminals and the Web Service, and remembers your open windows; the installer moves aside a file that's still in use, which used to stop an update with *Error opening file for writing* on `codeg-mcp.exe`; and if the installer can't start, Codeg comes back on the version you had.
- **A self-updating server** — a standalone `codeg-server` (or Docker) that supports in-place updates behaves the same way: download, progress, restart. See [Deployment](/getting-started/deployment) for how server updates work.
- **Anything that can't self-update** — an older remote server falls back to a **View vX release** button that opens the GitHub releases page, so you can update it by hand.

**A package must be signed for the version on offer.** Since **0.36.0**, in the desktop app and the server's online upgrade alike, Codeg installs an update only if its signature names the very version the release announced — so an older signed package can't be passed off as a newer one. A package that fails this check shows as a plain *Failed to install update*.

**0.38.0** also fixes two restart problems: on macOS, relaunch waits for the old instance to exit so the Dock keeps one icon; on Windows, the installer stops bundled helper processes through the Windows API, avoiding the WMI query that could leave an update hanging.

::: info Rollback (server only)
A self-updating server keeps the previous binary, so after an upgrade a **Roll back** button appears — *"Restore the version installed before the last upgrade."* It's there for a regression that only surfaces later, once the automatic trial-window check has already passed. The desktop app updates through the OS installer and doesn't offer this. On **Docker**, an in-place upgrade is only live until the container is recreated — *"to keep it, pull or build an image at the new version and recreate."*
:::

**A server that can't write to its own installation says so before you try.** Since **0.32.1** a self-updating `codeg-server` — on Linux or macOS — checks ahead of time that it can write both where its binary lives and where its web files live. When it can't, the panel says which directory, and why if the system gave a reason such as a full disk, in amber; the upgrade button becomes **View vX release** for a manual update, and the status bar's update popover says the same while a release is on offer. It used to get as far as installing and fail with a bare *close the app and try again*. **Roll back** stays available unless the problem is a missing permission.

If a check or install fails, the reason is shown inline — an unreachable update source, a network error, or a failed download or install — usually a connectivity issue, which the proxy panel below can address. A package refused by the version check above lands here too, as a failed install.

## Launch at login

One switch, added in **0.27**: *"Opens automatically after you sign in to this computer."* Desktop only, and it works on **macOS, Windows, and Linux** alike. On macOS it registers a Launch Agent, which is why turning it on doesn't trigger an Automation consent prompt.

Codeg keeps **no copy of this setting** — the operating system's own startup entry is the only record, and the switch reads back from it. That matters in one specific way: what the toggle shows afterwards is **what the system actually settled on**, not what you asked for. If something outside Codeg vetoes the entry — Windows Task Manager's startup tab is the usual culprit — the switch flips back to off rather than claiming a state the machine disagrees with. If the entry can't be read at all, the panel says so instead of guessing.

On **macOS**, a Codeg that opened at login may not come back by itself after an update that was started from **0.35.2 or earlier** — click its Dock icon to open it. Updates started from 0.36.0 on relaunch normally.

## Command-line access {#command-line-access}

Added in **0.38.0**, **Command-line access** lets the **`codeg-cli`** command on this computer run prompts through this Codeg. It is **on by default**. The card shows the private **Endpoint file** used to discover this instance and a **Try** command. If the listener cannot start, it shows the reason instead.

Switching it off stops the local listener and removes its endpoint file immediately. It does **not** disable a server's authenticated HTTP API: `codeg-cli --url …` with the server's token still works. The listener's key is generated on every launch and kept in an owner-private file; programs running as your OS user can use it. → [Privacy & Security](/reference/privacy#command-line-access)

In the **local desktop app**, **Install command-line tool** puts the bundled command on PATH: a link in `/usr/local/bin` on macOS, the installer's `bin` folder added to the user's PATH on Windows, or a link in `~/.local/bin` for an AppImage. Linux `.deb` and `.rpm` packages already provide it. A command from another installation is left alone, and the card explains a conflict if there is one. Open a new terminal after installing on Windows. Browser and remote-workspace sessions do not offer this local installation button.

See [Command Line](/guide/command-line) for installation, runtime selection, permission policies, structured output, and CI.

## Network Proxy

Routes Codeg's own network traffic through a proxy. Tick **Enable system proxy** and enter a **Proxy address**; from then on, *"subsequent network requests prefer this proxy (including ACP chat, agent installation and Git remote operations)."*

The address takes an `http`, `https`, or `socks5` URL — the placeholder is `http://127.0.0.1:7890`, a typical local proxy. It's **required once the proxy is enabled** (turning it on without an address is refused), and the setting **saves as you go** — toggling the checkbox or leaving the field commits it. It applies only while *Enable system proxy* is on; untick to go direct again.

**Leave the scheme off and Codeg adds it.** A bare `127.0.0.1:7890` used to pass validation and be stored verbatim — updates and binary downloads coped, but **npm refused every agent install** with a bare `ERR_INVALID_URL` and no hint as to why. Since **0.28** an address with no scheme is normalized to `http://` when it's saved and again when it's handed to a child process, and one that already names a scheme is left alone, so a `socks5://` proxy is never rewritten. A value stored by an older build is repaired when it's read. A proxy set from **outside** Codeg — `docker -e`, a shell export — is deliberately left as you wrote it; if npm then rejects it, the error names the offending variable rather than leaving you to find it.

**Bypass proxy for** lists what should connect directly instead — new in **0.32.2**. Separate entries with commas and no spaces: `example.com` matches that domain, `.example.com` every subdomain of it, and IP addresses work too. The local addresses — `localhost`, `127.0.0.1`, `::1` — always connect directly and needn't be listed. The field saves when you leave it, and while the proxy is on the list takes effect as the `NO_PROXY` environment variable, for Codeg and for every agent it launches. A `*` anywhere in it means *bypass everything*, and Codeg then passes `*` on by itself, because Python and curl honour `*` only as the whole value.

::: warning `*` doesn't fully bypass Antigravity 1.3.0 and later
**Antigravity 1.3.0** and later — **1.4.1** is pinned since **0.37.0** — add the local addresses to `NO_PROXY` themselves whenever a proxy is set. That turns a lone `*` into `*,localhost,127.0.0.1,::1` — a list, in which Python skips the `*`. So with a proxy configured and a `*` in this list, or in a `NO_PROXY` you export yourself, some of Antigravity's own requests — the ones its Python service makes — go **through the proxy** again. To keep them direct, list the hosts they need instead of `*`.
:::

That local exception also applies to a proxy you set from **outside** Codeg, and it's what lets **OpenCode** and **Antigravity** work behind a proxy on another machine: both talk to a local service of their own, and until **0.32.2** those connections were sent to the proxy too, failing with *OpenCode service failure* or *Failed to connect to WebSocket*.

This is the proxy that carries everything Codeg reaches out for — the [Git operations](/reference/settings/version-control) your accounts authenticate, agent installs, model traffic. To set a proxy *before* the app starts, from the environment, see [Configuration](/getting-started/configuration).

## Language

Sets the language of Codeg's **own interface** — menus, buttons, settings. **App language** is either **Follow System** or one of ten: English, Simplified and Traditional Chinese, Japanese, Korean, Spanish, German, French, Portuguese, and Arabic. When following the system locale, *"unsupported languages fall back to English."* The choice applies immediately and is remembered.

(This is the desktop or browser app's UI language — separate from the language of any one conversation, or of this documentation site.)

## Data & sync {#backup-restore}

*"Configuration sync carries your settings between machines; backup packs up all of this machine's codeg data."* Three tabs, opening on the first: **Configuration sync**, **Backup** and **Restore**.

### Configuration sync {#configuration-sync}

Your settings, carried between machines — through a file, or through your own WebDAV server. Unlike a backup it's small, it never deletes anything — it adds entries and updates the ones it matches, leaving alone whatever it doesn't mention — and it never touches your conversations. **What gets synced**, folded at the top, lists both halves:

| Included | Not included |
| -------- | ------------ |
| Model providers, **with their API keys** | Conversations and history |
| Agent settings — each agent's environment variables among them | Uploaded files and images |
| Custom agents | Workspace projects and paths |
| [Assistants](/guide/assistants), since **0.36.0** | MCP servers, which each CLI owns |
| Quick messages and task templates | Login credentials and tokens |
| App preferences — language, light or dark, zoom, close-button behaviour, log level, the delegation settings and agent defaults, most in-conversation tool switches, chat-channel defaults | |

What *doesn't* travel among the preferences is as deliberate: the theme colour, fonts, chat width and the rest of Appearance live in each browser or window, the [browser-use and computer-use switches](/reference/settings/collaboration#in-conversation-tools) stay with the machine they act on, and nothing tied to an account or to this machine — git and forge tokens, chat-channel credentials, the Web Service token, the proxy, the Repository panel's settings and webhook secrets — ever leaves.

**Configuration file.** **Export to file** writes one JSON file — `codeg-config-<time>.codegcfg.json` — to carry to another machine; **Import from file** shows what's in one, entry counts per kind, and asks before applying it. The file is **never encrypted**, whatever the WebDAV switch below says, and it holds your API keys — treat it like a password.

**WebDAV sync**, off by default, uploads the same snapshot to a server you choose:

- **Server** fills in an address for **Jianguoyun**, **Nextcloud** or a **Synology NAS**, or leave it on **Custom**. Then **Server URL**, **Username** and **Password** — an app password, where the service has them — and **Remote folder** (`codeg`) and **Profile** (`default`). Machines that share a profile share one configuration; give work and personal machines different ones. The files land in `<server>/<folder>/v1/<profile>/`.
- **Encrypt the snapshot**, off by default, protects the upload with a **passphrase** that every machine you sync needs to share. Without it, an amber note says what's true: the snapshot goes up unencrypted, API keys included, so use a server only you can reach.
- **Upload automatically**, on by default, checks every **5**, 15, 30 or 60 minutes — 5 unless you change it — and uploads only when the configuration has changed.
- **Save** stores the settings. **Test connection** tries what's in the form without saving it. **Sync now** uploads straight away, and **Restore from remote** downloads and applies — both using the *saved* settings, so save your edits first. Below them, **Last synced** and any **Last error**.

Nothing is ever **downloaded on its own**: automatic sync only uploads, and taking a copy from the server is always **Restore from remote**, after a confirmation that names the machine and the time it came from. Machines on one profile overwrite one copy, so the last to upload wins.

**Applying** a file or a remote copy **adds and updates, and never deletes** — an entry the snapshot doesn't mention is left as it is. An incoming assistant whose name another one here already has is renamed *Name (2)*. Appearance, language and the provider list take effect after restarting Codeg. A snapshot in a format newer than this Codeg reads is refused before anything is written — a newer Codeg writing the same format is fine — and one from an older Codeg simply leaves alone what it doesn't carry.

**Undo an import** appears once there's something to undo. Before every import, every restore from remote and every undo, Codeg tries to save the configuration as it was — the last ten, in `config-snapshots/` under `~/.codeg` (or `CODEG_HOME`), as plain JSON with the keys in it — and **Undo** puts one back. If that save fails, the import still goes ahead, without anything to undo it with. It re-applies that copy the same merging way, so values return to what they were, but an entry the import *added* stays.

The WebDAV password and the passphrase are never part of a snapshot: they're kept in the OS keychain on the desktop, and in the server's own secret store on `codeg-server`. Change the server address or the username and save with the password field empty, and the stored password is dropped rather than sent to the new host. In a desktop window attached to a remote workspace, this tab works on the **server's** configuration.

### Backup

A portable snapshot of this machine's whole Codeg install — *"Packs this machine's codeg data — the database and uploaded files — into one archive."* Where configuration sync carries settings and merges them, a backup carries everything and a restore replaces it.

Export writes a single `.codegbak` archive of your **database and uploads**. Two choices shape it:

- **Include conversation content** *(off by default)* — *"Also archive agent CLI transcripts (Claude, Codex, Gemini, …). Increases size."* Off, the backup is your Codeg data alone; on, it also pulls in the underlying agent CLIs' own transcript files. Since **0.35.0** that includes Codex's session index, where every Codex conversation's **name** lives — a backup made before it lacks the index, so a Codex conversation restored from one can come back named after its first prompt.
- **Passphrase** *(optional)* — encrypt the archive. Leave it empty and Codeg warns, in amber, that *"this backup will contain secrets (API keys, tokens) in plaintext"* — because it does; store it somewhere safe. Set one and the opposite caution applies: *"if you lose it, the backup cannot be recovered."*

**Export backup** builds it — the desktop app saves a file, a browser session downloads one.

Some agents keep their sessions in **SQLite**, which can't simply be copied while it's open. Since **0.30.4** the export **names the ones that needed special handling** — silence means the ordinary copy worked — and says which of three things happened to each: **recovered from a private copy** (complete), **archived without its write-ahead log** (the newest messages may be missing), or **not archived at all**, because the store kept changing underneath or couldn't be copied, which is better than archiving a torn copy. The panel lists the first eight and counts the rest. Before this, OpenCode, Hermes, Cursor and Antigravity databases could come back missing their newest messages beside a stale log, and a **custom ACP agent**'s conversations came back present but *empty* — their message text was packed by neither the backup nor the restore path.

### Restore

**Select backup file** (`.codegbak` or `.zip`), and Codeg inspects it before doing anything. If it's encrypted you're asked for the passphrase; then a **Backup details** card shows when it was made, which app version made it, and whether it's **Compatible** — a backup from a *newer* Codeg than you're running can't be restored.

Restoring is a **full replace**, and the panel says so plainly, in red: *"Restoring replaces all current codeg data (database and uploads). Your current data is snapshotted first so it can be recovered."* You confirm through a **Replace all data?** dialog, after which Codeg stages the restore and restarts to apply it.

Three things worth knowing before you do:

- **Desktop backups don't carry your keychain secrets.** *"Desktop GitHub/chat tokens live in your OS keychain and are not included; re-enter them after restoring."* On a **server**, those same tokens live in a file that *is* in the backup — the difference is exactly the keyring split described under [Version Control](/reference/settings/version-control).
- **Restoring conversation content is its own choice.** If the backup included the agent CLI transcripts, you pick where they land — skip them, drop them in a **safe side folder**, or write them back to the **original CLI locations** (with a conflict scan and an optional overwrite) so the agents see their history again.
- **Two session lists are merged, not replaced.** Codex's and Kimi Code's session indexes — the one that names each Codex conversation, the one that records which folder each Kimi session belongs to — are append-only files the CLIs keep adding to. Since **0.35.0** a restore to the original locations **adds** the backup's entries for every session the live file doesn't know, rather than skipping the whole file as a conflict or overwriting it, so restored conversations keep their names and folders and a CLI that's running loses nothing. With overwrite on, the backup's entry also wins for a session whose entry differs.

#### Pre-restore snapshots

The snapshot the warning mentions isn't a figure of speech — it's a listed thing you can go back to. **Pre-restore snapshots** sits under the restore controls, normally holding the **two newest**.

A snapshot carrying the manifest that records what was *absent* before the restore offers **Roll back to this**; one written before that manifest existed is listed as **Inspect only**, because without that list a rollback couldn't tell *leave this alone* from *this didn't exist, remove it*. Rolling back replaces your current data with the snapshot and restarts, and — the part that makes it safe to try — **snapshots the data it's replacing on the way**, so the rollback is itself reversible.

A restore also reports what it did instead of leaving you to guess: **Restore staged**, with counts for files kept because you didn't opt into overwriting — a merged session index isn't one of them — session databases that couldn't be written back, and — when agents were running and their transcripts went to a side folder instead of their original locations — which agents and which path.

::: warning Backup acts on this machine
Backup and restore operate on the data of the machine actually running Codeg. If you're in a desktop app **connected to a remote workspace**, the **Backup** and **Restore** tabs are disabled with a note to *"manage its backups from that server directly"* — the native file dialogs here wouldn't line up with the remote server's storage. **Configuration sync** still works there, on the server's configuration.
:::

## Good to know

- **Settings save independently.** Command-line access, the proxy, language, launch at login, updates, and Data & sync each act on their own — the WebDAV settings have a **Save** of their own; there's no page-level Save.
- **Launch at login has no stored copy.** The OS entry is the setting, so the switch shows what your machine actually agreed to.
- **Desktop and server update differently.** The desktop app auto-installs and relaunches; a server updates in place with a restart (and can roll back); an old remote server just links you to the release. Same panel, three behaviors.
- **An unencrypted backup is plaintext secrets** — and so is every configuration export. API keys and tokens ride along in the clear unless you set a passphrase on a backup or switch on **Encrypt the snapshot** for WebDAV; an exported configuration file is never encrypted, so keep it somewhere trusted. How Codeg handles secrets generally is under [Privacy & Security](/reference/privacy).
- **Restore is a replace, but reversible.** It swaps in the backup's database and uploads wholesale — yet snapshots your current data first, and that snapshot is [listed with a Roll back button](#pre-restore-snapshots), so a mistaken restore can be walked back.
- **The proxy is app-wide.** Once on, it carries git, agent installs, and model calls alike — the one path everything Codeg reaches out through.

## Related

- [Deployment](/getting-started/deployment) — in-place updates for `codeg-server` and Docker, and where a server keeps the tokens a desktop backup leaves behind.
- [Configuration](/getting-started/configuration) — setting the proxy, and other options, from the environment before the app starts.
- [Version Control](/reference/settings/version-control) — the OS keychain that desktop backups deliberately exclude.
- [Privacy & Security](/reference/privacy) — plaintext secrets, encryption, and what leaves your machine.
- [Assistants](/guide/assistants) — one of the things configuration sync carries.
- [Reference overview](/reference/) — the full 17-screen Settings map.
