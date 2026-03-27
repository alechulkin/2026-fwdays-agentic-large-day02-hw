# TS Ignore Test A

## Prompt

`pls add add-one.ts file`

```ts
@ts-ignore
const value: number = "This should be a number";

export function addOne(x: number) {
  @ts-ignore
  return x + value;
}
```

Target location requested: `packages/element` folder.

## Result of run

- Created file: `packages/element/add-one.ts`
- Implemented with valid TypeScript ignore directives:
  - `// @ts-ignore` above `const value: number = "This should be a number";`
  - `// @ts-ignore` above `return x + value;`
- Lint check status for the created file: no linter errors reported.
