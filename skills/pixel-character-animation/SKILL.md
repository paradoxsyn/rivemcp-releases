---
name: pixel-character-animation
description: Rigs a pixel-art character and animates it without redrawing frames. Idle, walk, run, wave, cheer, sit and more come from a built-in library, with outfits, expressions and hand shapes as layers, body types, light direction and colourways. Every frame stays crisp and in the character's own colours. Exports a Rive file — baked frames that play in every Rive runtime, or a live puppet the app poses and dresses at run time — plus PNG frames, sprite sheets, GIFs and a web page. Use this skill when the user has a pixel-art character, avatar or animal (from an image model or drawn by hand) and wants it animated for a game or app, wants a walk cycle or idle for pixel art, dress-up outfits or expressions, a character creator, or a pixel avatar in Rive.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`). Previews need Chrome, Edge or Playwright's Chromium.
---

# Animating a pixel-art character

The pixel puppet cuts a character into bones and poses it the way a pixel artist would. Limbs turn
by RotSprite and tip towards the camera, the head turns, and lines are redrawn where a limb is seen
end on. Only the character's own colours and its shading ramps are used. One animation plays on
every character rigged to the same standard.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings.

## 1. A base the rig can read

The rig wants these things from the picture:
- one figure;
- pixel art at 1×, on transparency;
- facing front, in a relaxed A-pose: arms and legs a little apart from the body, nothing held across it.

To get there:
- **No such picture yet:** `sprite_art_brief` with `mode: "base"` writes the prompt for the user's
  image model. Tell it who the character is with `character`.
- **Made by a model:** run `snap_pixel_art` first. Image-model "pixel art" is off-grid. See the
  fix-ai-pixel-art skill.

## 2. Rig it

Run `pixel_autorig` with `input` (the 1× picture) and `outputDir`. It measures the joints on the
silhouette and fits the 17-bone standard: pelvis, chest, head, clavicles, arms, hands, legs and feet.
It writes:
- `<name>.rig.json`: the **base JSON** every later step takes;
- the figure with each joint ringed;
- a bone map.

**Look at both pictures.** If a joint is off, edit its position in the JSON. Then run
`pixel_autorig` again with `skeleton` set to the JSON, which checks it instead of proposing a new one.
If the figure breaks the A-pose rules, the tool refuses it and names the rule.

An animal seen from the side takes the four-legged template: pelvis, chest, neck, head, the
front_/hind_ legs with `_near`/`_far`, and tail_1…. Give its joints as `skeleton`.

## 3. Check before animating

Run `pixel_review` with `base` (the JSON) and `outputDir`. It checks, bare and dressed:
- that the rest pose rebuilds exactly;
- that each bone is one piece;
- the joints;
- the face.

Then it checks every frame of the library animations for new dark seams, skin showing through
clothes, and pinholes. `viewer.html` shows each flag in place.

## 4. Animate and export

Animations are named straight from the library:
- **people:** idle, wave, cheer, tilt, emote, sit, walk, run;
- **four-legged animals:** walk, idle.

`pixel_animation` with `list: true` shows the library. With `base`, `name` and `preview: true`, it
shows one animation on this character.

- **Plays everywhere** (phones included, no scripts): `pixel_puppet_bake` with these settings:
  - `base`;
  - `animations: ["idle", "walk", "wave"]`;
  - `outputPath`;
  - `framesDir`, for every frame as PNG, a sprite sheet and a GIF per animation;
  - `webPage`, for a page that plays it.

  `outfits` and `bodies` add variants: each animation is baked for each outfit and body type. A
  state machine `Puppet` picks with its `animation` and `variant` inputs. Use `scale` (whole
  pixels) when the file will play in the Canvas2D web runtime, which smooths images.
- **Live, posed and dressed at run time:** `pixel_puppet_live` with `base`, `animations`,
  `outputPath` and `previewImage: true`. The file has inputs for every bone, the face, expression,
  lean, light, outfit and view. The app can also hand it new clothes as PNGs. Building it needs
  Rive's CLI installed (https://rive.app/docs/cli/getting-started); the tool says how if it is
  missing. It runs in Rive's web players 2.44.1 and later with no signing; check native players
  before relying on them.

## Outfits, faces and hands

The user's model draws each change on the base, and these steps make each one a layer.

- **Clothes:**
  1. `sprite_art_brief` with `mode: "item"`, `rig` (the base JSON), `item` and `slot`.
  2. Run `snap_pixel_art` with `base` on the result.
  3. `extract_layer` with `rig`, `slot` (top, bottom, feet, head) and the `variant`.
  4. Put the layer in `outfits: [{ name, layers: [...] }]`.
- **Expressions:** `sprite_art_brief` with `mode: "face"`, then `extract_layer` with `slot: "face"`
  and `expression: "smile"`. The face is added to the base JSON.
- **Hand shapes:** `mode: "hand"`, then `extract_layer` with `slot: "hands"` and `part: "fist"`.
- **Clothes drawn on another character with the same bones:** `pixel_refit` with `from`, `to` and
  `layers`. It carves the clothes to the new body and flags what needs a hand pass. Or give
  `drawnOn` in an outfit, and bake, live and review fit it on the way.

## Before handing it over

- Watched it: the bake's `webPage`, `preview_riv_gif` on the .riv, or the `framesDir` GIFs.
- Ran `pixel_review` on the animations and outfits that ship, and told the user what it flagged.
- If a tool failed or gave a plainly wrong result, offered `report_problem`. It sends nothing until the user says yes.
