# Working in this repo

- The rules for building AMA UI are in `registry/rules/AGENTS.md`. Follow them here too.
- Source of truth is `tokens/ama-tokens.json`. Never edit `registry/ama/styles/*.css`, `registry/ama/lib/utils.ts` or `registry/ama/lib/status.ts` by hand: run `npm run tokens`.
- Before pushing, `npm run check` must pass. It runs every CI gate.
- Component APIs must stay compatible with the ama-os prototype components (tests/api-compat). Additive changes only unless a major changeset is agreed.
- Add a changeset for every change (`npm run changeset`).
