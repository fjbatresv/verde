# Ejemplo resuelto · ACME Salas

Un issue completo, del backlog a la integración, escrito con las plantillas de
VERDE. **ACME Salas** es un producto inventado: una app para reservar salas de
reunión. Todo es ficticio: personas, fechas, commits y salidas. Las capturas
que citan las notas no se incluyen.

## El equipo

| Rol | Quién |
| --- | --- |
| PO | Marta |
| PM y revisor | Diego |
| Operador | Ana, que lanza y vigila a `agente1` |
| Dev | `agente1` (agente, operado por Ana) y Luis (dev humano) |

## La historia de ACME-12 · Cancelar una reserva

Léelo en este orden:

1. **Backlog** · [`vault/02-Backlog/Backlog.md`](vault/02-Backlog/Backlog.md):
   el issue con criterios verificables.
2. **Encargo** ·
   [`vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md`](vault/03-Encargos/ACME-12-agente1-cancelar-reserva.md):
   lo único que recibe el agente, junto con `AGENTS.md`.
3. **Archivo de PR, ronda 1** ·
   [`repo/docs/prs/ACME-12-cancelar-reserva.md`](repo/docs/prs/ACME-12-cancelar-reserva.md):
   la evidencia del agente y una pregunta abierta.
4. **Revisión** ·
   [`vault/06-Revisiones/ACME-12-revision.md`](vault/06-Revisiones/ACME-12-revision.md):
   el revisor reproduce la evidencia y encuentra que la prueba de permisos
   pasaba por la razón equivocada (`R1`), además de dos problemas que sólo se
   ven en vivo (`R2`, `R3`).
5. **Decisión** ·
   [`vault/04-Decisiones/Registro-de-decisiones.md`](vault/04-Decisiones/Registro-de-decisiones.md):
   la pregunta abierta se convierte en `D-007` y en un issue nuevo.
6. **Ronda 2**, al final del archivo de PR y de la revisión: cada hallazgo
   respondido y verificado por su ID.
7. **Status del día** ·
   [`vault/08-Status/2026-11-19 Status.md`](vault/08-Status/2026-11-19%20Status.md):
   lo integrado, lo que sigue y quién lo tiene.

## Qué mirar

- Los criterios dicen **qué evidencia** los demuestra, y la revisión dice
  **cómo la verificó**, no sólo que la leyó.
- `R1` es el caso típico: la evidencia existía y la prueba pasaba, pero no
  probaba el criterio.
- `N2` es un problema anterior al PR: no bloquea, va a un encargo de
  mantenimiento.
- El agente no decide lo que el encargo no dice: lo pregunta y se detiene.

Las convenciones de estos archivos se prueban con `bash tests/examples.test.sh`.
