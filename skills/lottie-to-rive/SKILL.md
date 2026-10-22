---
name: lottie-to-rive
description: Converts Lottie animations (bodymovin .json, dotLottie .lottie, LottieFiles downloads), After Effects projects (.aep, read directly without After Effects), Adobe Animate files (.fla) and Figma frames into Rive — a .riv for apps and websites, or a .rev that opens in the Rive editor — offline, without a Rive Enterprise plan, and Rive back out to Lottie. Every conversion comes with a report of what carried, what was rebuilt and what was lost, and can be measured against the source frame by frame. Use this skill when the user wants a Lottie, bodymovin, LottieFiles, After Effects, Animate or Figma animation in Rive, asks to import a Lottie into Rive, to batch-convert a folder of Lotties, to move a project from Lottie to Rive, or to check what a conversion lost.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`). Previews need Chrome, Edge or Playwright's Chromium.
---

# Lottie, After Effects, Animate and Figma into Rive

Rive's own Lottie import is for Enterprise plans only. Polymation converts on the user's machine,
with no account and no design app open.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

The server lists `find_tool` and `use_tool`. Run every tool named below through `use_tool`
(`name` plus its settings in `arguments`). `find_tool` with a tool's name shows all its settings.

## One file

1. **Convert.** Run `convert_format` with these settings:
   - `sourcePath`: the file.
   - `to`: `"riv"` for apps and the web, or `"rev"` to open and keep editing in the Rive editor.
   - `outputPath`: where to write the result.
   - `previewImage: true`, to see the result inline.

   The format is detected from the bytes. Where each kind of source comes from:
   - **Lottie and dotLottie:** the `.json` or `.lottie` file as it is.
   - **After Effects:** the `.aep` itself. If footage is missing, pass the folders it lives in as `assetSearchPaths`.
   - **Adobe Animate:** the `.fla`, or an uncompressed XFL folder.
   - **Figma:** first run `import_figma` with the link (`url`) and a personal access token (`token` or the `FIGMA_TOKEN` environment variable). Then run `convert_format` with `from: "figma"` on the saved file.
2. **Read the report.** Every decision is one of four kinds:
   - `clean`: it carried over as it was.
   - `reconstructed`: it was rebuilt from Rive's own parts.
   - `dropped`: it was lost.
   - `escalated`: a question only the user can answer.

   Tell the user what was dropped. Never call a conversion lossless when the report lists losses.
3. **Answer escalations.** Ask the user each question. Then run again with `resolutions`, keyed by each question's decision id.
4. **Measure it.** Run `verify_conversion` with `sourcePath`, `to: "riv"` and `measureVisualFidelity: true`. It renders the source and the result at the same moments and reports how far apart they are.
5. **Look at it.** Run `preview_riv_gif` with `inputPath` set to the result, and watch it before calling it done.

## A whole folder

Run `convert_format` with these settings:
- `sourceDir`: a folder of `.json`, `.lottie` or `.zip` files. `recursive: true` also searches sub-folders.
- `to: "riv"` and an `outputDir`.
- `measureFidelity: true`.

Each file gets its .riv and a ledger. `batch-report.md` ranks the files by how far they drifted, so
you can check the worst ones first.

## Making it interactive

A Lottie only plays; a Rive file can also respond. Two optional additions, both recorded in the
report as inferred rather than converted:
- `upgrade: { stateMachine: true }` adds a state machine: an idle loop, hover and press states, and
  a trigger for each named marker.
- `upgrade: { viewModel: true }` turns the solid colours and the text into properties the app can
  set.

After converting, the rive-state-machines skill or `add_interaction` wires up more.

## Back out of Rive

Run `convert_format` on a `.riv` or `.rev` with `to: "lottie"`, `"dotlottie"`, `"splinecode"` or
`"figma"`. `listArrows: true` lists every supported route, with what each one can't carry.

## Before handing it over

- Watched it with `preview_riv_gif`.
- Told the user what the report dropped or approximated, with the fidelity figure if you measured one.
- Checked a `.rev` with `verify_editor_compat`, which confirms the Rive editor will read it as intended.
- If a tool failed or gave a plainly wrong result, offered `report_problem`. It sends nothing until the user says yes.
