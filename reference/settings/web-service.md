---
title: Web Service
description: The Web Service settings screen — turn your desktop Codeg into a browser-reachable server on your network, gated by an access token, with a QR code to open it on your phone.
---

# Web Service

**Settings → Web Service** turns the Codeg you're running into a **server you can reach from a browser** — your phone, a tablet, another laptop on the same network. The screen sums it up as *"Enable to access Codeg remotely via browser."* Start the service, point a browser at the address it prints, enter the token once, and you have the full workspace — same conversations, agents, and settings — on the other device.

::: info Desktop-only, by nature
This is the one Settings screen that appears **only in the desktop app**. It's the switch that *turns on* browser access in the first place, so there'd be nothing for it to do inside a browser session — you can't disable the door from the room it opens onto. Everything on this screen saves automatically; there's no save button.
:::

## Port

The TCP port the service listens on — **3080** by default. Pick any free port; the field is a plain number input. Ports **below 1024** usually need elevated privileges, so if a low port fails to start with *permission denied*, choose something higher.

The port is **locked while the service is running** — stop it first to change it.

## Access token

The password for the door. Anyone opening the address is asked for this token **the first time** they connect from a device; without it they don't get in. The field gives you three controls:

- **Regenerate** (↻) — mint a fresh random token. Handy if you think the old one leaked.
- **Show / hide** (eye) — reveal the token to read or type it.
- **Copy** — grab it for pasting into the other device.

Leave the field **empty and Codeg auto-generates a token** when you start the service. Like the port, the token is locked while running — stop to change it. Because this token is the only thing standing between your workspace and everyone else on the network, treat it like a password; how it's stored and transmitted is covered under [Privacy & Security](/reference/privacy).

## Auto-start

A toggle — **Start the Web service when Codeg launches**. Turn it on and you won't have to visit this screen after every restart; the server comes up on your saved port and token automatically. Unlike the other fields, you can flip this while the service is running.

## Starting and stopping

The **Status** row shows a green dot and *Running* or a grey dot and *Stopped*, with a single button that flips between **Start** and **Stop** (it reads *Processing…* mid-operation). Config you've edited — port, token — applies on the next **Start**, which is why those fields lock once it's up.

If a start fails, the reason is shown inline — most often the port is already taken (*Port N is already in use*), the port needs higher privileges, or the address isn't available on this machine. Change the port or free it and try again.

## The access address

Once the service is **running**, an **Access Address** section appears with the URL to open. The service binds to **all network interfaces** (`0.0.0.0`), so it's reachable at *every* local address of the machine at once — loopback for the same computer, a LAN IP for other devices. When there's more than one, a dropdown lets you choose which to show; that choice is **display-only** and remembered — it changes which address the buttons act on, never what the service actually listens on. Three round buttons sit beside it:

- **Copy** — copy the address.
- **QR Code** — pop up a QR you *"scan with your phone to open Codeg in a browser"* — the fastest way onto a mobile device.
- **Open** (↗) — open the address in your default browser.

## When the port is busy

If the service is stopped but Codeg notices the configured port is already **held by another process** (or in an unclear state), it shows an amber banner before you even press Start — *"Codeg can't bind here until the port is released. Change the port above, or close the process holding it."* It's a heads-up that a plain Start would fail with *port in use*, often from a leftover listener or an orphaned earlier run.

## Good to know

- **It's your desktop app, shared.** The browser client isn't a cut-down version — it's the same Codeg, driven remotely. This differs from a [headless server deployment](/getting-started/deployment), where a dedicated `codeg-server` binary (or Docker) *is* the whole install with no desktop at all. Same browser experience, two different origins — pick this screen when you already run the desktop app and just want to reach it from another device.
- **Reachable means reachable.** Binding to `0.0.0.0` means anyone who can route to your machine on that port can hit the login — which is exactly why the token matters. On an untrusted network, keep the token strong and stop the service when you're done.
- **Everything auto-saves.** Port, token, and auto-start persist as you change them; there's no save button. Edits to port and token take effect the next time you Start.
- **The service is bound to this machine.** Other devices reach it over the network, but the workspace, files, and agents all still run here — the browser is just a window onto them.
- **It's also where webhooks land.** While it runs, the service is the address a forge delivers the [Repository panel's webhooks](/guide/repository#set-up-the-webhook) to — a route that takes no access token and checks each delivery's signature instead. Stop the service and the desktop app stops receiving them; a scheduled scan doesn't need it. → [Privacy & Security](/reference/privacy#webhooks-for-auto-processing)
- **A browser can keep a copy of the app.** Reached over HTTPS or on `localhost`, the web version caches its own files so it reopens without downloading Codeg again. → [Deployment](/getting-started/deployment#install-it-as-an-app)

## Related

- [Deployment](/getting-started/deployment) — the *other* route to browser access: run Codeg headlessly with `codeg-server` or Docker, no desktop required.
- [Privacy & Security](/reference/privacy) — how the access token and your data are handled once the service is exposed.
- [Architecture](/reference/architecture) — the `codeg-server` binary behind both this screen and a standalone deployment.
- [Reference overview](/reference/) — the full 17-screen Settings map.
