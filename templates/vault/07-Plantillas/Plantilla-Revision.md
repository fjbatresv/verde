---
tipo: revision
issues: [<KEY>-<n>]
pr: <url o número>
revisor: <nombre; nunca el autor>
autor: <dev o agente + operador>
resultado: aprobado | cambios-requeridos
ronda: 1
fecha: {{date}}
---

# Revisión · <KEY>-<n> <título>

Encargo: [[<encargo>]] · Rama: `feat/<KEY>-<n>-<slug>` · Commit: `<sha>`

## Criterios de aceptación

| AC | Resultado | Cómo lo verifiqué |
| --- | --- | --- |
| AC1 | ✅ / ❌ | |

## Revisión en vivo (Playwright)

No se aprueba un cambio de UI sólo leyendo el diff.

| Flujo / pantalla | Resultado | Captura |
| --- | --- | --- |
| <paso a paso recorrido> | ✅ / ❌ | ![[<archivo>.png]] |

- Accesibilidad (axe): <0 violaciones / lista>
- Tema claro/oscuro, escritorio/móvil: <qué se revisó>

## Puerta

```text
<salida de make gate sobre el commit revisado: líneas PASS/FAIL y RESULT>
```

## Definition of Done

- [ ] AC verificados
- [ ] Puerta en `RESULT GREEN` sobre el commit del PR
- [ ] Evidencia de UI (capturas + axe) o "sin cambios de UI"
- [ ] Docs actualizados
- [ ] Commits con clave `<KEY>-<n>`

## Comentarios

| # | Archivo / línea | Severidad | Comentario |
| --- | --- | --- | --- |
| 1 | | bloqueante / mayor / menor / nota | |

## Veredicto del PM

<Aprobado / cambios requeridos, en una línea. Las notas menores pueden ir a un
encargo de mantenimiento para no gastar una ronda.>

## Decisión del PO
