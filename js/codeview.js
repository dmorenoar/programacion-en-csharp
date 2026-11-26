/* =====================================================================
   js/codeview.js · VISTA «CODIFICAR» (editor de C# a pantalla completa)
   ---------------------------------------------------------------------
   Pensada como un «bloc de pruebas» al estilo de dotnetfiddle.net:
     · barra de herramientas (Ejecutar, ejemplos, plantillas, guardar/abrir .cs…)
     · editor con números de línea, resaltado y atajos
     · entrada del programa y salida con tiempo y memoria
     · los errores de compilación marcan en rojo la línea del editor

   Se carga ANTES de app.js (route() la necesita al arrancar). Todo lo que depende de
   la página (COURSE, highlight, state…) se usa solo cuando se llama a show().
   ===================================================================== */

const CodeView = (() => {
  const root = () => document.getElementById("codeview");
  let built = false, ui = {}, running = false;

  const START = `// Escribe aquí tu programa. Ctrl + Intro para ejecutar.
Console.WriteLine("¡Hola, mundo!");
`;

  // Plantillas: de la más sencilla a la más «profesional»
  const TEMPLATES = {
    fragmento: { nombre: "Fragmento (instrucciones sueltas)", code: START },
    entrada: {
      nombre: "Leer datos con ReadLine",
      code: `// Escribe tu nombre en «Entrada del programa» (una línea por cada ReadLine)
Console.Write("¿Cómo te llamas? ");
string nombre = Console.ReadLine() ?? "";
Console.WriteLine($"¡Hola, {nombre}!");
`,
    },
    clasico: {
      nombre: "Programa completo (class Program + Main)",
      code: `// Forma clásica: la clase y el método Main escritos explícitamente
class Program
{
    static void Main()
    {
        Console.WriteLine("¡Hola desde Main!");
    }
}
`,
    },
    funcion: {
      nombre: "Funciones y bucle",
      code: `// Una función propia y un bucle for que la usa
int Cuadrado(int n) => n * n;

for (int i = 1; i <= 5; i++)
{
    Console.WriteLine($"{i} al cuadrado es {Cuadrado(i)}");
}
`,
    },
  };

  // Ejemplos del curso: recogemos todos los bloques de código de COURSE
  function courseExamples() {
    const groups = [];
    COURSE.modulos.forEach((m) => m.lecciones.forEach((l) => {
      const items = [];
      (l.ejemplos || []).forEach((e) => e.codigo && items.push({ label: e.titulo, code: e.codigo }));
      (l.actividades || []).forEach((a) => (a.soluciones || []).forEach((s) => s.codigo && items.push({ label: `Solución · ${a.titulo} (${s.titulo})`, code: s.codigo })));
      if (items.length) groups.push({ lesson: l.titulo, items });
    }));
    return groups;
  }

  /* ---------- Construcción de la interfaz (una sola vez) ---------- */

  function build() {
    const groups = courseExamples();
    let n = 0;
    const examples = [];
    const exOptions = groups.map((g) => `<optgroup label="${esc(g.lesson)}">${g.items.map((it) => { examples.push(it); return `<option value="${n++}">${esc(it.label)}</option>`; }).join("")}</optgroup>`).join("");
    ui.examples = examples;

    root().innerHTML = `
      <div class="cv-bar">
        <a class="btn cv-back" id="cvBack" href="#inicio">← Curso</a>
        <strong class="cv-title">Editor de C# <small>.NET 8</small></strong>
        <button class="btn primary" id="cvRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <select class="cv-select" id="cvExamples" aria-label="Cargar un ejemplo del curso"><option value="">📚 Ejemplos del curso…</option>${exOptions}</select>
        <select class="cv-select" id="cvTemplates" aria-label="Cargar una plantilla"><option value="">🧱 Plantillas…</option>${Object.entries(TEMPLATES).map(([k, t]) => `<option value="${k}">${esc(t.nombre)}</option>`).join("")}</select>
        <span class="cv-spacer"></span>
        <button class="btn cv-tool" id="cvSave" type="button" title="Descargar como Program.cs (Ctrl+S)">⬇ Guardar</button>
        <label class="btn cv-tool" title="Abrir un archivo .cs de tu ordenador">📂 Abrir<input id="cvOpen" type="file" accept=".cs,.txt,text/plain" hidden></label>
        <button class="btn cv-tool" id="cvCopy" type="button">Copiar</button>
        <span class="cv-group" role="group" aria-label="Tamaño de letra">
          <button class="btn cv-tool" id="cvSmaller" type="button" aria-label="Letra más pequeña">A−</button>
          <button class="btn cv-tool" id="cvBigger" type="button" aria-label="Letra más grande">A+</button>
        </span>
        <button class="btn cv-tool" id="cvLayout" type="button" title="Cambiar la disposición de editor y salida" aria-label="Cambiar disposición">⇆</button>
        <button class="btn cv-tool" id="cvReset" type="button" title="Borrar todo el código" aria-label="Borrar todo el código">🗑</button>
      </div>

      <div class="cv-main">
        <section class="cv-editor" aria-label="Editor de código">
          <div class="cv-code">
            <pre class="cv-gutter" id="cvGutter" aria-hidden="true"></pre>
            <div class="cv-stack">
              <pre class="cv-hl" id="cvHl" aria-hidden="true"></pre>
              <textarea id="cvCode" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Código C#"></textarea>
            </div>
          </div>
          <div class="cv-status"><span id="cvPos">Ln 1, Col 1</span><span id="cvCount"></span><span class="cv-hints">Tab sangra · Ctrl+/ comenta · Ctrl+Intro ejecuta</span></div>
        </section>

        <section class="cv-side" aria-label="Entrada y salida">
          <details class="cv-stdin" id="cvStdinBox">
            <summary>Entrada del programa <small>(para <code>Console.ReadLine</code>, una línea por lectura)</small></summary>
            <textarea id="cvStdin" rows="3" spellcheck="false" placeholder="Escribe aquí lo que leerá tu programa…"></textarea>
          </details>
          <div class="cv-out-head"><span>Salida</span><span id="cvMeta"></span><button class="link-btn" id="cvClear" type="button">Limpiar</button></div>
          <pre class="cv-out" id="cvOut" aria-live="polite">Pulsa «Ejecutar» (o Ctrl+Intro) para compilar y ejecutar tu código.</pre>
          <div class="cv-foot">El código se envía a un servicio externo (Judge0) para compilarse. No escribas datos personales. Para ejecutar hace falta Internet.</div>
        </section>
      </div>`;

    const $ = (id) => document.getElementById(id);
    ["Code", "Hl", "Gutter", "Stdin", "StdinBox", "Out", "Meta", "Run", "Pos", "Count", "Back"].forEach((k) => (ui[k] = $("cv" + k)));

    EditorKit.attach(ui.Code, { onRun: run });
    ui.Code.addEventListener("input", () => { errorLines = []; refresh(); persist(); });
    ui.Code.addEventListener("scroll", sync);
    ["keyup", "click", "select", "focus"].forEach((ev) => ui.Code.addEventListener(ev, status));
    ui.Code.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); }
    });
    ui.Stdin.addEventListener("input", persist);

    ui.Run.addEventListener("click", run);
    $("cvSave").addEventListener("click", save);
    $("cvCopy").addEventListener("click", async (e) => {
      const b = e.currentTarget;
      try { await navigator.clipboard.writeText(ui.Code.value); b.textContent = "¡Copiado!"; } catch { ui.Code.select(); b.textContent = "Selecciona y copia"; }
      setTimeout(() => (b.textContent = "Copiar"), 1500);
    });
    $("cvClear").addEventListener("click", () => show("", ""));
    $("cvReset").addEventListener("click", () => { if (confirmReplace("¿Borrar todo el código del editor?")) setCode(START, ""); });
    $("cvOpen").addEventListener("change", (e) => {
      const f = e.target.files[0];
      if (!f) return;
      const reader = new FileReader();
      reader.onload = () => { if (confirmReplace()) setCode(String(reader.result), ""); };
      reader.readAsText(f);
      e.target.value = "";
    });
    $("cvExamples").addEventListener("change", (e) => {
      const it = ui.examples[e.target.value];
      if (it && confirmReplace()) setCode(it.code.replace(/\s+$/, "") + "\n", "");
      e.target.value = "";
    });
    $("cvTemplates").addEventListener("change", (e) => {
      const t = TEMPLATES[e.target.value];
      if (t && confirmReplace()) setCode(t.code, "");
      e.target.value = "";
    });
    $("cvBigger").addEventListener("click", () => setFont(+1));
    $("cvSmaller").addEventListener("click", () => setFont(-1));
    $("cvLayout").addEventListener("click", () => {
      const cv = cvState();
      cv.layout = cv.layout === "stack" ? "side" : "stack";
      applyPrefs(); persist();
    });

    built = true;
  }

  /* ---------- Estado y preferencias (se guardan en el navegador) ---------- */

  const cvState = () => (state.codeview = state.codeview || {});
  function persist() {
    const cv = cvState();
    cv.code = ui.Code.value;
    cv.stdin = ui.Stdin.value;
    saveState();
  }
  function applyPrefs() {
    const cv = cvState();
    root().style.setProperty("--cv-fs", (cv.fs || 14) + "px");
    root().classList.toggle("stacked", cv.layout === "stack");
  }
  function setFont(delta) {
    const cv = cvState();
    cv.fs = Math.min(24, Math.max(11, (cv.fs || 14) + delta));
    applyPrefs(); persist();
  }

  // Preguntamos antes de reemplazar solo si el editor tiene código «de verdad»
  const confirmReplace = (msg) => {
    const current = ui.Code.value.trim();
    const untouched = !current || current === START.trim() || Object.values(TEMPLATES).some((t) => t.code.trim() === current);
    return untouched || confirm(msg || "Se reemplazará el código actual del editor. ¿Continuar?");
  };

  function setCode(code, stdin) {
    ui.Code.value = code;
    ui.Stdin.value = stdin || "";
    errorLines = [];
    refresh(); persist(); show("", "");
    ui.Code.focus();
    ui.Code.setSelectionRange(0, 0);
    ui.Code.scrollTop = 0;
  }

  /* ---------- Pintado: resaltado, números de línea y barra de estado ---------- */

  let errorLines = [];

  function refresh() {
    const code = ui.Code.value;
    ui.Hl.innerHTML = highlight(code) + "\n";
    const total = code.split("\n").length;
    // Un <span> por número; los de líneas con error se marcan en rojo
    let nums = "";
    for (let i = 1; i <= total; i++) nums += `<span${errorLines.includes(i) ? ' class="bad"' : ""}>${i}</span>\n`;
    ui.Gutter.innerHTML = nums;
    ui.Count.textContent = `${total} ${total === 1 ? "línea" : "líneas"}`;
    sync();
    status();
  }
  function sync() {
    ui.Hl.scrollTop = ui.Gutter.scrollTop = ui.Code.scrollTop;
    ui.Hl.scrollLeft = ui.Code.scrollLeft;
  }
  function status() {
    const before = ui.Code.value.slice(0, ui.Code.selectionStart).split("\n");
    ui.Pos.textContent = `Ln ${before.length}, Col ${before[before.length - 1].length + 1}`;
  }

  /* ---------- Salida y ejecución ---------- */

  function show(text, kind, title) {
    ui.Out.className = "cv-out " + (kind || "");
    ui.Out.textContent = text ? (title ? "❌ " + title + "\n\n" : "") + text : "";
    if (!text) ui.Meta.textContent = "";
  }

  async function run() {
    if (running) return;
    const source = ui.Code.value;
    if (!source.trim()) { show("Escribe algo de código primero.", "warn"); return; }

    if (EditorKit.needsInput(source) && !ui.Stdin.value.trim()) {
      ui.StdinBox.open = true;
      show("Tu programa lee datos (Console.ReadLine). Escribe en «Entrada del programa» una línea por cada lectura y vuelve a ejecutar.", "warn");
      ui.Stdin.focus();
      return;
    }

    running = true;
    ui.Run.disabled = true;
    ui.Run.textContent = "⏳ Compilando…";
    show("Compilando y ejecutando…", "wait");
    ui.Meta.textContent = "";
    errorLines = [];
    refresh();

    const r = await EditorKit.execute(source, ui.Stdin.value);
    errorLines = r.errorLines;
    refresh();
    show(r.text, r.kind, r.title);
    ui.Meta.textContent = r.meta || "";

    running = false;
    ui.Run.disabled = false;
    ui.Run.textContent = "▶ Ejecutar";
  }

  function save() {
    const blob = new Blob([ui.Code.value], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Program.cs";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  /* ---------- Mostrar / ocultar la vista ---------- */

  function showView() {
    if (!built) build();
    const cv = cvState();
    if (!ui.Code.value) { ui.Code.value = cv.code || START; ui.Stdin.value = cv.stdin || ""; }
    applyPrefs();
    // «Volver al curso» lleva a la última lección abierta (o a la portada)
    ui.Back.href = state.last ? "#leccion-" + state.last : "#inicio";
    root().hidden = false;
    document.body.classList.add("view-code");
    document.body.classList.remove("menu-open");
    document.title = "Editor de C# · " + COURSE.titulo;
    refresh();
    window.scrollTo({ top: 0 });
  }

  function hide() {
    const el = root();
    if (el) el.hidden = true;
    document.body.classList.remove("view-code");
  }

  // Abre la vista con un código concreto (lo usa el botón «Abrir en Codificar» del panel)
  function open(code, stdin) {
    if (!built) build();
    const cv = cvState();
    cv.code = code; cv.stdin = stdin || "";
    ui.Code.value = code; ui.Stdin.value = stdin || "";
    errorLines = [];
    if (location.hash === "#codificar") showView(); else location.hash = "#codificar";
  }

  return { show: showView, hide, open };
})();
