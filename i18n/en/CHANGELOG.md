# Changelog

> English translation of [`CHANGELOG.md`](../../CHANGELOG.md).

Since v1.3.0, VERDE follows [Semantic Versioning](https://semver.org/)
(`MAJOR.MINOR.PATCH`), with the rules in [`VERDE.md`](VERDE.md) §14:

- **MAJOR:** a pillar, a principle or a mandatory rule changes, or something
  projects depend on breaks (the `gate.steps` format, the gate's output and
  exit codes, the conventions in §7, the `init.sh` interface, the structure of
  the templates). Comes with migration notes.
- **MINOR:** adds guides, templates, examples or compatible capabilities.
- **PATCH:** fixes errors, text or examples without changing rules or adding
  content.

Earlier versions used `MAJOR.MINOR`: v1.0, v1.1 and v1.2 are equivalent to
1.0.0, 1.1.0 and 1.2.0.

## Unreleased

- `guias/herramientas.md` guide: recommended tools to set up VERDE (Orca,
  agents by role, Stitch, GitHub Actions, Snyk, Dependabot, SonarQube,
  CodeRabbit and Sentry), with where each one fits and how it connects to the
  gate.
- English translation of the standard, the reviewer guide, the worked example
  and this changelog, in `i18n/en/`. The Spanish text remains the reference.

## v1.3.0 — 2026-11-13

- Semantic versioning (`MAJOR.MINOR.PATCH`) for the framework.
- Review: reviewer guide (`docs/guides/review.md`) covering how to verify the
  evidence, what to look at live, how to launch a reviewer agent and how to
  calibrate it with seeded faults.
- Review: findings with IDs (`R` blocks, `N` does not block and gets a
  destination), states `cambios-requeridos` → `aprobado-por-revisor` →
  `aprobado` → `integrado`, and a review template with verdict, rounds and
  "Tras el merge" (after the merge).
- CI: screenshots in `tmp/screenshots/` are uploaded as a run artifact.
- Worked example `examples/acme/`: one issue with two rounds, a new decision
  and its status, with a conventions test.
- `init.sh`: creates the code repo and the vault of a new project, with its
  test.

## v1.2 — 2026-11-12

- Gate: `?optional` steps ignore `cd <folder> &&` prefixes when looking for the
  tool (monorepos), with its test.
- Gate: the Go and .NET coverage examples fail below the threshold; threshold
  note for Node.
- Gate: `setup ports-free` as an example of a precondition check.
- Briefs and status name the **owner** (person or agent), not just the agent.

## v1.1 — 2026-11-11

- Gate: `gate.steps` examples for Go, Java, .NET and monorepos.
- Gate: operating systems note (macOS, Linux, Windows with WSL or Git Bash).

## v1.0 — 2026-11-11

- First public version of VERDE / VDD.
- `VERDE.md` standard: principles, five pillars, roles, cycle, conventions,
  checks gate, day 0, context hygiene, lessons and ES/EN glossary.
- Roles by responsibility (PO, PM, reviewer, dev, operator), human developers
  who code or operate agents, rules for teams with several members and two
  practice scenarios.
- Vault template (Obsidian) and repo template with the stack-agnostic gate
  (`local-gate.sh` + `gate.steps`).
