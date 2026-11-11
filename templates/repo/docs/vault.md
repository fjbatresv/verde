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

- Lo escriben **sólo el PO y el PM**, con commit y push directo a `main`.
- Los agentes lo leen y nunca lo modifican; su entregable vive en este repo
  (`docs/prs/`).
- `.obsidian/` no se versiona: cada persona tiene su configuración.
- Nada de secretos, IPs o datos de clientes en el vault.
