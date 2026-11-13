---
tipo: revision
issues: [<KEY>-<n>]
pr: <url o número>
autor: <dev humano, o agente + operador>
revisor: <persona o agente; nunca el autor>
resultado: cambios-requeridos | aprobado-por-revisor | aprobado | integrado
ronda: 1
commit: <sha revisado>
fecha: {{date}}
---

# Revisión · <KEY>-<n> <título>

Encargo: [[<encargo>]] · Rama: `feat/<KEY>-<n>-<slug>` · Commit: `<sha>` ·
Archivo de PR: `docs/prs/<KEY>-<n>-<slug>.md` · Guía: `docs/guides/review.md`

## Veredicto

<Una o dos líneas. Se actualiza en cada ronda: "Ronda 1: cambios requeridos
(R1–R2)". "Ronda 2: aprobado por el revisor; falta el PO".>

## Criterios de aceptación

| AC | Resultado | Cómo lo verifiqué (no sólo lo leí) |
| --- | --- | --- |
| AC1 | ✅ / ❌ | |

## Revisión en vivo (Playwright)

Entorno: <perfil, URL, datos de prueba> · Tamaños: <1440×900, 13", móvil>

| Flujo / pantalla | Resultado | Captura |
| --- | --- | --- |
| <paso a paso recorrido> | ✅ / ❌ | ![[<archivo>.png]] |

- Accesibilidad (axe): <0 violaciones / lista>
- Consola: <sin errores / lista>
- Estados revisados: <vacío, error, sin permisos, deshabilitado>

## Puerta

```text
<salida de make gate sobre el commit revisado: líneas PASS/FAIL y RESULT>
```

## Lo que está bien

- <Lo verificado que el autor no debe tocar.>

## Cambios requeridos

Bloqueante o mayor: se corrigen en este PR.

| # | Severidad | Dónde | Problema | Qué se espera |
| --- | --- | --- | --- | --- |
| R1 | bloqueante / mayor | `<archivo:línea>` o pantalla | | |

## Observaciones que no bloquean

Menor o nota: cada una con destino.

| # | Severidad | Observación | Destino |
| --- | --- | --- | --- |
| N1 | menor / nota | | esta ronda / encargo de mantenimiento / vigilar / sin acción |

## Respuestas a "Open questions"

<Una por pregunta del archivo de PR. Si hace falta una decisión, quién la toma
y el D-xxx cuando exista.>

<!-- Por cada ronda nueva, agrega abajo:

## Ronda N (`<sha>`)

Puerta: RESULT GREEN · CI: <estado>

| # | Resultado | Cómo lo verifiqué |
| --- | --- | --- |
| R1 | ✅ / ❌ | |

Hallazgos nuevos: siguen la numeración (R3, N2…). Actualiza el veredicto de arriba.
-->

## Decisión del PO

<Aprobado / cambios, fecha.>

## Tras el merge

Squash `<sha>` · tag `archive/<rama>` · decisiones registradas: <D-xxx>
