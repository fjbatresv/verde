# Runbook

Operación diaria de <PROJECT>. Completa las secciones marcadas con `<…>`.

## 1. Arrancar en local

<Requisitos (versiones exactas), `cp .env.example .env`, comandos para levantar
la infraestructura y las apps.>

## 2. La puerta local (`make gate`)

La puerta es el pilar **Evidencia** de VERDE. Corre los pasos de `gate.steps`
y resume:

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

- Código de salida: 0 GREEN, 1 RED, 2 error en `gate.steps`.
- El log completo queda en `tmp/gate.log`; para ver un fallo:
  `grep -n '^== ' tmp/gate.log` y luego `tail` del tramo del paso.
- La CI remota (`.github/workflows/ci.yml`) corre la misma puerta. Si la CI
  remota no está disponible (facturación, límites de un servicio), **manda la
  puerta local**: el PM la corre y pega la salida en el PR.
- Los pasos `?opcionales` dan SKIP si la herramienta no está instalada. No
  conviertas un paso obligatorio en opcional para pasar.
- Si `ports-free` falla, hay otra instancia ocupando los puertos (otra
  worktree, un stack anterior): bájala y vuelve a correr.
- Requiere `bash` y `make` (macOS y Linux ya los traen). En Windows: WSL con
  `make`, o Git Bash con `bash tools/ci/local-gate.sh` (Git Bash no trae `make`).

## 3. Cuando la puerta falla

1. Lee el tramo del paso en el log.
2. ¿Es del diff? Se corrige en la rama.
3. ¿Falla sin relación con el diff (puerto ocupado, stack anterior levantado,
   servicio externo caído)? Arregla el entorno y vuelve a correr.
4. ¿Es intermitente (pasa sola, falla en la corrida completa)? Se permite
   **volver a correr ese paso una vez** para el merge, se anota en el PR y se
   abre un encargo de **causa raíz**. Nunca se agregan reintentos ni se suben
   timeouts para taparlo.

## 4. Merge

Sólo squash: `gh pr merge <n> --squash --match-head-commit <sha>`. Luego:

```sh
git tag archive/<rama> origin/<rama> && git push origin archive/<rama>
git push origin --delete <rama>
```

## 5. <Integraciones, despliegue, incidentes…>
