# AGENTS.md

> VERDE / VDD v1.0 project. Replace every `<PLACEHOLDER>` before the first
> assignment. Agents read this file first, then their assignment.

## Project

<PROJECT>: <one line on what the product is and who uses it>.

**Context (read-only, never write there):** the project vault is cloned next
to this repo at `../<PROJECT>-vault/`. Start at `00-Inicio.md`. The backlog is
`02-Backlog/Backlog.md`. Your assignment for each task is a file in
`03-Encargos/`. If something is not in the vault or in your assignment, it was
not decided: ask (see "If you are blocked").

## Roles

| Role | Who | You must… |
| --- | --- | --- |
| PO | <name> | Get final approval from them. |
| PM | <name or agent> | Ask them anything your assignment does not decide. The PM merges approved PRs. |
| Reviewer | <names or agents> | Expect a written review, including a live review of the UI with Playwright; answer each comment in your PR file. |
| Operator | <name> (the person who launched you) | They watch your session and are accountable for your delivery. Questions about scope go to the PM, not to them. |
| Architect (optional) | <name or agent> | Follow approved designs and ADRs in `docs/adr/`. |
| Dev | **you** | Implement only the issues in your assignment. |

Human developers follow the same workflow and rules as agents: assignment,
branch, gate, PR file, review by someone else.

## Workflow

1. Create the branch named in the assignment (`feat/<KEY>-<n>-<slug>` or
   `maint/<KEY>-<n>-<slug>`) from `main`.
2. One or more commits per issue, message `<KEY>-<n>: <imperative description>`
   (< 72 chars, no trailing period).
3. Run the gate: `make gate`. It must end with `RESULT GREEN`.
4. Create the PR file `docs/prs/<KEY>-<n>-<slug>.md` from
   `docs/prs/_template.md` with **evidence**: commands run and their relevant
   output, the gate output, and screenshots for any UI change.
5. Push your branch, open the PR with `gh pr create` and **stop**. Never merge.
6. On review feedback, start a **new session**, add commits on the same branch
   and append a "Round N" section to the PR file answering every comment. You
   may disagree with the review if you bring evidence.

## Hard rules

- Never merge, never push to `main`, never use `--force` or `--no-verify`.
- Never commit secrets or a real `.env`. Only `.env.example` with placeholders.
- Pin versions: exact dependency versions, exact Docker image tags, lockfile
  committed.
- Do not touch files outside the scope of your assignment. If you find
  something worth changing, list it under "Out of scope / follow-ups".
- Do not write to the vault.
- Fix causes, not symptoms. Do not add test retries or raise timeouts to hide a
  flaky test, and do not change a design (colors, variants) to silence a check.
- Decisions are cited by ID (`D-xxx`). If your work needs a decision that does
  not exist, write it under "Open questions" and stop.

## If you are blocked

Write the question under "Open questions" in your PR file, push what you have
and stop. Do not improvise scope.

## Context and token use

Each step re-reads the whole conversation, so a long session or noisy output
costs on every later step.

- One session per assignment and per review round. Your state lives in the
  branch and the PR file, not in the chat.
- Filter command output (`tail`, `grep`). Never paste full test, build or CI
  logs into the conversation; the gate keeps the full log in `tmp/gate.log`.
- Wait for remote CI with one blocking command (`gh pr checks <n> --watch
  --fail-fast`), never with a polling loop.

## Definition of Done

1. Every acceptance criterion verified, with evidence in the PR file.
2. `make gate` → `RESULT GREEN` on the head commit; output pasted in the PR file.
3. UI changes: screenshots of each affected screen and an accessibility check
   (axe) with no violations.
4. Docs updated (README, `.env.example`, guides).
5. Reviewed by the PM and approved by the PO.

## Commands

| Command | What it does |
| --- | --- |
| `make gate` | Local gate: runs `gate.steps`, prints PASS/FAIL per step and `RESULT GREEN|RED` |
| `<command>` | <what it does> |
