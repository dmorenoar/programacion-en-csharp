/* =====================================================================
   js/playground.js · PANEL «CODIFICAR» (entorno de programación junto a la lección)
   ---------------------------------------------------------------------
   Es el lateral derecho de las lecciones: mientras ves el vídeo y lees la teoría,
   tienes al lado un entorno al estilo dotnetfiddle para programar y probar.

     · un «cuaderno» de código propio para CADA lección (se guarda en el navegador)
     · ejemplos y soluciones de la lección, plantillas, guardar/abrir .cs, tamaño de letra
     · el botón «▶ Probar» de los bloques de código carga ese ejemplo aquí
     · se puede cambiar de lado (izquierda/derecha) y ajustar su ancho arrastrando el borde

   El editor y la salida son la pieza reutilizable de js/editor-pane.js.
   Se carga DESPUÉS de app.js: usa sus globales (state, lessonById, currentId…).
   ===================================================================== */

const Playground = (() => {
  const panel = document.getElementById("playground");
  const grip = document.getElementById("pgResize");
  let pane = null, lessonId = null, ui = {};

  // Plantillas: de la más sencilla a la más «profesional»
  const TEMPLATES = [
    { text: "Fragmento: instrucciones sueltas", code: `// Escribe aquí tu programa. Ctrl + Intro para ejecutar.\nConsole.WriteLine("¡Hola, mundo!");\n` },
    { text: "Leer datos con ReadLine", code: `// Escribe tu nombre en «Entrada del programa» (una línea por cada ReadLine)\nConsole.Write("¿Cómo te llamas? ");\nstring nombre = Console.ReadLine() ?? "";\nConsole.WriteLine($"¡Hola, {nombre}!");\n` },
    { text: "Funciones y bucle", code: `// Una función propia y un bucle for que la usa\nint Cuadrado(int n) => n * n;\n\nfor (int i = 1; i <= 5; i++)\n{\n    Console.WriteLine($"{i} al cuadrado es {Cuadrado(i)}");\n}\n` },
    { text: "Programa completo (class Program + Main)", code: `// Forma clásica: la clase y el método Main escritos explícitamente\nclass Program\n{\n    static void Main()\n    {\n        Console.WriteLine("¡Hola desde Main!");\n    }\n}\n` },
  ];

  const startCode = (l) => `// ${l.titulo}\n// Escribe aquí lo que vayas viendo en el vídeo. Ctrl + Intro para ejecutar.\n`;

  /* ---------- Estado (se guarda en el navegador) ---------- */

  const cv = () => (state.codeview = state.codeview || {});
  const notebooks = () => (cv().byLesson = cv().byLesson || {});

  function persist() {
    if (!pane || !lessonId) return;
    notebooks()[lessonId] = { code: pane.code, stdin: pane.stdin };
    saveState();
  }

  /* ---------- Construcción del panel ---------- */

  function build() {
    panel.insertAdjacentHTML("beforeend", `
      <div class="pg-head">
        <strong>&lt;/&gt; Codificar</strong>
        <span class="pg-lesson" id="pgLesson"></span>
        <span class="pg-spacer"></span>
        <button class="btn ed-tool pg-side" id="pgSide" type="button" title="Poner el editor al otro lado" aria-label="Poner el editor al otro lado">⇄</button>
        <button class="icon-btn pg-x" id="pgClose" type="button" aria-label="Cerrar el editor">✕</button>
      </div>
      <div class="pg-tools">
        <button class="btn primary" id="pgRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <button class="btn ed-tool" id="pgExamples" type="button">📚 Ejemplos ▾</button>
        <button class="btn ed-tool" id="pgTemplates" type="button">🧱 Plantillas ▾</button>
        <button class="btn ed-tool" id="pgMore" type="button" aria-label="Más opciones" title="Más opciones">⋯</button>
        <input id="pgOpen" type="file" accept=".cs,.txt,text/plain" hidden>
      </div>
      <div class="pg-body" id="pgBody"></div>`);

    const $ = (id) => document.getElementById(id);
    ["Lesson", "Run", "Examples", "Templates", "More", "Open", "Body", "Close", "Side"].forEach((k) => (ui[k] = $("pg" + k)));

    pane = EditorPane.create({
      onChange: persist,
      onRunState: (r) => { ui.Run.disabled = r; ui.Run.textContent = r ? "⏳ Compilando…" : "▶ Ejecutar"; },
    });
    ui.Body.append(pane.editorEl, pane.ioEl);

    ui.Run.addEventListener("click", () => pane.run());
    ui.Close.addEventListener("click", close);
    ui.Side.addEventListener("click", () => { state.playSide = state.playSide === "left" ? "right" : "left"; applyPrefs(); saveState(); });

    // Menús propios (sin <select> ni confirm: ver EditorKit.menu)
    EditorKit.menu(ui.Examples, () => {
      const l = lessonById.get(lessonId);
      if (!l) return [];
      const load = (title, code) => () => { pane.load(code.replace(/\s+$/, "") + "\n", "", `Cargado «${title}».`); pane.focus(); };
      return [
        { group: "Ejemplos de la lección", items: l.ejemplos.map((e) => ({ text: e.titulo, onSelect: load(e.titulo, e.codigo) })) },
        { group: "Soluciones de las actividades", items: l.actividades.flatMap((a) => a.soluciones.map((s) => ({ text: `${a.titulo} (${s.titulo})`, onSelect: load(a.titulo, s.codigo) }))) },
      ];
    });
    EditorKit.menu(ui.Templates, () => TEMPLATES.map((t) => ({ text: t.text, onSelect: () => { pane.load(t.code, "", `Plantilla «${t.text}» cargada.`); pane.focus(); } })));
    EditorKit.menu(ui.More, () => [
      { text: "⬇ Guardar como Program.cs", onSelect: () => pane.save() },
      { text: "📂 Abrir un archivo .cs…", onSelect: () => ui.Open.click() },
      { text: "⎘ Copiar el código", onSelect: () => pane.copy(ui.More) },
      { text: "A+  Letra más grande", keep: true, onSelect: () => setFont(+1) },
      { text: "A−  Letra más pequeña", keep: true, onSelect: () => setFont(-1) },
      { text: "🗑 Borrar el código de esta lección", onSelect: () => pane.load(startCode(lessonById.get(lessonId)), "", "Código borrado.") },
    ]);
    ui.Open.addEventListener("change", (e) => {
      const f = e.target.files[0];
      e.target.value = "";
      if (f) pane.readFile(f, (text) => pane.load(text, "", `Archivo «${f.name}» abierto.`));
    });

    // Ancho ajustable arrastrando el borde (se guarda en el navegador)
    grip.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      grip.setPointerCapture(e.pointerId);
      const move = (ev) => {
        const r = panel.getBoundingClientRect();
        setWidth(state.playSide === "left" ? ev.clientX - r.left : r.right - ev.clientX);
      };
      const up = () => {
        grip.removeEventListener("pointermove", move);
        grip.removeEventListener("pointerup", up);
        state.playW = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--play-w"), 10) || 560;
        saveState();
      };
      grip.addEventListener("pointermove", move);
      grip.addEventListener("pointerup", up);
    });
  }

  const setWidth = (px) => document.documentElement.style.setProperty("--play-w", Math.min(Math.max(px, 340), 900) + "px");
  function setFont(delta) {
    state.editorFs = Math.min(24, Math.max(11, (state.editorFs || 14) + delta));
    applyPrefs(); saveState();
  }
  function applyPrefs() {
    panel.style.setProperty("--ep-fs", (state.editorFs || 14) + "px");
    document.body.classList.toggle("play-left", state.playSide === "left");
    if (state.playW) setWidth(state.playW);
  }

  /* ---------- Abrir, cerrar y cambiar de lección ---------- */

  function setOpen(open) {
    state.playOpen = open;
    panel.hidden = !open;
    document.body.classList.toggle("play-open", open);
    if (open) { applyPrefs(); pane.refresh(); }
    saveState();
  }

  // Cada lección tiene su cuaderno: al cambiar de lección guardamos el anterior y cargamos el nuevo
  function setLesson(id) {
    if (!lessonById.has(id) || id === lessonId) return;
    persist();
    lessonId = id;
    const l = lessonById.get(id);
    ui.Lesson.textContent = l.titulo;
    const nb = notebooks()[id];
    pane.set(nb ? nb.code : startCode(l), nb ? nb.stdin : "");
    ui.Examples.hidden = false;
  }

  // La llama app.js cada vez que se muestra una lección: la visibilidad sigue al estado guardado
  function sync(id) {
    setLesson(id);
    setOpen(!!state.playOpen);
  }

  // «▶ Probar» (bloques de código de la teoría y de las soluciones)
  function load(source) {
    if (lessonId === null && currentId) setLesson(currentId);
    setOpen(true);
    pane.load(source.replace(/\s+$/, "") + "\n", "", "Se cargó el ejemplo en el editor.");
    pane.focus();
    pane.show("Código cargado. Pulsa «Ejecutar» para probarlo y modifícalo para experimentar.", "");
  }

  build();
  applyPrefs();
  panel.hidden = true;
  if (currentId) sync(currentId);        // si la página arrancó en una lección

  return { load, sync, open: () => setOpen(true), close: () => setOpen(false), toggle: () => setOpen(panel.hidden) };
})();
