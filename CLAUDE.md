# CLAUDE.md

Guidance for Claude Code (and other coding agents) working in this repository.

## Stack

- TypeScript, package-managed with pnpm 10.33.0
- oxfmt for formatting, oxlint and ESLint for linting, both configured via `matchory/coding-style`
- Vitest for tests
- `tsc` for type checking and for building the published package

## Commands

```bash
pnpm run fmt            # format the codebase
pnpm run fmt:check      # check formatting without changing files
pnpm run lint           # lint with oxlint and eslint
pnpm run lint:ci        # lint with GitHub-annotated output, for CI
pnpm run check          # type-check with tsc, no emit
pnpm test               # run the Vitest suite
pnpm run build          # emit dist/ via tsconfig.build.json
pnpm run style:verify   # confirm the project actually consumes the shared presets
```

`pnpm run style:verify` is the acceptance test for the style wiring specifically. It checks that
`.editorconfig`, `oxfmt.config.ts`, `oxlint.config.ts`, `eslint.config.js`, and `tsconfig.json` are
still wired to `@matchory/coding-style`, not that the codebase is correctly formatted, linted, typed,
tested, or that it builds; `pnpm run fmt:check`, `lint`, `check`, `test`, and `build` cover those
separately. `--strict` on `style:verify` treats warnings as failures on top of that, nothing more.

## Style configuration lives elsewhere

Formatting and linting rules are not defined in this repository. They come from
`@matchory/coding-style` and are never edited locally:

- `oxfmt.config.ts` imports and re-exports the package's `oxfmtBase` preset.
- `oxlint.config.ts` imports and re-exports the package's `oxlintBase` preset.
- `eslint.config.js` calls the package's `withCore()` to build its config, for the type-aware
  TypeScript rules oxlint does not yet cover. Delete this file, and drop `eslint` and its plugins
  from `devDependencies`, once oxlint reaches parity.
- `tsconfig.json` extends `@matchory/coding-style/tsconfig/base.json`.
- `.editorconfig` is a synced copy, not authored here. EditorConfig has no way to extend a file
  shipped inside a package, so it's distributed by copy instead. Refresh it with
  `npx matchory-coding-style sync` if it ever drifts; never hand-edit it.

## Two tsconfig files

`tsconfig.json` is typecheck-only: the shared preset it extends sets `noEmit: true`, and `pnpm run
check` runs `tsc --noEmit` against it. It also covers `tests` and `*.config.ts`, so those get type
checking too. `tsconfig.build.json` extends `tsconfig.json`, restricts `include` to `src`, and turns
emission back on with `declaration` and `declarationMap` so `pnpm run build` can produce `dist/`.
Keep the split: merging them either breaks type checking of tests and config files, or stops the
build from emitting output.

## Vitest stays local

`vitest.config.ts` does not import anything from `@matchory/coding-style`. Test runner setup is
project-specific build tooling, not a style convention the shared package tracks, so it is
configured entirely in this repository.

## Claude Code hook

`.claude/settings.json` runs `oxfmt` on a file after every edit, piped through `jq` to extract the
edited path; if that pipeline fails for any reason the hook no-ops instead of blocking, so formatting
falls back to whatever runs at `pnpm run fmt` or CI time.
