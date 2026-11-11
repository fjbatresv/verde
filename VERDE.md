# VERDE · Vault-Driven Development

**Versión 1.0 · 2026-11-11 · © 2026 Javier Batres · CC BY 4.0**

VERDE es un framework para desarrollar aplicaciones con agentes de IA en un
equipo con roles fijos. Su nombre resume la regla: **nada avanza si no está en
verde**. Las letras son sus cinco pilares:

| | Pilar | En inglés | En una frase |
| --- | --- | --- | --- |
| **V** | Vault | Vault | La memoria del proyecto vive fuera del código y del chat. |
| **E** | Encargo | Engagement brief | Todo trabajo entra por escrito, con alcance y evidencia esperada. |
| **R** | Revisión | Review | El revisor ve la aplicación funcionando, no sólo el diff. |
| **D** | Decisión | Decision | Toda decisión se numera, se fecha y tiene un estado. |
| **E** | Evidencia | Evidence | Nada se integra sin la puerta de checks en `RESULT GREEN`. |

Al método se le llama también **VDD (Vault-Driven Development)**, al estilo de
TDD o BDD: en TDD la prueba va primero; en VDD, el vault. Lo que no está en el
vault no se decidió, y lo que no tiene evidencia no está hecho.

---

## 1. De dónde viene

VERDE nace de un proyecto real: un SaaS multitenant de gestión de proyectos,
construido con agentes en unas tres semanas. En 18 días el equipo —una persona
como dueña del producto, un agente como PM y revisor, y uno o dos agentes como
desarrolladores— integró 57 entregas en `main`, escribió 9 ADR y registró unas
140 decisiones, con lint, pruebas, cobertura ≥ 80 % y e2e en verde en todo
momento.

No salió de una teoría: cada regla de este documento existe porque su ausencia
costó algo. Las lecciones de la sección 11 cuentan cuánto.

## 2. Principios

1. **El vault manda.** Si no está en el vault, no se decidió. El chat se
   olvida; el vault no.
2. **Todo trabajo entra por encargo.** Un agente nunca recibe "arregla esto" en
   el chat: recibe un archivo con objetivo, alcance y criterios.
3. **Quien entrega escribe la evidencia.** El revisor verifica lo escrito en vez
   de redescubrirlo.
4. **El revisor ve la aplicación.** Un cambio de UI no se aprueba leyendo código.
5. **La puerta decide el merge.** Ni la confianza ni la prisa: `RESULT GREEN`.
6. **Toda decisión se numera.** `D-xxx`, con fecha, origen y estado. No se
   borra: se reemplaza.
7. **Causas, no síntomas.** No se agregan reintentos ni se cambia un diseño para
   callar un check.
8. **Una sesión por encargo, un agente por worktree.** El estado vive en la rama
   y en el archivo de PR, no en la conversación.
9. **Los roles no son herramientas.** Un rol puede ocuparlo una persona o
   cualquier agente; el método no cambia.

## 3. Los cinco pilares

### V · Vault

**Qué es:** un repositorio de notas en Markdown (pensado para Obsidian, sirve
cualquier editor) con el producto, el backlog, los encargos, las revisiones,
las reuniones, las decisiones y el status del proyecto.

**Dónde vive:** en **su propio repo git privado** (`<proyecto>-vault`),
clonado al lado del repo de código. No va dentro del repo de código: tiene
otro ritmo, otros autores y otro nivel de confidencialidad.

**Quién lo escribe:** sólo el PO y el PM, con commit y push directo a `main`.
Los agentes de desarrollo lo **leen** (su `AGENTS.md` les da la ruta) y nunca lo
modifican.

**Regla mínima:** cada encargo, revisión, reunión y decisión es una nota del
vault, creada desde su plantilla.

**Anti-patrón:** "lo hablamos en el chat". Si un agente necesita algo que sólo
está en una conversación, la próxima sesión no lo sabrá.

### E · Encargo

**Qué es:** el documento que recibe el agente. Es lo **único** que necesita,
junto con `AGENTS.md`.

**Dónde vive:** `03-Encargos/` del vault.

**Quién lo escribe:** el PM; el PO lo aprueba cuando el encargo cambia alcance
o producto.

**Regla mínima:** un encargo tiene:

- origen (quién lo pidió y qué decisión lo respalda);
- rama y worktree;
- criterios **verificables**, cada uno con la evidencia esperada;
- alcance cerrado (qué sí, qué no, si hay migraciones o dependencias nuevas);
- entorno (si puede levantar Docker);
- fuera de alcance explícito;
- qué hacer si se bloquea: escribir la pregunta y detenerse.

**Anti-patrón:** el encargo que dice el síntoma sin pedir la causa. El agente
resolverá el síntoma (ver sección 11).

### R · Revisión

**Qué es:** la verificación del PR por el PM, escrita en el vault.

**Dónde vive:** `06-Revisiones/`, una nota por PR y ronda.

**Quién la escribe:** el PM.

**Regla mínima:**

- se verifica cada criterio contra la evidencia;
- si hay UI, se abre la aplicación con **Playwright**, se recorre el flujo, se
  toman capturas y se corre **axe**;
- cada hallazgo lleva archivo y severidad: **bloqueante**, **mayor**, **menor**
  o **nota**;
- las notas menores pueden ir a un encargo de mantenimiento para no gastar una
  ronda.

**Anti-patrón:** aprobar leyendo el diff. Los problemas de UI (contraste, un
botón fuera de lugar, un estado vacío roto) no se ven en el código.

**Contrapeso:** el revisor también se equivoca. El agente puede contradecir la
revisión con evidencia y eso es parte del proceso.

### D · Decisión

**Qué es:** el registro numerado de lo que se decidió.

**Dónde vive:** `04-Decisiones/Registro-de-decisiones.md` en el vault; las
técnicas, además, como ADR en `docs/adr/` del repo, y un índice en
`docs/decisions.md`.

**Quién la escribe:** el PM, el mismo día, con origen (reunión, encargo,
revisión) y aprobación del PO.

**Regla mínima:** `D-xxx` consecutivo y nunca reutilizado, con estado:

| Estado | Significa |
| --- | --- |
| ✅ vigente | Se aplica hoy. |
| 🔁 reemplazada | Otra decisión la sustituye y la cita. |
| ⏸️ en pausa | Sigue siendo válida, pero no se aplica hasta nuevo aviso. |
| ⏳ pendiente | Se identificó, falta decidir. |

El código, los encargos y los PR citan decisiones por ID.

**Anti-patrón:** borrar o reescribir una decisión vieja. Se pierde el porqué.

### E · Evidencia

**Qué es:** la **puerta**, un único comando (`make gate`) que corre todos los
checks y responde verde o rojo, más el archivo de PR con la evidencia de cada
criterio.

**Dónde vive:** `tools/ci/local-gate.sh` y `gate.steps` en el repo;
`docs/prs/<KEY>-<n>-<slug>.md` para cada PR.

**Quién la produce:** el agente la corre antes de abrir el PR; el PM la vuelve a
correr sobre el commit exacto antes del merge.

**Regla mínima:** formato, lint, pruebas, build, cobertura (≥ el umbral del
proyecto, 80 % por defecto), e2e y seguridad. La salida es siempre la misma:

```text
head 3f2a9c1 · 2026-11-11 10:42:07
PASS format
PASS lint
PASS test
PASS build
PASS coverage
PASS infra
PASS e2e
PASS infra-down
SKIP snyk
RESULT GREEN · log tmp/gate.log
```

**Anti-patrón:** "en mi máquina pasa". Si no hay salida de la puerta pegada en
el PR, no hay evidencia.

## 4. Roles

| Rol | Qué hace | Qué no hace |
| --- | --- | --- |
| **PO** (persona) | Prioriza. Aprueba backlog, diseños, encargos que cambian alcance y PRs. Decide lo abierto. Vigila a los agentes de desarrollo mientras trabajan. | — |
| **PM y revisor** (persona o agente) | Escribe backlog, encargos, revisiones, decisiones y status en el vault. Revisa en vivo con Playwright. Corre la puerta. Hace el squash merge cuando la revisión está aprobada y la puerta en verde. | Integrar sin aprobación o con la puerta en rojo. |
| **Dev** (agente) | Implementa su encargo en su worktree. Escribe la evidencia. Abre el PR y se detiene. | Merge, push a `main`, `--force`, `--no-verify`, escribir en el vault, tocar fuera de su alcance. |
| **Arquitecto** (opcional) | Diseños y ADR que bloquean el trabajo que dependa de ellos. Si no hay, el PM cubre el rol. | — |

Un equipo mínimo es **un PO, un PM y un dev**. Más agentes de desarrollo en
paralelo sólo ayudan si cada uno tiene su worktree y no comparten el entorno.

## 5. El ciclo

```text
 Backlog ──► Diseño* ──► Encargo ──► Rama + worktree ──► Implementación
 (PM, PO)    (PO)        (PM)        (dev)                (dev)
                                                              │
   ┌──────────────────────────────────────────────────────────┘
   ▼
 make gate + archivo de PR ──► PR ──► Revisión (diff + Playwright + axe)
 (dev)                         (dev)  (PM, en el vault)
                                          │
                     cambios ◄────────────┤
                     (ronda N, sesión     │ aprobado
                      nueva del dev)      ▼
                                   make gate sobre el commit del PR (PM)
                                          │ RESULT GREEN
                                          ▼
                                   Squash merge ──► tag archive/<rama> ──► Registro
                                   (PM)                                    (backlog,
                                                                            decisiones,
                                                                            status)
 * sólo si hay pantallas nuevas
```

1. **Backlog.** El PM redacta épicas, issues y criterios verificables. El PO
   aprueba.
2. **Diseño.** Si hay pantallas nuevas, se diseñan y el PO las aprueba antes de
   implementar.
3. **Encargo.** El PM lo escribe desde la plantilla.
4. **Rama y worktree.** El dev crea `feat/<KEY>-<n>-<slug>` desde `main` en una
   worktree propia.
5. **Implementación.** Commits `<KEY>-<n>: <imperativo>`.
6. **Evidencia.** El dev corre `make gate`, escribe el archivo de PR y abre el
   PR. Se detiene.
7. **Revisión.** El PM verifica criterios, revisa en vivo y escribe la revisión.
8. **Rondas.** Si hay cambios, el dev los hace en una **sesión nueva**, en la
   misma rama, y agrega "Round N" al archivo de PR.
9. **Merge.** El PM corre la puerta sobre el commit del PR, pega la salida en el
   PR y hace squash merge con `--match-head-commit`. La rama se archiva como tag
   `archive/<rama>` y se borra.
10. **Registro.** El PM actualiza backlog, decisiones y status del día.

## 6. Convenciones

| Qué | Formato | Ejemplo |
| --- | --- | --- |
| Clave de issue | `<KEY>-<n>` | `ACME-42` |
| Rama de trabajo | `feat/<KEY>-<n>-<slug>` | `feat/ACME-42-login` |
| Rama de mantenimiento | `maint/<KEY>-<n>-<slug>` | `maint/ACME-57-flaky-e2e` |
| Commit | `<KEY>-<n>: <imperativo>` (< 72 caracteres, sin punto) | `ACME-42: Add email login form` |
| Título de PR | igual que un commit | `ACME-42: Email login` |
| Archivo de PR | `docs/prs/<KEY>-<n>-<slug>.md` | `docs/prs/ACME-42-login.md` |
| Decisión | `D-xxx` | `D-017` |
| ADR | `docs/adr/NNNN-<tema>.md` | `docs/adr/0003-auth.md` |
| Rama archivada | tag `archive/<rama>` | `archive/feat/ACME-42-login` |
| Encargo | `03-Encargos/<KEY>-<n>-<agente>-<tema>.md` | `ACME-42-dev-login.md` |
| Revisión | `06-Revisiones/<KEY>-<n>-revision.md` | `ACME-42-revision.md` |
| Severidad | bloqueante · mayor · menor · nota | — |

Un grupo de issues que se entrega en un solo PR puede tener su propia clave.
Llámalo como prefieras (historia, entrega, *carrier*); el método no lo exige.

Sólo se integra con **squash**: una entrega, un commit en `main`.

## 7. La puerta

La puerta es el pilar que hace cumplir a los demás. Se implementa con dos
archivos de la plantilla de repo:

- `tools/ci/local-gate.sh`, que no conoce tu stack;
- `gate.steps`, donde declaras los pasos:

```text
# <kind> <name>: <command>
step format: npx prettier --check .
step lint: npm run lint
step test: npm test
setup infra: docker compose up -d --wait
step e2e: npx playwright test
teardown infra-down: docker compose down
step ?snyk: snyk test --severity-threshold=high
```

- **`setup`** y **`step`** corren en el orden del archivo: pon cada `setup`
  antes de los pasos que lo necesitan. Si un `setup` falla, se saltan los pasos
  siguientes y el resultado es rojo.
- Un **`step`** corre aunque uno anterior haya fallado, para ver todos los
  problemas en una corrida.
- **`teardown`** corre siempre, al final.
- **`?nombre`** marca un paso opcional: si la herramienta no está instalada, da
  `SKIP`. Úsalo para servicios con límites o licencias (escáneres de seguridad
  en la nube), nunca para callar un paso obligatorio.

El código de salida es 0 (verde), 1 (rojo) o 2 (`gate.steps` mal escrito). El
log completo queda en `tmp/gate.log`.

**CI remota.** El workflow `ci.yml` corre la misma puerta. Cuando la CI remota
no está disponible (facturación, límites de un servicio externo), **manda la
puerta local**: el PM la corre y pega la salida en el PR. La CI remota es un
espejo, no otra fuente de verdad.

**Pruebas intermitentes.** Si un paso falla sin relación con el diff y pasa al
correrlo solo, se permite **una** re-ejecución de ese paso para el merge, se
anota en el PR y se abre un encargo de causa raíz. Nunca se agregan reintentos
ni se suben timeouts para taparlo.

## 8. Día 0 de un proyecto nuevo

- [ ] Crear el repo del vault desde `templates/vault/` y el repo de código desde
      `templates/repo/`, ambos privados, clonados uno al lado del otro.
- [ ] Elegir la clave de issues (`<KEY>`) y reemplazar los marcadores `<…>`
      (`grep -rn '<[A-Z]' .`).
- [ ] Registrar **D-001 · Adoptamos VERDE / VDD v1.0** y las decisiones de
      arranque (stack, alcance, quién ocupa cada rol).
- [ ] Ajustar `gate.steps` al stack y correr `make gate` hasta `RESULT GREEN`
      con el esqueleto del proyecto.
- [ ] Completar `AGENTS.md`: proyecto, ruta del vault, roles, comandos.
- [ ] En GitHub (o equivalente):
  - definir la variable de repo `ISSUE_KEY`;
  - proteger `main` con PR obligatorio, squash only, el check `gate` requerido
    y sin push directo;
  - cargar los secretos de la CI.
- [ ] Dar acceso a los dos repos a cada persona del equipo.
- [ ] Escribir el backlog de la primera entrega y el primer encargo.
- [ ] Lanzar el primer agente en su worktree y revisar el primer PR con el ciclo
      completo, aunque sea pequeño: así se prueba el proceso antes que el
      producto.

## 9. Higiene de contexto para agentes

Cada paso de un agente vuelve a leer toda la conversación. En el proyecto de
origen, más del 98 % de los tokens fue relectura, y tres sesiones largas
consumieron el 82 % del total. Por eso:

- **Una sesión nueva por encargo y por ronda.** El estado vive en la rama y en
  el archivo de PR.
- **Salidas filtradas** (`tail`, `grep`). Nunca pegar logs completos; la puerta
  ya guarda el log.
- **Esperar la CI con un comando que bloquea** (`gh pr checks <n> --watch`),
  nunca con un bucle de consultas.
- **Encargos pequeños.** Un encargo cerrado sale en una ronda; una épica grande
  se divide en partes que se puedan revisar por separado.
- **Modelos pequeños o locales** sirven para cambios de pocos archivos con
  instrucciones exactas, no para diseñar.

## 10. Lanzar un agente

```sh
git worktree add ../<proyecto>-<KEY>-<n> -b feat/<KEY>-<n>-<slug> origin/main
cd ../<proyecto>-<KEY>-<n>
<agente> "Lee AGENTS.md y el encargo ../<proyecto>-vault/03-Encargos/<archivo>.md. Haz el encargo completo."
```

- Un agente por worktree. Los permisos amplios (sin pedir aprobación por
  comando) sólo dentro de su worktree y con un encargo cerrado.
- La worktree nueva no trae archivos ignorados (`.env`): cópialos o deja que el
  agente los cree desde `.env.example`.
- Si dos agentes necesitan el mismo entorno con puertos fijos, se turnan. Dos
  stacks a la vez fallan de formas que parecen bugs.
- El PO vigila la terminal del agente; el PM revisa el resultado. Separar esas
  dos tareas evita que el revisor se vuelva coautor.

## 11. Lecciones

Lo que el proyecto de origen aprendió pagando:

- **El agente resuelve el síntoma si el encargo no pide la causa.** Un check de
  contraste fallaba en un botón primario; el agente lo cambió a secundario y el
  check pasó. La causa real era una transición CSS que el test medía a la mitad.
  Se revirtió y el encargo siguiente pidió la causa.
- **La evidencia escrita ahorra la mitad de la revisión.** Con comandos y
  salidas en el archivo de PR, revisar es verificar.
- **Diseño antes que código.** Las pantallas aprobadas antes de implementar
  llegaron como pulido, no como rediseño.
- **Las pruebas intermitentes casi siempre son de orden o de tiempo:** filas
  creadas en la misma transacción con la misma marca de tiempo, el día que
  cambia a mitad del e2e, un timeout corto bajo carga. Se arreglan en la prueba
  o en el código.
- **Las dependencias externas de la CI frenan sin que haya un error:** la
  facturación de la CI o el límite mensual de un escáner. La puerta local evita
  que eso detenga el trabajo.
- **Dos entornos a la vez fallan como si fueran bugs.** Un puerto ocupado por
  otra instancia hizo fallar el e2e. La puerta debe verificar sus
  precondiciones antes de empezar.
- **Menos agentes, más estables.** Con un solo dev y un PM que revisa, el flujo
  fue más predecible que con cuatro agentes en roles parecidos.
- **Integrar sólo con squash.** Un merge commit por error ensucia la historia
  de `main` para siempre.

## 12. Glosario

| Español | Inglés | Qué es |
| --- | --- | --- |
| Vault | Vault | Repo de notas con la memoria del proyecto. |
| Encargo | Engagement brief | Documento de trabajo para un agente. |
| Revisión | Review | Verificación escrita de un PR, con revisión en vivo. |
| Decisión | Decision | Entrada numerada `D-xxx` del registro. |
| Evidencia | Evidence | Salida de la puerta y pruebas de cada criterio. |
| Puerta | Gate | `make gate`: todos los checks, verde o rojo. |
| Archivo de PR | PR file | `docs/prs/…`: evidencia y rondas de un PR. |
| Ronda | Round | Iteración de cambios tras una revisión. |
| Criterio de aceptación | Acceptance criterion (AC) | Condición verificable de un issue. |
| Dueño del producto | Product owner (PO) | Persona que prioriza y aprueba. |
| PM y revisor | PM / reviewer | Rol que escribe el vault, revisa e integra. |

## 13. Versión y licencia

Este documento es **VERDE v1.0**. Los cambios se registran en
[`CHANGELOG.md`](CHANGELOG.md): un cambio MAJOR altera un pilar o una regla
obligatoria; un MINOR agrega guías o aclaraciones. Cada proyecto anota en su
D-001 la versión que adoptó.

Texto bajo [CC BY 4.0](LICENSE); scripts y plantillas de código bajo
[MIT](LICENSE-CODE). © 2026 Javier Batres.
