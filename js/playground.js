/* =====================================================================
   js/playground.js · PANEL LATERAL «PROBAR» (editor pequeño junto a la lección)
   ---------------------------------------------------------------------
   Se abre con el botón «▶ Probar» de cada bloque de código. Sirve para ejecutar
   un ejemplo mientras lees la teoría. Para escribir programas desde cero está la
   vista «Codificar» (js/codeview.js), con el editor a pantalla completa.

   Las piezas comunes (comportamiento del editor y envío al compilador) están en
   js/editor-kit.js. Se carga DESPUÉS de app.js: usa sus globales (highlight, state...).
   ===================================================================== */

const Playground = (() => {
  const $id = (id) => document.getElementById(id);
  const panel = $id("playground"), code = $id("pgCode"), hl = $id("pgHl");
  const out = $id("pgOut"), meta = $id("pgMeta"), stdin = $id("pgStdin");
  const runBtn = $id("pgRun");

  const START = `// Escribe aquí tu código y pulsa «Ejecutar»
Console.WriteLine("¡Hola, mundo!");
`;

  /* ---------- Editor: <textarea> transparente sobre un <pre> coloreado ---------- */

  function paint() {
    hl.innerHTML = highlight(code.value) + "\n";     // "\n" final: que no se «coma» la última línea vacía
    hl.scrollTop = code.scrollTop;
    hl.scrollLeft = code.scrollLeft;
  }
  code.addEventListener("input", () => { paint(); persist(); });
  code.addEventListener("scroll", () => { hl.scrollTop = code.scrollTop; hl.scrollLeft = code.scrollLeft; });
  EditorKit.attach(code, { onRun: () => run() });

  /* ---------- Ejecutar ---------- */

  let running = false;

  function show(text, kind, title) {
    out.className = "pg-out " + (kind || "");
    out.textContent = (title ? "❌ " + title + "\n\n" : "") + text;
  }

  async function run() {
    if (running) return;
    const source = code.value;
    if (!source.trim()) { show("Escribe algo de código primero.", "warn"); return; }

    // El programa NO es interactivo: la entrada se da de antemano
    if (EditorKit.needsInput(source) && !stdin.value.trim()) {
      $id("pgStdinBox").open = true;
      show("Tu programa lee datos (Console.ReadLine). Escribe arriba, en «Entrada del programa», una línea por cada lectura y vuelve a ejecutar.", "warn");
      stdin.focus();
      return;
    }

    running = true;
    runBtn.disabled = true;
    runBtn.textContent = "⏳ Compilando…";
    show("Compilando y ejecutando…", "wait");
    meta.textContent = "";

    const r = await EditorKit.execute(source, stdin.value);
    show(r.text, r.kind, r.title);
    meta.textContent = r.meta || "";

    running = false;
    runBtn.disabled = false;
    runBtn.textContent = "▶ Ejecutar";
  }

  /* ---------- Panel ---------- */

  function persist() {
    state.playground = { code: code.value, stdin: stdin.value };
    saveState();
  }

  function setOpen(open) {
    panel.hidden = !open;
    document.body.classList.toggle("play-open", open);
    if (open) paint();
  }

  // API pública: la usan los botones «▶ Probar» de los bloques de código
  function load(source) {
    code.value = source.replace(/\s+$/, "") + "\n";
    stdin.value = "";
    paint();
    persist();
    setOpen(true);
    show("Código cargado. Pulsa «Ejecutar» para probarlo y modifícalo para experimentar.", "");
    meta.textContent = "";
    code.focus();
    code.setSelectionRange(0, 0);
    code.scrollTop = 0;
  }

  $id("pgClose").addEventListener("click", () => setOpen(false));
  runBtn.addEventListener("click", run);
  stdin.addEventListener("input", persist);
  $id("pgReset").addEventListener("click", () => {
    if (!confirm("¿Borrar el código del editor?")) return;
    code.value = START; stdin.value = ""; paint(); persist(); show("Editor reiniciado.", "");
  });
  // «Abrir en Codificar»: lleva este código al editor grande
  $id("pgExpand").addEventListener("click", () => {
    setOpen(false);
    CodeView.open(code.value, stdin.value);
  });

  // Ancho ajustable arrastrando el borde izquierdo (se guarda en el navegador)
  const grip = $id("pgResize");
  const setWidth = (px) => document.documentElement.style.setProperty("--play-w", Math.min(Math.max(px, 320), 900) + "px");
  if (state.playW) setWidth(state.playW);
  grip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    const move = (ev) => setWidth(window.innerWidth - ev.clientX);
    const up = () => {
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", up);
      state.playW = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--play-w"), 10) || 480;
      saveState();
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
  });

  // Estado inicial: recupera el código de la última sesión (el panel arranca cerrado)
  const saved = state.playground || {};
  code.value = saved.code || START;
  stdin.value = saved.stdin || "";
  paint();

  return { load, run, close: () => setOpen(false) };
})();
