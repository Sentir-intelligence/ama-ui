# ama-ui

AMA Precast's design tokens and component library for the production front end (`Sentir-intelligence/ama-os`).
It is a [shadcn registry](https://ui.shadcn.com/docs/registry): apps copy the components in with one command and own them from there.
Built on Tailwind v4, Radix and Lucide.

Visual guideline (v0.3, approved): [AMA UI Guideline](https://claude.ai/artifact/4QXJX5SVrXpij6iPLAtFmB). Private until shared; ask Jacob for access.
Rules for people and agents: [`registry/rules/AGENTS.md`](registry/rules/AGENTS.md).

## What is in it

| Item | What it does |
|---|---|
| `theme` | Tokens, light and dark, density modes, type roles, status chip styles and the Tailwind wiring. Removes Tailwind's default palette so only AMA tokens exist. Install first. |
| `utils` | `cn()` that understands AMA classes (replaces `lib/utils.ts`). |
| `status` | Lifecycle status keys and labels, generated from the tokens. |
| `lint` | ESLint rules that enforce the guideline. |
| `agents` | The rules file for coding and design agents. |
| `compat` | Temporary migration shim for ama-os. Delete once its lint warnings reach zero. |
| `button` `badge` `card` `checkbox` `input` `textarea` `label` `switch` `table` `dialog` `sheet` `popover` `dropdown-menu` `select` `confirm-dialog` `prompt-dialog` | The prototype's 16 primitives, re-skinned. **APIs unchanged**, so feature components need no edits. |
| `status-chip` `alert` | New: the only way to show a lifecycle status, and the feedback component. |
| `logo` | The AMA Precast logo as a token-coloured SVG component (`tone="reverse"` on navy, `variant="mark"` for the top bar). Static files in `public/brand/`. |

## Install in an app

Prerequisites: Tailwind v4 and a `components.json` (`npx shadcn@latest init`).

```bash
# install the AMA theme, libraries, lint rules and agent rules (run once per app)
npx shadcn@latest add Sentir-intelligence/ama-ui/theme Sentir-intelligence/ama-ui/utils Sentir-intelligence/ama-ui/status Sentir-intelligence/ama-ui/lint Sentir-intelligence/ama-ui/agents
```

```bash
# install all components
npx shadcn@latest add Sentir-intelligence/ama-ui/button Sentir-intelligence/ama-ui/badge Sentir-intelligence/ama-ui/card Sentir-intelligence/ama-ui/checkbox Sentir-intelligence/ama-ui/input Sentir-intelligence/ama-ui/textarea Sentir-intelligence/ama-ui/label Sentir-intelligence/ama-ui/switch Sentir-intelligence/ama-ui/table Sentir-intelligence/ama-ui/dialog Sentir-intelligence/ama-ui/sheet Sentir-intelligence/ama-ui/popover Sentir-intelligence/ama-ui/dropdown-menu Sentir-intelligence/ama-ui/select Sentir-intelligence/ama-ui/confirm-dialog Sentir-intelligence/ama-ui/prompt-dialog Sentir-intelligence/ama-ui/status-chip Sentir-intelligence/ama-ui/alert Sentir-intelligence/ama-ui/logo
```

Then `app/globals.css` becomes:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "./ama/theme.css";
/* ama-os migration only, remove when lint warnings reach zero: */
@import "./ama/compat.css";
```

And `eslint.config.mjs` adds:

```js
import { amaRules } from "./eslint.ama.mjs";
export default [/* ...existing config */, ...amaRules({ entryPoint: "app/globals.css", compat: true })];
```

Pin a release with `#vX.Y.Z` on each item. Preview an update with `--diff` before applying it.
If this repo is private, the shadcn CLI needs a GitHub token in the environment to install.

## Fonts

Self-host with `next/font`: Inter (variable, Latin subset) as `--font-inter`, and Archivo at weight 700, width 87.5 as `--font-archivo`, both with `adjustFontFallback`. Point `--ama-font-sans` and `--ama-font-display` at those variables in the app's root layout. No Google Fonts CDN in production.

## Working on this repo

```bash
# install, then run every CI gate locally
npm ci
npm run check
```

- Change tokens only in `tokens/ama-tokens.json`, then `npm run tokens`. Generated files are never edited by hand.
- `npm run contrast` checks every text and non-text pair in both modes against WCAG 2.2 AA.
- Add a changeset for every change (`npm run changeset`). Renaming or removing a token or prop is a major version.

CI (`.github/workflows/ci.yml`) runs: generated files fresh, contrast suite, typecheck, ESLint and Stylelint, Tailwind build, tests, registry build.
