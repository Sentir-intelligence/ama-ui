Every PR that changes tokens or components adds a changeset (`npm run changeset`).
Renaming or removing a token, a component export or a prop is a **major**. Adding is a **minor**. Visual fixes are a **patch**.
Keep `tokens/ama-tokens.json` `$extensions.ama.version` in step with `package.json` when releasing, then tag `vX.Y.Z`.
