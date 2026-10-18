// Shared release helpers, used by both the build-time data loader
// (.vitepress/data/release.data.js) and the client-side <Download> component.
// Keeping the asset-matching in one place means the baked build-time data and
// the live client refresh always agree.

export const REPO = 'spacering-net/codeg'
export const RELEASES_URL = `https://github.com/${REPO}/releases/latest`
export const releaseNotesUrl = (v) => `https://github.com/${REPO}/releases/tag/v${v}`

const dl = (v, name) => `https://github.com/${REPO}/releases/download/v${v}/${name}`

// Match a GitHub release asset filename to a platform slot. Ordered, anchored
// patterns so signature files (`.sig`) and server bundles never match.
const PATTERNS = {
  macApple: /_aarch64\.dmg$/,
  macIntel: /_x64\.dmg$/,
  winX64: /_x64-setup\.exe$/,
  winArm64: /_arm64-setup\.exe$/,
  linuxAppImage: /_amd64\.AppImage$/,
  linuxDebX64: /_amd64\.deb$/,
  linuxRpmX64: /\.x86_64\.rpm$/,
  linuxDebArm64: /_arm64\.deb$/,
  linuxRpmArm64: /\.aarch64\.rpm$/,
}

// Turn a GitHub "latest release" API payload into { version, date, assets }.
// Returns null if it doesn't look like a desktop release so callers fall back.
export function pickDownloads(release) {
  if (!release || !release.tag_name || !Array.isArray(release.assets)) return null
  const version = release.tag_name.replace(/^v/, '')
  const date = (release.published_at || '').slice(0, 10)
  const assets = {}
  for (const [key, re] of Object.entries(PATTERNS)) {
    const hit = release.assets.find((a) => re.test(a.name))
    if (hit) assets[key] = hit.browser_download_url
  }
  if (!Object.keys(assets).length) return null
  return { version, date, assets }
}

// Known-good snapshot so the page renders real links even when the build (or
// the browser) can't reach GitHub. Bumped whenever docs are refreshed.
const V = '0.37.0'
export const FALLBACK = {
  version: V,
  date: '2026-10-18',
  assets: {
    macApple: dl(V, `codeg_${V}_aarch64.dmg`),
    macIntel: dl(V, `codeg_${V}_x64.dmg`),
    winX64: dl(V, `codeg_${V}_x64-setup.exe`),
    winArm64: dl(V, `codeg_${V}_arm64-setup.exe`),
    linuxAppImage: dl(V, `codeg_${V}_amd64.AppImage`),
    linuxDebX64: dl(V, `codeg_${V}_amd64.deb`),
    linuxRpmX64: dl(V, `codeg-${V}-1.x86_64.rpm`),
    linuxDebArm64: dl(V, `codeg_${V}_arm64.deb`),
    linuxRpmArm64: dl(V, `codeg-${V}-1.aarch64.rpm`),
  },
}
