---
name: build-verify
description: Runs workspace TypeScript (`yarn test:typecheck` / root `tsc`) for `packages/*` and the app, then `yarn build`. If a step fails, runs pre-fix verification (protected files per do-not-touch.mdc, renderer/restore/collab impact checks) before any auto-fix. Use when the user asks to build, verify, or check compilation, or after edits that might affect compilation.
---

# Skill: Build & Verify

## When to use

After making code changes that might affect compilation.
Triggered by: "build", "verify", "check compilation".

## Inputs

- Changed files (from git diff or conversation context)

## Steps

1. **Workspace TypeScript (required):** Run `yarn test:typecheck` at the project root. This runs `tsc` with `noEmit` using the root `tsconfig.json`, which **includes `packages/*` and `excalidraw-app`**. If `tsc` reports **any** error in a package or the app, the run is **FAIL** — do **not** report overall PASS until typecheck is clean.
2. **App build:** Run `yarn build` in the project root (delegates to `excalidraw-app`). If it fails, the run is **FAIL** unless fixed.
3. **Overall PASS** only when **both** step 1 and step 2 succeed; list changed files and summarize outputs.
4. If **typecheck** or **build** fails, run **pre-fix verification (guard) once** before **any** edit or retry loop:
   - Compare failing paths and plausible fixes against **protected files** in `.cursor/rules/do-not-touch.mdc` (`packages/excalidraw/scene/Renderer.ts`, `packages/excalidraw/data/restore.ts`, `packages/excalidraw/actions/manager.tsx`, `packages/excalidraw/types.ts`).
   - If the **only** reasonable fix (or any fix you would apply) touches a protected file **without explicit prior user approval** for that edit: report **once** (which file, why build fails, that protected paths block auto-fix) and **terminate the skill** — **no** automated edits, **no** retry loop, **no** repeated approval prompts in later “attempts.”
   - Run **Excalidraw-specific impact checks** when errors involve the render pipeline (`scene/Renderer.ts`), restore (`data/restore`), or collaboration (`excalidraw-app/collab/`, portal, encryption). If automated fix is out of scope or unsafe, report **once** and **terminate** — same rules: **no** retry loop for permission.
   - **Only if** the guard passes (fix can be done outside protected files and within policy), enter the **fix attempt loop** below — **at most 3** full cycles of edit → `yarn test:typecheck` → `yarn build`.
5. **Fix attempt loop** (runs **0–3** times; only after step 4 guard passed):
   a. Read error output — file, line, error type  
   b. Open the file at the error line  
   c. Apply a minimal fix (type error, missing import, syntax) — **never** edit a protected file in this loop unless the user has **already** explicitly approved changing that path in this session.  
   d. Re-run `yarn test:typecheck` and `yarn build`.  
   e. If either still fails and fewer than **3** attempts have been used, repeat from (a). After **3** failed attempts, stop and report — **do not** add a fourth attempt or re-ask for approval in a loop; give one final summary for the user.

## Outputs

- Typecheck status: PASS / FAIL (`yarn test:typecheck`)
- Build status: PASS / FAIL (`yarn build`)
- List of fixes applied (if any)
- Full `tsc` and build output

## Safety

- **Before** any automatic fix when **typecheck** or **build** fails: complete **pre-fix verification** (protected-file policy + renderer / restore / collab impact checks). If that verification fails, report **once** and stop — **do not** edit, **do not** start the 3-attempt loop, **do not** repeatedly ask for approval across phantom “attempts.”
- **Protected files:** This skill **never** applies “try again until user approves” behavior. Either the user has **already** explicitly approved editing a listed path, or protected files stay untouched — including on attempts 2 and 3.
- **Bounded loop:** At most **three** fix cycles (edit + typecheck + build). No nested loops, no infinite re-prompts. After three failed cycles, stop with a final report.
- Do NOT fix errors by adding `@ts-ignore` or `any`
- Do NOT modify test files to fix build errors
