#!/usr/bin/env bash
# VERDE · puerta local de checks (pilar Evidencia).
# Copyright (c) 2026 Javier Batres. MIT License.
#
# Lee los pasos de GATE_STEPS (por defecto gate.steps), uno por línea:
#   <kind> <name>: <command>
#   kind     setup | step | teardown
#   name     sin espacios; prefijo "?" = opcional (SKIP si falta la herramienta)
#   command  se ejecuta con `bash -c`, tal cual
# Las líneas en blanco y las que empiezan con "#" se ignoran.
#
# Salida: "head …", una línea PASS|FAIL|SKIP por paso y "RESULT GREEN|RED".
# La salida de los comandos va a GATE_LOG (por defecto tmp/gate.log).
# Código de salida: 0 GREEN · 1 RED · 2 error de configuración.

set -uo pipefail

STEPS_FILE="${GATE_STEPS:-gate.steps}"
LOG="${GATE_LOG:-tmp/gate.log}"

if [ ! -f "$STEPS_FILE" ]; then
  echo "gate: $STEPS_FILE not found" >&2
  exit 2
fi

kinds=() names=() cmds=()
n=0
while IFS= read -r line || [ -n "$line" ]; do
  n=$((n + 1))
  trimmed="${line#"${line%%[![:space:]]*}"}"
  case "$trimmed" in '' | '#'*) continue ;; esac
  if [[ "$trimmed" =~ ^(setup|step|teardown)[[:space:]]+(\??[A-Za-z0-9_.-]+):[[:space:]]*(.+)$ ]]; then
    kinds+=("${BASH_REMATCH[1]}")
    names+=("${BASH_REMATCH[2]}")
    cmds+=("${BASH_REMATCH[3]}")
  else
    echo "$STEPS_FILE:$n: invalid line" >&2
    exit 2
  fi
done < "$STEPS_FILE"

if [ ${#kinds[@]} -eq 0 ]; then
  echo "gate: no steps in $STEPS_FILE" >&2
  exit 2
fi

mkdir -p "$(dirname "$LOG")"
: > "$LOG"

head_sha="$(git rev-parse --short=7 HEAD 2>/dev/null || echo unknown)"
echo "head $head_sha · $(date '+%Y-%m-%d %H:%M:%S')"

red=0
setup_failed=0

run() { # run <index>
  local name="${names[$1]}" cmd="${cmds[$1]}" optional=0
  if [ "${name:0:1}" = "?" ]; then optional=1; name="${name:1}"; fi
  if [ $optional -eq 1 ]; then
    local tool="${cmd%%[[:space:]]*}"
    if ! command -v "$tool" > /dev/null 2>&1; then
      echo "SKIP $name"
      echo "== SKIP $name ($tool not found)" >> "$LOG"
      return 0
    fi
  fi
  echo "== $name: $cmd" >> "$LOG"
  if bash -c "$cmd" >> "$LOG" 2>&1; then
    echo "PASS $name"
    return 0
  fi
  echo "FAIL $name"
  red=1
  return 1
}

i=0
while [ $i -lt ${#kinds[@]} ]; do
  case "${kinds[$i]}" in
    setup) [ $setup_failed -eq 0 ] && { run $i || setup_failed=1; } ;;
    step) [ $setup_failed -eq 0 ] && run $i ;;
  esac
  i=$((i + 1))
done

i=0
while [ $i -lt ${#kinds[@]} ]; do
  [ "${kinds[$i]}" = teardown ] && run $i
  i=$((i + 1))
done

if [ $red -eq 0 ]; then
  echo "RESULT GREEN · log $LOG"
  exit 0
fi
echo "RESULT RED · log $LOG"
exit 1
