---
name: new-feature
description: Use when the user wants to add a new page, feature, section, or "surprise" to the forHer dashboard (e.g. "add a page for X", "create a new anniversary surprise", "build a page like wrapped but for Y"). Walks through requirements, delegates the build to the page-builder agent, then runs a design-auditor pass and reports what changed.
---

# New Feature — forHer

This skill turns a feature request into a working page that matches the rest of **forHer**: vanilla HTML/CSS/JS, Spotify-dark-purple theme, no frameworks. It exists so every new page goes through the same checklist instead of ad hoc invention each time.

## Steps

1. **Clarify scope, but don't stall on it.** If the user's request already specifies enough (what the page is about, roughly what it shows), don't interrogate them — infer reasonable defaults from `CLAUDE.md` and existing pages (e.g. `pages/anniversary/` for a multi-section story-style page, `pages/wrapped/` for a swipeable stats page, `pages/cards/` for a simple single-purpose page). Only ask a clarifying question if the request is genuinely ambiguous about *what* to build, not *how*.

2. **Read `CLAUDE.md`** to pick up the current directory conventions, design tokens, and Hard Stops — it is the canonical source and may have changed since last time.

3. **Delegate the build to the `page-builder` agent** (via the Agent tool). Give it: the feature description, the target folder name (kebab-case), which existing page is the closest structural precedent, and whether it should be linked from the home dashboard's nav grid (`assets/data/cardsData.json`) or reached another way (like `pages/highlights/` is).

4. **Run the `design-auditor` agent** against the newly created files once the build finishes. Treat any Hard Stop violation as blocking — send it back to `page-builder` (or fix directly) before calling the feature done.

5. **Verify in-browser if this is a UI-visible change** — open `index.html` (or the new page) and click through the golden path. If you can't run a browser, say so explicitly rather than claiming it works.

6. **Report back**: what was created, whether it's linked from the dashboard, and the audit result (clean, or what was fixed).

## When NOT to use this skill
For a copy/content tweak on an existing page (swap a date, change a note string, fix a typo), just edit directly — this skill is for net-new pages/sections, not small edits.
