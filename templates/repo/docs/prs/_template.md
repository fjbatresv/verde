# <KEY>-<n> · <title>

**Branch:** `feat/<KEY>-<n>-<slug>`
**Author:** <agent or person>
**Date:** YYYY-MM-DD
**Assignment:** `03-Encargos/<file>.md` (vault)
**Issues:** <KEY>-<x>, <KEY>-<y>

## Summary

<What this PR delivers, in 3–5 lines.>

## Changes

| File | Change |
| ---- | ------ |

## Acceptance criteria — evidence

| AC  | Result | Evidence (command / output / screenshot) |
| --- | ------ | ---------------------------------------- |

## UI evidence

<For UI changes: one screenshot per affected screen (light/dark, desktop/mobile
if relevant) and the accessibility check result (axe: 0 violations). Write
"No UI changes" otherwise.>

## Gate result

```text
<paste the PASS/FAIL lines and the RESULT line of `make gate` on the head commit>
```

## Decisions taken

<Cite existing decisions as D-xxx. New decisions are proposed here; the PM
records them in the vault.>

## Open questions

## Out of scope / follow-ups

## Definition of Done

- [ ] All AC verified with evidence
- [ ] `make gate` → RESULT GREEN on the head commit
- [ ] UI evidence (screenshots + axe) or "No UI changes"
- [ ] Docs updated
- [ ] No secrets, no `--no-verify`, no `--force`
- [ ] Reviewed by PM — _only the PM ticks this_
- [ ] Approved by PO — _only the PO ticks this_

<!-- Review rounds: append "## Round N (<sha>)" sections below with a table
answering each finding by ID (R1, R2, N1…): what you changed (commit) or why
you disagree (evidence). -->
