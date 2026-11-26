/* =====================================================================
   js/app.js  ·  La lógica de la web
   ---------------------------------------------------------------------
   Estructura (de arriba abajo, cada bloque depende solo de los anteriores):
     1. Utilidades        → $, esc (escapar HTML), store (localStorage seguro)
     2. Datos y estado    → lecciones "aplanadas", progreso guardado
     3. Resaltado de C#   → mini "syntax highlighter" propio (sin librerías)
     4. Plantillas        → funciones que devuelven HTML (vídeo, código, actividades…)
     5. Render            → dibuja el menú lateral y la lección activa
     6. Eventos y rutas   → clics, teclado y navegación con el hash de la URL

   Todo es JavaScript "vanilla": sin frameworks ni compilación, así que se
   puede publicar tal cual en GitHub Pages.
   ===================================================================== */
"use strict";

/* ============================ 1. UTILIDADES ============================ */

const $ = (selector, root = document) => root.querySelector(selector);

// Convierte caracteres especiales en entidades HTML. Imprescindible antes de
// meter TEXTO en innerHTML, para que "<" se vea como "<" y no como una etiqueta.
const esc = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// localStorage puede fallar (modo privado, iframes, cuota llena…).
// Envolvemos en try/catch para que la web funcione igual, aunque sin guardar.
const store = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* sin almacenamiento: no pasa nada */
    }
  },
};

/* ======================== 2. DATOS Y ESTADO ======================== */

// "Aplanamos" módulos → lecciones para poder calcular anterior/siguiente fácilmente.
const lessons = COURSE.modulos.flatMap((modulo) =>
  modulo.lecciones.map((leccion) => ({ ...leccion, modulo }))
);
const lessonById = new Map(lessons.map((l) => [l.id, l]));

const STORAGE_KEY = "curso-csharp:v1";   // si cambias la estructura, sube la versión
const state = Object.assign({ done: {}, last: null, theme: null, sidebarHidden: false }, store.get(STORAGE_KEY, {}));
const saveState = () => store.set(STORAGE_KEY, state);

let currentId = null;
let currentTab = "teoria";

/* ====================== 3. RESALTADO DE SINTAXIS C# ====================== */
/* Idea: una sola expresión regular con "grupos" que reconoce, por orden:
     1) comentarios  2) cadenas y caracteres  3) números  4) identificadores
   Recorremos el código buscando coincidencias; lo que queda entre ellas se
   copia tal cual (escapado). Cada coincidencia se envuelve en un <span>.   */

const KEYWORDS = new Set(
  ("abstract as base bool break byte case catch char checked class const continue decimal default delegate do double " +
   "else enum event explicit extern false finally fixed float for foreach goto if implicit in int interface internal is " +
   "lock long namespace new null object operator or and not out override params private protected public readonly ref " +
   "return sbyte sealed short sizeof static string struct switch this throw true try typeof uint ulong unchecked unsafe " +
   "ushort using var virtual void volatile when while").split(" ")
);

const TOKEN_RE = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(\$?"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])')|\b(\d+(?:\.\d+)?[fFdDmMlLuU]?)\b|\b([A-Za-z_]\w*)\b/g;

function highlight(code) {
  let out = "";
  let last = 0;
  let m;
  TOKEN_RE.lastIndex = 0;
  while ((m = TOKEN_RE.exec(code)) !== null) {
    out += esc(code.slice(last, m.index));            // texto sin colorear entre coincidencias
    const [token, comment, str, num, ident] = m;
    if (comment)      out += `<span class="tok-c">${esc(comment)}</span>`;
    else if (str)     out += `<span class="tok-s">${esc(str)}</span>`;
    else if (num)     out += `<span class="tok-n">${esc(num)}</span>`;
    else if (KEYWORDS.has(ident)) out += `<span class="tok-kw">${esc(ident)}</span>`;
    else {
      const next = code[m.index + token.length];       // carácter justo después del identificador
      if (next === "(")                          out += `<span class="tok-f">${esc(ident)}</span>`;  // llamada a método
      else if (next === "." && /^[A-Z]/.test(ident)) out += `<span class="tok-t">${esc(ident)}</span>`; // Console., Math., Array.
      else                                       out += esc(ident);
    }
    last = m.index + token.length;
  }
  return out + esc(code.slice(last));
}

/* ========================== 4. PLANTILLAS HTML ========================== */

function codeBlock(code, noRun) {
  return `
    <div class="code">
      <div class="code-bar"><span>C#</span><span class="code-actions">${noRun ? "" : '<button class="try" type="button" title="Abrir este código en el editor">▶ Probar</button>'}<button class="copy" type="button">Copiar</button></span></div>
      <pre><code>${highlight(code)}</code></pre>
    </div>`;
}

function videoHTML(video, title) {
  if (!video || !video.id) {
    return `
      <div class="video-placeholder">
        <div class="play" aria-hidden="true">▶</div>
        <strong>El vídeo de esta lección estará disponible pronto</strong>
        <small>Para añadirlo, sube el vídeo a Drive, copia su identificador y pégalo en
        <code>video: { provider: "drive", id: "..." }</code> dentro de <code>data/course.js</code>.</small>
      </div>`;
  }
  const id = encodeURIComponent(video.id);
  const src =
    video.provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${id}`
      : `https://drive.google.com/file/d/${id}/preview`;
  return `<iframe src="${src}" title="Vídeo: ${esc(title)}" allow="autoplay; fullscreen" allowfullscreen loading="lazy"></iframe>`;
}

function videoLink(video, lessonId) {
  if (!video || !video.id) return "";
  const id = encodeURIComponent(video.id);
  const url =
    video.provider === "youtube" ? `https://www.youtube.com/watch?v=${id}` : `https://drive.google.com/file/d/${id}/view`;
  return `<p class="video-tools">¿No se ve el vídeo? <a href="${url}" target="_blank" rel="noopener">Ábrelo en una pestaña nueva</a>.</p>`;
}

const LEVELS = {
  1: { cls: "l1", label: "★☆☆ Básico" },
  2: { cls: "l2", label: "★★☆ Intermedio" },
  3: { cls: "l3", label: "★★★ Reto" },
};

function activityHTML(act, index, lessonId) {
  const level = LEVELS[act.nivel] || LEVELS[1];
  const hint = act.pista
    ? `<details class="fold"><summary>💡 Pista</summary><div class="fold-body"><p>${esc(act.pista)}</p></div></details>`
    : "";
  const expected = act.salida
    ? `<p class="expected-label">Ejemplo de salida</p><pre class="salida">${esc(act.salida)}</pre>`
    : "";
  const variants = act.soluciones
    .map(
      (s) => `
        <div class="variant">
          <h4>${esc(s.titulo)}</h4>
          ${codeBlock(s.codigo)}
          ${s.nota ? `<p class="note">${esc(s.nota)}</p>` : ""}
        </div>`
    )
    .join("");
  const solutionLabel = act.soluciones.length > 1 ? `✅ Ver soluciones (${act.soluciones.length} enfoques)` : "✅ Ver solución";

  return `
    <article class="activity">
      <div class="activity-head">
        <span class="num">Actividad ${index + 1}</span>
        <h3>${esc(act.titulo)}</h3>
        <span class="level ${level.cls}">${level.label}</span>
      </div>
      <div class="statement">${act.enunciado}</div>
      ${expected}
      <p class="train-link"><a class="btn" href="#entrenamiento-${esc(lessonId)}.${index}">🎯 Resolverla en el editor</a></p>
      ${hint}
      <details class="fold solution"><summary>${solutionLabel}</summary><div class="fold-body">${variants}</div></details>
    </article>`;
}

function theoryHTML(lesson) {
  const exampleHTML = (e) => `
      <section class="example">
        <h3>${esc(e.titulo)}</h3>
        ${codeBlock(e.codigo, e.noRun)}
        ${e.explicacion ? `<p class="note">${esc(e.explicacion)}</p>` : ""}
      </section>`;
  const list = lesson.ejemplos || [];
  const used = new Set();
  // Los marcadores <!--ex:N--> de la teoría se sustituyen por el ejemplo N (así el código aparece donde se explica)
  const theory = (lesson.teoria || "").replace(/<!--ex:(\d+)-->/g, (m, n) => {
    const e = list[Number(n)];
    if (!e) return "";
    used.add(Number(n));
    return exampleHTML(e);
  });
  const rest = list.map((e, i) => (used.has(i) ? "" : exampleHTML(e))).join("");
  return `<div class="theory">${theory}</div>` + (rest ? `<h2 style="margin-top:1.6em">Ejemplos de código</h2>${rest}` : "");
}

/* ============== AUTOEVALUACIÓN (tests de opción múltiple) ============== */
/* Los tests viven en data/tests.js (TESTS[idLección] = [{ p, o:[…], c, e }]).
   p = pregunta · o = opciones · c = índice de la correcta (0, 1, 2…) · e = explicación (opcional).
   Las opciones se barajan en cada intento para que no se memorice la letra. */

function shuffled(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Test de una lección: sus preguntas. Si la lección es el «test global», se sacan al azar de todo el curso.
function questionsFor(lesson) {
  if (lesson.testAleatorio) {
    const all = Object.entries(TESTS).filter(([id]) => lessonById.has(id) && !lessonById.get(id).testAleatorio)
      .flatMap(([id, qs]) => qs.map((q) => ({ ...q, tema: lessonById.get(id).titulo })));
    return shuffled(all).slice(0, lesson.testAleatorio);
  }
  return (TESTS[lesson.id] || []).map((q) => ({ ...q }));
}

function quizHTML(lesson) {
  const qs = questionsFor(lesson);
  if (!qs.length) return '<p class="empty">Esta lección no tiene autoevaluación todavía.</p>';
  const prev = state.quiz && state.quiz[lesson.id];
  const best = prev ? `<p class="quiz-best">Tu mejor resultado: <strong>${prev.best} / ${prev.total}</strong></p>` : "";
  const items = qs.map((q, i) => {
    // Barajamos las opciones recordando cuál es la correcta
    const order = shuffled(q.o.map((_, k) => k));
    const opts = order.map((k) => `<button type="button" class="quiz-opt" data-ok="${k === q.c ? 1 : 0}">${esc(q.o[k])}</button>`).join("");
    return `<article class="quiz-q" data-i="${i}">
      <h3><span class="qn">${i + 1}</span> ${esc(q.p)}</h3>
      ${q.tema ? `<p class="quiz-topic">Tema: ${esc(q.tema)}</p>` : ""}
      <div class="quiz-opts">${opts}</div>
      <p class="quiz-fb" hidden></p>
      ${q.e ? `<p class="quiz-exp" hidden>💡 ${esc(q.e)}</p>` : ""}
    </article>`;
  }).join("");
  return `${best}
    <p class="quiz-intro">Elige una respuesta en cada pregunta: se corrige al momento. Puedes repetir el test cuantas veces quieras.</p>
    <div class="quiz" data-lesson="${esc(lesson.id)}" data-total="${qs.length}">
      ${items}
      <div class="quiz-score" hidden></div>
      <p><button type="button" class="btn quiz-retry">🔄 Repetir el test</button></p>
    </div>`;
}

function onQuizClick(btn) {
  const q = btn.closest(".quiz-q");
  if (!q || q.dataset.done) return;
  q.dataset.done = "1";
  const ok = btn.dataset.ok === "1";
  q.querySelectorAll(".quiz-opt").forEach((b) => {
    b.disabled = true;
    if (b.dataset.ok === "1") b.classList.add("right");
  });
  if (!ok) btn.classList.add("wrong");
  q.dataset.ok = ok ? "1" : "0";
  const fb = q.querySelector(".quiz-fb");
  fb.textContent = ok ? "✅ ¡Correcto!" : "❌ No es esa: la correcta está marcada en verde.";
  fb.className = "quiz-fb " + (ok ? "good" : "bad");
  fb.hidden = false;
  const exp = q.querySelector(".quiz-exp");
  if (exp) exp.hidden = false;

  const quiz = q.closest(".quiz");
  const answered = quiz.querySelectorAll(".quiz-q[data-done]").length;
  const total = Number(quiz.dataset.total);
  if (answered === total) {
    const score = quiz.querySelectorAll('.quiz-q[data-ok="1"]').length;
    const box = quiz.querySelector(".quiz-score");
    const pct = Math.round((score / total) * 100);
    box.innerHTML = `<strong>Resultado: ${score} / ${total}</strong> (${pct}%) — ${pct >= 80 ? "¡Excelente! 🎉" : pct >= 50 ? "Vas bien: repasa lo que has fallado 📚" : "Repasa la teoría y vuelve a intentarlo 💪"}`;
    box.hidden = false;
    state.quiz = state.quiz || {};
    const id = quiz.dataset.lesson;
    const prev = state.quiz[id];
    state.quiz[id] = { best: Math.max(score, prev ? prev.best : 0), total };
    saveState();
  }
}

/* ============================== 5. RENDER ============================== */

const isDone = (id) => !!state.done[id];

function updateProgress() {
  const total = lessons.length;
  const done = lessons.filter((l) => isDone(l.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  $("#progressLabel").textContent = `${done} / ${total} lecciones`;
  $("#progressFill").style.width = pct + "%";
  $("#progressBar").setAttribute("aria-valuenow", String(pct));
}

function renderSidebar() {
  // Recordamos qué módulos estaban abiertos para no cerrarlos al repintar (p. ej. al marcar un check)
  const wasOpen = new Map([...document.querySelectorAll("#modules details.module")].map((d) => [d.dataset.mod, d.open]));
  $("#modules").innerHTML = COURSE.modulos
    .map((modulo, i) => {
      const done = modulo.lecciones.filter((l) => isDone(l.id)).length;
      const containsActive = modulo.lecciones.some((l) => l.id === currentId);
      const items = modulo.lecciones
        .map(
          (l) => `
          <a class="lesson-link ${l.id === currentId ? "active" : ""} ${isDone(l.id) ? "done" : ""}"
             href="#leccion-${esc(l.id)}" ${l.id === currentId ? 'aria-current="page"' : ""}>
            <span class="tick" role="checkbox" tabindex="0" data-lesson="${esc(l.id)}" aria-checked="${isDone(l.id)}" aria-label="Marcar «${esc(l.titulo)}» como completada" title="${isDone(l.id) ? "Desmarcar como completada" : "Marcar como completada"}">✓</span>
            <span class="info"><span class="name">${esc(l.titulo)}</span><span class="meta">▶ ${esc(l.duracion || "")}</span></span>
          </a>`
        )
        .join("");
      // <details open> mantiene abierto el módulo de la lección actual (y el primero por defecto)
      const open = (wasOpen.has(String(i)) ? wasOpen.get(String(i)) : containsActive || (!currentId && i === 0)) || containsActive ? "open" : "";
      return `
        <details class="module" data-mod="${i}" ${open}>
          <summary>Módulo ${i + 1}: ${esc(modulo.titulo)}<span class="count">${done}/${modulo.lecciones.length}</span></summary>
          ${items}
        </details>`;
    })
    .join("");
}

// Marca o desmarca una lección y refresca todo lo que lo muestra (botón, índice, progreso)
// Plegar / desplegar el vídeo (para quien solo quiere leer la teoría). Se recuerda en el navegador.
function syncVideoFold() {
  const hidden = !!state.videoHidden;
  document.body.classList.toggle("video-collapsed", hidden);
  const b = $("#videoFold");
  if (b) {
    b.textContent = hidden ? "▼ Mostrar vídeo" : "▲ Ocultar vídeo";
    b.setAttribute("aria-expanded", String(!hidden));
    b.title = hidden ? "Mostrar el vídeo de la lección" : "Ocultar el vídeo y leer solo la teoría";
  }
}

function toggleDone(id) {
  if (isDone(id)) delete state.done[id]; else state.done[id] = true;
  saveState();
  const btn = $("#completeBtn");
  if (btn && id === currentId) setCompleteButton(btn, id);
  renderSidebar();
  updateProgress();
  if (typeof renderHome === "function" && !$("#home").hidden) renderHome();
}

function setCompleteButton(btn, id) {
  const done = isDone(id);
  btn.className = "btn " + (done ? "ok" : "");
  btn.textContent = done ? "✓ Completada" : "Marcar como completada";
  btn.setAttribute("aria-pressed", String(done));
}

function renderLesson(id, tab = "teoria") {
  const lesson = lessonById.get(id);
  if (!lesson) return;
  currentId = id;
  currentTab = tab;
  $("#home").hidden = true;
  Training.hide();
  document.body.classList.remove("view-home");
  state.last = id;
  saveState();

  const index = lessons.findIndex((l) => l.id === id);
  const prev = lessons[index - 1];
  const next = lessons[index + 1];
  const nActs = lesson.actividades.length;
  const nTest = lesson.testAleatorio || (TESTS[lesson.id] || []).length;
  const goals = lesson.objetivos && lesson.objetivos.length
    ? `<div class="goals"><h3>🎯 Lo que aprenderás</h3><ul>${lesson.objetivos.map((o) => `<li>${esc(o)}</li>`).join("")}</ul></div>`
    : "";

  $("#lesson").innerHTML = `
    <div class="lesson-media">
      <div class="crumbs"><span>${esc(lesson.modulo.titulo)} · Lección ${index + 1} de ${lessons.length}</span><button type="button" class="btn pg-reopen" id="pgReopen">&lt;/&gt; Editor</button></div>
      <div class="video-box">${videoHTML(lesson.video, lesson.titulo)}</div>
      ${videoLink(lesson.video, lesson.id)}
      <button type="button" class="media-fold" id="videoFold"></button>
    </div>

    <div class="lesson-head">
      <h1>${esc(lesson.titulo)}</h1>
      <button id="completeBtn" type="button"></button>
    </div>
    ${goals}

    <div class="tabs" role="tablist" aria-label="Contenido de la lección">
      <button class="tab" role="tab" id="tab-teoria" aria-controls="panel-teoria" data-tab="teoria" type="button">📖 Teoría</button>
      <button class="tab" role="tab" id="tab-actividades" aria-controls="panel-actividades" data-tab="actividades" type="button">🧩 Actividades<span class="badge">${nActs}</span></button>
      <button class="tab" role="tab" id="tab-test" aria-controls="panel-test" data-tab="test" type="button">✅ Autoevaluación<span class="badge">${nTest}</span></button>
    </div>
    <section class="panel" id="panel-teoria" role="tabpanel" aria-labelledby="tab-teoria">${theoryHTML(lesson)}</section>
    <section class="panel" id="panel-actividades" role="tabpanel" aria-labelledby="tab-actividades" hidden>
      ${nActs ? lesson.actividades.map((a, i) => activityHTML(a, i, lesson.id)).join("") : '<p class="empty">Esta lección no tiene actividades todavía.</p>'}
    </section>

    <section class="panel" id="panel-test" role="tabpanel" aria-labelledby="tab-test" hidden>${quizHTML(lesson)}</section>

    <nav class="lesson-nav" aria-label="Navegación entre lecciones">
      <a class="btn" ${prev ? `href="#leccion-${esc(prev.id)}"` : 'aria-disabled="true"'}>← ${prev ? esc(prev.titulo) : "Anterior"}</a>
      <a class="btn primary" ${next ? `href="#leccion-${esc(next.id)}"` : 'aria-disabled="true"'}>${next ? esc(next.titulo) : "Siguiente"} →</a>
    </nav>`;

  setCompleteButton($("#completeBtn"), id);
  syncVideoFold();
  selectTab(tab);
  renderSidebar();
  updateProgress();
  document.title = `${lesson.titulo} · ${COURSE.titulo}`;
  if (typeof Playground !== "undefined") Playground.sync(id);   // cuaderno de esta lección y panel abierto/cerrado
  window.scrollTo({ top: 0 });
  $("#content").scrollTop = 0;                                   // en escritorio la que se desplaza es la columna central
  document.body.classList.remove("menu-open");
  syncMenuButton();
}

function selectTab(tab) {
  currentTab = tab;
  document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", String(b.dataset.tab === tab)));
  document.querySelectorAll(".panel").forEach((p) => (p.hidden = p.id !== "panel-" + tab));
}

/* ======================== 6. EVENTOS Y RUTAS ======================== */

// --- Rutas con el hash de la URL: index.html#leccion-variables ---
// Ventaja: cada lección tiene un enlace que se puede compartir y el botón
// "atrás" del navegador funciona, sin necesitar un servidor.
function idFromHash() {
  const hash = location.hash.replace(/^#/, "");
  return hash.startsWith("leccion-") ? hash.slice("leccion-".length) : null;
}


/* ===================== PÁGINA DE INICIO DEL CURSO ===================== */
/* Todo se calcula a partir de COURSE: si añades lecciones, los totales
   (nº de lecciones, actividades y duración) se actualizan solos. */

const minutesOf = (lesson) => parseInt(lesson.duracion, 10) || 0;
const formatMinutes = (m) => (m >= 60 ? `${Math.floor(m / 60)} h${m % 60 ? " " + (m % 60) + " min" : ""}` : `${m} min`);
const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

function homeHTML() {
  const totalMin = lessons.reduce((s, l) => s + minutesOf(l), 0);
  const nActs = lessons.reduce((s, l) => s + l.actividades.length, 0);
  const doneCount = lessons.filter((l) => isDone(l.id)).length;
  const pct = Math.round((doneCount / lessons.length) * 100);
  const resume = lessonById.get(state.last) || lessons[0];
  const started = doneCount > 0 || lessonById.has(state.last);
  const p = COURSE.profesor || {};

  const syllabus = COURSE.modulos
    .map((m, i) => {
      const min = m.lecciones.reduce((s, l) => s + minutesOf(l), 0);
      const rows = m.lecciones
        .map(
          (l) => `
          <a class="syl-lesson ${isDone(l.id) ? "done" : ""}" href="#leccion-${esc(l.id)}">
            <span class="ico" aria-hidden="true">${isDone(l.id) ? "✓" : "▶"}</span>
            <span class="t">${esc(l.titulo)}</span>
            <span class="d">${esc(l.duracion || "")}</span>
          </a>`
        )
        .join("");
      return `
        <details class="syl-sec" ${i === 0 ? "open" : ""}>
          <summary><span class="n">Módulo ${i + 1}: ${esc(m.titulo)}</span><span class="c">${plural(m.lecciones.length, "clase", "clases")} • ${formatMinutes(min)}</span></summary>
          ${rows}
        </details>`;
    })
    .join("");

  return `
    <section class="hero">
      <div class="wrap hero-inner">
        <div class="hero-crumbs">Cursos <span aria-hidden="true">›</span> Programación <span aria-hidden="true">›</span> C#</div>
        <h1>${esc(COURSE.titulo)}</h1>
        <p class="sub">${esc(COURSE.subtitulo)}</p>
        <div class="hero-meta">
          <span class="badge-free">Gratis</span>
          <span>Creado por <button type="button" class="author-link" data-profile>${esc(COURSE.autor)}</button></span>
        </div>
        <div class="hero-meta">
          <span>🕒 Actualizado: ${esc(COURSE.actualizado || "")}</span>
          <span>🌐 ${esc(COURSE.idioma || "")}</span>
          <span>📶 Nivel: ${esc(COURSE.nivel || "")}</span>
        </div>
      </div>
    </section>

    <div class="wrap home-grid">
      <aside class="buy-card" aria-label="Resumen y acceso al curso">
        <a class="preview" href="#leccion-${esc(lessons[0].id)}" aria-label="Ver la primera lección">
          <span class="play" aria-hidden="true">▶</span>
          <span class="preview-label">Vista previa del curso</span>
        </a>
        <div class="buy-body">
          <div class="free">Gratis</div>
          ${started ? `<div class="mini-progress" aria-label="Progreso ${pct}%"><span style="width:${pct}%"></span></div><div class="mini-label">${doneCount} de ${lessons.length} lecciones completadas</div>` : ""}
          <a class="btn primary big" href="#leccion-${esc(resume.id)}">${started ? "Continuar: " + esc(resume.titulo) : "Empezar el curso"}</a>
          <h3>Este curso incluye:</h3>
          <ul class="includes">
            <li>🎬 ${formatMinutes(totalMin)} de vídeo bajo demanda</li>
            <li>🧩 ${plural(nActs, "actividad", "actividades")} con solución</li>
            <li>📖 Teoría y ejemplos de código comentados</li>
            <li>📱 Instalable como app en el móvil</li>
            <li>📴 Se puede consultar sin conexión</li>
            <li>✅ Progreso guardado en tu dispositivo</li>
          </ul>
        </div>
      </aside>

      <div class="home-main">
        <section class="learn">
          <h2>Lo que aprenderás</h2>
          <ul>${(COURSE.aprenderas || []).map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
        </section>

        <section class="syllabus">
          <h2>Contenido del curso</h2>
          <div class="syl-head">
            <span>${plural(COURSE.modulos.length, "módulo", "módulos")} • ${plural(lessons.length, "clase", "clases")} • ${formatMinutes(totalMin)} de duración total</span>
            <button type="button" class="link-btn expand-all">Expandir todas las secciones</button>
          </div>
          <div class="syl-list">${syllabus}</div>
        </section>

        ${COURSE.requisitos && COURSE.requisitos.length ? `<section class="block"><h2>Requisitos</h2><ul class="plain">${COURSE.requisitos.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></section>` : ""}

        ${COURSE.descripcion ? `<section class="block description"><h2>Descripción</h2>${COURSE.descripcion}</section>` : ""}

        ${p.nombre ? `
        <section class="block instructor">
          <h2>Profesor</h2>
          <div class="inst-card">
            <button type="button" class="inst-avatar" data-profile aria-label="Ver el perfil de ${esc(p.nombre)}" title="Pulsa para ver el perfil">${typeof MARIO_SVG !== "undefined" ? MARIO_SVG : esc(p.nombre.trim().charAt(0))}</button>
            <div>
              <button type="button" class="inst-name" data-profile>${esc(p.nombre)}</button>
              <div class="inst-role">${esc(p.rol || "")}</div>
              <p>${esc(p.bio || "")}</p>
            </div>
          </div>
        </section>` : ""}
      </div>
    </div>`;
}

function showHome() {
  currentId = null;
  Training.hide();
  $("#home").innerHTML = homeHTML();
  $("#home").hidden = false;
  document.body.classList.add("view-home");
  document.body.classList.remove("menu-open");
  document.title = COURSE.titulo;
  updateProgress();
  window.scrollTo({ top: 0 });
  syncMenuButton();
}

function route() {
  // Vistas de editor: #codificar[-lección] (vídeo + editor) y #entrenamiento[-lección.n] (actividades)
  const h = location.hash;
  if (/^#codificar(-|$)/.test(h)) {
    // «Codificar»: la lección con el panel de programación abierto a su lado
    const wanted = h.slice(11);
    const target = lessonById.has(wanted) ? wanted : lessonById.has(state.last) ? state.last : lessons[0].id;
    state.playOpen = true;
    saveState();
    history.replaceState(null, "", "#leccion-" + target);   // la URL queda como la de una lección normal
    renderLesson(target);
    return;
  }
  if (/^#entrenamiento(-|$)/.test(h)) { Training.show(h.slice(15)); return; }
  const id = idFromHash();
  if (id && lessonById.has(id)) renderLesson(id);
  else showHome();          // sin hash (#) o #inicio: página de presentación del curso
}

window.addEventListener("hashchange", route);

// --- Delegación de eventos: UN solo listener en el contenedor en lugar de uno por botón.
// Como el contenido se vuelve a generar al cambiar de lección, esto evita tener que
// volver a conectar los eventos cada vez.
document.addEventListener("keydown", (e) => {
  const t = e.target.closest && e.target.closest(".tick[data-lesson]");
  if (t && (e.key === " " || e.key === "Enter")) { e.preventDefault(); t.click(); setTimeout(() => { const n = document.querySelector(`.tick[data-lesson="${t.dataset.lesson}"]`); if (n) n.focus(); }); }
});

document.addEventListener("click", async (event) => {
  const tab = event.target.closest(".tab");
  if (tab) return selectTab(tab.dataset.tab);

  // Check de cada lección en el índice: marca/desmarca sin entrar en la lección
  const tick = event.target.closest(".tick[data-lesson]");
  if (tick) {
    event.preventDefault();                 // el check está dentro de un enlace: no navegar
    toggleDone(tick.dataset.lesson);
    return;
  }

  if (event.target.closest("#videoFold")) {
    state.videoHidden = !state.videoHidden;
    saveState();
    syncVideoFold();
    return;
  }

  const complete = event.target.closest("#completeBtn");
  if (complete) {
    toggleDone(currentId);
    return;
  }

  const expand = event.target.closest(".expand-all");
  if (expand) {
    const secs = document.querySelectorAll(".syl-sec");
    const openAll = [...secs].some((d) => !d.open);       // si alguna está cerrada → abrir todas; si no, cerrar
    secs.forEach((d) => (d.open = openAll));
    expand.textContent = openAll ? "Contraer todas las secciones" : "Expandir todas las secciones";
    return;
  }

  const opt = event.target.closest(".quiz-opt");
  if (opt) { onQuizClick(opt); return; }

  if (event.target.closest(".quiz-retry")) {
    const panel = $("#panel-test");
    if (panel) panel.innerHTML = quizHTML(lessonById.get(currentId));
    return;
  }

  const tryBtn = event.target.closest(".try");
  if (tryBtn) {
    // Lleva el código del bloque al editor del lateral (lo define js/playground.js)
    if (typeof Playground !== "undefined") Playground.load(tryBtn.closest(".code").querySelector("code").textContent);
    return;
  }

  const copy = event.target.closest(".copy");
  if (copy) {
    const text = copy.closest(".code").querySelector("code").textContent;
    const ok = await copyText(text);
    copy.textContent = ok ? "¡Copiado!" : "Selecciona y copia";
    setTimeout(() => (copy.textContent = "Copiar"), 1600);
  }
});

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);   // API moderna (necesita HTTPS: GitHub Pages lo es)
    return true;
  } catch {
    try {                                          // plan B para navegadores o contextos restringidos
      const area = document.createElement("textarea");
      area.value = text;
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      return ok;
    } catch {
      return false;
    }
  }
}

// --- Índice del curso: izquierda, y se puede ocultar ---
// Dos comportamientos con UN solo botón (☰):
//   · Escritorio (>900px): muestra/oculta la columna y recuerda la decisión (localStorage).
//   · Móvil: abre/cierra el panel superpuesto (clase menu-open).
const desktopQuery = matchMedia("(min-width: 901px)");

function syncMenuButton() {
  const btn = $("#menuBtn");
  const open = desktopQuery.matches ? !document.body.classList.contains("sidebar-collapsed") : document.body.classList.contains("menu-open");
  btn.setAttribute("aria-expanded", String(open));
  btn.setAttribute("aria-label", open ? "Ocultar índice del curso" : "Mostrar índice del curso");
  btn.title = btn.getAttribute("aria-label");
}

$("#sbHide").addEventListener("click", () => $("#menuBtn").click());
$("#stripIndex").addEventListener("click", () => $("#menuBtn").click());

// Ancho del índice ajustable arrastrando su borde derecho (se recuerda)
{
  const setSb = (px) => document.body.style.setProperty("--sidebar-w", Math.min(Math.max(px, 220), 560) + "px");
  if (state.sidebarW) setSb(state.sidebarW);
  const grip = $("#sbGrip");
  grip.addEventListener("pointerdown", (e) => {
    e.preventDefault();
    grip.setPointerCapture(e.pointerId);
    grip.classList.add("drag");
    const left = $("#sidebar").getBoundingClientRect().left;
    const move = (ev) => setSb(ev.clientX - left);
    const up = () => {
      grip.classList.remove("drag");
      grip.removeEventListener("pointermove", move);
      grip.removeEventListener("pointerup", up);
      state.sidebarW = parseInt(getComputedStyle(document.body).getPropertyValue("--sidebar-w"), 10) || 340;
      saveState();
    };
    grip.addEventListener("pointermove", move);
    grip.addEventListener("pointerup", up);
  });
}

$("#menuBtn").addEventListener("click", () => {
  if (desktopQuery.matches) {
    state.sidebarHidden = document.body.classList.toggle("sidebar-collapsed");
    saveState();
  } else {
    document.body.classList.toggle("menu-open");
  }
  syncMenuButton();
});
$("#backdrop").addEventListener("click", () => {
  document.body.classList.remove("menu-open");
  syncMenuButton();
});
function onViewportChange() {
  document.body.classList.remove("menu-open");
  syncMenuButton();
}
// Safari antiguo solo conoce addListener; el resto usa addEventListener
if (desktopQuery.addEventListener) desktopQuery.addEventListener("change", onViewportChange);
else if (desktopQuery.addListener) desktopQuery.addListener(onViewportChange);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.body.classList.remove("menu-open");
    syncMenuButton();
  }
});

// --- Tema claro/oscuro ---
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');   // color de la barra del navegador/app
  if (meta) meta.content = "#1c1d1f";   // la cabecera es oscura en ambos temas
  $("#themeBtn").textContent = theme === "dark" ? "☀️" : "🌙";
}
$("#themeBtn").addEventListener("click", () => {
  state.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  saveState();
  applyTheme(state.theme);
});

// --- Reiniciar progreso (sin confirm(): algunos entornos lo bloquean; usamos doble clic) ---
let resetTimer = null;
$("#resetBtn").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  if (!resetTimer) {
    btn.textContent = "¿Seguro? Pulsa otra vez para borrar";
    resetTimer = setTimeout(() => {
      btn.textContent = "Reiniciar mi progreso";
      resetTimer = null;
    }, 3500);
    return;
  }
  clearTimeout(resetTimer);
  resetTimer = null;
  state.done = {};
  saveState();
  btn.textContent = "Reiniciar mi progreso";
  renderLesson(currentId, currentTab);
});

// --- PWA: botón "Instalar app" ---
// Chrome/Edge/Android lanzan "beforeinstallprompt" cuando la web es instalable.
// Guardamos el evento y lo disparamos cuando el usuario pulsa nuestro botón.
// (Safari en iOS no lo soporta: allí se instala con Compartir → Añadir a pantalla de inicio.)
let installEvent = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  installEvent = e;
  $("#installBtn").hidden = false;
});
$("#installBtn").addEventListener("click", async () => {
  if (!installEvent) return;
  installEvent.prompt();
  await installEvent.userChoice;
  installEvent = null;
  $("#installBtn").hidden = true;
});
window.addEventListener("appinstalled", () => ($("#installBtn").hidden = true));

// --- PWA: service worker (funcionamiento sin conexión) ---
// Solo en http(s) (no con file://) y dentro de try/catch: si falla, la web sigue funcionando igual.
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}

// «</> Editor» (aparece en la lección cuando el panel está cerrado)
document.addEventListener("click", (e) => {
  if (e.target.closest(".pg-reopen") && typeof Playground !== "undefined") Playground.open();
});

/* ============================== ARRANQUE ============================== */
$("#brandTitle").textContent = COURSE.titulo;
$("#courseSub").textContent = COURSE.subtitulo;
applyTheme(state.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"));
document.body.classList.toggle("sidebar-collapsed", !!state.sidebarHidden);
route();
syncMenuButton();
