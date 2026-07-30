# Matchory TypeScript Template

A minimal, opinionated starting point for new Matchory TypeScript libraries. It is a publishable
package with formatting, linting, type checking, and testing already wired up against
[`matchory/coding-style`](https://github.com/matchory/coding-style), so a new project starts with
the same conventions as the rest of the codebase instead of drifting from day one.

## Getting started

Create a new repository from this template, then set up the project locally:

```bash
gh repo create your-project --template matchory/template-typescript --private --clone
cd your-project
pnpm install
```

From there, run `pnpm test` to confirm the default Vitest suite passes and `pnpm run style:verify`
to confirm the style tooling is correctly wired up.

## No `.npmrc`, on purpose

This template ships without an `.npmrc`, so `pnpm install` resolves every dependency, including
`@matchory/coding-style`, from the public npm registry, unauthenticated. npm and pnpm resolve
registries per scope, not per package, so there is no way to route one `@matchory` package to a
different registry than another: the mapping applies to the whole scope at once. That is exactly
why `@matchory/coding-style` is published as identical bytes to both npmjs and GitHub Packages —
this template can depend on it without any registry configuration at all.

The moment a project also needs a package that is only published privately, such as `@matchory/ui`,
add an `.npmrc` that points the entire `@matchory` scope at GitHub Packages with an authentication
token. From then on every `@matchory` package, including `coding-style`, resolves through that
registry instead of npmjs.

## Publishing this package

`package.json` has `"private": true`, which blocks `npm publish` and `pnpm publish` until it is
removed. `publishConfig.access` is already set to `public`, which is required separately: the
package name is scoped (`@matchory/...`), and npm defaults a scoped package to `restricted`
visibility unless told otherwise, so this line is not optional even for a public package.

Before publishing, also fill in `repository`, `author`, and a more specific `description` in
`package.json`; none of those are set beyond a generic placeholder. Run `pnpm run build` first:
`files` in `package.json` ships only the `dist/` directory, so an unbuilt package publishes empty.

## What's wired up, and why

**`.editorconfig` is a synced copy, not authored here.** It's distributed by copy from
`matchory/coding-style` because EditorConfig has no mechanism for extending a file shipped inside a
package: `root = false` only walks up the directory tree, it can't reach into an installed
dependency. Refresh it with `npx matchory-coding-style sync` if it ever drifts from the canonical
version; never hand-edit it. It's one of the checks `style:verify` runs, so a drifted copy fails CI.

**`tsconfig.json` and `tsconfig.build.json` are separate on purpose.** The shared preset that
`tsconfig.json` extends sets `noEmit: true`, so `tsconfig.json` is typecheck-only; `pnpm run check`
uses it via `tsc --noEmit`. `tsconfig.build.json` extends `tsconfig.json` and turns emission back on
with `declaration` and `declarationMap`, restricted to `src`. `pnpm run build` uses that file.
Collapsing the two into one either breaks type checking outside `src` (tests, config files) or stops
the build from emitting anything at all.

**`eslint.config.js` is temporary.** oxlint covers most of this project's linting, but not yet the
type-aware rules ESLint's TypeScript integration provides. `eslint.config.js` exists to cover that
gap, and `pnpm run lint` runs both tools. Once oxlint reaches parity, delete this file, drop `eslint`
and its plugins from `devDependencies`, and remove it from `lint`/`lint:ci`.

**Vitest configuration stays local.** Unlike the formatter, linter, and `tsconfig`, `vitest.config.ts`
imports nothing from `matchory/coding-style`. Test runner setup is build tooling specific to this
project, not a style convention, so the shared package deliberately does not own it.

**`pnpm run style:verify` is the acceptance test**, not a general correctness check. It confirms
that `.editorconfig`, `oxfmt.config.ts`, `oxlint.config.ts`, `eslint.config.js`, and `tsconfig.json`
are actually wired to the shared presets, nothing else. It does not run tests, does not build, and
does not lint or type-check the codebase; `--strict` only means warnings are treated as failures. CI
runs it as its own job, separate from lint, type check, test, and build, on every push to `main` and
every pull request, and it's worth running locally after touching any of the files above.

## Commands

```bash
pnpm run fmt            # format the codebase
pnpm run fmt:check      # check formatting without changing files
pnpm run lint           # lint with oxlint and eslint
pnpm run check          # type-check with tsc, no emit
pnpm test               # run the Vitest suite
pnpm run build          # emit dist/ via tsconfig.build.json
pnpm run style:verify   # verify the style tooling is correctly wired up
```

## What this template deliberately doesn't include

This is a starting point, not a scaffold for a specific library. It has one exported function as a
placeholder and nothing else: no bundler beyond `tsc`, no CLI, no framework integration. Those are
exactly the things a real project adds first. See `CLAUDE.md` for the conventions to follow once you
do.
