/* =====================================================================
   js/training.js · VISTA «ENTRENAMIENTO» (resolver las actividades del curso)
   ---------------------------------------------------------------------
   Tres zonas, de izquierda a derecha:
     1. LISTA de actividades agrupadas por módulo y lección (con ✓ las resueltas)
     2. ENUNCIADO de la actividad elegida (pista y solución plegadas a propósito)
     3. EDITOR + salida para intentar resolverla

     · cada actividad guarda SU código en el navegador
     · enlace: #entrenamiento  o  #entrenamiento-<id-de-la-lección>.<nº de actividad>

   Se carga ANTES de app.js (route() la necesita al arrancar).
   ===================================================================== */

const Training = (() => {
  const root = () => document.getElementById("training");
  let built = false, ui = {}, pane = null, currentKey = null, list = [], byKey = new Map();

  /* ---------- Datos: lista plana de todas las actividades del curso ---------- */

  function collect() {
    list = [];
    byKey = new Map();
    lessons.forEach((l) => l.actividades.forEach((act, i) => {
      const item = { key: `${l.id}.${i}`, lesson: l, act, index: i };
      list.push(item);
      byKey.set(item.key, item);
    }));
  }

  const trState = () => (state.training = state.training || { code: {}, solved: {} });
  const sub = (name) => (trState()[name] = trState()[name] || {});
  const stars = (it) => (LEVELS[it.act.nivel] || LEVELS[1]).label.split(" ")[0];     // ★☆☆

  function persist() {
    if (!pane || !currentKey) return;
    sub("code")[currentKey] = { code: pane.code, stdin: pane.stdin };
    saveState();
  }
  function applyPrefs() {
    const t = trState();
    root().style.setProperty("--ep-fs", (state.editorFs || 14) + "px");
    root().classList.toggle("stacked", t.layout === "stack");
    root().classList.toggle("no-problem", !!t.hideProblem);
    // La lista empieza abierta en pantallas anchas y cerrada en las estrechas (luego se recuerda la elección)
    root().classList.toggle("show-browser", t.browser === undefined ? window.innerWidth >= 1300 : !!t.browser);
  }
  function setFont(delta) {
    state.editorFs = Math.min(24, Math.max(11, (state.editorFs || 14) + delta));
    applyPrefs(); saveState();
  }

  const startCode = (it) => `// Actividad ${it.index + 1}: ${it.act.titulo}\n// Escribe aquí tu solución. Ctrl + Intro para ejecutar.\n`;

  /* ---------- Construcción de la interfaz (una sola vez) ---------- */

  function build() {
    collect();
    root().innerHTML = `
      <div class="ed-bar">
        <a class="btn ed-tool" id="trBack" href="#inicio">← Curso</a>
        <button class="btn ed-tool" id="trListBtn" type="button" title="Mostrar u ocultar la lista de actividades">☰ Actividades</button>
        <span class="tr-title" id="trTitle"></span>
        <button class="btn primary" id="trRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <span class="ed-spacer"></span>
        <button class="btn ed-tool" id="trProblemBtn" type="button" title="Mostrar u ocultar el enunciado">📄 Enunciado</button>
        <button class="btn ed-tool" id="trMore" type="button" aria-label="Más opciones" title="Más opciones">⋯</button>
        <input id="trOpen" type="file" accept=".cs,.txt,text/plain" hidden>
      </div>

      <div class="tr-main">
        <nav class="tr-browser" id="trBrowser" aria-label="Lista de actividades"></nav>
        <aside class="tr-problem" id="trProblem" aria-label="Enunciado de la actividad"></aside>
        <div class="tr-work" id="trWork"></div>
      </div>`;

    const $ = (id) => document.getElementById(id);
    ["Back", "Title", "Run", "Browser", "Problem", "Work", "More", "Open"].forEach((k) => (ui[k] = $("tr" + k)));

    pane = EditorPane.create({
      onChange: persist,
      onRunState: (r) => { ui.Run.disabled = r; ui.Run.textContent = r ? "⏳ Compilando…" : "▶ Ejecutar"; },
    });
    ui.Work.append(pane.editorEl, pane.ioEl);

    ui.Run.addEventListener("click", () => pane.run());
    $("trListBtn").addEventListener("click", () => { const t = trState(); t.browser = !root().classList.contains("show-browser"); applyPrefs(); saveState(); });
    $("trProblemBtn").addEventListener("click", () => { trState().hideProblem = !trState().hideProblem; applyPrefs(); saveState(); });
    EditorKit.menu(ui.More, () => [
      { text: "⬇ Guardar como Program.cs", onSelect: () => pane.save() },
      { text: "📂 Abrir un archivo .cs…", onSelect: () => ui.Open.click() },
      { text: "⎘ Copiar el código", onSelect: () => pane.copy(ui.More) },
      { text: "A+  Letra más grande", keep: true, onSelect: () => setFont(+1) },
      { text: "A−  Letra más pequeña", keep: true, onSelect: () => setFont(-1) },
      { text: "⇆ Editor y salida: cambiar disposición", onSelect: () => { trState().layout = trState().layout === "stack" ? "side" : "stack"; applyPrefs(); saveState(); } },
      { text: "🗑 Empezar de cero esta actividad", onSelect: () => pane.load(startCode(byKey.get(currentKey)), "", "Actividad reiniciada.") },
    ]);
    ui.Open.addEventListener("change", (e) => {
      const f = e.target.files[0];
      e.target.value = "";
      if (f) pane.readFile(f, (text) => pane.load(text, "", `Archivo «${f.name}» abierto.`));
    });

    // Botón «Marcar como resuelta» (vive dentro del enunciado)
    ui.Problem.addEventListener("click", (e) => {
      if (!e.target.closest(".tr-solved-btn")) return;
      const s = sub("solved");
      if (s[currentKey]) delete s[currentKey]; else s[currentKey] = true;
      saveState();
      renderProblem();
      renderBrowser();
    });

    built = true;
  }

  /* ---------- Lista de actividades por módulo ---------- */

  function renderBrowser() {
    // Recordamos qué módulos estaban abiertos para no cerrarlos al repintar
    const wasOpen = new Map([...ui.Browser.querySelectorAll("details")].map((d) => [d.dataset.mod, d.open]));
    const currentMod = currentKey ? byKey.get(currentKey).lesson.modulo.titulo : null;
    const solved = sub("solved");
    const total = list.length, done = list.filter((it) => solved[it.key]).length;

    const modules = COURSE.modulos.map((m, mi) => {
      const items = list.filter((it) => it.lesson.modulo === m);
      if (!items.length) return "";
      const mdone = items.filter((it) => solved[it.key]).length;
      const open = wasOpen.has(String(mi)) ? wasOpen.get(String(mi)) : m.titulo === currentMod || mi === 0;
      const lessonsHtml = m.lecciones.filter((l) => l.actividades.length).map((l) => `
        <div class="tr-lesson">${esc(l.titulo)}</div>
        ${items.filter((it) => it.lesson.id === l.id).map((it) => `
          <a class="tr-act${it.key === currentKey ? " active" : ""}${solved[it.key] ? " done" : ""}" href="#entrenamiento-${it.key}" ${it.key === currentKey ? 'aria-current="true"' : ""}>
            <span class="tick" aria-hidden="true">${solved[it.key] ? "✓" : ""}</span>
            <span class="t">${it.index + 1}. ${esc(it.act.titulo)}</span>
            <span class="lv" title="${esc((LEVELS[it.act.nivel] || LEVELS[1]).label)}">${stars(it)}</span>
          </a>`).join("")}`).join("");
      return `<details class="tr-mod" data-mod="${mi}" ${open ? "open" : ""}>
        <summary><span class="n">Módulo ${mi + 1}: ${esc(m.titulo)}</span><span class="c">${mdone}/${items.length}</span></summary>${lessonsHtml}</details>`;
    }).join("");

    ui.Browser.innerHTML = `
      <div class="tr-prog"><span><b>${done}</b> de ${total} actividades resueltas</span><div class="bar"><span style="width:${total ? (done / total) * 100 : 0}%"></span></div></div>
      ${modules}`;
  }

  /* ---------- Panel del enunciado ---------- */

  function renderProblem() {
    const it = byKey.get(currentKey), act = it.act;
    const i = list.indexOf(it);
    const prev = list[i - 1], next = list[i + 1];
    const level = LEVELS[act.nivel] || LEVELS[1];
    const solved = !!sub("solved")[currentKey];

    const variants = act.soluciones.map((s) => `
      <div class="variant">
        <h4>${esc(s.titulo)}</h4>
        ${codeBlock(s.codigo)}
        ${s.nota ? `<p class="note">${esc(s.nota)}</p>` : ""}
      </div>`).join("");

    ui.Problem.innerHTML = `
      <div class="tr-crumb">${esc(it.lesson.modulo.titulo)} · ${esc(it.lesson.titulo)}</div>
      <div class="tr-head"><span class="num">Actividad ${it.index + 1} de ${it.lesson.actividades.length}</span><span class="level ${level.cls}">${level.label}</span></div>
      <h2>${esc(act.titulo)}</h2>
      <div class="statement">${act.enunciado}</div>
      ${act.salida ? `<p class="expected-label">Ejemplo de salida</p><pre class="salida">${esc(act.salida)}</pre>` : ""}
      ${act.pista ? `<details class="fold"><summary>💡 Pista</summary><div class="fold-body"><p>${esc(act.pista)}</p></div></details>` : ""}
      <details class="fold solution"><summary>✅ ${act.soluciones.length > 1 ? `Ver soluciones (${act.soluciones.length} enfoques)` : "Ver solución"}</summary>
        <div class="fold-body"><p class="note">Inténtalo primero por tu cuenta: ¡se aprende mucho más!</p>${variants}</div>
      </details>
      <button type="button" class="btn ${solved ? "ok" : "primary"} tr-solved-btn">${solved ? "✓ Actividad resuelta" : "Marcar como resuelta"}</button>
      <div class="tr-nav">
        <a class="btn" ${prev ? `href="#entrenamiento-${prev.key}"` : 'aria-disabled="true"'}>← Anterior</a>
        <a class="btn" ${next ? `href="#entrenamiento-${next.key}"` : 'aria-disabled="true"'}>Siguiente →</a>
      </div>
      <a class="tr-lesson-link" href="#codificar-${esc(it.lesson.id)}">▶ Ver el vídeo de la lección y programar</a>`;
    ui.Problem.scrollTop = 0;
    ui.Title.textContent = `Actividad ${it.index + 1} · ${act.titulo}`;
  }

  /* ---------- Cargar una actividad ---------- */

  function loadActivity(key) {
    if (key === currentKey) return;
    persist();                                        // guardamos lo escrito en la actividad anterior
    currentKey = key;
    renderProblem();
    renderBrowser();
    const saved = sub("code")[key];
    pane.set(saved ? saved.code : startCode(byKey.get(key)), saved ? saved.stdin : "");
    trState().current = key;
    saveState();
  }

  /* ---------- Mostrar / ocultar la vista ---------- */

  function show(arg) {
    if (!built) build();
    const key = byKey.has(arg) ? arg : byKey.has(trState().current) ? trState().current : list[0].key;
    applyPrefs();
    root().hidden = false;
    document.body.classList.add("view-train");
    document.body.classList.remove("view-home", "menu-open");
    document.title = "Entrenamiento · " + COURSE.titulo;
    loadActivity(key);
    ui.Back.href = "#leccion-" + byKey.get(currentKey).lesson.id;
    pane.refresh();
    window.scrollTo({ top: 0 });
  }

  function hide() {
    const el = root();
    if (el) el.hidden = true;
    document.body.classList.remove("view-train");
  }

  return { show, hide };
})();
