# RiveMCP

MCP server for programmatically creating and editing [Rive](https://rive.app) animation files. Let AI build your animations.

## What is RiveMCP?

RiveMCP exposes **139 MCP tools** that let any AI assistant (Claude, GPT, etc.) create complete Rive animations from natural language. Describe what you want, and the AI builds it — shapes, colors, animations, state machines, physics, and more — then exports a `.riv` file you can use in your app or a `.rev` file you can open in the Rive Editor.

## Quick Start

### Install via npm (recommended)

```bash
npm install -g rivemcp
```

This automatically downloads the correct binary for your platform. No Node.js runtime needed at execution time.

### Configure your AI client

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "rivemcp": {
      "command": "npx",
      "args": ["-y", "rivemcp"]
    }
  }
}
```

**Claude Code:**
```bash
claude mcp add rivemcp -- npx -y rivemcp
```

**Cursor / VS Code (settings.json):**
```json
{
  "mcp.servers": {
    "rivemcp": {
      "command": "npx",
      "args": ["-y", "rivemcp"]
    }
  }
}
```

### Manual install (alternative)

Download the binary for your platform from [Releases](https://github.com/paradoxsyn/rivemcp-releases/releases):

| Platform | Binary |
|----------|--------|
| Windows x64 | `rivemcp-win-x64.exe` |
| Linux x64 | `rivemcp-linux-x64` |
| macOS Intel | `rivemcp-macos-x64` |
| macOS Apple Silicon | `rivemcp-macos-arm64` |

```bash
chmod +x rivemcp-macos-arm64
# macOS only — remove quarantine:
xattr -d com.apple.quarantine rivemcp-macos-arm64
```

Then point your MCP client at the binary path directly.

### 4. Start creating

Ask your AI to create animations:

> "Create a bouncing ball animation with a blue gradient background"

> "Build a loading spinner with 3 dots that pulse in sequence"

> "Make a button that changes color on hover with a state machine"

The AI will use RiveMCP's tools to build the animation, then export a `.riv` file.

## Features

### Shapes & Styling
Rectangles, ellipses, triangles, polygons, stars, custom vector paths. Solid fills, gradient fills, strokes, dash paths, trim paths, feathering, blend modes.

### Animation
Keyframe animations with linear, cubic, and elastic interpolation. Animate any property — position, size, rotation, scale, opacity, color.

### State Machines
Interactive animations with triggers, boolean and number inputs, transitions with conditions, listeners for pointer events.

### Physics (HLAPI)
Bake realistic physics into keyframes at compile time — gravity, bounce, wind, spring forces. No runtime physics engine needed.

### Prefabs & Particles
Spawn shapes from templates (rocks, dust clouds, sparks, rain, snow, bubbles). Emit particle systems with physics.

### Scene Composition
Describe an entire scene in one call — backgrounds, shapes, motion, timing — and get a complete `.riv` file.

### Text & Fonts
Rich text with multiple runs, custom fonts, text modifiers, follow-path text.

### Images & Assets
Embed images, audio, Lottie animations, and SVGs. Mesh deformation for image warping.

### Bones & Skinning
Skeletal animation with bones, IK constraints, skins, and tendons.

### Nested Artboards
Reusable components via nested artboards with animation and state machine control.

### Data Binding
ViewModels with typed properties, instances, data converters, and formula tokens.

### Import & Roundtrip
Load existing `.riv` files, modify them, and re-export. Lossless roundtrip for unmodified content.

### Rive Editor Export
Export `.rev` files that open directly in the Rive Desktop Editor for further manual editing.

## Tool Categories

| Category | Tools | Description |
|----------|-------|-------------|
| Project | 3 | Create projects, artboards, list objects |
| Shapes | 8 | Rectangles, ellipses, triangles, polygons, stars, paths |
| Styling | 10 | Fills, strokes, gradients, dash/trim paths, feathering |
| Animation | 3 | Keyframes with cubic/elastic interpolation |
| State Machine | 10 | Inputs, states, transitions, conditions, listeners |
| Text | 8 | Text objects, runs, fonts, modifiers |
| Images | 3 | Image assets, embedding, mesh deformation |
| Bones | 6 | Skeletal animation, IK constraints, skinning |
| Nested | 6 | Nested artboards, animations, state machines |
| Events | 3 | Custom events, open URL events, properties |
| Data Binding | 12 | ViewModels, instances, converters, bindings |
| Advanced | 40+ | Layout, scroll, audio, scripting, N-slice, and more |
| HLAPI | 10 | Physics, prefabs, particles, scene composition |
| Sprite | 5 | Sprite sheet slicing, background removal, normalization |
| Import/Export | 2 | Load `.riv` files, export `.riv` or `.rev` |
| Edit | 3 | Update, remove, and inspect objects |

## Licensing

RiveMCP includes **3 free exports** per machine. After that, a license key is required.

Get a license at [rivemcp.stunning.gg](https://rivemcp.stunning.gg)

Set your key:
```bash
export RIVEMCP_LICENSE_KEY=your-key-here
```

## Requirements

- No dependencies — standalone binary, no Node.js required
- Works with any MCP-compatible client (Claude Desktop, Claude Code, Cursor, VS Code, etc.)
- macOS, Windows, or Linux

## Links

- [Website](https://rivemcp.stunning.gg)
- [Releases](https://github.com/paradoxsyn/rivemcp-releases/releases)
- [Rive](https://rive.app)
