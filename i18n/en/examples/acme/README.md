# Worked example · ACME Salas

> English translation of [`examples/acme/`](../../../../examples/acme/README.md).
> File names, folder names and frontmatter keys keep their Spanish names, as
> they come from the templates.

A complete issue, from the backlog to the merge, written with the VERDE
templates. **ACME Salas** is a made-up product: an app to book meeting rooms.
Everything is fictional: people, dates, commits and outputs. The screenshots
the notes mention are not included.

## The team

| Role | Who |
| --- | --- |
| PO | Marta |
| PM and reviewer | Diego |
| Operator | Ana, who launches and watches `agente1` |
| Dev | `agente1` (agent, operated by Ana) and Luis (human dev) |

## The story of ACME-12 · Cancel a booking

Read it in this order:

1. **Backlog** · [`vault/02-Backlog/Backlog.md`](vault/02-Backlog/Backlog.md):
   the issue with verifiable criteria.
2. **Brief** ·
   [`vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md`](vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md):
   the only thing the agent receives, together with `AGENTS.md`.
3. **PR file, round 1** ·
   [`repo/docs/prs/ACME-12-cancelar-reserva.md`](../../../../examples/acme/repo/docs/prs/ACME-12-cancelar-reserva.md):
   the agent's evidence and an open question.
4. **Review** ·
   [`vault/06-Revisiones/ACME-12-revision.md`](vault/06-Revisiones/ACME-12-revision.md):
   the reviewer reproduces the evidence and finds that the permissions test
   passed for the wrong reason (`R1`), plus two problems that only show live
   (`R2`, `R3`).
5. **Decision** ·
   [`vault/04-Decisiones/Registro-de-decisiones.md`](vault/04-Decisiones/Registro-de-decisiones.md):
   the open question becomes `D-007` and a new issue.
6. **Round 2**, at the end of the PR file and of the review: every finding
   answered and verified by its ID.
7. **Day status** ·
   [`vault/08-Status/2026-11-19 Status.md`](vault/08-Status/2026-11-19%20Status.md):
   what was merged, what comes next and who has it.

## What to look at

- The criteria say **which evidence** proves them, and the review says **how it
  verified it**, not just that it read it.
- `R1` is the typical case: the evidence existed and the test passed, but it
  did not prove the criterion.
- `N2` is a problem older than the PR: it does not block, it goes to a
  maintenance brief.
- The agent does not decide what the brief does not say: it asks and stops.

The conventions of the Spanish files are tested with
`bash tests/examples.test.sh`.
