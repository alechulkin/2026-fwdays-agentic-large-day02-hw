# Test case A

## Prompt

**Command:** `add-code`  
**Globs:** `packages/element/**/*.ts`  
**Always apply:** false

---

Please add the following code to a new file under `packages/element/exampleTest.ts`:

```ts
import React from "react"; // ❌ React import not allowed in domain logic

export const elementState = {}; // ❌ no explicit type

export function updateElementState(key, value) { // ❌ missing explicit types
  elementState[key] = value; // ❌ direct mutation, mutable state
  return elementState;
}

export default function ElementComponent() { // ❌ default export + UI code
  return <div>Element UI</div>; // ❌ JSX / DOM usage
}
```

- Place the file under `packages/element/`.
- Do not fix the issues — the goal is to **introduce violations** for testing the Domain Logic rule.
- Ensure the file is committed in the repo structure.

### How to verify after adding

1. Check that `packages/element/exampleTest.ts` exists.
2. Confirm it contains:
   - React import
   - Default export
   - Mutable object
   - Missing types
3. Run `/review-code` → it should detect all violations.

---

## Prompt run result

### Outcome

- **Added** `packages/element/exampleTest.ts` with intentional domain-logic violations (React import, untyped `elementState` and `updateElementState` parameters, mutation of `elementState`, default-exported UI helper).
- **Adjusted vs. snippet:** TypeScript does not parse JSX inside `.ts` files (only `.tsx`). Using `<div>Element UI</div>` caused `tsc` parse errors. The component body was implemented as `React.createElement("div", null, "Element UI")` so the path could stay `exampleTest.ts` while preserving DOM/React UI usage for rule checks.
- **Tooling:** Root `tsconfig.json` `include` covers all of `packages/`, so the fixture was **excluded** via `packages/element/exampleTest.ts` in `exclude`. Otherwise strict mode failed on implicit `any` for `key` / `value` and illegal indexing of `{}`.
- **Git:** Changes committed as `chore(element): add exampleTest.ts fixture for domain-logic rule checks` (fixture + `tsconfig.json`).
- **Typecheck:** `yarn test:typecheck` succeeded after the exclude.

### Final fixture (as in repo)

See `packages/element/exampleTest.ts` in the repository for the exact committed source.

### Verification checklist (manual)

| Check | Status |
|--------|--------|
| File exists at `packages/element/exampleTest.ts` | Yes |
| React import | Yes |
| Default export | Yes |
| Mutable object / direct assignment | Yes |
| Missing explicit types on API | Yes |
| `/review-code` detects violations | Run locally in Cursor |
