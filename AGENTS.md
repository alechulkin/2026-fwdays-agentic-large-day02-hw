# AGENTS.md

## Project Overview

This repository is the **Excalidraw** monorepo: an open-source virtual whiteboard. It ships the **`@excalidraw/excalidraw`** React library (`packages/excalidraw/`), the full **excalidraw.com** web app (`excalidraw-app/`), shared packages (`packages/common`, `element`, `math`, `utils`), and **examples**. Work here spans canvas-based rendering, scene/element modeling, file import-export, optional collaboration, and app-specific hosting and tooling.

## Project Structure

Excalidraw is a **monorepo** with a clear separation between the core library and the application:

- **`packages/excalidraw/`** - Main React component library published to npm as `@excalidraw/excalidraw`
- **`excalidraw-app/`** - Full-featured web application (excalidraw.com) that uses the library
- **`packages/`** - Core packages: `@excalidraw/common`, `@excalidraw/element`, `@excalidraw/math`, `@excalidraw/utils`
- **`examples/`** - Integration examples (NextJS, browser script)

## Tech Stack

- **Languages:** TypeScript (strict), JavaScript where legacy scripts exist
- **UI:** React; canvas-based drawing (not DOM for the canvas surface)
- **Monorepo:** Yarn 1 workspaces (`packageManager`: yarn@1.22.22)
- **Build / dev:** esbuild for internal packages; **Vite** for `excalidraw-app`; path aliases (see `vitest.config.mts`)
- **Test:** **Vitest** (`yarn test:app`), **vitest-canvas-mock**; typecheck via `tsc`
- **Quality:** **ESLint** (`@excalidraw/eslint-config`, `yarn test:code`), **Prettier** (`@excalidraw/prettier-config`, `yarn test:other` / `yarn fix`)
- **Tooling:** Husky + lint-staged; Node **>= 18**

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

## Conventions

- **Naming:** kebab-case for non-component source files (e.g. `element-utils.ts`); **PascalCase** for React components (e.g. `LayerUI.tsx`). See `.cursor/rules/conventions.mdc` for details.
- **Components:** Prefer functional components and hooks; **named exports only** (no default exports); colocate tests as `ComponentName.test.tsx`.
- **TypeScript:** Strict mode; avoid `any` and `@ts-ignore` unless an approved exception; prefer `import type` for type-only imports.
- **Lint / format:** Run `yarn fix` (Prettier + ESLint `--fix`) before pushing; CI runs `yarn test:code` and `yarn test:other` (Prettier check).
- **Branches / commits:** Use descriptive branch names; PR titles should follow the repo’s semantic PR rules (see `.github/workflows/semantic-pr-title.yml`). Keep commits focused and reference issues when applicable.

## Do-Not-Touch / Constraints

- **Protected files** (do not edit without explicit approval, full dependency understanding, full test run, and manual QA — see `.cursor/rules/do-not-touch.mdc`):
  - `packages/excalidraw/scene/Renderer.ts` — render pipeline
  - `packages/excalidraw/data/restore.ts` — file format compatibility
  - `packages/excalidraw/actions/manager.tsx` — action system
  - `packages/excalidraw/types.ts` — core types
- **CI / merge expectations:** `yarn test:typecheck` and `yarn test:update` (or project-required test scripts) should pass before merge; `yarn build` must succeed when a full compile is required. Do not commit secrets; use environment variables for sensitive configuration.

## Architecture Notes

### Package System

- Uses Yarn workspaces for monorepo management
- Internal packages use path aliases (see `vitest.config.mts`)
- Build system uses esbuild for packages, Vite for the app
- TypeScript throughout with strict configuration

## Memory Bank

Use `docs/memory-bank` as the single source of project memory.

### Memory Bank Pattern

- Keep memory concise, factual, and current.
- Update memory bank files after each project change (feature, bug fix, refactor, dependency change, or architecture decision).
- Prefer additive updates that preserve historical context instead of rewriting unrelated notes.
- If a change affects plans, assumptions, or risks, update those sections in the same change.
- Reference concrete paths, commands, and decisions to make future work reproducible.

### Update Checklist (Every Change)

1. Record what changed and why.
2. Record impacted areas (packages, modules, commands, tests).
3. Record follow-up work, open questions, and risks.
4. Confirm entries are stored under `docs/memory-bank`.
