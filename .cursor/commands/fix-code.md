---
description: "Apply fixes based on AI code review output"
globs: "**/*.{ts,tsx,js,jsx}"
---

# Command: Fix Code

## Context

This command takes the output of `/review-code` and applies safe, production-ready fixes to the code.

It acts as a **senior engineer implementing review feedback**, not just rewriting blindly.

## Inputs

- Code (file or diff)
- `/review-code` output (issues list)

If review output is missing or incomplete → **STOP** and ask for it.

## Instructions

When this command is triggered:

1. Parse review issues
2. Prioritize by severity: Critical → High → Medium → Low
3. Apply fixes carefully:
   - Fix root cause, not symptoms
   - Preserve existing behavior unless it was incorrect
4. Do **not** introduce new issues
5. Follow all project rules:
   - **Security** (`.cursor/rules/security-mgmt.mdc`): no hardcoded secrets; safe env usage; no logging sensitive data; for SVG/DOM/import/collab/Firebase changes, follow that rule’s verify checklist (DOM sinks, `.excalidraw` restore path, keys, `firebase-project/*.rules` when touched).
   - **Architecture** (`.cursor/rules/excalidraw-architecture.mdc`, `core-library.mdc`, `domain-logic.mdc`, `react-app-module.mdc`): state via `actionManager.executeAction` only (no `dispatch()`); canvas pipeline; **no `excalidraw-app` / Firebase / host-only env imports** inside `packages/excalidraw/**`.
   - TypeScript strictness
   - Code conventions (`.cursor/rules/conventions.mdc`)
6. When fixes touch TypeScript or JavaScript, run **`yarn test:typecheck`** then **`yarn build`** at the project root (workspace `tsc` covers `packages/*`; see `.cursor/skills/build-verify/SKILL.md`). Resolve errors without `@ts-ignore`, `@ts-expect-error`, or `any` used only to silence errors.

## Fix Strategy

### For each issue

- Understand the problem
- Identify minimal safe fix
- Apply change
- Re-check for side effects

### Fix principles

- Prefer minimal, targeted changes
- Avoid large refactors unless required for Critical/High issues
- Maintain readability and consistency with surrounding code
- Add validation or guards where needed
- Improve types where possible

## Output Format (MANDATORY)

### Summary

- What was fixed (short description)

### Applied Fixes

For each fix:

- **Issue Type**: Bug | Security | Performance | Quality | Architecture
- **Location**: file + line (if available)
- **Change**: What was changed
- **Reason**: Why this fix works

### Updated Code

- Provide updated code snippets (only changed parts)
- Use clear before/after format

### Residual Risks

- List anything not fixed (if any)
- Explain why (e.g., requires larger refactor, needs product decision)

## Behavior Rules

- Do **not** ignore Critical or High issues
- Do **not** introduce breaking changes unless required to fix a Critical/High issue (call this out explicitly if so)
- Do **not** rewrite entire files unnecessarily
- Preserve public API unless the review identified it as wrong
- If a fix is ambiguous → ask for clarification before changing behavior

## Safety Constraints

- Never add:
  - `any` (or unsafe assertions used only to silence errors)
  - `@ts-ignore` or `@ts-expect-error` to hide real problems
  - Insecure patterns (`eval`, dynamic code execution on untrusted input, raw concatenated SQL, etc.)
- **Protected files** (`.cursor/rules/do-not-touch.mdc`): never modify without explicit user approval **and** the rule’s three requirements (dependencies understood, full test suite, manual QA):
  - `packages/excalidraw/scene/Renderer.ts`
  - `packages/excalidraw/data/restore.ts`
  - `packages/excalidraw/actions/manager.tsx`
  - `packages/excalidraw/types.ts`
- If a fix would touch a protected file → **STOP** and request approval (do not apply the fix in this command run)
- Maintain strict TypeScript compliance

## How to verify

1. **Input validation**
   - Ensure `/review-code` output is provided
   - If missing → command must not proceed

2. **Fix coverage**
   - All Critical and High issues must be addressed
   - Medium issues should be addressed unless explicitly deferred in **Residual Risks** with rationale

3. **Minimal change principle**
   - Diff should be small and targeted
   - No unnecessary rewrites of unrelated code

4. **Correctness**
   - Fixes resolve the stated issue
   - No new bugs introduced
   - When compiled code changed: **`yarn test:typecheck`** and **`yarn build`** at repo root both succeed (see `build-verify` skill)

5. **Type safety**
   - No `any`, `@ts-ignore`, or `@ts-expect-error` introduced to paper over errors
   - Types improved or preserved

6. **Security compliance** (`.cursor/rules/security-mgmt.mdc`)
   - Fixes do not introduce vulnerabilities, secrets in code, or unsafe DOM/import/collab patterns listed in that rule

7. **Architecture compliance** (`.cursor/rules/excalidraw-architecture.mdc` / `core-library.mdc`)
   - State changes use `executeAction`, not `dispatch()`; no new `excalidraw-app` imports inside `packages/excalidraw/**`
   - No forbidden cross-boundary imports

8. **Protected files check**
   - If protected files would be modified: verify explicit approval exists; otherwise do not change them

9. **Output format**
   - Must include: Summary, Applied Fixes, Updated Code, Residual Risks

10. **Regression safety**
   - Existing behavior preserved unless the review proved it wrong
   - Any intentional behavior change called out explicitly in Summary or **Residual Risks**

## Example usage

- `/fix-code` with `/review-code` output attached
- `/fix-code` on a selected file after pasting the review issues in chat
