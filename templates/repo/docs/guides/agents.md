# Cómo se trabaja con los agentes

Este proyecto sigue **VERDE / VDD v1.0**: Vault · Encargo · Revisión ·
Decisión · Evidencia. Esta guía es la versión operativa para este repo.

## Roles

| Rol | Quién | Qué hace | Qué no hace |
| --- | --- | --- | --- |
| PO | <nombre> | Prioriza; aprueba backlog, diseños, encargos y PRs; decide lo abierto | — |
| PM y revisor | <nombre o agente> | Escribe backlog, encargos, revisiones y decisiones en el vault; revisa en vivo con Playwright; corre la puerta; hace el squash merge | Merge sin aprobación o con la puerta en rojo |
| Dev | <agente(s)> | Implementa el encargo, escribe la evidencia, abre el PR | Merge, push a `main`, `--force`, editar el vault |
| Arquitecto (opcional) | <nombre o agente> | Diseños y ADR | — |

El vault lo escriben sólo el PO y el PM. Los agentes lo leen.

## El ciclo

1. **Backlog.** El PM redacta épicas, issues y criterios de aceptación en el
   vault; el PO aprueba.
2. **Diseño,** si hay pantallas: se aprueba antes de implementar.
3. **Encargo.** El PM escribe `03-Encargos/<KEY>-<n>-<agente>-<tema>.md` desde
   la plantilla. Es todo lo que el agente necesita.
4. **Implementación** en su propia worktree y rama, con commits `<KEY>-<n>: …`.
5. **Evidencia.** El agente corre `make gate`, escribe `docs/prs/<KEY>-<n>-<slug>.md`
   y abre el PR. Se detiene.
6. **Revisión.** El PM lee el diff y la evidencia, **abre la app con
   Playwright**, recorre el flujo, toma capturas, corre axe y escribe la
   revisión en `06-Revisiones/` con severidades (bloqueante, mayor, menor, nota).
7. **Rondas,** en sesión nueva del agente, con "Round N" en el archivo de PR.
8. **Merge.** Con la revisión aprobada, el PM corre `make gate` sobre el commit
   del PR, pega la salida como comentario y, con `RESULT GREEN`, hace
   `gh pr merge --squash --match-head-commit <sha>`. La rama se archiva como
   tag `archive/<rama>` y se borra.
9. **Registro.** El PM actualiza backlog, decisiones y status en el vault.

## Cómo lanzar un agente

Un encargo, una worktree, una sesión:

```sh
git worktree add ../<PROJECT>-<KEY>-<n> -b feat/<KEY>-<n>-<slug> origin/main
cd ../<PROJECT>-<KEY>-<n> && cp ../<PROJECT>/.env .env   # si aplica
<agente> "Lee AGENTS.md y el encargo ../<PROJECT>-vault/03-Encargos/<archivo>.md. Haz el encargo completo."
```

- Un agente por worktree. Si dos agentes necesitan el mismo stack de Docker
  (puertos fijos), se turnan.
- Darle permisos amplios al agente sólo dentro de su worktree y con un encargo
  cerrado.
- El PO vigila la terminal del agente; el PM revisa el resultado.

## Cómo escribir un buen encargo

- **Un objetivo y su origen** (quién lo pidió, `D-xxx`).
- **Criterios verificables** con la evidencia esperada (comando, captura, número).
- **Alcance cerrado:** qué sí y qué no; si lleva migración o dependencias.
- **Entorno:** si puede levantar Docker o no.
- **Fuera de alcance,** explícito.
- **Si se bloquea:** "Open questions" en el archivo de PR y detenerse.
- **Pide la causa:** si hay un síntoma (prueba intermitente, contraste), el
  encargo pide la causa raíz, no que desaparezca el síntoma.
