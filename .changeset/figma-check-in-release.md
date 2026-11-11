---
"ama-ui": patch
---

`npm run check` now runs `npm run tokens:figma`, so a Figma colour or token change that is not mirrored fails the release. `tokens/figma-color.json` is re-exported (2026-11-11): it matches the tokens in light and dark. Figma variables marked deprecated in their description (the three Takeoff colours, until they are deleted from the library) are listed and not compared; the export script records that mark.
