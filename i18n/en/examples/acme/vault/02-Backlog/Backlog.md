---
tipo: backlog
actualizado: 2026-11-19
---

# Backlog

**States:** 📝 draft · ✅ ready · 🔨 in progress · 👀 in review · 🎉 done

## Epic E3 · Bookings

| Issue | Title | State | Owner | Brief |
| --- | --- | --- | --- | --- |
| ACME-11 | Create a booking | 🎉 done | `agente1` (Ana) | ACME-11-agente1-crear-reserva |
| ACME-12 | Cancel a booking | 🎉 done | `agente1` (Ana) | [[ACME-12-agente1-cancelar-reserva]] |
| ACME-13 | Change a booking's time | 🔨 in progress | Luis | ACME-13-luis-cambiar-horario |
| ACME-15 | Notify invitees when a booking is cancelled | 📝 draft | — | — |
| ACME-16 | A single query in "My bookings" | 📝 draft | — | — |

**ACME-12 · Cancel a booking** (D-004, D-006)

- AC1: from "My bookings", whoever created a future booking cancels it after
  confirming; the booking leaves the list and the room is free at that time.
  Evidence: e2e test + screenshot.
- AC2: a booking that already started cannot be cancelled: the button is
  disabled and explains why, and the API returns `409`. Evidence: integration
  test + screenshot.
- AC3: nobody can cancel someone else's booking: the API returns `403` and the
  booking does not change. Evidence: integration test with two users.
- AC4: "My bookings" passes axe with no violations on desktop and mobile.
  Evidence: axe output.

**ACME-15 · Notify invitees when a booking is cancelled** (D-007). No criteria
yet.

**ACME-16 · A single query in "My bookings"**. Origin: `N2` from the ACME-12
review. Today it runs one query per booking to load the room.
