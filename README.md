# Curso de Programación en C#

Web estática estilo "curso online" (barra lateral con módulos y lecciones, vídeo, teoría, actividades con solución desplegable y progreso guardado). No necesita servidor, ni instalar nada, ni compilar: es HTML + CSS + JavaScript puro, así que funciona tal cual en **GitHub Pages**.

```
curso-csharp/
├── index.html        ← esqueleto de la página (cabecera, menú, zona de contenido)
├── css/styles.css    ← estructura y componentes (colores como variables CSS, modo claro/oscuro)
├── css/theme.css     ← aspecto "Plataforma de cursos" (se carga después y sobrescribe a styles.css)
├── js/app.js         ← lógica: menú, rutas, pestañas, progreso, resaltado de C#, registro PWA
├── data/course.js    ← ⭐ TODO EL CONTENIDO (módulos, lecciones, vídeos, actividades)
├── manifest.webmanifest ← PWA: nombre, colores e iconos de la app instalable
├── sw.js             ← PWA: service worker (funcionamiento sin conexión)
├── icons/            ← iconos de la app (192, 512, maskable, iOS) y favicon
└── .nojekyll         ← le dice a GitHub Pages que no procese la carpeta con Jekyll
```

> **Regla de oro:** para añadir o cambiar contenido solo se edita `data/course.js`.

---

## 1. Probarlo en tu ordenador

**Opción A (la más rápida):** doble clic en `index.html`. Funciona porque los datos están en un `.js` y no en un `.json` (un `fetch()` de un `.json` no funciona con `file://`).

**Opción B (la más parecida a producción):** abre una terminal en la carpeta y ejecuta

```bash
python -m http.server 8000
# y visita http://localhost:8000
```

> Los vídeos de Drive **no se verán** con `file://` en algunos navegadores; con un servidor local o ya publicado en GitHub Pages sí.

---

## 2. Añadir tus vídeos de Drive

1. Sube el vídeo a Google Drive.
2. Botón derecho → **Compartir** → en "Acceso general" elige:
   - **Cualquier persona con el enlace** (la opción que menos problemas da), o
   - **Tu organización** (por ejemplo, el dominio del centro). Entonces solo lo verá el alumnado que haya iniciado sesión con su cuenta del centro.
3. Copia el enlace. Tiene esta forma:
   `https://drive.google.com/file/d/`**`1AbCdEfGhIjKlMnOpQrStUvWxYz`**`/view?usp=sharing`
   La parte en negrita es el **ID**.
4. Pégalo en la lección correspondiente de `data/course.js`:

```js
video: { provider: "drive", id: "1AbCdEfGhIjKlMnOpQrStUvWxYz" },
```

Si dejas `id: ""` se muestra un marcador "Vídeo disponible pronto".

**Alternativa con YouTube (no listado):** suele cargar más rápido y sin las limitaciones de cuota de Drive. Solo cambia el proveedor:

```js
video: { provider: "youtube", id: "dQw4w9WgXcQ" },   // el valor que aparece tras ?v=
```

---

## 3. Añadir una lección o una actividad

Dentro de un módulo, en `lecciones`, copia y rellena este molde:

```js
{
  id: "bucles-anidados",              // único, sin espacios ni tildes (se usa en la URL)
  titulo: "Bucles anidados",
  duracion: "10 min",
  video: { provider: "drive", id: "" },
  objetivos: ["Primer objetivo", "Segundo objetivo"],
  teoria: r`<p>Texto en <strong>HTML</strong>…</p>`,
  ejemplos: [
    { titulo: "Mi ejemplo", codigo: r`Console.WriteLine("Hola");`, explicacion: "Qué hace." },
  ],
  actividades: [
    {
      titulo: "Mi actividad",
      nivel: 1,                       // 1 básico · 2 intermedio · 3 reto
      enunciado: r`<p>Enunciado en HTML.</p>`,
      salida: "Ejemplo de salida esperada",   // opcional
      pista: "Una pista",                      // opcional
      soluciones: [                            // una o varias, de básica a profesional
        { titulo: "Versión básica", codigo: r`// C#`, nota: "Por qué así." },
        { titulo: "Versión profesional", codigo: r`// C#`, nota: "Qué mejora." },
      ],
    },
  ],
},
```

Para crear un módulo nuevo, añade un objeto `{ id, titulo, lecciones: [...] }` a `modulos`.

### Detalles que conviene saber

- **`r\`...\``** es `String.raw`: respeta las barras invertidas, así que puedes pegar C# con `\n` o `\"` sin escapar nada. Solo no puede contener tildes invertidas (`` ` ``) ni `${`.
- En `teoria` y `enunciado` se escribe **HTML**. Si necesitas mostrar `<` o `>` fuera de un bloque de código, escribe `&lt;` y `&gt;`.
- En `pista`, `nota`, `explicacion` y `salida` se escribe **texto plano** (la web lo escapa automáticamente).
- Los bloques de código se resaltan solos (palabras clave, cadenas, comentarios, números…) con un resaltador propio de unas 30 líneas, sin librerías.

---

## 4. Publicar en GitHub Pages

1. Crea un repositorio en GitHub (nombre sugerido: `programacion-en-csharp`; GitHub no admite acentos ni `#` en el nombre de la URL) y sube **el contenido de esta carpeta** (que `index.html` quede en la raíz del repositorio).
   ```bash
   git init
   git add .
   git commit -m "Primera versión del curso"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/programacion-en-csharp.git
   git push -u origin main
   ```
2. En GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"** → rama `main`, carpeta `/ (root)` → **Save**.
3. En uno o dos minutos la web estará en `https://TU_USUARIO.github.io/programacion-en-csharp/`.

Cada `git push` posterior actualiza la web automáticamente.

---

## 5. PWA: instalar la web como app

La web es una **PWA** (Progressive Web App): se puede instalar en el móvil, tableta u ordenador y abrir sin conexión.

- **Android / Chrome / Edge (PC):** aparece el botón **«⬇ Instalar app»** en la cabecera (o la opción *Instalar* del menú del navegador).
- **iPhone / iPad (Safari):** Compartir → **Añadir a pantalla de inicio**.
- **Sin conexión** se ven la teoría y las actividades de lo ya visitado. Los **vídeos no** (Drive/YouTube necesitan internet).
- **Requisitos:** HTTPS (GitHub Pages ya lo da) y los archivos `manifest.webmanifest` y `sw.js`, que deben estar en la raíz.

**Actualizaciones:** `sw.js` usa la estrategia *red primero*: con conexión siempre se descarga la última versión, así que cuando añadas temas nuevos el alumnado los verá al abrir la web. Solo tendrías que subir `VERSION` en `sw.js` si **añades archivos nuevos** a la lista `CORE`.

**Para depurar:** en Chrome, F12 → pestaña *Application* → *Manifest* y *Service Workers*; o Lighthouse → categoría PWA.

---

## 6. Añadir nuevos temas con el tiempo

Todo el curso está en `data/course.js`, así que añadir un tema es **editar un solo archivo**:

1. Añade la lección (molde del apartado 3) en el módulo que corresponda, o crea un módulo nuevo.
2. `git add . && git commit -m "Nuevo tema: ..." && git push`.
3. En ~1 minuto GitHub Pages lo publica y la PWA lo recoge sola.

El `id` de cada lección debe ser único y estable: es el que enlaza la URL y el progreso del alumnado. **No lo cambies una vez publicada** o se perderá el tick de completada de esa lección.

---

## 7. Cómo funciona (para explicarlo en clase)

| Concepto | Dónde verlo |
|---|---|
| Separar **datos** y **presentación** | `data/course.js` frente a `js/app.js` |
| Generar HTML desde datos con *template strings* | funciones `activityHTML`, `theoryHTML`… |
| Seguridad: escapar texto antes de `innerHTML` | función `esc()` |
| Rutas sin servidor con el *hash* de la URL | `route()` y el evento `hashchange` |
| Delegación de eventos | un único `click` en `document` |
| Persistencia con `localStorage` (con `try/catch`) | objeto `store` |
| Expresiones regulares para analizar código | `TOKEN_RE` y `highlight()` |
| Tema claro/oscuro con variables CSS | `:root` y `[data-theme="dark"]` en `styles.css` |
| PWA: manifiesto y service worker (red primero + caché) | `manifest.webmanifest`, `sw.js` |
| Accesibilidad básica | `role="tab"`, `aria-selected`, `aria-current`, foco visible |

---

## 8. Limitaciones y siguientes pasos

- **El progreso se guarda en el navegador de cada alumno** (`localStorage`): no se sincroniza entre dispositivos y tú no lo ves. Para eso haría falta un backend (Firebase, Supabase…) o un formulario de Google que reciba los resultados.
- Los **vídeos de Drive** tienen cuotas de visualización y el alumnado debe tener acceso al archivo. Si un vídeo se "satura", YouTube no listado es la alternativa.
- Ideas para ampliar: buscador de lecciones, marcar actividades como hechas, botón "Probar en línea" (por ejemplo, enlazando a [dotnetfiddle.net](https://dotnetfiddle.net)), cuestionarios con Google Forms, descarga de los `.cs` de las soluciones, o migrar a un generador estático (Astro, Eleventy) si el curso crece mucho.

## Página de inicio del curso

Al abrir la web se muestra una ficha de curso (estilo Udemy) con el resumen, el temario y el botón «Empezar / Continuar».
Sus textos se editan en `data/course.js`: `aprenderas`, `requisitos`, `descripcion`, `profesor`, `actualizado`, `idioma` y `nivel`.
Los totales (lecciones, actividades y duración) se calculan solos a partir de los módulos. Los estilos están en `css/home.css`.

## Editor de C#: Codificar, Entrenamiento y Probar

Un navegador no puede compilar C#, así que el código se envía a **Judge0** (el curso está escrito para **.NET 10 LTS / C# 14**; el servidor público ofrece hasta .NET 8, y todo el código es compatible con ambos). Configuración en `data/course.js` → `compilador` (`url`, `languageId`, `headers`). Si el servicio público se satura en clase, puedes alojar tu propio Judge0 y cambiar solo `url`. Para ejecutar hace falta Internet; el resto del curso funciona sin conexión.

- **Editor integrado en la lección** (también `#codificar-<lección>`): la lección (índice, vídeo y teoría) con un **entorno tipo .NET Fiddle** al lado: editor con números de línea, ▶ Ejecutar, entrada/salida, ejemplos y plantillas, guardar/abrir `.cs`, tamaño de letra y ancho ajustable. Cada lección tiene su cuaderno (se guarda en el navegador). El botón ⇄ cambia el editor de lado (izquierda/derecha). Los menús son propios (sin `<select>` ni `confirm`) y al cargar un ejemplo se puede «Deshacer».
- **`🎯 Entrenamiento`** (`#entrenamiento` o `#entrenamiento-<lección>.<n>`): desplegable con todas las actividades del curso. Muestra el enunciado, el ejemplo de salida, la pista y la solución (plegadas) y un editor para resolverla. Cada actividad guarda su código y se puede marcar como resuelta (✓).
- **`▶ Probar`** (en cada bloque de código de la teoría): panel lateral derecho para ejecutar un ejemplo mientras lees. Su botón **↗ Codificar** lo lleva al cuaderno de la lección actual.
- **Atajos del editor:** Ctrl+Intro ejecuta · Tab / Shift+Tab sangra · Ctrl+/ comenta · Ctrl+S descarga `Program.cs` · cierre automático de `()`, `{}`, `[]` y comillas. Los errores de compilación marcan en rojo la línea.
- La entrada no es interactiva: lo que se escribe en «Entrada del programa» se entrega a `Console.ReadLine()` línea a línea.
- **Código:** `js/editor-kit.js` (atajos y envío al compilador), `js/editor-pane.js` (editor + salida reutilizable), `js/training.js` (Entrenamiento), `js/playground.js` (panel Codificar) y `css/editor.css`, `css/training.css`.

## Perfil «arcade» del profesor

Al pulsar el nombre o el avatar del profesor en la portada se abre una ventana de perfil con Mario (salta al pulsarlo), sonido de moneda (`audio/coin.mp3`, con interruptor que se recuerda) y barras de estadísticas que se llenan a bloques. Los textos y porcentajes se editan en `data/course.js` → `profesor` (`insignia`, `estadisticas`, `habilidades`, `lema`…). Con «reducir movimiento» activado en el sistema no hay animaciones. Código: `js/profile.js` y `css/profile.css`.

### Velocidad al ejecutar
El tiempo casi siempre es **compilar en el servidor** (Judge0 público, compartido). El curso ya abre la conexión por adelantado (`preconnect`), guarda el resultado de cada ejecución (repetir el mismo código es instantáneo) muestra un cronómetro, envía el código como formulario (el navegador se ahorra la consulta previa «preflight»; si el servidor no lo admite, vuelve solo a JSON) y mantiene «caliente» la conexión mientras escribes. Para ir realmente más rápido: montar un Judge0 propio (cerca de los alumnos y sin cola compartida) y cambiar `COURSE.compilador.url` en `data/course.js`.

### ⚡ Vía rápida (experimental, Mono)
Los programas **sencillos** (sin clases propias ni sintaxis moderna; los decimales solo valen si nunca se muestran como texto, porque Mono los formatea distinto) se compilan primero con Mono, que es más rápido que .NET en el servidor. Solo se da por buena si termina bien; si hay cualquier error se repite con .NET (la referencia). Se activa/desactiva con el botón **⚡ Rápido** del editor. El id de Mono se busca solo en `GET /languages` del servidor; también puede fijarse en `COURSE.compilador.rapido = { languageId: 51, activo: true }`. La salida indica «⚡ vía rápida (Mono)» cuando se ha usado.

**Diagnóstico:** abre `diagnostico.html` (junto a la web) para ejecutar todos los ejemplos y soluciones en Mono y en .NET, comparar las salidas y ver qué bloques salen igual. Sirve para ajustar el filtro de la vía rápida con datos reales.

**Nuevos módulos:** sigue `docs/checklist-nuevos-modulos.md` y ejecuta `node tools/auditar-ejemplos.js` para que los ejemplos vayan por la vía rápida siempre que sea posible.
