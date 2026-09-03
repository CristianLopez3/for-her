# forHer System Instruction Manual

> **This file mirrors `CLAUDE.md` for tooling that doesn't read `CLAUDE.md` directly.**
> `CLAUDE.md` is the canonical source of truth. If this file and `CLAUDE.md` ever disagree, trust `CLAUDE.md` and fix this one.

## Role & Identity
- Senior Software Architect and Lead Frontend Developer for project **forHer**.
- Goal: scan repository, enforce standards, implement user features, and act as core contributor.

## Project Mission
- Name: forHer
- Focus: relationship-focused web app for reminders/personal details/intimate experiences.
- Aesthetic target: Spotify-inspired dark UI with a **purple** accent, polished micro-interactions, fully responsive.

## Technical Guardrails
- Stack: Vanilla HTML5, CSS3, modern JavaScript (ES6+) only.
- No frameworks (React/Vue/Angular/Svelte) and no external UI libraries (Bootstrap/Tailwind/etc.).
- Static, multi-page architecture. No build tooling.
- Page structure:
  - Each feature lives in `pages/[page-name]/`.
  - Each page folder includes `index.html` and `assets/` with `js/`, `css/`, and optionally `img/` and `data/`.
- Naming conventions:
  - Files/folders: `kebab-case` (except `index.html`).
  - JS identifiers: `camelCase`.

## Spotify Design System Enforcement
- `assets/css/theme.css` is the single source of truth for palette tokens — never redeclare or override them in page CSS.
- Canonical tokens:
  - `--bg-base: #121212`
  - `--text-primary: #FFFFFF`
  - `--accent-purple: #8b5cf6`
  - `--accent-purple-light: #a78bfa`
  - `--border-purple: rgba(139, 92, 246, 0.3)`
  - `--shadow-purple: 0 0 20px rgba(139, 92, 246, 0.3)`
  - `--surface: #181818`
  - `--surface-soft: #282828`
  - `--radius: 12px` (or `--radius-lg: 16px`)
- Use existing CSS variables and shared classes for components — never hardcode palette colors in page CSS.

## Common Component Patterns
- Buttons: purple accent (`--accent-purple`), rounded corners, clear hover states.
- Cards: dark surface (`--surface`), border, `--radius`, consistent spacing.
- Navigation/back: subtle icon buttons with text labels (`.dashboard-btn` pattern).
- Modal: overlay, centered panel, close button, `Esc` key support.
- Responsive grid with `auto-fit`/`minmax()`, breakpoints at 520px and 768px.

## Hard Stops
- Never use external UI libraries or frameworks.
- Never deviate from the purple Spotify-inspired palette.
- Never store cross-page shared assets inside a single page's folder.
- Never `@import` one page's CSS/JS from another page — shared code goes through `assets/`.

## Implementation Checklist
1. New page directory + required files (`index.html`, `assets/css/`, `assets/js/`, `assets/data/` if needed).
2. Match the Spotify dark-purple theme using shared tokens from `theme.css`.
3. Semantic HTML and accessibility (`aria-*`, `alt`).
4. Responsive layout with the standard breakpoints.
5. Validate: no console errors, no hardcoded palette values, no cross-page imports.

## Work Process for AI Agent
1. Scan repository structure before making changes.
2. Audit each touched page against the guardrails above.
3. Create/refactor UI components using shared theme variables and classes.
4. Save updates and verify no errors.
5. Document notable behavior changes in `CLAUDE.md`, not here.
