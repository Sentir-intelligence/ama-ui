# ama-ui

## 0.3.4

New components from the AMA UI Figma library. Each is a registry item with a test, and its Figma name is listed in AGENTS.md.

- `tabs`: underline tabs (Radix), matching `Tabs/Trigger`. The active tab is the foreground label plus a 2px primary indicator. Optional `count`, `mention` and `unread` props draw the Figma extras, with screen-reader text for the markers. Height follows density (40px office, 48px touch).
- `toggle-group`: segmented control for 2 to 4 peer options inside a panel (Radix), matching `Toggle Group/Item`. Selected is the card fill plus a border. Height follows density.
- `avatar`: 28px circle (Radix), matching `Avatar`. Shows the photo, or initials in primary on accent. The contrast suite now checks primary on accent.
- `tooltip`: inverse tooltip (Radix), matching `Tooltip`. Uses `text-body-sm` on the floating layer z-110. AGENTS.md layers now list tooltips with floating menus.
- `stage-cloud`: the AMA stage-cloud glyph from `Icon/stage-cloud` as a Lucide-style icon component (`components/icons/stage-cloud.tsx`). It is the only non-Lucide icon.
- `colour-swatch`: stage cloud colour picker (Radix radio group), matching `Colour swatch`. The stage-cloud glyph is drawn in chart tokens 1 to 5 on 28px round targets, with a ring when selected.
- Dev-only playground (`npm run playground`): a hot-reloading page with every component in light and dark mode at each density. It imports the registry source directly. See `playground/README.md`.

## 0.3.3

- The registry is now published: built item files are committed to `public/r/` and served from GitHub, so apps add `"@ama": "https://raw.githubusercontent.com/Sentir-intelligence/ama-ui/<tag>/public/r/{name}.json"` to `components.json` and install with `npx shadcn add @ama/<item>`. The tag in the URL pins the version.
- Items declare their `registryDependencies` (`@ama/utils`, `@ama/status`, and the components that confirm-dialog and prompt-dialog are built from), so installing one item pulls in what it needs.
- `npm run registry:check` fails CI when `public/r` is out of date.
- README and AGENTS.md install instructions use the `@ama` namespace.

## 0.3.2

- Lint: status colour classes are blocked outside `<StatusChip>`, website yellow (`signal`) outside chrome files (`chromeFiles` option), and logo images or imported logo files instead of `<Logo>`.
- Lint: with `compat: true` every rule now warns instead of erroring (previously unknown classes and the syntax rules still errored), so ama-os can adopt the rules and ratchet the count down.
- AGENTS.md: Figma searches must be restricted to the AMA UI library key.
- Tests for the shipped lint rules (70 tests).

## 0.3.1

- Display font is Archivo Narrow 700 in code and Figma. The `font-stretch` token is removed.
- New `logo` colour token (navy in light, white in dark). `<Logo>` uses `fill-logo`, so the default tone follows the theme without a `dark:` class. Added to the contrast suite.
- AGENTS.md points at the AMA UI Figma library (file key `9BtnLlkTrWBscwvFV9DUQC`) and states its variable, density and component naming rules.

## 0.3.0

First release. Brand guideline approved after three rounds of specialist review (accessibility, colour, token architecture, typography and density, front-end build).

- Tokens in W3C DTCG format with aliases, light and dark, generated into Tailwind v4 theme, tokens, status chip and migration shim CSS.
- 16 prototype primitives re-skinned with unchanged APIs, plus StatusChip for the production ladder (RFQ removed; Manifested, Dispatched and With Driver as separate logistics statuses, each with its definition in the tokens; swatch design: neutral tag, solid status-colour square with icon, label), Alert and TableCheckboxCell.
- AMA Precast logo: cleaned vector assets and a token-coloured `<Logo>` component (lockup and mark, default and reverse).
- Density modes (compact, comfortable, touch), type roles, feedback set, navy-tinted dark mode.
- Gates: token freshness, WCAG 2.2 AA contrast suite, typecheck, ESLint (unknown classes, arbitrary values, opacity states, focus, warning in rows), Stylelint (no colour literals), Vitest, Tailwind build, registry build.
