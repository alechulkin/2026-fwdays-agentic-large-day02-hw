---
name: build-verify
description: Runs yarn build at the project root after code changes. If the build fails, runs pre-fix verification (protected files per do-not-touch.mdc, renderer/restore/collab impact checks) before any auto-fix; stops and reports if that guard fails. Otherwise fixes compilation without ts-ignore or test hacks. Use when the user asks to build, verify, or check compilation, or after edits that might affect compilation.
---

# Skill: Build & Verify

## When to use

After making code changes that might affect compilation.
Triggered by: "build", "verify", "check compilation".

## Inputs

- Changed files (from git diff or conversation context)

## Steps

1. Run `yarn build` in the project root
2. If build succeeds -> report success, list changed files
3. If build fails:
   a. **Pre-fix verification (guard — run before any automated edit):**
      - Compare the failing paths and any planned fixes against **protected files** in `.cursor/rules/do-not-touch.mdc` (`packages/excalidraw/scene/renderer.ts`, `packages/excalidraw/data/restore.ts`, `packages/excalidraw/actions/manager.tsx`, `packages/excalidraw/types.ts`). If fixing the build would require changing a protected file **without explicit user approval**, report that and **stop** — do not apply auto-fixes.
      - Run **Excalidraw-specific impact checks** when errors involve or depend on: the render pipeline (`scene/renderer`), file restore / format compatibility (`data/restore`), or collaboration (`excalidraw-app/collab/`, portal, encryption). Confirm an automated fix is in scope and does not violate those policies; if the check fails or the change is unsafe to automate, report and **stop**.
      - Only when this guard passes, proceed to automated fixes below.
   b. Read error output — identify file, line, error type
   c. Open the file at the error line
   d. Fix the issue (type error, missing import, syntax)
   e. Re-run `yarn build`
   f. Repeat until build passes (max 3 attempts)

## Outputs

- Build status: PASS / FAIL
- List of fixes applied (if any)
- Full build output

## Safety

- **Before** any automatic fix when the build fails: complete **pre-fix verification** (protected-file policy + renderer / restore / collab impact checks). If that verification fails, report and stop — do not edit.
- Do NOT fix errors by adding `@ts-ignore` or `any`
- Do NOT modify test files to fix build errors
- If 3 attempts fail - stop and report to user
