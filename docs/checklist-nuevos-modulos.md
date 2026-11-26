# Checklist al añadir o cambiar un módulo con ejemplos

**Regla 1 (la más importante): el alumno aprende C# moderno.** Nunca se cambia un ejemplo a sintaxis antigua solo para que vaya por Mono.
La vía rápida es un detalle técnico invisible; lo que se enseña manda. Si el código moderno no cabe en Mono, va por .NET (más lento, pero correcto y actual).

**Regla 2:** en todo código ejecutable, buscar la versión más optimizada **sin sacrificar la regla 1**. La vía rápida (Mono) tarda ~1 s; la de .NET, ~5 s.

1. `node tools/auditar-ejemplos.js` → lista los bloques que irán por .NET y por qué.
2. Para cada bloque que vaya por .NET, decidir con criterio didáctico:
   - Cambios **que también son buena práctica actual** (se pueden hacer): `{x:F2}` o `(int)x` en vez de imprimir decimales sin formato; `Math.Round` explícito; evitar `Console.ReadKey/Clear`.
   - Cambios **que enseñarían algo antiguo** (NO se hacen): `switch` expresión → `switch` clásico (en el tema de `switch` se muestra el clásico *y* el moderno), `Random.Shared` → `new Random()`, quitar `is not`, `new()`, rangos, `using var`, etc.
   - Formatos de cultura (`:C2`, `:P0`) son modernos y válidos: se quedan y van por .NET.
3. Lo que se queda en .NET se deja tal cual: es el precio de enseñar sintaxis actual. Nunca reescribir al revés (código antiguo mostrado al alumno).
4. Revisar también el rendimiento del propio código: sin bucles innecesarios, `StringBuilder` si se concatena en bucle, `List<T>` frente a arrays redimensionados a mano, sin `while (true)`.
5. Subir a producción y pasar `diagnostico.html` con el servidor real para confirmar que Mono da la misma salida.
6. Subir versión en `sw.js` y empujar a GitHub.

**En cada commit:** repasar los ejercicios (paso 1) y recordar pasar `diagnostico.html`. La página lee `data/course.js`, así que los ejercicios nuevos entran solos en el informe.
