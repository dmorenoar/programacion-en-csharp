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
  },

  modulos: [
    /* ================================================================
       MÓDULO 1 · FUNDAMENTOS
       ================================================================ */
    {
      id: "m1",
      titulo: "Fundamentos",
      lecciones: [
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
      ],
    },
  ],
};
