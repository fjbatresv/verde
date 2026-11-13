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

# Revisión · ACME-12 Cancelar una reserva

Encargo: [[ACME-12-agente1-cancelar-reserva]] · Rama:
`feat/ACME-12-cancelar-reserva` · Commit: `4e1c9a2` (ronda 1), `9b7d3f0`
(ronda 2) · Archivo de PR: `docs/prs/ACME-12-cancelar-reserva.md`

## Veredicto

Ronda 1: cambios requeridos (R1–R3). **Ronda 2: aprobado por el revisor**;
aprobado por Marta (PO) el 18-nov; integrado por el PM (`2f6a8e1`).

## Criterios de aceptación

| AC | Resultado | Cómo lo verifiqué (no sólo lo leí) |
| --- | --- | --- |
| AC1 | ✅ | Corrí el e2e (3 passed) y lo repetí a mano: cancelo la reserva de las 15:00 y la sala aparece libre a esa hora en "Salas" |
| AC2 | ❌ | La API responde `409` (lo probé con `curl` sobre una reserva en curso), pero el botón deshabilitado no explica por qué: ver R2 |
| AC3 | ❌ | La prueba pasa, pero crea y cancela con el mismo usuario. Con un segundo usuario la API cancela la reserva ajena: ver R1 |
| AC4 | ❌ | 0 violaciones en 1440×900; en 390×844 no se puede terminar el flujo: ver R3 |

## Revisión en vivo (Playwright)

Entorno: perfil `dev`, `http://localhost:8080`, usuarios `ana@acme.test` y
`bea@acme.test` · Tamaños: 1440×900, 1280×800 (13") y 390×844

| Flujo / pantalla | Resultado | Captura |
| --- | --- | --- |
| Mis reservas → Cancelar → Confirmar (escritorio) | ✅ | ![[ACME-12-r1-cancelar-1440.png]] |
| Reserva en curso: botón deshabilitado | ❌ sin explicación | ![[ACME-12-r1-en-curso.png]] |
| Mis reservas → Cancelar → Confirmar (móvil) | ❌ botón fuera de pantalla | ![[ACME-12-r1-confirmar-390.png]] |
| `bea` cancela la reserva de `ana` vía API | ❌ `200` | — |

- Accesibilidad (axe): 0 violaciones en las tres pantallas. El botón sin
  explicación no lo detecta axe: lo detecté con el lector de pantalla ("Cancelar,
  atenuado").
- Consola: sin errores.
- Estados revisados: lista vacía, reserva en curso, error de red al cancelar
  (muestra el aviso de error y la reserva no cambia).

## Puerta

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

## Lo que está bien

- Cancelar cambia el estado a `cancelada` y no borra la fila (D-004).
- La regla de D-006 se evalúa en la API, en UTC, y la web sólo la refleja
  (D-003).
- El diálogo de confirmación devuelve el foco al botón al cerrarse y `Esc` lo
  cierra.
- No se tocó `web/booking-form/`, que está en curso en ACME-13.

## Cambios requeridos

| # | Severidad | Dónde | Problema | Qué se espera |
| --- | --- | --- | --- | --- |
| R1 | bloqueante | `api/bookings/bookings.service.ts` y `bookings-cancel.int.spec.ts` | El servicio compara el dueño con el `userId` del cuerpo de la petición, no con el de la sesión. La prueba de AC3 crea y cancela con el mismo usuario, así que pasa igual. Con `bea@acme.test`, la API cancela la reserva de `ana@acme.test` (`200`) | El dueño sale de la sesión. La prueba usa dos usuarios y falla sin el arreglo |
| R2 | mayor | Mis reservas, reserva en curso | El botón está deshabilitado sin texto ni ayuda. AC2 pide que explique por qué | Un texto visible que explique el motivo, asociado al botón para los lectores de pantalla |
| R3 | mayor | Mis reservas, diálogo de confirmación en 390×844 | "Sí, cancelar" queda bajo el borde de la pantalla y no se puede hacer scroll hasta él | Las acciones del diálogo siempre visibles en móvil; el e2e corre también en móvil |

## Observaciones que no bloquean

| # | Severidad | Observación | Destino |
| --- | --- | --- | --- |
| N1 | menor | El aviso dice "Reserva eliminada"; por D-004 no se elimina | Esta ronda: es el mismo archivo que R2 |
| N2 | nota | "Mis reservas" hace una consulta por reserva para traer la sala. Es anterior a este PR | Encargo de mantenimiento ACME-16 |

## Respuestas a "Open questions"

1. **¿Avisar a los invitados al cancelar?** Lo decide el PO. Lo hablé con Marta
   el 18-nov: no en esta entrega. Queda como D-007 y como ACME-15 en el
   backlog. El PR no cambia.

## Ronda 2 (`9b7d3f0`)

Puerta: RESULT GREEN (corrida por el revisor, 2026-11-18 12:02) · CI: verde

| # | Resultado | Cómo lo verifiqué |
| --- | --- | --- |
| R1 | ✅ | Con `bea@acme.test`, `POST /bookings/{id}/cancel` sobre la reserva de `ana` → `403` y la reserva sigue `confirmada`. Revertí sólo el cambio del servicio y la prueba nueva falla |
| R2 | ✅ | Texto visible "Ya empezó: no se puede cancelar"; el lector de pantalla lo lee junto al botón. ![[ACME-12-r2-en-curso.png]] |
| R3 | ✅ | En 390×844 y en 320×640 las acciones quedan fijas abajo; el e2e corre en móvil. ![[ACME-12-r2-confirmar-390.png]] |
| N1 | ✅ | El aviso dice "Reserva cancelada" |
| N2 | — | En el backlog como ACME-16 |

Sin hallazgos nuevos. AC1 a AC4: ✅.

## Decisión del PO

Aprobado por Marta, 2026-11-18.

## Tras el merge

Squash `2f6a8e1` · tag `archive/feat/ACME-12-cancelar-reserva` · decisiones
registradas: D-007
