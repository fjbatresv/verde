---
tipo: backlog
actualizado: 2026-11-19
---

# Backlog

**Estados:** 📝 borrador · ✅ listo · 🔨 en curso · 👀 en revisión · 🎉 hecho

## Épica E3 · Reservas

| Issue | Título | Estado | Responsable | Encargo |
| --- | --- | --- | --- | --- |
| ACME-11 | Crear una reserva | 🎉 hecho | `agente1` (Ana) | ACME-11-agente1-crear-reserva |
| ACME-12 | Cancelar una reserva | 🎉 hecho | `agente1` (Ana) | [[ACME-12-agente1-cancelar-reserva]] |
| ACME-13 | Cambiar el horario de una reserva | 🔨 en curso | Luis | ACME-13-luis-cambiar-horario |
| ACME-15 | Avisar a los invitados cuando se cancela | 📝 borrador | — | — |
| ACME-16 | Una sola consulta en "Mis reservas" | 📝 borrador | — | — |

**ACME-12 · Cancelar una reserva** (D-004, D-006)

- AC1: desde "Mis reservas", quien creó una reserva futura la cancela tras
  confirmar; la reserva sale de la lista y la sala queda libre en ese horario.
  Evidencia: prueba e2e + captura.
- AC2: una reserva que ya empezó no se puede cancelar: el botón está
  deshabilitado y explica por qué, y la API responde `409`. Evidencia: prueba
  de integración + captura.
- AC3: nadie puede cancelar una reserva ajena: la API responde `403` y la
  reserva no cambia. Evidencia: prueba de integración con dos usuarios.
- AC4: "Mis reservas" pasa axe sin violaciones en escritorio y móvil.
  Evidencia: salida de axe.

**ACME-15 · Avisar a los invitados cuando se cancela** (D-007). Sin criterios
todavía.

**ACME-16 · Una sola consulta en "Mis reservas"**. Origen: `N2` de la revisión
de ACME-12. Hoy se hace una consulta por reserva para traer la sala.
