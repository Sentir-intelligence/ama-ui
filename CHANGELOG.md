# ama-ui

## 0.3.8

The patterns for the Panel view (PV-18, AMA-337): the QA tab (QA item, QA answer, QA defect, QA ring, Metric card, Photo tile), the Activity tab (tabs, comment, composer, log line, visibility tag and toggle, Raised item), and the phone shell (header, tab bar, tab bar item, scan button, panel row). Select gains an optional leading icon and an icon-only mode.

### Patch Changes

- 9d426bb: Add the Activity tab patterns: Activity tabs (staff, builder, touch), Activity comment (with Activity mention), Activity composer (seven modes), Activity log line, Visibility tag, Visibility toggle and Raised item. Select gains an optional leading `icon` and `showValue={false}` for the icon-only select.
- Add the phone Panel view shell patterns: Phone header, Phone tab bar, Phone tab bar item, Phone scan button and Phone panel row.
- 3eed9fc: Pattern/QA item and Pattern/QA answer from the Figma library (Patterns page), for the Visibuild QA tab (AMA-336, built in AMA-337). QA item has the views Answer, Review and Builder, the states Open, Pass, Fail and N/A, a Desktop row and a Touch card, and the Not synced cloud icon; Review is read only. QA answer is the Pass, Fail, N/A control on its own.
- 38935ae: QA tab patterns from the Figma library: Pattern/QA defect (Open, Fix added, Closed), Pattern/QA ring (Compact, Touch, Large), Pattern/Metric card (Number and Progress; the Person type is not built, it is not used) and Pattern/Photo tile (Photo, Add, Uploading, Not synced; 56 and 72) (AMA-337).

## 0.3.7

The app shell's patterns, for Settings navigation (ST-1) and the front door's launcher and preview (FD-3): rail items, panel rows, chrome buttons, the account avatar, menu tabs, activity items and the Preview bar. The release check now also compares the tokens with Figma.

### Patch Changes

- 5c35d7c: `npm run check` now runs `npm run tokens:figma`, so a Figma colour or token change that is not mirrored fails the release. `tokens/figma-color.json` is re-exported (2026-11-11): it matches the tokens in light and dark. Figma variables marked deprecated in their description (the three Takeoff colours, until they are deleted from the library) are listed and not compared; the export script records that mark.
- 5186585: Shell patterns from the Figma library: Shell rail item, Shell panel row, Shell chrome button, Shell avatar, Shell menu tab and Shell activity item, plus the Preview bar (Front door 10.9). Files named `shell-*` count as navy chrome for the signal yellow lint rule.

## 0.3.6

The status colour ladder is retuned and Takeoff is removed. The contrast suite passes again (it failed with the earlier Figma values: Not Drawn against Takeoff in light, Manufactured against Manifested in dark).

- **Breaking: Takeoff is removed** from `STATUS_KEYS`, the status tokens and `<StatusChip>`. Released as a 0.3.x version by decision; an app that still shows Takeoff must stop before upgrading.
- Not Drawn uses concrete grey. Manifested, Dispatched and With Driver step from status orange to signal yellow, and their descriptions follow the delivery ladder.
- Dark Manifested uses status orange (`#D8732B`) so it stays distinct from the dark Manufactured swatch.
- `npm run tokens:figma` still reports differences until the AMA UI Figma library takes these values: dark Not Drawn and dark Manifested, and the deprecated Takeoff variables. It stays out of `npm run check` until then.

## 0.3.5

Patterns from the AMA UI Figma library, for Settings and the Front door (AMA-309). Patterns are a new registry section: `registry/ama/patterns/`, installed as `@ama/<name>` into `components/patterns/`. They take props and send events; they never fetch data, check permissions or apply business rules (ADR-0020: ama-ui draws, ama-os decides). Each has a test, its Figma name in AGENTS.md and every state in the playground.

- `person-row`: Pattern/Person row for Settings, Users and roles. Avatar (photo or initials), name, email and company, the role badge, and Invited until the invite is accepted. With `onSelect` the whole row is one 64px button with a chevron.
- `phone-page-header`: Pattern/Phone page header, the sticky 56px header for phone pages that are not a panel. Back (`onBack`), the title on one line, and one optional icon action (`action: { icon, label, onClick }`), each a 44px target.
- `code-input`: Pattern/Code input, the 8-digit email sign-in code, one digit per box. Digits only; a pasted or autofilled code fills every box; backspace moves back; `onComplete` fires on the last digit; `invalid` draws destructive borders and sets `aria-invalid`.
- Playground: separate Components and Patterns pages (`#/components`, `#/patterns`) in the top bar.
- `npm run tokens:figma` compares `tokens/figma-color.json` (the Figma Color collection, exported with `scripts/figma-export-color.js`) with the tokens. It is not in `npm run check` yet: it reports 17 status colour differences (Not Drawn, Manifested, Dispatched, With Driver) that wait on a design decision, because the Figma values fail the swatch contrast rule (Not Drawn against Takeoff in light, Manufactured against Manifested in dark). The status colours are unchanged in this release.

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
