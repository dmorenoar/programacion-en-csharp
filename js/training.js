/* =====================================================================
   js/training.js · VISTA «ENTRENAMIENTO» (resolver las actividades del curso)
   ---------------------------------------------------------------------
   El alumno elige una actividad en un desplegable, lee el enunciado a la IZQUIERDA y
   escribe su solución en el editor. Cuando lo consigue puede marcarla como resuelta
   y, si se atasca, abrir la pista o la solución (que están plegadas a propósito).

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

  function persist() {
    if (!pane || !currentKey) return;
    sub("code")[currentKey] = { code: pane.code, stdin: pane.stdin };
    saveState();
  }
  function applyPrefs() {
    root().style.setProperty("--ep-fs", (state.editorFs || 14) + "px");
    root().classList.toggle("stacked", trState().layout === "stack");
    root().classList.toggle("no-problem", !!trState().hideProblem);
  }
  function setFont(delta) {
    state.editorFs = Math.min(24, Math.max(11, (state.editorFs || 14) + delta));
    applyPrefs(); saveState();
  }

  const startCode = (it) => `// Actividad ${it.index + 1}: ${it.act.titulo}\n// Escribe aquí tu solución. Ctrl + Intro para ejecutar.\n`;
  const optionLabel = (it) => `${sub("solved")[it.key] ? "✓ " : ""}Actividad ${it.index + 1} · ${it.act.titulo} (${(LEVELS[it.act.nivel] || LEVELS[1]).label.split(" ")[0]})`;

  /* ---------- Construcción de la interfaz (una sola vez) ---------- */

  function build() {
    collect();
    root().innerHTML = `
      <div class="ed-bar">
        <a class="btn ed-tool" id="trBack" href="#inicio">← Curso</a>
        <select class="ed-select tr-select" id="trSelect" aria-label="Elegir actividad"></select>
        <button class="btn primary" id="trRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <span class="ed-spacer"></span>
        <button class="btn ed-tool" id="trProblemBtn" type="button" title="Mostrar u ocultar el enunciado">📄 Enunciado</button>
        <button class="btn ed-tool" id="trSave" type="button" title="Descargar como Program.cs (Ctrl+S)">⬇ Guardar</button>
        <label class="btn ed-tool" title="Abrir un archivo .cs de tu ordenador">📂 Abrir<input id="trOpen" type="file" accept=".cs,.txt,text/plain" hidden></label>
        <button class="btn ed-tool" id="trCopy" type="button">Copiar</button>
        <span class="ed-group" role="group" aria-label="Tamaño de letra">
          <button class="btn ed-tool" id="trSmaller" type="button" aria-label="Letra más pequeña">A−</button>
          <button class="btn ed-tool" id="trBigger" type="button" aria-label="Letra más grande">A+</button>
        </span>
        <button class="btn ed-tool" id="trLayout" type="button" title="Cambiar la disposición de editor y salida" aria-label="Cambiar disposición">⇆</button>
        <button class="btn ed-tool" id="trReset" type="button" title="Empezar de cero esta actividad" aria-label="Empezar de cero esta actividad">🗑</button>
      </div>

      <div class="tr-main">
        <aside class="tr-problem" id="trProblem" aria-label="Enunciado de la actividad"></aside>
        <div class="tr-work" id="trWork"></div>
      </div>`;

    const $ = (id) => document.getElementById(id);
    ["Back", "Select", "Run", "Problem", "Work"].forEach((k) => (ui[k] = $("tr" + k)));

    // Desplegable agrupado por lección
    ui.Select.innerHTML = lessons.filter((l) => l.actividades.length).map((l) =>
      `<optgroup label="${esc(l.titulo)}">${list.filter((it) => it.lesson === l).map((it) => `<option value="${it.key}">${esc(optionLabel(it))}</option>`).join("")}</optgroup>`).join("");

    pane = EditorPane.create({
      onChange: persist,
      onRunState: (r) => { ui.Run.disabled = r; ui.Run.textContent = r ? "⏳ Compilando…" : "▶ Ejecutar"; },
    });
    ui.Work.append(pane.editorEl, pane.ioEl);

    ui.Select.addEventListener("change", () => { location.hash = "#entrenamiento-" + ui.Select.value; });
    ui.Run.addEventListener("click", () => pane.run());
    $("trSave").addEventListener("click", () => pane.save());
    $("trCopy").addEventListener("click", (e) => pane.copy(e.currentTarget));
    $("trBigger").addEventListener("click", () => setFont(+1));
    $("trSmaller").addEventListener("click", () => setFont(-1));
    $("trLayout").addEventListener("click", () => { trState().layout = trState().layout === "stack" ? "side" : "stack"; applyPrefs(); saveState(); });
    $("trProblemBtn").addEventListener("click", () => { trState().hideProblem = !trState().hideProblem; applyPrefs(); saveState(); });
    $("trReset").addEventListener("click", () => {
      if (confirm("¿Empezar de cero esta actividad? Se borrará tu código.")) { pane.set(startCode(byKey.get(currentKey)), ""); persist(); }
    });
    $("trOpen").addEventListener("change", (e) => {
      const f = e.target.files[0];
      e.target.value = "";
      if (f) pane.readFile(f, (text) => { if (confirm("Se reemplazará el código actual. ¿Continuar?")) { pane.set(text, ""); persist(); } });
    });

    // Botón «Marcar como resuelta» y «Actividad anterior/siguiente» (viven dentro del enunciado)
    ui.Problem.addEventListener("click", (e) => {
      if (e.target.closest(".tr-solved-btn")) {
        const s = sub("solved");
        if (s[currentKey]) delete s[currentKey]; else s[currentKey] = true;
        saveState();
        renderProblem();
        refreshOption(currentKey);
      }
    });

    built = true;
  }

  function refreshOption(key) {
    const opt = ui.Select.querySelector(`option[value="${key}"]`);
    if (opt) opt.textContent = optionLabel(byKey.get(key));
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
  }

  /* ---------- Cargar una actividad ---------- */

  function loadActivity(key) {
    if (key === currentKey) return;
    persist();                                        // guardamos lo escrito en la actividad anterior
    currentKey = key;
    ui.Select.value = key;
    renderProblem();
    const saved = sub("code")[key];
    pane.set(saved ? saved.code : startCode(byKey.get(key)), saved ? saved.stdin : "");
    trState().current = key;
    saveState();
  }

  /* ---------- Mostrar / ocultar la vista ---------- */

  function show(arg) {
    if (!built) build();
    CodeView.hide();
    const key = byKey.has(arg) ? arg : byKey.has(trState().current) ? trState().current : list[0].key;
    applyPrefs();
    root().hidden = false;
    document.body.classList.add("view-train");
    document.body.classList.remove("view-code", "view-home", "menu-open");
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
