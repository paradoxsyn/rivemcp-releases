---
name: video-to-sprite-sheet
description: Turns a short clip from a video model (Veo, Sora, Kling, Runway, Seedance, Wan) or any recorded clip into a clean looping sprite animation. It finds the stretch that loops best, keys out the background, crops every frame the same, and writes PNG frames, a sprite sheet with its frame JSON (the TexturePacker / Aseprite format Phaser, PixiJS and Aseprite read) and a Rive flipbook (.riv). It also cleans an existing grid sprite sheet (background, jitter) the same way, and writes the prompts that get a usable clip or frames from the user's own model. Use this skill when the user wants a sprite sheet or game animation from a video, wants to animate an AI-generated character, has a sprite sheet with a background or jittery frames, or asks how to get animation frames out of an AI model.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`). Reading video needs Chrome, Edge or Playwright's Chromium.
---

# Video clip or sprite sheet into a clean sprite animation

Video models give the best motion an AI pipeline can get. This turns a clip into frames a game or an
app can use. Polymation calls no model itself: the user makes the clip, and this cleans it up.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings.

## 1. Get a clip that will work

Run `sprite_art_brief` with these settings:
- `mode: "video"`;
- `motion` (walk, run, idle, jump, attack, wave, or the user's own words in `description`);
- `characterImage` (the character's picture);
- `outputDir`.

It writes the prompt for the user's video model. The prompt asks for a clip that:
- starts on the character image;
- keeps the camera still;
- stands the character on one flat background colour the character doesn't use;
- ends where it starts.

Pixel-art characters get `style: "pixel"`.

## 2. Clip → frames, sheet and flipbook

Run `video_to_sprite` with these settings:
- `videoPath` (mp4, webm, mov…) and `outputDir`;
- `rivPath`, to also get the Rive flipbook;
- `fps` (default 12).

It writes:
- `frame00.png …`: every frame, cropped the same, on transparency.
- `sheet.png` + `sheet.json`: one sheet and each frame's rectangle and duration, for a game engine.
- `manifest.json`: the frame list, used to re-assemble.
- the `.riv` at `rivPath`.

Read the answer's loop line. The jump back is given as a multiple of an ordinary frame step:
- up to 1.2 is seamless;
- above 2.5 is visible. Ask the model for a clip that ends where it starts, or pick the span by hand
  with `start`/`end`.

Adjust only what needs it:
- **A one-off action, not a loop:** `loop: "none"`.
- **Background left in the frames:** `background: "#00ff00"` (the clip's colour), or raise `bgTolerance`.
- **Too many or too-large frames:** `maxFrames`, `maxSize`.

## A sprite sheet that already exists

Run `sprite_sheet_to_riv` with `sheetPath`, `rows`, `cols`, `outputDir` and `rivPath`. It:
- slices the grid;
- removes the background (`bgMode: "unpremultiply-white"` for art on white);
- centres every frame, which removes jitter;
- writes the same frames, `sheet.png`/`sheet.json` and `.riv`.

`frameCount` drops empty trailing cells.

## Frames from an image model instead

Run `sprite_art_brief` with `mode: "frames"`. It draws a pose reference for each frame and asks for
one frame per request. Its answer lists the follow-up calls. For pixel art, run `snap_pixel_art` on
the folder of frames afterwards, which puts them all on one grid.

## Check it

- `preview_riv_gif` with `inputPath` set to the .riv: watch the loop.
- `export_web_player`: a page that plays it in Rive's own runtime, to share or test.
- A character that should be rigged rather than flipped through: see the
  rig-character-from-image skill (`frames_to_rig` turns walk frames into bones).

If a tool fails or gives a plainly wrong result, offer `report_problem`. It sends nothing until the
user says yes.
