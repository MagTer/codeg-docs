---
title: System
description: The System settings screen — Codeg's operations hub for software updates, launching at login, the network proxy, the app language, and full backup and restore.
---

# System

**Settings → System** — labeled **System Management** in the app — is the operations screen: *"Manage app updates, launch at login, network proxy and language preferences,"* plus a fifth panel for backing up and restoring everything. Five independent sections, each saving on its own; nothing here needs a page-level Save.

## Software Update

Checks the configured release source for a newer Codeg and, where it can, installs it in place. The panel shows your **current version** and a **Check for updates** button; after a check it notes the time (*"Last checked…"*) and either *"You're on the latest version"* or the details of the release waiting for you — its version, date, and full release notes.

::: tip You don't have to come looking
A new release also announces itself in the workspace: a **New v…** badge appears in the [status bar](/guide/workspace#the-layout), and its popover carries the same version, **What's new** notes, and actions. Both surfaces read one shared check — a single fetch answers both, and they never disagree. **Later** dismisses a release, per version and across every open window, leaving a plain grey icon you can still click; the next release lights the badge again.

**The notes come in your language.** Codeg publishes each release as one body carrying the English notes, a separator, and the Chinese translation — so both surfaces used to show you a half you couldn't read, which in a 320-pixel popover is the half standing between you and the buttons. Since **0.25** the matching half is picked from your [interface language](#language): Chinese for 简体中文 and 繁體中文, English for the other eight. The split is read from the separator the publishing format actually writes, not guessed from where the Chinese starts — so a release with no separator renders whole rather than being truncated for both readers.
:::

What the upgrade button does depends on where you're running — this is the one screen where desktop and server genuinely differ:

- **Desktop app** — **Upgrade to vX** downloads the release, shows a progress bar, and when it's staged flips to **Restart to update**; clicking that relaunches into the new version. This is Codeg's built-in auto-updater.
- **A self-updating server** — a standalone `codeg-server` (or Docker) that supports in-place updates behaves the same way: download, progress, restart. See [Deployment](/getting-started/deployment) for how server updates work.
- **Anything that can't self-update** — an older remote server falls back to a **View vX release** button that opens the GitHub releases page, so you can update it by hand.

::: info Rollback (server only)
A self-updating server keeps the previous binary, so after an upgrade a **Roll back** button appears — *"Restore the version installed before the last upgrade."* It's there for a regression that only surfaces later, once the automatic trial-window check has already passed. The desktop app updates through the OS installer and doesn't offer this. On **Docker**, an in-place upgrade is only live until the container is recreated — *"to keep it, pull or build an image at the new version and recreate."*
:::

**A server that can't write to its own installation says so before you try.** Since **0.32.1** a self-updating `codeg-server` — on Linux or macOS — checks ahead of time that it can write both where its binary lives and where its web files live. When it can't, the panel says which directory, and why if the system gave a reason such as a full disk, in amber; the upgrade button becomes **View vX release** for a manual update, and the status bar's update popover says the same while a release is on offer. It used to get as far as installing and fail with a bare *close the app and try again*. **Roll back** stays available unless the problem is a missing permission.

If a check or install fails, the reason is shown inline — an unreachable update source, a network error, or a failed download or install — usually a connectivity issue, which the proxy panel below can address.

## Launch at login

One switch, added in **0.27**: *"Opens automatically after you sign in to this computer."* Desktop only, and it works on **macOS, Windows, and Linux** alike. On macOS it registers a Launch Agent, which is why turning it on doesn't trigger an Automation consent prompt.

Codeg keeps **no copy of this setting** — the operating system's own startup entry is the only record, and the switch reads back from it. That matters in one specific way: what the toggle shows afterwards is **what the system actually settled on**, not what you asked for. If something outside Codeg vetoes the entry — Windows Task Manager's startup tab is the usual culprit — the switch flips back to off rather than claiming a state the machine disagrees with. If the entry can't be read at all, the panel says so instead of guessing.

## Network Proxy

Routes Codeg's own network traffic through a proxy. Tick **Enable system proxy** and enter a **Proxy address**; from then on, *"subsequent network requests prefer this proxy (including ACP chat, agent installation and Git remote operations)."*

The address takes an `http`, `https`, or `socks5` URL — the placeholder is `http://127.0.0.1:7890`, a typical local proxy. It's **required once the proxy is enabled** (turning it on without an address is refused), and the setting **saves as you go** — toggling the checkbox or leaving the field commits it. It applies only while *Enable system proxy* is on; untick to go direct again.

**Leave the scheme off and Codeg adds it.** A bare `127.0.0.1:7890` used to pass validation and be stored verbatim — updates and binary downloads coped, but **npm refused every agent install** with a bare `ERR_INVALID_URL` and no hint as to why. Since **0.28** an address with no scheme is normalized to `http://` when it's saved and again when it's handed to a child process, and one that already names a scheme is left alone, so a `socks5://` proxy is never rewritten. A value stored by an older build is repaired when it's read. A proxy set from **outside** Codeg — `docker -e`, a shell export — is deliberately left as you wrote it; if npm then rejects it, the error names the offending variable rather than leaving you to find it.

**Bypass proxy for** lists what should connect directly instead — new in **0.32.2**. Separate entries with commas and no spaces: `example.com` matches that domain, `.example.com` every subdomain of it, and IP addresses work too. The local addresses — `localhost`, `127.0.0.1`, `::1` — always connect directly and needn't be listed. The field saves when you leave it, and while the proxy is on the list takes effect as the `NO_PROXY` environment variable, for Codeg and for every agent it launches. A `*` anywhere in it means *bypass everything*, and Codeg then passes `*` on by itself, because Python and curl honour `*` only as the whole value.

::: warning `*` doesn't fully bypass Antigravity 1.3.0 and later
**Antigravity 1.3.0**, pinned from **0.34.0**, and **1.4.0**, pinned since **0.35.2**, add the local addresses to `NO_PROXY` themselves whenever a proxy is set. That turns a lone `*` into `*,localhost,127.0.0.1,::1` — a list, in which Python skips the `*`. So with a proxy configured and a `*` in this list, or in a `NO_PROXY` you export yourself, some of Antigravity's own requests — the ones its Python service makes — go **through the proxy** again. To keep them direct, list the hosts they need instead of `*`.
:::

That local exception also applies to a proxy you set from **outside** Codeg, and it's what lets **OpenCode** and **Antigravity** work behind a proxy on another machine: both talk to a local service of their own, and until **0.32.2** those connections were sent to the proxy too, failing with *OpenCode service failure* or *Failed to connect to WebSocket*.

This is the proxy that carries everything Codeg reaches out for — the [Git operations](/reference/settings/version-control) your accounts authenticate, agent installs, model traffic. To set a proxy *before* the app starts, from the environment, see [Configuration](/getting-started/configuration).

## Language

Sets the language of Codeg's **own interface** — menus, buttons, settings. **App language** is either **Follow System** or one of ten: English, Simplified and Traditional Chinese, Japanese, Korean, Spanish, German, French, Portuguese, and Arabic. When following the system locale, *"unsupported languages fall back to English."* The choice applies immediately and is remembered.

(This is the desktop or browser app's UI language — separate from the language of any one conversation, or of this documentation site.)

## Backup & Restore

A portable snapshot of your Codeg install — *"Export a portable backup of your codeg data, or restore from one."* Two tabs: **Backup** and **Restore**.

### Backup

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
Backup and restore operate on the data of the machine actually running Codeg. If you're in a desktop app **connected to a remote workspace**, the panel is disabled with a note to *"manage its backups from that server directly"* — the native file dialogs here wouldn't line up with the remote server's storage.
:::

## Good to know

- **Five panels, five independent saves.** The proxy, the language, launch at login, and the update check each act on their own; there's no page-level Save, and changing one never touches another.
- **Launch at login has no stored copy.** The OS entry is the setting, so the switch shows what your machine actually agreed to.
- **Desktop and server update differently.** The desktop app auto-installs and relaunches; a server updates in place with a restart (and can roll back); an old remote server just links you to the release. Same panel, three behaviors.
- **An unencrypted backup is plaintext secrets.** API keys and tokens ride along in the clear unless you set a passphrase — encrypt it, or keep the file somewhere trusted. How Codeg handles secrets generally is under [Privacy & Security](/reference/privacy).
- **Restore is a replace, but reversible.** It swaps in the backup's database and uploads wholesale — yet snapshots your current data first, and that snapshot is [listed with a Roll back button](#pre-restore-snapshots), so a mistaken restore can be walked back.
- **The proxy is app-wide.** Once on, it carries git, agent installs, and model calls alike — the one path everything Codeg reaches out through.

## Related

- [Deployment](/getting-started/deployment) — in-place updates for `codeg-server` and Docker, and where a server keeps the tokens a desktop backup leaves behind.
- [Configuration](/getting-started/configuration) — setting the proxy, and other options, from the environment before the app starts.
- [Version Control](/reference/settings/version-control) — the OS keychain that desktop backups deliberately exclude.
- [Privacy & Security](/reference/privacy) — plaintext secrets, encryption, and what leaves your machine.
- [Reference overview](/reference/) — the full 17-screen Settings map.
