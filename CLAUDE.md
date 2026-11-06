# CLAUDE.md

- Format, lint and tsconfig rules come from `@matchory/coding-style`. Change them there, not with
  local overrides in this repo's config files. `pnpm run style:verify` only checks that the shared
  presets are imported, so it will not catch an override.
