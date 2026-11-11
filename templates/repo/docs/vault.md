# El vault

El contexto del proyecto (producto, backlog, encargos, revisiones, reuniones,
decisiones y status) vive en un repo aparte, privado: `<PROJECT>-vault`.

```sh
# al lado de este repo
git clone <url-del-vault> ../<PROJECT>-vault
```

Ábrelo con Obsidian (o cualquier editor de Markdown) y empieza por
`00-Inicio.md`.

## Reglas

- Lo escriben **el PO, el PM y los revisores**, con commit y push directo a
  `main`.
- Los devs (personas y agentes) lo leen; su entregable vive en este repo
  (`docs/prs/`) y ahí proponen cambios al vault.
- `.obsidian/` no se versiona: cada persona tiene su configuración.
- Nada de secretos, IPs o datos de clientes en el vault.
