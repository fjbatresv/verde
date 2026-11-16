# Reviewer guide

How a delivery is reviewed in this project (pillar **R** of VERDE). It works the
same for a person as for a reviewer agent.

> English translation of the template's `docs/guides/review.md`. File names,
> folder names and review states (`cambios-requeridos`…) keep their Spanish
> names, as they ship in the templates.

## The essentials

- **The reviewer is never the author.** Nor an agent of the same operator.
- **Verify, don't rediscover.** The author already wrote the evidence in their
  PR file; the reviewer checks it.
- **See the application.** A UI change is not approved by reading the diff.
- **Don't touch the PR's code.** Ask for the change; if the reviewer makes it,
  they stop being a reviewer and become a co-author.
- **Don't decide scope.** Whatever the brief does not decide goes to the PM.
- The review is written in the vault: `06-Revisiones/<KEY>-<n>-revision.md`,
  from `07-Plantillas/Plantilla-Revision.md`.

## 1. Prepare

1. Read the brief (`03-Encargos/…`) and the PR file (`docs/prs/…`).
2. Open a worktree **on the exact commit** you are going to review:

   ```sh
   git fetch origin
   git worktree add ../<PROJECT>-review-<KEY>-<n> <sha>
   ```

3. Start the environment as the runbook says, with test data that lets you walk
   through every criterion (for example, two different users if a criterion is
   about permissions).

## 2. Verify the evidence

- Run `make gate` on that commit. If it does not give `RESULT GREEN`, the review
  ends there with a blocking finding.
- For each criterion, reproduce **at least one** test from the evidence: the
  command, the test or the flow.
- Distrust evidence that would pass even if the code were wrong:
  - a permissions test that uses the same user on both sides;
  - mocked responses where the criterion asks for the real system;
  - empty assertions, or ones that only check that "it didn't blow up";
  - screenshots from another branch or from before the last commit.
- Answer the "Open questions" in the PR file. If one needs a decision, escalate
  it to the PM and write it down.

## 3. Read the diff

- **Scope:** nothing outside the brief. Anything extra is a finding, even if it
  is well done.
- **Decisions:** the code respects the cited `D-xxx` and ADRs.
- **Causes, not symptoms:** no new retries, longer timeouts, skipped tests
  (`skip`), relaxed assertions or design changes to silence a check.
- **Hygiene:** no secrets, no real `.env`, pinned versions, docs up to date.

## 4. Live review

Walk through every affected flow **as a new user would**, with Playwright (a
script, `codegen` mode or a browser MCP server). Save the screenshots in
`tmp/review/<KEY>-<n>/` and attach the relevant ones to the vault
(`99-Adjuntos/`).

What to look at, beyond the criteria:

| Aspect | What to look for |
| --- | --- |
| States | empty, loading, error, no permissions; disabled buttons that explain why |
| Text | the same terms across the app, spelling, error messages on the failing field |
| Formats | dates, times and time zone, numbers and currency |
| Sizes | desktop, 13" laptop and mobile: nothing off screen, no double scroll |
| Keyboard | visible focus, tab order, `Esc` closes dialogs |
| Accessibility | **axe** with no violations on every screen touched |
| Console | no new errors or warnings |
| Themes | light and dark, if the product has them |

Minimal review script (Node; adapt the URL and the flow):

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const out = 'tmp/review/ACME-12';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`my bookings · ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/my-bookings');
    await page.screenshot({ path: `${out}/my-bookings-${viewport.width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
}
```

## 5. Write the review

At the top, the **verdict** in one or two lines. Below, in this order:
criteria, live review, gate, what is good, findings and answers to the open
questions.

**Findings.** Each one has an ID, where it is, what happens and what is
expected:

| Severity | Means | ID | Blocks the merge? |
| --- | --- | --- | --- |
| **bloqueante** (blocking) | Cannot be merged, or prevents reviewing the rest (the gate red, a security or data fault) | `R1`, `R2`… | Yes |
| **mayor** (major) | A criterion is not met or there is a defect the user will see | `R…` | Yes |
| **menor** (minor) | Worth fixing, but does not prevent merging | `N1`, `N2`… | No: gets a destination |
| **nota** (note) | Information, a question or something to watch | `N…` | No |

- `R` findings are fixed in this PR. `N` findings get a **destination**: "this
  round if that file is touched", "maintenance brief <KEY>-<n>", "watch" or "no
  action".
- "What is expected" describes the expected result, not the patch: the author
  chooses how to get there.
- Start with "What is good". It tells the author what not to touch and records
  what was verified.

## 6. Rounds

If there are open `R` findings, the result is `cambios-requeridos` (changes
requested). The author fixes them on the same branch and answers each ID in a
"Round N" section of their PR file.

The reviewer adds to the same note a `## Ronda N (<sha>)` section with a table
that verifies **each** ID (✅ / ❌ and how it was checked), runs the gate again
and updates the verdict at the top. New findings in that round continue the
numbering (`R5`, `N3`…), they never restart it.

## 7. Review states

| State | Set by | Means |
| --- | --- | --- |
| `cambios-requeridos` (changes requested) | reviewer | There are open `R` findings. |
| `aprobado-por-revisor` (approved by reviewer) | reviewer | No open `R`; waiting for the PO. |
| `aprobado` (approved) | PO | Ready to merge. |
| `integrado` (merged) | PM | Squash merge done; the commit is noted under "Tras el merge" (after the merge). |

If the reviewer is an agent, a person with the reviewer or PM role signs the
move to `aprobado-por-revisor`.

## 8. Launching a reviewer agent

A worktree on the PR commit, one session per round and an operator other than
the one who launched the author:

```sh
git worktree add ../<PROJECT>-review-<KEY>-<n> <sha>
cd ../<PROJECT>-review-<KEY>-<n>
<agent> "You are the reviewer of PR <n>. Read AGENTS.md, docs/guides/review.md,
the brief ../<PROJECT>-vault/03-Encargos/<file>.md and docs/prs/<file>.md.
Follow the guide: run make gate, verify each criterion, review live with
Playwright and axe, and write the review from the template in
../<PROJECT>-vault/06-Revisiones/<KEY>-<n>-revision.md. Do not edit the code,
do not commit in the repo and do not approve: leave the result as
cambios-requeridos or aprobado-por-revisor for a person to sign."
```

The reviewer agent writes only its review note in the vault; the person who
signs it confirms it with their commit.

## 9. Calibrating the reviewer (seeded faults)

Before trusting a reviewer agent, and every time you change this guide, the
model or the tool, test it with faults you planted:

1. Create a branch `maint/<KEY>-<n>-calibracion` from an already merged PR.
2. Seed **four faults**, one of each kind:
   - visual, only visible live (a button off screen on mobile);
   - accessibility (insufficient contrast or a field without a label);
   - an unmet criterion with misleading evidence (a test that passes for the
     wrong reason);
   - logic or security, without UI (a permission the API does not check).
3. Write the list down **outside** the reviewer's reach (not in the repo or in
   the vault it reads).
4. Launch the reviewer with the branch's PR file, as if it were real.
5. Compare: did it find each fault? With what severity? All of them should come
   out as `R`.
6. Whatever it misses becomes a new line in this guide, in the prompt or in the
   brief. Repeat until it finds all four.

Save the result of each calibration in the vault (`06-Revisiones/`), with date,
model and faults detected: that way you can see whether a model change makes
the review worse.
