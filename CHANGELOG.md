# Changelog

Las versiones siguen `MAJOR.MINOR`. Un cambio MAJOR altera un pilar o una regla
obligatoria; un MINOR agrega guías, plantillas o aclaraciones.

## v1.2 — 2026-11-12

- Puerta: los pasos `?opcionales` ignoran prefijos `cd <carpeta> &&` al buscar
  la herramienta (monorepos), con su prueba.
- Puerta: los ejemplos de cobertura de Go y .NET fallan bajo el umbral; nota
  de umbral para Node.
- Puerta: `setup ports-free` como ejemplo de verificación de precondiciones.
- Encargos y status nombran al **responsable** (persona o agente), no sólo al
  agente.

## v1.1 — 2026-11-11

- Puerta: ejemplos de `gate.steps` para Go, Java, .NET y monorepos.
- Puerta: nota de sistemas operativos (macOS, Linux, Windows con WSL o Git Bash).

## v1.0 — 2026-11-11

- Primera versión pública de VERDE / VDD.
- Estándar `VERDE.md`: principios, cinco pilares, roles, ciclo, convenciones,
  puerta de checks, día 0, higiene de contexto, lecciones y glosario ES/EN.
- Roles por responsabilidad (PO, PM, revisor, dev, operador), desarrolladores
  humanos que programan u operan agentes, reglas para equipos de varios
  integrantes y dos escenarios de práctica.
- Plantilla de vault (Obsidian) y plantilla de repo con la puerta agnóstica de
  stack (`local-gate.sh` + `gate.steps`).
