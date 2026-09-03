# forHer — Claude Context

## Project Mission
Personal romantic relationship dashboard — reminders, personal details, and intimate experiences presented as a gift to a partner.
Aesthetic target: Spotify-inspired dark UI with polished micro-interactions and responsive layouts.

## Tech Stack — Hard Rules
- Vanilla HTML5, CSS3, modern JavaScript (ES6+) only.
- **No frameworks** (React/Vue/Angular/Svelte) and **no external UI libraries** (Bootstrap/Tailwind/etc.).
- Static, multi-page architecture. No build tooling.

## Design Tokens (canonical — enforce on all pages)
```css
--bg-base: #121212
--text-primary: #FFFFFF
--accent-purple: #8b5cf6
--accent-purple-light: #a78bfa
--border-purple: rgba(139, 92, 246, 0.3)
--shadow-purple: 0 0 20px rgba(139, 92, 246, 0.3)
--surface: #181818
--surface-soft: #282828
--radius: 12px  /* or 16px */
```

## Directory Structure

```
forHer/
├── index.html              # home dashboard (hero header, anniversary banner, nav grid, note card, moments slideshow + modal)
├── style.css                # home-page layout overrides only
├── CLAUDE.md
├── assets/
│   ├── css/
│   │   ├── theme.css       # color palette, CSS variables, typography tokens ← single source of truth
│   │   ├── base.css        # resets, body defaults, box-sizing, Google Fonts @import (Poppins, Tangerine)
│   │   ├── components.css  # shared buttons (.dashboard-btn), auto-grid, font-weight utilities
│   │   └── animations.css  # shared animation/transition utilities (.fade-in, .slide-up, .pulse, .shake)
│   ├── data/
│   │   └── cardsData.json  # nav-grid cards shown on the home dashboard (title, description, icon, route)
│   ├── js/
│   │   └── app.js          # home dashboard: hero counter, nav grid render, note rotation, moments slideshow/modal, invitation modal
│   └── img/                 # global shared images/icons (icons/, stories/)
└── pages/
    ├── anniversary/            # one-year anniversary experience: banner, timeline, wrapped, rewards, looking-forward (see anniversary.md)
    ├── aniversary-pinterest/   # 12 images, style.css, app.js
    ├── cards/                  # love-letter card page: background.png, icon.png, style.css (JS folder currently empty — see Refactor Status)
    ├── highlights/             # carousel.html, highlightsData.json (consumed directly by home moments slideshow), audio assets, app.js + carousel.js
    ├── spotify/                # 3 MP3s, 4 images, style.css, app.js, player.js, carousel.js
    ├── spotify-notes/          # 7 note images, style.css, app.js
    ├── we-see-each-other/      # 2 images, style.css, app.js
    └── wrapped/                # wrapped.json, month-themed images, wrapped.css, wrapped.js
```

Not every page is linked from `cardsData.json` — `pages/highlights/` is consumed directly by the home page's moments slideshow, not shown as a nav card.

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
- **Buttons:** purple accent (`--accent-purple`), rounded corners, clear hover states.
- **Cards:** dark surface (`--surface`), border, `--radius`, consistent spacing.
- **Modals:** overlay + centered panel + close button + `Esc` key support.
- **Navigation/back:** subtle icon buttons with text labels.
- **Responsive grid:** `auto-fit` / `minmax()`, breakpoints at 520px and 768px.

## Animation Rules
- `transition` for hover/focus states; `animation` for entrance/exit or story progress.
- Shared animation classes live in `assets/css/animations.css` (`.fade-in`, `.slide-up`, `.pulse`, `.shake`).
- Always include `@media (prefers-reduced-motion: reduce)` overrides.
- Animate `transform` and `opacity` only — avoid animating layout properties.

## Refactor Status (as of 2026-09-02)
**Done:** `theme.css`, `base.css`, `components.css`, `animations.css` extracted as the shared source of truth; `player.js`, `carousel.js` (spotify page) extracted as feature-specific scripts.

**Still pending / known drift — verify current state before relying on these:**
- `assets/js/` has no `dom.js` or dedicated `modal.js` helper yet — `assets/js/app.js` currently owns hero rendering, nav grid, note rotation, the moments slideshow/modal, and the invitation modal all in one file. Extracting shared DOM/modal helpers is still open.
- Not every page `index.html` loads shared CSS purely via `<link>` — audit before assuming compliance (`Design Review` process below).
- Google Fonts is loaded once in `base.css`; verify no page CSS re-imports it before adding a new page.
- `pages/cards/assets/js/` is empty — either implement the page's script there or fold its behavior elsewhere.
- `SYSTEM_INSTRUCTIONS.md` and `.github/copilot-instructions.md` mirror the rules in this file for tools that don't read `CLAUDE.md` directly (older Copilot-era docs). **This file is canonical** — if they ever disagree, fix the other files, don't follow them.

## Hard Stops
- Never use external UI libraries or frameworks.
- Never deviate from the Spotify color palette.
- Never store cross-page shared assets inside a page folder.
- Never import from one page's CSS/JS into another page's CSS/JS.
