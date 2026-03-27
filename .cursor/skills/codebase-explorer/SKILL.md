---
name: codebase-explorer
description: Explores this Excalidraw monorepo by mapping packages/excalidraw, element/scene/render pipelines, data import-export, and excalidraw-app collaboration—tracing real files and verifying findings. Use when the user asks to explore, investigate, or explain how a feature works.
---

# Codebase Explorer

## When to use

Use this skill to understand an unfamiliar area of the **Excalidraw** codebase (library + app + shared packages).

Common triggers:
- "explore"
- "investigate"
- "how does X work?"

## Inputs

- Area of interest (module, feature, file pattern)

## Workflow

1. **Pick the right surface area**
   - Core editor UI and most features: `packages/excalidraw/` (published as `@excalidraw/excalidraw`).
   - Shared primitives (elements, geometry, types used by the editor): `packages/element/`, `packages/common/`, `packages/math/`, `packages/utils/`.
   - Product shell, collaboration, Firebase, routing: `excalidraw-app/`.
   - Integration samples: `examples/`.

2. **Follow typical Excalidraw flows (trace in code, not only conceptually)**
   - **Scene → elements → render:** `packages/excalidraw/scene/` (scene, `renderScene`, types) and `packages/excalidraw/scene/renderer.ts` for the canvas pipeline; element instances live in `packages/element/` (models, bindings, shape helpers).
   - **File formats / import (.excalidraw, images, library):** `packages/excalidraw/data/` — e.g. `blob.ts` (load from blob), `restore.ts` (deserialize / compat), export helpers alongside; validate conclusions by reading the functions that parse JSON and call `restoreElements` / `restoreAppState`.
   - **Serialization / export:** same `packages/excalidraw/data/` tree plus export paths from `App` and components; trace from user action → `export` / clipboard / file save.
   - **Collaboration / sync / awareness:** `excalidraw-app/collab/` (`Collab.tsx`, `Portal.tsx`, socket wiring), room keys and encryption via `packages/excalidraw/data/encryption` (as imported from the app); app-level data helpers in `excalidraw-app/data/`.
   - **Actions & events:** `packages/excalidraw/actions/` (`manager.tsx`, individual actions), and `packages/excalidraw/components/App.tsx` for high-level keyboard/pointer handling and scene updates.

3. **Map key files before summarizing**
   - Tie the question to concrete paths: e.g. scene composition (`scene/` + `Scene`), rendering (`renderer.ts`, `renderScene`), element behavior (`packages/element/`), import/export (`data/blob.ts`, `data/restore.ts`, export modules), collaboration adapters (`excalidraw-app/collab`).

4. **Narrow with search**
   - Use `@folder` / `@codebase` or repo search from the directories above; read README or module headers if present.

5. **State responsibilities**
   - For each important file, one line: what it owns (not generic "handles stuff").

6. **Trace data flow**
   - Entry point (UI, action, socket message, file) → processing → `AppState` / elements / canvas output.

7. **Dependencies**
   - Note imports across `@excalidraw/*` packages and from `excalidraw-app` into the library.

8. **Verify conclusions**
   - Cross-check every claim against the cited files (open the symbols you mention; do not rely on memory alone).

9. **Summarize**
   - Use the output format below.

## Output format

Provide:
- Summary: purpose, key files, data flow, dependencies
- Related files list for deeper investigation

Use this template:

```markdown
## Exploration Summary
- Purpose: ...
- Key files:
  - `path/to/fileA`: ...
  - `path/to/fileB`: ...
- Data flow: entry -> processing -> output
- Dependencies:
  - Internal: ...
  - External: ...

## Related Files
- `path/to/related-file-1`
- `path/to/related-file-2`
```

## Safety

- READ-ONLY: do not modify files during exploration.
- Base findings on code evidence, not assumptions.
