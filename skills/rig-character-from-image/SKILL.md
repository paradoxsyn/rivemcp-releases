---
name: rig-character-from-image
description: Turns one character picture, a layered PSD or a parts sheet into a rigged 2D character in Rive. The picture is cut into parts along its own outlines, joints are placed and a bone skeleton built, meshes are added where parts bend, and it gets an idle animation. A set of walk frames can be fitted to one rig as bone keyframes instead of a flipbook. Use this skill when the user wants to rig or animate an AI-generated or hand-drawn character image, cut a character into body parts, turn a PSD into a Rive character, add bones and mesh deformation to an image, make a still character breathe or sway, or turn sprite frames into a skeletal animation.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`). Previews need Chrome, Edge or Playwright's Chromium.
---

# Rigging a character from a picture

You cannot draw, so the art comes from the user: their own picture, PSD or image model. Your job is
the cut, the skeleton and the motion. Polymation calls no model itself.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings.

## Pick the route by what the user has

**A layered PSD (best):**
1. `import_psd_layers` with `psdPath` and `outputDir`. Each layer becomes a part, or each top-level
   group with `parts: "groups"`.
2. `assemble_character` with `manifestPath`, `partsDir` (the same folder) and `outputPath`.

**A parts sheet:** ask for one with `sprite_art_brief` and `mode: "parts"`. The user's image model
draws the character's parts apart on one sheet. Then follow the brief's follow-up calls.

**One picture:**
1. `figure_regions` with `imagePath` and `outputDir`. It numbers the picture's regions (strokes,
   colour changes, necks). **Look at the numbered picture.**
2. Decide which regions make each part, and whether the part is drawn over its parent (`front`) or
   behind it (`back`).
3. `segment_character` with `imagePath`, `outputDir` and `pieces`, for example:

   ```
   {head:{regions:[0,1,2],side:'front'}, near_arm:{regions:[5],side:'front'}, far_leg:{regions:[9],side:'back'}}
   ```

   Every unnamed region becomes the body. The body is painted in under each front part, and the
   joints are placed where the parts meet.
4. **Look at the picture with the joints ringed.** Give a part a `pivot` where one is off.
5. `assemble_character` with `manifestPath`, `partsDir` and `outputPath`. It adds the bones, meshes
   and an `idle` animation.

**Walk or action frames:** `frames_to_rig` with these settings:
- `framePaths`: frames on one canvas, the character in place;
- `restFrame`: one where the limbs are apart;
- `pieces`: cut as above, by the rest frame's region numbers;
- `outputDir` and `outputPath`.

It cuts the rest frame and poses the rig to draw every frame, giving one file with bone keyframes.
**Look at the fit sheet:** a frame the rig cannot draw needs a pivot, or should stay a flipbook (see
the video-to-sprite-sheet skill).

## Soft bending: hair, tails, cloth, ears

- **On an image:** `auto_mesh_image` traces it into a mesh, and `auto_weight_mesh` builds a bone
  chain and weights every vertex in one call. Pass `boneNames` to bind to bones that already exist.
  The rig keeps the image's position, scale and rotation, so it stays where it was.
- **On a vector outline:** `auto_rig_path` with the `points` and `demoMotion: "wag"`.
- **By hand:**
  - `add_mesh`;
  - `add_skin` on the image;
  - `add_tendon` for each bone;
  - `add_weight` for each vertex.
- **Rigid cut-out parts:** `add_image` with `parentBone` hangs a picture off a bone.

## Check it

- `verify_rig` with the bone names: where the runtime actually put each bone, and IK reach.
- `preview_riv_gif`: watch the idle or the walk.
- Animate further with `create_animation` and `add_keyframe` on bone `rotation` (radians), one
  track per call with `keyframes: [...]`.

Pixel-art characters have their own pipeline, with crisp turns and no blur: the
pixel-character-animation skill.

If a tool fails or gives a plainly wrong result, offer `report_problem`. It sends nothing until the
user says yes.
