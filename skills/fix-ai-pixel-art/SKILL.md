---
name: fix-ai-pixel-art
description: Snaps pixel art made by an image model (ChatGPT, Gemini, Midjourney, Stable Diffusion, Flux) onto a true pixel grid. Blocks that drift in size, soft anti-aliased edges, hundreds of near-identical colours and leftover background become clean 1× pixel art with a real palette and an even outline. A folder of frames or dress-up items lands on one shared grid, and items drawn over a character line up with it exactly. Use this skill when the user has "pixel art" from an AI that looks blurry, off-grid, noisy or too big, wants a sprite cleaned up for a game, needs AI sprites or frames to match each other, or wants to reduce a picture to a limited palette.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`).
---

# Fixing AI "pixel art"

Image models paint pictures that look like pixel art without being it. The blocks are uneven, the
edges are blurred, and one red is forty reds. Games and Rive need the real thing: one colour per
cell, at 1×.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings.

## Snap one picture

1. Run `snap_pixel_art` with `input` (a PNG, JPEG or WebP) and `outputDir`. It measures the block
   size, rebuilds the grid, merges near-identical colours and removes a flat background. It writes
   the picture at 1× plus an enlarged preview.
2. **Look at the preview** beside the original before going on.
3. Adjust only what looks wrong:
   - **Too many colours left:** `colours: 16` (or fewer). `palette: ["#...", …]` maps onto the user's own palette instead.
   - **Single stray pixels inside shapes:** `minCluster: 3` and `clean: true`.
   - **The outline is broken or uneven:** `outline: true` draws one consistent 1-pixel outline in the darkest colour.
   - **Wrong block size**, which is rare: give it as `cell` in the source's pixels.
   - **The figure should be smaller** (a coarser grid than the model drew): `height` in pixels.
   - **A green-screen fringe on the edge:** `keySpill: true`.
   - **Background left behind:** raise `tolerance`. The model should paint on one flat colour the figure doesn't use.

## Many pictures on one grid

- **Frames of an animation, or a set of items:** give `input` as a folder. Every picture is snapped
  on one shared grid and colour set, so they stay consistent. `fps` writes a manifest for a flipbook.
- **An item, pose or face drawn over a character:** first snap the character on its own. Then snap
  each variant with `base` set to the snapped character. Each variant lands exactly on the base:
  - lined up on its floor line;
  - matched by colour;
  - every unchanged pixel set back to the base's own.

  `extract_layer` then lifts the change out as its own layer.

## Getting better input

`sprite_art_brief` with `style: "pixel"` writes prompts for the user's own image model. The prompts
ask for a flat background colour the character lacks, a whole number of pixels per block, and one
figure per image. It never calls a model itself.

## After snapping

- **Into Rive:** add the 1× picture with `add_image_asset`. Pixel art is recognised and drawn crisp
  by itself. Then place it with `add_image` at a whole-number `scaleX`/`scaleY`.
- **To animate the character:** the pixel-character-animation skill rigs it and plays walk, idle
  and more without redrawing frames.
- **To check what the colours became:** `pixel_materials` splits the colours into materials (skin,
  each cloth, metal) and shading levels.

If a tool fails or gives a plainly wrong result, offer `report_problem`. It sends nothing until the
user says yes.
