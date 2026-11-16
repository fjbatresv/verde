---
tipo: revision
issues: [ACME-12]
pr: 31
autor: agente1 + Ana (operadora)
revisor: Diego (PM)
resultado: integrado
ronda: 2
commit: 9b7d3f0
fecha: 2026-11-17
---

# Review · ACME-12 Cancel a booking

Brief: [[ACME-12-agente1-cancelar-reserva]] · Branch:
`feat/ACME-12-cancelar-reserva` · Commit: `4e1c9a2` (round 1), `9b7d3f0`
(round 2) · PR file: `docs/prs/ACME-12-cancelar-reserva.md`

## Verdict

Round 1: changes requested (R1–R3). **Round 2: approved by the reviewer**;
approved by Marta (PO) on Nov 18; merged by the PM (`2f6a8e1`).

## Acceptance criteria

| AC | Result | How I verified it (not just read it) |
| --- | --- | --- |
| AC1 | ✅ | I ran the e2e (3 passed) and repeated it by hand: I cancel the 15:00 booking and the room shows as free at that time in "Rooms" |
| AC2 | ❌ | The API returns `409` (I tried it with `curl` on an ongoing booking), but the disabled button does not explain why: see R2 |
| AC3 | ❌ | The test passes, but it creates and cancels with the same user. With a second user the API cancels someone else's booking: see R1 |
| AC4 | ❌ | 0 violations at 1440×900; at 390×844 the flow cannot be completed: see R3 |

## Live review (Playwright)

Environment: `dev` profile, `http://localhost:8080`, users `ana@acme.test` and
`bea@acme.test` · Sizes: 1440×900, 1280×800 (13") and 390×844

| Flow / screen | Result | Screenshot |
| --- | --- | --- |
| My bookings → Cancel → Confirm (desktop) | ✅ | ![[ACME-12-r1-cancelar-1440.png]] |
| Ongoing booking: disabled button | ❌ no explanation | ![[ACME-12-r1-en-curso.png]] |
| My bookings → Cancel → Confirm (mobile) | ❌ button off screen | ![[ACME-12-r1-confirmar-390.png]] |
| `bea` cancels `ana`'s booking through the API | ❌ `200` | — |

- Accessibility (axe): 0 violations on the three screens. axe does not catch the
  button without an explanation: I caught it with the screen reader
  ("Cancelar, dimmed").
- Console: no errors.
- States reviewed: empty list, ongoing booking, network error when cancelling
  (shows the error notice and the booking does not change).

## Gate

```text
head 4e1c9a2 · 2026-11-17 17:31:12
PASS format
PASS lint
PASS test
PASS build
PASS coverage
PASS ports-free
PASS infra
PASS e2e
PASS infra-down
SKIP snyk
RESULT GREEN · log tmp/gate.log
```

## What is good

- Cancelling sets the status to `cancelada` and does not delete the row
  (D-004).
- The D-006 rule is evaluated in the API, in UTC, and the web only reflects it
  (D-003).
- The confirmation dialog returns focus to the button when it closes, and `Esc`
  closes it.
- `web/booking-form/`, in progress in ACME-13, was not touched.

## Changes requested

| # | Severity | Where | Problem | What is expected |
| --- | --- | --- | --- | --- |
| R1 | blocking | `api/bookings/bookings.service.ts` and `bookings-cancel.int.spec.ts` | The service compares the owner with the `userId` in the request body, not with the session's. The AC3 test creates and cancels with the same user, so it passes anyway. With `bea@acme.test`, the API cancels `ana@acme.test`'s booking (`200`) | The owner comes from the session. The test uses two users and fails without the fix |
| R2 | major | My bookings, ongoing booking | The button is disabled with no text or hint. AC2 asks for it to explain why | Visible text that explains the reason, linked to the button for screen readers |
| R3 | major | My bookings, confirmation dialog at 390×844 | "Sí, cancelar" ends up below the edge of the screen and you cannot scroll to it | The dialog's actions always visible on mobile; the e2e also runs on mobile |

## Observations that do not block

| # | Severity | Observation | Destination |
| --- | --- | --- | --- |
| N1 | minor | The toast says "Reserva eliminada" (booking deleted); per D-004 it is not deleted | This round: same file as R2 |
| N2 | note | "My bookings" runs one query per booking to load the room. It predates this PR | Maintenance brief ACME-16 |

## Answers to "Open questions"

1. **Notify invitees when cancelling?** The PO decides. I talked it over with
   Marta on Nov 18: not in this delivery. It becomes D-007 and ACME-15 in the
   backlog. The PR does not change.

## Round 2 (`9b7d3f0`)

Gate: RESULT GREEN (run by the reviewer, 2026-11-18 12:02) · CI: green

| # | Result | How I verified it |
| --- | --- | --- |
| R1 | ✅ | With `bea@acme.test`, `POST /bookings/{id}/cancel` on `ana`'s booking → `403` and the booking stays `confirmada`. I reverted only the service change and the new test fails |
| R2 | ✅ | Visible text "Ya empezó: no se puede cancelar" (already started: cannot be cancelled); the screen reader reads it with the button. ![[ACME-12-r2-en-curso.png]] |
| R3 | ✅ | At 390×844 and at 320×640 the actions stay pinned at the bottom; the e2e runs on mobile. ![[ACME-12-r2-confirmar-390.png]] |
| N1 | ✅ | The toast says "Reserva cancelada" (booking cancelled) |
| N2 | — | In the backlog as ACME-16 |

No new findings. AC1 to AC4: ✅.

## PO decision

Approved by Marta, 2026-11-18.

## After the merge

Squash `2f6a8e1` · tag `archive/feat/ACME-12-cancelar-reserva` · decisions
recorded: D-007
