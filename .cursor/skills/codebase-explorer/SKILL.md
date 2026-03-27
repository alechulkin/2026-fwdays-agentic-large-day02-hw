---
name: codebase-explorer
description: Explores unfamiliar areas of a repository by identifying relevant files, mapping responsibilities, tracing data flow, and summarizing dependencies. Use when the user asks to explore or investigate the codebase, or asks how a feature/module works.
---

# Codebase Explorer

## When to use

Use this skill to understand an unfamiliar area of the codebase.

Common triggers:
- "explore"
- "investigate"
- "how does X work?"

## Inputs

- Area of interest (module, feature, file pattern)

## Workflow

1. Identify relevant directories/files using `@folder` or `@codebase` references.
2. Read README files or top-level comments in the target area first.
3. Map key files and state each file's responsibility.
4. Trace data flow from entry point -> processing -> output.
5. Identify dependencies, especially imports from other packages/modules.
6. Verify conclusions against actual code evidence.
7. Produce a concise exploration summary.

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
