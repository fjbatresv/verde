#!/usr/bin/env bash
# Pruebas de init.sh. Uso: bash tests/init.test.sh
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
INIT="$ROOT/init.sh"
FIX="$ROOT/tests/fixtures"
export GIT_AUTHOR_NAME=VERDE GIT_AUTHOR_EMAIL=verde@example.com
export GIT_COMMITTER_NAME=VERDE GIT_COMMITTER_EMAIL=verde@example.com
fails=0
today="$(date '+%Y-%m-%d')"

check() { # check <name> <condition>
  if eval "$2"; then echo "ok   $1"; else echo "FAIL $1"; echo "---- output (exit $CODE):"; echo "$OUT"; fails=$((fails + 1)); fi
}
run_init() { # run_init <args...> -> OUT, CODE; corre en un tmp nuevo ($T)
  T="$(mktemp -d)"
  OUT="$(cd "$T" && bash "$INIT" "$@" 2>&1)"
  CODE=$?
}

run_init acme-salas ACME .
R="$T/acme-salas" V="$T/acme-salas-vault"
check creates_both '[ $CODE -eq 0 ] && [ -f "$R/AGENTS.md" ] && [ -f "$V/00-Inicio.md" ]'
check no_project_or_key_markers '! grep -rqE "<(PROJECT|PROYECTO|KEY)>" "$R" "$V" --exclude-dir=.git'
check names_filled 'grep -q "acme-salas-vault" "$R/AGENTS.md" && grep -q "ACME-<n>" "$R/AGENTS.md"'
check d001_dated 'grep -q "^| D-001 | $today | Adoptamos VERDE" "$V/04-Decisiones/Registro-de-decisiones.md"'
check notes_dated '! grep -rq "{{date}}" "$V" --exclude-dir=07-Plantillas --exclude-dir=.git'
check templates_keep_date 'grep -q "{{date}}" "$V/07-Plantillas/Plantilla-Encargo.md"'
check gate_executable '[ -x "$R/tools/ci/local-gate.sh" ]'
check first_commits '[ "$(git -C "$R" rev-list --count HEAD)" = 1 ] && [ "$(git -C "$V" rev-list --count HEAD)" = 1 ] && [ "$(git -C "$R" branch --show-current)" = main ]'
check clean_trees '[ -z "$(git -C "$R" status --porcelain)" ] && [ -z "$(git -C "$V" status --porcelain)" ]'
check version_in_commit 'git -C "$R" log -1 --format=%s | grep -qE "^chore: arranque con VERDE / VDD v[0-9]+\.[0-9]+$"'
G="$(cd "$R" && GATE_STEPS="$FIX/all_pass.steps" make -s gate 2>&1)"
check gate_green_in_new_repo 'printf "%s\n" "$G" | grep -q "^RESULT GREEN"'

OUT2="$(cd "$T" && bash "$INIT" acme-salas ACME "$T" 2>&1)"; CODE=$?
check refuses_existing '[ $CODE -eq 1 ] && printf "%s" "$OUT2" | grep -q "ya existe" && [ "$(git -C "$R" rev-list --count HEAD)" = 1 ]'

run_init acme acme
check invalid_key '[ $CODE -eq 2 ] && printf "%s" "$OUT" | grep -q "clave inválida" && [ ! -e "$T/acme" ]'

run_init Acme_Salas ACME
check invalid_project '[ $CODE -eq 2 ] && [ -z "$(ls -A "$T")" ]'

run_init acme
check usage '[ $CODE -eq 2 ] && printf "%s" "$OUT" | grep -q "Uso:"'

run_init --no-git acme ACME
check no_git '[ $CODE -eq 0 ] && [ ! -d "$T/acme/.git" ] && [ ! -d "$T/acme-vault/.git" ]'

echo
if [ $fails -eq 0 ]; then echo "all tests passed"; exit 0; else echo "$fails test(s) failed"; exit 1; fi
