# Sitio web de VERDE

[verde.fjbatresv.com](https://verde.fjbatresv.com), hecho con
[Astro Starlight](https://starlight.astro.build/).

## Cómo funciona

- **Páginas a mano:** `src/content/docs/index.mdx` (portada),
  `empezar.mdx` y `plantillas.mdx`.
- **Páginas generadas:** `scripts/sync-docs.mjs` convierte `VERDE.md`, la guía
  del revisor, el ejemplo ACME y el `CHANGELOG.md` en páginas del sitio. No se
  versionan ni se editan aquí: se edita el Markdown original y el sitio se
  regenera. El script reescribe los enlaces relativos (a páginas del sitio o a
  GitHub), convierte los enlaces de Obsidian y escapa los marcadores `<…>`.
- **Diagramas:** los bloques `mermaid` se dibujan en el navegador
  (`src/plugins/remark-mermaid.mjs` y `src/components/Head.astro`).

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm ci` | Instala las dependencias (versiones exactas) |
| `npm run dev` | Genera las páginas y levanta el sitio en `localhost:4321` |
| `npm run build` | Genera las páginas y construye `dist/` |
| `npm test` | Pruebas del generador de páginas |
| `npm run check` | Revisa que no haya enlaces internos rotos en `dist/` |

## Publicación

`.github/workflows/site.yml` construye y prueba el sitio en cada PR que lo
toca, y lo publica en GitHub Pages al integrar en `main`.
