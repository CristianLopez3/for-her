---
name: design-review
description: Use before committing/pushing forHer changes, or when the user asks to "review", "check", or "audit" the current work — runs a git-diff-aware design and code-quality pass against the rules in CLAUDE.md and reports Hard Stop violations vs. minor drift before anything gets committed.
---

# Design Review — forHer

A pre-commit quality gate for **forHer**. It exists because this project has explicit "Hard Stops" in `CLAUDE.md` (no frameworks, no palette drift, no cross-page imports, no shared assets stranded in a page folder) that are easy to violate accidentally when moving fast on a single feature.

## Steps

1. **Scope the review to what actually changed.** Run `git status` and `git diff` (staged + unstaged) to find the touched files. If nothing is staged/changed, ask what to review instead of auditing the whole repo — this skill is meant to be fast and targeted.

2. **Read `CLAUDE.md`** for the current rules — don't rely on memory, it gets edited.

3. **Run the `design-auditor` agent**, scoped to the changed files/pages from step 1, not the whole repository (unless the user explicitly asked for a full-repo audit).

4. **Sanity-check manually** for things an automated grep pass can miss:
   - Does new copy/content match the relationship-dashboard tone (personal, warm) rather than generic placeholder text?
   - Do new interactive elements (buttons, cards) have visible hover states and, where relevant, `aria-*`/`alt` attributes?
   - If JSON data files were added/edited, is the JSON valid and does it match the shape the JS expects?

5. **Report as a punch list**, split into:
   - **Must fix before commit** (Hard Stop violations)
   - **Should fix** (drift from established patterns)
   - **Fine as-is**

6. If the user wants fixes applied, apply the "must fix" items directly; leave "should fix" items to the user's judgment unless they ask you to take all of them.

## When NOT to use this skill
Not needed for read-only questions ("what does this page do") or for reviewing someone else's PR on GitHub — for a GitHub PR, use the `/review` skill instead.
