---
title: Download and install
description: Download Codeg for macOS, Windows, Linux, iPhone, iPad, or Android, then connect to your workspace and run your first session.
---

# Download and install

Codeg has two complementary parts. The **desktop app** runs agents and projects locally on macOS, Windows, or Linux. The native **iOS and Android clients** connect to a Codeg desktop or server you control, so you can keep a task moving away from your computer.

## Desktop app

Install the desktop app when you want Codeg and its agents to run on this computer. To run Codeg headlessly on a dedicated machine instead, see [Deployment](/getting-started/deployment).

<Download />

## Mobile apps

Use the mobile apps to start and follow sessions, stream agent output, answer permission prompts, and browse project context. They are clients rather than standalone agent runtimes: your files, agent CLIs, and conversations remain on the machine running Codeg.

<MobileDownload />

On Android, open the downloaded `.apk` and allow installation from your browser or file manager if Android asks. The official [release page](https://github.com/xintaofei/codeg-android/releases/latest) also publishes a SHA-256 checksum for verification.

### Connect a mobile app

The app needs a reachable Codeg host and its access token:

1. **Choose where Codeg runs.** On an existing desktop app, enable **Settings → Web Service** and copy the displayed URL and token. For an always-on workspace, [deploy `codeg-server`](/getting-started/deployment) instead.
2. **Make the host reachable.** A local-network address such as `http://192.168.1.10:3080` works while both devices are on the same trusted network. For remote access, use HTTPS through a trusted reverse proxy, VPN, or tunnel.
3. **Add the server.** In the mobile app, add a server profile, enter its URL and token, run **Test Connection**, and save it. The app will load the projects and sessions from that host.

::: warning Keep the token private
The token grants access to your Codeg workspace. Plain HTTP is suitable only on a trusted local network; use HTTPS or a trusted tunnel across any untrusted network. iOS stores the token in Keychain, and Android protects it with the Android Keystore.
:::

## Install the desktop app

### macOS

The macOS build is signed with an Apple Developer ID and **notarized by Apple**, so it opens without any Gatekeeper workaround.

1. Open the `.dmg` — pick **aarch64** for Apple Silicon (M-series) or **x64** for Intel.
2. Drag **Codeg** into **Applications**.
3. Launch it from Applications or Spotlight. macOS may ask you to confirm opening an app downloaded from the internet the first time.

### Windows

1. Run the `…_x64-setup.exe` you downloaded (or the `arm64` installer on Arm devices).
2. If **SmartScreen** shows an "unknown publisher" notice, choose **More info → Run anyway** — the installer isn't yet distributed with an Authenticode certificate.
3. Codeg installs and appears in your Start menu. Updates apply passively (see below).

### Linux

- **AppImage (x64):** make it executable and run it —
  ```bash
  chmod +x codeg_*_amd64.AppImage
  ./codeg_*_amd64.AppImage
  ```
- **Debian / Ubuntu:** `sudo apt install ./codeg_*_amd64.deb`
- **Fedora / RHEL:** `sudo dnf install ./codeg-*.x86_64.rpm`

Codeg's UI runs on a **WebKitGTK** runtime (`libwebkit2gtk-4.1`). The `.deb` / `.rpm` packages pull it in automatically; for the AppImage, install it yourself if it isn't already present. No AppImage is published for arm64 — use the `.deb` or `.rpm` there.

## Desktop system requirements

- A 64-bit desktop OS: **macOS** (Apple Silicon or Intel), **Windows 10/11**, or a modern **Linux** distribution with WebKitGTK.
- To *drive* agents you need at least one agent CLI installed. Codeg can install and manage most of them for you — via `npx` or a prebuilt binary — from **Settings → Agents**; the `npx`-based ones expect **Node.js** on your `PATH`. Two, **Kiro CLI** and **TRAE CLI**, you install with their vendors' own installers, and Codeg picks them up from there. See [Supported Agents](/guide/supported-agents).

::: tip Multi-agent delegation works out of the box
The desktop app bundles the `codeg-mcp` companion, so [multi-agent collaboration](/guide/multi-agent) is available immediately — no extra setup.
:::

## First desktop session

Three steps take you from a fresh install to a running session:

1. **Enable an agent.** Open **Settings → Agents**, pick one (Claude Code, Codex, Gemini…), and let Codeg run its **preflight check** — it flags anything missing and offers to install the agent for you. → [Working with Agents](/guide/agents)
2. **Authenticate.** Sign in with the agent's own subscription, point it at a custom endpoint, or use a model-provider API key. → [Authentication & Models](/guide/authentication)
3. **Start a session.** Open a project folder, choose your agent and model in the composer, and send your first prompt. Past sessions from that agent are [imported into the workspace](/getting-started/#what-codeg-does) automatically.

## Staying up to date

- **iPhone and iPad:** updates arrive through the App Store.
- **Android:** download new APKs and their SHA-256 checksums from the [Android releases page](https://github.com/xintaofei/codeg-android/releases/latest).
- **Desktop:** **Settings → System → Software Update** downloads the signed release and restarts Codeg — on Windows, by closing it and letting the installer reopen it. Since **0.36.0** an update installs only if its signature names the version on offer. See [System settings](/reference/settings/system#software-update).

## Other ways to connect

- **Use Codeg from a terminal or CI job** — `codeg-cli`, bundled since **0.38.0**, runs agents and assistants through your desktop app or server and saves each run as a conversation. → [Command Line](/guide/command-line)
- **Use your desktop app from any browser** — enable **Settings → Web Service** and Codeg serves its interface over the network, protected by an access token (with a QR code for phones). Because it listens on all network interfaces, you can reach your desktop session from any device that can connect to your machine — no separate server required. → [Web Service](/reference/settings/web-service)
- **Run it on a dedicated server** — for headless or team use, deploy `codeg-server` and use Codeg from any browser. → [Deployment](/getting-started/deployment)
- **Build from source** — see the [Development](/reference/development) guide.

## Next steps

- [**Supported Agents**](/guide/supported-agents) — which agents Codeg aggregates, and where each keeps its sessions.
- [**Guide**](/guide/) — multi-agent collaboration, chat channels, automations, and more.
- [**Configuration**](/getting-started/configuration) — environment variables and runtime options.
