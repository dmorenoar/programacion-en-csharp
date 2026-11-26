# Compilador propio (Judge0) para ejecutar más rápido

El botón **▶ Ejecutar** envía el código a un servidor Judge0. Por defecto usa el público y gratuito
(`https://extra-ce.judge0.com`), que es compartido: en una prueba real tardó ~1,4 s en total, casi todo
compilando en el servidor. Un Judge0 **propio** evita la cola compartida y el límite de peticiones por IP
(importante si toda una clase ejecuta a la vez desde la misma red del centro).

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

## Consejos
- Limita el uso (por IP o con un proxy) en lugar de poner un token secreto en el JS: se vería en el navegador.
- Más *workers* = más ejecuciones simultáneas (un aula entera a la vez).
- La web ya abre la conexión por adelantado y recuerda resultados repetidos; no hace falta tocar nada más.
