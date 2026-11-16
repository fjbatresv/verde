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
- **Idiomas:** español en la raíz (`/`) e inglés en `/en/`. Las páginas en
  inglés se generan desde `i18n/en/` (misma ruta que el original); si falta una
  traducción, se usa el original. Las páginas a mano en inglés están en
  `src/content/docs/en/` y la portada recibe `lang="en"`.
- **Autoría:** `src/components/Footer.astro` agrega el crédito y la licencia
  en todas las páginas; la portada lo lleva al final.
- **Diagramas:** los bloques `mermaid` se dibujan en el navegador
  (`src/plugins/remark-mermaid.mjs` y `src/components/Head.astro`).

## Logos de herramientas

La sección "Herramientas y agentes" de la portada muestra un monograma por
herramienta. Para usar el logo oficial, descárgalo del kit de marca (*brand
assets* o *press kit*) de cada servicio, respeta sus condiciones de uso y
guárdalo en `public/logos/` con el nombre de su `id`. Se detecta solo en el
build (`.webp`, `.svg` o `.png`, en ese orden) y lleva su texto alternativo
("Logo de Orca", "Orca logo"). Los logos actuales están en `.webp` de 160×160,
recortados al símbolo.

| Herramienta | Archivo |
| --- | --- |
| Orca | `orca.webp` |
| Obsidian | `obsidian.webp` |
| Stitch | `stitch.webp` |
| Kiro | `kiro.webp` |
| Claude Code | `claude-code.webp` |
| Codex | `codex.webp` |
| CodeRabbit | `coderabbit.webp` |
| Cursor | `cursor.webp` |
| Gemini CLI | `gemini-cli.webp` |
| opencode | `opencode.webp` |
| GitHub Actions | `github-actions.webp` |
| Playwright | `playwright.webp` |
| axe | `axe.webp` |
| Snyk | `snyk.webp` |
| Dependabot | `dependabot.webp` |
| SonarQube Server | `sonarqube.webp` |
| SonarQube Cloud | `sonarcloud.webp` |
| Sentry | `sentry.webp` |

Los `id` están en `src/data/toolkit.ts`. Prefiere la versión cuadrada del logo
(el isotipo, sin el nombre): la ficha ya muestra el nombre en texto.

## Comandos

Usa la versión de Node de `.nvmrc` (24, la LTS activa; el mínimo que exige
Astro es 22.23.4): con nvm, `nvm use` dentro de `site/`.


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
