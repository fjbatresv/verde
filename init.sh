#!/usr/bin/env bash
# VERDE · arranque de un proyecto nuevo (Día 0).
# Copyright (c) 2026 Javier Batres. MIT License.
#
# Uso: ./init.sh [--no-git] <proyecto> <KEY> [carpeta]
#   proyecto  minúsculas, números y guiones (ej. acme-salas)
#   KEY       clave de issues: 2 a 10 mayúsculas o números, empieza con letra (ej. ACME)
#   carpeta   dónde crear los repos (por defecto, la carpeta actual)
#
# Crea, uno al lado del otro:
#   <carpeta>/<proyecto>/        desde templates/repo/
#   <carpeta>/<proyecto>-vault/  desde templates/vault/
# Reemplaza <PROJECT>, <PROYECTO>, <KEY> y la fecha de las notas (no la de las
# plantillas de Obsidian), y hace el primer commit en ambos repos.
# Código de salida: 0 listo · 1 no se pudo crear · 2 uso incorrecto.

set -euo pipefail
export LC_ALL=C # rangos [A-Z] y sed predecibles en macOS y Linux

usage() {
  sed -n '5,8p' "$0" | sed 's/^# \{0,1\}//' >&2
  exit 2
}

git_init=1
if [ "${1:-}" = "--no-git" ]; then git_init=0; shift; fi
[ $# -ge 2 ] && [ $# -le 3 ] || usage

project="$1" key="$2" dest="${3:-.}"

if ! [[ "$project" =~ ^[a-z0-9][a-z0-9-]*$ ]]; then
  echo "init: proyecto inválido: '$project' (minúsculas, números y guiones)" >&2
  exit 2
fi
if ! [[ "$key" =~ ^[A-Z][A-Z0-9]{1,9}$ ]]; then
  echo "init: clave inválida: '$key' (2 a 10 mayúsculas o números, empieza con letra)" >&2
  exit 2
fi

root="$(cd "$(dirname "$0")" && pwd)"
version="$(sed -n 's/^\*\*Versión \([0-9][0-9.]*\) .*/\1/p' "$root/VERDE.md" | head -n 1)"
[ -n "$version" ] || version="?"
today="$(date '+%Y-%m-%d')"

if [ ! -d "$dest" ]; then
  echo "init: la carpeta '$dest' no existe" >&2
  exit 1
fi
dest="$(cd "$dest" && pwd)"
repo="$dest/$project"
vault="$dest/$project-vault"
for target in "$repo" "$vault"; do
  if [ -e "$target" ]; then
    echo "init: '$target' ya existe; no se toca nada" >&2
    exit 1
  fi
done

cp -R "$root/templates/repo" "$repo"
cp -R "$root/templates/vault" "$vault"

# Reemplaza en el lugar conservando permisos (local-gate.sh sigue ejecutable).
fill() { # fill <archivo> <con fecha: 0|1>
  local file="$1" with_date="$2" tmp
  tmp="$(mktemp)"
  if [ "$with_date" -eq 1 ]; then
    sed -e "s/<PROJECT>/$project/g" -e "s/<PROYECTO>/$project/g" \
        -e "s/<KEY>/$key/g" -e "s/{{date}}/$today/g" "$file" > "$tmp"
  else
    sed -e "s/<PROJECT>/$project/g" -e "s/<PROYECTO>/$project/g" \
        -e "s/<KEY>/$key/g" "$file" > "$tmp"
  fi
  cat "$tmp" > "$file"
  rm -f "$tmp"
}

while IFS= read -r file; do
  case "$file" in
    "$vault"/07-Plantillas/*) fill "$file" 0 ;; # Obsidian pone {{date}} al usarlas
    *) fill "$file" 1 ;;
  esac
done < <(find "$repo" "$vault" -type f ! -name '.gitkeep' ! -name '*.png' ! -name '*.jpg')

chmod +x "$repo/tools/ci/local-gate.sh"

if [ $git_init -eq 1 ]; then
  if ! command -v git > /dev/null 2>&1; then
    echo "init: git no está instalado; los repos quedan sin inicializar" >&2
  else
    for dir in "$repo" "$vault"; do
      (
        cd "$dir"
        git init -q
        git symbolic-ref HEAD refs/heads/main
        git add -A
        if ! git commit -q -m "chore: arranque con VERDE / VDD v$version"; then
          echo "init: no se pudo hacer el primer commit en $dir (¿falta user.name o user.email?)" >&2
        fi
      )
    done
  fi
fi

cat <<MSG
Listo: VERDE / VDD v$version
  código  $repo
  vault   $vault

Siguientes pasos (VERDE.md §9):
  1. Completa nombres, URLs y comandos (los <…> que quedan) en:
       $project/  AGENTS.md README.md docs/vault.md docs/guides/agents.md docs/guides/runbook.md
       $project-vault/  00-Inicio.md
     Los <n>, <slug> y similares de guías y plantillas son parte de las convenciones: se quedan.
  2. Registra en el vault las decisiones de arranque (stack, alcance, roles).
  3. Ajusta gate.steps a tu stack y corre make gate hasta RESULT GREEN.
  4. Sube ambos repos como privados y protege main (PR, squash, check gate).
MSG
