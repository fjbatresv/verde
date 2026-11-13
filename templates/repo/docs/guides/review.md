# Guía del revisor

Cómo se revisa una entrega en este proyecto (pilar **R** de VERDE). Sirve igual
para una persona que para un agente revisor.

## Lo esencial

- **El revisor nunca es el autor.** Tampoco un agente del mismo operador.
- **Verifica, no redescubre.** El autor ya escribió la evidencia en su archivo
  de PR; el revisor la comprueba.
- **Ve la aplicación.** Un cambio de UI no se aprueba leyendo el diff.
- **No toca el código del PR.** Pide el cambio; si lo hace él, deja de ser
  revisor y se vuelve coautor.
- **No decide alcance.** Lo que el encargo no decide va al PM.
- La revisión se escribe en el vault: `06-Revisiones/<KEY>-<n>-revision.md`,
  desde `07-Plantillas/Plantilla-Revision.md`.

## 1. Preparar

1. Lee el encargo (`03-Encargos/…`) y el archivo de PR (`docs/prs/…`).
2. Abre una worktree **en el commit exacto** que vas a revisar:

   ```sh
   git fetch origin
   git worktree add ../<PROJECT>-review-<KEY>-<n> <sha>
   ```

3. Levanta el entorno como dice el runbook, con datos de prueba que permitan
   recorrer todos los criterios (por ejemplo, dos usuarios distintos si un
   criterio habla de permisos).

## 2. Verificar la evidencia

- Corre `make gate` sobre ese commit. Si no da `RESULT GREEN`, la revisión
  termina ahí con un hallazgo bloqueante.
- Para cada criterio, reproduce **al menos una** prueba de la evidencia: el
  comando, la prueba o el flujo.
- Desconfía de la evidencia que pasaría aunque el código estuviera mal:
  - una prueba de permisos que usa el mismo usuario en los dos lados;
  - respuestas simuladas donde el criterio pide el sistema real;
  - aserciones vacías o que sólo comprueban que "no explotó";
  - capturas de otra rama o de antes del último commit.
- Responde las "Open questions" del archivo de PR. Si alguna necesita una
  decisión, escálala al PM y anótala.

## 3. Leer el diff

- **Alcance:** nada fuera del encargo. Lo que sobra va como hallazgo, aunque
  esté bien hecho.
- **Decisiones:** el código respeta las `D-xxx` y los ADR citados.
- **Causas, no síntomas:** sin reintentos nuevos, timeouts más largos, pruebas
  saltadas (`skip`), aserciones relajadas ni cambios de diseño para callar un
  check.
- **Higiene:** sin secretos, sin `.env` real, versiones fijadas, docs al día.

## 4. Revisión en vivo

Recorre cada flujo afectado **como lo haría un usuario nuevo**, con Playwright
(un script, el modo `codegen` o un servidor MCP del navegador). Guarda las
capturas en `tmp/review/<KEY>-<n>/` y adjunta las relevantes al vault
(`99-Adjuntos/`).

Qué mirar, además de los criterios:

| Aspecto | Qué buscar |
| --- | --- |
| Estados | vacío, cargando, error, sin permisos; botones deshabilitados que expliquen por qué |
| Textos | términos iguales en toda la app, ortografía, mensajes de error en el campo que falla |
| Formatos | fechas, horas y zona horaria, números y moneda |
| Tamaños | escritorio, laptop de 13" y móvil: nada fuera de pantalla ni doble scroll |
| Teclado | foco visible, orden de tabulación, `Esc` cierra modales |
| Accesibilidad | **axe** sin violaciones en cada pantalla tocada |
| Consola | sin errores ni avisos nuevos |
| Temas | claro y oscuro, si el producto los tiene |

Ejemplo mínimo de script de revisión (Node; adapta la URL y el flujo):

```ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const out = 'tmp/review/ACME-12';

for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
  test(`my bookings · ${viewport.width}px`, async ({ page }) => {
    await page.setViewportSize(viewport);
    await page.goto('/my-bookings');
    await page.screenshot({ path: `${out}/my-bookings-${viewport.width}.png`, fullPage: true });
    const axe = await new AxeBuilder({ page }).analyze();
    expect(axe.violations).toEqual([]);
  });
}
```

## 5. Escribir la revisión

Arriba, el **veredicto** en una o dos líneas. Debajo, en este orden: criterios,
revisión en vivo, puerta, lo que está bien, hallazgos y respuestas a las
preguntas abiertas.

**Hallazgos.** Cada uno tiene un ID, dónde está, qué pasa y qué se espera:

| Severidad | Significa | ID | ¿Bloquea el merge? |
| --- | --- | --- | --- |
| **bloqueante** | No se puede integrar, o impide revisar el resto (la puerta en rojo, un fallo de seguridad o de datos) | `R1`, `R2`… | Sí |
| **mayor** | Un criterio no se cumple o hay un defecto que el usuario va a ver | `R…` | Sí |
| **menor** | Conviene corregirlo, pero no impide integrar | `N1`, `N2`… | No: lleva destino |
| **nota** | Información, una duda o algo a vigilar | `N…` | No |

- Los `R` se corrigen en este PR. Los `N` llevan **destino**: "en esta ronda si
  se toca ese archivo", "encargo de mantenimiento <KEY>-<n>", "vigilar" o "sin
  acción".
- "Qué hacer" describe el resultado esperado, no el parche: el autor elige
  cómo llegar.
- Empieza por "Lo que está bien". Dice al autor qué no debe tocar y deja
  constancia de lo verificado.

## 6. Rondas

Si hay `R` abiertos, el resultado es `cambios-requeridos`. El autor corrige en
la misma rama y responde cada ID en una sección "Round N" de su archivo de PR.

El revisor agrega a la misma nota una sección `## Ronda N (<sha>)` con una tabla
que verifica **cada** ID (✅ / ❌ y cómo lo comprobó), vuelve a correr la puerta y
actualiza el veredicto de arriba. Los hallazgos nuevos de esa ronda siguen la
numeración (`R5`, `N3`…), nunca la reinician.

## 7. Estados de una revisión

| Estado | Quién lo pone | Significa |
| --- | --- | --- |
| `cambios-requeridos` | revisor | Hay `R` abiertos. |
| `aprobado-por-revisor` | revisor | Sin `R` abiertos; espera al PO. |
| `aprobado` | PO | Listo para integrar. |
| `integrado` | PM | Squash merge hecho; se anota el commit en "Tras el merge". |

Si el revisor es un agente, una persona con rol de revisor o PM firma el paso a
`aprobado-por-revisor`.

## 8. Lanzar un agente revisor

Una worktree en el commit del PR, una sesión por ronda y un operador distinto
del que lanzó al autor:

```sh
git worktree add ../<PROJECT>-review-<KEY>-<n> <sha>
cd ../<PROJECT>-review-<KEY>-<n>
<agente> "Eres el revisor del PR <n>. Lee AGENTS.md, docs/guides/review.md, el
encargo ../<PROJECT>-vault/03-Encargos/<archivo>.md y docs/prs/<archivo>.md.
Sigue la guía: corre make gate, verifica cada criterio, revisa en vivo con
Playwright y axe, y escribe la revisión desde la plantilla en
../<PROJECT>-vault/06-Revisiones/<KEY>-<n>-revision.md. No edites el código,
no hagas commit en el repo y no apruebes: deja el resultado como
cambios-requeridos o aprobado-por-revisor para que lo firme una persona."
```

El agente revisor escribe en el vault sólo su nota de revisión; la persona que
la firma la confirma con su commit.

## 9. Calibrar al revisor (errores sembrados)

Antes de confiar en un agente revisor, y cada vez que cambies esta guía, el
modelo o la herramienta, pruébalo con fallas que tú pusiste:

1. Crea una rama `maint/<KEY>-<n>-calibracion` desde un PR ya integrado.
2. Siembra **cuatro fallas**, una de cada tipo:
   - visual, que sólo se ve en vivo (un botón fuera de pantalla en móvil);
   - de accesibilidad (un contraste insuficiente o un campo sin etiqueta);
   - un criterio incumplido con evidencia engañosa (una prueba que pasa por la
     razón equivocada);
   - de lógica o seguridad, sin UI (un permiso que la API no verifica).
3. Anota la lista **fuera** del alcance del revisor (no en el repo ni en el
   vault que lee).
4. Lanza al revisor con el archivo de PR de la rama, como si fuera real.
5. Compara: ¿encontró cada falla?, ¿con qué severidad? Todas deberían salir
   como `R`.
6. Lo que se le escape es una línea nueva en esta guía, en el prompt o en el
   encargo. Repite hasta que encuentre las cuatro.

Guarda el resultado de cada calibración en el vault (`06-Revisiones/`), con
fecha, modelo y fallas detectadas: así se ve si un cambio de modelo empeora la
revisión.
