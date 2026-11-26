# Compilador propio (Judge0) para ejecutar más rápido

El botón **▶ Ejecutar** envía el código a un servidor Judge0. Por defecto usa el público y gratuito
(`https://extra-ce.judge0.com`), que es compartido: en una prueba real el servidor indicó ~1,4 s de ejecución del programa y el tiempo total hasta ver
la salida fue de ~5,5 s (el resto: cola, compilación y red). Un Judge0 **propio** evita la cola compartida con otros usuarios del servicio
público y te da control sobre la disponibilidad. Como cada alumno ejecuta desde su casa (IP distinta),
el límite de peticiones por IP del servicio público no suele ser un problema: la ventaja real es la
velocidad y la fiabilidad, no ese límite.

> Esta guía es orientativa: revisa siempre la documentación oficial de Judge0 (https://github.com/judge0/judge0)
> porque los detalles cambian entre versiones.

## Pasos resumidos
1. Un servidor Linux con Docker y Docker Compose (en el centro o un VPS pequeño cerca de los alumnos).
2. Descargar Judge0 (rama «extra-ce», que incluye C# con .NET) y seguir su `docker-compose.yml`:
   base de datos, Redis, servidor y *workers*. Cambiar las contraseñas de `judge0.conf`.
   - Judge0 usa *cgroups v1*: en distribuciones recientes hay que activarlos en el arranque del kernel
     (consulta el apartado de «Deployment» de su documentación).
3. **HTTPS obligatorio**: la web está en GitHub Pages (https) y el navegador bloquea llamadas a un
   servidor http. Pon delante un proxy con certificado (Caddy, Nginx + Let's Encrypt…).
4. Comprobar el identificador de C#: abrir `https://TU-SERVIDOR/languages` y buscar «C# (.NET …)».
5. Cambiar en `data/course.js`:

```js
compilador: {
  url: "https://judge0.tu-centro.cat",   // tu servidor
  languageId: 30,                         // el id que hayas encontrado en /languages
  headers: {},                            // OJO: cualquier cabecera/token puesta aquí es visible en la web
  timeoutMs: 30000,
},
```

## Pasar a .NET 10 LTS

El servidor público (`extra-ce.judge0.com`) lista C# hasta **.NET SDK 8.0.302** (id 30) y no tiene .NET 10.
.NET 8 y .NET 9 terminan su soporte el **10 de noviembre de 2026**; .NET 10 (C# 14) es la LTS vigente (hasta noviembre de 2028).
El código del curso funciona igual en las dos versiones. Para ejecutar con .NET 10 hace falta un Judge0 propio:
1. Añade un lenguaje nuevo en la configuración de Judge0 con una imagen que incluya el SDK 10 (`dotnet --version` → 10.x) y los comandos `dotnet build` / `dotnet run`.
2. Mira su id en `https://TU-SERVIDOR/languages`.
3. Cambia `url` y `languageId` en `data/course.js`. El resto de la web no cambia.
4. Pasa `diagnostico.html` para confirmar que todos los ejemplos siguen funcionando.

## Consejos
- Limita el uso (por IP o con un proxy) en lugar de poner un token secreto en el JS: se vería en el navegador.
- Más *workers* = más ejecuciones simultáneas (por ejemplo, la tarde antes de una entrega).
- La web ya abre la conexión por adelantado y recuerda resultados repetidos; no hace falta tocar nada más.

## Vía rápida: qué hace el envoltorio para Mono

Mono (`mcs`) solo entiende hasta ~C# 7. Para que el código «moderno» del curso siga igual en pantalla pero compile en Mono, el envoltorio:
- mete las sentencias de nivel superior dentro de `Main`;
- **saca a la clase las funciones/procedimientos declarados al nivel superior** (los convierte en métodos `static`; Mono no admite funciones locales);
- respeta `using` con comentario al final.
Informe real del servidor (27/11): 41/62 bloques idénticos; los fallos eran justo funciones locales y un `using` con comentario. Ya corregidos; si algún bloque no compila en Mono, se ejecuta en .NET sin que el alumno lo note.
