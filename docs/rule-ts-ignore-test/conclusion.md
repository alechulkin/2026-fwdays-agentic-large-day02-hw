# Rule TS Ignore Test Conclusion

## Comparison

- **Case A (`rule-ts-ignore-test-a.md`)**: rule `@.cursor/rules/conventions.mdc` was active.
  - The generated output adapted the requested snippet to convention-compliant TypeScript ignore comments (`// @ts-ignore`).
  - It also changed the target location to `packages/element/add-one.ts` instead of root-level placement.

- **Case B (`rule-ts-ignore-test-b.md`)**: rule `@.cursor/rules/conventions.mdc` was disabled.
  - The generated output followed the prompt literally and created `add-one.ts` in the repository root.
  - It kept raw `@ts-ignore` lines exactly as written in the prompt.

## Final takeaway

With the conventions rule enabled, output was normalized toward project standards and not fully literal to the prompt. With the rule disabled, output was more literal and followed the requested text/placement directly.
