# Checklist al añadir o cambiar un módulo con ejemplos

Regla de la casa: **todo código que el alumno pueda ejecutar debe revisarse para que sea lo más rápido y optimizado posible.**
La vía rápida (Mono) tarda ~1 s; la de .NET, ~5 s. Si un ejemplo puede escribirse de forma equivalente para ir por Mono, se escribe así.

1. `node tools/auditar-ejemplos.js` → lista los bloques que irán por .NET y por qué.
2. Para cada uno, intentar la versión equivalente que Mono acepta, **sin perder valor didáctico**:
   - Decimales: `(int)x`, `{x:F2}` o `x.ToString("F2")` en vez de imprimirlos crudos (`"Total: " + total`).
   - Moneda/porcentaje: `:F2` en vez de `:C2` / `:P0` (dependen de la cultura del servidor).
   - `switch` expresión (C# 8) → `switch` clásico; alternativa avanzada solo si el tema lo exige.
   - `Random.Shared` → `new Random()`.
   - `Console.ReadKey/Clear/SetCursor` → evitar en ejemplos ejecutables.
3. Si la versión «profesional» exige sintaxis moderna, es legítimo que vaya por .NET: dejar la versión básica por Mono y explicar la diferencia.
4. Revisar también el rendimiento del propio código: sin bucles innecesarios, `StringBuilder` si se concatena en bucle, `List<T>` frente a arrays redimensionados a mano, sin `while (true)`.
5. Subir a producción y pasar `diagnostico.html` con el servidor real para confirmar que Mono da la misma salida.
6. Subir versión en `sw.js` y empujar a GitHub.

**En cada commit:** repasar los ejercicios (paso 1) y recordar pasar `diagnostico.html`. La página lee `data/course.js`, así que los ejercicios nuevos entran solos en el informe.
