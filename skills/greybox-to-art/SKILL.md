---
name: greybox-to-art
description: Makes animations and 3D scenes with real art when there is no art to start from. The agent blocks the scene out with plain named shapes and animates it (a greybox). The user's own image model paints over a render of it, and the painting goes back onto the same objects. In 2D the result is a Rive file whose keyframes, state machine and listeners drive the painted art. In 3D each kind of thing gets a picture for an image-to-3D generator (Tripo, Meshy, Hunyuan3D, TRELLIS), and the models are placed where the greybox had them in one Spline scene. Use this skill when the user wants an illustrated or painted animation, scene, game screen or 3D diorama and has no artwork, when vector shapes would look like programmer art, or when they ask to restyle, repaint or skin a blocked-out layout.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`) and the user's own image model (ChatGPT, Gemini or any other that takes an attached picture).
---

# Greybox to art

An agent cannot draw, but it can lay a scene out exactly: where every thing is, how big, what
moves and what reacts. An image model can paint, but it cannot hold a layout or a timeline. This
workflow gives each side its job. The agent builds the greybox, the image model paints over a render
of it, and Polymation cuts the painting back into the greybox's own objects. In 2D, every keyframe
and state machine the agent wrote now drives painted art.

Polymation never calls a model itself. It writes the prompts and the guide picture; the user runs
them in their own image model and brings the pictures back.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings. `get_workflow` has both routes as recipes.

## 2D: block it out

The greybox decides everything the painting can be cut into, so build it with that in mind.

1. `create_project`, then `create_artboard` at the size the result will play at.
2. **A setting first:** a rectangle the size of the artboard, named for what it is ("sky",
   "kitchen", "background"). It becomes the backdrop and takes everything behind the objects.
3. **One shape or group per thing, named for what it is:** "oak_tree", "cottage", "fox". Use
   `add_rectangle`, `add_ellipse`, `add_triangle` and `add_path`, and `create_group` for a thing
   made of several shapes. Names reach the prompt, so a clear name is a better painting.
4. **Block each thing in its own flat colour**, roughly the colour it should be (green for leaves,
   brown for wood). The model reads colour as a hint. Two neighbours in the same grey can merge.
5. **A piece that moves on its own inside a thing gets its own name:** a door that swings, an arm
   that waves, a blinking eye. List those names later as `parts`.
6. **Texts stay texts.** `add_text` text is left out of the painting and stays live in the result,
   sharp and bindable.
7. **Animate and wire it now:** `create_animation`, `add_keyframe`, `create_state_machine`,
   `add_listener`. The painted result keeps all of it.
8. `render_riv` and **look at the layout** before going on.

## 2D: the brief

Run `greybox_brief` with:
- `style`: the look, in words an image model follows, for example "a cosy watercolour storybook
  town", "clean flat vector UI, pastel", "16-bit pixel art".
- `outputDir`.
- `describe`: what each object is, by name, when the name does not say it, for example
  `{"fox": "a red fox sitting, tail curled"}`.
- `parts`: the moving pieces inside objects.

It renders every object's exact outline in Rive's own runtime and returns two pictures: the guide,
and each object named over it. **Look at both.** Something merged or missing there will be merged or
missing in the result.

Show the user the brief and the guide. Its steps:
1. **The painting:** attach greybox.png and use the prompt as written. Save the result as
   painted.png in the folder.
2. **Own pictures, only when the brief lists any.** These are things partly hidden behind something
   that moves, or a backdrop something moves in front of. Each is painted alone, from its own guide,
   in the painting's style. Skipping one works: the hidden part is filled from the thing's own
   colours, and shows as a smooth patch when it is uncovered.

## 2D: put the painting on

Run `greybox_apply_art` with `plan` (the folder) and `art` (the painting). It:
- fits the painting onto the guide, because models shift and rescale it a few per cent;
- cuts each object out starting from its known outline, keeping what the painting added at the
  edges, such as a fuller tree crown;
- puts each object's art on its own node, so keyframes, state machines and listeners act on the art;
- returns the painting beside the result at rest, with how many pixels differ.

**Look at that comparison**, then `preview_riv_gif` to see it move. To ship it, use `export_riv`, or
`export_web_player` for a page.

Reading its notes:
- **A low share for an object** means the model moved, reshaped or merged it. Ask the model again
  with the same guide: "Keep every thing exactly where the shapes in the guide are."
- **An object mostly painted in** was mostly hidden. If it, or what covers it, moves, give it its
  own picture.
- **A note that a key cannot be followed:** a picture cannot follow a key on a shape's colour, size
  or path. Keep that piece as a shape, or animate its place, turn, scale and opacity instead.

## 3D: block it out and place generated models

1. `generate_spline_scene` with one mesh or group per thing, each named for what it is. Things that
   repeat are numbered, such as house_1 and house_2, and share one model. The ground is a flat cube;
   flat things are coloured from the painting and never sent to a 3D generator. A greybox from
   Blender works too: export it as a .glb.
2. `greybox_brief` with `source` (the .splinecode or .glb), `style`, `outputDir`, `describe` (by
   name or by kind) and `view` (where the camera looks from; the final scene opens on this view).
3. The user paints the guide, then paints one picture of each kind of thing from its front-view
   guide, in the painting's style, as the brief asks.
4. `greybox_apply_art` with `plan` and `art` writes models/<kind>-input.png for each kind: the thing
   alone on a transparent background. The user gives each one to an image-to-3D generator and saves
   the textured GLB as models/<kind>.glb.
5. `greybox_place_models` with `plan` and `outputPath`:
   - each model is scaled to its grey form's box, centred over it and stood on its floor;
   - the node keeps its name, place, states and events, so whatever moved it moves the model;
   - it returns the greybox beside the placed scene from the same camera. **Look at it.**

If a model sits wrong, it usually faces another way than its picture or is a different thing. The
note names the object. Regenerate that model, or turn its node.

## What to tell the user

- They run the image model and the 3D generator; Polymation never sends their pictures anywhere.
- One painting covers the whole scene. Own pictures and model pictures are short follow-ups.
- The result keeps the greybox's timing and interactivity exactly. To change only the motion, edit
  the greybox's animation and run the brief again: the layout at rest is the same, so the same
  painting applies. Moving or resizing things at rest needs a new painting.
