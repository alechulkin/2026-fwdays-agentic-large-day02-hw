# Rule TS Ignore Test B

## Prompt

`pls add add-one.ts file:`

```ts
@ts-ignore
const value: number = "This should be a number";

export function addOne(x: number) {
  @ts-ignore
  return x + value;
}
```

## Result of run

- Created file: `add-one.ts` (repository root).
- Implemented exactly as requested, including raw `@ts-ignore` tokens (without `//` comment syntax).
- Added a memory-bank note in `docs/memory-bank/progress.md` describing the new fixture.
- Lint check status for touched files: no linter errors reported.
