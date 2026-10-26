# Polymation (rivemcp)

**An MCP server that authors Rive files and converts other animation formats into them — offline, with
no design app and no account.** Your AI assistant describes the animation; Polymation writes the file,
renders it with Rive's own runtime to check it, and reports every decision a conversion had to make.

- **Rive, from scratch** — runtime `.riv` and editor `.rev` (opens in the Rive editor), covering the
  whole runtime: shapes, paths, gradients, feathering, text, images, bones and meshes, keyframes, state
  machines, listeners, view models and data binding, layouts, scripting scaffolding.
- **Conversion into Rive** — Lottie / dotLottie, After Effects `.aep` (read directly, no After Effects
  needed), Adobe Animate `.fla`, Figma (including Figma Motion timelines), Spline and glTF, plus Rive back
  out to Lottie, dotLottie, Spline and Figma. Every conversion comes with a per-decision report — clean, reconstructed, dropped, or needs your
  call — and a rendered comparison against the source's own renderer.
- **Verified, not assumed** — previews, GIFs and conversion checks render headlessly with Rive's GPU
  runtime; state machines can be driven and their transitions read back.
- **AI art into animation** — a clip from your own video model becomes a looping flipbook and a
  sprite sheet a game engine reads; a picture or layered PSD becomes a rigged character; walk frames
  become one rig with bone keyframes; a still gets procedural smoke, fire or glow.
- **Pixel art** — an image model's "pixel art" snapped onto a real grid; pixel characters rigged and
  animated from a library (idle, walk, run, wave, sit…) with outfits, expressions and body types,
  baked for every Rive runtime or posed and dressed live; always drawn crisp.
- **Art over a layout** — block a scene out with shapes and animate it; your own image model paints
  it, and the painting goes back onto the same objects with the animation and interactions kept. In
  3D, models from your image-to-3D generator are placed where the layout had each thing.
- **Agent skills, one per job** — `npx skills add paradoxsyn/rivemcp-releases` offers eight:
  `polymation` (everything), `lottie-to-rive`, `fix-ai-pixel-art`, `video-to-sprite-sheet`,
  `pixel-character-animation`, `rive-state-machines`, `rig-character-from-image` and
  `greybox-to-art`. Add `--skill <name>` for one.

224 MCP tools, reached through two: `find_tool` finds the one for a job and `use_tool` runs it, so an
assistant carries about 2,400 tokens of tool definitions per message instead of 50,000+. A third,
`report_problem`, sends the team a problem report — only one you have seen and agreed to send.

### Format support

| Format | Author | Convert | Status |
|--------|:------:|:-------:|--------|
| **Rive** — `.riv` / `.rev` | ✅ | ↔ Spline, ↔ Lottie, → Figma | Live |
| **Spline** — `.splinecode` / `.spline` | ✅ | ↔ Rive, ↔ Lottie, → Figma | Live |
| **Lottie** — `.lottie` / `.json` | — | ↔ Rive, ↔ Spline, → Figma | Live |
| **Figma** | — | → Rive / Spline / Lottie | Live |
| **After Effects** — `.aep` | edit only | → Rive / Lottie / Spline / Figma | Live |
| **Adobe Animate** — `.fla` / XFL | — | → Rive / Lottie / Spline / Figma | Live |
| **glTF / GLB** — Blender, Maya, Cinema 4D | — | → Spline / Rive / Lottie / Figma | Live |

Every conversion crosses a model boundary, so every one is lossy — the report says what came across
clean, what was reconstructed, what was dropped and what needs your call. After Effects is read
natively (no After Effects install, no plugin) and can be edited and saved back; writing a `.aep`
from scratch is not offered, because without After Effects there is no way to check such a file
would open.

## Quick Start

### Claude Desktop — one click

1. Download **`rivemcp.mcpb`** from the [latest release](https://github.com/paradoxsyn/rivemcp-releases/releases/latest).
2. Claude Desktop → **Settings** → **Extensions** → **Install from file…** and pick it. No Node.js, no JSON.

### Any MCP client (Claude Code, Cursor, Windsurf, VS Code…)

```json
{
  "mcpServers": {
    "polymation": {
      "command": "npx",
      "args": ["-y", "rivemcp"],
      "env": { "POLYMATION_LICENSE_KEY": "your-key" }
    }
  }
}
```

Installing the package downloads the standalone binary for your platform. The licence key is optional
to start: without one, the trial allowance applies. Keys are at
[polymation.stunning.gg](https://polymation.stunning.gg).

### Standalone binaries

Windows, macOS (Intel and Apple Silicon) and Linux builds — no Node.js needed — are on the
[releases page](https://github.com/paradoxsyn/rivemcp-releases/releases/latest).

### Rendering

Previews, GIFs and conversion checks render with Rive's own runtime in a headless Chromium. If a render
tool reports that Chromium is missing, run `npx playwright install chromium` once.

## Licence

Commercial software — see [LICENSE](LICENSE). A trial allowance is included; a key from
[polymation.stunning.gg](https://polymation.stunning.gg) unlocks unlimited use.
