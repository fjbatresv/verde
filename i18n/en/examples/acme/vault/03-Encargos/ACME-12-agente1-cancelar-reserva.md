---
tipo: encargo
issues: [ACME-12]
responsable: agente1
operador: Ana
estado: entregado
fecha: 2026-11-17
---

# Brief · ACME-12 Cancel a booking — agente1

| Field | Value |
| --- | --- |
| Origin | E3 backlog, approved by Marta (PO). Rules: D-004 (never deleted), D-006 (only before it starts), D-003 (time zone) |
| Owner | `agente1`, operated by Ana |
| Reviewer | Diego (PM) |
| Issues | ACME-12 |
| Branch | `feat/ACME-12-cancelar-reserva` from `main` |
| Worktree | A new one, only for this brief |
| Delivery | `docs/prs/ACME-12-cancelar-reserva.md` and the PR |
| Scope | `api/bookings/`, `web/my-bookings/` and their tests. Migrations: no (the `cancelada` status already exists). New dependencies: no |
| Environment | Docker free: it can start the full stack |

Read the repo's `AGENTS.md` before starting. This vault is read-only.

## Goal

Whoever created a future booking can cancel it from "My bookings". Cancelling
sets the status to `cancelada` (D-004) and frees the room. A booking that
already started cannot be cancelled (D-006).

## Acceptance criteria

| AC | Criterion | Expected evidence |
| --- | --- | --- |
| AC1 | Whoever created a future booking cancels it after confirming; it leaves the list and the room is free | e2e test + before and after screenshots |
| AC2 | A booking that already started cannot be cancelled: disabled button that explains why; the API returns `409` | Integration test + screenshot |
| AC3 | Nobody cancels someone else's booking: `403` and the booking does not change | Integration test with **two different users** |
| AC4 | "My bookings" with no axe violations on desktop and mobile | axe output |

## Out of scope

- Notifying invitees (if you think it is needed, ask).
- Changing a booking's time (ACME-13, in progress with Luis: do not touch
  `web/booking-form/`).
- Performance of "My bookings".

## If you get blocked

Write the question under "Open questions" in the PR file, push what you have
and stop.

## Delivery

`make gate` on your branch with `RESULT GREEN` (paste the output), PR file with
the evidence for each AC (desktop and mobile screenshots), push and
`gh pr create`. Do not merge.
