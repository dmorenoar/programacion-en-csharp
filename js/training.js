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
        <span class="tr-title" id="trTitle"></span>
        <span class="ed-spacer"></span>
        <button class="btn ed-tool" id="trSave" type="button" title="Guardar como Program.cs (Ctrl+S)">⬇ Guardar</button>
        <button class="btn ed-tool" id="trOpenBtn" type="button" title="Abrir un archivo .cs">📂 Abrir</button>
        <button class="btn ed-tool" id="trCopy" type="button" title="Copiar el código">⎘ Copiar</button>
        <span class="ed-group">
          <button class="btn ed-tool" id="trFontDn" type="button" title="Letra más pequeña" aria-label="Letra más pequeña">A−</button>
          <button class="btn ed-tool" id="trFontUp" type="button" title="Letra más grande" aria-label="Letra más grande">A+</button>
        </span>
        <button class="btn ed-tool" id="trLayout" type="button" title="Cambiar la disposición de editor y salida (lado a lado / uno encima de otro)">⇆ Disposición</button>
        <button class="btn ed-tool" id="trFast" type="button"></button>
        <button class="btn ed-tool" id="trReset" type="button" title="Empezar de cero esta actividad (se puede deshacer)">🗑 Reiniciar</button>
        <button class="btn primary" id="trRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <input id="trOpen" type="file" accept=".cs,.txt,text/plain" hidden>
      </div>

      <div class="tr-main">
        <button class="tr-strip tr-strip-browser" type="button" data-expand="browser" title="Mostrar la lista de actividades"><b class="arrow" aria-hidden="true">»</b><span>☰ Actividades</span></button>
        <nav class="tr-browser" id="trBrowser" aria-label="Lista de actividades"></nav>
        <div class="tr-grip tr-grip-browser" data-grip="browser" role="separator" aria-orientation="vertical" title="Arrastra para cambiar el ancho"></div>
        <button class="tr-strip tr-strip-problem" type="button" data-expand="problem" title="Mostrar el enunciado"><b class="arrow" aria-hidden="true">»</b><span>📄 Enunciado</span></button>
        <aside class="tr-problem" id="trProblem" aria-label="Enunciado de la actividad"></aside>
        <div class="tr-grip tr-grip-problem" data-grip="problem" role="separator" aria-orientation="vertical" title="Arrastra para cambiar el ancho"></div>
        <div class="tr-work" id="trWork"></div>
      </div>`;

    const $ = (id) => document.getElementById(id);
    ["Back", "Title", "Run", "Browser", "Problem", "Work", "Open"].forEach((k) => (ui[k] = $("tr" + k)));

    pane = EditorPane.create({
      onChange: persist,
      onRunState: (r) => { ui.Run.disabled = r; ui.Run.textContent = r ? "⏳ Compilando…" : "▶ Ejecutar"; },
    });
    const gripIo = document.createElement("div");
    gripIo.className = "tr-grip tr-grip-io";
    gripIo.dataset.grip = "io";
    gripIo.setAttribute("role", "separator");
    gripIo.title = "Arrastra para cambiar el ancho";
    ui.Work.append(pane.editorEl, gripIo, pane.ioEl);

    ui.Run.addEventListener("click", () => pane.run());

    // Plegar y desplegar paneles: el botón « está DENTRO de cada panel y, plegado, queda una tira con su nombre
    root().addEventListener("click", (e) => {
      const c = e.target.closest("[data-collapse]"), x = e.target.closest("[data-expand]");
      if (!c && !x) return;
      const which = (c || x).dataset.collapse || (c || x).dataset.expand, show = !!x, t = trState();
      if (which === "browser") t.browser = show; else t.hideProblem = !show;
      applyPrefs(); saveState(); pane.refresh();
    });

    // Asas para cambiar el ancho arrastrando (se recuerda en el navegador)
    const LIMITS = { browser: [200, 520], problem: [260, 760], io: [220, 900] };
    const VARS = { browser: "--tr-bw", problem: "--tr-pw", io: "--tr-iw" };
    const DEFAULTS = { browser: 290, problem: 400, io: 340 };
    const widths = () => (trState().w = trState().w || {});
    const setW = (k, px) => { px = Math.min(Math.max(px, LIMITS[k][0]), LIMITS[k][1]); root().style.setProperty(VARS[k], px + "px"); return px; };
    Object.keys(DEFAULTS).forEach((k) => setW(k, widths()[k] || DEFAULTS[k]));
    root().addEventListener("pointerdown", (e) => {
      const g = e.target.closest("[data-grip]");
      if (!g) return;
      e.preventDefault();
      const k = g.dataset.grip, startX = e.clientX, start = widths()[k] || DEFAULTS[k], dir = k === "io" ? -1 : 1;
      g.setPointerCapture(e.pointerId);
      g.classList.add("drag");
      const move = (ev) => { widths()[k] = setW(k, start + (ev.clientX - startX) * dir); };
      const up = () => {
        g.classList.remove("drag");
        g.removeEventListener("pointermove", move);
        g.removeEventListener("pointerup", up);
        saveState();
      };
      g.addEventListener("pointermove", move);
      g.addEventListener("pointerup", up);
    });
    // Doble clic en un asa: vuelve al ancho original
    root().addEventListener("dblclick", (e) => {
      const g = e.target.closest("[data-grip]");
      if (g) { widths()[g.dataset.grip] = setW(g.dataset.grip, DEFAULTS[g.dataset.grip]); saveState(); }
    });
    const fastBtn = $("trFast");
    const paintFast = (on) => {
      fastBtn.textContent = on ? "⚡ Rápido: sí" : "⚡ Rápido: no";
      fastBtn.title = on ? "Vía rápida (experimental): programas sencillos se compilan con Mono. Pulsa para desactivarla y usar siempre .NET." : "Vía rápida desactivada: siempre se compila con .NET. Pulsa para activarla.";
    };
    paintFast(EditorKit.fast.enabled);
    EditorKit.fast.onChange(paintFast);
    fastBtn.addEventListener("click", () => EditorKit.fast.set(!EditorKit.fast.enabled));
    $("trSave").addEventListener("click", () => pane.save());
    $("trOpenBtn").addEventListener("click", () => ui.Open.click());
    $("trCopy").addEventListener("click", () => pane.copy($("trCopy")));
    $("trFontUp").addEventListener("click", () => setFont(+1));
    $("trFontDn").addEventListener("click", () => setFont(-1));
    $("trLayout").addEventListener("click", () => { trState().layout = trState().layout === "stack" ? "side" : "stack"; applyPrefs(); saveState(); });
    $("trReset").addEventListener("click", () => pane.load(startCode(byKey.get(currentKey)), "", "Actividad reiniciada."));
    ui.Open.addEventListener("change", (e) => {
      const f = e.target.files[0];
      e.target.value = "";
      if (f) pane.readFile(f, (text) => pane.load(text, "", `Archivo «${f.name}» abierto.`));
    });

    // Marcar/desmarcar una actividad como resuelta (botón del enunciado o círculo de la lista)
    const toggleSolved = (key) => {
      const s = sub("solved");
      if (s[key]) delete s[key]; else s[key] = true;
      saveState();
      if (key === currentKey) renderProblem();
      renderBrowser();
    };
    ui.Problem.addEventListener("click", (e) => { if (e.target.closest(".tr-solved-btn")) toggleSolved(currentKey); });
    ui.Browser.addEventListener("click", (e) => {
      const t = e.target.closest(".tick[data-act]");
      if (!t) return;
      e.preventDefault();                 // está dentro de un enlace: no cambiar de actividad
      const key = t.dataset.act;
      toggleSolved(key);
      const again = ui.Browser.querySelector(`.tick[data-act="${key}"]`);
      if (again) again.focus();
    });
    ui.Browser.addEventListener("keydown", (e) => {
      const t = e.target.closest && e.target.closest(".tick[data-act]");
      if (t && (e.key === " " || e.key === "Enter")) { e.preventDefault(); t.click(); }
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
            <span class="tick" role="checkbox" tabindex="0" data-act="${it.key}" aria-checked="${!!solved[it.key]}" aria-label="Marcar como resuelta: ${esc(it.act.titulo)}" title="${solved[it.key] ? "Desmarcar como resuelta" : "Marcar como resuelta"}">${solved[it.key] ? "✓" : ""}</span>
            <span class="t">${it.index + 1}. ${esc(it.act.titulo)}</span>
            <span class="lv" title="${esc((LEVELS[it.act.nivel] || LEVELS[1]).label)}">${stars(it)}</span>
          </a>`).join("")}`).join("");
      return `<details class="tr-mod" data-mod="${mi}" ${open ? "open" : ""}>
        <summary><span class="n">Módulo ${mi + 1}: ${esc(m.titulo)}</span><span class="c">${mdone}/${items.length}</span></summary>${lessonsHtml}</details>`;
    }).join("");

    ui.Browser.innerHTML = `
      <div class="tr-phead"><b>☰ Actividades</b><button type="button" class="tr-collapse" data-collapse="browser" title="Ocultar la lista de actividades" aria-label="Ocultar la lista de actividades">«</button></div>
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
      <div class="tr-phead"><b>📄 Enunciado</b><button type="button" class="tr-collapse" data-collapse="problem" title="Ocultar el enunciado" aria-label="Ocultar el enunciado">«</button></div>
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
