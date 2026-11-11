#!/usr/bin/env bash
# Pruebas de templates/repo/tools/ci/local-gate.sh. Uso: bash tests/gate.test.sh
set -u

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
GATE="$ROOT/templates/repo/tools/ci/local-gate.sh"
FIX="$ROOT/tests/fixtures"
fails=0

# run_gate <fixture|path> -> fija OUT y CODE; corre en un tmp sin .git
run_gate() {
  local steps="$1"
  case "$steps" in /*) ;; *) steps="$FIX/$1" ;; esac
  GATE_TMP="$(mktemp -d)"
  export GATE_TMP
  OUT="$(cd "$GATE_TMP" && GATE_STEPS="$steps" GATE_LOG="$GATE_TMP/gate.log" bash "$GATE" 2>&1)"
  CODE=$?
}

check() { # check <name> <condition...>
  local name="$1"; shift
  if "$@"; then echo "ok   $name"; else echo "FAIL $name"; echo "---- output (exit $CODE):"; echo "$OUT"; fails=$((fails + 1)); fi
}
has() { printf '%s\n' "$OUT" | grep -qxF -- "$1"; }
hasnt() { ! printf '%s\n' "$OUT" | grep -qF -- "$1"; }
starts() { printf '%s\n' "$OUT" | grep -q -- "^$1"; }

run_gate all_pass.steps
check all_pass eval 'has "PASS a" && has "PASS b" && starts "RESULT GREEN" && [ $CODE -eq 0 ]'

run_gate one_fail.steps
check one_fail eval 'has "FAIL a" && has "PASS b" && starts "RESULT RED" && [ $CODE -eq 1 ]'

run_gate optional_missing.steps
check optional_missing eval 'has "SKIP snyk" && starts "RESULT GREEN" && [ $CODE -eq 0 ]'

run_gate setup_failure.steps
check setup_failure_runs_teardown eval 'has "FAIL up" && hasnt "PASS a" && [ -f "$GATE_TMP/down" ] && starts "RESULT RED" && [ $CODE -eq 1 ]'

run_gate pipes.steps
check pipes_and_quotes eval 'has "PASS p" && [ $CODE -eq 0 ]'

run_gate "/nonexistent/gate.steps"
check missing_file eval 'starts "gate: /nonexistent/gate.steps not found" && [ $CODE -eq 2 ]'

run_gate empty.steps
check empty_file eval 'printf "%s\n" "$OUT" | grep -q "gate: no steps in" && [ $CODE -eq 2 ]'

run_gate invalid.steps
check invalid_line eval 'printf "%s\n" "$OUT" | grep -q "invalid.steps:1: invalid line" && [ $CODE -eq 2 ]'

run_gate all_pass.steps
check outside_git eval 'starts "head unknown · "'

run_gate log.steps
check log_capture eval 'hasnt "hola-log" && grep -q "hola-log" "$GATE_TMP/gate.log"'

echo
if [ $fails -eq 0 ]; then echo "all tests passed"; exit 0; else echo "$fails test(s) failed"; exit 1; fi
