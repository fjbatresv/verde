---
tipo: encargo
issues: [<KEY>-<n>]
responsable: <dev humano | agente>
operador: <persona, si es un agente>
estado: borrador | listo | enviado | entregado
fecha: {{date}}
---

# Encargo · <KEY>-<n> <título> — <responsable>

| Campo | Valor |
| --- | --- |
| Origen | <quién lo pidió y por qué; D-xxx> |
| Responsable | <dev humano, o agente + operador> |
| Revisor | <persona o agente que no sea el autor> |
| Issues | <KEY>-<n>, <KEY>-<m> |
| Rama | `feat/<KEY>-<n>-<slug>` desde `main` |
| Worktree | Una nueva, sólo para este encargo |
| Entrega | `docs/prs/<KEY>-<n>-<slug>.md` y el PR |
| Alcance | <módulos o archivos que sí puede tocar>. <Migraciones / dependencias nuevas: sí o no> |
| Entorno | <Docker libre / sin Docker / turnarse el stack> |

Lee `AGENTS.md` del repo antes de empezar. Este vault es de sólo lectura.

## Objetivo

<Qué tiene que existir al terminar, en 2–4 líneas.>

## Criterios de aceptación

| AC | Criterio | Evidencia esperada |
| --- | --- | --- |
| AC1 | <verificable> | <comando, captura, número> |

## Si hay un síntoma

<Si el encargo nace de un fallo: describe el síntoma, la causa probable y pide
la causa raíz. Prohibido taparlo con reintentos, timeouts o cambios de diseño.>

## Fuera de alcance

-

## Si te bloqueas

Escribe la pregunta en "Open questions" del archivo de PR, haz push de lo que
tengas y detente.

## Entrega

`make gate` en tu rama con `RESULT GREEN` (pega la salida), archivo de PR con la
evidencia de cada AC (capturas si hay UI), push y `gh pr create`. No hagas merge.
