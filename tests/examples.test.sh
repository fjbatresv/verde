#!/usr/bin/env bash
# Verifica que los ejemplos resueltos (examples/*/) sigan las convenciones de
# VERDE.md §7. Uso: bash tests/examples.test.sh
set -u
export LC_ALL=C

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
fails=0
fail() { echo "FAIL $1"; fails=$((fails + 1)); }
ok() { echo "ok   $1"; }

for ex in "$ROOT"/examples/*/; do
  name="$(basename "$ex")" V="$ex/vault" R="$ex/repo"
  registro="$V/04-Decisiones/Registro-de-decisiones.md"
  bad=0

  # Nombres de archivo
  for f in "$V"/03-Encargos/*.md; do
    [[ "$(basename "$f")" =~ ^[A-Z][A-Z0-9]+-[0-9]+-[a-z0-9]+-[a-z0-9-]+\.md$ ]] || { fail "$name encargo name: $(basename "$f")"; bad=1; }
  done
  for f in "$V"/06-Revisiones/*.md; do
    [[ "$(basename "$f")" =~ ^[A-Z][A-Z0-9]+-[0-9]+-revision\.md$ ]] || { fail "$name revision name: $(basename "$f")"; bad=1; }
  done
  for f in "$R"/docs/prs/*.md; do
    base="$(basename "$f" .md)"
    [[ "$base" =~ ^([A-Z][A-Z0-9]+-[0-9]+)-[a-z0-9-]+$ ]] || { fail "$name PR file name: $base"; bad=1; continue; }
    issue="${BASH_REMATCH[1]}"
    head -n 1 "$f" | grep -q "^# $issue · " || { fail "$name PR title: $base"; bad=1; }
    grep -q "feat/$base\`" "$f" || { fail "$name PR branch: $base"; bad=1; }
    grep -rq "feat/$base\`" "$V/03-Encargos" || { fail "$name encargo branch for $base"; bad=1; }
  done
  [ $bad -eq 0 ] && ok "$name file names and branches"

  # Decisiones citadas existen en el registro
  bad=0
  for d in $(grep -rhoE 'D-[0-9]{3}' "$ex" | sort -u); do
    grep -q "^| $d | " "$registro" || { fail "$name $d cited but not in registro"; bad=1; }
  done
  [ $bad -eq 0 ] && ok "$name decisions exist"

  # Enlaces a notas del vault (las imágenes no se incluyen)
  bad=0
  for link in $(grep -rhoE '\[\[[^]|]+' "$V" | sed 's/^\[\[//' | grep -vE '\.(png|jpg|jpeg|gif|svg)$' | sort -u); do
    [ -n "$(find "$V" -name "$link.md" -print -quit)" ] || { fail "$name broken link [[$link]]"; bad=1; }
  done
  [ $bad -eq 0 ] && ok "$name vault links resolve"

  # Commits citados: `<sha> <KEY>-<n>: <imperativo>` (< 72, sin punto final)
  bad=0
  while IFS= read -r msg; do
    [ ${#msg} -lt 72 ] && [[ "$msg" =~ ^[A-Z][A-Z0-9]+-[0-9]+:\ [A-Z].*[^.]$ ]] || { fail "$name commit message: $msg"; bad=1; }
  done < <(grep -rhoE '`[0-9a-f]{7} [A-Z][A-Z0-9]+-[0-9]+: [^`]+`' "$ex" | sed -E 's/^`[0-9a-f]{7} //; s/`$//')
  [ $bad -eq 0 ] && ok "$name commit messages"

  # Revisiones: estado válido, revisor distinto del autor, cada hallazgo
  # respondido en el archivo de PR y verificado en una ronda
  for rev in "$V"/06-Revisiones/*.md; do
    issue="$(basename "$rev" -revision.md)"
    pr="$(ls "$R"/docs/prs/"$issue"-*.md 2>/dev/null | head -n 1)"
    bad=0
    state="$(sed -n 's/^resultado: //p' "$rev")"
    case "$state" in cambios-requeridos | aprobado-por-revisor | aprobado | integrado) ;; *) fail "$name $issue state: $state"; bad=1 ;; esac
    autor="$(sed -n 's/^autor: //p' "$rev")" revisor="$(sed -n 's/^revisor: //p' "$rev")"
    rname="${revisor%% *}"
    case "$autor" in *"$rname"*) fail "$name $issue reviewer is the author"; bad=1 ;; esac
    [ -n "$pr" ] || { fail "$name $issue has no PR file"; bad=1; }
    ids="$(grep -oE '^\| [RN][0-9]+ \| (bloqueante|mayor|menor|nota) \|' "$rev" | grep -oE '[RN][0-9]+' | sort -u)"
    [ -n "$ids" ] || { fail "$name $issue has no findings table"; bad=1; }
    for id in $ids; do
      [ -n "$pr" ] && sed -n '/^## Round [0-9]/,$p' "$pr" | grep -q "^| $id |" || { fail "$name $issue $id not answered in PR file"; bad=1; }
      sed -n '/^## Ronda [0-9]/,$p' "$rev" | grep -q "^| $id |" || { fail "$name $issue $id not verified in a review round"; bad=1; }
    done
    if [ "$state" = integrado ] && ! sed -n '/^## Tras el merge/,$p' "$rev" | grep -qE 'Squash `[0-9a-f]{7}`'; then
      fail "$name $issue integrado without squash commit"; bad=1
    fi
    [ $bad -eq 0 ] && ok "$name $issue review complete"
  done

  # Sin marcadores sin completar
  if grep -rnE '<[A-Za-z][^>]*>' "$ex" > /dev/null; then
    fail "$name has unfilled <placeholders>"; grep -rnE '<[A-Za-z][^>]*>' "$ex" | head -5
  else
    ok "$name has no placeholders"
  fi
done

echo
if [ $fails -eq 0 ]; then echo "all tests passed"; exit 0; else echo "$fails test(s) failed"; exit 1; fi
