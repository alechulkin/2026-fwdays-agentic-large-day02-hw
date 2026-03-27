---
name: memory-bank-update
description: Updates the Memory Bank with recent changes, ensuring all technical details are accurate and up to date. Use when the user asks to update the memory bank, sync documentation, or refresh project context.
---

# Skill: Memory Bank Update

## When to use

After significant code changes: new features, refactors, architecture changes, dependency updates, or completed milestones.
Triggered by: "update memory bank", "sync docs", "refresh project docs".

## Inputs

- What changed (from git diff, conversation, or user description)

## Steps

1. Run `git diff --stat HEAD~5` to identify recent changes.
2. Read relevant Memory Bank files in `docs/memory-bank/`.
3. For each changed area, map the work to **Memory Bank targets** and note **Excalidraw impact** (so entries stay accurate and searchable):
   - **Memory Bank files** (pick by change type; update all that apply):
     - New feature or milestone → `progress.md`, `activeContext.md`
     - Architecture or design decision → `systemPatterns.md`, `decisionLog.md`
     - Dependency or tooling change → `techContext.md`
     - Scope or product change → `projectbrief.md`, `productContext.md`
   - **Excalidraw change indicators** — for each area, note whether the change touches:
     - **Scene / rendering** (e.g. `packages/excalidraw/scene/`, canvas / `renderScene`, `AppState` that affects draw)
     - **Element model** (e.g. `packages/element/`, bindings, element types / schema)
     - **Collaboration / data import** (e.g. `excalidraw-app/collab/`, `packages/excalidraw/data/` load-restore, export, encryption)
     Record these tags in the relevant Memory Bank sections so future readers know where to look in the monorepo.
4. **Verify** updated content against actual source code. For Excalidraw-related edits, also run this short checklist against the repo (when applicable):
   - **Scene JSON / file shape:** claims align with how scenes are stored and restored (e.g. `restore` / `AppState` / element lists).
   - **Renderer mapping:** statements about drawing match the scene → canvas path (scene types, render entry points).
   - **Element schema:** references to element fields/types match `packages/element` and exported types.
   - **Import / export traces:** behavior described matches `data/` load paths, export, clipboard — not guessed APIs.
5. **Length:** keep every Memory Bank file **under 200 lines** (including new Excalidraw-specific bullets); split or summarize rather than append unbounded detail.

## Outputs

- List of updated Memory Bank files
- Summary of what changed and why

## Safety

- Do NOT remove manually curated content without asking.
- Do NOT add speculative information; only include verified facts.
- Do NOT exceed 200 lines per file; summarize when needed (same limit for Excalidraw impact tags and checklists added in step 3–5).
- Verify all technical claims against actual code.
