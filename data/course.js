/* =====================================================================
   data/course.js  ·  TODO EL CONTENIDO DEL CURSO VIVE AQUÍ
   ---------------------------------------------------------------------
   Para añadir una lección, copia un bloque { id: "...", ... } dentro de
   "lecciones" y rellénalo. No hace falta tocar nada más (ni HTML ni JS).

   ¿Por qué un archivo .js y no un .json?
   - Un .json necesita fetch(), y fetch() NO funciona si abres index.html
     con doble clic (file://). Con un .js simplemente se carga con <script>.
   - Alternativa más "profesional": usar course.json + fetch() y probar con
     un servidor local (python -m http.server). Lo explico en el README.

   ¿Por qué usamos String.raw (la función r`...`)?
   - En una plantilla normal, "\n" se convierte en un salto de línea real.
     En C# queremos que "\n" se quede tal cual, escrito en el código.
     String.raw respeta las barras invertidas. Así podemos pegar C# sin
     escapar nada. Limitación: no puede contener ` (tilde invertida) ni ${.
   ===================================================================== */

const r = String.raw;

const COURSE = {
  titulo: "Programación en C#",
  subtitulo: "Aprende los conceptos fundamentales paso a paso: mira el vídeo, repasa la teoría y practica con las actividades.",
  autor: "Daniel Moreno",

  // ---- Compilador del panel "Practicar" (ver js/playground.js) ----
  // Usa la API pública de Judge0 (extra-ce). El curso está escrito para .NET 10 LTS (C# 14),
  // pero el servidor público solo ofrece hasta .NET SDK 8.0 (language_id 30): todo el código del
  // curso es compatible con C# 12, así que se ejecuta igual. Cuando exista .NET 10 en tu Judge0
  // (ver docs/judge0-propio.md), cambia solo "url" y "languageId".
  compilador: {
    url: "https://extra-ce.judge0.com",
    languageId: 30,                 // C# (.NET SDK 8.0 en el público; pon el id de .NET 10 en tu servidor)
    headers: {},                    // p. ej. { "X-Auth-Token": "..." } si tu servidor lo exige
    timeoutMs: 30000,
  },

  // ---- Datos de la PÁGINA DE INICIO del curso (editables) ----
  actualizado: "Noviembre 2026",
  idioma: "Español",
  nivel: "Principiante",
  aprenderas: [
    "Declarar y usar variables, constantes y los tipos de datos básicos",
    "Leer y escribir información por consola con formato",
    "Convertir tipos con seguridad usando Parse y TryParse",
    "Tomar decisiones con if, switch y operadores lógicos",
    "Repetir tareas con while, do-while y for",
    "Trabajar con arrays, matrices y jagged arrays",
    "Crear funciones y procedimientos reutilizables",
    "Practicar con actividades resueltas de varias formas, de la más básica a la más profesional",
  ],
  requisitos: [
    "Un ordenador con Visual Studio, VS Code o Rider (o un compilador de C# en línea)",
    "No hacen falta conocimientos previos de programación",
    "Ganas de practicar: cada lección incluye actividades para hacer tú mismo",
  ],
  descripcion: r`<p>Un curso paso a paso para aprender los <strong>fundamentos de la programación con C#</strong>. Cada lección combina un vídeo explicativo, la teoría por escrito con ejemplos comentados y actividades con solución desplegable.</p>
<p>Empezamos por las variables y la lectura de datos, avanzamos por las estructuras de control y repetición, trabajamos con colecciones (arrays, matrices y jagged arrays) y terminamos organizando el código en funciones y procedimientos.</p>
<p>Las soluciones se muestran en varios enfoques, de la más sencilla a la más profesional, para que entiendas <em>por qué</em> se hace cada cosa y no solo cómo.</p>
<p>El curso irá creciendo con nuevos temas.</p>`,
  profesor: {
    nombre: "Daniel Moreno",
    rol: "Profesor de Desarrollo de Aplicaciones Multiplataforma · Institut Tecnològic de Barcelona",
    bio: "Docente de programación en ciclos formativos de grado superior, con orientación a videojuegos y ocio digital.",

    // ---- Ventana de perfil «arcade» (js/profile.js). Todo editable ----
    insignia: "Super Creator",
    version: "v2.3",
    presentacion: "Apasionado de los 8 bits y profesor de ciclos formativos.",
    estadisticas: [
      { nombre: "Mana",    desc: "Nivel de cafeína en sangre",                  valor: 95, color: "#00b7e6" },
      { nombre: "Suerte",  desc: "Probabilidad de que el código compile a la primera", valor: 73, color: "#d946ef" },
      { nombre: "Aguante", desc: "Paciencia ante un problema",                  valor: 98, color: "#22c55e" },
    ],
    habilidades: [
      { nombre: "Telepatía de depuración", desc: "Detectar el error en el código del alumno sin mirarlo", valor: 82, color: "#eab308" },
      { nombre: "Transferencia de conocimiento", desc: "Ritual de canalización de datos de mi cerebro al de los alumnos", valor: 67, color: "#f97316" },
    ],
    lema: "It's-a me, the Teacher!",
  },

  modulos: [
    /* ================================================================
       MÓDULO 1 · FUNDAMENTOS
       ================================================================ */
    {
      id: "m1",
      titulo: "Fundamentos",
      lecciones: [
        {
          id: "lenguajes-y-net",
          titulo: "Lenguajes de programación y la plataforma .NET",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender qué es un programa y qué es un lenguaje de programación", "Conocer cómo se compila y ejecuta un programa C# (CIL, JIT, runtime)", "Diferenciar SDK y runtime de .NET"],
          teoria: r`<p>Vivimos rodeados de programas: el teléfono, el coche, el reloj o la
lavadora están programados para actuar de forma autónoma o según
nuestras órdenes. La programación es hoy tan inherente a nuestro entorno
como la escritura o las matemáticas, y para sacarle provecho conviene
conocer sus nociones básicas.</p>
<p>En este tema intentaremos entender el funcionamiento lógico de un
ordenador para poder programarlo.</p>
<h4 id="111-programación-de-computadoras">1.1.1 Programación de
computadoras</h4>
<p>Un ordenador se basa en una <strong>unidad central de procesamiento
(CPU)</strong> encargada de sumar, restar y mover en memoria valores
formados por ceros y unos. Cuando queremos que haga algo con esos
valores (sumarlos, restarlos, multiplicarlos…), le damos el listado de
acciones que debe realizar y la CPU las <strong>ejecuta</strong>.</p>
<p>Ese listado de acciones es nuestro <strong>programa</strong>. Al
ejecutarlo, el ordenador va realizando una acción tras otra.</p>
<p>Pero ¿qué instrucciones y en qué lenguaje hay que escribirlas?</p>
<h4 id="112-código-máquina-y-lenguajes-de-programación">1.1.2 Código
máquina y lenguajes de programación</h4>
<p>La CPU es tan simple que las instrucciones que entiende directamente
son muy básicas y se escriben en <strong>código máquina</strong>: un
lenguaje que varía según el modelo de procesador y que es muy poco
amigable para las personas.</p>
<p>Por suerte existen programas capaces de interpretar instrucciones más
complejas y transformarlas a código máquina. Esa transformación se llama
<strong>compilar</strong>. Cada uno de esos programas, con sus propias
estrategias y su conjunto de instrucciones, define un <strong>lenguaje
de programación de alto nivel</strong>.</p>
<h5 id="lenguajes-compilados">Lenguajes compilados</h5>
<p>Los primeros lenguajes de alto nivel permitían escribir de forma más
cómoda (ese texto fácil de leer es el <strong>código fuente</strong>) y
después <em>compilarlo</em> para obtener un programa en código máquina
listo para la CPU.</p>
<pre><code>Código fuente  ──►  Compilador  ──►  Código máquina  ──►  CPU
(lo escribimos)                      (0011001010010…)</code></pre>
<p>Pero hay un problema: cada familia de procesadores tiene su propio
código máquina, así que un programa compilado para una máquina puede no
funcionar en otra. Habría que compilar una versión para cada CPU.</p>
<h5 id="lenguajes-precompilados-e-interpretados">Lenguajes precompilados
e interpretados</h5>
<p>Para resolver ese problema aparecieron los lenguajes
<strong>precompilados</strong> (como <strong>C#</strong>) y los
<strong>interpretados</strong>:</p>
<ul>
<li>En C#, el compilador no genera código máquina directamente, sino un
<strong>código intermedio</strong> llamado <strong>CIL</strong>
(<em>Common Intermediate Language</em>), que se guarda en un archivo
<code>.dll</code> o <code>.exe</code>.</li>
<li>Ese código intermedio es el mismo para todos los sistemas. Al
ejecutarlo, el <strong>runtime de .NET</strong> (el CLR, <em>Common
Language Runtime</em>) lo traduce a código máquina de la CPU concreta
mediante un compilador <strong>JIT</strong> (<em>Just-In-Time</em>,
«justo a tiempo»).</li>
<li>Por eso, un mismo programa C# puede ejecutarse en Windows, Linux o
macOS siempre que la máquina tenga instalado el runtime de .NET.</li>
</ul>
<pre><code>Código fuente C#  ──►  Compilador (Roslyn)  ──►  CIL (.dll/.exe)  ──►  Runtime .NET (JIT)  ──►  CPU</code></pre>
<p>También existen lenguajes (como JavaScript o Python) que se ejecutan
directamente a partir del código fuente mediante un
<strong>intérprete</strong>, sin generar antes un archivo compilado. En
general, los lenguajes interpretados suelen ser más lentos que los
precompilados, y estos algo más lentos que los compilados a código
máquina, aunque las técnicas modernas (como el JIT) acortan mucho esas
diferencias.</p>
<h3 id="12-introducción-a-la-programación">1.2 Introducción a la
programación</h3>
<p>Programar consiste en indicar el conjunto de acciones que hay que
llevar a cabo para conseguir un objetivo a partir de unos valores
iniciales.</p>
<p>Para programar bien seguiremos estos pasos:</p>
<ol type="1">
<li><strong>Dividir</strong> el objetivo en objetivos más simples y
ordenados.</li>
<li>Usar las <strong>acciones básicas</strong> de la programación para
conseguir cada uno de ellos.</li>
<li>A medida que escribimos, <strong>comprobar</strong> que la
computadora interpreta el programa como pensamos.</li>
<li>Si actúa de forma imprevista, <strong>reflexionar y seguir punto por
punto</strong> la ejecución hasta encontrar la diferencia entre lo que
queremos y lo que hace.</li>
<li>Una vez corregidos los errores, <strong>validar</strong> que el
código funciona con todos los supuestos que se nos ocurran.</li>
</ol>
<h4 id="121-acciones-básicas-en-la-programación">1.2.1 Acciones básicas
en la programación</h4>
<ul>
<li><strong>Definir un espacio de memoria</strong> donde almacenar
información (las <em>variables</em>).</li>
<li><strong>Guardar en una variable</strong> un valor fijo o un valor
obtenido o calculado.</li>
<li><strong>Utilizar operadores matemáticos</strong> para sumar, restar,
multiplicar y dividir los valores guardados.</li>
<li><strong>Obtener un valor</strong> de un periférico de entrada (por
ejemplo, el teclado) y guardarlo en una variable.</li>
<li><strong>Mostrar un valor</strong> con un periférico de salida (por
ejemplo, la pantalla).</li>
<li><strong>Comparar dos valores</strong> y saber si son iguales o cuál
es mayor.</li>
</ul>
<p><strong>Ejemplo.</strong> Queremos que el ordenador sume 10 a un
número indicado por el usuario y muestre si el resultado es mayor, menor
o igual que 15. Lo dividimos en pasos:</p>
<ol type="1">
<li>Definir una variable.</li>
<li>Obtener el valor escrito por el usuario y guardarlo en la
variable.</li>
<li>Sumar 10 a la variable y guardar el resultado en otra variable.</li>
<li>Comparar el resultado con 15.</li>
<li>Según el resultado:
<ul>
<li>si es mayor que 15, mostrar un mensaje;</li>
<li>si es menor que 15, mostrar otro mensaje;</li>
<li>si es igual a 15, mostrar un tercer mensaje.</li>
</ul></li>
</ol>
<p>Todavía no es un programa que un ordenador pueda leer, pero hemos
hecho lo más importante: <strong>pensar el problema y dividirlo en pasos
pequeños</strong> que se resuelven con las acciones básicas. Más
adelante lo traduciremos a C#.</p>
<h3 id="13-el-lenguaje-c-y-la-plataforma-net">1.3 El lenguaje C# y la
plataforma .NET</h3>
<p><strong>C#</strong> es un lenguaje de programación
<strong>precompilado</strong>, <strong>orientado a objetos</strong> y de
<strong>tipado estático</strong> (el tipo de cada variable se conoce al
compilar). Es versátil y fiable, y permite programar para ordenadores,
servidores, móviles, la nube y videojuegos.</p>
<p>C# funciona sobre la plataforma <strong>.NET</strong>, formada
por:</p>
<ul>
<li>El <strong>runtime</strong> (CLR), que ejecuta el código
intermedio.</li>
<li>La <strong>biblioteca de clases base</strong> (<em>BCL</em>), un
enorme conjunto de herramientas ya hechas (consola, ficheros, fechas,
colecciones, red…).</li>
<li>El <strong>SDK</strong> (<em>Software Development Kit</em>), con el
compilador y la herramienta de línea de comandos
<code>dotnet</code>.</li>
</ul>
<p>Para instalar .NET hay dos opciones:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Paquete</th>
<th>Para quién</th>
<th>Qué incluye</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Runtime</strong></td>
<td>Usuario final</td>
<td>Lo necesario para <strong>ejecutar</strong> programas .NET</td>
</tr>
<tr class="even">
<td><strong>SDK</strong></td>
<td>Programador</td>
<td>Compilador, herramientas y runtime para
<strong>desarrollar</strong></td>
</tr>
</tbody>
</table></div>
<p>Si solo queremos ejecutar programas nos basta el runtime, pero como
programadores instalaremos el <strong>SDK</strong>. Se descarga gratis
en <a
href="https://dotnet.microsoft.com/download">https://dotnet.microsoft.com/download</a>.</p>
<div class="callout">
<p><strong>Versiones.</strong> .NET publica una versión nueva cada
noviembre. Las versiones <strong>pares</strong> (.NET 8, .NET 10…) son
de <strong>soporte a largo plazo (LTS)</strong> y las
<strong>impares</strong> (.NET 9…) son de soporte estándar (STS).
<strong>.NET 10 es la versión LTS actual</strong> (soporte hasta noviembre de
2028); .NET 8 y .NET 9 terminan su soporte el 10 de noviembre de 2026. Cada versión viene con una versión de C#: .NET 8 → C# 12; .NET 10
→ C# 14. Instala <strong>.NET 10</strong>. En estos apuntes usamos características que funcionan desde
<strong>C# 12</strong>, así que también se ejecutan en el editor de la web (.NET 8).</p>
</div>`,
          ejemplos: [
          ],
          actividades: [
          ],
        },
        {
          id: "primer-programa",
          titulo: "Tu primer programa y el entorno de desarrollo",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Crear y ejecutar un proyecto de consola con la CLI de .NET", "Conocer la estructura de un programa C# (top-level statements y clase Main)", "Elegir un entorno de desarrollo (IDE)"],
          teoria: r`<p>Los programas se escriben en <strong>texto sin formato</strong> (no
en un procesador de textos como Word). Podríamos usar el bloc de notas y
la consola, pero empezaremos con la herramienta <code>dotnet</code>.</p>
<p>Nuestro primer programa será el clásico «Hola mundo», que simplemente
muestra un mensaje.</p>
<p><strong>Paso 1.</strong> Comprobar la instalación. Abre un terminal y
escribe:</p>
<pre><code>dotnet --version</code></pre>
<p>Debe mostrar el número de versión del SDK instalado.</p>
<p><strong>Paso 2.</strong> Crear un proyecto de consola:</p>
<pre><code>dotnet new console -n HolaMundo
cd HolaMundo</code></pre>
<p>Se crea una carpeta <code>HolaMundo</code> con dos archivos
importantes:</p>
<ul>
<li><code>HolaMundo.csproj</code>: el archivo de
<strong>proyecto</strong> (nombre, versión de .NET, opciones).</li>
<li><code>Program.cs</code>: nuestro <strong>código
fuente</strong>.</li>
</ul>
<p><strong>Paso 3.</strong> Abre <code>Program.cs</code> y deja este
contenido:</p>
<!--ex:0-->
<p><strong>Paso 4.</strong> Compilar y ejecutar:</p>
<pre><code>dotnet run</code></pre>
<p><code>dotnet run</code> compila el proyecto y lo ejecuta. Debe
aparecer en el terminal: <code>Hola mundo</code>.</p>
<p>Si solo quieres compilar sin ejecutar, usa <code>dotnet build</code>.
El resultado (el código intermedio) queda en la carpeta
<code>bin</code>.</p>
<div class="callout">
<p><strong>Novedad de .NET 10.</strong> Con el SDK de .NET 10 también se
puede ejecutar un único archivo <code>.cs</code> sin crear proyecto:
<code>dotnet run HolaMundo.cs</code>.</p>
</div>
<h3 id="15-estructura-básica-de-un-programa-c">1.5 Estructura básica de
un programa C#</h3>
<p>Un programa C# se organiza en <strong>bloques de código</strong>
delimitados por llaves <code>{ }</code> con un texto delante que los
define.</p>
<p>Desde .NET 6, las plantillas de consola usan <strong>sentencias de
nivel superior</strong> (<em>top-level statements</em>): escribimos
directamente las instrucciones, y el compilador se encarga del resto. Es
lo que hemos hecho en <code>Program.cs</code>.</p>
<p>Detrás de esa sencillez, el programa «Hola mundo» equivale a esta
forma <strong>clásica</strong>, que verás en muchos libros y en
proyectos existentes:</p>
<!--ex:1-->
<p>Los dos bloques principales son:</p>
<ul>
<li><code>class Program { … }</code>: engloba el conjunto del programa.
<code>class</code> indica que es una clase y <code>Program</code> es su
nombre (en C# <strong>no tiene que coincidir con el nombre del
archivo</strong>).</li>
<li><code>static void Main(string[] args) { … }</code>: el
<strong>método principal</strong>. Lo que escribamos dentro de sus
llaves es lo que se ejecuta al lanzar el programa.</li>
</ul>
<p>Por ahora podemos entender las palabras así (las veremos con detalle
más adelante):</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Palabra</th>
<th>Significado</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>using</code></td>
<td>Importa un espacio de nombres para poder usar sus clases sin
escribir el nombre completo</td>
</tr>
<tr class="even">
<td><code>namespace</code></td>
<td>Agrupa clases bajo un nombre para evitar conflictos</td>
</tr>
<tr class="odd">
<td><code>class</code></td>
<td>Define una clase, la unidad básica de código en C#</td>
</tr>
<tr class="even">
<td><code>static</code></td>
<td>El método pertenece a la clase y se puede llamar sin crear ningún
objeto</td>
</tr>
<tr class="odd">
<td><code>void</code></td>
<td>El método no devuelve ningún valor</td>
</tr>
<tr class="even">
<td><code>Main</code></td>
<td>Nombre del método donde empieza la ejecución</td>
</tr>
<tr class="odd">
<td><code>string[] args</code></td>
<td>Argumentos con los que se ha lanzado el programa</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>Sentencias de nivel superior.</strong> Con esta forma moderna
el compilador genera por nosotros la clase y el método
<code>Main</code>. Además, las plantillas actuales activan los
<strong><code>using</code> implícitos</strong>, por eso podemos usar
<code>Console</code> sin escribir <code>using System;</code>. Dentro de
un proyecto solo un archivo puede tener sentencias de nivel superior, y
la variable <code>args</code> está disponible sin declararla.</p>
</div>
<p>Aunque podemos programar con un simple editor de texto, cuando los
programas ganan complejidad resulta imprescindible usar herramientas
específicas: los <strong>IDE</strong> (<em>Integrated Development
Environment</em>, Entornos Integrados de Desarrollo).</p>
<p>Un IDE nos ofrece:</p>
<ul>
<li>Resaltado de colores y <strong>autocompletado</strong> del
código.</li>
<li>Aviso inmediato de <strong>errores sintácticos</strong> (subrayados
en rojo).</li>
<li>Herramientas para <strong>depurar</strong> (ver cómo se ejecuta el
programa paso a paso).</li>
<li>Gestión de proyectos, pruebas y documentación.</li>
</ul>
<p>Opciones habituales para C#:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>IDE</th>
<th>Comentario</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Visual Studio</strong> (Community)</td>
<td>El IDE más completo para .NET en Windows. Gratuito para estudiantes
y uso educativo</td>
</tr>
<tr class="even">
<td><strong>Visual Studio Code</strong> + extensión <strong>C# Dev
Kit</strong></td>
<td>Ligero, multiplataforma y gratuito</td>
</tr>
<tr class="odd">
<td><strong>JetBrains Rider</strong></td>
<td>IDE multiplataforma de JetBrains (con licencias educativas)</td>
</tr>
</tbody>
</table></div>
<p>Todos usan el mismo SDK de .NET, así que el código es idéntico en
cualquiera de ellos.</p>`,
          ejemplos: [
            { titulo: "Paso 3. Abre Program.cs y deja este contenido", codigo: r`Console.WriteLine("Hola mundo");
` },
            { titulo: "Ejemplo 2", codigo: r`using System;                       // trae el espacio de nombres donde está la clase Console

namespace HolaMundo;                // agrupa el código bajo un nombre

class Program                       // el programa vive dentro de una clase
{
    static void Main(string[] args) // punto de entrada: aquí empieza la ejecución
    {
        Console.WriteLine("Hola mundo");
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Tarjeta de presentación",
              nivel: 1,
              enunciado: r`<p>Escribe un programa que muestre por consola una <strong>tarjeta de
presentación</strong> con tu nombre, tu ciclo formativo y tu lenguaje
favorito, cada dato en una línea distinta. Después, pregunta el nombre
de un compañero y salúdalo.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Usa <code>Console.WriteLine</code> para mostrar y
<code>Console.ReadLine</code> para leer.</li>
<li>El texto debe quedar así (con tus datos): <code>Nombre: Ana</code>,
<code>Ciclo: DAMv</code>, <code>Lenguaje: C#</code>.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>Console.Write</code> no añade salto de
línea, así que es ideal para las preguntas.</p>`,
              soluciones: [
                { titulo: "Versión básica: concatenación", nota: "Se une el texto con +. Funciona, pero con muchas variables se vuelve difícil de leer.", codigo: r`Console.WriteLine("Nombre: Ana");
Console.WriteLine("Ciclo: DAMv");
Console.WriteLine("Lenguaje: C#");

Console.Write("¿Cómo se llama tu compañero? ");
string companero = Console.ReadLine() ?? "";      // ?? "" evita null si no se escribe nada
Console.WriteLine("¡Hola, " + companero + "!");
` },
                { titulo: "Versión recomendada: interpolación", nota: "Guardar los datos en variables permite cambiarlos en un único sitio.", codigo: r`string nombre = "Ana";
string ciclo = "DAMv";
string lenguaje = "C#";

Console.WriteLine($"Nombre: {nombre}");       // $"..." permite meter variables entre llaves
Console.WriteLine($"Ciclo: {ciclo}");
Console.WriteLine($"Lenguaje: {lenguaje}");

Console.Write("¿Cómo se llama tu compañero? ");
string companero = Console.ReadLine() ?? "";
Console.WriteLine($"¡Hola, {companero}!");
` },
              ],
            },
          ],
        },
        /* ---------------------------- VARIABLES ---------------------------- */
        {
          id: "variables",
          titulo: "Variables y tipos de datos",
          duracion: "12 min",
          // provider: "drive" | "youtube"  ·  id: el identificador del vídeo (vacío = marcador)
          video: { provider: "drive", id: "" },
          objetivos: [
            "Entender qué es una variable y para qué sirve",
            "Conocer los tipos básicos: int, double, decimal, bool, char y string",
            "Declarar, inicializar y modificar variables y constantes",
          ],
          teoria: r`
<p>Una <strong>variable</strong> es un espacio de memoria con nombre donde guardamos un dato que puede cambiar mientras el programa se ejecuta. En C# toda variable tiene un <strong>tipo</strong>, que decide qué valores admite y cuánta memoria ocupa.</p>
<div class="table-wrap"><table>
<thead><tr><th>Tipo</th><th>Qué guarda</th><th>Ejemplo</th></tr></thead>
<tbody>
<tr><td><code>int</code></td><td>Números enteros</td><td><code>int vidas = 3;</code></td></tr>
<tr><td><code>double</code></td><td>Decimales (doble precisión)</td><td><code>double altura = 1.75;</code></td></tr>
<tr><td><code>decimal</code></td><td>Decimales exactos (dinero)</td><td><code>decimal precio = 9.99m;</code></td></tr>
<tr><td><code>bool</code></td><td>Verdadero o falso</td><td><code>bool activo = true;</code></td></tr>
<tr><td><code>char</code></td><td>Un único carácter</td><td><code>char letra = 'A';</code></td></tr>
<tr><td><code>string</code></td><td>Texto</td><td><code>string nombre = "Ana";</code></td></tr>
</tbody></table></div>
<h4>Buenas prácticas</h4>
<ul>
<li>Usa nombres descriptivos en <em>camelCase</em>: <code>puntosJugador</code> mejor que <code>pj</code>.</li>
<li>Declara e inicializa en la misma línea siempre que puedas.</li>
<li>Usa <code>const</code> para valores que nunca cambian (por ejemplo, el IVA).</li>
<li><code>var</code> deja que el compilador deduzca el tipo, pero el tipo sigue siendo fijo: C# es un lenguaje de <em>tipado estático</em>.</li>
</ul>
<div class="callout"><strong>Nota sobre el código del curso:</strong> usamos <em>instrucciones de nivel superior</em> (top-level statements), la forma por defecto de los proyectos de consola desde .NET 6. No necesitas escribir <code>class Program</code> ni <code>Main</code>; las veremos explícitamente más adelante.</div>`,
          ejemplos: [
            {
              titulo: "Declarar, asignar y modificar",
              codigo: r`int edad = 17;                 // entero
double altura = 1.75;          // decimal (con punto, no coma)
bool esMayorDeEdad = false;    // verdadero / falso
char inicial = 'D';            // un carácter va entre comillas simples
string nombre = "Dani";        // un texto va entre comillas dobles
const double IVA = 0.21;       // constante: no se puede cambiar después

edad = edad + 1;               // las variables SÍ pueden cambiar de valor
Console.WriteLine(nombre + " tiene " + edad + " años");`,
              explicacion: "Fíjate en la diferencia entre comillas simples (char) y dobles (string). Una constante se escribe en MAYÚSCULAS por convención.",
            },
            {
              titulo: "var, errores de tipo y límites",
              codigo: r`var puntos = 100;                 // el compilador deduce que es int
// puntos = "cien";               // ERROR: no se puede guardar un string en un int
Console.WriteLine(int.MaxValue);  // 2147483647: el valor máximo que cabe en un int`,
              explicacion: "Descomenta la línea del error en tu editor y mira qué mensaje te da el compilador: es la mejor forma de aprender a leerlos.",
            },
          ],
          actividades: [
            {
              titulo: "Ficha de personaje",
              nivel: 1,
              enunciado: r`<p>Crea un programa que guarde en variables los datos de un personaje de videojuego y los muestre por pantalla:</p>
<ul><li><code>nombre</code> (texto)</li><li><code>nivel</code> (entero)</li><li><code>vida</code> (decimal)</li><li><code>esJefe</code> (verdadero/falso)</li></ul>`,
              salida: "Personaje: Zelda\nNivel: 12\nVida: 85,5\n¿Es jefe? False",
              pista: "Primero declara las cuatro variables con un valor inicial. Después usa Console.WriteLine y concatena con +.",
              soluciones: [
                {
                  titulo: "Solución",
                  codigo: r`string nombre = "Zelda";
int nivel = 12;
double vida = 85.5;
bool esJefe = false;

Console.WriteLine("Personaje: " + nombre);
Console.WriteLine("Nivel: " + nivel);
Console.WriteLine("Vida: " + vida);
Console.WriteLine("¿Es jefe? " + esJefe);`,
                  nota: "Al concatenar con + C# convierte automáticamente números y bool a texto. La coma decimal en la salida depende de la configuración regional del sistema.",
                },
              ],
            },
            {
              titulo: "Intercambia dos variables",
              nivel: 2,
              enunciado: r`<p>Tienes <code>a = 5</code> y <code>b = 9</code>. Intercambia sus valores <strong>sin escribir los números otra vez</strong> y muestra el resultado.</p>
<p>Pregunta para pensar: ¿qué pasa si haces <code>a = b; b = a;</code>?</p>`,
              salida: "a = 9, b = 5",
              pista: "Necesitas un sitio donde guardar uno de los valores antes de pisarlo. Piensa en dos vasos con líquidos distintos: ¿cómo los intercambias?",
              soluciones: [
                {
                  titulo: "Versión básica: con variable auxiliar",
                  codigo: r`int a = 5;
int b = 9;

int temp = a;   // guardamos el valor de a antes de perderlo
a = b;          // a toma el valor de b
b = temp;       // b recibe el valor que guardamos

Console.WriteLine("a = " + a + ", b = " + b);`,
                  nota: "Es la solución clásica que debes saber explicar. Con a = b; b = a; ambas acabarían valiendo 9.",
                },
                {
                  titulo: "Versión profesional: deconstrucción de tuplas",
                  codigo: r`int a = 5;
int b = 9;

(a, b) = (b, a);   // C# evalúa la derecha y luego asigna: intercambio en una línea

Console.WriteLine($"a = {a}, b = {b}");`,
                  nota: "Internamente C# usa una variable temporal por ti. Más corto y legible, pero conviene haber entendido antes la versión básica.",
                },
              ],
            },
          ],
        },
        {
          id: "operadores",
          titulo: "Operadores aritméticos, relacionales y lógicos",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Usar los operadores aritméticos, incluidos ++, -- y la asignación compuesta", "Comparar valores con los operadores relacionales", "Combinar condiciones con &&, || y ! entendiendo el cortocircuito"],
          teoria: r`<p>Para realizar operaciones matemáticas básicas usamos
<strong>operadores aritméticos</strong> junto con valores o variables
numéricas.</p>
<h4 id="191-operadores-aritméticos-binarios">1.9.1 Operadores
aritméticos binarios</h4>
<p>Operan entre <strong>dos valores</strong>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Operador</th>
<th>Uso</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>+</code></td>
<td><code>int resul = 5 + 10;</code></td>
<td><code>resul</code> vale 15 (suma)</td>
</tr>
<tr class="even">
<td><code>-</code></td>
<td><code>int resul = a - b;</code></td>
<td>Resta a <code>a</code> el valor de <code>b</code></td>
</tr>
<tr class="odd">
<td><code>*</code></td>
<td><code>int resul = 5 * a;</code></td>
<td>Multiplica 5 por el valor de <code>a</code></td>
</tr>
<tr class="even">
<td><code>/</code></td>
<td><code>int resul = a / 5;</code></td>
<td>Divide <code>a</code> entre 5</td>
</tr>
<tr class="odd">
<td><code>%</code></td>
<td><code>int resul = 10 % 3;</code></td>
<td><strong>Resto</strong> de la división (aquí, 1). Se usa mucho para
saber si un número es múltiplo de otro (resto 0)</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>División entera.</strong> Si <strong>los dos operandos son
enteros</strong>, <code>/</code> hace una división entera y descarta los
decimales: <code>7 / 2</code> vale <code>3</code>. Para obtener
<code>3.5</code> al menos un operando debe ser decimal:
<code>7 / 2.0</code> o <code>7.0 / 2</code>.</p>
</div>
<!--ex:0-->
<h4 id="192-operadores-aritméticos-unarios">1.9.2 Operadores aritméticos
unarios</h4>
<p>Operan con <strong>un único valor</strong>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Operador</th>
<th>Uso</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>++</code></td>
<td><code>a++</code> / <code>++a</code></td>
<td><strong>Incrementa</strong> en 1 la variable</td>
</tr>
<tr class="even">
<td><code>--</code></td>
<td><code>a--</code> / <code>--a</code></td>
<td><strong>Decrementa</strong> en 1 la variable</td>
</tr>
<tr class="odd">
<td><code>-</code></td>
<td><code>int resul = -a;</code></td>
<td>Cambia el signo del valor</td>
</tr>
<tr class="even">
<td><code>+</code></td>
<td><code>int resul = +a;</code></td>
<td>Mantiene el signo (apenas se usa)</td>
</tr>
</tbody>
</table></div>
<p>Los operadores <code>++</code> y <code>--</code> solo se pueden
aplicar a <strong>variables</strong> (no a valores como
<code>5++</code>). Hay dos formas con una diferencia importante:</p>
<ul>
<li><strong>Postfijo</strong> (<code>a++</code>): usa el valor actual y
<em>después</em> incrementa.</li>
<li><strong>Prefijo</strong> (<code>++a</code>): incrementa primero y
<em>después</em> usa el valor.</li>
</ul>
<!--ex:1-->
<div class="callout">
<p>El operador <code>!</code> (negación) <strong>no es
aritmético</strong>, es un operador lógico. Lo veremos en el apartado
1.11.</p>
</div>
<h4 id="193-operadores-de-asignación-compuesta">1.9.3 Operadores de
asignación compuesta</h4>
<p>Combinan una operación con una asignación sobre la misma variable.
Salvo <code>=</code>, la variable debe haber sido inicializada
antes.</p>
<p>En la tabla suponemos que <strong>en cada fila</strong>
<code>resul</code> vale 10 al empezar:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Operador</th>
<th>Uso</th>
<th>Resultado</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>=</code></td>
<td><code>resul = 10;</code></td>
<td><code>resul</code> vale 10</td>
</tr>
<tr class="even">
<td><code>+=</code></td>
<td><code>resul += 5;</code></td>
<td><code>resul</code> vale <strong>15</strong> (10 + 5)</td>
</tr>
<tr class="odd">
<td><code>-=</code></td>
<td><code>resul -= 6;</code></td>
<td><code>resul</code> vale <strong>4</strong> (10 − 6)</td>
</tr>
<tr class="even">
<td><code>*=</code></td>
<td><code>resul *= 6;</code></td>
<td><code>resul</code> vale <strong>60</strong> (10 × 6)</td>
</tr>
<tr class="odd">
<td><code>/=</code></td>
<td><code>resul /= 5;</code></td>
<td><code>resul</code> vale <strong>2</strong> (10 / 5)</td>
</tr>
<tr class="even">
<td><code>%=</code></td>
<td><code>resul %= 5;</code></td>
<td><code>resul</code> vale <strong>0</strong> (resto de 10 entre
5)</td>
</tr>
</tbody>
</table></div>
<h3 id="110-operadores-relacionales">1.10 Operadores relacionales</h3>
<p>Permiten <strong>comparar</strong> dos valores. El resultado es
siempre un <code>bool</code> (<code>true</code> o <code>false</code>).
En la tabla suponemos <code>A = 10</code>.</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Operador</th>
<th>Uso</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>==</code></td>
<td><code>A == 10</code></td>
<td>¿A es igual a 10? → <code>true</code></td>
</tr>
<tr class="even">
<td><code>!=</code></td>
<td><code>A != 10</code></td>
<td>¿A es distinto de 10? → <code>false</code></td>
</tr>
<tr class="odd">
<td><code>&gt;</code></td>
<td><code>A &gt; 10</code></td>
<td>¿A es mayor que 10? → <code>false</code></td>
</tr>
<tr class="even">
<td><code>&lt;</code></td>
<td><code>A &lt; 15</code></td>
<td>¿A es menor que 15? → <code>true</code></td>
</tr>
<tr class="odd">
<td><code>&gt;=</code></td>
<td><code>A &gt;= 10</code></td>
<td>¿A es mayor o igual que 10? → <code>true</code></td>
</tr>
<tr class="even">
<td><code>&lt;=</code></td>
<td><code>A &lt;= 5</code></td>
<td>¿A es menor o igual que 5? → <code>false</code></td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>Cuidado:</strong> <code>=</code> <strong>asigna</strong> y
<code>==</code> <strong>compara</strong>. Escribir
<code>if (a = 5)</code> es un error de compilación en C#, porque el
resultado de una asignación no es un <code>bool</code>.</p>
</div>
<p>Para comparar el <strong>contenido de dos textos</strong> también se
usa <code>==</code> (en C# <code>string</code> compara por valor):
<code>"hola" == "hola"</code> es <code>true</code>.</p>
<h3 id="111-operadores-lógicos">1.11 Operadores lógicos</h3>
<p>Permiten operar con valores <code>bool</code> y obtener otro
<code>bool</code>.</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Operador</th>
<th>Uso</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>&amp;&amp;</code></td>
<td><code>A &amp;&amp; B</code></td>
<td><strong>AND</strong>. <code>true</code> solo si A <strong>y</strong>
B son <code>true</code></td>
</tr>
<tr class="even">
<td><code>||</code></td>
<td><code>A || B</code></td>
<td><strong>OR</strong>. <code>true</code> si A <strong>o</strong> B (o
ambos) son <code>true</code>. Solo es <code>false</code> si los dos son
<code>false</code></td>
</tr>
<tr class="odd">
<td><code>!</code></td>
<td><code>!A</code></td>
<td><strong>NOT</strong>. Invierte el valor: <code>!true</code> es
<code>false</code> y <code>!false</code> es <code>true</code></td>
</tr>
<tr class="even">
<td><code>^</code></td>
<td><code>A ^ B</code></td>
<td><strong>XOR</strong>. <code>true</code> si A y B son
<strong>distintos</strong></td>
</tr>
</tbody>
</table></div>
<p>Tabla de verdad:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>A</th>
<th>B</th>
<th><code>A &amp;&amp; B</code></th>
<th><code>A || B</code></th>
<th><code>A ^ B</code></th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>true</code></td>
<td><code>true</code></td>
<td><code>true</code></td>
<td><code>true</code></td>
<td><code>false</code></td>
</tr>
<tr class="even">
<td><code>true</code></td>
<td><code>false</code></td>
<td><code>false</code></td>
<td><code>true</code></td>
<td><code>true</code></td>
</tr>
<tr class="odd">
<td><code>false</code></td>
<td><code>true</code></td>
<td><code>false</code></td>
<td><code>true</code></td>
<td><code>true</code></td>
</tr>
<tr class="even">
<td><code>false</code></td>
<td><code>false</code></td>
<td><code>false</code></td>
<td><code>false</code></td>
<td><code>false</code></td>
</tr>
</tbody>
</table></div>
<p><strong>Evaluación en cortocircuito.</strong> Con
<code>&amp;&amp;</code>, si la parte izquierda es <code>false</code>, C#
<strong>ni evalúa</strong> la derecha (el resultado ya es
<code>false</code>). Con <code>||</code>, si la izquierda es
<code>true</code>, tampoco evalúa la derecha. Esto permite proteger
operaciones peligrosas:</p>
<!--ex:2-->
<p><strong>Prioridad de los operadores</strong> (de mayor a menor):
<code>!</code> y los unarios → <code>*</code> <code>/</code>
<code>%</code> → <code>+</code> <code>-</code> → <code>&lt;</code>
<code>&gt;</code> <code>&lt;=</code> <code>&gt;=</code> →
<code>==</code> <code>!=</code> → <code>&amp;&amp;</code> →
<code>||</code> → asignación. Ante la duda, usa
<strong>paréntesis</strong>: hacen el código más legible.</p>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`Console.WriteLine(7 / 2);       // 3   (entera)
Console.WriteLine(7 / 2.0);     // 3.5 (decimal)
Console.WriteLine(7 % 2);       // 1   (resto)
Console.WriteLine(-7 % 3);      // -1  (el resto toma el signo del dividendo)
` },
            { titulo: "- Prefijo (++a): incrementa primero y después usa el valor", codigo: r`int a = 5;
int b = a++;        // b recibe 5 (valor antes de incrementar) y a pasa a valer 6
int c = ++a;        // a pasa a valer 7 y c recibe 7
Console.WriteLine($"a={a}, b={b}, c={c}");   // a=7, b=5, c=7
` },
            { titulo: "Ejemplo 3", codigo: r`int divisor = 0;
int total = 100;

// Si divisor es 0, la parte derecha no se evalúa y no se divide entre cero
if (divisor != 0 && total / divisor > 2)
{
    Console.WriteLine("Mayor que 2");
}
` },
          ],
          actividades: [
            {
              titulo: "Calculadora de dos números",
              nivel: 2,
              enunciado: r`<p>Pide <strong>dos números enteros</strong> y muestra su <strong>suma,
resta, multiplicación, división entera, resto y división
real</strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><strong>Control de errores:</strong> si el usuario no escribe un
número entero, vuelve a pedirlo.</li>
<li>Si el segundo número es <code>0</code>, no se puede dividir: muestra
un aviso en lugar de las divisiones.</li>
<li>La división <strong>real</strong> se consigue convirtiendo un
operando a <code>double</code> (<code>(double)a / b</code>).</li>
</ul>
<p>💡 <strong>TIP:</strong> el operador <code>%</code> devuelve el resto
de la división entera.</p>`,
              soluciones: [
                { titulo: "Versión básica", nota: "Los operadores aritméticos más el control de errores con TryParse.", codigo: r`int a = LeerEntero("Primer número: ");
int b = LeerEntero("Segundo número: ");

Console.WriteLine($"{a} + {b} = {a + b}");
Console.WriteLine($"{a} - {b} = {a - b}");
Console.WriteLine($"{a} * {b} = {a * b}");

if (b == 0)
{
    Console.WriteLine("No se puede dividir entre 0.");
}
else
{
    Console.WriteLine($"{a} / {b} (entera) = {a / b}");
    Console.WriteLine($"{a} % {b} (resto) = {a % b}");
    Console.WriteLine($"{a} / {b} (real) = {(double)a / b}");   // el cast evita la división entera
}

// Repite la pregunta hasta que el usuario escribe un entero válido
int LeerEntero(string mensaje)
{
    int valor;
    Console.Write(mensaje);
    while (!int.TryParse(Console.ReadLine(), out valor))
    {
        Console.Write("Valor no válido. " + mensaje);
    }
    return valor;
}
` },
              ],
            },
            {
              titulo: "¿Año bisiesto?",
              nivel: 2,
              enunciado: r`<p>Pide un <strong>año</strong> y muestra si es bisiesto. Un año es
bisiesto si es <strong>divisible entre 4 y no entre 100</strong>, o si
es <strong>divisible entre 400</strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Usa los operadores lógicos <code>&amp;&amp;</code>, <code>||</code>
y el operador resto <code>%</code>.</li>
<li><strong>Control de errores:</strong> el año debe ser un entero mayor
que 0.</li>
</ul>
<p>💡 <strong>TIP:</strong> 2000 y 2024 son bisiestos; 1900 y 2023
no.</p>`,
              soluciones: [
                { titulo: "Solución con una expresión booleana", nota: "El operador ?: elige entre dos textos según el valor del booleano.", codigo: r`int anio;
Console.Write("Escribe un año: ");
while (!int.TryParse(Console.ReadLine(), out anio) || anio <= 0)
{
    Console.Write("Año no válido. Escribe un entero mayor que 0: ");
}

bool bisiesto = (anio % 4 == 0 && anio % 100 != 0) || anio % 400 == 0;   // los paréntesis aclaran la prioridad

Console.WriteLine(bisiesto ? $"{anio} es bisiesto" : $"{anio} no es bisiesto");
` },
              ],
            },
          ],
        },

        /* ------------------------ LECTURA Y ESCRITURA ----------------------- */
        {
          id: "lectura-escritura",
          titulo: "Lectura y escritura por consola",
          duracion: "10 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Mostrar información con Console.Write y Console.WriteLine",
            "Leer datos del usuario con Console.ReadLine",
            "Dar formato al texto: concatenación, interpolación y secuencias de escape",
          ],
          teoria: r`
<p>La consola es nuestra pantalla de entrada y salida. Con la clase <code>Console</code> escribimos y leemos texto:</p>
<ul>
<li><code>Console.WriteLine(x)</code> muestra <code>x</code> y salta de línea.</li>
<li><code>Console.Write(x)</code> muestra <code>x</code> y se queda en la misma línea (útil para preguntar).</li>
<li><code>Console.ReadLine()</code> espera a que el usuario pulse Enter y <strong>devuelve siempre un <code>string</code></strong> (o <code>null</code> si no hay entrada).</li>
</ul>
<h4>Tres formas de montar un mensaje</h4>
<ol>
<li><strong>Concatenación</strong> con <code>+</code>: sencilla, pero se vuelve ilegible con muchas partes.</li>
<li><strong>Formato compuesto</strong> con <code>{0}</code>, <code>{1}</code>…: antigua, la verás en código viejo.</li>
<li><strong>Interpolación</strong> con <code>$"..."</code>: la más clara y la que recomendamos.</li>
</ol>
<h4>Secuencias de escape útiles</h4>
<div class="table-wrap"><table>
<thead><tr><th>Secuencia</th><th>Significado</th></tr></thead>
<tbody>
<tr><td><code>\n</code></td><td>Salto de línea</td></tr>
<tr><td><code>\t</code></td><td>Tabulador</td></tr>
<tr><td><code>\"</code></td><td>Comillas dobles dentro de un texto</td></tr>
<tr><td><code>\\</code></td><td>Una barra invertida</td></tr>
</tbody></table></div>`,
          ejemplos: [
            {
              titulo: "Preguntar y saludar",
              codigo: r`Console.Write("¿Cómo te llamas? ");          // Write: NO salta de línea
string nombre = Console.ReadLine() ?? "";     // ?? "" evita el valor null
Console.WriteLine($"¡Hola, {nombre}!");       // interpolación con $"..."`,
              explicacion: "El operador ?? significa «si lo de la izquierda es null, usa lo de la derecha». Evita avisos del compilador y errores en tiempo de ejecución.",
            },
            {
              titulo: "Formas de escribir un mensaje",
              codigo: r`string jugador = "Link";
int rupias = 25;
double precio = 3.5;

Console.WriteLine("Jugador: " + jugador + " tiene " + rupias + " rupias");  // concatenación
Console.WriteLine("Jugador: {0} tiene {1} rupias", jugador, rupias);         // formato compuesto
Console.WriteLine($"Jugador: {jugador} tiene {rupias} rupias");              // interpolación (la mejor)
Console.WriteLine($"Precio: {precio:F2} €");                                 // F2 = 2 decimales`,
              explicacion: "Las cuatro líneas muestran información equivalente. Después de los dos puntos, dentro de las llaves, se indica el formato: F2 son dos decimales.",
            },
            {
              titulo: "Secuencias de escape",
              codigo: r`Console.WriteLine("Línea 1\nLínea 2");
Console.WriteLine("Nombre:\tDani");
Console.WriteLine("Dijo \"hola\"");
Console.WriteLine("C:\\Usuarios\\dani");`,
              explicacion: "Prueba a quitar las barras invertidas y observa qué ocurre.",
            },
          ],
          actividades: [
            {
              titulo: "Presentación",
              nivel: 1,
              enunciado: r`<p>Pide al usuario su <strong>nombre</strong> y su <strong>ciudad</strong> y muestra un mensaje como el del ejemplo.</p>`,
              salida: "¿Cómo te llamas? Marta\n¿De dónde eres? Girona\nHola Marta, ¡qué bonita es Girona!",
              pista: "Usa Console.Write para las preguntas y Console.ReadLine para guardar las respuestas en dos variables string.",
              soluciones: [
                {
                  titulo: "Versión básica: concatenación",
                  codigo: r`Console.Write("¿Cómo te llamas? ");
string nombre = Console.ReadLine() ?? "";

Console.Write("¿De dónde eres? ");
string ciudad = Console.ReadLine() ?? "";

Console.WriteLine("Hola " + nombre + ", ¡qué bonita es " + ciudad + "!");`,
                  nota: "Funciona perfectamente; fíjate en lo fácil que es olvidar un espacio o unas comillas.",
                },
                {
                  titulo: "Versión recomendada: interpolación",
                  codigo: r`Console.Write("¿Cómo te llamas? ");
string nombre = Console.ReadLine() ?? "";

Console.Write("¿De dónde eres? ");
string ciudad = Console.ReadLine() ?? "";

Console.WriteLine($"Hola {nombre}, ¡qué bonita es {ciudad}!");`,
                  nota: "El mensaje se lee casi como el resultado final. Es la forma habitual en código profesional.",
                },
              ],
            },
            {
              titulo: "Ticket de compra",
              nivel: 2,
              enunciado: r`<p>Pide el <strong>nombre del producto</strong>, el <strong>precio por unidad</strong> (decimal) y las <strong>unidades</strong> (entero). Muestra el total con dos decimales.</p>
<p><em>Pista de contexto:</em> para convertir el texto en número usa <code>double.Parse</code> e <code>int.Parse</code>. Los veremos en detalle en la siguiente lección.</p>`,
              salida: "Producto: Poción\nPrecio por unidad: 2,5\nUnidades: 4\n--- TICKET ---\nPoción x4\nTotal: 10,00 €",
              pista: "ReadLine devuelve texto; necesitas convertirlo a double y a int antes de multiplicar.",
              soluciones: [
                {
                  titulo: "Versión básica: double y concatenación",
                  codigo: r`Console.Write("Producto: ");
string producto = Console.ReadLine() ?? "";
Console.Write("Precio por unidad: ");
double precio = double.Parse(Console.ReadLine() ?? "0");
Console.Write("Unidades: ");
int unidades = int.Parse(Console.ReadLine() ?? "0");

double total = precio * unidades;

Console.WriteLine("--- TICKET ---");
Console.WriteLine(producto + " x" + unidades);
Console.WriteLine("Total: " + total.ToString("F2") + " €");`,
                  nota: "ToString(\"F2\") convierte el número en texto con dos decimales.",
                },
                {
                  titulo: "Versión profesional: decimal e interpolación",
                  codigo: r`Console.Write("Producto: ");
string producto = Console.ReadLine() ?? "";
Console.Write("Precio por unidad: ");
decimal precio = decimal.Parse(Console.ReadLine() ?? "0");
Console.Write("Unidades: ");
int unidades = int.Parse(Console.ReadLine() ?? "0");

decimal total = precio * unidades;

Console.WriteLine("--- TICKET ---");
Console.WriteLine($"{producto} x{unidades}");
Console.WriteLine($"Total: {total:C2}");   // C2 = formato de moneda según la configuración regional`,
                  nota: "Con dinero se usa decimal porque evita los pequeños errores de redondeo de double (0,1 + 0,2 no da exactamente 0,3 en double).",
                },
              ],
            },
          ],
        },

        /* ------------------------ CONVERSIÓN DE TIPOS ----------------------- */
        {
          id: "conversion-tipos",
          titulo: "Conversión de tipos",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Distinguir conversión implícita y explícita",
            "Convertir texto a número con Parse, Convert y TryParse",
            "Evitar el error de la división entera",
          ],
          teoria: r`
<p>A veces necesitamos pasar un dato de un tipo a otro. C# distingue dos situaciones:</p>
<ul>
<li><strong>Conversión implícita:</strong> no hay pérdida de información, C# la hace solo. Ejemplo: de <code>int</code> a <code>double</code>.</li>
<li><strong>Conversión explícita (cast):</strong> puede perder información, por lo que debemos pedirla con <code>(tipo)</code>. Ejemplo: de <code>double</code> a <code>int</code> <em>trunca</em> los decimales, no redondea.</li>
</ul>
<h4>De texto a número</h4>
<div class="table-wrap"><table>
<thead><tr><th>Herramienta</th><th>Si el texto no es válido…</th><th>Cuándo usarla</th></tr></thead>
<tbody>
<tr><td><code>int.Parse(texto)</code></td><td>Lanza una excepción</td><td>Cuando estás seguro de que el dato es correcto</td></tr>
<tr><td><code>Convert.ToInt32(texto)</code></td><td>Lanza una excepción (y <code>null</code> da 0)</td><td>Cuando conviertes entre muchos tipos distintos</td></tr>
<tr><td><code>int.TryParse(texto, out n)</code></td><td>Devuelve <code>false</code>, sin romper el programa</td><td><strong>Siempre que el dato venga del usuario</strong></td></tr>
</tbody></table></div>
<div class="callout warn"><strong>Trampa clásica:</strong> <code>7 / 2</code> vale <code>3</code> porque entre dos enteros la división es entera. Para obtener <code>3.5</code> uno de los dos operandos debe ser decimal: <code>7 / 2.0</code>.</div>`,
          ejemplos: [
            {
              titulo: "Implícita, explícita y división entera",
              codigo: r`int entero = 7;
double implicito = entero;          // implícita: no se pierde nada

double pi = 3.99;
int truncado = (int)pi;             // explícita: trunca → 3 (NO redondea)
int redondeado = (int)Math.Round(pi); // redondea → 4

Console.WriteLine(truncado);        // 3
Console.WriteLine(redondeado);      // 4
Console.WriteLine(7 / 2);           // 3   (división entera)
Console.WriteLine(7 / 2.0);         // 3,5 (división decimal)`,
              explicacion: "El resultado de una operación depende del tipo de sus operandos, no de lo que tú esperes.",
            },
            {
              titulo: "TryParse: leer números sin que el programa explote",
              codigo: r`Console.Write("Introduce tu edad: ");
string texto = Console.ReadLine() ?? "";

if (int.TryParse(texto, out int edad))        // out: TryParse "devuelve" también el número
{
    Console.WriteLine($"El año que viene tendrás {edad + 1}");
}
else
{
    Console.WriteLine("Eso no es un número entero válido.");
}`,
              explicacion: "Aquí adelantamos un if (lo estudiaremos en la lección de estructuras de control). TryParse devuelve true/false y deja el número en la variable edad.",
            },
          ],
          actividades: [
            {
              titulo: "Media de tres notas",
              nivel: 2,
              enunciado: r`<p>Pide <strong>tres notas enteras</strong> y muestra la media con dos decimales.</p>
<p>Cuidado: con tres enteros, <code>(n1 + n2 + n3) / 3</code> descarta los decimales.</p>`,
              salida: "Nota 1: 7\nNota 2: 8\nNota 3: 6\nMedia: 7,00",
              pista: "Hay dos formas de forzar la división decimal: dividir entre 3.0 o convertir la suma a double con un cast antes de dividir.",
              soluciones: [
                {
                  titulo: "Versión básica: Parse y 3.0",
                  codigo: r`Console.Write("Nota 1: ");
int n1 = int.Parse(Console.ReadLine() ?? "0");
Console.Write("Nota 2: ");
int n2 = int.Parse(Console.ReadLine() ?? "0");
Console.Write("Nota 3: ");
int n3 = int.Parse(Console.ReadLine() ?? "0");

double media = (n1 + n2 + n3) / 3.0;   // 3.0 fuerza la división decimal

Console.WriteLine($"Media: {media:F2}");`,
                  nota: "Si escribieras / 3 el resultado sería entero (7 en lugar de 7,00) aunque guardes el resultado en un double.",
                },
                {
                  titulo: "Versión robusta: TryParse y cast",
                  codigo: r`Console.Write("Nota 1: ");
if (!int.TryParse(Console.ReadLine(), out int n1)) { Console.WriteLine("Nota no válida"); return; }
Console.Write("Nota 2: ");
if (!int.TryParse(Console.ReadLine(), out int n2)) { Console.WriteLine("Nota no válida"); return; }
Console.Write("Nota 3: ");
if (!int.TryParse(Console.ReadLine(), out int n3)) { Console.WriteLine("Nota no válida"); return; }

double media = (double)(n1 + n2 + n3) / 3;   // cast: la suma pasa a double antes de dividir

Console.WriteLine($"Media: {media:F2}");`,
                  nota: "Si el usuario escribe «abc», el programa avisa y termina con return en lugar de lanzar una excepción. Más adelante, con bucles, podremos volver a preguntar.",
                },
              ],
            },
            {
              titulo: "Euros a dólares",
              nivel: 2,
              enunciado: r`<p>Con una tasa fija de <code>1.08</code> (constante), pide una cantidad en euros y muestra:</p>
<ul><li>los dólares con dos decimales,</li><li>la parte entera <strong>truncada</strong> (cast),</li><li>la cantidad <strong>redondeada</strong> al entero más cercano.</li></ul>`,
              salida: "Euros: 19,99\nDólares: 21,59\nTruncado: 21\nRedondeado: 22",
              pista: "(int) trunca; Math.Round redondea. No olvides convertir el resultado de Math.Round a int con un cast.",
              soluciones: [
                {
                  titulo: "Solución",
                  codigo: r`const double TASA = 1.08;

Console.Write("Euros: ");
double euros = double.Parse(Console.ReadLine() ?? "0");

double dolares = euros * TASA;

Console.WriteLine($"Dólares: {dolares:F2}");
Console.WriteLine($"Truncado: {(int)dolares}");
Console.WriteLine($"Redondeado: {(int)Math.Round(dolares)}");`,
                  nota: "Math.Round devuelve double, por eso hace falta el cast (int) para mostrar un entero.",
                },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================
       MÓDULO 2 · CONTROL DE FLUJO
       ================================================================ */
    {
      id: "m2",
      titulo: "Control de flujo",
      lecciones: [
        /* ------------------------ ESTRUCTURAS DE CONTROL ----------------------- */
        {
          id: "estructuras-control",
          titulo: "Estructuras de control: condicionales",
          duracion: "15 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Tomar decisiones con if, else if y else",
            "Combinar condiciones con &&, || y !",
            "Elegir entre múltiples casos con switch y switch expression",
          ],
          teoria: r`
<p>Hasta ahora nuestros programas ejecutaban todas las líneas de arriba abajo. Las <strong>estructuras condicionales</strong> permiten que el programa tome decisiones según el valor de una condición (una expresión que da <code>true</code> o <code>false</code>).</p>
<div class="table-wrap"><table>
<thead><tr><th>Operadores</th><th>Significado</th></tr></thead>
<tbody>
<tr><td><code>==  !=  &lt;  &gt;  &lt;=  &gt;=</code></td><td>Comparación</td></tr>
<tr><td><code>&amp;&amp;</code></td><td>Y: ambas condiciones deben cumplirse</td></tr>
<tr><td><code>||</code></td><td>O: basta con que se cumpla una</td></tr>
<tr><td><code>!</code></td><td>NO: invierte la condición</td></tr>
</tbody></table></div>
<ul>
<li><code>if / else if / else</code>: la estructura general, para rangos y condiciones complejas.</li>
<li><code>switch</code>: ideal cuando comparamos una variable con varios valores concretos.</li>
<li>Operador ternario: <code>string t = edad &gt;= 18 ? "Adulto" : "Menor";</code> para decisiones cortas.</li>
</ul>
<div class="callout warn"><strong>Error típico:</strong> escribir <code>if (a = 5)</code> en lugar de <code>if (a == 5)</code>. Un solo <code>=</code> asigna; dos <code>==</code> comparan.</div>`,
          ejemplos: [
            {
              titulo: "if / else if / else",
              codigo: r`Console.Write("Nota (0-10): ");
double nota = double.Parse(Console.ReadLine() ?? "0");

if (nota >= 9)      Console.WriteLine("Sobresaliente");
else if (nota >= 7) Console.WriteLine("Notable");
else if (nota >= 5) Console.WriteLine("Aprobado");
else                Console.WriteLine("Suspenso");`,
              explicacion: "Las condiciones se evalúan en orden y solo se ejecuta la primera rama que se cumple. Por eso el orden importa.",
            },
            {
              titulo: "Operadores lógicos",
              codigo: r`int edad = 17;
bool tieneCarnet = false;

if (edad >= 18 && tieneCarnet)
    Console.WriteLine("Puedes conducir");
else if (edad >= 18 || tieneCarnet)
    Console.WriteLine("Casi: te falta una condición");
else
    Console.WriteLine("Todavía no");

if (!tieneCarnet)
    Console.WriteLine("Apúntate a la autoescuela");`,
              explicacion: "Con una sola instrucción no hacen falta llaves, pero ponerlas siempre evita errores al añadir líneas después.",
            },
            {
              titulo: "switch clásico y switch expression",
              codigo: r`int dia = 3;

switch (dia)
{
    case 1: Console.WriteLine("Lunes"); break;
    case 2: Console.WriteLine("Martes"); break;
    case 3: Console.WriteLine("Miércoles"); break;
    default: Console.WriteLine("Otro día"); break;
}

// switch expression (C# 8+): devuelve un valor
string tipo = dia switch
{
    6 or 7 => "Fin de semana",
    >= 1 and <= 5 => "Laborable",
    _ => "Día no válido"          // _ equivale al default
};
Console.WriteLine(tipo);`,
              explicacion: "En el switch clásico cada case termina con break. La switch expression es más compacta y permite rangos con and/or.",
            },
          ],
          actividades: [
            {
              titulo: "El mayor de tres números",
              nivel: 1,
              enunciado: r`<p>Pide tres números enteros y muestra cuál es el mayor.</p>`,
              salida: "a: 4\nb: 9\nc: 2\nEl mayor es 9",
              pista: "Compara el primero con los otros dos. ¿Qué operador lógico necesitas para exigir dos condiciones a la vez?",
              soluciones: [
                {
                  titulo: "Versión básica: if / else if",
                  codigo: r`Console.Write("a: ");
int a = int.Parse(Console.ReadLine() ?? "0");
Console.Write("b: ");
int b = int.Parse(Console.ReadLine() ?? "0");
Console.Write("c: ");
int c = int.Parse(Console.ReadLine() ?? "0");

int mayor;
if (a >= b && a >= c) mayor = a;
else if (b >= a && b >= c) mayor = b;
else mayor = c;

Console.WriteLine($"El mayor es {mayor}");`,
                  nota: "Usamos >= para que funcione también cuando hay valores repetidos.",
                },
                {
                  titulo: "Versión profesional: Math.Max",
                  codigo: r`Console.Write("a: ");
int a = int.Parse(Console.ReadLine() ?? "0");
Console.Write("b: ");
int b = int.Parse(Console.ReadLine() ?? "0");
Console.Write("c: ");
int c = int.Parse(Console.ReadLine() ?? "0");

int mayor = Math.Max(a, Math.Max(b, c));

Console.WriteLine($"El mayor es {mayor}");`,
                  nota: "Reutilizar funciones de la biblioteca estándar es más corto y tiene menos riesgo de error. Pero la versión básica demuestra que entiendes la lógica.",
                },
              ],
            },
            {
              titulo: "Calculadora de cuatro operaciones",
              nivel: 2,
              enunciado: r`<p>Pide dos números y un operador (<code>+</code>, <code>-</code>, <code>*</code>, <code>/</code>) y muestra el resultado. Controla que no se pueda <strong>dividir entre 0</strong> y que el operador sea válido.</p>`,
              salida: "Primer número: 8\nOperador (+, -, *, /): /\nSegundo número: 0\nError: no se puede dividir entre 0",
              pista: "Guarda el operador en un string y compáralo con \"+\", \"-\", etc. La división necesita un if dentro del if.",
              soluciones: [
                {
                  titulo: "Versión básica: if / else if",
                  codigo: r`Console.Write("Primer número: ");
double a = double.Parse(Console.ReadLine() ?? "0");
Console.Write("Operador (+, -, *, /): ");
string op = Console.ReadLine() ?? "";
Console.Write("Segundo número: ");
double b = double.Parse(Console.ReadLine() ?? "0");

if (op == "+") Console.WriteLine($"Resultado: {a + b}");
else if (op == "-") Console.WriteLine($"Resultado: {a - b}");
else if (op == "*") Console.WriteLine($"Resultado: {a * b}");
else if (op == "/")
{
    if (b == 0) Console.WriteLine("Error: no se puede dividir entre 0");
    else Console.WriteLine($"Resultado: {a / b}");
}
else Console.WriteLine("Operador no válido");`,
                  nota: "Hay un if anidado dentro de la rama de la división. Cada decisión extra va en su propio nivel.",
                },
                {
                  titulo: "Versión profesional: switch expression",
                  codigo: r`Console.Write("Primer número: ");
double a = double.Parse(Console.ReadLine() ?? "0");
Console.Write("Operador (+, -, *, /): ");
string op = Console.ReadLine() ?? "";
Console.Write("Segundo número: ");
double b = double.Parse(Console.ReadLine() ?? "0");

double? resultado = op switch      // double? = double que también puede valer null
{
    "+" => a + b,
    "-" => a - b,
    "*" => a * b,
    "/" when b != 0 => a / b,      // "when" añade una condición extra al caso
    _ => null                      // operador desconocido o división entre 0
};

Console.WriteLine(resultado is null
    ? "Operación no válida (operador desconocido o división entre 0)"
    : $"Resultado: {resultado}");`,
                  nota: "Usamos un tipo que admite null (double?) para representar «no hay resultado». Es una técnica muy habitual, aunque la versión básica da mensajes más específicos.",
                },
              ],
            },
          ],
        },

        /* ------------------------ ESTRUCTURAS DE REPETICIÓN ----------------------- */
        {
          id: "estructuras-repeticion",
          titulo: "Estructuras de repetición",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Repetir instrucciones con while, do-while y for",
            "Elegir el bucle adecuado según el problema",
            "Usar contadores, acumuladores, break y continue",
          ],
          teoria: r`
<p>Un <strong>bucle</strong> repite un bloque de instrucciones mientras se cumpla una condición. Elegir bien el bucle hace el código más claro:</p>
<div class="table-wrap"><table>
<thead><tr><th>Bucle</th><th>Úsalo cuando…</th><th>¿Se ejecuta al menos una vez?</th></tr></thead>
<tbody>
<tr><td><code>for</code></td><td>Sabes cuántas veces repetir</td><td>No (si la condición es falsa de inicio)</td></tr>
<tr><td><code>while</code></td><td>No sabes cuántas veces; depende de una condición</td><td>No</td></tr>
<tr><td><code>do { } while</code></td><td>Necesitas ejecutar el cuerpo antes de comprobar (p. ej. validar entradas)</td><td><strong>Sí</strong></td></tr>
<tr><td><code>foreach</code></td><td>Recorrer colecciones (lo veremos con arrays)</td><td>No</td></tr>
</tbody></table></div>
<h4>Patrones básicos</h4>
<ul>
<li><strong>Contador:</strong> una variable que sube de uno en uno (<code>contador++</code>).</li>
<li><strong>Acumulador:</strong> una variable que va sumando valores (<code>suma += valor</code>).</li>
<li><code>break</code> sale del bucle; <code>continue</code> salta a la siguiente vuelta.</li>
</ul>
<div class="callout warn"><strong>Bucle infinito:</strong> si la condición nunca llega a ser falsa (por ejemplo, olvidas incrementar el contador), el programa no termina. Con <kbd>Ctrl</kbd>+<kbd>C</kbd> puedes detenerlo en la consola.</div>`,
          ejemplos: [
            {
              titulo: "for: cuando sabemos cuántas vueltas",
              codigo: r`for (int i = 1; i <= 10; i++)    // inicio; condición; incremento
{
    Console.WriteLine($"5 x {i} = {5 * i}");
}`,
              explicacion: "El for agrupa en una sola línea las tres partes del bucle: inicialización, condición y actualización.",
            },
            {
              titulo: "while: contador y acumulador",
              codigo: r`int n = 5;
int suma = 0;
int contador = 1;

while (contador <= n)
{
    suma += contador;   // acumulador
    contador++;         // contador: sin esto sería un bucle infinito
}

Console.WriteLine($"La suma de 1 a {n} es {suma}");   // 15`,
              explicacion: "Compara con la versión for: hace lo mismo, pero aquí inicialización, condición e incremento están separados.",
            },
            {
              titulo: "do-while: validar una entrada",
              codigo: r`int numero = 0;
bool valido;

do
{
    Console.Write("Introduce un número entre 1 y 10: ");
    valido = int.TryParse(Console.ReadLine(), out numero) && numero >= 1 && numero <= 10;
    if (!valido) Console.WriteLine("Valor no válido, inténtalo de nuevo");
} while (!valido);

Console.WriteLine($"Has elegido el {numero}");`,
              explicacion: "Es el patrón estándar para pedir un dato hasta que sea correcto: el cuerpo se ejecuta siempre una vez antes de evaluar la condición.",
            },
          ],
          actividades: [
            {
              titulo: "Tabla de multiplicar",
              nivel: 1,
              enunciado: r`<p>Pide un número y muestra su tabla de multiplicar del 1 al 10.</p>`,
              salida: "Número: 7\n7 x 1 = 7\n7 x 2 = 14\n...\n7 x 10 = 70",
              pista: "Si sabes cuántas vueltas son (10), el bucle for es la herramienta más natural.",
              soluciones: [
                {
                  titulo: "Con for",
                  codigo: r`Console.Write("Número: ");
int numero = int.Parse(Console.ReadLine() ?? "0");

for (int i = 1; i <= 10; i++)
{
    Console.WriteLine($"{numero} x {i} = {numero * i}");
}`,
                  nota: "La opción más clara cuando el número de repeticiones es conocido.",
                },
                {
                  titulo: "Con while (para comparar)",
                  codigo: r`Console.Write("Número: ");
int numero = int.Parse(Console.ReadLine() ?? "0");

int i = 1;                       // inicialización
while (i <= 10)                  // condición
{
    Console.WriteLine($"{numero} x {i} = {numero * i}");
    i++;                         // actualización (¡no la olvides!)
}`,
                  nota: "Es equivalente al for. Sirve para ver que los tres elementos siguen ahí, solo que repartidos.",
                },
              ],
            },
            {
              titulo: "Adivina el número",
              nivel: 3,
              enunciado: r`<p>El ordenador piensa un número aleatorio entre 1 y 100. El usuario va probando y el programa responde «Más alto» o «Más bajo» hasta que acierte. Al final muestra el <strong>número de intentos</strong>.</p>
<p>Ayuda: <code>new Random().Next(1, 101)</code> genera un entero entre 1 y 100.</p>`,
              salida: "Adivina el número (1-100): 50\nMás alto\nAdivina el número (1-100): 75\nMás bajo\nAdivina el número (1-100): 62\n¡Correcto! Lo has conseguido en 3 intentos",
              pista: "No sabes cuántas vueltas habrá, así que for no es lo ideal. Necesitas un contador de intentos y una condición de salida cuando intento == secreto.",
              soluciones: [
                {
                  titulo: "Versión con while (true) y break",
                  codigo: r`Random rnd = new Random();
int secreto = rnd.Next(1, 101);   // el 101 no está incluido
int intentos = 0;

while (true)                      // bucle "infinito" controlado con break
{
    Console.Write("Adivina el número (1-100): ");
    if (!int.TryParse(Console.ReadLine(), out int intento))
    {
        Console.WriteLine("Escribe un número entero");
        continue;                 // vuelve al inicio sin contar el intento
    }

    intentos++;

    if (intento < secreto) Console.WriteLine("Más alto");
    else if (intento > secreto) Console.WriteLine("Más bajo");
    else
    {
        Console.WriteLine($"¡Correcto! Lo has conseguido en {intentos} intentos");
        break;                    // salimos del bucle
    }
}`,
                  nota: "break y continue permiten estructurar la lógica sin variables auxiliares, pero abusar de ellos puede dificultar la lectura.",
                },
                {
                  titulo: "Versión con do-while",
                  codigo: r`int secreto = Random.Shared.Next(1, 101);   // Random.Shared: disponible desde .NET 6
int intento = 0;
int intentos = 0;

do
{
    Console.Write("Adivina el número (1-100): ");
    if (!int.TryParse(Console.ReadLine(), out intento))
    {
        Console.WriteLine("Escribe un número entero");
        continue;                 // en un do-while salta a la comprobación de la condición
    }

    intentos++;

    if (intento < secreto) Console.WriteLine("Más alto");
    else if (intento > secreto) Console.WriteLine("Más bajo");
} while (intento != secreto);

Console.WriteLine($"¡Correcto! Lo has conseguido en {intentos} intentos");`,
                  nota: "La condición de salida está explícita en el while final y no hace falta break. Cuando TryParse falla, intento vale 0, que nunca coincide con el secreto (≥ 1), así que el bucle continúa.",
                },
              ],
            },
          ],
        },
        {
          id: "saltos",
          titulo: "Instrucciones de salto: break, continue y return",
          duracion: "10 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Conocer qué hacen break, continue y return", "Saber por qué conviene usarlas con moderación", "Escribir bucles cuya condición diga claramente cuándo terminan"],
          teoria: r`<p>Son instrucciones que alteran el flujo de ejecución dentro de un
bloque de código.</p>
<h4 id="241-break">2.4.1 <code>break</code></h4>
<p><code>break;</code> <strong>interrumpe</strong> el bucle (o el
<code>switch</code>) en el que está y continúa la ejecución justo
después de él.</p>
<!--ex:0-->
<h4 id="242-continue">2.4.2 <code>continue</code></h4>
<p><code>continue;</code> solo se puede usar dentro de un bucle. Salta
el <strong>resto de la vuelta actual</strong> y pasa a la siguiente
evaluación de la condición.</p>
<!--ex:1-->
<div class="callout">
<p><strong>Cuidado en <code>while</code> y
<code>do-while</code>:</strong> si usas <code>continue</code>, la
instrucción que modifica la variable de control debe ejecutarse
<strong>antes</strong>, o el bucle no terminará nunca. En un
<code>for</code> no hay ese problema, porque la actualización va en la
cabecera.</p>
</div>
<h4 id="243-return">2.4.3 <code>return</code></h4>
<p><code>return;</code> termina la ejecución del método en el que está.
Cuando estamos en las sentencias de nivel superior de un programa,
<strong>finaliza el programa</strong>. Con las funciones (UF2) veremos
que además puede devolver un valor.</p>
<!--ex:2-->
<div class="callout">
<p><strong>Buenas prácticas.</strong> <code>break</code> y
<code>continue</code> son instrucciones válidas, pero abusar de ellas
hace el código más difícil de seguir. Una buena costumbre es que
<strong>la condición de salida del bucle esté visible en su
cabecera</strong>. En las actividades del módulo se usan
<code>do-while</code> con condición clara y se evitan <code>break</code>
y <code>continue</code> (salvo <code>break</code> dentro de un
<code>switch</code>). Tampoco se escriben bucles que dependan de una
condición constante.</p>
</div>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`int numero = 0;

while (numero < 3)
{
    if (numero == 2)
    {
        break;                        // sale del bucle cuando numero vale 2
    }
    Console.WriteLine($"El valor de numero es {numero}");   // 0, 1
    numero++;
}
` },
            { titulo: "Ejemplo 2", codigo: r`for (int numero = 0; numero < 3; numero++)
{
    if (numero == 1)
    {
        continue;                     // salta el WriteLine cuando numero vale 1
    }
    Console.WriteLine($"El valor de numero es {numero}");   // 0, 2
}
` },
            { titulo: "Ejemplo 3", codigo: r`for (int numero = 0; numero < 3; numero++)
{
    if (numero == 2)
    {
        return;                       // el programa termina aquí
    }
    Console.WriteLine($"El valor de numero es {numero}");   // 0, 1
}
` },
          ],
          actividades: [
            {
              titulo: "Primer múltiplo de 7",
              nivel: 2,
              enunciado: r`<p>Escribe una función
<strong><code>PrimerMultiploDe7(int minimo)</code></strong> que devuelva
el <strong>primer múltiplo de 7 mayor o igual que
<code>minimo</code></strong>. Después pide un número al usuario y
muestra el resultado.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><strong>Control de errores:</strong> el número debe ser un entero
mayor o igual que 0.</li>
<li>Haz <strong>dos versiones</strong>: una en la que la función termine
con <code>return</code> dentro del bucle y otra con una condición de
bucle.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>n % 7 == 0</code> indica que
<code>n</code> es múltiplo de 7.</p>`,
              soluciones: [
                { titulo: "Versión con return dentro del bucle", nota: "return dentro de un bucle termina la función en el acto.", codigo: r`int minimo;
Console.Write("Escribe un número (0 o mayor): ");
while (!int.TryParse(Console.ReadLine(), out minimo) || minimo < 0)
{
    Console.Write("Valor no válido. Escribe un número (0 o mayor): ");
}
Console.WriteLine($"El primer múltiplo de 7 es {PrimerMultiploDe7(minimo)}");

int PrimerMultiploDe7(int minimo)
{
    for (int n = minimo; n <= minimo + 6; n++)    // como mucho en 7 números hay un múltiplo de 7
    {
        if (n % 7 == 0)
        {
            return n;                              // return termina la función y devuelve el valor
        }
    }
    return minimo;                                 // no se llega nunca, pero el compilador lo exige
}
` },
                { titulo: "Versión con condición de bucle", nota: "Sin saltos: la condición del bucle ya dice cuándo parar. Es la forma más clara.", codigo: r`int minimo;
Console.Write("Escribe un número (0 o mayor): ");
while (!int.TryParse(Console.ReadLine(), out minimo) || minimo < 0)
{
    Console.Write("Valor no válido. Escribe un número (0 o mayor): ");
}
Console.WriteLine($"El primer múltiplo de 7 es {PrimerMultiploDe7(minimo)}");

int PrimerMultiploDe7(int minimo)
{
    int n = minimo;
    while (n % 7 != 0)       // seguimos mientras NO sea múltiplo
    {
        n++;
    }
    return n;
}
` },
              ],
            },
          ],
        },
        {
          id: "excepciones",
          titulo: "Control de excepciones: try, catch y finally",
          duracion: "15 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender qué es una excepción", "Capturar errores con try / catch / finally", "Diferenciar los tipos de excepción más comunes"],
          teoria: r`<p>¿Qué ocurre si el usuario escribe letras donde esperamos un número o
si dividimos un entero entre 0? Estas y muchas otras operaciones
producen <strong>errores en tiempo de ejecución</strong> que, si no los
tratamos, <strong>detienen el programa</strong>. En C# esos errores se
representan con <strong>excepciones</strong>.</p>
<p>El control de excepciones permite ejecutar un bloque de código «con
red» e indicar <strong>qué hacer si algo falla</strong>. Además, podemos
actuar de forma distinta según el <strong>tipo</strong> de error.</p>
<pre><code>try
{
    // código que puede fallar
}
catch (TipoDeExcepcion)
{
    // qué hacer si falla con ese tipo de error
}
catch (OtroTipoDeExcepcion)
{
    // qué hacer con este otro error
}
finally
{
    // código que se ejecuta SIEMPRE (haya error o no)
}</code></pre>
<ul>
<li><code>try</code>: bloque de código que vamos a vigilar.</li>
<li><code>catch (Tipo)</code>: se ejecuta <strong>solo</strong> si el
<code>try</code> lanza una excepción de ese tipo. Puede haber varios
<code>catch</code>.</li>
<li><code>finally</code>: <strong>se ejecuta siempre</strong>, ocurra o
no un error (útil para liberar recursos, como cerrar un fichero).</li>
<li><code>catch</code> y <code>finally</code> son opcionales, pero debe
haber al menos uno de los dos.</li>
</ul>
<p>Excepciones frecuentes en este nivel:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Excepción</th>
<th>Cuándo se produce</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>FormatException</code></td>
<td>Convertir con <code>Parse</code> un texto que no tiene formato de
número (<code>int.Parse("hola")</code>)</td>
</tr>
<tr class="even">
<td><code>OverflowException</code></td>
<td>El número no cabe en el tipo
(<code>int.Parse("99999999999")</code>)</td>
</tr>
<tr class="odd">
<td><code>DivideByZeroException</code></td>
<td><strong>División entera</strong> (o resto) entre cero</td>
</tr>
<tr class="even">
<td><code>ArgumentNullException</code></td>
<td>Pasar <code>null</code> a un método que no lo admite
(<code>int.Parse(null)</code>)</td>
</tr>
<tr class="odd">
<td><code>IndexOutOfRangeException</code></td>
<td>Acceder a una posición de un array que no existe</td>
</tr>
<tr class="even">
<td><code>IOException</code></td>
<td>Errores de entrada/salida (por ejemplo, con ficheros)</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p>Dividir un <code>double</code> entre 0 <strong>no</strong> lanza
excepción: da <code>Infinity</code> (infinito) o <code>NaN</code>.</p>
</div>
<p>En este ejemplo controlamos tres posibles errores: que el texto no
sea un número, que no quepa en un <code>int</code>, o que dividamos
entre 0:</p>
<!--ex:0-->
<p>Notas importantes:</p>
<ul>
<li>Si ponemos un <code>catch</code> general
(<code>catch (Exception)</code>), debe ir <strong>el último</strong>:
las excepciones son una jerarquía y el primer <code>catch</code>
compatible es el que se ejecuta.</li>
<li>En C# <strong>no existen las «excepciones comprobadas»</strong>: no
hay que declarar con <code>throws</code> lo que puede fallar.</li>
<li><strong><code>TryParse</code> frente a
<code>try/catch</code>:</strong> si el error es <em>esperable</em> (un
usuario que escribe mal un número), <code>TryParse</code> es más
sencillo y rápido. Reserva las excepciones para situaciones realmente
excepcionales o inesperadas.</li>
</ul>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`Console.WriteLine("Introduce un número distinto de 0:");

try
{
    string texto = Console.ReadLine() ?? "";
    int numero = int.Parse(texto);               // puede lanzar FormatException u OverflowException
    int resultado = 10 / numero;                 // puede lanzar DivideByZeroException
    Console.WriteLine($"10 / {numero} = {resultado}");
}
catch (FormatException)
{
    Console.WriteLine("No has indicado un valor numérico.");
}
catch (OverflowException)
{
    Console.WriteLine("El número es demasiado grande o demasiado pequeño.");
}
catch (DivideByZeroException)
{
    Console.WriteLine("El número no puede ser 0.");
}
finally
{
    Console.WriteLine("Fin del bloque try: este mensaje sale siempre.");
}
` },
          ],
          actividades: [
            {
              titulo: "Dividir sin que explote",
              nivel: 2,
              enunciado: r`<p>Pide <strong>dos números enteros</strong> y muestra el resultado de
<strong>dividirlos</strong>. El programa <strong>no debe
detenerse</strong> por culpa de una entrada incorrecta: gestiona los
errores con <code>try</code> / <code>catch</code>. Muestra siempre el
mensaje <code>Fin del programa</code> con un bloque
<code>finally</code>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Si el usuario escribe un texto que no es un número,
<code>int.Parse</code> lanza
<strong><code>FormatException</code></strong>.</li>
<li>Dividir un entero entre <code>0</code> lanza
<strong><code>DivideByZeroException</code></strong>.</li>
<li>Usa un <code>catch</code> distinto para cada tipo de error, con un
mensaje claro.</li>
</ul>
<p>💡 <strong>TIP:</strong> el <code>catch</code> más general
(<code>Exception</code>) va siempre el último.</p>`,
              soluciones: [
                { titulo: "Versión con try / catch / finally", nota: "Un catch por tipo de error. El finally se ejecuta haya o no excepción.", codigo: r`try
{
    Console.Write("Dividendo: ");
    int a = int.Parse(Console.ReadLine() ?? "");     // puede lanzar FormatException
    Console.Write("Divisor: ");
    int b = int.Parse(Console.ReadLine() ?? "");
    Console.WriteLine($"{a} / {b} = {a / b}");        // puede lanzar DivideByZeroException
}
catch (FormatException)
{
    Console.WriteLine("Error: has escrito un texto que no es un número entero.");
}
catch (DivideByZeroException)
{
    Console.WriteLine("Error: no se puede dividir entre 0.");
}
catch (Exception ex)                                  // cualquier otro error inesperado
{
    Console.WriteLine($"Error inesperado: {ex.Message}");
}
finally
{
    Console.WriteLine("Fin del programa");           // se ejecuta SIEMPRE
}
` },
                { titulo: "Versión profesional: TryParse y solo el catch necesario", nota: "Las excepciones son lentas y para casos excepcionales: lo que podamos comprobar antes (TryParse, un if), mejor comprobarlo.", codigo: r`Console.Write("Dividendo: ");
bool okA = int.TryParse(Console.ReadLine(), out int a);   // TryParse NO lanza excepción: devuelve false
Console.Write("Divisor: ");
bool okB = int.TryParse(Console.ReadLine(), out int b);

if (!okA || !okB)
{
    Console.WriteLine("Error: escribe dos números enteros.");
}
else
{
    try
    {
        Console.WriteLine($"{a} / {b} = {a / b}");
    }
    catch (DivideByZeroException)
    {
        Console.WriteLine("Error: no se puede dividir entre 0.");
    }
}
Console.WriteLine("Fin del programa");
` },
              ],
            },
          ],
        },
        {
          id: "depuracion",
          titulo: "Depuración de errores",
          duracion: "10 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Distinguir errores de sintaxis, de ejecución y lógicos", "Usar puntos de interrupción y ejecución paso a paso", "Inspeccionar el valor de las variables durante la ejecución"],
          teoria: r`<p>Una de las tareas principales de un programador es aprender a
<strong>detectar, entender y corregir errores</strong>: lo normal es que
un programa no funcione a la primera.</p>
<p>Hay tres tipos de errores:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Tipo</th>
<th>Cuándo aparece</th>
<th>Ejemplo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>De compilación</strong> (sintaxis o gramática)</td>
<td>Al compilar. El programa <strong>no se ejecuta</strong></td>
<td>Nombre de variable mal escrito (<code>CS0103</code>), usar una
variable sin asignar (<code>CS0165</code>), guardar un
<code>double</code> en un <code>int</code> sin cast
(<code>CS0266</code>), <code>int x = "hola";</code>
(<code>CS0029</code>)</td>
</tr>
<tr class="even">
<td><strong>De ejecución</strong> (excepciones)</td>
<td>Con el programa ya en marcha</td>
<td><code>FormatException</code>,
<code>DivideByZeroException</code></td>
</tr>
<tr class="odd">
<td><strong>Lógicos</strong></td>
<td>El programa se ejecuta sin quejarse, pero <strong>hace algo
distinto</strong> de lo que queríamos</td>
<td>Usar <code>&lt;</code> en lugar de <code>&lt;=</code>, olvidar una
vuelta de un bucle</td>
</tr>
</tbody>
</table></div>
<p>Los errores de compilación los marca el IDE en rojo y es
imprescindible corregirlos para poder ejecutar. Los <strong>errores
lógicos</strong> son los más difíciles: hay que entender cómo se va
desarrollando el flujo de ejecución. Para encontrarlos hay dos
técnicas:</p>
<ol type="1">
<li><strong>Escribir valores por consola</strong>
(<code>Console.WriteLine</code>) para ver cómo evolucionan las
variables. Es sencillo, aunque llena el código de líneas que luego hay
que borrar.</li>
<li><strong>Usar el depurador (<em>debugger</em>) del IDE</strong>, la
forma más completa: permite detener el programa en un punto, ejecutarlo
línea a línea y ver el valor de todas las variables.</li>
</ol>
<p>Herramientas básicas del depurador (Visual Studio y Visual Studio
Code usan las mismas teclas):</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Acción</th>
<th>Tecla</th>
<th>Qué hace</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Punto de interrupción</strong> (<em>breakpoint</em>)</td>
<td><code>F9</code></td>
<td>Marca una línea donde el programa se detendrá</td>
</tr>
<tr class="even">
<td><strong>Iniciar con depuración</strong></td>
<td><code>F5</code></td>
<td>Ejecuta el programa hasta el primer punto de interrupción</td>
</tr>
<tr class="odd">
<td><strong>Paso por encima</strong> (<em>step over</em>)</td>
<td><code>F10</code></td>
<td>Ejecuta la línea actual sin entrar en las funciones que llame</td>
</tr>
<tr class="even">
<td><strong>Paso al interior</strong> (<em>step into</em>)</td>
<td><code>F11</code></td>
<td>Entra dentro de la función que se llama en la línea actual</td>
</tr>
<tr class="odd">
<td><strong>Paso a la salida</strong> (<em>step out</em>)</td>
<td><code>Shift + F11</code></td>
<td>Termina la función actual y vuelve a quien la llamó</td>
</tr>
<tr class="even">
<td><strong>Continuar</strong></td>
<td><code>F5</code></td>
<td>Sigue hasta el siguiente punto de interrupción</td>
</tr>
</tbody>
</table></div>
<p>Mientras el programa está detenido, los paneles
<strong>Locales</strong> y <strong>Inspección</strong> (<em>Watch</em>)
muestran el valor de las variables, y la <strong>pila de
llamadas</strong> (<em>Call Stack</em>) muestra qué función llamó a
cuál.</p>
<p><strong>Receta de depuración:</strong></p>
<ol type="1">
<li>Reproduce el error con unos datos concretos.</li>
<li>Pon un punto de interrupción antes de donde crees que empieza el
problema.</li>
<li>Avanza línea a línea con <code>F10</code>/<code>F11</code> y compara
el valor real de cada variable con el que <strong>tú
esperas</strong>.</li>
<li>Donde difieran, ahí está el error. Corrígelo y vuelve a probar con
<strong>todos los casos</strong> (también los límites: 0, negativos,
vacío…).</li>
</ol>
<hr />
<ul>
<li>Documentación oficial de C#: <a
href="https://learn.microsoft.com/dotnet/csharp/">https://learn.microsoft.com/dotnet/csharp/</a></li>
<li>Instrucciones de selección (<code>if</code>, <code>switch</code>):
<a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/statements/selection-statements">https://learn.microsoft.com/dotnet/csharp/language-reference/statements/selection-statements</a></li>
<li>Instrucciones de iteración (<code>for</code>, <code>while</code>,
<code>foreach</code>): <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/statements/iteration-statements">https://learn.microsoft.com/dotnet/csharp/language-reference/statements/iteration-statements</a></li>
<li>Excepciones en C#: <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/exceptions/">https://learn.microsoft.com/dotnet/csharp/fundamentals/exceptions/</a></li>
<li>DotNetFiddle (compilador online de C#): <a
href="https://dotnetfiddle.net">https://dotnetfiddle.net</a></li>
</ul>`,
          ejemplos: [
          ],
          actividades: [
            {
              titulo: "Caza el error",
              nivel: 1,
              pista: "Pon un punto de interrupción en el for, pulsa F10 varias veces y mira el valor de i y de suma en la ventana de variables.",
              enunciado: r`<p>Este programa debería mostrar la <strong>suma de los números del 1 al
10</strong> (el resultado correcto es <strong>55</strong>), pero muestra
otro valor. Usa el <strong>depurador</strong> (punto de interrupción en
el <code>for</code> y ejecución paso a paso con <code>F10</code>) para
encontrar y corregir el error.</p>
<pre><code>int suma = 0;
for (int i = 1; i &lt; 10; i++)
{
    suma = suma + i;
}
Console.WriteLine($&quot;La suma es {suma}&quot;);</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Fíjate en el valor de <code>i</code> en la <strong>última
vuelta</strong> del bucle.</li>
<li>Es un error clásico de <strong>«uno de menos»</strong>
(<em>off-by-one</em>).</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "Con i < 10 el bucle se detenía cuando i valía 10 sin sumarlo: la suma era 45. Al depurar se ve que la última vuelta es la de i = 9.", codigo: r`int suma = 0;
for (int i = 1; i <= 10; i++)      // <= para que i llegue a valer 10
{
    suma = suma + i;
}
Console.WriteLine($"La suma es {suma}");   // 55
` },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================
       MÓDULO 3 · COLECCIONES
       ================================================================ */
    {
      id: "m3",
      titulo: "Arrays y matrices",
      lecciones: [
        /* ------------------------------ ARRAYS ------------------------------ */
        {
          id: "arrays",
          titulo: "Arrays (vectores)",
          duracion: "15 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Crear arrays y acceder a sus posiciones",
            "Recorrerlos con for y foreach",
            "Usar utilidades como Array.Sort, Array.Reverse y Array.IndexOf",
          ],
          teoria: r`
<p>Un <strong>array</strong> es una colección de valores <strong>del mismo tipo</strong> con un <strong>tamaño fijo</strong>, guardados uno junto a otro. Cada elemento se identifica por su <strong>índice</strong>, que empieza en <strong>0</strong>.</p>
<ul>
<li>Declaración con tamaño: <code>int[] notas = new int[5];</code> (5 posiciones, índices 0 a 4; por defecto valen 0).</li>
<li>Con valores iniciales: <code>int[] notas = { 7, 9, 5 };</code></li>
<li>Acceso: <code>notas[0]</code>. Tamaño: <code>notas.Length</code>.</li>
<li>El último índice válido es <code>Length - 1</code>.</li>
</ul>
<div class="callout warn"><strong>IndexOutOfRangeException:</strong> acceder a <code>notas[5]</code> en un array de 5 elementos es el error más común con arrays. Recuerda: de 0 a <code>Length - 1</code>.</div>
<p>Si necesitas una colección que crezca, existe <code>List&lt;T&gt;</code>; la verás en cursos posteriores.</p>`,
          ejemplos: [
            {
              titulo: "Crear y recorrer",
              codigo: r`int[] notas = new int[5];            // 5 posiciones, todas a 0
notas[0] = 7;
notas[1] = 9;
notas[2] = 5;
notas[3] = 10;
notas[4] = 6;

string[] equipos = { "Barça", "Espanyol", "Girona" };   // inicializador

for (int i = 0; i < notas.Length; i++)       // for: necesitas el índice
{
    Console.WriteLine($"notas[{i}] = {notas[i]}");
}

foreach (string equipo in equipos)           // foreach: solo necesitas el valor
{
    Console.WriteLine(equipo);
}`,
              explicacion: "Usa for cuando necesites el índice o modificar elementos; foreach cuando solo vayas a leer cada valor.",
            },
            {
              titulo: "Utilidades de la clase Array",
              codigo: r`int[] numeros = { 5, 2, 9, 1, 7 };

Array.Sort(numeros);                              // ordena: 1 2 5 7 9
Console.WriteLine(string.Join(", ", numeros));

Console.WriteLine(Array.IndexOf(numeros, 7));     // posición del 7 → 3

Array.Reverse(numeros);                           // invierte: 9 7 5 2 1
Console.WriteLine(string.Join(", ", numeros));

// numeros[5] = 1;     // ¡ERROR en ejecución! IndexOutOfRangeException`,
              explicacion: "string.Join junta los elementos con un separador, ideal para mostrar un array en una línea.",
            },
          ],
          actividades: [
            {
              titulo: "Estadísticas de notas",
              nivel: 2,
              enunciado: r`<p>Dado el array <code>{ 7, 9, 5, 10, 6 }</code>, calcula y muestra la <strong>suma</strong>, la <strong>media</strong>, la nota <strong>máxima</strong> y la <strong>mínima</strong>.</p>`,
              salida: "Suma: 37\nMedia: 7,40\nMáxima: 10 | Mínima: 5",
              pista: "Inicializa max y min con el primer elemento (notas[0]) y ve comparando con cada nota. La media es suma / Length, pero cuidado con la división entera.",
              soluciones: [
                {
                  titulo: "Versión básica: un solo recorrido",
                  codigo: r`int[] notas = { 7, 9, 5, 10, 6 };

int suma = 0;
int max = notas[0];      // partimos del primer elemento
int min = notas[0];

foreach (int nota in notas)
{
    suma += nota;
    if (nota > max) max = nota;
    if (nota < min) min = nota;
}

double media = (double)suma / notas.Length;

Console.WriteLine($"Suma: {suma}");
Console.WriteLine($"Media: {media:F2}");
Console.WriteLine($"Máxima: {max} | Mínima: {min}");`,
                  nota: "Con un solo recorrido calculamos las tres cosas. Imprescindible entender este patrón antes de usar atajos.",
                },
                {
                  titulo: "Versión profesional: LINQ",
                  codigo: r`using System.Linq;   // los métodos Sum, Average, Max y Min vienen de LINQ

int[] notas = { 7, 9, 5, 10, 6 };

Console.WriteLine($"Suma: {notas.Sum()}");
Console.WriteLine($"Media: {notas.Average():F2}");
Console.WriteLine($"Máxima: {notas.Max()} | Mínima: {notas.Min()}");`,
                  nota: "LINQ resuelve en una línea cada cálculo. Eso sí, recorre el array varias veces; para este tamaño es irrelevante, pero conviene saberlo.",
                },
              ],
            },
            {
              titulo: "Invertir un array",
              nivel: 3,
              enunciado: r`<p>Invierte el array <code>{ 1, 2, 3, 4, 5 }</code> para obtener <code>5 4 3 2 1</code>. Resuélvelo de <strong>tres formas</strong> y compáralas.</p>`,
              salida: "5 4 3 2 1",
              pista: "En la versión «en el sitio» solo hace falta recorrer la mitad del array. Intercambia el elemento i con su simétrico Length - 1 - i.",
              soluciones: [
                {
                  titulo: "1) Con un segundo array",
                  codigo: r`int[] original = { 1, 2, 3, 4, 5 };
int[] invertido = new int[original.Length];

for (int i = 0; i < original.Length; i++)
{
    invertido[original.Length - 1 - i] = original[i];
}

Console.WriteLine(string.Join(" ", invertido));`,
                  nota: "La más fácil de entender, pero gasta memoria extra para un segundo array.",
                },
                {
                  titulo: "2) Intercambiando en el sitio",
                  codigo: r`int[] datos = { 1, 2, 3, 4, 5 };

for (int i = 0; i < datos.Length / 2; i++)         // solo la mitad
{
    int temp = datos[i];
    datos[i] = datos[datos.Length - 1 - i];
    datos[datos.Length - 1 - i] = temp;
}

Console.WriteLine(string.Join(" ", datos));`,
                  nota: "Si recorrieras el array entero lo invertirías dos veces y quedaría igual. Recuerda el ejercicio de intercambiar variables.",
                },
                {
                  titulo: "3) Con Array.Reverse",
                  codigo: r`int[] datos = { 1, 2, 3, 4, 5 };

Array.Reverse(datos);

Console.WriteLine(string.Join(" ", datos));`,
                  nota: "En un proyecto real usarías esta. Practicamos las otras para entender qué hace por dentro.",
                },
              ],
            },
          ],
        },

        /* ------------------------------ MATRICES ------------------------------ */
        {
          id: "matrices",
          titulo: "Matrices (arrays bidimensionales)",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Declarar y rellenar una matriz int[,]",
            "Recorrerla con bucles anidados usando GetLength",
            "Resolver problemas con filas y columnas",
          ],
          teoria: r`
<p>Una <strong>matriz</strong> es un array con dos dimensiones: filas y columnas. Piensa en una hoja de cálculo o en el tablero de un juego.</p>
<ul>
<li>Declaración: <code>int[,] m = new int[3, 4];</code> (3 filas, 4 columnas).</li>
<li>Acceso: <code>m[fila, columna]</code>; ambos índices empiezan en 0.</li>
<li><code>m.GetLength(0)</code> son las filas y <code>m.GetLength(1)</code> las columnas.</li>
<li><code>m.Length</code> es el <strong>total</strong> de elementos (filas × columnas), no el número de filas.</li>
<li>Se recorre con <strong>dos bucles anidados</strong>: el exterior para las filas y el interior para las columnas.</li>
</ul>
<p>Todas las filas de una matriz tienen la <em>misma</em> longitud. Si necesitas filas de longitudes distintas, usa un <em>jagged array</em> (siguiente lección).</p>`,
          ejemplos: [
            {
              titulo: "Crear, rellenar y mostrar",
              codigo: r`int[,] m = new int[3, 3];
int contador = 1;

for (int f = 0; f < m.GetLength(0); f++)          // filas
{
    for (int c = 0; c < m.GetLength(1); c++)      // columnas
    {
        m[f, c] = contador++;                     // usa el valor y luego suma 1
    }
}

for (int f = 0; f < m.GetLength(0); f++)
{
    for (int c = 0; c < m.GetLength(1); c++)
    {
        Console.Write(m[f, c].ToString().PadLeft(3));   // PadLeft alinea a la derecha
    }
    Console.WriteLine();                          // salto de línea al terminar cada fila
}`,
              explicacion: "El salto de línea va después del bucle interior, no dentro: así cada fila ocupa una línea.",
            },
            {
              titulo: "Inicializador y propiedades",
              codigo: r`int[,] tablero =
{
    { 1, 0, 1 },
    { 0, 1, 0 },
    { 1, 1, 1 }
};

Console.WriteLine(tablero[1, 1]);          // fila 1, columna 1 → 1
Console.WriteLine(tablero.GetLength(0));   // 3 filas
Console.WriteLine(tablero.Length);         // 9 elementos en total`,
              explicacion: "Fíjate en que Length da 9, no 3. Para recorrer filas y columnas usa siempre GetLength.",
            },
          ],
          actividades: [
            {
              titulo: "Suma de filas y columnas",
              nivel: 2,
              enunciado: r`<p>Dada la matriz de 3 × 4:</p>
<pre class="inline-pre">{ 1,  2,  3,  4 }
{ 5,  6,  7,  8 }
{ 9, 10, 11, 12 }</pre>
<p>Muestra la suma de cada fila y de cada columna.</p>`,
              salida: "Suma fila 0: 10\nSuma fila 1: 26\nSuma fila 2: 42\nSuma columna 0: 15\nSuma columna 1: 18\nSuma columna 2: 21\nSuma columna 3: 24",
              pista: "Para sumar una fila fijas f y mueves c. Para sumar una columna fijas c y mueves f. ¿Dónde reinicias el acumulador?",
              soluciones: [
                {
                  titulo: "Versión básica: dos recorridos",
                  codigo: r`int[,] m =
{
    { 1,  2,  3,  4 },
    { 5,  6,  7,  8 },
    { 9, 10, 11, 12 }
};
int filas = m.GetLength(0);
int columnas = m.GetLength(1);

for (int f = 0; f < filas; f++)
{
    int suma = 0;                        // se reinicia en cada fila
    for (int c = 0; c < columnas; c++) suma += m[f, c];
    Console.WriteLine($"Suma fila {f}: {suma}");
}

for (int c = 0; c < columnas; c++)
{
    int suma = 0;                        // se reinicia en cada columna
    for (int f = 0; f < filas; f++) suma += m[f, c];
    Console.WriteLine($"Suma columna {c}: {suma}");
}`,
                  nota: "Es la solución más clara: un bucle para las filas y otro para las columnas.",
                },
                {
                  titulo: "Versión eficiente: un solo recorrido",
                  codigo: r`int[,] m =
{
    { 1,  2,  3,  4 },
    { 5,  6,  7,  8 },
    { 9, 10, 11, 12 }
};
int filas = m.GetLength(0);
int columnas = m.GetLength(1);

int[] sumaFilas = new int[filas];
int[] sumaColumnas = new int[columnas];

for (int f = 0; f < filas; f++)
{
    for (int c = 0; c < columnas; c++)
    {
        sumaFilas[f] += m[f, c];         // cada celda aporta a su fila...
        sumaColumnas[c] += m[f, c];      // ...y a su columna
    }
}

for (int f = 0; f < filas; f++) Console.WriteLine($"Suma fila {f}: {sumaFilas[f]}");
for (int c = 0; c < columnas; c++) Console.WriteLine($"Suma columna {c}: {sumaColumnas[c]}");`,
                  nota: "Recorremos la matriz una sola vez y guardamos los resultados en arrays auxiliares. Este patrón (acumular en arrays) es muy habitual.",
                },
              ],
            },
            {
              titulo: "Matriz transpuesta",
              nivel: 3,
              enunciado: r`<p>La transpuesta de una matriz intercambia filas y columnas. Dada la matriz de 2 × 3 <code>{ {1,2,3}, {4,5,6} }</code>, construye y muestra su transpuesta (3 × 2).</p>`,
              salida: "1 4\n2 5\n3 6",
              pista: "La nueva matriz tiene las dimensiones intercambiadas. El elemento [f, c] de la original pasa a [c, f] en la transpuesta.",
              soluciones: [
                {
                  titulo: "Solución",
                  codigo: r`int[,] original = { { 1, 2, 3 }, { 4, 5, 6 } };               // 2 x 3

int[,] transpuesta = new int[original.GetLength(1), original.GetLength(0)];   // 3 x 2

for (int f = 0; f < original.GetLength(0); f++)
{
    for (int c = 0; c < original.GetLength(1); c++)
    {
        transpuesta[c, f] = original[f, c];    // intercambiamos los índices
    }
}

for (int f = 0; f < transpuesta.GetLength(0); f++)
{
    for (int c = 0; c < transpuesta.GetLength(1); c++)
    {
        Console.Write(transpuesta[f, c] + " ");
    }
    Console.WriteLine();
}`,
                  nota: "Error típico: crear la transpuesta con las mismas dimensiones que la original (2 × 3); daría IndexOutOfRangeException.",
                },
              ],
            },
          ],
        },

        /* ------------------------------ JAGGED ARRAYS ------------------------------ */
        {
          id: "jagged-arrays",
          titulo: "Jagged arrays (arrays escalonados)",
          duracion: "12 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Entender la diferencia entre matriz e int[][]",
            "Crear arrays donde cada fila tiene una longitud distinta",
            "Recorrerlos y resolver problemas con filas irregulares",
          ],
          teoria: r`
<p>Un <strong>jagged array</strong> («array dentado» o escalonado) es un <strong>array de arrays</strong>: <code>int[][]</code>. Cada fila es un array independiente y puede tener una longitud diferente.</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Matriz <code>int[,]</code></th><th>Jagged <code>int[][]</code></th></tr></thead>
<tbody>
<tr><td>Forma</td><td>Rectangular: todas las filas igual</td><td>Irregular: cada fila su longitud</td></tr>
<tr><td>Acceso</td><td><code>m[f, c]</code></td><td><code>j[f][c]</code></td></tr>
<tr><td>Nº de filas</td><td><code>m.GetLength(0)</code></td><td><code>j.Length</code></td></tr>
<tr><td>Nº de columnas</td><td><code>m.GetLength(1)</code></td><td><code>j[f].Length</code> (distinto por fila)</td></tr>
<tr><td>Creación</td><td><code>new int[3, 4]</code></td><td><code>new int[3][]</code> y luego cada fila</td></tr>
</tbody></table></div>
<div class="callout warn"><strong>Importante:</strong> <code>new int[3][]</code> solo crea las 3 «ranuras» de filas, que valen <code>null</code>. Debes crear cada fila con <code>new int[...]</code> antes de usarla; si no, obtendrás <code>NullReferenceException</code>.</div>`,
          ejemplos: [
            {
              titulo: "Crear y recorrer",
              codigo: r`int[][] grupos = new int[3][];       // 3 filas, todavía sin crear
grupos[0] = new int[] { 8, 7 };       // fila de 2 elementos
grupos[1] = new int[] { 5, 9, 6, 10 }; // fila de 4 elementos
grupos[2] = new int[3];               // fila de 3 elementos (todos 0)

for (int i = 0; i < grupos.Length; i++)
{
    Console.Write($"Grupo {i}: ");
    for (int j = 0; j < grupos[i].Length; j++)   // longitud de CADA fila
    {
        Console.Write(grupos[i][j] + " ");
    }
    Console.WriteLine();
}`,
              explicacion: "El bucle interior usa grupos[i].Length porque la longitud cambia de una fila a otra.",
            },
            {
              titulo: "Inicializador y foreach",
              codigo: r`int[][] puntuaciones =
{
    new int[] { 10, 20 },
    new int[] { 5 },
    new int[] { 7, 8, 9 }
};

foreach (int[] fila in puntuaciones)       // cada elemento es un int[]
{
    Console.WriteLine(string.Join(", ", fila));
}`,
              explicacion: "foreach recorre las filas; para cada fila (un int[]) podemos usar de nuevo Join, otro foreach, etc.",
            },
          ],
          actividades: [
            {
              titulo: "Media por asignatura",
              nivel: 2,
              enunciado: r`<p>Cada fila contiene las notas de una asignatura, y cada asignatura tiene un número distinto de alumnos:</p>
<pre class="inline-pre">Asignatura 1: 8, 6, 7
Asignatura 2: 5, 9
Asignatura 3: 10, 7, 8, 6</pre>
<p>Muestra la media de cada asignatura.</p>`,
              salida: "Asignatura 1: media 7,00 (3 alumnos)\nAsignatura 2: media 7,00 (2 alumnos)\nAsignatura 3: media 7,75 (4 alumnos)",
              pista: "No puedes dividir siempre entre el mismo número: cada fila tiene su propio Length.",
              soluciones: [
                {
                  titulo: "Versión básica: bucles",
                  codigo: r`int[][] notas =
{
    new int[] { 8, 6, 7 },
    new int[] { 5, 9 },
    new int[] { 10, 7, 8, 6 }
};

for (int i = 0; i < notas.Length; i++)
{
    int suma = 0;
    for (int j = 0; j < notas[i].Length; j++)
    {
        suma += notas[i][j];
    }
    double media = (double)suma / notas[i].Length;
    Console.WriteLine($"Asignatura {i + 1}: media {media:F2} ({notas[i].Length} alumnos)");
}`,
                  nota: "El acumulador suma se declara dentro del bucle exterior para que se reinicie con cada asignatura.",
                },
                {
                  titulo: "Versión profesional: LINQ",
                  codigo: r`using System.Linq;

int[][] notas =
{
    new int[] { 8, 6, 7 },
    new int[] { 5, 9 },
    new int[] { 10, 7, 8, 6 }
};

for (int i = 0; i < notas.Length; i++)
{
    Console.WriteLine($"Asignatura {i + 1}: media {notas[i].Average():F2} ({notas[i].Length} alumnos)");
}`,
                  nota: "Average() recorre la fila por nosotros. Con jagged arrays, cada fila es un array normal y todas sus utilidades funcionan.",
                },
              ],
            },
            {
              titulo: "Triángulo de Pascal",
              nivel: 3,
              enunciado: r`<p>Genera las 6 primeras filas del <strong>triángulo de Pascal</strong>. Cada fila tiene un elemento más que la anterior; el primero y el último valen 1 y los demás son la suma de los dos números que tiene encima.</p>`,
              salida: "1\n1 1\n1 2 1\n1 3 3 1\n1 4 6 4 1\n1 5 10 10 5 1",
              pista: "Es el caso ideal de jagged array: la fila i tiene i + 1 elementos. El valor pascal[i][j] es pascal[i-1][j-1] + pascal[i-1][j].",
              soluciones: [
                {
                  titulo: "Solución",
                  codigo: r`int n = 6;
int[][] pascal = new int[n][];

for (int i = 0; i < n; i++)
{
    pascal[i] = new int[i + 1];          // la fila i tiene i + 1 elementos
    pascal[i][0] = 1;                    // primer elemento
    pascal[i][i] = 1;                    // último elemento

    for (int j = 1; j < i; j++)          // solo los elementos interiores
    {
        pascal[i][j] = pascal[i - 1][j - 1] + pascal[i - 1][j];
    }
}

foreach (int[] fila in pascal)
{
    Console.WriteLine(string.Join(" ", fila));
}`,
                  nota: "Si usaras una matriz tendrías muchos ceros sobrantes. Con jagged arrays cada fila ocupa exactamente lo necesario.",
                },
              ],
            },
          ],
        },
        {
          id: "arrays-referencias",
          titulo: "Arrays en funciones: referencias, copias y comparación",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Pasar arrays como parámetros y devolverlos", "Entender que un array es un tipo de referencia", "Copiar y comparar arrays correctamente"],
          teoria: r`<p>Para pasar un array como parámetro, el tipo del parámetro debe ser un
array:</p>
<pre><code>static tipoRetorno NombreFuncion(tipoValor[] nombreArray) { … }</code></pre>
<p>Y para que una función <strong>devuelva</strong> un array, se indica
en el tipo de retorno:</p>
<pre><code>static string[] GeneraArray() { … }</code></pre>
<p>El siguiente ejemplo muestra el contenido de un array con una función
y lo modifica con otra. Fíjate en el resultado:</p>
<!--ex:0-->
<p>Si, como vimos en la UF2, los parámetros se pasan por valor (se copia
el valor), ¿por qué ha cambiado el array original?</p>
<p><strong>Porque un array es un tipo de referencia.</strong> La
variable no contiene los valores del array, sino la <strong>dirección de
memoria</strong> donde están almacenados. Al pasarlo como parámetro se
copia <strong>la dirección</strong>, y entonces las dos variables
apuntan <strong>al mismo array</strong>:</p>
<pre><code>Memoria                                  Variables

[@01]  33                 ◄───────────── numero1
[@02]  44                 ◄───────────── numero2
[@89]  { 10, 20, 30 }     ◄───────────── numeros      (contiene la dirección @89)

Al pasar &#39;numeros&#39; a una función se copia la dirección @89:

[@89]  { 10, 20, 30 }     ◄───────────── numeros
                          ◄───────────── valores      (parámetro de la función: la misma dirección @89)</code></pre>
<p>Así, cualquier cambio que haga la función sobre <code>valores</code>
lo vemos también en <code>numeros</code>.</p>
<h4 id="copiar-un-array">Copiar un array</h4>
<p>¿Cómo creamos un array que contenga <strong>un duplicado</strong> de
los valores de otro? Con el método <strong><code>Clone()</code></strong>
(que devuelve un <code>object</code>, por lo que hay que hacer un
<em>cast</em> al tipo del array), con <code>Array.Copy</code> o con la
sintaxis de propagación <code>[.. array]</code> (C# 12):</p>
<!--ex:1-->
<div class="callout">
<p><code>Clone()</code> hace una copia <strong>superficial</strong>: si
el array contiene objetos, se copian las referencias, no los objetos.
Con números y textos no hay problema.</p>
</div>
<h4 id="comparar-arrays">Comparar arrays</h4>
<p>Con <code>==</code> y con <code>Equals()</code> se compara si
<strong>dos variables apuntan al mismo array</strong> (la dirección de
memoria), <strong>no si tienen el mismo contenido</strong>. Para
comparar el contenido hay que usar <code>SequenceEqual</code> de
LINQ:</p>
<!--ex:2-->
<p>Ejemplo completo: una función que clona el array para modificarlo
<strong>sin alterar el original</strong>:</p>
<!--ex:3-->`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`int[] numeros = { 3, 2, 8 };

int[] otroArray = ModificaArray(numeros);     // modificamos el array y recibimos «una copia»

MuestraArray(numeros);                        // Valores del array: 10, 2, 8   ← ¡el original ha cambiado!
MuestraArray(otroArray);                      // Valores del array: 10, 2, 8

// Muestra el contenido de un array
void MuestraArray(int[] valores)
{
    Console.WriteLine($"Valores del array: {string.Join(", ", valores)}");
}

// Modifica el primer elemento del array y lo devuelve
int[] ModificaArray(int[] valores)
{
    valores[0] = 10;
    return valores;
}
` },
            { titulo: "Ejemplo 2", codigo: r`int[] original = { 3, 2, 8 };

int[] copia1 = (int[])original.Clone();     // Clone + cast
int[] copia2 = [.. original];               // propagación (C# 12)
int[] copia3 = new int[original.Length];
Array.Copy(original, copia3, original.Length);   // copia los valores al array destino

copia1[0] = 33;                             // solo cambia la copia
Console.WriteLine(string.Join(", ", original));  // 3, 2, 8
Console.WriteLine(string.Join(", ", copia1));    // 33, 2, 8
` },
            { titulo: "Ejemplo 3", codigo: r`int[] a = { 3, 2, 8 };
int[] b = { 3, 2, 8 };

Console.WriteLine(a == b);                  // False: son dos arrays distintos en memoria
Console.WriteLine(a.Equals(b));             // False: lo mismo
Console.WriteLine(a.SequenceEqual(b));      // True: tienen los mismos valores en el mismo orden
` },
            { titulo: "Ejemplo completo: una función que clona el array para modificarlo sin alterar el original", codigo: r`int[] numeros = { 3, 2, 8 };
int[] otroArray = GeneraOtroArray(numeros);

MuestraArray(numeros);                      // Valores del array: 3, 2, 8
MuestraArray(otroArray);                    // Valores del array: 33, 2, 8
Console.WriteLine($"¿Iguales? {numeros.SequenceEqual(otroArray)}");   // ¿Iguales? False

void MuestraArray(int[] valores)
{
    Console.WriteLine($"Valores del array: {string.Join(", ", valores)}");
}

// Genera un array nuevo a partir del anterior, modificando su primer elemento
int[] GeneraOtroArray(int[] original)
{
    int[] duplicado = (int[])original.Clone();
    duplicado[0] = 33;
    return duplicado;
}
` },
          ],
          actividades: [
            {
              titulo: "¡Se ha producido un robo!",
              nivel: 1,
              enunciado: r`<p>Se ha producido un robo. Sabemos que el culpable puede ser
<strong>«Maria»</strong> o <strong>«Phil»</strong>, y que debe ser uno
de los siguientes habitantes de la ciudad: <code>"Cam"</code>,
<code>"Pepe"</code>, <code>"Kim"</code>, <code>"Phil"</code>,
<code>"Perry"</code>.</p>
<p>Ayuda a descubrir quién ha sido: crea un programa con un
<strong>array</strong> con todos los habitantes y que <strong>busque con
un bucle</strong> si Maria o Phil viven en la ciudad.</p>
<pre><code>static bool BuscaSospechoso(string sospechoso, string[] habitantes)    // true if the suspect is in the array</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>La búsqueda debe recorrer el array en una función, que devuelve
<code>true</code> si encuentra al sospechoso y <code>false</code> si
no.</li>
<li>El programa principal muestra el resultado para «Maria» y para
«Phil».</li>
</ul>
<p>💡 <strong>TIP:</strong> para comparar dos textos usa
<code>==</code>.</p>
<p>🏅 <strong>Ampliación:</strong> haz otra versión que use
<code>Array.IndexOf</code> o <code>Contains</code> en lugar del
bucle.</p>`,
              soluciones: [
                { titulo: "Solución", codigo: r`string[] habitantesCiudad = { "Cam", "Pepe", "Kim", "Phil", "Perry" };

Console.Write("¿María es la ladrona? ");
Console.WriteLine(BuscaSospechoso("Maria", habitantesCiudad));     // False

Console.Write("¿Phil es el ladrón? ");
Console.WriteLine(BuscaSospechoso("Phil", habitantesCiudad));      // True

// Recorre el array: devuelve true en cuanto encuentra al sospechoso
static bool BuscaSospechoso(string sospechoso, string[] habitantes)
{
    for (int k = 0; k < habitantes.Length; k++)
    {
        if (habitantes[k] == sospechoso)       // == compara el contenido de los textos
        {
            return true;
        }
    }
    return false;                              // si llegamos aquí, no estaba
}
` },
                { titulo: "Solución · versión con `Contains`", codigo: r`string[] habitantesCiudad = { "Cam", "Pepe", "Kim", "Phil", "Perry" };

Console.WriteLine(habitantesCiudad.Contains("Maria"));    // False
Console.WriteLine(habitantesCiudad.Contains("Phil"));     // True
` },
              ],
            },
            {
              titulo: "Nombres y apellidos",
              nivel: 2,
              enunciado: r`<p>Seguimos investigando: ahora conocemos los <strong>nombres y
apellidos</strong> de los sospechosos. Guarda los habitantes de la
ciudad en un <strong>array de dos dimensiones</strong> en el que cada
fila contenga el nombre y el apellido del habitante. Después crea
<strong>dos variables</strong>, cada una con un array de 2 posiciones
con el nombre y apellido de un sospechoso: <strong>Phil Garcia</strong>
y <strong>Kim Gimena</strong>.</p>
<p>Los habitantes son: Kim Garcia, Phil Menendez, Kim Basinger, Phil
Garcia, Perry Ornitorrinco.</p>
<pre><code>static bool BuscaSospechosoApellido(string[] sospechoso, string[,] habitantes)    // true if name and surname match a row</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>La función recorre las filas del array bidimensional y comprueba
<strong>nombre y apellido a la vez</strong>.</li>
<li>Muestra por consola si Phil Garcia y Kim Gimena viven en la
ciudad.</li>
</ul>
<p>💡 <strong>TIP:</strong> el número de filas es
<code>habitantes.GetLength(0)</code>; el nombre está en la columna 0 y
el apellido en la 1.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "---", codigo: r`string[,] habitantesCiudad =
{
    { "Kim", "Garcia" },
    { "Phil", "Menendez" },
    { "Kim", "Basinger" },
    { "Phil", "Garcia" },
    { "Perry", "Ornitorrinco" }
};

string[] sospechoso1 = { "Phil", "Garcia" };
string[] sospechoso2 = { "Kim", "Gimena" };

Console.Write("¿Phil Garcia es el ladrón? ");
Console.WriteLine(BuscaSospechosoApellido(sospechoso1, habitantesCiudad));    // True

Console.Write("¿Kim Gimena es la ladrona? ");
Console.WriteLine(BuscaSospechosoApellido(sospechoso2, habitantesCiudad));    // False

// Recorre las filas y comprueba nombre (columna 0) y apellido (columna 1)
static bool BuscaSospechosoApellido(string[] sospechoso, string[,] habitantes)
{
    for (int fila = 0; fila < habitantes.GetLength(0); fila++)
    {
        if (habitantes[fila, 0] == sospechoso[0] && habitantes[fila, 1] == sospechoso[1])
        {
            return true;
        }
    }
    return false;
}
` },
              ],
            },
          ],
        },
      ],
    },

    /* ================================================================
       MÓDULO 4 · MODULARIDAD
       ================================================================ */
    {
      id: "m4",
      titulo: "Modularidad",
      lecciones: [
        /* ------------------------------ FUNCIONES ------------------------------ */
        {
          id: "funciones",
          titulo: "Funciones",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Definir funciones con parámetros y valor de retorno",
            "Reutilizar código evitando repeticiones",
            "Conocer la forma clásica con class Program y la sobrecarga",
          ],
          teoria: r`
<p>Una <strong>función</strong> es un bloque de código con nombre que recibe unos datos (<strong>parámetros</strong>), hace un trabajo y <strong>devuelve un valor</strong> con <code>return</code>. Sirven para:</p>
<ul>
<li><strong>Reutilizar</strong> código: escribirlo una vez y usarlo muchas.</li>
<li><strong>Dividir</strong> un problema grande en partes pequeñas y fáciles de probar.</li>
<li>Dar <strong>nombre</strong> a lo que hace un trozo de código, haciéndolo más legible.</li>
</ul>
<h4>Anatomía de una función</h4>
<pre class="inline-pre">tipoDeRetorno NombreFuncion(tipo parametro1, tipo parametro2)
{
    // instrucciones
    return valor;
}</pre>
<ul>
<li>El nombre se escribe en <em>PascalCase</em> y debería ser un verbo o una pregunta: <code>CalcularArea</code>, <code>EsPrimo</code>.</li>
<li>Los parámetros se pasan <strong>por valor</strong>: la función trabaja con una copia.</li>
<li>Una variable declarada dentro de la función solo existe dentro de ella (<strong>ámbito</strong>).</li>
<li>Si el cuerpo es una sola expresión, puedes abreviar con <code>=&gt;</code>: <code>int Cuadrado(int n) =&gt; n * n;</code></li>
</ul>
<div class="callout"><strong>Dos formas de escribirlas en este curso:</strong> en los programas de instrucciones de nivel superior, las funciones se declaran como <em>funciones locales</em> (más sencillas). En proyectos con <code>class Program</code> son métodos <code>static</code>. Una diferencia importante: las funciones locales <strong>no se pueden sobrecargar</strong> (dos funciones con el mismo nombre y distintos parámetros); los métodos de una clase sí.</div>`,
          ejemplos: [
            {
              titulo: "Funciones locales (top-level)",
              codigo: r`Console.WriteLine(Suma(3, 4));              // 7
Console.WriteLine(Cuadrado(5));             // 25
string frase = CrearSaludo("Ana");
Console.WriteLine(frase);                   // ¡Hola, Ana!

// Las funciones se pueden declarar después de usarlas
int Suma(int a, int b)
{
    return a + b;
}

int Cuadrado(int n) => n * n;                       // forma abreviada
string CrearSaludo(string nombre) => $"¡Hola, {nombre}!";`,
              explicacion: "Cada función hace una sola cosa y devuelve el resultado; quien la llama decide qué hacer con él (mostrarlo, guardarlo, usarlo en otra operación…).",
            },
            {
              titulo: "Forma clásica: class Program y Main",
              codigo: r`using System;

class Program
{
    static bool EsPar(int n)
    {
        return n % 2 == 0;
    }

    static void Main()
    {
        Console.WriteLine(EsPar(4));   // True
        Console.WriteLine(EsPar(7));   // False
    }
}`,
              explicacion: "Es lo mismo que antes, pero con la estructura completa. Verás esta forma en libros, ejemplos antiguos y en proyectos más grandes.",
            },
            {
              titulo: "Sobrecarga (solo en métodos de clase)",
              codigo: r`using System;

class Program
{
    static int Area(int baseR, int altura)      // rectángulo
    {
        return baseR * altura;
    }

    static double Area(double radio)            // círculo: mismo nombre, otros parámetros
    {
        return Math.PI * radio * radio;
    }

    static void Main()
    {
        Console.WriteLine(Area(3, 4));          // 12
        Console.WriteLine(Area(2.5));           // 19,63...
    }
}`,
              explicacion: "El compilador elige la versión según el número y tipo de argumentos. Las funciones locales no permiten esto, por eso lo mostramos en la forma clásica.",
            },
          ],
          actividades: [
            {
              titulo: "Números primos",
              nivel: 2,
              enunciado: r`<p>Crea la función <code>bool EsPrimo(int numero)</code> y úsala para mostrar todos los primos del 1 al 50.</p>
<p>Recuerda: un primo es mayor que 1 y solo es divisible por 1 y por sí mismo.</p>`,
              salida: "2 3 5 7 11 13 17 19 23 29 31 37 41 43 47",
              pista: "Si encuentras un divisor entre 2 y numero - 1, ya sabes que NO es primo: puedes devolver false inmediatamente. Si terminas el bucle sin encontrar ninguno, devuelve true.",
              soluciones: [
                {
                  titulo: "Versión básica: probar todos los divisores",
                  codigo: r`for (int n = 1; n <= 50; n++)
{
    if (EsPrimo(n)) Console.Write(n + " ");
}
Console.WriteLine();

bool EsPrimo(int numero)
{
    if (numero < 2) return false;                // 0 y 1 no son primos
    for (int divisor = 2; divisor < numero; divisor++)
    {
        if (numero % divisor == 0) return false; // salida anticipada
    }
    return true;
}`,
                  nota: "Es la versión más simple. Para números grandes sería lenta porque prueba muchos divisores innecesarios.",
                },
                {
                  titulo: "Versión optimizada: hasta la raíz cuadrada",
                  codigo: r`for (int n = 1; n <= 50; n++)
{
    if (EsPrimo(n)) Console.Write(n + " ");
}
Console.WriteLine();

bool EsPrimo(int numero)
{
    if (numero < 2) return false;
    for (int divisor = 2; divisor * divisor <= numero; divisor++)   // basta llegar a √numero
    {
        if (numero % divisor == 0) return false;
    }
    return true;
}`,
                  nota: "Si un número tiene un divisor mayor que su raíz cuadrada, también tiene otro menor. Con probar hasta √n basta, y es mucho más rápido.",
                },
              ],
            },
            {
              titulo: "Factorial",
              nivel: 3,
              enunciado: r`<p>Crea la función <code>long Factorial(int numero)</code> y úsala para mostrar el factorial de un número entre 0 y 20 introducido por el usuario. Recuerda que <code>0! = 1</code> y <code>5! = 5 · 4 · 3 · 2 · 1 = 120</code>.</p>`,
              salida: "n (0-20): 5\n5! = 120",
              pista: "Hay dos maneras de pensarlo: multiplicando en un bucle, o definiéndolo en función de sí mismo: n! = n · (n-1)!",
              soluciones: [
                {
                  titulo: "Versión iterativa (con bucle)",
                  codigo: r`Console.Write("n (0-20): ");
int n = int.Parse(Console.ReadLine() ?? "0");
Console.WriteLine($"{n}! = {Factorial(n)}");

long Factorial(int numero)
{
    long resultado = 1;                       // long: 20! no cabe en un int
    for (int i = 2; i <= numero; i++)
    {
        resultado *= i;
    }
    return resultado;
}`,
                  nota: "Funciona también para 0 y 1 porque el bucle ni siquiera se ejecuta y devuelve 1.",
                },
                {
                  titulo: "Versión recursiva",
                  codigo: r`Console.Write("n (0-20): ");
int n = int.Parse(Console.ReadLine() ?? "0");
Console.WriteLine($"{n}! = {Factorial(n)}");

long Factorial(int numero) => numero <= 1 ? 1 : numero * Factorial(numero - 1);`,
                  nota: "Una función recursiva se llama a sí misma. Siempre necesita un caso base (aquí numero <= 1) para no repetirse infinitamente. Elegante, pero más difícil de depurar; en este caso la versión con bucle es igual de buena.",
                },
              ],
            },
          ],
        },

        /* ------------------------------ PROCEDIMIENTOS ------------------------------ */
        {
          id: "procedimientos",
          titulo: "Procedimientos",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: [
            "Distinguir función y procedimiento (void)",
            "Entender el paso de parámetros por valor y por referencia (ref)",
            "Organizar un programa en procedimientos, por ejemplo un menú",
          ],
          teoria: r`
<p>Un <strong>procedimiento</strong> es una función que <strong>no devuelve ningún valor</strong>: su tipo de retorno es <code>void</code>. Se usa para <em>hacer algo</em> (mostrar un menú, dibujar, modificar datos) en lugar de <em>calcular algo</em>.</p>
<div class="table-wrap"><table>
<thead><tr><th></th><th>Función</th><th>Procedimiento</th></tr></thead>
<tbody>
<tr><td>Retorno</td><td>Un valor (<code>int</code>, <code>string</code>…)</td><td><code>void</code> (nada)</td></tr>
<tr><td>Se usa para</td><td>Calcular y devolver</td><td>Ejecutar una acción</td></tr>
<tr><td>Ejemplo</td><td><code>int Suma(int a, int b)</code></td><td><code>void MostrarMenu()</code></td></tr>
</tbody></table></div>
<h4>Paso de parámetros</h4>
<ul>
<li><strong>Por valor</strong> (por defecto): la función recibe una <em>copia</em>; cambiarla no afecta a la variable original.</li>
<li><strong>Por referencia</strong> con <code>ref</code>: se pasa la propia variable, y los cambios sí se ven fuera. Hay que escribir <code>ref</code> en la declaración y en la llamada.</li>
<li><strong>Arrays:</strong> lo que se copia es la <em>referencia</em> al array, así que un procedimiento puede modificar sus elementos y el cambio se ve fuera.</li>
</ul>
<p>Una buena práctica es que el programa principal se lea como un guion: <code>MostrarMenu(); LeerOpcion(); ...</code> y cada detalle viva en su propio procedimiento.</p>`,
          ejemplos: [
            {
              titulo: "Un procedimiento con parámetro",
              codigo: r`MostrarBienvenida("Ana");
MostrarBienvenida("1r DAM");        // reutilizamos el mismo código

void MostrarBienvenida(string quien)
{
    Console.WriteLine("==============");
    Console.WriteLine($"Bienvenido/a, {quien}");
    Console.WriteLine("==============");
}`,
              explicacion: "No hay return con valor: el procedimiento imprime directamente. Cada llamada produce el mismo «cartel» con otro nombre.",
            },
            {
              titulo: "Por valor frente a ref",
              codigo: r`int vidas = 3;

PerderVida(vidas);                 // se pasa una COPIA
Console.WriteLine(vidas);          // 3: no ha cambiado

PerderVidaRef(ref vidas);          // se pasa la PROPIA variable
Console.WriteLine(vidas);          // 2: sí ha cambiado

void PerderVida(int v)
{
    v--;                           // solo cambia la copia local
}

void PerderVidaRef(ref int v)
{
    v--;                           // cambia la variable original
}`,
              explicacion: "Fíjate en que ref aparece tanto en la declaración como en la llamada. Úsalo con moderación: suele ser mejor devolver el valor con una función.",
            },
            {
              titulo: "Los arrays se modifican «desde dentro»",
              codigo: r`int[] puntos = { 10, 20, 30 };

DuplicarPuntos(puntos);
Console.WriteLine(string.Join(", ", puntos));   // 20, 40, 60

void DuplicarPuntos(int[] datos)
{
    for (int i = 0; i < datos.Length; i++)
    {
        datos[i] *= 2;             // modifica el array original
    }
}`,
              explicacion: "No hace falta ref porque se copia la referencia al array, no sus elementos. Los dos nombres (puntos y datos) apuntan al mismo array.",
            },
          ],
          actividades: [
            {
              titulo: "Dibujar rectángulos",
              nivel: 2,
              enunciado: r`<p>Crea el procedimiento <code>void DibujarRectangulo(int ancho, int alto, char relleno)</code> que dibuje un rectángulo relleno con el carácter indicado. Llámalo dos veces con distintos parámetros.</p>`,
              salida: "*****\n*****\n*****\n\n########\n########",
              pista: "Necesitas dos bucles: uno por cada fila y otro por cada carácter de la fila. No olvides el salto de línea al terminar cada fila.",
              soluciones: [
                {
                  titulo: "Versión básica: bucles anidados",
                  codigo: r`DibujarRectangulo(5, 3, '*');
Console.WriteLine();
DibujarRectangulo(8, 2, '#');

void DibujarRectangulo(int ancho, int alto, char relleno)
{
    for (int fila = 0; fila < alto; fila++)
    {
        for (int col = 0; col < ancho; col++)
        {
            Console.Write(relleno);
        }
        Console.WriteLine();       // fin de la fila
    }
}`,
                  nota: "Es la solución que debes saber hacer sin ayuda: el bucle exterior controla el alto y el interior el ancho.",
                },
                {
                  titulo: "Versión compacta: new string(...)",
                  codigo: r`DibujarRectangulo(5, 3, '*');
Console.WriteLine();
DibujarRectangulo(8, 2, '#');

void DibujarRectangulo(int ancho, int alto, char relleno)
{
    string linea = new string(relleno, ancho);   // repite el carácter 'ancho' veces
    for (int fila = 0; fila < alto; fila++)
    {
        Console.WriteLine(linea);
    }
}`,
                  nota: "Construimos la línea una sola vez y la imprimimos varias. Menos bucles, mismo resultado.",
                },
              ],
            },
            {
              titulo: "Menú de opciones",
              nivel: 3,
              enunciado: r`<p>Crea un programa con un menú que se repita hasta que el usuario elija salir:</p>
<ol><li>Saludar (pide un nombre y lo saluda)</li><li>Sumar dos números</li><li>Salir (<code>0</code>)</li></ol>
<p>Cada opción debe ser un <strong>procedimiento</strong>. El programa principal solo debe mostrar el menú, leer la opción y decidir a cuál llamar.</p>`,
              salida: "=== MENÚ ===\n1. Saludar\n2. Sumar dos números\n0. Salir\nElige una opción: 2\nPrimer número: 4\nSegundo número: 5\n4 + 5 = 9\n...",
              pista: "El menú debe aparecer al menos una vez, así que do-while encaja perfectamente. Para decidir la acción usa switch.",
              soluciones: [
                {
                  titulo: "Versión básica",
                  codigo: r`int opcion;
do
{
    MostrarMenu();
    if (!int.TryParse(Console.ReadLine(), out opcion)) opcion = -1;   // texto no numérico → opción inválida

    switch (opcion)
    {
        case 1: Saludar(); break;
        case 2: SumarDosNumeros(); break;
        case 0: Console.WriteLine("¡Hasta pronto!"); break;
        default: Console.WriteLine("Opción no válida"); break;
    }
} while (opcion != 0);

void MostrarMenu()
{
    Console.WriteLine();
    Console.WriteLine("=== MENÚ ===");
    Console.WriteLine("1. Saludar");
    Console.WriteLine("2. Sumar dos números");
    Console.WriteLine("0. Salir");
    Console.Write("Elige una opción: ");
}

void Saludar()
{
    Console.Write("¿Cómo te llamas? ");
    string nombre = Console.ReadLine() ?? "";
    Console.WriteLine($"¡Hola, {nombre}!");
}

void SumarDosNumeros()
{
    Console.Write("Primer número: ");
    int a = int.Parse(Console.ReadLine() ?? "0");
    Console.Write("Segundo número: ");
    int b = int.Parse(Console.ReadLine() ?? "0");
    Console.WriteLine($"{a} + {b} = {a + b}");
}`,
                  nota: "El programa principal se lee como un guion. Aún falla si en SumarDosNumeros escribes texto: eso lo arregla la versión siguiente.",
                },
                {
                  titulo: "Versión profesional: función auxiliar LeerEntero",
                  codigo: r`int opcion;
do
{
    MostrarMenu();
    opcion = LeerEntero("Elige una opción: ");

    switch (opcion)
    {
        case 1: Saludar(); break;
        case 2: SumarDosNumeros(); break;
        case 0: Console.WriteLine("¡Hasta pronto!"); break;
        default: Console.WriteLine("Opción no válida"); break;
    }
} while (opcion != 0);

void MostrarMenu()
{
    Console.WriteLine();
    Console.WriteLine("=== MENÚ ===");
    Console.WriteLine("1. Saludar");
    Console.WriteLine("2. Sumar dos números");
    Console.WriteLine("0. Salir");
}

void Saludar()
{
    Console.Write("¿Cómo te llamas? ");
    string nombre = Console.ReadLine() ?? "";
    Console.WriteLine($"¡Hola, {nombre}!");
}

void SumarDosNumeros()
{
    int a = LeerEntero("Primer número: ");
    int b = LeerEntero("Segundo número: ");
    Console.WriteLine($"{a} + {b} = {a + b}");
}

// Función reutilizable: repite la pregunta hasta que se escribe un entero válido
int LeerEntero(string mensaje)
{
    int valor;
    Console.Write(mensaje);
    while (!int.TryParse(Console.ReadLine(), out valor))
    {
        Console.Write("Valor no válido. " + mensaje);
    }
    return valor;
}`,
                  nota: "Combina lo aprendido: un procedimiento (MostrarMenu) y una función (LeerEntero) reutilizada en tres sitios. Si mañana cambias cómo se valida un número, solo lo cambias en un lugar.",
                },
              ],
            },
          ],
        },
        {
          id: "parametros",
          titulo: "Parámetros: por valor, ref, out, opcionales y con nombre",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Diferenciar el paso de parámetros por valor y por referencia", "Usar ref y out", "Definir parámetros opcionales y llamar con argumentos con nombre"],
          teoria: r`<p>C# permite dar un <strong>valor por defecto</strong> a un parámetro:
si al llamar no se indica, se usa ese valor. Además, al llamar podemos
poner el <strong>nombre</strong> del parámetro y así el orden deja de
importar:</p>
<!--ex:0-->
<p>Los parámetros opcionales deben ir <strong>al final</strong> de la
lista de parámetros.</p>
<h4 id="124-paso-de-parámetros-por-valor-o-por-referencia">1.2.4 Paso de
parámetros por valor o por referencia</h4>
<p>Es muy común preguntarse: <em>cuando paso un parámetro, ¿estoy
pasando la variable o su valor?</em></p>
<p><strong>Por defecto, C# pasa los parámetros por valor</strong>: la
función recibe una <strong>copia</strong> del valor. Por eso, modificar
el parámetro dentro de la función <strong>no cambia</strong> la variable
original, aunque se llamen igual.</p>
<p>Este código muestra por consola <code>Mensaje: 0</code> dos
veces:</p>
<!--ex:1-->
<p>¿Y si queremos que la función modifique la variable original? Hay dos
caminos:</p>
<p><strong>Camino 1: devolver un valor</strong> y asignarlo (lo veremos
en el apartado 1.3).</p>
<p><strong>Camino 2: pasar la variable por referencia con
<code>ref</code>.</strong> Hay que escribir <code>ref</code> tanto al
declarar el parámetro como al llamar a la función:</p>
<!--ex:2-->
<p>Existe también el modificador <strong><code>out</code></strong>: la
función <strong>tiene que asignar</strong> un valor al parámetro antes
de terminar, y así puede «devolver» información adicional. Es lo que
hace <code>int.TryParse</code>:</p>
<!--ex:3-->
<div class="callout">
<p><strong>Tipos de valor y tipos de referencia.</strong> Cuando el
parámetro es un tipo de <strong>referencia</strong> (por ejemplo, un
array), lo que se copia es la <em>referencia</em>: la función y quien la
llama apuntan <strong>al mismo objeto</strong>, así que sí pueden
modificar su contenido. Lo veremos al trabajar con arrays y objetos.</p>
<pre><code>int[] puntos = { 10, 20, 30 };
Duplicar(puntos);
Console.WriteLine(string.Join(&quot;, &quot;, puntos));     // 20, 40, 60

void Duplicar(int[] valores)
{
    for (int i = 0; i &lt; valores.Length; i++)
    {
        valores[i] *= 2;        // modifica el array original
    }
}</code></pre>
</div>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`Saluda();                                      // Hola, invitado
Saluda("Ana");                                 // Hola, Ana
Saluda(saludo: "Buenas", nombre: "Link");      // Buenas, Link  (argumentos con nombre)

void Saluda(string nombre = "invitado", string saludo = "Hola")
{
    Console.WriteLine($"{saludo}, {nombre}");
}
` },
            { titulo: "Este código muestra por consola Mensaje: 0 dos veces", noRun: true, codigo: r`class Program
{
    static void Main()
    {
        int contador = 0;
        MiFuncion(contador);
        MiFuncion(contador);
    }

    static void MiFuncion(int contador)         // este 'contador' es una copia: otra variable distinta
    {
        Console.WriteLine($"Mensaje: {contador}");
        contador++;                             // solo cambia la copia
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`int vidas = 3;

PerderVidaCopia(vidas);          // se pasa una COPIA
Console.WriteLine(vidas);        // 3: no ha cambiado

PerderVidaRef(ref vidas);        // se pasa la PROPIA variable
Console.WriteLine(vidas);        // 2: sí ha cambiado

void PerderVidaCopia(int v)
{
    v--;                         // solo cambia la copia local
}

void PerderVidaRef(ref int v)
{
    v--;                         // cambia la variable original
}
` },
            { titulo: "Ejemplo 4", codigo: r`if (TryDividir(10, 2, out int cociente))
{
    Console.WriteLine($"10 / 2 = {cociente}");          // 10 / 2 = 5
}

if (!TryDividir(10, 0, out _))                           // _ significa «no me interesa este valor»
{
    Console.WriteLine("No se puede dividir entre cero");
}

bool TryDividir(int a, int b, out int resultado)
{
    if (b == 0)
    {
        resultado = 0;           // un parámetro out siempre debe quedar asignado
        return false;
    }

    resultado = a / b;
    return true;
}
` },
          ],
          actividades: [
            {
              titulo: "Intercambia dos variables con ref",
              nivel: 2,
              enunciado: r`<p>Escribe un procedimiento
<strong><code>Intercambia(ref int a, ref int b)</code></strong> que
<strong>intercambie</strong> el valor de dos variables enteras. Después
comprueba que funciona en el programa principal.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Sin <code>ref</code>, la función recibiría <strong>copias</strong> y
el intercambio no se vería fuera.</li>
<li>Al llamarla hay que escribir también <code>ref</code> delante de
cada argumento.</li>
</ul>
<p>💡 <strong>TIP:</strong> necesitas una variable auxiliar... o una
deconstrucción de tuplas.</p>`,
              soluciones: [
                { titulo: "Versión básica: variable auxiliar", codigo: r`int x = 3;
int y = 8;
Console.WriteLine($"Antes: x={x}, y={y}");

Intercambia(ref x, ref y);                      // ref también en la llamada
Console.WriteLine($"Después: x={x}, y={y}");    // x=8, y=3

void Intercambia(ref int a, ref int b)
{
    int auxiliar = a;
    a = b;
    b = auxiliar;
}
` },
                { titulo: "Versión profesional: tupla", codigo: r`int x = 3;
int y = 8;
Intercambia(ref x, ref y);
Console.WriteLine($"x={x}, y={y}");             // x=8, y=3

void Intercambia(ref int a, ref int b)
{
    (a, b) = (b, a);                             // deconstrucción de tuplas: sin variable auxiliar
}
` },
              ],
            },
            {
              titulo: "TryDividir con out",
              nivel: 2,
              enunciado: r`<p>Escribe una función
<strong><code>bool TryDividir(int a, int b, out int resultado)</code></strong>
que <strong>devuelva <code>true</code> y el resultado</strong> si se
puede dividir, o <strong><code>false</code></strong> si <code>b</code>
vale 0. Es el mismo patrón que <code>int.TryParse</code>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Un parámetro <code>out</code> <strong>debe recibir valor</strong>
dentro de la función en todos los caminos.</li>
<li>Al llamarla se escribe <code>out int resultado</code> para declarar
la variable en el mismo sitio.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", codigo: r`if (TryDividir(10, 2, out int resultado))
{
    Console.WriteLine($"10 / 2 = {resultado}");      // 5
}

if (!TryDividir(7, 0, out int otro))
{
    Console.WriteLine("No se puede dividir entre 0");  // 'otro' vale 0 (el valor que le dimos)
}

bool TryDividir(int a, int b, out int resultado)
{
    if (b == 0)
    {
        resultado = 0;          // en todos los caminos hay que asignar el parámetro out
        return false;
    }
    resultado = a / b;
    return true;
}
` },
              ],
            },
          ],
        },
        {
          id: "retorno-valores",
          titulo: "Retorno de valores y tuplas",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Devolver valores con return", "Devolver varios valores con tuplas", "Escribir funciones con cuerpo de expresión"],
          teoria: r`<p>A veces una función genera un valor que queremos recuperar. Para eso,
al definirla indicamos <strong>qué tipo de valor devuelve</strong>,
justo <strong>delante del nombre</strong>, y dentro de ella usamos
<code>return</code> seguido del valor.</p>
<p>Reglas importantes:</p>
<ul>
<li>Una función solo puede devolver <strong>un mismo tipo</strong> de
valor (<code>int</code>, <code>string</code>, <code>bool</code>…) y está
<strong>obligada</strong> a devolver un valor de ese tipo <strong>por
todos sus caminos</strong>.</li>
<li>Si no devuelve nada, se declara con
<strong><code>void</code></strong>; en ese caso no hace falta
<code>return</code>, aunque se puede escribir <code>return;</code> (sin
valor) para terminar antes, incluso varias veces.</li>
<li>Cuando se ejecuta un <code>return</code>, <strong>la función
termina</strong> y el programa continúa donde se la llamó.</li>
</ul>
<!--ex:0-->
<p>Este ejemplo define una función que devuelve uno de <strong>tres
posibles mensajes</strong> según el parámetro. Fíjate en que
<code>Main</code> <strong>usa</strong> el valor devuelto (en este caso,
lo muestra):</p>
<!--ex:1-->
<p>Si olvidamos algún camino, el compilador avisa con el error
<strong><code>CS0161: not all code paths return a value</code></strong>:</p>
<!--ex:2-->
<p><strong>Funciones de una sola expresión.</strong> Cuando la función
solo calcula y devuelve un valor, se puede escribir de forma abreviada
con <code>=&gt;</code>:</p>
<!--ex:3-->
<p><strong>Devolver varios valores con una tupla.</strong> Una función
puede devolver varios valores agrupados en una <strong>tupla</strong> y
quien la llama puede «deconstruirla» en variables:</p>
<!--ex:4-->
<p><strong>Documentar una función.</strong> Antes de la función podemos
escribir un comentario <code>///</code> con etiquetas XML. El IDE lo
muestra como ayuda cada vez que la usamos:</p>
<!--ex:5-->`,
          ejemplos: [
            { titulo: "- Cuando se ejecuta un return, la función termina y el programa continúa donde se la llamó", codigo: r`// Una función void NO devuelve nada
void Anuncia(int contador)
{
    if (contador > 4)
    {
        return;                              // sale de la función sin devolver nada
    }
    Console.WriteLine($"Contador: {contador}");
}

// Una función con tipo de retorno int
int ValorFijo()
{
    return 33;
}
` },
            { titulo: "Ejemplo 2", codigo: r`Console.WriteLine(ComparaCon5(10));      // es mayor que 5
Console.WriteLine(ComparaCon5(4));       // es menor que 5
Console.WriteLine(ComparaCon5(5));       // es igual a 5

string ComparaCon5(int numero)
{
    if (numero > 5)
    {
        return "es mayor que 5";
    }
    else if (numero < 5)
    {
        return "es menor que 5";
    }
    else
    {
        return "es igual a 5";
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`string Clasifica(int n)
{
    if (n > 0)
    {
        return "positivo";
    }
    // ❌ CS0161: si n <= 0 la función no devuelve nada
}
` },
            { titulo: "Ejemplo 4", codigo: r`Console.WriteLine(Cuadrado(5));          // 25

int Cuadrado(int n) => n * n;
` },
            { titulo: "Ejemplo 5", codigo: r`var (cociente, resto) = Dividir(17, 5);
Console.WriteLine($"17 / 5 = {cociente} y sobran {resto}");     // 17 / 5 = 3 y sobran 2

(int cociente, int resto) Dividir(int a, int b)
{
    return (a / b, a % b);
}
` },
            { titulo: "Ejemplo 6", codigo: r`/// <summary>
/// Calcula el área de un rectángulo.
/// </summary>
/// <param name="ancho">Ancho del rectángulo.</param>
/// <param name="alto">Alto del rectángulo.</param>
/// <returns>El área (ancho × alto).</returns>
static double AreaRectangulo(double ancho, double alto) => ancho * alto;
` },
          ],
          actividades: [
            {
              titulo: "Pidiendo valores",
              nivel: 2,
              enunciado: r`<p>Escribe un programa de nombre <code>PidiendoValores</code> que llame
a una <strong>función encargada de pedir un número entero superior a
0</strong>. Si el usuario escribe un valor incorrecto, <strong>vuelve a
pedirlo</strong>. Cuando el usuario escribe un valor correcto, la
función <strong>devuelve ese número</strong> y es el programa principal
el que <strong>lo muestra</strong>.</p>
<pre><code>static int GetEnteroSuperior0()            // asks until the user types an integer &gt; 0 and returns it</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><strong>Control de errores:</strong> un texto que no es un número o
un número menor o igual que 0 deben provocar un aviso y volver a pedir
el dato.</li>
<li>El <code>do-while</code> debe tener la condición de salida visible
en su cabecera.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>int.TryParse(texto, out int n)</code>
devuelve <code>false</code> si el texto no es un entero.</p>
<p>🥉 <strong>Alternativa más sencilla:</strong> hazlo con
<code>int.Parse</code> y un <code>try/catch</code> que capture
<code>FormatException</code>.</p>`,
              soluciones: [
                { titulo: "Solución · versión con `TryParse` (recomendada)", codigo: r`int num = GetEnteroSuperior0();                       // la función se encarga de pedir y validar
Console.WriteLine($"Número > 0: {num}");              // el programa principal muestra el resultado

static int GetEnteroSuperior0()
{
    int numero;
    bool esValido;

    do
    {
        Console.Write("Introduce un número > 0: ");
        // TryParse evita excepciones; además comprobamos que sea mayor que 0
        esValido = int.TryParse(Console.ReadLine(), out numero) && numero > 0;

        if (!esValido)
        {
            Console.WriteLine("Valor no válido: debe ser un número entero mayor que 0.");
        }
    } while (!esValido);                              // repetimos mientras NO sea válido

    return numero;
}
` },
                { titulo: "Solución · versión con `try/catch`", nota: "---", codigo: r`int num = GetEnteroSuperior0();
Console.WriteLine($"Número > 0: {num}");

static int GetEnteroSuperior0()
{
    int numero = 0;                                   // 0 no es válido: obliga a entrar al bucle

    do
    {
        Console.Write("Introduce un número > 0: ");
        try
        {
            numero = int.Parse(Console.ReadLine() ?? "");
        }
        catch (FormatException)
        {
            Console.WriteLine("Debes introducir un valor numérico.");
        }
        catch (OverflowException)
        {
            Console.WriteLine("El número es demasiado grande.");
        }
    } while (numero < 1);

    return numero;
}
` },
              ],
            },
            {
              titulo: "Mínimo y máximo con una tupla",
              nivel: 2,
              enunciado: r`<p>Escribe una función
<strong><code>(int minimo, int maximo) MinMax(int[] numeros)</code></strong>
que devuelva <strong>a la vez</strong> el menor y el mayor valor de un
array. Pruébala con <code>{ 7, 3, 9, 1, 5 }</code>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Una <strong>tupla</strong> permite devolver varios valores sin usar
<code>out</code>.</li>
<li>Recorre el array <strong>una sola vez</strong>.</li>
</ul>
<p>💡 <strong>TIP:</strong> inicializa <code>minimo</code> y
<code>maximo</code> con el primer elemento del array.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Con LINQ sería (numeros.Min(), numeros.Max()), pero recorre el array dos veces.", codigo: r`int[] notas = { 7, 3, 9, 1, 5 };
var (menor, mayor) = MinMax(notas);                  // deconstruimos la tupla en dos variables
Console.WriteLine($"Menor: {menor}, mayor: {mayor}");   // Menor: 1, mayor: 9

(int minimo, int maximo) MinMax(int[] numeros)
{
    int min = numeros[0];
    int max = numeros[0];
    for (int i = 1; i < numeros.Length; i++)
    {
        if (numeros[i] < min) { min = numeros[i]; }
        if (numeros[i] > max) { max = numeros[i]; }
    }
    return (min, max);
}
` },
              ],
            },
          ],
        },
        {
          id: "recursividad",
          titulo: "Recursividad",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender qué es una función recursiva", "Identificar el caso base y el caso recursivo", "Seguir la ejecución de una función recursiva paso a paso"],
          teoria: r`<p>La <strong>recursividad</strong> es una técnica de programación en la
que <strong>una función se llama a sí misma</strong>. Esto produce un
efecto de bucle que se repetiría eternamente si no lo detenemos. Por eso
toda función recursiva necesita un <strong>caso base</strong>: una
condición que <strong>detiene</strong> las llamadas.</p>
<p>Esta función recursiva <strong>nunca termina</strong>, porque no
tiene caso base:</p>
<!--ex:0-->
<p>Cada llamada ocupa memoria en la <strong>pila de llamadas</strong>.
Cuando se agota, el programa se detiene con un error
<code>StackOverflowException</code>, que <strong>no se puede
capturar</strong> con <code>try/catch</code>. Esta, en cambio, se llama
a sí misma solo mientras <code>numero &lt; 10</code>:</p>
<!--ex:1-->
<p>La recursividad es una técnica <strong>menos eficiente</strong> que
los bucles (cada llamada consume memoria), pero a veces resulta
<strong>más sencilla de programar y de entender</strong>. La alternativa
es la <strong>iteración</strong> (los bucles <code>for</code>,
<code>while</code>…), con la que hemos trabajado hasta ahora.</p>
<p><strong>Ejemplo clásico: el factorial.</strong>
<code>n! = n × (n−1) × … × 1</code>, con <code>0! = 1! = 1</code>. Se
define a partir de sí mismo: <code>n! = n × (n−1)!</code>.</p>
<!--ex:2-->
<div class="callout">
<p>El factorial crece muy rápido: con <code>long</code>, el máximo es
<code>20!</code>. Con valores mayores el resultado «da la vuelta» por
desbordamiento.</p>
</div>
<p><strong>Funciones recursivas con valor de retorno.</strong> Los
valores que devuelven las llamadas <strong>no se obtienen hasta que la
recursividad se detiene</strong>. Por eso el siguiente programa muestra
primero los mensajes anteriores a la llamada recursiva
(<code>numero++</code>) y, cuando se llega al caso base, los mensajes de
después (<code>return numero</code>), tantas veces como llamadas se
hicieron:</p>
<!--ex:3-->
<p>Salida:</p>
<pre><code>numero++: 1
numero++: 2
numero++: 3
return numero: 3
return numero: 3
return numero: 3</code></pre>
<hr />
<ul>
<li>Métodos en C#: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/methods">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/methods</a></li>
<li>Funciones locales: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/local-functions">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/local-functions</a></li>
<li>Comentarios de documentación XML: <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/xmldoc/">https://learn.microsoft.com/dotnet/csharp/language-reference/xmldoc/</a></li>
</ul>`,
          ejemplos: [
            { titulo: "Esta función recursiva nunca termina, porque no tiene caso base", codigo: r`static void RecursivaInfinita(int numero)
{
    numero++;
    Console.WriteLine(numero);
    RecursivaInfinita(numero);       // ⚠️ se llama a sí misma sin condición de parada
}
` },
            { titulo: "Ejemplo 2", codigo: r`RecursivaFinita(0);                  // muestra del 1 al 10

static void RecursivaFinita(int numero)
{
    numero++;
    Console.WriteLine(numero);
    if (numero < 10)                 // caso base: cuando deja de cumplirse, no hay más llamadas
    {
        RecursivaFinita(numero);
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`Console.WriteLine(Factorial(5));           // 120
Console.WriteLine(FactorialIterativo(5));  // 120

// Versión recursiva: el caso base es n <= 1
long Factorial(int n)
{
    if (n <= 1)
    {
        return 1;
    }
    return n * Factorial(n - 1);           // n! = n × (n-1)!
}

// Versión iterativa: la misma idea con un bucle
long FactorialIterativo(int n)
{
    long resultado = 1;
    for (int i = 2; i <= n; i++)
    {
        resultado *= i;
    }
    return resultado;
}
` },
            { titulo: "Ejemplo 4", codigo: r`RecursivaRetornaValor(0);

static int RecursivaRetornaValor(int numero)
{
    numero++;
    Console.WriteLine($"numero++: {numero}");
    if (numero < 3)
    {
        numero = RecursivaRetornaValor(numero);      // la llamada recursiva
    }
    Console.WriteLine($"return numero: {numero}");
    return numero;
}
` },
          ],
          actividades: [
            {
              titulo: "Contando con recursividad",
              nivel: 2,
              enunciado: r`<p>Escribe un programa de nombre <code>Recursividad</code> que
<strong>imprima los valores del 0 al 20</strong> utilizando una
<strong>función recursiva</strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>La función debe ser recursiva: no se permiten bucles.</li>
<li>Define un <strong>caso base</strong> que detenga las llamadas.</li>
</ul>
<pre><code>static void ImprimeHastaEl20(int num)      // prints from num up to 20, recursively</code></pre>
<p>💡 <strong>TIP:</strong> en cada llamada, imprime el valor y vuelve a
llamar a la función con <code>num + 1</code> mientras no llegues al
20.</p>
<p>🏅 <strong>Ampliación:</strong> haz otra versión que cuente
<strong>hacia atrás</strong> del 20 al 0.</p>`,
              soluciones: [
                { titulo: "Solución", codigo: r`ImprimeHastaEl20(0);                          // empezamos contando desde 0

static void ImprimeHastaEl20(int num)
{
    Console.WriteLine(num);                   // mostramos el número actual
    if (num < 20)                             // caso base: al llegar a 20 ya no hay más llamadas
    {
        ImprimeHastaEl20(num + 1);            // llamada recursiva con el siguiente número
    }
}
` },
              ],
            },
            {
              titulo: "Potencia recursiva",
              nivel: 2,
              enunciado: r`<p>Escribe una función recursiva
<strong><code>int Potencia(int baseNum, int exponente)</code></strong>
que calcule <code>baseNum</code> elevado a <code>exponente</code>
(exponente ≥ 0) <strong>sin usar bucles ni
<code>Math.Pow</code></strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><strong>Caso base:</strong> cualquier número elevado a 0 vale
1.</li>
<li><strong>Caso recursivo:</strong>
<code>b^n = b * b^(n-1)</code>.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", codigo: r`Console.WriteLine(Potencia(2, 10));     // 1024
Console.WriteLine(Potencia(5, 0));      // 1

int Potencia(int baseNum, int exponente)
{
    if (exponente == 0)
    {
        return 1;                                   // caso base: detiene las llamadas
    }
    return baseNum * Potencia(baseNum, exponente - 1);   // caso recursivo: el problema es más pequeño
}
` },
              ],
            },
            {
              titulo: "Fibonacci",
              nivel: 3,
              enunciado: r`<p>La sucesión de <strong>Fibonacci</strong> empieza con 0 y 1, y cada
término es la suma de los dos anteriores: 0, 1, 1, 2, 3, 5, 8, 13…
Escribe <strong><code>int Fibonacci(int n)</code></strong> de forma
<strong>recursiva</strong> y muestra los 10 primeros términos.</p>
<p>🏅 <strong>Ampliación:</strong> haz otra versión
<strong>iterativa</strong> (con <code>for</code>) y compara cuál es más
rápida con <code>n = 40</code>.</p>`,
              soluciones: [
                { titulo: "Versión recursiva", nota: "Muy clara, pero repite muchísimos cálculos: con n = 40 ya tarda varios segundos.", codigo: r`for (int i = 0; i < 10; i++)
{
    Console.Write(Fibonacci(i) + " ");     // 0 1 1 2 3 5 8 13 21 34
}
Console.WriteLine();

int Fibonacci(int n)
{
    if (n < 2)
    {
        return n;                          // casos base: F(0)=0 y F(1)=1
    }
    return Fibonacci(n - 1) + Fibonacci(n - 2);
}
` },
                { titulo: "Versión iterativa", nota: "Un solo bucle: mucho más rápida. La recursividad es elegante, pero no siempre es lo más eficiente.", codigo: r`for (int i = 0; i < 10; i++)
{
    Console.Write(Fibonacci(i) + " ");
}
Console.WriteLine();

int Fibonacci(int n)
{
    int anterior = 0;
    int actual = 1;
    for (int i = 0; i < n; i++)
    {
        int siguiente = anterior + actual;
        anterior = actual;
        actual = siguiente;
    }
    return anterior;                       // para n = 0 devuelve 0, para n = 1 devuelve 1
}
` },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "m5",
      titulo: "Clases, bibliotecas y textos",
      lecciones: [
        {
          id: "clases-estaticas",
          titulo: "Las clases como almacén de funciones",
          duracion: "12 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Agrupar funciones relacionadas en una clase static", "Llamar a funciones con el nombre de la clase", "Entender qué es un método estático"],
          teoria: r`<p>Hasta ahora hemos escrito todo el código en un único archivo. Pero a
menudo nos encontramos con que <strong>volvemos a escribir una función
que ya habíamos programado</strong> en otro programa. Eso va contra una
de las ideas principales de la programación: <strong>no vuelvas a
programar algo que ya has programado bien</strong>.</p>
<p>Podemos definir funciones <strong>para ser usadas desde otros
programas</strong>. Para ello usamos las <strong>clases</strong>.</p>
<p>Una <strong>clase</strong> es un bloque de código identificado por la
palabra clave <code>class</code> seguida del nombre de la clase, que
agrupa un conjunto de funciones (métodos) y variables:</p>
<!--ex:0-->
<p>Más adelante veremos con mayor profundidad el concepto de clase. Por
ahora, la idea clave es que <strong>nuestro programa se compondrá de
varias clases</strong> y que solo una de ellas contiene el punto de
entrada (<code>Main</code>).</p>
<p>Para poder llamar a una función de una clase <strong>sin crear ningún
objeto</strong>, esta debe definirse como
<strong><code>static</code></strong>. Y para que sea visible desde otras
clases, como <strong><code>public</code></strong>.</p>
<p>Este ejemplo define una clase que <strong>no se puede
ejecutar</strong> (no tiene <code>Main</code>), pero que ofrece un
conjunto de funciones para usar desde otras clases. Como solo contiene
miembros estáticos, la marcamos como
<strong><code>static class</code></strong>:</p>
<!--ex:1-->
<p>Y así se usa desde otro sitio:</p>
<!--ex:2-->
<p>Recomendaciones:</p>
<ul>
<li>Por convención, <strong>un archivo por clase</strong> y el archivo
se llama como la clase (<code>MensajesBienvenida.cs</code>), aunque el
compilador no lo exige.</li>
<li>El nombre de una clase empieza siempre por
<strong>mayúscula</strong> (PascalCase) y no puede ser una palabra
reservada.</li>
</ul>
<p>Ahora que sabemos que una clase puede servir solo para contener
funciones, ¿cómo llamamos a una función creada en otra clase que está
«en otra carpeta»? Para responder, hablemos de los <strong>espacios de
nombres</strong>.</p>`,
          ejemplos: [
            { titulo: "Clase EstoEsUnaClase", noRun: true, codigo: r`class EstoEsUnaClase
{
    static void Main()
    {
        UnaFuncionDeLaClase();
    }

    static void UnaFuncionDeLaClase()
    {
        Console.WriteLine("Esta función se podrá utilizar desde otras clases si es pública");
    }
}
` },
            { titulo: "Clase MensajesBienvenida", noRun: true, codigo: r`public static class MensajesBienvenida
{
    public static string GeneraMensaje1()
    {
        return "Bienvenido";
    }

    public static void MuestraMensaje1()
    {
        Console.WriteLine("Bienvenido");
    }

    public static string GeneraMensaje2()
    {
        return "Espero que tengas un buen día";
    }

    public static void MuestraMensaje2()
    {
        Console.WriteLine(GeneraMensaje2());
    }
}
` },
            { titulo: "Y así se usa desde otro sitio", codigo: r`MensajesBienvenida.MuestraMensaje1();                    // Bienvenido
Console.WriteLine(MensajesBienvenida.GeneraMensaje2());  // Espero que tengas un buen día

// ===== MensajesBienvenida =====
public static class MensajesBienvenida
{
    public static string GeneraMensaje1()
    {
        return "Bienvenido";
    }

    public static void MuestraMensaje1()
    {
        Console.WriteLine("Bienvenido");
    }

    public static string GeneraMensaje2()
    {
        return "Espero que tengas un buen día";
    }

    public static void MuestraMensaje2()
    {
        Console.WriteLine(GeneraMensaje2());
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Clase de conversiones",
              nivel: 1,
              enunciado: r`<p>Crea una <strong>clase <code>static</code> llamada
<code>Conversor</code></strong> con dos funciones:
<strong><code>CelsiusAFahrenheit(double c)</code></strong> y
<strong><code>KmAMillas(double km)</code></strong>. Desde el programa
principal muestra una tabla con las temperaturas de 0 a 40 grados de 10
en 10.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Las funciones se llaman con el nombre de la clase:
<code>Conversor.KmAMillas(10)</code>.</li>
<li>No se crean objetos de una clase <code>static</code>.</li>
</ul>
<p>💡 <strong>TIP:</strong> Fahrenheit = Celsius × 9 / 5 + 32. 1 km =
0,621371 millas.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Una clase static es un almacén de funciones relacionadas, como Math.", codigo: r`for (int c = 0; c <= 40; c += 10)
{
    Console.WriteLine($"{c} °C = {Conversor.CelsiusAFahrenheit(c)} °F");
}
Console.WriteLine($"10 km = {Conversor.KmAMillas(10):F2} millas");

static class Conversor
{
    public static double CelsiusAFahrenheit(double c)
    {
        return c * 9 / 5 + 32;
    }

    public static double KmAMillas(double km)
    {
        return km * 0.621371;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "namespaces",
          titulo: "Espacios de nombres y la directiva using",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Organizar el código con namespaces", "Usar using, using alias y using static", "Resolver conflictos de nombres"],
          teoria: r`<p>Un <strong>espacio de nombres</strong> (<em>namespace</em>) es un
nombre que <strong>agrupa un conjunto de clases relacionadas</strong>,
igual que una carpeta agrupa archivos. Sirve para organizar el código y
para evitar conflictos cuando dos clases se llaman igual.</p>
<p>Se declara al principio del archivo con la palabra clave
<code>namespace</code>:</p>
<!--ex:0-->
<p>Reglas y convenciones:</p>
<ul>
<li>Los espacios de nombres se escriben en <strong>PascalCase</strong> y
se <strong>anidan separando con puntos</strong>:
<code>Utiles.Mensajes</code> es el espacio <code>Mensajes</code> dentro
de <code>Utiles</code>.</li>
<li>Por convención, el espacio de nombres coincide con la
<strong>estructura de carpetas</strong> del proyecto (la carpeta
<code>Utiles/Mensajes</code> ↔︎ <code>Utiles.Mensajes</code>), empezando
por el nombre del proyecto. No es obligatorio, pero todo el mundo lo
hace.</li>
<li>No hace falta «crear» el espacio de nombres de ninguna otra manera:
existe por el simple hecho de declararlo.</li>
<li>Una clase se identifica de forma única por su <strong>nombre
completo</strong> (<em>fully qualified name</em>):
<code>Utiles.Mensajes.Saludos</code>.</li>
</ul>
<p>Para crear carpetas y clases desde la línea de comandos o desde el
IDE:</p>
<pre><code>dotnet new console -n EjemploNamespaces      # crea el proyecto
# Crea las carpetas Utiles/Mensajes y añade dentro los archivos .cs (con el IDE: botón derecho → Agregar → Clase)</code></pre>
<h4 id="221-llamar-a-funciones-de-otras-clases">2.2.1 Llamar a funciones
de otras clases</h4>
<p>Para usar una función definida en otra clase indicamos el
<strong>nombre completo</strong>: espacio de nombres, clase y
función:</p>
<pre><code>EspacioDeNombres.NombreClase.NombreFuncion();</code></pre>
<p>En este ejemplo, el programa principal llama a funciones de la clase
<code>Saludos</code>, definida en <code>Utiles.Mensajes</code>:</p>
<!--ex:1-->
<p>Si la clase que llamamos está en <strong>el mismo espacio de
nombres</strong>, no hace falta escribirlo.</p>
<p>Como buen programador, ya te habrás dado cuenta de que escribir toda
la ruta cada vez es repetir código bastante desagradable. Para eso
existe <code>using</code>.</p>
<h4 id="222-la-directiva-using">2.2.2 La directiva
<code>using</code></h4>
<p>La directiva <strong><code>using</code></strong> nos permite indicar,
al principio del archivo, que usaremos las clases de un espacio de
nombres sin escribir su ruta completa:</p>
<!--ex:2-->
<p>Características:</p>
<ul>
<li><strong><code>using</code> trae todas las clases del espacio de
nombres</strong> (no hace falta un comodín <code>*</code> como en otros
lenguajes).</li>
<li><strong>No incluye los espacios de nombres hijos</strong>:
<code>using Utiles;</code> no trae las clases de
<code>Utiles.Mensajes</code>.</li>
<li>Se puede escribir <strong>un solo <code>using</code> global</strong>
para todo el proyecto con <code>global using Utiles.Mensajes;</code>:
así no hay que repetirlo en cada archivo. Las plantillas modernas lo
hacen para los espacios de <code>System</code> más comunes (<em>usings
implícitos</em>), por eso podemos usar <code>Console</code> sin escribir
<code>using System;</code>.</li>
<li>Con <code>using static</code> podemos usar los métodos estáticos de
una clase <strong>sin escribir el nombre de la clase</strong>:</li>
</ul>
<!--ex:3-->
<p><strong>¿Y si dos clases tienen el mismo nombre?</strong> Si
importamos dos espacios de nombres que contienen una clase con el mismo
nombre, el compilador no sabe a cuál nos referimos y da el error
<strong><code>CS0104: ambiguous reference</code></strong>. Hay dos
soluciones:</p>
<ol type="1">
<li>Escribir el <strong>nombre completo</strong> de, al menos, una de
las dos.</li>
<li>Crear un <strong>alias</strong> con <code>using</code>.</li>
</ol>
<p>En este ejemplo hay una clase <code>Despedidas</code> en
<code>Utiles.Mensajes</code> y otra en <code>Utiles.Alertas</code>:</p>
<!--ex:4-->
<p>Y las dos clases serían así, cada una en su archivo:</p>
<!--ex:5-->
<!--ex:6-->
<p>Ahora bien, ¿todas las funciones de una clase deben ser accesibles
desde otras clases? Por suerte, no: decidimos cuáles con los
<strong>modificadores de acceso</strong>.</p>`,
          ejemplos: [
            { titulo: "Se declara al principio del archivo con la palabra clave namespace", codigo: r`namespace Utiles.Mensajes;           // declaración de ámbito de archivo: todo el archivo pertenece a este espacio

public static class Saludos
{
    public static string Hola(string nombre) => $"¡Hola, {nombre}!";
}
` },
            { titulo: "Ejemplo 2", codigo: r`Console.WriteLine(Utiles.Mensajes.Saludos.Hola("Ana"));     // ¡Hola, Ana!

// ===== Saludos =====
namespace Utiles.Mensajes;           // declaración de ámbito de archivo: todo el archivo pertenece a este espacio

public static class Saludos
{
    public static string Hola(string nombre) => $"¡Hola, {nombre}!";
}
` },
            { titulo: "Ejemplo 3", codigo: r`using Utiles.Mensajes;                       // a partir de aquí, 'Saludos' significa Utiles.Mensajes.Saludos

Console.WriteLine(Saludos.Hola("Ana"));      // ¡Hola, Ana!

// ===== Saludos =====
namespace Utiles.Mensajes;           // declaración de ámbito de archivo: todo el archivo pertenece a este espacio

public static class Saludos
{
    public static string Hola(string nombre) => $"¡Hola, {nombre}!";
}
` },
            { titulo: "Ejemplo 4", codigo: r`using static System.Math;                    // ahora podemos escribir Sqrt(16) en lugar de Math.Sqrt(16)

Console.WriteLine(Sqrt(16));                 // 4
` },
            { titulo: "En este ejemplo hay una clase Despedidas en Utiles.Mensajes y otra en Utiles.Alertas", codigo: r`using Utiles.Mensajes;                                   // trae Utiles.Mensajes.Despedidas
using Alerta = Utiles.Alertas.Despedidas;                // alias: 'Alerta' es la otra clase Despedidas

Console.WriteLine(Despedidas.Adios("Ana"));              // la de Utiles.Mensajes
Console.WriteLine(Alerta.Adios("Ana"));                  // la de Utiles.Alertas, a través del alias
Console.WriteLine(Utiles.Alertas.Despedidas.Adios("Ana"));   // también con el nombre completo
` },
            { titulo: "Y las dos clases serían así, cada una en su archivo", codigo: r`// Archivo Utiles/Mensajes/Despedidas.cs
namespace Utiles.Mensajes;

public static class Despedidas
{
    public static string Adios(string nombre) => $"Hasta luego, {nombre}";
}
` },
            { titulo: "Ejemplo 7", codigo: r`// Archivo Utiles/Alertas/Despedidas.cs
namespace Utiles.Alertas;

public static class Despedidas
{
    public static string Adios(string nombre) => $"¡ATENCIÓN! {nombre} abandona el sistema";
}
` },
          ],
          actividades: [
            {
              titulo: "Tres clases, tres espacios de nombres",
              nivel: 2,
              enunciado: r`<p>Crea un programa formado por <strong>3 clases</strong> (cada una en
su archivo <code>.cs</code>):</p>
<ul>
<li><code>Inicial.cs</code>, en el espacio de nombres
<code>EjemploLibrerias</code>. Es la <strong>clase ejecutable</strong>:
cuando se ejecuta, llama a <code>GetEnteroSuperior0()</code> de la clase
<code>PideValores</code> para obtener un número y después pasa ese
número a <code>MuestraValor()</code> de la clase <code>Mostrar</code>;
el programa muestra por consola el texto que devuelve.</li>
<li><code>Mostrar.cs</code>, en el espacio de nombres
<code>EjemploLibrerias.MostrarValores</code>. Contiene la función
<code>MuestraValor()</code>, que <strong>recibe un número y
devuelve</strong> el texto <code>"El número es: "</code> seguido del
número.</li>
<li><code>PideValores.cs</code>, en el espacio de nombres
<code>EjemploLibrerias.PedirValores</code>. Contiene la función
<code>GetEnteroSuperior0()</code>, que <strong>pide un valor numérico al
usuario hasta que introduce uno superior a 0</strong> y entonces lo
devuelve.</li>
</ul>
<pre><code>public static string MuestraValor(int numero)    // returns &quot;El número es: &quot; followed by the number

public static int GetEnteroSuperior0()           // asks until the user types an integer &gt; 0 and returns it</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Las clases <code>Mostrar</code> y <code>PideValores</code> deben ser
<strong><code>public</code></strong> para poder usarse desde otro
espacio de nombres.</li>
<li><strong>Control de errores:</strong> un texto que no es un número, o
un número menor o igual que 0, se avisa y se vuelve a pedir.</li>
<li>Estructura de carpetas recomendada:</li>
</ul>
<pre><code>EjemploLibrerias/
├── Inicial.cs
├── MostrarValores/
│   └── Mostrar.cs
└── PedirValores/
    └── PideValores.cs</code></pre>
<p>💡 <strong>TIP:</strong> en <code>Inicial.cs</code> escribe dos
<code>using</code> (uno por cada espacio de nombres) para no repetir la
ruta completa.</p>
<p>🏅 <strong>Ampliación:</strong> añade una cuarta clase
<code>Operaciones</code> en un espacio de nombres propio con una función
<code>Factorial()</code> y úsala desde <code>Inicial</code>.</p>`,
              soluciones: [
                { titulo: "Solución (1)", codigo: r`// Archivo: Inicial.cs
using EjemploLibrerias.MostrarValores;      // para usar la clase Mostrar
using EjemploLibrerias.PedirValores;        // para usar la clase PideValores

namespace EjemploLibrerias;

class Inicial
{
    static void Main()
    {
        int numero = PideValores.GetEnteroSuperior0();       // pedimos el número
        Console.WriteLine(Mostrar.MuestraValor(numero));     // mostramos el texto que devuelve la otra clase
    }
}
` },
                { titulo: "Solución (2)", codigo: r`// Archivo: MostrarValores/Mostrar.cs
namespace EjemploLibrerias.MostrarValores;

public static class Mostrar
{
    // Devuelve el texto "El número es: " seguido del número recibido
    public static string MuestraValor(int numero)
    {
        return $"El número es: {numero}";
    }
}
` },
                { titulo: "Solución (3)", nota: "Por qué está bien así:\n\n- Mostrar y PideValores son public static: se pueden usar desde otro espacio de nombres sin crear objetos.\n- Inicial es la única clase con Main, es decir, la única ejecutable.\n- Cada espacio de nombres coincide con su carpeta.", codigo: r`// Archivo: PedirValores/PideValores.cs
namespace EjemploLibrerias.PedirValores;

public static class PideValores
{
    // Pide un entero hasta que el usuario escribe uno mayor que 0 y lo devuelve
    public static int GetEnteroSuperior0()
    {
        int numero;
        bool esValido;

        do
        {
            Console.Write("Introduce un número > 0: ");
            esValido = int.TryParse(Console.ReadLine(), out numero) && numero > 0;

            if (!esValido)
            {
                Console.WriteLine("Valor no válido: debe ser un número entero mayor que 0.");
            }
        } while (!esValido);

        return numero;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "acceso-bibliotecas",
          titulo: "Modificadores de acceso y bibliotecas",
          duracion: "12 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Conocer los modificadores public, private, protected e internal", "Entender qué es una biblioteca de clases (BCL)", "Conocer NuGet"],
          teoria: r`<p>¿Qué ocurre si queremos crear una función que <strong>no</strong> sea
accesible desde otras clases? Al definir una función (o una clase, o una
variable de clase) indicamos también <strong>quién puede
acceder</strong> a ella con un <strong>modificador de
acceso</strong>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Modificador</th>
<th>Quién puede acceder</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>public</code></td>
<td><strong>Cualquier</strong> otra clase, incluso de otros
proyectos</td>
</tr>
<tr class="even">
<td><code>private</code></td>
<td><strong>Solo la clase</strong> que la define (es el valor por
defecto de los miembros de una clase)</td>
</tr>
<tr class="odd">
<td><code>internal</code></td>
<td>Cualquier clase <strong>del mismo proyecto</strong>
(<em>ensamblado</em>). Es el valor por defecto de las clases</td>
</tr>
<tr class="even">
<td><code>protected</code></td>
<td>La clase que la define y las clases que <strong>heredan</strong> de
ella (lo veremos en la UF4)</td>
</tr>
<tr class="odd">
<td><code>protected internal</code></td>
<td><code>protected</code> <strong>o</strong> <code>internal</code></td>
</tr>
<tr class="even">
<td><code>private protected</code></td>
<td><code>protected</code> <strong>y</strong> <code>internal</code>:
clases derivadas del mismo proyecto</td>
</tr>
<tr class="odd">
<td><code>file</code></td>
<td>Solo el <strong>archivo</strong> donde se declara (para tipos, desde
C# 11)</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>Ojo con <code>internal</code>.</strong> Se parece al
«paquete» de otros lenguajes, pero <strong>no depende del espacio de
nombres</strong>, sino del <strong>proyecto</strong>:
<code>internal</code> permite el acceso desde cualquier clase del mismo
proyecto, esté en el espacio de nombres que esté.</p>
</div>
<p>En el siguiente ejemplo vemos tres funciones con distintos
modificadores:</p>
<!--ex:0-->
<p>Y así se usan desde otra clase del <strong>mismo
proyecto</strong>:</p>
<!--ex:1-->
<div class="callout">
<p><strong>Miembros <code>static</code> y miembros de
instancia.</strong> Un miembro <code>static</code> pertenece a la
<strong>clase</strong> y se llama con <code>NombreClase.Miembro</code>.
Un miembro <strong>sin <code>static</code></strong> pertenece a cada
<strong>objeto</strong> y solo se puede usar tras crear uno con
<code>new</code>. De los objetos hablaremos en la UF4. Mientras tanto,
en las clases «almacén» de funciones, todo es <code>static</code>.</p>
</div>
<h4 id="224-bibliotecas">2.2.4 Bibliotecas</h4>
<p>¿Recuerdas que para usar <code>Console</code> no necesitábamos
escribir nada especial? ¿Y que alguna vez escribimos
<code>using System.Globalization;</code>? Esas clases
(<code>Console</code>, <code>Math</code>, <code>String</code>,
<code>DateTime</code>…) están definidas en espacios de nombres de la
<strong>biblioteca de clases base de .NET</strong> (BCL).</p>
<p>Al instalar el SDK de .NET se instala un enorme conjunto de espacios
de nombres con clases útiles. Si tuviéramos que programar nosotros la
entrada y salida de datos, lo pasaríamos bastante mal.</p>
<p>Una <strong>biblioteca</strong> (o librería) es un conjunto de clases
y espacios de nombres enfocados a ayudar en un cierto tipo de trabajos:
operaciones matemáticas, interfaces gráficas, acceso a bases de datos…
Algunas vienen con .NET y otras las ofrecen tecnologías o terceros.</p>
<p>Principales espacios de nombres de la BCL:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Espacio de nombres</th>
<th>Para qué sirve</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>System</code></td>
<td>Clases esenciales: <code>Console</code>, <code>Math</code>,
<code>String</code>, <code>Convert</code>, <code>DateTime</code>,
<code>Random</code>… (se importa por defecto en los proyectos
nuevos)</td>
</tr>
<tr class="even">
<td><code>System.IO</code></td>
<td>Entrada/salida: ficheros, carpetas, flujos de datos</td>
</tr>
<tr class="odd">
<td><code>System.Collections.Generic</code></td>
<td>Colecciones genéricas: <code>List&lt;T&gt;</code>,
<code>Dictionary&lt;K,V&gt;</code>…</td>
</tr>
<tr class="even">
<td><code>System.Linq</code></td>
<td>Consultas sobre colecciones (LINQ)</td>
</tr>
<tr class="odd">
<td><code>System.Text</code></td>
<td>Trabajo con texto: <code>StringBuilder</code>, codificaciones</td>
</tr>
<tr class="even">
<td><code>System.Text.Json</code></td>
<td>Leer y escribir <strong>JSON</strong></td>
</tr>
<tr class="odd">
<td><code>System.Globalization</code></td>
<td>Cultura e idioma: formatos de números y fechas</td>
</tr>
<tr class="even">
<td><code>System.Net.Http</code></td>
<td>Peticiones HTTP a servicios web</td>
</tr>
<tr class="odd">
<td><code>System.Threading.Tasks</code></td>
<td>Programación asíncrona y paralela</td>
</tr>
<tr class="even">
<td><code>System.Diagnostics</code></td>
<td>Depuración y medición</td>
</tr>
</tbody>
</table></div>
<p>Para interfaces gráficas existen <strong>Windows Forms</strong>,
<strong>WPF</strong>, <strong>.NET MAUI</strong> o
<strong>Avalonia</strong>; para bases de datos, <strong>ADO.NET</strong>
y <strong>Entity Framework Core</strong>; para videojuegos, motores como
<strong>Unity</strong> o <strong>Godot</strong> y la biblioteca
<strong>MonoGame</strong>.</p>
<p><strong>Paquetes NuGet.</strong> Las bibliotecas de terceros se
distribuyen como <strong>paquetes NuGet</strong>. Para añadir uno a un
proyecto:</p>
<pre><code>dotnet add package Newtonsoft.Json        # ejemplo: una biblioteca muy conocida para JSON</code></pre>
<p>Fuentes de ayuda: la documentación oficial (<a
href="https://learn.microsoft.com/dotnet/api">https://learn.microsoft.com/dotnet/api</a>)
y la comunidad en Stack Overflow.</p>`,
          ejemplos: [
            { titulo: "En el siguiente ejemplo vemos tres funciones con distintos modificadores", codigo: r`namespace Ejemplos;

public static class FuncionesEjemplo
{
    // public: todas las clases pueden acceder a esta función
    public static void MuestraUnMensaje()
    {
        Console.WriteLine("¡Vivan los espacios de nombres!");
    }

    // private: otras clases NO pueden acceder a esta función
    private static int CalculaMensaje()
    {
        return 5;
    }

    // internal: pueden acceder las clases del mismo proyecto
    internal static void MuestraUnMensaje(string texto)
    {
        int num = CalculaMensaje();                   // dentro de la clase sí podemos usar la privada
        Console.WriteLine($"El mensaje es: {texto} {num}");
    }
}
` },
            { titulo: "Y así se usan desde otra clase del mismo proyecto", codigo: r`using Ejemplos;

FuncionesEjemplo.MuestraUnMensaje();           // ✔ es public
FuncionesEjemplo.MuestraUnMensaje("hola");     // ✔ es internal y estamos en el mismo proyecto
// FuncionesEjemplo.CalculaMensaje();          // ❌ error CS0122: es private, no es accesible

// ===== FuncionesEjemplo =====
namespace Ejemplos;

public static class FuncionesEjemplo
{
    // public: todas las clases pueden acceder a esta función
    public static void MuestraUnMensaje()
    {
        Console.WriteLine("¡Vivan los espacios de nombres!");
    }

    // private: otras clases NO pueden acceder a esta función
    private static int CalculaMensaje()
    {
        return 5;
    }

    // internal: pueden acceder las clases del mismo proyecto
    internal static void MuestraUnMensaje(string texto)
    {
        int num = CalculaMensaje();                   // dentro de la clase sí podemos usar la privada
        Console.WriteLine($"El mensaje es: {texto} {num}");
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Contador con límite",
              nivel: 1,
              enunciado: r`<p>Crea una clase <strong><code>Contador</code></strong> con un campo
<strong>privado</strong> <code>valor</code> y los métodos públicos
<strong><code>Incrementar()</code></strong>,
<strong><code>Reiniciar()</code></strong> y
<strong><code>ObtenerValor()</code></strong>. El contador <strong>nunca
puede pasar de 5</strong>: si ya vale 5, <code>Incrementar</code> no
hace nada.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>El programa principal <strong>no puede</strong> tocar
<code>valor</code> directamente: solo a través de los métodos.</li>
<li>Prueba a escribir <code>c.valor = 99;</code> y lee el error del
compilador.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "private protege el estado del objeto: nadie puede dejarlo en un valor inválido.", codigo: r`Contador c = new Contador();
for (int i = 0; i < 8; i++)
{
    c.Incrementar();
}
Console.WriteLine(c.ObtenerValor());     // 5: nunca pasa del límite
c.Reiniciar();
Console.WriteLine(c.ObtenerValor());     // 0
// c.valor = 99;                          // ERROR CS0122: 'valor' es inaccesible por su nivel de protección

class Contador
{
    private int valor;                   // solo accesible desde dentro de la clase

    public void Incrementar()
    {
        if (valor < 5)
        {
            valor++;
        }
    }

    public void Reiniciar()
    {
        valor = 0;
    }

    public int ObtenerValor()
    {
        return valor;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "math-random",
          titulo: "Las clases Math y Random",
          duracion: "12 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Usar las funciones matemáticas de Math", "Generar números aleatorios con Random", "Conocer el redondeo del banquero"],
          teoria: r`<p><code>System.Math</code> es la principal biblioteca matemática de
.NET. Pertenece al espacio de nombres <code>System</code>, así que la
usamos sin importarla. Las funciones están definidas en la clase
<code>Math</code>, por lo que las llamamos directamente como
<code>Math.Función(...)</code>. La mayoría reciben los valores con los
que operar y devuelven el resultado. Muchas funciones funcionan con
distintos tipos numéricos (<code>int</code>, <code>long</code>,
<code>double</code>…).</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Código</th>
<th>Resultado</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>Math.PI</code></td>
<td><code>3.141592653589793</code></td>
<td>Constante: el número π</td>
</tr>
<tr class="even">
<td><code>Math.E</code></td>
<td><code>2.718281828459045</code></td>
<td>Constante: el número e</td>
</tr>
<tr class="odd">
<td><code>Math.Abs(-3)</code> / <code>Math.Abs(-3.4)</code></td>
<td><code>3</code> / <code>3.4</code></td>
<td><strong>Valor absoluto</strong></td>
</tr>
<tr class="even">
<td><code>Math.Max(3, 10)</code></td>
<td><code>10</code></td>
<td>El <strong>mayor</strong> de dos valores</td>
</tr>
<tr class="odd">
<td><code>Math.Min(-4.5, 9.2)</code></td>
<td><code>-4.5</code></td>
<td>El <strong>menor</strong> de dos valores</td>
</tr>
<tr class="even">
<td><code>Math.Round(33.45)</code> / <code>Math.Round(33.55)</code></td>
<td><code>33</code> / <code>34</code></td>
<td><strong>Redondea</strong> al entero más cercano</td>
</tr>
<tr class="odd">
<td><code>Math.Round(3.14159, 2)</code></td>
<td><code>3.14</code></td>
<td>Redondea a un número de <strong>decimales</strong></td>
</tr>
<tr class="even">
<td><code>Math.Floor(33.45)</code> / <code>Math.Floor(20.99)</code></td>
<td><code>33</code> / <code>20</code></td>
<td>Mayor entero <strong>menor o igual</strong> (redondeo hacia
abajo)</td>
</tr>
<tr class="odd">
<td><code>Math.Ceiling(33.01)</code></td>
<td><code>34</code></td>
<td>Menor entero <strong>mayor o igual</strong> (redondeo hacia
arriba)</td>
</tr>
<tr class="even">
<td><code>Math.Truncate(-3.7)</code></td>
<td><code>-3</code></td>
<td><strong>Elimina</strong> la parte decimal</td>
</tr>
<tr class="odd">
<td><code>Math.Pow(2, 3)</code></td>
<td><code>8</code></td>
<td><strong>Potencia</strong>: 2 elevado a 3</td>
</tr>
<tr class="even">
<td><code>Math.Sqrt(16)</code></td>
<td><code>4</code></td>
<td><strong>Raíz cuadrada</strong></td>
</tr>
<tr class="odd">
<td><code>Math.Cos(Math.PI / 4)</code></td>
<td><code>≈ 0.7071</code></td>
<td><strong>Coseno</strong> (el ángulo va en
<strong>radianes</strong>)</td>
</tr>
<tr class="even">
<td><code>Math.Sin(Math.PI / 4)</code></td>
<td><code>≈ 0.7071</code></td>
<td><strong>Seno</strong> (en radianes)</td>
</tr>
<tr class="odd">
<td><code>Math.Tan(Math.PI / 4)</code></td>
<td><code>≈ 1</code> (en realidad <code>0.9999999999999999</code>)</td>
<td><strong>Tangente</strong> (en radianes)</td>
</tr>
<tr class="even">
<td><code>Math.Log(1)</code></td>
<td><code>0</code></td>
<td>Logaritmo <strong>natural</strong> (base e)</td>
</tr>
<tr class="odd">
<td><code>Math.Log10(100)</code></td>
<td><code>2</code></td>
<td>Logaritmo en base <strong>10</strong></td>
</tr>
<tr class="even">
<td><code>Math.Exp(0)</code></td>
<td><code>1</code></td>
<td>e elevado a la potencia indicada</td>
</tr>
<tr class="odd">
<td><code>Math.Clamp(15, 0, 10)</code></td>
<td><code>10</code></td>
<td><strong>Limita</strong> un valor a un rango [mín, máx]</td>
</tr>
</tbody>
</table></div>
<p>Cosas que conviene saber:</p>
<ul>
<li><strong>Los ángulos de <code>Cos</code>, <code>Sin</code> y
<code>Tan</code> van en radianes</strong>, no en grados. Para pasar de
grados a radianes: <code>radianes = grados * Math.PI / 180</code>. Por
eso <code>Math.Cos(45)</code> <strong>no</strong> vale 0.7071: el coseno
de 45 <em>radianes</em> es otro valor.</li>
<li><strong><code>Math.Round</code> usa por defecto el «redondeo
bancario»</strong>: cuando el decimal es justo <code>.5</code>, redondea
al <strong>par más cercano</strong> (<code>Math.Round(2.5)</code> es
<code>2</code> y <code>Math.Round(3.5)</code> es <code>4</code>). Para
el redondeo «de toda la vida» se indica:
<code>Math.Round(2.5, MidpointRounding.AwayFromZero)</code> es
<code>3</code>.</li>
<li>Los resultados con decimales son <strong>aproximaciones</strong>
(<code>Math.Tan(Math.PI / 4)</code> da <code>0.9999999999999999</code>,
no exactamente <code>1</code>). Por eso no se comparan con
<code>==</code>.</li>
</ul>
<!--ex:0-->
<p><strong>Números aleatorios.</strong> En C# los números aleatorios no
están en <code>Math</code>, sino en la clase
<strong><code>Random</code></strong>. Desde .NET 6 se puede usar la
instancia compartida <code>Random.Shared</code>:</p>
<!--ex:1-->
<p>También se puede crear un generador propio con
<code>new Random()</code> (o con una <em>semilla</em>:
<code>new Random(42)</code> siempre produce la misma secuencia, útil
para hacer pruebas).</p>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`double grados = 45;
double radianes = grados * Math.PI / 180;              // pasamos de grados a radianes

Console.WriteLine(Math.Cos(radianes).ToString("F4"));   // 0.7071 (o 0,7071 según tu configuración regional)
Console.WriteLine(Math.Round(2.5));                     // 2   (redondeo bancario)
Console.WriteLine(Math.Round(2.5, MidpointRounding.AwayFromZero));  // 3
` },
            { titulo: "Ejemplo 2", codigo: r`int dado = Random.Shared.Next(1, 7);              // entero entre 1 y 6 (el límite superior NO se incluye)
double azar = Random.Shared.NextDouble();         // decimal entre 0.0 (incluido) y 1.0 (excluido)

Console.WriteLine($"Has sacado un {dado}");
` },
          ],
          actividades: [
            {
              titulo: "Dados de rol",
              nivel: 1,
              enunciado: r`<p>Simula <strong>10 tiradas</strong> de un dado de 6 caras y muestra
cuántas veces ha salido <strong>cada</strong> cara.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><code>Random.Shared.Next(1, 7)</code> devuelve un entero entre 1 y 6
(el máximo <strong>no</strong> se incluye).</li>
<li>Guarda los contadores en un <strong>array de 6
posiciones</strong>.</li>
</ul>
<p>💡 <strong>TIP:</strong> la cara <code>c</code> se cuenta en la
posición <code>c - 1</code>.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Cada ejecución da un resultado distinto: es aleatorio.", codigo: r`int[] veces = new int[6];             // veces[0] cuenta los 1, veces[1] los 2...

for (int tirada = 0; tirada < 10; tirada++)
{
    int cara = Random.Shared.Next(1, 7);   // de 1 a 6
    veces[cara - 1]++;
}

for (int i = 0; i < veces.Length; i++)
{
    Console.WriteLine($"Cara {i + 1}: {veces[i]} veces");
}
` },
              ],
            },
            {
              titulo: "Distancia entre dos puntos",
              nivel: 2,
              enunciado: r`<p>Pide las coordenadas de <strong>dos puntos</strong>
<code>(x1, y1)</code> y <code>(x2, y2)</code> y muestra la
<strong>distancia</strong> entre ellos con 2 decimales.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Fórmula: <code>distancia = √((x2 − x1)² + (y2 − y1)²)</code>.</li>
<li>Usa <code>Math.Sqrt</code> y <code>Math.Pow</code>.</li>
<li><strong>Control de errores:</strong> lee los números con
<code>double.TryParse</code> (y repite si no son válidos).</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "double.TryParse depende de la cultura del sistema: en equipos en español se escribe la coma decimal (1,5).", codigo: r`double x1 = LeerDouble("x1: ");
double y1 = LeerDouble("y1: ");
double x2 = LeerDouble("x2: ");
double y2 = LeerDouble("y2: ");

double distancia = Math.Sqrt(Math.Pow(x2 - x1, 2) + Math.Pow(y2 - y1, 2));
Console.WriteLine($"Distancia: {distancia:F2}");

double LeerDouble(string mensaje)
{
    double valor;
    Console.Write(mensaje);
    while (!double.TryParse(Console.ReadLine(), out valor))
    {
        Console.Write("Número no válido. " + mensaje);
    }
    return valor;
}
` },
              ],
            },
          ],
        },
        {
          id: "cadenas",
          titulo: "Funciones de los textos (string)",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Conocer los principales métodos de string", "Entender que los textos son inmutables", "Comparar textos correctamente"],
          teoria: r`<p>Los tipos complejos suelen tener <strong>funciones asociadas</strong>
para trabajar con su contenido. Para ejecutar la función asociada a una
variable usamos la sintaxis:</p>
<pre><code>nombreVariable.NombreFuncion(...)</code></pre>
<p>Vamos a ver algunas de las principales funciones de
<code>string</code>, suponiendo que hemos definido
<code>string miString = "Vaya";</code>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Código</th>
<th>Resultado</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>miString.Length</code></td>
<td><code>4</code></td>
<td><strong>Número de caracteres</strong>. Es una
<strong>propiedad</strong>: se escribe sin paréntesis</td>
</tr>
<tr class="even">
<td><code>miString[3]</code></td>
<td><code>'a'</code></td>
<td><strong>Carácter</strong> en la posición indicada (empezando por
0)</td>
</tr>
<tr class="odd">
<td><code>miString == "vaya"</code></td>
<td><code>false</code></td>
<td><strong>Igualdad</strong> de contenido. Distingue mayúsculas (la «V»
inicial es distinta de «v»)</td>
</tr>
<tr class="even">
<td><code>miString.Equals("VAYA", StringComparison.OrdinalIgnoreCase)</code></td>
<td><code>true</code></td>
<td>Igualdad <strong>sin distinguir mayúsculas</strong></td>
</tr>
<tr class="odd">
<td><code>miString.IndexOf('a')</code></td>
<td><code>1</code></td>
<td><strong>Primera posición</strong> (desde 0) en la que aparece. Si no
aparece, devuelve <code>-1</code></td>
</tr>
<tr class="even">
<td><code>miString.LastIndexOf('a')</code></td>
<td><code>3</code></td>
<td><strong>Última posición</strong> en la que aparece. Si no aparece,
devuelve <code>-1</code></td>
</tr>
<tr class="odd">
<td><code>miString.Substring(2, 2)</code></td>
<td><code>"ya"</code></td>
<td><strong>Fragmento</strong>: desde la posición 2, con una longitud de
2 caracteres</td>
</tr>
<tr class="even">
<td><code>miString.Substring(2)</code></td>
<td><code>"ya"</code></td>
<td>Fragmento desde la posición 2 <strong>hasta el final</strong></td>
</tr>
<tr class="odd">
<td><code>miString.ToUpper()</code></td>
<td><code>"VAYA"</code></td>
<td>Todo en <strong>mayúsculas</strong></td>
</tr>
<tr class="even">
<td><code>miString.ToLower()</code></td>
<td><code>"vaya"</code></td>
<td>Todo en <strong>minúsculas</strong></td>
</tr>
<tr class="odd">
<td><code>miString.Contains("ay")</code></td>
<td><code>true</code></td>
<td>¿Contiene este texto?</td>
</tr>
<tr class="even">
<td><code>miString.StartsWith("Va")</code></td>
<td><code>true</code></td>
<td>¿Empieza por este texto?</td>
</tr>
<tr class="odd">
<td><code>miString.EndsWith("ya")</code></td>
<td><code>true</code></td>
<td>¿Termina con este texto?</td>
</tr>
<tr class="even">
<td><code>miString.Replace('a', 'o')</code></td>
<td><code>"Voyo"</code></td>
<td><strong>Sustituye</strong> un carácter (o texto) por otro</td>
</tr>
<tr class="odd">
<td><code>"  hola  ".Trim()</code></td>
<td><code>"hola"</code></td>
<td><strong>Elimina</strong> los espacios del principio y del final</td>
</tr>
<tr class="even">
<td><code>"42".PadLeft(5, '0')</code></td>
<td><code>"00042"</code></td>
<td><strong>Rellena</strong> por la izquierda hasta la longitud
indicada</td>
</tr>
<tr class="odd">
<td><code>"a,b,c".Split(',')</code></td>
<td><code>{ "a", "b", "c" }</code></td>
<td><strong>Divide</strong> el texto en un array de textos</td>
</tr>
<tr class="even">
<td><code>string.Join(" - ", partes)</code></td>
<td><code>"a - b - c"</code></td>
<td><strong>Une</strong> varios textos con un separador</td>
</tr>
<tr class="odd">
<td><code>string.IsNullOrEmpty(texto)</code></td>
<td><code>true</code> / <code>false</code></td>
<td>¿Es <code>null</code> o está vacío?</td>
</tr>
</tbody>
</table></div>
<p>Notas importantes:</p>
<ul>
<li>Los <code>string</code> son <strong>inmutables</strong>: ninguna
función modifica el texto original, <strong>devuelve uno nuevo</strong>.
Hay que guardar el resultado:</li>
</ul>
<!--ex:0-->
<ul>
<li><strong>Comparar textos para ordenarlos.</strong>
<code>CompareTo</code> y <code>string.Compare</code> devuelven un número
<strong>negativo</strong>, <strong>cero</strong> o
<strong>positivo</strong> según el orden alfabético, y su resultado
exacto depende de la cultura. Para una comparación «carácter a carácter»
fiable usa <code>StringComparison.Ordinal</code>:</li>
</ul>
<!--ex:1-->
<ul>
<li>Con <code>==</code> se compara el <strong>contenido</strong> de los
textos, no la referencia.</li>
</ul>
<hr />
<ul>
<li>Documentación de la API de .NET: <a
href="https://learn.microsoft.com/dotnet/api">https://learn.microsoft.com/dotnet/api</a></li>
<li>Espacios de nombres y la directiva <code>using</code>: <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/types/namespaces">https://learn.microsoft.com/dotnet/csharp/fundamentals/types/namespaces</a></li>
<li>Modificadores de acceso: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers</a></li>
<li>Clase <code>Math</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.math">https://learn.microsoft.com/dotnet/api/system.math</a></li>
<li>Clase <code>String</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.string">https://learn.microsoft.com/dotnet/api/system.string</a></li>
<li>NuGet (paquetes para .NET): <a
href="https://www.nuget.org">https://www.nuget.org</a></li>
<li>Stack Overflow en español: <a
href="https://es.stackoverflow.com">https://es.stackoverflow.com</a></li>
<li>Unity: <a href="https://unity.com">https://unity.com</a> · Godot: <a
href="https://godotengine.org">https://godotengine.org</a> · MonoGame:
<a href="https://monogame.net">https://monogame.net</a></li>
</ul>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`string nombre = "dani";
nombre.ToUpper();                       // ❌ no hace nada útil: el resultado se descarta
nombre = nombre.ToUpper();              // ✔ guardamos el texto nuevo: "DANI"
Console.WriteLine(nombre);
` },
            { titulo: "Ejemplo 2", codigo: r`int orden = string.Compare("a", "b", StringComparison.Ordinal);
Console.WriteLine(orden < 0);           // True: "a" va antes que "b"
` },
          ],
          actividades: [
            {
              titulo: "Contador de vocales",
              nivel: 2,
              enunciado: r`<p>Pide un texto y muestra <strong>cuántas vocales</strong> contiene
(sin distinguir mayúsculas de minúsculas).</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Un <code>string</code> se puede recorrer con <code>foreach</code>
carácter a carácter.</li>
<li>Convierte el texto a minúsculas con <code>ToLower()</code> para no
repetir comprobaciones.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>"aeiou".Contains(letra)</code> indica
si una letra es vocal.</p>`,
              soluciones: [
                { titulo: "Solución", codigo: r`Console.Write("Escribe un texto: ");
string texto = (Console.ReadLine() ?? "").ToLower();

int vocales = 0;
foreach (char letra in texto)
{
    if ("aeiouáéíóúü".Contains(letra))
    {
        vocales++;
    }
}
Console.WriteLine($"Vocales: {vocales}");
` },
              ],
            },
            {
              titulo: "¿Es un palíndromo?",
              nivel: 3,
              enunciado: r`<p>Un <strong>palíndromo</strong> se lee igual al derecho que al revés
(<em>ana</em>, <em>reconocer</em>). Pide una palabra y di si es
palíndromo, <strong>sin distinguir mayúsculas</strong>.</p>
<p>🏅 <strong>Ampliación:</strong> ignora también los espacios
(<em>«anita lava la tina»</em>).</p>`,
              soluciones: [
                { titulo: "Versión con Array.Reverse", codigo: r`Console.Write("Escribe una palabra: ");
string palabra = (Console.ReadLine() ?? "").ToLower();

char[] letras = palabra.ToCharArray();
Array.Reverse(letras);                         // invierte el array en el sitio
string alReves = new string(letras);

Console.WriteLine(palabra == alReves ? "Es un palíndromo" : "No es un palíndromo");
` },
                { titulo: "Versión comparando extremos", nota: "No crea ningún array nuevo: solo compara por parejas.", codigo: r`Console.Write("Escribe una palabra: ");
string palabra = (Console.ReadLine() ?? "").ToLower();

bool esPalindromo = true;
for (int i = 0; i < palabra.Length / 2; i++)
{
    if (palabra[i] != palabra[palabra.Length - 1 - i])    // primera con última, segunda con penúltima...
    {
        esPalindromo = false;
    }
}
Console.WriteLine(esPalindromo ? "Es un palíndromo" : "No es un palíndromo");
` },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "m6",
      titulo: "Ficheros",
      lecciones: [
        {
          id: "ficheros-concepto-gestion",
          titulo: "Ficheros: conceptos, archivos y carpetas",
          duracion: "15 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender qué es un fichero y los tipos de acceso", "Gestionar archivos y carpetas con File, Directory y Path", "Cerrar los recursos con using"],
          teoria: r`<p>Hasta ahora, cada vez que ejecutábamos un programa empezaba desde
cero. Si queremos que recupere los valores de la última ejecución,
necesitamos guardarlos en una estructura <strong>persistente</strong>,
como un <strong>fichero</strong> o una <strong>base de
datos</strong>.</p>
<p>Un <strong>fichero</strong> (o archivo) es una secuencia de bytes
almacenada en la memoria persistente del ordenador, identificada y
gestionada por un sistema de ficheros como una entidad lógica.</p>
<ul>
<li>Cada fichero tiene un <strong>nombre</strong> que debe ser único
dentro de la carpeta (directorio) donde se crea. Por eso la
<strong>ruta</strong> hasta el fichero es su identificador
inequívoco.</li>
<li>Su tamaño y su contenido pueden cambiar en cualquier momento.</li>
<li>El <strong>sistema de ficheros</strong> del sistema operativo
controla quién accede en cada momento y evita que dos programas lo
modifiquen a la vez. Cada vez que leemos o modificamos un fichero, en
realidad <strong>se lo pedimos al sistema operativo</strong>.</li>
</ul>
<p>Según cómo queramos leer o modificar el fichero, hay dos tipos de
acceso:</p>
<ul>
<li><strong>Acceso secuencial:</strong> leemos el contenido
<strong>desde el principio</strong>, parte por parte, como en un texto,
hasta encontrar el dato que buscamos. Su rapidez depende de lo pronto o
tarde que aparezca la información.</li>
<li><strong>Acceso directo (aleatorio):</strong> nos colocamos
<strong>directamente en una posición</strong> del fichero para leer o
modificar un dato. Es más rápido, pero requiere conocer exactamente
dónde está.</li>
</ul>
<h3 id="22-gestión-de-archivos-y-carpetas">2.2 Gestión de archivos y
carpetas</h3>
<p>En C# la información sobre archivos y carpetas se gestiona con las
clases de <code>System.IO</code>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Clase</th>
<th>Para qué sirve</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong><code>File</code></strong></td>
<td>Operaciones estáticas con <strong>archivos</strong>: comprobar si
existen, crear, copiar, mover, borrar, leer y escribir</td>
</tr>
<tr class="even">
<td><strong><code>Directory</code></strong></td>
<td>Operaciones estáticas con <strong>carpetas</strong>: crear, borrar,
listar su contenido</td>
</tr>
<tr class="odd">
<td><strong><code>Path</code></strong></td>
<td>Manipular <strong>rutas</strong> (unir, extraer el nombre o la
extensión…)</td>
</tr>
<tr class="even">
<td><strong><code>FileInfo</code></strong></td>
<td>Información de un archivo concreto (tamaño, fechas…), con una
variable por archivo</td>
</tr>
<tr class="odd">
<td><strong><code>DirectoryInfo</code></strong></td>
<td>Información de una carpeta concreta, con una variable por
carpeta</td>
</tr>
</tbody>
</table></div>
<p>Las funciones de <code>File</code> solo sirven para archivos y las de
<code>Directory</code>, para carpetas.</p>
<p>Estas son las operaciones más habituales y sus equivalentes:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Qué queremos hacer</th>
<th>Código</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>¿Existe el <strong>archivo</strong>?</td>
<td><code>File.Exists(ruta)</code> → <code>bool</code></td>
</tr>
<tr class="even">
<td>¿Existe la <strong>carpeta</strong>?</td>
<td><code>Directory.Exists(ruta)</code> → <code>bool</code></td>
</tr>
<tr class="odd">
<td><strong>Tamaño</strong> del archivo (bytes)</td>
<td><code>new FileInfo(ruta).Length</code> → <code>long</code></td>
</tr>
<tr class="even">
<td><strong>Nombre</strong> del archivo o carpeta</td>
<td><code>Path.GetFileName(ruta)</code></td>
</tr>
<tr class="odd">
<td><strong>Carpeta que contiene</strong> el archivo</td>
<td><code>Path.GetDirectoryName(ruta)</code></td>
</tr>
<tr class="even">
<td><strong>Extensión</strong></td>
<td><code>Path.GetExtension(ruta)</code></td>
</tr>
<tr class="odd">
<td><strong>Crear una carpeta</strong></td>
<td><code>Directory.CreateDirectory(ruta)</code> (crea también las
intermedias y no falla si ya existe)</td>
</tr>
<tr class="even">
<td><strong>Crear un archivo vacío</strong></td>
<td><code>File.WriteAllText(ruta, "")</code> (¡si ya existía, lo
vacía!)</td>
</tr>
<tr class="odd">
<td><strong>Renombrar o mover</strong> un archivo</td>
<td><code>File.Move(origen, destino)</code></td>
</tr>
<tr class="even">
<td><strong>Copiar</strong> un archivo</td>
<td><code>File.Copy(origen, destino)</code></td>
</tr>
<tr class="odd">
<td><strong>Borrar un archivo</strong></td>
<td><code>File.Delete(ruta)</code> (no da error si no existe)</td>
</tr>
<tr class="even">
<td><strong>Borrar una carpeta</strong></td>
<td><code>Directory.Delete(ruta, recursive: true)</code> (con todo su
contenido)</td>
</tr>
<tr class="odd">
<td><strong>Listar archivos</strong> de una carpeta</td>
<td><code>Directory.GetFiles(ruta)</code> → <code>string[]</code> con
las rutas</td>
</tr>
<tr class="even">
<td><strong>Listar subcarpetas</strong></td>
<td><code>Directory.GetDirectories(ruta)</code> →
<code>string[]</code></td>
</tr>
<tr class="odd">
<td>Listar solo un tipo de archivos</td>
<td><code>Directory.GetFiles(ruta, "*.txt")</code></td>
</tr>
</tbody>
</table></div>
<p>Ejemplo: crear una carpeta, un archivo dentro de ella, listarla y
borrarlo todo:</p>
<!--ex:0-->
<div class="callout">
<p><strong>Cuidado con los permisos.</strong> Si el programa no tiene
permiso para leer o escribir en una ruta, se lanza
<code>UnauthorizedAccessException</code>. Si no encuentra el archivo o
la carpeta, <code>FileNotFoundException</code> o
<code>DirectoryNotFoundException</code>. Todas heredan de
<code>IOException</code> o de <code>SystemException</code>, así que
conviene usar <code>try/catch</code> al trabajar con ficheros.</p>
</div>
<h3 id="23-elementos-básicos-en-la-escritura-y-lectura">2.3 Elementos
básicos en la escritura y lectura</h3>
<p>Las operaciones de lectura y escritura se dan entre las propias
variables del programa y los elementos <strong>externos</strong> al
programa, llamados <strong>periféricos</strong>: teclado, pantalla,
fichero, impresora, red…</p>
<p>Cuando trabajamos con un periférico usamos dos grandes grupos de
clases:</p>
<ul>
<li><strong>Stream (flujo):</strong> se vincula a un periférico y
permite <strong>leer o escribir bytes</strong>. En C# la clase base es
<code>Stream</code> y para ficheros se usa <code>FileStream</code>.</li>
<li><strong>Lectores y escritores (<em>readers</em> y
<em>writers</em>):</strong> como no estamos acostumbrados a trabajar con
bytes, se <strong>asocian a un stream</strong> y permiten comunicarnos
con él mediante <strong>texto</strong> (<code>string</code>). Gestionan
la codificación (UTF-8, por defecto) y usan un <strong>búfer</strong>
interno, que acumula los datos antes de enviarlos para ir más
rápido.</li>
</ul>
<p>Los dos principales son <strong><code>StreamWriter</code></strong>
(escribe texto) y <strong><code>StreamReader</code></strong> (lee
texto). Todo lo que acabamos de ver está en <code>System.IO</code>, que
se incluye por defecto en los proyectos nuevos de consola.</p>
<h4 id="cerrar-siempre-los-ficheros-using">Cerrar siempre los ficheros:
<code>using</code></h4>
<p>Los streams, lectores y escritores usan recursos del sistema
operativo, así que <strong>hay que cerrarlos</strong> cuando terminemos.
Si no, el fichero puede quedar bloqueado y parte de los datos sin
escribir. En C# se hace con la instrucción
<strong><code>using</code></strong>, que <strong>cierra el recurso
automáticamente</strong> al salir del bloque, incluso si se produce una
excepción:</p>
<!--ex:1-->
<p>O en su forma abreviada (C# 8), que cierra el recurso al terminar el
bloque de código donde se declara:</p>
<!--ex:2-->`,
          ejemplos: [
            { titulo: "Ejemplo: crear una carpeta, un archivo dentro de ella, listarla y borrarlo todo", codigo: r`string carpeta = "pruebas";                                   // ruta relativa (se explica en 2.6)
string archivo = Path.Combine(carpeta, "hola.txt");           // une carpeta y archivo con el separador correcto

Directory.CreateDirectory(carpeta);                           // crea la carpeta (si no existe)
File.WriteAllText(archivo, "¡Hola, archivo!");                // crea el archivo con ese contenido

Console.WriteLine($"¿Existe? {File.Exists(archivo)}");        // True
Console.WriteLine($"Tamaño: {new FileInfo(archivo).Length} bytes");

foreach (string ruta in Directory.GetFiles(carpeta))          // listamos los archivos de la carpeta
{
    Console.WriteLine($"Archivo encontrado: {Path.GetFileName(ruta)}");   // hola.txt
}

File.Delete(archivo);                                         // borramos el archivo
Directory.Delete(carpeta);                                    // borramos la carpeta (ya vacía)
` },
            { titulo: "Ejemplo 2", codigo: r`using (var escritor = new StreamWriter("datos.txt"))
{
    escritor.WriteLine("Hola");
}                                       // aquí se vacía el búfer y se cierra el fichero
` },
            { titulo: "Ejemplo 3", codigo: r`using var escritor = new StreamWriter("datos.txt");
escritor.WriteLine("Hola");
// al terminar el bloque que lo contiene se vacía el búfer y se cierra
` },
          ],
          actividades: [
            {
              titulo: "Explorador de carpeta",
              nivel: 2,
              enunciado: r`<p>Crea una carpeta <code>pruebas</code>, <strong>guarda dentro tres
archivos de texto</strong> (<code>a.txt</code>, <code>b.txt</code>,
<code>c.txt</code>) con contenidos de distinta longitud y
<strong>muestra el nombre y el tamaño</strong> de cada uno. Al final,
<strong>borra</strong> los archivos y la carpeta.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Usa rutas <strong>relativas</strong> y
<code>Path.Combine</code>.</li>
<li>Gestiona los posibles errores con <code>try/catch</code>
(<code>IOException</code>,
<code>UnauthorizedAccessException</code>).</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>new FileInfo(ruta).Length</code>
devuelve el tamaño en bytes.</p>`,
              soluciones: [
                { titulo: "Solución", codigo: r`string carpeta = "pruebas";

try
{
    Directory.CreateDirectory(carpeta);
    File.WriteAllText(Path.Combine(carpeta, "a.txt"), "Hola");
    File.WriteAllText(Path.Combine(carpeta, "b.txt"), "Un texto un poco más largo");
    File.WriteAllText(Path.Combine(carpeta, "c.txt"), "");

    foreach (string ruta in Directory.GetFiles(carpeta))
    {
        long tamano = new FileInfo(ruta).Length;
        Console.WriteLine($"{Path.GetFileName(ruta)}: {tamano} bytes");
    }

    Directory.Delete(carpeta, recursive: true);       // borra la carpeta con todo su contenido
    Console.WriteLine("Carpeta borrada.");
}
catch (IOException ex)
{
    Console.WriteLine($"Error de entrada/salida: {ex.Message}");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("No tienes permiso para escribir aquí.");
}
` },
              ],
            },
          ],
        },
        {
          id: "ficheros-secuencial",
          titulo: "Escritura y lectura secuencial",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Escribir texto con StreamWriter y los atajos de File", "Leer línea a línea con StreamReader", "Añadir contenido sin borrar lo anterior"],
          teoria: r`<p>Para escribir texto en un fichero usamos
<strong><code>StreamWriter</code></strong>. Basta indicarle la ruta; la
clase se encarga del stream y del búfer:</p>
<pre><code>StreamWriter variable = new StreamWriter(ruta);</code></pre>
<p>Funciones principales:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Función</th>
<th>Qué hace</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>escritor.Write("texto")</code></td>
<td>Escribe el texto <strong>sin</strong> salto de línea</td>
</tr>
<tr class="even">
<td><code>escritor.WriteLine("texto")</code></td>
<td>Escribe el texto <strong>y un salto de línea</strong></td>
</tr>
<tr class="odd">
<td><code>escritor.Flush()</code></td>
<td>Envía al fichero lo que quede en el búfer (se hace solo al
cerrar)</td>
</tr>
<tr class="even">
<td><code>escritor.Close()</code> / <code>Dispose()</code></td>
<td>Cierra el fichero (lo hace <code>using</code> por nosotros)</td>
</tr>
</tbody>
</table></div>
<p>En el siguiente ejemplo accedemos a un documento para escribir el
texto «Nuevo texto» y cerrarlo:</p>
<!--ex:0-->
<p>El diagrama de los elementos que intervienen:</p>
<pre><code>Programa ──(string)──► StreamWriter ──(bytes)──► FileStream ──► archivo en disco
                       (búfer de texto)          (flujo de bytes)</code></pre>
<div class="callout">
<p><strong>¡Atención!</strong> Cada vez que abrimos un archivo para
escribir con <code>new StreamWriter(ruta)</code>, <strong>se borra su
contenido anterior</strong>. Si queremos <strong>añadir</strong> al
final sin borrar lo que había, abrimos en <strong>modo añadir</strong>
(<code>append</code>):</p>
<pre><code>using (StreamWriter escritor = new StreamWriter(&quot;ejemplo.txt&quot;, append: true))
{
    escritor.WriteLine(&quot;Una línea más al final&quot;);
}</code></pre>
</div>
<h4 id="atajos-de-la-clase-file">Atajos de la clase
<code>File</code></h4>
<p>Para casos sencillos, <code>File</code> ofrece funciones que abren,
escriben y cierran el fichero <strong>en una sola línea</strong>:</p>
<!--ex:1-->
<h3 id="25-lectura-secuencial-de-ficheros">2.5 Lectura secuencial de
ficheros</h3>
<p>Para leer texto de un fichero usamos
<strong><code>StreamReader</code></strong>, indicándole la ruta:</p>
<pre><code>StreamReader variable = new StreamReader(ruta);</code></pre>
<p>Funciones principales:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Función</th>
<th>Qué hace</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>lector.ReadLine()</code></td>
<td>Lee <strong>una línea</strong> (hasta el salto de línea). Devuelve
<code>null</code> cuando ya no queda nada</td>
</tr>
<tr class="even">
<td><code>lector.ReadToEnd()</code></td>
<td>Lee <strong>todo</strong> lo que queda y lo devuelve como un único
texto</td>
</tr>
<tr class="odd">
<td><code>lector.EndOfStream</code></td>
<td><code>true</code> cuando ya se ha llegado al final del fichero</td>
</tr>
<tr class="even">
<td><code>lector.Close()</code> / <code>Dispose()</code></td>
<td>Cierra el fichero (lo hace <code>using</code>)</td>
</tr>
</tbody>
</table></div>
<p>Ejemplo: leer la primera línea del documento y mostrarla:</p>
<!--ex:2-->
<p>El diagrama de elementos:</p>
<pre><code>archivo en disco ──► FileStream ──(bytes)──► StreamReader ──(string)──► Programa</code></pre>
<div class="callout">
<p><strong>¡Atención!</strong> Cada vez que ejecutamos
<code>ReadLine()</code> obtenemos la <strong>siguiente</strong> línea
del archivo. Si el archivo tiene 3 líneas, la cuarta llamada devuelve
<strong><code>null</code></strong>, porque ya no queda texto.</p>
</div>
<p>Como se obtiene <code>null</code> al llegar al final, podemos
<strong>recorrer todo el archivo</strong> con un bucle que lea líneas
hasta que se acabe:</p>
<!--ex:3-->
<p>Otra forma, con <code>EndOfStream</code>:</p>
<!--ex:4-->
<h4 id="atajos-de-la-clase-file-para-leer">Atajos de la clase
<code>File</code> para leer</h4>
<!--ex:5-->
<p><code>File.ReadLines(ruta)</code> también devuelve las líneas, pero
<strong>una a una según se van pidiendo</strong> (sin cargar el archivo
entero en memoria), lo que es mejor para archivos muy grandes.</p>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`string rutaDocumento = "ejemplo.txt";                  // ruta relativa: un archivo junto al programa

using (StreamWriter escritor = new StreamWriter(rutaDocumento))
{
    escritor.Write("Nuevo texto");                     // guarda el texto en el búfer
    escritor.Flush();                                  // envía al fichero lo que quede en el búfer
}                                                      // al salir del bloque, se cierra el fichero
` },
            { titulo: "Ejemplo 2", codigo: r`File.WriteAllText("a.txt", "Todo el contenido");               // escribe (y reemplaza) todo el texto
File.AppendAllText("a.txt", "\nOtra línea al final");           // añade al final
File.WriteAllLines("b.txt", new[] { "uno", "dos", "tres" });    // una línea por elemento del array
` },
            { titulo: "Ejemplo: leer la primera línea del documento y mostrarla", codigo: r`string rutaDocumento = "ejemplo.txt";

using (StreamReader lector = new StreamReader(rutaDocumento))
{
    string? linea = lector.ReadLine();                 // leemos una línea del documento
    Console.WriteLine(linea);                          // mostramos el texto leído
}
` },
            { titulo: "Ejemplo 4", codigo: r`using (StreamReader lector = new StreamReader("ejemplo.txt"))
{
    // Empezamos leyendo la primera línea; seguimos mientras no sea null
    for (string? linea = lector.ReadLine(); linea != null; linea = lector.ReadLine())
    {
        Console.WriteLine(linea);                      // mostramos el texto leído
    }
}
` },
            { titulo: "Otra forma, con EndOfStream", codigo: r`using (StreamReader lector = new StreamReader("ejemplo.txt"))
{
    while (!lector.EndOfStream)
    {
        string linea = lector.ReadLine() ?? "";
        Console.WriteLine(linea);
    }
}
` },
            { titulo: "Atajos de la clase File para leer", codigo: r`string todo = File.ReadAllText("ejemplo.txt");         // todo el archivo en un único texto
string[] lineas = File.ReadAllLines("ejemplo.txt");    // un array con una posición por línea

foreach (string linea in lineas)
{
    Console.WriteLine(linea);
}
` },
          ],
          actividades: [
            {
              titulo: "Tres frases al fichero",
              nivel: 2,
              enunciado: r`<p>Crea un programa que <strong>pida tres frases distintas al
usuario</strong> y las guarde en un archivo de nombre
<code>ejemplo.txt</code>. Finalmente, ha de <strong>leer y mostrar por
consola</strong> el contenido de <code>ejemplo.txt</code>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Cada frase debe quedar en una <strong>línea distinta</strong> del
archivo.</li>
<li><strong>Control de errores:</strong> si no se puede escribir o leer
el fichero, muestra un mensaje claro en lugar de que el programa se
detenga.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>StreamWriter.WriteLine</code> escribe
el texto y el salto de línea.</p>
<p>🥉 <strong>Alternativa más sencilla:</strong> usa
<code>File.WriteAllLines</code> y <code>File.ReadAllLines</code>.</p>
<p>🏅 <strong>Ampliación:</strong> si el archivo ya existe,
<strong>añade</strong> las frases al final en lugar de borrar lo
anterior.</p>`,
              soluciones: [
                { titulo: "Solución · versión con `StreamWriter` y `StreamReader`", codigo: r`string rutaDocumento = Path.Combine(Directory.GetCurrentDirectory(), "ejemplo.txt");   // ruta relativa al programa

try
{
    // 1) Pedimos las frases y las escribimos en el fichero
    using (StreamWriter escritor = new StreamWriter(rutaDocumento))
    {
        for (int numero = 1; numero <= 3; numero++)
        {
            Console.WriteLine($"Escribe la frase {numero}:");
            string textoIntroducido = Console.ReadLine() ?? "";    // leemos por teclado
            escritor.WriteLine(textoIntroducido);                  // una frase por línea
        }
    }                                                              // aquí se cierra el fichero

    // 2) Leemos el archivo y mostramos su contenido
    Console.WriteLine();
    Console.WriteLine("Contenido de ejemplo.txt:");

    using (StreamReader lector = new StreamReader(rutaDocumento))
    {
        for (string? linea = lector.ReadLine(); linea != null; linea = lector.ReadLine())
        {
            Console.WriteLine(linea);                              // mostramos el texto leído
        }
    }
}
catch (IOException ex)
{
    Console.WriteLine($"Error de entrada/salida: {ex.Message}");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("No tienes permiso para escribir en esa ubicación.");
}
` },
                { titulo: "Solución · versión corta con `File`", codigo: r`string rutaDocumento = Path.Combine(Directory.GetCurrentDirectory(), "ejemplo.txt");
string[] frases = new string[3];

for (int k = 0; k < frases.Length; k++)
{
    Console.WriteLine($"Escribe la frase {k + 1}:");
    frases[k] = Console.ReadLine() ?? "";
}

try
{
    File.WriteAllLines(rutaDocumento, frases);                     // guarda una frase por línea

    Console.WriteLine();
    foreach (string linea in File.ReadAllLines(rutaDocumento))     // lee y muestra
    {
        Console.WriteLine(linea);
    }
}
catch (IOException ex)
{
    Console.WriteLine($"Error de entrada/salida: {ex.Message}");
}
catch (UnauthorizedAccessException)
{
    Console.WriteLine("No tienes permiso para escribir en esa ubicación.");
}
` },
              ],
            },
            {
              titulo: "Registro de puntuaciones",
              nivel: 3,
              enunciado: r`<p>Crea un programa que <strong>añada</strong> puntuaciones a un archivo
<code>puntuaciones.txt</code> (una por línea, con el formato
<code>nombre;puntos</code>) y después <strong>lea el archivo</strong> y
muestre <strong>quién tiene la puntuación más alta</strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Pide <strong>2 puntuaciones</strong> al usuario cada vez que se
ejecuta. El archivo <strong>no debe borrarse</strong> entre ejecuciones
(usa <code>AppendAllText</code> o <code>StreamWriter</code> en modo
<code>append</code>).</li>
<li><strong>Control de errores:</strong> los puntos deben ser un entero
≥ 0 (<code>int.TryParse</code>).</li>
<li>Al leer, ignora las líneas mal formadas.</li>
</ul>
<p>💡 <strong>TIP:</strong> <code>linea.Split(';')</code> separa el
texto en un array.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Cada ejecución añade dos líneas más: el récord se calcula con todo el histórico.", codigo: r`string ruta = Path.Combine(Directory.GetCurrentDirectory(), "puntuaciones.txt");

for (int i = 1; i <= 2; i++)
{
    Console.Write($"Nombre del jugador {i}: ");
    string nombre = Console.ReadLine() ?? "";
    int puntos;
    Console.Write("Puntos: ");
    while (!int.TryParse(Console.ReadLine(), out puntos) || puntos < 0)
    {
        Console.Write("Puntos no válidos. Escribe un entero (0 o más): ");
    }
    File.AppendAllText(ruta, $"{nombre};{puntos}{Environment.NewLine}");   // añade al final
}

string mejor = "";
int maximo = -1;
foreach (string linea in File.ReadAllLines(ruta))
{
    string[] partes = linea.Split(';');
    if (partes.Length == 2 && int.TryParse(partes[1], out int p) && p > maximo)
    {
        maximo = p;
        mejor = partes[0];
    }
}
Console.WriteLine($"Récord: {mejor} con {maximo} puntos");
` },
              ],
            },
          ],
        },
        {
          id: "ficheros-rutas-directo",
          titulo: "Rutas, valores del sistema y acceso directo",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Usar rutas relativas y Path.Combine", "Conocer los saltos de línea y carpetas del sistema", "Leer y escribir en una posición concreta con FileStream"],
          teoria: r`<p>C# funciona en distintos sistemas operativos (Windows, Linux, macOS),
así que debemos diseñar los programas para que funcionen
<strong>independientemente de la plataforma</strong>. Cada sistema puede
tener sistemas de archivos muy distintos, con separadores de carpetas y
unidades propios.</p>
<h4 id="261-rutas-relativas-frente-a-absolutas">2.6.1 Rutas relativas
frente a absolutas</h4>
<p>En ejemplos anteriores hemos accedido a un archivo con una ruta como
<code>D:\ejemplo.txt</code>. ¿Qué pasa si el ordenador no tiene unidad
D? Se produce un error al no encontrar la ubicación.</p>
<p>Una ruta con todo el camino completo (desde la raíz) se llama
<strong>ruta absoluta</strong>, y debemos <strong>evitarlas</strong> en
los programas. En su lugar usamos <strong>rutas relativas</strong>, en
las que solo indicamos dónde está el archivo <strong>respecto al
programa</strong>.</p>
<p>Para conocer la <strong>carpeta de trabajo actual</strong> de nuestro
programa:</p>
<!--ex:0-->
<p>Con <code>dotnet run</code>, la carpeta de trabajo es la carpeta del
proyecto. Si ejecutas el programa ya compilado desde otra carpeta, la
carpeta de trabajo será <strong>esa otra</strong> carpeta. Para saber
dónde está el propio programa compilado existe
<code>AppContext.BaseDirectory</code>.</p>
<h4 id="262-separadores-de-rutas-según-el-sistema-operativo">2.6.2
Separadores de rutas según el sistema operativo</h4>
<p>Cada sistema usa un carácter distinto para separar las carpetas: en
Windows, <code>ejemplo\archivo.txt</code>; en Linux y macOS,
<code>ejemplo/archivo.txt</code>.</p>
<p><strong>No escribas los separadores a mano.</strong> Usa
<strong><code>Path.Combine</code></strong>, que une las partes con el
separador correcto del sistema:</p>
<!--ex:1-->
<h4 id="263-saltos-de-línea">2.6.3 Saltos de línea</h4>
<p>El texto que marca un salto de línea también depende del sistema
(Windows usa <code>\r\n</code>; Linux y macOS, <code>\n</code>). Para
obtenerlo se usa <strong><code>Environment.NewLine</code></strong>:</p>
<!--ex:2-->
<p>Las funciones <code>WriteLine</code> (de la consola y de
<code>StreamWriter</code>) ya usan el salto de línea del sistema, así
que normalmente no hace falta escribirlo a mano.</p>
<h4 id="carpetas-especiales">Carpetas especiales</h4>
<p>Para guardar datos de usuario sin usar rutas absolutas existen las
<strong>carpetas especiales</strong> del sistema:</p>
<!--ex:3-->
<p>Ejemplo que combina los valores del sistema: escribe un archivo en la
carpeta de trabajo con dos líneas y lo lee.</p>
<!--ex:4-->
<p>Hasta ahora hemos visto el acceso <strong>secuencial</strong>. En el
acceso <strong>directo</strong>, el contenido del fichero se trata como
una <strong>sucesión de bytes numerados</strong>, y existe un
<strong>puntero</strong> (la <em>posición actual</em>) que indica dónde
se hará la siguiente operación. Cada vez que queremos leer o escribir,
primero <strong>colocamos el puntero</strong> en una posición y después
leemos o escribimos desde ahí.</p>
<p>En C# el acceso directo se hace con
<strong><code>FileStream</code></strong>, indicando la ruta, el modo de
apertura y el tipo de acceso:</p>
<pre><code>FileStream variable = new FileStream(&quot;ruta archivo&quot;, FileMode.modo, FileAccess.acceso);</code></pre>
<ul>
<li><code>FileMode.Open</code>: abre un fichero que <strong>ya
existe</strong>. <code>FileMode.OpenOrCreate</code>: lo abre o lo crea
si no existe. <code>FileMode.Create</code>: lo crea (si existía, lo
vacía).</li>
<li><code>FileAccess.Read</code>: solo para <strong>leer</strong>.
<code>FileAccess.Write</code>: solo para escribir.
<code>FileAccess.ReadWrite</code>: para <strong>leer y
modificar</strong>.</li>
</ul>
<p>Las principales funciones y propiedades:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Código</th>
<th>Qué hace</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>flujo.Seek(numero, SeekOrigin.Begin)</code></td>
<td><strong>Sitúa el puntero</strong> en la posición indicada (la
primera posición es la 0). <code>SeekOrigin.End</code> cuenta desde el
final</td>
</tr>
<tr class="even">
<td><code>flujo.Position</code></td>
<td><strong>Posición actual</strong> del puntero</td>
</tr>
<tr class="odd">
<td><code>flujo.Length</code></td>
<td><strong>Longitud</strong> del fichero en bytes</td>
</tr>
<tr class="even">
<td><code>flujo.ReadByte()</code></td>
<td>Lee el byte de la posición actual y avanza el puntero (devuelve
<code>-1</code> al final)</td>
</tr>
<tr class="odd">
<td><code>flujo.Read(buffer, 0, n)</code></td>
<td>Lee hasta <code>n</code> bytes en un array y devuelve cuántos ha
leído</td>
</tr>
<tr class="even">
<td><code>flujo.WriteByte(b)</code></td>
<td>Escribe un byte en la posición actual</td>
</tr>
<tr class="odd">
<td><code>flujo.Write(bytes, 0, n)</code></td>
<td>Escribe <code>n</code> bytes, <strong>sobrescribiendo</strong> los
que había, y amplía el fichero si hace falta</td>
</tr>
</tbody>
</table></div>
<p>Como el <code>FileStream</code> trabaja con <strong>bytes</strong>,
para escribir o leer texto lo convertimos con la clase
<code>Encoding</code> (<code>using System.Text;</code>).</p>
<p>El siguiente ejemplo lee las 7 primeras letras del documento,
modifica el principio del texto y añade una línea al final:</p>
<!--ex:5-->
<div class="callout">
<p><strong>Posiciones en bytes, no en letras.</strong> Las posiciones
son <strong>bytes</strong>, y en UTF-8 algunas letras (como
<code>ñ</code> o las vocales con tilde) ocupan <strong>más de
uno</strong>. Por eso el acceso directo funciona mejor con datos de
<strong>longitud fija</strong> (por ejemplo, registros de tamaño
conocido) que con texto libre.</p>
</div>
<hr />
<ul>
<li>Entrada y salida de ficheros y flujos: <a
href="https://learn.microsoft.com/dotnet/standard/io/">https://learn.microsoft.com/dotnet/standard/io/</a></li>
<li>Clase <code>File</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.file">https://learn.microsoft.com/dotnet/api/system.io.file</a></li>
<li>Clase <code>Directory</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.directory">https://learn.microsoft.com/dotnet/api/system.io.directory</a></li>
<li>Clase <code>Path</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.path">https://learn.microsoft.com/dotnet/api/system.io.path</a></li>
<li>Clase <code>StreamReader</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.streamreader">https://learn.microsoft.com/dotnet/api/system.io.streamreader</a></li>
<li>Clase <code>StreamWriter</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.streamwriter">https://learn.microsoft.com/dotnet/api/system.io.streamwriter</a></li>
<li>Clase <code>FileStream</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.io.filestream">https://learn.microsoft.com/dotnet/api/system.io.filestream</a></li>
</ul>`,
          ejemplos: [
            { titulo: "Para conocer la carpeta de trabajo actual de nuestro programa", codigo: r`string rutaProyecto = Directory.GetCurrentDirectory();       // carpeta desde la que se ejecuta el programa
Console.WriteLine(rutaProyecto);
` },
            { titulo: "Ejemplo 2", codigo: r`string ruta = Path.Combine("ejemplo", "datos", "archivo.txt");
Console.WriteLine(ruta);                               // ejemplo\datos\archivo.txt (Windows) o ejemplo/datos/archivo.txt (Linux, macOS)

Console.WriteLine(Path.DirectorySeparatorChar);        // el carácter separador del sistema: \ o /
` },
            { titulo: "Ejemplo 3", codigo: r`string saltoLinea = Environment.NewLine;
string texto = "primera línea" + saltoLinea + "segunda línea";
` },
            { titulo: "Ejemplo 4", codigo: r`string documentos = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
string temporal = Path.GetTempPath();
Console.WriteLine(Path.Combine(documentos, "mis datos.txt"));
` },
            { titulo: "Ejemplo 5", codigo: r`string rutaDocumento = Path.Combine(Directory.GetCurrentDirectory(), "ejemplo.txt");
string saltoLinea = Environment.NewLine;

File.WriteAllText(rutaDocumento, "primera línea" + saltoLinea + "segunda línea");

foreach (string linea in File.ReadAllLines(rutaDocumento))
{
    Console.WriteLine(linea);
}
` },
            { titulo: "Ejemplo 6", codigo: r`using System.Text;

string ruta = Path.Combine(Directory.GetCurrentDirectory(), "ejemplo.txt");
File.WriteAllText(ruta, "primera linea" + Environment.NewLine + "segunda linea");   // preparamos el archivo

using (FileStream flujo = new FileStream(ruta, FileMode.Open, FileAccess.ReadWrite))
{
    // 1) Leer: colocamos el puntero en la posición 0 y leemos 7 bytes
    flujo.Seek(0, SeekOrigin.Begin);
    byte[] buffer = new byte[7];
    int leidos = flujo.Read(buffer, 0, buffer.Length);
    Console.WriteLine(Encoding.UTF8.GetString(buffer, 0, leidos));      // primera

    // 2) Modificar: volvemos al principio y sobrescribimos con otras letras
    flujo.Seek(0, SeekOrigin.Begin);
    byte[] nuevo = Encoding.UTF8.GetBytes("PRIMERA");
    flujo.Write(nuevo, 0, nuevo.Length);

    // 3) Añadir: nos movemos al final y escribimos a continuación
    flujo.Seek(0, SeekOrigin.End);
    byte[] extra = Encoding.UTF8.GetBytes(Environment.NewLine + "nueva linea añadida");
    flujo.Write(extra, 0, extra.Length);
}

Console.WriteLine(File.ReadAllText(ruta));
// PRIMERA linea
// segunda linea
// nueva linea añadida
` },
          ],
          actividades: [
            {
              titulo: "Editar bytes con Seek",
              nivel: 3,
              enunciado: r`<p>Crea un archivo <code>datos.txt</code> con el texto
<code>AAAAAAAAAA</code> (10 letras A). Con un
<strong><code>FileStream</code></strong> y acceso directo,
<strong>cambia las posiciones 3, 4 y 5</strong> por <code>BBB</code> y
después <strong>muestra el archivo completo</strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Las posiciones empiezan en <strong>0</strong>.</li>
<li>Usa <code>Seek(3, SeekOrigin.Begin)</code> antes de escribir.</li>
</ul>
<p>🏅 <strong>Ampliación:</strong> añade <code>CCC</code> al final del
archivo sin borrar nada.</p>`,
              soluciones: [
                { titulo: "Solución", nota: "En acceso directo las posiciones son bytes: con letras sin tilde, 1 byte = 1 letra.", codigo: r`using System.Text;

string ruta = Path.Combine(Directory.GetCurrentDirectory(), "datos.txt");
File.WriteAllText(ruta, "AAAAAAAAAA");

using (FileStream flujo = new FileStream(ruta, FileMode.Open, FileAccess.ReadWrite))
{
    flujo.Seek(3, SeekOrigin.Begin);                       // el puntero pasa a la posición 3
    byte[] bytes = Encoding.UTF8.GetBytes("BBB");
    flujo.Write(bytes, 0, bytes.Length);                   // sobrescribe 3 bytes

    flujo.Seek(0, SeekOrigin.End);                         // ampliación: nos movemos al final
    byte[] final = Encoding.UTF8.GetBytes("CCC");
    flujo.Write(final, 0, final.Length);
}

Console.WriteLine(File.ReadAllText(ruta));                 // AAABBBAAAACCC
` },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "m7",
      titulo: "Programación orientada a objetos",
      lecciones: [
        {
          id: "poo-introduccion",
          titulo: "Introducción a la POO: clases y objetos",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender por qué necesitamos las clases", "Conocer los pilares de la POO", "Definir una clase y crear objetos con new"],
          teoria: r`<p>Hasta ahora, cuando queríamos agrupar información en una sola
variable solo podíamos usar <strong>arrays</strong>. Pero un array solo
sirve para guardar <strong>el mismo tipo de dato</strong>. ¿Qué hacemos
si queremos guardar en una única variable información de distinto tipo,
por ejemplo sobre un alumno?</p>
<pre><code>┌──────────────────────┐
│ Nombre        (string)  │
│ Asignaturas   (array)   │   ← un alumno agrupa datos de distinto tipo
│ Edad          (int)     │
└──────────────────────┘</code></pre>
<p>Siempre que queramos crear una estructura formada por datos de
distinto tipo, crearemos una <strong>clase</strong>. Podemos pensar que
una <strong>clase es un molde</strong> a partir del cual se generan
distintos <strong>objetos</strong> (variables).</p>
<h3 id="12-características-de-la-poo">1.2 Características de la POO</h3>
<p>La POO busca que cada clase ofrezca un conjunto de funciones y datos
para resolver <strong>una necesidad concreta</strong>. Si conseguimos
que esa clase funcione bien, cada vez que tengamos esa necesidad
<strong>reutilizamos</strong> la clase; si hay un error, solo corregimos
esa clase; y si aparece una necesidad más específica, creamos una clase
derivada.</p>
<p>Los <strong>cuatro pilares</strong> de la POO son:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Pilar</th>
<th>Idea</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong>Abstracción</strong></td>
<td>Para usar una clase no hace falta saber <strong>cómo</strong> está
programada, solo <strong>cómo se usa</strong>. Usamos
<code>Console.WriteLine</code> sin conocer su código por dentro.</td>
</tr>
<tr class="even">
<td><strong>Encapsulamiento</strong></td>
<td>Una clase solo expone lo necesario para usarla y
<strong>oculta</strong> sus detalles internos (lo
<code>private</code>).</td>
</tr>
<tr class="odd">
<td><strong>Herencia</strong></td>
<td>Una clase puede <strong>derivar de otra</strong>, heredando sus
miembros y reaprovechando su código, que puede ampliar o modificar.</td>
</tr>
<tr class="even">
<td><strong>Polimorfismo</strong></td>
<td>Una variable del tipo de la clase madre puede
<strong>referenciar</strong> objetos de las clases hijas, y cada uno se
comporta a su manera.</td>
</tr>
</tbody>
</table></div>
<p>A medida que avancemos veremos cómo se cumplen.</p>
<h3 id="13-definir-una-clase">1.3 Definir una clase</h3>
<p>Una clase se declara con la palabra <code>class</code>, seguida de su
nombre, y un bloque <code>{ … }</code>:</p>
<pre><code>class NombreDeLaClase
{
    …
}</code></pre>
<ul>
<li>El nombre de la clase se escribe en <strong>PascalCase</strong>
(<code>Dni</code>, <code>AlimentoSolido</code>).</li>
<li>Por costumbre, cada clase va en su propio archivo con el mismo
nombre (<code>Dni.cs</code>), pero <strong>el compilador no lo
exige</strong> (a diferencia de Java).</li>
</ul>
<p>Dentro de las llaves definimos los <strong>datos</strong> que
formarán la estructura. Los declaramos como variables, y a las que
pertenecen a la clase las llamamos <strong>atributos</strong> o
<strong>campos</strong> (<em>fields</em>). Al declarar un campo podemos
darle un <strong>valor por defecto</strong>.</p>
<p>Ejemplo: la clase <code>Dni</code> formada por <code>Nombre</code>,
<code>Edad</code>, <code>Numero</code> y <code>Letra</code> (faltan
datos, pero es un ejemplo):</p>
<!--ex:0-->
<div class="callout">
<p><strong>¿Por qué <code>public</code>?</strong> En C# los miembros de
una clase son <strong><code>private</code> por defecto</strong>, es
decir, solo accesibles desde dentro de la propia clase. Para que el
programa principal pueda leerlos y modificarlos, de momento los marcamos
<code>public</code>. En el Tema 2 veremos por qué esto conviene
<strong>evitarlo</strong>.</p>
</div>
<h4 id="métodos">Métodos</h4>
<p>Una clase también puede tener <strong>funcionalidades</strong> para
trabajar con sus datos. Las definimos como funciones dentro de la clase
y las llamamos <strong>métodos</strong>. Así, una clase está formada por
<strong>atributos</strong> y <strong>métodos</strong>. Añadamos a
<code>Dni</code> un método que indique si la persona es mayor de
edad:</p>
<!--ex:1-->
<div class="callout">
<p>Una clase <strong>no tiene por qué tener <code>Main</code></strong>.
El punto de entrada solo lo tienen las clases (o el archivo
<code>Program.cs</code>) que se pueden ejecutar por sí mismas.</p>
</div>
<div class="callout">
<p><strong>¡Atención!</strong> Directamente dentro de una clase solo se
pueden declarar <strong>miembros</strong> (atributos, métodos,
constructores…). No puede haber instrucciones sueltas como
<code>Console.WriteLine("hola");</code>.</p>
</div>
<h3 id="14-clases-y-objetos">1.4 Clases y objetos</h3>
<ul>
<li>Una <strong>clase</strong> es la <strong>definición</strong> de una
estructura de datos: qué datos y qué funciones tendrán todas las
variables que la usen.</li>
<li>Un <strong>objeto</strong> es una variable que usa esa estructura,
con sus <strong>propios valores</strong>.</li>
</ul>
<p>Símil real: todos los DNI tienen la misma estructura (nombre, número,
fecha de nacimiento…), pero los valores de cada uno son distintos. La
<strong>plantilla</strong> es la <strong>clase</strong>
<code>Dni</code>; cada documento concreto es un
<strong>objeto</strong>.</p>
<h4 id="crear-un-objeto">Crear un objeto</h4>
<p><strong>Crear un objeto</strong> significa
<strong>instanciar</strong> una clase: crear una variable con la
estructura definida en ella. Se hace con la palabra
<code>new</code>:</p>
<pre><code>NombreDeLaClase nombreObjeto = new NombreDeLaClase();</code></pre>
<!--ex:2-->
<div class="callout">
<p>Desde que empezamos a programar ya usábamos clases y objetos:
<code>Console</code>, <code>string</code>, <code>Random</code>… En C#,
todo lo que no sea una estructura de control de flujo es un tipo (clase,
estructura, enumeración…).</p>
</div>
<h4 id="usar-los-atributos-y-métodos-de-un-objeto">Usar los atributos y
métodos de un objeto</h4>
<ul>
<li>Acceder a un atributo: <code>variableObjeto.Atributo</code></li>
<li>Llamar a un método: <code>variableObjeto.Metodo()</code></li>
</ul>
<p>Se puede hacer desde cualquier punto del programa, siempre que el
objeto esté declarado e inicializado.</p>
<!--ex:3-->
<div class="callout">
<p>En C#, <code>Console.WriteLine</code> muestra los booleanos como
<code>True</code> y <code>False</code> (con mayúscula inicial).</p>
</div>
<h4 id="inicializador-de-objetos">Inicializador de objetos</h4>
<p>Asignar atributo a atributo es largo (¡5 líneas para un solo
objeto!). Una forma más cómoda es el <strong>inicializador de
objetos</strong>, que da valor a los atributos al crear el objeto, entre
llaves:</p>
<!--ex:4-->
<p>Pero lo más habitual es usar <strong>constructores</strong>, que
veremos enseguida. Antes, un pequeño problema con los nombres.</p>`,
          ejemplos: [
            { titulo: "Clase Dni", noRun: true, codigo: r`// Dni.cs
public class Dni
{
    public string Nombre = "";     // valor por defecto: texto vacío
    public int Edad = 10;          // valor por defecto: 10
    public int Numero;             // sin valor indicado: vale 0
    public char Letra;             // sin valor indicado: vale '\0'
}
` },
            { titulo: "Clase Dni", noRun: true, codigo: r`// Dni.cs
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    // Devuelve true si la persona tiene 18 años o más
    public bool MayorEdad()
    {
        return Edad >= 18;
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`Dni dniRyu = new Dni();         // forma clásica
Dni dniKen = new();             // tipo "target-typed" (C# 9): el tipo se deduce de la izquierda
var dniChun = new Dni();        // con var, el tipo se deduce de la derecha

// ===== Dni =====
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    // Devuelve true si la persona tiene 18 años o más
    public bool MayorEdad()
    {
        return Edad >= 18;
    }
}
` },
            { titulo: "Ejemplo 4", codigo: r`Dni dniRyu = new Dni();
dniRyu.Nombre = "Ryu";
dniRyu.Numero = 12345678;
dniRyu.Letra = 'Z';
dniRyu.Edad = 54;

bool mayor = dniRyu.MayorEdad();
Console.WriteLine($"¿Es mayor de edad? {mayor}");     // ¿Es mayor de edad? True
Console.WriteLine($"Nombre: {dniRyu.Nombre}");        // Nombre: Ryu

// ===== Dni =====
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    // Devuelve true si la persona tiene 18 años o más
    public bool MayorEdad()
    {
        return Edad >= 18;
    }
}
` },
            { titulo: "Ejemplo 5", codigo: r`Dni dniRyu = new Dni { Nombre = "Ryu", Numero = 12345678, Letra = 'Z', Edad = 54 };

// ===== Dni =====
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    // Devuelve true si la persona tiene 18 años o más
    public bool MayorEdad()
    {
        return Edad >= 18;
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Jugador de videojuego",
              nivel: 1,
              enunciado: r`<p>Crea una clase <strong><code>Jugador</code></strong> con los
atributos <strong><code>Nombre</code></strong> (texto) y
<strong><code>Vida</code></strong> (entero, por defecto 100), y los
métodos <strong><code>RecibirDanio(int puntos)</code></strong> (resta
vida, sin bajar de 0) y <strong><code>EstaVivo()</code></strong>
(devuelve <code>true</code> si la vida es mayor que 0). Crea dos
jugadores y haz que uno reciba daño hasta quedarse sin vida.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>De momento los atributos son <code>public</code> y los objetos se
crean con <code>new Jugador()</code>.</li>
<li>La vida <strong>nunca</strong> debe quedar por debajo de 0.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", codigo: r`Jugador ana = new Jugador();
ana.Nombre = "Ana";
Jugador luis = new Jugador { Nombre = "Luis" };     // inicializador de objetos

ana.RecibirDanio(60);
Console.WriteLine($"{ana.Nombre}: {ana.Vida} de vida");       // 40
ana.RecibirDanio(80);
Console.WriteLine($"{ana.Nombre}: {ana.Vida}, ¿vivo? {ana.EstaVivo()}");   // 0, False
Console.WriteLine($"{luis.Nombre}: {luis.Vida}");              // 100: cada objeto tiene su propia vida

class Jugador
{
    public string Nombre = "";
    public int Vida = 100;

    public void RecibirDanio(int puntos)
    {
        Vida = Math.Max(0, Vida - puntos);     // nunca baja de 0
    }

    public bool EstaVivo()
    {
        return Vida > 0;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-this-constructores",
          titulo: "this, constructores y ciclo de vida",
          duracion: "16 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Usar this para referirse al objeto actual", "Escribir constructores y encadenarlos", "Entender el ciclo de vida de un objeto y el recolector de basura"],
          teoria: r`<p>Los atributos de una clase son <strong>directamente accesibles desde
todos los métodos de la clase</strong>. Pero ¿qué pasa si en un método
declaramos una variable (o un parámetro) con <strong>el mismo
nombre</strong> que un atributo?</p>
<p>Cuando usamos un nombre, C# lo busca desde el bloque <strong>más
específico</strong> al más general. Así, si hay una variable local o un
parámetro con ese nombre, <strong>tiene prioridad</strong> sobre el
atributo de la clase.</p>
<p>¿Y cómo accedemos entonces al atributo? Con la palabra clave
<strong><code>this</code></strong>, que <strong>hace referencia al
objeto que está ejecutando el método</strong>.</p>
<p>Veámoslo con una clase de videojuegos. (Los campos
<code>private</code> los explicamos en el Tema 2: de momento, fíjate
solo en el <code>this</code>.)</p>
<!--ex:0-->
<div class="callout">
<p><strong>Buena costumbre:</strong> muchos equipos nombran los campos
privados con prefijo <code>_</code> (<code>_vida</code>) para evitar
esta confusión. Nosotros usaremos <code>this.</code> cuando haga
falta.</p>
</div>
<h3 id="16-constructores">1.6 Constructores</h3>
<p>Un <strong>constructor</strong> es un método especial que se ejecuta
<strong>inmediatamente al crear un objeto</strong>. Con él podemos crear
el objeto y dar valor a sus atributos <strong>en una sola
línea</strong>.</p>
<p>Se define como un método normal, con estas reglas:</p>
<ul>
<li><strong>No indica tipo de retorno</strong> (ni siquiera
<code>void</code>): siempre genera un objeto de su clase.</li>
<li>Tiene <strong>el mismo nombre que la clase</strong>.</li>
<li><strong>No se puede llamar</strong> una vez creado el objeto.</li>
<li>Puede haber <strong>varios constructores</strong> si se diferencian
en el número o tipo de parámetros (<strong>sobrecarga</strong>).</li>
<li>Normalmente se declaran <strong><code>public</code></strong> (si no,
solo se podrían usar desde dentro de la clase).</li>
</ul>
<pre><code>public NombreClase() { … }
public NombreClase(string param) { … }
public NombreClase(int param) { … }</code></pre>
<p>Al crear un objeto se llama automáticamente al constructor que
coincide en número y tipo de parámetros:</p>
<pre><code>NombreClase var1 = new NombreClase();         // constructor sin parámetros
NombreClase var2 = new NombreClase(&quot;Pepe&quot;);   // constructor con un string
NombreClase var3 = new NombreClase(33);       // constructor con un int</code></pre>
<p><strong>Constructor por defecto.</strong> Si no escribimos ningún
constructor, el compilador crea uno <strong>sin parámetros</strong>.
Pero en cuanto definimos <strong>algún</strong> constructor,
<strong>desaparece el automático</strong>: si lo queremos, tenemos que
escribirlo nosotros.</p>
<p>Ejemplo: la clase <code>Dni</code> con tres constructores.</p>
<!--ex:1-->
<h4 id="encadenar-constructores-de-fácil-a-profesional">Encadenar
constructores (de fácil a profesional)</h4>
<p>Fíjate en que los constructores repiten código. Un constructor puede
<strong>llamar a otro</strong> de la misma clase con
<code>: this(…)</code>:</p>
<!--ex:2-->
<h4 id="constructor-primario-c-12--nivel-profesional">Constructor
primario (C# 12) — nivel profesional</h4>
<p>Desde C# 12, los parámetros se pueden poner <strong>directamente en
la declaración de la clase</strong>, lo que ahorra mucho código
repetitivo:</p>
<!--ex:3-->
<h3 id="17-el-ciclo-de-vida-de-un-objeto">1.7 El ciclo de vida de un
objeto</h3>
<p>Cada vez que se crea un objeto en C# se hacen
<strong>automáticamente</strong> estas operaciones:</p>
<ol type="1">
<li>Se <strong>reserva memoria</strong> para el objeto.</li>
<li>Se <strong>inicializan los atributos</strong> con su valor por
defecto (<code>0</code>, <code>false</code>, <code>null</code>…) o con
el valor que indique su declaración.</li>
<li>Se ejecuta el <strong>constructor</strong> que corresponda.</li>
</ol>
<p>Si nunca se liberara memoria, el ordenador acabaría lleno de
variables en desuso. Por suerte, en C# no tenemos que borrarlas a mano:
lo hace el <strong>recolector de basura</strong> (<em>Garbage
Collector</em>, GC).</p>
<p>Cuando el GC detecta que un objeto <strong>ya no se puede
alcanzar</strong> desde ninguna variable del programa, lo marca para
eliminar y libera su memoria <strong>cuando lo considera
oportuno</strong> (no podemos saber exactamente cuándo).</p>
<div class="callout">
<p><strong>¿Y los destructores?</strong> C# permite escribir un
<em>finalizador</em> (<code>~Dni() { … }</code>), pero <strong>casi
nunca hace falta</strong>. Para liberar recursos que no son memoria
(ficheros, conexiones…) usamos <code>IDisposable</code> y la instrucción
<strong><code>using</code></strong>, tal como vimos con los ficheros en
la UF3.</p>
</div>`,
          ejemplos: [
            { titulo: "Clase Jugador", noRun: true, codigo: r`// Jugador.cs
public class Jugador
{
    private string nombre = "";
    private int vida;

    // El parámetro 'vida' tapa al atributo 'vida'.
    // Con this.vida nos referimos al atributo del objeto.
    public void SetVida(int vida)
    {
        if (vida >= 0 && vida <= 100)
        {
            this.vida = vida;           // atributo = parámetro
        }
    }

    public int GetVida()
    {
        return vida;                    // aquí no hay ambigüedad: es el atributo
    }
}
` },
            { titulo: "Ejemplo: la clase Dni con tres constructores", codigo: r`Dni dniRyu = new Dni(54, 12345678, 'Z');     // usa el constructor de 3 parámetros
dniRyu.Nombre = "Ryu";

Dni dniKen = new Dni(53);                    // usa el constructor de 1 parámetro
dniKen.Nombre = "Ken";

Console.WriteLine($"{dniRyu.Nombre}: {dniRyu.Edad} años, DNI {dniRyu.Numero}{dniRyu.Letra}");
// Ryu: 54 años, DNI 12345678Z

// ===== Dni.cs =====
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    // Constructor sin parámetros (lo escribimos porque hay otros)
    public Dni() { }

    // Constructor con 1 parámetro int
    public Dni(int edad)
    {
        this.Edad = edad;               // aquí 'this' es opcional: no hay ambigüedad
    }

    // Constructor con 3 parámetros
    public Dni(int edad, int numero, char letra)
    {
        Edad = edad;
        Numero = numero;
        Letra = letra;
    }
}
` },
            { titulo: "Clase Dni", noRun: true, codigo: r`// Dni.cs
public class Dni
{
    public string Nombre = "";
    public int Edad;
    public int Numero;
    public char Letra;

    public Dni() { }

    public Dni(int edad, int numero, char letra)
    {
        Edad = edad;
        Numero = numero;
        Letra = letra;
    }

    // Reutiliza el constructor de 3 parámetros con valores por defecto
    public Dni(int edad) : this(edad, 0, 'A') { }
}
` },
            { titulo: "Clase Jugador", noRun: true, codigo: r`// Jugador.cs
public class Jugador(string nombre, int vida)
{
    public string Nombre { get; } = nombre;     // inicializamos con el parámetro del constructor
    public int Vida { get; set; } = vida;
}
` },
          ],
          actividades: [
            {
              titulo: "Arma con constructores",
              nivel: 2,
              enunciado: r`<p>Crea una clase <strong><code>Arma</code></strong> con
<strong><code>Nombre</code></strong>,
<strong><code>Danio</code></strong> y
<strong><code>Municion</code></strong>. Escribe <strong>dos
constructores</strong>: uno que reciba los tres datos y otro que reciba
solo el nombre y ponga daño 10 y munición 5 (reutilizando el primero con
<code>: this(...)</code>). Añade un método
<strong><code>Disparar()</code></strong> que gaste una munición y diga
si ha podido disparar.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Los parámetros se llaman igual que los atributos privados: usa
<strong><code>this.</code></strong>.</li>
<li>Si no queda munición, <code>Disparar</code> devuelve
<code>false</code>.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", codigo: r`Arma pistola = new Arma("Pistola", 25, 2);
Arma navaja = new Arma("Navaja");                 // daño 10 y munición 5 por defecto

Console.WriteLine(pistola.Disparar());   // True
Console.WriteLine(pistola.Disparar());   // True
Console.WriteLine(pistola.Disparar());   // False: sin munición
Console.WriteLine($"{navaja.Nombre}: daño {navaja.Danio}");

class Arma
{
    public string Nombre;
    public int Danio;
    private int municion;

    public Arma(string nombre, int danio, int municion)
    {
        this.Nombre = nombre;
        this.Danio = danio;
        this.municion = municion;          // this distingue el atributo del parámetro
    }

    public Arma(string nombre) : this(nombre, 10, 5) { }   // reutiliza el otro constructor

    public bool Disparar()
    {
        if (municion > 0)
        {
            municion--;
            return true;
        }
        return false;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-composicion-referencias",
          titulo: "Composición, referencias y static",
          duracion: "18 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Componer clases a partir de otras", "Entender que los objetos se pasan por referencia y cómo copiarlos", "Usar miembros static"],
          teoria: r`<p>Normalmente nuestras clases no se componen solo de tipos básicos,
<code>string</code> y arrays, sino también de <strong>otras
clases</strong> creadas por nosotros. Esto se llama
<strong>composición</strong>: un objeto «<strong>tiene un</strong>»
objeto de otra clase.</p>
<p>Ejemplo: modelamos una impresora muy básica. Cada cartucho tiene una
cantidad y un tipo de tinta. Si algún cartucho tiene menos de 10 de
tinta, la impresora <strong>no puede imprimir</strong>. La clase
<code>Impresora</code> está <strong>compuesta</strong> por un array de
<code>CartuchoTinta</code>.</p>
<!--ex:0-->
<div class="callout">
<p><strong>Versión corta con LINQ:</strong>
<code>return Cartuchos.All(c =&gt; c.Cantidad &gt;= 10);</code> hace lo
mismo en una línea.</p>
</div>
<h3 id="19-paso-de-objetos-por-parámetro">1.9 Paso de objetos por
parámetro</h3>
<p>Como ocurría con los arrays, las <strong>clases son tipos de
referencia</strong>: la variable <strong>no contiene los datos</strong>
del objeto, sino <strong>la dirección de memoria</strong> donde están.
Al pasar un objeto como parámetro se copia <strong>la
dirección</strong>, así que la función trabaja sobre <strong>el mismo
objeto</strong>.</p>
<pre><code>Memoria                                      Variables

[@01]  33                    ◄─────────── numero1       (int: contiene el valor 33)
[@02]  44                    ◄─────────── numero2       (int: contiene el valor 44)
[@90]  datos del objeto      ◄─────────── impr          (Impresora: contiene la dirección @90)</code></pre>
<p>Si queremos pasar un objeto a una función <strong>sin que esta pueda
modificar el original</strong>, hay que trabajar sobre una
<strong>copia</strong>. En C# no existe un <code>clone()</code>
automático para nuestras clases: lo escribimos nosotros (un método que
devuelve un objeto nuevo del mismo tipo con los mismos valores).</p>
<p>En el ejemplo, la función <code>CambiaNombre</code> modifica el
original y <code>CambiaNombreCopia</code> trabaja con un clon:</p>
<!--ex:1-->
<h4 id="otras-formas-de-copiar-de-fácil-a-profesional">Otras formas de
copiar (de fácil a profesional)</h4>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Opción</th>
<th>Cuándo usarla</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Método <code>Clone()</code> propio (como arriba)</td>
<td>Es la más clara y didáctica.</td>
</tr>
<tr class="even">
<td><strong>Constructor de copia</strong>:
<code>public Alimento(Alimento otro)</code></td>
<td>Muy habitual: <code>new Alimento(alim)</code>.</td>
</tr>
<tr class="odd">
<td><strong><code>record</code></strong> con <code>with</code></td>
<td>Para datos que no cambian:
<code>var copia = alim with { Nombre = "botifarra" };</code></td>
</tr>
<tr class="even">
<td><strong><code>struct</code></strong></td>
<td>Es un <strong>tipo de valor</strong>: al pasarlo se copia entero.
Útil para datos pequeños (<code>Vector2</code>,
<code>Color</code>).</td>
</tr>
</tbody>
</table></div>
<!--ex:2-->
<h3 id="110-el-modificador-static">1.10 El modificador
<code>static</code></h3>
<p>Hemos hablado de clases, objetos, métodos y atributos, pero cuando
usábamos <code>Math.Round</code> o <code>Console.WriteLine</code> no
creábamos ningún objeto. Eso se puede hacer cuando un atributo o método
<strong>pertenece a la clase</strong> y no al objeto: se marca con
<strong><code>static</code></strong>.</p>
<ul>
<li>Un miembro <code>static</code> se usa <strong>directamente con el
nombre de la clase</strong>:
<code>Alimento.MuestraObjetivo()</code>.</li>
<li>Un miembro <strong>no static</strong> solo se puede usar <strong>a
través de un objeto</strong>.</li>
<li>Un atributo <code>static</code> es <strong>único y
compartido</strong>: si cambia su valor, cambia para
<strong>todos</strong> los objetos de esa clase.</li>
<li>Un método <code>static</code> <strong>no pertenece a ningún
objeto</strong>, por lo que <strong>no puede usar atributos ni métodos
no static</strong> (no sabría de qué objeto hablar).</li>
</ul>
<!--ex:3-->
<div class="callout">
<p><strong>Diferencia con Java.</strong> En Java se puede llamar a un
miembro estático a través de un objeto
(<code>alim.muestraObjetivo()</code>). En C# <strong>no está
permitido</strong>: solo con el nombre de la clase.</p>
</div>
<h4 id="otros-usos-de-static-y-de-las-constantes">Otros usos de
<code>static</code> y de las constantes</h4>
<ul>
<li><strong>Clase <code>static</code></strong>
(<code>static class Utilidades</code>): solo contiene miembros
<code>static</code> y no se puede instanciar (como <code>Math</code> o
<code>Console</code>).</li>
<li><strong><code>const</code></strong>: constante conocida al compilar
(<code>public const int VidaMaxima = 100;</code>). Es implícitamente
<code>static</code>.</li>
<li><strong><code>static readonly</code></strong>: constante que se
asigna una vez en tiempo de ejecución.</li>
</ul>
<p>En el siguiente tema veremos con más profundidad los pilares de la
POO: <strong>abstracción, encapsulamiento, herencia y
polimorfismo</strong>. ¿Te acuerdas?</p>
<hr />
<ul>
<li>Clases y objetos (Microsoft Learn): <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/object-oriented/">https://learn.microsoft.com/dotnet/csharp/fundamentals/object-oriented/</a></li>
<li>Constructores: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/constructors">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/constructors</a></li>
<li>Miembros <code>static</code>: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/static-classes-and-static-class-members">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/static-classes-and-static-class-members</a></li>
<li>Recolector de basura: <a
href="https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals">https://learn.microsoft.com/dotnet/standard/garbage-collection/fundamentals</a></li>
<li>Tipos de referencia y de valor: <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/value-types">https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/value-types</a></li>
</ul>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`Impresora impr = new Impresora();
Console.WriteLine(impr.PuedeImprimir());      // True

impr.Cartuchos[1].Cantidad = 5;               // se gasta el cartucho de color
Console.WriteLine(impr.PuedeImprimir());      // False

// ===== CartuchoTinta.cs =====
public class CartuchoTinta
{
    public int Cantidad = 100;
    public string Tipo;

    public CartuchoTinta(string tipo)
    {
        Tipo = tipo;
    }
}

// ===== Impresora.cs =====
public class Impresora
{
    public CartuchoTinta[] Cartuchos = new CartuchoTinta[2];

    public Impresora()
    {
        Cartuchos[0] = new CartuchoTinta("negro");
        Cartuchos[1] = new CartuchoTinta("color");
    }

    // Solo se puede imprimir si TODOS los cartuchos tienen 10 o más de tinta
    public bool PuedeImprimir()
    {
        for (int k = 0; k < Cartuchos.Length; k++)
        {
            if (Cartuchos[k].Cantidad < 10)
            {
                return false;           // basta un cartucho casi vacío para no poder imprimir
            }
        }
        return true;
    }
}
` },
            { titulo: "Ejemplo 2", codigo: r`Alimento alim = new Alimento("bistec", 100, 400);

CambiaNombre(alim, "aceitunas");
Console.WriteLine(alim.Nombre);               // aceitunas  ← el original ha cambiado

CambiaNombreCopia(alim, "botifarra");
Console.WriteLine(alim.Nombre);               // aceitunas  ← el original NO ha cambiado

// Modifica directamente el objeto recibido (porque es una referencia)
static void CambiaNombre(Alimento alimento, string nombre)
{
    alimento.Nombre = nombre;
}

// Trabaja sobre una copia: el objeto original queda intacto
static void CambiaNombreCopia(Alimento alimento, string nombre)
{
    Alimento copia = alimento.Clone();
    copia.Nombre = nombre;
}

// ===== Alimento.cs =====
public class Alimento
{
    public string Nombre = "";
    public int Cantidad;
    public int Kcal;

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // Devuelve un objeto NUEVO con los mismos valores
    public Alimento Clone()
    {
        return new Alimento(Nombre, Cantidad, Kcal);
    }
}
` },
            { titulo: "Clase AlimentoR", noRun: true, codigo: r`// Con un record (C# 9): copia con modificación en una línea
record AlimentoR(string Nombre, int Cantidad, int Kcal);

// uso (en Program.cs):
// AlimentoR a = new("bistec", 100, 400);
// AlimentoR b = a with { Nombre = "botifarra" };    // 'a' no cambia
` },
            { titulo: "Ejemplo 4", codigo: r`Alimento.MuestraObjetivo();                   // El objetivo es nutrir el cuerpo

Alimento alim = new Alimento("bistec", 100, 400);
// alim.MuestraObjetivo();                    // ❌ error CS0176: un miembro static se llama con la clase, no con el objeto

Alimento.Objetivo = "dar energía";            // cambia para TODOS los alimentos
Alimento.MuestraObjetivo();                   // El objetivo es dar energía

// ===== Alimento.cs =====
public class Alimento
{
    public string Nombre = "";
    public int Cantidad;
    public int Kcal;

    // Atributo de la clase: compartido por todos los alimentos
    public static string Objetivo = "nutrir el cuerpo";

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // Método de la clase: no puede usar Nombre, Cantidad ni Kcal
    public static void MuestraObjetivo()
    {
        Console.WriteLine($"El objetivo es {Objetivo}");
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Los habitantes de una ciudad extraterrestre 👽",
              nivel: 2,
              enunciado: r`<p>Queremos estructurar la información de los habitantes de una ciudad
extraterrestre formada por dos razas: los <strong>Cabecines</strong> y
los <strong>Cabezones</strong>.</p>
<ul>
<li>De cada individuo guardaremos su <strong>nombre</strong> y su
<strong>color de piel</strong> (los individuos de ambas razas pueden
tener nombres y colores distintos).</li>
<li>De cada <strong>raza</strong> guardaremos su <strong>nombre</strong>
y el <strong>número de espacios</strong> que ocupa: los Cabecines ocupan
<strong>1</strong> espacio y los Cabezones <strong>2</strong>.</li>
<li>Ambas razas tienen una función
<strong><code>ToString()</code></strong> que devuelve un texto con los
atributos del individuo.</li>
<li>Ambas razas tienen una función
<strong><code>Estresar()</code></strong> que cambia el color de piel de
los <strong>Cabezones a azul</strong> y el de los <strong>Cabecines a
rojo</strong>.</li>
</ul>
<p>Crea ahora un programa principal de nombre <code>CabezaWorld</code>
que al ejecutarse <strong>cree 2 Cabecines y 2 Cabezones</strong>,
estableciendo su nombre y color con un <strong>constructor</strong>;
<strong>estresa a uno de cada raza</strong> y muestra sus valores por
consola con <code>ToString</code>.</p>
<pre><code>public Cabecin(string nombre, string colorPiel)     // constructor: sets name and skin colour
public void Estresar()                              // changes the skin colour to red (Cabecin) or blue (Cabezon)
public override string ToString()                   // returns a text with the attributes of the individual</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Recuerda: la <strong>raza</strong> y el <strong>espacio</strong>
están ligados a la <strong>raza</strong>, no a cada individuo. ¿Qué
modificador aprendiste que sirve para esto?</li>
<li>Comprueba que <code>Cabecin.Raza</code> y
<code>Cabezon.Espacio</code> se pueden consultar <strong>sin crear
ningún objeto</strong>.</li>
</ul>
<p>💡 <strong>TIP:</strong> en <code>ToString</code> usa una cadena
interpolada: <code>$"{Raza}: {Nombre} …"</code>. Se escribe con
<code>override</code> porque sustituye al <code>ToString</code> que
heredan todas las clases (lo estudiamos en el Tema 2).</p>
<p>🏅 <strong>Ampliación:</strong> crea un array con los 4 individuos y
estresa a todos con un bucle <code>foreach</code>... ¿Puedes hacerlo con
un único array? (Pista: ahora no, ¡lo conseguirás en el Tema 2!).</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Salida:\n\ntext\nCabecín: Cabi, piel rojo, ocupa 1 espacio(s)\nCabecín: Cabu, piel gris, ocupa 1 espacio(s)\nCabezón: Zoro, piel azul, ocupa 2 espacio(s)\nCabezón: Zuri, piel amarillo, ocupa 2 espacio(s)\nCabecín ocupa 1; Cabezón ocupa 2\n\n\n---", codigo: r`Cabecin cabecin1 = new Cabecin("Cabi", "verde");
Cabecin cabecin2 = new Cabecin("Cabu", "gris");
Cabezon cabezon1 = new Cabezon("Zoro", "naranja");
Cabezon cabezon2 = new Cabezon("Zuri", "amarillo");

cabecin1.Estresar();          // solo estresamos a uno de cada raza
cabezon1.Estresar();

Console.WriteLine(cabecin1);  // Console.WriteLine llama a ToString() automáticamente
Console.WriteLine(cabecin2);
Console.WriteLine(cabezon1);
Console.WriteLine(cabezon2);

// Los datos de la raza se consultan con el nombre de la clase, sin crear objetos
Console.WriteLine($"{Cabecin.Raza} ocupa {Cabecin.Espacio}; {Cabezon.Raza} ocupa {Cabezon.Espacio}");

// ===== Cabecin.cs =====
public class Cabecin
{
    // Datos de la RAZA: static, compartidos por todos los cabecines
    public static string Raza { get; } = "Cabecín";
    public static int Espacio { get; } = 1;

    // Datos de cada INDIVIDUO
    public string Nombre;
    public string ColorPiel;

    public Cabecin(string nombre, string colorPiel)
    {
        Nombre = nombre;
        ColorPiel = colorPiel;
    }

    // Los cabecines, al estresarse, se ponen rojos
    public void Estresar()
    {
        ColorPiel = "rojo";
    }

    public override string ToString()
    {
        return $"{Raza}: {Nombre}, piel {ColorPiel}, ocupa {Espacio} espacio(s)";
    }
}

// ===== Cabezon.cs =====
public class Cabezon
{
    // Datos de la RAZA
    public static string Raza { get; } = "Cabezón";
    public static int Espacio { get; } = 2;

    // Datos de cada INDIVIDUO
    public string Nombre;
    public string ColorPiel;

    public Cabezon(string nombre, string colorPiel)
    {
        Nombre = nombre;
        ColorPiel = colorPiel;
    }

    // Los cabezones, al estresarse, se ponen azules
    public void Estresar()
    {
        ColorPiel = "azul";
    }

    public override string ToString()
    {
        return $"{Raza}: {Nombre}, piel {ColorPiel}, ocupa {Espacio} espacio(s)";
    }
}
` },
              ],
            },
            {
              titulo: "Inventario de objetos",
              nivel: 2,
              enunciado: r`<p>Crea una clase <strong><code>Objeto</code></strong> (nombre y peso) y
una clase <strong><code>Mochila</code></strong>
<strong>compuesta</strong> por un array de objetos con capacidad máxima
de 3. La mochila debe tener
<strong><code>Guardar(Objeto o)</code></strong> (devuelve
<code>false</code> si está llena) y
<strong><code>PesoTotal()</code></strong>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>La mochila <strong>tiene</strong> objetos: es composición.</li>
<li>Comprueba que el array no se desborda.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", codigo: r`Mochila mochila = new Mochila();
Console.WriteLine(mochila.Guardar(new Objeto("Espada", 5)));     // True
Console.WriteLine(mochila.Guardar(new Objeto("Poción", 1)));     // True
Console.WriteLine(mochila.Guardar(new Objeto("Escudo", 8)));     // True
Console.WriteLine(mochila.Guardar(new Objeto("Mapa", 0)));       // False: mochila llena
Console.WriteLine($"Peso total: {mochila.PesoTotal()}");         // 14

class Objeto
{
    public string Nombre;
    public int Peso;
    public Objeto(string nombre, int peso) { Nombre = nombre; Peso = peso; }
}

class Mochila
{
    private Objeto[] objetos = new Objeto[3];     // composición: la mochila tiene objetos
    private int cantidad = 0;

    public bool Guardar(Objeto o)
    {
        if (cantidad >= objetos.Length) { return false; }
        objetos[cantidad] = o;
        cantidad++;
        return true;
    }

    public int PesoTotal()
    {
        int total = 0;
        for (int i = 0; i < cantidad; i++) { total += objetos[i].Peso; }
        return total;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-encapsulacion",
          titulo: "Encapsulamiento, modificadores de acceso y propiedades",
          duracion: "18 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Ocultar los detalles internos con private", "Escribir setters y getters", "Usar propiedades de C# con validación"],
          teoria: r`<p>Como vimos en el Tema 1, una característica principal de los
lenguajes orientados a objetos es el <strong>encapsulamiento</strong>:
poder <strong>limitar el acceso</strong> a todo lo que no sea
estrictamente necesario para usar la clase.</p>
<p>Veamos por qué hace falta. Tenemos una clase <code>Dni</code> cuyo
constructor genera una <strong>contraseña</strong> asociada. ¿Cómo
aseguramos que la contraseña <strong>solo se genera al crear el
DNI</strong> y que nadie de fuera la puede cambiar?</p>
<p>Encapsulando el atributo <code>password</code> y el método que la
genera: haremos que <strong>solo la propia clase
<code>Dni</code></strong> tenga acceso a ellos, marcándolos como
<strong><code>private</code></strong>.</p>
<h3 id="22-modificadores-de-acceso">2.2 Modificadores de acceso</h3>
<p>Los <strong>modificadores de acceso</strong> indican <strong>qué
código puede usar</strong> cada clase, método o atributo. Con ellos
decidimos qué miembros son para la <strong>gestión interna</strong> de
la clase y cuáles son su <strong>interfaz pública</strong>. Se escriben
antes del tipo:</p>
<pre><code>modificadorAcceso TipoVariable nombreVariable;
modificadorAcceso TipoRetorno NombreMetodo() { … }</code></pre>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Modificador</th>
<th>Quién puede acceder</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><strong><code>private</code></strong></td>
<td>Solo el código de la <strong>propia clase</strong>. Es el valor
<strong>por defecto</strong> de los miembros de una clase.</td>
</tr>
<tr class="even">
<td><strong><code>protected</code></strong></td>
<td>La propia clase y sus <strong>clases derivadas</strong>.</td>
</tr>
<tr class="odd">
<td><strong><code>internal</code></strong></td>
<td>Cualquier clase del <strong>mismo ensamblado</strong> (el mismo
proyecto). Es el valor por defecto de las clases.</td>
</tr>
<tr class="even">
<td><strong><code>protected internal</code></strong></td>
<td>Clases derivadas <strong>o</strong> cualquier clase del mismo
ensamblado.</td>
</tr>
<tr class="odd">
<td><strong><code>private protected</code></strong></td>
<td>Clases derivadas <strong>que estén además en el mismo
ensamblado</strong>.</td>
</tr>
<tr class="even">
<td><strong><code>public</code></strong></td>
<td><strong>Cualquier</strong> código que use la clase.</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>¡Cuidado con las diferencias con Java!</strong> En Java, «sin
modificador» significa «accesible dentro del mismo <em>package</em>». En
C#, <strong>sin modificador</strong> un miembro es
<strong><code>private</code></strong>, y las clases son
<strong><code>internal</code></strong>. Además, <code>internal</code> se
refiere al <strong>ensamblado</strong> (proyecto), no al
<em>namespace</em>.</p>
</div>
<p>Modificamos el ejemplo del DNI para encapsular la contraseña:</p>
<!--ex:0-->
<p>Y ahora una pregunta: ¿qué modificador deberían tener los demás
atributos? Si los dejamos <code>public</code>, <strong>cualquier
programa</strong> podría darles cualquier valor: una edad negativa, un
nombre vacío… Lo correcto es hacerlos
<strong><code>private</code></strong> y ofrecer un mecanismo
<strong>controlado</strong> para leerlos y modificarlos. Por convenio,
usaremos <strong>setters</strong> y <strong>getters</strong>.</p>
<h3 id="23-setters-y-getters">2.3 Setters y getters</h3>
<p>En la mayoría de casos los atributos no pueden tomar cualquier valor,
y a veces hay que hacer una operación antes de devolverlos. Para
gestionarlo usamos funciones llamadas <strong>setters</strong> y
<strong>getters</strong>.</p>
<h4 id="setters">Setters</h4>
<p>Un <strong>setter</strong> es un método cuyo objetivo es
<strong>establecer</strong> (<em>set</em>) el valor de uno o varios
atributos.</p>
<ul>
<li>Por convenio, su nombre empieza por <code>Set</code> seguido del
nombre del atributo (<code>SetEdad</code>).</li>
<li>Normalmente son <strong><code>public</code></strong>.</li>
<li>Recibe como mínimo <strong>el valor a establecer</strong>. Si
devuelve algo, suele ser un <code>bool</code> que indica si se ha podido
establecer.</li>
</ul>
<p>En el siguiente ejemplo todos los atributos son privados y se
modifican con setters. Hemos forzado a indicar <strong>número y letra
del DNI juntos</strong> para poder comprobar que se corresponden, y
controlamos que la edad esté entre 0 y 150.</p>
<p>La letra del DNI se calcula con el resto de dividir el número entre
23, usando la tabla <code>TRWAGMYFPDXBNJZSQVHLCKE</code>.</p>
<!--ex:1-->
<h4 id="getters">Getters</h4>
<p>Un <strong>getter</strong> es un método cuyo objetivo es
<strong>obtener</strong> (<em>get</em>) el valor de un atributo
<strong>o un valor derivado</strong> de ellos.</p>
<ul>
<li>Por convenio empieza por <code>Get</code> seguido del nombre del
dato.</li>
<li>Normalmente es <strong><code>public</code></strong>.</li>
<li>No tiene por qué limitarse a los atributos: puede devolver
<strong>valores calculados</strong>, como el número y la letra del DNI
juntos o si la persona es mayor de edad.</li>
</ul>
<!--ex:2-->
<h4 id="propiedades-la-forma-de-c-nivel-profesional">Propiedades: la
forma de C# (nivel profesional)</h4>
<p>Escribir un <code>Set</code> y un <code>Get</code> por cada dato es
muy repetitivo. C# lo resuelve con las <strong>propiedades</strong>:
parecen un atributo al usarlas, pero por dentro tienen un
<strong><code>get</code></strong> y un <strong><code>set</code></strong>
con la lógica que queramos.</p>
<!--ex:3-->
<p><strong>¿Qué opción elegir?</strong></p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Opción</th>
<th>Cuándo</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Métodos <code>SetX</code> / <code>GetX</code></td>
<td>Es el estilo de Java. Funciona perfectamente y es fácil de
entender.</td>
</tr>
<tr class="even">
<td><strong>Propiedades</strong> (<code>get</code> /
<code>set</code>)</td>
<td>Es <strong>el estilo de C#</strong>: más corto, se usa como un
atributo y permite validar. <strong>Es lo que usarás en proyectos
reales.</strong></td>
</tr>
<tr class="odd">
<td>Propiedades automáticas <code>{ get; set; }</code></td>
<td>Cuando no hace falta validar. Se pueden restringir:
<code>{ get; private set; }</code> (solo la clase modifica) o
<code>{ get; init; }</code> (solo se asigna al crear el objeto).</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p><strong>Setter que devuelve <code>bool</code> frente a
excepción.</strong> El método <code>SetEdad</code> devuelve
<code>false</code> y deja que quien llama decida; la propiedad lanza una
excepción, que <strong>obliga</strong> a gestionar el error (lo
practicaremos con <code>try/catch</code>). Ambas son válidas; lo
importante es <strong>no dejar nunca que se guarde un dato
incorrecto</strong>.</p>
</div>`,
          ejemplos: [
            { titulo: "Modificamos el ejemplo del DNI para encapsular la contraseña", codigo: r`Dni dniRyu = new Dni();
dniRyu.Nombre = "Ryu";                             // ✔ public: se puede usar
// dniRyu.password = 1;                            // ❌ error CS0122: 'password' es inaccesible por su nivel de protección
// dniRyu.GeneraPassword();                        // ❌ error CS0122

// ===== Dni.cs =====
public class Dni
{
    public string Nombre = "";

    private int password;                          // solo accesible desde dentro de Dni

    public Dni()
    {
        GeneraPassword();                          // se genera una sola vez, al crear el objeto
    }

    // Genera un password entre 100 y 500 (el máximo de Next no se incluye, por eso 501)
    private void GeneraPassword()
    {
        password = Random.Shared.Next(100, 501);
    }
}
` },
            { titulo: "Ejemplo 2", codigo: r`Dni dniRyu = new Dni();
dniRyu.SetNombre("Ryu");
bool edadOk = dniRyu.SetEdad(54);
bool dniOk = dniRyu.SetNumeroDni(12345678, 'Z');

Console.WriteLine($"¿Edad correcta? {edadOk}");        // ¿Edad correcta? True
Console.WriteLine($"¿DNI correcto? {dniOk}");          // ¿DNI correcto? True
Console.WriteLine(dniRyu.SetNumeroDni(12345678, 'A')); // False: la letra no corresponde

// ===== Dni.cs =====
public class Dni
{
    private string nombre = "";
    private int edad;
    private int numero;
    private char letra;

    public void SetNombre(string nombre)
    {
        this.nombre = nombre;
    }

    // Devuelve true si la edad es válida y se ha guardado
    public bool SetEdad(int edad)
    {
        if (edad >= 0 && edad <= 150)
        {
            this.edad = edad;
            return true;
        }
        return false;
    }

    // Guarda número y letra solo si se corresponden
    public bool SetNumeroDni(int numero, char letra)
    {
        if (ComprobarLetra(numero, letra))
        {
            this.numero = numero;
            this.letra = letra;
            return true;
        }
        return false;
    }

    // Comprueba si la letra es la que corresponde al número (la letra debe ir en mayúscula)
    public static bool ComprobarLetra(int numero, char letra)
    {
        return numero >= 0 && letra == "TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23];
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`Dni dniRyu = new Dni();
dniRyu.SetNombre("Ryu");
dniRyu.SetEdad(54);
dniRyu.SetNumeroDni(12345678, 'Z');

Console.WriteLine($"Nombre: {dniRyu.GetNombre()}");              // Nombre: Ryu
Console.WriteLine($"Edad: {dniRyu.GetEdad()}");                  // Edad: 54
Console.WriteLine($"DNI: {dniRyu.GetDni()}");                    // DNI: 12345678Z
Console.WriteLine($"¿Mayor de edad? {dniRyu.GetEsMayorEdad()}"); // ¿Mayor de edad? True

// ===== Dni.cs =====
public string GetNombre()
{
    return nombre;
}

public int GetEdad()
{
    return edad;
}

// Valor derivado: número y letra juntos
public string GetDni()
{
    return $"{numero}{letra}";
}

// Valor derivado: se calcula a partir de la edad
public bool GetEsMayorEdad()
{
    return edad >= 18;
}

// ===== Dni =====
public class Dni
{
    private string nombre = "";
    private int edad;
    private int numero;
    private char letra;

    public void SetNombre(string nombre)
    {
        this.nombre = nombre;
    }

    // Devuelve true si la edad es válida y se ha guardado
    public bool SetEdad(int edad)
    {
        if (edad >= 0 && edad <= 150)
        {
            this.edad = edad;
            return true;
        }
        return false;
    }

    // Guarda número y letra solo si se corresponden
    public bool SetNumeroDni(int numero, char letra)
    {
        if (ComprobarLetra(numero, letra))
        {
            this.numero = numero;
            this.letra = letra;
            return true;
        }
        return false;
    }

    // Comprueba si la letra es la que corresponde al número (la letra debe ir en mayúscula)
    public static bool ComprobarLetra(int numero, char letra)
    {
        return numero >= 0 && letra == "TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23];
    }
}
` },
            { titulo: "Ejemplo 4", codigo: r`Dni dniRyu = new Dni();
dniRyu.Nombre = "Ryu";                                  // llama al set de la propiedad
dniRyu.Edad = 54;                                       // pasa por la validación
dniRyu.SetNumeroDni(12345678, 'Z');

Console.WriteLine($"{dniRyu.Nombre}, {dniRyu.Edad} años, DNI {dniRyu.Documento}");
// Ryu, 54 años, DNI 12345678Z
Console.WriteLine($"¿Mayor de edad? {dniRyu.EsMayorEdad}");   // True

try
{
    dniRyu.Edad = 200;                                  // el set lanza una excepción
}
catch (ArgumentOutOfRangeException ex)
{
    Console.WriteLine($"Error: {ex.Message}");          // muestra el mensaje de error
}

// ===== Dni.cs =====
public class Dni
{
    private int edad;                                   // campo privado que guarda el dato
    private int numero;
    private char letra;

    // Propiedad automática: el compilador crea el campo oculto por nosotros
    public string Nombre { get; set; } = "";

    // Propiedad con validación en el set
    public int Edad
    {
        get => edad;                                    // devuelve el campo
        set
        {
            if (value < 0 || value > 150)               // 'value' es el valor que se intenta asignar
            {
                throw new ArgumentOutOfRangeException(nameof(value), "La edad debe estar entre 0 y 150.");
            }
            edad = value;
        }
    }

    // Propiedad de solo lectura, calculada (no tiene set ni campo propio)
    public bool EsMayorEdad => edad >= 18;

    // Propiedad de solo lectura que une número y letra
    public string Documento => $"{numero}{letra}";

    public bool SetNumeroDni(int numero, char letra)
    {
        if (numero < 0 || letra != "TRWAGMYFPDXBNJZSQVHLCKE"[numero % 23])
        {
            return false;
        }
        this.numero = numero;
        this.letra = letra;
        return true;
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Cuenta bancaria encapsulada",
              nivel: 2,
              enunciado: r`<p>Crea una clase <strong><code>CuentaBancaria</code></strong> con el
saldo <strong>privado</strong>, una <strong>propiedad de solo lectura
<code>Saldo</code></strong> y los métodos
<strong><code>Ingresar(decimal)</code></strong> y
<strong><code>Retirar(decimal)</code></strong>. Ambos devuelven
<code>bool</code>: <code>false</code> si la cantidad no es positiva o
(al retirar) si no hay saldo suficiente.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Nadie de fuera puede cambiar el saldo directamente
(<code>cuenta.Saldo = 5</code> no debe compilar).</li>
<li>Para dinero se usa <strong><code>decimal</code></strong>, no
<code>double</code>.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "El encapsulamiento garantiza que el saldo solo cambia por caminos válidos.", codigo: r`CuentaBancaria cuenta = new CuentaBancaria();
Console.WriteLine(cuenta.Ingresar(100));      // True
Console.WriteLine(cuenta.Retirar(30));        // True
Console.WriteLine(cuenta.Retirar(500));       // False: no hay saldo suficiente
Console.WriteLine(cuenta.Ingresar(-5));       // False: cantidad no válida
Console.WriteLine($"Saldo: {cuenta.Saldo}");  // 70
// cuenta.Saldo = 1000;                        // ERROR: la propiedad no tiene set público

class CuentaBancaria
{
    private decimal saldo;

    public decimal Saldo => saldo;            // propiedad de solo lectura

    public bool Ingresar(decimal cantidad)
    {
        if (cantidad <= 0) { return false; }
        saldo += cantidad;
        return true;
    }

    public bool Retirar(decimal cantidad)
    {
        if (cantidad <= 0 || cantidad > saldo) { return false; }
        saldo -= cantidad;
        return true;
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-herencia",
          titulo: "Herencia y sobrescritura de métodos",
          duracion: "18 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Crear clases hijas con :", "Usar base para llamar a la clase madre", "Sobrescribir con virtual y override; sealed, const y readonly"],
          teoria: r`<p>Al crear clases nos encontramos con clases <strong>muy
parecidas</strong> que solo se diferencian en algún atributo o método.
La <strong>herencia</strong> nos permite evitar el código duplicado: una
clase puede <strong>heredar</strong> de otra.</p>
<p>La herencia es el mecanismo por el cual una clase <strong>adquiere
los atributos y métodos de otra</strong>. A la clase de la que se hereda
la llamamos <strong>superclase</strong>, <strong>clase base</strong> o
<strong>clase madre</strong>; a la que hereda, <strong>clase
hija</strong>, <strong>derivada</strong> o
<strong>extendida</strong>.</p>
<p>Hay dos tipos de herencia:</p>
<ul>
<li><strong>Herencia simple:</strong> una clase hereda de <strong>una
única</strong> clase. Es el caso de <strong>C# y Java</strong>.</li>
<li><strong>Herencia múltiple:</strong> una clase hereda de
<strong>varias</strong> clases. Es el caso de C++.</li>
</ul>
<p>En C# una clase solo puede heredar de <strong>una</strong> clase,
pero puede <strong>implementar varias interfaces</strong> (lo veremos en
el Tema 3).</p>
<p>Vamos a ver la necesidad con un ejemplo: la clase
<code>Alimento</code> y la clase <code>AlimentoSolido</code>. Las dos
comparten las características de un alimento (nombre, cantidad, kcal),
pero <code>AlimentoSolido</code> además tiene <strong>dureza</strong> y
un método <strong>masticar</strong>. Sin herencia habría que
<strong>repetir</strong> <code>Nombre</code>, <code>Cantidad</code> y
<code>Kcal</code> en las dos clases.</p>
<p>Para evitarlo indicamos que <code>AlimentoSolido</code>
<strong>hereda</strong> de <code>Alimento</code> con <strong>dos
puntos</strong> <code>:</code>:</p>
<pre><code>class ClaseHija : ClaseMadre
{
    …
}</code></pre>
<p>Los atributos y métodos de la clase madre se heredan
<strong>automáticamente</strong>: podemos usar <code>Nombre</code>,
<code>Cantidad</code> o <code>Kcal</code> en la clase hija como si
estuvieran escritos en ella (siempre que no sean
<code>private</code>).</p>
<div class="callout">
<p><strong>Importante:</strong> los <strong>constructores no se
heredan</strong>. Cada clase escribe los suyos, y el constructor de la
hija <strong>siempre llama a un constructor de la madre</strong> (si no
lo indicamos, llama al constructor sin parámetros; si la madre no lo
tiene, el código <strong>no compila</strong>, error CS7036).</p>
</div>
<!--ex:0-->
<h4 id="la-palabra-clave-base">La palabra clave <code>base</code></h4>
<p>Podemos pensar que <strong><code>base</code> es el <code>this</code>
de la clase madre</strong>:</p>
<ul>
<li><code>base(parámetros)</code> → en un <strong>constructor</strong>,
llama al constructor de la clase madre.</li>
<li><code>base.Metodo()</code> → llama a la implementación del método
<strong>en la clase madre</strong>.</li>
<li><code>base.Atributo</code> → accede al atributo de la clase
madre.</li>
</ul>
<p>En el ejemplo anterior, <code>: base(nombre, cantidad, kcal)</code>
evita repetir en <code>AlimentoSolido</code> el código que ya está en
<code>Alimento</code>.</p>
<h3 id="25-sobrescribir-métodos-virtual-y-override">2.5 Sobrescribir
métodos: <code>virtual</code> y <code>override</code></h3>
<p>Si podemos acceder directamente a lo heredado, ¿para qué sirve
<code>base</code>? Para cuando la clase hija <strong>cambia
(sobrescribe)</strong> un comportamiento de la madre y aun así quiere
reutilizar el original.</p>
<div class="callout">
<p><strong>¡Diferencia fundamental con Java!</strong> En Java todos los
métodos se pueden sobrescribir por defecto. En C# <strong>no</strong>:
un método (o propiedad) solo se puede sobrescribir si la madre lo marca
como <strong><code>virtual</code></strong>, y la hija debe indicarlo con
<strong><code>override</code></strong>. Es una decisión deliberada: la
madre decide qué partes se pueden cambiar.</p>
</div>
<pre><code>// En la clase madre:
public virtual TipoRetorno Metodo() { … }

// En la clase hija:
public override TipoRetorno Metodo() { … }       // misma firma que en la madre</code></pre>
<p>Podemos sobrescribir <strong>métodos y propiedades</strong> (no los
campos). Dentro del método sobrescrito, <code>base.Metodo()</code>
ejecuta la versión de la madre.</p>
<p>Ejemplo: añadimos a <code>Alimento</code> una propiedad virtual
<code>UnidadMedida</code> y sobrescribimos <code>ToString()</code>. La
hija <code>AlimentoSolido</code> los vuelve a sobrescribir. Fíjate en
cómo <code>MuestraMedidas</code> usa <code>base.</code> y sin
<code>base.</code>:</p>
<!--ex:1-->
<p>Salida:</p>
<pre><code>medida:
medida:gramos
nombre:bistec,cantidad:100
nombre:bistec,cantidad:100gramos,dureza:20</code></pre>
<p>El primer <code>medida:</code> está vacío porque
<code>base.UnidadMedida</code> ejecuta la versión de
<code>Alimento</code>; el segundo muestra <code>gramos</code>, la de
<code>AlimentoSolido</code>. Igualmente, <code>base.ToString()</code> es
la implementación de la madre y <code>ToString()</code> la de la
hija.</p>
<div class="callout">
<p><strong><code>new</code> frente a <code>override</code>.</strong> Si
en la hija declaramos un miembro con el mismo nombre
<strong>sin</strong> <code>override</code>, no lo sobrescribimos: lo
<strong>ocultamos</strong> y el compilador avisa (advertencia CS0108).
Si es intencionado se escribe <code>new</code>, pero es una mala
práctica que complica el código. <strong>Usa <code>virtual</code> y
<code>override</code>.</strong></p>
</div>
<h4 id="impedir-que-se-sobrescriba-sealed-const-y-readonly">Impedir que
se sobrescriba: <code>sealed</code>, <code>const</code> y
<code>readonly</code></h4>
<p>En Java existe <code>final</code>. En C# hay varias palabras según el
caso:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Quiero…</th>
<th>En C#</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>Que un método <strong>no se pueda sobrescribir</strong></td>
<td><strong>No marcarlo <code>virtual</code></strong> (es lo normal). Y
si ya es <code>override</code> y quiero que las hijas no lo cambien:
<strong><code>sealed override</code></strong></td>
</tr>
<tr class="even">
<td>Que una <strong>clase no se pueda heredar</strong></td>
<td><strong><code>sealed class</code></strong> (como
<code>string</code>)</td>
</tr>
<tr class="odd">
<td>Un valor <strong>inalterable conocido al compilar</strong></td>
<td><strong><code>const</code></strong></td>
</tr>
<tr class="even">
<td>Un campo que <strong>solo se asigna una vez</strong> (al declararlo
o en el constructor)</td>
<td><strong><code>readonly</code></strong></td>
</tr>
</tbody>
</table></div>
<!--ex:2-->`,
          ejemplos: [
            { titulo: "Clase Alimento, AlimentoSolido", noRun: true, codigo: r`// Alimento.cs
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }
}

// AlimentoSolido.cs
public class AlimentoSolido : Alimento                     // hereda de Alimento
{
    public int Dureza { get; private set; }

    // Llama al constructor de la madre con "base(...)" y después se ocupa de lo suyo
    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    // Constructor con los mismos parámetros que el de la madre: reutiliza el anterior con dureza 0
    public AlimentoSolido(string nombre, int cantidad, int kcal)
        : this(nombre, cantidad, kcal, 0) { }

    // Al masticar baja la dureza, sin llegar nunca por debajo de 0
    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }
}
` },
            { titulo: "Ejemplo 2", codigo: r`AlimentoSolido bistec = new AlimentoSolido("bistec", 100, 400, 20);
bistec.MuestraMedidas();

// ===== Alimento.cs =====
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // virtual: las clases hijas PUEDEN cambiarla. En un alimento genérico no hay unidad
    public virtual string UnidadMedida => "";

    // Sobrescribe el ToString() que heredamos de Object
    public override string ToString()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}";
    }
}

// ===== AlimentoSolido.cs =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }

    // Sobrescribe la propiedad de la madre
    public override string UnidadMedida => "gramos";

    // Reutiliza el ToString de la madre y le añade lo propio
    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},dureza:{Dureza}";
    }

    public void MuestraMedidas()
    {
        Console.WriteLine($"medida:{base.UnidadMedida}");    // implementación de la clase madre: vacía
        Console.WriteLine($"medida:{UnidadMedida}");         // implementación de esta clase: gramos
        Console.WriteLine(base.ToString());                  // versión de Alimento
        Console.WriteLine(ToString());                       // versión de AlimentoSolido
    }
}
` },
            { titulo: "| Un campo que solo se asigna una vez (al declararlo o en el constructor) | readonly |", noRun: true, codigo: r`// Circunferencia.cs
public class Circunferencia
{
    public const double Pi = Math.PI;                      // constante: su valor no puede cambiar

    // No es virtual: ninguna clase hija puede sobrescribirlo
    public double CalculaLongitud(double radio)
    {
        return 2 * Pi * radio;
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Los extraterrestres, ahora con herencia 🛸",
              nivel: 2,
              enunciado: r`<p>Seguimos con la actividad del tema anterior (<strong>habitantes de
una ciudad extraterrestre</strong>: Cabecines y Cabezones, con nombre y
color de piel, espacio por raza, <code>ToString()</code> y
<code>Estresar()</code>).</p>
<p>Ahora:</p>
<ul>
<li>Crea la <strong>superclase <code>Extraterrestre</code></strong> de
la que <strong>heredan <code>Cabecin</code> y
<code>Cabezon</code></strong>. La clase <code>Extraterrestre</code>
tendrá el atributo <strong><code>Raza</code></strong> con valor
<code>"extraterrestre"</code> y el atributo
<strong><code>Espacio</code></strong> con valor inicial
<strong>1</strong>, que las razas sobrescriben con sus valores.</li>
<li>Añade a los <strong>Cabezones</strong> un <strong>tercer
ojo</strong>, que puede ser <code>"marron"</code>, <code>"negro"</code>
o <code>"rojo"</code>.</li>
<li>Crea el programa principal <code>CabezaWorld</code>, que cree
<strong>2 Cabecines y 2 Cabezones</strong> estableciendo su nombre y
color con un <strong>constructor</strong>.</li>
<li>En los Cabezones, establece el color del tercer ojo mediante un
<strong>setter</strong> (propiedad) que guarde <code>"rojo"</code>
<strong>si se introduce un valor incorrecto</strong>.</li>
<li><strong>Estresa a uno de cada raza</strong> y muestra sus valores
por consola con <code>ToString</code>.</li>
</ul>
<pre><code>public virtual string Raza =&gt; &quot;extraterrestre&quot;           // race name, overridden by the children
public virtual int Espacio =&gt; 1                          // spaces occupied, overridden by the children
public string TercerOjo { get; set; }                    // third eye colour: only &quot;marron&quot;, &quot;negro&quot; or &quot;rojo&quot;</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li><code>Extraterrestre</code> contiene <strong>todo lo común</strong>
(nombre, color de piel, <code>ToString</code>). No repitas código en las
hijas.</li>
<li>Si el valor del tercer ojo no es válido (por ejemplo,
<code>"violeta"</code> o <code>null</code>), el setter guarda
<code>"rojo"</code>; <strong>no debe lanzar ninguna
excepción</strong>.</li>
<li>Los constructores de las hijas deben llamar a
<code>base(...)</code>.</li>
</ul>
<p>💡 <strong>TIP:</strong> guarda los colores válidos en un array
<code>static readonly</code> y comprueba con <code>Contains</code>. En
<code>ToString</code> de las hijas puedes reutilizar
<code>base.ToString()</code>.</p>
<p>🏅 <strong>Ampliación:</strong> haz que un Cabezón también pueda
crearse indicando el tercer ojo directamente en el constructor
(reutiliza el otro constructor con <code>: this(...)</code>).</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Salida:\n\ntext\ncabecín: Cabi, piel rojo, ocupa 1 espacio(s)\ncabecín: Cabu, piel gris, ocupa 1 espacio(s)\ncabezón: Zoro, piel azul, ocupa 2 espacio(s), tercer ojo negro\ncabezón: Zuri, piel amarillo, ocupa 2 espacio(s), tercer ojo rojo\n\n\n---", codigo: r`Cabecin cabecin1 = new Cabecin("Cabi", "verde");
Cabecin cabecin2 = new Cabecin("Cabu", "gris");
Cabezon cabezon1 = new Cabezon("Zoro", "naranja");
Cabezon cabezon2 = new Cabezon("Zuri", "amarillo");

cabezon1.TercerOjo = "negro";          // valor correcto
cabezon2.TercerOjo = "violeta";        // valor incorrecto: se guarda "rojo"

cabecin1.Estresar();                   // estresamos a uno de cada raza
cabezon1.Estresar();

Console.WriteLine(cabecin1);
Console.WriteLine(cabecin2);
Console.WriteLine(cabezon1);
Console.WriteLine(cabezon2);

// ===== Extraterrestre.cs =====
public class Extraterrestre
{
    public string Nombre { get; set; }
    public string ColorPiel { get; set; }

    // Datos de la raza: virtual para que cada raza ponga los suyos
    public virtual string Raza => "extraterrestre";
    public virtual int Espacio => 1;

    public Extraterrestre(string nombre, string colorPiel)
    {
        Nombre = nombre;
        ColorPiel = colorPiel;
    }

    public override string ToString()
    {
        return $"{Raza}: {Nombre}, piel {ColorPiel}, ocupa {Espacio} espacio(s)";
    }
}

// ===== Cabecin.cs =====
public class Cabecin : Extraterrestre
{
    public Cabecin(string nombre, string colorPiel) : base(nombre, colorPiel) { }

    public override string Raza => "cabecín";
    public override int Espacio => 1;

    // Los cabecines, al estresarse, se ponen rojos
    public void Estresar()
    {
        ColorPiel = "rojo";
    }
}

// ===== Cabezon.cs =====
public class Cabezon : Extraterrestre
{
    // Colores válidos para el tercer ojo (compartidos por todos los cabezones)
    private static readonly string[] ColoresOjo = { "marron", "negro", "rojo" };

    private string tercerOjo = "rojo";

    public Cabezon(string nombre, string colorPiel) : base(nombre, colorPiel) { }

    public override string Raza => "cabezón";
    public override int Espacio => 2;

    // Si el valor no es válido (o es null), se guarda "rojo"
    public string TercerOjo
    {
        get => tercerOjo;
        set => tercerOjo = ColoresOjo.Contains(value) ? value : "rojo";
    }

    // Los cabezones, al estresarse, se ponen azules
    public void Estresar()
    {
        ColorPiel = "azul";
    }

    // Reutiliza el ToString de la madre y añade el tercer ojo
    public override string ToString()
    {
        return $"{base.ToString()}, tercer ojo {TercerOjo}";
    }
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-object-tipos",
          titulo: "La clase Object y los tipos básicos",
          duracion: "12 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Conocer los métodos que heredan todas las clases", "Entender que int, double… son estructuras con métodos", "Usar tipos anulables y conocer el boxing"],
          teoria: r`<p><strong><code>System.Object</code></strong> (alias
<code>object</code>) es la clase de la que <strong>heredan
automáticamente todas las clases</strong> (y estructuras) de C#. Por eso
todos los objetos tienen estos métodos:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Método</th>
<th>Qué hace</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>string ToString()</code></td>
<td>Devuelve un texto que representa el objeto. Conviene
<strong>sobrescribirlo</strong> para que muestre algo útil. Por defecto
devuelve el nombre del tipo.</td>
</tr>
<tr class="even">
<td><code>bool Equals(object? obj)</code></td>
<td>Indica si el objeto actual es <strong>igual</strong> al parámetro.
Por defecto compara las <strong>referencias</strong>; se sobrescribe
para comparar el contenido.</td>
</tr>
<tr class="odd">
<td><code>int GetHashCode()</code></td>
<td>Devuelve un código <em>hash</em> usado en colecciones como
<code>Dictionary</code> y <code>HashSet</code>. Se sobrescribe
<strong>junto con <code>Equals</code></strong>.</td>
</tr>
<tr class="even">
<td><code>Type GetType()</code></td>
<td>Devuelve el <strong>tipo real</strong> del objeto en ejecución
(<code>bistec.GetType().Name</code> → <code>AlimentoSolido</code>).</td>
</tr>
<tr class="odd">
<td><code>object MemberwiseClone()</code></td>
<td>(<code>protected</code>) Crea una copia superficial. Útil para
escribir nuestro propio <code>Clone()</code>.</td>
</tr>
<tr class="even">
<td><code>void Finalize()</code></td>
<td>Lo llama el recolector de basura. No se llama a mano; se escribe
como <code>~Clase()</code> y casi nunca se necesita.</td>
</tr>
</tbody>
</table></div>
<div class="callout">
<p>En Java, <code>Object</code> tiene un <code>clone()</code>. En C#
<strong>no</strong>: la copia hay que escribirla nosotros (visto en el
Tema 1).</p>
</div>
<p>En el ejemplo anterior hemos <strong>sobrescrito</strong>
<code>ToString()</code> (con <code>override</code>) en
<code>Alimento</code> y <code>AlimentoSolido</code>. No es
<em>sobrecarga</em> (mismo nombre con distintos parámetros), sino
<strong>sobrescritura</strong> (misma firma, nuevo comportamiento).</p>
<p>Gracias a esto, <code>Console.WriteLine(objeto)</code> y
<code>$"{objeto}"</code> llaman automáticamente a
<code>ToString()</code>.</p>
<h3 id="27-los-tipos-básicos-son-objetos-wrappers">2.7 Los tipos básicos
son objetos (<em>wrappers</em>)</h3>
<p>En Java los tipos primitivos (<code>int</code>, <code>double</code>…)
no son objetos y necesitan clases «envoltorio» (<em>wrappers</em>:
<code>Integer</code>, <code>Double</code>…) para usar sus métodos.
<strong>En C# no hace falta</strong>: <code>int</code> es un
<strong>alias</strong> de la estructura <code>System.Int32</code>, y por
tanto <strong>ya tiene métodos y atributos</strong>:</p>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Palabra clave</th>
<th>Tipo de .NET</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>byte</code></td>
<td><code>System.Byte</code></td>
</tr>
<tr class="even">
<td><code>short</code></td>
<td><code>System.Int16</code></td>
</tr>
<tr class="odd">
<td><code>int</code></td>
<td><code>System.Int32</code></td>
</tr>
<tr class="even">
<td><code>long</code></td>
<td><code>System.Int64</code></td>
</tr>
<tr class="odd">
<td><code>float</code></td>
<td><code>System.Single</code></td>
</tr>
<tr class="even">
<td><code>double</code></td>
<td><code>System.Double</code></td>
</tr>
<tr class="odd">
<td><code>decimal</code></td>
<td><code>System.Decimal</code></td>
</tr>
<tr class="even">
<td><code>char</code></td>
<td><code>System.Char</code></td>
</tr>
<tr class="odd">
<td><code>bool</code></td>
<td><code>System.Boolean</code></td>
</tr>
</tbody>
</table></div>
<!--ex:0-->
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th>Método</th>
<th>Descripción</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td><code>int.Parse(string)</code></td>
<td>Convierte un texto a entero (lanza excepción si no es válido).</td>
</tr>
<tr class="even">
<td><code>int.TryParse(string, out int)</code></td>
<td>Igual, pero devuelve <code>false</code> en lugar de lanzar
excepción.</td>
</tr>
<tr class="odd">
<td><code>numero.ToString()</code></td>
<td>Convierte el valor a texto.</td>
</tr>
<tr class="even">
<td><code>Convert.ToInt64(numero)</code> /
<code>(long)numero</code></td>
<td>Convierte a otro tipo numérico.</td>
</tr>
<tr class="odd">
<td><code>int.MinValue</code> / <code>int.MaxValue</code></td>
<td>Límites del tipo.</td>
</tr>
</tbody>
</table></div>
<h4 id="y-si-necesito-que-un-int-pueda-ser-nulo">¿Y si necesito que un
<code>int</code> pueda ser «nulo»?</h4>
<p>Los tipos de valor no pueden ser <code>null</code>. Para eso existen
los <strong>tipos anulables</strong>, con un <code>?</code> detrás:</p>
<!--ex:1-->
<h4 id="boxing-y-unboxing"><em>Boxing</em> y <em>unboxing</em></h4>
<p>Como todo hereda de <code>object</code>, podemos guardar un
<code>int</code> en una variable <code>object</code>
(<strong>boxing</strong>) y recuperarlo con un <em>cast</em>
(<strong>unboxing</strong>). Funciona, pero es <strong>más
lento</strong> y conviene evitarlo:</p>
<!--ex:2-->
<hr />
<ul>
<li>Modificadores de acceso: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/access-modifiers</a></li>
<li>Propiedades: <a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/properties">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/properties</a></li>
<li>Herencia: <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/tutorials/inheritance">https://learn.microsoft.com/dotnet/csharp/fundamentals/tutorials/inheritance</a></li>
<li><code>virtual</code>, <code>override</code> y <code>sealed</code>:
<a
href="https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/knowing-when-to-use-override-and-new-keywords">https://learn.microsoft.com/dotnet/csharp/programming-guide/classes-and-structs/knowing-when-to-use-override-and-new-keywords</a></li>
<li>Clase <code>Object</code>: <a
href="https://learn.microsoft.com/dotnet/api/system.object">https://learn.microsoft.com/dotnet/api/system.object</a></li>
<li>Tipos anulables: <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/nullable-value-types">https://learn.microsoft.com/dotnet/csharp/language-reference/builtin-types/nullable-value-types</a></li>
</ul>`,
          ejemplos: [
            { titulo: "| bool | System.Boolean |", codigo: r`int numero = 55;
Console.WriteLine(numero.ToString());              // 55: un int tiene métodos
Console.WriteLine(int.MaxValue);                   // 2147483647: atributos estáticos del tipo
Console.WriteLine(int.Parse("89") + 1);            // 90: convierte un texto a entero
Console.WriteLine(numero.CompareTo(60));           // -1: el 55 es menor que el 60

int vacio = new int();                             // 0: los tipos de valor tienen constructor sin parámetros
` },
            { titulo: "Los tipos de valor no pueden ser null. Para eso existen los tipos anulables, con un ? detr", codigo: r`int? edad = null;                                  // puede contener un entero o null
Console.WriteLine(edad.HasValue);                  // False
edad = 30;
Console.WriteLine(edad.Value);                     // 30
Console.WriteLine(edad ?? 0);                      // 30 (si fuera null, devolvería 0)
` },
            { titulo: "Ejemplo 3", codigo: r`object caja = 5;                                   // boxing: el int se «empaqueta» en un objeto
int numero = (int)caja;                            // unboxing: se «desempaqueta»
` },
          ],
          actividades: [
            {
              titulo: "Punto con Equals y ToString",
              nivel: 3,
              enunciado: r`<p>Crea una clase <strong><code>Punto</code></strong> con coordenadas
<code>X</code> e <code>Y</code> (solo lectura).
<strong>Sobrescribe</strong> <code>ToString()</code> (para mostrar
<code>(3, 4)</code>), <code>Equals()</code> (dos puntos son iguales si
tienen las mismas coordenadas) y <code>GetHashCode()</code>. Comprueba
la diferencia entre <code>==</code> entre referencias y
<code>Equals</code>.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Si sobrescribes <code>Equals</code>, <strong>sobrescribe también
<code>GetHashCode</code></strong>.</li>
<li>Sin sobrescribir, <code>Equals</code> compara referencias.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "Para este tipo de datos existe record, que genera todo esto automáticamente: record Punto(int X, int Y);", codigo: r`Punto a = new Punto(3, 4);
Punto b = new Punto(3, 4);

Console.WriteLine(a);                       // (3, 4): Console.WriteLine usa ToString()
Console.WriteLine(a == b);                  // False: son dos objetos distintos en memoria
Console.WriteLine(a.Equals(b));             // True: mismas coordenadas

class Punto
{
    public int X { get; }
    public int Y { get; }

    public Punto(int x, int y) { X = x; Y = y; }

    public override string ToString() => $"({X}, {Y})";

    public override bool Equals(object? obj)
    {
        return obj is Punto otro && otro.X == X && otro.Y == Y;   // pattern matching: tipo y coordenadas
    }

    public override int GetHashCode() => HashCode.Combine(X, Y);
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-polimorfismo",
          titulo: "Polimorfismo",
          duracion: "14 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Entender el polimorfismo de subtipos", "Usar una variable de la clase madre con objetos de las hijas", "Consultar el tipo real con is"],
          teoria: r`<p>El <strong>polimorfismo</strong> nos permite ejecutar <strong>el
mismo código con objetos de distinto tipo</strong>: una variable de la
clase madre puede referenciar objetos de cualquiera de sus clases hijas,
y <strong>cada objeto responde a su manera</strong>.</p>
<p>Para que funcione necesitamos:</p>
<ol type="1">
<li>Que todos los objetos <strong>hereden de la misma
superclase</strong>.</li>
<li>Que esa superclase <strong>declare el método</strong> que queremos
ejecutar (como <code>virtual</code> o <code>abstract</code>).</li>
<li>Que las hijas lo <strong>sobrescriban</strong> con
<code>override</code>.</li>
</ol>
<p>Una variable solo tiene <strong>un tipo</strong>, así que la variable
que usamos será del tipo de la superclase, y solo podemos usar a través
de ella <strong>los miembros que la superclase define</strong>.</p>
<!--ex:0-->
<div class="callout">
<p><strong>Matiz importante.</strong> A veces se explica que, al guardar
un hijo en una variable de la madre, «se pierde» lo que es propio de la
hija. En realidad <strong>el objeto sigue siendo el mismo</strong>; lo
que ocurre es que a través de la variable <code>soloAlimento</code> solo
<strong>vemos</strong> lo que declara <code>Alimento</code>. Si
preguntamos <code>soloAlimento.GetType()</code>, seguirá devolviendo
<code>AlimentoSolido</code>, y al llamar a un método
<code>virtual</code> se ejecutará <strong>la versión de la
hija</strong>.</p>
</div>
<p>Veamos un ejemplo con <code>Alimento</code>,
<code>AlimentoSolido</code> y <code>AlimentoLiquido</code> (reutilizamos
<code>Alimento</code> y <code>AlimentoSolido</code> del Tema 2). La
función <code>ImprimeAlimento(Alimento alim)</code> recibe un alimento
de <strong>cualquier tipo</strong> y usa su <code>ToString()</code>:</p>
<!--ex:1-->
<p>Salida:</p>
<pre><code>nombre:naranjada,cantidad:100
nombre:bistec,cantidad:100gramos,dureza:20
nombre:limonada,cantidad:100litros,viscosidad:9</code></pre>
<p>Aunque la función recibe un <code>Alimento</code>, cada llamada
ejecuta <strong>la implementación de su clase real</strong>: por eso la
salida es distinta.</p>
<h4 id="consultar-el-tipo-real-is-y-as">Consultar el tipo real:
<code>is</code> y <code>as</code></h4>
<p>Como a través de <code>Alimento</code> no vemos <code>Dureza</code>,
si necesitamos algo propio de la hija comprobamos su tipo con
<strong><code>is</code></strong> (con <em>pattern matching</em>, que
además crea la variable convertida):</p>
<!--ex:2-->
<div class="callout">
<p>Evita llenar el programa de <code>is</code>: si te encuentras
comprobando tipos constantemente, suele ser mejor <strong>añadir un
método virtual</strong> a la madre y dejar que el polimorfismo haga el
trabajo.</p>
</div>
<p>Al observar el ejemplo, crear un objeto de la clase
<code>Alimento</code> tiene poco sentido: un alimento será sólido o
líquido (o gaseoso, pero no lo complicamos). Pero la clase es
<strong>necesaria</strong> para poder derivar de ella y aprovechar el
polimorfismo. Si estamos en esta situación, con una clase de la que
<strong>no tiene sentido crear objetos</strong>, esa clase será
<strong>abstracta</strong>.</p>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`AlimentoSolido bistec = new AlimentoSolido("bistec", 100, 400, 20);
Alimento soloAlimento = bistec;           // conversión implícita (upcast): no hace falta escribir (Alimento)bistec

// ===== Alimento =====
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // virtual: las clases hijas PUEDEN cambiarla. En un alimento genérico no hay unidad
    public virtual string UnidadMedida => "";

    // Sobrescribe el ToString() que heredamos de Object
    public override string ToString()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}";
    }
}

// ===== AlimentoSolido =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }

    // Sobrescribe la propiedad de la madre
    public override string UnidadMedida => "gramos";

    // Reutiliza el ToString de la madre y le añade lo propio
    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},dureza:{Dureza}";
    }

    public void MuestraMedidas()
    {
        Console.WriteLine($"medida:{base.UnidadMedida}");    // implementación de la clase madre: vacía
        Console.WriteLine($"medida:{UnidadMedida}");         // implementación de esta clase: gramos
        Console.WriteLine(base.ToString());                  // versión de Alimento
        Console.WriteLine(ToString());                       // versión de AlimentoSolido
    }
}
` },
            { titulo: "Ejemplo 2", codigo: r`Alimento naranjada = new Alimento("naranjada", 100, 35);
AlimentoSolido bistec = new AlimentoSolido("bistec", 100, 400, 20);
AlimentoLiquido limonada = new AlimentoLiquido("limonada", 100, 25, 9);

ImprimeAlimento(naranjada);
ImprimeAlimento(bistec);
ImprimeAlimento(limonada);

// Recibe un Alimento, pero admite también cualquier hija
static void ImprimeAlimento(Alimento alim)
{
    Console.WriteLine(alim.ToString());           // se ejecuta el ToString del tipo REAL del objeto
}

// ===== AlimentoLiquido.cs =====
public class AlimentoLiquido : Alimento
{
    public int Viscosidad { get; }

    public AlimentoLiquido(string nombre, int cantidad, int kcal, int viscosidad)
        : base(nombre, cantidad, kcal)
    {
        Viscosidad = viscosidad;
    }

    public override string UnidadMedida => "litros";

    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},viscosidad:{Viscosidad}";
    }
}

// ===== Alimento =====
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // virtual: las clases hijas PUEDEN cambiarla. En un alimento genérico no hay unidad
    public virtual string UnidadMedida => "";

    // Sobrescribe el ToString() que heredamos de Object
    public override string ToString()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}";
    }
}

// ===== AlimentoSolido =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }

    // Sobrescribe la propiedad de la madre
    public override string UnidadMedida => "gramos";

    // Reutiliza el ToString de la madre y le añade lo propio
    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},dureza:{Dureza}";
    }

    public void MuestraMedidas()
    {
        Console.WriteLine($"medida:{base.UnidadMedida}");    // implementación de la clase madre: vacía
        Console.WriteLine($"medida:{UnidadMedida}");         // implementación de esta clase: gramos
        Console.WriteLine(base.ToString());                  // versión de Alimento
        Console.WriteLine(ToString());                       // versión de AlimentoSolido
    }
}
` },
            { titulo: "Ejemplo 3", codigo: r`static void Describe(Alimento alim)
{
    if (alim is AlimentoSolido solido)             // ¿es realmente un sólido? si lo es, lo guarda en 'solido'
    {
        Console.WriteLine($"Es sólido, dureza {solido.Dureza}");
    }
    else
    {
        Console.WriteLine("No es sólido");
    }
}

// ===== Alimento =====
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // virtual: las clases hijas PUEDEN cambiarla. En un alimento genérico no hay unidad
    public virtual string UnidadMedida => "";

    // Sobrescribe el ToString() que heredamos de Object
    public override string ToString()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}";
    }
}

// ===== AlimentoSolido =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }

    // Sobrescribe la propiedad de la madre
    public override string UnidadMedida => "gramos";

    // Reutiliza el ToString de la madre y le añade lo propio
    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},dureza:{Dureza}";
    }

    public void MuestraMedidas()
    {
        Console.WriteLine($"medida:{base.UnidadMedida}");    // implementación de la clase madre: vacía
        Console.WriteLine($"medida:{UnidadMedida}");         // implementación de esta clase: gramos
        Console.WriteLine(base.ToString());                  // versión de Alimento
        Console.WriteLine(ToString());                       // versión de AlimentoSolido
    }
}
` },
          ],
          actividades: [
            {
              titulo: "Enemigos que atacan",
              nivel: 2,
              enunciado: r`<p>Crea una clase base <strong><code>Enemigo</code></strong> con un
método <strong><code>virtual</code></strong> <code>Atacar()</code> que
devuelva el daño (5 por defecto), y dos clases hijas:
<strong><code>Orco</code></strong> (daño 12) y
<strong><code>Mago</code></strong> (daño 20). Crea un <strong>array de
<code>Enemigo</code></strong> con uno de cada tipo y recórrelo mostrando
lo que ataca cada uno.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Un único bucle debe funcionar con <strong>todos</strong> los tipos
de enemigo (polimorfismo).</li>
<li>Recuerda <code>virtual</code> en la madre y <code>override</code> en
las hijas.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "Cada objeto ejecuta su versión de Atacar() aunque la variable sea de tipo Enemigo.", codigo: r`Enemigo[] enemigos = { new Enemigo(), new Orco(), new Mago() };

foreach (Enemigo e in enemigos)
{
    Console.WriteLine($"{e.GetType().Name} ataca con {e.Atacar()} de daño");
}

class Enemigo
{
    public virtual int Atacar() => 5;            // las hijas pueden cambiarlo
}

class Orco : Enemigo
{
    public override int Atacar() => 12;
}

class Mago : Enemigo
{
    public override int Atacar() => 20;
}
` },
              ],
            },
          ],
        },
        {
          id: "poo-abstractas-interfaces",
          titulo: "Clases abstractas e interfaces",
          duracion: "18 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Declarar clases y métodos abstractos", "Definir e implementar interfaces", "Elegir entre clase abstracta e interfaz"],
          teoria: r`<p>Una <strong>clase abstracta</strong> define una estructura pensada
<strong>solo para ser usada como superclase</strong>: <strong>no se
pueden crear objetos</strong> de una clase abstracta.</p>
<ul>
<li>Como nunca habrá un objeto de esa clase, puede contener
<strong>métodos abstractos</strong>: métodos <strong>sin
implementar</strong>, de los que solo se declara el nombre, los
parámetros y el tipo de retorno.</li>
<li>Solo una clase <strong>abstracta</strong> puede tener métodos
abstractos.</li>
<li>Las clases que <strong>heredan</strong> de una abstracta
<strong>deben implementar</strong> (con <code>override</code>) todos sus
métodos abstractos (salvo que sean también abstractas).</li>
<li>Una clase abstracta puede combinar métodos <strong>abstractos y no
abstractos</strong>.</li>
<li>Aunque no podemos <strong>crear</strong> un objeto de una clase
abstracta, sí podemos <strong>declarar variables</strong> de ese tipo.
Esa variable solo podrá inicializarse con un objeto de una <strong>clase
hija</strong> (gracias al polimorfismo):</li>
</ul>
<!--ex:0-->
<p>La palabra clave es <strong><code>abstract</code></strong>:</p>
<pre><code>abstract class NombreClase { … }
public abstract TipoRetorno NombreMetodo();      // sin cuerpo y con punto y coma</code></pre>
<p>Ejemplo: <code>Alimento</code> pasa a ser <strong>abstracta</strong>
con un método abstracto <code>Imprimir()</code>. Creamos un array de
<code>Alimento</code> con un sólido y un líquido y llamamos a
<code>Imprimir()</code> de cada uno:</p>
<!--ex:1-->
<p>Salida:</p>
<pre><code>nombre:bistec,cantidad:100gramos,dureza:20
nombre:limonada,cantidad:100litros,viscosidad:9</code></pre>
<p>Hemos usado un método propio <code>Imprimir()</code> en lugar de
<code>ToString()</code> porque <code>ToString()</code> ya viene de
<code>Object</code>; así mostramos un método declarado
<strong>solo</strong> en <code>Alimento</code> y que obligamos a
implementar a las hijas.</p>
<p>Ahora pensemos: ¿y si quisiéramos una función que pudiera llamar a
<code>Imprimir()</code> de <strong>cualquier objeto que lo
tenga</strong>, aunque <strong>no compartan superclase</strong>? Para
eso necesitamos <strong>interfaces</strong>.</p>
<h3 id="33-interfaces">3.3 Interfaces</h3>
<p>Una <strong>interfaz</strong> agrupa un conjunto de
<strong>declaraciones de miembros</strong> (métodos, propiedades…) que
una clase <strong>se compromete a ofrecer</strong>. Se define con la
palabra <strong><code>interface</code></strong>.</p>
<p>Por <strong>convención en C#</strong>, el nombre de una interfaz
<strong>empieza por <code>I</code></strong> mayúscula y suele ser un
adjetivo, porque indica que una clase «puede hacer algo»:
<code>IImprimible</code>, <code>IComparable</code>,
<code>IDisposable</code>.</p>
<!--ex:2-->
<ul>
<li>Los miembros de una interfaz son <strong>públicos y
abstractos</strong> de forma implícita.</li>
<li>Una interfaz <strong>no puede tener campos de instancia</strong> (no
guarda estado).</li>
<li>Cualquier clase puede <strong>implementar una o varias
interfaces</strong>, separadas por comas, después de la clase madre (si
la tiene): <code>class A : Madre, IUno, IDos</code>.</li>
<li>La clase que implementa una interfaz <strong>debe implementar todos
sus miembros</strong>.</li>
<li>Como con las clases abstractas, <strong>no se puede crear un
objeto</strong> de una interfaz, pero sí <strong>declarar
variables</strong> de ese tipo, que se inicializan con cualquier clase
que la implemente:</li>
</ul>
<!--ex:3-->
<div class="callout">
<p><strong>Novedad desde C# 8:</strong> una interfaz puede incluir una
<strong>implementación por defecto</strong> de un método (<em>default
interface methods</em>). Se usa en casos muy concretos (evolucionar una
interfaz sin romper las clases que ya la implementan). Para empezar,
piensa en las interfaces como <strong>contratos sin código</strong>.</p>
</div>
<p>Ejemplo: creamos la interfaz <code>IImprimible</code> y una función
que llama a <code>Imprimir()</code> de <strong>cualquier</strong> objeto
que la implemente. Añadimos la clase <code>Cubierto</code>, que
<strong>no comparte superclase</strong> con los alimentos, pero también
implementa la interfaz. Para ello, <code>Alimento</code> pasa a
declararse <code>public abstract class Alimento : IImprimible</code>
(solo cambia esa línea; <code>AlimentoSolido</code> y
<code>AlimentoLiquido</code> no cambian).</p>
<!--ex:4-->
<p>Salida:</p>
<pre><code>nombre:bistec,cantidad:100gramos,dureza:20
nombre:limonada,cantidad:100litros,viscosidad:9
nombre:cuchara, funcion: comer líquidos</code></pre>
<h4 id="clase-abstracta-o-interfaz-cuál-uso">Clase abstracta o interfaz:
¿cuál uso?</h4>
<div class="table-wrap"><table>
<thead>
<tr class="header">
<th></th>
<th>Clase abstracta</th>
<th>Interfaz</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>¿Se pueden crear objetos?</td>
<td>No</td>
<td>No</td>
</tr>
<tr class="even">
<td>¿Puede tener atributos con estado?</td>
<td><strong>Sí</strong></td>
<td>No</td>
</tr>
<tr class="odd">
<td>¿Puede tener constructor?</td>
<td><strong>Sí</strong></td>
<td>No</td>
</tr>
<tr class="even">
<td>¿Puede tener métodos implementados?</td>
<td><strong>Sí</strong></td>
<td>Solo implementación por defecto (C# 8+)</td>
</tr>
<tr class="odd">
<td>¿Cuántas puede usar una clase?</td>
<td><strong>Una sola</strong> (herencia simple)</td>
<td><strong>Varias</strong></td>
</tr>
<tr class="even">
<td>¿Cuándo?</td>
<td>Cuando las clases <strong>comparten código y datos</strong> («es
un»)</td>
<td>Cuando clases <strong>sin relación</strong> comparten un
<strong>comportamiento</strong> («puede hacer»)</td>
</tr>
</tbody>
</table></div>
<hr />
<ul>
<li>Polimorfismo: <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/object-oriented/polymorphism">https://learn.microsoft.com/dotnet/csharp/fundamentals/object-oriented/polymorphism</a></li>
<li>Clases abstractas: <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/abstract">https://learn.microsoft.com/dotnet/csharp/language-reference/keywords/abstract</a></li>
<li>Interfaces: <a
href="https://learn.microsoft.com/dotnet/csharp/fundamentals/types/interfaces">https://learn.microsoft.com/dotnet/csharp/fundamentals/types/interfaces</a></li>
<li>Operador <code>is</code> y <em>pattern matching</em>: <a
href="https://learn.microsoft.com/dotnet/csharp/language-reference/operators/is">https://learn.microsoft.com/dotnet/csharp/language-reference/operators/is</a></li>
</ul>`,
          ejemplos: [
            { titulo: "Ejemplo 1", codigo: r`Alimento alimGenerico = new AlimentoSolido("bistec", 100, 400, 20);   // ✔
// Alimento otro = new Alimento("pan", 100, 300);                    // ❌ error CS0144: no se puede crear una instancia de una clase abstracta

// ===== Alimento =====
public class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public Alimento() { }

    public Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // virtual: las clases hijas PUEDEN cambiarla. En un alimento genérico no hay unidad
    public virtual string UnidadMedida => "";

    // Sobrescribe el ToString() que heredamos de Object
    public override string ToString()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}";
    }
}

// ===== AlimentoSolido =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public void Masticar(int intensidad)
    {
        Dureza = Math.Max(0, Dureza - intensidad);
    }

    // Sobrescribe la propiedad de la madre
    public override string UnidadMedida => "gramos";

    // Reutiliza el ToString de la madre y le añade lo propio
    public override string ToString()
    {
        return $"{base.ToString()}{UnidadMedida},dureza:{Dureza}";
    }

    public void MuestraMedidas()
    {
        Console.WriteLine($"medida:{base.UnidadMedida}");    // implementación de la clase madre: vacía
        Console.WriteLine($"medida:{UnidadMedida}");         // implementación de esta clase: gramos
        Console.WriteLine(base.ToString());                  // versión de Alimento
        Console.WriteLine(ToString());                       // versión de AlimentoSolido
    }
}
` },
            { titulo: "Ejemplo 2", codigo: r`AlimentoSolido bistec = new AlimentoSolido("bistec", 100, 400, 20);
AlimentoLiquido limonada = new AlimentoLiquido("limonada", 100, 25, 9);

Alimento[] alimentos = new Alimento[2];      // array de la clase abstracta
alimentos[0] = bistec;
alimentos[1] = limonada;

ImprimeAlimentos(alimentos);

// Recorre el array y llama a Imprimir() de cada uno (se ejecuta la implementación de cada hija)
static void ImprimeAlimentos(Alimento[] alimentos)
{
    foreach (Alimento alimento in alimentos)
    {
        Console.WriteLine(alimento.Imprimir());
    }
}

// ===== Alimento.cs =====
public abstract class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public virtual string UnidadMedida => "";

    // Constructor protected: solo lo pueden usar las clases hijas
    protected Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // Método abstracto: sin implementación. Las hijas DEBEN implementarlo
    public abstract string Imprimir();
}

// ===== AlimentoSolido.cs =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public override string UnidadMedida => "gramos";

    public override string Imprimir()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}{UnidadMedida},dureza:{Dureza}";
    }
}

// ===== AlimentoLiquido.cs =====
public class AlimentoLiquido : Alimento
{
    public int Viscosidad { get; }

    public AlimentoLiquido(string nombre, int cantidad, int kcal, int viscosidad)
        : base(nombre, cantidad, kcal)
    {
        Viscosidad = viscosidad;
    }

    public override string UnidadMedida => "litros";

    public override string Imprimir()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}{UnidadMedida},viscosidad:{Viscosidad}";
    }
}
` },
            { titulo: "Clase IImprimible", noRun: true, codigo: r`// IImprimible.cs
public interface IImprimible
{
    string Imprimir();                 // solo se declara: no se escribe el cuerpo ni 'public' ni 'abstract'
}
` },
            { titulo: "Ejemplo 4", codigo: r`IImprimible alimento1 = new AlimentoLiquido("limonada", 100, 25, 9);

// ===== AlimentoLiquido =====
public class AlimentoLiquido : Alimento
{
    public int Viscosidad { get; }

    public AlimentoLiquido(string nombre, int cantidad, int kcal, int viscosidad)
        : base(nombre, cantidad, kcal)
    {
        Viscosidad = viscosidad;
    }

    public override string UnidadMedida => "litros";

    public override string Imprimir()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}{UnidadMedida},viscosidad:{Viscosidad}";
    }
}

// ===== IImprimible =====
public interface IImprimible
{
    string Imprimir();                 // solo se declara: no se escribe el cuerpo ni 'public' ni 'abstract'
}

// ===== Alimento =====
public abstract class Alimento
{
    public string Nombre { get; set; } = "";
    public int Cantidad { get; set; }
    public int Kcal { get; set; }

    public virtual string UnidadMedida => "";

    // Constructor protected: solo lo pueden usar las clases hijas
    protected Alimento(string nombre, int cantidad, int kcal)
    {
        Nombre = nombre;
        Cantidad = cantidad;
        Kcal = kcal;
    }

    // Método abstracto: sin implementación. Las hijas DEBEN implementarlo
    public abstract string Imprimir();
}
` },
            { titulo: "Ejemplo 5", codigo: r`AlimentoSolido bistec = new AlimentoSolido("bistec", 100, 400, 20);
AlimentoLiquido limonada = new AlimentoLiquido("limonada", 100, 25, 9);
Cubierto cuchara = new Cubierto("cuchara", "comer líquidos");

ImprimeCualquierImprimible(bistec);
ImprimeCualquierImprimible(limonada);
ImprimeCualquierImprimible(cuchara);

// Admite cualquier objeto que implemente IImprimible, sea cual sea su superclase
static void ImprimeCualquierImprimible(IImprimible imprimible)
{
    string texto = imprimible.Imprimir();
    Console.WriteLine(texto);
}

// ===== Alimento.cs =====
public abstract class Alimento : IImprimible
{
    // … igual que antes: Nombre, Cantidad, Kcal, UnidadMedida, constructor protected …

    public abstract string Imprimir();             // cumple el contrato de IImprimible y obliga a las hijas a implementarlo
}

// ===== Cubierto.cs =====
public class Cubierto : IImprimible
{
    public string Nombre { get; }
    public string Funcion { get; }

    public Cubierto(string nombre, string funcion)
    {
        Nombre = nombre;
        Funcion = funcion;
    }

    // Implementa el método de la interfaz
    public string Imprimir()
    {
        return $"nombre:{Nombre}, funcion: {Funcion}";
    }
}

// ===== AlimentoSolido =====
public class AlimentoSolido : Alimento
{
    public int Dureza { get; private set; }

    public AlimentoSolido(string nombre, int cantidad, int kcal, int dureza)
        : base(nombre, cantidad, kcal)
    {
        Dureza = dureza;
    }

    public override string UnidadMedida => "gramos";

    public override string Imprimir()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}{UnidadMedida},dureza:{Dureza}";
    }
}

// ===== AlimentoLiquido =====
public class AlimentoLiquido : Alimento
{
    public int Viscosidad { get; }

    public AlimentoLiquido(string nombre, int cantidad, int kcal, int viscosidad)
        : base(nombre, cantidad, kcal)
    {
        Viscosidad = viscosidad;
    }

    public override string UnidadMedida => "litros";

    public override string Imprimir()
    {
        return $"nombre:{Nombre},cantidad:{Cantidad}{UnidadMedida},viscosidad:{Viscosidad}";
    }
}

// ===== IImprimible =====
public interface IImprimible
{
    string Imprimir();                 // solo se declara: no se escribe el cuerpo ni 'public' ni 'abstract'
}
` },
          ],
          actividades: [
            {
              titulo: "El autobús de la ciudad extraterrestre 🚌",
              nivel: 2,
              enunciado: r`<p>Continuamos con la actividad del tema anterior
(<strong>Extraterrestre</strong>, <strong>Cabecin</strong> y
<strong>Cabezon</strong>, con raza, espacio, <code>ToString()</code>,
<code>Estresar()</code> y el tercer ojo).</p>
<ul>
<li>Como <code>Extraterrestre</code> ya no tiene sentido como objeto,
<strong>conviértela en una clase abstracta</strong>. Su método
<strong><code>Estresar()</code> pasa a ser abstracto</strong> y cada
raza lo implementa a su manera.</li>
<li>Crea también una clase <strong><code>Paquete</code></strong> con los
atributos <strong><code>Espacio</code></strong> y
<strong><code>Descripcion</code></strong>.</li>
<li>En <code>CabezaWorld</code> define un array
<strong><code>habitantes</code></strong> que contenga Cabecines y
Cabezones y, a continuación, <strong>imprime</strong> la información de
los habitantes.</li>
<li>Con una interfaz de nombre
<strong><code>IOcupaEspacio</code></strong>, crea en
<code>CabezaWorld</code> un array <strong><code>autobus</code></strong>
que pueda contener elementos de la clase
<strong><code>Cabecin</code></strong>,
<strong><code>Cabezon</code></strong> o
<strong><code>Paquete</code></strong>. Para conseguirlo, las tres clases
deben implementar <code>IOcupaEspacio</code>. Muestra la
<strong>descripción</strong> y el <strong>espacio</strong> que ocupan
todos los integrantes del autobús.</li>
</ul>
<pre><code>int Espacio { get; }                         // spaces occupied (member of IOcupaEspacio)
string Descripcion { get; }                  // text describing the element (member of IOcupaEspacio)
public abstract void Estresar();             // each race implements its own way of getting stressed</code></pre>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Basta con que <strong><code>Extraterrestre</code> implemente
<code>IOcupaEspacio</code></strong> para que <code>Cabecin</code> y
<code>Cabezon</code> también lo hagan (por herencia).</li>
<li>La descripción de un extraterrestre es el resultado de su
<code>ToString()</code>.</li>
<li>Comprueba que <code>new Extraterrestre(...)</code> <strong>ya no
compila</strong>.</li>
</ul>
<p>💡 <strong>TIP:</strong> el array <code>autobus</code> es de tipo
<code>IOcupaEspacio[]</code>; puedes guardar en él los habitantes que
quieras y un <code>Paquete</code>.</p>
<p>🏅 <strong>Ampliación:</strong> calcula con un bucle el
<strong>espacio total</strong> que ocupa el autobús.</p>
<p>🏅🏅 <strong>Ampliación avanzada:</strong> crea una función
<code>static bool CabeEnBus(IOcupaEspacio[] autobus, int capacidad)</code>
que devuelva si todos los elementos caben en un autobús de esa
capacidad. Después, escribe una versión de una línea con LINQ
(<code>Sum</code>).</p>`,
              soluciones: [
                { titulo: "Solución", nota: "Salida:\n\ntext\nHabitantes:\n  cabecín: Cabi, piel rojo\n  cabecín: Cabu, piel gris\n  cabezón: Zoro, piel azul, tercer ojo negro\n  cabezón: Zuri, piel amarillo, tercer ojo rojo\n\nAutobús:\n  cabecín: Cabi, piel rojo - ocupa 1\n  cabezón: Zoro, piel azul, tercer ojo negro - ocupa 2\n  maleta grande - ocupa 3", codigo: r`Cabecin cabecin1 = new Cabecin("Cabi", "verde");
Cabecin cabecin2 = new Cabecin("Cabu", "gris");
Cabezon cabezon1 = new Cabezon("Zoro", "naranja");
Cabezon cabezon2 = new Cabezon("Zuri", "amarillo");
cabezon1.TercerOjo = "negro";                          // valor correcto
cabezon2.TercerOjo = "violeta";                        // valor incorrecto: se guarda "rojo"

// 1) Array de la clase abstracta: mezcla cabecines y cabezones
Extraterrestre[] habitantes = { cabecin1, cabecin2, cabezon1, cabezon2 };

habitantes[0].Estresar();                              // polimorfismo: cada raza se estresa a su manera
habitantes[2].Estresar();

Console.WriteLine("Habitantes:");
foreach (Extraterrestre habitante in habitantes)
{
    Console.WriteLine($"  {habitante}");               // llama al ToString() de cada raza
}

// 2) Array de la interfaz: puede mezclar extraterrestres y paquetes
IOcupaEspacio[] autobus = { cabecin1, cabezon1, new Paquete(3, "maleta grande") };

Console.WriteLine();
Console.WriteLine("Autobús:");
int espacioTotal = 0;
foreach (IOcupaEspacio elemento in autobus)
{
    Console.WriteLine($"  {elemento.Descripcion} -> ocupa {elemento.Espacio}");
    espacioTotal += elemento.Espacio;
}
Console.WriteLine($"Espacio total: {espacioTotal}");

// ===== IOcupaEspacio.cs =====
public interface IOcupaEspacio
{
    int Espacio { get; }               // espacios que ocupa
    string Descripcion { get; }        // texto que lo describe
}

// ===== Extraterrestre.cs =====
public abstract class Extraterrestre : IOcupaEspacio
{
    public string Nombre { get; set; }
    public string ColorPiel { get; set; }

    public virtual string Raza => "extraterrestre";
    public virtual int Espacio => 1;                       // cumple el contrato de IOcupaEspacio

    // La descripción de un extraterrestre es su ToString()
    public string Descripcion => ToString();

    protected Extraterrestre(string nombre, string colorPiel)
    {
        Nombre = nombre;
        ColorPiel = colorPiel;
    }

    // Abstracto: cada raza decide cómo se estresa
    public abstract void Estresar();

    public override string ToString()
    {
        return $"{Raza}: {Nombre}, piel {ColorPiel}";
    }
}

// ===== Cabecin.cs =====
public class Cabecin : Extraterrestre
{
    public Cabecin(string nombre, string colorPiel) : base(nombre, colorPiel) { }

    public override string Raza => "cabecín";
    public override int Espacio => 1;

    public override void Estresar()
    {
        ColorPiel = "rojo";
    }
}

// ===== Cabezon.cs =====
public class Cabezon : Extraterrestre
{
    private static readonly string[] ColoresOjo = { "marron", "negro", "rojo" };

    private string tercerOjo = "rojo";

    public Cabezon(string nombre, string colorPiel) : base(nombre, colorPiel) { }

    public override string Raza => "cabezón";
    public override int Espacio => 2;

    public string TercerOjo
    {
        get => tercerOjo;
        set => tercerOjo = ColoresOjo.Contains(value) ? value : "rojo";
    }

    public override void Estresar()
    {
        ColorPiel = "azul";
    }

    public override string ToString()
    {
        return $"{base.ToString()}, tercer ojo {TercerOjo}";
    }
}

// ===== Paquete.cs =====
public class Paquete : IOcupaEspacio
{
    public int Espacio { get; }
    public string Descripcion { get; }

    public Paquete(int espacio, string descripcion)
    {
        Espacio = espacio;
        Descripcion = descripcion;
    }
}
` },
                { titulo: "Solución · ampliación avanzada", codigo: r`// Comprueba si todos los elementos del autobús caben en la capacidad indicada
static bool CabeEnBus(IOcupaEspacio[] autobus, int capacidad)
{
    int total = 0;
    foreach (IOcupaEspacio elemento in autobus)
    {
        total += elemento.Espacio;
    }
    return total <= capacidad;
}

// Versión de una línea con LINQ
static bool CabeEnBusLinq(IOcupaEspacio[] autobus, int capacidad) => autobus.Sum(e => e.Espacio) <= capacidad;

// ===== IOcupaEspacio =====
public interface IOcupaEspacio
{
    int Espacio { get; }               // espacios que ocupa
    string Descripcion { get; }        // texto que lo describe
}
` },
              ],
            },
            {
              titulo: "Seres voladores",
              nivel: 2,
              enunciado: r`<p>Crea una interfaz <strong><code>IVolador</code></strong> con un
método <code>string Volar()</code> y una propiedad
<code>int Altura { get; }</code>. Implementa la interfaz en las clases
<strong><code>Pajaro</code></strong> y
<strong><code>Dragon</code></strong> (que <strong>no</strong> comparten
superclase) y en <strong><code>Avion</code></strong>. Crea un array de
<code>IVolador</code> y muestra lo que hace volar cada uno.</p>
<p><strong>Observaciones importantes:</strong></p>
<ul>
<li>Una clase puede implementar <strong>varias</strong> interfaces, pero
heredar de <strong>una</strong> clase.</li>
<li>Una función <code>static void Despegar(IVolador v)</code> debe
aceptar cualquiera de los tres.</li>
</ul>`,
              soluciones: [
                { titulo: "Solución", nota: "Las tres clases no tienen nada en común salvo el contrato IVolador: eso es lo que permite tratarlas igual.", codigo: r`IVolador[] voladores = { new Pajaro(), new Dragon(), new Avion() };

foreach (IVolador v in voladores)
{
    Despegar(v);
}

void Despegar(IVolador v)
{
    Console.WriteLine($"{v.Volar()} a {v.Altura} metros");
}

interface IVolador
{
    string Volar();
    int Altura { get; }
}

class Pajaro : IVolador
{
    public int Altura => 50;
    public string Volar() => "El pájaro bate las alas";
}

class Dragon : IVolador
{
    public int Altura => 300;
    public string Volar() => "El dragón escupe fuego mientras vuela";
}

class Avion : IVolador
{
    public int Altura => 10000;
    public string Volar() => "El avión despega";
}
` },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "m8",
      titulo: "Autoevaluación y repaso",
      lecciones: [
        {
          id: "test-iniciacion",
          titulo: "Test de iniciación",
          duracion: "10 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Comprobar los conceptos básicos antes de seguir avanzando", "Detectar qué temas conviene repasar"],
          teoria: r`<p>Diez preguntas al azar tomadas de <strong>todas las lecciones del curso</strong>. Cada vez que repitas el test saldrán preguntas distintas y las opciones aparecerán en otro orden. ¡Si fallas, lee la explicación: ahí está lo que de verdad se aprende!</p>`,
          ejemplos: [
          ],
          actividades: [
          ],
          testAleatorio: 10,
        },
        {
          id: "test-global",
          titulo: "Test global del curso",
          duracion: "25 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Repasar todo el curso de una sola vez", "Prepararte para el examen"],
          teoria: r`<p>Veinticinco preguntas al azar de <strong>todo el temario</strong>: variables, control de flujo, arrays, funciones, ficheros y programación orientada a objetos. Repítelo hasta que saques la nota que buscas.</p>`,
          ejemplos: [
          ],
          actividades: [
          ],
          testAleatorio: 25,
        },
        {
          id: "glosario",
          titulo: "Glosario de conceptos clave",
          duracion: "10 min",
          video: { provider: "drive", id: "" },
          objetivos: ["Repasar el vocabulario esencial de cada tema"],
          teoria: r`<h4 id="uf1--tema-1">UF1 · Tema 1</h4>
<ul>
<li><strong>Compilar:</strong> transformar el código fuente en un código
que la máquina (o el runtime) pueda ejecutar.</li>
<li><strong>Código máquina:</strong> el código que ejecuta directamente
la CPU.</li>
<li><strong>Código fuente:</strong> el código escrito por el
programador.</li>
<li><strong>CIL (código intermedio):</strong> código que genera el
compilador de C#; el runtime lo traduce a código máquina con el
JIT.</li>
<li><strong>Lenguajes de bajo nivel:</strong> próximos al código
máquina.</li>
<li><strong>Lenguajes de alto nivel:</strong> alejados del código
máquina y fáciles de entender para las personas.</li>
<li><strong>SDK / Runtime:</strong> herramientas para desarrollar / para
ejecutar programas .NET.</li>
<li><strong>Variable:</strong> espacio de memoria con nombre, de un tipo
concreto, cuyo contenido puede variar.</li>
<li><strong>Constante:</strong> valor con nombre que no cambia
(<code>const</code>).</li>
<li><strong>Parsear:</strong> transformar un texto en un valor de otro
tipo, normalmente numérico.</li>
<li><strong>Cast:</strong> conversión explícita a otro tipo que puede
perder información.</li>
<li><strong>Operador de cortocircuito:</strong> <code>&amp;&amp;</code>
y <code>||</code> no evalúan la segunda parte si la primera ya decide el
resultado.</li>
</ul>
<hr />
<h4 id="uf1--tema-2">UF1 · Tema 2</h4>
<ul>
<li><strong>Flujo de un programa:</strong> orden en el que se van
ejecutando las líneas.</li>
<li><strong>Estructuras de selección:</strong> ejecutan unas líneas u
otras según una condición (<code>if</code>, <code>switch</code>).</li>
<li><strong>Estructuras de repetición:</strong> vuelven a ejecutar unas
líneas mientras se cumpla una condición (<code>while</code>,
<code>for</code>, <code>do-while</code>, <code>foreach</code>).</li>
<li><strong>Estructuras de salto:</strong> cambian el flujo saltándose
líneas (<code>break</code>, <code>continue</code>,
<code>return</code>).</li>
<li><strong>Excepción:</strong> error en tiempo de ejecución que detiene
el programa si no se controla.</li>
<li><strong>Estructuras de control de errores:</strong> capturan las
excepciones para evitar que el programa se detenga
(<code>try/catch/finally</code>).</li>
<li><strong>Bug:</strong> error en un programa.</li>
<li><strong>Depurar (<em>debug</em>):</strong> buscar y corregir
errores, normalmente ejecutando el programa paso a paso.</li>
<li><strong>Punto de interrupción:</strong> marca donde el depurador
detiene el programa.</li>
</ul>
<hr />
<h4 id="uf2--tema-1">UF2 · Tema 1</h4>
<ul>
<li><strong>Función (método):</strong> bloque de código con un nombre
que se ejecuta siempre que lo llamamos.</li>
<li><strong>Parámetro:</strong> valor que recibe una función cuando se
la llama. <strong>Argumento:</strong> el valor concreto que pasamos en
la llamada.</li>
<li><strong>Firma:</strong> nombre de la función más el número y tipo de
sus parámetros.</li>
<li><strong>Sobrecarga:</strong> varias funciones con el mismo nombre y
distinta lista de parámetros.</li>
<li><strong>Paso por valor:</strong> la función recibe una copia.
<strong>Paso por referencia (<code>ref</code>,
<code>out</code>):</strong> recibe la propia variable.</li>
<li><strong>Tipo de retorno:</strong> tipo del valor que devuelve la
función (<code>void</code> si no devuelve nada).</li>
<li><strong>Recursividad:</strong> una función es recursiva cuando se
llama a sí misma. Necesita un <strong>caso base</strong>.</li>
</ul>
<hr />
<h4 id="uf2--tema-2">UF2 · Tema 2</h4>
<ul>
<li><strong>Clase:</strong> bloque de código en el que definimos
funciones y variables.</li>
<li><strong><code>static</code>:</strong> modificador que vincula un
miembro a la clase; se llama directamente desde ella.</li>
<li><strong>Espacio de nombres (<em>namespace</em>):</strong> nombre que
agrupa clases relacionadas y evita conflictos de nombres.</li>
<li><strong><code>using</code>:</strong> directiva para usar las clases
de un espacio de nombres sin escribir su ruta completa.</li>
<li><strong>Biblioteca (librería):</strong> conjunto de clases y
espacios de nombres destinados a resolver un tipo de problemas.</li>
<li><strong>Modificador de acceso:</strong> palabra clave que indica qué
otras clases pueden acceder a un miembro (<code>public</code>,
<code>private</code>, <code>internal</code>,
<code>protected</code>…).</li>
<li><strong>Paquete NuGet:</strong> biblioteca de terceros que se añade
a un proyecto con <code>dotnet add package</code>.</li>
</ul>
<hr />
<h4 id="uf3--tema-1">UF3 · Tema 1</h4>
<ul>
<li><strong>Array:</strong> variable que permite almacenar múltiples
valores de un mismo tipo.</li>
<li><strong>Índice:</strong> posición de un elemento dentro del array.
Empieza en 0.</li>
<li><strong>Longitud (<code>Length</code>):</strong> número de elementos
que puede contener un array.</li>
<li><strong>Vector:</strong> otra forma de referirse a un array de una
dimensión.</li>
<li><strong>Array multidimensional / matriz:</strong> array con varias
dimensiones (<code>int[,]</code>).</li>
<li><strong>Array de arrays (<em>jagged</em>):</strong> array cuyos
elementos son otros arrays (<code>int[][]</code>).</li>
<li><strong>Tipo de referencia:</strong> la variable guarda la dirección
donde están los datos, no los datos.</li>
<li><strong>Clonar:</strong> crear una copia de los valores de un array
en otro array nuevo.</li>
</ul>
<hr />
<h4 id="uf3--tema-2">UF3 · Tema 2</h4>
<ul>
<li><strong>E/S (I/O):</strong> <em>input / output</em>; hace referencia
a los periféricos de entrada y salida de datos.</li>
<li><strong>Periférico:</strong> dispositivo asociado a un ordenador que
ofrece o muestra datos.</li>
<li><strong>Fichero (archivo):</strong> secuencia de bytes almacenada de
forma persistente.</li>
<li><strong>Stream (flujo):</strong> conexión con un periférico por la
que circulan bytes.</li>
<li><strong>Búfer (<em>buffer</em>):</strong> zona de memoria donde se
acumulan datos antes de enviarlos.</li>
<li><strong><code>File</code>, <code>Directory</code>,
<code>Path</code>:</strong> clases para gestionar archivos, carpetas y
rutas.</li>
<li><strong>Ruta relativa / absoluta:</strong> ubicación indicada
respecto al programa / desde la raíz del sistema.</li>
<li><strong>Acceso secuencial:</strong> leer el contenido en orden hasta
encontrar el dato.</li>
<li><strong>Acceso directo:</strong> colocarse en una posición concreta
del fichero.</li>
<li><strong><code>using</code>:</strong> instrucción que cierra
automáticamente un recurso al terminar de usarlo.</li>
</ul>
<hr />
<h4 id="uf4--tema-1">UF4 · Tema 1</h4>
<ul>
<li><strong>Declarar:</strong> definir el nombre y el tipo de una
variable.</li>
<li><strong>Inicializar:</strong> dar un valor inicial a una
variable.</li>
<li><strong>Clase:</strong> definición de una estructura de datos
(atributos y métodos).</li>
<li><strong>Objeto:</strong> variable que contiene la estructura de una
clase con sus propios valores.</li>
<li><strong>Instancia:</strong> un objeto de una clase.
<strong>Instanciar</strong> es crear un objeto.</li>
<li><strong>Atributo (campo):</strong> dato que pertenece a una
clase.</li>
<li><strong>Método:</strong> función que pertenece a una clase.</li>
<li><strong>Constructor:</strong> método especial que se ejecuta al
crear un objeto.</li>
<li><strong><code>this</code>:</strong> el objeto que está ejecutando el
método.</li>
<li><strong>Tipo de referencia:</strong> la variable guarda la dirección
donde están los datos.</li>
<li><strong><code>static</code>:</strong> miembro que pertenece a la
clase y no a cada objeto.</li>
<li><strong>Recolector de basura (GC):</strong> mecanismo que libera
automáticamente la memoria de los objetos que ya no se usan.</li>
</ul>
<hr />
<h4 id="uf4--tema-2">UF4 · Tema 2</h4>
<ul>
<li><strong>Encapsulamiento:</strong> ocultar los detalles internos de
una clase y exponer solo lo necesario.</li>
<li><strong>Modificador de acceso:</strong> palabra que indica quién
puede usar un miembro (<code>private</code>, <code>protected</code>,
<code>internal</code>, <code>public</code>…).</li>
<li><strong>Setter / getter:</strong> métodos (o partes de una
propiedad) para escribir y leer un atributo de forma controlada.</li>
<li><strong>Propiedad:</strong> miembro de C# con <code>get</code> y
<code>set</code> que se usa como un atributo.</li>
<li><strong>Superclase / clase madre / clase base:</strong> clase de la
que hereda otra.</li>
<li><strong>Clase hija / derivada:</strong> clase que hereda de
otra.</li>
<li><strong><code>:</code></strong> (en la declaración): indica que una
clase hereda de otra.</li>
<li><strong><code>base</code>:</strong> hace referencia a la clase
madre.</li>
<li><strong><code>virtual</code> / <code>override</code>:</strong>
permitir / realizar la sobrescritura de un método.</li>
<li><strong><code>sealed</code>:</strong> impide heredar de una clase o
sobrescribir de nuevo un método.</li>
<li><strong><code>Object</code>:</strong> clase de la que heredan todas
las demás.</li>
<li><strong>Tipo anulable (<code>int?</code>):</strong> tipo de valor
que además admite <code>null</code>.</li>
</ul>
<hr />
<h4 id="uf4--tema-3">UF4 · Tema 3</h4>
<ul>
<li><strong>Polimorfismo:</strong> capacidad de usar un objeto de una
clase hija donde se espera la clase madre, ejecutando el comportamiento
propio de la hija.</li>
<li><strong>Clase abstracta (<code>abstract</code>):</strong> clase de
la que no se puede crear una instancia; sirve como base.</li>
<li><strong>Método abstracto:</strong> método declarado sin
implementación; las hijas están obligadas a implementarlo.</li>
<li><strong>Interfaz (<code>interface</code>):</strong> define un
conjunto de miembros que una clase debe ofrecer.</li>
<li><strong>Implementar una interfaz:</strong> comprometerse a ofrecer
todos los miembros de la interfaz.</li>
<li><strong>Conversión implícita (<em>upcast</em>):</strong> guardar un
objeto hijo en una variable de la clase madre.</li>
<li><strong><code>is</code> / <code>as</code>:</strong> operadores para
consultar o convertir al tipo real de un objeto.</li>
</ul>
<hr />`,
          ejemplos: [
          ],
          actividades: [
          ],
        },
      ],
    },
  ],
};
