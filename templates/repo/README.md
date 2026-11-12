# <PROJECT>

<Una línea sobre qué es el producto.>

Este repo sigue **VERDE / VDD v1.2** (Vault · Encargo · Revisión · Decisión ·
Evidencia). El contexto, el backlog y las decisiones viven en el vault
`<PROJECT>-vault` ([cómo clonarlo](docs/vault.md)).

## Usar esta plantilla

1. Reemplaza `<PROJECT>`, `<KEY>` y los demás marcadores `<…>`
   (`grep -rn '<[A-Z]' .` los lista).
2. Ajusta `gate.steps` a tu stack y corre `make gate` hasta ver `RESULT GREEN`.
3. En GitHub, define la variable de repo `ISSUE_KEY` (por ejemplo `ACME`) y
   protege `main`: PR obligatorio, squash only, check `gate` requerido.
4. Completa `AGENTS.md` (roles y comandos) y `docs/guides/runbook.md`.

## Documentos

| Qué | Dónde |
| --- | --- |
| Reglas para agentes | [`AGENTS.md`](AGENTS.md) |
| Cómo trabajamos | [`docs/guides/agents.md`](docs/guides/agents.md) |
| Operación y puerta | [`docs/guides/runbook.md`](docs/guides/runbook.md) |
| Evidencia de cada PR | [`docs/prs/`](docs/prs/) |
| Decisiones | [`docs/decisions.md`](docs/decisions.md) y [`docs/adr/`](docs/adr/README.md) |
