---
name: polymation
description: Author Rive animations (.riv runtime, .rev editor files) and convert Lottie, dotLottie, After Effects (.aep), Figma and Spline into Rive — or Rive back out — through the Polymation MCP server, verifying every result by rendering it. Use when asked to make, convert, fix or check a Rive animation, bring a Lottie/AE/Figma animation into Rive, or ship an interactive animation for an app, site or game.
---

# Polymation — Rive authoring and conversion

Polymation is an MCP server. This skill tells you how to drive it well. Everything here needs the
server connected; if its tools are not available, set it up first (below).

## Setup (once)

Add to the MCP client configuration, then restart the client:

```json
{
  "mcpServers": {
    "polymation": { "command": "npx", "args": ["-y", "rivemcp"] }
  }
}
```

No account or design app is needed. Finished files use a trial allowance; a key from
polymation.stunning.gg goes in the `POLYMATION_LICENSE_KEY` environment variable.

The server lists three tools. `find_tool` names every tool by area in its description: pass a name for
that tool's settings, or describe the job in plain words to search. `use_tool` runs a tool by name,
with its settings inside `arguments`. `report_problem` is the third (below).
Every tool is reachable this way, so look before deciding something does not exist. `get_workflow`
(run through `use_tool`) returns step-by-step recipes for the common jobs.

For character animation, the art comes from the user's own image or video model — Polymation calls
no model itself. `sprite_art_brief` writes what to ask it; `video_to_sprite` turns a clip into a
looping flipbook; `import_psd_layers` turns a layered PSD into parts for `assemble_character`.

When no tool fits the job, or a tool fails in a way that looks like a bug, offer to tell the
Polymation team with `report_problem`. Ask the user first: the first call only prepares the report
for them to see; a second call with `send` and its reportId sends exactly that report, and only if
they said yes.

## Rule one: look at what you made

A file that loads is not a file that looks right. After every file you produce, render it —
`render_riv` for a frame, `preview_riv_gif` for motion — and look at the image before telling the
user it is done. Previews render with Rive's GPU runtime, the one apps draw with, so soft edges
(feathering) show exactly as they will in the app.

## Converting a file INTO Rive

1. `convert_format` with `sourcePath`, `to: "riv"` (runtime file) or `to: "rev"` (opens in the Rive
   editor). The source format is detected from the bytes; pass `from` only if detection fails.
   Formats: `lottie` (JSON or .lottie), `aep` (read directly — After Effects is not needed), `figma`,
   `splinecode` / `spline`.
2. Read the report. Every decision is `clean`, `reconstructed`, `dropped` or `escalated`. Tell the user
   what was dropped — do not summarise a conversion as lossless when the report lists losses.
3. `escalated` decisions are questions only the user can answer. Ask them, then re-run with
   `resolutions` keyed by the decision id.
4. Check it: `verify_conversion` with `measureVisualFidelity: true` renders the source and the result at
   the same instants and reports how far apart they are; `previewImage: true` on `convert_format` shows
   the result inline.

Out of Rive: the same tool with `to: "lottie"`, `to: "splinecode"` or `to: "figma"`.

## Authoring from scratch

Vector primitives cannot draw organic art well. For characters, creatures or anything painterly, ask
the user for images (or generate them) and use the image pipelines: sprite sheet → flipbook,
one image → rigged character, still image → procedural smoke/fire/glow. Draw with primitives for
icons, UI and geometric motion.

The loop: `create_project` → `create_artboard` (the project itself has no size) → shapes and styles → `create_animation` and `add_keyframe` → a state machine
if it must respond to input → `export_riv` → render and look. `set_feather` softens a fill or stroke
(glow, blur, or with an offset a drop shadow). `simulate_state_machine` drives inputs and reports the
states and transitions, so interactivity can be checked without an app.

## Editing an existing Rive file

`load_riv` opens a `.riv` or `.rev` for editing, and `export_riv` writes it back; a file exported with no
changes comes back byte for byte. A loaded `.rev` is a name-only index — to read its real content (geometry,
keyframes, inputs), convert it: `convert_format` with `to: "riv"`.

## Before you hand it over

- Rendered and looked at it? (`render_riv` / `preview_riv_gif`)
- Interactive? Driven it with `simulate_state_machine`.
- Editor file? `verify_editor_compat` checks the Rive editor will read a `.rev` the way you meant it.
- Converted? Told the user what the report dropped or approximated.
