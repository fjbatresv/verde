# <PROJECT>

<Una línea sobre qué es el producto.>

Este repo sigue **VERDE / VDD v1.3** (Vault · Encargo · Revisión · Decisión ·
Evidencia). El contexto, el backlog y las decisiones viven en el vault
`<PROJECT>-vault` ([cómo clonarlo](docs/vault.md)).

## Usar esta plantilla

1. Si arrancaste con `init.sh` de VERDE, el proyecto, la clave y las fechas ya
   están puestos. Completa los marcadores que quedan (nombres, URLs, comandos)
   en `AGENTS.md`, este README, `docs/vault.md` y `docs/guides/`. Los `<n>` y
   `<slug>` de las guías y plantillas son convenciones y se quedan.
2. Ajusta `gate.steps` a tu stack y corre `make gate` hasta ver `RESULT GREEN`.
3. En GitHub, define la variable de repo `ISSUE_KEY` (por ejemplo `ACME`) y
   protege `main`: PR obligatorio, squash only, check `gate` requerido.
4. Completa `AGENTS.md` (roles y comandos) y `docs/guides/runbook.md`.

## Documentos

| Qué | Dónde |
| --- | --- |
| Reglas para agentes | [`AGENTS.md`](AGENTS.md) |
| Cómo trabajamos | [`docs/guides/agents.md`](docs/guides/agents.md) |
| Cómo se revisa | [`docs/guides/review.md`](docs/guides/review.md) |
| Operación y puerta | [`docs/guides/runbook.md`](docs/guides/runbook.md) |
| Evidencia de cada PR | [`docs/prs/`](docs/prs/) |
| Decisiones | [`docs/decisions.md`](docs/decisions.md) y [`docs/adr/`](docs/adr/README.md) |
