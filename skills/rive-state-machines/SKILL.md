---
name: rive-state-machines
description: Builds interactive Rive animations for apps, websites and games, and proves they respond. It covers buttons, toggles, checkboxes, sliders and other UI components; hover, press and tap reactions; state machines with triggers, inputs, listeners and transitions; and view models (data binding) the app sets at run time. Each is then driven in Rive's real runtime and rendered, so a wiring mistake shows before the file ships. Use this skill when the user wants a Rive button or UI component, an animation that reacts to hover, click, tap or app state, a Rive state machine built or fixed, data binding or view models, or asks why a Rive file does not respond.
license: Proprietary. LICENSE in the repository.
compatibility: Needs the Polymation MCP server (`npx -y rivemcp`). Simulation and previews need Chrome, Edge or Playwright's Chromium.
---

# Interactive Rive: state machines and data binding

A file that loads is not a file that responds. Build the interaction, then drive it in the real
runtime and look at it.

## Setup (once)

Add the server to the MCP client configuration, then restart the client:

```json
{ "mcpServers": { "polymation": { "command": "npx", "args": ["-y", "rivemcp"] } } }
```

Run every tool named below through `use_tool` (`name` plus its settings in `arguments`).
`find_tool` with a tool's name shows all its settings. `get_workflow` has step-by-step recipes.

## Fastest routes

- **A ready-made component:** `spawn_ui_component` with `artboard`, `prefab` and `params`. Prefabs
  include button, toggle_switch, checkbox, slider, text_input and progress_bar; `list_ui_prefabs`
  lists all of them. Each comes with its own state machine and inputs.
- **Make an existing shape react:** `add_interaction` with `artboard`, `targetShape` and `pattern`.
  The pattern is `hover`, `press`, `tap` or `hoverPress`. It builds the animations, state machine,
  inputs, listeners and transitions in one call.
- **An existing file:** `load_riv`, then `describe_scene` to see what is inside, edit, and
  `export_riv`. A file still using the old state-machine inputs moves to view models with
  `migrate_to_data_binding`. It checks that the migrated file behaves the same, and returns the
  app-side code changes for each platform.

## By hand

1. `create_project`, then `create_artboard` (with a size), then the shapes. Give every shape a
   `name`: listeners and keyframes find objects by name.
2. One animation per state, with `create_animation` and `add_keyframe`. Pass
   `keyframes: [{frame, value, easing}, …]` to key a whole track in one call. Frames are counted at
   the animation's fps.
3. `create_state_machine`. Then the inputs: `add_trigger`, `add_bool_input`, `add_number_input`.
4. `add_state` for each animation. Then `add_transition` with states **by name**:
   - `from: "entry"`, `to: "Idle"`;
   - `when: "onCondition"` with `conditionInputName`, for a tap;
   - `when: "atEnd"`, to return when a one-shot finishes.

   `when` sets the exit-time flags for you.
5. `add_listener` with `targetShape`, `type` (`enter`, `exit`, `down` or `up`) and `inputName`. It
   turns pointer events into input changes.

## Data binding (view models)

The Rive editor is replacing state-machine inputs with view models: properties the app reads and
sets.
1. `add_view_model`, then `add_view_model_property` for each value (number, boolean, string,
   colour, trigger, enum, image, list).
2. `add_view_model_instance` on the artboard.
3. Bind what they drive with `add_data_bind`.
4. `add_image_slot` makes a picture the app can swap at run time.
5. `verify_data_binding` catches bindings that would never update.

## Prove it responds

- `simulate_state_machine` with `steps`, for example:

  ```
  [{action:'pointerDown', x, y}, {action:'advance', seconds:0.3}, {action:'fireTrigger', input:'tap'}, {action:'advance', seconds:0.5}]
  ```

  It returns the states actually entered and the events fired. Put an `advance` after every change.
- `render_riv` with `stateMachine` and `inputs: [{frame, name, value}]`: see each state.
- `export_web_player`: a page that plays the file in Rive's runtime with the pointer working, for
  the user to try.

## Common traps

- `set_fill` adds a fill. After `load_riv`, `update_fill` changes the one that is there.
- Every layer needs a transition out of `entry`; a layer whose entry leads nowhere plays nothing.
- Reach for an existing tool's settings with `find_tool` before guessing a setting's name.
- If a tool fails or gives a plainly wrong result, offer `report_problem`. It sends nothing until
  the user says yes.
