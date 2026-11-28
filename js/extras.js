/* =====================================================================
   js/extras.js · EXTRAS DE COMODIDAD (se carga DESPUÉS de app.js)
   ---------------------------------------------------------------------
   Cuatro piezas independientes, cada una en su bloque:
     1. Buscador       → busca en el texto de TODAS las lecciones (atajo: «/» o Ctrl+K)
     2. Imprimir       → botón 🖨 que imprime la lección sin menús ni editor
     3. Copia de datos → guardar y cargar el progreso en un archivo (para cambiar de dispositivo)
     4. Accesibilidad  → enlace «Saltar al contenido»

   Idea de diseño: app.js no se toca. Este archivo solo LEE las variables globales
   que app.js ya ha creado (lessons, lessonById, state, saveState, renderLesson…).
   Si mañana quieres quitar una función, borras su bloque y listo.
   ===================================================================== */
"use strict";

(() => {
  /* ======================== 1. BUSCADOR ======================== */
  /* Cómo funciona (de más fácil a más profesional se puede mejorar así: índice invertido,
     lunr.js o Fuse.js; aquí basta con recorrer el texto porque son pocas lecciones):
       a) Al abrir el buscador por primera vez se construye un «índice»: por cada lección,
          su texto sin etiquetas HTML y también sin tildes ni mayúsculas.
       b) Al escribir, se exige que aparezcan TODAS las palabras de la consulta.
       c) Se ordena por puntos: título (mucho) > objetivos > veces que aparece en el texto. */

  // «Canción» → «cancion»: así «cancion» encuentra «canción» y «CANCION» también.
  const fold = (t) => t.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  const decode = (t) => t.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
  const plain = (html) => decode(String(html || "").replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();

  let index = null;   // se construye al abrir el buscador por primera vez
  function buildIndex() {
    index = lessons.map((l) => {
      const objetivos = (l.objetivos || []).join(". ");
      const extra = [...(l.ejemplos || []).map((e) => e.titulo), ...(l.actividades || []).map((a) => a.titulo)].join(". ");
      const text = [plain(l.teoria), objetivos, extra].join(" ");
      return { l, text, tFold: fold(l.titulo), oFold: fold(objetivos + " " + extra), xFold: fold(text) };
    });
  }

  function search(query) {
    const terms = fold(query).split(/\s+/).filter((t) => t.length > 1);
    if (!terms.length) return [];
    const hits = [];
    for (const it of index) {
      if (!terms.every((t) => it.xFold.includes(t))) continue;
      let score = 0;
      for (const t of terms) {
        if (it.tFold.includes(t)) score += 50;
        if (it.oFold.includes(t)) score += 10;
        score += Math.min(it.xFold.split(t).length - 1, 20);
      }
      hits.push({ it, score });
    }
    hits.sort((a, b) => b.score - a.score);
    return hits.slice(0, 25).map((h) => ({ ...h, terms }));
  }

  // Un trocito de texto alrededor de la primera coincidencia, con las palabras marcadas.
  // Como fold() no cambia la longitud del texto, las posiciones sirven para el texto original.
  function snippet(it, terms) {
    const pos = Math.min(...terms.map((t) => { const p = it.xFold.indexOf(t); return p < 0 ? Infinity : p; }));
    const start = Math.max(0, (isFinite(pos) ? pos : 0) - 50);
    const piece = it.text.slice(start, start + 170);
    const pieceFold = it.xFold.slice(start, start + 170);
    const mark = new Array(piece.length).fill(false);
    for (const t of terms) {
      let p = pieceFold.indexOf(t);
      while (p >= 0) { for (let k = p; k < p + t.length; k++) mark[k] = true; p = pieceFold.indexOf(t, p + 1); }
    }
    let out = "", open = false;
    for (let k = 0; k < piece.length; k++) {
      if (mark[k] && !open) { out += "<mark>"; open = true; }
      if (!mark[k] && open) { out += "</mark>"; open = false; }
      out += esc(piece[k]);
    }
    if (open) out += "</mark>";
    return (start > 0 ? "… " : "") + out + (start + 170 < it.text.length ? " …" : "");
  }

  // --- Ventana del buscador (se crea una sola vez) ---
  const modal = document.createElement("div");
  modal.className = "sr-modal";
  modal.hidden = true;
  modal.innerHTML = `
    <div class="sr-box" role="dialog" aria-modal="true" aria-label="Buscar en el curso">
      <div class="sr-head">
        <input id="srInput" type="search" placeholder="Busca en todo el curso: bucle, TryParse, interface…" autocomplete="off" spellcheck="false" aria-label="Texto a buscar" aria-controls="srList">
        <button type="button" class="icon-btn sr-close" id="srClose" aria-label="Cerrar el buscador">✕</button>
      </div>
      <p class="sr-help" id="srHelp">Escribe al menos dos letras. Usa ↑ ↓ para moverte y Intro para abrir.</p>
      <ul class="sr-list" id="srList" role="listbox" aria-label="Resultados"></ul>
    </div>`;
  document.body.appendChild(modal);

  const input = modal.querySelector("#srInput");
  const list = modal.querySelector("#srList");
  const help = modal.querySelector("#srHelp");
  let results = [], active = -1, opener = null;

  function paint() {
    const q = input.value.trim();
    if (q.length < 2) { results = []; list.innerHTML = ""; help.textContent = "Escribe al menos dos letras. Usa ↑ ↓ para moverte y Intro para abrir."; return; }
    results = search(q);
    active = results.length ? 0 : -1;
    help.textContent = results.length ? `${results.length} ${results.length === 1 ? "lección encontrada" : "lecciones encontradas"}` : "Sin resultados. Prueba con otra palabra o con menos letras.";
    list.innerHTML = results.map((r, i) => `
      <li role="option" id="sr-${i}" aria-selected="${i === active}">
        <a href="#leccion-${esc(r.it.l.id)}" data-i="${i}">
          <span class="sr-t">${esc(r.it.l.titulo)}</span>
          <span class="sr-m">${esc(r.it.l.modulo.titulo)}</span>
          <span class="sr-s">${snippet(r.it, r.terms)}</span>
        </a>
      </li>`).join("");
  }

  function setActive(n) {
    if (!results.length) return;
    active = (n + results.length) % results.length;
    list.querySelectorAll("li").forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
    const li = list.children[active];
    li.scrollIntoView({ block: "nearest" });
    input.setAttribute("aria-activedescendant", li.id);
  }

  function openSearch() {
    if (!index) buildIndex();
    opener = document.activeElement;
    modal.hidden = false;
    document.body.classList.add("sr-open");
    input.select();
    input.focus();
    paint();
  }
  function closeSearch() {
    modal.hidden = true;
    document.body.classList.remove("sr-open");
    if (opener && opener.focus) opener.focus();
  }

  input.addEventListener("input", paint);
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive(active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(active - 1); }
    else if (e.key === "Enter" && results[active]) { e.preventDefault(); location.hash = "#leccion-" + results[active].it.l.id; closeSearch(); }
  });
  list.addEventListener("click", (e) => { if (e.target.closest("a")) closeSearch(); });   // el enlace ya cambia el hash
  modal.addEventListener("click", (e) => { if (e.target === modal) closeSearch(); });
  modal.querySelector("#srClose").addEventListener("click", closeSearch);

  // Botón de la cabecera (justo antes de «Entrenamiento»)
  const searchBtn = document.createElement("button");
  searchBtn.type = "button";
  searchBtn.className = "icon-btn";
  searchBtn.id = "searchBtn";
  searchBtn.setAttribute("aria-label", "Buscar en el curso (atajo: barra inclinada)");
  searchBtn.title = "Buscar en el curso ( / )";
  searchBtn.textContent = "🔍";
  searchBtn.addEventListener("click", openSearch);
  const trainBtn = document.getElementById("trainBtn");
  trainBtn.parentNode.insertBefore(searchBtn, trainBtn);

  // Atajos: «/» o Ctrl+K abren; Esc cierra. No se activa si estás escribiendo en un campo.
  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable || (e.target.closest && e.target.closest(".cm-editor, .ep-editor"));
    if (!modal.hidden && e.key === "Escape") { e.preventDefault(); closeSearch(); return; }
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing)) { e.preventDefault(); modal.hidden ? openSearch() : input.focus(); }
  });

  /* ======================== 2. IMPRIMIR ======================== */
  /* El aspecto de la hoja lo decide css/extras.css (@media print). Aquí solo hace falta
     que, al imprimir, estén visibles la teoría y las actividades (normalmente una pestaña
     oculta no se imprime). Los eventos beforeprint/afterprint nos avisan del momento exacto. */
  const printBtn = document.createElement("button");
  printBtn.type = "button";
  printBtn.className = "icon-btn";
  printBtn.id = "printBtn";
  printBtn.setAttribute("aria-label", "Imprimir esta lección o guardarla como PDF");
  printBtn.title = "Imprimir la lección / guardar como PDF";
  printBtn.textContent = "🖨";
  printBtn.addEventListener("click", () => window.print());
  searchBtn.after(printBtn);

  let hiddenBefore = [];
  window.addEventListener("beforeprint", () => {
    // Si la lección es una chuleta (una hoja), se imprime solo la tabla; el CSS usa esta clase
    document.body.classList.toggle("print-chuleta", !!document.querySelector("#panel-teoria .chuleta"));
    hiddenBefore = [];
    ["panel-teoria", "panel-actividades"].forEach((id) => {
      const p = document.getElementById(id);
      if (p && p.hidden) { hiddenBefore.push(p); p.hidden = false; }
    });
  });
  window.addEventListener("afterprint", () => { hiddenBefore.forEach((p) => (p.hidden = true)); hiddenBefore = []; document.body.classList.remove("print-chuleta"); });

  /* ======================== 3. COPIA DEL PROGRESO ======================== */
  /* El progreso vive en el navegador (localStorage): si cambias de móvil a ordenador, no te
     sigue. Solución sin servidor: exportarlo a un archivo .json e importarlo en el otro sitio. */
  const foot = document.querySelector(".sidebar-foot");
  if (foot) {
    foot.insertAdjacentHTML("afterbegin", `
      <button class="link-btn" id="exportBtn" type="button">Guardar mi progreso en un archivo</button>
      <button class="link-btn" id="importBtn" type="button">Cargar mi progreso desde un archivo</button>
      <input type="file" id="importFile" accept="application/json,.json" hidden>
      <p class="data-msg" id="dataMsg" role="status" aria-live="polite"></p>`);
    const msg = document.getElementById("dataMsg");
    const say = (t) => { msg.textContent = t; setTimeout(() => (msg.textContent = ""), 6000); };

    document.getElementById("exportBtn").addEventListener("click", () => {
      const data = {
        curso: "programacion-en-csharp", version: 2, done: state.done, last: state.last,
        solved: (state.training && state.training.solved) || {}, quiz: state.quiz || {},
        dias: (state.game && state.game.dias) || [],
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "mi-progreso-csharp.json";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      say("Archivo guardado. Cárgalo en el otro dispositivo.");
    });

    const file = document.getElementById("importFile");
    document.getElementById("importBtn").addEventListener("click", () => file.click());
    file.addEventListener("change", async () => {
      try {
        const data = JSON.parse(await file.files[0].text());
        if (data.curso !== "programacion-en-csharp" || typeof data.done !== "object") throw new Error("formato");
        // Solo se aceptan identificadores de lecciones que existen (el archivo no es de fiar)
        let n = 0;
        for (const id of Object.keys(data.done)) if (lessonById.has(id) && data.done[id]) { state.done[id] = true; n++; }
        if (lessonById.has(data.last)) state.last = data.last;
        // Versión 2 del archivo: también actividades resueltas, mejores notas de los tests y días de racha
        if (data.solved && typeof data.solved === "object") {
          state.training = state.training || { code: {}, solved: {} };
          for (const k of Object.keys(data.solved)) if (data.solved[k] && lessonById.has(k.slice(0, k.lastIndexOf(".")))) state.training.solved[k] = true;
        }
        if (data.quiz && typeof data.quiz === "object") {
          state.quiz = state.quiz || {};
          for (const [id, q] of Object.entries(data.quiz)) {
            if (lessonById.has(id) && q && q.total > 0 && q.best >= 0 && q.best <= q.total) state.quiz[id] = { best: Math.max(q.best, (state.quiz[id] || { best: 0 }).best), total: q.total };
          }
        }
        if (Array.isArray(data.dias) && state.game) {
          state.game.dias = [...new Set([...state.game.dias, ...data.dias.filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))])].sort().slice(-120);
        }
        saveState();
        renderSidebar();
        updateProgress();
        if (currentId) renderLesson(currentId, currentTab); else showHome();
        say(`Progreso cargado: ${n} lecciones marcadas.`);
      } catch {
        say("No he podido leer ese archivo. ¿Es el que guardaste desde esta web?");
      }
      file.value = "";
    });
  }

  /* ======================== 4. ACCESIBILIDAD ======================== */
  // Quien navega con teclado puede saltarse la cabecera y el menú con el primer Tab.
  const skip = document.createElement("a");
  skip.className = "skip-link";
  skip.href = "#content";
  skip.textContent = "Saltar al contenido";
  skip.addEventListener("click", (e) => {
    e.preventDefault();
    const target = document.getElementById("home").hidden ? document.getElementById("content") : document.getElementById("home");
    target.setAttribute("tabindex", "-1");
    target.focus();
  });
  document.body.insertBefore(skip, document.body.firstChild);
})();
