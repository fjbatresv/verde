---
tipo: encargo
issues: [ACME-12]
responsable: agente1
operador: Ana
estado: entregado
fecha: 2026-11-17
---

# Encargo · ACME-12 Cancelar una reserva — agente1

| Campo | Valor |
| --- | --- |
| Origen | Backlog de E3, aprobado por Marta (PO). Reglas: D-004 (no se borra), D-006 (sólo antes de empezar), D-003 (zona horaria) |
| Responsable | `agente1`, operado por Ana |
| Revisor | Diego (PM) |
| Issues | ACME-12 |
| Rama | `feat/ACME-12-cancelar-reserva` desde `main` |
| Worktree | Una nueva, sólo para este encargo |
| Entrega | `docs/prs/ACME-12-cancelar-reserva.md` y el PR |
| Alcance | `api/bookings/`, `web/my-bookings/` y sus pruebas. Migraciones: no (el estado `cancelada` ya existe). Dependencias nuevas: no |
| Entorno | Docker libre: puede levantar el stack completo |

Lee `AGENTS.md` del repo antes de empezar. Este vault es de sólo lectura.

## Objetivo

Quien creó una reserva futura puede cancelarla desde "Mis reservas". Cancelar
cambia el estado a `cancelada` (D-004) y libera la sala. Una reserva que ya
empezó no se cancela (D-006).

## Criterios de aceptación

| AC | Criterio | Evidencia esperada |
| --- | --- | --- |
| AC1 | Quien creó una reserva futura la cancela tras confirmar; sale de la lista y la sala queda libre | Prueba e2e + captura de antes y después |
| AC2 | Una reserva que ya empezó no se cancela: botón deshabilitado que explica por qué; la API responde `409` | Prueba de integración + captura |
| AC3 | Nadie cancela una reserva ajena: `403` y la reserva no cambia | Prueba de integración con **dos usuarios distintos** |
| AC4 | "Mis reservas" sin violaciones de axe en escritorio y móvil | Salida de axe |

## Fuera de alcance

- Avisar a los invitados (si crees que hace falta, pregúntalo).
- Cambiar el horario de una reserva (ACME-13, en curso por Luis: no toques
  `web/booking-form/`).
- Rendimiento de "Mis reservas".

## Si te bloqueas

Escribe la pregunta en "Open questions" del archivo de PR, haz push de lo que
tengas y detente.

## Entrega

`make gate` en tu rama con `RESULT GREEN` (pega la salida), archivo de PR con la
evidencia de cada AC (capturas en escritorio y móvil), push y `gh pr create`.
No hagas merge.
