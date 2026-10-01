# ama-ui

## 0.3.0

First release. Brand guideline approved after three rounds of specialist review (accessibility, colour, token architecture, typography and density, front-end build).

- Tokens in W3C DTCG format with aliases, light and dark, generated into Tailwind v4 theme, tokens, status chip and migration shim CSS.
- 16 prototype primitives re-skinned with unchanged APIs, plus StatusChip for the production ladder (RFQ removed; Manifested, Dispatched and With Driver as separate logistics statuses, each with its definition in the tokens; swatch design: neutral tag, solid status-colour square with icon, label), Alert and TableCheckboxCell.
- AMA Precast logo: cleaned vector assets and a token-coloured `<Logo>` component (lockup and mark, default and reverse).
- Density modes (compact, comfortable, touch), type roles, feedback set, navy-tinted dark mode.
- Gates: token freshness, WCAG 2.2 AA contrast suite, typecheck, ESLint (unknown classes, arbitrary values, opacity states, focus, warning in rows), Stylelint (no colour literals), Vitest, Tailwind build, registry build.
