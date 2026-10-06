# AMA UI rules for agents

Binding for any agent (Claude, Cursor, Copilot, Figma agents) building AMA Precast UI, in code or in Figma.
Source of truth: `Sentir-intelligence/ama-ui`. Tokens: `tokens/ama-tokens.json`. Guideline: https://claude.ai/artifact/4QXJX5SVrXpij6iPLAtFmB (ask Jacob for access).

## Before you build anything

1. Check the registry first. If a component exists in ama-ui, install it (`npx shadcn add @ama/<item>`, with the `@ama` registry pinned to a tag in `components.json`). Never restyle a primitive locally.
2. If something is missing, stop and flag it as a library gap. Do not build a one-off.
3. Lucide icons only.

## Colour

- Semantic utilities only: `bg-primary`, `text-muted-foreground`, `border-input`, `bg-canvas`. The default Tailwind palette does not exist in AMA apps (`bg-blue-500` will not compile).
- Never write hex, rgb, hsl or oklch in components, and never use arbitrary values (`bg-[#fff]`, `text-[11px]`).
- Navy (`chrome`) is for the top bar and side nav. Anything on navy sets `data-surface="chrome"` so its focus ring turns yellow.
- `#FCDA4E` has two roles. On navy chrome it is the brand highlight (active nav indicator). Anywhere else it means Delivered, and only inside a status swatch with its edge and the package-check icon. Never use it for emphasis, badges, buttons or highlights on light or night surfaces. Lint blocks `*-signal` classes outside chrome files (app shell, top bar, side nav, `shell/`); pass `chromeFiles` to `amaRules` if your chrome lives elsewhere.
- Actions and links are cobalt `primary` / `link`. Links are always underlined.
- Feedback (`success`, `warning`, `info`, `destructive`) appears only in `<Alert>`, toasts and validation, always with its icon and left rule. Never as pills, never inside table rows.

## Status

- Lifecycle status is shown only with `<StatusChip status="ifc" />`: a neutral tag with a solid colour swatch holding the status icon, then the label. Colour family, icon and label always travel together. Never rebuild it as a tinted pill.
- The colour meanings are AMA's business language and must not change: pink IFA, green IFC, blue Scheduled, orange Manufactured, yellow Delivered, greys light to dark along the lifecycle for Not Drawn, Takeoff, Manifested, Dispatched, With Driver.
- Never use status colours or status icons for anything that is not a status. Never use `Badge` for a status. Lint blocks `*-status-*` colour classes everywhere; only `<StatusChip>` draws them.

## Logo

- Use `<Logo />` (registry item `logo`). On navy chrome use `tone="reverse"`; in the top bar use `variant="mark"`. Never retype the wordmark in a font, recolour it outside these tones, or stretch it. Lint blocks `<img>` logos and imported logo files.

## Type

- Use a role, never a size: `text-page-title`, `text-section`, `text-body`, `text-body-sm`, `text-label`, `text-caption`, `text-table-header`, `text-table-cell`, `text-kpi`, `text-id`, `text-button`, `text-field`.
- Archivo Narrow Bold (display font) comes with `text-display` and `text-page-title` only, 24px and up. On phones use `text-page-title sm:text-display`.
- Shop numbers and IDs use `text-id` (tabular, slashed zero), never a mono font.
- Table headers are sentence case, never uppercase. Numbers and dates are right-aligned and tabular. Dates read `08 Oct 2026`. Empty values show an en dash in `text-muted-foreground`. Units go in the header (`Area m²`).

## Density and layout

- Set density once per surface: `data-density="compact"` (office tables, the `<Table>` default), `comfortable` (forms, admin), `touch` (factory tablets, driver phones).
- Components use `h-control`, `h-row`, `px-cell`, `text-table-cell`, so they adapt automatically. Never branch on device inside a component.
- Spacing uses the Tailwind 4px scale (`p-2`, `gap-3`). Radii: `rounded-md` controls, `rounded-lg` cards, `rounded-xl` dialogs.
- Layers: dialogs and sheets `z-100`, floating menus `z-110`, toasts `z-120`.

## Interaction and accessibility

- Focus is the global 2px outline. Never `outline-none`, never `ring-ring/50` as a focus style.
- No opacity for hover or disabled. Use `hover:bg-primary-hover`, `hover:bg-accent`, `disabled:bg-disabled disabled:text-disabled-foreground`.
- Secondary buttons always have a border. Selection is background plus left bar (`indicator-left`) plus a ticked checkbox, never background alone.
- Checkboxes sit in a 24px or larger click target (`<TableCheckboxCell>` in tables), 44px in touch density. Nav items carry `aria-current`.
- Inputs use `text-field` (16px) below md so iOS does not zoom.
- Driver screens default to light mode.

## Fonts

- Self-host with `next/font` (Archivo Narrow 700, Inter variable, Latin subset, `adjustFontFallback`). No Google Fonts or other CDN in production.

## Changing tokens

- Edit `tokens/ama-tokens.json` only, in both light and dark. Run `npm run tokens` and `npm run contrast`. Generated files are never edited by hand.
- Renaming or removing a token is a major version (changeset). CI fails if generated files are stale or any pair drops below WCAG AA.

## Figma

- Library file: AMA UI, key `9BtnLlkTrWBscwvFV9DUQC` (https://www.figma.com/design/9BtnLlkTrWBscwvFV9DUQC). Enable it in any AMA design file. Search it before drawing (`search_design_system`) with `includeLibraryKeys: ["lk-9bb346fc868d99120e1c3d4e7981b9acbda2f190691b37b2a563ec03666c6cec8d9616c35607bae0a65f3839588ac02df1f82ad5bcd99cb7e82fc1773db1900d"]`: the team also publishes FIVIC UI and a shadcn community library, which appear in unrestricted searches and must never be used for AMA. Insert instances, never detach.
- Bind every colour to a variable in the **Color** collection (modes Light and Dark). The Primitives collection is hidden and must never be bound directly. Variable code syntax is the CSS name (`primary` is `var(--primary)`; `feedback/success/soft` is `var(--success-soft)`).
- Heights and cell padding bind to the **Density** collection (Comfortable, Compact, Touch), radii and fixed sizes to **Shape**. Set modes on the page frame, not per layer.
- Use the text styles (Heading, Body, Data, Control). Display roles are Archivo Narrow Bold, everything else Inter.
- Component names and variant properties match the code: `Button` (Variant, Size, State), `Badge`, `Checkbox`, `Switch`, `Input`, `Textarea`, `Select`, `Label`, `Card`, `Table/Header cell`, `Table/Cell`, `Table/Checkbox cell`, `Table/Row`, `Dialog`, `Confirm Dialog`, `Prompt Dialog`, `Sheet`, `Popover`, `Dropdown Menu` (+ Item, Label, Separator), `StatusChip` (Status uses the code keys such as `with_driver`; Density Default or Touch), `Alert`, `Logo` (Tone, Variant), icons as `Icon/<lucide-name>`.

## Migration (ama-os only)

- `app/ama/compat.css` and `amaRules({ compat: true })` keep ported prototype code compiling while it is converted. Every compat class is a lint warning. Mapping: `text-xs` to `text-label`, `text-sm` to `text-body`, `text-base` to `text-field`, `text-lg` to `text-section`, `text-xl` to `text-title`, `text-2xl` to `text-page-title`, `bg-white` to `bg-background` or `bg-card`, `bg-black/50` to `bg-overlay`, `rounded-2xl` to `rounded-xl`, `shadow-xl` to `shadow-lg`.
- Hard-coded status colours (`STATUS_PILL` in `lib/elements.ts`) are replaced by `<StatusChip>`.
