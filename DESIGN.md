---
version: 1.0
name: epilog-design-system
description: A personal media journal that reads like a quietly editorial print magazine. The base canvas is warm off-white (`#f5f5f5`) holding warm near-black ink (`#0c0a09`). The brand voltage is atmospheric, not chromatic — soft pastel gradient orbs (mint, peach, lavender, sky, rose) drift behind every authenticated surface, and the active orb hue reacts to the selected media type (movies→mint, TV→sky, anime→lavender, books→peach) so the page's mood shifts with what you're tracking. Display runs Newsreader Variable at weight 300 — the editorial signature, used italic for the wordmark. Hanken Grotesk carries body, navigation, captions, and buttons. The primary action is a near-black ink pill; secondary actions are transparent pills with a hairline-strong border. A film-grain overlay sits over everything for a printed-paper feel. There is no saturated brand action color, no neon accent, no developer-tools dark canvas by default.

colors:
  ink: "#0c0a09"
  primary: "#292524"
  primary-foreground: "#ffffff"
  body: "#4e4e4e"
  muted: "#777169"
  muted-soft: "#a8a29e"
  hairline: "#e7e5e4"
  hairline-strong: "#d6d3d1"
  canvas: "#f5f5f5"
  canvas-soft: "#fafafa"
  card: "#ffffff"
  popover: "#ffffff"
  secondary: "#f0efed"
  secondary-foreground: "#292524"
  accent: "#f0efed"
  accent-foreground: "#292524"
  destructive: "#dc2626"
  ring: "#292524"
  orb-mint: "#a7e5d3"
  orb-peach: "#f4c5a8"
  orb-lavender: "#c8b8e0"
  orb-sky: "#a8c8e8"
  orb-rose: "#e8b8c4"

orb-by-media-type:
  movie: "mint"
  tv: "sky"
  anime: "lavender"
  book: "peach"
  ambient: "rose, lavender"

typography:
  font-heading: "'Newsreader Variable', 'EB Garamond', Georgia, 'Times New Roman', serif"
  font-serif: "'Newsreader Variable', 'EB Garamond', Georgia, serif"
  font-sans: "'Hanken Grotesk Variable', ui-sans-serif, system-ui, sans-serif"
  display-hero:
    fontFamily: "{typography.font-heading}"
    fontSize: "clamp(2.5rem, 6vw, 4rem)"
    fontWeight: 300
    lineHeight: 1.06
    letterSpacing: "-0.02em"
  display-section:
    fontFamily: "{typography.font-heading}"
    fontSize: "1.5rem"
    fontWeight: 300
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  wordmark:
    fontFamily: "{typography.font-heading}"
    fontSize: "1.5rem"
    fontWeight: 300
    fontStyle: italic
    letterSpacing: "-0.01em"
  title-md:
    fontFamily: "{typography.font-sans}"
    fontSize: 15px
    fontWeight: 500
    lineHeight: 1.4
  body-md:
    fontFamily: "{typography.font-sans}"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
  body-sm:
    fontFamily: "{typography.font-sans}"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.5
  caption:
    fontFamily: "{typography.font-sans}"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.5
  eyebrow:
    fontFamily: "{typography.font-sans}"
    fontSize: 11px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.12em"
    textTransform: uppercase
  button:
    fontFamily: "{typography.font-sans}"
    fontSize: 13px
    fontWeight: 500
    letterSpacing: "0.01em"

radius:
  base: 0.75rem
  sm: "calc(var(--radius) - 4px)"
  md: "calc(var(--radius) - 2px)"
  lg: "var(--radius)"
  xl: "calc(var(--radius) + 4px)"
  2xl: "calc(var(--radius) * 1.8)"
  pill: 9999px

spacing:
  page-x: "20px (mobile) / 32px (desktop)"
  section-y: "48px (mobile) / 64px (desktop)"
  masthead-to-content: "48px (mobile) / 64px (desktop)"
  section-gap: "20px (mobile) / 24px (desktop)"

shadows:
  soft: "0 1px 2px rgba(12,10,9,0.04), 0 6px 24px rgba(12,10,9,0.05)"
  lift: "0 2px 4px rgba(12,10,9,0.05), 0 16px 40px rgba(12,10,9,0.09)"

motion:
  orb-drift: "26s ease-in-out infinite alternate"
  orb-drift-2: "32s ease-in-out infinite alternate"
  reveal-up: "0.9s cubic-bezier(0.22,1,0.36,1)"
  reveal-fade: "1.1s ease-out"
  hover-lift: "300ms"
  poster-scale: "700ms ease-out"

components:
  atmosphere:
    description: "Fixed full-viewport layer of 3 drifting gradient orbs behind every authenticated page. The primary orb's hue is bound to the active media type; a rose and a lavender orb stay ambient."
  header:
    backgroundColor: "{colors.canvas} with backdrop-blur and 70% opacity"
    height: "64px (mobile) / 72px (desktop)"
    border: "1px bottom hairline"
    wordmark: "italic Newsreader 'epilog', opacity dims on hover"
  library-masthead:
    description: "The home headline IS the media-type filter. Reads 'The films / shows / anime / books you keep.' Each noun is a clickable inline control; active = solid ink with animated underline, inactive = muted with underline-on-hover. Counts sit as superscripts. The view switcher is a pill control on a hairline rule beneath."
  media-section:
    description: "Editorial section header: Newsreader title, tabular count, hairline rule filling remaining width, collapse caret. Body is a poster grid (grid view) or divided rows (list view)."
  media-card:
    backgroundColor: "{colors.card}"
    border: "1px ring border, strengthens to hairline-strong on hover"
    radius: xl
    poster: "aspect 2/3, scales 1.04 on hover (700ms)"
    hover: "shadow-lift"
  list-card:
    description: "Full-width row divided by hairlines. Poster 64×96, Newsreader title, tabular year. Hover tints row to canvas-soft."
  shelf-column:
    backgroundColor: "{colors.canvas-soft} at 40% opacity"
    border: "1px hairline"
    radius: xl
    header: "circular icon plate + Newsreader title + tabular count"
  shelf-card:
    backgroundColor: "{colors.card}"
    border: "1px ring border"
    radius: xl
    hover: "shadow-lift + ring strengthens"
  log-details-dialog:
    backgroundColor: "{colors.popover}"
    border: "1px hairline"
    radius: 2xl
    shadow: lift
    status-selector: "pill buttons (ink primary / hairline outline secondary)"
    actions: "pill buttons, destructive is ghost-tinted, divider above footer"
  search-input:
    height: 48px
    radius: pill
    border: hairline-strong
    shadow: soft
    icon: "magnifying glass, left inset"
  search-media-buttons:
    description: "Pill media-type selectors with eyebrow label above."
  search-results-header:
    description: "Eyebrow label + tabular count + hairline rule filling width."
  sign-in:
    description: "Signature atmospheric moment: 4 drifting orbs (mint, peach, lavender, sky) behind a translucent card. Italic Newsreader wordmark at 5xl, eyebrow subtitle, ink pill Google CTA. Card reveal-up animation with 120ms delay."
  empty-state:
    border: "1px dashed hairline-strong"
    backgroundColor: "{colors.canvas-soft} at 50% opacity"
    radius: xl
  theme-toggle:
    description: "Circular 36px outline pill; sun/moon cross-fade with 300ms rotation."

---

## Overview

epilog reads like a quietly editorial print magazine that happens to be a personal media journal. The base canvas is warm off-white (`{colors.canvas}`, #f5f5f5) holding warm near-black ink (`{colors.ink}`, #0c0a09). The brand voltage is **atmospheric, not chromatic**: soft pastel gradient orbs (mint, peach, lavender, sky, rose) drift behind every authenticated surface, and — epilog's signature interaction — the primary orb's hue reacts to the selected media type so the page's mood shifts with what you're tracking. There is no saturated brand action color, no neon accent.

Type pairs **Newsreader Variable** (open-source editorial serif, weight 300) for display and the italic wordmark with **Hanken Grotesk Variable** (humanist sans) for body, navigation, captions, and buttons. Display stays at weight 300 — never bold. The wordmark is the only place italic is used on display copy.

CTAs are subtle: a near-black ink pill (`{colors.primary}`) is the primary; transparent pills with a `{colors.hairline-strong}` border are the secondary. A film-grain SVG overlay sits over everything (4% opacity, overlay blend) for a printed-paper feel.

**Key Characteristics:**
- Warm off-white canvas, warm near-black ink. No saturated action color.
- Media-type-reactive atmospheric orbs: movies→mint, TV→sky, anime→lavender, books→peach. Rose + lavender stay ambient.
- Newsreader Variable at weight 300 for all display — the editorial signature. Italic only on the wordmark.
- Hanken Grotesk for body at 400/500 with relaxed leading (1.55).
- The home headline **is** the media-type filter ("The films / shows / anime / books you keep.") — copy and control are the same element.
- Pill geometry for every CTA, badge, and selector. Cards use `{radius.xl}` (16px).
- Hairline rules carry editorial structure; counts are tabular.
- Film-grain overlay + soft/lift shadow tiers give printed depth.

## Colors

### Brand & Action
- **Ink** (`{colors.ink}` — #0c0a09): Display, primary text, the wordmark.
- **Primary** (`{colors.primary}` — #292524): The ink pill — the only primary action fill. Used scarcely.
- **Primary Foreground** (`{colors.primary-foreground}` — #ffffff): Text on the ink pill.

### Surface
- **Canvas** (`{colors.canvas}` — #f5f5f5): Page floor and header (with backdrop-blur).
- **Canvas Soft** (`{colors.canvas-soft}` — #fafafa): Alternating bands, shelf column wash, empty-state fill.
- **Card** (`{colors.card}` — #ffffff): Poster cards, shelf cards, dialog, popover.
- **Secondary** (`{colors.secondary}` — #f0efed): Badges, icon plates, hover washes on transparent controls.

### Hairlines
- **Hairline** (`{colors.hairline}` — #e7e5e4): Default 1px divider, section rules, card rings.
- **Hairline Strong** (`{colors.hairline-strong}` — #d6d3d1): Outline-pill borders, input borders; cards strengthen to this on hover.

### Text
- **Ink** (`{colors.ink}` — #0c0a09): Display, primary text.
- **Body** (`{colors.body}` — #4e4e4e): Running text (used in muted contexts).
- **Muted** (`{colors.muted}` — #777169): Secondary text, eyebrows, counts, captions.
- **Muted Soft** (`{colors.muted-soft}` — #a8a29e): Disabled / placeholder.

### Atmospheric Orbs (signature — decoration only)
- **Mint** (`{colors.orb-mint}` — #a7e5d3): Movies.
- **Sky** (`{colors.orb-sky}` — #a8c8e8): TV.
- **Lavender** (`{colors.orb-lavender}` — #c8b8e0): Anime; also an ambient secondary orb.
- **Peach** (`{colors.orb-peach}` — #f4c5a8): Books.
- **Rose** (`{colors.orb-rose}` — #e8b8c4): Ambient secondary orb on every page.

These appear ONLY as soft radial-gradient orbs (`.orb` + `.orb-*` classes) in the fixed `Atmosphere` layer and on the sign-in card. Never as button fills, never as text colors, never as card surfaces.

### Semantic
- **Destructive** (`{colors.destructive}` — #dc2626): Delete actions (used as a ghost-tinted pill, never a solid fill).
- **Ring** (`{colors.ring}` — #292524): Focus ring.

## Typography

### Font Families
**Newsreader Variable** is the open-source editorial display serif, used at weight 300 — the brand signature. **Hanken Grotesk Variable** is the humanist body sans at 400/500. Both ship via `@fontsource-variable` and are imported in `src/styles/app.css`. Fallbacks: `EB Garamond`, `Georgia`, `Times New Roman` for serif; `ui-sans-serif`, `system-ui` for sans.

### Hierarchy

| Token | Family | Size | Weight | Use |
|---|---|---|---|---|
| `{typography.display-hero}` | Newsreader | clamp(2.5rem,6vw,4rem) | 300 | Home masthead headline |
| `{typography.display-section}` | Newsreader | 1.5rem | 300 | Section headers, shelf column titles, dialog title |
| `{typography.wordmark}` | Newsreader italic | 1.5rem | 300 | Header + sign-in "epilog" |
| `{typography.title-md}` | Hanken Grotesk | 15px | 500 | Card titles, list labels |
| `{typography.body-md}` | Hanken Grotesk | 15px | 400 | Default body |
| `{typography.body-sm}` | Hanken Grotesk | 13px | 500 | Card metadata, pill labels |
| `{typography.caption}` | Hanken Grotesk | 12px | 400 | Photo captions, small meta |
| `{typography.eyebrow}` | Hanken Grotesk | 11px | 600 | Tracked uppercase section labels ("The Library", "Search", "Status") |
| `{typography.button}` | Hanken Grotesk | 13px | 500 | All pill CTAs |

### Principles
- **Display weight stays at 300.** Never bold display copy — that shifts the voice from editorial to consumer-marketing.
- **Italic is reserved for the wordmark.** Newsreader italic only on "epilog".
- **Eyebrows are tracked uppercase** at 0.12–0.18em letter-spacing — the print-magazine section label.
- **Counts are tabular-nums** so they don't jitter as data changes.

## Layout

### Spacing
- **Page padding:** 20px (mobile) / 32px (desktop) horizontal; 32px / 48px vertical.
- **Container:** max-width 1152px (`max-w-6xl`), centered.
- **Masthead → content:** 48px (mobile) / 64px (desktop).
- **Between sections:** 20px (mobile) / 24px (desktop) within the status stack; sections themselves separated by generous internal padding.

### Grid
- Poster grid: 3-up mobile → 4-up tablet → `auto-fill, minmax(10rem, 1fr)` desktop.
- Shelf view: single swipeable column mobile/tablet, 3-column desktop with 20px gaps.
- List view: full-width rows divided by hairlines.

## Elevation & Depth

The system uses **hairline + soft drop**. Cards float via 1px rings and two shadow tiers. Atmospheric depth comes from the drifting orbs; printed depth comes from the film-grain overlay.

| Level | Treatment | Use |
|---|---|---|
| Flat | `{colors.canvas}` | Page floor, header |
| Wash | `{colors.canvas-soft}` at 40–60% | Shelf columns, empty states, row hover |
| Card | `{colors.card}` + 1px `{colors.border}` ring | Poster cards, shelf cards, dialog |
| Soft drop | `{shadows.soft}` | Active view-switcher slot, search input, primary pills |
| Lift | `{shadows.lift}` | Hovered cards, hovered shelf cards, dialog, sign-in card |
| Orb | radial-gradient `.orb-*` (blur 72–88px) | Atmospheric depth only — never a surface |
| Grain | SVG fractalNoise, 4% opacity, overlay blend | Global printed-paper feel (`body::after`) |

### Decorative Depth
- **Media-reactive orbs** are the brand's strongest atmospheric pattern. The `Atmosphere` component in `src/routes/_auth.tsx` renders three orbs: the primary (hue from `{orb-by-media-type}`), an ambient rose, and an ambient lavender — each on its own drift animation so they never sync.
- **Film grain** is a fixed full-viewport `body::after` layer sitting above content (z-100) but `pointer-events: none`, so it never intercepts interaction.

## Shapes

| Token | Value | Use |
|---|---|---|
| `{radius.base}` | 0.75rem (12px) | Default shadcn surface scale root |
| `{radius.xl}` | 16px | Poster cards, shelf cards, shelf columns, empty states |
| `{radius.2xl}` | ~22px | Dialog |
| `{radius.pill}` | 9999px | Every CTA, badge, selector, search input, view-switcher |

## Components

### Atmosphere (`src/routes/_auth.tsx`)
Fixed full-viewport `z-0` layer with three drifting orbs. The primary orb's class is selected from `orbByType` by the current `?type=` search param. Sits behind the header and main content (which are `z-10+`).

### Header (`src/components/header.tsx`)
Sticky `z-30`, 64/72px tall, `{colors.canvas}` at 70% opacity with `backdrop-blur-md`, 1px bottom hairline. Italic Newsreader wordmark left (opacity dims to 70% on hover). Right: pill outline Search button, circular outline ThemeToggle, circular outline avatar with dropdown. No subtitle.

### LibraryMasthead (`src/components/media-content-filters.tsx`)
**The headline is the filter.** Renders "The *films* / *shows* / *anime* / *books* you keep." where each noun is a `<button>`:
- Active noun: solid ink, animated underline grows to 100%.
- Inactive noun: muted at 55%, underline grows on hover.
- Count as a `<sup>` superscript in Hanken Grotesk.
Beneath: a hairline rule filling the row with the view-switcher pill control right-aligned. The whole masthead replays `reveal-up`/`reveal-fade` on media-type change (`key={type}`).

### MediaSectionByStatus (`src/components/media-section-by-status.tsx`)
Editorial section header: Newsreader 2xl title, tabular count, hairline rule filling remaining width, ghost caret collapse button. Body is a poster grid (grid view) or `divide-y` hairline rows (list view). Empty state is a dashed-border canvas-soft panel.

### MediaCard (`src/components/media-card.tsx`)
Poster card, aspect 2/3, `{radius.xl}`, 1px `{colors.border}` ring strengthening to `{colors.hairline-strong}` on hover with `{shadows.lift}`. Poster scales 1.04 over 700ms on hover (search/add mode only). Add mode shows a blurred ink overlay with a white pill "Add" button. Metadata: 13px medium title + 12px tabular year.

### ListCard (`src/components/list-card.tsx`)
Full-width row inside a `border-y divide-y` stack. Poster 64×96 rounded-md. Newsreader `lg` title + tabular year. Hover tints to `{colors.canvas-soft}` at 60%.

### ShelfColumn / ShelfCard (`src/components/shelf-column.tsx`, `shelf-card.tsx`)
Column: `{colors.canvas-soft}` 40% wash, 1px hairline, `{radius.xl}`, bottom-divided header with a circular `{colors.secondary}` icon plate + Newsreader title + tabular count. Card: `{colors.card}`, 1px ring, `{radius.xl}`, hover `{shadows.lift}` + ring strengthens, poster 56×80 scaling on hover.

### LogDetailsDialog (`src/components/log-details-dialog.tsx`)
`{radius.2xl}`, 1px hairline, `{shadows.lift}`. Newsreader `xl` title. Status selectors are pill buttons (ink primary active / hairline-outline inactive). Footer divided by a top hairline: destructive ghost-tinted pill left, Cancel outline + Save ink pill right.

### Search (`src/components/search-input.tsx`, `search-media-buttons.tsx`, `*_results.tsx`)
- Input: 48px pill, hairline-strong border, `{shadows.soft}`, left-inset magnifier, focuses to ink border.
- Media buttons: pill selectors under an eyebrow "Select media type".
- Results header: eyebrow "Search Results" + tabular count + hairline rule filling width.
- Empty/no-results: dashed-border canvas-soft panel with Newsreader message.

### SignIn (`src/routes/sign-in.tsx`)
The signature atmospheric moment: four drifting orbs (mint, peach, lavender, sky) behind a `{radius.2xl}` translucent card (`{colors.card}` 80% + `backdrop-blur-md`) with `{shadows.lift}`. Italic Newsreader wordmark at 5xl, eyebrow subtitle, ink pill Google CTA with the four-color Google glyph. Card uses `reveal-up` with 120ms delay.

### EmptyState / NoSearchFound
Dashed `{colors.hairline-strong}` border, `{colors.canvas-soft}` 50% wash, `{radius.xl}`, centered type-icon + Newsreader message.

## Motion

- **Orb drift:** two independent timelines (26s / 32s, `ease-in-out alternate infinite`) so orbs never sync. `translate3d` + `scale` only — GPU-friendly.
- **Page reveal:** `reveal-up` (0.9s, `cubic-bezier(0.22,1,0.36,1)`) and `reveal-fade` (1.1s) on masthead/eyebrow; the masthead replays on media-type change via `key={type}`.
- **Hover lifts:** 300ms `transition-all` for cards/shelves; poster scale is 700ms `ease-out` for a slower, editorial reveal.
- **Theme cross-fade:** sun/moon swap with 300ms rotate + scale.

## Dark Mode

Dark mode inverts to a warm near-black canvas (`#0c0a09`) with `#1c1917` cards and `#f5f5f5` ink. Borders become `rgba(245,245,245,0.1)`, hairline-strong `rgba(245,245,245,0.18)`. The primary pill inverts to white-on-ink. Orbs switch blend mode from `multiply` to `screen` and blur widens to 88px so they read as glow rather than stain. The grain overlay and all component geometry carry over unchanged.

## Responsive Behavior

| Width | Key Changes |
|---|---|
| < 640px | Hero `clamp` floors at 2.5rem; poster grid 3-up; shelf single swipeable column; header subtitle hidden. |
| 640–1024px | Poster grid 4-up; shelf still single column with swipe. |
| ≥ 1024px | Poster grid `auto-fill minmax(10rem,1fr)`; shelf 3-column; container caps at 1152px. |

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` (ink pill) for primary actions.
- Use Newsreader at weight 300 for all display. Italic only on the wordmark.
- Bind the primary orb hue to the active media type via `orbByType`.
- Use the pill shape for every CTA, badge, and selector.
- Use `{shadows.soft}` for resting interactive surfaces and `{shadows.lift}` for hover/dialog.
- Keep counts `tabular-nums`.

### Don't
- Don't introduce a saturated brand action color. Ink pill is the only primary fill.
- Don't bold display copy.
- Don't use orbs as button fills, text colors, or card surfaces — they are pure atmosphere.
- Don't use sharp 0px radius on CTAs.
- Don't drop body Hanken Grotesk below 400.
- Don't sync orb animations — keep the two drift timelines at different durations.

## Files of Record
- `src/styles/app.css` — all tokens, orb classes, grain overlay, animations.
- `src/routes/_auth.tsx` — `Atmosphere` + orb-by-type mapping.
- `src/components/media-content-filters.tsx` — `LibraryMasthead` (headline-as-filter).
- `DESIGN.md` — this document.
