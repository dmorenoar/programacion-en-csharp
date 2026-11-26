/* =====================================================================
   js/playground.js · PANEL "PRACTICAR" (editor + compilador de C#)
   ---------------------------------------------------------------------
   Piezas (de menos a más compleja, pensadas para entenderlas una a una):

   1. EDITOR      <textarea> transparente colocado ENCIMA de un <pre> que muestra
                  el mismo texto coloreado (reutilizamos highlight() de app.js).
                  Es la técnica "overlay": sin librerías y muy ligera.
   2. COMPILADOR  Un navegador NO sabe compilar C#, así que enviamos el código a
                  un servidor (Judge0) y mostramos lo que devuelve.
   3. PANEL       abrir/cerrar, ancho ajustable, y guardado del código.

   Se carga DESPUÉS de app.js: usa sus globales (COURSE, highlight, state...).
   ===================================================================== */

const Playground = (() => {
  const $id = (id) => document.getElementById(id);
  const panel = $id("playground"), code = $id("pgCode"), hl = $id("pgHl");
  const out = $id("pgOut"), meta = $id("pgMeta"), stdin = $id("pgStdin");
  const runBtn = $id("pgRun"), openBtn = $id("practiceBtn");
  const cfg = COURSE.compilador || {};

  const START = `// Escribe aquí tu código y pulsa «Ejecutar»
Console.WriteLine("¡Hola, mundo!");
`;

  /* ---------- 1. EDITOR ---------- */

  // Repinta el <pre> coloreado con el texto actual del <textarea>.
  // El "\n" final evita que la última línea vacía se "coma" en el <pre>.
  function paint() {
    hl.innerHTML = highlight(code.value) + "\n";
    hl.scrollTop = code.scrollTop;
    hl.scrollLeft = code.scrollLeft;
  }

  code.addEventListener("input", () => { paint(); persist(); });
  // Mantener sincronizado el scroll de ambas capas
  code.addEventListener("scroll", () => { hl.scrollTop = code.scrollTop; hl.scrollLeft = code.scrollLeft; });

  code.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + Intro → ejecutar
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); run(); return; }

    const { selectionStart: s, selectionEnd: end, value: v } = code;

    // Tab → 4 espacios (si no, Tab saldría del campo y no se podría sangrar)
    if (e.key === "Tab") {
      e.preventDefault();
      insert("    ");
      return;
    }
    // Intro → mantiene la sangría de la línea anterior y la aumenta tras una "{"
    if (e.key === "Enter") {
      e.preventDefault();
      const lineStart = v.lastIndexOf("\n", s - 1) + 1;
      const indent = (v.slice(lineStart, s).match(/^\s*/) || [""])[0];
      const extra = v[s - 1] === "{" ? "    " : "";
      insert("\n" + indent + extra);
      return;
    }
    // Al escribir "}" al inicio de una línea sangrada, se quita un nivel de sangría
    if (e.key === "}" && s === end && /^ +$/.test(v.slice(v.lastIndexOf("\n", s - 1) + 1, s))) {
      e.preventDefault();
      code.setRangeText("}", Math.max(s - 4, v.lastIndexOf("\n", s - 1) + 1), end, "end");
      code.dispatchEvent(new Event("input"));
    }
  });

  // Inserta texto en el cursor conservando el historial de deshacer cuando se puede
  function insert(text) {
    code.focus();
    if (!document.execCommand || !document.execCommand("insertText", false, text)) {
      code.setRangeText(text, code.selectionStart, code.selectionEnd, "end");
      code.dispatchEvent(new Event("input"));
    }
  }

  /* ---------- 2. COMPILADOR (Judge0) ---------- */

  // btoa/atob solo entienden Latin-1; para tildes, ñ y € pasamos por UTF-8.
  const toB64 = (text) => {
    const bytes = new TextEncoder().encode(text);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  };
  const fromB64 = (b64) => {
    if (!b64) return "";
    const bin = atob(b64);
    return new TextDecoder().decode(Uint8Array.from(bin, (ch) => ch.charCodeAt(0)));
  };

  // .NET 8 entiende "instrucciones de nivel superior", pero NO añade los using
  // por defecto en este entorno: los ponemos nosotros si el alumno no los escribió.
  function prepare(source) {
    const usings = ["System", "System.Collections.Generic", "System.Linq", "System.Text"]
      .filter((ns) => !new RegExp(`using\\s+${ns.replace(/\./g, "\\.")}\\s*;`).test(source))
      .map((ns) => `using ${ns};`)
      .join(" ");
    return usings ? usings + " " + source : source;
  }

  let running = false;

  async function run() {
    if (running) return;
    const source = code.value;
    if (!source.trim()) { show("Escribe algo de código primero.", "warn"); return; }

    // Aviso útil: el programa NO es interactivo (la entrada se da de antemano)
    const needsInput = /Console\.(ReadLine|Read|ReadKey)\s*\(/.test(source);
    if (needsInput && !stdin.value.trim()) {
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

    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), cfg.timeoutMs || 30000);
    try {
      const res = await fetch(`${cfg.url}/submissions?base64_encoded=true&wait=true`, {
        method: "POST",
        headers: Object.assign({ "Content-Type": "application/json" }, cfg.headers || {}),
        body: JSON.stringify({
          language_id: cfg.languageId,
          source_code: toB64(prepare(source)),
          stdin: toB64(stdin.value.replace(/\r?\n?$/, "\n")),   // cada ReadLine consume una línea
        }),
        signal: ctl.signal,
      });
      if (res.status === 429) throw new Error("LIMIT");
      if (!res.ok) throw new Error("HTTP " + res.status);
      showResult(await res.json());
    } catch (err) {
      if (err.name === "AbortError") show("El servidor tardó demasiado. Inténtalo de nuevo en un momento.", "err");
      else if (err.message === "LIMIT") show("Demasiadas ejecuciones seguidas en el servicio gratuito. Espera un minuto y vuelve a probar.", "err");
      else if (!navigator.onLine) show("Sin conexión: para ejecutar código necesitas Internet (el resto del curso sí funciona offline).", "err");
      else show("No se pudo contactar con el compilador (" + err.message + "). Comprueba tu conexión o inténtalo más tarde.", "err");
    } finally {
      clearTimeout(timer);
      running = false;
      runBtn.disabled = false;
      runBtn.textContent = "▶ Ejecutar";
    }
  }

  // Judge0 devuelve: status.id (3 = OK, 6 = error de compilación, 5 = tiempo, 11/12 = error en ejecución…)
  function showResult(r) {
    const stdout = fromB64(r.stdout), stderr = fromB64(r.stderr);
    const compile = fromB64(r.compile_output), message = fromB64(r.message);
    const id = r.status && r.status.id;
    if (r.time) meta.textContent = `${r.time} s · ${Math.round((r.memory || 0) / 1024)} MB`;

    if (id === 6) { show(tidy(compile) || "Error de compilación.", "err", "Error de compilación"); return; }
    if (id === 5) { show((stdout ? stdout + "\n" : "") + "⏱ Tiempo límite superado (¿bucle infinito?).", "err"); return; }

    let text = stdout;
    if (stderr || (id && id > 4 && id !== 5)) text += (text && !text.endsWith("\n") ? "\n" : "") + tidy(stderr || message || (r.status && r.status.description) || "");
    show(text || "(El programa terminó sin mostrar nada)", id === 3 ? "ok" : "err");
  }

  // Quita las rutas internas del servidor (/box/…/Program.cs) para que el error sea legible
  const tidy = (t) => t.replace(/\/[\w./-]*\/(\w+\.cs)/g, "$1").replace(/\[\/[^\]]*\]/g, "").trim();

  function show(text, kind, title) {
    out.className = "pg-out " + (kind || "");
    out.textContent = (title ? "❌ " + title + "\n\n" : "") + text;
  }

  /* ---------- 3. PANEL ---------- */

  function persist() {
    state.playground = { code: code.value, stdin: stdin.value };
    saveState();
  }

  function setOpen(open) {
    panel.hidden = !open;
    document.body.classList.toggle("play-open", open);
    openBtn.setAttribute("aria-expanded", String(open));
    state.playOpen = open;
    saveState();
    if (open) { paint(); }
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

  openBtn.addEventListener("click", () => setOpen(panel.hidden));
  $id("pgClose").addEventListener("click", () => setOpen(false));
  runBtn.addEventListener("click", run);
  stdin.addEventListener("input", persist);
  $id("pgReset").addEventListener("click", () => {
    if (!confirm("¿Borrar el código del editor?")) return;
    code.value = START; stdin.value = ""; paint(); persist(); show("Editor reiniciado.", "");
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

  // Estado inicial: recupera el código de la última sesión
  const saved = state.playground || {};
  code.value = saved.code || START;
  stdin.value = saved.stdin || "";
  paint();
  if (state.playOpen) setOpen(true);

  return { load, run, open: () => setOpen(true), close: () => setOpen(false) };
})();
