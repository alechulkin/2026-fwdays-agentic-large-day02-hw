# AGENTS.md

## Project Structure

Excalidraw is a **monorepo** with a clear separation between the core library and the application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples (NextJS, browser script)

## Development Workflow

1. **Package Development**: Work in `packages/*` for editor features
2. **App Development**: Work in `excalidraw-app/` for app-specific features
3. **Testing**: Always run `yarn test:update` before committing
4. **Type Safety**: Use `yarn test:typecheck` to verify TypeScript

## Development Commands

```bash
yarn test:typecheck  # TypeScript type checking
yarn test:update     # Run all tests (with snapshot updates)
yarn fix             # Auto-fix formatting and linting issues
```

## Architecture Notes

### Package System

- Uses Yarn workspaces for monorepo management
- Internal packages use path aliases (see `vitest.config.mts`)
- Build system uses esbuild for packages, Vite for the app
- TypeScript throughout with strict configuration

# Memory Bank

Use `docs/memory-bank` as the single source of project memory.

## Memory Bank Pattern

- Keep memory concise, factual, and current.
- Update memory bank files after each project change (feature, bug fix, refactor, dependency change, or architecture decision).
- Prefer additive updates that preserve historical context instead of rewriting unrelated notes.
- If a change affects plans, assumptions, or risks, update those sections in the same change.
- Reference concrete paths, commands, and decisions to make future work reproducible.

## Update Checklist (Every Change)

1. Record what changed and why.
2. Record impacted areas (packages, modules, commands, tests).
3. Record follow-up work, open questions, and risks.
4. Confirm entries are stored under `docs/memory-bank`.

## Files

- snake-case for files: `element_utils.ts`
