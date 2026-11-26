/* =====================================================================
   js/editor-pane.js · EDITOR + ENTRADA/SALIDA REUTILIZABLE
   ---------------------------------------------------------------------
   Las vistas «Codificar» (editor junto al vídeo) y «Entrenamiento» (editor junto
   al enunciado) necesitan el mismo editor. En vez de copiarlo, lo construimos
   aquí UNA vez como una pieza que cada vista coloca donde quiere:

       const pane = EditorPane.create({ onChange });
       contenedor.append(pane.editorEl, pane.ioEl);   // la vista decide la disposición

   Un «pane» tiene dos mitades:
     · editorEl → números de línea + código coloreado + barra de estado
     · ioEl     → entrada del programa (ReadLine) + salida de la ejecución

   Se carga antes que app.js; usa highlight() y esc() solo cuando se ejecutan.
   ===================================================================== */

const EditorPane = (() => {

  function create({ onChange, onRunState } = {}) {
    const editorEl = document.createElement("section");
    editorEl.className = "ep-editor";
    editorEl.setAttribute("aria-label", "Editor de código");
    editorEl.innerHTML = `
      <div class="ep-note" hidden></div>
      <div class="ep-code">
        <pre class="ep-gutter" aria-hidden="true"></pre>
        <div class="ep-stack">
          <pre class="ep-hl" aria-hidden="true"></pre>
          <textarea class="ep-ta" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Código C#"></textarea>
        </div>
      </div>
      <div class="ep-status"><span class="ep-pos">Ln 1, Col 1</span><span class="ep-count"></span><span class="ep-hints">Tab sangra · Ctrl+/ comenta · Ctrl+Intro ejecuta</span></div>`;

    const ioEl = document.createElement("section");
    ioEl.className = "ep-io";
    ioEl.setAttribute("aria-label", "Entrada y salida");
    ioEl.innerHTML = `
      <details class="ep-stdin">
        <summary>Entrada del programa <small>(para <code>Console.ReadLine</code>, una línea por lectura)</small></summary>
        <textarea class="ep-stdin-ta" rows="3" spellcheck="false" placeholder="Escribe aquí lo que leerá tu programa…"></textarea>
      </details>
      <div class="ep-out-head"><span>Salida</span><span class="ep-meta"></span><button class="link-btn ep-clear" type="button">Limpiar</button></div>
      <pre class="ep-out" aria-live="polite">Pulsa «Ejecutar» (o Ctrl+Intro) para compilar y ejecutar tu código.</pre>
      <div class="ep-foot">El código se envía a un servicio externo (Judge0) para compilarse. No escribas datos personales. Para ejecutar hace falta Internet.</div>`;

    const q = (root, sel) => root.querySelector(sel);
    const ta = q(editorEl, ".ep-ta"), hl = q(editorEl, ".ep-hl"), gutter = q(editorEl, ".ep-gutter");
    const stdin = q(ioEl, ".ep-stdin-ta"), stdinBox = q(ioEl, ".ep-stdin");
    const out = q(ioEl, ".ep-out"), meta = q(ioEl, ".ep-meta");
    let errorLines = [], running = false;

    /* ---------- Pintado: resaltado, números de línea y barra de estado ---------- */

    function refresh() {
      const code = ta.value;
      hl.innerHTML = highlight(code) + "\n";            // "\n" final: no «comerse» la última línea vacía
      const total = code.split("\n").length;
      let nums = "";
      for (let i = 1; i <= total; i++) nums += `<span${errorLines.includes(i) ? ' class="bad"' : ""}>${i}</span>\n`;
      gutter.innerHTML = nums;
      q(editorEl, ".ep-count").textContent = `${total} ${total === 1 ? "línea" : "líneas"}`;
      sync();
      status();
    }
    function sync() {
      hl.scrollTop = gutter.scrollTop = ta.scrollTop;
      hl.scrollLeft = ta.scrollLeft;
    }
    function status() {
      const before = ta.value.slice(0, ta.selectionStart).split("\n");
      q(editorEl, ".ep-pos").textContent = `Ln ${before.length}, Col ${before[before.length - 1].length + 1}`;
    }

    ta.addEventListener("input", () => { errorLines = []; refresh(); if (onChange) onChange(); });
    stdin.addEventListener("input", () => { if (onChange) onChange(); });
    ta.addEventListener("scroll", sync);
    ["keyup", "click", "select", "focus"].forEach((ev) => ta.addEventListener(ev, status));
    EditorKit.attach(ta, { onRun: () => run() });
    ta.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") { e.preventDefault(); save(); }   // Ctrl+S → descargar
    });

    /* ---------- Salida y ejecución ---------- */

    function show(text, kind, title) {
      out.className = "ep-out " + (kind || "");
      out.textContent = text ? (title ? "❌ " + title + "\n\n" : "") + text : "";
      if (!text) meta.textContent = "";
    }
    q(ioEl, ".ep-clear").addEventListener("click", () => show("", ""));

    async function run() {
      if (running) return;
      const source = ta.value;
      if (!source.trim()) { show("Escribe algo de código primero.", "warn"); return; }

      // El programa NO es interactivo: la entrada se entrega de antemano
      if (EditorKit.needsInput(source) && !stdin.value.trim()) {
        stdinBox.open = true;
        show("Tu programa lee datos (Console.ReadLine). Escribe en «Entrada del programa» una línea por cada lectura y vuelve a ejecutar.", "warn");
        stdin.focus();
        return;
      }

      running = true;
      if (onRunState) onRunState(true);
      // Cronómetro visible: ver avanzar el tiempo hace la espera más llevadera
      const t0 = performance.now();
      const tick = () => show(`Compilando y ejecutando… ${((performance.now() - t0) / 1000).toFixed(1)} s`, "wait");
      tick();
      const timer = setInterval(tick, 100);
      meta.textContent = "";
      errorLines = [];
      refresh();

      const r = await EditorKit.execute(source, stdin.value);
      clearInterval(timer);
      const total = ((performance.now() - t0) / 1000).toFixed(1);
      errorLines = r.errorLines;          // las líneas con error se marcan en rojo en el margen
      refresh();
      show(r.text, r.kind, r.title);
      meta.textContent = (r.meta ? r.meta + " · " : "") + `total ${total} s`;

      running = false;
      if (onRunState) onRunState(false);
    }

    /* ---------- Utilidades de las barras de herramientas ---------- */

    function save() {
      const blob = new Blob([ta.value], { type: "text/plain;charset=utf-8" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "Program.cs";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }
    async function copy(btn) {
      try { await navigator.clipboard.writeText(ta.value); btn.textContent = "¡Copiado!"; }
      catch { ta.select(); btn.textContent = "Selecciona y copia"; }
      setTimeout(() => (btn.textContent = "Copiar"), 1500);
    }
    // Aviso breve con «Deshacer». Sustituye a los cuadros de diálogo (confirm): en vez de
    // preguntar ANTES de reemplazar el código, lo reemplazamos y dejamos recuperarlo.
    const note = q(editorEl, ".ep-note");
    let noteTimer = null;
    function hideNote() { note.hidden = true; clearTimeout(noteTimer); }
    function showNote(text, undo) {
      note.innerHTML = "";
      const span = document.createElement("span");
      span.textContent = text;
      note.append(span);
      if (undo) {
        const b = document.createElement("button");
        b.type = "button"; b.className = "ep-note-btn"; b.textContent = "↶ Deshacer";
        b.addEventListener("click", () => { undo(); hideNote(); });
        note.append(b);
      }
      const x = document.createElement("button");
      x.type = "button"; x.className = "ep-note-x"; x.setAttribute("aria-label", "Cerrar aviso"); x.textContent = "✕";
      x.addEventListener("click", hideNote);
      note.append(x);
      note.hidden = false;
      clearTimeout(noteTimer);
      noteTimer = setTimeout(hideNote, 12000);
    }

    // Carga código nuevo (un ejemplo, una plantilla, un archivo…) conservando el anterior para «Deshacer»
    function load(code, input, message) {
      const prev = { code: ta.value, stdin: stdin.value };
      const replaced = prev.code.trim() && prev.code !== code;
      api.set(code, input);
      if (onChange) onChange();
      if (replaced) showNote(message, () => { api.set(prev.code, prev.stdin); if (onChange) onChange(); });
      else hideNote();
    }

    function readFile(file, cb) {
      const reader = new FileReader();
      reader.onload = () => cb(String(reader.result));
      reader.readAsText(file);
    }

    const api = {
      editorEl, ioEl,
      get code() { return ta.value; },
      get stdin() { return stdin.value; },
      get running() { return running; },
      set(code, input) {
        ta.value = code;
        stdin.value = input || "";
        errorLines = [];
        show("", "");
        refresh();
        ta.scrollTop = 0;
        ta.setSelectionRange(0, 0);
      },
      focus: () => ta.focus(),
      refresh, run, save, copy, readFile, show, load, note: showNote,
      // Tamaño de letra propio de cada vista: se controla con la variable CSS --ep-fs
    };
    return api;
  }

  return { create };
})();
