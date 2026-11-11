---
tipo: backlog
actualizado: {{date}}
---

# Backlog

**Jerarquía:** épica → issue → criterios de aceptación (AC). Cada issue tiene
clave `<KEY>-<n>` y criterios **verificables** (qué comando, captura o número
lo demuestra).

**Estados:** 📝 borrador · ✅ listo · 🔨 en curso · 👀 en revisión · 🎉 hecho

## Ejemplo (bórralo)

### Épica E1 · Acceso

| Issue | Título | Estado | Encargo |
| --- | --- | --- | --- |
| ACME-1 | Inicio de sesión con correo | ✅ listo | — |

**ACME-1 · Inicio de sesión con correo**

- AC1: con credenciales válidas, la persona llega a `/inicio` en < 2 s.
  Evidencia: prueba e2e + captura.
- AC2: con credenciales inválidas, ve "Correo o contraseña incorrectos" y el
  formulario conserva el correo. Evidencia: prueba e2e.
- AC3: la pantalla pasa axe sin violaciones. Evidencia: salida de axe.
