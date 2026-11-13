# Changelog

Desde v1.3.0, VERDE sigue [Versionado Semántico](https://semver.org/lang/es/)
(`MAJOR.MINOR.PATCH`), con las reglas de `VERDE.md` §14:

- **MAJOR:** cambia un pilar, un principio o una regla obligatoria, o rompe algo
  de lo que dependen los proyectos (formato de `gate.steps`, salida y códigos de
  la puerta, convenciones de §7, interfaz de `init.sh`, estructura de las
  plantillas). Trae notas de migración.
- **MINOR:** agrega guías, plantillas, ejemplos o capacidades compatibles.
- **PATCH:** corrige errores, textos o ejemplos sin cambiar reglas ni agregar
  contenido.

Las versiones anteriores usaban `MAJOR.MINOR`: v1.0, v1.1 y v1.2 equivalen a
1.0.0, 1.1.0 y 1.2.0.

## v1.3.0 — 2026-11-13

- Versionado semántico (`MAJOR.MINOR.PATCH`) para el framework.
- Revisión: guía del revisor (`docs/guides/review.md`) con verificación de la
  evidencia, qué mirar en vivo, cómo lanzar un agente revisor y cómo
  calibrarlo con fallas sembradas.
- Revisión: hallazgos con ID (`R` bloquea, `N` no bloquea y lleva destino),
  estados `cambios-requeridos` → `aprobado-por-revisor` → `aprobado` →
  `integrado`, y plantilla de revisión con veredicto, rondas y "Tras el merge".
- CI: las capturas de `tmp/screenshots/` se suben como artefacto del run.
- Ejemplo resuelto `examples/acme/`: un issue con dos rondas, una decisión
  nueva y su status, con prueba de convenciones.
- `init.sh`: crea el repo de código y el vault de un proyecto nuevo, con su
  prueba.

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
