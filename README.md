# VERDE · Vault-Driven Development

**Un framework para desarrollar aplicaciones con agentes de IA, con roles
fijos, memoria fuera del chat y nada integrado sin evidencia.**

VERDE se llama así por su regla: nada avanza si no está en verde. Las letras
son sus cinco pilares:

- **V · Vault.** La memoria del proyecto (backlog, encargos, revisiones,
  decisiones) vive en un repo de notas, no en el código ni en el chat.
- **E · Encargo.** Todo trabajo entra por escrito, con alcance cerrado y
  criterios verificables.
- **R · Revisión.** El revisor abre la aplicación con Playwright y corre axe; no
  aprueba sólo leyendo el diff.
- **D · Decisión.** Cada decisión se numera (`D-xxx`), se fecha y tiene estado.
- **E · Evidencia.** Nada se integra sin `make gate` en `RESULT GREEN`.

Funciona con un equipo mínimo (un PO, un PM y agentes) o con varios
desarrolladores que programan a mano u operan sus propios agentes: los roles son
responsabilidades, y el autor de una entrega nunca la aprueba.

En inglés: Vault · Engagement brief · Review · Decision · Evidence. Al método
también se le llama **VDD**.

## Empezar

1. Lee [`VERDE.md`](VERDE.md) (unos 20 minutos).
2. Copia [`templates/vault/`](templates/vault/) a un repo privado
   `<proyecto>-vault` y [`templates/repo/`](templates/repo/) a tu repo de
   código, uno al lado del otro.
3. Sigue el checklist de **Día 0** (VERDE.md §7): clave de issues, D-001,
   `gate.steps` para tu stack y `make gate` en verde.

## Contenido

| Ruta | Qué es |
| --- | --- |
| [`VERDE.md`](VERDE.md) | El estándar: principios, pilares, roles, ciclo, convenciones, puerta, día 0, lecciones, glosario |
| [`templates/vault/`](templates/vault/) | Vault de Obsidian con estructura, registro de decisiones y plantillas (encargo, revisión, decisión, reunión, status) |
| [`templates/repo/`](templates/repo/) | `AGENTS.md`, plantilla de PR con evidencia, guías, workflows y la puerta |
| [`templates/repo/tools/ci/local-gate.sh`](templates/repo/tools/ci/local-gate.sh) | La puerta, agnóstica de stack: lee `gate.steps` y responde `RESULT GREEN` o `RED` |
| [`tests/`](tests/) | Pruebas de la puerta: `bash tests/gate.test.sh` |
| [`CHANGELOG.md`](CHANGELOG.md) | Versiones |

## Licencia

© 2026 Javier Batres. Documentos bajo [CC BY 4.0](LICENSE); scripts y
plantillas de código bajo [MIT](LICENSE-CODE).
