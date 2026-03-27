---
description: "Run full AI code review with scoring and actionable fix suggestions"
globs: "**/*.{ts,tsx,js,jsx}"
---

# Command: Review Code

## Context

This command performs a full senior-level code review of the selected code or diff.

## Instructions

When this command is triggered:

1. Analyze the provided code (or git diff if available)
2. Enforce project rules (cite `.cursor/rules/*` when flagging issues):
   - **`.cursor/rules/do-not-touch.mdc`:** If the diff touches `Renderer.ts`, `restore.ts`, `manager.tsx`, or `types.ts` under `packages/excalidraw/` as listed there, flag as **High** unless the review context shows explicit approval and test/QA plan.
   - **`.cursor/rules/security-mgmt.mdc`:** Flag new secrets in code, logging of tokens/keys, unsafe `innerHTML` / `dangerouslySetInnerHTML` with untrusted data, bypass of validated `.excalidraw` restore, collaboration key leakage, or permissive Firebase rule edits without rationale.
   - **`.cursor/rules/excalidraw-architecture.mdc`:** Flag `dispatch()` on the action manager, Redux/Zustand for editor state, drawing via React DOM instead of canvas pipeline, new npm deps without approval, or **library code importing `excalidraw-app`** / app-only env.
3. Perform a structured review across:
   - Correctness (bugs)
   - Security
   - Performance
   - Code quality
   - Architecture
   - **Mandatory Excalidraw domain checks** (reviewers must validate these when the change touches Excalidraw-related code; cite the check identifier in findings when applicable):
     - **check_excalidraw_file_import**: Verify safe import and restore of `.excalidraw` files; disallow or flag unsafe external references (URLs, embedded resources, or paths that could leak data or execute unintended loads).
     - **check_scene_renderer_changes**: Flag any changes touching scene or renderer modules for visual and regression review (render pipeline, canvas output, export parity).
     - **check_collaboration_encryption_impact**: Require explicit review of collaboration and encryption-related code paths (sync, presence, E2E, key handling) when those areas are modified or depended on.
     - **check_i18n_ui_texts**: Ensure any UI text added or changed uses i18n keys and includes or updates translations (no hardcoded user-visible strings in components that should be localized).
     - **Completeness**: For Excalidraw-related changes, the structured review is incomplete unless **check_excalidraw_file_import**, **check_scene_renderer_changes**, **check_collaboration_encryption_impact**, and **check_i18n_ui_texts** have each been considered and noted (pass, issue, or not applicable with brief rationale).
4. Identify all relevant issues
5. Suggest concrete fixes for each issue
6. Assign scores per category (1–10)
7. Provide a final verdict

## Output Format (MANDATORY)

### Summary

- Short overall assessment (2–4 sentences)

### Issues

For each issue:

- **Type**: Bug | Security | Performance | Quality | Architecture
- **Severity**: Low | Medium | High | Critical
- **Location**: file + line (if available)
- **Description**: What is wrong
- **Impact**: Why it matters
- **Fix**: Concrete fix (code snippet or clear instruction)

### Scores

- Correctness: X/10
- Security: X/10
- Performance: X/10
- Code Quality: X/10
- Architecture: X/10

### Verdict

- APPROVE
- REQUEST_CHANGES
- COMMENT

## Behavior Rules

- Do NOT approve code with unresolved Medium+ issues
- Always provide actionable fixes (no vague feedback)
- Prioritize high-impact issues over style
- Be concise but precise
- Think like a senior engineer reviewing production code

## Optional Enhancement (if diff is provided)

- Focus only on changed lines
- Detect regressions
- Highlight breaking changes

## How to verify

Steps **9–12** use the same identifiers as the Mandatory Excalidraw domain checks in **Perform a structured review** (Instructions, step 2); reviewers validating an Excalidraw-related change must confirm each applicable check.

1. **Command execution**
   - Run `/review-code` on a file or diff
   - Ensure output follows the required structure

2. **Output structure**
   - Must include: Summary, Issues, Scores, Verdict
   - Missing section → failure

3. **Issue completeness**
   - Each issue must include:
     - Type
     - Severity
     - Location (file + line when available)
     - Description
     - Impact
     - Fix
   - Missing any field → invalid review

4. **Scoring integrity**
   - Scores must reflect actual issues
   - Critical issue in a category → that category's score must be ≤5

5. **Verdict logic**
   - APPROVE → no unresolved Medium+ issues
   - REQUEST_CHANGES → any unresolved Medium+ issue exists
   - COMMENT → only Low-severity / minor improvements, no blocking issues

6. **Fix quality**
   - Each issue includes a concrete fix (code or clear instruction)
   - No vague suggestions

7. **Security coverage** (align with `.cursor/rules/security-mgmt.mdc`)
   - Input validation; injection; secrets exposure
   - SVG/XML/DOM sinks; `.excalidraw` restore path; collaboration keys; Firebase rules if changed

8. **Architecture awareness** (align with `.cursor/rules/excalidraw-architecture.mdc` and `core-library.mdc`)
   - Module boundaries respected; state updates via `actionManager.executeAction`, not `dispatch()`
   - No forbidden dependencies; no `excalidraw-app` imports from `packages/excalidraw/**`

9. **check_excalidraw_file_import** (mandatory for import/restore/file-format changes)
   - Confirm `.excalidraw` import and restore paths reject or sanitize unsafe external references.
   - Failure: unvalidated external URLs, arbitrary file paths, or restore logic that could execute unintended content.

10. **check_scene_renderer_changes** (mandatory when diff touches `packages/excalidraw/scene/` or `Renderer.ts` / renderer pipeline)
    - Confirm visual or regression impact is called out; suggest snapshot or manual canvas checks when relevant. If the diff modifies a **do-not-touch** file (`Renderer.ts`, etc.), require explicit approval + tests/QA per `.cursor/rules/do-not-touch.mdc`.

11. **check_collaboration_encryption_impact** (mandatory when diff touches collaboration or crypto)
    - Confirm collaboration and encryption paths are explicitly reviewed (sync, keys, transport); flag missing threat or compat notes.

12. **check_i18n_ui_texts** (mandatory when diff adds or changes user-visible UI copy)
    - Confirm strings use the project i18n mechanism and that keys/translations exist or are called out as follow-up.

## Example usage

- `/review-code` on selected file
- `/review-code` on PR diff
