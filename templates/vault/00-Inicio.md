---
tipo: inicio
actualizado: {{date}}
---

# <PROYECTO> · Inicio

Este vault es la memoria del proyecto (pilar **V** de VERDE / VDD v1.3). Si
algo no está aquí, no se decidió.

## Estado

<Una o dos líneas: en qué está el proyecto hoy y qué sigue.>

## Equipo

| Rol | Quién |
| --- | --- |
| PO | <nombre> |
| PM | <nombre o agente> |
| Revisores | <nombres o agentes> |
| Devs | <personas y agentes> |
| Operadores | <personas que lanzan y vigilan agentes> |
| Arquitecto (opcional) | <nombre o agente> |

## Mapa

| Carpeta | Qué hay | Quién escribe |
| --- | --- | --- |
| `01-Producto/` | Visión, alcance, roadmap | PO, PM |
| `02-Backlog/` | [[Backlog]]: épicas, issues, criterios | PM (aprueba el PO) |
| `03-Encargos/` | Un encargo por trabajo asignado a un responsable (dev humano o agente) | PM |
| `04-Decisiones/` | [[Registro-de-decisiones]] | PM (aprueba el PO) |
| `05-Reuniones/` | Notas y acuerdos | PO, PM |
| `06-Revisiones/` | Revisión de cada PR, con revisión en vivo | Revisores |
| `07-Plantillas/` | Plantillas de todo lo anterior | PM |
| `08-Status/` | Status del día | PM |
| `99-Adjuntos/` | Capturas, diagramas, PDFs | PO, PM |

## Repos

- Código: `<url>` (clonado como `<PROYECTO>/`)
- Vault: `<url>` (clonado como `<PROYECTO>-vault/`, al lado)

Escriben el PO, el PM y los revisores. Los devs (personas y agentes) lo leen y
proponen cambios en su archivo de PR.
