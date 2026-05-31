# forHer — Claude Context

## Project Mission
Personal romantic relationship dashboard — reminders, personal details, and intimate experiences presented as a gift to a partner.
Aesthetic target: Spotify-inspired dark UI with polished micro-interactions and responsive layouts.

## Tech Stack — Hard Rules
- Vanilla HTML5, CSS3, modern JavaScript (ES6+) only.
- **No frameworks** (React/Vue/Angular/Svelte) and **no external UI libraries** (Bootstrap/Tailwind/etc.).
- Static, multi-page architecture. No build tooling.

## Spotify Design Tokens (canonical — enforce on all pages)
```css
--bg-base: #121212
--text-primary: #FFFFFF
--accent-green: #1DB954
--accent-green-light: #1ED760
--surface: #181818
--surface-soft: #282828
--radius: 12px  /* or 16px */
```

## Directory Structure

```
forHer/
├── index.html              # home dashboard (profile header, highlights row, cards grid, modal)
├── style.css               # home-page layout overrides only
├── CLAUDE.md
├── assets/
│   ├── css/
│   │   ├── theme.css       # color palette, CSS variables, typography tokens ← single source of truth
│   │   ├── base.css        # resets, body defaults, box-sizing
│   │   ├── components.css  # buttons, cards, modals, grids
│   │   └── animations.css  # shared animation/transition utilities
│   ├── js/
│   │   ├── app.js          # original combined (being phased out)
│   │   ├── dom.js          # helpers: qs, qsa, createElement, safeFetch, toggleClass
│   │   └── home.js         # home dashboard card rendering + invitation modal
│   └── img/                # global shared images/icons
└── pages/
    ├── aniversary-pinterest/   # 12 images, style.css, app.js
    ├── cards/                  # background.png, icon.png, style.css (JS folder empty)
    ├── highlights/             # carousel.html, highlightsData.json, audio assets, dual CSS, app.js + carousel.js
    ├── spotify/                # 3 MP3s, 4 images, style.css, app.js, player.js, carousel.js
    ├── spotify-notes/          # 7 note images, style.css, app.js
    ├── we-see-each-other/      # 2 images, style.css, app.js
    └── wrapped/                # wrapped.json, 17 month-themed images, wrapped.css, wrapped.js
```

## CSS Organization Rules
- `assets/css/theme.css` is the **single source of truth** for palette tokens — never duplicate tokens in page CSS.
- Load Google Fonts **once** in `base.css` — never repeat in page-level CSS.
- Page CSS (`pages/[page]/assets/css/`) contains page-specific layout/content tweaks only.
- **Never `@import` between page folders.** All cross-page sharing goes through `assets/css/`.
- Prefer `<link>` tags in HTML over `@import` inside CSS files.
- Reference implementation for Spotify style: `pages/spotify/assets/css/style.css`.

## JS Organization Rules
- `assets/js/` = shared helpers only (`dom.js`, `modal.js`, etc.).
- `pages/[page]/assets/js/` = feature-specific scripts only.
- One `DOMContentLoaded` listener per page script.
- Use class-based state toggles — no direct inline style manipulation.
- Large static data → JSON files in `pages/[page]/assets/data/`.
- No inline `onerror` in generated HTML — use a reusable fallback image helper.

## Naming Conventions
- Files/folders: `kebab-case` (except `index.html`).
- JS identifiers: `camelCase`.
- CSS classes: `kebab-case` with semantic names (`.card`, `.hero-header`, `.button-primary`).

## Component Patterns
- **Buttons:** green accent (`--accent-green`), rounded corners, clear hover states.
- **Cards:** dark surface (`--surface`), border, `--radius`, consistent spacing.
- **Modals:** overlay + centered panel + close button + `Esc` key support.
- **Navigation/back:** subtle icon buttons with text labels.
- **Responsive grid:** `auto-fit` / `minmax()`, breakpoints at 520px and 768px.

## Animation Rules
- `transition` for hover/focus states; `animation` for entrance/exit or story progress.
- Shared animation classes live in `assets/css/animations.css` (`.fade-in`, `.slide-up`, `.pulse`, `.shake`).
- Always include `@media (prefers-reduced-motion: reduce)` overrides.
- Animate `transform` and `opacity` only — avoid animating layout properties.

## Refactor Status (as of 2026-05-30)
**Done:** `theme.css`, `base.css`, `components.css`, `animations.css`, `dom.js`, `home.js`, `player.js`, `carousel.js` (spotify page).

**Still pending:**
- `assets/js/modal.js` — shared modal behavior not yet extracted.
- Update all page `index.html` files to load shared CSS via `<link>` instead of cross-page `@import`.
- Remove duplicate Google Fonts `@import` from each page stylesheet.
- Clean up or remove original `assets/js/app.js` once `home.js` covers all its responsibilities.
- Clean up empty `pages/cards/assets/js/` folder.

## Hard Stops
- Never use external UI libraries or frameworks.
- Never deviate from the Spotify color palette.
- Never store cross-page shared assets inside a page folder.
- Never import from one page's CSS/JS into another page's CSS/JS.
