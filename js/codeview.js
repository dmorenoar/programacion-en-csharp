/* =====================================================================
   js/codeview.js · VISTA «CODIFICAR» (vídeo + editor para seguir la clase)
   ---------------------------------------------------------------------
   Pantalla dividida: a la IZQUIERDA el editor (con su salida debajo) y a la DERECHA
   el vídeo de la lección. La idea: ves lo que explica el profesor y lo programas
   al momento, sin cambiar de pestaña.

     · cada lección tiene su propio «cuaderno» de código (se guarda en el navegador)
     · selector de lección, ejemplos de la lección y arrastre del separador
     · enlace: #codificar  o  #codificar-<id-de-la-lección>

   Se carga ANTES de app.js (route() la necesita al arrancar). Lo que depende de la
   página (COURSE, state, videoHTML…) solo se usa dentro de las funciones.
   ===================================================================== */

const CodeView = (() => {
  const root = () => document.getElementById("codeview");
  let built = false, ui = {}, pane = null, currentId = null;

  const startCode = (l) => `// ${l.titulo}\n// Escribe aquí lo que vayas viendo en el vídeo. Ctrl + Intro para ejecutar.\n`;

  /* ---------- Estado (se guarda en el navegador) ---------- */

  const cvState = () => (state.codeview = state.codeview || { byLesson: {} });
  const notebooks = () => (cvState().byLesson = cvState().byLesson || {});

  function persist() {
    if (!pane || !currentId) return;
    notebooks()[currentId] = { code: pane.code, stdin: pane.stdin };
    saveState();
  }
  function applyPrefs() {
    root().style.setProperty("--ep-fs", (state.editorFs || 14) + "px");
    const w = cvState().leftPx;
    if (w) root().style.setProperty("--cv-left", w + "px");
  }
  function setFont(delta) {
    state.editorFs = Math.min(24, Math.max(11, (state.editorFs || 14) + delta));
    applyPrefs(); saveState();
  }

  /* ---------- Construcción de la interfaz (una sola vez) ---------- */

  function build() {
    const lessonOpts = COURSE.modulos.map((m) =>
      `<optgroup label="${esc(m.titulo)}">${m.lecciones.map((l) => `<option value="${esc(l.id)}">${esc(l.titulo)}</option>`).join("")}</optgroup>`).join("");

    root().innerHTML = `
      <div class="ed-bar">
        <a class="btn ed-tool" id="cvBack" href="#inicio">← Curso</a>
        <select class="ed-select" id="cvLesson" aria-label="Lección">${lessonOpts}</select>
        <button class="btn primary" id="cvRun" type="button" title="Ejecutar (Ctrl+Intro)">▶ Ejecutar</button>
        <select class="ed-select" id="cvExamples" aria-label="Cargar un ejemplo de esta lección"></select>
        <span class="ed-spacer"></span>
        <button class="btn ed-tool" id="cvSave" type="button" title="Descargar como Program.cs (Ctrl+S)">⬇ Guardar</button>
        <label class="btn ed-tool" title="Abrir un archivo .cs de tu ordenador">📂 Abrir<input id="cvOpen" type="file" accept=".cs,.txt,text/plain" hidden></label>
        <button class="btn ed-tool" id="cvCopy" type="button">Copiar</button>
        <span class="ed-group" role="group" aria-label="Tamaño de letra">
          <button class="btn ed-tool" id="cvSmaller" type="button" aria-label="Letra más pequeña">A−</button>
          <button class="btn ed-tool" id="cvBigger" type="button" aria-label="Letra más grande">A+</button>
        </span>
        <button class="btn ed-tool" id="cvReset" type="button" title="Borrar el código de esta lección" aria-label="Borrar el código de esta lección">🗑</button>
      </div>

      <div class="cv-main">
        <div class="cv-left" id="cvLeft"></div>
        <div class="cv-split" id="cvSplit" role="separator" aria-orientation="vertical" aria-label="Cambiar el ancho del editor"></div>
        <aside class="cv-right" aria-label="Vídeo de la lección">
          <div class="cv-video" id="cvVideo"></div>
          <div class="cv-info" id="cvInfo"></div>
        </aside>
      </div>`;

    const $ = (id) => document.getElementById(id);
    ["Back", "Lesson", "Run", "Examples", "Left", "Video", "Info"].forEach((k) => (ui[k] = $("cv" + k)));

    pane = EditorPane.create({
      onChange: persist,
      onRunState: (r) => { ui.Run.disabled = r; ui.Run.textContent = r ? "⏳ Compilando…" : "▶ Ejecutar"; },
    });
    ui.Left.append(pane.editorEl, pane.ioEl);

    ui.Run.addEventListener("click", () => pane.run());
    $("cvSave").addEventListener("click", () => pane.save());
    $("cvCopy").addEventListener("click", (e) => pane.copy(e.currentTarget));
    $("cvBigger").addEventListener("click", () => setFont(+1));
    $("cvSmaller").addEventListener("click", () => setFont(-1));
    $("cvReset").addEventListener("click", () => {
      if (confirm("¿Borrar el código de esta lección?")) { pane.set(startCode(lessonById.get(currentId)), ""); persist(); }
    });
    $("cvOpen").addEventListener("change", (e) => {
      const f = e.target.files[0];
      e.target.value = "";
      if (f) pane.readFile(f, (text) => { if (confirmReplace()) { pane.set(text, ""); persist(); } });
    });
    ui.Lesson.addEventListener("change", () => { location.hash = "#codificar-" + ui.Lesson.value; });
    ui.Examples.addEventListener("change", () => {
      const l = lessonById.get(currentId), ex = l.ejemplos[ui.Examples.value];
      ui.Examples.value = "";
      if (ex && confirmReplace()) { pane.set(ex.codigo.replace(/\s+$/, "") + "\n", ""); persist(); pane.focus(); }
    });

    // Separador arrastrable entre el editor y el vídeo (el ancho se recuerda)
    $("cvSplit").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      const split = e.currentTarget;
      split.setPointerCapture(e.pointerId);
      const main = split.parentElement.getBoundingClientRect();
      const move = (ev) => {
        const w = Math.min(Math.max(ev.clientX - main.left, 340), main.width - 320);
        root().style.setProperty("--cv-left", w + "px");
        cvState().leftPx = Math.round(w);
      };
      const up = () => { split.removeEventListener("pointermove", move); split.removeEventListener("pointerup", up); saveState(); };
      split.addEventListener("pointermove", move);
      split.addEventListener("pointerup", up);
    });

    built = true;
  }

  // Preguntamos antes de reemplazar solo si el editor tiene código «de verdad»
  function confirmReplace() {
    const code = pane.code.trim();
    const untouched = !code || code === startCode(lessonById.get(currentId)).trim();
    return untouched || confirm("Se reemplazará el código actual de esta lección. ¿Continuar?");
  }

  /* ---------- Cargar una lección en la vista ---------- */

  function loadLesson(id) {
    if (id === currentId) return;                    // misma lección: no reiniciamos el vídeo
    persist();                                       // guardamos el cuaderno de la lección anterior
    currentId = id;
    const l = lessonById.get(id);
    ui.Lesson.value = id;
    ui.Video.innerHTML = videoHTML(l.video, l.titulo);
    const idx = lessons.findIndex((x) => x.id === id);
    const prev = lessons[idx - 1], next = lessons[idx + 1];
    ui.Info.innerHTML = `
      <h2>${esc(l.titulo)}</h2>
      <div class="cv-crumb">${esc(l.modulo.titulo)} · Lección ${idx + 1} de ${lessons.length}</div>
      ${l.objetivos && l.objetivos.length ? `<details class="cv-goals" open><summary>🎯 Lo que aprenderás</summary><ul>${l.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></details>` : ""}
      <div class="cv-links">
        <a class="btn" href="#leccion-${esc(id)}">📖 Teoría de la lección</a>
        <a class="btn" href="#entrenamiento-${esc(id)}.0">🎯 Actividades</a>
      </div>
      <div class="cv-links">
        <a class="btn" ${prev ? `href="#codificar-${esc(prev.id)}"` : 'aria-disabled="true"'}>← Anterior</a>
        <a class="btn" ${next ? `href="#codificar-${esc(next.id)}"` : 'aria-disabled="true"'}>Siguiente →</a>
      </div>`;
    ui.Examples.innerHTML = `<option value="">📚 Ejemplos de la lección…</option>` + l.ejemplos.map((e, i) => `<option value="${i}">${esc(e.titulo)}</option>`).join("");
    ui.Examples.hidden = !l.ejemplos.length;

    const nb = notebooks()[id];
    pane.set(nb ? nb.code : startCode(l), nb ? nb.stdin : "");
    state.last = id;                                  // la lección «actual» del curso
    saveState();
  }

  /* ---------- Mostrar / ocultar la vista ---------- */

  function show(arg) {
    if (!built) build();
    Training.hide();
    const id = lessonById.has(arg) ? arg : lessonById.has(state.last) ? state.last : lessons[0].id;
    applyPrefs();
    root().hidden = false;
    document.body.classList.add("view-code");
    document.body.classList.remove("view-train", "view-home", "menu-open");
    document.title = "Codificar · " + COURSE.titulo;
    loadLesson(id);
    ui.Back.href = "#leccion-" + currentId;
    pane.refresh();
    window.scrollTo({ top: 0 });
  }

  function hide() {
    const el = root();
    if (el) el.hidden = true;
    document.body.classList.remove("view-code");
  }

  // Lo usa el botón «↗ Codificar» del panel «Probar»: lleva el código al cuaderno de la lección actual
  function open(code, stdin) {
    if (!built) build();
    const id = lessonById.has(state.last) ? state.last : lessons[0].id;
    notebooks()[id] = { code, stdin: stdin || "" };
    saveState();
    if (currentId === id) pane.set(code, stdin || "");   // ya estaba cargada: forzamos el cambio
    const target = "#codificar-" + id;
    if (location.hash === target) show(id); else location.hash = target;
  }

  return { show, hide, open };
})();
