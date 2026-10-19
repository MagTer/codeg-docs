---
title: Deployment
description: Run Codeg headlessly on a Linux or macOS server with codeg-server or Docker, and reach your workspace from any browser.
---

# Deployment

**`codeg-server`** is Codeg running headless — the same agents, sessions, channels, and [multi-agent collaboration](/guide/multi-agent) as the desktop app, served from a machine you control and reachable in any browser. Stand it up once on an always-on server and your workspace is there from any device, no desktop required. It's guarded by an access token.

::: tip Just want your desktop app in a browser now and then?
You don't need a server for that — turn on [Web Service](/reference/settings/web-service) and your running desktop app serves itself over the network. Reach for `codeg-server` when you want Codeg running **without** a desktop: always-on, headless, or shared.
:::

## Ways to deploy

| Method | Best for |
| ------ | -------- |
| [**Docker**](#docker) | The simplest durable setup — isolated, self-supervising, one command |
| [**One-line install**](#one-line-install-linux-macos) | A native binary straight onto a Linux or macOS host |
| [**Prebuilt binary**](#prebuilt-binaries) | Manual, offline, or fully controlled installs |
| [**Build from source**](#build-from-source) | Custom patches or unsupported platforms |

Every method installs `codeg-server` and its `codeg-mcp` companion, so multi-agent delegation works on the server exactly as it does on the desktop. Since **0.33.0** the install scripts and the release archives also carry `codeg-computer-helper`, for a server that should offer [computer use](/guide/computer-use) on its own desktop; the Docker image doesn't.

Since **0.38.0**, the packages and Docker image also include **`codeg-cli`**, for running agents and assistants from a terminal or CI job. → [Command Line](/guide/command-line)

## Docker

The fastest durable deployment is one command:

```bash
docker run -d -p 3080:3080 -v codeg-data:/data ghcr.io/spacering-net/codeg:latest
```

That's a complete install: the image bundles the web UI, `git`, and `ssh`, runs under its own supervisor as PID 1, and persists everything to the `codeg-data` volume. On first start it generates a random access token and writes it to the logs — read it with `docker logs`, or set your own and mount a project directory to work on local repos:

```bash
docker run -d -p 3080:3080 \
  -v codeg-data:/data \
  -v /path/to/projects:/projects \
  -e CODEG_TOKEN=your-secret-token \
  ghcr.io/spacering-net/codeg:latest
```

Images are published multi-arch (amd64 + arm64) to `ghcr.io/spacering-net/codeg` and Docker Hub `xintaofei/codeg`, tagged with each release's version (`:0.38.0`). `:latest` follows **stable** releases only — a release candidate gets a version tag of its own, ending in `-rc.N`, and never moves `latest`.

::: warning Pulling from `ghcr.io/xintaofei/codeg`? Switch names
Codeg's repository moved to `spacering-net/codeg`, and since **0.34.0** GitHub's registry publishes under the new name. **`ghcr.io/xintaofei/codeg` stays at 0.33.0** — a container or Compose file that still names it keeps pulling that release and never updates again. Change the image to `ghcr.io/spacering-net/codeg`; the `codeg-data` volume isn't tied to the image name, so your data comes along. Docker Hub's `xintaofei/codeg` carries on as before.
:::

### With Compose

For anything long-lived, use Compose. Save this as `docker-compose.yml`:

```yaml
services:
  codeg:
    image: ghcr.io/spacering-net/codeg:latest
    ports:
      - "3080:3080"
      - "3081-3090:3081-3090"   # port bridge: dev servers shown in the workbench
                                  # (or set CODEG_BRIDGE_HOST_PATTERN and drop this line)
    volumes:
      - codeg-data:/data
      # - /path/to/projects:/projects   # optional: expose local repos
    environment:
      - CODEG_TOKEN=${CODEG_TOKEN:-}
      - CODEG_PORT=3080
      - CODEG_HOST=0.0.0.0
    restart: unless-stopped

volumes:
  codeg-data:
```

Then `docker compose up -d`. Provide `CODEG_TOKEN` through a `.env` file or your shell.

::: warning In-place upgrades don't survive a container recreate
The server can upgrade itself (see [Keep your server up to date](#keep-your-server-up-to-date)), but inside Docker that upgrade is written to the running container's writable layer — not the image. Your `/data` volume persists, but the upgraded binary is dropped the moment the container is recreated (`docker compose up --force-recreate`, a fresh `docker run`, or recreating after a `docker pull`). To upgrade permanently, pull or build a new image and recreate the container from it.
:::

## One-line install (Linux / macOS)

Install the native binary straight onto a host:

```bash
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash
```

This places `codeg-server`, `codeg-mcp`, `codeg-computer-helper`, and `codeg-cli` in `/usr/local/bin` and the bundled web assets in `/usr/local/share/codeg/web`, using `sudo` only if the target isn't already writable. Pin a version or change the location with `--version` / `--dir`:

```bash
curl -fsSL https://raw.githubusercontent.com/spacering-net/codeg/main/install.sh | bash -s -- --version v0.38.0 --dir ~/.local/bin
```

Then start it. The installer prints the exact command for you; add `--supervise` on an unattended host so a failed self-upgrade rolls back automatically:

```bash
CODEG_STATIC_DIR=/usr/local/share/codeg/web codeg-server --supervise
```

The access token is printed to stderr on startup unless you set `CODEG_TOKEN` yourself.

### Windows

```powershell
irm https://raw.githubusercontent.com/spacering-net/codeg/main/install.ps1 | iex
```

This installs to **`%LOCALAPPDATA%\codeg-server`** and adds it to your PATH. Start it with the web files that came with it:

```powershell
$env:CODEG_STATIC_DIR="$env:LOCALAPPDATA\codeg-server\web"; codeg-server
```

Pin a version with `.\install.ps1 -Version v0.38.0`, or choose the folder with `-InstallDir`. Self-update is disabled on Windows — upgrade by re-running the installer.

::: info The server has a folder of its own since 0.33.0
It used to install into `%LOCALAPPDATA%\codeg` — the **desktop app's** folder — where the two could overwrite each other's files and stop each other's processes. Re-running the script moves a server it finds sharing that folder out into `codeg-server`, taking only `codeg-server.exe` and its PATH entry and leaving the desktop app's files alone; a server that had the old folder to itself stays where it is. The script refuses any target that holds the desktop app, and a server started from the desktop app's folder warns at startup that it should move. If a service, a scheduled task or a shortcut starts the old copy, or `CODEG_STATIC_DIR` still points at `%LOCALAPPDATA%\codeg\web`, point it at the new folder.
:::

## Prebuilt binaries

Every release ships a self-contained server bundle — binaries plus web assets, signed and checksummed — on the [Releases](https://github.com/spacering-net/codeg/releases) page:

| Platform | File |
| -------- | ---- |
| Linux x64 | `codeg-server-linux-x64.tar.gz` |
| Linux arm64 | `codeg-server-linux-arm64.tar.gz` |
| macOS x64 | `codeg-server-darwin-x64.tar.gz` |
| macOS arm64 | `codeg-server-darwin-arm64.tar.gz` |
| Windows x64 | `codeg-server-windows-x64.zip` |

Extract and run — the `web/` folder ships next to the binary, so just point `CODEG_STATIC_DIR` at it:

```bash
tar xzf codeg-server-linux-x64.tar.gz
cd codeg-server-linux-x64
CODEG_STATIC_DIR=./web ./codeg-server --supervise
```

## Build from source

```bash
pnpm install && pnpm build          # build the web UI
cd src-tauri
cargo build --release --bin codeg-server --no-default-features --features server-bin
cargo build --release --bin codeg-mcp --no-default-features --features mcp-bin   # delegation companion
cargo build --release --bin codeg-cli --no-default-features --features cli-bin   # command-line client
CODEG_STATIC_DIR=../out ./target/release/codeg-server
```

The full toolchain and platform prerequisites are in the [Development](/reference/development) guide.

## Configuration

`codeg-server` is configured entirely through environment variables — there's no config file:

| Variable | Default | Description |
| -------- | ------- | ----------- |
| `CODEG_PORT` | `3080` | HTTP port |
| `CODEG_HOST` | `0.0.0.0` | Bind address |
| `CODEG_TOKEN` | *(random)* | Access token — printed to stderr on start if unset |
| `CODEG_DATA_DIR` | `~/.local/share/codeg` | SQLite database, uploads, and assets |
| `CODEG_STATIC_DIR` | `./web` | Web UI directory (the bundled `web/` export) |
| `CODEG_MCP_BIN` | *(sibling)* | Path to `codeg-mcp`, if it doesn't sit next to the server |
| `CODEG_BRIDGE_PORTS` | *(the ten ports after `CODEG_PORT`)* | Ports the [port bridge](/guide/browser#in-a-browser-session-the-port-bridge) may take to show dev servers in the workbench — a range (`3081-3090`), a list, `auto`, or `off` |
| `CODEG_BRIDGE_PUBLIC_HOST` | *(the host the workbench was loaded from)* | Hostname browsers should use for the bridge ports when a reverse proxy gives them another name |
| `CODEG_BRIDGE_HOST_PATTERN` | *(unset — bridge by port)* | Show dev servers by **hostname** on Codeg's own port instead of a port range: `auto`, or a template like `{port}.preview.example.com`. Needs wildcard DNS → [By hostname](/guide/browser#by-hostname-instead-of-by-port) |
| `CODEG_BROWSER_TUNNEL` | `all` | What a desktop app attached as a remote workspace may reach through this server in its built-in browser: `all`, `private`, or `off` → [Remote workspace windows](/guide/browser#in-a-remote-workspace-window) |
| `CODEG_COMPUTER_USE` | *(off)* | `1` offers [computer use](/guide/computer-use#on-a-server) on the server machine's own desktop |

::: tip Always set a token in production
Left unset, `CODEG_TOKEN` is generated randomly and printed to the logs — fine for a quick trial, but set your own for anything durable. The complete list of tunables — upload quotas, ACP timeouts, logging — lives in [Configuration](/getting-started/configuration).
:::

## Access it securely

By default the server binds `0.0.0.0:3080`, so it's reachable from any device that can route to the host. That's exactly what you want for remote access — which also means the **token is your only guard**. A few things to get right on a public host:

- **Put it behind HTTPS.** `codeg-server` speaks plain HTTP and has no built-in TLS. Front it with a reverse proxy — Caddy, nginx, or Traefik — that terminates TLS and forwards to `127.0.0.1:3080`. Set `CODEG_HOST=127.0.0.1` so only the proxy, not the whole network, can reach the server directly.
- **Keep the token secret.** Every API and WebSocket request must carry it, apart from a few that carry proof of their own — single-use download links, an Office live preview's per-document capability, and a forge's webhook deliveries, which are signed instead — and the app's own files and the login page's language lookup, which give nothing away. Rotate it by restarting with a new `CODEG_TOKEN`.
- **Or let your sign-in proxy vouch for the browser.** Behind an identity-aware proxy such as Cloudflare Access, `CODEG_AUTH=proxy-jwt` admits a browser on the proxy's signed assertion instead of the token, so people sign in once. The token keeps working for `codeg-cli` and scripts. The proxy's policy then decides who gets in. → [Sign in through an identity-aware proxy](/getting-started/configuration#sign-in-through-an-identity-aware-proxy)
- **Let the forge in, if you use webhooks.** The Repository panel's [webhook trigger](/guide/repository#set-up-the-webhook) is delivered to `/api/forge_webhook` on this server, and a forge can only deliver to an address it can reach. If a sign-in gateway stands in front — Cloudflare Access, say — exempt that path, or the deliveries never get to Codeg; each one is checked against a folder's secret on arrival. → [Webhooks](/reference/privacy#webhooks-for-auto-processing)
- **Publish the bridge ports the same way.** The [port bridge](/guide/browser#in-a-browser-session-the-port-bridge) binds `CODEG_BRIDGE_PORTS` on `CODEG_HOST` too. Each of those ports only answers a browser that opened the page from a signed-in workbench, but behind a TLS proxy they need TLS as well (the workbench addresses them with its own scheme), and with `CODEG_HOST=127.0.0.1` they need forwarding like the main port. Set `CODEG_BRIDGE_PORTS=off` if you would rather not run it.
- **Or skip the ports.** With `CODEG_BRIDGE_HOST_PATTERN`, dev servers are reached by name on the port the workbench already uses — `3000.codeg.example.com` — so there's nothing extra to publish, as long as a wildcard DNS record and a wildcard virtual host on your proxy send those names to the server.
- **Decide what a remote workspace's browser may reach.** A desktop app attached to this server as a [remote workspace](/guide/browser#in-a-remote-workspace-window) opens the server's own addresses in its built-in browser through a tunnel the server carries — to anything the server can reach, by default, on the reasoning that the token can already run commands there. `CODEG_BROWSER_TUNNEL=private` keeps it to loopback, private and link-local addresses — which still includes a cloud provider's metadata address — and `off` closes it.
- **Computer use stays off unless you start it.** With `CODEG_COMPUTER_USE=1`, anyone holding the token can share that machine's windows with agents from a browser, and the only stop is the status-bar popover's — the floating stop bar and the stop shortcut are the desktop app's. → [On a server](/guide/computer-use#on-a-server)

For a load balancer or orchestrator liveness probe, an authenticated `POST /api/health` (carrying the bearer token) returns `{"status":"ok","version":"…"}`.

### If your proxy demands its own headers

Some gateways won't forward a request at all unless it carries something of theirs — a Cloudflare Access service token is the usual case. Since **0.28.2** a remote-workspace connection can carry **custom HTTP headers**, attached to every request the desktop client sends it.

They live in the connection's manage dialog, under **Custom headers**, below the access token. The section stays folded away unless the connection already has some, and **values are masked**, since a header here almost always carries a credential. It's a list rather than a table of unique names, so a header you need to send twice works, with its two values kept in the order you typed them.

The headers belong to **that connection's host** and go nowhere else — and, like the access token, only over the scheme you configured: a connection set up as `https://box:8443` will not hand its credentials to `http://box:8443`.

::: warning These are stored in the database, not the keyring
A connection's access token and its custom headers live in that connection's row in Codeg's SQLite database, unencrypted — unlike your Git and chat credentials, which go to the OS keyring. Anyone who can read the data directory can read them. → [Privacy & Security](/reference/privacy#where-secrets-are-kept)
:::

## Install it as an app

The web version installs like an app. Add it to a phone's home screen — or install it from a desktop browser that offers to — and it opens in a window of its own with a full-bleed icon. Since **0.35.0** a phone's browser bar, and Android's navigation bar, follow your light or dark theme, and the app's manifest is fetched with your cookies, so installing works behind a sign-in proxy too.

Since **0.35.2** it also **keeps a copy of itself in your browser**. A tab the browser put to sleep reopens without downloading Codeg again, and a reload while the server is restarting or offline shows Codeg's own *Connection lost* screen, with **Reconnect now**, instead of the browser's error page. What's kept is the app and nothing of yours:

- **Build files and page shells only.** No `/api` call and no live connection ever goes through that cache, so no conversation, file or setting is stored in it — and a dev server shown through the [port bridge](/guide/browser#in-a-browser-session-the-port-bridge) passes straight through.
- **Only where browsers allow it** — over **HTTPS**, or on `localhost`. A phone reaching the server at a plain `http://` LAN address doesn't get one, and the desktop app never uses it.
- **One copy per release.** A new version installs a fresh copy and clears the older ones, keeping only the previous release's files. If installing can't complete — behind a sign-in proxy that redirects the request for it, say — there's simply no copy, and nothing else changes.
- **Pages still come from the server first.** A page load uses the copy only when the server can't answer — no connection at all, or a server error — so a redirect to a sign-in page, or any other answer the server gives, goes through as usual. The build files themselves, which don't change within a release, are served straight from the copy.

**After a server upgrade or rollback**, an already-open tab can still be running the previous UI. Since **0.38.0**, Codeg checks the server's version on page load and after reconnecting. If it differs, a persistent notice names both versions and offers **Reload**. A page performing its own in-app upgrade or rollback reloads itself instead. New page loads revalidate the server's files; content-hashed build assets remain cacheable.

Codeg has no switch for the browser cache; to remove the copy, clear the site's data in your browser.

## Keep your server up to date

Like the desktop app, `codeg-server` updates itself from **Settings → Software Update**: it downloads the signed release for its platform, verifies the signature — which, since **0.36.0**, must name the very version on offer, so an older signed archive can't pass for a newer one — swaps the binaries and web assets on disk, and restarts — no redeploy. The previous version is retained, so the same screen offers a **Roll back**. This is Linux/macOS only (disabled on Windows). A server that can't write to its own installation — a binary or web folder it doesn't own, a full disk — says so on that screen **before** you try, since **0.32.1**, and offers the release page for a manual update instead.

**Updating from 0.37.0 does not install `codeg-cli`.** Extract it from the new release's server archive and put it beside `codeg-server`. Updates started from **0.38.0 onward** update the matching CLI too. Restarting the server ends its active CLI runs, so let important work finish before upgrading.

Run it under its supervisor to make upgrades safe:

```bash
./codeg-server --supervise
```

With `--supervise`, a freshly upgraded process that fails to boot within its trial window is automatically reverted to the previous version. Without it, the server still updates in place (it re-execs itself) but can't auto-roll-back a bad start. The Docker image already runs supervised.

::: tip Reboots need a service manager
`--supervise` keeps the server alive across upgrades, but it won't bring the process back after a machine reboot. Codeg doesn't ship a systemd unit — wrap `codeg-server --supervise` in your own unit, or rely on Compose's `restart: unless-stopped`, if you want it to return automatically.
:::

## Next steps

- [**Configuration**](/getting-started/configuration) — every environment variable and runtime option.
- [**Web Service**](/reference/settings/web-service) — serve your existing desktop app over the network instead of running a server.
- [**Supported Agents**](/guide/supported-agents) — install and manage agents on a headless host.
- [**Architecture**](/reference/architecture) — how the desktop app and `codeg-server` share one Rust core.
