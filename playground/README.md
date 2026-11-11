# AMA UI Playground

A live, hot-reloading view of every AMA UI component, for checking states visually while you build them.

## Purpose

- See every registry component on one page, in its main states (default, active or selected, invalid, disabled) and in light and dark mode.
- Switch density (compact, comfortable, touch) to check that heights, padding and type follow the density tokens.
- Check a change before it is built into the registry JSON (`public/r`) that apps install from.

The playground does not install the registry. It imports the source directly from `../registry/ama` through the same `@/` aliases that the tests use, so any edit to a component, the theme or the tokens' generated CSS shows up immediately. It is a development tool only: it is not a registry item, it is not published and apps never install it.

## Usage

From the repo root:

```bash
npm ci                    # once
npm run playground        # dev server with hot reload (http://localhost:5173)
npm run playground:build  # optional: production build into playground/dist (git-ignored)
```

- **Theme and density** are switched from the top bar. Both are set on `<html>`, so dialogs, menus and tooltips (which render in portals) follow them too.
- **Hover and focus** are real: hover or tab through the components to check those states.
- **Tokens:** after editing `tokens/ama-tokens.json`, run `npm run tokens`. The playground picks up the regenerated CSS.

## Pages

Two pages, switched from the top bar and kept in the URL hash, so a link opens the right one:

- **Components** (`#/components`, the default): every component in `registry/ama/ui`, `brand` and `icons`. Source `src/pages/components.tsx`.
- **Patterns** (`#/patterns`): every Figma `Pattern/...` component in `registry/ama/patterns`, in each state it is drawn in. Phone patterns sit in a 390px frame. Source `src/pages/patterns.tsx`.

`src/app.tsx` is the shell (top bar, theme, density, routing); `src/parts.tsx` has the shared `Section`, `Row` and `Phone`.

## Adding a component or pattern

When you add a component to `registry/ama`, add a `<Section>` for it in `src/pages/components.tsx`; a pattern goes in `src/pages/patterns.tsx`. Show its variants, its selected or active state and its disabled state. A pattern shows every state of its Figma component, drawn from props alone.

The playground is covered by the root `npm run check`. Typecheck and the AMA lint rules (`amaRules`) run on `playground/src`, so the page itself only uses AMA tokens and type roles. That makes it a working example of the rules as well as of the components.

## Files

| File | What it does |
|---|---|
| `vite.config.ts` | Aliases `@/components/ui`, `@/components/brand`, `@/components/icons`, `@/components/patterns` and `@/lib` to `../registry/ama/*`. |
| `src/globals.css` | Imports Tailwind and the AMA theme from the registry source. It mirrors an app's `globals.css`. |
| `src/main.tsx` | Loads the self-hosted fonts (Inter variable and Archivo Narrow 700) and mounts the app. |
| `src/app.tsx` | The shell: top bar with the Components and Patterns pages, theme and density, and the hash routing. |
| `src/pages/components.tsx` | One section per component. |
| `src/pages/patterns.tsx` | One section per pattern, in every state. |
| `src/parts.tsx` | The shared `Section`, `Row` and `Phone` (a 390px frame for phone patterns). |
